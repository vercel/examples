'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.execute = exports.getLogger = exports.setLogger = exports.version = void 0;
/*
 * Lambda's Context object.
 * Refer to this documentation:
 * https://docs.aws.amazon.com/en_us/lambda/latest/dg/nodejs-prog-model-context.html
 */
var dotenv = require("dotenv");
var fs = require("fs");
var path = require("path");
var os = require("os");
var http_1 = require("http");
var utils = require("./lib/utils.js");
var Context = require("./lib/context.js");
require("./lib/streaming.js");
/*
 * Lambda local version
 */
exports.version = "2.2.0";
var logger = utils.getWinstonConsole();
function setLogger(_logger) {
    if (_logger != null && typeof _logger.transports != 'undefined') {
        logger = _logger;
    }
    else {
        console.warn("Invalid logger object ! Using default logger");
    }
}
exports.setLogger = setLogger;
function getLogger() {
    return logger;
}
exports.getLogger = getLogger;
function execute(opts) {
    if (opts.callback) {
        _executeSync.apply(this, [opts]);
    }
    else {
        var that = this;
        return new Promise(function (resolve, reject) {
            var _opts = Object.assign({}, opts); /* Copy the opts to avoid modifying the external opts */
            _opts.callback = function (_err, _done) {
                if (_err) {
                    reject(_err);
                }
                resolve(_done);
            };
            _executeSync.apply(that, [_opts]);
        });
    }
}
exports.execute = execute;
;
function watch(opts) {
    if (!opts.verboseLevel) {
        opts.verboseLevel = 0;
    }
    var server = (0, http_1.createServer)(function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            function handle_error(error) {
                logger.log('warn', log_msg + " -> ".concat(error));
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: error }));
            }
            var log_msg;
            var _this = this;
            return __generator(this, function (_a) {
                log_msg = "".concat(req.method, " ").concat(req.headers.host, " ").concat(req.url);
                try {
                    _getRequestPayload(req, function (error, result) { return __awaiter(_this, void 0, void 0, function () {
                        var data, ans, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (error)
                                        throw error;
                                    return [4 /*yield*/, execute(__assign(__assign({}, opts), { event: result }))];
                                case 1:
                                    data = _a.sent();
                                    ans = _formatResponsePayload(res, data);
                                    logger.log('info', log_msg + " -> OK (".concat(ans.length * 2, " bytes)"));
                                    return [2 /*return*/, res.end(ans)];
                                case 2:
                                    error_1 = _a.sent();
                                    return [2 /*return*/, handle_error(error_1)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (error) {
                    return [2 /*return*/, handle_error(error)];
                }
                return [2 /*return*/];
            });
        });
    });
    server.listen(opts.port, function () {
        logger.log('info', "Lambda handler listening on http://localhost:".concat(opts.port));
    });
}
exports.watch = watch;
function _getRequestPayload(req, callback) {
    /*
     * Handle HTTP server functions.
     */
    var body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', function () {
        var payload, event;
        try {
            payload = JSON.parse(body || '{}');
        }
        catch (err) {
            callback(err);
            return;
        }
        if (payload.event) {
            // compatibility: if "event" was provided.
            event = payload.event;
        }
        else {
            // Format: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format
            var url = new URL(req.url, "http://".concat(req.headers.host));
            event = {
                version: "2.0",
                routeKey: "$default",
                rawPath: url.pathname,
                rawQueryString: url.search,
                cookies: utils.parseCookies(req),
                headers: req.headers,
                queryStringParameters: Object.fromEntries(url.searchParams),
                requestContext: {
                    accountId: "123456789012",
                    apiId: "api-id",
                    authentication: {},
                    authorizer: {},
                    http: {
                        method: req.method,
                        path: url.pathname,
                        protocol: "HTTP/" + req.httpVersion,
                        sourceIp: req.socket.localAddress,
                        userAgent: req.headers['user-agent'],
                    },
                    requestId: "id",
                    routeKey: "$default",
                    stage: "$default",
                    time: new Date().toISOString(),
                    timeEpoch: new Date().getTime(),
                },
                body: payload,
                isBase64Encoded: req.headers['content-type'] !== 'application/json',
            };
        }
        callback(null, event);
    });
}
function _formatResponsePayload(res, data) {
    /*
     * Handle HTTP server function output.
     */
    // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.response
    if (!data.statusCode) {
        data = {
            isBase64Encoded: false,
            statusCode: 200,
            body: data,
            headers: {
                "content-type": "application/json",
            }
        };
    }
    res.writeHead(data.statusCode, data.headers);
    return JSON.stringify(data.body);
}
function updateEnv(env) {
    /*
     * Update environment vars if not already in place
     */
    Object.keys(env).forEach(function (key) {
        if (!process.env[key]) {
            process.env[key] = env[key];
        }
    });
}
function _executeSync(opts) {
    var event = opts.event, lambdaFunc = opts.lambdaFunc, lambdaPath = opts.lambdaPath, lambdaHandler = opts.lambdaHandler || 'handler', esm = opts.esm, profilePath = opts.profilePath, profileName = opts.profileName || process.env['AWS_PROFILE'] || process.env['AWS_DEFAULT_PROFILE'], region = opts.region, environment = opts.environment, envdestroy = opts.envdestroy, envfile = opts.envfile, callbackWaitsForEmptyEventLoop = opts.callbackWaitsForEmptyEventLoop || false, timeoutMs = opts.timeoutMs || 3000, verboseLevel = opts.verboseLevel, callback = opts.callback, contextOverwrite = opts.contextOverwrite, onInvocationEnd = opts.onInvocationEnd, clientContext = null;
    if (opts.clientContext) {
        if (typeof opts.clientContext === "string") {
            try {
                clientContext = JSON.parse(opts.clientContext);
            }
            catch (err) {
                throw new SyntaxError("clientContext is an invalid stringified JS object");
            }
        }
        else {
            clientContext = opts.clientContext;
        }
    }
    if (lambdaFunc && lambdaPath) {
        throw new SyntaxError("Cannot specify both lambdaFunc and lambdaPath !");
        return;
    }
    if (callbackWaitsForEmptyEventLoop && utils.get_node_major_version() < 16) {
        console.warn("callbackWaitsForEmptyEventLoop not supported on node < 16");
        callbackWaitsForEmptyEventLoop = false;
    }
    if (lambdaPath) {
        var esmWindows = esm && process.platform === 'win32';
        lambdaPath = (esmWindows ? 'file://' : '') + utils.getAbsolutePath(lambdaPath);
    }
    // set environment variables before the require
    var envVars = {
        'AWS_LAMBDA_FUNCTION_NAME': lambdaHandler,
        'AWS_LAMBDA_FUNCTION_MEMORY_SIZE': Math.floor(os.freemem() / 1048576).toString(),
        'AWS_LAMBDA_FUNCTION_VERSION': "1.0",
        'AWS_EXECUTION_ENV': "AWS_Lambda_nodejs" + process.version.substr(1),
        'LAMBDA_CONSOLE_SOCKET': "14",
        'LAMBDA_CONTROL_SOCKET': "11",
        'LAMBDA_RUNTIME_DIR': process.cwd(),
        'NODE_PATH': utils.getAbsolutePath('node_modules'),
        'TZ': Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    /*
     * _HANDLER – The location to the handler, from the function's configuration.
     * The standard format is `file.method`, where file is the name of the file without an extension, and method is the name of a method or function that's defined in the file.
     * (https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html)
     */
    if (lambdaPath) {
        envVars['LAMBDA_TASK_ROOT'] = path.dirname(lambdaPath);
        envVars['_HANDLER'] = path.basename(lambdaPath, path.extname(lambdaPath)) + "." + lambdaHandler;
    }
    else {
        envVars['LAMBDA_TASK_ROOT'] = process.cwd();
        envVars['_HANDLER'] = "index." + lambdaHandler;
    }
    updateEnv(envVars);
    // custom environment variables
    if (environment != null) {
        if (envdestroy == null) {
            envdestroy = false;
        }
        Object.keys(environment).forEach(function (key) {
            process.env[key] = environment[key];
        });
    }
    // custom environment variables file
    if (envfile != null) {
        dotenv.config({ path: envfile });
    }
    //load profiles
    profilePath = profilePath || process.env['AWS_SHARED_CREDENTIALS_FILE'];
    var default_config_file = utils.getAbsolutePath("~/.aws/config");
    var default_credentials_file = utils.getAbsolutePath("~/.aws/credentials");
    if (fs.existsSync(default_config_file)) { //Default config file
        utils.loadAWSCredentials(default_config_file, profileName);
    }
    if (fs.existsSync(default_credentials_file)) { //Default credentials file
        utils.loadAWSCredentials(default_credentials_file, profileName);
    }
    if (profilePath) { //Provided config/credentials file
        utils.loadAWSCredentials(profilePath, profileName);
    }
    //post loading profiles environment variables
    process.env['AWS_REGION'] = region || process.env['AWS_REGION'] || 'us-east-1';
    process.env['AWS_DEFAULT_REGION'] = region || process.env['AWS_DEFAULT_REGION'] || 'us-east-1';
    //Logs
    if (typeof verboseLevel == 'undefined') {
        verboseLevel = 3;
    }
    // load context
    var context = new Context();
    context._initialize({
        functionName: lambdaHandler,
        timeoutMs: timeoutMs,
        callbackWaitsForEmptyEventLoop: callbackWaitsForEmptyEventLoop,
        verboseLevel: verboseLevel,
        logger: logger,
        finalCallback: function () {
            if (environment != null && envdestroy) {
                Object.keys(environment).forEach(function (key) {
                    delete process.env[key];
                });
            }
        },
        clientContext: clientContext,
        onInvocationEnd: onInvocationEnd,
    });
    if (callback)
        context.callback = callback;
    var ctx = context.generate_context();
    if (contextOverwrite)
        opts.contextOverwrite(ctx);
    var executeLambdaFunc = function (lambdaFunc) {
        try {
            //load event
            if (event instanceof Function) {
                event = event();
            }
            //start timeout
            context._init_timeout();
            // execute lambda function
            var result = lambdaFunc[lambdaHandler](event, ctx, ctx.done);
            if (result) {
                if (result.then) {
                    result.then(ctx.succeed, ctx.fail);
                }
                else {
                    ctx.succeed(null);
                }
            }
        }
        catch (err) {
            ctx.fail(err);
        }
    };
    try {
        if (lambdaFunc) {
            executeLambdaFunc(lambdaFunc);
        }
        else if (esm) {
            // use eval to avoid typescript transpilation of dynamic import ()
            eval("import(lambdaPath)").then(executeLambdaFunc, function (err) { return ctx.fail(err); });
        }
        else {
            // delete this function from the require.cache to ensure every dependency is refreshed
            delete require.cache[require.resolve(lambdaPath)];
            executeLambdaFunc(require(lambdaPath));
        }
    }
    catch (err) {
        ctx.fail(err);
    }
}
;
