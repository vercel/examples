export declare function setImmediateFallbackPromises<T = void>(value?: T): Promise<T>;
export declare function setImmediateFallback<TArgs extends any[]>(callback: (...args: TArgs) => void, ...args: TArgs): NodeJS.Immediate;
export declare function clearImmediateFallback(immediate: NodeJS.Immediate | undefined);
