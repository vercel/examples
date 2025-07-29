import sqlite3 from 'sqlite3';
import type { Connector } from 'db0';
export interface ConnectorOptions {
    cwd?: string;
    path?: string;
    name?: string;
}
export default function nodeSqlite3Connector(opts: ConnectorOptions): Connector<sqlite3.Database>;
