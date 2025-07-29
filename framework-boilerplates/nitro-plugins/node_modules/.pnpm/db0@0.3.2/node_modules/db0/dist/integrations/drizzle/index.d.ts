import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type { Database } from "db0";
export type DrizzleDatabase<TSchema extends Record<string, unknown> = Record<string, never>> = BaseSQLiteDatabase<"async", any, TSchema>;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(db: Database): DrizzleDatabase<TSchema>;
