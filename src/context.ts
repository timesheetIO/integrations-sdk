import type {
  IntegrationDataAccess,
  JsonSchema,
  JsonValue
} from './manifest';

export interface ListParams {
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  count?: number;
  page?: number;
  limit?: number;
}

export interface ProjectListParams extends ListParams {
  teamId?: string;
  status?: string;
  teamIds?: string[];
  projectIds?: string[];
  taskStartDate?: string;
  taskEndDate?: string;
}

export interface TaskListParams extends ListParams {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  teamId?: string;
  todoId?: string;
  rateId?: string;
  projectIds?: string[];
  tagIds?: string[];
  taskIds?: string[];
  userIds?: string[];
  type?: 'all' | 'task' | 'mileage' | 'call';
  filter?: 'all' | 'billable' | 'notBillable' | 'paid' | 'unpaid' | 'billed' | 'outstanding';
  populatePauses?: boolean;
  populateExpenses?: boolean;
  populateNotes?: boolean;
  populateTags?: boolean;
}

export interface ToDoListParams extends ListParams {
  projectId?: string;
  status?: string;
  assignedUsers?: string;
  projectIds?: string[];
}

export interface TeamMemberListParams extends ListParams {
  organizationId?: string;
  status?: string;
  teamId?: string;
  projectId?: string;
  withoutMe?: boolean;
  withoutProjectMembers?: boolean;
  lastActivity?: boolean;
  deleted?: boolean;
  userIds?: string[];
  withoutUserIds?: string[];
}

export interface ExpenseListParams extends ListParams {
  startDate?: string;
  endDate?: string;
  taskId?: string;
  documentId?: string;
  filter?: 'paid' | 'unpaid';
  projectIds?: string[];
  taskIds?: string[];
}

export interface NoteListParams extends ListParams {
  startDate?: string;
  endDate?: string;
  taskId?: string;
  documentId?: string;
  taskIds?: string[];
}

export interface PauseListParams extends ListParams {
  taskId?: string;
}

export interface TeamListParams extends ListParams {
  organizationId?: string;
}

export interface TaskStatistic {
  duration: number;
  durationBreak: number;
  salaryTotal: string;
  salaryBreak: string;
  expensesTotal: string;
  expensesPaid: string;
  mileage: string;
}

export interface ToDoStatistic {
  open: number;
  closed: number;
}

export interface ProjectPermissionDto {
  role: 'MEMBER' | 'MANAGER' | 'OWNER' | string;
}

export interface TeamPermissionDto {
  role: 'MEMBER' | 'MANAGER' | 'OWNER' | string;
}

export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  user: string;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  color?: number;
  projects?: number;
  members?: number;
  permission?: TeamPermissionDto;
}

export interface ProjectDto {
  id: string;
  user: string;
  title: string;
  description?: string;
  employer?: string;
  archived: boolean;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  team?: TeamDto;
  permission?: ProjectPermissionDto;
  duration: number;
  durationBreak: number;
  salaryTotal: string;
  salaryBreak: string;
  expenses: string;
  expensesPaid: string;
  mileage: string;
}

export interface TagDto {
  id: string;
  user: string;
  name: string;
  archived: boolean;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  color?: number;
  team?: TeamDto;
}

export interface Member {
  uid: string;
  email: string;
  deleted: boolean;
  displayName: string;
  initials: string;
  firstname?: string;
  lastname?: string;
  employeeId?: string;
  imageUrl?: string;
}

export interface ToDoDto {
  id: string;
  user: string;
  name: string;
  status: number;
  estimatedHours: number;
  estimatedMinutes: number;
  duration: number;
  durationBreak: number;
  salaryTotal: string;
  salaryBreak: string;
  expenses: string;
  expensesPaid: string;
  mileage: string;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  description?: string;
  dueDate?: string;
  assignedUsers?: string;
  project?: ProjectDto;
}

export interface RateDto {
  id: string;
  user: string;
  title: string;
  factor: string;
  extra: string;
  enabled: boolean;
  archived: boolean;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  team?: TeamDto;
}

