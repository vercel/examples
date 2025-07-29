export declare function setIntervalFallbackPromises<T = void>(delay?: number, value?: T): NodeJS.AsyncIterator<T>;
export declare function setIntervalFallback(callback: (args: void) => void, ms?: number): NodeJS.Timeout;
