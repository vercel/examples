import { Client } from "@planetscale/database";
import { BoundableStatement } from "./_internal/statement.mjs";
export default function planetscaleConnector(opts) {
  let _client;
  function getClient() {
    if (_client) {
      return _client;
    }
    const client = new Client(opts);
    _client = client;
    return client;
  }
  const query = (sql, params) => getClient().execute(sql, params);
  return {
    name: "planetscale",
    dialect: "mysql",
    getInstance: () => getClient(),
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
