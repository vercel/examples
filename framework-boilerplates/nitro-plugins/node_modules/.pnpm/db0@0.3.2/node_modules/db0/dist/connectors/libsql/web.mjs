import { createClient } from "@libsql/client/http";
import libSqlCore from "./core.mjs";
export default function libSqlConnector(opts) {
  let _client;
  const getClient = () => {
    if (!_client) {
      _client = createClient(opts);
    }
    return _client;
  };
  return libSqlCore({
    name: "libsql-web",
    getClient
  });
}
