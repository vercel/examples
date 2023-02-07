import { ConfigSpec } from './ConfigSpec';
import { StatsigLocalModeNetworkError } from './Errors';
import { EvaluationReason } from './EvaluationDetails';
import { DataAdapterKey, IDataAdapter } from './interfaces/IDataAdapter';
import { ExplicitStatsigOptions } from './StatsigOptions';
import { poll } from './utils/core';
import IDListUtil, { IDList } from './utils/IDListUtil';
import safeFetch from './utils/safeFetch';
import StatsigFetcher from './utils/StatsigFetcher';
const { getStatsigMetadata } = require('./utils/core');

const SYNC_OUTDATED_MAX = 120 * 1000;

export type ConfigStore = {
  gates: Record<string, ConfigSpec>;
  configs: Record<string, ConfigSpec>;
  idLists: Record<string, IDList>;
  layers: Record<string, ConfigSpec>;
  experimentToLayer: Record<string, string>;
};

export default class SpecStore {
  private initReason: EvaluationReason;

  private api: string;
  private rulesUpdatedCallback: ((rules: string, time: number) => void) | null;
  private initialUpdateTime: number;
  private lastUpdateTime: number;
  private store: ConfigStore;
  private syncInterval: number;
  private idListSyncInterval: number;
  private initialized: boolean;
  private syncTimer: NodeJS.Timeout | null;
  private idListsSyncTimer: NodeJS.Timeout | null;
  private fetcher: StatsigFetcher;
  private dataAdapter: IDataAdapter | null;
  private syncFailureCount: number = 0;
  private lastDownloadConfigSpecsSyncTime: number = Date.now();

  public constructor(fetcher: StatsigFetcher, options: ExplicitStatsigOptions) {
    this.fetcher = fetcher;
    this.api = options.api;
    this.rulesUpdatedCallback = options.rulesUpdatedCallback ?? null;
    this.lastUpdateTime = 0;
    this.initialUpdateTime = 0;
    this.store = {
      gates: {},
      configs: {},
      idLists: {},
      layers: {},
      experimentToLayer: {},
    };
    this.syncInterval = options.rulesetsSyncIntervalMs;
    this.idListSyncInterval = options.idListsSyncIntervalMs;
    this.initialized = false;
    this.syncTimer = null;
    this.idListsSyncTimer = null;
    this.dataAdapter = options.dataAdapter;
    this.initReason = 'Uninitialized';

    var specsJSON = null;
    if (options?.bootstrapValues != null) {
      if (this.dataAdapter != null) {
        console.error(
          'statsigSDK::initialize> Conflict between bootstrap and adapter. Defaulting to adapter.',
        );
      } else {
        try {
          specsJSON = JSON.parse(options.bootstrapValues);
          if (this._process(specsJSON)) {
            this.initReason = 'Bootstrap';
          }
          this.setInitialUpdateTime();
          this.initialized = true;
        } catch (e) {
          console.error(
            'statsigSDK::initialize> the provided bootstrapValues is not a valid JSON string.',
          );
        }
      }
    }
  }

  public getInitReason() {
    return this.initReason;
  }

  public getInitialUpdateTime() {
    return this.initialUpdateTime;
  }

  public getLastUpdateTime() {
    return this.lastUpdateTime;
  }

  public getGate(gateName: string): ConfigSpec | null {
    return this.store.gates[gateName] ?? null;
  }

  public getConfig(configName: string): ConfigSpec | null {
    return this.store.configs[configName] ?? null;
  }

  public getLayer(layerName: string): ConfigSpec | null {
    return this.store.layers[layerName] ?? null;
  }

  public getExperimentLayer(experimentName: string): string | null {
    return this.store.experimentToLayer[experimentName] ?? null;
  }

  public getIDList(listName: string): IDList | null {
    return this.store.idLists[listName] ?? null;
  }

  public getAllGates(): Record<string, ConfigSpec> {
    return this.store.gates;
  }

