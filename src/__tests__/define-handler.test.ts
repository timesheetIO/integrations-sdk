import { defineHandler, IntegrationContext, IntegrationManifest, TaskCreatedInput } from '../index';

const createContext = (): IntegrationContext<{ enabled: boolean }> => ({
  userId: 'user-1',
  installationId: 'inst-1',
  dataAccess: ['tasks'],
  config: { enabled: true },
  data: {
    listProjects: async () => ({ items: [], params: {} }),
    getProject: async () => ({
      id: 'p1',
      user: 'user-1',
      title: 'Project',
      archived: false,
      deleted: false,
      lastUpdate: 0,
      created: 0,
      duration: 0,
      durationBreak: 0,
      salaryTotal: '0',
      salaryBreak: '0',
      expenses: '0',
      expensesPaid: '0',
      mileage: '0'
    }),
    listTasks: async () => ({
      items: [],
      params: {},
      taskStatistic: {
        duration: 0,
        durationBreak: 0,
        salaryTotal: '0',
        salaryBreak: '0',
        expensesTotal: '0',
        expensesPaid: '0',
        mileage: '0'
      }
    }),
    getTask: async (id: string) => ({
      id,
      user: 'user-1',
      running: false,
      paid: false,
      billed: false,
      billable: true,
      duration: 10,
      durationBreak: 0,
      salaryTotal: '0',
      salaryBreak: '0',
      expensesTotal: '0',
      expensesPaid: '0',
      mileage: '0',
      deleted: false,
      lastUpdate: 0,
      created: 0,
      description: 'demo'
    }),
    createTask: async () => {
      throw new Error('not needed');
    },
    updateTask: async () => {
      throw new Error('not needed');
    },
    deleteTask: async () => {},
    listTodos: async () => ({
      items: [],
      params: {},
      todoStatistic: { open: 0, closed: 0 }
    }),
    getTodo: async () => {
      throw new Error('not needed');
    },
    createTodo: async () => {
      throw new Error('not needed');
    },
    updateTodo: async () => {
      throw new Error('not needed');
    },
    deleteTodo: async () => {},
    listExpenses: async () => ({ items: [], params: {} }),
    getExpense: async () => {
      throw new Error('not needed');
    },
    createExpense: async () => {
      throw new Error('not needed');
    },
    updateExpense: async () => {
      throw new Error('not needed');
    },
    deleteExpense: async () => {},
    listNotes: async () => ({ items: [], params: {} }),
    getNote: async () => {
      throw new Error('not needed');
    },
    createNote: async () => {
      throw new Error('not needed');
    },
    updateNote: async () => {
      throw new Error('not needed');
    },
    deleteNote: async () => {},
    listPauses: async () => ({ items: [], params: {} }),
    getPause: async () => {
      throw new Error('not needed');
    },
    getTimer: async () => {
      throw new Error('not needed');
    },
    startTimer: async () => {
      throw new Error('not needed');
    },
    stopTimer: async () => {
      throw new Error('not needed');
    },
    pauseTimer: async () => {
      throw new Error('not needed');
    },
    resumeTimer: async () => {
      throw new Error('not needed');
    },
    updateTimer: async () => {
      throw new Error('not needed');
    },
    getColleagues: async () => ({ items: [], params: {} }),
    listTeams: async () => ({ items: [], params: {} }),
    getTeam: async () => {
      throw new Error('not needed');
    },
    listTags: async () => ({ items: [], params: {} }),
    getTag: async () => {
      throw new Error('not needed');
    },
    getSettings: async () => ({ lastUpdate: 0 })
  },
  credentials: {
    getAccessToken: async () => 'token',
    getApiKey: async () => 'apikey',
    refreshToken: async () => 'refreshed',
    getConnectionInfo: async () => ({ connected: true, provider: 'demo' })
  },
  mappings: {
    get: async () => null,
    findByExternal: async () => null,
    list: async () => [],
    upsert: async () => {},
    delete: async () => {}
  },
  state: {
    get: async () => null,
    set: async () => {},
    delete: async () => {}
  },
  logger: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
  }
});

describe('defineHandler', () => {
  it('invokes handler with typed input and context', async () => {
    const handler = defineHandler<TaskCreatedInput, { localTaskId: string }>(async (input, context) => {
      const task = await context.data.getTask(input.taskId);
      return { localTaskId: task.id };
    });

    const output = await handler(
      {
        taskId: 'task-1',
        projectId: 'project-1',
        userId: 'user-1',
        date: '2026-02-20',
        duration: 30
      },
      createContext()
    );

    expect(output).toEqual({ localTaskId: 'task-1' });
  });
});

describe('manifest types', () => {
  it('supports manifest structures from the feature plan', () => {
    const manifest: IntegrationManifest = {
      id: 'clickup-sync',
      name: 'ClickUp Sync',
      version: '1.0.0',
      dataAccess: ['tasks', 'projects'],
      actions: [
        { id: 'sync-task-to-clickup', name: 'Sync task to ClickUp', handler: 'syncTaskToClickUp' },
        {
          id: 'create-clickup-entry',
          name: 'Create ClickUp time entry',
          handler: 'createClickUpEntry',
          inputSchema: {
            type: 'object',
            properties: {
              taskId: { type: 'string' },
              duration: { type: 'number' }
            },
            required: ['taskId', 'duration']
          }
        }
      ],
      triggers: [
        {
          id: 'task-created',
          type: 'event',
          name: 'Task Created',
          events: ['task.create'],
          configurable: true
        }
      ]
    };

    expect(manifest.actions).toHaveLength(2);
    expect(manifest.triggers?.[0].type).toBe('event');
  });
});
