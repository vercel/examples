import { existsSync, promises as fsPromises } from "node:fs";
import { resolve, dirname } from "node:path";
function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
export async function writeFile(path, data, encoding) {
  await ensuredir(dirname(path));
  return fsPromises.writeFile(path, data, encoding);
}
export function readFile(path, encoding) {
  return fsPromises.readFile(path, encoding).catch(ignoreNotfound);
}
export function stat(path) {
  return fsPromises.stat(path).catch(ignoreNotfound);
}
export function unlink(path) {
  return fsPromises.unlink(path).catch(ignoreNotfound);
}
export function readdir(dir) {
  return fsPromises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
export async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname(dir)).catch(ignoreExists);
  await fsPromises.mkdir(dir).catch(ignoreExists);
}
export async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
export async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => fsPromises.rmdir(entryPath));
      } else {
        return fsPromises.unlink(entryPath);
      }
    })
  );
}
