"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _ofetch = require("ofetch");
var _ufo = require("ufo");
const defaultOptions = {
  repo: "",
  branch: "main",
  ttl: 600,
  dir: "",
  apiURL: "https://api.github.com",
  cdnURL: "https://raw.githubusercontent.com"
};
const DRIVER_NAME = "github";
module.exports = (0, _utils.defineDriver)(_opts => {
  const opts = {
    ...defaultOptions,
    ..._opts
  };
  const rawUrl = (0, _ufo.joinURL)(opts.cdnURL, opts.repo, opts.branch, opts.dir);
  let files = {};
  let lastCheck = 0;
  let syncPromise;
  const syncFiles = async () => {
    if (!opts.repo) {
      throw (0, _utils.createRequiredError)(DRIVER_NAME, "repo");
    }
    if (lastCheck + opts.ttl * 1e3 > Date.now()) {
      return;
    }
    if (!syncPromise) {
      syncPromise = fetchFiles(opts);
    }
    files = await syncPromise;
    lastCheck = Date.now();
    syncPromise = void 0;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    async getKeys() {
      await syncFiles();
      return Object.keys(files);
    },
    async hasItem(key) {
      await syncFiles();
      return key in files;
    },
    async getItem(key) {
      await syncFiles();
      const item = files[key];
      if (!item) {
        return null;
      }
      if (!item.body) {
        try {
          item.body = await (0, _ofetch.$fetch)(key.replace(/:/g, "/"), {
            baseURL: rawUrl,
            headers: opts.token ? {
              Authorization: `token ${opts.token}`
            } : void 0
          });
        } catch (error) {
          throw (0, _utils.createError)("github", `Failed to fetch \`${JSON.stringify(key)}\``, {
            cause: error
          });
        }
      }
      return item.body;
    },
    async getMeta(key) {
      await syncFiles();
      const item = files[key];
      return item ? item.meta : null;
    }
  };
});
async function fetchFiles(opts) {
  const prefix = (0, _ufo.withTrailingSlash)(opts.dir).replace(/^\//, "");
  const files = {};
  try {
    const trees = await (0, _ofetch.$fetch)(`/repos/${opts.repo}/git/trees/${opts.branch}?recursive=1`, {
      baseURL: opts.apiURL,
      headers: {
        "User-Agent": "unstorage",
        ...(opts.token && {
          Authorization: `token ${opts.token}`
        })
      }
    });
    for (const node of trees.tree) {
      if (node.type !== "blob" || !node.path.startsWith(prefix)) {
        continue;
      }
      const key = node.path.slice(prefix.length).replace(/\//g, ":");
      files[key] = {
        meta: {
          sha: node.sha,
          mode: node.mode,
          size: node.size
        }
      };
    }
    return files;
  } catch (error) {
    throw (0, _utils.createError)(DRIVER_NAME, "Failed to fetch git tree", {
      cause: error
    });
  }
}