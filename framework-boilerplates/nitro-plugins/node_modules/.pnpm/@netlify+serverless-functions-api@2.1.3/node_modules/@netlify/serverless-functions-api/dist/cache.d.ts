import { RequestContextFactory } from '@netlify/cache/bootstrap';
import type { LambdaEvent } from './lambda/event.js';
export type CacheAPIContext = ReturnType<RequestContextFactory>;
export declare const getContextFromRequest: (event: LambdaEvent) => {
    host: string;
    token: string;
    url: string;
} | null;
