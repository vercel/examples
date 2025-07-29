import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { BoundableStatement } from "./_internal/statement.mjs";
export default function nodeSqlite3Connector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    const nodeSqlite = globalThis.process?.getBuiltinModule?.("node:sqlite");
    if (!nodeSqlite) {
      throw new Error("`node:sqlite` module is not available. Please ensure you are running in Node.js >= 22.5 or Deno >= 2.2.");
    }
    if (opts.name === ":memory:") {
      _db = new nodeSqlite.DatabaseSync(":memory:");
      return _db;
    }
    const filePath = resolve(
      opts.cwd || ".",
      opts.path || `.data/${opts.name || "db"}.sqlite`
    );
    mkdirSync(dirname(filePath), { recursive: true });
    _db = new nodeSqlite.DatabaseSync(filePath);
    return _db;
  };
  return {
    name: "node-sqlite",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec(sql) {
      getDB().exec(sql);
      return { success: true };
    },
    prepare: (sql) => new StatementWrapper(() => getDB().prepare(sql))
  };
}
class StatementWrapper extends BoundableStatement {
  async all(...params) {
    const raws = this._statement().all(...params);
    return raws;
  }
  async run(...params) {
    const res = this._statement().run(...params);
    return { success: true, ...res };
  }
  async get(...params) {
    const raw = this._statement().get(...params);
    return raw;
  }
}
