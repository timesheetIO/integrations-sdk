import type { StateClient } from './context';

/**
 * Echo-suppression helpers for bidirectional sync plugins.
 *
 * The problem: a plugin's own inbound write (createTask/updateTask) fires a
 * task.create/task.update event, whose outbound leg would write the change
 * straight back to the external system. That write bumps the external
 * `updated` timestamp, which the next inbound pass sees as "newer than the
 * local task", updates the task again, and the cycle never converges.
 *
 * Two guards terminate the loop:
 *
 * 1. Outbound ({@link isAlreadySyncedLocalChange}): every inbound write stamps
 *    the resulting local `lastUpdate` into the mapping metadata as
 *    `timesheetUpdatedAt`. A local change that is not newer than the stamp is
 *    the echo of our own write and must be skipped (canonical skip reason:
 *    `already-synced-task-change`).
 * 2. Inbound ({@link isStaleExternalChange}): every outbound/inbound write
 *    records the external `updated` timestamp in the mapping metadata. An
 *    external change that is not newer than the recorded timestamp (or the
 *    local entity's own `lastUpdate`) has already been applied and must be
 *    skipped.
 *
 * {@link syncMetadataStamp} builds the canonical metadata fragment both guards
 * read. State-based `ifAbsent` locks ({@link tryAcquireStateLock}) close the
 * remaining race: a webhook-driven import racing a scheduled/manual full sync
 * creating the same local entity twice.
 */

/** Canonical metadata key holding the local lastUpdate stamped at sync time. */
export const METADATA_LOCAL_UPDATED_KEY = 'timesheetUpdatedAt';
/** Default metadata key holding the external updated timestamp. */
export const METADATA_EXTERNAL_UPDATED_KEY = 'updated';

/** Millis from a local entity's `lastUpdate`, tolerating string values. 0 when absent/invalid. */
export function getLastUpdateMillis(entity?: { lastUpdate?: number | string } | null): number {
  const value = entity?.lastUpdate;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    const date = Date.parse(value);
    return Number.isFinite(date) ? date : 0;
  }
  return 0;
}

export function readMetadataNumber(metadata: Record<string, unknown> | null | undefined, key: string): number {
  const value = metadata?.[key];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function readMetadataString(metadata: Record<string, unknown> | null | undefined, key: string): string | undefined {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

/**
 * Outbound echo guard: true when a local change is not newer than the
 * `timesheetUpdatedAt` stamp recorded by this plugin's own last write, i.e.
 * the change event is the echo of that write. Callers skip the outbound sync
 * with reason `already-synced-task-change`.
 */
export function isAlreadySyncedLocalChange(
  metadata: Record<string, unknown> | null | undefined,
  localLastUpdateMillis: number
): boolean {
  const stampedAt = readMetadataNumber(metadata, METADATA_LOCAL_UPDATED_KEY);
  return stampedAt > 0 && localLastUpdateMillis > 0 && localLastUpdateMillis <= stampedAt;
}

/**
 * Inbound echo guard: true when the external change is not newer than the
 * external `updated` timestamp recorded in the mapping metadata and/or the
 * local entity's `lastUpdate`. Absent inputs never veto: each comparison only
 * applies when both sides are present and parseable.
 */
export function isStaleExternalChange(input: {
  metadata?: Record<string, unknown> | null;
  /** Metadata key holding the recorded external timestamp. Defaults to `updated`. */
  metadataKey?: string;
  /** External updated timestamp: ISO 8601 / RFC 3339 string or millis. */
  externalUpdatedAt: string | number | null | undefined;
  /** Local entity `lastUpdate` millis (see {@link getLastUpdateMillis}). */
  localLastUpdateMillis?: number;
}): boolean {
  const externalMs = toMillis(input.externalUpdatedAt);
  if (externalMs <= 0) {
    return false;
  }

  const recorded = input.metadata?.[input.metadataKey ?? METADATA_EXTERNAL_UPDATED_KEY];
  const recordedMs = toMillis(typeof recorded === 'string' || typeof recorded === 'number' ? recorded : null);
  if (recordedMs > 0 && externalMs <= recordedMs) {
    return true;
  }

  const localMs = input.localLastUpdateMillis ?? 0;
  return localMs > 0 && externalMs <= localMs;
}

/**
 * Canonical metadata fragment recording what was just synced; spread into the
 * mapping metadata on every upsert so the two guards can read it back.
 */
export function syncMetadataStamp(input: {
  /** Local entity `lastUpdate` millis at write time (falls back to now when 0/absent). */
  localLastUpdateMillis?: number;
  /** External updated timestamp as reported by the external system. */
  externalUpdatedAt?: string | number | null;
  /** Metadata key for the external timestamp. Defaults to `updated`. */
  externalUpdatedKey?: string;
}): Record<string, string> {
  const stamp: Record<string, string> = {};
  const localMs = input.localLastUpdateMillis && Number.isFinite(input.localLastUpdateMillis)
    ? Math.floor(input.localLastUpdateMillis)
    : 0;
  stamp[METADATA_LOCAL_UPDATED_KEY] = String(localMs > 0 ? localMs : Date.now());
  if (input.externalUpdatedAt !== undefined && input.externalUpdatedAt !== null && input.externalUpdatedAt !== '') {
    stamp[input.externalUpdatedKey ?? METADATA_EXTERNAL_UPDATED_KEY] = String(input.externalUpdatedAt);
  }
  return stamp;
}

/** True for the state-store conflict raised when an `ifAbsent` set loses the race. */
export function isStateConflictError(err: unknown): boolean {
  const message = String(err);
  return message.includes('Timesheet API request failed (409)')
    || message.includes('StateConflict')
    || message.includes('State key already exists');
}

/**
 * Acquire a TTL-bounded `ifAbsent` state lock. Returns false when another
 * execution holds the lock; rethrows anything that is not the conflict error.
 */
export async function tryAcquireStateLock(state: StateClient, key: string, ttlSeconds: number): Promise<boolean> {
  try {
    await state.set(key, Date.now(), { ttlSeconds, ifAbsent: true });
    return true;
  } catch (err) {
    if (isStateConflictError(err)) {
      return false;
    }
    throw err;
  }
}

/** Best-effort lock release; swallow errors so cleanup never masks the original failure. */
export async function releaseStateLock(state: StateClient, key: string): Promise<void> {
  try {
    await state.delete(key);
  } catch {
    // Lock expires via TTL.
  }
}

function toMillis(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : 0;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric > 0 ? numeric : 0;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }
  return 0;
}
