import { BoundableStatement } from "./_internal/statement.mjs";
export default function cloudflareD1Connector(options) {
  const getDB = () => {
    const binding = globalThis.__env__?.[options.bindingName] || globalThis.__cf_env__?.[options.bindingName];
    if (!binding) {
      throw new Error(`[db0] [d1] binding \`${options.bindingName}\` not found`);
    }
    return binding;
  };
  return {
    name: "cloudflare-d1",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec: (sql) => getDB().exec(sql),
    prepare: (sql) => new StatementWrapper(getDB().prepare(sql))
  };
}
class StatementWrapper extends BoundableStatement {
  async all(...params) {
    const res = await this._statement.bind(...params).all();
    return res.results;
  }
  async run(...params) {
    const res = await this._statement.bind(...params).run();
    return res;
  }
  async get(...params) {
    const res = await this._statement.bind(...params).first();
    return res;
  }
}
