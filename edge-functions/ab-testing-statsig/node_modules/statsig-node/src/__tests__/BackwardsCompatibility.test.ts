import * as starsig from '../index';
import Statsig, {
  DynamicConfig,
  Layer,
  LogEventObject,
  RulesUpdatedCallback,
  StatsigEnvironment,
  StatsigOptions,
  StatsigUser,
  IDataAdapter,
  AdapterResponse,
} from '../index';

jest.mock('node-fetch', () => jest.fn());

const clearStatsig = (statsig: any) => {
  if (statsig._instance) {
    statsig._instance = null;
  }
};

describe('Backward Compatibility', () => {
  const user: StatsigUser = { userID: 'a-user', email: 'jkw@statsig.com' };
  let logs: {
    eventName: string;
    metadata?: {
      gate?: string;
      config?: string;
    };
  }[] = [];

  beforeEach(() => {
    logs = [];

    const fetch = require('node-fetch');
    fetch.mockImplementation((url: string, params) => {
      if (url.includes('download_config_specs')) {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(
              JSON.stringify(require('./data/rulesets_e2e_full_dcs.json')),
            ),
        });
      }

      if (url.includes('log_event')) {
        logs.push(...JSON.parse(params.body).events);
      }

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('{}'),
      });
    });
  });

  it('has top level types', () => {
    // just checking this compiles
    let topLevelTypes: {
      options?: StatsigOptions;
      environment?: StatsigEnvironment;
      user?: StatsigUser;
      dc?: DynamicConfig;
      layer?: Layer;
      eventObj?: LogEventObject;
      callback?: RulesUpdatedCallback;
      dataAdapter?: IDataAdapter;
      adapterRes?: AdapterResponse;
    } = {};

    delete topLevelTypes['options'];
    expect(topLevelTypes).toEqual({});
  });

  test.each([
    ['import * as statsig from...', starsig],
    ['import Statsig from...', Statsig],
    ['const statsig = require(...', require('../index')],
  ])('test functionality for %p', async (title, statsig) => {
    clearStatsig(statsig);
    await statsig.initialize('secret-key');

    const gateResult = await statsig.checkGate(user, 'test_public');
    expect(gateResult).toBe(true);

    const config = await statsig.getConfig(user, 'test_email_config');
    expect(config.value).toEqual({ header_text: 'jkw only' });

    const experiment = await statsig.getExperiment(user, 'test_decision_made');
    expect(experiment.value).toEqual({ test: 'test' });

    const layer = await statsig.getLayer(user, 'test_layer');
    expect(layer.getValue('layer_param', 'error')).toEqual('test');

    await statsig.flush();
    expect(
      logs.map(
        (e) => `${e.eventName}::${e.metadata?.gate ?? e.metadata?.config}`,
      ),
    ).toEqual([
      'statsig::gate_exposure::test_public',
      'statsig::config_exposure::test_email_config',
      'statsig::config_exposure::test_decision_made',
      'statsig::layer_exposure::test_layer',
    ]);

    logs = [];

    statsig.logEvent(user, 'my-event');
    statsig.logEventObject({ user, eventName: 'my-event-object' });

    const bootstrap: any = statsig.getClientInitializeResponse(user);
    expect(
      bootstrap.dynamic_configs['JN6BkmQcONjB4I2IrM97mO5Pt7yc/6o7ehZLVJk4qcU='],
    ).toMatchObject({
      name: 'JN6BkmQcONjB4I2IrM97mO5Pt7yc/6o7ehZLVJk4qcU=',
    });

    statsig.overrideGate('gate_override', true);
    const gateOverrideResult = await statsig.checkGate(user, 'gate_override');
    expect(gateOverrideResult).toBe(true);

    statsig.overrideConfig('config_override', { foo: 1 });
    const configOverrideResult = await statsig.getConfig(
      user,
      'config_override',
    );
    expect(configOverrideResult.value).toEqual({ foo: 1 });

    statsig.shutdown();

    expect(
      logs.map(
        (e) =>
          `${e.eventName}::${e.metadata?.gate ?? e.metadata?.config ?? 'none'}`,
      ),
    ).toEqual([
      'my-event::none',
      'my-event-object::none',
      'statsig::gate_exposure::gate_override',
      'statsig::config_exposure::config_override',
    ]);
  });
});