  public getAllConfigs(): Record<string, ConfigSpec> {
    return this.store.configs;
  }

  public getAllLayers(): Record<string, ConfigSpec> {
    return this.store.layers;
  }

  public async init(): Promise<void> {
    const adapter = this.dataAdapter;

    // If the provided bootstrapValues can be used to bootstrap the SDK rulesets, then we don't
    // need to wait for _syncValues() to finish before returning.
    if (this.initialized) {
      this._syncValues();
    } else {
      if (adapter) {
        await adapter.initialize();
        await this._fetchConfigSpecsFromAdapter();
      }
      if (this.lastUpdateTime === 0) {
        await this._syncValues(true);
      }

      this.setInitialUpdateTime();
    }

    const bootstrapIdLists = await adapter?.get(DataAdapterKey.IDLists);
    if (adapter && typeof bootstrapIdLists?.result === 'string') {
      this.syncIdListsFromDataAdapter(adapter, bootstrapIdLists.result);
    } else {
      await this.syncIdListsFromNetwork();
    }

    this.pollForUpdates();
    this.initialized = true;
  }

  public resetSyncTimerIfExited(): Error | null {
    if (
      this.lastDownloadConfigSpecsSyncTime >=
      Date.now() - SYNC_OUTDATED_MAX
    ) {
      return null;
    }
    this.clearTimers();
    this.pollForUpdates();
    const message = `Force reset sync timer. Last update time: ${
      this.lastDownloadConfigSpecsSyncTime
    }, now: ${Date.now()}`;
    this._fetchConfigSpecsFromServer();
    return new Error(message);
  }

  public isServingChecks() {
    return this.lastUpdateTime !== 0;
  }

  private async _fetchConfigSpecsFromServer(): Promise<void> {
    this.lastDownloadConfigSpecsSyncTime = Date.now();
    const response = await this.fetcher.post(
      this.api + '/download_config_specs',
      {
        statsigMetadata: getStatsigMetadata(),
        sinceTime: this.lastUpdateTime,
      },
    );
    const specsString = await response.text();
    const processResult = this._process(JSON.parse(specsString));
    if (!processResult) {
      return;
    }
    this.initReason = 'Network';
    if (
      this.rulesUpdatedCallback != null &&
      typeof this.rulesUpdatedCallback === 'function'
    ) {
      this.rulesUpdatedCallback(specsString, this.lastUpdateTime);
    }
    this._saveConfigSpecsToAdapter(specsString);
  }

  private async _fetchConfigSpecsFromAdapter(): Promise<void> {
    if (!this.dataAdapter) {
      return;
    }
    const { result, error, time } = await this.dataAdapter.get(
      DataAdapterKey.Rulesets,
    );
    if (result && !error) {
      const configSpecs = JSON.parse(result);
      if (this._process(configSpecs)) {
        this.initReason = 'DataAdapter';
      }
    }
  }

  private async _saveConfigSpecsToAdapter(specString: string): Promise<void> {
    if (!this.dataAdapter) {
      return;
    }
    await this.dataAdapter.set(
      DataAdapterKey.Rulesets,
      specString,
      this.lastUpdateTime,
    );
  }

  private pollForUpdates() {
    if (this.syncTimer == null) {
      this.syncTimer = poll(async () => {
        await this._syncValues();
      }, this.syncInterval);
    }

    if (this.idListsSyncTimer == null) {
      this.idListsSyncTimer = poll(async () => {
        await this._syncIdLists();
      }, this.idListSyncInterval);
    }
  }

