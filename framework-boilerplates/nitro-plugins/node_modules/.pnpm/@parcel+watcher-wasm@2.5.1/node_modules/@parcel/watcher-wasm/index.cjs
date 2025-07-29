var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// wasm/import.meta.url-polyfill.js
var import_meta_url;
var init_import_meta_url_polyfill = __esm({
  "wasm/import.meta.url-polyfill.js"() {
    import_meta_url = typeof document === "undefined" ? new (require("url".replace("", ""))).URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
  }
});

// npm/wasm/wrapper.js
var require_wrapper = __commonJS({
  "npm/wasm/wrapper.js"(exports) {
    init_import_meta_url_polyfill();
    var path = require("path");
    var micromatch = require("micromatch");
    var isGlob = require("is-glob");
    function normalizeOptions(dir, opts = {}) {
      const { ignore, ...rest } = opts;
      if (Array.isArray(ignore)) {
        opts = { ...rest };
        for (const value of ignore) {
          if (isGlob(value)) {
            if (!opts.ignoreGlobs) {
              opts.ignoreGlobs = [];
            }
            const regex = micromatch.makeRe(value, {
              // We set `dot: true` to workaround an issue with the
              // regular expression on Linux where the resulting
              // negative lookahead `(?!(\\/|^)` was never matching
              // in some cases. See also https://bit.ly/3UZlQDm
              dot: true,
              // C++ does not support lookbehind regex patterns, they
              // were only added later to JavaScript engines
              // (https://bit.ly/3V7S6UL)
              lookbehinds: false
            });
            opts.ignoreGlobs.push(regex.source);
          } else {
            if (!opts.ignorePaths) {
              opts.ignorePaths = [];
            }
            opts.ignorePaths.push(path.resolve(dir, value));
          }
        }
      }
      return opts;
    }
    exports.createWrapper = (binding) => {
      return {
        writeSnapshot(dir, snapshot, opts) {
          return binding.writeSnapshot(
            path.resolve(dir),
            path.resolve(snapshot),
            normalizeOptions(dir, opts)
          );
        },
        getEventsSince(dir, snapshot, opts) {
          return binding.getEventsSince(
            path.resolve(dir),
            path.resolve(snapshot),
            normalizeOptions(dir, opts)
          );
        },
        async subscribe(dir, fn, opts) {
          dir = path.resolve(dir);
          opts = normalizeOptions(dir, opts);
          await binding.subscribe(dir, fn, opts);
          return {
            unsubscribe() {
              return binding.unsubscribe(dir, fn, opts);
            }
          };
        },
        unsubscribe(dir, fn, opts) {
          return binding.unsubscribe(
            path.resolve(dir),
            fn,
            normalizeOptions(dir, opts)
          );
        }
      };
    };
  }
});

