import { Adapter, AdapterInstance, AdapterOptions } from '../index.js';
import * as CF from '@cloudflare/workers-types';
import '../shared/crossws.BQXMA5bH.js';

interface CloudflareAdapter extends AdapterInstance {
    handleUpgrade(req: CF.Request, env: unknown, context: CF.ExecutionContext): Promise<CF.Response>;
}
interface CloudflareOptions extends AdapterOptions {
}
declare const cloudflareAdapter: Adapter<CloudflareAdapter, CloudflareOptions>;

export { cloudflareAdapter as default };
export type { CloudflareAdapter, CloudflareOptions };
