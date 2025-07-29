function genString(input, options = {}) {
  const str = JSON.stringify(input);
  if (!options.singleQuotes) {
    return str;
  }
  return `'${escapeString(str).slice(1, -1)}'`;
}
const NEEDS_ESCAPE_RE = /[\n\r'\\\u2028\u2029]/;
const QUOTE_NEWLINE_RE = /([\n\r'\u2028\u2029])/g;
const BACKSLASH_RE = /\\/g;
function escapeString(id) {
  if (!NEEDS_ESCAPE_RE.test(id)) {
    return id;
  }
  return id.replace(BACKSLASH_RE, "\\\\").replace(QUOTE_NEWLINE_RE, "\\$1");
}
function genSafeVariableName(name) {
  if (reservedNames.has(name)) {
    return `_${name}`;
  }
  return name.replace(/^\d/, (r) => `_${r}`).replace(/\W/g, (r) => "_" + r.charCodeAt(0));
}
const reservedNames = /* @__PURE__ */ new Set([
  "Infinity",
  "NaN",
  "arguments",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield"
]);

function _genStatement(type, specifier, names, options = {}) {
  const specifierString = genString(specifier, options);
  if (!names) {
    return `${type} ${specifierString};`;
  }
  const nameArray = Array.isArray(names);
  const _names = (nameArray ? names : [names]).map((index) => {
    if (typeof index === "string") {
      return { name: index };
    }
    if (index.name === index.as) {
      index = { name: index.name };
    }
    return index;
  });
  const namesString = _names.map((index) => index.as ? `${index.name} as ${index.as}` : index.name).join(", ");
  if (nameArray) {
    return `${type} { ${namesString} } from ${genString(
      specifier,
      options
    )}${_genImportAttributes(type, options)};`;
  }
  return `${type} ${namesString} from ${genString(
    specifier,
    options
  )}${_genImportAttributes(type, options)};`;
}
function _genImportAttributes(type, options) {
  if (type === "import type" || type === "export type") {
    return "";
  }
  if (typeof options.attributes?.type === "string") {
    return ` with { type: ${genString(options.attributes.type)} }`;
  }
  if (typeof options.assert?.type === "string") {
    return ` assert { type: ${genString(options.assert.type)} }`;
  }
  return "";
}

function genImport(specifier, imports, options = {}) {
  return _genStatement("import", specifier, imports, options);
}
function genTypeImport(specifier, imports, options = {}) {
  return _genStatement("import type", specifier, imports, options);
}
function genExport(specifier, exports, options = {}) {
  return _genStatement("export", specifier, exports, options);
}
function genDynamicImport(specifier, options = {}) {
  const commentString = options.comment ? ` /* ${options.comment} */` : "";
  const wrapperString = options.wrapper === false ? "" : "() => ";
  const ineropString = options.interopDefault ? ".then(m => m.default || m)" : "";
  const optionsString = _genDynamicImportAttributes(options);
  return `${wrapperString}import(${genString(
    specifier,
    options
  )}${commentString}${optionsString})${ineropString}`;
}
function _genDynamicImportAttributes(options = {}) {
  if (typeof options.assert?.type === "string") {
    return `, { assert: { type: ${genString(options.assert.type)} } }`;
  }
  if (typeof options.attributes?.type === "string") {
    return `, { with: { type: ${genString(options.attributes.type)} } }`;
  }
  return "";
}

function wrapInDelimiters(lines, indent = "", delimiters = "{}", withComma = true) {
  if (lines.length === 0) {
    return delimiters;
  }
  const [start, end] = delimiters;
  return `${start}
` + lines.join(withComma ? ",\n" : "\n") + `
${indent}${end}`;
}
const VALID_IDENTIFIER_RE = /^[$_]?([A-Z_a-z]\w*|\d)$/;
function genObjectKey(key) {
  return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}

function genObjectFromRaw(object, indent = "", options = {}) {
  return genObjectFromRawEntries(Object.entries(object), indent, options);
}
function genObjectFromValues(obj, indent = "", options = {}) {
  return genObjectFromRaw(obj, indent, { preserveTypes: true, ...options });
}
function genArrayFromRaw(array, indent = "", options = {}) {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    array.map((index) => `${newIdent}${genRawValue(index, newIdent, options)}`),
    indent,
    "[]"
  );
}
function genObjectFromRawEntries(array, indent = "", options = {}) {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    array.map(
      ([key, value]) => `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent, options)}`
    ),
    indent,
    "{}"
  );
}
function genRawValue(value, indent = "", options = {}) {
  if (value === void 0) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent, options);
  }
  if (value && typeof value === "object") {
    return genObjectFromRaw(value, indent, options);
  }
  if (options.preserveTypes && typeof value !== "function") {
    return JSON.stringify(value);
  }
  return value.toString();
}

function genTypeExport(specifier, imports, options = {}) {
  return _genStatement("export type", specifier, imports, options);
}
function genInlineTypeImport(specifier, name = "default", options = {}) {
  return `typeof ${genDynamicImport(specifier, {
    ...options,
    wrapper: false
  })}.${name}`;
}
function genTypeObject(object, indent = "") {
  const newIndent = indent + "  ";
  return wrapInDelimiters(
    Object.entries(object).map(([key, value]) => {
      const [, k = key, optional = ""] = key.match(/^(.*[^?])(\?)?$/) || [];
      if (typeof value === "string") {
        return `${newIndent}${genObjectKey(k)}${optional}: ${value}`;
      }
      return `${newIndent}${genObjectKey(k)}${optional}: ${genTypeObject(
        value,
        newIndent
      )}`;
    }),
    indent,
    "{}",
    false
  );
}
function genInterface(name, contents, options = {}, indent = "") {
  const result = [
    options.export && "export",
    `interface ${name}`,
    options.extends && `extends ${Array.isArray(options.extends) ? options.extends.join(", ") : options.extends}`,
    contents ? genTypeObject(contents, indent) : "{}"
  ].filter(Boolean).join(" ");
  return result;
}
function genAugmentation(specifier, interfaces) {
  return `declare module ${genString(specifier)} ${wrapInDelimiters(
    Object.entries(interfaces || {}).map(
      ([key, entry]) => "  " + (Array.isArray(entry) ? genInterface(key, ...entry) : genInterface(key, entry, {}, "  "))
    )
  )}`;
}

export { escapeString, genArrayFromRaw, genAugmentation, genDynamicImport, genExport, genImport, genInlineTypeImport, genInterface, genObjectFromRaw, genObjectFromRawEntries, genObjectFromValues, genObjectKey, genSafeVariableName, genString, genTypeExport, genTypeImport, genTypeObject, wrapInDelimiters };
