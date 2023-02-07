import { IDataAdapter } from './interfaces/IDataAdapter';

const DEFAULT_API = 'https://statsigapi.net/v1';
const DEFAULT_RULESETS_SYNC_INTERVAL = 10 * 1000;
const MIN_RULESETS_SYNC_INTERVAL = 5 * 1000;
const DEFAULT_ID_LISTS_SYNC_INTERVAL = 60 * 1000;
const MIN_ID_LISTS_SYNC_INTERVAL = 30 * 1000;
const DEFAULT_LOGGING_INTERVAL = 60 * 1000;
const DEFAULT_MAX_LOGGING_BUFFER_SIZE = 1000;

export type RulesUpdatedCallback = (rulesJSON: string, time: number) => void;

export type StatsigEnvironment = {
  tier?: 'production' | 'staging' | 'development' | string;
  [key: string]: string | undefined;
};

export type ExplicitStatsigOptions = {
  api: string;
  bootstrapValues: string | null;
  environment: StatsigEnvironment | null;
  rulesUpdatedCallback: RulesUpdatedCallback | null;
  localMode: boolean;
  initTimeoutMs: number;
  dataAdapter: IDataAdapter | null;
  rulesetsSyncIntervalMs: number;
  idListsSyncIntervalMs: number;
  loggingIntervalMs: number;
  loggingMaxBufferSize: number;
};

export type StatsigOptions = Partial<ExplicitStatsigOptions>;

export function OptionsWithDefaults(
  opts: StatsigOptions,
): ExplicitStatsigOptions {
  return {
    api: getString(opts, 'api', DEFAULT_API) ?? DEFAULT_API,
    bootstrapValues: getString(opts, 'bootstrapValues', null),
    environment: opts.environment
      ? (getObject(opts, 'environment', {}) as StatsigEnvironment)
      : null,
    rulesUpdatedCallback: opts.rulesUpdatedCallback
      ? (getFunction(opts, 'rulesUpdatedCallback') as RulesUpdatedCallback)
      : null,
    localMode: getBoolean(opts, 'localMode', false),
    initTimeoutMs: getNumber(opts, 'initTimeoutMs', 0),
    dataAdapter: opts.dataAdapter ?? null,
    rulesetsSyncIntervalMs: Math.max(
      getNumber(opts, 'rulesetsSyncIntervalMs', DEFAULT_RULESETS_SYNC_INTERVAL),
      MIN_RULESETS_SYNC_INTERVAL,
    ),
    idListsSyncIntervalMs: Math.max(
      getNumber(opts, 'idListsSyncIntervalMs', DEFAULT_ID_LISTS_SYNC_INTERVAL),
      MIN_ID_LISTS_SYNC_INTERVAL,
    ),
    loggingIntervalMs: getNumber(
      opts,
      'loggingIntervalMs',
      DEFAULT_LOGGING_INTERVAL,
    ),
    loggingMaxBufferSize: Math.min(
      getNumber(opts, 'loggingMaxBufferSize', DEFAULT_MAX_LOGGING_BUFFER_SIZE),
      DEFAULT_MAX_LOGGING_BUFFER_SIZE,
    ),
  };
}

function getBoolean(
  inputOptions: Record<string, unknown>,
  index: string,
  defaultValue: boolean,
): boolean {
  const b = inputOptions[index];
  if (b == null || typeof b !== 'boolean') {
    return defaultValue;
  }
  return b;
}

function getString(
  inputOptions: Record<string, unknown>,
  index: string,
  defaultValue: string | null,
): string | null {
  const str = inputOptions[index];
  if (str == null || typeof str !== 'string') {
    return defaultValue;
  }
  return str;
}

function getObject(
  inputOptions: Record<string, unknown>,
  index: string,
  defaultValue: Record<string, undefined>,
): Record<string, unknown> {
  const obj = inputOptions[index];
  if (obj == null || typeof obj !== 'object') {
    return defaultValue;
  }
  return obj as Record<string, unknown>;
}

function getFunction(inputOptions: Record<string, unknown>, index: string) {
  const func = inputOptions[index];
  if (func == null || typeof func !== 'function') {
    return null;
  }
  return func;
}

function getNumber(
  inputOptions: Record<string, unknown>,
  index: string,
  defaultValue: number,
): number {
  const obj = inputOptions[index];
  if (obj == null || typeof obj !== 'number') {
    return defaultValue;
  }
  return obj;
}
