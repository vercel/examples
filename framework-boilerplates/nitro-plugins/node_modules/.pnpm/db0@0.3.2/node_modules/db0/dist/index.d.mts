import { ConnectorOptions as ConnectorOptions$1 } from 'db0/connectors/better-sqlite3';
import { ConnectorOptions as ConnectorOptions$2 } from 'db0/connectors/bun-sqlite';
import { ConnectorOptions as ConnectorOptions$3 } from 'db0/connectors/cloudflare-d1';
import { ConnectorOptions as ConnectorOptions$4 } from 'db0/connectors/libsql/core';
import { ConnectorOptions as ConnectorOptions$5 } from 'db0/connectors/libsql/http';
import { ConnectorOptions as ConnectorOptions$6 } from 'db0/connectors/libsql/node';
import { ConnectorOptions as ConnectorOptions$7 } from 'db0/connectors/libsql/web';
import { ConnectorOptions as ConnectorOptions$8 } from 'db0/connectors/mysql2';
import { ConnectorOptions as ConnectorOptions$9 } from 'db0/connectors/node-sqlite';
import { ConnectorOptions as ConnectorOptions$a } from 'db0/connectors/pglite';
import { ConnectorOptions as ConnectorOptions$b } from 'db0/connectors/planetscale';
import { ConnectorOptions as ConnectorOptions$c } from 'db0/connectors/postgresql';
import { ConnectorOptions as ConnectorOptions$d } from 'db0/connectors/sqlite3';

/**
 * Represents primitive types that can be used in SQL operations.
 */
type Primitive = string | number | boolean | undefined | null;
type SQLDialect = "mysql" | "postgresql" | "sqlite" | "libsql";
type Statement = {
    /**
     * Binds parameters to the statement.
     * @param {...Primitive[]} params - Parameters to bind to the SQL statement.
     * @returns {PreparedStatement} The instance of the statement with bound parameters.
     */
    bind(...params: Primitive[]): PreparedStatement;
    /**
     * Executes the statement and returns all resulting rows as an array.
     * @param {...Primitive[]} params - Parameters to bind to the SQL statement.
     * @returns {Promise<unknown[]>} A promise that resolves to an array of rows.
     */
    all(...params: Primitive[]): Promise<unknown[]>;
    /**
     * Executes the statement as an action (e.g. insert, update, delete).
     * @param {...Primitive[]} params - Parameters to bind to the SQL statement.
     * @returns {Promise<{ success: boolean }>} A promise that resolves to the success state of the action.
     */
    run(...params: Primitive[]): Promise<{
        success: boolean;
    }>;
    /**
     * Executes the statement and returns a single row.
     * @param {...Primitive[]} params - Parameters to bind to the SQL statement.
     * @returns {Promise<unknown>} A promise that resolves to the first row in the result set.
     */
    get(...params: Primitive[]): Promise<unknown>;
};
type PreparedStatement = {
    /**
     * Binds parameters to the statement.
     * @param {...Primitive[]} params - Parameters to bind to the SQL statement.
     * @returns {PreparedStatement} The instance of the statement with bound parameters.
     */
    bind(...params: Primitive[]): PreparedStatement;
    /**
     * Executes the statement and returns all resulting rows as an array.
     * @returns {Promise<unknown[]>} A promise that resolves to an array of rows.
     */
    all(): Promise<unknown[]>;
    /**
     * Executes the statement as an action (e.g. insert, update, delete).
     * @returns {Promise<{ success: boolean }>} A promise that resolves to the success state of the action.
     */
    run(): Promise<{
        success: boolean;
    }>;
    /**
     * Executes the statement and returns a single row.
     * @returns {Promise<unknown>} A promise that resolves to the first row in the result set.
     */
    get(): Promise<unknown>;
};
/**
 * Represents the result of a database execution.
 */
type ExecResult = unknown;
/**
 * Defines a database connector for executing SQL queries and preparing statements.
 */
type Connector<TInstance = unknown> = {
    /**
     * The name of the connector.
     */
    name: string;
    /**
     * The SQL dialect used by the connector.
     */
    dialect: SQLDialect;
    /**
     * The client instance used internally.
     */
    getInstance: () => TInstance | Promise<TInstance>;
    /**
     * Executes an SQL query directly and returns the result.
     * @param {string} sql - The SQL string to execute.
     * @returns {ExecResult | Promise<ExecResult>} The result of the execution.
     */
    exec: (sql: string) => ExecResult | Promise<ExecResult>;
    /**
     * Prepares an SQL statement for execution.
     * @param {string} sql - The SQL string to prepare.
     * @returns {statement} The prepared SQL statement.
     */
    prepare: (sql: string) => Statement;
};
/**
 * Represents default SQL results, including any error messages, row changes and rows returned.
 */
