import * as statsigsdk from '../index';
// @ts-ignore
const statsig = statsigsdk.default;

const exampleConfigSpecs = require('./jest.setup');

const jsonResponse = {
  time: Date.now(),
  feature_gates: [exampleConfigSpecs.gate, exampleConfigSpecs.disabled_gate],
  dynamic_configs: [exampleConfigSpecs.config],
  layer_configs: [exampleConfigSpecs.allocated_layer],
  has_updates: true,
};

jest.mock('node-fetch', () => jest.fn());
// @ts-ignore
const fetch = require('node-fetch');
// @ts-ignore
fetch.mockImplementation((url, params) => {
  if (url.includes('download_config_specs')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(jsonResponse),
      text: () => Promise.resolve(JSON.stringify(jsonResponse)),
    });
  }
  if (url.includes('get_id_lists')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          list_1: {
            name: 'list_1',
            size: 15,
            url: 'https://id_list_content/list_1',
            fileID: 'file_id_1',
            creationTime: 1,
          },
        }),
    });
  }
  return Promise.reject();
});

describe('Verify sync intervals reset', () => {
  const secretKey = 'secret-key';
  const str_64 =
    '1234567890123456789012345678901234567890123456789012345678901234';
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    jest.useFakeTimers();

    statsig._instance = null;
  });

  test('Verify timers reset if rulesets stale', async () => {
    expect.assertions(6);
    await statsig.initialize(secretKey);
    let now = Date.now();
    const spy = jest.spyOn(
      statsig['_instance']['_evaluator']['store'],
      'pollForUpdates',
    );

    let gate = await statsig.checkGate(
      { userID: '123', email: 'tore@packers.com' },
      'nfl_gate',
    );
    expect(gate).toBe(true);
    expect(spy).toHaveBeenCalledTimes(0);

    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => now + (2 * 60 * 1000 - 100));
    gate = await statsig.checkGate(
      { userID: '123', email: 'tore@packers.com' },
      'nfl_gate',
    );
    expect(gate).toBe(true);
    expect(spy).toHaveBeenCalledTimes(0);

    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => now + (2 * 60 * 1000 + 1));
    gate = await statsig.checkGate(
      { userID: '123', email: 'tore@packers.com' },
      'nfl_gate',
    );
    expect(gate).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
