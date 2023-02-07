export type AdapterResponse = {
  result?: string;
  time?: number;
  error?: Error;
};

export enum DataAdapterKey {
  Rulesets = 'statsig.cache',
  IDLists = 'statsig.id_lists',
}

/**
 * An adapter for implementing custom storage of config specs.
 * Useful for backing up data in memory.
 * Can also be used to bootstrap Statsig server.
 */
export interface IDataAdapter {
  /**
   * Returns the data stored for a specific key
   * @param key - Key of stored item to fetch
   */
  get(key: string): Promise<AdapterResponse>;

  /**
   * Updates data stored for each key
   * @param key - Key of stored item to update
   * @param value - New value to store
   * @param time - Time of update
   */
  set(key: string, value: string, time?: number): Promise<void>;

  /**
   * Startup tasks to run before any fetch/update calls can be made
   */
  initialize(): Promise<void>;

  /**
   * Cleanup tasks to run when statsig is shutdown
   */
  shutdown(): Promise<void>;

  /**
   * Determines whether the SDK should poll for updates from
   * the data adapter for the given key
   * @param key - Key of stored item to poll from data adapter
   */
   supportsPollingUpdatesFor?(key: DataAdapterKey): boolean;
}
