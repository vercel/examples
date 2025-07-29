type LogFunction = (...args: unknown[]) => void;
interface Logger {
    system: LogFunction;
    user: LogFunction;
}
declare const getLogger: (systemLogger?: LogFunction, debug?: boolean) => Logger;
export { getLogger };
export type { LogFunction, Logger };
