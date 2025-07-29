import { createError, createRequiredError, defineDriver } from "./utils/index.mjs";
import { $fetch } from "ofetch";
import { withTrailingSlash, joinURL } from "ufo";
const defaultOptions = {
  repo: "",
  branch: "main",
  ttl: 600,
  dir: "",
  apiURL: "https://api.github.com",
  cdnURL: "https://raw.githubusercontent.com"
};
const DRIVER_NAME = "github";
export default defineDriver((_opts) => {
  const opts = { ...defaultOptions, ..._opts };
  const rawUrl = joinURL(opts.cdnURL, opts.repo, opts.branch, opts.dir);
  let files = {};
  let lastCheck = 0;
  let syncPromise;
  const syncFiles = async () => {
    if (!opts.repo) {
      throw createRequiredError(DRIVER_NAME, "repo");
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
          item.body = await $fetch(key.replace(/:/g, "/"), {
            baseURL: rawUrl,
            headers: opts.token ? {
              Authorization: `token ${opts.token}`
            } : void 0
          });
        } catch (error) {
          throw createError(
            "github",
            `Failed to fetch \`${JSON.stringify(key)}\``,
            { cause: error }
          );
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
  const prefix = withTrailingSlash(opts.dir).replace(/^\//, "");
  const files = {};
  try {
    const trees = await $fetch(
      `/repos/${opts.repo}/git/trees/${opts.branch}?recursive=1`,
      {
        baseURL: opts.apiURL,
        headers: {
          "User-Agent": "unstorage",
          ...opts.token && { Authorization: `token ${opts.token}` }
        }
      }
    );
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
    throw createError(DRIVER_NAME, "Failed to fetch git tree", {
      cause: error
    });
  }
}
