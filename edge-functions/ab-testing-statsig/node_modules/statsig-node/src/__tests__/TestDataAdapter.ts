import { AdapterResponse, IDataAdapter, DataAdapterKey } from '../interfaces/IDataAdapter';

export default class TestDataAdapter implements IDataAdapter {
  private store: Record<string, string> = {};

  get(key: string): Promise<AdapterResponse> {
    return Promise.resolve({ result: this.store[key], time: Date.now() });
  }
  set(key: string, value: string, time?: number | undefined): Promise<void> {
    this.store[key] = value;
    return Promise.resolve();
  }
  initialize(): Promise<void> {
    return Promise.resolve();
  }
  shutdown(): Promise<void> {
    this.store = {};
    return Promise.resolve();
  }
}

export class TestSyncingDataAdapter extends TestDataAdapter {
  private keysToSync: DataAdapterKey[] | undefined;

  constructor(keysToSync?: DataAdapterKey[]) {
    super();
    this.keysToSync = keysToSync;
  }

  supportsPollingUpdatesFor(key): boolean {
    if (!this.keysToSync) {
      return false;
    }
    return this.keysToSync.includes(key);
  }
}
