export declare const getEvent: (request: Request) => Pick<FetchEvent, "request" | "waitUntil">;
export declare const mockKV: (kvStore: Record<string, string>) => {
    get: (path: string) => string;
};
export declare const mockManifest: () => string;
export declare const mockCaches: () => {
    default: {
        match(key: Request): Promise<Response>;
        put(key: Request, val: Response): Promise<void>;
    };
};
export declare function mockRequestScope(): void;
export declare function mockGlobalScope(): void;
export declare const sleep: (milliseconds: number) => Promise<unknown>;
