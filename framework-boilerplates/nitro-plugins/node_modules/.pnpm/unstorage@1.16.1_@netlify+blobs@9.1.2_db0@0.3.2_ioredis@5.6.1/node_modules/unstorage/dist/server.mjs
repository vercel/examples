import { eventHandler, createError, isError, getRequestHeader, readRawBody, createApp, toNodeListener, setResponseHeader } from 'h3';
import { n as normalizeBaseKey, a as normalizeKey, d as stringify } from './shared/unstorage.CoCt7NXC.mjs';

const MethodToTypeMap = {
  GET: "read",
  HEAD: "read",
  PUT: "write",
  DELETE: "write"
};
function createH3StorageHandler(storage, opts = {}) {
  return eventHandler(async (event) => {
    const _path = opts.resolvePath?.(event) ?? event.path;
    const lastChar = _path[_path.length - 1];
    const isBaseKey = lastChar === ":" || lastChar === "/";
    const key = isBaseKey ? normalizeBaseKey(_path) : normalizeKey(_path);
    if (!(event.method in MethodToTypeMap)) {
      throw createError({
        statusCode: 405,
        statusMessage: `Method Not Allowed: ${event.method}`
      });
    }
    try {
      await opts.authorize?.({
        type: MethodToTypeMap[event.method],
        event,
        key
      });
    } catch (error) {
      const _httpError = isError(error) ? error : createError({
        statusMessage: error?.message,
        statusCode: 401,
        ...error
      });
      throw _httpError;
    }
    if (event.method === "GET") {
      if (isBaseKey) {
        const keys = await storage.getKeys(key);
        return keys.map((key2) => key2.replace(/:/g, "/"));
      }
      const isRaw = getRequestHeader(event, "accept") === "application/octet-stream";
      const driverValue = await (isRaw ? storage.getItemRaw(key) : storage.getItem(key));
      if (driverValue === null) {
        throw createError({
          statusCode: 404,
          statusMessage: "KV value not found"
        });
      }
      setMetaHeaders(event, await storage.getMeta(key));
      return isRaw ? driverValue : stringify(driverValue);
    }
    if (event.method === "HEAD") {
      if (!await storage.hasItem(key)) {
        throw createError({
          statusCode: 404,
          statusMessage: "KV value not found"
        });
      }
      setMetaHeaders(event, await storage.getMeta(key));
      return "";
    }
    if (event.method === "PUT") {
      const isRaw = getRequestHeader(event, "content-type") === "application/octet-stream";
      const topts = {
        ttl: Number(getRequestHeader(event, "x-ttl")) || void 0
      };
      if (isRaw) {
        const value = await readRawBody(event, false);
        await storage.setItemRaw(key, value, topts);
      } else {
        const value = await readRawBody(event, "utf8");
        if (value !== void 0) {
          await storage.setItem(key, value, topts);
        }
      }
      return "OK";
    }
    if (event.method === "DELETE") {
      await (isBaseKey ? storage.clear(key) : storage.removeItem(key));
      return "OK";
    }
    throw createError({
      statusCode: 405,
      statusMessage: `Method Not Allowed: ${event.method}`
    });
  });
}
function setMetaHeaders(event, meta) {
  if (meta.mtime) {
    setResponseHeader(
      event,
      "last-modified",
      new Date(meta.mtime).toUTCString()
    );
  }
  if (meta.ttl) {
    setResponseHeader(event, "x-ttl", `${meta.ttl}`);
    setResponseHeader(event, "cache-control", `max-age=${meta.ttl}`);
  }
}
function createStorageServer(storage, options = {}) {
  const app = createApp({ debug: true });
  const handler = createH3StorageHandler(storage, options);
  app.use(handler);
  return {
    handle: toNodeListener(app)
  };
}

export { createH3StorageHandler, createStorageServer };
