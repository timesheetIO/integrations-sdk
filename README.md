# @timesheet/integration-sdk

Type-only SDK and helper utilities for Timesheet sandboxed integration plugins.

The package ships TypeScript contracts (and a tiny `defineHandler` helper) that describe
the manifest a plugin publishes and the runtime context a plugin receives. Plugins are
executed in an isolated sandbox by the Timesheet plugin-runtime; this SDK is the typed
contract between the two.

## Install

```bash
npm install @timesheet/integration-sdk
```

While the SDK is on `0.x`, a caret range pins the minor version: `^0.3.0` admits `0.3.x`
but not `0.4.0`. Keep your plugin's declared range in sync with the SDK you build against.

## What's inside

- **Manifest contracts** — `IntegrationManifest` plus `TriggerDefinition`
  (`EventTrigger`, `WebhookTrigger`, `ScheduleTrigger`, `UserActionTrigger`),
  `ActionDefinition`, `PageDefinition`, `WidgetDefinition`, `MappingDefinition`,
  `ExternalAuthDefinition`, and the `JsonSchema` used for config schemas. A trigger
  names the action to run via `actionId`, which the backend resolves to the matching
  `actions[].handler`.
- **Runtime context** — `IntegrationContext`, exposing `config`, `data`
  (`TimesheetDataClient`), `credentials`, `mappings`, `state`, `logger`, and identifiers
  (`userId`, `installationId`, optional `organizationId`).
- **Event inputs** — typed payloads for the events plugins handle (`TaskCreatedInput`,
  `TaskUpdatedInput`, `WebhookInput`, `ScheduleInput`, `SyncModeInput`, and the rest of
  the task/todo/project/expense/note/timer/user event family).
- **`defineHandler`** — identity helper that infers the handler's input/output/config types.

## Usage

A handler receives a typed `input` and the `IntegrationContext`:

```typescript
import { defineHandler, TaskCreatedInput } from '@timesheet/integration-sdk';

export const syncTask = defineHandler<TaskCreatedInput>(async (input, context) => {
  const task = await context.data.getTask(input.taskId);
  context.logger.info('Syncing task', { taskId: task.id });
});
```

### Reading and writing Timesheet data

`context.data` (`TimesheetDataClient`) wraps the scoped Timesheet API — list/get/create/
update/delete for projects, tasks, todos, expenses, notes, pauses, plus timer control and
read access to teams, tags, colleagues, and settings. Three further scopes are read only:
`documents` (invoices), `absences` (absences and absence types) and `overtime` (overtime and
leave balances). Each scope must be declared in the manifest's `dataAccess`:

```typescript
import { defineHandler, SyncModeInput } from '@timesheet/integration-sdk';

export const fullSync = defineHandler<SyncModeInput>(async (_input, context) => {
  const projects = await context.data.listProjects({ limit: 100 });
  for (const project of projects.items) {
    context.logger.debug('project', { id: project.id, title: project.title });
  }
});
```

### Writing files for the user

`context.files.write` hands a generated file to the user as a download. Pass the final bytes
as base64 in the charset the target system expects; the transport stores them unchanged.
Return the written files from the handler and the web renders download links:

```typescript
export const buildExport = defineHandler(async (_input, context) => {
  const csv = 'Belegdatum;Umsatz\n0101;119,00\n';
  const file = await context.files.write({
    filename: 'EXTF_Buchungsstapel.csv',
    contentType: 'text/csv',
    content: btoa(csv) // ISO-8859-1 passes straight through btoa
  });
  return { files: [file], count: 1, warnings: [] };
});
```

Allowed content types are `text/csv`, `text/plain`, `application/xml` and
`application/octet-stream`; the decoded size is capped at 10 MB and the download URL is
short-lived. `TextEncoder` inside the runtime is UTF-8 only, so a Windows-1252 file needs a
small map for the `0x80` to `0x9F` range before `btoa`.

### Credentials, mappings, and state

- `context.credentials` — retrieve the connection credentials for the external service.
- `context.mappings` — persist and look up `MappingRecord`s linking Timesheet entities to
  external ones (e.g. a Timesheet project ↔ a Xero tracking category).
- `context.state` — durable per-installation key/value storage for cursors, sync tokens, etc.
- `context.metadata.webhooks` — map of `triggerId` → webhook URL when the manifest declares
  webhook triggers.

## Development

```bash
npm run build       # compile to dist/ via tsc
npm run typecheck   # tsc --noEmit
npm test            # jest
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
