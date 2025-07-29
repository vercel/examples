declare enum LogLevel {
    Debug = 1,
    Log = 2,
    Error = 3
}
declare class SystemLogger {
    private readonly fields;
    private readonly logLevel;
    constructor(fields?: Record<string, unknown>, logLevel?: LogLevel);
    private doLog;
    log(message: string): void;
    debug(message: string): void;
    error(message: string): void;
    withLogLevel(level: LogLevel): SystemLogger;
    withFields(fields: Record<string, unknown>): SystemLogger;
    withError(error: unknown): SystemLogger;
}
declare const systemLogger: SystemLogger;

export { LogLevel, systemLogger };
