import type nodeTimers from "node:timers";
export declare function setTimeoutFallbackPromises<T = void>(delay?: number, value?: T, options?: nodeTimers.TimerOptions): Promise<T>;
export declare function setTimeoutFallback(callback: TimerHandler, ms?: number): NodeJS.Timeout;
