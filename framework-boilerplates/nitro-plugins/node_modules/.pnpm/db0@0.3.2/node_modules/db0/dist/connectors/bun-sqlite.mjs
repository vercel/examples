import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { Database } from "bun:sqlite";
import { BoundableStatement } from "./_internal/statement.mjs";
export default function bunSqliteConnector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    if (opts.name === ":memory:") {
      _db = new Database(":memory:");
    } else {
      const filePath = resolve(
        opts.cwd || ".",
        opts.path || `.data/${opts.name || "db"}.bun.sqlite`
      );
      mkdirSync(dirname(filePath), { recursive: true });
      _db = new Database(filePath);
    }
    return _db;
  };
  return {
    name: "sqlite",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec: (sql) => getDB().exec(sql),
    prepare: (sql) => new StatementWrapper(getDB().prepare(sql))
  };
}
class StatementWrapper extends BoundableStatement {
  all(...params) {
    return Promise.resolve(this._statement.all(...params));
  }
  run(...params) {
    const res = this._statement.run(...params);
    return Promise.resolve({ success: true, ...res });
  }
  get(...params) {
    return Promise.resolve(this._statement.get(...params));
  }
}
