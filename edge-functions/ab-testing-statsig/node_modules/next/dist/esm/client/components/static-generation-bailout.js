import { DynamicServerError } from './hooks-server-context';
import { staticGenerationAsyncStorage } from './static-generation-async-storage';
export function staticGenerationBailout(reason) {
    const staticGenerationStore = staticGenerationAsyncStorage && 'getStore' in staticGenerationAsyncStorage ? staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore() : staticGenerationAsyncStorage;
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) {
        if (staticGenerationStore) {
            staticGenerationStore.fetchRevalidate = 0;
        }
        throw new DynamicServerError(reason);
    }
    return false;
}

//# sourceMappingURL=static-generation-bailout.js.map