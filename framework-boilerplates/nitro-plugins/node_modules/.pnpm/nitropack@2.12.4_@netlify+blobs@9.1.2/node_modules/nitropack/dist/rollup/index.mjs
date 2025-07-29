import { builtinModules, createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { isAbsolute as isAbsolute$1 } from 'node:path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defu } from 'defu';
import { parseNodeModulePath as parseNodeModulePath$1, isValidNodeImport, normalizeid, lookupNodeModuleSubpath, resolvePath, sanitizeFilePath } from 'mlly';
import { resolveModuleURL, resolveModulePath } from 'exsolve';
import { runtimeDir, runtimeDependencies } from 'nitropack/runtime/meta';
import { hash } from 'ohash';
import { resolve, dirname, extname, relative, join, normalize, isAbsolute } from 'pathe';
import { visualizer } from 'rollup-plugin-visualizer';
import { isWindows, isTest } from 'std-env';
import { defineEnv } from 'unenv';
import unimportPlugin from 'unimport/unplugin';
import { rollup } from 'unwasm/plugin';
import { genImport, genSafeVariableName } from 'knitwork';
import { connectors } from 'db0';
import { camelCase } from 'scule';
import { globby } from 'globby';
import { createFilter } from 'unplugin-utils';
import { transform } from 'esbuild';
import { promises, existsSync } from 'node:fs';
import { platform } from 'node:os';
import { nodeFileTrace } from '@vercel/nft';
import { isDirectory } from 'nitropack/kit';
import { readPackageJSON, writePackageJSON } from 'pkg-types';
import semver from 'semver';
import { consola } from 'consola';
import { readFile } from 'node:fs/promises';
import createEtag from 'etag';
import mime from 'mime';
import { withTrailingSlash } from 'ufo';
import _replace from '@rollup/plugin-replace';
import { normalizeKey, builtinDrivers } from 'unstorage';

const PREFIX = "\0virtual:";
function virtual(modules, cache = {}) {
  const _modules = /* @__PURE__ */ new Map();
  for (const [id, mod] of Object.entries(modules)) {
    cache[id] = mod;
    _modules.set(id, mod);
    _modules.set(resolve(id), mod);
  }
  return {
    name: "virtual",
    resolveId(id, importer) {
      if (id in modules) {
        return PREFIX + id;
      }
      if (importer) {
        const importerNoPrefix = importer.startsWith(PREFIX) ? importer.slice(PREFIX.length) : importer;
        const resolved = resolve(dirname(importerNoPrefix), id);
        if (_modules.has(resolved)) {
          return PREFIX + resolved;
        }
      }
      return null;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return null;
      }
      const idNoPrefix = id.slice(PREFIX.length);
      if (!_modules.has(idNoPrefix)) {
        return null;
      }
      let m = _modules.get(idNoPrefix);
      if (typeof m === "function") {
        m = await m();
      }
      if (!m) {
        return null;
      }
      cache[id.replace(PREFIX, "")] = m;
      return {
        code: m,
        map: null
      };
    }
  };
}

function appConfig(nitro) {
  return virtual(
    {
      "#nitro-internal-virtual/app-config": () => `
import { defuFn } from 'defu';

const inlineAppConfig = ${JSON.stringify(nitro.options.appConfig, null, 2)};

${nitro.options.appConfigFiles.map((file, i) => genImport(file, "appConfig" + i) + ";").join("\n")}

export const appConfig = defuFn(${[
        ...nitro.options.appConfigFiles.map((_, i) => "appConfig" + i),
        "inlineAppConfig"
      ].join(", ")});
      `
    },
    nitro.vfs
  );
}

function database(nitro) {
  if (!nitro.options.experimental.database) {
    return virtual(
      {
        "#nitro-internal-virtual/database": () => {
          return (
            /* js */
            `export const connectionConfigs = {};`
          );
        }
      },
      nitro.vfs
    );
  }
  const dbConfigs = nitro.options.dev && nitro.options.devDatabase || nitro.options.database;
  const connectorsNames = [
    ...new Set(
      Object.values(dbConfigs || {}).map((config) => config?.connector)
    )
  ].filter(Boolean);
  for (const name of connectorsNames) {
    if (!connectors[name]) {
      throw new Error(`Database connector "${name}" is invalid.`);
    }
  }
  return virtual(
    {
      "#nitro-internal-virtual/database": () => {
        return `
${connectorsNames.map(
          (name) => `import ${camelCase(name)}Connector from "${connectors[name]}";`
        ).join("\n")}

export const connectionConfigs = {
  ${Object.entries(dbConfigs || {}).map(
          ([name, { connector, options }]) => `${name}: {
          connector: ${camelCase(connector)}Connector,
          options: ${JSON.stringify(options)}
        }`
        ).join(",\n")}
};
        `;
      }
    },
    nitro.vfs
  );
}

const PLUGIN_NAME = "dynamic-require";
const HELPER_DYNAMIC = `\0${PLUGIN_NAME}.mjs`;
const DYNAMIC_REQUIRE_RE = /import\((?:.*\+\s*)?"\.\/" ?\+(.*)\).then/g;
function dynamicRequire({ dir, ignore, inline }) {
  return {
    name: PLUGIN_NAME,
    transform(code, _id) {
      return {
        code: code.replace(
          DYNAMIC_REQUIRE_RE,
          `import('${HELPER_DYNAMIC}').then(r => r.default || r).then(dynamicRequire => dynamicRequire($1)).then`
        ),
        map: null
      };
    },
    resolveId(id) {
      return id === HELPER_DYNAMIC ? id : null;
    },
    // TODO: Async chunk loading over network!
    // renderDynamicImport () {
    //   return {
    //     left: 'fetch(', right: ')'
    //   }
    // },
    async load(_id) {
      if (_id !== HELPER_DYNAMIC) {
        return null;
      }
      let files = [];
      try {
        const wpManifest = resolve(dir, "./server.manifest.json");
        files = await import(pathToFileURL(wpManifest).href).then(
          (r) => Object.keys(r.files).filter((file) => !ignore.includes(file))
        );
      } catch {
        files = await globby("**/*.{cjs,mjs,js}", {
          cwd: dir,
          absolute: false,
          ignore
        });
      }
      const chunks = (await Promise.all(
        files.map(async (id) => ({
          id,
          src: resolve(dir, id).replace(/\\/g, "/"),
          name: genSafeVariableName(id),
          meta: await getWebpackChunkMeta(resolve(dir, id))
        }))
      )).filter((chunk) => chunk.meta);
      return inline ? TMPL_INLINE({ chunks }) : TMPL_LAZY({ chunks });
    }
  };
}
async function getWebpackChunkMeta(src) {
  const chunk = await import(pathToFileURL(src).href).then(
    (r) => r.default || r || {}
  );
  const {
    __webpack_id__,
    __webpack_ids__,
    __webpack_modules__,
    id = __webpack_id__,
    ids = __webpack_ids__,
    modules = __webpack_modules__
  } = chunk;
  if (!id && !ids) {
    return null;
  }
  return {
    id,
    ids,
    moduleIds: Object.keys(modules || {})
  };
}
function TMPL_INLINE({ chunks }) {
  return `${chunks.map((i) => `import * as ${i.name} from '${i.src}'`).join("\n")}
const dynamicChunks = {
  ${chunks.map((i) => ` ['${i.id}']: ${i.name}`).join(",\n")}
};

export default function dynamicRequire(id) {
  return Promise.resolve(dynamicChunks[id]);
};`;
}
function TMPL_LAZY({ chunks }) {
  return `
const dynamicChunks = {
${chunks.map((i) => ` ['${i.id}']: () => import('${i.src}')`).join(",\n")}
};

export default function dynamicRequire(id) {
  return dynamicChunks[id]();
};`;
}

