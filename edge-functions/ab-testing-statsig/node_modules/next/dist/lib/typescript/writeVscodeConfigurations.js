"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeVscodeConfigurations = writeVscodeConfigurations;
var _path = _interopRequireDefault(require("path"));
var _isError = _interopRequireDefault(require("../is-error"));
var _fs = require("fs");
var Log = _interopRequireWildcard(require("../../build/output/log"));
var CommentJson = _interopRequireWildcard(require("next/dist/compiled/comment-json"));
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
async function writeVscodeConfigurations(baseDir, tsPath) {
    try {
        const vscodeSettings = _path.default.join(baseDir, ".vscode", "settings.json");
        let settings = {};
        let configExisted = false;
        let currentContent = "";
        try {
            currentContent = await _fs.promises.readFile(vscodeSettings, "utf8");
            settings = CommentJson.parse(currentContent);
            configExisted = true;
        } catch (err) {
            if ((0, _isError).default(err) && err.code !== "ENOENT") {
                throw err;
            }
        }
        const libPath = _path.default.relative(baseDir, _path.default.dirname(tsPath));
        if (settings["typescript.tsdk"] === libPath && settings["typescript.enablePromptUseWorkspaceTsdk"]) {
            return;
        }
        settings["typescript.tsdk"] = libPath;
        settings["typescript.enablePromptUseWorkspaceTsdk"] = true;
        const content = CommentJson.stringify(settings, null, 2);
        const vscodeFolder = _path.default.join(baseDir, ".vscode");
        try {
            await _fs.promises.lstat(vscodeFolder);
        } catch (e) {
            await _fs.promises.mkdir(vscodeFolder, {
                recursive: true
            });
        }
        await _fs.promises.writeFile(vscodeSettings, content);
        Log.info(`VS Code settings.json has been ${configExisted ? "updated" : "created"} for Next.js' automatic app types, this file can be added to .gitignore if desired`);
    } catch (err) {
        Log.error(`Failed to apply custom vscode config for Next.js' app types`, err);
    }
}

//# sourceMappingURL=writeVscodeConfigurations.js.map