// npm/wasm/index.mjs
var wasm_exports = {};
__export(wasm_exports, {
  getEventsSince: () => getEventsSince,
  subscribe: () => subscribe,
  unsubscribe: () => unsubscribe,
  writeSnapshot: () => writeSnapshot
});
module.exports = __toCommonJS(wasm_exports);
init_import_meta_url_polyfill();
var import_napi_wasm = require("napi-wasm");
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_wrapper = __toESM(require_wrapper(), 1);
var env;
var encoder = new TextEncoder();
var constants = {
  O_ACCMODE: 3,
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  O_CREAT: 64,
  O_EXCL: 128,
  O_NOCTTY: 256,
  O_TRUNC: 512,
  O_APPEND: 1024,
  O_NONBLOCK: 2048,
  O_SYNC: 4096,
  FASYNC: 8192,
  O_DIRECT: 16384,
  O_LARGEFILE: 32768,
  O_DIRECTORY: 65536,
  O_NOFOLLOW: 131072,
  O_NOATIME: 262144,
  O_CLOEXEC: 524288
};
import_napi_wasm.napi.napi_get_last_error_info = () => {
};
var fds = /* @__PURE__ */ new Map();
var dirs = /* @__PURE__ */ new Map();
var regexCache = /* @__PURE__ */ new Map();
var watches = [null];
var wasm_env = {
  __syscall_newfstatat(dirfd, path, buf, flags) {
    let dir = dirfd === -100 ? process.cwd() : fds.get(dirfd).path;
    let p = import_path.default.resolve(dir, env.getString(path));
    let nofollow = flags & 256;
    try {
      let stat = nofollow ? import_fs.default.lstatSync(p, { bigint: true }) : import_fs.default.statSync(p, { bigint: true });
      return writeStat(stat, buf);
    } catch (err) {
      env.i32[env.instance.exports.__errno_location >> 2] = err.errno;
      return -1;
    }
  },
  __syscall_lstat64(path, buf) {
    let p = env.getString(path);
    try {
      let stat = import_fs.default.lstatSync(p, { bigint: true });
      return writeStat(stat, buf);
    } catch (err) {
      env.i32[env.instance.exports.__errno_location >> 2] = err.errno;
      return -1;
    }
  },
  __syscall_fstat64(fd, buf) {
    try {
      let stat = import_fs.default.fstatSync(fd, { bigint: true });
      return writeStat(stat, buf);
    } catch (err) {
      env.i32[env.instance.exports.__errno_location >> 2] = err.errno;
      return -1;
    }
  },
  __syscall_stat64(path, buf) {
    let p = env.getString(path);
    try {
      let stat = import_fs.default.statSync(p, { bigint: true });
      return writeStat(stat, buf);
    } catch (err) {
      env.i32[env.instance.exports.__errno_location >> 2] = err.errno;
      return -1;
    }
  },
  __syscall_getdents64(fd, dirp, count) {
    let p = fds.get(fd).path;
    let dir = dirs.get(fd);
    let entries = dir?.entries;
    if (!entries) {
      try {
        entries = import_fs.default.readdirSync(p, { withFileTypes: true });
      } catch (err) {
        env.i32[env.instance.exports.__errno_location >> 2] = err.errno;
        return -1;
      }
    }
    let start = dirp;
    let i = dir?.index || 0;
    for (; i < entries.length; i++) {
      let entry = entries[i];
      let type = entry.isFIFO() ? 1 : entry.isCharacterDevice() ? 2 : entry.isDirectory() ? 4 : entry.isBlockDevice() ? 6 : entry.isFile() ? 8 : entry.isSymbolicLink() ? 10 : entry.isSocket() ? 12 : 0;
      let len = align(utf8Length(entry.name) + 20, 8);
      if (dirp - start + len > count) {
        break;
      }
      env.u64[dirp >> 3] = 1n;
      env.u64[dirp + 8 >> 3] = BigInt(dirp - start + len);
      env.u16[dirp + 16 >> 1] = len;
      env.memory[dirp + 18] = type;
      let { written } = encoder.encodeInto(entry.name, env.memory.subarray(dirp + 19));
      env.memory[dirp + 19 + written] = 0;
      dirp += len;
    }
    dirs.set(fd, { index: i, entries });
    return dirp - start;
  },
  __syscall_openat(dirfd, path, flags, mode) {
    let f = 0;
    for (let c in constants) {
      if (flags & constants[c]) {
        f |= import_fs.default.constants[c] || 0;
      }
    }
    let dir = dirfd === -100 ? process.cwd() : fds.get(dirfd)?.path;
    if (!dir) {
      env.i32[env.instance.exports.__errno_location >> 2] = 9970;
      return -1;
    }
    let p = import_path.default.resolve(dir, env.getString(path));
    try {
      let fd = import_fs.default.openSync(p, f);
      fds.set(fd, { path: p, flags });
      return fd;
    } catch (err) {
      env.i32[env.instance.exports.__errno_location >> 2] = err.errno;
      return -1;
    }
  },
  __syscall_fcntl64(fd, cmd) {
    switch (cmd) {
      case 3:
        return fds.get(fd).flags;
      case 2:
        return 0;
      default:
        throw new Error("Unknown fcntl64 call: " + cmd);
    }
  },
  __syscall_ioctl() {
  },
  emscripten_resize_heap() {
    return 0;
  },
  _abort_js() {
  },
  wasm_backend_add_watch(filename, backend) {
    let path = env.getString(filename);
    let watch = import_fs.default.watch(path, { encoding: "buffer" }, (eventType, filename2) => {
      if (filename2) {
        let type = eventType === "change" ? 1 : 2;
        let fptr = env.instance.exports.malloc(filename2.byteLength + 1);
        env.memory.set(filename2, fptr);
        env.memory[fptr + filename2.byteLength] = 0;
        env.instance.exports.wasm_backend_event_handler(backend, wd, type, fptr);
        env.instance.exports.free(fptr);
      }
    });
    let wd = watches.length;
    watches.push(watch);
    return wd;
  },
  wasm_backend_remove_watch(wd) {
    watches[wd].close();
    watches[wd] = void 0;
  },
  set_timeout(ms, ctx) {
    return setTimeout(() => {
      env.instance.exports.on_timeout(ctx);
    }, ms);
  },
  clear_timeout(t) {
    clearTimeout(t);
  },
  _setitimer_js() {
  },
  emscripten_date_now() {
    return Date.now();
  },
  _emscripten_get_now_is_monotonic() {
    return true;
  },
  _emscripten_runtime_keepalive_clear() {
  },
  emscripten_get_now() {
    return performance.now();
  },
  wasm_regex_match(string, regex) {
    let re = regexCache.get(regex);
    if (!re) {
      re = new RegExp(env.getString(regex));
      regexCache.set(regex, re);
    }
    return re.test(env.getString(string)) ? 1 : 0;
  }
};
var wasi = {
  fd_close(fd) {
    import_fs.default.closeSync(fd);
    fds.delete(fd);
    dirs.delete(fd);
    return 0;
  },
  fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    return 0;
  },
  fd_write(fd, iov, iovcnt, pnum) {
    let buffers = [];
    for (let i = 0; i < iovcnt; i++) {
      let ptr = env.u32[iov >> 2];
      let len = env.u32[iov + 4 >> 2];
      iov += 8;
      if (len > 0) {
        buffers.push(env.memory.subarray(ptr, ptr + len));
      }
    }
    let wrote = import_fs.default.writevSync(fd, buffers);
    env.u32[pnum >> 2] = wrote;
    return 0;
  },
  fd_read(fd, iov, iovcnt, pnum) {
    let buffers = [];
    for (let i = 0; i < iovcnt; i++) {
      let ptr = env.u32[iov >> 2];
      let len = env.u32[iov + 4 >> 2];
      iov += 8;
      if (len > 0) {
        buffers.push(env.memory.subarray(ptr, ptr + len));
      }
    }
    let read = import_fs.default.readvSync(fd, buffers);
    env.u32[pnum >> 2] = read;
    return 0;
  },
  proc_exit() {
  },
  clock_time_get() {
  }
};
function writeStat(stat, buf) {
  env.i32[buf >> 2] = Number(stat.dev);
  env.i32[buf + 4 >> 2] = Number(stat.mode);
  env.u32[buf + 8 >> 2] = Number(stat.nlink);
  env.i32[buf + 12 >> 2] = Number(stat.uid);
  env.i32[buf + 16 >> 2] = Number(stat.gid);
  env.i32[buf + 20 >> 2] = Number(stat.rdev);
  env.u64[buf + 24 >> 3] = stat.size;
  env.i32[buf + 32 >> 2] = Number(stat.blksize);
  env.i32[buf + 36 >> 2] = Number(stat.blocks);
  env.u64[buf + 40 >> 3] = stat.atimeMs;
  env.u32[buf + 48 >> 2] = Number(stat.atimeNs);
  env.u64[buf + 56 >> 3] = stat.mtimeMs;
  env.u32[buf + 64 >> 2] = Number(stat.mtimeNs);
  env.u64[buf + 72 >> 3] = stat.ctimeMs;
  env.u32[buf + 80 >> 2] = Number(stat.ctimeNs);
  env.u64[buf + 88 >> 3] = stat.ino;
  return 0;
}
function utf8Length(string) {
  let len = 0;
  for (let i = 0; i < string.length; i++) {
    let c = string.charCodeAt(i);
    if (c >= 55296 && c <= 56319 && i < string.length - 1) {
      let c2 = string.charCodeAt(++i);
      if ((c2 & 64512) === 56320) {
        c = ((c & 1023) << 10) + (c2 & 1023) + 65536;
      } else {
        i--;
      }
    }
    if ((c & 4294967168) === 0) {
      len++;
    } else if ((c & 4294965248) === 0) {
      len += 2;
    } else if ((c & 4294901760) === 0) {
      len += 3;
    } else if ((c & 4292870144) === 0) {
      len += 4;
    }
  }
  return len;
}
function align(len, p) {
  return Math.ceil(len / p) * p;
}
var wasmBytes = import_fs.default.readFileSync(new URL("watcher.wasm", import_meta_url));
var wasmModule = new WebAssembly.Module(wasmBytes);
var instance = new WebAssembly.Instance(wasmModule, {
  napi: import_napi_wasm.napi,
  env: wasm_env,
  wasi_snapshot_preview1: wasi
});
env = new import_napi_wasm.Environment(instance);
var wrapper = (0, import_wrapper.createWrapper)(env.exports);
function writeSnapshot(dir, snapshot, opts) {
  return wrapper.writeSnapshot(dir, snapshot, opts);
}
function getEventsSince(dir, snapshot, opts) {
  return wrapper.getEventsSince(dir, snapshot, opts);
}
function subscribe(dir, fn, opts) {
  return wrapper.subscribe(dir, fn, opts);
}
function unsubscribe(dir, fn, opts) {
  return wrapper.unsubscribe(dir, fn, opts);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEventsSince,
  subscribe,
  unsubscribe,
  writeSnapshot
});
