import {
  ConsoleInterceptor,
  DevUsageManager,
  ExecutorToWorkerMessageCatalog,
  OTEL_LOG_ATTRIBUTE_COUNT_LIMIT,
  OtelTaskLogger,
  PreciseWallClock,
  SemanticInternalAttributes,
  SharedRuntimeManager,
  StandardHeartbeatsManager,
  StandardLifecycleHooksManager,
  StandardLocalsManager,
  StandardMetadataManager,
  StandardRealtimeStreamsManager,
  StandardResourceCatalog,
  StandardRunTimelineMetricsManager,
  StandardTraceContextManager,
  StandardWaitUntilManager,
  TaskExecutor,
  TaskRunContext,
  TaskRunErrorCodes,
  TracingSDK,
  UsageTimeoutManager,
  WorkerManifest,
  WorkerToExecutorMessageCatalog,
  ZodSchemaParsedError,
  apiClientManager,
  attemptKey,
  clock,
  external_exports,
  getEnvVar,
  getNumberEnvVar,
  heartbeats,
  isCompleteTaskWithOutput,
  lifecycleHooks,
  localsAPI,
  logLevels,
  logger,
  normalizeImportPath,
  o,
  populateEnv,
  promiseWithResolvers,
  realtimeStreams,
  recordSpanException,
  require_source_map_support,
  require_src,
  resourceCatalog,
  runMetadata,
  runTimelineMetrics,
  runtime,
  taskContext,
  timeout,
  traceContext,
  usage,
  waitUntil
} from "../../../../../../../../chunk-NNIGOCOK.mjs";
import "../../../../../../../../chunk-4DSI7GE4.mjs";
import {
  SpanStatusCode,
  context,
  init_esm as init_esm2,
  trace
} from "../../../../../../../../chunk-ZOPV4KI4.mjs";
import {
  __name,
  __toESM,
  init_esm
} from "../../../../../../../../chunk-3R76H35D.mjs";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/entryPoints/dev-run-worker.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/tracer.js
init_esm();
init_esm2();
var import_api_logs = __toESM(require_src(), 1);
var TriggerTracer = class {
  static {
    __name(this, "TriggerTracer");
  }
  _config;
  constructor(_config) {
    this._config = _config;
  }
  _tracer;
  get tracer() {
    if (!this._tracer) {
      if ("tracer" in this._config)
        return this._config.tracer;
      this._tracer = trace.getTracer(this._config.name, this._config.version);
    }
    return this._tracer;
  }
  _logger;
  get logger() {
    if (!this._logger) {
      if ("logger" in this._config)
        return this._config.logger;
      this._logger = import_api_logs.logs.getLogger(this._config.name, this._config.version);
    }
    return this._logger;
  }
  startActiveSpan(name, fn, options, ctx, signal) {
    const parentContext = ctx ?? context.active();
    const attributes = options?.attributes ?? {};
    let spanEnded = false;
    const createPartialSpanWithEvents = options?.events && options.events.length > 0;
    return this.tracer.startActiveSpan(name, {
      ...options,
      attributes: {
        ...attributes,
        ...createPartialSpanWithEvents ? {
          [SemanticInternalAttributes.SKIP_SPAN_PARTIAL]: true
        } : {}
      },
      startTime: clock.preciseNow()
    }, parentContext, async (span) => {
      signal?.addEventListener("abort", () => {
        if (!spanEnded) {
          spanEnded = true;
          recordSpanException(span, signal.reason);
          span.end();
        }
      });
      if (taskContext.ctx && createPartialSpanWithEvents) {
        const partialSpan = this.tracer.startSpan(name, {
          ...options,
          attributes: {
            ...attributes,
            [SemanticInternalAttributes.SPAN_PARTIAL]: true,
            [SemanticInternalAttributes.SPAN_ID]: span.spanContext().spanId
          }
        }, parentContext);
        if (options?.events) {
          for (const event of options.events) {
            partialSpan.addEvent(event.name, event.attributes, event.startTime);
          }
        }
        partialSpan.end();
      }
      if (options?.events) {
        for (const event of options.events) {
          span.addEvent(event.name, event.attributes, event.startTime);
        }
      }
      const usageMeasurement = usage.start();
      try {
        return await fn(span);
      } catch (e) {
        if (isCompleteTaskWithOutput(e)) {
          if (!spanEnded) {
            span.end(clock.preciseNow());
          }
          throw e;
        }
        if (!spanEnded) {
          if (typeof e === "string" || e instanceof Error) {
            span.recordException(e);
          }
          span.setStatus({ code: SpanStatusCode.ERROR });
        }
        throw e;
      } finally {
        if (!spanEnded) {
          spanEnded = true;
          if (taskContext.ctx) {
            const usageSample = usage.stop(usageMeasurement);
            const machine = taskContext.ctx.machine;
            span.setAttributes({
              [SemanticInternalAttributes.USAGE_DURATION_MS]: usageSample.cpuTime,
              [SemanticInternalAttributes.USAGE_COST_IN_CENTS]: machine?.centsPerMs ? usageSample.cpuTime * machine.centsPerMs : 0
            });
          }
          span.end(clock.preciseNow());
        }
      }
    });
  }
  startSpan(name, options, ctx) {
    const parentContext = ctx ?? context.active();
    const attributes = options?.attributes ?? {};
    const span = this.tracer.startSpan(name, options, parentContext);
    return span;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/zodIpc.js
init_esm();
import { randomUUID } from "crypto";
var messageSchema = external_exports.object({
  version: external_exports.literal("v1").default("v1"),
  type: external_exports.string(),
  payload: external_exports.unknown()
});
var ZodIpcMessageHandler = class {
  static {
    __name(this, "ZodIpcMessageHandler");
  }
  #schema;
  #handlers;
  #sender;
  constructor(options) {
    this.#schema = options.schema;
    this.#handlers = options.handlers;
    this.#sender = options.sender;
  }
  async handleMessage(message) {
    const parsedMessage = this.parseMessage(message);
    if (!this.#handlers) {
      throw new Error("No handlers provided");
    }
    const handler = this.#handlers[parsedMessage.type];
    if (!handler) {
      return;
    }
    const ack = await handler(parsedMessage.payload, this.#sender);
    return ack;
  }
  parseMessage(message) {
    const parsedMessage = messageSchema.safeParse(message);
    if (!parsedMessage.success) {
      throw new Error(`Failed to parse message: ${JSON.stringify(parsedMessage.error)}`);
    }
    const schema = this.#schema[parsedMessage.data.type]?.["message"];
    if (!schema) {
      throw new Error(`Unknown message type: ${parsedMessage.data.type}`);
    }
    const parsedPayload = schema.safeParse(parsedMessage.data.payload);
    if (!parsedPayload.success) {
      throw new Error(`Failed to parse message payload: ${JSON.stringify(parsedPayload.error)}`);
    }
    return {
      type: parsedMessage.data.type,
      payload: parsedPayload.data
    };
  }
};
var Packet = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("CONNECT"),
    sessionId: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("ACK"),
    message: external_exports.any(),
    id: external_exports.number()
  }),
  external_exports.object({
    type: external_exports.literal("EVENT"),
    message: external_exports.any(),
    id: external_exports.number().optional()
  })
]);
var ZodIpcConnection = class {
  static {
    __name(this, "ZodIpcConnection");
  }
  opts;
  #sessionId;
  #messageCounter = 0;
  #handler;
  #acks = /* @__PURE__ */ new Map();
  constructor(opts) {
    this.opts = opts;
    this.#handler = new ZodIpcMessageHandler({
      schema: opts.listenSchema,
      handlers: opts.handlers,
      sender: {
        send: this.send.bind(this),
        sendWithAck: this.sendWithAck.bind(this)
      }
    });
    this.#registerHandlers();
  }
  async #registerHandlers() {
    if (!this.opts.process.on) {
      return;
    }
    this.opts.process.on("message", async (message) => {
      this.#handlePacket(message);
    });
  }
  async connect() {
    this.#sendPacket({ type: "CONNECT" });
  }
  async #handlePacket(packet) {
    const parsedPacket = Packet.safeParse(packet);
    if (!parsedPacket.success) {
      return;
    }
    switch (parsedPacket.data.type) {
      case "ACK": {
        const ack = this.#acks.get(parsedPacket.data.id);
        if (!ack) {
          return;
        }
        clearTimeout(ack.timeout);
        ack.resolve(parsedPacket.data.message);
        break;
      }
      case "CONNECT": {
        if (!parsedPacket.data.sessionId) {
          const id = randomUUID();
          await this.#sendPacket({ type: "CONNECT", sessionId: id });
          return;
        }
        if (this.#sessionId) {
          return;
        }
        this.#sessionId = parsedPacket.data.sessionId;
        break;
      }
      case "EVENT": {
        const result = await this.#handler.handleMessage(parsedPacket.data.message);
        if (typeof parsedPacket.data.id === "undefined") {
          return;
        }
        await this.#sendPacket({
          type: "ACK",
          id: parsedPacket.data.id,
          message: result
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  async #sendPacket(packet) {
    await this.opts.process.send?.(packet);
  }
  async send(type, payload) {
    const schema = this.opts.emitSchema[type]?.["message"];
    if (!schema) {
      throw new Error(`Unknown message type: ${type}`);
    }
    const parsedPayload = schema.safeParse(payload);
    if (!parsedPayload.success) {
      throw new ZodSchemaParsedError(parsedPayload.error, payload);
    }
    await this.#sendPacket({
      type: "EVENT",
      message: {
        type,
        payload,
        version: "v1"
      }
    });
  }
  async sendWithAck(type, payload, timeoutInMs) {
    const currentId = this.#messageCounter++;
    return new Promise(async (resolve, reject) => {
      const defaultTimeoutInMs = 2e3;
      const timeout2 = setTimeout(() => {
        reject(JSON.stringify({
          reason: "sendWithAck() timeout",
          timeoutInMs: timeoutInMs ?? defaultTimeoutInMs,
          type,
          payload
        }));
      }, timeoutInMs ?? defaultTimeoutInMs);
      this.#acks.set(currentId, { resolve, reject, timeout: timeout2 });
      const schema = this.opts.emitSchema[type]?.["message"];
      if (!schema) {
        clearTimeout(timeout2);
        return reject(`Unknown message type: ${type}`);
      }
      const parsedPayload = schema.safeParse(payload);
      if (!parsedPayload.success) {
        clearTimeout(timeout2);
        return reject(`Failed to parse message payload: ${JSON.stringify(parsedPayload.error)}`);
      }
      await this.#sendPacket({
        type: "EVENT",
        message: {
          type,
          payload,
          version: "v1"
        },
        id: currentId
      });
    });
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/entryPoints/dev-run-worker.js
var import_source_map_support = __toESM(require_source_map_support(), 1);
import { readFile } from "node:fs/promises";
import { setTimeout as setTimeout2 } from "node:timers/promises";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/version.js
init_esm();
var VERSION = "4.3.3";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/entryPoints/dev-run-worker.js
import_source_map_support.default.install({
  handleUncaughtExceptions: false,
  environment: "node",
  hookRequire: false
});
process.on("uncaughtException", function(error, origin) {
  logError("Uncaught exception", { error, origin });
  if (error instanceof Error) {
    process.send && process.send({
      type: "EVENT",
      message: {
        type: "UNCAUGHT_EXCEPTION",
        payload: {
          error: { name: error.name, message: error.message, stack: error.stack },
          origin
        },
        version: "v1"
      }
    });
  } else {
    process.send && process.send({
      type: "EVENT",
      message: {
        type: "UNCAUGHT_EXCEPTION",
        payload: {
          error: {
            name: "Error",
            message: typeof error === "string" ? error : JSON.stringify(error)
          },
          origin
        },
        version: "v1"
      }
    });
  }
});
process.title = `trigger-dev-run-worker (${getEnvVar("TRIGGER_WORKER_VERSION") ?? "unknown version"})`;
var heartbeatIntervalMs = getEnvVar("HEARTBEAT_INTERVAL_MS");
var standardLocalsManager = new StandardLocalsManager();
localsAPI.setGlobalLocalsManager(standardLocalsManager);
var standardLifecycleHooksManager = new StandardLifecycleHooksManager();
lifecycleHooks.setGlobalLifecycleHooksManager(standardLifecycleHooksManager);
var standardRunTimelineMetricsManager = new StandardRunTimelineMetricsManager();
runTimelineMetrics.setGlobalManager(standardRunTimelineMetricsManager);
var devUsageManager = new DevUsageManager();
usage.setGlobalUsageManager(devUsageManager);
var usageTimeoutManager = new UsageTimeoutManager(devUsageManager);
timeout.setGlobalManager(usageTimeoutManager);
timeout.registerListener(async (maxDurationInSeconds, elapsedTimeInSeconds) => {
  log(`[${(/* @__PURE__ */ new Date()).toISOString()}] Max duration exceeded: ${maxDurationInSeconds}s, elapsed: ${elapsedTimeInSeconds}s`);
  await zodIpc.send("MAX_DURATION_EXCEEDED", {
    maxDurationInSeconds,
    elapsedTimeInSeconds
  });
});
var standardResourceCatalog = new StandardResourceCatalog();
resourceCatalog.setGlobalResourceCatalog(standardResourceCatalog);
var standardTraceContextManager = new StandardTraceContextManager();
traceContext.setGlobalManager(standardTraceContextManager);
var durableClock = new PreciseWallClock();
clock.setGlobalClock(durableClock);
var runMetadataManager = new StandardMetadataManager(apiClientManager.clientOrThrow());
runMetadata.setGlobalManager(runMetadataManager);
var standardRealtimeStreamsManager = new StandardRealtimeStreamsManager(apiClientManager.clientOrThrow(), getEnvVar("TRIGGER_STREAM_URL", getEnvVar("TRIGGER_API_URL")) ?? "https://api.trigger.dev", (getEnvVar("TRIGGER_STREAMS_DEBUG") === "1" || getEnvVar("TRIGGER_STREAMS_DEBUG") === "true") ?? false);
realtimeStreams.setGlobalManager(standardRealtimeStreamsManager);
var waitUntilTimeoutInMs = getNumberEnvVar("TRIGGER_WAIT_UNTIL_TIMEOUT_MS", 6e4);
var waitUntilManager = new StandardWaitUntilManager(waitUntilTimeoutInMs);
waitUntil.setGlobalManager(waitUntilManager);
var triggerLogLevel = getEnvVar("TRIGGER_LOG_LEVEL");
var showInternalLogs = getEnvVar("RUN_WORKER_SHOW_LOGS") === "true";
var standardHeartbeatsManager = new StandardHeartbeatsManager(parseInt(heartbeatIntervalMs ?? "30000", 10));
heartbeats.setGlobalManager(standardHeartbeatsManager);
async function importConfig(configPath) {
  const configModule = await import(normalizeImportPath(configPath));
  const config = configModule?.default ?? configModule?.config;
  return {
    config,
    handleError: configModule?.handleError
  };
}
__name(importConfig, "importConfig");
async function loadWorkerManifest() {
  const manifestContents = await readFile(o.TRIGGER_WORKER_MANIFEST_PATH, "utf-8");
  const raw = JSON.parse(manifestContents);
  return WorkerManifest.parse(raw);
}
__name(loadWorkerManifest, "loadWorkerManifest");
async function doBootstrap() {
  return await runTimelineMetrics.measureMetric("trigger.dev/start", "bootstrap", {}, async () => {
    log("Bootstrapping worker");
    const workerManifest = await loadWorkerManifest();
    resourceCatalog.registerWorkerManifest(workerManifest);
    const { config, handleError } = await importConfig(workerManifest.configPath);
    const tracingSDK = new TracingSDK({
      url: o.TRIGGER_OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://0.0.0.0:4318",
      instrumentations: config.telemetry?.instrumentations ?? config.instrumentations ?? [],
      exporters: config.telemetry?.exporters ?? [],
      logExporters: config.telemetry?.logExporters ?? [],
      diagLogLevel: o.TRIGGER_OTEL_LOG_LEVEL ?? "none",
      forceFlushTimeoutMillis: 3e4,
      resource: config.telemetry?.resource
    });
    const otelTracer = tracingSDK.getTracer("trigger-dev-worker", VERSION);
    const otelLogger = tracingSDK.getLogger("trigger-dev-worker", VERSION);
    const tracer = new TriggerTracer({ tracer: otelTracer, logger: otelLogger });
    const consoleInterceptor = new ConsoleInterceptor(otelLogger, typeof config.enableConsoleLogging === "boolean" ? config.enableConsoleLogging : true, typeof config.disableConsoleInterceptor === "boolean" ? config.disableConsoleInterceptor : false, OTEL_LOG_ATTRIBUTE_COUNT_LIMIT);
    const configLogLevel = triggerLogLevel ?? config.logLevel ?? "info";
    const otelTaskLogger = new OtelTaskLogger({
      logger: otelLogger,
      tracer,
      level: logLevels.includes(configLogLevel) ? configLogLevel : "info",
      maxAttributeCount: OTEL_LOG_ATTRIBUTE_COUNT_LIMIT
    });
    logger.setGlobalTaskLogger(otelTaskLogger);
    if (config.init) {
      lifecycleHooks.registerGlobalInitHook({
        id: "config",
        fn: config.init
      });
    }
    if (config.onStart) {
      lifecycleHooks.registerGlobalStartHook({
        id: "config",
        fn: config.onStart
      });
    }
    if (config.onSuccess) {
      lifecycleHooks.registerGlobalSuccessHook({
        id: "config",
        fn: config.onSuccess
      });
    }
    if (config.onFailure) {
      lifecycleHooks.registerGlobalFailureHook({
        id: "config",
        fn: config.onFailure
      });
    }
    if (handleError) {
      lifecycleHooks.registerGlobalCatchErrorHook({
        id: "config",
        fn: handleError
      });
    }
    log("Bootstrapped worker");
    return {
      tracer,
      tracingSDK,
      consoleInterceptor,
      config,
      workerManifest
    };
  });
}
__name(doBootstrap, "doBootstrap");
var bootstrapCache;
async function bootstrap() {
  if (!bootstrapCache) {
    bootstrapCache = await doBootstrap();
  }
  return bootstrapCache;
}
__name(bootstrap, "bootstrap");
var _execution;
var _isRunning = false;
var _isCancelled = false;
var _tracingSDK;
var _executionMeasurement;
var _cancelController = new AbortController();
var _lastFlushPromise;
var _sharedWorkerRuntime;
var _lastEnv;
var _executionCount = 0;
function resetExecutionEnvironment() {
  _execution = void 0;
  _isRunning = false;
  _isCancelled = false;
  _executionMeasurement = void 0;
  _cancelController = new AbortController();
  standardLocalsManager.reset();
  standardLifecycleHooksManager.reset();
  standardRunTimelineMetricsManager.reset();
  devUsageManager.reset();
  usageTimeoutManager.reset();
  runMetadataManager.reset();
  standardRealtimeStreamsManager.reset();
  waitUntilManager.reset();
  _sharedWorkerRuntime?.reset();
  durableClock.reset();
  taskContext.disable();
  standardTraceContextManager.reset();
  standardHeartbeatsManager.reset();
  waitUntil.register({
    requiresResolving: /* @__PURE__ */ __name(() => standardRealtimeStreamsManager.hasActiveStreams(), "requiresResolving"),
    promise: /* @__PURE__ */ __name((timeoutInMs) => standardRealtimeStreamsManager.waitForAllStreams(timeoutInMs), "promise")
  });
  log(`[${(/* @__PURE__ */ new Date()).toISOString()}] Reset execution environment`);
}
__name(resetExecutionEnvironment, "resetExecutionEnvironment");
var zodIpc = new ZodIpcConnection({
  listenSchema: WorkerToExecutorMessageCatalog,
  emitSchema: ExecutorToWorkerMessageCatalog,
  process,
  handlers: {
    EXECUTE_TASK_RUN: /* @__PURE__ */ __name(async ({ execution, traceContext: traceContext2, metadata, metrics, env, isWarmStart }, sender) => {
      if (env) {
        populateEnv(env, {
          override: true,
          previousEnv: _lastEnv
        });
        _lastEnv = env;
      }
      log(`[${(/* @__PURE__ */ new Date()).toISOString()}] Received EXECUTE_TASK_RUN`, execution);
      if (_lastFlushPromise) {
        const now = performance.now();
        await _lastFlushPromise;
        const duration = performance.now() - now;
        log(`[${(/* @__PURE__ */ new Date()).toISOString()}] Awaited last flush in ${duration}ms`);
      }
      resetExecutionEnvironment();
      standardTraceContextManager.traceContext = traceContext2;
      standardRunTimelineMetricsManager.registerMetricsFromExecution(metrics, isWarmStart);
      if (_isRunning) {
        logError("Worker is already running a task");
        await sender.send("TASK_RUN_COMPLETED", {
          execution,
          result: {
            ok: false,
            id: execution.run.id,
            error: {
              type: "INTERNAL_ERROR",
              code: TaskRunErrorCodes.TASK_ALREADY_RUNNING
            },
            usage: {
              durationMs: 0
            },
            flushedMetadata: await runMetadataManager.stopAndReturnLastFlush()
          }
        });
        return;
      }
      const ctx = TaskRunContext.parse(execution);
      taskContext.setGlobalTaskContext({
        ctx,
        worker: metadata,
        isWarmStart: isWarmStart ?? false
      });
      try {
        const { tracer, tracingSDK, consoleInterceptor, config, workerManifest } = await bootstrap();
        _tracingSDK = tracingSDK;
        const taskManifest = workerManifest.tasks.find((t) => t.id === execution.task.id);
        if (!taskManifest) {
          logError(`Could not find task ${execution.task.id}`);
          await sender.send("TASK_RUN_COMPLETED", {
            execution,
            result: {
              ok: false,
              id: execution.run.id,
              error: {
                type: "INTERNAL_ERROR",
                code: TaskRunErrorCodes.COULD_NOT_FIND_TASK,
                message: `Could not find task ${execution.task.id}. Make sure the task is exported and the ID is correct.`
              },
              usage: {
                durationMs: 0
              },
              flushedMetadata: await runMetadataManager.stopAndReturnLastFlush()
            }
          });
          return;
        }
        let task = resourceCatalog.getTask(execution.task.id);
        if (!task) {
          log(`Could not find task ${execution.task.id} in resource catalog, importing...`);
          try {
            await runTimelineMetrics.measureMetric("trigger.dev/start", "import", {
              entryPoint: taskManifest.entryPoint,
              file: taskManifest.filePath
            }, async () => {
              const beforeImport = performance.now();
              resourceCatalog.setCurrentFileContext(taskManifest.entryPoint, taskManifest.filePath);
              if (workerManifest.initEntryPoint) {
                try {
                  await import(normalizeImportPath(workerManifest.initEntryPoint));
                  log(`Loaded init file from ${workerManifest.initEntryPoint}`);
                } catch (err) {
                  logError(`Failed to load init file`, err);
                  throw err;
                }
              }
              await import(normalizeImportPath(taskManifest.entryPoint));
              resourceCatalog.clearCurrentFileContext();
              const durationMs = performance.now() - beforeImport;
              log(`Imported task ${execution.task.id} [${taskManifest.entryPoint}] in ${durationMs}ms`);
            });
          } catch (err) {
            logError(`Failed to import task ${execution.task.id}`, err);
            await sender.send("TASK_RUN_COMPLETED", {
              execution,
              result: {
                ok: false,
                id: execution.run.id,
                error: {
                  type: "INTERNAL_ERROR",
                  code: TaskRunErrorCodes.COULD_NOT_IMPORT_TASK,
                  message: err instanceof Error ? err.message : String(err),
                  stackTrace: err instanceof Error ? err.stack : void 0
                },
                usage: {
                  durationMs: 0
                },
                flushedMetadata: await runMetadataManager.stopAndReturnLastFlush()
              }
            });
            return;
          }
          task = resourceCatalog.getTask(execution.task.id);
        }
        if (!task) {
          logError(`Could not find task ${execution.task.id}`);
          await sender.send("TASK_RUN_COMPLETED", {
            execution,
            result: {
              ok: false,
              id: execution.run.id,
              error: {
                type: "INTERNAL_ERROR",
                code: TaskRunErrorCodes.COULD_NOT_FIND_EXECUTOR
              },
              usage: {
                durationMs: 0
              },
              flushedMetadata: await runMetadataManager.stopAndReturnLastFlush()
            }
          });
          return;
        }
        runMetadataManager.runId = execution.run.id;
        runMetadataManager.runIdIsRoot = typeof execution.run.rootTaskRunId === "undefined";
        _executionCount++;
        const executor = new TaskExecutor(task, {
          tracer,
          tracingSDK,
          consoleInterceptor,
          retries: config.retries,
          isWarmStart,
          executionCount: _executionCount
        });
        try {
          _execution = execution;
          _isRunning = true;
          standardHeartbeatsManager.startHeartbeat(attemptKey(execution));
          runMetadataManager.startPeriodicFlush(getNumberEnvVar("TRIGGER_RUN_METADATA_FLUSH_INTERVAL", 1e3));
          devUsageManager.setInitialState({
            cpuTime: execution.run.durationMs ?? 0,
            costInCents: execution.run.costInCents ?? 0
          });
          _executionMeasurement = usage.start();
          const timeoutController = timeout.abortAfterTimeout(execution.run.maxDuration);
          const signal = AbortSignal.any([_cancelController.signal, timeoutController.signal]);
          const { result } = await executor.execute(execution, ctx, signal);
          if (_isRunning && !_isCancelled) {
            const usageSample = usage.stop(_executionMeasurement);
            return sender.send("TASK_RUN_COMPLETED", {
              execution,
              result: {
                ...result,
                usage: {
                  durationMs: usageSample.cpuTime
                },
                flushedMetadata: await runMetadataManager.stopAndReturnLastFlush()
              }
            });
          }
        } finally {
          standardHeartbeatsManager.stopHeartbeat();
          _execution = void 0;
          _isRunning = false;
          log(`[${(/* @__PURE__ */ new Date()).toISOString()}] Task run completed`);
        }
      } catch (err) {
        logError("Failed to execute task", err);
        await sender.send("TASK_RUN_COMPLETED", {
          execution,
          result: {
            ok: false,
            id: execution.run.id,
            error: {
              type: "INTERNAL_ERROR",
              code: TaskRunErrorCodes.CONFIGURED_INCORRECTLY,
              message: err instanceof Error ? err.message : String(err),
              stackTrace: err instanceof Error ? err.stack : void 0
            },
            usage: {
              durationMs: 0
            },
            flushedMetadata: await runMetadataManager.stopAndReturnLastFlush()
          }
        });
      }
    }, "EXECUTE_TASK_RUN"),
    CANCEL: /* @__PURE__ */ __name(async ({ timeoutInMs }) => {
      _isCancelled = true;
      _cancelController.abort("run cancelled");
      await callCancelHooks(timeoutInMs);
      if (_executionMeasurement) {
        usage.stop(_executionMeasurement);
      }
      await flushAll(timeoutInMs);
    }, "CANCEL"),
    FLUSH: /* @__PURE__ */ __name(async ({ timeoutInMs }) => {
      await flushAll(timeoutInMs);
    }, "FLUSH"),
    RESOLVE_WAITPOINT: /* @__PURE__ */ __name(async ({ waitpoint }) => {
      _sharedWorkerRuntime?.resolveWaitpoints([waitpoint]);
    }, "RESOLVE_WAITPOINT")
  }
});
async function callCancelHooks(timeoutInMs = 1e4) {
  const now = performance.now();
  try {
    await Promise.race([lifecycleHooks.callOnCancelHookListeners(), setTimeout2(timeoutInMs)]);
  } finally {
    const duration = performance.now() - now;
    log(`Called cancel hooks in ${duration}ms`);
  }
}
__name(callCancelHooks, "callCancelHooks");
async function flushAll(timeoutInMs = 1e4) {
  const now = performance.now();
  const { promise, resolve } = promiseWithResolvers();
  _lastFlushPromise = promise;
  const results = await Promise.allSettled([
    flushTracingSDK(timeoutInMs),
    flushMetadata(timeoutInMs)
  ]);
  const successfulFlushes = results.filter((result) => result.status === "fulfilled").map((result) => result.value.flushed);
  const failedFlushes = ["tracingSDK", "runMetadata"].filter((flushed) => !successfulFlushes.includes(flushed));
  if (failedFlushes.length > 0) {
    logError(`Failed to flush ${failedFlushes.join(", ")}`);
  }
  const errorMessages = results.filter((result) => result.status === "rejected").map((result) => result.reason);
  if (errorMessages.length > 0) {
    logError(errorMessages.join("\n"));
  }
  for (const flushed of successfulFlushes) {
    log(`Flushed ${flushed} successfully`);
  }
  const duration = performance.now() - now;
  log(`Flushed all in ${duration}ms`);
  resolve();
}
__name(flushAll, "flushAll");
async function flushTracingSDK(timeoutInMs = 1e4) {
  const now = performance.now();
  await Promise.race([_tracingSDK?.flush(), setTimeout2(timeoutInMs)]);
  const duration = performance.now() - now;
  log(`Flushed tracingSDK in ${duration}ms`);
  return {
    flushed: "tracingSDK",
    durationMs: duration
  };
}
__name(flushTracingSDK, "flushTracingSDK");
async function flushMetadata(timeoutInMs = 1e4) {
  const now = performance.now();
  await Promise.race([runMetadataManager.flush(), setTimeout2(timeoutInMs)]);
  const duration = performance.now() - now;
  log(`Flushed runMetadata in ${duration}ms`);
  return {
    flushed: "runMetadata",
    durationMs: duration
  };
}
__name(flushMetadata, "flushMetadata");
_sharedWorkerRuntime = new SharedRuntimeManager(zodIpc, showInternalLogs);
runtime.setGlobalRuntimeManager(_sharedWorkerRuntime);
standardHeartbeatsManager.registerListener(async (id) => {
  await zodIpc.send("TASK_HEARTBEAT", { id });
});
function log(message, ...args) {
  if (!showInternalLogs)
    return;
  console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`, args);
}
__name(log, "log");
function logError(message, error) {
  if (!showInternalLogs)
    return;
  console.error(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`, error);
}
__name(logError, "logError");
log(`Executor started`);
//# sourceMappingURL=dev-run-worker.mjs.map