export interface ExpenseDto {
  id: string;
  user: string;
  amount: string;
  refunded: boolean;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  description?: string;
  dateTime?: string;
  fileUri?: string;
  fileName?: string;
  invoiceId?: string;
  task?: TaskDto;
  member?: Member;
}

export interface NoteDto {
  id: string;
  user: string;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  text?: string;
  dateTime?: string;
  uri?: string;
  driveId?: string;
  task?: TaskDto;
  member?: Member;
}

export interface PauseDto {
  id: string;
  user: string;
  running: boolean;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  task?: TaskDto;
  member?: Member;
}

export interface TaskDto {
  id: string;
  user: string;
  running: boolean;
  paid: boolean;
  billed: boolean;
  billable: boolean;
  duration: number;
  durationBreak: number;
  salaryTotal: string;
  salaryBreak: string;
  expensesTotal: string;
  expensesPaid: string;
  mileage: string;
  deleted: boolean;
  lastUpdate: number;
  created: number;
  description?: string;
  location?: string;
  locationEnd?: string;
  startDateTime?: string;
  endDateTime?: string;
  feeling?: number;
  typeId?: number;
  invoiceId?: string;
  distance?: string;
  project?: ProjectDto;
  todo?: ToDoDto;
  rate?: RateDto;
  member?: Member;
  tags?: TagDto[];
  pauses?: PauseDto[];
  expenses?: ExpenseDto[];
  notes?: NoteDto[];
}

export interface TimerDto {
  id: string;
  status: 'stopped' | 'running' | 'paused';
  user: string;
  lastUpdate: number;
  created: number;
  task?: TaskDto;
  pause?: PauseDto;
}

export interface SettingsDto {
  lastUpdate: number;
  theme?: string;
  language?: string;
  timezone?: string;
  currency?: string;
  distance?: string;
  dateFormat?: string;
  timeFormat?: string;
  durationFormat?: string;
  slotDuration?: number;
  snapDuration?: number;
  defaultTaskDuration?: number;
  defaultBreakDuration?: number;
  timerRounding?: number;
  timerRoundingType?: number;
  firstDay?: number;
  entriesPerPage?: number;
}

export interface ProjectList {
  items: ProjectDto[];
  params: ProjectListParams;
}

export interface TaskList {
  items: TaskDto[];
  params: TaskListParams;
  taskStatistic: TaskStatistic;
}

export interface ToDoList {
  items: ToDoDto[];
  params: ToDoListParams;
  todoStatistic: ToDoStatistic;
}

export interface ColleagueList {
  items: Member[];
  params: TeamMemberListParams;
}

export interface ExpenseList {
  items: ExpenseDto[];
  params: ExpenseListParams;
}

export interface NoteList {
  items: NoteDto[];
  params: NoteListParams;
}

export interface PauseList {
  items: PauseDto[];
  params: PauseListParams;
}

export interface TeamList {
  items: TeamDto[];
  params: TeamListParams;
}

export interface TagList {
  items: TagDto[];
  params: ListParams;
}

export interface TaskCreateInput {
  projectId: string;
  startDateTime: string;
  endDateTime: string;
  description?: string;
  location?: string;
  locationEnd?: string;
  feeling?: number;
  typeId?: number;
  paid?: boolean;
  billed?: boolean;
  billable?: boolean;
  phoneNumber?: string;
  distance?: number;
  rateId?: string;
  todoId?: string;
  signature?: string;
  userId?: string;
  tagIds?: string[];
}

export interface TaskUpdateInput {
  projectId?: string;
  startDateTime?: string;
  endDateTime?: string;
  description?: string;
  location?: string;
  locationEnd?: string;
  feeling?: number;
  typeId?: number;
  paid?: boolean;
  billed?: boolean;
  billable?: boolean;
  phoneNumber?: string;
  distance?: number;
  rateId?: string;
  todoId?: string;
  signature?: string;
  tagIds?: string[];
}

