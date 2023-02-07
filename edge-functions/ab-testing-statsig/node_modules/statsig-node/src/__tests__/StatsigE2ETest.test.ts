import * as statsigsdk from '../index';
// @ts-ignore
const statsig = statsigsdk.default;

const CONFIG_SPEC_RESPONSE = JSON.stringify(
  require('./data/download_config_spec.json'),
);

const INIT_RESPONSE = require('./data/initialize_response.json');
let postedLogs = {
  events: [],
};

jest.mock('node-fetch', () => jest.fn());
// @ts-ignore
const fetch = require('node-fetch');
// @ts-ignore
fetch.mockImplementation((url, params) => {
  if (url.includes('download_config_specs')) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(CONFIG_SPEC_RESPONSE),
    });
  }
  if (url.includes('log_event')) {
    postedLogs = JSON.parse(params.body);
    return Promise.resolve({
      ok: true,
    });
  }
  if (url.includes('get_id_lists')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  }
  if (url.includes('check_gate')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'gate_name',
          value: true,
          rule_id: 'fallback_from_server',
        }),
    });
  }
  if (url.includes('get_config')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'config_name',
          value: {
            newParam: 'I come from a land down under',
            walk: 10000,
            go: true,
          },
          rule_id: 'fallback_from_server',
        }),
    });
  }
  return Promise.reject();
});

