import * as statsigsdk from '../index';
// @ts-ignore
const statsig = statsigsdk.default;

const exampleConfigSpecs = require('./jest.setup');

jest.mock('node-fetch', () => jest.fn());
// @ts-ignore
const fetch = require('node-fetch');

const jsonResponse = {
  time: Date.now(),
  feature_gates: [exampleConfigSpecs.gate, exampleConfigSpecs.disabled_gate],
  dynamic_configs: [exampleConfigSpecs.config],
  layer_configs: [],
  id_lists: {},
  has_updates: true,
};

// @ts-ignore
fetch.mockImplementation((url) => {
  if (url.includes('download_config_specs')) {
    return new Promise((res) => {
      setTimeout(
        () =>
          res({
            ok: true,
            json: () => Promise.resolve(jsonResponse),
            text: () => Promise.resolve(JSON.stringify(jsonResponse)),
          }),
        1000,
      );
    });
  }
  return Promise.reject();
});

describe('Test local mode with overrides', () => {
  jest.setTimeout(3000);

  jest.useFakeTimers();

  beforeEach(() => {
    let now = Date.now();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now);
    jest.resetModules();
    jest.restoreAllMocks();

    statsig._instance = null;
  });

  test('Verify initialize() returns early when the network request takes too long', async () => {
    const prom = statsig.initialize('secret-abcdefg1234567890', {
      initTimeoutMs: 250,
    });
    const now = Date.now();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now + 200);
    jest.advanceTimersByTime(200);
    jest.spyOn(global.Date, 'now').mockImplementation(() => now + 400);
    jest.advanceTimersByTime(200);

    await prom;
    expect(statsig._instance['_ready']).toBeTruthy();
    expect(prom).resolves;
    expect(
      statsig.checkGate(
        { userID: 'test_user_id', email: 'test@nfl.com' },
        'nfl_gate',
      ),
    ).resolves.toBe(false);
  });

  test('Verify initialize() can resolve before the specified timeout and serve requests', async () => {
    const prom = statsig.initialize('secret-abcdefg1234567890', {
      initTimeoutMs: 3000,
    });
    const now = Date.now();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now + 1200);
    jest.advanceTimersByTime(1200);
    await prom;
    expect(statsig._instance['_ready']).toBeTruthy();
    expect(
      statsig.checkGate(
        { userID: 'test_user_id', email: 'test@nfl.com' },
        'nfl_gate',
      ),
    ).resolves.toBe(true);
  });
});
