import { RequestListener } from 'node:http';
import { L as ListenOptions, a as Listener } from './shared/listhen.1c46e31d.mjs';
export { b as Certificate, C as CrossWSOptions, G as GetURLOptions, H as HTTPSOptions, c as ListenURL, S as ShowURLOptions } from './shared/listhen.1c46e31d.mjs';
import { ConsolaInstance } from 'consola';
import * as http from 'http';
import * as crossws_adapters_node from 'crossws/adapters/node';
import * as h3 from 'h3';
import * as jiti_lib_types from 'jiti/lib/types';
import 'node:https';
import 'node:net';
import 'get-port-please';

declare function listen(handle: RequestListener, _options?: Partial<ListenOptions>): Promise<Listener>;

interface DevServerOptions {
    cwd?: string;
    staticDirs?: string[];
    logger?: ConsolaInstance;
    ws?: ListenOptions["ws"];
}
declare function createDevServer(entry: string, options: DevServerOptions): Promise<{
    cwd: string;
    resolver: {
        relative: (path: string) => string;
        formatRelative: (path: string) => string;
        import: (id: string, opts?: jiti_lib_types.JitiResolveOptions) => Promise<unknown>;
        resolve: (id: string) => string;
        tryResolve: (id: string) => string | undefined;
    };
    nodeListener: h3.NodeListener;
    reload: (_initial?: boolean) => Promise<void>;
    _ws: false | crossws_adapters_node.NodeOptions | ((req: http.IncomingMessage, head: Buffer) => void) | undefined;
    _entry: string | undefined;
}>;

interface WatchOptions extends DevServerOptions {
    cwd?: string;
    logger?: ConsolaInstance;
    ignore?: string[];
    publicDirs?: string[];
}
declare function listenAndWatch(entry: string, options: Partial<ListenOptions & WatchOptions>): Promise<Listener>;

export { type DevServerOptions, ListenOptions, Listener, type WatchOptions, createDevServer, listen, listenAndWatch };
