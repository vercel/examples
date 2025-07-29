import { PonyfillRequest, RequestPonyfillInit } from './Request.cjs';
import { PonyfillResponse } from './Response.cjs';
export declare function fetchPonyfill<TResponseJSON = any, TRequestJSON = any>(info: string | PonyfillRequest<TRequestJSON> | URL, init?: RequestPonyfillInit): Promise<PonyfillResponse<TResponseJSON>>;