export interface ToDoCreateInput {
  projectId: string;
  name: string;
  description?: string;
  status?: number;
  dueDate?: string;
  assignedUsers?: string;
  estimatedHours?: number;
  estimatedMinutes?: number;
}

export interface ToDoUpdateInput {
  name?: string;
  description?: string;
  status?: number;
  dueDate?: string;
  assignedUsers?: string;
  estimatedHours?: number;
  estimatedMinutes?: number;
}

export interface ExpenseCreateInput {
  taskId: string;
  amount: string;
  description?: string;
  dateTime?: string;
  refunded?: boolean;
  fileUri?: string;
  fileName?: string;
}

export interface ExpenseUpdateInput {
  amount?: string;
  description?: string;
  dateTime?: string;
  refunded?: boolean;
  fileUri?: string;
  fileName?: string;
}

export interface NoteCreateInput {
  taskId: string;
  text: string;
  dateTime?: string;
  uri?: string;
  driveId?: string;
}

export interface NoteUpdateInput {
  text?: string;
  dateTime?: string;
  uri?: string;
  driveId?: string;
}

export interface TimerStartInput {
  projectId: string;
  startDateTime: string;
}

export interface TimerStopInput {
  endDateTime: string;
}

export interface TimerPauseInput {
  startDateTime: string;
}

export interface TimerResumeInput {
  endDateTime: string;
}

export interface TimerUpdateInput {
  startDateTime?: string;
  description?: string;
  location?: string;
  locationEnd?: string;
  feeling?: number;
  typeId?: number;
  paid?: boolean;
  billed?: boolean;
  billable?: boolean;
  phoneNumber?: string;
  distance?: number;
}

export interface CredentialConnectionInfo {
  connected: boolean;
  provider: string;
  accountName?: string;
  accountId?: string;
  expiresAt?: string;
}

export interface MappingRecord {
  localId: string;
  externalId: string;
  externalLabel?: string;
  metadata?: Record<string, JsonValue>;
  syncStatus: 'SYNCED' | 'PENDING' | 'ERROR' | 'STALE';
  lastSyncedAt?: string;
}

// ---------------------------------------------------------------------------
// Accounting and payroll data (read only): documents, absences, overtime
// ---------------------------------------------------------------------------

export interface DocumentListParams extends ListParams {
  organizationId?: string;
  organizationUnassigned?: boolean;
  /** 0 = invoice, 1 = timesheet, 2 = work record. */
  category?: number;
  status?: string;
  template?: boolean;
  /** Inclusive lower bound on the document date (yyyy-MM-dd). */
  startDate?: string;
  /** Inclusive upper bound on the document date (yyyy-MM-dd). */
  endDate?: string;
}

/**
 * Invoice view exposed to plugins. Presentation flags, template fields and QR code
 * settings are intentionally left out; the export needs identity, dates, party data,
 * the tax breakdown and totals. Monetary values are decimal strings.
 */
export interface DocumentDto {
  id: string;
  user?: string;
  organizationId?: string;
  /** 0 = invoice, 1 = timesheet, 2 = work record. Credit notes are invoices with `eInvoiceDocumentType` = CREDIT_NOTE. */
  category: number;
  status?: number;
  name?: string;
  date: string;
  deliveryDate?: string;
  dueDate?: string;
  invoiceId?: string;
  invoiceSeriesId?: string;
  paid?: boolean;
  fullyPaid?: boolean;
  partiallyPaid?: boolean;
  payment?: string;
  paymentDate?: string;
  paymentMethod?: string;
  paymentTermDays?: number;
  cashDiscountRate?: string;
  cashDiscountDays?: number;
  company?: string;
  companyVatId?: string;
  companyTaxNumber?: string;
  companyRegistrationNumber?: string;
  customer?: string;
  customerId?: string;
  customerVatId?: string;
  customerTaxNumber?: string;
  customerOrderNumber?: string;
  customerAddressLine1?: string;
  customerAddressLine2?: string;
  customerAddressLine3?: string;
  customerAddressLine4?: string;
  eInvoiceType?: string;
  eInvoiceDocumentType?: string;
  invoiceTypeCode?: string;
  eInvoiceCurrency?: string;
  subtotal?: string;
  taskSubtotal?: string;
  expenseSubtotal?: string;
  tax?: string;
  taxValue?: string;
  taxSecond?: string;
  taxSecondValue?: string;
  showSecondTax?: boolean;
  discount?: string;
  discountValue?: string;
  discountSecondValue?: string;
  total?: string;
  isReverseCharge?: boolean;
  reverseChargeRate?: string;
  taxExemptionReason?: string;
  costCenter?: string;
  projectReference?: string;
  orderReference?: string;
  paymentReference?: string;
  contractReference?: string;
  procurementReference?: string;
  originalInvoiceNumber?: string;
  originalInvoiceDate?: string;
  created?: number;
  lastUpdate?: number;
}

