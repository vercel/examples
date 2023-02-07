import Statsig, { StatsigUser } from '../index';
import { StatsigOptions } from '../StatsigOptions';

jest.mock('node-fetch', () => jest.fn());

const CONFIG_SPEC_RESPONSE = JSON.stringify(
  require('./data/exposure_logging_dcs.json'),
);

const user: StatsigUser = {
  userID: 'a-user',
};

describe('ExposureLogging', () => {
  let events: {
    eventName: string;
    metadata: { gate?: string; config?: string; isManualExposure?: string };
  }[] = [];

  beforeEach(async () => {
    const fetch = require('node-fetch');
    fetch.mockImplementation((url: string, params) => {
      if (url.includes('download_config_specs')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(CONFIG_SPEC_RESPONSE),
        });
      }

      if (url.includes('log_event')) {
        events = events.concat(JSON.parse(params.body)['events']);
        return Promise.resolve({
          ok: true,
        });
      }

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('{}'),
      });
    });

    events = [];

    // @ts-ignore
    Statsig._instance = null;
    await Statsig.initialize('secret-key');

    // @ts-ignore
    Statsig._instance._options.loggingMaxBufferSize = 1;
  });

  describe('standard use', () => {
    it('logs gate exposures', async () => {
      await Statsig.checkGate(user, 'a_gate');
      expect(events.length).toBe(1);
      expect(events[0].metadata.gate).toEqual('a_gate');
      expect(events[0].metadata.isManualExposure).toBeUndefined();
      expect(events[0].eventName).toEqual('statsig::gate_exposure');
    });

    it('logs config exposures', async () => {
      await Statsig.getConfig(user, 'a_config');
      expect(events.length).toBe(1);
      expect(events[0].metadata.config).toEqual('a_config');
      expect(events[0].metadata.isManualExposure).toBeUndefined();
      expect(events[0].eventName).toEqual('statsig::config_exposure');
    });

    it('logs experiment exposures', async () => {
      await Statsig.getExperiment(user, 'an_experiment');
      expect(events.length).toBe(1);
      expect(events[0].metadata.config).toEqual('an_experiment');
      expect(events[0].metadata.isManualExposure).toBeUndefined();
      expect(events[0].eventName).toEqual('statsig::config_exposure');
    });

    it('logs layer exposures', async () => {
      const layer = await Statsig.getLayer(user, 'a_layer');
      layer.get('a_bool', false);
      expect(events.length).toBe(1);
      expect(events[0].metadata.config).toEqual('a_layer');
      expect(events[0].metadata.isManualExposure).toBeUndefined();
      expect(events[0].eventName).toEqual('statsig::layer_exposure');
    });
  });

  describe('exposure logging disabled', () => {
    it('does not log gate exposures', async () => {
      Statsig.checkGateWithExposureLoggingDisabled(user, 'a_gate');
      expect(events.length).toBe(0);
    });

    it('does not log config exposures', async () => {
      Statsig.getConfigWithExposureLoggingDisabled(user, 'a_config');
      expect(events.length).toBe(0);
    });

    it('does not log experiment exposures', async () => {
      Statsig.getExperimentWithExposureLoggingDisabled(user, 'an_experiment');
      expect(events.length).toBe(0);
    });

    it('does not log layer exposures', async () => {
      const layer = await Statsig.getLayerWithExposureLoggingDisabled(
        user,
        'a_layer',
      );
      layer.get('a_bool', false);
      expect(events.length).toBe(0);
    });
  });

  describe('manual exposure logging', () => {
    it('logs a manual gate exposure', async () => {
      Statsig.manuallyLogGateExposure(user, 'a_gate');
      expect(events.length).toBe(1);
      expect(events[0].metadata.gate).toEqual('a_gate');
      expect(events[0].metadata.isManualExposure).toEqual('true');
      expect(events[0].eventName).toEqual('statsig::gate_exposure');
    });

    it('logs a manual config exposure', async () => {
      Statsig.manuallyLogConfigExposure(user, 'a_config');
      expect(events.length).toBe(1);
      expect(events[0].metadata.config).toEqual('a_config');
      expect(events[0].metadata.isManualExposure).toEqual('true');
      expect(events[0].eventName).toEqual('statsig::config_exposure');
    });

    it('logs a manual experiment exposure', async () => {
      Statsig.manuallyLogExperimentExposure(user, 'an_experiment');
      expect(events.length).toBe(1);
      expect(events[0].metadata.config).toEqual('an_experiment');
      expect(events[0].metadata.isManualExposure).toEqual('true');
      expect(events[0].eventName).toEqual('statsig::config_exposure');
    });

    it('logs a manual layer exposure', async () => {
      Statsig.manuallyLogLayerParameterExposure(user, 'a_layer', 'a_bool');
      expect(events.length).toBe(1);
      expect(events[0].metadata.config).toEqual('a_layer');
      expect(events[0].metadata.isManualExposure).toEqual('true');
      expect(events[0].eventName).toEqual('statsig::layer_exposure');
    });
  });
});
