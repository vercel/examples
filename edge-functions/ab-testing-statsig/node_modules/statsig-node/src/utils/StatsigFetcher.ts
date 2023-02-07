import {
  StatsigLocalModeNetworkError,
  StatsigTooManyRequestsError,
} from '../Errors';
import { ExplicitStatsigOptions } from '../StatsigOptions';
import { getSDKType, getSDKVersion } from './core';
import Dispatcher from './Dispatcher';
import safeFetch from './safeFetch';

const { v4: uuidv4 } = require('uuid');

const retryStatusCodes = [408, 500, 502, 503, 504, 522, 524, 599];
export default class StatsigFetcher {
  private sessionID: string;
  private leakyBucket: Record<string, number>;
  private pendingTimers: NodeJS.Timer[];
  private dispatcher: Dispatcher;
  private localMode: boolean;
  private sdkKey: string;

  public constructor(secretKey: string, options: ExplicitStatsigOptions) {
    this.sessionID = uuidv4();
    this.leakyBucket = {};
    this.pendingTimers = [];
    this.dispatcher = new Dispatcher(200);
    this.localMode = options.localMode;
    this.sdkKey = secretKey;
  }

  public dispatch(
    url: string,
    body: Record<string, unknown>,
    timeout: number,
  ): Promise<Response> {
    return this.dispatcher.enqueue(this.post(url, body), timeout);
  }

  public post(
    url: string,
    body: Record<string, unknown>,
    retries: number = 0,
    backoff: number = 1000,
  ): Promise<Response> {
    if (this.localMode) {
      return Promise.reject(new StatsigLocalModeNetworkError());
    }
    const counter = this.leakyBucket[url];
    if (counter != null && counter >= 1000) {
      return Promise.reject(
        new StatsigTooManyRequestsError(
          'Request failed because you are making the same request too frequently.',
        ),
      );
    }
    if (counter == null) {
      this.leakyBucket[url] = 1;
    } else {
      this.leakyBucket[url] = counter + 1;
    }

    const params = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'STATSIG-API-KEY': this.sdkKey,
        'STATSIG-CLIENT-TIME': Date.now(),
        'STATSIG-SERVER-SESSION-ID': this.sessionID,
        'STATSIG-SDK-TYPE': getSDKType(),
        'STATSIG-SDK-VERSION': getSDKVersion(),
      },
    };
    return safeFetch(url, params)
      .then((res) => {
        if ((!res.ok || retryStatusCodes.includes(res.status)) && retries > 0) {
          return this._retry(url, body, retries, backoff);
        } else if (!res.ok) {
          return Promise.reject(
            new Error(
              'Request to ' + url + ' failed with status ' + res.status,
            ),
          );
        }
        return Promise.resolve(res);
      })
      .catch((e) => {
        if (retries > 0) {
          return this._retry(url, body, retries, backoff);
        }
        return Promise.reject(e);
      })
      .finally(() => {
        this.leakyBucket[url] = Math.max(this.leakyBucket[url] - 1, 0);
      });
  }

  public shutdown(): void {
    if (this.pendingTimers != null) {
      this.pendingTimers.forEach((timer) => {
        if (timer != null) {
          clearTimeout(timer);
        }
      });
    }
    if (this.dispatcher != null) {
      this.dispatcher.shutdown();
    }
  }

  private _retry(
    url: string,
    body: Record<string, unknown>,
    retries: number,
    backoff: number,
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.pendingTimers.push(
        setTimeout(() => {
          this.leakyBucket[url] = Math.max(this.leakyBucket[url] - 1, 0);
          this.post(url, body, retries - 1, backoff * 10)
            .then(resolve)
            .catch(reject);
        }, backoff).unref(),
      );
    });
  }
}
