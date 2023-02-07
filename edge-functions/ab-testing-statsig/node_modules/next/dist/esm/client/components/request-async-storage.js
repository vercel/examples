export let requestAsyncStorage = {};
// @ts-expect-error we provide this on globalThis in
// the edge and node runtime
if (globalThis.AsyncLocalStorage) {
    requestAsyncStorage = new globalThis.AsyncLocalStorage();
}

//# sourceMappingURL=request-async-storage.js.map