const defaultLoaders = {
  ".ts": "ts",
  ".js": "js",
  ".tsx": "tsx",
  ".jsx": "jsx"
};
function esbuild(options) {
  const {
    include,
    exclude,
    sourceMap,
    loaders: loadersConfig,
    minify,
    ...transformOptions
  } = options;
  const loaders = { ...defaultLoaders };
  if (loadersConfig) {
    for (const key of Object.keys(loadersConfig)) {
      const value = loadersConfig[key];
      if (typeof value === "string") {
        loaders[key] = value;
      } else if (value === false) {
        delete loaders[key];
      }
    }
  }
  const extensions = Object.keys(loaders);
  const INCLUDE_REGEXP = new RegExp(
    `\\.(${extensions.map((ext) => ext.slice(1)).join("|")})$`
  );
  const EXCLUDE_REGEXP = /node_modules/;
  const filter = createFilter(
    include || INCLUDE_REGEXP,
    exclude || EXCLUDE_REGEXP
  );
  return {
    name: "esbuild",
    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }
      const ext = extname(id);
      const loader = loaders[ext];
      if (!loader) {
        return null;
      }
      const result = await transform(code, {
        sourcemap: sourceMap === "hidden" ? "external" : sourceMap,
        ...transformOptions,
        loader,
        sourcefile: id
      });
      printWarnings(id, result, this);
      return result.code && {
        code: result.code,
        map: result.map || null
      };
    },
    async renderChunk(code) {
      if (minify) {
        const result = await transform(code, {
          loader: "js",
          minify: true,
          target: transformOptions.target
        });
        if (result.code) {
          return {
            code: result.code,
            map: result.map || null
          };
        }
      }
      return null;
    }
  };
}
function printWarnings(id, result, plugin) {
  if (result.warnings) {
    for (const warning of result.warnings) {
      let message = "[esbuild]";
      if (warning.location) {
        message += ` (${relative(process.cwd(), id)}:${warning.location.line}:${warning.location.column})`;
      }
      message += ` ${warning.text}`;
      plugin.warn(message);
    }
  }
}

