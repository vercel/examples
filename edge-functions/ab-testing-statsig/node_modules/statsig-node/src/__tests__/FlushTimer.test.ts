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
  return Promise.reject();
});

describe('Verify e2e behavior of the SDK with mocked network', () => {
  jest.mock('node-fetch', () => jest.fn());
  const statsigUser = {
    userID: '123',
    email: 'testuser@statsig.com',
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    jest.useFakeTimers();

    statsig._instance = null;
    postedLogs = {
      events: [],
    };
  });

  test('Verify checkGate and exposure logs', async () => {
    expect.assertions(2);
    await statsig.initialize('secret-123');

    const spy = jest.spyOn(statsig['_instance']['_logger']['fetcher'], 'post');

    const on1 = await statsig.checkGate(statsigUser, 'always_on_gate');
    expect(on1).toEqual(true);
    // trigger the flush
    jest.runOnlyPendingTimers();
    expect(spy).toHaveBeenCalled();
  });
});
