import * as CF from '@cloudflare/workers-types';
import { DurableObject } from 'cloudflare:workers';
import { Adapter, AdapterInstance, AdapterOptions } from '../index.mjs';
import { W as WebSocket$1 } from '../shared/crossws.BQXMA5bH.mjs';

type ResolveDurableStub = (req: CF.Request, env: unknown, context: CF.ExecutionContext) => CF.DurableObjectStub | Promise<CF.DurableObjectStub>;
interface CloudflareOptions extends AdapterOptions {
    /**
     * Durable Object binding name from environment.
     *
     * **Note:** This option will be ignored if `resolveDurableStub` is provided.
     *
     * @default "$DurableObject"
     */
    bindingName?: string;
    /**
     * Durable Object instance name.
     *
     * **Note:** This option will be ignored if `resolveDurableStub` is provided.
     *
     * @default "crossws"
     */
    instanceName?: string;
    /**
     * Custom function that resolves Durable Object binding to handle the WebSocket upgrade.
     *
     * **Note:** This option will override `bindingName` and `instanceName`.
     */
    resolveDurableStub?: ResolveDurableStub;
}
declare const cloudflareDurableAdapter: Adapter<CloudflareDurableAdapter, CloudflareOptions>;

interface CloudflareDurableAdapter extends AdapterInstance {
    handleUpgrade(req: Request | CF.Request, env: unknown, context: CF.ExecutionContext): Promise<Response>;
    handleDurableInit(obj: DurableObject, state: DurableObjectState, env: unknown): void;
    handleDurableUpgrade(obj: DurableObject, req: Request | CF.Request): Promise<Response>;
    handleDurableMessage(obj: DurableObject, ws: WebSocket | CF.WebSocket | WebSocket$1, message: ArrayBuffer | string): Promise<void>;
    handleDurableClose(obj: DurableObject, ws: WebSocket | CF.WebSocket | WebSocket$1, code: number, reason: string, wasClean: boolean): Promise<void>;
}

export { cloudflareDurableAdapter as default };
export type { CloudflareDurableAdapter, CloudflareOptions };