function externals$1(opts) {
  const trackedExternals = /* @__PURE__ */ new Set();
  const tryResolve = (id, importer) => {
    if (id.startsWith("\0")) {
      return id;
    }
    const res = resolveModuleURL(id, {
      try: true,
      conditions: opts.exportConditions,
      from: importer && isAbsolute(importer) ? [pathToFileURL(importer), ...opts.moduleDirectories] : opts.moduleDirectories,
      suffixes: ["", "/index"],
      extensions: [".mjs", ".cjs", ".js", ".mts", ".cts", ".ts", ".json"]
    });
    return res?.startsWith("file://") ? fileURLToPath(res) : res;
  };
  const inlineMatchers = (opts.inline || []).map((p) => normalizeMatcher(p)).sort((a, b) => (b.score || 0) - (a.score || 0));
  const externalMatchers = (opts.external || []).map((p) => normalizeMatcher(p)).sort((a, b) => (b.score || 0) - (a.score || 0));
  const isExplicitInline = (id, importer) => {
    if (id.startsWith("\0")) {
      return true;
    }
    const inlineMatch = inlineMatchers.find((m) => m(id, importer));
    const externalMatch = externalMatchers.find((m) => m(id, importer));
    if (inlineMatch && (!externalMatch || externalMatch && (inlineMatch.score || 0) > (externalMatch.score || 0))) {
      return true;
    }
  };
  return {
    name: "node-externals",
    async resolveId(originalId, importer, options) {
      if (!originalId || originalId.startsWith("\0") || originalId.includes("?") || originalId.startsWith("#")) {
        return null;
      }
      if (originalId.startsWith(".")) {
        return null;
      }
      const id = normalize(originalId);
      if (isExplicitInline(id, importer)) {
        return null;
      }
      const resolved = await this.resolve(originalId, importer, options) || {
        id
      };
      if (isExplicitInline(resolved.id, importer)) {
        return null;
      }
      if (!isAbsolute(resolved.id) || !existsSync(resolved.id) || await isDirectory(resolved.id)) {
        resolved.id = tryResolve(resolved.id, importer) || resolved.id;
      }
      if (!await isValidNodeImport(resolved.id).catch(() => false)) {
        return null;
      }
      if (opts.trace === false) {
        return {
          ...resolved,
          id: isAbsolute(resolved.id) ? normalizeid(resolved.id) : resolved.id,
          external: true
        };
      }
      const { name: pkgName } = parseNodeModulePath$1(resolved.id);
      if (!pkgName) {
        return null;
      }
      if (pkgName !== originalId) {
        if (!isAbsolute(originalId)) {
          const fullPath = tryResolve(originalId, importer);
          if (fullPath) {
            trackedExternals.add(fullPath);
            return {
              id: originalId,
              external: true
            };
          }
        }
        const packageEntry = tryResolve(pkgName, importer);
        if (packageEntry !== id) {
          const guessedSubpath = await lookupNodeModuleSubpath(id).catch(() => null);
          const resolvedGuess = guessedSubpath && tryResolve(join(pkgName, guessedSubpath), importer);
          if (resolvedGuess === id) {
            trackedExternals.add(resolvedGuess);
            return {
              id: join(pkgName, guessedSubpath),
              external: true
            };
          }
          return null;
        }
      }
      trackedExternals.add(resolved.id);
      return {
        id: pkgName,
        external: true
      };
    },
    async buildEnd() {
      if (opts.trace === false) {
        return;
      }
      for (const pkgName of opts.traceInclude || []) {
        const path = await this.resolve(pkgName);
        if (path?.id) {
          trackedExternals.add(path.id.replace(/\?.+/, ""));
        }
      }
      const _fileTrace = await nodeFileTrace([...trackedExternals], {
        // https://github.com/nitrojs/nitro/pull/1562
        conditions: (opts.exportConditions || []).filter(
          (c) => !["require", "import", "default"].includes(c)
        ),
        ...opts.traceOptions
      });
      const _resolveTracedPath = (p) => promises.realpath(resolve(opts.traceOptions?.base || ".", p));
      const tracedFiles = Object.fromEntries(
        await Promise.all(
          [..._fileTrace.reasons.entries()].map(async ([_path, reasons]) => {
            if (reasons.ignored) {
              return;
            }
            const path = await _resolveTracedPath(_path);
            if (!path.includes("node_modules")) {
              return;
            }
            if (!await isFile$1(path)) {
              return;
            }
            const {
              dir: baseDir,
              name: pkgName,
              subpath
            } = parseNodeModulePath$1(path);
            if (!baseDir || !pkgName) {
              return;
            }
            const pkgPath = join(baseDir, pkgName);
            const parents = await Promise.all(
              [...reasons.parents].map((p) => _resolveTracedPath(p))
            );
            const tracedFile = {
              path,
              parents,
              subpath,
              pkgName,
              pkgPath
            };
            return [path, tracedFile];
          })
        ).then((r) => r.filter(Boolean))
      );
      const tracedPackages = {};
      for (const tracedFile of Object.values(tracedFiles)) {
        const pkgName = tracedFile.pkgName;
        let tracedPackage = tracedPackages[pkgName];
        let pkgJSON = await readPackageJSON(tracedFile.pkgPath, {
          cache: true
        }).catch(
          () => {
          }
          // TODO: Only catch ENOENT
        );
        if (!pkgJSON) {
          pkgJSON = { name: pkgName, version: "0.0.0" };
        }
        if (!tracedPackage) {
          tracedPackage = {
            name: pkgName,
            versions: {}
          };
          tracedPackages[pkgName] = tracedPackage;
        }
        let tracedPackageVersion = tracedPackage.versions[pkgJSON.version || "0.0.0"];
        if (!tracedPackageVersion) {
          tracedPackageVersion = {
            path: tracedFile.pkgPath,
            files: [],
            pkgJSON
          };
          tracedPackage.versions[pkgJSON.version || "0.0.0"] = tracedPackageVersion;
        }
        tracedPackageVersion.files.push(tracedFile.path);
        tracedFile.pkgName = pkgName;
        if (pkgJSON.version) {
          tracedFile.pkgVersion = pkgJSON.version;
        }
      }
      const usedAliases = {};
      const writePackage = async (name, version, _pkgPath) => {
        const pkg = tracedPackages[name];
        const pkgPath = _pkgPath || pkg.name;
        for (const src of pkg.versions[version].files) {
          const { subpath } = parseNodeModulePath$1(src);
          if (!subpath) {
            continue;
          }
          const dst = join(opts.outDir, "node_modules", pkgPath, subpath);
          await promises.mkdir(dirname(dst), { recursive: true });
          await promises.copyFile(src, dst);
          if (opts.chmod) {
            await promises.chmod(dst, opts.chmod === true ? 420 : opts.chmod);
          }
        }
        const pkgJSON = pkg.versions[version].pkgJSON;
        applyProductionCondition(pkgJSON.exports);
        const pkgJSONPath = join(
          opts.outDir,
          "node_modules",
          pkgPath,
          "package.json"
        );
        await promises.mkdir(dirname(pkgJSONPath), { recursive: true });
        await promises.writeFile(
          pkgJSONPath,
          JSON.stringify(pkgJSON, null, 2),
          "utf8"
        );
        if (opts.traceAlias && pkgPath in opts.traceAlias) {
          usedAliases[opts.traceAlias[pkgPath]] = version;
          await linkPackage(pkgPath, opts.traceAlias[pkgPath]);
        }
      };
      const isWindows = platform() === "win32";
      const linkPackage = async (from, to) => {
        const src = join(opts.outDir, "node_modules", from);
        const dst = join(opts.outDir, "node_modules", to);
        const dstStat = await promises.lstat(dst).catch(() => null);
        const exists = dstStat?.isSymbolicLink();
        if (exists) {
          return;
        }
        await promises.mkdir(dirname(dst), { recursive: true });
        await promises.symlink(
          relative(dirname(dst), src),
          dst,
          isWindows ? "junction" : "dir"
        ).catch((error) => {
          console.error("Cannot link", from, "to", to, error);
        });
      };
      const findPackageParents = (pkg, version) => {
        const versionFiles = pkg.versions[version].files.map(
          (path) => tracedFiles[path]
        );
        const parentPkgs = [
          ...new Set(
            versionFiles.flatMap(
              (file) => file.parents.map((parentPath) => {
                const parentFile = tracedFiles[parentPath];
                if (parentFile.pkgName === pkg.name) {
                  return null;
                }
                return `${parentFile.pkgName}@${parentFile.pkgVersion}`;
              }).filter(Boolean)
            )
          )
        ];
        return parentPkgs;
      };
      const multiVersionPkgs = {};
      const singleVersionPackages = [];
      for (const tracedPackage of Object.values(tracedPackages)) {
        const versions = Object.keys(tracedPackage.versions);
        if (versions.length === 1) {
          singleVersionPackages.push(tracedPackage.name);
          continue;
        }
        multiVersionPkgs[tracedPackage.name] = {};
        for (const version of versions) {
          multiVersionPkgs[tracedPackage.name][version] = findPackageParents(
            tracedPackage,
            version
          );
        }
      }
      await Promise.all(
        singleVersionPackages.map((pkgName) => {
          const pkg = tracedPackages[pkgName];
          const version = Object.keys(pkg.versions)[0];
          return writePackage(pkgName, version);
        })
      );
      for (const [pkgName, pkgVersions] of Object.entries(multiVersionPkgs)) {
        const versionEntries = Object.entries(pkgVersions).sort(
          ([v1, p1], [v2, p2]) => {
            if (p1.length === 0) {
              return -1;
            }
            if (p2.length === 0) {
              return 1;
            }
            return compareVersions(v1, v2);
          }
        );
        for (const [version, parentPkgs] of versionEntries) {
          await writePackage(pkgName, version, `.nitro/${pkgName}@${version}`);
          await linkPackage(`.nitro/${pkgName}@${version}`, `${pkgName}`);
          for (const parentPkg of parentPkgs) {
            const parentPkgName = parentPkg.replace(/@[^@]+$/, "");
            await (multiVersionPkgs[parentPkgName] ? linkPackage(
              `.nitro/${pkgName}@${version}`,
              `.nitro/${parentPkg}/node_modules/${pkgName}`
            ) : linkPackage(
              `.nitro/${pkgName}@${version}`,
              `${parentPkgName}/node_modules/${pkgName}`
            ));
          }
        }
      }
      const userPkg = await readPackageJSON(
        opts.rootDir || process.cwd()
      ).catch(() => ({}));
      await writePackageJSON(resolve(opts.outDir, "package.json"), {
        name: (userPkg.name || "server") + "-prod",
        version: userPkg.version || "0.0.0",
        type: "module",
        private: true,
        dependencies: Object.fromEntries(
          [
            ...Object.values(tracedPackages).map((pkg) => [
              pkg.name,
              Object.keys(pkg.versions)[0]
            ]),
            ...Object.entries(usedAliases)
          ].sort(([a], [b]) => a.localeCompare(b))
        )
      });
    }
  };
}
function compareVersions(v1 = "0.0.0", v2 = "0.0.0") {
  try {
    return semver.lt(v1, v2, { loose: true }) ? 1 : -1;
  } catch {
    return v1.localeCompare(v2);
  }
}
function applyProductionCondition(exports) {
  if (!exports || typeof exports === "string" || Array.isArray(exports)) {
    return;
  }
  if ("production" in exports) {
    if (typeof exports.production === "string") {
      exports.default = exports.production;
    } else {
      Object.assign(exports, exports.production);
    }
  }
  for (const key in exports) {
    applyProductionCondition(exports[key]);
  }
}
async function isFile$1(file) {
  try {
    const stat = await promises.stat(file);
    return stat.isFile();
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
function normalizeMatcher(input) {
  if (typeof input === "function") {
    input.score = input.score ?? 1e4;
    return input;
  }
  if (input instanceof RegExp) {
    const matcher = (id) => input.test(id);
    matcher.score = input.toString().length;
    Object.defineProperty(matcher, "name", { value: `match(${input})` });
    return matcher;
  }
  if (typeof input === "string") {
    const pattern = normalize(input);
    const matcher = (id) => {
      const idWithoutNodeModules = id.split("node_modules/").pop();
      return id.startsWith(pattern) || idWithoutNodeModules?.startsWith(pattern);
    };
    matcher.score = input.length;
    if (!isAbsolute(input) && input[0] !== ".") {
      matcher.score += 1e3;
    }
    Object.defineProperty(matcher, "name", { value: `match(${pattern})` });
    return matcher;
  }
  throw new Error(`Invalid matcher or pattern: ${input}`);
}

function externals(opts) {
  const trackedExternals = /* @__PURE__ */ new Set();
  const _resolveCache = /* @__PURE__ */ new Map();
  const _resolve = async (id) => {
    let resolved = _resolveCache.get(id);
    if (resolved) {
      return resolved;
    }
    resolved = await resolvePath(id, {
      conditions: opts.exportConditions,
      url: opts.moduleDirectories
    });
    _resolveCache.set(id, resolved);
    return resolved;
  };
  const inlineMatchers = (opts.inline || []).map((p) => normalizeMatcher(p));
  const externalMatchers = (opts.external || []).map(
    (p) => normalizeMatcher(p)
  );
  return {
    name: "node-externals",
    async resolveId(originalId, importer, resolveOpts) {
      if (!originalId || originalId.startsWith("\0") || originalId.includes("?") || originalId.startsWith("#")) {
        return null;
      }
      if (originalId.startsWith(".")) {
        return null;
      }
      const id = normalize(originalId);
      for (const matcher of inlineMatchers) {
        if (matcher(id, importer)) {
          return null;
        }
      }
      for (const matcher of externalMatchers) {
        if (matcher(id, importer)) {
          return { id, external: true };
        }
      }
      const resolved = await this.resolve(
        originalId,
        importer,
        resolveOpts
      ) || {
        id
      };
      if (!isAbsolute(resolved.id) || !existsSync(resolved.id) || await isDirectory(resolved.id)) {
        resolved.id = await _resolve(resolved.id).catch(() => resolved.id);
      }
      if (!await isValidNodeImport(resolved.id).catch(() => false)) {
        return null;
      }
      if (opts.trace === false) {
        return {
          ...resolved,
          id: isAbsolute(resolved.id) ? normalizeid(resolved.id) : resolved.id,
          external: true
        };
      }
      const { pkgName, subpath } = parseNodeModulePath(resolved.id);
      if (!pkgName) {
        return null;
      }
      if (pkgName !== originalId) {
        if (!isAbsolute(originalId)) {
          const fullPath = await _resolve(originalId);
          trackedExternals.add(fullPath);
          return {
            id: originalId,
            external: true
          };
        }
        const packageEntry = await _resolve(pkgName).catch(() => null);
        if (packageEntry !== originalId) {
          const guessedSubpath = pkgName + subpath.replace(/\.[a-z]+$/, "");
          const resolvedGuess = await _resolve(guessedSubpath).catch(
            () => null
          );
          if (resolvedGuess === originalId) {
            trackedExternals.add(resolvedGuess);
            return {
              id: guessedSubpath,
              external: true
            };
          }
          return null;
        }
      }
      trackedExternals.add(resolved.id);
      return {
        id: pkgName,
        external: true
      };
    },
    async buildEnd() {
      if (opts.trace === false) {
        return;
      }
      for (const pkgName of opts.traceInclude || []) {
        const path = await this.resolve(pkgName);
        if (path?.id) {
          trackedExternals.add(path.id.replace(/\?.+/, ""));
        }
      }
      let tracedFiles = await nodeFileTrace(
        [...trackedExternals],
        opts.traceOptions
      ).then(
        (r) => [...r.fileList].map((f) => resolve(opts.traceOptions.base, f))
      ).then((r) => r.filter((file) => file.includes("node_modules")));
      tracedFiles = await Promise.all(
        tracedFiles.map((file) => promises.realpath(file))
      );
      const packageJSONCache = /* @__PURE__ */ new Map();
      const getPackageJson = async (pkgDir) => {
        if (packageJSONCache.has(pkgDir)) {
          return packageJSONCache.get(pkgDir);
        }
        const pkgJSON = JSON.parse(
          await promises.readFile(resolve(pkgDir, "package.json"), "utf8")
        );
        packageJSONCache.set(pkgDir, pkgJSON);
        return pkgJSON;
      };
      const tracedPackages = /* @__PURE__ */ new Map();
      const ignoreDirs = [];
      const ignoreWarns = /* @__PURE__ */ new Set();
      for (const file of tracedFiles) {
        const { baseDir, pkgName } = parseNodeModulePath(file);
        if (!pkgName) {
          continue;
        }
        let pkgDir = resolve(baseDir, pkgName);
        const existingPkgDir = tracedPackages.get(pkgName);
        if (existingPkgDir && existingPkgDir !== pkgDir) {
          const v1 = await getPackageJson(existingPkgDir).then(
            (r) => r.version
          );
          const v2 = await getPackageJson(pkgDir).then((r) => r.version);
          const isNewer = semver.gt(v2, v1);
          const getMajor = (v) => v.split(".").find((s) => s !== "0");
          if (getMajor(v1) !== getMajor(v2)) {
            const warn = `Multiple major versions of package \`${pkgName}\` are being externalized. Picking latest version:

` + [
              `  ${isNewer ? "-" : "+"} ` + existingPkgDir + "@" + v1,
              `  ${isNewer ? "+" : "-"} ` + pkgDir + "@" + v2
            ].join("\n");
            if (!ignoreWarns.has(warn)) {
              consola.warn(warn);
              ignoreWarns.add(warn);
            }
          }
          const [newerDir, olderDir] = isNewer ? [pkgDir, existingPkgDir] : [existingPkgDir, pkgDir];
          if (getMajor(v1) === getMajor(v2)) {
            tracedFiles = tracedFiles.map(
              (f) => f.startsWith(olderDir + "/") ? f.replace(olderDir, newerDir) : f
            );
          }
          ignoreDirs.push(olderDir + "/");
          pkgDir = newerDir;
        }
        tracedPackages.set(pkgName, pkgDir);
      }
      tracedFiles = tracedFiles.filter(
        (f) => !ignoreDirs.some((d) => f.startsWith(d))
      );
      tracedFiles = [...new Set(tracedFiles)];
      for (const pkgDir of tracedPackages.values()) {
        const pkgJSON = join(pkgDir, "package.json");
        if (!tracedFiles.includes(pkgJSON)) {
          tracedFiles.push(pkgJSON);
        }
      }
      const writeFile = async (file) => {
        if (!await isFile(file)) {
          return;
        }
        const src = resolve(opts.traceOptions.base, file);
        const { pkgName, subpath } = parseNodeModulePath(file);
        const dst = resolve(opts.outDir, `node_modules/${pkgName + subpath}`);
        await promises.mkdir(dirname(dst), { recursive: true });
        try {
          await promises.copyFile(src, dst);
        } catch {
          consola.warn(`Could not resolve \`${src}\`. Skipping.`);
        }
      };
      await Promise.all(
        tracedFiles.map((file) => retry(() => writeFile(file), 3))
      );
      await promises.writeFile(
        resolve(opts.outDir, "package.json"),
        JSON.stringify(
          {
            name: "nitro-output",
            version: "0.0.0",
            private: true,
            bundledDependencies: [...tracedPackages.keys()].sort()
          },
          null,
          2
        ),
        "utf8"
      );
    }
  };
}
function parseNodeModulePath(path) {
  if (!path) {
    return {};
  }
  const match = /^(.+\/node_modules\/)([^/@]+|@[^/]+\/[^/]+)(\/?.*?)?$/.exec(
    normalize(path)
  );
  if (!match) {
    return {};
  }
  const [, baseDir, pkgName, subpath] = match;
  return {
    baseDir,
    pkgName,
    subpath
  };
}
async function isFile(file) {
  try {
    const stat = await promises.stat(file);
    return stat.isFile();
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
async function retry(fn, retries) {
  let retry2 = 0;
  let lastError;
  while (retry2++ < retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await new Promise((resolve2) => setTimeout(resolve2, 2));
    }
  }
  throw lastError;
}

function handlers(nitro) {
  const getHandlers = () => {
    const handlers2 = [
      ...nitro.scannedHandlers,
      ...nitro.options.handlers
    ];
    const envConditions = new Set(
      [
        nitro.options.dev ? "dev" : "prod",
        nitro.options.preset,
        nitro.options.preset === "nitro-prerender" ? "prerender" : void 0
      ].filter(Boolean)
    );
    return handlers2.filter((h) => {
      const envs = (Array.isArray(h.env) ? h.env : [h.env]).filter(
        Boolean
      );
      return envs.length === 0 || envs.some((env) => envConditions.has(env));
    });
  };
  return virtual(
    {
      "#nitro-internal-virtual/server-handlers": () => {
        const handlers2 = getHandlers();
        if (nitro.options.serveStatic) {
          handlers2.unshift({
            middleware: true,
            handler: join(runtimeDir, "internal/static")
          });
        }
        if (nitro.options.renderer) {
          handlers2.push({
            route: "/**",
            lazy: true,
            handler: nitro.options.renderer
          });
        }
        extendMiddlewareWithRuleOverlaps(handlers2, nitro.options.routeRules);
        const imports = unique(
          handlers2.filter((h) => !h.lazy).map((h) => h.handler)
        );
        const lazyImports = unique(
          handlers2.filter((h) => h.lazy).map((h) => h.handler)
        );
        const code = (
          /* js */
          `
${imports.map((handler) => `import ${getImportId(handler)} from '${handler}';`).join("\n")}

${lazyImports.map(
            (handler) => `const ${getImportId(handler, true)} = () => import('${handler}');`
          ).join("\n")}

export const handlers = [
${handlers2.map(
            (h) => `  { route: '${h.route || ""}', handler: ${getImportId(
              h.handler,
              h.lazy
            )}, lazy: ${!!h.lazy}, middleware: ${!!h.middleware}, method: ${JSON.stringify(
              h.method?.toLowerCase()
            )} }`
          ).join(",\n")}
];
  `.trim()
        );
        return code;
      },
      "#nitro-internal-virtual/server-handlers-meta": () => {
        const handlers2 = getHandlers();
        const imports = unique(handlers2.map((h) => h.handler));
        return (
          /* js */
          `
  ${imports.map(
            (handler) => `import ${getImportId(handler)}Meta from "${handler}?meta";`
          ).join("\n")}
export const handlersMeta = [
  ${handlers2.map(
            (h) => (
              /* js */
              `{ route: ${JSON.stringify(h.route)}, method: ${JSON.stringify(
                h.method?.toLowerCase()
              )}, meta: ${getImportId(h.handler)}Meta }`
            )
          ).join(",\n")}
  ];
        `
        );
      }
    },
    nitro.vfs
  );
}
function unique(arr) {
  return [...new Set(arr)];
}
function getImportId(p, lazy) {
  return (lazy ? "_lazy_" : "_") + hash(p).replace(/-/g, "").slice(0, 6);
}
const WILDCARD_PATH_RE = /\/\*\*.*$/;
function extendMiddlewareWithRuleOverlaps(handlers2, routeRules) {
  const rules = Object.entries(routeRules);
  for (const [path, rule] of rules) {
    if (!rule.cache) {
      const isNested = rules.some(
        ([p, r]) => r.cache && WILDCARD_PATH_RE.test(p) && path.startsWith(p.replace(WILDCARD_PATH_RE, ""))
      );
      if (!isNested) {
        continue;
      }
    }
    for (const [index, handler] of handlers2.entries()) {
      if (!handler.route || handler.middleware) {
        continue;
      }
      if (handler.route === path) {
        break;
      }
      if (!WILDCARD_PATH_RE.test(handler.route)) {
        continue;
      }
      if (!path.startsWith(handler.route.replace(WILDCARD_PATH_RE, ""))) {
        continue;
      }
      handlers2.splice(index, 0, {
        ...handler,
        route: path
      });
      break;
    }
  }
}

const virtualPrefix = "\0nitro-handler-meta:";
const esbuildLoaders = {
  ".ts": "ts",
  ".js": "js",
  ".tsx": "tsx",
  ".jsx": "jsx"
};
function handlersMeta(nitro) {
  return {
    name: "nitro:handlers-meta",
    async resolveId(id, importer, resolveOpts) {
      if (id.startsWith("\0")) {
        return;
      }
      if (id.endsWith(`?meta`)) {
        const resolved = await this.resolve(
          id.replace(`?meta`, ``),
          importer,
          resolveOpts
        );
        if (!resolved) {
          return;
        }
        return virtualPrefix + resolved.id;
      }
    },
    async load(id) {
      if (id.startsWith(virtualPrefix)) {
        const fullPath = id.slice(virtualPrefix.length);
        if (fullPath.startsWith("\0")) {
          const { code } = await this.load({ id: fullPath });
          return code;
        }
        return readFile(fullPath, { encoding: "utf8" });
      }
    },
    async transform(code, id) {
      if (!id.startsWith(virtualPrefix)) {
        return;
      }
      let meta = null;
      try {
        const ext = extname(id);
        const jsCode = await transform(code, {
          loader: esbuildLoaders[ext]
        }).then((r) => r.code);
        const ast = this.parse(jsCode);
        for (const node of ast.body) {
          if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier" && node.expression.callee.name === "defineRouteMeta" && node.expression.arguments.length === 1) {
            meta = astToObject(node.expression.arguments[0]);
            break;
          }
        }
      } catch (error) {
        nitro.logger.warn(
          `[handlers-meta] Cannot extra route meta for: ${id}: ${error}`
        );
      }
      return {
        code: `export default ${JSON.stringify(meta)};`,
        map: null
      };
    }
  };
}
function astToObject(node) {
  switch (node.type) {
    case "ObjectExpression": {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type === "Property") {
          const key = prop.key.name ?? prop.key.value;
          obj[key] = astToObject(prop.value);
        }
      }
      return obj;
    }
    case "ArrayExpression": {
      return node.elements.map((el) => astToObject(el)).filter(Boolean);
    }
    case "Literal": {
      return node.value;
    }
  }
}

