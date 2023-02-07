"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findDir = findDir;
exports.findPagesDir = findPagesDir;
exports.existsSync = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var Log = _interopRequireWildcard(require("../build/output/log"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const existsSync = (f)=>{
    try {
        _fs.default.accessSync(f, _fs.default.constants.F_OK);
        return true;
    } catch (_) {
        return false;
    }
};
exports.existsSync = existsSync;
function findDir(dir, name) {
    // prioritize ./${name} over ./src/${name}
    let curDir = _path.default.join(dir, name);
    if (existsSync(curDir)) return curDir;
    curDir = _path.default.join(dir, "src", name);
    if (existsSync(curDir)) return curDir;
    return null;
}
function findPagesDir(dir, isAppDirEnabled) {
    const pagesDir = findDir(dir, "pages") || undefined;
    const appDir = findDir(dir, "app") || undefined;
    if (isAppDirEnabled && appDir == null && pagesDir == null) {
        throw new Error("> Couldn't find any `pages` or `app` directory. Please create one under the project root");
    }
    if (!isAppDirEnabled) {
        if (appDir != null && pagesDir == null) {
            throw new Error("> The `app` directory is experimental. To enable, add `appDir: true` to your `next.config.js` configuration under `experimental`. See https://nextjs.org/docs/messages/experimental-app-dir-config");
        }
        if (appDir != null && pagesDir != null) {
            Log.warn("The `app` directory is experimental. To enable, add `appDir: true` to your `next.config.js` configuration under `experimental`. See https://nextjs.org/docs/messages/experimental-app-dir-config");
        }
        if (pagesDir == null) {
            throw new Error("> Couldn't find a `pages` directory. Please create one under the project root");
        }
    }
    return {
        pagesDir,
        appDir: isAppDirEnabled ? appDir : undefined
    };
}

//# sourceMappingURL=find-pages-dir.js.map