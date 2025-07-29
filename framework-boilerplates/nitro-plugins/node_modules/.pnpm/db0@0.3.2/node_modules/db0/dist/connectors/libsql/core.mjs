import { BoundableStatement } from "../_internal/statement.mjs";
export default function libSqlCoreConnector(opts) {
  const query = (sql) => opts.getClient().execute(sql);
  return {
    name: opts.name || "libsql-core",
    dialect: "libsql",
    getInstance: async () => opts.getClient(),
    exec: (sql) => query(sql),
    prepare: (sql) => new StatementWrapper(sql, query)
  };
}
class StatementWrapper extends BoundableStatement {
  #query;
  #sql;
  constructor(sql, query) {
    super();
    this.#sql = sql;
    this.#query = query;
  }
  async all(...params) {
    const res = await this.#query({ sql: this.#sql, args: params });
    return res.rows;
  }
  async run(...params) {
    const res = await this.#query({ sql: this.#sql, args: params });
    return {
      ...res
    };
  }
  async get(...params) {
    const res = await this.#query({ sql: this.#sql, args: params });
    return res.rows[0];
  }
}