const ImportMetaRe = /import\.meta|globalThis._importMeta_/;
function importMeta(nitro) {
  return {
    name: "import-meta",
    renderChunk(code, chunk) {
      const isEntry = chunk.isEntry;
      if (!isEntry && (!ImportMetaRe.test(code) || code.includes("ROLLUP_NO_REPLACE"))) {
        return;
      }
      const url = nitro.options.node && isEntry && !code.includes("ROLLUP_NO_REPLACE") ? "_import_meta_url_" : '"file:///_entry.js"';
      const envImport = nitro.options.node ? "import process from 'node:process';" : "";
      const env = nitro.options.node ? "process.env" : "{}";
      const ref = "globalThis._importMeta_";
      const stub = `{url:${url},env:${env}}`;
      const stubInit = isEntry ? `${ref}=${stub};` : `${ref}=${ref}||${stub};`;
      return {
        code: envImport + stubInit + code,
        map: null
      };
    }
  };
}

const readAssetHandler = {
  true: "node",
  node: "node",
  false: "null",
  deno: "deno",
  inline: "inline"
};
function publicAssets(nitro) {
  return virtual(
    {
      // #nitro-internal-virtual/public-assets-data
      "#nitro-internal-virtual/public-assets-data": async () => {
        const assets = {};
        const files = await globby("**", {
          cwd: nitro.options.output.publicDir,
          absolute: false,
          dot: true
        });
        for (const id of files) {
          let mimeType = mime.getType(id.replace(/\.(gz|br)$/, "")) || "text/plain";
          if (mimeType.startsWith("text")) {
            mimeType += "; charset=utf-8";
          }
          const fullPath = resolve(nitro.options.output.publicDir, id);
          const assetData = await promises.readFile(fullPath);
          const etag = createEtag(assetData);
          const stat = await promises.stat(fullPath);
          const assetId = "/" + decodeURIComponent(id);
          let encoding;
          if (id.endsWith(".gz")) {
            encoding = "gzip";
          } else if (id.endsWith(".br")) {
            encoding = "br";
          }
          assets[assetId] = {
            type: nitro._prerenderMeta?.[assetId]?.contentType || mimeType,
            encoding,
            etag,
            mtime: stat.mtime.toJSON(),
            size: stat.size,
            path: relative(nitro.options.output.serverDir, fullPath),
            data: nitro.options.serveStatic === "inline" ? assetData.toString("base64") : void 0
          };
        }
        return `export default ${JSON.stringify(assets, null, 2)};`;
      },
      // #nitro-internal-virtual/public-assets-node
      "#nitro-internal-virtual/public-assets-node": () => {
        return `
import { promises as fsp } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'pathe'
import assets from '#nitro-internal-virtual/public-assets-data'
export function readAsset (id) {
  const serverDir = dirname(fileURLToPath(import.meta.url))
  return fsp.readFile(resolve(serverDir, assets[id].path))
}`;
      },
      // #nitro-internal-virtual/public-assets-deno
      "#nitro-internal-virtual/public-assets-deno": () => {
        return `
import assets from '#nitro-internal-virtual/public-assets-data'
export function readAsset (id) {
  // https://deno.com/deploy/docs/serve-static-assets
  const path = '.' + decodeURIComponent(new URL(\`../public\${id}\`, 'file://').pathname)
  return Deno.readFile(path);
}`;
      },
      // #nitro-internal-virtual/public-assets-null
      "#nitro-internal-virtual/public-assets-null": () => {
        return `
    export function readAsset (id) {
        return Promise.resolve(null);
    }`;
      },
      // #nitro-internal-virtual/public-assets-inline
      "#nitro-internal-virtual/public-assets-inline": () => {
        return `
  import assets from '#nitro-internal-virtual/public-assets-data'
  export function readAsset (id) {
    if (!assets[id]) { return undefined }
    if (assets[id]._data) { return assets[id]._data }
    if (!assets[id].data) { return assets[id].data }
    assets[id]._data = Uint8Array.from(atob(assets[id].data), (c) => c.charCodeAt(0))
    return assets[id]._data
}`;
      },
      // #nitro-internal-virtual/public-assets
      "#nitro-internal-virtual/public-assets": () => {
        const publicAssetBases = Object.fromEntries(
          nitro.options.publicAssets.filter((dir) => !dir.fallthrough && dir.baseURL !== "/").map((dir) => [
            withTrailingSlash(dir.baseURL),
            { maxAge: dir.maxAge }
          ])
        );
        const handlerName = readAssetHandler[nitro.options.serveStatic] || "null";
        const readAssetImport = `#nitro-internal-virtual/public-assets-${handlerName}`;
        return `
import assets from '#nitro-internal-virtual/public-assets-data'
export { readAsset } from "${readAssetImport}"
export const publicAssetBases = ${JSON.stringify(publicAssetBases)}

export function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

export function getPublicAssetMeta(id = '') {
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return publicAssetBases[base] }
  }
  return {}
}

export function getAsset (id) {
  return assets[id]
}
`;
      }
    },
    nitro.vfs
  );
}

