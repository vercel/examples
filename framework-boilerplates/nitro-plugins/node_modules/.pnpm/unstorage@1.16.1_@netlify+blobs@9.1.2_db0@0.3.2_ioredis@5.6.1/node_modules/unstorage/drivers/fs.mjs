import { existsSync, promises as fsp } from "node:fs";
import { resolve, relative, join } from "node:path";
import { watch } from "chokidar";
import anymatch from "anymatch";
import { createError, createRequiredError, defineDriver } from "./utils/index.mjs";
import {
  readFile,
  writeFile,
  readdirRecursive,
  rmRecursive,
  unlink
} from "./utils/node-fs.mjs";
const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs";
export default defineDriver((userOptions = {}) => {
  if (!userOptions.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  const base = resolve(userOptions.base);
  const ignore = anymatch(
    userOptions.ignore || ["**/node_modules/**", "**/.git/**"]
  );
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(base, key.replace(/:/g, "/"));
    return resolved;
  };
  let _watcher;
  const _unwatch = async () => {
    if (_watcher) {
      await _watcher.close();
      _watcher = void 0;
    }
  };
  return {
    name: DRIVER_NAME,
    options: userOptions,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await fsp.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (userOptions.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (userOptions.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (userOptions.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), ignore, topts?.maxDepth);
    },
    async clear() {
      if (userOptions.readOnly || userOptions.noClear) {
        return;
      }
      await rmRecursive(r("."));
    },
    async dispose() {
      if (_watcher) {
        await _watcher.close();
      }
    },
    async watch(callback) {
      if (_watcher) {
        return _unwatch;
      }
      await new Promise((resolve2, reject) => {
        const watchOptions = {
          ignoreInitial: true,
          ...userOptions.watchOptions
        };
        if (!watchOptions.ignored) {
          watchOptions.ignored = [];
        } else if (Array.isArray(watchOptions.ignored)) {
          watchOptions.ignored = [...watchOptions.ignored];
        } else {
          watchOptions.ignored = [watchOptions.ignored];
        }
        watchOptions.ignored.push(ignore);
        _watcher = watch(base, watchOptions).on("ready", () => {
          resolve2();
        }).on("error", reject).on("all", (eventName, path) => {
          path = relative(base, path);
          if (eventName === "change" || eventName === "add") {
            callback("update", path);
          } else if (eventName === "unlink") {
            callback("remove", path);
          }
        });
      });
      return _unwatch;
    }
  };
});
