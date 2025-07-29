import {
  resolveCompatibilityDatesFromEnv,
  formatCompatibilityDate
} from "compatx";
import { kebabCase } from "scule";
import { provider } from "std-env";
import allPresets from "./_all.gen.mjs";
const _stdProviderMap = {
  aws_amplify: "aws",
  azure_static: "azure",
  cloudflare_pages: "cloudflare"
};
export async function resolvePreset(name, opts = {}) {
  if (name === ".") {
    return void 0;
  }
  const _name = kebabCase(name) || provider;
  const _compatDates = opts.compatibilityDate ? resolveCompatibilityDatesFromEnv(opts.compatibilityDate) : false;
  const matches = allPresets.filter((preset2) => {
    const names = [preset2._meta.name, preset2._meta.stdName, ...preset2._meta.aliases || []].filter(Boolean);
    if (!names.includes(_name)) {
      return false;
    }
    if (opts.dev && !preset2._meta.dev || !opts.dev && preset2._meta.dev) {
      return false;
    }
    if (_compatDates) {
      const _date = _compatDates[_stdProviderMap[preset2._meta.stdName]] || _compatDates[preset2._meta.stdName] || _compatDates[preset2._meta.name] || _compatDates.default;
      if (_date && preset2._meta.compatibilityDate && new Date(preset2._meta.compatibilityDate) > new Date(_date)) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    const aDate = new Date(a._meta.compatibilityDate || 0);
    const bDate = new Date(b._meta.compatibilityDate || 0);
    return bDate > aDate ? 1 : -1;
  });
  const preset = matches.find(
    (p) => (p._meta.static || false) === (opts?.static || false)
  ) || matches[0];
  if (typeof preset === "function") {
    return preset();
  }
  if (!name && !preset) {
    return opts?.static ? resolvePreset("static", opts) : resolvePreset("node-server", opts);
  }
  if (name && !preset) {
    const options = allPresets.filter((p) => p._meta.name === name || p._meta.stdName === name || p._meta.aliases?.includes(name)).sort((a, b) => (a._meta.compatibilityDate || 0) > (b._meta.compatibilityDate || 0) ? 1 : -1);
    if (options.length > 0) {
      let msg = `Preset "${name}" cannot be resolved with current compatibilityDate: ${formatCompatibilityDate(_compatDates || "")}.

`;
      for (const option of options) {
        msg += `
- ${option._meta.name} (requires compatibilityDate >= ${option._meta.compatibilityDate})`;
      }
      const err = new Error(msg);
      Error.captureStackTrace?.(err, resolvePreset);
      throw err;
    }
  }
  return preset;
}
