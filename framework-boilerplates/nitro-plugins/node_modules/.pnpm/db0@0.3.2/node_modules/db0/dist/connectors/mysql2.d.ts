import mysql from "mysql2/promise";
import type { Connector } from "db0";
export type ConnectorOptions = mysql.ConnectionOptions;
export default function mysqlConnector(opts: ConnectorOptions): Connector<mysql.Connection>;
