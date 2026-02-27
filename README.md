# @timesheet/integration-sdk

Type-only SDK and helper utilities for Timesheet sandboxed integration plugins.

## Features

- Manifest contracts (`IntegrationManifest`, triggers, actions, pages)
- Runtime context contracts (`IntegrationContext`, data, credentials, mappings, state)
- Timesheet event input contracts
- `defineHandler` helper for type-safe plugin handler definitions

## Install

```bash
npm install @timesheet/integration-sdk
```

## Usage

```typescript
import { defineHandler, TaskCreatedInput } from '@timesheet/integration-sdk';

export const syncTask = defineHandler<TaskCreatedInput>(async (input, context) => {
  const task = await context.data.getTask(input.taskId);
  context.logger.info('Syncing task', { taskId: task.id });
});
```
