import { defineDriver } from "./utils/index.mjs";
import { $fetch as _fetch } from "ofetch";
import { joinURL } from "ufo";
const DRIVER_NAME = "http";
export default defineDriver((opts) => {
  const r = (key = "") => joinURL(opts.base, key.replace(/:/g, "/"));
  const rBase = (key = "") => joinURL(opts.base, (key || "/").replace(/:/g, "/"), ":");
  const catchFetchError = (error, fallbackVal = null) => {
    if (error?.response?.status === 404) {
      return fallbackVal;
    }
    throw error;
  };
  const getHeaders = (topts, defaultHeaders) => {
    const headers = {
      ...defaultHeaders,
      ...opts.headers,
      ...topts?.headers
    };
    if (topts?.ttl && !headers["x-ttl"]) {
      headers["x-ttl"] = topts.ttl + "";
    }
    return headers;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key, topts) {
      return _fetch(r(key), {
        method: "HEAD",
        headers: getHeaders(topts)
      }).then(() => true).catch((err) => catchFetchError(err, false));
    },
    async getItem(key, tops) {
      const value = await _fetch(r(key), {
        headers: getHeaders(tops)
      }).catch(catchFetchError);
      return value;
    },
    async getItemRaw(key, topts) {
      const response = await _fetch.raw(r(key), {
        responseType: "arrayBuffer",
        headers: getHeaders(topts, { accept: "application/octet-stream" })
      }).catch(catchFetchError);
      return response._data;
    },
    async getMeta(key, topts) {
      const res = await _fetch.raw(r(key), {
        method: "HEAD",
        headers: getHeaders(topts)
      });
      let mtime = void 0;
      let ttl = void 0;
      const _lastModified = res.headers.get("last-modified");
      if (_lastModified) {
        mtime = new Date(_lastModified);
      }
      const _ttl = res.headers.get("x-ttl");
      if (_ttl) {
        ttl = Number.parseInt(_ttl, 10);
      }
      return {
        status: res.status,
        mtime,
        ttl
      };
    },
    async setItem(key, value, topts) {
      await _fetch(r(key), {
        method: "PUT",
        body: value,
        headers: getHeaders(topts)
      });
    },
    async setItemRaw(key, value, topts) {
      await _fetch(r(key), {
        method: "PUT",
        body: value,
        headers: getHeaders(topts, {
          "content-type": "application/octet-stream"
        })
      });
    },
    async removeItem(key, topts) {
      await _fetch(r(key), {
        method: "DELETE",
        headers: getHeaders(topts)
      });
    },
    async getKeys(base, topts) {
      const value = await _fetch(rBase(base), {
        headers: getHeaders(topts)
      });
      return Array.isArray(value) ? value : [];
    },
    async clear(base, topts) {
      await _fetch(rBase(base), {
        method: "DELETE",
        headers: getHeaders(topts)
      });
    }
  };
});
