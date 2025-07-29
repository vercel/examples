function sqlTemplate(strings, ...values) {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error("[db0] invalid template invocation");
  }
  const staticIndexes = [];
  let result = strings[0] || "";
  for (let i = 1; i < strings.length; i++) {
    if (result.endsWith("{") && strings[i].startsWith("}")) {
      result = result.slice(0, -1) + values[i - 1] + strings[i].slice(1);
      staticIndexes.push(i - 1);
      continue;
    }
    result += `?${strings[i] ?? ""}`;
  }
  const dynamicValues = values.filter((_, i) => !staticIndexes.includes(i));
  return [result.trim(), dynamicValues];
}
function isTemplateStringsArray(strings) {
  return Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw);
}

const SQL_SELECT_RE = /^select/i;
const SQL_RETURNING_RE = /[\s]returning[\s]/i;
const DIALECTS_WITH_RET = /* @__PURE__ */ new Set(["postgresql", "sqlite"]);
function createDatabase(connector) {
  return {
    get dialect() {
      return connector.dialect;
    },
    getInstance() {
      return connector.getInstance();
    },
    exec: (sql) => {
      return Promise.resolve(connector.exec(sql));
    },
    prepare: (sql) => {
      return connector.prepare(sql);
    },
    sql: async (strings, ...values) => {
      const [sql, params] = sqlTemplate(strings, ...values);
      if (SQL_SELECT_RE.test(sql) || // prettier-ignore
      DIALECTS_WITH_RET.has(connector.dialect) && SQL_RETURNING_RE.test(sql)) {
        const rows = await connector.prepare(sql).all(...params);
        return {
          rows,
          success: true
        };
      } else {
        const res = await connector.prepare(sql).run(...params);
        return res;
      }
    }
  };
}

const connectors = Object.freeze({
  "better-sqlite3": "db0/connectors/better-sqlite3",
  "bun-sqlite": "db0/connectors/bun-sqlite",
  /** alias of bun-sqlite */
  "bun": "db0/connectors/bun-sqlite",
  "cloudflare-d1": "db0/connectors/cloudflare-d1",
  "libsql-core": "db0/connectors/libsql/core",
  "libsql-http": "db0/connectors/libsql/http",
  "libsql-node": "db0/connectors/libsql/node",
  /** alias of libsql-node */
  "libsql": "db0/connectors/libsql/node",
  "libsql-web": "db0/connectors/libsql/web",
  "mysql2": "db0/connectors/mysql2",
  "node-sqlite": "db0/connectors/node-sqlite",
  /** alias of node-sqlite */
  "sqlite": "db0/connectors/node-sqlite",
  "pglite": "db0/connectors/pglite",
  "planetscale": "db0/connectors/planetscale",
  "postgresql": "db0/connectors/postgresql",
  "sqlite3": "db0/connectors/sqlite3"
});

export { connectors, createDatabase };
