import { PonyfillRequest, RequestPonyfillInit } from './Request.js';
import { PonyfillResponse } from './Response.js';
export declare function fetchPonyfill<TResponseJSON = any, TRequestJSON = any>(info: string | PonyfillRequest<TRequestJSON> | URL, init?: RequestPonyfillInit): Promise<PonyfillResponse<TResponseJSON>>;
