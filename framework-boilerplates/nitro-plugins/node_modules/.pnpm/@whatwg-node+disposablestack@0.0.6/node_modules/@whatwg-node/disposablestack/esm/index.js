import { PonyfillAsyncDisposableStack } from './AsyncDisposableStack.js';
import { PonyfillDisposableStack } from './DisposableStack.js';
import { PonyfillSuppressedError } from './SupressedError.js';
export const DisposableStack = globalThis.DisposableStack || PonyfillDisposableStack;
export const AsyncDisposableStack = globalThis.AsyncDisposableStack || PonyfillAsyncDisposableStack;
export const SuppressedError = globalThis.SuppressedError || PonyfillSuppressedError;
export * from './symbols.js';
