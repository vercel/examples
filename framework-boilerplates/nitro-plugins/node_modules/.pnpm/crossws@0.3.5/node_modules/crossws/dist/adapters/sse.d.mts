import { Adapter, AdapterInstance, AdapterOptions } from '../index.mjs';
import '../shared/crossws.BQXMA5bH.mjs';

interface SSEAdapter extends AdapterInstance {
    fetch(req: Request): Promise<Response>;
}
interface SSEOptions extends AdapterOptions {
    bidir?: boolean;
}
declare const sseAdapter: Adapter<SSEAdapter, SSEOptions>;

export { sseAdapter as default };
export type { SSEAdapter, SSEOptions };
