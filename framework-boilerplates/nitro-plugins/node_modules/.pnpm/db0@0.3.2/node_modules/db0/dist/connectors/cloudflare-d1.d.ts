import type { D1Database } from '@cloudflare/workers-types';
import type { Connector } from "db0";
export interface ConnectorOptions {
    bindingName?: string;
}
export default function cloudflareD1Connector(options: ConnectorOptions): Connector<D1Database>;
