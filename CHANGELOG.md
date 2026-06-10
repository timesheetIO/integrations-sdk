# Changelog

All notable changes to `@timesheet/integration-sdk` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Note: while on `0.x`, a caret range pins the minor — `^0.3.0` admits `0.3.x` but not `0.4.0`.

## [0.4.1] - 2026-06-09

### Added
- `IntegrationContext.environment` (optional) — `'production' | 'sandbox'`. Set to `'sandbox'` on non-production plugin runtimes so plugins can target matching external sandbox endpoints (for example the QuickBooks sandbox API host). Defaults to `'production'` when unset.

## [0.4.0] - 2026-05-29

### Added
- `BaseTrigger.actionId` — the ID of the action whose `handler` runs when a trigger fires. The backend runtime resolves a trigger to `actions[].handler` through this field, so every trigger type may now declare it. Previously this field was used by all plugin manifests but absent from the type.
- `BaseTrigger.events` — event names a trigger listens for, now allowed on any trigger type (not just `event` triggers), matching how the backend dispatcher reads the manifest.

## [0.3.1] - 2026-05-29

### Added
- `IntegrationContext.organizationId` (optional) — present when the integration is installed for an organization.

### Changed
- `JsonSchema.type` is now optional and accepts `string | string[]` (was a required `string`), matching JSON Schema's union/typeless forms used in manifest config schemas.

## [0.3.0] - 2026-04-09

### Added
- `IntegrationContext.metadata.webhooks` — map of `triggerId` → webhook endpoint URL, resolved by the backend runtime and forwarded by plugin-runtime.

### Removed
- `TeamListParams.statistics` — stale parameter no longer accepted by the API.

## [0.2.0] - 2026-04-07

### Added
- Sync-mode contracts: `SyncModeInput`, `SyncChange`, and the `SyncChangeOp` (`'UPSERT' | 'DELETE'`) type, plus supporting manifest and context fields.

## [0.1.0] - 2026-02-27

### Added
- Initial release: type-only contracts and helpers for Timesheet sandboxed integration plugins.
- Manifest contracts (`IntegrationManifest`, triggers, actions, pages, widgets, mappings).
- Runtime context contracts (`IntegrationContext`, `TimesheetDataClient`, credentials, mappings, state, logger).
- Timesheet event input contracts (task, todo, project, expense, note, timer, user events).
- `defineHandler` helper for type-safe plugin handler definitions.
