import { WebSocketHandler, ServerWebSocket, Server } from 'bun';
import { Adapter, AdapterInstance, Peer, AdapterOptions } from '../index.mjs';
import '../shared/crossws.BQXMA5bH.mjs';

interface BunAdapter extends AdapterInstance {
    websocket: WebSocketHandler<ContextData>;
    handleUpgrade(req: Request, server: Server): Promise<Response | undefined>;
}
interface BunOptions extends AdapterOptions {
}
type ContextData = {
    peer?: BunPeer;
    request: Request;
    server?: Server;
    context: Peer["context"];
};
declare const bunAdapter: Adapter<BunAdapter, BunOptions>;

declare class BunPeer extends Peer<{
    ws: ServerWebSocket<ContextData>;
    request: Request;
    peers: Set<BunPeer>;
}> {
    get remoteAddress(): string;
    get context(): Peer["context"];
    send(data: unknown, options?: {
        compress?: boolean;
    }): number;
    publish(topic: string, data: unknown, options?: {
        compress?: boolean;
    }): number;
    subscribe(topic: string): void;
    unsubscribe(topic: string): void;
    close(code?: number, reason?: string): void;
    terminate(): void;
}

export { bunAdapter as default };
export type { BunAdapter, BunOptions };