describe('Verify e2e behavior of the SDK with mocked network', () => {
  jest.mock('node-fetch', () => jest.fn());
  const statsigUser = {
    userID: '123',
    email: 'testuser@statsig.com',
  };
  const randomUser = {
    userID: 'random',
    privateAttributes: {
      email: undefined,
    },
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();

    statsig._instance = null;
    postedLogs = {
      events: [],
    };
  });

  test('Verify checkGate and exposure logs', async () => {
    await statsig.initialize('secret-123');
    expect(statsig.getClientInitializeResponse(statsigUser)).toEqual(
      INIT_RESPONSE,
    );
    const on1 = await statsig.checkGate(statsigUser, 'always_on_gate');
    expect(on1).toEqual(true);

    const on2 = await statsig.checkGate(statsigUser, 'always_on_gate');
    expect(on2).toEqual(true);

    const on3 = await statsig.checkGate(statsigUser, 'always_on_gate');
    expect(on3).toEqual(true);

    const passingEmail = await statsig.checkGate(
      statsigUser,
      'on_for_statsig_email',
    );
    expect(passingEmail).toEqual(true);
    const failingEmail = await statsig.checkGate(
      randomUser,
      'on_for_statsig_email',
    );
    expect(failingEmail).toEqual(false);

    // fetch from server does not log an exposure
    const fetchFromServer = await statsig.checkGate(
      statsigUser,
      'fetch_from_server_fallback',
    );
    expect(fetchFromServer).toEqual(true);

    statsig.shutdown();
    expect(postedLogs.events.length).toEqual(3);
    expect(postedLogs.events[0].eventName).toEqual('statsig::gate_exposure');
    expect(postedLogs.events[0].metadata['gate']).toEqual('always_on_gate');
    expect(postedLogs.events[0].metadata['gateValue']).toEqual('true');
    expect(postedLogs.events[0].metadata['ruleID']).toEqual(
      '2DWuOvXQZWKvoaNm27dqcs',
    );

    expect(postedLogs.events[1].eventName).toEqual('statsig::gate_exposure');
    expect(postedLogs.events[1].metadata['gate']).toEqual(
      'on_for_statsig_email',
    );
    expect(postedLogs.events[1].metadata['gateValue']).toEqual('true');
    expect(postedLogs.events[1].metadata['ruleID']).toEqual(
      '3jdTW54SQWbbxFFZJe7wYZ',
    );

    expect(postedLogs.events[2].eventName).toEqual('statsig::gate_exposure');
    expect(postedLogs.events[2].metadata['gate']).toEqual(
      'on_for_statsig_email',
    );
    expect(postedLogs.events[2].metadata['gateValue']).toEqual('false');
    expect(postedLogs.events[2].metadata['ruleID']).toEqual('default');
  });

  test('Verify getConfig and exposure logs', async () => {
    await statsig.initialize('secret-123');
    let config = await statsig.getConfig(statsigUser, 'test_config');
    expect(config.get('number', 0)).toEqual(7);
    expect(config.get('string', '')).toEqual('statsig');
    expect(config.get('boolean', true)).toEqual(false);
    config = await statsig.getConfig(randomUser, 'test_config');
    expect(config.get('number', 0)).toEqual(4);
    expect(config.get('string', '')).toEqual('default');
    expect(config.get('boolean', false)).toEqual(true);

    // fetch from server does not log an exposure
    config = await statsig.getConfig(statsigUser, 'test_config_fallback');
    expect(config.get('newParam', 'default')).toEqual(
      'I come from a land down under',
    );
    expect(config.get('walk', 10)).toEqual(10000);
    expect(config.get('go', false)).toEqual(true);

    statsig.shutdown();
    expect(postedLogs.events.length).toEqual(2);
    expect(postedLogs.events[0].eventName).toEqual('statsig::config_exposure');
    expect(postedLogs.events[0].metadata['config']).toEqual('test_config');
    expect(postedLogs.events[0].metadata['ruleID']).toEqual(
      '4lInPNRUnjUzaWNkEWLFA9',
    );

    expect(postedLogs.events[1].eventName).toEqual('statsig::config_exposure');
    expect(postedLogs.events[1].metadata['config']).toEqual('test_config');
    expect(postedLogs.events[1].metadata['ruleID']).toEqual('default');
  });

  test('Verify getExperiment and exposure logs', async () => {
    await statsig.initialize('secret-123');
    let experiment = await statsig.getExperiment(
      statsigUser,
      'sample_experiment',
    );
    expect(experiment.get('sample_parameter', true)).toEqual(false);
    experiment = await statsig.getExperiment(randomUser, 'sample_experiment');
    expect(experiment.get('sample_parameter', false)).toEqual(true);

    statsig.shutdown();
    expect(postedLogs.events.length).toEqual(2);
    expect(postedLogs.events[0].eventName).toEqual('statsig::config_exposure');
    expect(postedLogs.events[0].metadata['config']).toEqual(
      'sample_experiment',
    );
    expect(postedLogs.events[0].metadata['ruleID']).toEqual(
      '5yQbPMfmKQdiRV35hS3B2l',
    );

    expect(postedLogs.events[1].eventName).toEqual('statsig::config_exposure');
    expect(postedLogs.events[1].metadata['config']).toEqual(
      'sample_experiment',
    );
    expect(postedLogs.events[1].metadata['ruleID']).toEqual(
      '5yQbPNUpd8mNbkB0SZZeln',
    );
  });

  test('Verify getLayer and exposure logs', async () => {
    await statsig.initialize('secret-123');

    // should delegate to a bad config, which fetches from the server
    let layer = await statsig.getLayer(
      statsigUser,
      'd_layer_delegate_to_fallback',
    );
    expect(layer.get('newParam', 'default')).toEqual(
      'I come from a land down under',
    );
    expect(layer.get('walk', 10)).toEqual(10000);
    expect(layer.get('go', false)).toEqual(true);

    statsig.shutdown();
    // fallback does not log an exposure, so nothing gets set here
    expect(postedLogs.events).toEqual([]);
  });

  test('Verify logEvent', async () => {
    await statsig.initialize('secret-123');
    statsig.logEvent(statsigUser, 'add_to_cart', 'SKU_12345', {
      price: '9.99',
      item_name: 'diet_coke_48_pack',
    });
    statsig.shutdown();

    expect(postedLogs.events.length).toEqual(1);
    expect(postedLogs.events[0].eventName).toEqual('add_to_cart');
    expect(postedLogs.events[0].value).toEqual('SKU_12345');
    expect(postedLogs.events[0].metadata['price']).toEqual('9.99');
    expect(postedLogs.events[0].metadata['item_name']).toEqual(
      'diet_coke_48_pack',
    );
    expect(postedLogs.events[0].user.userID).toEqual('123');
    expect(postedLogs.events[0].user.email).toEqual('testuser@statsig.com');
  });
});
