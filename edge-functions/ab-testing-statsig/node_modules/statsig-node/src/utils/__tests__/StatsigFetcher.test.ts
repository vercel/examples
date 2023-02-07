import { OptionsWithDefaults } from '../../StatsigOptions';
import StatsigFetcher from '../StatsigFetcher';

let calls = 0;

jest.mock('node-fetch', () => jest.fn());
// @ts-ignore
const fetch = require('node-fetch');
// @ts-ignore
fetch.mockImplementation((_url) => {
  calls++;
  if (calls == 1) {
    return Promise.reject();
  } else if (calls == 2) {
    return Promise.resolve({
      ok: true,
      status: 500,
      json: () =>
        Promise.resolve({
          name: 'gate_server',
          value: true,
          rule_id: 'rule_id_gate_server',
        }),
    });
  } else {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          value: true,
        }),
    });
  }
});

describe('Verify behavior of top level index functions', () => {
  let fetcher = new StatsigFetcher('secret-', OptionsWithDefaults({}));
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();

    fetcher = new StatsigFetcher('secret-', OptionsWithDefaults({}));
  });

  test('Test retries', async () => {
    const spy = jest.spyOn(fetcher, 'post');
    const result = await fetcher.post(
      'https://statsigapi.net/v1/test',
      { test: 123 },
      5,
      10,
    );
    expect(spy).toHaveBeenCalledTimes(3);
    // @ts-ignore
    const json = await result.json();
    expect(json).toEqual({ value: true });
  });
});
