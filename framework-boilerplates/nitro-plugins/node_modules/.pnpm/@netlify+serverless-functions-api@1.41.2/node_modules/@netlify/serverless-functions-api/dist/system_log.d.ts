export declare const SYSTEM_LOG_PREFIX = "__nfSystemLog";
export declare const systemLog: (msg: string, fields?: Record<string, string | number | boolean>) => void;
interface SystemLog {
    fields?: unknown;
    message?: string;
    type: string;
}
export declare const structuredSystemLog: (payload: SystemLog) => void;
export {};
