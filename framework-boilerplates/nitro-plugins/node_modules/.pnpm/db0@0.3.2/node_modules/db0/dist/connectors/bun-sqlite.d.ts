import { Database } from "bun:sqlite";
import type { Connector } from "db0";
export interface ConnectorOptions {
    cwd?: string;
    path?: string;
    name?: string;
}
export default function bunSqliteConnector(opts: ConnectorOptions): Connector<Database>;