const HELPER_ID = "\0raw-helpers";
function raw(opts = {}) {
  const extensions = /* @__PURE__ */ new Set([
    ".md",
    ".mdx",
    ".txt",
    ".css",
    ".htm",
    ".html",
    ".sql",
    ...opts.extensions || []
  ]);
  return {
    name: "raw",
    async resolveId(id, importer, resolveOpts) {
      if (id === HELPER_ID) {
        return id;
      }
      if (id[0] === "\0") {
        return;
      }
      const withRawSpecifier = id.startsWith("raw:");
      if (withRawSpecifier) {
        id = id.slice(4);
      }
      if (!withRawSpecifier && !extensions.has(extname(id))) {
        return;
      }
      const resolvedId = (await this.resolve(id, importer, resolveOpts))?.id;
      if (!resolvedId || resolvedId.startsWith("\0")) {
        return resolvedId;
      }
      if (!withRawSpecifier && !extensions.has(extname(resolvedId))) {
        return;
      }
      return { id: "\0raw:" + resolvedId };
    },
    load(id) {
      if (id === HELPER_ID) {
        return getHelpers();
      }
      if (id.startsWith("\0raw:")) {
        return promises.readFile(id.slice(5), isBinary(id) ? "binary" : "utf8");
      }
    },
    transform(code, id) {
      if (!id.startsWith("\0raw:")) {
        return;
      }
      if (isBinary(id)) {
        const serialized = Buffer.from(code, "binary").toString("base64");
        return {
          code: `// ROLLUP_NO_REPLACE 
 import {base64ToUint8Array } from "${HELPER_ID}" 
 export default base64ToUint8Array("${serialized}")`,
          map: null
        };
      }
      return {
        code: `// ROLLUP_NO_REPLACE 
 export default ${JSON.stringify(code)}`,
        map: null
      };
    }
  };
}
function isBinary(id) {
  const idMime = mime.getType(id) || "";
  if (idMime.startsWith("text/")) {
    return false;
  }
  if (/application\/(json|sql|xml|yaml)/.test(idMime)) {
    return false;
  }
  return true;
}
function getHelpers() {
  const js = String.raw;
  return js`
export function base64ToUint8Array(str) {
  const data = atob(str);
  const size = data.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes;
}
  `;
}

