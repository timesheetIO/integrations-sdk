import {
  getLastUpdateMillis,
  isAlreadySyncedLocalChange,
  isStaleExternalChange,
  isStateConflictError,
  releaseStateLock,
  syncMetadataStamp,
  tryAcquireStateLock
} from '../syncGuards';
import type { StateClient } from '../context';

describe('syncGuards', () => {
  describe('getLastUpdateMillis', () => {
    it('reads numeric and stringified lastUpdate values', () => {
      expect(getLastUpdateMillis({ lastUpdate: 1500 })).toBe(1500);
      expect(getLastUpdateMillis({ lastUpdate: '1500' })).toBe(1500);
      expect(getLastUpdateMillis({ lastUpdate: 'nope' })).toBe(0);
      expect(getLastUpdateMillis(null)).toBe(0);
    });
  });

  describe('isAlreadySyncedLocalChange (outbound echo guard)', () => {
    it('skips local changes at or below the stamped timesheetUpdatedAt', () => {
      expect(isAlreadySyncedLocalChange({ timesheetUpdatedAt: '2000' }, 2000)).toBe(true);
      expect(isAlreadySyncedLocalChange({ timesheetUpdatedAt: '2000' }, 1500)).toBe(true);
    });

    it('lets newer local changes through', () => {
      expect(isAlreadySyncedLocalChange({ timesheetUpdatedAt: '2000' }, 2001)).toBe(false);
    });

    it('never vetoes without a stamp or without a local timestamp', () => {
      expect(isAlreadySyncedLocalChange({}, 2000)).toBe(false);
      expect(isAlreadySyncedLocalChange(undefined, 2000)).toBe(false);
      expect(isAlreadySyncedLocalChange({ timesheetUpdatedAt: '2000' }, 0)).toBe(false);
    });
  });

  describe('isStaleExternalChange (inbound echo guard)', () => {
    it('skips external changes at or below the recorded metadata timestamp', () => {
      expect(isStaleExternalChange({
        metadata: { updated: '2026-02-20T11:10:00Z' },
        externalUpdatedAt: '2026-02-20T11:10:00Z'
      })).toBe(true);
      expect(isStaleExternalChange({
        metadata: { updated: '2026-02-20T11:10:00Z' },
        externalUpdatedAt: '2026-02-20T11:09:00Z'
      })).toBe(true);
    });

    it('lets newer external changes through', () => {
      expect(isStaleExternalChange({
        metadata: { updated: '2026-02-20T11:10:00Z' },
        externalUpdatedAt: '2026-02-20T11:11:00Z'
      })).toBe(false);
    });

    it('supports custom metadata keys and millis-valued timestamps', () => {
      expect(isStaleExternalChange({
        metadata: { updatedAt: String(Date.parse('2026-02-20T11:10:00Z')) },
        metadataKey: 'updatedAt',
        externalUpdatedAt: Date.parse('2026-02-20T11:10:00Z')
      })).toBe(true);
    });

    it('falls back to the local lastUpdate comparison', () => {
      expect(isStaleExternalChange({
        externalUpdatedAt: '2026-02-20T11:10:00Z',
        localLastUpdateMillis: Date.parse('2026-02-20T11:10:00Z')
      })).toBe(true);
      expect(isStaleExternalChange({
        externalUpdatedAt: '2026-02-20T11:10:00Z',
        localLastUpdateMillis: Date.parse('2026-02-20T11:09:00Z')
      })).toBe(false);
    });

    it('never vetoes when the external timestamp is missing or unparseable', () => {
      expect(isStaleExternalChange({
        metadata: { updated: '2026-02-20T11:10:00Z' },
        externalUpdatedAt: null,
        localLastUpdateMillis: 999999999999999
      })).toBe(false);
      expect(isStaleExternalChange({ externalUpdatedAt: 'garbage' })).toBe(false);
    });
  });

  describe('syncMetadataStamp', () => {
    it('stamps the local update time and the external timestamp', () => {
      const stamp = syncMetadataStamp({
        localLastUpdateMillis: 1234,
        externalUpdatedAt: '2026-02-20T11:10:00Z'
      });
      expect(stamp).toEqual({ timesheetUpdatedAt: '1234', updated: '2026-02-20T11:10:00Z' });
    });

    it('supports a custom external key and omits absent external timestamps', () => {
      const stamp = syncMetadataStamp({
        localLastUpdateMillis: 1234,
        externalUpdatedAt: '2026-02-20T11:10:00Z',
        externalUpdatedKey: 'updatedAt'
      });
      expect(stamp).toEqual({ timesheetUpdatedAt: '1234', updatedAt: '2026-02-20T11:10:00Z' });
      expect(syncMetadataStamp({ localLastUpdateMillis: 1234 })).toEqual({ timesheetUpdatedAt: '1234' });
    });

    it('falls back to now when the local timestamp is absent', () => {
      const before = Date.now();
      const stamp = syncMetadataStamp({});
      expect(Number(stamp.timesheetUpdatedAt)).toBeGreaterThanOrEqual(before);
    });
  });

  describe('state locks', () => {
    const makeState = (setImpl?: () => Promise<void>): StateClient => ({
      get: jest.fn(),
      set: (setImpl ?? jest.fn().mockResolvedValue(undefined)) as StateClient['set'],
      delete: jest.fn().mockResolvedValue(undefined)
    });

    it('acquires the lock with ifAbsent + ttl', async () => {
      const state = makeState();
      await expect(tryAcquireStateLock(state, 'lock:key', 60)).resolves.toBe(true);
      expect(state.set).toHaveBeenCalledWith('lock:key', expect.any(Number), { ttlSeconds: 60, ifAbsent: true });
    });

    it('returns false when the lock is held', async () => {
      const state = makeState(() => Promise.reject(new Error('Timesheet API request failed (409): conflict')));
      await expect(tryAcquireStateLock(state, 'lock:key', 60)).resolves.toBe(false);
    });

    it('rethrows non-conflict errors', async () => {
      const state = makeState(() => Promise.reject(new Error('network down')));
      await expect(tryAcquireStateLock(state, 'lock:key', 60)).rejects.toThrow('network down');
    });

    it('releases best-effort without throwing', async () => {
      const state = makeState();
      (state.delete as jest.Mock).mockRejectedValue(new Error('boom'));
      await expect(releaseStateLock(state, 'lock:key')).resolves.toBeUndefined();
    });
  });

  describe('isStateConflictError', () => {
    it('matches the runtime conflict signatures only', () => {
      expect(isStateConflictError(new Error('Timesheet API request failed (409): x'))).toBe(true);
      expect(isStateConflictError(new Error('StateConflict'))).toBe(true);
      expect(isStateConflictError(new Error('State key already exists'))).toBe(true);
      expect(isStateConflictError(new Error('anything else'))).toBe(false);
    });
  });
});
