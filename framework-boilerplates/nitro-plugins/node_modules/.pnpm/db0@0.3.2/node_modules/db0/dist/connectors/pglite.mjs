import { PGlite } from "@electric-sql/pglite";
import { BoundableStatement } from "./_internal/statement.mjs";
export default function pgliteConnector(opts) {
  let _client;
  function getClient() {
    return _client ||= PGlite.create(opts).then((res) => _client = res);
  }
  const query = async (sql, params) => {
    const client = await getClient();
    const normalizedSql = normalizeParams(sql);
    const result = await client.query(normalizedSql, params);
    return result;
  };
  return {
    name: "pglite",
    dialect: "postgresql",
    getInstance: () => getClient(),
    exec: (sql) => query(sql),
    prepare: (sql) => new StatementWrapper(sql, query)
  };
}
function normalizeParams(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
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
    const result = await this.#query(
      this.#sql,
      params
    );
    return result.rows;
  }
  async run(...params) {
    const result = await this.#query(
      this.#sql,
      params
    );
    return {
      success: true,
      ...result
    };
  }
  async get(...params) {
    const result = await this.#query(
      this.#sql,
      params
    );
    return result.rows[0];
  }
}