const NO_REPLACE_RE = /ROLLUP_NO_REPLACE/;
function replace(options) {
  const _plugin = _replace(options);
  return {
    ..._plugin,
    // https://github.com/rollup/plugins/blob/master/packages/replace/src/index.js#L94
    renderChunk(code, chunk, options2) {
      if (!NO_REPLACE_RE.test(code)) {
        return _plugin.renderChunk.call(this, code, chunk, options2);
      }
    }
  };
}

function serverAssets(nitro) {
  if (nitro.options.dev || nitro.options.preset === "nitro-prerender") {
    return virtual(
      { "#nitro-internal-virtual/server-assets": getAssetsDev(nitro) },
      nitro.vfs
    );
  }
  return virtual(
    {
      "#nitro-internal-virtual/server-assets": async () => {
        const assets = {};
        for (const asset of nitro.options.serverAssets) {
          const files = await globby(asset.pattern || "**/*", {
            cwd: asset.dir,
            absolute: false,
            ignore: asset.ignore
          });
          for (const _id of files) {
            const fsPath = resolve(asset.dir, _id);
            const id = asset.baseName + "/" + _id;
            assets[id] = { fsPath, meta: {} };
            let type = mime.getType(id) || "text/plain";
            if (type.startsWith("text")) {
              type += "; charset=utf-8";
            }
            const etag = createEtag(await promises.readFile(fsPath));
            const mtime = await promises.stat(fsPath).then((s) => s.mtime.toJSON());
            assets[id].meta = { type, etag, mtime };
          }
        }
        return getAssetProd(assets);
      }
    },
    nitro.vfs
  );
}
function getAssetsDev(nitro) {
  return `
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

const serverAssets = ${JSON.stringify(nitro.options.serverAssets)}

export const assets = createStorage()

for (const asset of serverAssets) {
  assets.mount(asset.baseName, fsDriver({ base: asset.dir, ignore: (asset?.ignore || []) }))
}`;
}
function getAssetProd(assets) {
  return `
const _assets = {
${Object.entries(assets).map(
    ([id, asset]) => `  [${JSON.stringify(
      normalizeKey(id)
    )}]: {
    import: () => import(${JSON.stringify(
      "raw:" + asset.fsPath
    )}).then(r => r.default || r),
    meta: ${JSON.stringify(
      asset.meta
    )}
  }`
  ).join(",\n")}
}

const normalizeKey = ${normalizeKey.toString()}

export const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id)
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id)
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id)
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
}
`;
}

function sourcemapMininify() {
  return {
    name: "nitro:sourcemap-minify",
    generateBundle(_options, bundle) {
      for (const [key, asset] of Object.entries(bundle)) {
        if (!key.endsWith(".map") || !("source" in asset) || typeof asset.source !== "string") {
          continue;
        }
        const sourcemap = JSON.parse(asset.source);
        if (!(sourcemap.sources || []).some((s) => s.includes("node_modules"))) {
          continue;
        }
        sourcemap.mappings = "";
        asset.source = JSON.stringify(sourcemap);
      }
    }
  };
}

function storage(nitro) {
  const mounts = [];
  const isDevOrPrerender = nitro.options.dev || nitro.options.preset === "nitro-prerender";
  const storageMounts = isDevOrPrerender ? { ...nitro.options.storage, ...nitro.options.devStorage } : nitro.options.storage;
  for (const path in storageMounts) {
    const mount = storageMounts[path];
    mounts.push({
      path,
      driver: builtinDrivers[mount.driver] || mount.driver,
      opts: mount
    });
  }
  const driverImports = [...new Set(mounts.map((m) => m.driver))];
  const bundledStorageCode = `
import { prefixStorage } from 'unstorage'
import overlay from 'unstorage/drivers/overlay'
import memory from 'unstorage/drivers/memory'

const bundledStorage = ${JSON.stringify(nitro.options.bundledStorage)}
for (const base of bundledStorage) {
  storage.mount(base, overlay({
    layers: [
      memory(),
      // TODO
      // prefixStorage(storage, base),
      prefixStorage(storage, 'assets:nitro:bundled:' + base)
    ]
  }))
}`;
  return virtual(
    {
      "#nitro-internal-virtual/storage": `
import { createStorage } from 'unstorage'
import { assets } from '#nitro-internal-virtual/server-assets'

${driverImports.map((i) => genImport(i, genSafeVariableName(i))).join("\n")}

export const storage = createStorage({})

storage.mount('/assets', assets)

${mounts.map(
        (m) => `storage.mount('${m.path}', ${genSafeVariableName(
          m.driver
        )}(${JSON.stringify(m.opts)}))`
      ).join("\n")}

${!isDevOrPrerender && nitro.options.bundledStorage.length > 0 ? bundledStorageCode : ""}
`
    },
    nitro.vfs
  );
}

