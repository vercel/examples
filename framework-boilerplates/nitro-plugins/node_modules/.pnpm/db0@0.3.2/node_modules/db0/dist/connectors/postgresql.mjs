import pg from "pg";
import { BoundableStatement } from "./_internal/statement.mjs";
export default function postgresqlConnector(opts) {
  let _client;
  function getClient() {
    if (_client) {
      return _client;
    }
    const client = new pg.Client("url" in opts ? opts.url : opts);
    _client = client.connect().then(() => {
      _client = client;
      return _client;
    });
    return _client;
  }
  const query = async (sql, params) => {
    const client = await getClient();
    return client.query(normalizeParams(sql), params);
  };
  return {
    name: "postgresql",
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
    const res = await this.#query(this.#sql, params);
    return res.rows;
  }
  async run(...params) {
    const res = await this.#query(this.#sql, params);
    return {
      success: true,
      ...res
    };
  }
  async get(...params) {
    const res = await this.#query(this.#sql, params);
    return res.rows[0];
  }
}
