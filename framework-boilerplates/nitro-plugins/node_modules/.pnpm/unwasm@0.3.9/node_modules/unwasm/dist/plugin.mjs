import { existsSync, promises } from 'node:fs';
import { basename } from 'pathe';
import MagicString from 'magic-string';
import { createUnplugin } from 'unplugin';
import { createHash } from 'node:crypto';
import { readPackageJSON } from 'pkg-types';
import { genSafeVariableName, genImport, genString, genObjectFromRaw } from 'knitwork';
import { parseWasm } from './tools.mjs';

const UNWASM_EXTERNAL_PREFIX = "\0unwasm:external:";
const UNWASM_EXTERNAL_RE = /(\0|\\0)unwasm:external:([^"']+)/gu;
const UMWASM_HELPERS_ID = "\0unwasm:helpers";
function sha1(source) {
  return createHash("sha1").update(source).digest("hex").slice(0, 16);
}

const js = String.raw;
async function getWasmESMBinding(asset, opts) {
  const autoImports = await getWasmImports(asset);
  const envCode = opts.esmImport ? js`
${autoImports.code};

async function _instantiate(imports = _imports) {
  const _mod = await import("${UNWASM_EXTERNAL_PREFIX}${asset.name}").then(r => r.default || r);
  return WebAssembly.instantiate(_mod, imports)
}
  ` : js`
import { base64ToUint8Array } from "${UMWASM_HELPERS_ID}";
${autoImports.code};

function _instantiate(imports = _imports) {
  const _data = base64ToUint8Array("${asset.source.toString("base64")}")
  return WebAssembly.instantiate(_data, imports)
}
  `;
  const canTopAwait = opts.lazy !== true && autoImports.resolved;
  if (canTopAwait) {
    return js`
import { getExports } from "${UMWASM_HELPERS_ID}";
${envCode}

const $exports = getExports(await _instantiate());

${asset.exports.map((name) => `export const ${name} = $exports.${name};`).join("\n")}

const defaultExport = () => $exports;
${asset.exports.map((name) => `defaultExport["${name}"] = $exports.${name};`).join("\n")}
export default defaultExport;
    `;
  } else {
    return js`
import { createLazyWasmModule } from "${UMWASM_HELPERS_ID}";
${envCode}

const _mod = createLazyWasmModule(_instantiate);

${asset.exports.map((name) => `export const ${name} = _mod.${name};`).join("\n")}

export default _mod;
    `;
  }
}
function getWasmModuleBinding(asset, opts) {
  return opts.esmImport ? js`
const _mod = ${opts.lazy === true ? "" : `await`} import("${UNWASM_EXTERNAL_PREFIX}${asset.name}").then(r => r.default || r);
export default _mod;
  ` : js`
import { base64ToUint8Array } from "${UMWASM_HELPERS_ID}";
const _data = base64ToUint8Array("${asset.source.toString("base64")}");
const _mod = new WebAssembly.Module(_data);
export default _mod;
  `;
}
function getPluginUtils() {
  return js`
export function debug(...args) {
  console.log('[wasm] [debug]', ...args);
}

export function getExports(input) {
  return input?.instance?.exports || input?.exports || input;
}

export function base64ToUint8Array(str) {
  const data = atob(str);
  const size = data.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes;
}

export function createLazyWasmModule(_instantiator) {
  const _exports = Object.create(null);
  let _loaded;
  let _promise;

  const init = (imports) => {
    if (_loaded) {
      return Promise.resolve(exportsProxy);
    }
    if (_promise) {
      return _promise;
    }
    return _promise = _instantiator(imports)
      .then(r => {
        Object.assign(_exports, getExports(r));
        _loaded = true;
        _promise = undefined;
        return exportsProxy;
      })
      .catch(error => {
        _promise = undefined;
        console.error('[wasm] [error]', error);
        throw error;
      });
  }

  const exportsProxy = new Proxy(_exports, {
    get(_, prop) {
      if (_loaded) {
        return _exports[prop];
      }
      return (...args) => {
        return _loaded
          ? _exports[prop]?.(...args)
          : init().then(() => _exports[prop]?.(...args));
      };
    },
  });


  const lazyProxy = new Proxy(() => {}, {
    get(_, prop) {
      return exportsProxy[prop];
    },
    apply(_, __, args) {
      return init(args[0])
    },
  });

  return lazyProxy;
}
  `;
}
async function getWasmImports(asset, _opts) {
  const importNames = Object.keys(asset.imports || {});
  if (importNames.length === 0) {
    return {
      code: "const _imports = { /* no imports */ }",
      resolved: true
    };
  }
  const pkgJSON = await readPackageJSON(asset.id);
  let resolved = true;
  const imports = [];
  const importsObject = {};
  for (const moduleName of importNames) {
    const importNames2 = asset.imports[moduleName];
    const pkgImport = pkgJSON.imports?.[moduleName] || pkgJSON.imports?.[`#${moduleName}`];
    const importName = "_imports_" + genSafeVariableName(moduleName);
    if (pkgImport) {
      imports.push(genImport(pkgImport, { name: "*", as: importName }));
    } else {
      resolved = false;
    }
    importsObject[moduleName] = Object.fromEntries(
      importNames2.map((name) => [
        name,
        pkgImport ? `${importName}[${genString(name)}]` : `() => { throw new Error(${genString(moduleName + "." + importName)} + " is not provided!")}`
      ])
    );
  }
  const code = `${imports.join("\n")}

const _imports = ${genObjectFromRaw(importsObject)}`;
  return {
    code,
    resolved
  };
}

const WASM_ID_RE = /\.wasm\??.*$/i;
const unplugin = createUnplugin((opts) => {
  const assets = /* @__PURE__ */ Object.create(null);
  const _parseCache = /* @__PURE__ */ Object.create(null);
  function parse(name, source) {
    if (_parseCache[name]) {
      return _parseCache[name];
    }
    const imports = /* @__PURE__ */ Object.create(null);
    const exports = [];
    try {
      const parsed = parseWasm(source, { name });
      for (const mod of parsed.modules) {
        exports.push(...mod.exports.map((e) => e.name));
        for (const imp of mod.imports) {
          if (!imports[imp.module]) {
            imports[imp.module] = [];
          }
          imports[imp.module].push(imp.name);
        }
      }
    } catch (error) {
      console.warn(`[unwasm] Failed to parse WASM module ${name}:`, error);
    }
    _parseCache[name] = {
      imports,
      exports
    };
    return _parseCache[name];
  }
  return {
    name: "unwasm",
    rollup: {
      async resolveId(id, importer) {
        if (id === UMWASM_HELPERS_ID) {
          return id;
        }
        if (id.startsWith(UNWASM_EXTERNAL_PREFIX)) {
          return {
            id,
            external: true
          };
        }
        if (WASM_ID_RE.test(id)) {
          const r = await this.resolve(id, importer, { skipSelf: true });
          if (r?.id && r.id !== id) {
            return {
              id: r.id.startsWith("file://") ? r.id.slice(7) : r.id,
              external: false,
              moduleSideEffects: false
            };
          }
        }
      },
      generateBundle() {
        if (opts.esmImport) {
          for (const asset of Object.values(assets)) {
            this.emitFile({
              type: "asset",
              source: asset.source,
              fileName: asset.name
            });
          }
        }
      }
    },
    async load(id) {
      if (id === UMWASM_HELPERS_ID) {
        return getPluginUtils();
      }
      if (!WASM_ID_RE.test(id)) {
        return;
      }
      const idPath = id.split("?")[0];
      if (!existsSync(idPath)) {
        return;
      }
      this.addWatchFile(idPath);
      const buff = await promises.readFile(idPath);
      return buff.toString("binary");
    },
    async transform(code, id) {
      if (!WASM_ID_RE.test(id)) {
        return;
      }
      const buff = Buffer.from(code, "binary");
      const isModule = id.endsWith("?module");
      const name = `wasm/${basename(id.split("?")[0], ".wasm")}-${sha1(buff)}.wasm`;
      const parsed = isModule ? { imports: [], exports: ["default"] } : parse(name, buff);
      const asset = assets[name] = {
        name,
        id,
        source: buff,
        imports: parsed.imports,
        exports: parsed.exports
      };
      return {
        code: isModule ? await getWasmModuleBinding(asset, opts) : await getWasmESMBinding(asset, opts),
        map: { mappings: "" }
      };
    },
    renderChunk(code, chunk) {
      if (!opts.esmImport) {
        return;
      }
      if (!(chunk.moduleIds.some((id) => WASM_ID_RE.test(id)) || chunk.imports.some((id) => WASM_ID_RE.test(id)))) {
        return;
      }
      const s = new MagicString(code);
      const resolveImport = (id) => {
        if (typeof id !== "string") {
          return;
        }
        const asset = assets[id];
        if (!asset) {
          return;
        }
        const nestedLevel = chunk.fileName.split("/").filter(
          Boolean
          /* handle // */
        ).length - 1;
        const relativeId = (nestedLevel ? "../".repeat(nestedLevel) : "./") + asset.name;
        return {
          relativeId,
          asset
        };
      };
      for (const match of code.matchAll(UNWASM_EXTERNAL_RE)) {
        const resolved = resolveImport(match[2]);
        const index = match.index;
        const len = match[0].length;
        if (!resolved || !index) {
          console.warn(
            `Failed to resolve WASM import: ${JSON.stringify(match[1])}`
          );
          continue;
        }
        s.overwrite(index, index + len, resolved.relativeId);
      }
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap({ includeContent: true })
        };
      }
    }
  };
});
const rollup = unplugin.rollup;
const index = {
  rollup
};

export { index as default, rollup };
