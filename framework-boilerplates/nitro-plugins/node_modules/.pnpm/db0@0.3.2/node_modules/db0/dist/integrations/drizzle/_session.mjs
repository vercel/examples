import {
  entityKind,
  NoopLogger
} from "drizzle-orm";
import {
  SQLiteSession,
  SQLitePreparedQuery
} from "drizzle-orm/sqlite-core";
export class DB0Session extends SQLiteSession {
  constructor(db, dialect, schema, options = {}) {
    super(dialect);
    this.db = db;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
  }
  dialect;
  logger;
  prepareQuery(query, fields, executeMethod, customResultMapper) {
    const stmt = this.db.prepare(query.sql);
    return new DB0PreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      customResultMapper
    );
  }
  // TODO: Implement batch
  // TODO: Implement transaction
  transaction(transaction, config) {
    throw new Error("transaction is not implemented!");
  }
}
export class DB0PreparedQuery extends SQLitePreparedQuery {
  constructor(stmt, query, logger, fields, executeMethod, customResultMapper) {
    super("async", executeMethod, query);
    this.stmt = stmt;
    this.logger = logger;
  }
  static [entityKind] = "DB0PreparedQuery";
  run() {
    return this.stmt.run(...this.query.params);
  }
  all() {
    return this.stmt.all(...this.query.params);
  }
  get() {
    return this.stmt.get(...this.query.params);
  }
  values() {
    return Promise.reject(new Error("values is not implemented!"));
  }
}
