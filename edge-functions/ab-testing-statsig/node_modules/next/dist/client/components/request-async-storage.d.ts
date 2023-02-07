/// <reference types="node" />
import type { AsyncLocalStorage } from 'async_hooks';
import type { ReadonlyHeaders, ReadonlyRequestCookies } from '../../server/app-render';
export interface RequestStore {
    headers: ReadonlyHeaders;
    cookies: ReadonlyRequestCookies;
    previewData: any;
}
export declare let requestAsyncStorage: AsyncLocalStorage<RequestStore> | RequestStore;
