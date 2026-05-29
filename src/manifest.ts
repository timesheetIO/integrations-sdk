export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonSchema {
  type?: string | string[];
  title?: string;
  description?: string;
  enum?: string[];
  default?: JsonValue;
  required?: string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  additionalProperties?: boolean | JsonSchema;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  ['x-ui-widget']?: string;
  ['x-ui-help']?: string;
  ['x-ui-placeholder']?: string;
  ['x-ui-condition']?: {
    field: string;
    eq?: JsonValue;
    neq?: JsonValue;
    in?: JsonValue[];
  };
  ['x-ui-groups']?: Array<{
    title: string;
    fields: string[];
    collapsed?: boolean;
  }>;
}

export type IntegrationDataAccess =
  | 'projects'
  | 'tasks'
  | 'todos'
  | 'expenses'
  | 'notes'
  | 'pauses'
  | 'timer'
  | 'colleagues'
  | 'teams'
  | 'tags'
  | 'settings';

export interface ExternalAuthDefinition {
  id: string;
  type: 'oauth2' | 'api_key';
  buttonUrl?: string;
  oauth?: {
    authorizeUrl: string;
    tokenUrl: string;
    scopes: string[];
  };
  apiKey?: {
    headerName?: string;
    placeholder?: string;
  };
}

export interface MappingEntityDefinition {
  type: string;
  label: string;
  display?: string;
  fetchAction?: string;
}

export interface MappingDefinition {
  id: string;
  title: string;
  description?: string;
  localEntity: MappingEntityDefinition;
  externalEntity: MappingEntityDefinition;
  required?: boolean;
  minMappings?: number;
}

export interface MappingSchema {
  system: string;
  mappings: MappingDefinition[];
}

export interface BaseTrigger {
  id: string;
  name: string;
  description?: string;
  configurable?: boolean;
  /**
   * ID of the action whose handler runs when this trigger fires. The backend
   * resolves the trigger to `actions[].handler` via this field.
   */
  actionId?: string;
  /**
   * Event names this trigger listens for. Required on `event` triggers; also
   * honored on other trigger types that scope themselves to specific events.
   */
  events?: string[];
  /** When set to 'sync', the trigger receives a batch of SyncChange records instead of a single event. */
  mode?: 'sync';
}

export interface EventTrigger extends BaseTrigger {
  type: 'event';
  events: string[];
}

export interface WebhookTrigger extends BaseTrigger {
  type: 'webhook';
  webhook: {
    signature?: {
      header: string;
      algorithm: string;
      secretConfigKey: string;
    };
  };
}

export interface ScheduleTrigger extends BaseTrigger {
  type: 'schedule';
  schedule: string;
  timezone?: string;
  catchUpPolicy?: 'skip' | 'run_once';
  maxDelayMinutes?: number;
}

export interface UserActionTrigger extends BaseTrigger {
  type: 'user_action';
  userAction: {
    label: string;
    placement: 'settings' | 'header' | 'page';
  };
}

export type TriggerDefinition =
  | EventTrigger
  | WebhookTrigger
  | ScheduleTrigger
  | UserActionTrigger;

export interface ActionDefinition {
  id: string;
  name?: string;
  handler: string;
  internal?: boolean;
  inputSchema?: JsonSchema;
}

export interface WidgetDefinition {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'form' | 'action_button' | 'text' | 'alert';
  title?: string;
  description?: string;
  dataSource?: string;
  config?: Record<string, JsonValue>;
  grid?: {
    col: number;
    row: number;
    colSpan?: number;
    rowSpan?: number;
  };
}

export interface PageDefinition {
  id: string;
  title: string;
  icon?: string;
  layout?: 'dashboard' | 'form' | 'list';
  widgets: WidgetDefinition[];
}

export interface IntegrationManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  longDescription?: string;
  icon?: string;
  category?: string;
  tags?: string[];
  dataAccess: IntegrationDataAccess[];
  externalAuth?: ExternalAuthDefinition[];
  configSchema?: JsonSchema;
  mappingSchema?: MappingSchema;
  triggers?: TriggerDefinition[];
  actions: ActionDefinition[];
  pages?: PageDefinition[];
}
