import {
  BaseSQLiteDatabase,
  SQLiteAsyncDialect
} from "drizzle-orm/sqlite-core";
import { DB0Session } from "./_session.mjs";
export function drizzle(db) {
  const schema = void 0;
  const dialect = new SQLiteAsyncDialect();
  const session = new DB0Session(db, dialect, schema);
  return new BaseSQLiteDatabase(
    "async",
    dialect,
    session,
    schema
  );
}
