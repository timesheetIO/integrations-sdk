export interface TaskCreatedInput {
  taskId: string;
  projectId: string;
  userId: string;
  date: string;
  duration: number;
  description?: string;
}

export interface TaskUpdatedInput {
  taskId: string;
  projectId: string;
  userId: string;
  changes: string[];
}

export interface TaskDeletedInput {
  taskId: string;
  projectId: string;
}

export interface ProjectCreatedInput {
  projectId: string;
  name: string;
}

export interface ProjectUpdatedInput {
  projectId: string;
  changes: string[];
}

export interface ProjectDeletedInput {
  projectId: string;
}

export interface ToDoCreatedInput {
  todoId: string;
  projectId: string;
  name: string;
}

export interface ToDoUpdatedInput {
  todoId: string;
  projectId: string;
  changes: string[];
}

export interface ToDoDeletedInput {
  todoId: string;
  projectId: string;
}

export interface ExpenseCreatedInput {
  expenseId: string;
  taskId: string;
  amount: string;
}

export interface ExpenseUpdatedInput {
  expenseId: string;
  taskId: string;
  changes: string[];
}

export interface ExpenseDeletedInput {
  expenseId: string;
  taskId: string;
}

export interface NoteCreatedInput {
  noteId: string;
  taskId: string;
}

export interface NoteUpdatedInput {
  noteId: string;
  taskId: string;
  changes: string[];
}

export interface NoteDeletedInput {
  noteId: string;
  taskId: string;
}

export interface UserAddedInput {
  userId: string;
  projectId?: string;
  teamId?: string;
}

export interface UserRemovedInput {
  userId: string;
  projectId?: string;
  teamId?: string;
}

export interface TimerStartedInput {
  userId: string;
  projectId: string;
  taskId: string;
}

export interface TimerStoppedInput {
  userId: string;
  taskId: string;
  duration: number;
}

export interface TimerPausedInput {
  userId: string;
  taskId: string;
}

export interface TimerResumedInput {
  userId: string;
  taskId: string;
}

export interface WebhookInput {
  method: string;
  headers: Record<string, string>;
  body: unknown;
  query: Record<string, string>;
}

export interface ScheduleInput {
  scheduledTime: string;
  lastRunTime?: string;
}

export interface ReportGeneratedInput {
  reportId: string;
  reportType: string;
  userId: string;
  format: string;
}

export interface TimesheetEventMap {
  'task.create': TaskCreatedInput;
  'task.update': TaskUpdatedInput;
  'task.delete': TaskDeletedInput;
  'project.create': ProjectCreatedInput;
  'project.update': ProjectUpdatedInput;
  'project.delete': ProjectDeletedInput;
  'todo.create': ToDoCreatedInput;
  'todo.update': ToDoUpdatedInput;
  'todo.delete': ToDoDeletedInput;
  'expense.create': ExpenseCreatedInput;
  'expense.update': ExpenseUpdatedInput;
  'expense.delete': ExpenseDeletedInput;
  'note.create': NoteCreatedInput;
  'note.update': NoteUpdatedInput;
  'note.delete': NoteDeletedInput;
  'user.add': UserAddedInput;
  'user.remove': UserRemovedInput;
  'timer.start': TimerStartedInput;
  'timer.stop': TimerStoppedInput;
  'timer.pause': TimerPausedInput;
  'timer.resume': TimerResumedInput;
  'report.generate': ReportGeneratedInput;
}

export type TimesheetEventName = keyof TimesheetEventMap;
