export { b as builtinPresets, c as createUnimport, e as dedupeDtsExports, n as normalizeScanDirs, r as resolveBuiltinPresets, a as resolvePreset, d as scanDirExports, f as scanExports, s as scanFilesFromDir, v as version } from './shared/unimport.CM4UWSB8.mjs';
export { o as addImportToCode, f as dedupeImports, d as defineUnimportPreset, e as excludeRE, n as getMagicString, l as getString, i as importAsRE, m as matchRE, p as normalizeImports, r as resolveIdAbsolute, s as separatorRE, c as stringifyImports, b as stripCommentsAndStrings, g as stripFileExtension, t as toExports, q as toImports, j as toTypeDeclarationFile, h as toTypeDeclarationItems, k as toTypeReExports, a as vueTemplateAddon } from './shared/unimport.BATK_RmH.mjs';
import 'mlly';
import 'node:fs';
import 'node:fs/promises';
import 'node:process';
import 'node:url';
import 'pathe';
import 'picomatch';
import 'scule';
import 'tinyglobby';
import 'node:os';
import 'pkg-types';
import 'local-pkg';
import 'node:path';
import 'magic-string';
import 'strip-literal';

async function installGlobalAutoImports(imports, options = {}) {
  const {
    globalObject = globalThis,
    overrides = false
  } = options;
  imports = Array.isArray(imports) ? imports : await imports.getImports();
  await Promise.all(
    imports.map(async (i) => {
      if (i.disabled || i.type)
        return;
      const as = i.as || i.name;
      if (overrides || !(as in globalObject)) {
        const module = await import(i.from);
        globalObject[as] = module[i.name];
      }
    })
  );
  return globalObject;
}

export { installGlobalAutoImports };
