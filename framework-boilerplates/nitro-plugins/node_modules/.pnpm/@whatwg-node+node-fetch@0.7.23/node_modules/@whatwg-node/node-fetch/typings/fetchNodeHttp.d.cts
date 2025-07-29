import { PonyfillRequest } from './Request.cjs';
import { PonyfillResponse } from './Response.cjs';
export declare function fetchNodeHttp<TResponseJSON = any, TRequestJSON = any>(fetchRequest: PonyfillRequest<TRequestJSON>): Promise<PonyfillResponse<TResponseJSON>>;