type DefaultSQLResult = {
    lastInsertRowid?: number;
    changes?: number;
    error?: string;
    rows?: {
        id?: string | number;
        [key: string]: unknown;
    }[];
    success?: boolean;
};
interface Database<TConnector extends Connector = Connector> {
    readonly dialect: SQLDialect;
    /**
     * The client instance used internally.
     * @returns {Promise<TInstance>} A promise that resolves with the client instance.
     */
    getInstance: () => Promise<Awaited<ReturnType<TConnector["getInstance"]>>>;
    /**
     * Executes a raw SQL string.
     * @param {string} sql - The SQL string to execute.
     * @returns {Promise<ExecResult>} A promise that resolves with the execution result.
     */
    exec: (sql: string) => Promise<ExecResult>;
    /**
     * Prepares an SQL statement from a raw SQL string.
     * @param {string} sql - The SQL string to prepare.
     * @returns {statement} The prepared SQL statement.
     */
    prepare: (sql: string) => Statement;
    /**
     * Executes SQL queries using tagged template literals.
     * @template T The expected type of query result.
     * @param {TemplateStringsArray} strings - The segments of the SQL string.
     * @param {...Primitive[]} values - The values to interpolate into the SQL string.
     * @returns {Promise<T>} A promise that resolves with the typed result of the query.
     */
    sql: <T = DefaultSQLResult>(strings: TemplateStringsArray, ...values: Primitive[]) => Promise<T>;
}

/**
 * Creates and returns a database interface using the specified connector.
 * This interface allows you to execute raw SQL queries, prepare SQL statements,
 * and execute SQL queries with parameters using tagged template literals.
 *
 * @param {Connector} connector - The database connector used to execute and prepare SQL statements. See {@link Connector}.
 * @returns {Database} The database interface that allows SQL operations. See {@link Database}.
 */
declare function createDatabase<TConnector extends Connector = Connector>(connector: TConnector): Database<TConnector>;

type ConnectorName = "better-sqlite3" | "bun-sqlite" | "bun" | "cloudflare-d1" | "libsql-core" | "libsql-http" | "libsql-node" | "libsql" | "libsql-web" | "mysql2" | "node-sqlite" | "sqlite" | "pglite" | "planetscale" | "postgresql" | "sqlite3";
type ConnectorOptions = {
    "better-sqlite3": ConnectorOptions$1;
    "bun-sqlite": ConnectorOptions$2;
    /** alias of bun-sqlite */
    "bun": ConnectorOptions$2;
    "cloudflare-d1": ConnectorOptions$3;
    "libsql-core": ConnectorOptions$4;
    "libsql-http": ConnectorOptions$5;
    "libsql-node": ConnectorOptions$6;
    /** alias of libsql-node */
    "libsql": ConnectorOptions$6;
    "libsql-web": ConnectorOptions$7;
    "mysql2": ConnectorOptions$8;
    "node-sqlite": ConnectorOptions$9;
    /** alias of node-sqlite */
    "sqlite": ConnectorOptions$9;
    "pglite": ConnectorOptions$a;
    "planetscale": ConnectorOptions$b;
    "postgresql": ConnectorOptions$c;
    "sqlite3": ConnectorOptions$d;
};
declare const connectors: Readonly<{
    readonly "better-sqlite3": "db0/connectors/better-sqlite3";
    readonly "bun-sqlite": "db0/connectors/bun-sqlite";
    /** alias of bun-sqlite */
    readonly bun: "db0/connectors/bun-sqlite";
    readonly "cloudflare-d1": "db0/connectors/cloudflare-d1";
    readonly "libsql-core": "db0/connectors/libsql/core";
    readonly "libsql-http": "db0/connectors/libsql/http";
    readonly "libsql-node": "db0/connectors/libsql/node";
    /** alias of libsql-node */
    readonly libsql: "db0/connectors/libsql/node";
    readonly "libsql-web": "db0/connectors/libsql/web";
    readonly mysql2: "db0/connectors/mysql2";
    readonly "node-sqlite": "db0/connectors/node-sqlite";
    /** alias of node-sqlite */
    readonly sqlite: "db0/connectors/node-sqlite";
    readonly pglite: "db0/connectors/pglite";
    readonly planetscale: "db0/connectors/planetscale";
    readonly postgresql: "db0/connectors/postgresql";
    readonly sqlite3: "db0/connectors/sqlite3";
}>;

export { connectors, createDatabase };
export type { Connector, ConnectorName, ConnectorOptions, Database, ExecResult, PreparedStatement, Primitive, SQLDialect, Statement };
