import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import sqlite3 from "sqlite3";
import { BoundableStatement } from "./_internal/statement.mjs";
export default function nodeSqlite3Connector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    if (opts.name === ":memory:") {
      _db = new sqlite3.Database(":memory:");
      return _db;
    }
    const filePath = resolve(
      opts.cwd || ".",
      opts.path || `.data/${opts.name || "db"}.sqlite3`
    );
    mkdirSync(dirname(filePath), { recursive: true });
    _db = new sqlite3.Database(filePath);
    return _db;
  };
  const query = (sql) => new Promise((resolve2, reject) => {
    getDB().exec(sql, (err) => {
      if (err) {
        return reject(err);
      }
      resolve2({ success: true });
    });
  });
  return {
    name: "sqlite3",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec: (sql) => query(sql),
    prepare: (sql) => new StatementWrapper(sql, getDB())
  };
}
class StatementWrapper extends BoundableStatement {
  #onError;
  // #162
  constructor(sql, db) {
    super(db.prepare(sql, (err) => {
      if (err && this.#onError) {
        return this.#onError(err);
      }
    }));
  }
  async all(...params) {
    const rows = await new Promise((resolve2, reject) => {
      this.#onError = reject;
      this._statement.all(...params, (err, rows2) => err ? reject(err) : resolve2(rows2));
    });
    return rows;
  }
  async run(...params) {
    await new Promise((resolve2, reject) => {
      this.#onError = reject;
      this._statement.run(...params, (err) => err ? reject(err) : resolve2());
    });
    return { success: true };
  }
  async get(...params) {
    const row = await new Promise((resolve2, reject) => {
      this.#onError = reject;
      this._statement.get(...params, (err, row2) => err ? reject(err) : resolve2(row2));
    });
    return row;
  }
}
