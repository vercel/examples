import ErrorBoundary, { ExceptionEndpoint } from '../ErrorBoundary';
import {
  StatsigInvalidArgumentError,
  StatsigTooManyRequestsError,
  StatsigUninitializedError,
} from '../Errors';
import { getStatsigMetadata } from '../utils/core';
jest.mock('node-fetch', () => jest.fn());

describe('ErrorBoundary', () => {
  let boundary: ErrorBoundary;
  let requests: { url: RequestInfo; params: RequestInit }[] = [];

  beforeEach(() => {
    boundary = new ErrorBoundary('secret-key');
    requests = [];

    const fetch = require('node-fetch');
    fetch.mockImplementation((url: RequestInfo, params: RequestInit) => {
      requests.push({ url: url.toString(), params });
      return Promise.resolve();
    });
  });

  it('recovers from error and returns result', () => {
    let called = false;
    const result = boundary.capture(
      () => {
        throw new URIError();
      },
      () => {
        called = true;
        return 'called';
      },
    );

    expect(called).toBe(true);
    expect(result).toEqual('called');
  });

  it('recovers from error and returns result', async () => {
    const result = await boundary.capture(
      () => Promise.reject(Error('bad')),
      () => Promise.resolve('good'),
    );

    expect(result).toEqual('good');
  });

  it('returns successful results when there is no crash', async () => {
    const result = await boundary.capture(
      () => Promise.resolve('success'),
      () => Promise.resolve('failure'),
    );

    expect(result).toEqual('success');
  });

  it('logs errors correctly', () => {
    const err = new URIError();
    boundary.swallow(() => {
      throw err;
    });

    expect(requests[0].url).toEqual(ExceptionEndpoint);

    expect(JSON.parse(requests[0].params.body.toString())).toEqual(
      expect.objectContaining({
        exception: 'URIError',
        info: err.stack,
      }),
    );
  });

  it('logs error-ish correctly', () => {
    const err = { 'sort-of-an-error': 'but-not-really' };
    boundary.swallow(() => {
      throw err;
    });

    expect(requests[0].url).toEqual(ExceptionEndpoint);
    expect(JSON.parse(requests[0].params.body.toString())).toEqual(
      expect.objectContaining({
        exception: 'No Name',
        info: JSON.stringify(err),
      }),
    );
  });

  it('logs the correct headers', () => {
    boundary.swallow(() => {
      throw new Error();
    });

    const metadata = getStatsigMetadata();
    expect(requests[0].params['headers']).toEqual(
      expect.objectContaining({
        'STATSIG-API-KEY': 'secret-key',
        'STATSIG-SDK-TYPE': metadata.sdkType,
        'STATSIG-SDK-VERSION': metadata.sdkVersion,
        'Content-Type': 'application/json',
        'Content-Length': expect.any(String),
      }),
    );
  });

  it('logs statsig metadata', () => {
    boundary.swallow(() => {
      throw new Error();
    });

    expect(JSON.parse(requests[0].params.body.toString())).toEqual(
      expect.objectContaining({
        statsigMetadata: getStatsigMetadata(),
      }),
    );
  });

  it('logs the same error only once', () => {
    boundary.swallow(() => {
      throw new Error();
    });

    expect(requests.length).toEqual(1);

    boundary.swallow(() => {
      throw new Error();
    });

    expect(requests.length).toEqual(1);
  });

  it('does not catch intended errors', () => {
    expect(() => {
      boundary.swallow(() => {
        throw new StatsigUninitializedError();
      });
    }).toThrow('Call and wait for initialize() to finish first.');

    expect(() => {
      boundary.swallow(() => {
        throw new StatsigInvalidArgumentError('bad arg');
      });
    }).toThrow('bad arg');

    expect(() => {
      boundary.swallow(() => {
        throw new StatsigTooManyRequestsError('slow down');
      });
    }).toThrow('slow down');
  });
});
