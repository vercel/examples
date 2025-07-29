import { AsyncLocalStorage } from "node:async_hooks";
import { createError } from "h3";
import { getContext } from "unctx";
export const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: import.meta._asyncContext,
  AsyncLocalStorage: import.meta._asyncContext ? AsyncLocalStorage : void 0
});
export function useEvent() {
  try {
    return nitroAsyncContext.use().event;
  } catch {
    const hint = import.meta._asyncContext ? "Note: This is an experimental feature and might be broken on non-Node.js environments." : "Enable the experimental flag using `experimental.asyncContext: true`.";
    throw createError({
      message: `Nitro request context is not available. ${hint}`
    });
  }
}
