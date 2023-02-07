export let staticGenerationAsyncStorage = {};
// @ts-expect-error we provide this on globalThis in
// the edge and node runtime
if (globalThis.AsyncLocalStorage) {
    staticGenerationAsyncStorage = new globalThis.AsyncLocalStorage();
}

//# sourceMappingURL=static-generation-async-storage.js.map