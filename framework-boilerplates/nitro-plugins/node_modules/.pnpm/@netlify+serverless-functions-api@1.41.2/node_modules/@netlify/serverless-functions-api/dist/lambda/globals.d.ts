import type { LambdaContext } from './context.js';
import type { LambdaEvent } from './event.js';
import type { LambdaHandler } from './handler.js';
import type { LambdaResponse } from './response.js';
declare global {
    namespace awslambda {
        function streamifyResponse(handler: (event: LambdaEvent, responseStream: NodeJS.WritableStream, context: LambdaContext) => Promise<void>): LambdaHandler;
        namespace HttpResponseStream {
            function from(stream: NodeJS.WritableStream, metadata: Omit<LambdaResponse, 'body'>): NodeJS.WritableStream;
        }
    }
}