  private async _syncValues(isColdStart: boolean = false): Promise<void> {
    const adapter = this.dataAdapter;
    const shouldSyncFromAdapter = adapter?.supportsPollingUpdatesFor?.(DataAdapterKey.Rulesets) === true;

    try {
      if (shouldSyncFromAdapter) {
        await this._fetchConfigSpecsFromAdapter();
      } else {
        await this._fetchConfigSpecsFromServer();
      }
      this.syncFailureCount = 0;
    } catch (e) {
      this.syncFailureCount++;
      if (!(e instanceof StatsigLocalModeNetworkError)) {
        if (isColdStart) {
          console.error(
            'statsigSDK::initialize> Failed to initialize from the network.  See https://docs.statsig.com/messages/serverSDKConnection for more information',
          );
        } else if (
          this.syncFailureCount * this.syncInterval >
          SYNC_OUTDATED_MAX
        ) {
          console.warn(
            `statsigSDK::sync> Syncing the server SDK with ${shouldSyncFromAdapter ? "the data adapter" : "statsig"} has failed for  ${
              this.syncFailureCount * this.syncInterval
            }ms.  Your sdk will continue to serve gate/config/experiment definitions as of the last successful sync.  See https://docs.statsig.com/messages/serverSDKConnection for more information`,
          );
          this.syncFailureCount = 0;
        }
      }
    }
  }

  private async _syncIdLists(): Promise<void> {
    const adapter = this.dataAdapter;
    const shouldSyncFromAdapter = adapter?.supportsPollingUpdatesFor?.(DataAdapterKey.IDLists) === true;
    const adapterIdLists = await adapter?.get(DataAdapterKey.IDLists);
    if (shouldSyncFromAdapter && typeof adapterIdLists?.result === 'string') {
      await this.syncIdListsFromDataAdapter(adapter, adapterIdLists.result);
    } else {
      await this.syncIdListsFromNetwork();
    }
  }

  // returns a boolean indicating whether specsJSON has was successfully parsed
  private _process(specsJSON: Record<string, unknown>): boolean {
    if (!specsJSON?.has_updates) {
      return false;
    }

    const updatedGates: Record<string, ConfigSpec> = {};
    const updatedConfigs: Record<string, ConfigSpec> = {};
    const updatedLayers: Record<string, ConfigSpec> = {};
    const gateArray = specsJSON?.feature_gates;
    const configArray = specsJSON?.dynamic_configs;
    const layersArray = specsJSON?.layer_configs;
    const layerToExperimentMap = specsJSON?.layers;

    if (
      !Array.isArray(gateArray) ||
      !Array.isArray(configArray) ||
      !Array.isArray(layersArray)
    ) {
      return false;
    }

    for (const gateJSON of gateArray) {
      try {
        const gate = new ConfigSpec(gateJSON);
        updatedGates[gate.name] = gate;
      } catch (e) {
        return false;
      }
    }

    for (const configJSON of configArray) {
      try {
        const config = new ConfigSpec(configJSON);
        updatedConfigs[config.name] = config;
      } catch (e) {
        return false;
      }
    }

    for (const layerJSON of layersArray) {
      try {
        const config = new ConfigSpec(layerJSON);
        updatedLayers[config.name] = config;
      } catch (e) {
        return false;
      }
    }

    const updatedExpToLayer: Record<string, string> =
      this._reverseLayerExperimentMapping(layerToExperimentMap);

    this.store.gates = updatedGates;
    this.store.configs = updatedConfigs;
    this.store.layers = updatedLayers;
    this.store.experimentToLayer = updatedExpToLayer;
    this.lastUpdateTime = (specsJSON.time as number) ?? this.lastUpdateTime;
    return true;
  }

  /**
   * Returns a reverse mapping of layers to experiment (or vice versa)
   */
  private _reverseLayerExperimentMapping(
    layersMapping: unknown,
  ): Record<string, string> {
    const reverseMapping: Record<string, string> = {};
    if (layersMapping != null && typeof layersMapping === 'object') {
      for (const [layerName, experiments] of Object.entries(
        // @ts-ignore
        layersMapping,
      )) {
        // @ts-ignore
        for (const experimentName of experiments) {
          // experiment -> layer is a 1:1 mapping
          reverseMapping[experimentName] = layerName;
        }
      }
    }
    return reverseMapping;
  }

