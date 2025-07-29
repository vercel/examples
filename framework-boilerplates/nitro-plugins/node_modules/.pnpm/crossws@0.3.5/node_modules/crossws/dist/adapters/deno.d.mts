import { Adapter, AdapterInstance, AdapterOptions } from '../index.mjs';
import '../shared/crossws.BQXMA5bH.mjs';

interface DenoAdapter extends AdapterInstance {
    handleUpgrade(req: Request, info: ServeHandlerInfo): Promise<Response>;
}
interface DenoOptions extends AdapterOptions {
}
type ServeHandlerInfo = {
    remoteAddr?: {
        transport: string;
        hostname: string;
        port: number;
    };
};
declare const denoAdapter: Adapter<DenoAdapter, DenoOptions>;

export { denoAdapter as default };
export type { DenoAdapter, DenoOptions };
