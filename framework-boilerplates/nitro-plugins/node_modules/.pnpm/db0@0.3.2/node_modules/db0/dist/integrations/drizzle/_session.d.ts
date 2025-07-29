import { entityKind, Logger, RelationalSchemaConfig, type Query, type TablesRelationalConfig } from "drizzle-orm";
import { SQLiteAsyncDialect, SQLiteSession, SQLitePreparedQuery } from "drizzle-orm/sqlite-core";
import type { PreparedQueryConfig, SelectedFieldsOrdered, SQLiteExecuteMethod, SQLiteTransactionConfig } from "drizzle-orm/sqlite-core";
import type { Database, Statement } from "db0";
export interface DB0SessionOptions {
    logger?: Logger;
}
export declare class DB0Session<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<"async", unknown, TFullSchema, TSchema> {
    private db;
    private schema;
    private options;
    dialect: SQLiteAsyncDialect;
    private logger;
    constructor(db: Database, dialect: SQLiteAsyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: DB0SessionOptions);
    prepareQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper?: (rows: unknown[][]) => unknown): DB0PreparedQuery;
    transaction<T>(transaction: (tx: any) => T | Promise<T>, config?: SQLiteTransactionConfig): Promise<T>;
}
export declare class DB0PreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: "async";
    run: Awaited<ReturnType<Statement["run"]>>;
    all: T["all"];
    get: T["get"];
    values: T["values"];
    execute: T["execute"];
}> {
    private stmt;
    private logger;
    static readonly [entityKind]: string;
    constructor(stmt: Statement, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper?: (rows: unknown[][]) => unknown);
    run(): Promise<{
        success: boolean;
    }>;
    all(): Promise<unknown[]>;
    get(): Promise<unknown>;
    values(): Promise<never>;
}
