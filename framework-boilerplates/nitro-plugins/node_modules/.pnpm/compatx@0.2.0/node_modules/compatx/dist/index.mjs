const platforms = [
  "aws",
  "azure",
  "cloudflare",
  "deno",
  "firebase",
  "netlify",
  "vercel"
];

function resolveCompatibilityDates(input, defaults) {
  const dates = {
    default: ""
  };
  const _defaults = typeof defaults === "string" ? { default: defaults } : defaults || {};
  for (const [key, value] of Object.entries(_defaults)) {
    if (value) {
      dates[key] = formatDate(value);
    }
  }
  const _input = typeof input === "string" ? { default: input } : input || {};
  for (const [key, value] of Object.entries(_input)) {
    if (value) {
      dates[key] = formatDate(value);
    }
  }
  dates.default = formatDate(dates.default || "") || Object.values(dates).sort().pop() || "";
  return dates;
}
function resolveCompatibilityDatesFromEnv(overridesInput) {
  const defaults = {
    default: process.env.COMPATIBILITY_DATE ? formatDate(process.env.COMPATIBILITY_DATE) : void 0
  };
  for (const platform of platforms) {
    const envName = `COMPATIBILITY_DATE_${platform.toUpperCase()}`;
    const env = process.env[envName];
    if (env) {
      defaults[platform] = formatDate(env);
    }
  }
  return resolveCompatibilityDates(overridesInput, defaults);
}
function formatCompatibilityDate(input) {
  const dates = resolveCompatibilityDates(input);
  const entries = Object.entries(dates);
  if (entries.length === 0) {
    return "-";
  }
  return [
    `${dates["default"]}`,
    ...Object.entries(dates).filter(
      ([key, value]) => key !== "default" && value && value !== dates["default"]
    ).map(([key, value]) => `${key}: ${value}`)
  ].join(", ");
}
function formatDate(date) {
  const d = normalizeDate(date);
  if (Number.isNaN(d.getDate())) {
    return "";
  }
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function normalizeDate(date) {
  if (date instanceof Date) {
    return date;
  }
  if (date === "latest") {
    return /* @__PURE__ */ new Date();
  }
  return new Date(date);
}

function getCompatibilityUpdates(allUpdates, compatibilityDate) {
  const _date = resolveCompatibilityDates(compatibilityDate);
  return allUpdates.filter((change) => {
    const _platformDate = _date[change.platform] || _date.default;
    if (!_platformDate) {
      return false;
    }
    if (change.from && _platformDate < change.from) {
      return false;
    }
    if (change.until && _platformDate > change.until) {
      return false;
    }
    return true;
  });
}
function getCompatibilityChanges(allUpdates, compatibilityDate1, compatibilityDate2) {
  const updates1 = getCompatibilityUpdates(allUpdates, compatibilityDate1);
  const updates2 = getCompatibilityUpdates(allUpdates, compatibilityDate2);
  const added = updates2.filter((update) => !updates1.includes(update));
  const removed = updates1.filter((update) => !updates2.includes(update));
  return {
    added,
    removed
  };
}

export { formatCompatibilityDate, formatDate, getCompatibilityChanges, getCompatibilityUpdates, platforms, resolveCompatibilityDates, resolveCompatibilityDatesFromEnv };
