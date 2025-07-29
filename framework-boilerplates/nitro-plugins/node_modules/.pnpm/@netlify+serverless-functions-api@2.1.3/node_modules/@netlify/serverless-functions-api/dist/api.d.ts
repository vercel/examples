import { Context } from './context.js';
import './fingerprint.js';
export declare const REQUEST_SIGNAL_BUFFER = 20;
type RequestHandler = (req: Request, context: Context) => Promise<Response | void>;
export type V2Function = {
    default: RequestHandler;
};
export declare const getLambdaHandler: (funcOrFuncPath: V2Function | string) => import("./lambda/handler.js").LambdaHandler;
export {};
