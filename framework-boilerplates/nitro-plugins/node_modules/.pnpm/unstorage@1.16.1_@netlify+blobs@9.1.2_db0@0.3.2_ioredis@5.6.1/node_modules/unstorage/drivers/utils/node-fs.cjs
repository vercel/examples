"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensuredir = ensuredir;
exports.readFile = readFile;
exports.readdir = readdir;
exports.readdirRecursive = readdirRecursive;
exports.rmRecursive = rmRecursive;
exports.stat = stat;
exports.unlink = unlink;
exports.writeFile = writeFile;
var _nodeFs = require("node:fs");
var _nodePath = require("node:path");
function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir((0, _nodePath.dirname)(path));
  return _nodeFs.promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return _nodeFs.promises.readFile(path, encoding).catch(ignoreNotfound);
}
function stat(path) {
  return _nodeFs.promises.stat(path).catch(ignoreNotfound);
}
function unlink(path) {
  return _nodeFs.promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return _nodeFs.promises.readdir(dir, {
    withFileTypes: true
  }).catch(ignoreNotfound).then(r => r || []);
}
async function ensuredir(dir) {
  if ((0, _nodeFs.existsSync)(dir)) {
    return;
  }
  await ensuredir((0, _nodePath.dirname)(dir)).catch(ignoreExists);
  await _nodeFs.promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(entries.map(async entry => {
    const entryPath = (0, _nodePath.resolve)(dir, entry.name);
    if (entry.isDirectory()) {
      if (maxDepth === void 0 || maxDepth > 0) {
        const dirFiles = await readdirRecursive(entryPath, ignore, maxDepth === void 0 ? void 0 : maxDepth - 1);
        files.push(...dirFiles.map(f => entry.name + "/" + f));
      }
    } else {
      if (!(ignore && ignore(entry.name))) {
        files.push(entry.name);
      }
    }
  }));
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(entries.map(entry => {
    const entryPath = (0, _nodePath.resolve)(dir, entry.name);
    if (entry.isDirectory()) {
      return rmRecursive(entryPath).then(() => _nodeFs.promises.rmdir(entryPath));
    } else {
      return _nodeFs.promises.unlink(entryPath);
    }
  }));
}