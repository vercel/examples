'use strict';
/*
 * Lambda's Context object.
 * Refer to this documentation:
 * https://docs.aws.amazon.com/en_us/lambda/latest/dg/nodejs-prog-model-context.html
 */
var utils = require("./utils.js");
var mute = require("./mute.js");
var streaming_js_1 = require("./streaming.js");
function Context() {
    this.logger = null;
    this.unmute = null;
    this.verboseLevel = null;
    this.finalCallback = null;
    /*
     * doneStatus & postDone were minimum; probably defined internally in Lambda.
     */
    this.doneStatus = false;
    this.postDone = function (error, message) { };
    /*
     * Used to determine the getRemainingTimeInMillis()
     */
    this.startTime;
    this.timeout;
    /* Internal usage: timer handle */
    this._timeout;
    /*
     * Context object properties
     */
    this.callbackWaitsForEmptyEventLoop = false; // Unlike AWS, we default it to false because our implementation is a bit ugly
    this.functionName = '';
    this.functionVersion = process.env.AWS_LAMBDA_FUNCTION_VERSION;
    this.invokedFunctionArn = null;
    this.memoryLimitInMB = process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE;
    this.awsRequestId = null;
    this.logGroupName = 'Group name';
    this.logStreamName = 'Stream name';
    this.identity = null;
    this.clientContext = null;
    this.onInvocationEnd = null;
    /*
     * callback function called after done
     */
    this.callback = function (result) {
        return result;
    };
}
/*
 * create random invokeid.
 * Assuming that invokeid follows the format:
 * 8hex-4hex-4hex-4hex-12hex
 */
var createInvokeId = function () {
    return [
        utils.generateRandomHex(8),
        utils.generateRandomHex(4),
        utils.generateRandomHex(4),
        utils.generateRandomHex(4),
        utils.generateRandomHex(12)
    ].join('-');
};
/*
 * create invoked function in the proper format
 */
Context.prototype.createInvokeFunctionArn = function () {
    return [
        'arn',
        'aws',
        'lambda',
        process.env.AWS_REGION,
        process.env.AWS_ACCOUNT_ID || Math.round(Math.random() * 1000000000000).toString(),
        'function',
        this.functionName,
        this.functionVersion
    ].join(':');
};
/*
 * Context initialization.
 * Called from lambdalocal.js
 */
Context.prototype._initialize = function (options) {
    /* set time */
    this.startTime = new Date().getTime();
    this.timeout = options.timeoutMs;
    this.logger = options.logger;
    this.verboseLevel = options.verboseLevel;
    this.finalCallback = options.finalCallback;
    /* set function name */
    this.functionName = options.functionName;
    /* set requestid */
    this.awsRequestId = createInvokeId();
    /* set invokedFunctionArn */
    this.invokedFunctionArn = this.createInvokeFunctionArn();
    /* Set callbackWaitsForEmptyEventLoop */
    this.callbackWaitsForEmptyEventLoop = options.callbackWaitsForEmptyEventLoop;
    if (this.verboseLevel > 1) {
        this.logger.log('info', 'START RequestId: ' + this.awsRequestId);
    }
    if (this.verboseLevel < 3 && this.verboseLevel >= 0) {
        this.unmute = mute();
    }
    this.clientContext = options.clientContext;
    this.onInvocationEnd = options.onInvocationEnd;
    return;
};
/*
 * Timeout initialization.
 * Called from lambdalocal.js
 */
Context.prototype._init_timeout = function () {
    /* Handling timeout */
    this._timeout = setTimeout((function () {
        this.fail(new utils.TimeoutError('Task timed out after ' + (this.timeout / 1000).toFixed(2) + ' seconds'));
    }).bind(this), this.timeout);
};
/*
 * Util function used in lambdalocal.js to get parameters for the handler
 */
Context.prototype.generate_context = function () {
    //https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
    var ctx = {
        //FUNCTIONS
        done: this.done.bind(this),
        fail: this.fail.bind(this),
        succeed: this.succeed.bind(this),
        getRemainingTimeInMillis: this.getRemainingTimeInMillis.bind(this),
        //VARS
        callbackWaitsForEmptyEventLoop: this.callbackWaitsForEmptyEventLoop,
        functionName: this.functionName,
        functionVersion: this.functionVersion,
        invokedFunctionArn: this.invokedFunctionArn,
        memoryLimitInMB: this.memoryLimitInMB,
        awsRequestId: this.awsRequestId,
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        identity: this.identity,
        clientContext: this.clientContext,
        _stopped: false,
        // INTERNAL
        __lambdaLocal: {
            onInvocationEnd: this.onInvocationEnd
        },
    };
    return ctx;
};
/*
 * This `done` method is directly extracted from source.
 */
Context.prototype.done = function (err, message) {
    var _a;
    // May only be called once
    if (this._stopped) {
        return;
    }
    this._stopped = true;
    clearTimeout(this._timeout);
    if (this.unmute != null) {
        this.unmute();
        this.unmute = null;
    }
    if (err instanceof Error) {
        //http://docs.aws.amazon.com/en_en/lambda/latest/dg/nodejs-prog-mode-exceptions.html
        var _stack;
        if (err.stack) {
            // Trim stack
            _stack = err.stack.split("\n");
            _stack.shift();
            for (var i = 0; i < _stack.length; i++) {
                _stack[i] = _stack[i].trim().substr(3);
            }
            err = {
                "errorMessage": err.message,
                "errorType": err.name,
                "stackTrace": _stack
            };
        }
        else {
            err = {
                "errorMessage": err.message,
                "errorType": err.name
            };
        }
    }
    if (err !== null && typeof err !== 'undefined') {
        if (this.verboseLevel > 1) {
            this.logger.log('error', 'End - Error:');
        }
        if (this.verboseLevel > 0) {
            this.logger.log('error', utils.processJSON(err));
        }
    }
    else {
        if (this.verboseLevel > 1) {
            this.logger.log('info', 'End - Result:');
        }
        if (this.verboseLevel > 0) {
            this.logger.log('info', utils.processJSON(message));
        }
    }
    this.finalCallback(); //Destroy env...
    var isStream = typeof message === "object" && (message === null || message === void 0 ? void 0 : message.body) instanceof streaming_js_1.StreamingBody;
    if (!isStream) {
        (_a = this.onInvocationEnd) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    /*
    The finalCallback method will be instantly called if 'this.callbackWaitsForEmptyEventLoop' is False
    Otherwise, lambda-local will wait for an empty loop then call it.
    */
    if (this.callbackWaitsForEmptyEventLoop) {
        var that = this;
        utils.waitForNodeJS(function () {
            that.callback(err, message);
        });
    }
    else {
        this.callback(err, message);
    }
};
/*
 * `fail` method calls the `done` method
 */
Context.prototype.fail = function (err) {
    this.done(err);
};
/*
 * `succeed` method calls the `done` method
 */
Context.prototype.succeed = function (message) {
    this.done(null, message);
};
/*
 * 'getRemainingTimeInMillis' method return time before task is killed
 */
Context.prototype.getRemainingTimeInMillis = function () {
    var now = new Date().getTime();
    return (this.timeout + this.startTime - now);
};
module.exports = Context;