const TIMING = "globalThis.__timing__";
const iife = (code) => `(function() { ${code.trim()} })();`.replace(/\n/g, "");
const HELPERIMPORT = "import './timing.js';";
function timing(opts = {}) {
  const HELPER_DEBUG = opts.silent ? "" : `if (t > 0) { console.debug('>', id + ' (' + t + 'ms)'); }`;
  const HELPER = iife(
    /* js */
    `
    const start = () => Date.now();
    const end = s => Date.now() - s;
    const _s = {};
    const metrics = [];
    const logStart = id => { _s[id] = Date.now(); };
    const logEnd = id => { const t = end(_s[id]); delete _s[id]; metrics.push([id, t]); ${HELPER_DEBUG} };
    ${TIMING} = { start, end, metrics, logStart, logEnd };
    `
  );
  return {
    name: "timing",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "timing.js",
        source: HELPER
      });
    },
    renderChunk(code, chunk) {
      let name = chunk.fileName || "";
      name = name.replace(extname(name), "");
      const logName = name === "index" ? "Nitro Start" : "Load " + name;
      return {
        code: (chunk.isEntry ? HELPERIMPORT : "") + `${TIMING}.logStart('${logName}');` + code + `;${TIMING}.logEnd('${logName}');`,
        map: null
      };
    }
  };
}

function errorHandler(nitro) {
  return virtual(
    {
      "#nitro-internal-virtual/error-handler": () => {
        const errorHandlers = Array.isArray(nitro.options.errorHandler) ? nitro.options.errorHandler : [nitro.options.errorHandler];
        const builtinHandler = join(
          runtimeDir,
          `internal/error/${nitro.options.dev ? "dev" : "prod"}`
        );
        return (
          /* js */
          `
${errorHandlers.map((h, i) => `import errorHandler$${i} from "${h}";`).join("\n")}

const errorHandlers = [${errorHandlers.map((_, i) => `errorHandler$${i}`).join(", ")}];

import { defaultHandler } from "${builtinHandler}";

export default async function(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}
`
        );
      }
    },
    nitro.vfs
  );
}

function resolveAliases(_aliases) {
  const aliases = Object.fromEntries(
    Object.entries(_aliases).sort(
      ([a], [b]) => b.split("/").length - a.split("/").length || b.length - a.length
    )
  );
  for (const key in aliases) {
    for (const alias in aliases) {
      if (!["~", "@", "#"].includes(alias[0])) {
        continue;
      }
      if (alias === "@" && !aliases[key].startsWith("@/")) {
        continue;
      }
      if (aliases[key].startsWith(alias)) {
        aliases[key] = aliases[alias] + aliases[key].slice(alias.length);
      }
    }
  }
  return aliases;
}