export interface DocumentList {
  items: DocumentDto[];
  params: DocumentListParams;
}

export interface AbsenceListParams extends ListParams {
  contractId?: string;
  userId?: string;
  userIds?: string[];
  contractIds?: string[];
  absenceTypeId?: string;
  status?: string;
  statuses?: string[];
  /** Inclusive lower bound (yyyy-MM-dd). */
  startDate?: string;
  /** Inclusive upper bound (yyyy-MM-dd). */
  endDate?: string;
  year?: number;
  teamId?: string;
  teamIds?: string[];
  excludeRejectedCancelled?: boolean;
}

export interface AbsenceTypeDto {
  id: string;
  organizationId?: string;
  code?: string;
  i18nKey?: string;
  name?: string;
  description?: string;
  color?: number;
  icon?: string;
  paid?: boolean;
  requiresApproval?: boolean;
  requiresDocumentation?: boolean;
  affectsOvertime?: boolean;
  deductsFromQuota?: boolean;
  countryCode?: string;
  systemType?: boolean;
  active?: boolean;
  sortOrder?: number;
  created?: number;
  lastUpdate?: number;
}

export interface AbsenceDto {
  id: string;
  contractId?: string;
  member?: Member;
  absenceTypeId?: string;
  absenceType?: AbsenceTypeDto;
  startDateTime: string;
  endDateTime: string;
  fullDay?: boolean;
  totalDays?: string;
  totalHours?: string;
  reason?: string;
  status?: string;
  requestedAt?: number;
  approvedAt?: number;
  approvedBy?: string;
  cancelledAt?: number;
  created?: number;
  lastUpdate?: number;
}

export interface AbsenceList {
  items: AbsenceDto[];
  params: AbsenceListParams;
}

export interface AbsenceTypeListParams extends ListParams {
  active?: boolean;
}

export interface AbsenceTypeList {
  items: AbsenceTypeDto[];
  params: AbsenceTypeListParams;
}

export interface OvertimeBalanceListParams extends ListParams {
  contractId?: string;
  /** 'me' or a user id. */
  user?: string;
  status?: string;
  /** Inclusive lower bound on the period start (yyyy-MM-dd). */
  startDate?: string;
  /** Inclusive upper bound on the period start (yyyy-MM-dd). */
  endDate?: string;
  /** Month of the period start (1-12), independent of year. */
  month?: number;
}

export interface OvertimeBalanceDto {
  id: string;
  contractId?: string;
  member?: Member;
  periodType?: string;
  periodStart: string;
  periodEnd: string;
  targetMinutes?: number;
  actualMinutes?: number;
  overtimeMinutes?: number;
  undertimeMinutes?: number;
  compensatedMinutes?: number;
  adjustmentMinutes?: number;
  remainingMinutes?: number;
  expiredMinutes?: number;
  flextimeBalanceMinutes?: number;
  flextimeCarryOverMinutes?: number;
  regularMinutes?: number;
  nightMinutes?: number;
  weekendMinutes?: number;
  holidayMinutes?: number;
  standbyMinutes?: number;
  earlyShiftMinutes?: number;
  lateShiftMinutes?: number;
  nightShiftMinutes?: number;
  overtimeTier1Minutes?: number;
  overtimeTier2Minutes?: number;
  overtimeTier3Minutes?: number;
  allInIncludedMinutes?: number;
  allInExcessMinutes?: number;
  grossOvertimeValue?: string;
  surchargeValue?: string;
  totalValue?: string;
  monetaryValueApplicable?: boolean;
  currency?: string;
  status?: string;
  created?: number;
  lastUpdate?: number;
}

