import { AdapterResponse, IDataAdapter } from 'statsig-node';
import { createClient, EdgeConfigClient } from '@vercel/edge-config';

export class EdgeConfigDataAdapter implements IDataAdapter {
  private configSpecsKey: string;
  private edgeConfigClient: EdgeConfigClient;
  private supportConfigSpecPolling: boolean = false;

  public constructor(key: string, connectionString: string = process.env.EDGE_CONFIG!) {
    this.configSpecsKey = key; 
    this.edgeConfigClient = createClient(connectionString);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async get(key: string): Promise<AdapterResponse> {
    if (key !== "statsig.cache") {
      return { error: new Error(`Edge Config Adapter Only Supports Config Specs`) };
    }

    const data = await this.edgeConfigClient.get(this.configSpecsKey);
    if (data === undefined) {
      return { error: new Error(`key (${key}) does not exist`) };
    }
    return { result: JSON.stringify(data), };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async set(
    key: string,
    value: string,
    time?: number | undefined,
  ): Promise<void> {
    // no-op. Statsig's Edge Config integration keeps config specs synced through Statsig's service
  }

  public async initialize(): Promise<void> {
    const data = await this.edgeConfigClient.get(this.configSpecsKey);

    if (data) {
      this.supportConfigSpecPolling = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async shutdown(): Promise<void> {
    
  }

  public supportsPollingUpdatesFor(key: string): boolean {
    if (key === "statsig.cache") {
      return this.supportConfigSpecPolling;
    }
    return false;
  }
}
