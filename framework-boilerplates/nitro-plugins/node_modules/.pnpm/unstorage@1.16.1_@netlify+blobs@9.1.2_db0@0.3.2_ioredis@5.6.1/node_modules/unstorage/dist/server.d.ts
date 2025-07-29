import { RequestListener } from 'node:http';
import { H3Event, EventHandler } from 'h3';
import { a as Storage } from './shared/unstorage.Ca7R4QL2.js';

type StorageServerRequest = {
    event: H3Event;
    key: string;
    type: "read" | "write";
};
interface StorageServerOptions {
    authorize?: (request: StorageServerRequest) => void | Promise<void>;
    resolvePath?: (event: H3Event) => string;
}
/**
 * This function creates an h3-based handler for the storage server. It can then be used as event handler in h3 or Nitro
 * @param storage The storage which should be used for the storage server
 * @param opts Storage options to set the authorization check or a custom path resolver
 * @returns
 * @see createStorageServer if a node-compatible handler is needed
 */
declare function createH3StorageHandler(storage: Storage, opts?: StorageServerOptions): EventHandler;
/**
 * This function creates a node-compatible handler for your custom storage server.
 *
 * The storage server will handle HEAD, GET, PUT and DELETE requests.
 * HEAD: Return if the request item exists in the storage, including a last-modified header if the storage supports it and the meta is stored
 * GET: Return the item if it exists
 * PUT: Sets the item
 * DELETE: Removes the item (or clears the whole storage if the base key was used)
 *
 * If the request sets the `Accept` header to `application/octet-stream`, the server will handle the item as raw data.
 *
 * @param storage The storage which should be used for the storage server
 * @param options Defining functions such as an authorization check and a custom path resolver
 * @returns An object containing then `handle` function for the handler
 * @see createH3StorageHandler For the bare h3 version which can be used with h3 or Nitro
 */
declare function createStorageServer(storage: Storage, options?: StorageServerOptions): {
    handle: RequestListener;
};

export { createH3StorageHandler, createStorageServer };
export type { StorageServerOptions, StorageServerRequest };
