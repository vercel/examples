'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForNodeJS = exports.loadAWSCredentials = exports.TimeoutError = exports.parseCookies = exports.processJSON = exports.getAbsolutePath = exports.getWinstonConsole = exports.generateRandomHex = exports.get_node_major_version = void 0;
/**
 * Requires
 */
var fs = require("fs");
var path_lib = require("path");
var join = path_lib.join;
var util = require("util");
/**
 * utility functions
 */
function get_node_major_version() {
    return parseInt(process.version.slice(1).split('.')[0]);
}
exports.get_node_major_version = get_node_major_version;
var _hexChars = '0123456789abcdef'.split('');
function generateRandomHex(length) {
    var hexVal = '';
    for (var i = 0; i < length; i++) {
        hexVal += _hexChars[Math.floor(Math.random() * _hexChars.length)];
    }
    return hexVal;
}
exports.generateRandomHex = generateRandomHex;
;
function getWinstonConsole() {
    var winston = require("winston");
    var _a = winston.format, combine = _a.combine, colorize = _a.colorize, simple = _a.simple;
    var logger = winston.createLogger({
        level: "info",
        transports: [
            new winston.transports.Console({
                format: combine(colorize(), simple())
            })
        ]
    });
    return logger;
}
exports.getWinstonConsole = getWinstonConsole;
function getAbsolutePath(path) {
    var homeDir = process.env.HOME || process.env.USERPROFILE;
    var windowsRegex = /([A-Z|a-z]:\\[^*|"<>?\n]*)|(\\\\.*?\\.*)/;
    if (path.match(/^\//) || path.match(windowsRegex)) {
        //On Windows and linux
        return path;
    }
    else {
        if (path === '~') {
            return homeDir;
        }
        else if (path.slice(0, 2) === '~/') {
            return join(homeDir, path.slice(2));
        }
        else if (path.slice(0, 2) === './') {
            return join(process.cwd(), path.slice(2));
        }
        else {
            return join(process.cwd(), path);
        }
    }
    return null;
}
exports.getAbsolutePath = getAbsolutePath;
;
function processJSON(json) {
    if (typeof json === 'object') {
        try {
            return JSON.stringify(json, null, '\t');
        }
        catch (e) {
            return util.inspect(json);
        }
    }
    else {
        return json;
    }
}
exports.processJSON = processJSON;
;
function parseCookies(request) {
    var _a;
    var list = {};
    var cookieHeader = (_a = request.headers) === null || _a === void 0 ? void 0 : _a.cookie;
    if (!cookieHeader)
        return list;
    cookieHeader.split(";").forEach(function (cookie) {
        var _a = cookie.split("="), name = _a[0], rest = _a.slice(1);
        name = name === null || name === void 0 ? void 0 : name.trim();
        if (!name)
            return;
        var value = rest.join("=").trim();
        if (!value)
            return;
        list[name] = decodeURIComponent(value);
    });
    return list;
}
exports.parseCookies = parseCookies;
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "TimeoutError";
        return _this;
    }
    return TimeoutError;
}(Error));
exports.TimeoutError = TimeoutError;
var _load_var_from_file = function (varname, envname, data, profileName) {
    if (process.env[envname]) {
        //If already set, it overwrites config files
        return;
    }
    var regex = new RegExp('\\[' + profileName +
        '\\](.|\\n|\\r\\n)*?' + varname + '( ?)+=( ?)+(.*)'), match;
    if ((match = regex.exec(data)) !== null) {
        process.env[envname] = match[4];
    }
};
function loadAWSCredentials(path, profileName) {
    if (profileName === void 0) { profileName = 'default'; }
    var dataRaw = fs.readFileSync(getAbsolutePath(path)), data = dataRaw.toString();
    _load_var_from_file("aws_secret_access_key", "AWS_SECRET_ACCESS_KEY", data, profileName);
    _load_var_from_file("aws_access_key_id", "AWS_ACCESS_KEY_ID", data, profileName);
    _load_var_from_file("aws_session_token", "AWS_SESSION_TOKEN", data, profileName);
    _load_var_from_file("metadata_service_timeout", "AWS_METADATA_SERVICE_TIMEOUT", data, profileName);
    _load_var_from_file("metadata_service_num_attempts", "AWS_METADATA_SERVICE_NUM_ATTEMPTS", data, profileName);
    _load_var_from_file("region", "AWS_REGION", data, profileName);
}
exports.loadAWSCredentials = loadAWSCredentials;
;
function waitForNodeJS(cb, i) {
    if (i === void 0) { i = 0; }
    /* Waits for all Timeouts to end before calling the callback */
    // This is quite ugly, but its hard to emulate a "wait for all timeouts" properly :/
    if (process.getActiveResourcesInfo().filter(function (x) { return x === 'Timeout'; }).length > i) {
        setTimeout(function () {
            waitForNodeJS(cb, i = 1);
        }, 100);
    }
    else {
        cb();
    }
}
exports.waitForNodeJS = waitForNodeJS;
