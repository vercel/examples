import type { LambdaEvent } from './event.js';
import type { LambdaResponse } from './response.js';
export interface LambdaHandler {
    (event: LambdaEvent, context: object): void | Promise<LambdaResponse>;
}
