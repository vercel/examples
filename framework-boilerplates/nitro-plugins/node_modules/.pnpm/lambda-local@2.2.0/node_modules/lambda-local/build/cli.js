#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
var lambdaLocal = require("./lambdalocal");
var utils = require("./lib/utils");
/*
 * Local executor for Amazon Lambda function
 */
(function () {
    var logger = lambdaLocal.getLogger();
    // process opts
    var program = require('commander');
    program
        .storeOptionsAsProperties()
        .name('lambda-local')
        .version(lambdaLocal.version)
        .option('-l, --lambda-path <lambda index path>', '(required) Lambda function file name.')
        .option('-e, --event-path <path>', '(required if --watch is not in use) Event data file name.')
        .option('-h, --handler <handler name>', '(optional) Lambda function handler name. Default is \'handler\'.')
        .option('--esm', '(optional) Load lambda function as ECMAScript module.')
        .option('-t, --timeout <timeout seconds>', '(optional) Seconds until lambda function timeout. Default is 3 seconds.')
        .option('-r, --region <aws region>', '(optional) default set to us-east-1')
        .option('-p, --profile <aws profile name>', '(optional) Read the AWS profile to get the credentials from profile name')
        .option('-P, --profile-path <aws credentials path>', '(optional) Read the specified AWS credentials file')
        .option('-E, --environment <JSON {key:value}>', '(optional) Set extra environment variables for the lambda')
        .option('--wait-empty-event-loop', '(optional) Sets callbackWaitsForEmptyEventLoop=True => will wait for an empty loop before ' +
        'returning. This is false by default because our implementation isn\'t perfect and only "emulates" it.')
        .option('--envdestroy', '(optional) Destroy added environment on closing. Defaults to false')
        .option('-v, --verboselevel <3/2/1/0/-1>', '(optional) Default 3. Level 2 dismiss handler() text, level 1 dismiss lambda-local text ' +
        'and level 0 dismiss also the result. Level -1 only displays handler() text.', 3)
        .option('--envfile <path/to/env/file>', '(optional) Load additional environment variables from a file')
        .option('--inspect [[host:]port]', '(optional) Starts lambda-local using the NodeJS inspector (available in nodejs > 8.0.0)')
        .option('-W, --watch [port]', '(optional) Starts lambda-local in watch mode listening to the specified port [1-65535]. Default is 8008')
        .parse(process.argv);
    var eventPath = program.eventPath, lambdaPath = program.lambdaPath, lambdaHandler = program.handler, esm = program.esm, profilePath = program.profilePath, profileName = program.profile, region = program.region, environment = program.environment, envdestroy = program.envdestroy, envfile = program.envfile, callbackWaitsForEmptyEventLoop = program.waitEmptyEventLoop, verboseLevel = parseInt(program.verboselevel);
    var port;
    if (program.watch) {
        if (program.watch == true) {
            port = 8008;
        }
        else {
            port = parseInt(program.watch);
            if (port < 1 || port > 65535)
                program.help();
        }
        eventPath = true;
    }
    if (isNaN(verboseLevel)) {
        console.log("Invalid verboseLevel. Must be number.");
        process.exit(1);
    }
    if (!lambdaPath || !eventPath) {
        program.help();
    }
    // default handler name
    if (!lambdaHandler) {
        lambdaHandler = 'handler';
    }
    if (environment) {
        try {
            environment = JSON.parse(environment);
        }
        catch (e) {
            console.log("Invalid environment variable JSON format. ");
            console.log("Example: {\\\"key\\\":\\\"val\\\"\\\,\\\"key2\\\":\\\"val2\\\"}");
            process.exit(1);
        }
    }
    else {
        environment = [];
    }
    //default callbackWaitsForEmptyEventLoop
    if (!callbackWaitsForEmptyEventLoop) {
        callbackWaitsForEmptyEventLoop = false;
    }
    else {
        callbackWaitsForEmptyEventLoop = true;
    }
    // timeout milliseconds
    var timeoutMs;
    if (program.timeout) {
        timeoutMs = program.timeout * 1000;
    }
    else {
        timeoutMs = 3000;
    }
    //Use NodeJS inspector
    var inspector;
    var _close_inspector;
    if (program.inspect) {
        if (utils.get_node_major_version() < 8) {
            logger.log('error', 'Inspector API not available on NodeJS < 8.0.0');
        }
        else {
            inspector = require('inspector');
            if (program.inspect == true) {
                inspector.open();
            }
            else if (typeof (program.inspect) === 'string') {
                if (program.inspect.indexOf(":") !== -1) {
                    var arr = program.inspect.split(":");
                    inspector.open(parseInt(arr[1]), arr[0]);
                }
                else {
                    inspector.open(parseInt(program.inspect));
                }
            }
            else {
                logger.log('error', 'Unknown parameters following --inspect');
            }
            _close_inspector = function () { inspector.close(); };
        }
    }
    if (esm) {
        if (utils.get_node_major_version() < 12) {
            console.log("Loading ESCMAScript modules not available on NodeJS < 12.0.0.");
            process.exit(1);
        }
        if (program.watch) {
            console.log("Watch mode not supported for ECMAScript lambda modules.");
            process.exit(1);
        }
    }
    var event = function () {
        if (program.watch)
            return null;
        return require(utils.getAbsolutePath(eventPath));
    };
    try {
        var init_time = new Date().getTime();
        // execute
        var opts = {
            event: event,
            lambdaPath: lambdaPath,
            lambdaHandler: lambdaHandler,
            esm: esm,
            profilePath: profilePath,
            profileName: profileName,
            region: region,
            callbackWaitsForEmptyEventLoop: callbackWaitsForEmptyEventLoop,
            timeoutMs: timeoutMs,
            environment: environment,
            envdestroy: envdestroy,
            envfile: envfile,
            verboseLevel: verboseLevel,
        };
        if (program.watch) {
            return lambdaLocal.watch(__assign(__assign({}, opts), { port: port }));
        }
        lambdaLocal.execute(__assign(__assign({}, opts), { callback: function (err /*, data */) {
                var exec_time = new Date().getTime() - init_time;
                if (_close_inspector) {
                    _close_inspector();
                }
                if (err !== null && typeof err !== 'undefined') {
                    if (verboseLevel > 0) {
                        logger.log('error', 'Lambda failed in ' + exec_time + 'ms.');
                    }
                    // Finish the process
                    process.exit(1);
                }
                else {
                    if (verboseLevel > 0) {
                        logger.log('info', 'Lambda successfully executed in ' + exec_time + 'ms.');
                    }
                    process.exit(0);
                }
            } }));
    }
    catch (ex) {
        logger.log('error', ex);
        process.exit(1);
    }
})();
