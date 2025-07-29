// We retry:
//  - when receiving a rate limiting response
//  - on network failures due to timeouts
export const shouldRetry = function ({ response = {}, error = {}, method = {} }) {
    if (response.status === RATE_LIMIT_STATUS || RETRY_ERROR_CODES.has(error.code)) {
        return true;
    }
    // Special case for the `getLatestPluginRuns` endpoint.
    // See https://github.com/netlify/bitballoon/issues/9616.
    if (method.operationId === 'getLatestPluginRuns' && response.status === 500) {
        return true;
    }
    return false;
};
export const waitForRetry = async function (response) {
    const delay = getDelay(response);
    await sleep(delay);
};
const getDelay = function (response) {
    if (response === undefined) {
        return DEFAULT_RETRY_DELAY;
    }
    const rateLimitReset = response.headers.get(RATE_LIMIT_HEADER);
    if (!rateLimitReset) {
        return DEFAULT_RETRY_DELAY;
    }
    return Math.max(Number(rateLimitReset) * SECS_TO_MSECS - Date.now(), MIN_RETRY_DELAY);
};
const sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
const DEFAULT_RETRY_DELAY = 5e3;
const MIN_RETRY_DELAY = 1e3;
const SECS_TO_MSECS = 1e3;
export const MAX_RETRY = 5;
const RATE_LIMIT_STATUS = 429;
const RATE_LIMIT_HEADER = 'X-RateLimit-Reset';
const RETRY_ERROR_CODES = new Set(['ETIMEDOUT', 'ECONNRESET']);
