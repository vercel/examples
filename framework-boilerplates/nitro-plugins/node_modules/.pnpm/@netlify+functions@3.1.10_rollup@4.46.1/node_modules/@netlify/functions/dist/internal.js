// src/lib/system_logger.ts
import { env } from "process";
var systemLogTag = "__nfSystemLog";
var serializeError = (error) => {
  const cause = error?.cause instanceof Error ? serializeError(error.cause) : error.cause;
  return {
    error: error.message,
    error_cause: cause,
    error_stack: error.stack
  };
};
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2[LogLevel2["Debug"] = 1] = "Debug";
  LogLevel2[LogLevel2["Log"] = 2] = "Log";
  LogLevel2[LogLevel2["Error"] = 3] = "Error";
  return LogLevel2;
})(LogLevel || {});
var SystemLogger = class _SystemLogger {
  fields;
  logLevel;
  constructor(fields = {}, logLevel = 2 /* Log */) {
    this.fields = fields;
    this.logLevel = logLevel;
  }
  doLog(logger, message) {
    if (env.NETLIFY_DEV && !env.NETLIFY_ENABLE_SYSTEM_LOGGING) {
      return;
    }
    logger(systemLogTag, JSON.stringify({ msg: message, fields: this.fields }));
  }
  log(message) {
    if (this.logLevel > 2 /* Log */) {
      return;
    }
    this.doLog(console.log, message);
  }
  debug(message) {
    if (this.logLevel > 1 /* Debug */) {
      return;
    }
    this.doLog(console.debug, message);
  }
  error(message) {
    if (this.logLevel > 3 /* Error */) {
      return;
    }
    this.doLog(console.error, message);
  }
  withLogLevel(level) {
    return new _SystemLogger(this.fields, level);
  }
  withFields(fields) {
    return new _SystemLogger(
      {
        ...this.fields,
        ...fields
      },
      this.logLevel
    );
  }
  withError(error) {
    const fields = error instanceof Error ? serializeError(error) : { error };
    return this.withFields(fields);
  }
};
var systemLogger = new SystemLogger();
export {
  LogLevel,
  systemLogger
};