export interface OvertimeBalanceList {
  items: OvertimeBalanceDto[];
  params: OvertimeBalanceListParams;
}

export interface LeaveBalanceListParams extends ListParams {
  /** Required by the organization endpoint. */
  year: number;
  contractId?: string;
}

export interface LeaveBalanceDto {
  id: string;
  contractId?: string;
  member?: Member;
  year: number;
  entitledDays?: string;
  carriedOverDays?: string;
  additionalDays?: string;
  totalAvailableDays?: string;
  usedDays?: string;
  pendingDays?: string;
  remainingDays?: string;
  carryOverExpiresAt?: string;
  expiredDays?: string;
  calculatedAt?: number;
  created?: number;
  lastUpdate?: number;
}

export interface LeaveBalanceList {
  items: LeaveBalanceDto[];
  params: LeaveBalanceListParams;
}

// ---------------------------------------------------------------------------
// File output
// ---------------------------------------------------------------------------

export interface FileWriteInput {
  filename: string;
  /** One of text/csv, text/plain, application/xml, application/octet-stream. */
  contentType: string;
  /** Base64 of the final bytes, already in the target charset. The transport never re-encodes. */
  content: string;
}

export interface WrittenFile {
  /** Short-lived signed download URL. */
  url: string;
  filename: string;
  contentType: string;
  bytes: number;
  /** ISO timestamp after which `url` stops working. */
  expiresAt?: string;
}

/**
 * Hands a generated file to the user as a download. A handler may call `write` more
 * than once and return `{ files: WrittenFile[] }`; the web renders the list.
 */
export interface FilesClient {
  write(input: FileWriteInput): Promise<WrittenFile>;
}

export interface CredentialsClient {
  getAccessToken(provider: string): Promise<string>;
  getApiKey(provider: string): Promise<string>;
  refreshToken(provider: string): Promise<string>;
  getConnectionInfo(provider: string): Promise<CredentialConnectionInfo>;
}

export interface MappingsClient {
  get(input: { system: string; entity: string; localId: string }): Promise<MappingRecord | null>;
  findByExternal(input: { system: string; entity: string; externalId: string }): Promise<MappingRecord | null>;
  list(input: { system: string; entity: string }): Promise<MappingRecord[]>;
  upsert(input: {
    system: string;
    entity: string;
    localId: string;
    externalId: string;
    externalLabel?: string;
    metadata?: Record<string, JsonValue>;
    syncStatus?: 'SYNCED' | 'PENDING' | 'ERROR' | 'STALE';
  }): Promise<void>;
  delete(input: { system: string; entity: string; localId: string }): Promise<void>;
}

export interface StateClient {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T, opts?: { ttlSeconds?: number; ifAbsent?: boolean }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
}

export interface TimesheetDataClient {
  listProjects(params?: ProjectListParams): Promise<ProjectList>;
  getProject(id: string): Promise<ProjectDto>;

  listTasks(params?: TaskListParams): Promise<TaskList>;
  getTask(id: string): Promise<TaskDto>;
  createTask(input: TaskCreateInput): Promise<TaskDto>;
  updateTask(id: string, input: TaskUpdateInput): Promise<TaskDto>;
  deleteTask(id: string): Promise<void>;

  listTodos(params?: ToDoListParams): Promise<ToDoList>;
  getTodo(id: string): Promise<ToDoDto>;
  createTodo(input: ToDoCreateInput): Promise<ToDoDto>;
  updateTodo(id: string, input: ToDoUpdateInput): Promise<ToDoDto>;
  deleteTodo(id: string): Promise<void>;

