import { defu } from 'defu';
import { createJiti } from 'jiti';
import { r as resolveSchema } from '../shared/untyped.BTwOq8Jl.mjs';
import babelPluginUntyped from './babel.mjs';
import '../shared/untyped.Br_uXjZG.mjs';
import 'scule';

async function loadSchema(entryPath, options = {}) {
  const jiti = createJiti(
    options.cwd || process.cwd(),
    defu(options.jiti, {
      interopDefault: true,
      transformOptions: {
        babel: {
          plugins: [[babelPluginUntyped, { experimentalFunctions: true }]]
        }
      }
    })
  );
  let rawSchema = await jiti.import(entryPath);
  const rawSchemaKeys = Object.keys(rawSchema);
  if (rawSchemaKeys.length === 1 && rawSchemaKeys[0] === "default") {
    rawSchema = rawSchema.default;
  }
  const schema = await resolveSchema(rawSchema, options.defaults, {
    ignoreDefaults: options.ignoreDefaults
  });
  return schema;
}

export { loadSchema };
