"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ofetch = require("ofetch");
var _utils = require("./utils/index.cjs");
const DRIVER_NAME = "cloudflare-kv-http";
module.exports = (0, _utils.defineDriver)(opts => {
  if (!opts.accountId) {
    throw (0, _utils.createRequiredError)(DRIVER_NAME, "accountId");
  }
  if (!opts.namespaceId) {
    throw (0, _utils.createRequiredError)(DRIVER_NAME, "namespaceId");
  }
  let headers;
  if ("apiToken" in opts) {
    headers = {
      Authorization: `Bearer ${opts.apiToken}`
    };
  } else if ("userServiceKey" in opts) {
    headers = {
      "X-Auth-User-Service-Key": opts.userServiceKey
    };
  } else if (opts.email && opts.apiKey) {
    headers = {
      "X-Auth-Email": opts.email,
      "X-Auth-Key": opts.apiKey
    };
  } else {
    throw (0, _utils.createError)(DRIVER_NAME, "One of the `apiToken`, `userServiceKey`, or a combination of `email` and `apiKey` is required.");
  }
  const apiURL = opts.apiURL || "https://api.cloudflare.com";
  const baseURL = `${apiURL}/client/v4/accounts/${opts.accountId}/storage/kv/namespaces/${opts.namespaceId}`;
  const kvFetch = _ofetch.$fetch.create({
    baseURL,
    headers
  });
  const r = (key = "") => opts.base ? (0, _utils.joinKeys)(opts.base, key) : key;
  const hasItem = async key => {
    try {
      const res = await kvFetch(`/metadata/${r(key)}`);
      return res?.success === true;
    } catch (err) {
      if (!err?.response) {
        throw err;
      }
      if (err?.response?.status === 404) {
        return false;
      }
      throw err;
    }
  };
  const getItem = async key => {
    try {
      return await kvFetch(`/values/${r(key)}`).then(r2 => r2.text());
    } catch (err) {
      if (!err?.response) {
        throw err;
      }
      if (err?.response?.status === 404) {
        return null;
      }
      throw err;
    }
  };
  const setItem = async (key, value, topts) => {
    return await kvFetch(`/values/${r(key)}`, {
      method: "PUT",
      body: value,
      query: topts?.ttl ? {
        expiration_ttl: Math.max(topts?.ttl, opts.minTTL || 60)
      } : void 0
    });
  };
  const removeItem = async key => {
    return await kvFetch(`/values/${r(key)}`, {
      method: "DELETE"
    });
  };
  const getKeys = async base => {
    const keys = [];
    const params = {};
    if (base || opts.base) {
      params.prefix = r(base);
    }
    const firstPage = await kvFetch("/keys", {
      params
    });
    for (const item of firstPage.result) {
      keys.push(item.name);
    }
    const cursor = firstPage.result_info.cursor;
    if (cursor) {
      params.cursor = cursor;
    }
    while (params.cursor) {
      const pageResult = await kvFetch("/keys", {
        params
      });
      for (const item of pageResult.result) {
        keys.push(item.name);
      }
      const pageCursor = pageResult.result_info.cursor;
      params.cursor = pageCursor ? pageCursor : void 0;
    }
    return keys;
  };
  const clear = async () => {
    const keys = await getKeys();
    const chunks = keys.reduce((acc, key, i) => {
      if (i % 1e4 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(key);
      return acc;
    }, [[]]);
    await Promise.all(chunks.map(chunk => {
      if (chunk.length > 0) {
        return kvFetch("/bulk/delete", {
          method: "POST",
          body: chunk
        });
      }
    }));
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem,
    getItem,
    setItem,
    removeItem,
    getKeys: base => getKeys(base).then(keys => keys.map(key => opts.base ? key.slice(opts.base.length) : key)),
    clear
  };
});