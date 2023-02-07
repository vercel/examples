import DynamicConfig from '../DynamicConfig';
import { ExceptionEndpoint } from '../ErrorBoundary';
import Layer from '../Layer';
import StatsigServer from '../StatsigServer';
jest.mock('node-fetch', () => jest.fn());

const user = { userID: 'dloomb' };

const oneLoggedError = (functionName: string) => {
  return [
    expect.objectContaining({
      url: ExceptionEndpoint,
      params: expect.objectContaining({
        body: expect.stringContaining(
          `exception":"TypeError","info":"TypeError: this.${functionName} is not a function`,
        ),
      }),
    }),
  ];
};

describe('Statsig ErrorBoundary Usage', () => {
  let requests: { url: RequestInfo; params: RequestInit }[] = [];
  let statsig: StatsigServer;

  beforeEach(async () => {
    const fetch = require('node-fetch');
    fetch.mockImplementation((url: RequestInfo, params: RequestInit) => {
      requests.push({ url, params });
      return Promise.resolve();
    });

    statsig = new StatsigServer('secret-key');
    await statsig.initializeAsync();

    requests = [];

    // 1 Causes not a function errors
    // @ts-ignore
    statsig._evaluator = {
      resetSyncTimerIfExited: () => {
        return null;
      },
    };
    // @ts-ignore
    statsig._logger = 1;
  });

  it('recovers from error and returns default gate value', async () => {
    const result = await statsig.checkGate(user, 'a_gate');
    expect(result).toBe(false);
    expect(requests).toEqual(oneLoggedError('_evaluator.checkGate'));
  });

  it('recovers from error and returns default config value', async () => {
    const result = await statsig.getConfig(user, 'a_config');
    expect(result instanceof DynamicConfig).toBe(true);
    expect(result.value).toEqual({});
    expect(requests).toEqual(oneLoggedError('_evaluator.getConfig'));
  });

  it('recovers from error and returns default experiment value', async () => {
    const result = await statsig.getExperiment(user, 'an_experiment');
    expect(result instanceof DynamicConfig).toBe(true);
    expect(result.value).toEqual({});
    expect(requests).toEqual(oneLoggedError('_evaluator.getConfig'));
  });

  it('recovers from error and returns default layer value', async () => {
    const result = await statsig.getLayer(user, 'a_layer');
    expect(result instanceof Layer).toBe(true);
    // @ts-ignore
    expect(result._value).toEqual({});
    expect(requests).toEqual(oneLoggedError('_evaluator.getLayer'));
  });

  it('recovers from error with getClientInitializeResponse', () => {
    const result = statsig.getClientInitializeResponse(user);
    expect(result).toBeNull();
    expect(requests).toEqual(
      oneLoggedError('_evaluator.getClientInitializeResponse'),
    );
  });

  it('recovers from error with logEvent', () => {
    statsig.logEvent(user, 'an_event');
    expect(requests).toEqual(oneLoggedError('_logger.log'));
  });

  it('recovers from error with logEventObject', () => {
    statsig.logEventObject({ user, eventName: 'an_event' });
    expect(requests).toEqual(oneLoggedError('_logger.log'));
  });

  it('recovers from error with shutdown', () => {
    statsig.shutdown();
    expect(requests).toEqual(oneLoggedError('_logger.shutdown'));
  });

  it('recovers from error with overrideGate', () => {
    statsig.overrideGate('a_gate', true);
    expect(requests).toEqual(oneLoggedError('_evaluator.overrideGate'));
  });

  it('recovers from error with overrideConfig', () => {
    statsig.overrideConfig('a_config', {});
    expect(requests).toEqual(oneLoggedError('_evaluator.overrideConfig'));
  });

  it('recovers from error with overrideConfig', async () => {
    await statsig.flush();
    expect(requests).toEqual(oneLoggedError('_logger.flush'));
  });

  it('recovers from error with initialize', async () => {
    // @ts-ignore
    statsig._ready = false;
    await statsig.initializeAsync();
    expect(requests).toEqual(oneLoggedError('_evaluator.init'));
    // @ts-ignore
    expect(statsig._ready).toBeTruthy();
  });
});
