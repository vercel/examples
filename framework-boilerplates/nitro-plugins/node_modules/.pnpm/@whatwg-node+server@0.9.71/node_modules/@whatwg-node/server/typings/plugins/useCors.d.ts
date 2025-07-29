import { MaybePromise } from '@whatwg-node/promise-helpers';
import type { ServerAdapterPlugin } from './types.js';
export type CORSOptions = {
    origin?: string[] | string;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
} | false;
export type CORSPluginOptions<TServerContext> = CORSOptionsFactory<TServerContext> | CORSOptions | boolean;
export type CORSOptionsFactory<TServerContext> = (request: Request, ...args: {} extends TServerContext ? [serverContext?: TServerContext | undefined] : [serverContext: TServerContext]) => MaybePromise<CORSOptions>;
export declare function getCORSHeadersByRequestAndOptions(request: Request, corsOptions: CORSOptions): Record<string, string> | null;
export declare function useCORS<TServerContext>(options?: CORSPluginOptions<TServerContext>): ServerAdapterPlugin<TServerContext>;
