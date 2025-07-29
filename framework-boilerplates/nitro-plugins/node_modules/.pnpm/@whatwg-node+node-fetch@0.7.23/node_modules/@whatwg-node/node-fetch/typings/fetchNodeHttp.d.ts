import { PonyfillRequest } from './Request.js';
import { PonyfillResponse } from './Response.js';
export declare function fetchNodeHttp<TResponseJSON = any, TRequestJSON = any>(fetchRequest: PonyfillRequest<TRequestJSON>): Promise<PonyfillResponse<TResponseJSON>>;
