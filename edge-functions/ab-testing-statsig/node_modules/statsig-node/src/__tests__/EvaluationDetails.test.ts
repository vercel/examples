import { EvaluationReason } from '../EvaluationDetails';
import StatsigServer from '../StatsigServer';
import { StatsigUser } from '../StatsigUser';
jest.mock('node-fetch', () => jest.fn());

const CONFIG_SPEC_RESPONSE = JSON.stringify(
  require('./data/eval_details_download_config_specs.json'),
);

describe('Evaluation Details', () => {
  const user: StatsigUser = {
    userID: 'a-user',
  };
  let server: StatsigServer;
  let events: string[];
  let returnConfigSpecsResponse = true;

  const expectedResult = (
    type: 'gate' | 'config' | 'layer',
    reason: EvaluationReason,
    skipSyncTimes = false,
  ) => {
    return expect.objectContaining({
      eventName: `statsig::${type}_exposure`,
      metadata: expect.objectContaining({
        reason: reason,
        serverTime: 12345,
        configSyncTime: skipSyncTimes ? 0 : 1631638014811,
        initTime: skipSyncTimes ? 0 : 1631638014811,
      }),
    });
  };

  beforeEach(async () => {
    Date.now = () => 12345;

    returnConfigSpecsResponse = true;
    const fetch = require('node-fetch');
    fetch.mockImplementation((url: string, params) => {
      if (url.includes('download_config_specs') && returnConfigSpecsResponse) {
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
    });

    events = [];
    server = new StatsigServer('secret-key');

    await server.initializeAsync();
  });

  it('returns uninitialized as an eval reason', async () => {
    returnConfigSpecsResponse = false;
    const uninitializedServer = new StatsigServer('secret-key', {
      bootstrapValues: '{ "Invalid Boostrap": "JSON" }',
    });

    await uninitializedServer.initializeAsync();

    const [_g, _c, _e, layer] = await Promise.all([
      uninitializedServer.checkGate(user, 'always_on_gate'),
      uninitializedServer.getConfig(user, 'test_config'),
      uninitializedServer.getExperiment(user, 'sample_experiment'),
      uninitializedServer.getLayer(user, 'a_layer'),
    ]);
    layer.get('experiment_param', 'fallback_value');
    uninitializedServer.shutdown();

    expect(events.length).toBe(3);
    expect(events[0]).toEqual(expectedResult('gate', 'Uninitialized', true));
    expect(events[1]).toEqual(expectedResult('config', 'Uninitialized', true));
    expect(events[2]).toEqual(expectedResult('config', 'Uninitialized', true));
  });

  it('returns unrecognized as an eval reason', async () => {
    const [_g, _c, _e, layer] = await Promise.all([
      server.checkGate(user, 'not_a_gate'),
      server.getConfig(user, 'not_a_config'),
      server.getExperiment(user, 'not_an_experiment'),
      server.getLayer(user, 'not_a_layer'),
    ]);
    layer.get('a_value', 'fallback_value');
    server.shutdown();

    expect(events.length).toBe(3);
    expect(events[0]).toEqual(expectedResult('gate', 'Unrecognized'));
    expect(events[1]).toEqual(expectedResult('config', 'Unrecognized'));
    expect(events[2]).toEqual(expectedResult('config', 'Unrecognized'));
  });

  it('returns network as an eval reason', async () => {
    const [_g, _c, _e, layer] = await Promise.all([
      server.checkGate(user, 'always_on_gate'),
      server.getConfig(user, 'test_config'),
      server.getExperiment(user, 'sample_experiment'),
      server.getLayer(user, 'a_layer'),
    ]);
    layer.get('experiment_param', 'fallback_value');
    server.shutdown();

    expect(events.length).toBe(4);
    expect(events[0]).toEqual(expectedResult('gate', 'Network'));
    expect(events[1]).toEqual(expectedResult('config', 'Network'));
    expect(events[2]).toEqual(expectedResult('config', 'Network'));
    expect(events[3]).toEqual(expectedResult('layer', 'Network'));
  });

  it('returns local override as an eval reason', async () => {
    server.overrideGate('always_on_gate', false);
    server.overrideConfig('sample_experiment', {});

    await Promise.all([
      server.checkGate(user, 'always_on_gate'),
      server.getExperiment(user, 'sample_experiment'),
    ]);

    server.shutdown();

    expect(events.length).toBe(2);
    expect(events[0]).toEqual(expectedResult('gate', 'LocalOverride'));
    expect(events[1]).toEqual(expectedResult('config', 'LocalOverride'));
  });

  it('returns bootstrap as an eval reason', async () => {
    returnConfigSpecsResponse = false;
    const bootstrapServer = new StatsigServer('secret-key', {
      bootstrapValues: CONFIG_SPEC_RESPONSE,
    });
    await bootstrapServer.initializeAsync();

    const [_g, _c, _e, layer] = await Promise.all([
      bootstrapServer.checkGate(user, 'always_on_gate'),
      bootstrapServer.getConfig(user, 'test_config'),
      bootstrapServer.getExperiment(user, 'sample_experiment'),
      bootstrapServer.getLayer(user, 'a_layer'),
    ]);
    layer.get('experiment_param', 'fallback_value');
    bootstrapServer.shutdown();

    expect(events.length).toBe(4);
    expect(events[0]).toEqual(expectedResult('gate', 'Bootstrap'));
    expect(events[1]).toEqual(expectedResult('config', 'Bootstrap'));
    expect(events[2]).toEqual(expectedResult('config', 'Bootstrap'));
    expect(events[3]).toEqual(expectedResult('layer', 'Bootstrap'));
  });

  it('returns data adapter as an eval reason', async () => {
    const dataStoreServer = new StatsigServer('secret-key', {
      dataAdapter: {
        get: (_) => Promise.resolve({ result: CONFIG_SPEC_RESPONSE }),
        set: (_, _1) =>
          Promise.reject(
            'Should not be called.  If this changes, update the test',
          ),
        initialize: () => Promise.resolve(),
        shutdown: () => Promise.resolve(),
      },
    });
    await dataStoreServer.initializeAsync();

    const [_g, _c, _e, layer] = await Promise.all([
      dataStoreServer.checkGate(user, 'always_on_gate'),
      dataStoreServer.getConfig(user, 'test_config'),
      dataStoreServer.getExperiment(user, 'sample_experiment'),
      dataStoreServer.getLayer(user, 'a_layer'),
    ]);
    layer.get('experiment_param', 'fallback_value');
    dataStoreServer.shutdown();

    expect(events.length).toBe(4);
    expect(events[0]).toEqual(expectedResult('gate', 'DataAdapter'));
    expect(events[1]).toEqual(expectedResult('config', 'DataAdapter'));
    expect(events[2]).toEqual(expectedResult('config', 'DataAdapter'));
    expect(events[3]).toEqual(expectedResult('layer', 'DataAdapter'));
  });
});
