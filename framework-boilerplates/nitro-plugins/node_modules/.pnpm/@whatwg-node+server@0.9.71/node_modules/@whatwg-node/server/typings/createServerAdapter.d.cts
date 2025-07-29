import { ServerAdapterPlugin } from './plugins/types.cjs';
import { FetchAPI, ServerAdapter, ServerAdapterBaseObject, ServerAdapterRequestHandler } from './types.cjs';
export interface ServerAdapterOptions<TServerContext> {
    plugins?: ServerAdapterPlugin<TServerContext>[];
    fetchAPI?: Partial<FetchAPI>;
    /**
     * Node.js only!
     *
     * If true, the server adapter will dispose itself when the process is terminated.
     * If false, you have to dispose the server adapter by using the `dispose` method,
     * or [Explicit Resource Management](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html)
     */
    disposeOnProcessTerminate?: boolean;
}
declare function createServerAdapter<TServerContext = {}, THandleRequest extends ServerAdapterRequestHandler<TServerContext> = ServerAdapterRequestHandler<TServerContext>>(serverAdapterRequestHandler: THandleRequest, options?: ServerAdapterOptions<TServerContext>): ServerAdapter<TServerContext, ServerAdapterBaseObject<TServerContext, THandleRequest>>;
declare function createServerAdapter<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext>>(serverAdapterBaseObject: TBaseObject, options?: ServerAdapterOptions<TServerContext>): ServerAdapter<TServerContext, TBaseObject>;
export { createServerAdapter };
