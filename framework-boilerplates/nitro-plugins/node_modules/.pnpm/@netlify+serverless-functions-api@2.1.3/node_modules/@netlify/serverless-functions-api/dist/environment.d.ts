import { LambdaContext } from './lambda/context.js';
import { InvocationMetadata, LambdaEvent } from './lambda/event.js';
export declare const setupEnvironment: (headers: Headers, event: LambdaEvent, lambdaContext?: LambdaContext, invocationMetadata?: InvocationMetadata) => void;
