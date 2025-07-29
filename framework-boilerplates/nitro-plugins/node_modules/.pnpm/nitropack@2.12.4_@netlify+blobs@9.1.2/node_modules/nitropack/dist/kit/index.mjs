import { fileURLToPath } from 'node:url';
import fsp from 'node:fs/promises';
import consola, { consola as consola$1 } from 'consola';
import { relative, resolve, dirname } from 'pathe';
import { colors } from 'consola/utils';
import { getProperty } from 'dot-prop';

function defineNitroPreset(preset, meta) {
  if (meta?.url && typeof preset !== "function" && preset.entry && preset.entry.startsWith(".")) {
    preset.entry = fileURLToPath(new URL(preset.entry, meta.url));
  }
  return { ...preset, _meta: meta };
}

function defineNitroModule(def) {
  if (typeof def?.setup !== "function") {
    def.setup = () => {
      throw new TypeError("NitroModule must implement a `setup` method!");
    };
  }
  return def;
}

function prettyPath(p, highlight = true) {
  p = relative(process.cwd(), p);
  return highlight ? colors.cyan(p) : p;
}
function resolveNitroPath(path, nitroOptions, base) {
  if (typeof path !== "string") {
    throw new TypeError("Invalid path: " + path);
  }
  path = _compilePathTemplate(path)(nitroOptions);
  for (const base2 in nitroOptions.alias) {
    if (path.startsWith(base2)) {
      path = nitroOptions.alias[base2] + path.slice(base2.length);
    }
  }
  return resolve(base || nitroOptions.srcDir, path);
}
function _compilePathTemplate(contents) {
  return (params) => contents.replace(/{{ ?([\w.]+) ?}}/g, (_, match) => {
    const val = getProperty(params, match);
    if (!val) {
      consola.warn(
        `cannot resolve template param '${match}' in ${contents.slice(0, 20)}`
      );
    }
    return val || `${match}`;
  });
}

async function writeFile(file, contents, log = false) {
  await fsp.mkdir(dirname(file), { recursive: true });
  await fsp.writeFile(
    file,
    contents,
    typeof contents === "string" ? "utf8" : void 0
  );
  if (log) {
    consola$1.info("Generated", prettyPath(file));
  }
}
async function isDirectory(path) {
  try {
    return (await fsp.stat(path)).isDirectory();
  } catch {
    return false;
  }
}

export { defineNitroModule, defineNitroPreset, isDirectory, prettyPath, resolveNitroPath, writeFile };