  private async syncIdListsFromDataAdapter(
    dataAdapter: IDataAdapter,
    listsLookupString: string,
  ): Promise<void> {
    const lookup = IDListUtil.parseBootstrapLookup(listsLookupString);
    if (!lookup) {
      return;
    }

    const tasks: Promise<void>[] = [];
    for (const name of lookup) {
      tasks.push(
        new Promise(async (resolve) => {
          const data = await dataAdapter.get(
            IDListUtil.getIdListDataStoreKey(name),
          );
          if (!data.result) {
            return;
          }

          this.store.idLists[name] = {
            ids: {},
            readBytes: 0,
            url: 'bootstrap',
            fileID: 'bootstrap',
            creationTime: 0,
          };

          IDListUtil.updateIdList(this.store.idLists, name, data.result);
          resolve();
        }),
      );
    }

    await Promise.all(tasks);
  }

  private async syncIdListsFromNetwork(): Promise<void> {
    try {
      const response = await this.fetcher.post(this.api + '/get_id_lists', {
        statsigMetadata: getStatsigMetadata(),
      });
      const json = await response.json();
      const lookup = IDListUtil.parseLookupResponse(json);
      if (!lookup) {
        return;
      }

      let promises = [];

      for (const [name, item] of Object.entries(lookup)) {
        const url = item.url;
        const fileID = item.fileID;
        const newCreationTime = item.creationTime;
        const oldCreationTime = this.store.idLists[name]?.creationTime ?? 0;
        if (
          typeof url !== 'string' ||
          newCreationTime < oldCreationTime ||
          typeof fileID !== 'string'
        ) {
          continue;
        }
        let newFile =
          fileID !== this.store.idLists[name]?.fileID &&
          newCreationTime >= oldCreationTime;

        if (
          (lookup.hasOwnProperty(name) &&
            !this.store.idLists.hasOwnProperty(name)) ||
          newFile // when fileID changes, we reset the whole list
        ) {
          this.store.idLists[name] = {
            ids: {},
            readBytes: 0,
            url,
            fileID,
            creationTime: newCreationTime,
          };
        }
        const fileSize = item.size ?? 0;
        const readSize = this.store.idLists[name].readBytes ?? 0;
        if (fileSize <= readSize) {
          continue;
        }
        const p = safeFetch(url, {
          method: 'GET',
          headers: {
            Range: `bytes=${readSize}-`,
          },
        })
          // @ts-ignore
          .then((res: Response) => {
            const contentLength = res.headers.get('content-length');
            if (contentLength == null) {
              throw new Error('Content-Length for the id list is invalid.');
            }
            const length = parseInt(contentLength);
            if (typeof length === 'number') {
              this.store.idLists[name].readBytes += length;
            } else {
              delete this.store.idLists[name];
              throw new Error('Content-Length for the id list is invalid.');
            }
            return res.text();
          })
          .then((data: string) => {
            IDListUtil.updateIdList(this.store.idLists, name, data);
          })
          .catch((e) => {
            console.error(e);
          });

        promises.push(p);
      }

      IDListUtil.removeOldIdLists(this.store.idLists, lookup);

      await Promise.allSettled(promises);

      if (this.dataAdapter) {
        await IDListUtil.saveToDataAdapter(
          this.dataAdapter,
          this.store.idLists,
        );
      }
    } catch (e) {}
  }

  public shutdown(): void {
    this.clearTimers();
    this.dataAdapter?.shutdown();
  }

  private clearTimers(): void {
    if (this.syncTimer != null) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    if (this.idListsSyncTimer != null) {
      clearInterval(this.idListsSyncTimer);
      this.idListsSyncTimer = null;
    }
  }

  private setInitialUpdateTime() {
    this.initialUpdateTime =
      this.lastUpdateTime === 0 ? -1 : this.lastUpdateTime;
  }
}