  listExpenses(params?: ExpenseListParams): Promise<ExpenseList>;
  getExpense(id: string): Promise<ExpenseDto>;
  createExpense(input: ExpenseCreateInput): Promise<ExpenseDto>;
  updateExpense(id: string, input: ExpenseUpdateInput): Promise<ExpenseDto>;
  deleteExpense(id: string): Promise<void>;

  listNotes(params?: NoteListParams): Promise<NoteList>;
  getNote(id: string): Promise<NoteDto>;
  createNote(input: NoteCreateInput): Promise<NoteDto>;
  updateNote(id: string, input: NoteUpdateInput): Promise<NoteDto>;
  deleteNote(id: string): Promise<void>;

  listPauses(params?: PauseListParams): Promise<PauseList>;
  getPause(id: string): Promise<PauseDto>;

  getTimer(): Promise<TimerDto>;
  startTimer(input: TimerStartInput): Promise<TimerDto>;
  stopTimer(input: TimerStopInput): Promise<TimerDto>;
  pauseTimer(input: TimerPauseInput): Promise<TimerDto>;
  resumeTimer(input: TimerResumeInput): Promise<TimerDto>;
  updateTimer(input: TimerUpdateInput): Promise<TimerDto>;

  getColleagues(params?: TeamMemberListParams): Promise<ColleagueList>;

  listTeams(params?: TeamListParams): Promise<TeamList>;
  getTeam(id: string): Promise<TeamDto>;

  listTags(params?: ListParams): Promise<TagList>;
  getTag(id: string): Promise<TagDto>;

  getSettings(): Promise<SettingsDto>;

  /** Requires the `documents` scope. */
  listDocuments(params?: DocumentListParams): Promise<DocumentList>;
  /** Requires the `documents` scope. */
  getDocument(id: string): Promise<DocumentDto>;

  /**
   * Requires the `absences` scope. On an organization installation this reads every
   * member's absences through the organization search; on a profile installation it
   * reads the installing user's own absences.
   */
  listAbsences(params?: AbsenceListParams): Promise<AbsenceList>;
  /** Requires the `absences` scope and an organization installation. */
  listAbsenceTypes(params?: AbsenceTypeListParams): Promise<AbsenceTypeList>;

  /** Requires the `overtime` scope and an organization installation. */
  listOvertimeBalances(params?: OvertimeBalanceListParams): Promise<OvertimeBalanceList>;
  /**
   * Requires the `overtime` scope. On an organization installation this reads the
   * organization's balances for `params.year`; on a profile installation it reads the
   * installing user's own balances.
   */
  listLeaveBalances(params: LeaveBalanceListParams): Promise<LeaveBalanceList>;
}

export interface IntegrationContext<TConfig = Record<string, unknown>> {
  readonly userId: string;
  readonly installationId: string;
  /** Present when the integration is installed for an organization. */
  readonly organizationId?: string;
  /**
   * Deployment environment of the plugin runtime. Set to 'sandbox' on
   * non-production runtimes so plugins can target matching external sandbox
   * endpoints (for example the QuickBooks sandbox API host). Defaults to
   * 'production' when unset.
   */
  readonly environment?: 'production' | 'sandbox';
  readonly dataAccess?: IntegrationDataAccess[];
  readonly config: TConfig;
  readonly data: TimesheetDataClient;
  readonly credentials: CredentialsClient;
  readonly mappings: MappingsClient;
  readonly state: StateClient;
  readonly files: FilesClient;
  readonly logger: Logger;
  readonly metadata?: {
    integrationId?: string;
    integrationSlug?: string;
    triggerId?: string;
    triggerType?: string;
    /** Present when trigger mode is 'sync'. Indicates the trigger is sync-aware. */
    syncMode?: boolean;
    /** Map of triggerId → webhook endpoint URL, resolved by the backend runtime. */
    webhooks?: Record<string, string>;
  };
}

export interface ExternalEntity {
  id: string;
  name: string;
  [key: string]: JsonValue;
}

export interface ActionInputSchema {
  actionId: string;
  schema?: JsonSchema;
}
