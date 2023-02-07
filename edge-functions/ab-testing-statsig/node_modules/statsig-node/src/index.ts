import DynamicConfig from './DynamicConfig';
import { StatsigUninitializedError } from './Errors';
import { AdapterResponse, IDataAdapter } from './interfaces/IDataAdapter';
import Layer from './Layer';
import {
  RulesUpdatedCallback,
  StatsigEnvironment,
  StatsigOptions,
} from './StatsigOptions';

import StatsigServer, { LogEventObject } from './StatsigServer';
import { StatsigUser } from './StatsigUser';

export {
  DynamicConfig,
  Layer,
  LogEventObject,
  RulesUpdatedCallback,
  StatsigUser,
  StatsigOptions,
  StatsigEnvironment,
  IDataAdapter,
  AdapterResponse,
};

const Statsig = {
  _instance: null as StatsigServer | null,

  initialize(secretKey: string, options: StatsigOptions = {}): Promise<void> {
    const inst = Statsig._instance ?? new StatsigServer(secretKey, options);

    if (Statsig._instance == null) {
      Statsig._instance = inst;
    }

    return inst.initializeAsync();
  },

  checkGate(user: StatsigUser, gateName: string): Promise<boolean> {
    return this._enforceServer().checkGate(user, gateName);
  },

  checkGateWithExposureLoggingDisabled(
    user: StatsigUser,
    gateName: string,
  ): Promise<boolean> {
    return this._enforceServer().checkGateWithExposureLoggingDisabled(
      user,
      gateName,
    );
  },

  manuallyLogGateExposure(user: StatsigUser, gateName: string) {
    return this._enforceServer().logGateExposure(user, gateName);
  },

  getConfig(user: StatsigUser, configName: string): Promise<DynamicConfig> {
    return this._enforceServer().getConfig(user, configName);
  },

  getConfigWithExposureLoggingDisabled(
    user: StatsigUser,
    configName: string,
  ): Promise<DynamicConfig> {
    return this._enforceServer().getConfigWithExposureLoggingDisabled(
      user,
      configName,
    );
  },

  manuallyLogConfigExposure(user: StatsigUser, configName: string) {
    return this._enforceServer().logConfigExposure(user, configName);
  },

  getExperiment(
    user: StatsigUser,
    experimentName: string,
  ): Promise<DynamicConfig> {
    return this._enforceServer().getExperiment(user, experimentName);
  },

  getExperimentWithExposureLoggingDisabled(
    user: StatsigUser,
    experimentName: string,
  ): Promise<DynamicConfig> {
    return this._enforceServer().getExperimentWithExposureLoggingDisabled(
      user,
      experimentName,
    );
  },

  manuallyLogExperimentExposure(user: StatsigUser, experimentName: string) {
    return this._enforceServer().logExperimentExposure(user, experimentName);
  },

  getLayer(user: StatsigUser, layerName: string): Promise<Layer> {
    return this._enforceServer().getLayer(user, layerName);
  },

  getLayerWithExposureLoggingDisabled(
    user: StatsigUser,
    layerName: string,
  ): Promise<Layer> {
    return this._enforceServer().getLayerWithExposureLoggingDisabled(
      user,
      layerName,
    );
  },

  manuallyLogLayerParameterExposure(
    user: StatsigUser,
    layerName: string,
    parameterName: string,
  ) {
    this._enforceServer().logLayerParameterExposure(
      user,
      layerName,
      parameterName,
    );
  },

  logEvent(
    user: StatsigUser,
    eventName: string,
    value: string | number | null = null,
    metadata: Record<string, unknown> | null = null,
  ): void {
    this._enforceServer().logEvent(user, eventName, value, metadata);
  },

  logEventObject(eventObject: {
    eventName: string;
    user: StatsigUser;
    value?: string | number | null;
    metadata?: Record<string, unknown>;
    time?: string | null;
  }): void {
    this._enforceServer().logEventObject(eventObject);
  },

  shutdown(): void {
    this._enforceServer().shutdown();
  },

  getClientInitializeResponse(
    user: StatsigUser,
  ): Record<string, unknown> | null {
    return this._enforceServer().getClientInitializeResponse(user);
  },

  overrideGate(gateName: string, value: boolean, userID: string = ''): void {
    this._enforceServer().overrideGate(gateName, value, userID);
  },

  overrideConfig(
    configName: string,
    value: Record<string, unknown>,
    userID: string = '',
  ): void {
    this._enforceServer().overrideConfig(configName, value, userID);
  },

  overrideLayer(
    layerName: string,
    value: Record<string, unknown>,
    userID = '',
  ) {
    this._enforceServer().overrideLayer(layerName, value, userID);
  },

  flush(): Promise<void> {
    const inst = Statsig._instance;
    if (inst == null) {
      return Promise.resolve();
    }
    return inst.flush();
  },

  _enforceServer(): StatsigServer {
    if (Statsig._instance == null) {
      throw new StatsigUninitializedError();
    }
    return Statsig._instance;
  },
};

type Statsig = Omit<typeof Statsig, '_instance' | '_enforceServer'>;
export default Statsig as Statsig;
module.exports = Statsig as Statsig;