const getRollupConfig = (nitro) => {
  const extensions = [
    ".ts",
    ".mjs",
    ".js",
    ".json",
    ".node",
    ".tsx",
    ".jsx"
  ];
  const isNodeless = nitro.options.node === false;
  const { env } = defineEnv({
    nodeCompat: isNodeless,
    npmShims: true,
    resolve: true,
    presets: nitro.options.unenv,
    overrides: {
      alias: nitro.options.alias
    }
  });
  const buildServerDir = join(nitro.options.buildDir, "dist/server");
  const presetsDir = resolve(runtimeDir, "../presets");
  const chunkNamePrefixes = [
    [nitro.options.buildDir, "build"],
    [buildServerDir, "app"],
    [runtimeDir, "nitro"],
    [presetsDir, "nitro"],
    ["\0raw:", "raw"],
    ["\0nitro-wasm:", "wasm"],
    ["\0", "virtual"]
  ];
  function getChunkGroup(id) {
    if (id.startsWith(runtimeDir) || id.startsWith(presetsDir)) {
      return "nitro";
    }
  }
  function getChunkName(id) {
    for (const [dir, name] of chunkNamePrefixes) {
      if (id.startsWith(dir)) {
        return `chunks/${name}/[name].mjs`;
      }
    }
    const routeHandler = nitro.options.handlers.find((h) => id.startsWith(h.handler)) || nitro.scannedHandlers.find((h) => id.startsWith(h.handler));
    if (routeHandler?.route) {
      const path = routeHandler.route.replace(/:([^/]+)/g, "_$1").replace(/\/[^/]+$/g, "") || "/";
      return `chunks/routes${path}/[name].mjs`;
    }
    const taskHandler = Object.entries(nitro.options.tasks).find(
      ([_, task]) => task.handler === id
    );
    if (taskHandler) {
      return `chunks/tasks/[name].mjs`;
    }
    return `chunks/_/[name].mjs`;
  }
  const rollupConfig = defu(nitro.options.rollupConfig, {
    input: nitro.options.entry,
    output: {
      dir: nitro.options.output.serverDir,
      entryFileNames: "index.mjs",
      chunkFileNames(chunk) {
        const lastModule = normalize(chunk.moduleIds.at(-1) || "");
        return getChunkName(lastModule);
      },
      manualChunks(id) {
        return getChunkGroup(id);
      },
      inlineDynamicImports: nitro.options.inlineDynamicImports,
      format: "esm",
      exports: "auto",
      intro: "",
      outro: "",
      generatedCode: {
        constBindings: true
      },
      sanitizeFileName: sanitizeFilePath,
      sourcemap: nitro.options.sourceMap,
      sourcemapExcludeSources: true,
      sourcemapIgnoreList(relativePath, sourcemapPath) {
        return relativePath.includes("node_modules");
      }
    },
    external: [...env.external],
    plugins: [],
    onwarn(warning, rollupWarn) {
      if (!["CIRCULAR_DEPENDENCY", "EVAL"].includes(warning.code || "") && !warning.message.includes("Unsupported source map comment")) {
        rollupWarn(warning);
      }
    },
    treeshake: {
      moduleSideEffects(id) {
        const normalizedId = normalize(id);
        const idWithoutNodeModules = normalizedId.split("node_modules/").pop();
        if (!idWithoutNodeModules) {
          return false;
        }
        if (normalizedId.startsWith(runtimeDir) || idWithoutNodeModules.startsWith(runtimeDir)) {
          return true;
        }
        return nitro.options.moduleSideEffects.some(
          (m) => normalizedId.startsWith(m) || idWithoutNodeModules.startsWith(m)
        );
      }
    }
  });
  if (rollupConfig.output.inlineDynamicImports) {
    delete rollupConfig.output.manualChunks;
  }
  if (nitro.options.timing) {
    rollupConfig.plugins.push(
      timing({
        silent: isTest
      })
    );
  }
  if (nitro.options.imports) {
    rollupConfig.plugins.push(
      unimportPlugin.rollup(nitro.options.imports)
    );
  }
  rollupConfig.plugins.push(raw());
  if (nitro.options.experimental.wasm) {
    rollupConfig.plugins.push(rollup(nitro.options.wasm || {}));
  }
  let NODE_ENV = nitro.options.dev ? "development" : "production";
  if (nitro.options.preset === "nitro-prerender") {
    NODE_ENV = "prerender";
  }
  const buildEnvVars = {
    NODE_ENV,
    prerender: nitro.options.preset === "nitro-prerender",
    server: true,
    client: false,
    dev: String(nitro.options.dev),
    DEBUG: nitro.options.dev
  };
  const staticFlags = {
    dev: nitro.options.dev,
    preset: nitro.options.preset,
    prerender: nitro.options.preset === "nitro-prerender",
    server: true,
    client: false,
    nitro: true,
    baseURL: nitro.options.baseURL,
    // @ts-expect-error
    "versions.nitro": "",
    "versions?.nitro": "",
    // Internal
    _asyncContext: nitro.options.experimental.asyncContext,
    _websocket: nitro.options.experimental.websocket,
    _tasks: nitro.options.experimental.tasks
  };
  rollupConfig.plugins.push(importMeta(nitro));
  rollupConfig.plugins.push(
    replace({
      preventAssignment: true,
      values: {
        "typeof window": '"undefined"',
        _import_meta_url_: "import.meta.url",
        "globalThis.process.": "process.",
        "process.env.RUNTIME_CONFIG": () => JSON.stringify(nitro.options.runtimeConfig, null, 2),
        ...Object.fromEntries(
          [".", ";", ")", "[", "]", "}", " "].map((d) => [
            `import.meta${d}`,
            `globalThis._importMeta_${d}`
          ])
        ),
        ...Object.fromEntries(
          Object.entries(buildEnvVars).map(([key, val]) => [
            `process.env.${key}`,
            JSON.stringify(val)
          ])
        ),
        ...Object.fromEntries(
          Object.entries(buildEnvVars).map(([key, val]) => [
            `import.meta.env.${key}`,
            JSON.stringify(val)
          ])
        ),
        ...Object.fromEntries(
          Object.entries(staticFlags).map(([key, val]) => [
            `process.${key}`,
            JSON.stringify(val)
          ])
        ),
        ...Object.fromEntries(
          Object.entries(staticFlags).map(([key, val]) => [
            `import.meta.${key}`,
            JSON.stringify(val)
          ])
        ),
        ...nitro.options.replace
      }
    })
  );
  rollupConfig.plugins.push(
    esbuild({
      target: "es2019",
      sourceMap: nitro.options.sourceMap,
      ...nitro.options.esbuild?.options
    })
  );
  rollupConfig.plugins.push(
    dynamicRequire({
      dir: resolve(nitro.options.buildDir, "dist/server"),
      inline: nitro.options.node === false || nitro.options.inlineDynamicImports,
      ignore: [
        "client.manifest.mjs",
        "server.js",
        "server.cjs",
        "server.mjs",
        "server.manifest.mjs"
      ]
    })
  );
  rollupConfig.plugins.push(serverAssets(nitro));
  rollupConfig.plugins.push(publicAssets(nitro));
  rollupConfig.plugins.push(storage(nitro));
  rollupConfig.plugins.push(database(nitro));
  rollupConfig.plugins.push(appConfig(nitro));
  rollupConfig.plugins.push(handlers(nitro));
  if (nitro.options.experimental.openAPI) {
    rollupConfig.plugins.push(handlersMeta(nitro));
  }
  rollupConfig.plugins.push(errorHandler(nitro));
  rollupConfig.plugins.push(
    virtual(
      {
        "#nitro-internal-pollyfills": env.polyfill.map((p) => `import '${p}';`).join("\n") || `/* No polyfills */`
      },
      nitro.vfs
    )
  );
  rollupConfig.plugins.push(virtual(nitro.options.virtual, nitro.vfs));
  const nitroPlugins = [...new Set(nitro.options.plugins)];
  rollupConfig.plugins.push(
    virtual(
      {
        "#nitro-internal-virtual/plugins": `
${nitroPlugins.map(
          (plugin) => `import _${hash(plugin).replace(/-/g, "")} from '${plugin}';`
        ).join("\n")}

export const plugins = [
  ${nitroPlugins.map((plugin) => `_${hash(plugin).replace(/-/g, "")}`).join(",\n")}
]
    `
      },
      nitro.vfs
    )
  );
  let buildDir = nitro.options.buildDir;
  if (isWindows && nitro.options.externals?.trace === false && nitro.options.dev) {
    buildDir = pathToFileURL(buildDir).href;
  }
  rollupConfig.plugins.push(
    alias({
      entries: resolveAliases({
        "#build": buildDir,
        "#internal/nitro": runtimeDir,
        "nitro/runtime": runtimeDir,
        "nitropack/runtime": runtimeDir,
        "~": nitro.options.srcDir,
        "@/": nitro.options.srcDir,
        "~~": nitro.options.rootDir,
        "@@/": nitro.options.rootDir,
        ...env.alias
      })
    })
  );
  if (nitro.options.noExternals) {
    rollupConfig.plugins.push({
      name: "no-externals",
      async resolveId(id, importer, resolveOpts) {
        if (nitro.options.node && (id.startsWith("node:") || builtinModules.includes(id))) {
          return { id, external: true };
        }
        const resolved = await this.resolve(id, importer, resolveOpts);
        if (!resolved) {
          const _resolved = resolveModulePath(id, {
            try: true,
            from: importer && isAbsolute$1(importer) ? [pathToFileURL(importer), ...nitro.options.nodeModulesDirs] : nitro.options.nodeModulesDirs,
            suffixes: ["", "/index"],
            extensions: [".mjs", ".cjs", ".js", ".mts", ".cts", ".ts", ".json"],
            conditions: [
              "default",
              nitro.options.dev ? "development" : "production",
              "node",
              "import",
              "require"
            ]
          });
          if (_resolved) {
            return { id: _resolved, external: false };
          }
        }
        if (!resolved || resolved.external && !id.endsWith(".wasm")) {
          throw new Error(
            `Cannot resolve ${JSON.stringify(id)} from ${JSON.stringify(
              importer
            )} and externals are not allowed!`
          );
        }
      }
    });
  } else {
    const externalsPlugin = nitro.options.experimental.legacyExternals ? externals : externals$1;
    rollupConfig.plugins.push(
      externalsPlugin(
        defu(nitro.options.externals, {
          outDir: nitro.options.output.serverDir,
          moduleDirectories: nitro.options.nodeModulesDirs,
          external: [
            ...nitro.options.dev ? [nitro.options.buildDir] : [],
            ...nitro.options.nodeModulesDirs
          ],
          inline: [
            "#",
            "~",
            "@/",
            "~~",
            "@@/",
            "virtual:",
            "nitro/runtime",
            "nitropack/runtime",
            dirname(nitro.options.entry),
            ...nitro.options.experimental.wasm ? [(id) => id?.endsWith(".wasm")] : [],
            runtimeDir,
            nitro.options.srcDir,
            ...nitro.options.handlers.map((m) => m.handler).filter((i) => typeof i === "string"),
            ...nitro.options.dev || nitro.options.preset === "nitro-prerender" || nitro.options.experimental.bundleRuntimeDependencies === false ? [] : runtimeDependencies
          ],
          traceOptions: {
            base: "/",
            processCwd: nitro.options.rootDir,
            exportsOnly: true
          },
          traceAlias: {
            "h3-nightly": "h3",
            ...nitro.options.externals?.traceAlias
          },
          exportConditions: nitro.options.exportConditions
        })
      )
    );
  }
  rollupConfig.plugins.push(
    nodeResolve({
      extensions,
      preferBuiltins: !!nitro.options.node,
      rootDir: nitro.options.rootDir,
      modulePaths: nitro.options.nodeModulesDirs,
      // 'module' is intentionally not supported because of externals
      mainFields: ["main"],
      exportConditions: nitro.options.exportConditions
    })
  );
  rollupConfig.plugins.push(
    commonjs({
      strictRequires: "auto",
      // TODO: set to true (default) in v3
      esmExternals: (id) => !id.startsWith("unenv/"),
      requireReturnsDefault: "auto",
      ...nitro.options.commonJS
    })
  );
  rollupConfig.plugins.push(json());
  rollupConfig.plugins.push(inject(env.inject));
  if (nitro.options.minify) {
    const _terser = createRequire(import.meta.url)("@rollup/plugin-terser");
    const terser = _terser.default || _terser;
    rollupConfig.plugins.push(
      terser({
        mangle: {
          keep_fnames: true,
          keep_classnames: true
        },
        format: {
          comments: false
        }
      })
    );
  }
  if (nitro.options.sourceMap && !nitro.options.dev && nitro.options.experimental.sourcemapMinify !== false) {
    rollupConfig.plugins.push(sourcemapMininify());
  }
  if (nitro.options.analyze) {
    rollupConfig.plugins.push(
      visualizer({
        ...nitro.options.analyze,
        filename: (nitro.options.analyze.filename || "stats.html").replace(
          "{name}",
          "nitro"
        ),
        title: "Nitro Server bundle stats"
      })
    );
  }
  return rollupConfig;
};

export { getRollupConfig };
