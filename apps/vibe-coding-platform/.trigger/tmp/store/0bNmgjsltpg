import {
  BuildManifest,
  StandardResourceCatalog,
  TracingSDK,
  ZodFirstPartyTypeKind,
  ZodSchemaParsedError,
  indexerToWorkerMessages,
  normalizeImportPath,
  o,
  require_source_map_support,
  resourceCatalog,
  sendMessageInCatalog
} from "../../../../../../../../chunk-NNIGOCOK.mjs";
import "../../../../../../../../chunk-4DSI7GE4.mjs";
import "../../../../../../../../chunk-ZOPV4KI4.mjs";
import {
  __commonJS,
  __export,
  __name,
  __toESM,
  init_esm
} from "../../../../../../../../chunk-3R76H35D.mjs";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/common.js
var require_common = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/common.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    var commonConverter = /* @__PURE__ */ __name(function(description, converters) {
      var _a, _b;
      var jsonSchema = {};
      jsonSchema.type = description.type;
      if (description.nullable) {
        jsonSchema.type = [jsonSchema.type, "null"];
      }
      if (((_a = description.oneOf) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        jsonSchema.enum = description.oneOf;
      }
      if (((_b = description.notOneOf) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        jsonSchema.not = {
          enum: description.notOneOf
        };
      }
      if (description.label) {
        jsonSchema.title = description.label;
      }
      if (description.default !== void 0) {
        jsonSchema.default = description.default;
      }
      return jsonSchema;
    }, "commonConverter");
    exports.default = commonConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/string.js
var require_string = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/string.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uuidRegExPattern = void 0;
    var common_1 = __importDefault(require_common());
    exports.uuidRegExPattern = "^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$";
    var stringConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      description.tests.forEach(function(test) {
        var _a, _b, _c, _d;
        switch (test.name) {
          case "length":
            if (((_a = test.params) === null || _a === void 0 ? void 0 : _a.length) !== void 0) {
              jsonSchema.minLength = Number(test.params.length);
              jsonSchema.maxLength = Number(test.params.length);
            }
            break;
          case "min":
            if (((_b = test.params) === null || _b === void 0 ? void 0 : _b.min) !== void 0) {
              jsonSchema.minLength = Number(test.params.min);
            }
            break;
          case "max":
            if (((_c = test.params) === null || _c === void 0 ? void 0 : _c.max) !== void 0) {
              jsonSchema.maxLength = Number(test.params.max);
            }
            break;
          case "matches":
            if ((_d = test.params) === null || _d === void 0 ? void 0 : _d.regex) {
              jsonSchema.pattern = test.params.regex.toString().replace(/^\/(.*)\/[gimusy]*$/, "$1");
            }
            break;
          case "email":
            jsonSchema.format = "email";
            break;
          case "url":
            jsonSchema.format = "uri";
            break;
          case "uuid":
            jsonSchema.format = "uuid";
            jsonSchema.pattern = exports.uuidRegExPattern;
            break;
        }
      });
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "stringConverter");
    exports.default = stringConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/number.js
var require_number = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/number.js"(exports) {
    "use strict";
    init_esm();
    var __spreadArrays = exports && exports.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var numberConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      description.tests.forEach(function(test) {
        var _a, _b, _c, _d;
        switch (test.name) {
          case "min":
            if (((_a = test.params) === null || _a === void 0 ? void 0 : _a.min) !== void 0) {
              jsonSchema.minimum = Number(test.params.min);
            }
            if (((_b = test.params) === null || _b === void 0 ? void 0 : _b.more) !== void 0) {
              jsonSchema.exclusiveMinimum = Number(test.params.more);
            }
            break;
          case "max":
            if (((_c = test.params) === null || _c === void 0 ? void 0 : _c.max) !== void 0) {
              jsonSchema.maximum = Number(test.params.max);
            }
            if (((_d = test.params) === null || _d === void 0 ? void 0 : _d.less) !== void 0) {
              jsonSchema.exclusiveMaximum = Number(test.params.less);
            }
            break;
          case "integer":
            if (jsonSchema.type === "number") {
              jsonSchema.type = "integer";
            } else {
              jsonSchema.type = __spreadArrays(jsonSchema.type, ["integer"]).filter(function(type) {
                return type !== "number";
              });
            }
        }
      });
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "numberConverter");
    exports.default = numberConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/boolean.js
var require_boolean = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/boolean.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var booleanConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "booleanConverter");
    exports.default = booleanConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/date.js
var require_date = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/date.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var dateConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      jsonSchema.type = "string";
      jsonSchema.format = "date-time";
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "dateConverter");
    exports.default = dateConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/array.js
var require_array = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/array.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var arrayConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      var innerType = description.innerType;
      if (innerType) {
        var converter = converters[innerType.type];
        jsonSchema.items = converter(innerType, converters);
      }
      description.tests.forEach(function(test) {
        var _a, _b, _c;
        switch (test.name) {
          case "length":
            if (((_a = test.params) === null || _a === void 0 ? void 0 : _a.length) !== void 0) {
              jsonSchema.minItems = jsonSchema.maxItems = Number(test.params.length);
            }
            break;
          case "min":
            if (((_b = test.params) === null || _b === void 0 ? void 0 : _b.min) !== void 0) {
              jsonSchema.minItems = Number(test.params.min);
            }
            break;
          case "max":
            if (((_c = test.params) === null || _c === void 0 ? void 0 : _c.max) !== void 0) {
              jsonSchema.maxItems = Number(test.params.max);
            }
            break;
        }
      });
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "arrayConverter");
    exports.default = arrayConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/object.js
var require_object = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/object.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var objectConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      var properties = {};
      var required = [];
      Object.keys(description.fields).forEach(function(fieldName) {
        var fieldDescription = description.fields[fieldName];
        var converter = converters[fieldDescription.type];
        properties[fieldName] = converter(fieldDescription, converters);
        if (!fieldDescription.optional) {
          required.push(fieldName);
        }
      });
      if (Object.keys(properties).length > 0) {
        jsonSchema.properties = properties;
      }
      if (Object.keys(required).length > 0) {
        jsonSchema.required = required;
      }
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "objectConverter");
    exports.default = objectConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/tuple.js
var require_tuple = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/tuple.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var tupleConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      jsonSchema.type = "array";
      jsonSchema.items = description.innerType.map(function(description2) {
        var converter = converters[description2.type];
        return converter(description2, converters);
      });
      jsonSchema.minItems = jsonSchema.items.length;
      jsonSchema.maxItems = jsonSchema.items.length;
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "tupleConverter");
    exports.default = tupleConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/mixed.js
var require_mixed = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/mixed.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var getType = /* @__PURE__ */ __name(function(item) {
      switch (typeof item) {
        case "string":
          return "string";
        case "number":
          return "number";
        case "boolean":
          return "boolean";
        case "object":
          if (Array.isArray(item)) {
            return "array";
          } else if (item === null) {
            return "null";
          } else if (item instanceof Date) {
            return "string";
          } else {
            return "object";
          }
        default:
          return "null";
      }
    }, "getType");
    var mixedConverter = /* @__PURE__ */ __name(function(description, converters) {
      var _a;
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      var types = Array.isArray(description.type) ? description.type : [description.type];
      types = types.filter(function(type) {
        return type !== "mixed";
      });
      if (((_a = description.oneOf) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        description.oneOf.forEach(function(item) {
          types.push(getType(item));
        });
      }
      if (description.default !== void 0) {
        types.push(getType(description.default));
      }
      types = types.filter(function(type, index, self) {
        return self.indexOf(type) === index;
      });
      jsonSchema.type = types;
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "mixedConverter");
    exports.default = mixedConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/lazy.js
var require_lazy = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/lazy.js"(exports) {
    "use strict";
    init_esm();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = __importDefault(require_common());
    var lazyConverter = /* @__PURE__ */ __name(function(description, converters) {
      var jsonSchema = common_1.default(description, converters);
      var meta = description.meta || {};
      return Object.assign(jsonSchema, meta.jsonSchema);
    }, "lazyConverter");
    exports.default = lazyConverter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/index.js
var require_converters = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/converters/index.js"(exports) {
    "use strict";
    init_esm();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertSchema = void 0;
    var string_1 = __importDefault(require_string());
    var number_1 = __importDefault(require_number());
    var boolean_1 = __importDefault(require_boolean());
    var date_1 = __importDefault(require_date());
    var array_1 = __importDefault(require_array());
    var object_1 = __importDefault(require_object());
    var tuple_1 = __importDefault(require_tuple());
    var mixed_1 = __importDefault(require_mixed());
    var lazy_1 = __importDefault(require_lazy());
    function convertSchema2(yupSchema, options) {
      var _a = options || {}, converters = _a.converters, resolveOptions = __rest(_a, ["converters"]);
      var allConverters = __assign({ string: string_1.default, number: number_1.default, boolean: boolean_1.default, date: date_1.default, array: array_1.default, object: object_1.default, tuple: tuple_1.default, mixed: mixed_1.default, lazy: lazy_1.default }, converters);
      var description = yupSchema.describe(resolveOptions);
      var converter = allConverters[description.type];
      return converter(description, allConverters);
    }
    __name(convertSchema2, "convertSchema");
    exports.convertSchema = convertSchema2;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/methods/index.js
var require_methods = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/methods/index.js"(exports) {
    "use strict";
    init_esm();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSchema = void 0;
    function addMethod(yup, name) {
      yup.addMethod(yup.Schema, name, function(value) {
        var _a;
        var meta = this.describe().meta || {};
        return this.meta(__assign(__assign({}, meta), { jsonSchema: __assign(__assign({}, meta.jsonSchema), (_a = {}, _a[name] = value, _a)) }));
      });
    }
    __name(addMethod, "addMethod");
    function extendSchema(yup) {
      addMethod(yup, "example");
      addMethod(yup, "examples");
      addMethod(yup, "description");
      yup.addMethod(yup.Schema, "jsonSchema", function(callback) {
        var meta = this.describe().meta || {};
        return this.meta(__assign(__assign({}, meta), { jsonSchema: callback(meta.jsonSchema || {}) }));
      });
    }
    __name(extendSchema, "extendSchema");
    exports.extendSchema = extendSchema;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/index.js
var require_dist = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@sodaru/yup-to-json-schema/dist/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSchema = exports.convertSchema = void 0;
    var converters_1 = require_converters();
    Object.defineProperty(exports, "convertSchema", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return converters_1.convertSchema;
    }, "get") });
    var methods_1 = require_methods();
    Object.defineProperty(exports, "extendSchema", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return methods_1.extendSchema;
    }, "get") });
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/entryPoints/dev-index-worker.js
init_esm();
var import_source_map_support = __toESM(require_source_map_support(), 1);
import { readFile } from "node:fs/promises";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/indexing/registerResources.js
init_esm();
async function registerResources(buildManifest2) {
  const importErrors2 = [];
  const timings2 = {};
  for (const file of buildManifest2.files) {
    resourceCatalog.setCurrentFileContext(file.entry, file.out);
    const start = performance.now();
    const [error2, _] = await tryImport(file.out);
    const end = performance.now();
    timings2[file.entry] = end - start;
    resourceCatalog.clearCurrentFileContext();
    if (error2) {
      if (typeof error2 === "string") {
        importErrors2.push({
          file: file.entry,
          message: error2
        });
      } else {
        importErrors2.push({
          file: file.entry,
          message: error2.message,
          stack: error2.stack,
          name: error2.name
        });
      }
      continue;
    }
  }
  return { importErrors: importErrors2, timings: timings2 };
}
__name(registerResources, "registerResources");
async function tryImport(path) {
  try {
    const module = await import(normalizeImportPath(path));
    return [null, module];
  } catch (error2) {
    return [error2, null];
  }
}
__name(tryImport, "tryImport");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/extensions.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/resolvedConfig.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/runtime.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/flags.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/runtime.js
function detectRuntimeVersion() {
  try {
    const isBun = typeof process.versions.bun === "string";
    if (isBun) {
      return process.versions.bun;
    }
    return process.versions.node;
  } catch {
    return void 0;
  }
}
__name(detectRuntimeVersion, "detectRuntimeVersion");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/dist/esm/v3/build/externals.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/schema-to-json/dist/esm/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/Options.js
init_esm();
var ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
var defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: true,
  rejectedAdditionalProperties: false,
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  markdownDescription: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref",
  openAiAnyTypeName: "OpenAiAnyType"
};
var getDefaultOptions = /* @__PURE__ */ __name((options) => typeof options === "string" ? {
  ...defaultOptions,
  name: options
} : {
  ...defaultOptions,
  ...options
}, "getDefaultOptions");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/Refs.js
init_esm();
var getRefs = /* @__PURE__ */ __name((options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    flags: { hasReferencedOpenAiAnyType: false },
    currentPath,
    propertyPath: void 0,
    seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
      def._def,
      {
        def: def._def,
        path: [..._options.basePath, _options.definitionPath, name],
        // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
        jsonSchema: void 0
      }
    ]))
  };
}, "getRefs");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/errorMessages.js
init_esm();
function addErrorMessage(res, key, errorMessage, refs) {
  if (!refs?.errorMessages)
    return;
  if (errorMessage) {
    res.errorMessage = {
      ...res.errorMessage,
      [key]: errorMessage
    };
  }
}
__name(addErrorMessage, "addErrorMessage");
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
  res[key] = value;
  addErrorMessage(res, key, errorMessage, refs);
}
__name(setResponseValueAndErrors, "setResponseValueAndErrors");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/getRelativePath.js
init_esm();
var getRelativePath = /* @__PURE__ */ __name((pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i])
      break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
}, "getRelativePath");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parseDef.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/selectParser.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/any.js
init_esm();
function parseAnyDef(refs) {
  if (refs.target !== "openAi") {
    return {};
  }
  const anyDefinitionPath = [
    ...refs.basePath,
    refs.definitionPath,
    refs.openAiAnyTypeName
  ];
  refs.flags.hasReferencedOpenAiAnyType = true;
  return {
    $ref: refs.$refStrategy === "relative" ? getRelativePath(anyDefinitionPath, refs.currentPath) : anyDefinitionPath.join("/")
  };
}
__name(parseAnyDef, "parseAnyDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/array.js
init_esm();
function parseArrayDef(def, refs) {
  const res = {
    type: "array"
  };
  if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
  }
  if (def.maxLength) {
    setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
  }
  if (def.exactLength) {
    setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
    setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
  }
  return res;
}
__name(parseArrayDef, "parseArrayDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
init_esm();
function parseBigintDef(def, refs) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
__name(parseBigintDef, "parseBigintDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
init_esm();
function parseBooleanDef() {
  return {
    type: "boolean"
  };
}
__name(parseBooleanDef, "parseBooleanDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
init_esm();
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}
__name(parseBrandedDef, "parseBrandedDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
init_esm();
var parseCatchDef = /* @__PURE__ */ __name((def, refs) => {
  return parseDef(def.innerType._def, refs);
}, "parseCatchDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/date.js
init_esm();
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy ?? refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def, refs);
  }
}
__name(parseDateDef, "parseDateDef");
var integerDateParser = /* @__PURE__ */ __name((def, refs) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  if (refs.target === "openApi3") {
    return res;
  }
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        setResponseValueAndErrors(
          res,
          "minimum",
          check.value,
          // This is in milliseconds
          check.message,
          refs
        );
        break;
      case "max":
        setResponseValueAndErrors(
          res,
          "maximum",
          check.value,
          // This is in milliseconds
          check.message,
          refs
        );
        break;
    }
  }
  return res;
}, "integerDateParser");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/default.js
init_esm();
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}
__name(parseDefaultDef, "parseDefaultDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
init_esm();
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef(refs);
}
__name(parseEffectsDef, "parseEffectsDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
init_esm();
function parseEnumDef(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}
__name(parseEnumDef, "parseEnumDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
init_esm();
var isJsonSchema7AllOfType = /* @__PURE__ */ __name((type) => {
  if ("type" in type && type.type === "string")
    return false;
  return "allOf" in type;
}, "isJsonSchema7AllOfType");
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
      if (schema.unevaluatedProperties === void 0) {
        unevaluatedProperties = void 0;
      }
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      } else {
        unevaluatedProperties = void 0;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? {
    allOf: mergedAllOf,
    ...unevaluatedProperties
  } : void 0;
}
__name(parseIntersectionDef, "parseIntersectionDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
init_esm();
function parseLiteralDef(def, refs) {
  const parsedType2 = typeof def.value;
  if (parsedType2 !== "bigint" && parsedType2 !== "number" && parsedType2 !== "boolean" && parsedType2 !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  if (refs.target === "openApi3") {
    return {
      type: parsedType2 === "bigint" ? "integer" : parsedType2,
      enum: [def.value]
    };
  }
  return {
    type: parsedType2 === "bigint" ? "integer" : parsedType2,
    const: def.value
  };
}
__name(parseLiteralDef, "parseLiteralDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/map.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/record.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/string.js
init_esm();
var emojiRegex = void 0;
var zodPatterns = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: /* @__PURE__ */ __name(() => {
    if (emojiRegex === void 0) {
      emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
    }
    return emojiRegex;
  }, "emoji"),
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          break;
        case "max":
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
          break;
        case "endsWith":
          addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "includes": {
          addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern(res, zodPatterns.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern(res, zodPatterns.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
          /* @__PURE__ */ ((_) => {
          })(check);
      }
    }
  }
  return res;
}
__name(parseStringDef, "parseStringDef");
function escapeLiteralCheckValue(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
__name(escapeLiteralCheckValue, "escapeLiteralCheckValue");
var ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
__name(escapeNonAlphaNumeric, "escapeNonAlphaNumeric");
function addFormat(schema, value, message, refs) {
  if (schema.format || schema.anyOf?.some((x) => x.format)) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format,
        ...schema.errorMessage && refs.errorMessages && {
          errorMessage: { format: schema.errorMessage.format }
        }
      });
      delete schema.format;
      if (schema.errorMessage) {
        delete schema.errorMessage.format;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    setResponseValueAndErrors(schema, "format", value, message, refs);
  }
}
__name(addFormat, "addFormat");
function addPattern(schema, regex, message, refs) {
  if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern,
        ...schema.errorMessage && refs.errorMessages && {
          errorMessage: { pattern: schema.errorMessage.pattern }
        }
      });
      delete schema.pattern;
      if (schema.errorMessage) {
        delete schema.errorMessage.pattern;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
  }
}
__name(addPattern, "addPattern");
function stringifyRegExpWithFlags(regex, refs) {
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    m: regex.flags.includes("m"),
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  try {
    new RegExp(pattern);
  } catch {
    console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
    return regex.source;
  }
  return pattern;
}
__name(stringifyRegExpWithFlags, "stringifyRegExpWithFlags");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/record.js
function parseRecordDef(def, refs) {
  if (refs.target === "openAi") {
    console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
  }
  if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      type: "object",
      required: def.keyType._def.values,
      properties: def.keyType._def.values.reduce((acc, key) => ({
        ...acc,
        [key]: parseDef(def.valueType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "properties", key]
        }) ?? parseAnyDef(refs)
      }), {}),
      additionalProperties: refs.rejectedAdditionalProperties
    };
  }
  const schema = {
    type: "object",
    additionalProperties: parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? refs.allowedAdditionalProperties
  };
  if (refs.target === "openApi3") {
    return schema;
  }
  if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
    const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
    const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}
__name(parseRecordDef, "parseRecordDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/map.js
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys6 = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || parseAnyDef(refs);
  const values3 = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || parseAnyDef(refs);
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys6, values3],
      minItems: 2,
      maxItems: 2
    }
  };
}
__name(parseMapDef, "parseMapDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
init_esm();
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(new Set(actualValues.map((values3) => typeof values3)));
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}
__name(parseNativeEnumDef, "parseNativeEnumDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/never.js
init_esm();
function parseNeverDef(refs) {
  return refs.target === "openAi" ? void 0 : {
    not: parseAnyDef({
      ...refs,
      currentPath: [...refs.currentPath, "not"]
    })
  };
}
__name(parseNeverDef, "parseNeverDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/null.js
init_esm();
function parseNullDef(refs) {
  return refs.target === "openApi3" ? {
    enum: ["null"],
    nullable: true
  } : {
    type: "null"
  };
}
__name(parseNullDef, "parseNullDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/union.js
init_esm();
var primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  if (refs.target === "openApi3")
    return asAnyOf(def, refs);
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce((acc, x) => {
      const type = typeof x._def.value;
      switch (type) {
        case "string":
        case "number":
        case "boolean":
          return [...acc, type];
        case "bigint":
          return [...acc, "integer"];
        case "object":
          if (x._def.value === null)
            return [...acc, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return acc;
      }
    }, []);
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce((acc, x) => {
          return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
        }, [])
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce((acc, x) => [
        ...acc,
        ...x._def.values.filter((x2) => !acc.includes(x2))
      ], [])
    };
  }
  return asAnyOf(def, refs);
}
__name(parseUnionDef, "parseUnionDef");
var asAnyOf = /* @__PURE__ */ __name((def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", `${i}`]
  })).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
  return anyOf.length ? { anyOf } : void 0;
}, "asAnyOf");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    if (refs.target === "openApi3") {
      return {
        type: primitiveMappings[def.innerType._def.typeName],
        nullable: true
      };
    }
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  if (refs.target === "openApi3") {
    const base2 = parseDef(def.innerType._def, {
      ...refs,
      currentPath: [...refs.currentPath]
    });
    if (base2 && "$ref" in base2)
      return { allOf: [base2], nullable: true };
    return base2 && { ...base2, nullable: true };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}
__name(parseNullableDef, "parseNullableDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/number.js
init_esm();
function parseNumberDef(def, refs) {
  const res = {
    type: "number"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        addErrorMessage(res, "type", check.message, refs);
        break;
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
__name(parseNumberDef, "parseNumberDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/object.js
init_esm();
function parseObjectDef(def, refs) {
  const forceOptionalIntoNullable = refs.target === "openAi";
  const result = {
    type: "object",
    properties: {}
  };
  const required = [];
  const shape = def.shape();
  for (const propName in shape) {
    let propDef = shape[propName];
    if (propDef === void 0 || propDef._def === void 0) {
      continue;
    }
    let propOptional = safeIsOptional(propDef);
    if (propOptional && forceOptionalIntoNullable) {
      if (propDef._def.typeName === "ZodOptional") {
        propDef = propDef._def.innerType;
      }
      if (!propDef.isNullable()) {
        propDef = propDef.nullable();
      }
      propOptional = false;
    }
    const parsedDef = parseDef(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    });
    if (parsedDef === void 0) {
      continue;
    }
    result.properties[propName] = parsedDef;
    if (!propOptional) {
      required.push(propName);
    }
  }
  if (required.length) {
    result.required = required;
  }
  const additionalProperties = decideAdditionalProperties(def, refs);
  if (additionalProperties !== void 0) {
    result.additionalProperties = additionalProperties;
  }
  return result;
}
__name(parseObjectDef, "parseObjectDef");
function decideAdditionalProperties(def, refs) {
  if (def.catchall._def.typeName !== "ZodNever") {
    return parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    });
  }
  switch (def.unknownKeys) {
    case "passthrough":
      return refs.allowedAdditionalProperties;
    case "strict":
      return refs.rejectedAdditionalProperties;
    case "strip":
      return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
  }
}
__name(decideAdditionalProperties, "decideAdditionalProperties");
function safeIsOptional(schema) {
  try {
    return schema.isOptional();
  } catch {
    return true;
  }
}
__name(safeIsOptional, "safeIsOptional");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
init_esm();
var parseOptionalDef = /* @__PURE__ */ __name((def, refs) => {
  if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? {
    anyOf: [
      {
        not: parseAnyDef(refs)
      },
      innerSchema
    ]
  } : parseAnyDef(refs);
}, "parseOptionalDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js
init_esm();
var parsePipelineDef = /* @__PURE__ */ __name((def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const a = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
}, "parsePipelineDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
init_esm();
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}
__name(parsePromiseDef, "parsePromiseDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/set.js
init_esm();
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
  }
  if (def.maxSize) {
    setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
  }
  return schema;
}
__name(parseSetDef, "parseSetDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
init_esm();
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
    };
  }
}
__name(parseTupleDef, "parseTupleDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
init_esm();
function parseUndefinedDef(refs) {
  return {
    not: parseAnyDef(refs)
  };
}
__name(parseUndefinedDef, "parseUndefinedDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
init_esm();
function parseUnknownDef(refs) {
  return parseAnyDef(refs);
}
__name(parseUnknownDef, "parseUnknownDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
init_esm();
var parseReadonlyDef = /* @__PURE__ */ __name((def, refs) => {
  return parseDef(def.innerType._def, refs);
}, "parseReadonlyDef");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/selectParser.js
var selectParser = /* @__PURE__ */ __name((def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef(refs);
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return () => def.getter()._def;
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef(refs);
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef(refs);
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef(refs);
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)(typeName);
  }
}, "selectParser");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parseDef.js
function parseDef(def, refs, forceResolution = false) {
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
  const jsonSchema = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
  if (jsonSchema) {
    addMeta(def, refs, jsonSchema);
  }
  if (refs.postProcess) {
    const postProcessResult = refs.postProcess(jsonSchema, def, refs);
    newItem.jsonSchema = jsonSchema;
    return postProcessResult;
  }
  newItem.jsonSchema = jsonSchema;
  return jsonSchema;
}
__name(parseDef, "parseDef");
var get$ref = /* @__PURE__ */ __name((item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
        return parseAnyDef(refs);
      }
      return refs.$refStrategy === "seen" ? parseAnyDef(refs) : void 0;
    }
  }
}, "get$ref");
var addMeta = /* @__PURE__ */ __name((def, refs, jsonSchema) => {
  if (def.description) {
    jsonSchema.description = def.description;
    if (refs.markdownDescription) {
      jsonSchema.markdownDescription = def.description;
    }
  }
  return jsonSchema;
}, "addMeta");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/parseTypes.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js
init_esm();
var zodToJsonSchema = /* @__PURE__ */ __name((schema, options) => {
  const refs = getRefs(options);
  let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name2, schema2]) => ({
    ...acc,
    [name2]: parseDef(schema2._def, {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name2]
    }, true) ?? parseAnyDef(refs)
  }), {}) : void 0;
  const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
  const main = parseDef(schema._def, name === void 0 ? refs : {
    ...refs,
    currentPath: [...refs.basePath, refs.definitionPath, name]
  }, false) ?? parseAnyDef(refs);
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  if (refs.flags.hasReferencedOpenAiAnyType) {
    if (!definitions) {
      definitions = {};
    }
    if (!definitions[refs.openAiAnyTypeName]) {
      definitions[refs.openAiAnyTypeName] = {
        // Skipping "object" as no properties can be defined and additionalProperties must be "false"
        type: ["string", "number", "integer", "boolean", "array", "null"],
        items: {
          $ref: refs.$refStrategy === "relative" ? "1" : [
            ...refs.basePath,
            refs.definitionPath,
            refs.openAiAnyTypeName
          ].join("/")
        }
      };
    }
  }
  const combined = name === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name]: main
    }
  };
  if (refs.target === "jsonSchema7") {
    combined.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
    combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
  }
  if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) {
    console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
  }
  return combined;
}, "zodToJsonSchema");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/classic/external.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/core/core.js
init_esm();
var NEVER = Object.freeze({
  status: "aborted"
});
var $brand = Symbol("zod_brand");
var globalConfig = {};
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
__name(config, "config");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/core/util.js
init_esm();
function getEnumValues(entries2) {
  const numericValues = Object.values(entries2).filter((v) => typeof v === "number");
  const values3 = Object.entries(entries2).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values3;
}
__name(getEnumValues, "getEnumValues");
function joinValues(array3, separator = "|") {
  return array3.map((val) => stringifyPrimitive(val)).join(separator);
}
__name(joinValues, "joinValues");
function cached(getter) {
  const set5 = false;
  return {
    get value() {
      if (!set5) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
__name(cached, "cached");
var captureStackTrace = Error.captureStackTrace ? Error.captureStackTrace : (..._args) => {
};
var allowsEval = cached(() => {
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
__name(stringifyPrimitive, "stringifyPrimitive");
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/locales/en.js
init_esm();
var parsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "NaN" : "number";
    }
    case "object": {
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
        return data.constructor.name;
      }
    }
  }
  return t;
}, "parsedType");
var error = /* @__PURE__ */ __name(() => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  __name(getSizing, "getSizing");
  const Nouns = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type":
        return `Invalid input: expected ${issue.expected}, received ${parsedType(issue.input)}`;
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return `Invalid input`;
    }
  };
}, "error");
function en_default() {
  return {
    localeError: error()
  };
}
__name(en_default, "default");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/core/registries.js
init_esm();
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");
var $ZodRegistry = class {
  static {
    __name(this, "$ZodRegistry");
  }
  constructor() {
    this._map = /* @__PURE__ */ new Map();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      if (this._idmap.has(meta.id)) {
        throw new Error(`ID ${meta.id} already exists in the registry`);
      }
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new Map();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      return { ...pm, ...this._map.get(schema) };
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
__name(registry, "registry");
var globalRegistry = /* @__PURE__ */ registry();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/core/to-json-schema.js
init_esm();
var JSONSchemaGenerator = class {
  static {
    __name(this, "JSONSchemaGenerator");
  }
  constructor(params) {
    this.counter = 0;
    this.metadataRegistry = params?.metadata ?? globalRegistry;
    this.target = params?.target ?? "draft-2020-12";
    this.unrepresentable = params?.unrepresentable ?? "throw";
    this.override = params?.override ?? (() => {
    });
    this.io = params?.io ?? "output";
    this.seen = /* @__PURE__ */ new Map();
  }
  process(schema, _params = { path: [], schemaPath: [] }) {
    var _a;
    const def = schema._zod.def;
    const formatMap = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
      // do not set
    };
    const seen = this.seen.get(schema);
    if (seen) {
      seen.count++;
      const isCycle = _params.schemaPath.includes(schema);
      if (isCycle) {
        seen.cycle = _params.path;
      }
      return seen.schema;
    }
    const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
    this.seen.set(schema, result);
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
      result.schema = overrideSchema;
    } else {
      const params = {
        ..._params,
        schemaPath: [..._params.schemaPath, schema],
        path: _params.path
      };
      const parent = schema._zod.parent;
      if (parent) {
        result.ref = parent;
        this.process(parent, params);
        this.seen.get(parent).isParent = true;
      } else {
        const _json = result.schema;
        switch (def.type) {
          case "string": {
            const json = _json;
            json.type = "string";
            const { minimum, maximum, format: format4, patterns, contentEncoding } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minLength = minimum;
            if (typeof maximum === "number")
              json.maxLength = maximum;
            if (format4) {
              json.format = formatMap[format4] ?? format4;
              if (json.format === "")
                delete json.format;
            }
            if (contentEncoding)
              json.contentEncoding = contentEncoding;
            if (patterns && patterns.size > 0) {
              const regexes = [...patterns];
              if (regexes.length === 1)
                json.pattern = regexes[0].source;
              else if (regexes.length > 1) {
                result.schema.allOf = [
                  ...regexes.map((regex) => ({
                    ...this.target === "draft-7" ? { type: "string" } : {},
                    pattern: regex.source
                  }))
                ];
              }
            }
            break;
          }
          case "number": {
            const json = _json;
            const { minimum, maximum, format: format4, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
            if (typeof format4 === "string" && format4.includes("int"))
              json.type = "integer";
            else
              json.type = "number";
            if (typeof exclusiveMinimum === "number")
              json.exclusiveMinimum = exclusiveMinimum;
            if (typeof minimum === "number") {
              json.minimum = minimum;
              if (typeof exclusiveMinimum === "number") {
                if (exclusiveMinimum >= minimum)
                  delete json.minimum;
                else
                  delete json.exclusiveMinimum;
              }
            }
            if (typeof exclusiveMaximum === "number")
              json.exclusiveMaximum = exclusiveMaximum;
            if (typeof maximum === "number") {
              json.maximum = maximum;
              if (typeof exclusiveMaximum === "number") {
                if (exclusiveMaximum <= maximum)
                  delete json.maximum;
                else
                  delete json.exclusiveMaximum;
              }
            }
            if (typeof multipleOf === "number")
              json.multipleOf = multipleOf;
            break;
          }
          case "boolean": {
            const json = _json;
            json.type = "boolean";
            break;
          }
          case "bigint": {
            if (this.unrepresentable === "throw") {
              throw new Error("BigInt cannot be represented in JSON Schema");
            }
            break;
          }
          case "symbol": {
            if (this.unrepresentable === "throw") {
              throw new Error("Symbols cannot be represented in JSON Schema");
            }
            break;
          }
          case "null": {
            _json.type = "null";
            break;
          }
          case "any": {
            break;
          }
          case "unknown": {
            break;
          }
          case "undefined": {
            if (this.unrepresentable === "throw") {
              throw new Error("Undefined cannot be represented in JSON Schema");
            }
            break;
          }
          case "void": {
            if (this.unrepresentable === "throw") {
              throw new Error("Void cannot be represented in JSON Schema");
            }
            break;
          }
          case "never": {
            _json.not = {};
            break;
          }
          case "date": {
            if (this.unrepresentable === "throw") {
              throw new Error("Date cannot be represented in JSON Schema");
            }
            break;
          }
          case "array": {
            const json = _json;
            const { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            json.type = "array";
            json.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
            break;
          }
          case "object": {
            const json = _json;
            json.type = "object";
            json.properties = {};
            const shape = def.shape;
            for (const key in shape) {
              json.properties[key] = this.process(shape[key], {
                ...params,
                path: [...params.path, "properties", key]
              });
            }
            const allKeys = new Set(Object.keys(shape));
            const requiredKeys = new Set([...allKeys].filter((key) => {
              const v = def.shape[key]._zod;
              if (this.io === "input") {
                return v.optin === void 0;
              } else {
                return v.optout === void 0;
              }
            }));
            if (requiredKeys.size > 0) {
              json.required = Array.from(requiredKeys);
            }
            if (def.catchall?._zod.def.type === "never") {
              json.additionalProperties = false;
            } else if (!def.catchall) {
              if (this.io === "output")
                json.additionalProperties = false;
            } else if (def.catchall) {
              json.additionalProperties = this.process(def.catchall, {
                ...params,
                path: [...params.path, "additionalProperties"]
              });
            }
            break;
          }
          case "union": {
            const json = _json;
            json.anyOf = def.options.map((x, i) => this.process(x, {
              ...params,
              path: [...params.path, "anyOf", i]
            }));
            break;
          }
          case "intersection": {
            const json = _json;
            const a = this.process(def.left, {
              ...params,
              path: [...params.path, "allOf", 0]
            });
            const b = this.process(def.right, {
              ...params,
              path: [...params.path, "allOf", 1]
            });
            const isSimpleIntersection = /* @__PURE__ */ __name((val) => "allOf" in val && Object.keys(val).length === 1, "isSimpleIntersection");
            const allOf = [
              ...isSimpleIntersection(a) ? a.allOf : [a],
              ...isSimpleIntersection(b) ? b.allOf : [b]
            ];
            json.allOf = allOf;
            break;
          }
          case "tuple": {
            const json = _json;
            json.type = "array";
            const prefixItems = def.items.map((x, i) => this.process(x, { ...params, path: [...params.path, "prefixItems", i] }));
            if (this.target === "draft-2020-12") {
              json.prefixItems = prefixItems;
            } else {
              json.items = prefixItems;
            }
            if (def.rest) {
              const rest = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"]
              });
              if (this.target === "draft-2020-12") {
                json.items = rest;
              } else {
                json.additionalItems = rest;
              }
            }
            if (def.rest) {
              json.items = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"]
              });
            }
            const { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            break;
          }
          case "record": {
            const json = _json;
            json.type = "object";
            json.propertyNames = this.process(def.keyType, { ...params, path: [...params.path, "propertyNames"] });
            json.additionalProperties = this.process(def.valueType, {
              ...params,
              path: [...params.path, "additionalProperties"]
            });
            break;
          }
          case "map": {
            if (this.unrepresentable === "throw") {
              throw new Error("Map cannot be represented in JSON Schema");
            }
            break;
          }
          case "set": {
            if (this.unrepresentable === "throw") {
              throw new Error("Set cannot be represented in JSON Schema");
            }
            break;
          }
          case "enum": {
            const json = _json;
            const values3 = getEnumValues(def.entries);
            if (values3.every((v) => typeof v === "number"))
              json.type = "number";
            if (values3.every((v) => typeof v === "string"))
              json.type = "string";
            json.enum = values3;
            break;
          }
          case "literal": {
            const json = _json;
            const vals = [];
            for (const val of def.values) {
              if (val === void 0) {
                if (this.unrepresentable === "throw") {
                  throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                } else {
                }
              } else if (typeof val === "bigint") {
                if (this.unrepresentable === "throw") {
                  throw new Error("BigInt literals cannot be represented in JSON Schema");
                } else {
                  vals.push(Number(val));
                }
              } else {
                vals.push(val);
              }
            }
            if (vals.length === 0) {
            } else if (vals.length === 1) {
              const val = vals[0];
              json.type = val === null ? "null" : typeof val;
              json.const = val;
            } else {
              if (vals.every((v) => typeof v === "number"))
                json.type = "number";
              if (vals.every((v) => typeof v === "string"))
                json.type = "string";
              if (vals.every((v) => typeof v === "boolean"))
                json.type = "string";
              if (vals.every((v) => v === null))
                json.type = "null";
              json.enum = vals;
            }
            break;
          }
          case "file": {
            const json = _json;
            const file = {
              type: "string",
              format: "binary",
              contentEncoding: "binary"
            };
            const { minimum, maximum, mime } = schema._zod.bag;
            if (minimum !== void 0)
              file.minLength = minimum;
            if (maximum !== void 0)
              file.maxLength = maximum;
            if (mime) {
              if (mime.length === 1) {
                file.contentMediaType = mime[0];
                Object.assign(json, file);
              } else {
                json.anyOf = mime.map((m) => {
                  const mFile = { ...file, contentMediaType: m };
                  return mFile;
                });
              }
            } else {
              Object.assign(json, file);
            }
            break;
          }
          case "transform": {
            if (this.unrepresentable === "throw") {
              throw new Error("Transforms cannot be represented in JSON Schema");
            }
            break;
          }
          case "nullable": {
            const inner = this.process(def.innerType, params);
            _json.anyOf = [inner, { type: "null" }];
            break;
          }
          case "nonoptional": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "success": {
            const json = _json;
            json.type = "boolean";
            break;
          }
          case "default": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            _json.default = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "prefault": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            if (this.io === "input")
              _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "catch": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            let catchValue;
            try {
              catchValue = def.catchValue(void 0);
            } catch {
              throw new Error("Dynamic catch values are not supported in JSON Schema");
            }
            _json.default = catchValue;
            break;
          }
          case "nan": {
            if (this.unrepresentable === "throw") {
              throw new Error("NaN cannot be represented in JSON Schema");
            }
            break;
          }
          case "template_literal": {
            const json = _json;
            const pattern = schema._zod.pattern;
            if (!pattern)
              throw new Error("Pattern not found in template literal");
            json.type = "string";
            json.pattern = pattern.source;
            break;
          }
          case "pipe": {
            const innerType = this.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
            this.process(innerType, params);
            result.ref = innerType;
            break;
          }
          case "readonly": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            _json.readOnly = true;
            break;
          }
          // passthrough types
          case "promise": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "optional": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "lazy": {
            const innerType = schema._zod.innerType;
            this.process(innerType, params);
            result.ref = innerType;
            break;
          }
          case "custom": {
            if (this.unrepresentable === "throw") {
              throw new Error("Custom types cannot be represented in JSON Schema");
            }
            break;
          }
          default: {
            def;
          }
        }
      }
    }
    const meta = this.metadataRegistry.get(schema);
    if (meta)
      Object.assign(result.schema, meta);
    if (this.io === "input" && isTransforming(schema)) {
      delete result.schema.examples;
      delete result.schema.default;
    }
    if (this.io === "input" && result.schema._prefault)
      (_a = result.schema).default ?? (_a.default = result.schema._prefault);
    delete result.schema._prefault;
    const _result = this.seen.get(schema);
    return _result.schema;
  }
  emit(schema, _params) {
    const params = {
      cycles: _params?.cycles ?? "ref",
      reused: _params?.reused ?? "inline",
      // unrepresentable: _params?.unrepresentable ?? "throw",
      // uri: _params?.uri ?? ((id) => `${id}`),
      external: _params?.external ?? void 0
    };
    const root = this.seen.get(schema);
    if (!root)
      throw new Error("Unprocessed schema. This is a bug in Zod.");
    const makeURI = /* @__PURE__ */ __name((entry) => {
      const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
      if (params.external) {
        const externalId = params.external.registry.get(entry[0])?.id;
        const uriGenerator = params.external.uri ?? ((id2) => id2);
        if (externalId) {
          return { ref: uriGenerator(externalId) };
        }
        const id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
        entry[1].defId = id;
        return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
      }
      if (entry[1] === root) {
        return { ref: "#" };
      }
      const uriPrefix = `#`;
      const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
      const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
      return { defId, ref: defUriPrefix + defId };
    }, "makeURI");
    const extractToDef = /* @__PURE__ */ __name((entry) => {
      if (entry[1].schema.$ref) {
        return;
      }
      const seen = entry[1];
      const { ref, defId } = makeURI(entry);
      seen.def = { ...seen.schema };
      if (defId)
        seen.defId = defId;
      const schema2 = seen.schema;
      for (const key in schema2) {
        delete schema2[key];
      }
      schema2.$ref = ref;
    }, "extractToDef");
    if (params.cycles === "throw") {
      for (const entry of this.seen.entries()) {
        const seen = entry[1];
        if (seen.cycle) {
          throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
        }
      }
    }
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (schema === entry[0]) {
        extractToDef(entry);
        continue;
      }
      if (params.external) {
        const ext = params.external.registry.get(entry[0])?.id;
        if (schema !== entry[0] && ext) {
          extractToDef(entry);
          continue;
        }
      }
      const id = this.metadataRegistry.get(entry[0])?.id;
      if (id) {
        extractToDef(entry);
        continue;
      }
      if (seen.cycle) {
        extractToDef(entry);
        continue;
      }
      if (seen.count > 1) {
        if (params.reused === "ref") {
          extractToDef(entry);
          continue;
        }
      }
    }
    const flattenRef = /* @__PURE__ */ __name((zodSchema, params2) => {
      const seen = this.seen.get(zodSchema);
      const schema2 = seen.def ?? seen.schema;
      const _cached = { ...schema2 };
      if (seen.ref === null) {
        return;
      }
      const ref = seen.ref;
      seen.ref = null;
      if (ref) {
        flattenRef(ref, params2);
        const refSchema = this.seen.get(ref).schema;
        if (refSchema.$ref && params2.target === "draft-7") {
          schema2.allOf = schema2.allOf ?? [];
          schema2.allOf.push(refSchema);
        } else {
          Object.assign(schema2, refSchema);
          Object.assign(schema2, _cached);
        }
      }
      if (!seen.isParent)
        this.override({
          zodSchema,
          jsonSchema: schema2,
          path: seen.path ?? []
        });
    }, "flattenRef");
    for (const entry of [...this.seen.entries()].reverse()) {
      flattenRef(entry[0], { target: this.target });
    }
    const result = {};
    if (this.target === "draft-2020-12") {
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    } else if (this.target === "draft-7") {
      result.$schema = "http://json-schema.org/draft-07/schema#";
    } else {
      console.warn(`Invalid target: ${this.target}`);
    }
    if (params.external?.uri) {
      const id = params.external.registry.get(schema)?.id;
      if (!id)
        throw new Error("Schema is missing an `id` property");
      result.$id = params.external.uri(id);
    }
    Object.assign(result, root.def);
    const defs = params.external?.defs ?? {};
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        defs[seen.defId] = seen.def;
      }
    }
    if (params.external) {
    } else {
      if (Object.keys(defs).length > 0) {
        if (this.target === "draft-2020-12") {
          result.$defs = defs;
        } else {
          result.definitions = defs;
        }
      }
    }
    try {
      return JSON.parse(JSON.stringify(result));
    } catch (_err) {
      throw new Error("Error converting schema to JSON.");
    }
  }
};
function toJSONSchema(input, _params) {
  if (input instanceof $ZodRegistry) {
    const gen3 = new JSONSchemaGenerator(_params);
    const defs = {};
    for (const entry of input._idmap.entries()) {
      const [_, schema] = entry;
      gen3.process(schema);
    }
    const schemas = {};
    const external = {
      registry: input,
      uri: _params?.uri,
      defs
    };
    for (const entry of input._idmap.entries()) {
      const [key, schema] = entry;
      schemas[key] = gen3.emit(schema, {
        ..._params,
        external
      });
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = gen3.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  const gen2 = new JSONSchemaGenerator(_params);
  gen2.process(input);
  return gen2.emit(input, _params);
}
__name(toJSONSchema, "toJSONSchema");
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const schema = _schema;
  const def = schema._zod.def;
  switch (def.type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "date":
    case "symbol":
    case "undefined":
    case "null":
    case "any":
    case "unknown":
    case "never":
    case "void":
    case "literal":
    case "enum":
    case "nan":
    case "file":
    case "template_literal":
      return false;
    case "array": {
      return isTransforming(def.element, ctx);
    }
    case "object": {
      for (const key in def.shape) {
        if (isTransforming(def.shape[key], ctx))
          return true;
      }
      return false;
    }
    case "union": {
      for (const option of def.options) {
        if (isTransforming(option, ctx))
          return true;
      }
      return false;
    }
    case "intersection": {
      return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    case "tuple": {
      for (const item of def.items) {
        if (isTransforming(item, ctx))
          return true;
      }
      if (def.rest && isTransforming(def.rest, ctx))
        return true;
      return false;
    }
    case "record": {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    case "map": {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    case "set": {
      return isTransforming(def.valueType, ctx);
    }
    // inner types
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return isTransforming(def.innerType, ctx);
    case "lazy":
      return isTransforming(def.getter(), ctx);
    case "default": {
      return isTransforming(def.innerType, ctx);
    }
    case "prefault": {
      return isTransforming(def.innerType, ctx);
    }
    case "custom": {
      return false;
    }
    case "transform": {
      return true;
    }
    case "pipe": {
      return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    case "success": {
      return false;
    }
    case "catch": {
      return false;
    }
    default:
      def;
  }
  throw new Error(`Unknown schema type: ${def.type}`);
}
__name(isTransforming, "isTransforming");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/zod/v4/classic/external.js
config(en_default());

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/schema-to-json/dist/esm/index.js
var import_yup_to_json_schema = __toESM(require_dist(), 1);

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/index.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Function.js
init_esm();
var isFunction = /* @__PURE__ */ __name((input) => typeof input === "function", "isFunction");
var dual = /* @__PURE__ */ __name(function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self) {
          return body(self, ...args2);
        };
      };
  }
}, "dual");
var identity = /* @__PURE__ */ __name((a) => a, "identity");
var constant = /* @__PURE__ */ __name((value) => () => value, "constant");
var constTrue = /* @__PURE__ */ constant(true);
var constFalse = /* @__PURE__ */ constant(false);
var constUndefined = /* @__PURE__ */ constant(void 0);
var constVoid = constUndefined;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}
__name(pipe, "pipe");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Array.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Either.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Equivalence.js
init_esm();
var make = /* @__PURE__ */ __name((isEquivalent) => (self, that) => self === that || isEquivalent(self, that), "make");
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make((x, y) => self(f(x), f(y))));
var array = /* @__PURE__ */ __name((item) => make((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    const isEq = item(self[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
}), "array");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/either.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Equal.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Hash.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/GlobalValue.js
init_esm();
var globalStoreId = `effect/GlobalValue`;
var globalStore;
var globalValue = /* @__PURE__ */ __name((id, compute) => {
  if (!globalStore) {
    globalThis[globalStoreId] ??= /* @__PURE__ */ new Map();
    globalStore = globalThis[globalStoreId];
  }
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
}, "globalValue");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Predicate.js
init_esm();
var isString = /* @__PURE__ */ __name((input) => typeof input === "string", "isString");
var isNumber = /* @__PURE__ */ __name((input) => typeof input === "number", "isNumber");
var isBoolean = /* @__PURE__ */ __name((input) => typeof input === "boolean", "isBoolean");
var isBigInt = /* @__PURE__ */ __name((input) => typeof input === "bigint", "isBigInt");
var isSymbol = /* @__PURE__ */ __name((input) => typeof input === "symbol", "isSymbol");
var isFunction2 = isFunction;
var isUndefined = /* @__PURE__ */ __name((input) => input === void 0, "isUndefined");
var isNever = /* @__PURE__ */ __name((_) => false, "isNever");
var isRecordOrArray = /* @__PURE__ */ __name((input) => typeof input === "object" && input !== null, "isRecordOrArray");
var isObject = /* @__PURE__ */ __name((input) => isRecordOrArray(input) || isFunction2(input), "isObject");
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObject(self) && property in self);
var isTagged = /* @__PURE__ */ dual(2, (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag);
var isNullable = /* @__PURE__ */ __name((input) => input === null || input === void 0, "isNullable");
var isNotNullable = /* @__PURE__ */ __name((input) => input !== null && input !== void 0, "isNotNullable");
var isDate = /* @__PURE__ */ __name((input) => input instanceof Date, "isDate");
var isIterable = /* @__PURE__ */ __name((input) => typeof input === "string" || hasProperty(input, Symbol.iterator), "isIterable");
var isRecord = /* @__PURE__ */ __name((input) => isRecordOrArray(input) && !Array.isArray(input), "isRecord");
var isPromiseLike = /* @__PURE__ */ __name((input) => hasProperty(input, "then") && isFunction2(input.then), "isPromiseLike");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Utils.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/errors.js
init_esm();
var getBugErrorMessage = /* @__PURE__ */ __name((message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`, "getBugErrorMessage");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Utils.js
var GenKindTypeId = /* @__PURE__ */ Symbol.for("effect/Gen/GenKind");
var GenKindImpl = class {
  static {
    __name(this, "GenKindImpl");
  }
  value;
  constructor(value) {
    this.value = value;
  }
  /**
   * @since 2.0.0
   */
  get _F() {
    return identity;
  }
  /**
   * @since 2.0.0
   */
  get _R() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _O() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _E() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  [GenKindTypeId] = GenKindTypeId;
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SingleShotGen = class _SingleShotGen {
  static {
    __name(this, "SingleShotGen");
  }
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};
var defaultIncHi = 335903614;
var defaultIncLo = 4150755663;
var MUL_HI = 1481765933 >>> 0;
var MUL_LO = 1284865837 >>> 0;
var BIT_53 = 9007199254740992;
var BIT_27 = 134217728;
var PCGRandom = class {
  static {
    __name(this, "PCGRandom");
  }
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max2) {
    return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % max2;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
};
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
__name(mul64, "mul64");
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}
__name(add64, "add64");
var YieldWrapTypeId = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var YieldWrap = class {
  static {
    __name(this, "YieldWrap");
  }
  /**
   * @since 3.0.6
   */
  #value;
  constructor(value) {
    this.#value = value;
  }
  /**
   * @since 3.0.6
   */
  [YieldWrapTypeId]() {
    return this.#value;
  }
};
function yieldWrapGet(self) {
  if (typeof self === "object" && self !== null && YieldWrapTypeId in self) {
    return self[YieldWrapTypeId]();
  }
  throw new Error(getBugErrorMessage("yieldWrapGet"));
}
__name(yieldWrapGet, "yieldWrapGet");
var structuralRegionState = /* @__PURE__ */ globalValue("effect/Utils/isStructuralRegion", () => ({
  enabled: false,
  tester: void 0
}));
var standard = {
  effect_internal_function: /* @__PURE__ */ __name((body) => {
    return body();
  }, "effect_internal_function")
};
var forced = {
  effect_internal_function: /* @__PURE__ */ __name((body) => {
    try {
      return body();
    } finally {
    }
  }, "effect_internal_function")
};
var isNotOptimizedAway = /* @__PURE__ */ standard.effect_internal_function(() => new Error().stack)?.includes("effect_internal_function") === true;
var internalCall = isNotOptimizedAway ? standard.effect_internal_function : forced.effect_internal_function;
var genConstructor = function* () {
}.constructor;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Hash.js
var randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
var symbol = /* @__PURE__ */ Symbol.for("effect/Hash");
var hash = /* @__PURE__ */ __name((self) => {
  if (structuralRegionState.enabled === true) {
    return 0;
  }
  switch (typeof self) {
    case "number":
      return number(self);
    case "bigint":
      return string(self.toString(10));
    case "boolean":
      return string(String(self));
    case "symbol":
      return string(String(self));
    case "string":
      return string(self);
    case "undefined":
      return string("undefined");
    case "function":
    case "object": {
      if (self === null) {
        return string("null");
      } else if (self instanceof Date) {
        return hash(self.toISOString());
      } else if (self instanceof URL) {
        return hash(self.href);
      } else if (isHash(self)) {
        return self[symbol]();
      } else {
        return random(self);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, "hash");
var random = /* @__PURE__ */ __name((self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
}, "random");
var combine = /* @__PURE__ */ __name((b) => (self) => self * 53 ^ b, "combine");
var optimize = /* @__PURE__ */ __name((n) => n & 3221225471 | n >>> 1 & 1073741824, "optimize");
var isHash = /* @__PURE__ */ __name((u) => hasProperty(u, symbol), "isHash");
var number = /* @__PURE__ */ __name((n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(h);
}, "number");
var string = /* @__PURE__ */ __name((str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
}, "string");
var structureKeys = /* @__PURE__ */ __name((o2, keys6) => {
  let h = 12289;
  for (let i = 0; i < keys6.length; i++) {
    h ^= pipe(string(keys6[i]), combine(hash(o2[keys6[i]])));
  }
  return optimize(h);
}, "structureKeys");
var structure = /* @__PURE__ */ __name((o2) => structureKeys(o2, Object.keys(o2)), "structure");
var array2 = /* @__PURE__ */ __name((arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
}, "array");
var cached2 = /* @__PURE__ */ __name(function() {
  if (arguments.length === 1) {
    const self2 = arguments[0];
    return function(hash3) {
      Object.defineProperty(self2, symbol, {
        value() {
          return hash3;
        },
        enumerable: false
      });
      return hash3;
    };
  }
  const self = arguments[0];
  const hash2 = arguments[1];
  Object.defineProperty(self, symbol, {
    value() {
      return hash2;
    },
    enumerable: false
  });
  return hash2;
}, "cached");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Equal.js
var symbol2 = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
__name(equals, "equals");
function compareBoth(self, that) {
  if (self === that) {
    return true;
  }
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "object" || selfType === "function") {
    if (self !== null && that !== null) {
      if (isEqual(self) && isEqual(that)) {
        if (hash(self) === hash(that) && self[symbol2](that)) {
          return true;
        } else {
          return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
        }
      } else if (self instanceof Date && that instanceof Date) {
        return self.toISOString() === that.toISOString();
      } else if (self instanceof URL && that instanceof URL) {
        return self.href === that.href;
      }
    }
    if (structuralRegionState.enabled) {
      if (Array.isArray(self) && Array.isArray(that)) {
        return self.length === that.length && self.every((v, i) => compareBoth(v, that[i]));
      }
      if (Object.getPrototypeOf(self) === Object.prototype && Object.getPrototypeOf(self) === Object.prototype) {
        const keysSelf = Object.keys(self);
        const keysThat = Object.keys(that);
        if (keysSelf.length === keysThat.length) {
          for (const key of keysSelf) {
            if (!(key in that && compareBoth(self[key], that[key]))) {
              return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
            }
          }
          return true;
        }
      }
      return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
    }
  }
  return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
}
__name(compareBoth, "compareBoth");
var isEqual = /* @__PURE__ */ __name((u) => hasProperty(u, symbol2), "isEqual");
var equivalence = /* @__PURE__ */ __name(() => equals, "equivalence");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Inspectable.js
init_esm();
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJSON = /* @__PURE__ */ __name((x) => {
  try {
    if (hasProperty(x, "toJSON") && isFunction2(x["toJSON"]) && x["toJSON"].length === 0) {
      return x.toJSON();
    } else if (Array.isArray(x)) {
      return x.map(toJSON);
    }
  } catch {
    return {};
  }
  return redact(x);
}, "toJSON");
var format = /* @__PURE__ */ __name((x) => JSON.stringify(x, null, 2), "format");
var BaseProto = {
  toJSON() {
    return toJSON(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var Class = class {
  static {
    __name(this, "Class");
  }
  /**
   * @since 2.0.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  /**
   * @since 2.0.0
   */
  toString() {
    return format(this.toJSON());
  }
};
var toStringUnknown = /* @__PURE__ */ __name((u, whitespace = 2) => {
  if (typeof u === "string") {
    return u;
  }
  try {
    return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
  } catch {
    return String(u);
  }
}, "toStringUnknown");
var stringifyCircular = /* @__PURE__ */ __name((obj, whitespace) => {
  let cache = [];
  const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && (redactableState.fiberRefs !== void 0 && isRedactable(value) ? value[symbolRedactable](redactableState.fiberRefs) : value) : value, whitespace);
  cache = void 0;
  return retVal;
}, "stringifyCircular");
var symbolRedactable = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable");
var isRedactable = /* @__PURE__ */ __name((u) => typeof u === "object" && u !== null && symbolRedactable in u, "isRedactable");
var redactableState = /* @__PURE__ */ globalValue("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
}));
var withRedactableContext = /* @__PURE__ */ __name((context2, f) => {
  const prev = redactableState.fiberRefs;
  redactableState.fiberRefs = context2;
  try {
    return f();
  } finally {
    redactableState.fiberRefs = prev;
  }
}, "withRedactableContext");
var redact = /* @__PURE__ */ __name((u) => {
  if (isRedactable(u) && redactableState.fiberRefs !== void 0) {
    return u[symbolRedactable](redactableState.fiberRefs);
  }
  return u;
}, "redact");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/effectable.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Pipeable.js
init_esm();
var pipeArguments = /* @__PURE__ */ __name((self, args2) => {
  switch (args2.length) {
    case 0:
      return self;
    case 1:
      return args2[0](self);
    case 2:
      return args2[1](args2[0](self));
    case 3:
      return args2[2](args2[1](args2[0](self)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
}, "pipeArguments");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/opCodes/effect.js
init_esm();
var OP_ASYNC = "Async";
var OP_COMMIT = "Commit";
var OP_FAILURE = "Failure";
var OP_ON_FAILURE = "OnFailure";
var OP_ON_SUCCESS = "OnSuccess";
var OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
var OP_SUCCESS = "Success";
var OP_SYNC = "Sync";
var OP_TAG = "Tag";
var OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
var OP_WHILE = "While";
var OP_ITERATOR = "Iterator";
var OP_WITH_RUNTIME = "WithRuntime";
var OP_YIELD = "Yield";
var OP_REVERT_FLAGS = "RevertFlags";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/version.js
init_esm();
var moduleVersion = "3.18.4";
var getCurrentVersion = /* @__PURE__ */ __name(() => moduleVersion, "getCurrentVersion");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/effectable.js
var EffectTypeId = /* @__PURE__ */ Symbol.for("effect/Effect");
var StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
var SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
var ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
var effectVariance = {
  /* c8 ignore next */
  _R: /* @__PURE__ */ __name((_) => _, "_R"),
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E"),
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A"),
  _V: /* @__PURE__ */ getCurrentVersion()
};
var sinkVariance = {
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A"),
  /* c8 ignore next */
  _In: /* @__PURE__ */ __name((_) => _, "_In"),
  /* c8 ignore next */
  _L: /* @__PURE__ */ __name((_) => _, "_L"),
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E"),
  /* c8 ignore next */
  _R: /* @__PURE__ */ __name((_) => _, "_R")
};
var channelVariance = {
  /* c8 ignore next */
  _Env: /* @__PURE__ */ __name((_) => _, "_Env"),
  /* c8 ignore next */
  _InErr: /* @__PURE__ */ __name((_) => _, "_InErr"),
  /* c8 ignore next */
  _InElem: /* @__PURE__ */ __name((_) => _, "_InElem"),
  /* c8 ignore next */
  _InDone: /* @__PURE__ */ __name((_) => _, "_InDone"),
  /* c8 ignore next */
  _OutErr: /* @__PURE__ */ __name((_) => _, "_OutErr"),
  /* c8 ignore next */
  _OutElem: /* @__PURE__ */ __name((_) => _, "_OutElem"),
  /* c8 ignore next */
  _OutDone: /* @__PURE__ */ __name((_) => _, "_OutDone")
};
var EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol2](that) {
    return this === that;
  },
  [symbol]() {
    return cached2(this, random(this));
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var StructuralPrototype = {
  [symbol]() {
    return cached2(this, structure(this));
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
var CommitPrototype = {
  ...EffectPrototype,
  _op: OP_COMMIT
};
var StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype
};
var Base = /* @__PURE__ */ function() {
  function Base3() {
  }
  __name(Base3, "Base");
  Base3.prototype = CommitPrototype;
  return Base3;
}();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/option.js
init_esm();
var TypeId = /* @__PURE__ */ Symbol.for("effect/Option");
var CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: /* @__PURE__ */ __name((_) => _, "_A")
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return cached2(this, combine(hash(this._tag))(hash(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
var NoneHash = /* @__PURE__ */ hash("None");
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = /* @__PURE__ */ __name((input) => hasProperty(input, TypeId), "isOption");
var isNone = /* @__PURE__ */ __name((fa) => fa._tag === "None", "isNone");
var isSome = /* @__PURE__ */ __name((fa) => fa._tag === "Some", "isSome");
var none = /* @__PURE__ */ Object.create(NoneProto);
var some = /* @__PURE__ */ __name((value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
}, "some");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/either.js
var TypeId2 = /* @__PURE__ */ Symbol.for("effect/Either");
var CommonProto2 = {
  ...EffectPrototype,
  [TypeId2]: {
    _R: /* @__PURE__ */ __name((_) => _, "_R")
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Right",
  _op: "Right",
  [symbol2](that) {
    return isEither(that) && isRight(that) && equals(this.right, that.right);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
var LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Left",
  _op: "Left",
  [symbol2](that) {
    return isEither(that) && isLeft(that) && equals(this.left, that.left);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
var isEither = /* @__PURE__ */ __name((input) => hasProperty(input, TypeId2), "isEither");
var isLeft = /* @__PURE__ */ __name((ma) => ma._tag === "Left", "isLeft");
var isRight = /* @__PURE__ */ __name((ma) => ma._tag === "Right", "isRight");
var left = /* @__PURE__ */ __name((left3) => {
  const a = Object.create(LeftProto);
  a.left = left3;
  return a;
}, "left");
var right = /* @__PURE__ */ __name((right3) => {
  const a = Object.create(RightProto);
  a.right = right3;
  return a;
}, "right");
var getRight = /* @__PURE__ */ __name((self) => isLeft(self) ? none : some(self.right), "getRight");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Either.js
var right2 = right;
var left2 = left;
var isEither2 = isEither;
var isLeft2 = isLeft;
var isRight2 = isRight;
var mapLeft = /* @__PURE__ */ dual(2, (self, f) => isLeft2(self) ? left2(f(self.left)) : right2(self.right));
var map = /* @__PURE__ */ dual(2, (self, f) => isRight2(self) ? right2(f(self.right)) : left2(self.left));
var match = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? onLeft(self.left) : onRight(self.right));
var merge = /* @__PURE__ */ match({
  onLeft: identity,
  onRight: identity
});
var getOrThrowWith = /* @__PURE__ */ dual(2, (self, onLeft) => {
  if (isRight2(self)) {
    return self.right;
  }
  throw onLeft(self.left);
});
var getOrThrow = /* @__PURE__ */ getOrThrowWith(() => new Error("getOrThrow called on a Left"));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/array.js
init_esm();
var isNonEmptyArray = /* @__PURE__ */ __name((self) => self.length > 0, "isNonEmptyArray");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Option.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Order.js
init_esm();
var make2 = /* @__PURE__ */ __name((compare2) => (self, that) => self === that ? 0 : compare2(self, that), "make");
var number2 = /* @__PURE__ */ make2((self, that) => self < that ? -1 : 1);
var mapInput2 = /* @__PURE__ */ dual(2, (self, f) => make2((b1, b2) => self(f(b1), f(b2))));
var greaterThan = /* @__PURE__ */ __name((O) => dual(2, (self, that) => O(self, that) === 1), "greaterThan");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Option.js
var none2 = /* @__PURE__ */ __name(() => none, "none");
var some2 = some;
var isNone2 = isNone;
var isSome2 = isSome;
var match2 = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var getRight2 = getRight;
var getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var orElse = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? that() : self);
var orElseSome = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? some2(onNone()) : self);
var fromNullable = /* @__PURE__ */ __name((nullableValue) => nullableValue == null ? none2() : some2(nullableValue), "fromNullable");
var getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
var liftThrowable = /* @__PURE__ */ __name((f) => (...a) => {
  try {
    return some2(f(...a));
  } catch {
    return none2();
  }
}, "liftThrowable");
var map2 = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : some2(f(self.value)));
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : f(self.value));
var flatMapNullable = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : fromNullable(f(self.value)));
var containsWith = /* @__PURE__ */ __name((isEquivalent) => dual(2, (self, a) => isNone2(self) ? false : isEquivalent(self.value, a)), "containsWith");
var _equivalence = /* @__PURE__ */ equivalence();
var contains = /* @__PURE__ */ containsWith(_equivalence);
var exists = /* @__PURE__ */ dual(2, (self, refinement) => isNone2(self) ? false : refinement(self.value));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Tuple.js
init_esm();
var make3 = /* @__PURE__ */ __name((...elements) => elements, "make");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Record.js
init_esm();
var isEmptyRecord = /* @__PURE__ */ __name((self) => keys(self).length === 0, "isEmptyRecord");
var has = /* @__PURE__ */ dual(2, (self, key) => Object.prototype.hasOwnProperty.call(self, key));
var keys = /* @__PURE__ */ __name((self) => Object.keys(self), "keys");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Array.js
var allocate = /* @__PURE__ */ __name((n) => new Array(n), "allocate");
var makeBy = /* @__PURE__ */ dual(2, (n, f) => {
  const max2 = Math.max(1, Math.floor(n));
  const out = new Array(max2);
  for (let i = 0; i < max2; i++) {
    out[i] = f(i);
  }
  return out;
});
var fromIterable = /* @__PURE__ */ __name((collection) => Array.isArray(collection) ? collection : Array.from(collection), "fromIterable");
var ensure = /* @__PURE__ */ __name((self) => Array.isArray(self) ? self : [self], "ensure");
var matchLeft = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self)) : onEmpty());
var prepend = /* @__PURE__ */ dual(2, (self, head3) => [head3, ...self]);
var append = /* @__PURE__ */ dual(2, (self, last3) => [...self, last3]);
var appendAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable(self).concat(fromIterable(that)));
var isArray = Array.isArray;
var isEmptyArray = /* @__PURE__ */ __name((self) => self.length === 0, "isEmptyArray");
var isEmptyReadonlyArray = isEmptyArray;
var isNonEmptyArray2 = isNonEmptyArray;
var isNonEmptyReadonlyArray = isNonEmptyArray;
var isOutOfBounds = /* @__PURE__ */ __name((i, as4) => i < 0 || i >= as4.length, "isOutOfBounds");
var clamp = /* @__PURE__ */ __name((i, as4) => Math.floor(Math.min(Math.max(0, i), as4.length)), "clamp");
var get = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBounds(i, self) ? none2() : some2(self[i]);
});
var unsafeGet = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBounds(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
var head = /* @__PURE__ */ get(0);
var headNonEmpty = /* @__PURE__ */ unsafeGet(0);
var last = /* @__PURE__ */ __name((self) => isNonEmptyReadonlyArray(self) ? some2(lastNonEmpty(self)) : none2(), "last");
var lastNonEmpty = /* @__PURE__ */ __name((self) => self[self.length - 1], "lastNonEmpty");
var tailNonEmpty = /* @__PURE__ */ __name((self) => self.slice(1), "tailNonEmpty");
var spanIndex = /* @__PURE__ */ __name((self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a, i)) {
      break;
    }
    i++;
  }
  return i;
}, "spanIndex");
var span = /* @__PURE__ */ dual(2, (self, predicate) => splitAt(self, spanIndex(self, predicate)));
var drop = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self);
  return input.slice(clamp(n, input), input.length);
});
var reverse = /* @__PURE__ */ __name((self) => Array.from(self).reverse(), "reverse");
var sort = /* @__PURE__ */ dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
var zip = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, make3));
var zipWith = /* @__PURE__ */ dual(3, (self, that, f) => {
  const as4 = fromIterable(self);
  const bs = fromIterable(that);
  if (isNonEmptyReadonlyArray(as4) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty(as4), headNonEmpty(bs))];
    const len = Math.min(as4.length, bs.length);
    for (let i = 1; i < len; i++) {
      out[i] = f(as4[i], bs[i]);
    }
    return out;
  }
  return [];
});
var _equivalence2 = /* @__PURE__ */ equivalence();
var splitAt = /* @__PURE__ */ dual(2, (self, n) => {
  const input = Array.from(self);
  const _n = Math.floor(n);
  if (isNonEmptyReadonlyArray(input)) {
    if (_n >= 1) {
      return splitNonEmptyAt(input, _n);
    }
    return [[], input];
  }
  return [input, []];
});
var splitNonEmptyAt = /* @__PURE__ */ dual(2, (self, n) => {
  const _n = Math.max(1, Math.floor(n));
  return _n >= self.length ? [copy(self), []] : [prepend(self.slice(1, _n), headNonEmpty(self)), self.slice(_n)];
});
var copy = /* @__PURE__ */ __name((self) => self.slice(), "copy");
var unionWith = /* @__PURE__ */ dual(3, (self, that, isEquivalent) => {
  const a = fromIterable(self);
  const b = fromIterable(that);
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe2 = dedupeWith(isEquivalent);
      return dedupe2(appendAll(a, b));
    }
    return a;
  }
  return b;
});
var union = /* @__PURE__ */ dual(2, (self, that) => unionWith(self, that, _equivalence2));
var empty = /* @__PURE__ */ __name(() => [], "empty");
var of = /* @__PURE__ */ __name((a) => [a], "of");
var map3 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    const inner = f(self[i], i);
    for (let j = 0; j < inner.length; j++) {
      out.push(inner[j]);
    }
  }
  return out;
});
var flatten = /* @__PURE__ */ flatMap2(identity);
var filterMap = /* @__PURE__ */ dual(2, (self, f) => {
  const as4 = fromIterable(self);
  const out = [];
  for (let i = 0; i < as4.length; i++) {
    const o2 = f(as4[i], i);
    if (isSome2(o2)) {
      out.push(o2.value);
    }
  }
  return out;
});
var reduce = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable(self).reduce((b2, a, i) => f(b2, a, i), b));
var unfold = /* @__PURE__ */ __name((b, f) => {
  const out = [];
  let next = b;
  let o2;
  while (isSome2(o2 = f(next))) {
    const [a, b2] = o2.value;
    out.push(a);
    next = b2;
  }
  return out;
}, "unfold");
var getEquivalence = array;
var dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const input = fromIterable(self);
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty(input)];
    const rest = tailNonEmpty(input);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
var dedupe = /* @__PURE__ */ __name((self) => dedupeWith(self, equivalence()), "dedupe");
var join = /* @__PURE__ */ dual(2, (self, sep) => fromIterable(self).join(sep));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/schema/errors.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/schema/util.js
init_esm();
var getKeysForIndexSignature = /* @__PURE__ */ __name((input, parameter) => {
  switch (parameter._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(input);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(input);
    case "Refinement":
      return getKeysForIndexSignature(input, parameter.from);
  }
}, "getKeysForIndexSignature");
var memoizeThunk = /* @__PURE__ */ __name((f) => {
  let done4 = false;
  let a;
  return () => {
    if (done4) {
      return a;
    }
    a = f();
    done4 = true;
    return a;
  };
}, "memoizeThunk");
var formatDate = /* @__PURE__ */ __name((date) => {
  try {
    return date.toISOString();
  } catch {
    return String(date);
  }
}, "formatDate");
var CIRCULAR = "[Circular]";
function formatUnknown(input, whitespace = 0) {
  const seen = /* @__PURE__ */ new WeakSet();
  const gap = !whitespace ? "" : typeof whitespace === "number" ? " ".repeat(whitespace) : whitespace;
  const ind = /* @__PURE__ */ __name((d) => gap.repeat(d), "ind");
  const safeToString = /* @__PURE__ */ __name((x) => {
    try {
      const s = x.toString();
      return typeof s === "string" ? s : String(s);
    } catch {
      return "[toString threw]";
    }
  }, "safeToString");
  const wrap = /* @__PURE__ */ __name((v, body) => {
    const ctor = v?.constructor;
    return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
  }, "wrap");
  const ownKeys = /* @__PURE__ */ __name((o2) => {
    try {
      return Reflect.ownKeys(o2);
    } catch {
      return ["[ownKeys threw]"];
    }
  }, "ownKeys");
  function go3(v, d = 0) {
    if (Array.isArray(v)) {
      if (seen.has(v)) return CIRCULAR;
      seen.add(v);
      if (!gap || v.length <= 1) return `[${v.map((x) => go3(x, d)).join(",")}]`;
      const inner = v.map((x) => go3(x, d + 1)).join(",\n" + ind(d + 1));
      return `[
${ind(d + 1)}${inner}
${ind(d)}]`;
    }
    if (isDate(v)) return formatDate(v);
    if (hasProperty(v, "toString") && isFunction2(v["toString"]) && v["toString"] !== Object.prototype.toString) return safeToString(v);
    if (isString(v)) return JSON.stringify(v);
    if (isNumber(v) || v == null || isBoolean(v) || isSymbol(v)) return String(v);
    if (isBigInt(v)) return String(v) + "n";
    if (v instanceof Set || v instanceof Map) {
      if (seen.has(v)) return CIRCULAR;
      seen.add(v);
      return `${v.constructor.name}(${go3(Array.from(v), d)})`;
    }
    if (isObject(v)) {
      if (seen.has(v)) return CIRCULAR;
      seen.add(v);
      const keys6 = ownKeys(v);
      if (!gap || keys6.length <= 1) {
        const body2 = `{${keys6.map((k) => `${formatPropertyKey(k)}:${go3(v[k], d)}`).join(",")}}`;
        return wrap(v, body2);
      }
      const body = `{
${keys6.map((k) => `${ind(d + 1)}${formatPropertyKey(k)}: ${go3(v[k], d + 1)}`).join(",\n")}
${ind(d)}}`;
      return wrap(v, body);
    }
    return String(v);
  }
  __name(go3, "go");
  return go3(input, 0);
}
__name(formatUnknown, "formatUnknown");
function formatPropertyKey(name) {
  return isString(name) ? JSON.stringify(name) : String(name);
}
__name(formatPropertyKey, "formatPropertyKey");
var isNonEmpty = /* @__PURE__ */ __name((x) => Array.isArray(x), "isNonEmpty");
var formatPathKey = /* @__PURE__ */ __name((key) => `[${formatPropertyKey(key)}]`, "formatPathKey");
var formatPath = /* @__PURE__ */ __name((path) => isNonEmpty(path) ? path.map(formatPathKey).join("") : formatPathKey(path), "formatPath");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/schema/errors.js
var getErrorMessage = /* @__PURE__ */ __name((reason, details, path, ast) => {
  let out = reason;
  if (path && isNonEmptyReadonlyArray(path)) {
    out += `
at path: ${formatPath(path)}`;
  }
  if (details !== void 0) {
    out += `
details: ${details}`;
  }
  if (ast) {
    out += `
schema (${ast._tag}): ${ast}`;
  }
  return out;
}, "getErrorMessage");
var getMissingAnnotationErrorMessage = /* @__PURE__ */ __name((details, path, ast) => getErrorMessage("Missing annotation", details, path, ast), "getMissingAnnotationErrorMessage");
var getJSONSchemaMissingAnnotationErrorMessage = /* @__PURE__ */ __name((path, ast) => getMissingAnnotationErrorMessage(`Generating a JSON Schema for this schema requires a "jsonSchema" annotation`, path, ast), "getJSONSchemaMissingAnnotationErrorMessage");
var getJSONSchemaMissingIdentifierAnnotationErrorMessage = /* @__PURE__ */ __name((path, ast) => getMissingAnnotationErrorMessage(`Generating a JSON Schema for this schema requires an "identifier" annotation`, path, ast), "getJSONSchemaMissingIdentifierAnnotationErrorMessage");
var getJSONSchemaUnsupportedPostRestElementsErrorMessage = /* @__PURE__ */ __name((path) => getErrorMessage("Generating a JSON Schema for post-rest elements is not currently supported. You're welcome to contribute by submitting a Pull Request", void 0, path), "getJSONSchemaUnsupportedPostRestElementsErrorMessage");
var getJSONSchemaUnsupportedKeyErrorMessage = /* @__PURE__ */ __name((key, path) => getErrorMessage("Unsupported key", `Cannot encode ${formatPropertyKey(key)} key to JSON Schema`, path), "getJSONSchemaUnsupportedKeyErrorMessage");
var getASTDuplicateIndexSignatureErrorMessage = /* @__PURE__ */ __name((type) => getErrorMessage("Duplicate index signature", `${type} index signature`), "getASTDuplicateIndexSignatureErrorMessage");
var getASTIndexSignatureParameterErrorMessage = /* @__PURE__ */ getErrorMessage("Unsupported index signature parameter", "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types");
var getASTRequiredElementFollowinAnOptionalElementErrorMessage = /* @__PURE__ */ getErrorMessage("Invalid element", "A required element cannot follow an optional element. ts(1257)");
var getASTDuplicatePropertySignatureErrorMessage = /* @__PURE__ */ __name((key) => getErrorMessage("Duplicate property signature", `Duplicate key ${formatUnknown(key)}`), "getASTDuplicatePropertySignatureErrorMessage");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/schema/schemaId.js
init_esm();
var IntSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Int");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/SchemaAST.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Number.js
init_esm();
var Order = number2;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/RegExp.js
init_esm();
var escape = /* @__PURE__ */ __name((string2) => string2.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), "escape");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/SchemaAST.js
var BrandAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Brand");
var SchemaIdAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/SchemaId");
var MessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Message");
var MissingMessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/MissingMessage");
var IdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Identifier");
var TitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Title");
var AutoTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/AutoTitle");
var DescriptionAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Description");
var ExamplesAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Examples");
var DefaultAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Default");
var JSONSchemaAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONSchema");
var ArbitraryAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Arbitrary");
var PrettyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Pretty");
var EquivalenceAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Equivalence");
var ConcurrencyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Concurrency");
var BatchingAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Batching");
var ParseIssueTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseIssueTitle");
var ParseOptionsAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseOptions");
var DecodingFallbackAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/DecodingFallback");
var SurrogateAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Surrogate");
var StableFilterAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/StableFilter");
var getAnnotation = /* @__PURE__ */ dual(2, (annotated, key) => Object.prototype.hasOwnProperty.call(annotated.annotations, key) ? some2(annotated.annotations[key]) : none2());
var getBrandAnnotation = /* @__PURE__ */ getAnnotation(BrandAnnotationId);
var getMessageAnnotation = /* @__PURE__ */ getAnnotation(MessageAnnotationId);
var getMissingMessageAnnotation = /* @__PURE__ */ getAnnotation(MissingMessageAnnotationId);
var getTitleAnnotation = /* @__PURE__ */ getAnnotation(TitleAnnotationId);
var getAutoTitleAnnotation = /* @__PURE__ */ getAnnotation(AutoTitleAnnotationId);
var getIdentifierAnnotation = /* @__PURE__ */ getAnnotation(IdentifierAnnotationId);
var getDescriptionAnnotation = /* @__PURE__ */ getAnnotation(DescriptionAnnotationId);
var getExamplesAnnotation = /* @__PURE__ */ getAnnotation(ExamplesAnnotationId);
var getDefaultAnnotation = /* @__PURE__ */ getAnnotation(DefaultAnnotationId);
var getJSONSchemaAnnotation = /* @__PURE__ */ getAnnotation(JSONSchemaAnnotationId);
var getConcurrencyAnnotation = /* @__PURE__ */ getAnnotation(ConcurrencyAnnotationId);
var getBatchingAnnotation = /* @__PURE__ */ getAnnotation(BatchingAnnotationId);
var getParseIssueTitleAnnotation = /* @__PURE__ */ getAnnotation(ParseIssueTitleAnnotationId);
var getParseOptionsAnnotation = /* @__PURE__ */ getAnnotation(ParseOptionsAnnotationId);
var getDecodingFallbackAnnotation = /* @__PURE__ */ getAnnotation(DecodingFallbackAnnotationId);
var getSurrogateAnnotation = /* @__PURE__ */ getAnnotation(SurrogateAnnotationId);
var getStableFilterAnnotation = /* @__PURE__ */ getAnnotation(StableFilterAnnotationId);
var hasStableFilter = /* @__PURE__ */ __name((annotated) => exists(getStableFilterAnnotation(annotated), (b) => b === true), "hasStableFilter");
var JSONIdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONIdentifier");
var getJSONIdentifierAnnotation = /* @__PURE__ */ getAnnotation(JSONIdentifierAnnotationId);
var getJSONIdentifier = /* @__PURE__ */ __name((annotated) => orElse(getJSONIdentifierAnnotation(annotated), () => getIdentifierAnnotation(annotated)), "getJSONIdentifier");
var ParseJsonSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/ParseJson");
var Declaration = class {
  static {
    __name(this, "Declaration");
  }
  typeParameters;
  decodeUnknown;
  encodeUnknown;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Declaration";
  constructor(typeParameters, decodeUnknown, encodeUnknown, annotations2 = {}) {
    this.typeParameters = typeParameters;
    this.decodeUnknown = decodeUnknown;
    this.encodeUnknown = encodeUnknown;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => "<declaration schema>");
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      typeParameters: this.typeParameters.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var createASTGuard = /* @__PURE__ */ __name((tag) => (ast) => ast._tag === tag, "createASTGuard");
var isDeclaration = /* @__PURE__ */ createASTGuard("Declaration");
var Literal = class {
  static {
    __name(this, "Literal");
  }
  literal;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Literal";
  constructor(literal, annotations2 = {}) {
    this.literal = literal;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatUnknown(this.literal));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      literal: isBigInt(this.literal) ? String(this.literal) : this.literal,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isLiteral = /* @__PURE__ */ createASTGuard("Literal");
var UniqueSymbol = class {
  static {
    __name(this, "UniqueSymbol");
  }
  symbol;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UniqueSymbol";
  constructor(symbol3, annotations2 = {}) {
    this.symbol = symbol3;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatUnknown(this.symbol));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      symbol: String(this.symbol),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var UndefinedKeyword = class {
  static {
    __name(this, "UndefinedKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UndefinedKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var undefinedKeyword = /* @__PURE__ */ new UndefinedKeyword({
  [TitleAnnotationId]: "undefined"
});
var VoidKeyword = class {
  static {
    __name(this, "VoidKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "VoidKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var voidKeyword = /* @__PURE__ */ new VoidKeyword({
  [TitleAnnotationId]: "void"
});
var NeverKeyword = class {
  static {
    __name(this, "NeverKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "NeverKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var neverKeyword = /* @__PURE__ */ new NeverKeyword({
  [TitleAnnotationId]: "never"
});
var isNeverKeyword = /* @__PURE__ */ createASTGuard("NeverKeyword");
var UnknownKeyword = class {
  static {
    __name(this, "UnknownKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UnknownKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var unknownKeyword = /* @__PURE__ */ new UnknownKeyword({
  [TitleAnnotationId]: "unknown"
});
var AnyKeyword = class {
  static {
    __name(this, "AnyKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "AnyKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var anyKeyword = /* @__PURE__ */ new AnyKeyword({
  [TitleAnnotationId]: "any"
});
var StringKeyword = class {
  static {
    __name(this, "StringKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "StringKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var stringKeyword = /* @__PURE__ */ new StringKeyword({
  [TitleAnnotationId]: "string",
  [DescriptionAnnotationId]: "a string"
});
var isStringKeyword = /* @__PURE__ */ createASTGuard("StringKeyword");
var NumberKeyword = class {
  static {
    __name(this, "NumberKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "NumberKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var numberKeyword = /* @__PURE__ */ new NumberKeyword({
  [TitleAnnotationId]: "number",
  [DescriptionAnnotationId]: "a number"
});
var BooleanKeyword = class {
  static {
    __name(this, "BooleanKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "BooleanKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var booleanKeyword = /* @__PURE__ */ new BooleanKeyword({
  [TitleAnnotationId]: "boolean",
  [DescriptionAnnotationId]: "a boolean"
});
var BigIntKeyword = class {
  static {
    __name(this, "BigIntKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "BigIntKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var bigIntKeyword = /* @__PURE__ */ new BigIntKeyword({
  [TitleAnnotationId]: "bigint",
  [DescriptionAnnotationId]: "a bigint"
});
var SymbolKeyword = class {
  static {
    __name(this, "SymbolKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "SymbolKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var symbolKeyword = /* @__PURE__ */ new SymbolKeyword({
  [TitleAnnotationId]: "symbol",
  [DescriptionAnnotationId]: "a symbol"
});
var isSymbolKeyword = /* @__PURE__ */ createASTGuard("SymbolKeyword");
var ObjectKeyword = class {
  static {
    __name(this, "ObjectKeyword");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "ObjectKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var objectKeyword = /* @__PURE__ */ new ObjectKeyword({
  [TitleAnnotationId]: "object",
  [DescriptionAnnotationId]: "an object in the TypeScript meaning, i.e. the `object` type"
});
var Type = class {
  static {
    __name(this, "Type");
  }
  type;
  annotations;
  constructor(type, annotations2 = {}) {
    this.type = type;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type);
  }
};
var OptionalType = class extends Type {
  static {
    __name(this, "OptionalType");
  }
  isOptional;
  constructor(type, isOptional, annotations2 = {}) {
    super(type, annotations2);
    this.isOptional = isOptional;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type) + (this.isOptional ? "?" : "");
  }
};
var getRestASTs = /* @__PURE__ */ __name((rest) => rest.map((annotatedAST) => annotatedAST.type), "getRestASTs");
var TupleType = class {
  static {
    __name(this, "TupleType");
  }
  elements;
  rest;
  isReadonly;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TupleType";
  constructor(elements, rest, isReadonly, annotations2 = {}) {
    this.elements = elements;
    this.rest = rest;
    this.isReadonly = isReadonly;
    this.annotations = annotations2;
    let hasOptionalElement = false;
    let hasIllegalRequiredElement = false;
    for (const e of elements) {
      if (e.isOptional) {
        hasOptionalElement = true;
      } else if (hasOptionalElement) {
        hasIllegalRequiredElement = true;
        break;
      }
    }
    if (hasIllegalRequiredElement || hasOptionalElement && rest.length > 1) {
      throw new Error(getASTRequiredElementFollowinAnOptionalElementErrorMessage);
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatTuple(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      elements: this.elements.map((e) => e.toJSON()),
      rest: this.rest.map((ast) => ast.toJSON()),
      isReadonly: this.isReadonly,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatTuple = /* @__PURE__ */ __name((ast) => {
  const formattedElements = ast.elements.map(String).join(", ");
  return matchLeft(ast.rest, {
    onEmpty: /* @__PURE__ */ __name(() => `readonly [${formattedElements}]`, "onEmpty"),
    onNonEmpty: /* @__PURE__ */ __name((head3, tail) => {
      const formattedHead = String(head3);
      const wrappedHead = formattedHead.includes(" | ") ? `(${formattedHead})` : formattedHead;
      if (tail.length > 0) {
        const formattedTail = tail.map(String).join(", ");
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`;
        } else {
          return `readonly [...${wrappedHead}[], ${formattedTail}]`;
        }
      } else {
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[]]`;
        } else {
          return `ReadonlyArray<${formattedHead}>`;
        }
      }
    }, "onNonEmpty")
  });
}, "formatTuple");
var PropertySignature = class extends OptionalType {
  static {
    __name(this, "PropertySignature");
  }
  name;
  isReadonly;
  constructor(name, type, isOptional, isReadonly, annotations2) {
    super(type, isOptional, annotations2);
    this.name = name;
    this.isReadonly = isReadonly;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + String(this.name) + (this.isOptional ? "?" : "") + ": " + this.type;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      name: String(this.name),
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      isReadonly: this.isReadonly,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isParameter = /* @__PURE__ */ __name((ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return true;
    case "Refinement":
      return isParameter(ast.from);
  }
  return false;
}, "isParameter");
var IndexSignature = class {
  static {
    __name(this, "IndexSignature");
  }
  type;
  isReadonly;
  /**
   * @since 3.10.0
   */
  parameter;
  constructor(parameter, type, isReadonly) {
    this.type = type;
    this.isReadonly = isReadonly;
    if (isParameter(parameter)) {
      this.parameter = parameter;
    } else {
      throw new Error(getASTIndexSignatureParameterErrorMessage);
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + `[x: ${this.parameter}]: ${this.type}`;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      parameter: this.parameter.toJSON(),
      type: this.type.toJSON(),
      isReadonly: this.isReadonly
    };
  }
};
var TypeLiteral = class {
  static {
    __name(this, "TypeLiteral");
  }
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TypeLiteral";
  /**
   * @since 3.10.0
   */
  propertySignatures;
  /**
   * @since 3.10.0
   */
  indexSignatures;
  constructor(propertySignatures, indexSignatures, annotations2 = {}) {
    this.annotations = annotations2;
    const keys6 = {};
    for (let i = 0; i < propertySignatures.length; i++) {
      const name = propertySignatures[i].name;
      if (Object.prototype.hasOwnProperty.call(keys6, name)) {
        throw new Error(getASTDuplicatePropertySignatureErrorMessage(name));
      }
      keys6[name] = null;
    }
    const parameters = {
      string: false,
      symbol: false
    };
    for (let i = 0; i < indexSignatures.length; i++) {
      const encodedParameter = getEncodedParameter(indexSignatures[i].parameter);
      if (isStringKeyword(encodedParameter)) {
        if (parameters.string) {
          throw new Error(getASTDuplicateIndexSignatureErrorMessage("string"));
        }
        parameters.string = true;
      } else if (isSymbolKeyword(encodedParameter)) {
        if (parameters.symbol) {
          throw new Error(getASTDuplicateIndexSignatureErrorMessage("symbol"));
        }
        parameters.symbol = true;
      }
    }
    this.propertySignatures = propertySignatures;
    this.indexSignatures = indexSignatures;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatTypeLiteral(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      propertySignatures: this.propertySignatures.map((ps) => ps.toJSON()),
      indexSignatures: this.indexSignatures.map((ps) => ps.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatIndexSignatures = /* @__PURE__ */ __name((iss) => iss.map(String).join("; "), "formatIndexSignatures");
var formatTypeLiteral = /* @__PURE__ */ __name((ast) => {
  if (ast.propertySignatures.length > 0) {
    const pss = ast.propertySignatures.map(String).join("; ");
    if (ast.indexSignatures.length > 0) {
      return `{ ${pss}; ${formatIndexSignatures(ast.indexSignatures)} }`;
    } else {
      return `{ ${pss} }`;
    }
  } else {
    if (ast.indexSignatures.length > 0) {
      return `{ ${formatIndexSignatures(ast.indexSignatures)} }`;
    } else {
      return "{}";
    }
  }
}, "formatTypeLiteral");
var isTypeLiteral = /* @__PURE__ */ createASTGuard("TypeLiteral");
var sortCandidates = /* @__PURE__ */ sort(/* @__PURE__ */ mapInput2(Order, (ast) => {
  switch (ast._tag) {
    case "AnyKeyword":
      return 0;
    case "UnknownKeyword":
      return 1;
    case "ObjectKeyword":
      return 2;
    case "StringKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3;
  }
  return 4;
}));
var literalMap = {
  string: "StringKeyword",
  number: "NumberKeyword",
  boolean: "BooleanKeyword",
  bigint: "BigIntKeyword"
};
var flatten2 = /* @__PURE__ */ __name((candidates) => flatMap2(candidates, (ast) => isUnion(ast) ? flatten2(ast.types) : [ast]), "flatten");
var unify = /* @__PURE__ */ __name((candidates) => {
  const cs = sortCandidates(candidates);
  const out = [];
  const uniques = {};
  const literals = [];
  for (const ast of cs) {
    switch (ast._tag) {
      case "NeverKeyword":
        break;
      case "AnyKeyword":
        return [anyKeyword];
      case "UnknownKeyword":
        return [unknownKeyword];
      // uniques
      case "ObjectKeyword":
      case "UndefinedKeyword":
      case "VoidKeyword":
      case "StringKeyword":
      case "NumberKeyword":
      case "BooleanKeyword":
      case "BigIntKeyword":
      case "SymbolKeyword": {
        if (!uniques[ast._tag]) {
          uniques[ast._tag] = ast;
          out.push(ast);
        }
        break;
      }
      case "Literal": {
        const type = typeof ast.literal;
        switch (type) {
          case "string":
          case "number":
          case "bigint":
          case "boolean": {
            const _tag = literalMap[type];
            if (!uniques[_tag] && !literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
          // null
          case "object": {
            if (!literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
        }
        break;
      }
      case "UniqueSymbol": {
        if (!uniques["SymbolKeyword"] && !literals.includes(ast.symbol)) {
          literals.push(ast.symbol);
          out.push(ast);
        }
        break;
      }
      case "TupleType": {
        if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      case "TypeLiteral": {
        if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
          if (!uniques["{}"]) {
            uniques["{}"] = ast;
            out.push(ast);
          }
        } else if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      default:
        out.push(ast);
    }
  }
  return out;
}, "unify");
var Union = class _Union {
  static {
    __name(this, "Union");
  }
  types;
  annotations;
  static make = /* @__PURE__ */ __name((types, annotations2) => {
    return isMembers(types) ? new _Union(types, annotations2) : types.length === 1 ? types[0] : neverKeyword;
  }, "make");
  /** @internal */
  static unify = /* @__PURE__ */ __name((candidates, annotations2) => {
    return _Union.make(unify(flatten2(candidates)), annotations2);
  }, "unify");
  /**
   * @since 3.10.0
   */
  _tag = "Union";
  constructor(types, annotations2 = {}) {
    this.types = types;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => this.types.map(String).join(" | "));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      types: this.types.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isMembers = /* @__PURE__ */ __name((as4) => as4.length > 1, "isMembers");
var isUnion = /* @__PURE__ */ createASTGuard("Union");
var toJSONMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Schema/AST/toJSONMemoMap"), () => /* @__PURE__ */ new WeakMap());
var Suspend = class {
  static {
    __name(this, "Suspend");
  }
  f;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Suspend";
  constructor(f, annotations2 = {}) {
    this.f = f;
    this.annotations = annotations2;
    this.f = memoizeThunk(f);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getExpected(this).pipe(orElse(() => flatMap(liftThrowable(this.f)(), (ast) => getExpected(ast))), getOrElse(() => "<suspended schema>"));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    const ast = this.f();
    let out = toJSONMemoMap.get(ast);
    if (out) {
      return out;
    }
    toJSONMemoMap.set(ast, {
      _tag: this._tag
    });
    out = {
      _tag: this._tag,
      ast: ast.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
    toJSONMemoMap.set(ast, out);
    return out;
  }
};
var isSuspend = /* @__PURE__ */ createASTGuard("Suspend");
var Refinement = class {
  static {
    __name(this, "Refinement");
  }
  from;
  filter;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Refinement";
  constructor(from, filter6, annotations2 = {}) {
    this.from = from;
    this.filter = filter6;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getIdentifierAnnotation(this).pipe(getOrElse(() => match2(getOrElseExpected(this), {
      onNone: /* @__PURE__ */ __name(() => `{ ${this.from} | filter }`, "onNone"),
      onSome: /* @__PURE__ */ __name((expected) => isRefinement(this.from) ? String(this.from) + " & " + expected : expected, "onSome")
    })));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isRefinement = /* @__PURE__ */ createASTGuard("Refinement");
var defaultParseOption = {};
var isTransformation = /* @__PURE__ */ createASTGuard("Transformation");
var annotations = /* @__PURE__ */ __name((ast, overrides) => {
  const d = Object.getOwnPropertyDescriptors(ast);
  const base = {
    ...ast.annotations
  };
  delete base[IdentifierAnnotationId];
  const value = {
    ...base,
    ...overrides
  };
  const surrogate = getSurrogateAnnotation(ast);
  if (isSome2(surrogate)) {
    value[SurrogateAnnotationId] = annotations(surrogate.value, overrides);
  }
  d.annotations.value = value;
  return Object.create(Object.getPrototypeOf(ast), d);
}, "annotations");
var STRING_KEYWORD_PATTERN = "[\\s\\S]*?";
var NUMBER_KEYWORD_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
var getTemplateLiteralSpanTypePattern = /* @__PURE__ */ __name((type, capture2) => {
  switch (type._tag) {
    case "Literal":
      return escape(String(type.literal));
    case "StringKeyword":
      return STRING_KEYWORD_PATTERN;
    case "NumberKeyword":
      return NUMBER_KEYWORD_PATTERN;
    case "TemplateLiteral":
      return getTemplateLiteralPattern(type, capture2, false);
    case "Union":
      return type.types.map((type2) => getTemplateLiteralSpanTypePattern(type2, capture2)).join("|");
  }
}, "getTemplateLiteralSpanTypePattern");
var handleTemplateLiteralSpanTypeParens = /* @__PURE__ */ __name((type, s, capture2, top) => {
  if (isUnion(type)) {
    if (capture2 && !top) {
      return `(?:${s})`;
    }
  } else if (!capture2 || !top) {
    return s;
  }
  return `(${s})`;
}, "handleTemplateLiteralSpanTypeParens");
var getTemplateLiteralPattern = /* @__PURE__ */ __name((ast, capture2, top) => {
  let pattern = ``;
  if (ast.head !== "") {
    const head3 = escape(ast.head);
    pattern += capture2 && top ? `(${head3})` : head3;
  }
  for (const span2 of ast.spans) {
    const spanPattern = getTemplateLiteralSpanTypePattern(span2.type, capture2);
    pattern += handleTemplateLiteralSpanTypeParens(span2.type, spanPattern, capture2, top);
    if (span2.literal !== "") {
      const literal = escape(span2.literal);
      pattern += capture2 && top ? `(${literal})` : literal;
    }
  }
  return pattern;
}, "getTemplateLiteralPattern");
var getTemplateLiteralRegExp = /* @__PURE__ */ __name((ast) => new RegExp(`^${getTemplateLiteralPattern(ast, false, true)}$`), "getTemplateLiteralRegExp");
var pickAnnotations = /* @__PURE__ */ __name((annotationIds) => (annotated) => {
  let out = void 0;
  for (const id of annotationIds) {
    if (Object.prototype.hasOwnProperty.call(annotated.annotations, id)) {
      if (out === void 0) {
        out = {};
      }
      out[id] = annotated.annotations[id];
    }
  }
  return out;
}, "pickAnnotations");
var preserveTransformationAnnotations = /* @__PURE__ */ pickAnnotations([ExamplesAnnotationId, DefaultAnnotationId, JSONSchemaAnnotationId, ArbitraryAnnotationId, PrettyAnnotationId, EquivalenceAnnotationId]);
var typeAST = /* @__PURE__ */ __name((ast) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, typeAST);
      return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown, ast.annotations);
    }
    case "TupleType": {
      const elements = changeMap(ast.elements, (e) => {
        const type = typeAST(e.type);
        return type === e.type ? e : new OptionalType(type, e.isOptional);
      });
      const restASTs = getRestASTs(ast.rest);
      const rest = changeMap(restASTs, typeAST);
      return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((type) => new Type(type)), ast.isReadonly, ast.annotations);
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (p) => {
        const type = typeAST(p.type);
        return type === p.type ? p : new PropertySignature(p.name, type, p.isOptional, p.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is) => {
        const type = typeAST(is.type);
        return type === is.type ? is : new IndexSignature(is.parameter, type, is.isReadonly);
      });
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, ast.annotations);
    }
    case "Union": {
      const types = changeMap(ast.types, typeAST);
      return types === ast.types ? ast : Union.make(types, ast.annotations);
    }
    case "Suspend":
      return new Suspend(() => typeAST(ast.f()), ast.annotations);
    case "Refinement": {
      const from = typeAST(ast.from);
      return from === ast.from ? ast : new Refinement(from, ast.filter, ast.annotations);
    }
    case "Transformation": {
      const preserve = preserveTransformationAnnotations(ast);
      return typeAST(preserve !== void 0 ? annotations(ast.to, preserve) : ast.to);
    }
  }
  return ast;
}, "typeAST");
function changeMap(as4, f) {
  let changed = false;
  const out = allocate(as4.length);
  for (let i = 0; i < as4.length; i++) {
    const a = as4[i];
    const fa = f(a);
    if (fa !== a) {
      changed = true;
    }
    out[i] = fa;
  }
  return changed ? out : as4;
}
__name(changeMap, "changeMap");
var getTransformationFrom = /* @__PURE__ */ __name((ast) => {
  switch (ast._tag) {
    case "Transformation":
      return ast.from;
    case "Refinement":
      return getTransformationFrom(ast.from);
    case "Suspend":
      return getTransformationFrom(ast.f());
  }
}, "getTransformationFrom");
var encodedAST_ = /* @__PURE__ */ __name((ast, isBound) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, (ast2) => encodedAST_(ast2, isBound));
      return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown);
    }
    case "TupleType": {
      const elements = changeMap(ast.elements, (e) => {
        const type = encodedAST_(e.type, isBound);
        return type === e.type ? e : new OptionalType(type, e.isOptional);
      });
      const restASTs = getRestASTs(ast.rest);
      const rest = changeMap(restASTs, (ast2) => encodedAST_(ast2, isBound));
      return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((ast2) => new Type(ast2)), ast.isReadonly);
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (ps) => {
        const type = encodedAST_(ps.type, isBound);
        return type === ps.type ? ps : new PropertySignature(ps.name, type, ps.isOptional, ps.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is) => {
        const type = encodedAST_(is.type, isBound);
        return type === is.type ? is : new IndexSignature(is.parameter, type, is.isReadonly);
      });
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures);
    }
    case "Union": {
      const types = changeMap(ast.types, (ast2) => encodedAST_(ast2, isBound));
      return types === ast.types ? ast : Union.make(types);
    }
    case "Suspend": {
      let borrowedAnnotations = void 0;
      const identifier2 = getJSONIdentifier(ast);
      if (isSome2(identifier2)) {
        const suffix = isBound ? "Bound" : "";
        borrowedAnnotations = {
          [JSONIdentifierAnnotationId]: `${identifier2.value}Encoded${suffix}`
        };
      }
      return new Suspend(() => encodedAST_(ast.f(), isBound), borrowedAnnotations);
    }
    case "Refinement": {
      const from = encodedAST_(ast.from, isBound);
      if (isBound) {
        if (from === ast.from) return ast;
        if (getTransformationFrom(ast.from) === void 0 && hasStableFilter(ast)) {
          return new Refinement(from, ast.filter, ast.annotations);
        }
        return from;
      } else {
        return from;
      }
    }
    case "Transformation":
      return encodedAST_(ast.from, isBound);
  }
  return ast;
}, "encodedAST_");
var encodedAST = /* @__PURE__ */ __name((ast) => encodedAST_(ast, false), "encodedAST");
var toJSONAnnotations = /* @__PURE__ */ __name((annotations2) => {
  const out = {};
  for (const k of Object.getOwnPropertySymbols(annotations2)) {
    out[String(k)] = annotations2[k];
  }
  return out;
}, "toJSONAnnotations");
var getEncodedParameter = /* @__PURE__ */ __name((ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return ast;
    case "Refinement":
      return getEncodedParameter(ast.from);
  }
}, "getEncodedParameter");
var formatKeyword = /* @__PURE__ */ __name((ast) => getOrElse(getExpected(ast), () => ast._tag), "formatKeyword");
function getBrands(ast) {
  return match2(getBrandAnnotation(ast), {
    onNone: /* @__PURE__ */ __name(() => "", "onNone"),
    onSome: /* @__PURE__ */ __name((brands) => brands.map((brand) => ` & Brand<${formatUnknown(brand)}>`).join(""), "onSome")
  });
}
__name(getBrands, "getBrands");
var getOrElseExpected = /* @__PURE__ */ __name((ast) => getTitleAnnotation(ast).pipe(orElse(() => getDescriptionAnnotation(ast)), orElse(() => getAutoTitleAnnotation(ast)), map2((s) => s + getBrands(ast))), "getOrElseExpected");
var getExpected = /* @__PURE__ */ __name((ast) => orElse(getIdentifierAnnotation(ast), () => getOrElseExpected(ast)), "getExpected");
var pruneUndefined = /* @__PURE__ */ __name((ast, self, onTransformation) => {
  switch (ast._tag) {
    case "UndefinedKeyword":
      return neverKeyword;
    case "Union": {
      const types = [];
      let hasUndefined = false;
      for (const type of ast.types) {
        const pruned = self(type);
        if (pruned) {
          hasUndefined = true;
          if (!isNeverKeyword(pruned)) {
            types.push(pruned);
          }
        } else {
          types.push(type);
        }
      }
      if (hasUndefined) {
        return Union.make(types);
      }
      break;
    }
    case "Suspend":
      return self(ast.f());
    case "Transformation":
      return onTransformation(ast);
  }
}, "pruneUndefined");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Context.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/context.js
init_esm();
var TagTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Tag");
var ReferenceTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Reference");
var STMSymbolKey = "effect/STM";
var STMTypeId = /* @__PURE__ */ Symbol.for(STMSymbolKey);
var TagProto = {
  ...EffectPrototype,
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: {
    _Service: /* @__PURE__ */ __name((_) => _, "_Service"),
    _Identifier: /* @__PURE__ */ __name((_) => _, "_Identifier")
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make4(this, self);
  }
};
var ReferenceProto = {
  ...TagProto,
  [ReferenceTypeId]: ReferenceTypeId
};
var makeGenericTag = /* @__PURE__ */ __name((key) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag = Object.create(TagProto);
  Object.defineProperty(tag, "stack", {
    get() {
      return creationError.stack;
    }
  });
  tag.key = key;
  return tag;
}, "makeGenericTag");
var Reference = /* @__PURE__ */ __name(() => (id, options) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  function ReferenceClass() {
  }
  __name(ReferenceClass, "ReferenceClass");
  Object.setPrototypeOf(ReferenceClass, ReferenceProto);
  ReferenceClass.key = id;
  ReferenceClass.defaultValue = options.defaultValue;
  Object.defineProperty(ReferenceClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  return ReferenceClass;
}, "Reference");
var TypeId3 = /* @__PURE__ */ Symbol.for("effect/Context");
var ContextProto = {
  [TypeId3]: {
    _Services: /* @__PURE__ */ __name((_) => _, "_Services")
  },
  [symbol2](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol]() {
    return cached2(this, number(this.unsafeMap.size));
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var makeContext = /* @__PURE__ */ __name((unsafeMap) => {
  const context2 = Object.create(ContextProto);
  context2.unsafeMap = unsafeMap;
  return context2;
}, "makeContext");
var serviceNotFoundError = /* @__PURE__ */ __name((tag) => {
  const error2 = new Error(`Service not found${tag.key ? `: ${String(tag.key)}` : ""}`);
  if (tag.stack) {
    const lines = tag.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error2.message = error2.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error2.stack) {
    const lines = error2.stack.split("\n");
    lines.splice(1, 3);
    error2.stack = lines.join("\n");
  }
  return error2;
}, "serviceNotFoundError");
var isContext = /* @__PURE__ */ __name((u) => hasProperty(u, TypeId3), "isContext");
var isReference = /* @__PURE__ */ __name((u) => hasProperty(u, ReferenceTypeId), "isReference");
var _empty = /* @__PURE__ */ makeContext(/* @__PURE__ */ new Map());
var empty2 = /* @__PURE__ */ __name(() => _empty, "empty");
var make4 = /* @__PURE__ */ __name((tag, service) => makeContext(/* @__PURE__ */ new Map([[tag.key, service]])), "make");
var add = /* @__PURE__ */ dual(3, (self, tag, service) => {
  const map13 = new Map(self.unsafeMap);
  map13.set(tag.key, service);
  return makeContext(map13);
});
var defaultValueCache = /* @__PURE__ */ globalValue("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map());
var getDefaultValue = /* @__PURE__ */ __name((tag) => {
  if (defaultValueCache.has(tag.key)) {
    return defaultValueCache.get(tag.key);
  }
  const value = tag.defaultValue();
  defaultValueCache.set(tag.key, value);
  return value;
}, "getDefaultValue");
var unsafeGetReference = /* @__PURE__ */ __name((self, tag) => {
  return self.unsafeMap.has(tag.key) ? self.unsafeMap.get(tag.key) : getDefaultValue(tag);
}, "unsafeGetReference");
var unsafeGet2 = /* @__PURE__ */ dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag.key)) {
    if (ReferenceTypeId in tag) return getDefaultValue(tag);
    throw serviceNotFoundError(tag);
  }
  return self.unsafeMap.get(tag.key);
});
var get2 = unsafeGet2;
var getOption = /* @__PURE__ */ dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag.key)) {
    return isReference(tag) ? some(getDefaultValue(tag)) : none;
  }
  return some(self.unsafeMap.get(tag.key));
});
var merge2 = /* @__PURE__ */ dual(2, (self, that) => {
  const map13 = new Map(self.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map13.set(tag, s);
  }
  return makeContext(map13);
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Context.js
var GenericTag = makeGenericTag;
var empty3 = empty2;
var make5 = make4;
var add2 = add;
var get3 = get2;
var unsafeGet3 = unsafeGet2;
var getOption2 = getOption;
var merge3 = merge2;
var Reference2 = Reference;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/core.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Chunk.js
init_esm();
var TypeId4 = /* @__PURE__ */ Symbol.for("effect/Chunk");
function copy2(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
__name(copy2, "copy");
var emptyArray = [];
var getEquivalence2 = /* @__PURE__ */ __name((isEquivalent) => make((self, that) => self.length === that.length && toReadonlyArray(self).every((value, i) => isEquivalent(value, unsafeGet4(that, i)))), "getEquivalence");
var _equivalence3 = /* @__PURE__ */ getEquivalence2(equals);
var ChunkProto = {
  [TypeId4]: {
    _A: /* @__PURE__ */ __name((_) => _, "_A")
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isChunk(that) && _equivalence3(this, that);
  },
  [symbol]() {
    return cached2(this, array2(toReadonlyArray(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeChunk = /* @__PURE__ */ __name((backing) => {
  const chunk2 = Object.create(ChunkProto);
  chunk2.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk2.length = 0;
      chunk2.depth = 0;
      chunk2.left = chunk2;
      chunk2.right = chunk2;
      break;
    }
    case "IConcat": {
      chunk2.length = backing.left.length + backing.right.length;
      chunk2.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk2.left = backing.left;
      chunk2.right = backing.right;
      break;
    }
    case "IArray": {
      chunk2.length = backing.array.length;
      chunk2.depth = 0;
      chunk2.left = _empty2;
      chunk2.right = _empty2;
      break;
    }
    case "ISingleton": {
      chunk2.length = 1;
      chunk2.depth = 0;
      chunk2.left = _empty2;
      chunk2.right = _empty2;
      break;
    }
    case "ISlice": {
      chunk2.length = backing.length;
      chunk2.depth = backing.chunk.depth + 1;
      chunk2.left = _empty2;
      chunk2.right = _empty2;
      break;
    }
  }
  return chunk2;
}, "makeChunk");
var isChunk = /* @__PURE__ */ __name((u) => hasProperty(u, TypeId4), "isChunk");
var _empty2 = /* @__PURE__ */ makeChunk({
  _tag: "IEmpty"
});
var empty4 = /* @__PURE__ */ __name(() => _empty2, "empty");
var make6 = /* @__PURE__ */ __name((...as4) => unsafeFromNonEmptyArray(as4), "make");
var of2 = /* @__PURE__ */ __name((a) => makeChunk({
  _tag: "ISingleton",
  a
}), "of");
var fromIterable2 = /* @__PURE__ */ __name((self) => isChunk(self) ? self : unsafeFromArray(fromIterable(self)), "fromIterable");
var copyToArray = /* @__PURE__ */ __name((self, array3, initial) => {
  switch (self.backing._tag) {
    case "IArray": {
      copy2(self.backing.array, 0, array3, initial, self.length);
      break;
    }
    case "IConcat": {
      copyToArray(self.left, array3, initial);
      copyToArray(self.right, array3, initial + self.left.length);
      break;
    }
    case "ISingleton": {
      array3[initial] = self.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self.length) {
        array3[j] = unsafeGet4(self, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
}, "copyToArray");
var toReadonlyArray_ = /* @__PURE__ */ __name((self) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self.backing.array;
    }
    default: {
      const arr = new Array(self.length);
      copyToArray(self, arr, 0);
      self.backing = {
        _tag: "IArray",
        array: arr
      };
      self.left = _empty2;
      self.right = _empty2;
      self.depth = 0;
      return arr;
    }
  }
}, "toReadonlyArray_");
var toReadonlyArray = toReadonlyArray_;
var reverseChunk = /* @__PURE__ */ __name((self) => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse(self.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse2(self.backing.right),
        right: reverse2(self.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse(toReadonlyArray(self)));
  }
}, "reverseChunk");
var reverse2 = reverseChunk;
var unsafeFromArray = /* @__PURE__ */ __name((self) => self.length === 0 ? empty4() : self.length === 1 ? of2(self[0]) : makeChunk({
  _tag: "IArray",
  array: self
}), "unsafeFromArray");
var unsafeFromNonEmptyArray = /* @__PURE__ */ __name((self) => unsafeFromArray(self), "unsafeFromNonEmptyArray");
var unsafeGet4 = /* @__PURE__ */ dual(2, (self, index) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.a;
    }
    case "IArray": {
      if (index >= self.length || index < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.array[index];
    }
    case "IConcat": {
      return index < self.left.length ? unsafeGet4(self.left, index) : unsafeGet4(self.right, index - self.left.length);
    }
    case "ISlice": {
      return unsafeGet4(self.backing.chunk, index + self.backing.offset);
    }
  }
});
var append2 = /* @__PURE__ */ dual(2, (self, a) => appendAll2(self, of2(a)));
var prepend2 = /* @__PURE__ */ dual(2, (self, elem) => appendAll2(of2(elem), self));
var drop2 = /* @__PURE__ */ dual(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty2;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          offset: self.backing.offset + n,
          length: self.backing.length - n
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return drop2(self.right, n - self.left.length);
        }
        return makeChunk({
          _tag: "IConcat",
          left: drop2(self.left, n),
          right: self.right
        });
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self,
          offset: n,
          length: self.length - n
        });
      }
    }
  }
});
var appendAll2 = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self;
  }
  const diff8 = that.depth - self.depth;
  if (Math.abs(diff8) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self,
      right: that
    });
  } else if (diff8 < -1) {
    if (self.left.depth >= self.right.depth) {
      const nr = appendAll2(self.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self.left,
        right: nr
      });
    } else {
      const nrr = appendAll2(self.right.right, that);
      if (nrr.depth === self.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: self.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll2(self, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll2(self, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
var isEmpty = /* @__PURE__ */ __name((self) => self.length === 0, "isEmpty");
var isNonEmpty2 = /* @__PURE__ */ __name((self) => self.length > 0, "isNonEmpty");
var unsafeHead = /* @__PURE__ */ __name((self) => unsafeGet4(self, 0), "unsafeHead");
var headNonEmpty2 = unsafeHead;
var tailNonEmpty2 = /* @__PURE__ */ __name((self) => drop2(self, 1), "tailNonEmpty");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Duration.js
init_esm();
var TypeId5 = /* @__PURE__ */ Symbol.for("effect/Duration");
var bigint0 = /* @__PURE__ */ BigInt(0);
var bigint24 = /* @__PURE__ */ BigInt(24);
var bigint60 = /* @__PURE__ */ BigInt(60);
var bigint1e3 = /* @__PURE__ */ BigInt(1e3);
var bigint1e6 = /* @__PURE__ */ BigInt(1e6);
var bigint1e9 = /* @__PURE__ */ BigInt(1e9);
var DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
var decode = /* @__PURE__ */ __name((input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else if (Array.isArray(input) && input.length === 2 && input.every(isNumber)) {
    if (input[0] === -Infinity || input[1] === -Infinity || Number.isNaN(input[0]) || Number.isNaN(input[1])) {
      return zero;
    }
    if (input[0] === Infinity || input[1] === Infinity) {
      return infinity;
    }
    return nanos(BigInt(Math.round(input[0] * 1e9)) + BigInt(Math.round(input[1])));
  } else if (isString(input)) {
    const match8 = DURATION_REGEX.exec(input);
    if (match8) {
      const [_, valueStr, unit] = match8;
      const value = Number(valueStr);
      switch (unit) {
        case "nano":
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micro":
        case "micros":
          return micros(BigInt(valueStr));
        case "milli":
        case "millis":
          return millis(value);
        case "second":
        case "seconds":
          return seconds(value);
        case "minute":
        case "minutes":
          return minutes(value);
        case "hour":
        case "hours":
          return hours(value);
        case "day":
        case "days":
          return days(value);
        case "week":
        case "weeks":
          return weeks(value);
      }
    }
  }
  throw new Error("Invalid DurationInput");
}, "decode");
var zeroValue = {
  _tag: "Millis",
  millis: 0
};
var infinityValue = {
  _tag: "Infinity"
};
var DurationProto = {
  [TypeId5]: TypeId5,
  [symbol]() {
    return cached2(this, structure(this.value));
  },
  [symbol2](that) {
    return isDuration(that) && equals2(this, that);
  },
  toString() {
    return `Duration(${format2(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make7 = /* @__PURE__ */ __name((input) => {
  const duration = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input <= 0) {
      duration.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1e6))
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input <= bigint0) {
    duration.value = zeroValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration;
}, "make");
var isDuration = /* @__PURE__ */ __name((u) => hasProperty(u, TypeId5), "isDuration");
var isZero = /* @__PURE__ */ __name((self) => {
  switch (self.value._tag) {
    case "Millis": {
      return self.value.millis === 0;
    }
    case "Nanos": {
      return self.value.nanos === bigint0;
    }
    case "Infinity": {
      return false;
    }
  }
}, "isZero");
var zero = /* @__PURE__ */ make7(0);
var infinity = /* @__PURE__ */ make7(Infinity);
var nanos = /* @__PURE__ */ __name((nanos2) => make7(nanos2), "nanos");
var micros = /* @__PURE__ */ __name((micros2) => make7(micros2 * bigint1e3), "micros");
var millis = /* @__PURE__ */ __name((millis2) => make7(millis2), "millis");
var seconds = /* @__PURE__ */ __name((seconds2) => make7(seconds2 * 1e3), "seconds");
var minutes = /* @__PURE__ */ __name((minutes2) => make7(minutes2 * 6e4), "minutes");
var hours = /* @__PURE__ */ __name((hours2) => make7(hours2 * 36e5), "hours");
var days = /* @__PURE__ */ __name((days2) => make7(days2 * 864e5), "days");
var weeks = /* @__PURE__ */ __name((weeks2) => make7(weeks2 * 6048e5), "weeks");
var toMillis = /* @__PURE__ */ __name((self) => match4(self, {
  onMillis: /* @__PURE__ */ __name((millis2) => millis2, "onMillis"),
  onNanos: /* @__PURE__ */ __name((nanos2) => Number(nanos2) / 1e6, "onNanos")
}), "toMillis");
var unsafeToNanos = /* @__PURE__ */ __name((self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
}, "unsafeToNanos");
var toHrTime = /* @__PURE__ */ __name((self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1e3), Math.round(_self.value.millis % 1e3 * 1e6)];
  }
}, "toHrTime");
var match4 = /* @__PURE__ */ dual(2, (self, options) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
var matchWith = /* @__PURE__ */ dual(3, (self, that, options) => {
  const _self = decode(self);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
var Equivalence = /* @__PURE__ */ __name((self, that) => matchWith(self, that, {
  onMillis: /* @__PURE__ */ __name((self2, that2) => self2 === that2, "onMillis"),
  onNanos: /* @__PURE__ */ __name((self2, that2) => self2 === that2, "onNanos")
}), "Equivalence");
var lessThanOrEqualTo2 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: /* @__PURE__ */ __name((self2, that2) => self2 <= that2, "onMillis"),
  onNanos: /* @__PURE__ */ __name((self2, that2) => self2 <= that2, "onNanos")
}));
var greaterThanOrEqualTo2 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: /* @__PURE__ */ __name((self2, that2) => self2 >= that2, "onMillis"),
  onNanos: /* @__PURE__ */ __name((self2, that2) => self2 >= that2, "onNanos")
}));
var equals2 = /* @__PURE__ */ dual(2, (self, that) => Equivalence(decode(self), decode(that)));
var parts = /* @__PURE__ */ __name((self) => {
  const duration = decode(self);
  if (duration.value._tag === "Infinity") {
    return {
      days: Infinity,
      hours: Infinity,
      minutes: Infinity,
      seconds: Infinity,
      millis: Infinity,
      nanos: Infinity
    };
  }
  const nanos2 = unsafeToNanos(duration);
  const ms = nanos2 / bigint1e6;
  const sec = ms / bigint1e3;
  const min2 = sec / bigint60;
  const hr = min2 / bigint60;
  const days2 = hr / bigint24;
  return {
    days: Number(days2),
    hours: Number(hr % bigint24),
    minutes: Number(min2 % bigint60),
    seconds: Number(sec % bigint60),
    millis: Number(ms % bigint1e3),
    nanos: Number(nanos2 % bigint1e6)
  };
}, "parts");
var format2 = /* @__PURE__ */ __name((self) => {
  const duration = decode(self);
  if (duration.value._tag === "Infinity") {
    return "Infinity";
  }
  if (isZero(duration)) {
    return "0";
  }
  const fragments = parts(duration);
  const pieces = [];
  if (fragments.days !== 0) {
    pieces.push(`${fragments.days}d`);
  }
  if (fragments.hours !== 0) {
    pieces.push(`${fragments.hours}h`);
  }
  if (fragments.minutes !== 0) {
    pieces.push(`${fragments.minutes}m`);
  }
  if (fragments.seconds !== 0) {
    pieces.push(`${fragments.seconds}s`);
  }
  if (fragments.millis !== 0) {
    pieces.push(`${fragments.millis}ms`);
  }
  if (fragments.nanos !== 0) {
    pieces.push(`${fragments.nanos}ns`);
  }
  return pieces.join(" ");
}, "format");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberId.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberId.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/HashSet.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashSet.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap/bitwise.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap/config.js
init_esm();
var SIZE = 5;
var BUCKET_SIZE = /* @__PURE__ */ Math.pow(2, SIZE);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap/bitwise.js
function popcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
__name(popcount, "popcount");
function hashFragment(shift, h) {
  return h >>> shift & MASK;
}
__name(hashFragment, "hashFragment");
function toBitmap(x) {
  return 1 << x;
}
__name(toBitmap, "toBitmap");
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}
__name(fromBitmap, "fromBitmap");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap/node.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/stack.js
init_esm();
var make8 = /* @__PURE__ */ __name((value, previous) => ({
  value,
  previous
}), "make");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap/array.js
init_esm();
function arrayUpdate(mutate3, at, v, arr) {
  let out = arr;
  if (!mutate3) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i) out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
__name(arrayUpdate, "arrayUpdate");
function arraySpliceOut(mutate3, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate3) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at) out[g++] = arr[i++];
  }
  ++i;
  while (i <= newLen) out[g++] = arr[i++];
  if (mutate3) {
    out.length = newLen;
  }
  return out;
}
__name(arraySpliceOut, "arraySpliceOut");
function arraySpliceIn(mutate3, at, v, arr) {
  const len = arr.length;
  if (mutate3) {
    let i2 = len;
    while (i2 >= at) arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at) out[g++] = arr[i++];
  out[at] = v;
  while (i < len) out[++g] = arr[i++];
  return out;
}
__name(arraySpliceIn, "arraySpliceIn");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap/node.js
var EmptyNode = class _EmptyNode {
  static {
    __name(this, "EmptyNode");
  }
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash2, key, size7) {
    const v = f(none2());
    if (isNone2(v)) return new _EmptyNode();
    ++size7.value;
    return new LeafNode(edit, hash2, key, v);
  }
};
function isEmptyNode(a) {
  return isTagged(a, "EmptyNode");
}
__name(isEmptyNode, "isEmptyNode");
function isLeafNode(node) {
  return isEmptyNode(node) || node._tag === "LeafNode" || node._tag === "CollisionNode";
}
__name(isLeafNode, "isLeafNode");
function canEditNode(node, edit) {
  return isEmptyNode(node) ? false : edit === node.edit;
}
__name(canEditNode, "canEditNode");
var LeafNode = class _LeafNode {
  static {
    __name(this, "LeafNode");
  }
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash2, key, value) {
    this.edit = edit;
    this.hash = hash2;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift, f, hash2, key, size7) {
    if (equals(key, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value) return this;
      else if (isNone2(v2)) {
        --size7.value;
        return new EmptyNode();
      }
      if (canEditNode(this, edit)) {
        this.value = v2;
        return this;
      }
      return new _LeafNode(edit, hash2, key, v2);
    }
    const v = f(none2());
    if (isNone2(v)) return this;
    ++size7.value;
    return mergeLeaves(edit, shift, this.hash, this, hash2, new _LeafNode(edit, hash2, key, v));
  }
};
var CollisionNode = class _CollisionNode {
  static {
    __name(this, "CollisionNode");
  }
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash2, children) {
    this.edit = edit;
    this.hash = hash2;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key, size7) {
    if (hash2 === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size7);
      if (list === this.children) return this;
      return list.length > 1 ? new _CollisionNode(edit, this.hash, list) : list[0];
    }
    const v = f(none2());
    if (isNone2(v)) return this;
    ++size7.value;
    return mergeLeaves(edit, shift, this.hash, this, hash2, new LeafNode(edit, hash2, key, v));
  }
  updateCollisionList(mutate3, edit, hash2, list, f, key, size7) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child = list[i];
      if ("key" in child && equals(key, child.key)) {
        const value = child.value;
        const newValue2 = f(value);
        if (newValue2 === value) return list;
        if (isNone2(newValue2)) {
          --size7.value;
          return arraySpliceOut(mutate3, i, list);
        }
        return arrayUpdate(mutate3, i, new LeafNode(edit, hash2, key, newValue2), list);
      }
    }
    const newValue = f(none2());
    if (isNone2(newValue)) return list;
    ++size7.value;
    return arrayUpdate(mutate3, len, new LeafNode(edit, hash2, key, newValue), list);
  }
};
var IndexedNode = class _IndexedNode {
  static {
    __name(this, "IndexedNode");
  }
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key, size7) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment(shift, hash2);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists3 = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists3) {
      const _newChild = new EmptyNode().modify(edit, shift + SIZE, f, hash2, key, size7);
      if (!_newChild) return this;
      return children.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new _IndexedNode(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child = current.modify(edit, shift + SIZE, f, hash2, key, size7);
    if (current === child) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode();
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new _IndexedNode(edit, bitmap, newChildren);
  }
};
var ArrayNode = class _ArrayNode {
  static {
    __name(this, "ArrayNode");
  }
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size7, children) {
    this.edit = edit;
    this.size = size7;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key, size7) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment(shift, hash2);
    const child = children[frag];
    const newChild = (child || new EmptyNode()).modify(edit, shift + SIZE, f, hash2, key, size7);
    if (child === newChild) return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      --count;
      if (count <= MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new _ArrayNode(edit, count, newChildren);
  }
};
function pack(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children);
}
__name(pack, "pack");
function expand(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count + 1, arr);
}
__name(expand, "expand");
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift, h1);
  const subH2 = hashFragment(shift, h2);
  if (subH1 === subH2) {
    return (child) => new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
  }
}
__name(mergeLeavesInner, "mergeLeavesInner");
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
  let stack = void 0;
  let currentShift = shift;
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = make8(res, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}
__name(mergeLeaves, "mergeLeaves");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashMap.js
var HashMapSymbolKey = "effect/HashMap";
var HashMapTypeId = /* @__PURE__ */ Symbol.for(HashMapSymbolKey);
var HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol]() {
    let hash2 = hash(HashMapSymbolKey);
    for (const item of this) {
      hash2 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return cached2(this, hash2);
  },
  [symbol2](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe(that, getHash(item[0], hash(item[0])));
        if (isNone2(elem)) {
          return false;
        } else {
          if (!equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl = /* @__PURE__ */ __name((editable, edit, root, size7) => {
  const map13 = Object.create(HashMapProto);
  map13._editable = editable;
  map13._edit = edit;
  map13._root = root;
  map13._size = size7;
  return map13;
}, "makeImpl");
var HashMapIterator = class _HashMapIterator {
  static {
    __name(this, "HashMapIterator");
  }
  map;
  f;
  v;
  constructor(map13, f) {
    this.map = map13;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, void 0);
  }
  next() {
    if (isNone2(this.v)) {
      return {
        done: true,
        value: void 0
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new _HashMapIterator(this.map, this.f);
  }
};
var applyCont = /* @__PURE__ */ __name((cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none2(), "applyCont");
var visitLazy = /* @__PURE__ */ __name((node, f, cont = void 0) => {
  switch (node._tag) {
    case "LeafNode": {
      if (isSome2(node.value)) {
        return some2({
          value: f(node.key, node.value.value),
          cont
        });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node.children;
      return visitLazyChildren(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
}, "visitLazy");
var visitLazyChildren = /* @__PURE__ */ __name((len, children, i, f, cont) => {
  while (i < len) {
    const child = children[i++];
    if (child && !isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
}, "visitLazyChildren");
var _empty3 = /* @__PURE__ */ makeImpl(false, 0, /* @__PURE__ */ new EmptyNode(), 0);
var empty5 = /* @__PURE__ */ __name(() => _empty3, "empty");
var fromIterable3 = /* @__PURE__ */ __name((entries2) => {
  const map13 = beginMutation(empty5());
  for (const entry of entries2) {
    set(map13, entry[0], entry[1]);
  }
  return endMutation(map13);
}, "fromIterable");
var isHashMap = /* @__PURE__ */ __name((u) => hasProperty(u, HashMapTypeId), "isHashMap");
var isEmpty2 = /* @__PURE__ */ __name((self) => self && isEmptyNode(self._root), "isEmpty");
var get4 = /* @__PURE__ */ dual(2, (self, key) => getHash(self, key, hash(key)));
var getHash = /* @__PURE__ */ dual(3, (self, key, hash2) => {
  let node = self._root;
  let shift = 0;
  while (true) {
    switch (node._tag) {
      case "LeafNode": {
        return equals(key, node.key) ? node.value : none2();
      }
      case "CollisionNode": {
        if (hash2 === node.hash) {
          const children = node.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child = children[i];
            if ("key" in child && equals(key, child.key)) {
              return child.value;
            }
          }
        }
        return none2();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash2);
        const bit = toBitmap(frag);
        if (node.mask & bit) {
          node = node.children[fromBitmap(node.mask, bit)];
          shift += SIZE;
          break;
        }
        return none2();
      }
      case "ArrayNode": {
        node = node.children[hashFragment(shift, hash2)];
        if (node) {
          shift += SIZE;
          break;
        }
        return none2();
      }
      default:
        return none2();
    }
  }
});
var has2 = /* @__PURE__ */ dual(2, (self, key) => isSome2(getHash(self, key, hash(key))));
var set = /* @__PURE__ */ dual(3, (self, key, value) => modifyAt(self, key, () => some2(value)));
var setTree = /* @__PURE__ */ dual(3, (self, newRoot, newSize) => {
  if (self._editable) {
    ;
    self._root = newRoot;
    self._size = newSize;
    return self;
  }
  return newRoot === self._root ? self : makeImpl(self._editable, self._edit, newRoot, newSize);
});
var keys2 = /* @__PURE__ */ __name((self) => new HashMapIterator(self, (key) => key), "keys");
var size = /* @__PURE__ */ __name((self) => self._size, "size");
var beginMutation = /* @__PURE__ */ __name((self) => makeImpl(true, self._edit + 1, self._root, self._size), "beginMutation");
var endMutation = /* @__PURE__ */ __name((self) => {
  ;
  self._editable = false;
  return self;
}, "endMutation");
var modifyAt = /* @__PURE__ */ dual(3, (self, key, f) => modifyHash(self, key, hash(key), f));
var modifyHash = /* @__PURE__ */ dual(4, (self, key, hash2, f) => {
  const size7 = {
    value: self._size
  };
  const newRoot = self._root.modify(self._editable ? self._edit : NaN, 0, f, hash2, key, size7);
  return pipe(self, setTree(newRoot, size7.value));
});
var remove2 = /* @__PURE__ */ dual(2, (self, key) => modifyAt(self, key, none2));
var map4 = /* @__PURE__ */ dual(2, (self, f) => reduce2(self, empty5(), (map13, value, key) => set(map13, key, f(value, key))));
var forEach = /* @__PURE__ */ dual(2, (self, f) => reduce2(self, void 0, (_, value, key) => f(value, key)));
var reduce2 = /* @__PURE__ */ dual(3, (self, zero2, f) => {
  const root = self._root;
  if (root._tag === "LeafNode") {
    return isSome2(root.value) ? f(zero2, root.value.value, root.key) : zero2;
  }
  if (root._tag === "EmptyNode") {
    return zero2;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length; i < len; ) {
      const child = children[i++];
      if (child && !isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (isSome2(child.value)) {
            zero2 = f(zero2, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero2;
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/hashSet.js
var HashSetSymbolKey = "effect/HashSet";
var HashSetTypeId = /* @__PURE__ */ Symbol.for(HashSetSymbolKey);
var HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys2(this._keyMap);
  },
  [symbol]() {
    return cached2(this, combine(hash(this._keyMap))(hash(HashSetSymbolKey)));
  },
  [symbol2](that) {
    if (isHashSet(that)) {
      return size(this._keyMap) === size(that._keyMap) && equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl2 = /* @__PURE__ */ __name((keyMap) => {
  const set5 = Object.create(HashSetProto);
  set5._keyMap = keyMap;
  return set5;
}, "makeImpl");
var isHashSet = /* @__PURE__ */ __name((u) => hasProperty(u, HashSetTypeId), "isHashSet");
var _empty4 = /* @__PURE__ */ makeImpl2(/* @__PURE__ */ empty5());
var empty6 = /* @__PURE__ */ __name(() => _empty4, "empty");
var fromIterable4 = /* @__PURE__ */ __name((elements) => {
  const set5 = beginMutation2(empty6());
  for (const value of elements) {
    add3(set5, value);
  }
  return endMutation2(set5);
}, "fromIterable");
var make9 = /* @__PURE__ */ __name((...elements) => {
  const set5 = beginMutation2(empty6());
  for (const value of elements) {
    add3(set5, value);
  }
  return endMutation2(set5);
}, "make");
var has3 = /* @__PURE__ */ dual(2, (self, value) => has2(self._keyMap, value));
var size2 = /* @__PURE__ */ __name((self) => size(self._keyMap), "size");
var beginMutation2 = /* @__PURE__ */ __name((self) => makeImpl2(beginMutation(self._keyMap)), "beginMutation");
var endMutation2 = /* @__PURE__ */ __name((self) => {
  ;
  self._keyMap._editable = false;
  return self;
}, "endMutation");
var mutate = /* @__PURE__ */ dual(2, (self, f) => {
  const transient = beginMutation2(self);
  f(transient);
  return endMutation2(transient);
});
var add3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (set(value, true)(self._keyMap), self) : makeImpl2(set(value, true)(self._keyMap)));
var remove3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (remove2(value)(self._keyMap), self) : makeImpl2(remove2(value)(self._keyMap)));
var difference2 = /* @__PURE__ */ dual(2, (self, that) => mutate(self, (set5) => {
  for (const value of that) {
    remove3(set5, value);
  }
}));
var union2 = /* @__PURE__ */ dual(2, (self, that) => mutate(empty6(), (set5) => {
  forEach2(self, (value) => add3(set5, value));
  for (const value of that) {
    add3(set5, value);
  }
}));
var forEach2 = /* @__PURE__ */ dual(2, (self, f) => forEach(self._keyMap, (_, k) => f(k)));
var reduce3 = /* @__PURE__ */ dual(3, (self, zero2, f) => reduce2(self._keyMap, zero2, (z, _, a) => f(z, a)));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/HashSet.js
var empty7 = empty6;
var fromIterable5 = fromIterable4;
var make10 = make9;
var has4 = has3;
var size3 = size2;
var add4 = add3;
var remove4 = remove3;
var difference3 = difference2;
var union3 = union2;
var reduce4 = reduce3;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/MutableRef.js
init_esm();
var TypeId6 = /* @__PURE__ */ Symbol.for("effect/MutableRef");
var MutableRefProto = {
  [TypeId6]: TypeId6,
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJSON(this.current)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make11 = /* @__PURE__ */ __name((value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
}, "make");
var get5 = /* @__PURE__ */ __name((self) => self.current, "get");
var set2 = /* @__PURE__ */ dual(2, (self, value) => {
  self.current = value;
  return self;
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberId.js
var FiberIdSymbolKey = "effect/FiberId";
var FiberIdTypeId = /* @__PURE__ */ Symbol.for(FiberIdSymbolKey);
var OP_NONE = "None";
var OP_RUNTIME = "Runtime";
var OP_COMPOSITE = "Composite";
var emptyHash = /* @__PURE__ */ string(`${FiberIdSymbolKey}-${OP_NONE}`);
var None = class {
  static {
    __name(this, "None");
  }
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  id = -1;
  startTimeMillis = -1;
  [symbol]() {
    return emptyHash;
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Runtime = class {
  static {
    __name(this, "Runtime");
  }
  id;
  startTimeMillis;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id, startTimeMillis) {
    this.id = id;
    this.startTimeMillis = startTimeMillis;
  }
  [symbol]() {
    return cached2(this, string(`${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Composite = class {
  static {
    __name(this, "Composite");
  }
  left;
  right;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_COMPOSITE;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  _hash;
  [symbol]() {
    return pipe(string(`${FiberIdSymbolKey}-${this._tag}`), combine(hash(this.left)), combine(hash(this.right)), cached2(this));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_COMPOSITE && equals(this.left, that.left) && equals(this.right, that.right);
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: toJSON(this.left),
      right: toJSON(this.right)
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var none3 = /* @__PURE__ */ new None();
var isFiberId = /* @__PURE__ */ __name((self) => hasProperty(self, FiberIdTypeId), "isFiberId");
var ids = /* @__PURE__ */ __name((self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty7();
    }
    case OP_RUNTIME: {
      return make10(self.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids(self.left), union3(ids(self.right)));
    }
  }
}, "ids");
var _fiberCounter = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make11(0));
var threadName = /* @__PURE__ */ __name((self) => {
  const identifiers = Array.from(ids(self)).map((n) => `#${n}`).join(",");
  return identifiers;
}, "threadName");
var unsafeMake = /* @__PURE__ */ __name(() => {
  const id = get5(_fiberCounter);
  pipe(_fiberCounter, set2(id + 1));
  return new Runtime(id, Date.now());
}, "unsafeMake");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberId.js
var none4 = none3;
var threadName2 = threadName;
var unsafeMake2 = unsafeMake;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/HashMap.js
init_esm();
var empty8 = empty5;
var fromIterable6 = fromIterable3;
var isEmpty3 = isEmpty2;
var get6 = get4;
var set3 = set;
var keys3 = keys2;
var modifyAt2 = modifyAt;
var map6 = map4;
var reduce5 = reduce2;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/List.js
init_esm();
var TypeId7 = /* @__PURE__ */ Symbol.for("effect/List");
var toArray2 = /* @__PURE__ */ __name((self) => fromIterable(self), "toArray");
var getEquivalence3 = /* @__PURE__ */ __name((isEquivalent) => mapInput(getEquivalence(isEquivalent), toArray2), "getEquivalence");
var _equivalence4 = /* @__PURE__ */ getEquivalence3(equals);
var ConsProto = {
  [TypeId7]: TypeId7,
  _tag: "Cons",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: toArray2(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag && _equivalence4(this, that);
  },
  [symbol]() {
    return cached2(this, array2(toArray2(this)));
  },
  [Symbol.iterator]() {
    let done4 = false;
    let self = this;
    return {
      next() {
        if (done4) {
          return this.return();
        }
        if (self._tag === "Nil") {
          done4 = true;
          return this.return();
        }
        const value = self.head;
        self = self.tail;
        return {
          done: done4,
          value
        };
      },
      return(value) {
        if (!done4) {
          done4 = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeCons = /* @__PURE__ */ __name((head3, tail) => {
  const cons2 = Object.create(ConsProto);
  cons2.head = head3;
  cons2.tail = tail;
  return cons2;
}, "makeCons");
var NilHash = /* @__PURE__ */ string("Nil");
var NilProto = {
  [TypeId7]: TypeId7,
  _tag: "Nil",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol]() {
    return NilHash;
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var _Nil = /* @__PURE__ */ Object.create(NilProto);
var isList = /* @__PURE__ */ __name((u) => hasProperty(u, TypeId7), "isList");
var isNil = /* @__PURE__ */ __name((self) => self._tag === "Nil", "isNil");
var isCons = /* @__PURE__ */ __name((self) => self._tag === "Cons", "isCons");
var nil = /* @__PURE__ */ __name(() => _Nil, "nil");
var cons = /* @__PURE__ */ __name((head3, tail) => makeCons(head3, tail), "cons");
var empty9 = nil;
var of3 = /* @__PURE__ */ __name((value) => makeCons(value, _Nil), "of");
var appendAll3 = /* @__PURE__ */ dual(2, (self, that) => prependAll(that, self));
var prepend3 = /* @__PURE__ */ dual(2, (self, element) => cons(element, self));
var prependAll = /* @__PURE__ */ dual(2, (self, prefix) => {
  if (isNil(self)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self;
  } else {
    const result = makeCons(prefix.head, self);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
var reduce6 = /* @__PURE__ */ dual(3, (self, zero2, f) => {
  let acc = zero2;
  let these = self;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
var reverse3 = /* @__PURE__ */ __name((self) => {
  let result = empty9();
  let these = self;
  while (!isNil(these)) {
    result = prepend3(result, these.head);
    these = these.tail;
  }
  return result;
}, "reverse");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/RuntimeFlagsPatch.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/runtimeFlags.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/differ.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/data.js
init_esm();
var ArrayProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Array.prototype), {
  [symbol]() {
    return cached2(this, array2(this));
  },
  [symbol2](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => equals(v, that[i]));
    } else {
      return false;
    }
  }
});
var Structural = /* @__PURE__ */ function() {
  function Structural2(args2) {
    if (args2) {
      Object.assign(this, args2);
    }
  }
  __name(Structural2, "Structural");
  Structural2.prototype = StructuralPrototype;
  return Structural2;
}();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/differ/contextPatch.js
init_esm();
var ContextPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function variance(a) {
  return a;
}
__name(variance, "variance");
var PatchProto = {
  ...Structural.prototype,
  [ContextPatchTypeId]: {
    _Value: variance,
    _Patch: variance
  }
};
var EmptyProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Empty"
});
var _empty5 = /* @__PURE__ */ Object.create(EmptyProto);
var empty10 = /* @__PURE__ */ __name(() => _empty5, "empty");
var AndThenProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AndThen"
});
var makeAndThen = /* @__PURE__ */ __name((first2, second) => {
  const o2 = Object.create(AndThenProto);
  o2.first = first2;
  o2.second = second;
  return o2;
}, "makeAndThen");
var AddServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AddService"
});
var makeAddService = /* @__PURE__ */ __name((key, service) => {
  const o2 = Object.create(AddServiceProto);
  o2.key = key;
  o2.service = service;
  return o2;
}, "makeAddService");
var RemoveServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "RemoveService"
});
var makeRemoveService = /* @__PURE__ */ __name((key) => {
  const o2 = Object.create(RemoveServiceProto);
  o2.key = key;
  return o2;
}, "makeRemoveService");
var UpdateServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "UpdateService"
});
var makeUpdateService = /* @__PURE__ */ __name((key, update3) => {
  const o2 = Object.create(UpdateServiceProto);
  o2.key = key;
  o2.update = update3;
  return o2;
}, "makeUpdateService");
var diff = /* @__PURE__ */ __name((oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch9 = empty10();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!equals(old, newService)) {
        patch9 = combine3(makeUpdateService(tag, () => newService))(patch9);
      }
    } else {
      missingServices.delete(tag);
      patch9 = combine3(makeAddService(tag, newService))(patch9);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch9 = combine3(makeRemoveService(tag))(patch9);
  }
  return patch9;
}, "diff");
var combine3 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen(self, that));
var patch = /* @__PURE__ */ dual(2, (self, context2) => {
  if (self._tag === "Empty") {
    return context2;
  }
  let wasServiceUpdated = false;
  let patches = of2(self);
  const updatedContext = new Map(context2.unsafeMap);
  while (isNonEmpty2(patches)) {
    const head3 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head3.key, head3.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(prepend2(tail, head3.second), head3.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head3.key);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head3.key, head3.update(updatedContext.get(head3.key)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map13 = /* @__PURE__ */ new Map();
  for (const [tag] of context2.unsafeMap) {
    if (updatedContext.has(tag)) {
      map13.set(tag, updatedContext.get(tag));
      updatedContext.delete(tag);
    }
  }
  for (const [tag, s] of updatedContext) {
    map13.set(tag, s);
  }
  return makeContext(map13);
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/differ/hashSetPatch.js
init_esm();
var HashSetPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function variance2(a) {
  return a;
}
__name(variance2, "variance");
var PatchProto2 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance2,
    _Key: variance2,
    _Patch: variance2
  }
};
var EmptyProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Empty"
});
var _empty6 = /* @__PURE__ */ Object.create(EmptyProto2);
var empty11 = /* @__PURE__ */ __name(() => _empty6, "empty");
var AndThenProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "AndThen"
});
var makeAndThen2 = /* @__PURE__ */ __name((first2, second) => {
  const o2 = Object.create(AndThenProto2);
  o2.first = first2;
  o2.second = second;
  return o2;
}, "makeAndThen");
var AddProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Add"
});
var makeAdd = /* @__PURE__ */ __name((value) => {
  const o2 = Object.create(AddProto);
  o2.value = value;
  return o2;
}, "makeAdd");
var RemoveProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Remove"
});
var makeRemove = /* @__PURE__ */ __name((value) => {
  const o2 = Object.create(RemoveProto);
  o2.value = value;
  return o2;
}, "makeRemove");
var diff2 = /* @__PURE__ */ __name((oldValue, newValue) => {
  const [removed, patch9] = reduce4([oldValue, empty11()], ([set5, patch10], value) => {
    if (has4(value)(set5)) {
      return [remove4(value)(set5), patch10];
    }
    return [set5, combine4(makeAdd(value))(patch10)];
  })(newValue);
  return reduce4(patch9, (patch10, value) => combine4(makeRemove(value))(patch10))(removed);
}, "diff");
var combine4 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen2(self, that));
var patch2 = /* @__PURE__ */ dual(2, (self, oldValue) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let set5 = oldValue;
  let patches = of2(self);
  while (isNonEmpty2(patches)) {
    const head3 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(head3.first)(prepend2(head3.second)(tail));
        break;
      }
      case "Add": {
        set5 = add4(head3.value)(set5);
        patches = tail;
        break;
      }
      case "Remove": {
        set5 = remove4(head3.value)(set5);
        patches = tail;
      }
    }
  }
  return set5;
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/differ/readonlyArrayPatch.js
init_esm();
var ReadonlyArrayPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function variance3(a) {
  return a;
}
__name(variance3, "variance");
var PatchProto3 = {
  ...Structural.prototype,
  [ReadonlyArrayPatchTypeId]: {
    _Value: variance3,
    _Patch: variance3
  }
};
var EmptyProto3 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Empty"
});
var _empty7 = /* @__PURE__ */ Object.create(EmptyProto3);
var empty12 = /* @__PURE__ */ __name(() => _empty7, "empty");
var AndThenProto3 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "AndThen"
});
var makeAndThen3 = /* @__PURE__ */ __name((first2, second) => {
  const o2 = Object.create(AndThenProto3);
  o2.first = first2;
  o2.second = second;
  return o2;
}, "makeAndThen");
var AppendProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Append"
});
var makeAppend = /* @__PURE__ */ __name((values3) => {
  const o2 = Object.create(AppendProto);
  o2.values = values3;
  return o2;
}, "makeAppend");
var SliceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Slice"
});
var makeSlice = /* @__PURE__ */ __name((from, until) => {
  const o2 = Object.create(SliceProto);
  o2.from = from;
  o2.until = until;
  return o2;
}, "makeSlice");
var UpdateProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Update"
});
var makeUpdate = /* @__PURE__ */ __name((index, patch9) => {
  const o2 = Object.create(UpdateProto);
  o2.index = index;
  o2.patch = patch9;
  return o2;
}, "makeUpdate");
var diff3 = /* @__PURE__ */ __name((options) => {
  let i = 0;
  let patch9 = empty12();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = options.oldValue[i];
    const newElement = options.newValue[i];
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!equals(valuePatch, options.differ.empty)) {
      patch9 = combine5(patch9, makeUpdate(i, valuePatch));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch9 = combine5(patch9, makeSlice(0, i));
  }
  if (i < options.newValue.length) {
    patch9 = combine5(patch9, makeAppend(drop(i)(options.newValue)));
  }
  return patch9;
}, "diff");
var combine5 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen3(self, that));
var patch3 = /* @__PURE__ */ dual(3, (self, oldValue, differ3) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let readonlyArray2 = oldValue.slice();
  let patches = of(self);
  while (isNonEmptyArray2(patches)) {
    const head3 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head3._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        tail.unshift(head3.first, head3.second);
        patches = tail;
        break;
      }
      case "Append": {
        for (const value of head3.values) {
          readonlyArray2.push(value);
        }
        patches = tail;
        break;
      }
      case "Slice": {
        readonlyArray2 = readonlyArray2.slice(head3.from, head3.until);
        patches = tail;
        break;
      }
      case "Update": {
        readonlyArray2[head3.index] = differ3.patch(head3.patch, readonlyArray2[head3.index]);
        patches = tail;
        break;
      }
    }
  }
  return readonlyArray2;
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/differ.js
var DifferTypeId = /* @__PURE__ */ Symbol.for("effect/Differ");
var DifferProto = {
  [DifferTypeId]: {
    _P: identity,
    _V: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make14 = /* @__PURE__ */ __name((params) => {
  const differ3 = Object.create(DifferProto);
  differ3.empty = params.empty;
  differ3.diff = params.diff;
  differ3.combine = params.combine;
  differ3.patch = params.patch;
  return differ3;
}, "make");
var environment = /* @__PURE__ */ __name(() => make14({
  empty: empty10(),
  combine: /* @__PURE__ */ __name((first2, second) => combine3(second)(first2), "combine"),
  diff: /* @__PURE__ */ __name((oldValue, newValue) => diff(oldValue, newValue), "diff"),
  patch: /* @__PURE__ */ __name((patch9, oldValue) => patch(oldValue)(patch9), "patch")
}), "environment");
var hashSet = /* @__PURE__ */ __name(() => make14({
  empty: empty11(),
  combine: /* @__PURE__ */ __name((first2, second) => combine4(second)(first2), "combine"),
  diff: /* @__PURE__ */ __name((oldValue, newValue) => diff2(oldValue, newValue), "diff"),
  patch: /* @__PURE__ */ __name((patch9, oldValue) => patch2(oldValue)(patch9), "patch")
}), "hashSet");
var readonlyArray = /* @__PURE__ */ __name((differ3) => make14({
  empty: empty12(),
  combine: /* @__PURE__ */ __name((first2, second) => combine5(first2, second), "combine"),
  diff: /* @__PURE__ */ __name((oldValue, newValue) => diff3({
    oldValue,
    newValue,
    differ: differ3
  }), "diff"),
  patch: /* @__PURE__ */ __name((patch9, oldValue) => patch3(patch9, oldValue, differ3), "patch")
}), "readonlyArray");
var update = /* @__PURE__ */ __name(() => updateWith((_, a) => a), "update");
var updateWith = /* @__PURE__ */ __name((f) => make14({
  empty: identity,
  combine: /* @__PURE__ */ __name((first2, second) => {
    if (first2 === identity) {
      return second;
    }
    if (second === identity) {
      return first2;
    }
    return (a) => second(first2(a));
  }, "combine"),
  diff: /* @__PURE__ */ __name((oldValue, newValue) => {
    if (equals(oldValue, newValue)) {
      return identity;
    }
    return constant(newValue);
  }, "diff"),
  patch: /* @__PURE__ */ __name((patch9, oldValue) => f(oldValue, patch9(oldValue)), "patch")
}), "updateWith");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/runtimeFlagsPatch.js
init_esm();
var BIT_MASK = 255;
var BIT_SHIFT = 8;
var active = /* @__PURE__ */ __name((patch9) => patch9 & BIT_MASK, "active");
var enabled = /* @__PURE__ */ __name((patch9) => patch9 >> BIT_SHIFT & BIT_MASK, "enabled");
var make15 = /* @__PURE__ */ __name((active2, enabled2) => (active2 & BIT_MASK) + ((enabled2 & active2 & BIT_MASK) << BIT_SHIFT), "make");
var empty13 = /* @__PURE__ */ make15(0, 0);
var enable = /* @__PURE__ */ __name((flag) => make15(flag, flag), "enable");
var disable = /* @__PURE__ */ __name((flag) => make15(flag, 0), "disable");
var exclude = /* @__PURE__ */ dual(2, (self, flag) => make15(active(self) & ~flag, enabled(self)));
var andThen = /* @__PURE__ */ dual(2, (self, that) => self | that);
var invert = /* @__PURE__ */ __name((n) => ~n >>> 0 & BIT_MASK, "invert");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/runtimeFlags.js
var None2 = 0;
var Interruption = 1 << 0;
var OpSupervision = 1 << 1;
var RuntimeMetrics = 1 << 2;
var WindDown = 1 << 4;
var CooperativeYielding = 1 << 5;
var cooperativeYielding = /* @__PURE__ */ __name((self) => isEnabled(self, CooperativeYielding), "cooperativeYielding");
var enable2 = /* @__PURE__ */ dual(2, (self, flag) => self | flag);
var interruptible = /* @__PURE__ */ __name((self) => interruption(self) && !windDown(self), "interruptible");
var interruption = /* @__PURE__ */ __name((self) => isEnabled(self, Interruption), "interruption");
var isEnabled = /* @__PURE__ */ dual(2, (self, flag) => (self & flag) !== 0);
var make16 = /* @__PURE__ */ __name((...flags) => flags.reduce((a, b) => a | b, 0), "make");
var none5 = /* @__PURE__ */ make16(None2);
var runtimeMetrics = /* @__PURE__ */ __name((self) => isEnabled(self, RuntimeMetrics), "runtimeMetrics");
var windDown = /* @__PURE__ */ __name((self) => isEnabled(self, WindDown), "windDown");
var diff4 = /* @__PURE__ */ dual(2, (self, that) => make15(self ^ that, that));
var patch4 = /* @__PURE__ */ dual(2, (self, patch9) => self & (invert(active(patch9)) | enabled(patch9)) | active(patch9) & enabled(patch9));
var differ = /* @__PURE__ */ make14({
  empty: empty13,
  diff: /* @__PURE__ */ __name((oldValue, newValue) => diff4(oldValue, newValue), "diff"),
  combine: /* @__PURE__ */ __name((first2, second) => andThen(second)(first2), "combine"),
  patch: /* @__PURE__ */ __name((_patch, oldValue) => patch4(oldValue, _patch), "patch")
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/RuntimeFlagsPatch.js
var enable3 = enable;
var disable2 = disable;
var exclude2 = exclude;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/blockedRequests.js
init_esm();
var par = /* @__PURE__ */ __name((self, that) => ({
  _tag: "Par",
  left: self,
  right: that
}), "par");
var seq = /* @__PURE__ */ __name((self, that) => ({
  _tag: "Seq",
  left: self,
  right: that
}), "seq");
var flatten3 = /* @__PURE__ */ __name((self) => {
  let current = of3(self);
  let updated = empty9();
  while (1) {
    const [parallel4, sequential4] = reduce6(current, [parallelCollectionEmpty(), empty9()], ([parallel5, sequential5], blockedRequest) => {
      const [par2, seq2] = step(blockedRequest);
      return [parallelCollectionCombine(parallel5, par2), appendAll3(sequential5, seq2)];
    });
    updated = merge4(updated, parallel4);
    if (isNil(sequential4)) {
      return reverse3(updated);
    }
    current = sequential4;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
}, "flatten");
var step = /* @__PURE__ */ __name((requests) => {
  let current = requests;
  let parallel4 = parallelCollectionEmpty();
  let stack = empty9();
  let sequential4 = empty9();
  while (1) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel4, sequential4];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left3 = current.left;
        const right3 = current.right;
        switch (left3._tag) {
          case "Empty": {
            current = right3;
            break;
          }
          case "Par": {
            const l = left3.left;
            const r = left3.right;
            current = par(seq(l, right3), seq(r, right3));
            break;
          }
          case "Seq": {
            const l = left3.left;
            const r = left3.right;
            current = seq(l, seq(r, right3));
            break;
          }
          case "Single": {
            current = left3;
            sequential4 = cons(right3, sequential4);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel4 = parallelCollectionAdd(parallel4, current);
        if (isNil(stack)) {
          return [parallel4, sequential4];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
}, "step");
var merge4 = /* @__PURE__ */ __name((sequential4, parallel4) => {
  if (isNil(sequential4)) {
    return of3(parallelCollectionToSequentialCollection(parallel4));
  }
  if (parallelCollectionIsEmpty(parallel4)) {
    return sequential4;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential4.head);
  const parKeys = parallelCollectionKeys(parallel4);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals(seqHeadKeys[0], parKeys[0])) {
    return cons(sequentialCollectionCombine(sequential4.head, parallelCollectionToSequentialCollection(parallel4)), sequential4.tail);
  }
  return cons(parallelCollectionToSequentialCollection(parallel4), sequential4);
}, "merge");
var EntryTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/Entry");
var EntryImpl = class {
  static {
    __name(this, "EntryImpl");
  }
  request;
  result;
  listeners;
  ownerId;
  state;
  [EntryTypeId] = blockedRequestVariance;
  constructor(request, result, listeners, ownerId, state) {
    this.request = request;
    this.result = result;
    this.listeners = listeners;
    this.ownerId = ownerId;
    this.state = state;
  }
};
var blockedRequestVariance = {
  /* c8 ignore next */
  _R: /* @__PURE__ */ __name((_) => _, "_R")
};
var RequestBlockParallelTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel");
var parallelVariance = {
  /* c8 ignore next */
  _R: /* @__PURE__ */ __name((_) => _, "_R")
};
var ParallelImpl = class {
  static {
    __name(this, "ParallelImpl");
  }
  map;
  [RequestBlockParallelTypeId] = parallelVariance;
  constructor(map13) {
    this.map = map13;
  }
};
var parallelCollectionEmpty = /* @__PURE__ */ __name(() => new ParallelImpl(empty8()), "parallelCollectionEmpty");
var parallelCollectionAdd = /* @__PURE__ */ __name((self, blockedRequest) => new ParallelImpl(modifyAt2(self.map, blockedRequest.dataSource, (_) => orElseSome(map2(_, append2(blockedRequest.blockedRequest)), () => of2(blockedRequest.blockedRequest)))), "parallelCollectionAdd");
var parallelCollectionCombine = /* @__PURE__ */ __name((self, that) => new ParallelImpl(reduce5(self.map, that.map, (map13, value, key) => set3(map13, key, match2(get6(map13, key), {
  onNone: /* @__PURE__ */ __name(() => value, "onNone"),
  onSome: /* @__PURE__ */ __name((other) => appendAll2(value, other), "onSome")
})))), "parallelCollectionCombine");
var parallelCollectionIsEmpty = /* @__PURE__ */ __name((self) => isEmpty3(self.map), "parallelCollectionIsEmpty");
var parallelCollectionKeys = /* @__PURE__ */ __name((self) => Array.from(keys3(self.map)), "parallelCollectionKeys");
var parallelCollectionToSequentialCollection = /* @__PURE__ */ __name((self) => sequentialCollectionMake(map6(self.map, (x) => of2(x))), "parallelCollectionToSequentialCollection");
var SequentialCollectionTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential");
var sequentialVariance = {
  /* c8 ignore next */
  _R: /* @__PURE__ */ __name((_) => _, "_R")
};
var SequentialImpl = class {
  static {
    __name(this, "SequentialImpl");
  }
  map;
  [SequentialCollectionTypeId] = sequentialVariance;
  constructor(map13) {
    this.map = map13;
  }
};
var sequentialCollectionMake = /* @__PURE__ */ __name((map13) => new SequentialImpl(map13), "sequentialCollectionMake");
var sequentialCollectionCombine = /* @__PURE__ */ __name((self, that) => new SequentialImpl(reduce5(that.map, self.map, (map13, value, key) => set3(map13, key, match2(get6(map13, key), {
  onNone: /* @__PURE__ */ __name(() => empty4(), "onNone"),
  onSome: /* @__PURE__ */ __name((a) => appendAll2(a, value), "onSome")
})))), "sequentialCollectionCombine");
var sequentialCollectionKeys = /* @__PURE__ */ __name((self) => Array.from(keys3(self.map)), "sequentialCollectionKeys");
var sequentialCollectionToChunk = /* @__PURE__ */ __name((self) => Array.from(self.map), "sequentialCollectionToChunk");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/cause.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/opCodes/cause.js
init_esm();
var OP_DIE = "Die";
var OP_EMPTY = "Empty";
var OP_FAIL = "Fail";
var OP_INTERRUPT = "Interrupt";
var OP_PARALLEL = "Parallel";
var OP_SEQUENTIAL = "Sequential";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/cause.js
var CauseSymbolKey = "effect/Cause";
var CauseTypeId = /* @__PURE__ */ Symbol.for(CauseSymbolKey);
var variance4 = {
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E")
};
var proto = {
  [CauseTypeId]: variance4,
  [symbol]() {
    return pipe(hash(CauseSymbolKey), combine(hash(flattenCause(this))), cached2(this));
  },
  [symbol2](that) {
    return isCause(that) && causeEquals(this, that);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: toJSON(this.left),
          right: toJSON(this.right)
        };
    }
  },
  toString() {
    return pretty(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var empty14 = /* @__PURE__ */ (() => {
  const o2 = /* @__PURE__ */ Object.create(proto);
  o2._tag = OP_EMPTY;
  return o2;
})();
var fail = /* @__PURE__ */ __name((error2) => {
  const o2 = Object.create(proto);
  o2._tag = OP_FAIL;
  o2.error = error2;
  return o2;
}, "fail");
var die = /* @__PURE__ */ __name((defect) => {
  const o2 = Object.create(proto);
  o2._tag = OP_DIE;
  o2.defect = defect;
  return o2;
}, "die");
var interrupt = /* @__PURE__ */ __name((fiberId2) => {
  const o2 = Object.create(proto);
  o2._tag = OP_INTERRUPT;
  o2.fiberId = fiberId2;
  return o2;
}, "interrupt");
var parallel = /* @__PURE__ */ __name((left3, right3) => {
  const o2 = Object.create(proto);
  o2._tag = OP_PARALLEL;
  o2.left = left3;
  o2.right = right3;
  return o2;
}, "parallel");
var sequential = /* @__PURE__ */ __name((left3, right3) => {
  const o2 = Object.create(proto);
  o2._tag = OP_SEQUENTIAL;
  o2.left = left3;
  o2.right = right3;
  return o2;
}, "sequential");
var isCause = /* @__PURE__ */ __name((u) => hasProperty(u, CauseTypeId), "isCause");
var isEmptyType = /* @__PURE__ */ __name((self) => self._tag === OP_EMPTY, "isEmptyType");
var isFailType = /* @__PURE__ */ __name((self) => self._tag === OP_FAIL, "isFailType");
var isEmpty5 = /* @__PURE__ */ __name((self) => {
  if (self._tag === OP_EMPTY) {
    return true;
  }
  return reduce7(self, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY: {
        return some2(acc);
      }
      case OP_DIE:
      case OP_FAIL:
      case OP_INTERRUPT: {
        return some2(false);
      }
      default: {
        return none2();
      }
    }
  });
}, "isEmpty");
var isInterrupted = /* @__PURE__ */ __name((self) => isSome2(interruptOption(self)), "isInterrupted");
var isInterruptedOnly = /* @__PURE__ */ __name((self) => reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self), "isInterruptedOnly");
var failures = /* @__PURE__ */ __name((self) => reverse2(reduce7(self, empty4(), (list, cause) => cause._tag === OP_FAIL ? some2(pipe(list, prepend2(cause.error))) : none2())), "failures");
var defects = /* @__PURE__ */ __name((self) => reverse2(reduce7(self, empty4(), (list, cause) => cause._tag === OP_DIE ? some2(pipe(list, prepend2(cause.defect))) : none2())), "defects");
var interruptors = /* @__PURE__ */ __name((self) => reduce7(self, empty7(), (set5, cause) => cause._tag === OP_INTERRUPT ? some2(pipe(set5, add4(cause.fiberId))) : none2()), "interruptors");
var failureOption = /* @__PURE__ */ __name((self) => find(self, (cause) => cause._tag === OP_FAIL ? some2(cause.error) : none2()), "failureOption");
var failureOrCause = /* @__PURE__ */ __name((self) => {
  const option = failureOption(self);
  switch (option._tag) {
    case "None": {
      return right2(self);
    }
    case "Some": {
      return left2(option.value);
    }
  }
}, "failureOrCause");
var interruptOption = /* @__PURE__ */ __name((self) => find(self, (cause) => cause._tag === OP_INTERRUPT ? some2(cause.fiberId) : none2()), "interruptOption");
var stripFailures = /* @__PURE__ */ __name((self) => match5(self, {
  onEmpty: empty14,
  onFail: /* @__PURE__ */ __name(() => empty14, "onFail"),
  onDie: die,
  onInterrupt: interrupt,
  onSequential: sequential,
  onParallel: parallel
}), "stripFailures");
var electFailures = /* @__PURE__ */ __name((self) => match5(self, {
  onEmpty: empty14,
  onFail: die,
  onDie: die,
  onInterrupt: interrupt,
  onSequential: sequential,
  onParallel: parallel
}), "electFailures");
var causeEquals = /* @__PURE__ */ __name((left3, right3) => {
  let leftStack = of2(left3);
  let rightStack = of2(right3);
  while (isNonEmpty2(leftStack) && isNonEmpty2(rightStack)) {
    const [leftParallel, leftSequential] = pipe(headNonEmpty2(leftStack), reduce7([empty7(), empty4()], ([parallel4, sequential4], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel4, union3(par2)), pipe(sequential4, appendAll2(seq2))]);
    }));
    const [rightParallel, rightSequential] = pipe(headNonEmpty2(rightStack), reduce7([empty7(), empty4()], ([parallel4, sequential4], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel4, union3(par2)), pipe(sequential4, appendAll2(seq2))]);
    }));
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
}, "causeEquals");
var flattenCause = /* @__PURE__ */ __name((cause) => {
  return flattenCauseLoop(of2(cause), empty4());
}, "flattenCause");
var flattenCauseLoop = /* @__PURE__ */ __name((causes, flattened) => {
  while (1) {
    const [parallel4, sequential4] = pipe(causes, reduce([empty7(), empty4()], ([parallel5, sequential5], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return [pipe(parallel5, union3(par2)), pipe(sequential5, appendAll2(seq2))];
    }));
    const updated = size3(parallel4) > 0 ? pipe(flattened, prepend2(parallel4)) : flattened;
    if (isEmpty(sequential4)) {
      return reverse2(updated);
    }
    causes = sequential4;
    flattened = updated;
  }
  throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
}, "flattenCauseLoop");
var find = /* @__PURE__ */ dual(2, (self, pf) => {
  const stack = [self];
  while (stack.length > 0) {
    const item = stack.pop();
    const option = pf(item);
    switch (option._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL:
          case OP_PARALLEL: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option;
      }
    }
  }
  return none2();
});
var evaluateCause = /* @__PURE__ */ __name((self) => {
  let cause = self;
  const stack = [];
  let _parallel = empty7();
  let _sequential = empty4();
  while (cause !== void 0) {
    switch (cause._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL: {
        _parallel = add4(_parallel, make6(cause._tag, cause.error));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add4(_parallel, make6(cause._tag, cause.defect));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add4(_parallel, make6(cause._tag, cause.fiberId));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause.left._tag) {
          case OP_EMPTY: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause = sequential(cause.left.left, sequential(cause.left.right, cause.right));
            break;
          }
          case OP_PARALLEL: {
            cause = parallel(sequential(cause.left.left, cause.right), sequential(cause.left.right, cause.right));
            break;
          }
          default: {
            _sequential = prepend2(_sequential, cause.right);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
}, "evaluateCause");
var IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: /* @__PURE__ */ __name((_, left3, right3) => left3 && right3, "sequentialCase"),
  parallelCase: /* @__PURE__ */ __name((_, left3, right3) => left3 && right3, "parallelCase")
};
var OP_SEQUENTIAL_CASE = "SequentialCase";
var OP_PARALLEL_CASE = "ParallelCase";
var match5 = /* @__PURE__ */ dual(2, (self, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt: onInterrupt2,
  onParallel,
  onSequential
}) => {
  return reduceWithContext(self, void 0, {
    emptyCase: /* @__PURE__ */ __name(() => onEmpty, "emptyCase"),
    failCase: /* @__PURE__ */ __name((_, error2) => onFail(error2), "failCase"),
    dieCase: /* @__PURE__ */ __name((_, defect) => onDie(defect), "dieCase"),
    interruptCase: /* @__PURE__ */ __name((_, fiberId2) => onInterrupt2(fiberId2), "interruptCase"),
    sequentialCase: /* @__PURE__ */ __name((_, left3, right3) => onSequential(left3, right3), "sequentialCase"),
    parallelCase: /* @__PURE__ */ __name((_, left3, right3) => onParallel(left3, right3), "parallelCase")
  });
});
var reduce7 = /* @__PURE__ */ dual(3, (self, zero2, pf) => {
  let accumulator = zero2;
  let cause = self;
  const causes = [];
  while (cause !== void 0) {
    const option = pf(accumulator, cause);
    accumulator = isSome2(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = void 0;
        break;
      }
    }
    if (cause === void 0 && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
var reduceWithContext = /* @__PURE__ */ dual(3, (self, context2, reducer) => {
  const input = [self];
  const output = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OP_EMPTY: {
        output.push(right2(reducer.emptyCase(context2)));
        break;
      }
      case OP_FAIL: {
        output.push(right2(reducer.failCase(context2, cause.error)));
        break;
      }
      case OP_DIE: {
        output.push(right2(reducer.dieCase(context2, cause.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output.push(right2(reducer.interruptCase(context2, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left2({
          _tag: OP_SEQUENTIAL_CASE
        }));
        break;
      }
      case OP_PARALLEL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left2({
          _tag: OP_PARALLEL_CASE
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either4 = output.pop();
    switch (either4._tag) {
      case "Left": {
        switch (either4.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.sequentialCase(context2, left3, right3);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.parallelCase(context2, left3, right3);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either4.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  return accumulator.pop();
});
var pretty = /* @__PURE__ */ __name((cause, options) => {
  if (isInterruptedOnly(cause)) {
    return "All fibers interrupted without errors.";
  }
  return prettyErrors(cause).map(function(e) {
    if (options?.renderErrorCause !== true || e.cause === void 0) {
      return e.stack;
    }
    return `${e.stack} {
${renderErrorCause(e.cause, "  ")}
}`;
  }).join("\n");
}, "pretty");
var renderErrorCause = /* @__PURE__ */ __name((cause, prefix) => {
  const lines = cause.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines[0]}`;
  for (let i = 1, len = lines.length; i < len; i++) {
    stack += `
${prefix}${lines[i]}`;
  }
  if (cause.cause) {
    stack += ` {
${renderErrorCause(cause.cause, `${prefix}  `)}
${prefix}}`;
  }
  return stack;
}, "renderErrorCause");
var PrettyError = class _PrettyError extends globalThis.Error {
  static {
    __name(this, "PrettyError");
  }
  span = void 0;
  constructor(originalError) {
    const originalErrorIsObject = typeof originalError === "object" && originalError !== null;
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(prettyErrorMessage(originalError), originalErrorIsObject && "cause" in originalError && typeof originalError.cause !== "undefined" ? {
      cause: new _PrettyError(originalError.cause)
    } : void 0);
    if (this.message === "") {
      this.message = "An error has occurred";
    }
    Error.stackTraceLimit = prevLimit;
    this.name = originalError instanceof Error ? originalError.name : "Error";
    if (originalErrorIsObject) {
      if (spanSymbol in originalError) {
        this.span = originalError[spanSymbol];
      }
      Object.keys(originalError).forEach((key) => {
        if (!(key in this)) {
          this[key] = originalError[key];
        }
      });
    }
    this.stack = prettyErrorStack(`${this.name}: ${this.message}`, originalError instanceof Error && originalError.stack ? originalError.stack : "", this.span);
  }
};
var prettyErrorMessage = /* @__PURE__ */ __name((u) => {
  if (typeof u === "string") {
    return u;
  }
  if (typeof u === "object" && u !== null && u instanceof Error) {
    return u.message;
  }
  try {
    if (hasProperty(u, "toString") && isFunction2(u["toString"]) && u["toString"] !== Object.prototype.toString && u["toString"] !== globalThis.Array.prototype.toString) {
      return u["toString"]();
    }
  } catch {
  }
  return stringifyCircular(u);
}, "prettyErrorMessage");
var locationRegex = /\((.*)\)/g;
var spanToTrace = /* @__PURE__ */ globalValue("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap());
var prettyErrorStack = /* @__PURE__ */ __name((message, stack, span2) => {
  const out = [message];
  const lines = stack.startsWith(message) ? stack.slice(message.length).split("\n") : stack.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].includes(" at new BaseEffectError") || lines[i].includes(" at new YieldableError")) {
      i++;
      continue;
    }
    if (lines[i].includes("Generator.next")) {
      break;
    }
    if (lines[i].includes("effect_internal_function")) {
      break;
    }
    out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (span2) {
    let current = span2;
    let i = 0;
    while (current && current._tag === "Span" && i < 10) {
      const stackFn = spanToTrace.get(current);
      if (typeof stackFn === "function") {
        const stack2 = stackFn();
        if (typeof stack2 === "string") {
          const locationMatchAll = stack2.matchAll(locationRegex);
          let match8 = false;
          for (const [, location] of locationMatchAll) {
            match8 = true;
            out.push(`    at ${current.name} (${location})`);
          }
          if (!match8) {
            out.push(`    at ${current.name} (${stack2.replace(/^at /, "")})`);
          }
        } else {
          out.push(`    at ${current.name}`);
        }
      } else {
        out.push(`    at ${current.name}`);
      }
      current = getOrUndefined(current.parent);
      i++;
    }
  }
  return out.join("\n");
}, "prettyErrorStack");
var spanSymbol = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
var prettyErrors = /* @__PURE__ */ __name((cause) => reduceWithContext(cause, void 0, {
  emptyCase: /* @__PURE__ */ __name(() => [], "emptyCase"),
  dieCase: /* @__PURE__ */ __name((_, unknownError) => {
    return [new PrettyError(unknownError)];
  }, "dieCase"),
  failCase: /* @__PURE__ */ __name((_, error2) => {
    return [new PrettyError(error2)];
  }, "failCase"),
  interruptCase: /* @__PURE__ */ __name(() => [], "interruptCase"),
  parallelCase: /* @__PURE__ */ __name((_, l, r) => [...l, ...r], "parallelCase"),
  sequentialCase: /* @__PURE__ */ __name((_, l, r) => [...l, ...r], "sequentialCase")
}), "prettyErrors");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/deferred.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/opCodes/deferred.js
init_esm();
var OP_STATE_PENDING = "Pending";
var OP_STATE_DONE = "Done";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/deferred.js
var DeferredSymbolKey = "effect/Deferred";
var DeferredTypeId = /* @__PURE__ */ Symbol.for(DeferredSymbolKey);
var deferredVariance = {
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E"),
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A")
};
var pending = /* @__PURE__ */ __name((joiners) => {
  return {
    _tag: OP_STATE_PENDING,
    joiners
  };
}, "pending");
var done = /* @__PURE__ */ __name((effect) => {
  return {
    _tag: OP_STATE_DONE,
    effect
  };
}, "done");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/singleShotGen.js
init_esm();
var SingleShotGen2 = class _SingleShotGen {
  static {
    __name(this, "SingleShotGen");
  }
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/core.js
var blocked = /* @__PURE__ */ __name((blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.effect_instruction_i0 = blockedRequests;
  effect.effect_instruction_i1 = _continue;
  return effect;
}, "blocked");
var runRequestBlock = /* @__PURE__ */ __name((blockedRequests) => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.effect_instruction_i0 = blockedRequests;
  return effect;
}, "runRequestBlock");
var EffectTypeId2 = /* @__PURE__ */ Symbol.for("effect/Effect");
var RevertFlags = class {
  static {
    __name(this, "RevertFlags");
  }
  patch;
  op;
  _op = OP_REVERT_FLAGS;
  constructor(patch9, op) {
    this.patch = patch9;
    this.op = op;
  }
};
var EffectPrimitive = class {
  static {
    __name(this, "EffectPrimitive");
  }
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return cached2(this, random(this));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: toJSON(this.effect_instruction_i0),
      effect_instruction_i1: toJSON(this.effect_instruction_i1),
      effect_instruction_i2: toJSON(this.effect_instruction_i2)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var EffectPrimitiveFailure = class {
  static {
    __name(this, "EffectPrimitiveFailure");
  }
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Failure" && // @ts-expect-error
    equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(
      // @ts-expect-error
      string(this._tag),
      // @ts-expect-error
      combine(hash(this.effect_instruction_i0)),
      cached2(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var EffectPrimitiveSuccess = class {
  static {
    __name(this, "EffectPrimitiveSuccess");
  }
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Success" && // @ts-expect-error
    equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(
      // @ts-expect-error
      string(this._tag),
      // @ts-expect-error
      combine(hash(this.effect_instruction_i0)),
      cached2(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON(this.value)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var isEffect = /* @__PURE__ */ __name((u) => hasProperty(u, EffectTypeId2), "isEffect");
var withFiberRuntime = /* @__PURE__ */ __name((withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.effect_instruction_i0 = withRuntime;
  return effect;
}, "withFiberRuntime");
var acquireUseRelease = /* @__PURE__ */ dual(3, (acquire, use, release) => uninterruptibleMask((restore) => flatMap6(acquire, (a) => flatMap6(exit(suspend(() => restore(use(a)))), (exit3) => {
  return suspend(() => release(a, exit3)).pipe(matchCauseEffect({
    onFailure: /* @__PURE__ */ __name((cause) => {
      switch (exit3._tag) {
        case OP_FAILURE:
          return failCause(sequential(exit3.effect_instruction_i0, cause));
        case OP_SUCCESS:
          return failCause(cause);
      }
    }, "onFailure"),
    onSuccess: /* @__PURE__ */ __name(() => exit3, "onSuccess")
  }));
}))));
var as = /* @__PURE__ */ dual(2, (self, value) => flatMap6(self, () => succeed(value)));
var asVoid = /* @__PURE__ */ __name((self) => as(self, void 0), "asVoid");
var custom = /* @__PURE__ */ __name(function() {
  const wrapper = new EffectPrimitive(OP_COMMIT);
  switch (arguments.length) {
    case 2: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.commit = arguments[1];
      break;
    }
    case 3: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.commit = arguments[2];
      break;
    }
    case 4: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.effect_instruction_i2 = arguments[2];
      wrapper.commit = arguments[3];
      break;
    }
    default: {
      throw new Error(getBugErrorMessage("you're not supposed to end up here"));
    }
  }
  return wrapper;
}, "custom");
var unsafeAsync = /* @__PURE__ */ __name((register, blockingOn = none4) => {
  const effect = new EffectPrimitive(OP_ASYNC);
  let cancelerRef = void 0;
  effect.effect_instruction_i0 = (resume2) => {
    cancelerRef = register(resume2);
  };
  effect.effect_instruction_i1 = blockingOn;
  return onInterrupt(effect, (_) => isEffect(cancelerRef) ? cancelerRef : void_);
}, "unsafeAsync");
var asyncInterrupt = /* @__PURE__ */ __name((register, blockingOn = none4) => suspend(() => unsafeAsync(register, blockingOn)), "asyncInterrupt");
var async_ = /* @__PURE__ */ __name((resume2, blockingOn = none4) => {
  return custom(resume2, function() {
    let backingResume = void 0;
    let pendingEffect = void 0;
    function proxyResume(effect2) {
      if (backingResume) {
        backingResume(effect2);
      } else if (pendingEffect === void 0) {
        pendingEffect = effect2;
      }
    }
    __name(proxyResume, "proxyResume");
    const effect = new EffectPrimitive(OP_ASYNC);
    effect.effect_instruction_i0 = (resume3) => {
      backingResume = resume3;
      if (pendingEffect) {
        resume3(pendingEffect);
      }
    };
    effect.effect_instruction_i1 = blockingOn;
    let cancelerRef = void 0;
    let controllerRef = void 0;
    if (this.effect_instruction_i0.length !== 1) {
      controllerRef = new AbortController();
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume, controllerRef.signal));
    } else {
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume));
    }
    return cancelerRef || controllerRef ? onInterrupt(effect, (_) => {
      if (controllerRef) {
        controllerRef.abort();
      }
      return cancelerRef ?? void_;
    }) : effect;
  });
}, "async_");
var catchAll = /* @__PURE__ */ dual(2, (self, f) => matchEffect(self, {
  onFailure: f,
  onSuccess: succeed
}));
var originalSymbol = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation");
var capture = /* @__PURE__ */ __name((obj, span2) => {
  if (isSome2(span2)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol) {
          return span2.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      }
    });
  }
  return obj;
}, "capture");
var die2 = /* @__PURE__ */ __name((defect) => isObject(defect) && !(spanSymbol in defect) ? withFiberRuntime((fiber) => failCause(die(capture(defect, currentSpanFromFiber(fiber))))) : failCause(die(defect)), "die");
var dieMessage = /* @__PURE__ */ __name((message) => failCauseSync(() => die(new RuntimeException(message))), "dieMessage");
var either2 = /* @__PURE__ */ __name((self) => matchEffect(self, {
  onFailure: /* @__PURE__ */ __name((e) => succeed(left2(e)), "onFailure"),
  onSuccess: /* @__PURE__ */ __name((a) => succeed(right2(a)), "onSuccess")
}), "either");
var exit = /* @__PURE__ */ __name((self) => matchCause(self, {
  onFailure: exitFailCause,
  onSuccess: exitSucceed
}), "exit");
var fail2 = /* @__PURE__ */ __name((error2) => isObject(error2) && !(spanSymbol in error2) ? withFiberRuntime((fiber) => failCause(fail(capture(error2, currentSpanFromFiber(fiber))))) : failCause(fail(error2)), "fail");
var failSync = /* @__PURE__ */ __name((evaluate2) => flatMap6(sync(evaluate2), fail2), "failSync");
var failCause = /* @__PURE__ */ __name((cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
}, "failCause");
var failCauseSync = /* @__PURE__ */ __name((evaluate2) => flatMap6(sync(evaluate2), failCause), "failCauseSync");
var fiberId = /* @__PURE__ */ withFiberRuntime((state) => succeed(state.id()));
var fiberIdWith = /* @__PURE__ */ __name((f) => withFiberRuntime((state) => f(state.id())), "fiberIdWith");
var flatMap6 = /* @__PURE__ */ dual(2, (self, f) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS);
  effect.effect_instruction_i0 = self;
  effect.effect_instruction_i1 = f;
  return effect;
});
var step2 = /* @__PURE__ */ __name((self) => {
  const effect = new EffectPrimitive("OnStep");
  effect.effect_instruction_i0 = self;
  return effect;
}, "step");
var flatten4 = /* @__PURE__ */ __name((self) => flatMap6(self, identity), "flatten");
var matchCause = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: /* @__PURE__ */ __name((cause) => succeed(options.onFailure(cause)), "onFailure"),
  onSuccess: /* @__PURE__ */ __name((a) => succeed(options.onSuccess(a)), "onSuccess")
}));
var matchCauseEffect = /* @__PURE__ */ dual(2, (self, options) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
  effect.effect_instruction_i0 = self;
  effect.effect_instruction_i1 = options.onFailure;
  effect.effect_instruction_i2 = options.onSuccess;
  return effect;
});
var matchEffect = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: /* @__PURE__ */ __name((cause) => {
    const defects2 = defects(cause);
    if (defects2.length > 0) {
      return failCause(electFailures(cause));
    }
    const failures2 = failures(cause);
    if (failures2.length > 0) {
      return options.onFailure(unsafeHead(failures2));
    }
    return failCause(cause);
  }, "onFailure"),
  onSuccess: options.onSuccess
}));
var forEachSequential = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable(self);
  const ret = allocate(arr.length);
  let i = 0;
  return as(whileLoop({
    while: /* @__PURE__ */ __name(() => i < arr.length, "while"),
    body: /* @__PURE__ */ __name(() => f(arr[i], i), "body"),
    step: /* @__PURE__ */ __name((b) => {
      ret[i++] = b;
    }, "step")
  }), ret);
}));
var forEachSequentialDiscard = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable(self);
  let i = 0;
  return whileLoop({
    while: /* @__PURE__ */ __name(() => i < arr.length, "while"),
    body: /* @__PURE__ */ __name(() => f(arr[i], i), "body"),
    step: /* @__PURE__ */ __name(() => {
      i++;
    }, "step")
  });
}));
var interruptible2 = /* @__PURE__ */ __name((self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = enable3(Interruption);
  effect.effect_instruction_i1 = () => self;
  return effect;
}, "interruptible");
var map9 = /* @__PURE__ */ dual(2, (self, f) => flatMap6(self, (a) => sync(() => f(a))));
var mapBoth = /* @__PURE__ */ dual(2, (self, options) => matchEffect(self, {
  onFailure: /* @__PURE__ */ __name((e) => failSync(() => options.onFailure(e)), "onFailure"),
  onSuccess: /* @__PURE__ */ __name((a) => sync(() => options.onSuccess(a)), "onSuccess")
}));
var mapError = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: /* @__PURE__ */ __name((cause) => {
    const either4 = failureOrCause(cause);
    switch (either4._tag) {
      case "Left": {
        return failSync(() => f(either4.left));
      }
      case "Right": {
        return failCause(either4.right);
      }
    }
  }, "onFailure"),
  onSuccess: succeed
}));
var onExit = /* @__PURE__ */ dual(2, (self, cleanup) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
  onFailure: /* @__PURE__ */ __name((cause1) => {
    const result = exitFailCause(cause1);
    return matchCauseEffect(cleanup(result), {
      onFailure: /* @__PURE__ */ __name((cause2) => exitFailCause(sequential(cause1, cause2)), "onFailure"),
      onSuccess: /* @__PURE__ */ __name(() => result, "onSuccess")
    });
  }, "onFailure"),
  onSuccess: /* @__PURE__ */ __name((success) => {
    const result = exitSucceed(success);
    return zipRight(cleanup(result), result);
  }, "onSuccess")
})));
var onInterrupt = /* @__PURE__ */ dual(2, (self, cleanup) => onExit(self, exitMatch({
  onFailure: /* @__PURE__ */ __name((cause) => isInterruptedOnly(cause) ? asVoid(cleanup(interruptors(cause))) : void_, "onFailure"),
  onSuccess: /* @__PURE__ */ __name(() => void_, "onSuccess")
})));
var succeed = /* @__PURE__ */ __name((value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value;
  return effect;
}, "succeed");
var suspend = /* @__PURE__ */ __name((evaluate2) => {
  const effect = new EffectPrimitive(OP_COMMIT);
  effect.commit = evaluate2;
  return effect;
}, "suspend");
var sync = /* @__PURE__ */ __name((thunk) => {
  const effect = new EffectPrimitive(OP_SYNC);
  effect.effect_instruction_i0 = thunk;
  return effect;
}, "sync");
var tap = /* @__PURE__ */ dual((args2) => args2.length === 3 || args2.length === 2 && !(isObject(args2[1]) && "onlyEffect" in args2[1]), (self, f) => flatMap6(self, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return as(b, a);
  } else if (isPromiseLike(b)) {
    return unsafeAsync((resume2) => {
      b.then((_) => resume2(succeed(a)), (e) => resume2(fail2(new UnknownException(e, "An unknown error occurred in Effect.tap"))));
    });
  }
  return succeed(a);
}));
var transplant = /* @__PURE__ */ __name((f) => withFiberRuntime((state) => {
  const scopeOverride = state.getFiberRef(currentForkScopeOverride);
  const scope2 = pipe(scopeOverride, getOrElse(() => state.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, some2(scope2)));
}), "transplant");
var uninterruptible = /* @__PURE__ */ __name((self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable2(Interruption);
  effect.effect_instruction_i1 = () => self;
  return effect;
}, "uninterruptible");
var uninterruptibleMask = /* @__PURE__ */ __name((f) => custom(f, function() {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable2(Interruption);
  effect.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible2)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect;
}), "uninterruptibleMask");
var void_ = /* @__PURE__ */ succeed(void 0);
var updateRuntimeFlags = /* @__PURE__ */ __name((patch9) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = patch9;
  effect.effect_instruction_i1 = void 0;
  return effect;
}, "updateRuntimeFlags");
var whileLoop = /* @__PURE__ */ __name((options) => {
  const effect = new EffectPrimitive(OP_WHILE);
  effect.effect_instruction_i0 = options.while;
  effect.effect_instruction_i1 = options.body;
  effect.effect_instruction_i2 = options.step;
  return effect;
}, "whileLoop");
var yieldNow = /* @__PURE__ */ __name((options) => {
  const effect = new EffectPrimitive(OP_YIELD);
  return typeof options?.priority !== "undefined" ? withSchedulingPriority(effect, options.priority) : effect;
}, "yieldNow");
var zip2 = /* @__PURE__ */ dual(2, (self, that) => flatMap6(self, (a) => map9(that, (b) => [a, b])));
var zipLeft = /* @__PURE__ */ dual(2, (self, that) => flatMap6(self, (a) => as(that, a)));
var zipRight = /* @__PURE__ */ dual(2, (self, that) => flatMap6(self, () => that));
var never = /* @__PURE__ */ asyncInterrupt(() => {
  const interval = setInterval(() => {
  }, 2 ** 31 - 1);
  return sync(() => clearInterval(interval));
});
var interruptFiber = /* @__PURE__ */ __name((self) => flatMap6(fiberId, (fiberId2) => pipe(self, interruptAsFiber(fiberId2))), "interruptFiber");
var interruptAsFiber = /* @__PURE__ */ dual(2, (self, fiberId2) => flatMap6(self.interruptAsFork(fiberId2), () => self.await));
var logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FiberRefSymbolKey = "effect/FiberRef";
var FiberRefTypeId = /* @__PURE__ */ Symbol.for(FiberRefSymbolKey);
var fiberRefVariance = {
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A")
};
var fiberRefGet = /* @__PURE__ */ __name((self) => withFiberRuntime((fiber) => exitSucceed(fiber.getFiberRef(self))), "fiberRefGet");
var fiberRefGetWith = /* @__PURE__ */ dual(2, (self, f) => flatMap6(fiberRefGet(self), f));
var fiberRefSet = /* @__PURE__ */ dual(2, (self, value) => fiberRefModify(self, () => [void 0, value]));
var fiberRefModify = /* @__PURE__ */ dual(2, (self, f) => withFiberRuntime((state) => {
  const [b, a] = f(state.getFiberRef(self));
  state.setFiberRef(self, a);
  return succeed(b);
}));
var RequestResolverSymbolKey = "effect/RequestResolver";
var RequestResolverTypeId = /* @__PURE__ */ Symbol.for(RequestResolverSymbolKey);
var requestResolverVariance = {
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A"),
  /* c8 ignore next */
  _R: /* @__PURE__ */ __name((_) => _, "_R")
};
var RequestResolverImpl = class _RequestResolverImpl {
  static {
    __name(this, "RequestResolverImpl");
  }
  runAll;
  target;
  [RequestResolverTypeId] = requestResolverVariance;
  constructor(runAll, target) {
    this.runAll = runAll;
    this.target = target;
  }
  [symbol]() {
    return cached2(this, this.target ? hash(this.target) : random(this));
  }
  [symbol2](that) {
    return this.target ? isRequestResolver(that) && equals(this.target, that.target) : this === that;
  }
  identified(...ids3) {
    return new _RequestResolverImpl(this.runAll, fromIterable2(ids3));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isRequestResolver = /* @__PURE__ */ __name((u) => hasProperty(u, RequestResolverTypeId), "isRequestResolver");
var fiberRefLocally = /* @__PURE__ */ dual(3, (use, self, value) => acquireUseRelease(zipLeft(fiberRefGet(self), fiberRefSet(self, value)), () => use, (oldValue) => fiberRefSet(self, oldValue)));
var fiberRefUnsafeMake = /* @__PURE__ */ __name((initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: update(),
  fork: options?.fork ?? identity,
  join: options?.join
}), "fiberRefUnsafeMake");
var fiberRefUnsafeMakeHashSet = /* @__PURE__ */ __name((initial) => {
  const differ3 = hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
}, "fiberRefUnsafeMakeHashSet");
var fiberRefUnsafeMakeReadonlyArray = /* @__PURE__ */ __name((initial) => {
  const differ3 = readonlyArray(update());
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
}, "fiberRefUnsafeMakeReadonlyArray");
var fiberRefUnsafeMakeContext = /* @__PURE__ */ __name((initial) => {
  const differ3 = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
}, "fiberRefUnsafeMakeContext");
var fiberRefUnsafeMakePatch = /* @__PURE__ */ __name((initial, options) => {
  const _fiberRef = {
    ...CommitPrototype,
    [FiberRefTypeId]: fiberRefVariance,
    initial,
    commit() {
      return fiberRefGet(this);
    },
    diff: /* @__PURE__ */ __name((oldValue, newValue) => options.differ.diff(oldValue, newValue), "diff"),
    combine: /* @__PURE__ */ __name((first2, second) => options.differ.combine(first2, second), "combine"),
    patch: /* @__PURE__ */ __name((patch9) => (oldValue) => options.differ.patch(patch9, oldValue), "patch"),
    fork: options.fork,
    join: options.join ?? ((_, n) => n)
  };
  return _fiberRef;
}, "fiberRefUnsafeMakePatch");
var fiberRefUnsafeMakeRuntimeFlags = /* @__PURE__ */ __name((initial) => fiberRefUnsafeMakePatch(initial, {
  differ,
  fork: differ.empty
}), "fiberRefUnsafeMakeRuntimeFlags");
var currentContext = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty3()));
var currentSchedulingPriority = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
var currentMaxOpsBeforeYield = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
var currentLogAnnotations = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty8()));
var currentLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
var currentLogSpan = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty9()));
var withSchedulingPriority = /* @__PURE__ */ dual(2, (self, scheduler) => fiberRefLocally(self, currentSchedulingPriority, scheduler));
var currentConcurrency = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
var currentRequestBatching = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
var currentUnhandledErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelDebug)));
var currentVersionMismatchErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/versionMismatchErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelWarning)));
var currentMetricLabels = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeReadonlyArray(empty()));
var currentForkScopeOverride = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none2(), {
  fork: /* @__PURE__ */ __name(() => none2(), "fork"),
  join: /* @__PURE__ */ __name((parent, _) => parent, "join")
}));
var currentInterruptedCause = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty14, {
  fork: /* @__PURE__ */ __name(() => empty14, "fork"),
  join: /* @__PURE__ */ __name((parent, _) => parent, "join")
}));
var ScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Scope");
var CloseableScopeTypeId = /* @__PURE__ */ Symbol.for("effect/CloseableScope");
var scopeAddFinalizer = /* @__PURE__ */ __name((self, finalizer) => self.addFinalizer(() => asVoid(finalizer)), "scopeAddFinalizer");
var scopeClose = /* @__PURE__ */ __name((self, exit3) => self.close(exit3), "scopeClose");
var scopeFork = /* @__PURE__ */ __name((self, strategy) => self.fork(strategy), "scopeFork");
var YieldableError = /* @__PURE__ */ function() {
  class YieldableError2 extends globalThis.Error {
    static {
      __name(this, "YieldableError");
    }
    commit() {
      return fail2(this);
    }
    toJSON() {
      const obj = {
        ...this
      };
      if (this.message) obj.message = this.message;
      if (this.cause) obj.cause = this.cause;
      return obj;
    }
    [NodeInspectSymbol]() {
      if (this.toString !== globalThis.Error.prototype.toString) {
        return this.stack ? `${this.toString()}
${this.stack.split("\n").slice(1).join("\n")}` : this.toString();
      } else if ("Bun" in globalThis) {
        return pretty(fail(this), {
          renderErrorCause: true
        });
      }
      return this;
    }
  }
  Object.assign(YieldableError2.prototype, StructuralCommitPrototype);
  return YieldableError2;
}();
var makeException = /* @__PURE__ */ __name((proto3, tag) => {
  class Base3 extends YieldableError {
    static {
      __name(this, "Base");
    }
    _tag = tag;
  }
  Object.assign(Base3.prototype, proto3);
  Base3.prototype.name = tag;
  return Base3;
}, "makeException");
var RuntimeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException");
var RuntimeException = /* @__PURE__ */ makeException({
  [RuntimeExceptionTypeId]: RuntimeExceptionTypeId
}, "RuntimeException");
var InterruptedExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException");
var InterruptedException = /* @__PURE__ */ makeException({
  [InterruptedExceptionTypeId]: InterruptedExceptionTypeId
}, "InterruptedException");
var isInterruptedException = /* @__PURE__ */ __name((u) => hasProperty(u, InterruptedExceptionTypeId), "isInterruptedException");
var IllegalArgumentExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/IllegalArgument");
var IllegalArgumentException = /* @__PURE__ */ makeException({
  [IllegalArgumentExceptionTypeId]: IllegalArgumentExceptionTypeId
}, "IllegalArgumentException");
var NoSuchElementExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement");
var NoSuchElementException = /* @__PURE__ */ makeException({
  [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId
}, "NoSuchElementException");
var InvalidPubSubCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InvalidPubSubCapacityException");
var InvalidPubSubCapacityException = /* @__PURE__ */ makeException({
  [InvalidPubSubCapacityExceptionTypeId]: InvalidPubSubCapacityExceptionTypeId
}, "InvalidPubSubCapacityException");
var ExceededCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/ExceededCapacityException");
var ExceededCapacityException = /* @__PURE__ */ makeException({
  [ExceededCapacityExceptionTypeId]: ExceededCapacityExceptionTypeId
}, "ExceededCapacityException");
var TimeoutExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/Timeout");
var TimeoutException = /* @__PURE__ */ makeException({
  [TimeoutExceptionTypeId]: TimeoutExceptionTypeId
}, "TimeoutException");
var UnknownExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException");
var UnknownException = /* @__PURE__ */ function() {
  class UnknownException2 extends YieldableError {
    static {
      __name(this, "UnknownException");
    }
    _tag = "UnknownException";
    error;
    constructor(cause, message) {
      super(message ?? "An unknown error occurred", {
        cause
      });
      this.error = cause;
    }
  }
  Object.assign(UnknownException2.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException"
  });
  return UnknownException2;
}();
var exitIsExit = /* @__PURE__ */ __name((u) => isEffect(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure"), "exitIsExit");
var exitIsSuccess = /* @__PURE__ */ __name((self) => self._tag === "Success", "exitIsSuccess");
var exitAs = /* @__PURE__ */ dual(2, (self, value) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.effect_instruction_i0);
    }
    case OP_SUCCESS: {
      return exitSucceed(value);
    }
  }
});
var exitAsVoid = /* @__PURE__ */ __name((self) => exitAs(self, void 0), "exitAsVoid");
var exitCollectAll = /* @__PURE__ */ __name((exits, options) => exitCollectAllInternal(exits, options?.parallel ? parallel : sequential), "exitCollectAll");
var exitDie = /* @__PURE__ */ __name((defect) => exitFailCause(die(defect)), "exitDie");
var exitFail = /* @__PURE__ */ __name((error2) => exitFailCause(fail(error2)), "exitFail");
var exitFailCause = /* @__PURE__ */ __name((cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
}, "exitFailCause");
var exitInterrupt = /* @__PURE__ */ __name((fiberId2) => exitFailCause(interrupt(fiberId2)), "exitInterrupt");
var exitMap = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(self.effect_instruction_i0);
    case OP_SUCCESS:
      return exitSucceed(f(self.effect_instruction_i0));
  }
});
var exitMatch = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE:
      return onFailure(self.effect_instruction_i0);
    case OP_SUCCESS:
      return onSuccess(self.effect_instruction_i0);
  }
});
var exitSucceed = /* @__PURE__ */ __name((value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value;
  return effect;
}, "exitSucceed");
var exitVoid = /* @__PURE__ */ exitSucceed(void 0);
var exitZipWith = /* @__PURE__ */ dual(3, (self, that, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitFailCause(self.effect_instruction_i0);
        case OP_FAILURE: {
          return exitFailCause(onFailure(self.effect_instruction_i0, that.effect_instruction_i0));
        }
      }
    }
    case OP_SUCCESS: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitSucceed(onSuccess(self.effect_instruction_i0, that.effect_instruction_i0));
        case OP_FAILURE:
          return exitFailCause(that.effect_instruction_i0);
      }
    }
  }
});
var exitCollectAllInternal = /* @__PURE__ */ __name((exits, combineCauses) => {
  const list = fromIterable2(exits);
  if (!isNonEmpty2(list)) {
    return none2();
  }
  return pipe(tailNonEmpty2(list), reduce(pipe(headNonEmpty2(list), exitMap(of2)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
    onSuccess: /* @__PURE__ */ __name((list2, value) => pipe(list2, prepend2(value)), "onSuccess"),
    onFailure: combineCauses
  }))), exitMap(reverse2), exitMap((chunk2) => toReadonlyArray(chunk2)), some2);
}, "exitCollectAllInternal");
var deferredUnsafeMake = /* @__PURE__ */ __name((fiberId2) => {
  const _deferred = {
    ...CommitPrototype,
    [DeferredTypeId]: deferredVariance,
    state: make11(pending([])),
    commit() {
      return deferredAwait(this);
    },
    blockingOn: fiberId2
  };
  return _deferred;
}, "deferredUnsafeMake");
var deferredAwait = /* @__PURE__ */ __name((self) => asyncInterrupt((resume2) => {
  const state = get5(self.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return resume2(state.effect);
    }
    case OP_STATE_PENDING: {
      state.joiners.push(resume2);
      return deferredInterruptJoiner(self, resume2);
    }
  }
}, self.blockingOn), "deferredAwait");
var deferredUnsafeDone = /* @__PURE__ */ __name((self, effect) => {
  const state = get5(self.state);
  if (state._tag === OP_STATE_PENDING) {
    set2(self.state, done(effect));
    for (let i = 0, len = state.joiners.length; i < len; i++) {
      state.joiners[i](effect);
    }
  }
}, "deferredUnsafeDone");
var deferredInterruptJoiner = /* @__PURE__ */ __name((self, joiner) => sync(() => {
  const state = get5(self.state);
  if (state._tag === OP_STATE_PENDING) {
    const index = state.joiners.indexOf(joiner);
    if (index >= 0) {
      state.joiners.splice(index, 1);
    }
  }
}), "deferredInterruptJoiner");
var constContext = /* @__PURE__ */ withFiberRuntime((fiber) => exitSucceed(fiber.currentContext));
var context = /* @__PURE__ */ __name(() => constContext, "context");
var contextWithEffect = /* @__PURE__ */ __name((f) => flatMap6(context(), f), "contextWithEffect");
var provideContext = /* @__PURE__ */ dual(2, (self, context2) => fiberRefLocally(currentContext, context2)(self));
var mapInputContext = /* @__PURE__ */ dual(2, (self, f) => contextWithEffect((context2) => provideContext(self, f(context2))));
var currentSpanFromFiber = /* @__PURE__ */ __name((fiber) => {
  const span2 = fiber.currentSpan;
  return span2 !== void 0 && span2._tag === "Span" ? some2(span2) : none2();
}, "currentSpanFromFiber");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Exit.js
init_esm();
var isSuccess = exitIsSuccess;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/MutableHashMap.js
init_esm();
var TypeId8 = /* @__PURE__ */ Symbol.for("effect/MutableHashMap");
var MutableHashMapProto = {
  [TypeId8]: TypeId8,
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var MutableHashMapIterator = class _MutableHashMapIterator {
  static {
    __name(this, "MutableHashMapIterator");
  }
  self;
  referentialIterator;
  bucketIterator;
  constructor(self) {
    this.self = self;
    this.referentialIterator = self.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0) {
      return this.bucketIterator.next();
    }
    const result = this.referentialIterator.next();
    if (result.done) {
      this.bucketIterator = new BucketIterator(this.self.buckets.values());
      return this.next();
    }
    return result;
  }
  [Symbol.iterator]() {
    return new _MutableHashMapIterator(this.self);
  }
};
var BucketIterator = class {
  static {
    __name(this, "BucketIterator");
  }
  backing;
  constructor(backing) {
    this.backing = backing;
  }
  currentBucket;
  next() {
    if (this.currentBucket === void 0) {
      const result2 = this.backing.next();
      if (result2.done) {
        return result2;
      }
      this.currentBucket = result2.value[Symbol.iterator]();
    }
    const result = this.currentBucket.next();
    if (result.done) {
      this.currentBucket = void 0;
      return this.next();
    }
    return result;
  }
};
var empty15 = /* @__PURE__ */ __name(() => {
  const self = Object.create(MutableHashMapProto);
  self.referential = /* @__PURE__ */ new Map();
  self.buckets = /* @__PURE__ */ new Map();
  self.bucketsSize = 0;
  return self;
}, "empty");
var get7 = /* @__PURE__ */ dual(2, (self, key) => {
  if (isEqual(key) === false) {
    return self.referential.has(key) ? some2(self.referential.get(key)) : none2();
  }
  const hash2 = key[symbol]();
  const bucket = self.buckets.get(hash2);
  if (bucket === void 0) {
    return none2();
  }
  return getFromBucket(self, bucket, key);
});
var getFromBucket = /* @__PURE__ */ __name((self, bucket, key, remove6 = false) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      const value = bucket[i][1];
      if (remove6) {
        bucket.splice(i, 1);
        self.bucketsSize--;
      }
      return some2(value);
    }
  }
  return none2();
}, "getFromBucket");
var has5 = /* @__PURE__ */ dual(2, (self, key) => isSome2(get7(self, key)));
var set4 = /* @__PURE__ */ dual(3, (self, key, value) => {
  if (isEqual(key) === false) {
    self.referential.set(key, value);
    return self;
  }
  const hash2 = key[symbol]();
  const bucket = self.buckets.get(hash2);
  if (bucket === void 0) {
    self.buckets.set(hash2, [[key, value]]);
    self.bucketsSize++;
    return self;
  }
  removeFromBucket(self, bucket, key);
  bucket.push([key, value]);
  self.bucketsSize++;
  return self;
});
var removeFromBucket = /* @__PURE__ */ __name((self, bucket, key) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      bucket.splice(i, 1);
      self.bucketsSize--;
      return;
    }
  }
}, "removeFromBucket");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/clock.js
init_esm();
var ClockSymbolKey = "effect/Clock";
var ClockTypeId = /* @__PURE__ */ Symbol.for(ClockSymbolKey);
var clockTag = /* @__PURE__ */ GenericTag("effect/Clock");
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis2 = toMillis(duration);
    if (millis2 > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = setTimeout(() => {
      completed = true;
      task();
    }, millis2);
    return () => {
      clearTimeout(handle);
      return !completed;
    };
  }
};
var performanceNowNanos = /* @__PURE__ */ function() {
  const bigint1e62 = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e62;
  }
  let origin;
  return () => {
    if (origin === void 0) {
      origin = BigInt(Date.now()) * bigint1e62 - BigInt(Math.round(performance.now() * 1e6));
    }
    return origin + BigInt(Math.round(performance.now() * 1e6));
  };
}();
var processOrPerformanceNow = /* @__PURE__ */ function() {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
  return () => origin + processHrtime.bigint();
}();
var ClockImpl = class {
  static {
    __name(this, "ClockImpl");
  }
  [ClockTypeId] = ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return succeed(globalClockScheduler);
  }
  sleep(duration) {
    return async_((resume2) => {
      const canceler = globalClockScheduler.unsafeSchedule(() => resume2(void_), duration);
      return asVoid(sync(canceler));
    });
  }
};
var make18 = /* @__PURE__ */ __name(() => new ClockImpl(), "make");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/defaultServices.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/configProvider.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/configError.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/opCodes/configError.js
init_esm();
var OP_AND = "And";
var OP_OR = "Or";
var OP_INVALID_DATA = "InvalidData";
var OP_MISSING_DATA = "MissingData";
var OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
var OP_UNSUPPORTED = "Unsupported";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/configError.js
var ConfigErrorSymbolKey = "effect/ConfigError";
var ConfigErrorTypeId = /* @__PURE__ */ Symbol.for(ConfigErrorSymbolKey);
var proto2 = {
  _tag: "ConfigError",
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
var And = /* @__PURE__ */ __name((self, that) => {
  const error2 = Object.create(proto2);
  error2._op = OP_AND;
  error2.left = self;
  error2.right = that;
  Object.defineProperty(error2, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  Object.defineProperty(error2, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error2;
}, "And");
var Or = /* @__PURE__ */ __name((self, that) => {
  const error2 = Object.create(proto2);
  error2._op = OP_OR;
  error2.left = self;
  error2.right = that;
  Object.defineProperty(error2, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  Object.defineProperty(error2, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error2;
}, "Or");
var InvalidData = /* @__PURE__ */ __name((path, message, options = {
  pathDelim: "."
}) => {
  const error2 = Object.create(proto2);
  error2._op = OP_INVALID_DATA;
  error2.path = path;
  error2.message = message;
  Object.defineProperty(error2, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Invalid data at ${path2}: "${this.message}")`;
    }
  });
  return error2;
}, "InvalidData");
var MissingData = /* @__PURE__ */ __name((path, message, options = {
  pathDelim: "."
}) => {
  const error2 = Object.create(proto2);
  error2._op = OP_MISSING_DATA;
  error2.path = path;
  error2.message = message;
  Object.defineProperty(error2, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Missing data at ${path2}: "${this.message}")`;
    }
  });
  return error2;
}, "MissingData");
var SourceUnavailable = /* @__PURE__ */ __name((path, message, cause, options = {
  pathDelim: "."
}) => {
  const error2 = Object.create(proto2);
  error2._op = OP_SOURCE_UNAVAILABLE;
  error2.path = path;
  error2.message = message;
  error2.cause = cause;
  Object.defineProperty(error2, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Source unavailable at ${path2}: "${this.message}")`;
    }
  });
  return error2;
}, "SourceUnavailable");
var Unsupported = /* @__PURE__ */ __name((path, message, options = {
  pathDelim: "."
}) => {
  const error2 = Object.create(proto2);
  error2._op = OP_UNSUPPORTED;
  error2.path = path;
  error2.message = message;
  Object.defineProperty(error2, "toString", {
    enumerable: false,
    value() {
      const path2 = pipe(this.path, join(options.pathDelim));
      return `(Unsupported operation at ${path2}: "${this.message}")`;
    }
  });
  return error2;
}, "Unsupported");
var prefixed = /* @__PURE__ */ dual(2, (self, prefix) => {
  switch (self._op) {
    case OP_AND: {
      return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self.path], self.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self.path], self.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable([...prefix, ...self.path], self.message, self.cause);
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self.path], self.message);
    }
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/configProvider/pathPatch.js
init_esm();
var empty16 = {
  _tag: "Empty"
};
var patch5 = /* @__PURE__ */ dual(2, (path, patch9) => {
  let input = of3(patch9);
  let output = path;
  while (isCons(input)) {
    const patch10 = input.head;
    switch (patch10._tag) {
      case "Empty": {
        input = input.tail;
        break;
      }
      case "AndThen": {
        input = cons(patch10.first, cons(patch10.second, input.tail));
        break;
      }
      case "MapName": {
        output = map3(output, patch10.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output = prepend(output, patch10.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head(output), contains(patch10.name));
        if (containsName) {
          output = tailNonEmpty(output);
          input = input.tail;
        } else {
          return left2(MissingData(output, `Expected ${patch10.name} to be in path in ConfigProvider#unnested`));
        }
        break;
      }
    }
  }
  return right2(output);
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/opCodes/config.js
init_esm();
var OP_CONSTANT = "Constant";
var OP_FAIL2 = "Fail";
var OP_FALLBACK = "Fallback";
var OP_DESCRIBED = "Described";
var OP_LAZY = "Lazy";
var OP_MAP_OR_FAIL = "MapOrFail";
var OP_NESTED = "Nested";
var OP_PRIMITIVE = "Primitive";
var OP_SEQUENCE = "Sequence";
var OP_HASHMAP = "HashMap";
var OP_ZIP_WITH = "ZipWith";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/configProvider.js
var concat = /* @__PURE__ */ __name((l, r) => [...l, ...r], "concat");
var ConfigProviderSymbolKey = "effect/ConfigProvider";
var ConfigProviderTypeId = /* @__PURE__ */ Symbol.for(ConfigProviderSymbolKey);
var configProviderTag = /* @__PURE__ */ GenericTag("effect/ConfigProvider");
var FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
var FlatConfigProviderTypeId = /* @__PURE__ */ Symbol.for(FlatConfigProviderSymbolKey);
var make20 = /* @__PURE__ */ __name((options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
}), "make");
var makeFlat = /* @__PURE__ */ __name((options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: /* @__PURE__ */ __name((path, config3, split = true) => options.load(path, config3, split), "load"),
  enumerateChildren: options.enumerateChildren
}), "makeFlat");
var fromFlat = /* @__PURE__ */ __name((flat) => make20({
  load: /* @__PURE__ */ __name((config3) => flatMap6(fromFlatLoop(flat, empty(), config3, false), (chunk2) => match2(head(chunk2), {
    onNone: /* @__PURE__ */ __name(() => fail2(MissingData(empty(), `Expected a single value having structure: ${config3}`)), "onNone"),
    onSome: succeed
  })), "load"),
  flattened: flat
}), "fromFlat");
var fromEnv = /* @__PURE__ */ __name((options) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, options);
  const makePathString = /* @__PURE__ */ __name((path) => pipe(path, join(pathDelim)), "makePathString");
  const unmakePathString = /* @__PURE__ */ __name((pathString) => pathString.split(pathDelim), "unmakePathString");
  const getEnv = /* @__PURE__ */ __name(() => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {}, "getEnv");
  const load = /* @__PURE__ */ __name((path, primitive, split = true) => {
    const pathString = makePathString(path);
    const current = getEnv();
    const valueOpt = pathString in current ? some2(current[pathString]) : none2();
    return pipe(valueOpt, mapError(() => MissingData(path, `Expected ${pathString} to exist in the process context`)), flatMap6((value) => parsePrimitive(value, path, primitive, seqDelim, split)));
  }, "load");
  const enumerateChildren = /* @__PURE__ */ __name((path) => sync(() => {
    const current = getEnv();
    const keys6 = Object.keys(current);
    const keyPaths = keys6.map((value) => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter((keyPath) => {
      for (let i = 0; i < path.length; i++) {
        const pathComponent = pipe(path, unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === void 0 || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap((keyPath) => keyPath.slice(path.length, path.length + 1));
    return fromIterable5(filteredKeyPaths);
  }), "enumerateChildren");
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: empty16
  }));
}, "fromEnv");
var extend = /* @__PURE__ */ __name((leftDef, rightDef, left3, right3) => {
  const leftPad = unfold(left3.length, (index) => index >= right3.length ? none2() : some2([leftDef(index), index + 1]));
  const rightPad = unfold(right3.length, (index) => index >= left3.length ? none2() : some2([rightDef(index), index + 1]));
  const leftExtension = concat(left3, leftPad);
  const rightExtension = concat(right3, rightPad);
  return [leftExtension, rightExtension];
}, "extend");
var appendConfigPath = /* @__PURE__ */ __name((path, config3) => {
  let op = config3;
  if (op._tag === "Nested") {
    const out = path.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path;
}, "appendConfigPath");
var fromFlatLoop = /* @__PURE__ */ __name((flat, prefix, config3, split) => {
  const op = config3;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed(of(op.value));
    }
    case OP_DESCRIBED: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config, split));
    }
    case OP_FAIL2: {
      return fail2(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(suspend(() => fromFlatLoop(flat, prefix, op.first, split)), catchAll((error1) => {
        if (op.condition(error1)) {
          return pipe(fromFlatLoop(flat, prefix, op.second, split), catchAll((error2) => fail2(Or(error1, error2))));
        }
        return fail2(error1);
      }));
    }
    case OP_LAZY: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config(), split));
    }
    case OP_MAP_OR_FAIL: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.original, split), flatMap6(forEachSequential((a) => pipe(op.mapOrFail(a), mapError(prefixed(appendConfigPath(prefix, op.original))))))));
    }
    case OP_NESTED: {
      return suspend(() => fromFlatLoop(flat, concat(prefix, of(op.name)), op.config, split));
    }
    case OP_PRIMITIVE: {
      return pipe(patch5(prefix, flat.patch), flatMap6((prefix2) => pipe(flat.load(prefix2, op, split), flatMap6((values3) => {
        if (values3.length === 0) {
          const name = pipe(last(prefix2), getOrElse(() => "<n/a>"));
          return fail2(MissingData([], `Expected ${op.description} with name ${name}`));
        }
        return succeed(values3);
      }))));
    }
    case OP_SEQUENCE: {
      return pipe(patch5(prefix, flat.patch), flatMap6((patchedPrefix) => pipe(flat.enumerateChildren(patchedPrefix), flatMap6(indicesFrom), flatMap6((indices) => {
        if (indices.length === 0) {
          return suspend(() => map9(fromFlatLoop(flat, prefix, op.config, true), of));
        }
        return pipe(forEachSequential(indices, (index) => fromFlatLoop(flat, append(prefix, `[${index}]`), op.config, true)), map9((chunkChunk) => {
          const flattened = flatten(chunkChunk);
          if (flattened.length === 0) {
            return of(empty());
          }
          return of(flattened);
        }));
      }))));
    }
    case OP_HASHMAP: {
      return suspend(() => pipe(patch5(prefix, flat.patch), flatMap6((prefix2) => pipe(flat.enumerateChildren(prefix2), flatMap6((keys6) => {
        return pipe(keys6, forEachSequential((key) => fromFlatLoop(flat, concat(prefix2, of(key)), op.valueConfig, split)), map9((matrix) => {
          if (matrix.length === 0) {
            return of(empty8());
          }
          return pipe(transpose(matrix), map3((values3) => fromIterable6(zip(fromIterable(keys6), values3))));
        }));
      })))));
    }
    case OP_ZIP_WITH: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.left, split), either2, flatMap6((left3) => pipe(fromFlatLoop(flat, prefix, op.right, split), either2, flatMap6((right3) => {
        if (isLeft2(left3) && isLeft2(right3)) {
          return fail2(And(left3.left, right3.left));
        }
        if (isLeft2(left3) && isRight2(right3)) {
          return fail2(left3.left);
        }
        if (isRight2(left3) && isLeft2(right3)) {
          return fail2(right3.left);
        }
        if (isRight2(left3) && isRight2(right3)) {
          const path = pipe(prefix, join("."));
          const fail3 = fromFlatLoopFail(prefix, path);
          const [lefts, rights] = extend(fail3, fail3, pipe(left3.right, map3(right2)), pipe(right3.right, map3(right2)));
          return pipe(lefts, zip(rights), forEachSequential(([left4, right4]) => pipe(zip2(left4, right4), map9(([left5, right5]) => op.zip(left5, right5)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
    }
  }
}, "fromFlatLoop");
var fromFlatLoopFail = /* @__PURE__ */ __name((prefix, path) => (index) => left2(MissingData(prefix, `The element at index ${index} in a sequence at path "${path}" was missing`)), "fromFlatLoopFail");
var splitPathString = /* @__PURE__ */ __name((text, delim) => {
  const split = text.split(new RegExp(`\\s*${escape(delim)}\\s*`));
  return split;
}, "splitPathString");
var parsePrimitive = /* @__PURE__ */ __name((text, path, primitive, delimiter, split) => {
  if (!split) {
    return pipe(primitive.parse(text), mapBoth({
      onFailure: prefixed(path),
      onSuccess: of
    }));
  }
  return pipe(splitPathString(text, delimiter), forEachSequential((char) => primitive.parse(char.trim())), mapError(prefixed(path)));
}, "parsePrimitive");
var transpose = /* @__PURE__ */ __name((array3) => {
  return Object.keys(array3[0]).map((column) => array3.map((row) => row[column]));
}, "transpose");
var indicesFrom = /* @__PURE__ */ __name((quotedIndices) => pipe(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth({
  onFailure: /* @__PURE__ */ __name(() => empty(), "onFailure"),
  onSuccess: sort(Order)
}), either2, map9(merge)), "indicesFrom");
var QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
var parseQuotedIndex = /* @__PURE__ */ __name((str) => {
  const match8 = str.match(QUOTED_INDEX_REGEX);
  if (match8 !== null) {
    const matchedIndex = match8[2];
    return pipe(matchedIndex !== void 0 && matchedIndex.length > 0 ? some2(matchedIndex) : none2(), flatMap(parseInteger));
  }
  return none2();
}, "parseQuotedIndex");
var parseInteger = /* @__PURE__ */ __name((str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none2() : some2(parsedIndex);
}, "parseInteger");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/defaultServices/console.js
init_esm();
var TypeId9 = /* @__PURE__ */ Symbol.for("effect/Console");
var consoleTag = /* @__PURE__ */ GenericTag("effect/Console");
var defaultConsole = {
  [TypeId9]: TypeId9,
  assert(condition, ...args2) {
    return sync(() => {
      console.assert(condition, ...args2);
    });
  },
  clear: /* @__PURE__ */ sync(() => {
    console.clear();
  }),
  count(label) {
    return sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync(() => {
      console.countReset(label);
    });
  },
  debug(...args2) {
    return sync(() => {
      console.debug(...args2);
    });
  },
  dir(item, options) {
    return sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args2) {
    return sync(() => {
      console.dirxml(...args2);
    });
  },
  error(...args2) {
    return sync(() => {
      console.error(...args2);
    });
  },
  group(options) {
    return options?.collapsed ? sync(() => console.groupCollapsed(options?.label)) : sync(() => console.group(options?.label));
  },
  groupEnd: /* @__PURE__ */ sync(() => {
    console.groupEnd();
  }),
  info(...args2) {
    return sync(() => {
      console.info(...args2);
    });
  },
  log(...args2) {
    return sync(() => {
      console.log(...args2);
    });
  },
  table(tabularData, properties) {
    return sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync(() => console.time(label));
  },
  timeEnd(label) {
    return sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args2) {
    return sync(() => {
      console.timeLog(label, ...args2);
    });
  },
  trace(...args2) {
    return sync(() => {
      console.trace(...args2);
    });
  },
  warn(...args2) {
    return sync(() => {
      console.warn(...args2);
    });
  },
  unsafe: console
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/random.js
init_esm();
var RandomSymbolKey = "effect/Random";
var RandomTypeId = /* @__PURE__ */ Symbol.for(RandomSymbolKey);
var randomTag = /* @__PURE__ */ GenericTag("effect/Random");
var RandomImpl = class {
  static {
    __name(this, "RandomImpl");
  }
  seed;
  [RandomTypeId] = RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom(seed);
  }
  get next() {
    return sync(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map9(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min2, max2) {
    return map9(this.next, (n) => (max2 - min2) * n + min2);
  }
  nextIntBetween(min2, max2) {
    return sync(() => this.PRNG.integer(max2 - min2) + min2);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
};
var shuffleWith = /* @__PURE__ */ __name((elements, nextIntBounded) => {
  return suspend(() => pipe(sync(() => Array.from(elements)), flatMap6((buffer) => {
    const numbers = [];
    for (let i = buffer.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe(numbers, forEachSequentialDiscard((n) => pipe(nextIntBounded(n), map9((k) => swap(buffer, n - 1, k)))), as(fromIterable2(buffer)));
  })));
}, "shuffleWith");
var swap = /* @__PURE__ */ __name((buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
}, "swap");
var make21 = /* @__PURE__ */ __name((seed) => new RandomImpl(hash(seed)), "make");
var FixedRandomImpl = class {
  static {
    __name(this, "FixedRandomImpl");
  }
  values;
  [RandomTypeId] = RandomTypeId;
  index = 0;
  constructor(values3) {
    this.values = values3;
    if (values3.length === 0) {
      throw new Error("Requires at least one value");
    }
  }
  getNextValue() {
    const value = this.values[this.index];
    this.index = (this.index + 1) % this.values.length;
    return value;
  }
  get next() {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "number") {
        return Math.max(0, Math.min(1, value));
      }
      return hash(value) / 2147483647;
    });
  }
  get nextBoolean() {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "boolean") {
        return value;
      }
      return hash(value) % 2 === 0;
    });
  }
  get nextInt() {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.round(value);
      }
      return Math.abs(hash(value));
    });
  }
  nextRange(min2, max2) {
    return map9(this.next, (n) => (max2 - min2) * n + min2);
  }
  nextIntBetween(min2, max2) {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(min2, Math.min(max2 - 1, Math.round(value)));
      }
      const hash2 = Math.abs(hash(value));
      return min2 + hash2 % (max2 - min2);
    });
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/tracer.js
init_esm();
var TracerTypeId = /* @__PURE__ */ Symbol.for("effect/Tracer");
var make22 = /* @__PURE__ */ __name((options) => ({
  [TracerTypeId]: TracerTypeId,
  ...options
}), "make");
var tracerTag = /* @__PURE__ */ GenericTag("effect/Tracer");
var spanTag = /* @__PURE__ */ GenericTag("effect/ParentSpan");
var randomHexString = /* @__PURE__ */ function() {
  const characters = "abcdef0123456789";
  const charactersLength = characters.length;
  return function(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}();
var NativeSpan = class {
  static {
    __name(this, "NativeSpan");
  }
  name;
  parent;
  context;
  startTime;
  kind;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  links;
  constructor(name, parent, context2, links, startTime, kind) {
    this.name = name;
    this.parent = parent;
    this.context = context2;
    this.startTime = startTime;
    this.kind = kind;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = /* @__PURE__ */ new Map();
    this.traceId = parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
    this.spanId = randomHexString(16);
    this.links = Array.from(links);
  }
  end(endTime, exit3) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit3,
      startTime: this.status.startTime
    };
  }
  attribute(key, value) {
    this.attributes.set(key, value);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
  addLinks(links) {
    this.links.push(...links);
  }
};
var nativeTracer = /* @__PURE__ */ make22({
  span: /* @__PURE__ */ __name((name, parent, context2, links, startTime, kind) => new NativeSpan(name, parent, context2, links, startTime, kind), "span"),
  context: /* @__PURE__ */ __name((f) => f(), "context")
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/defaultServices.js
var liveServices = /* @__PURE__ */ pipe(/* @__PURE__ */ empty3(), /* @__PURE__ */ add2(clockTag, /* @__PURE__ */ make18()), /* @__PURE__ */ add2(consoleTag, defaultConsole), /* @__PURE__ */ add2(randomTag, /* @__PURE__ */ make21(/* @__PURE__ */ Math.random())), /* @__PURE__ */ add2(configProviderTag, /* @__PURE__ */ fromEnv()), /* @__PURE__ */ add2(tracerTag, nativeTracer));
var currentServices = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberRefs.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberRefs.js
init_esm();
function unsafeMake3(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
__name(unsafeMake3, "unsafeMake");
function empty17() {
  return unsafeMake3(/* @__PURE__ */ new Map());
}
__name(empty17, "empty");
var FiberRefsSym = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var FiberRefsImpl = class {
  static {
    __name(this, "FiberRefsImpl");
  }
  locals;
  [FiberRefsSym] = FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var findAncestor = /* @__PURE__ */ __name((_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = void 0;
  while (ret === void 0) {
    if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = headNonEmpty(parentStack)[0];
      const parentAncestors = tailNonEmpty(parentStack);
      const childFiberId = headNonEmpty(childStack)[0];
      const childRefValue = headNonEmpty(childStack)[1];
      const childAncestors = tailNonEmpty(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
}, "findAncestor");
var joinAs = /* @__PURE__ */ dual(3, (self, fiberId2, that) => {
  const parentFiberRefs = new Map(self.locals);
  that.locals.forEach((childStack, fiberRef) => {
    const childValue = childStack[0][1];
    if (!childStack[0][0][symbol2](fiberId2)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals(childValue, fiberRef.initial)) {
          return;
        }
        parentFiberRefs.set(fiberRef, [[fiberId2, fiberRef.join(fiberRef.initial, childValue)]]);
        return;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch9 = fiberRef.diff(ancestor, childValue);
        const oldValue = parentStack[0][1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch9)(oldValue));
        if (!equals(oldValue, newValue)) {
          let newStack;
          const parentFiberId = parentStack[0][0];
          if (parentFiberId[symbol2](fiberId2)) {
            newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
          } else {
            newStack = [[fiberId2, newValue], ...parentStack];
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  });
  return new FiberRefsImpl(parentFiberRefs);
});
var forkAs = /* @__PURE__ */ dual(2, (self, childId) => {
  const map13 = /* @__PURE__ */ new Map();
  unsafeForkAs(self, map13, childId);
  return new FiberRefsImpl(map13);
});
var unsafeForkAs = /* @__PURE__ */ __name((self, map13, fiberId2) => {
  self.locals.forEach((stack, fiberRef) => {
    const oldValue = stack[0][1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals(oldValue, newValue)) {
      map13.set(fiberRef, stack);
    } else {
      map13.set(fiberRef, [[fiberId2, newValue], ...stack]);
    }
  });
}, "unsafeForkAs");
var delete_ = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  const locals = new Map(self.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
var get8 = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  if (!self.locals.has(fiberRef)) {
    return none2();
  }
  return some2(headNonEmpty(self.locals.get(fiberRef))[1]);
});
var getOrDefault = /* @__PURE__ */ dual(2, (self, fiberRef) => pipe(get8(self, fiberRef), getOrElse(() => fiberRef.initial)));
var updateAs = /* @__PURE__ */ dual(2, (self, {
  fiberId: fiberId2,
  fiberRef,
  value
}) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(/* @__PURE__ */ new Map([[fiberRef, [[fiberId2, value]]]]));
  }
  const locals = new Map(self.locals);
  unsafeUpdateAs(locals, fiberId2, fiberRef, value);
  return new FiberRefsImpl(locals);
});
var unsafeUpdateAs = /* @__PURE__ */ __name((locals, fiberId2, fiberRef, value) => {
  const oldStack = locals.get(fiberRef) ?? [];
  let newStack;
  if (isNonEmptyReadonlyArray(oldStack)) {
    const [currentId, currentValue] = headNonEmpty(oldStack);
    if (currentId[symbol2](fiberId2)) {
      if (equals(currentValue, value)) {
        return;
      } else {
        newStack = [[fiberId2, value], ...oldStack.slice(1)];
      }
    } else {
      newStack = [[fiberId2, value], ...oldStack];
    }
  } else {
    newStack = [[fiberId2, value]];
  }
  locals.set(fiberRef, newStack);
}, "unsafeUpdateAs");
var updateManyAs = /* @__PURE__ */ dual(2, (self, {
  entries: entries2,
  forkAs: forkAs2
}) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(new Map(entries2));
  }
  const locals = new Map(self.locals);
  if (forkAs2 !== void 0) {
    unsafeForkAs(self, locals, forkAs2);
  }
  entries2.forEach(([fiberRef, values3]) => {
    if (values3.length === 1) {
      unsafeUpdateAs(locals, values3[0][0], fiberRef, values3[0][1]);
    } else {
      values3.forEach(([fiberId2, value]) => {
        unsafeUpdateAs(locals, fiberId2, fiberRef, value);
      });
    }
  });
  return new FiberRefsImpl(locals);
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberRefs.js
var getOrDefault2 = getOrDefault;
var updateManyAs2 = updateManyAs;
var empty18 = empty17;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/LogLevel.js
init_esm();
var All = logLevelAll;
var Fatal = logLevelFatal;
var Error2 = logLevelError;
var Warning = logLevelWarning;
var Info = logLevelInfo;
var Debug = logLevelDebug;
var Trace = logLevelTrace;
var None3 = logLevelNone;
var Order2 = /* @__PURE__ */ pipe(Order, /* @__PURE__ */ mapInput2((level) => level.ordinal));
var greaterThan2 = /* @__PURE__ */ greaterThan(Order2);
var fromLiteral = /* @__PURE__ */ __name((literal) => {
  switch (literal) {
    case "All":
      return All;
    case "Debug":
      return Debug;
    case "Error":
      return Error2;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None3;
    case "Warning":
      return Warning;
  }
}, "fromLiteral");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/logSpan.js
init_esm();
var formatLabel = /* @__PURE__ */ __name((key) => key.replace(/[\s="]/g, "_"), "formatLabel");
var render = /* @__PURE__ */ __name((now) => (self) => {
  const label = formatLabel(self.label);
  return `${label}=${now - self.startTime}ms`;
}, "render");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Effectable.js
init_esm();
var EffectPrototype2 = EffectPrototype;
var Base2 = Base;
var Class2 = class extends Base2 {
  static {
    __name(this, "Class");
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberRefs/patch.js
init_esm();
var OP_EMPTY2 = "Empty";
var OP_ADD = "Add";
var OP_REMOVE = "Remove";
var OP_UPDATE = "Update";
var OP_AND_THEN = "AndThen";
var empty19 = {
  _tag: OP_EMPTY2
};
var diff5 = /* @__PURE__ */ __name((oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch9 = empty19;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue2 = headNonEmpty(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== void 0) {
      const oldValue2 = headNonEmpty(old)[1];
      if (!equals(oldValue2, newValue2)) {
        patch9 = combine6({
          _tag: OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue2, newValue2)
        })(patch9);
      }
    } else {
      patch9 = combine6({
        _tag: OP_ADD,
        fiberRef,
        value: newValue2
      })(patch9);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch9 = combine6({
      _tag: OP_REMOVE,
      fiberRef
    })(patch9);
  }
  return patch9;
}, "diff");
var combine6 = /* @__PURE__ */ dual(2, (self, that) => ({
  _tag: OP_AND_THEN,
  first: self,
  second: that
}));
var patch6 = /* @__PURE__ */ dual(3, (self, fiberId2, oldValue) => {
  let fiberRefs2 = oldValue;
  let patches = of(self);
  while (isNonEmptyReadonlyArray(patches)) {
    const head3 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head3._tag) {
      case OP_EMPTY2: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs2 = updateAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head3.fiberRef,
          value: head3.value
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs2 = delete_(fiberRefs2, head3.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value = getOrDefault(fiberRefs2, head3.fiberRef);
        fiberRefs2 = updateAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head3.fiberRef,
          value: head3.fiberRef.patch(head3.patch)(value)
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN: {
        patches = prepend(head3.first)(prepend(head3.second)(tail));
        break;
      }
    }
  }
  return fiberRefs2;
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/label.js
init_esm();
var MetricLabelSymbolKey = "effect/MetricLabel";
var MetricLabelTypeId = /* @__PURE__ */ Symbol.for(MetricLabelSymbolKey);
var MetricLabelImpl = class {
  static {
    __name(this, "MetricLabelImpl");
  }
  key;
  value;
  [MetricLabelTypeId] = MetricLabelTypeId;
  _hash;
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this._hash = string(MetricLabelSymbolKey + this.key + this.value);
  }
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isMetricLabel(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make23 = /* @__PURE__ */ __name((key, value) => {
  return new MetricLabelImpl(key, value);
}, "make");
var isMetricLabel = /* @__PURE__ */ __name((u) => hasProperty(u, MetricLabelTypeId), "isMetricLabel");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberRuntime.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/ExecutionStrategy.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/executionStrategy.js
init_esm();
var OP_SEQUENTIAL2 = "Sequential";
var OP_PARALLEL2 = "Parallel";
var OP_PARALLEL_N = "ParallelN";
var sequential2 = {
  _tag: OP_SEQUENTIAL2
};
var parallel2 = {
  _tag: OP_PARALLEL2
};
var parallelN = /* @__PURE__ */ __name((parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism
}), "parallelN");
var isSequential = /* @__PURE__ */ __name((self) => self._tag === OP_SEQUENTIAL2, "isSequential");
var isParallel = /* @__PURE__ */ __name((self) => self._tag === OP_PARALLEL2, "isParallel");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/ExecutionStrategy.js
var sequential3 = sequential2;
var parallel3 = parallel2;
var parallelN2 = parallelN;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberRefsPatch.js
init_esm();
var diff6 = diff5;
var patch7 = patch6;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberStatus.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberStatus.js
init_esm();
var FiberStatusSymbolKey = "effect/FiberStatus";
var FiberStatusTypeId = /* @__PURE__ */ Symbol.for(FiberStatusSymbolKey);
var OP_DONE = "Done";
var OP_RUNNING = "Running";
var OP_SUSPENDED = "Suspended";
var DoneHash = /* @__PURE__ */ string(`${FiberStatusSymbolKey}-${OP_DONE}`);
var Done = class {
  static {
    __name(this, "Done");
  }
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol]() {
    return DoneHash;
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
};
var Running = class {
  static {
    __name(this, "Running");
  }
  runtimeFlags;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_RUNNING;
  constructor(runtimeFlags2) {
    this.runtimeFlags = runtimeFlags2;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), cached2(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
};
var Suspended = class {
  static {
    __name(this, "Suspended");
  }
  runtimeFlags;
  blockingOn;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_SUSPENDED;
  constructor(runtimeFlags2, blockingOn) {
    this.runtimeFlags = runtimeFlags2;
    this.blockingOn = blockingOn;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), combine(hash(this.blockingOn)), cached2(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && equals(this.blockingOn, that.blockingOn);
  }
};
var done2 = /* @__PURE__ */ new Done();
var running = /* @__PURE__ */ __name((runtimeFlags2) => new Running(runtimeFlags2), "running");
var suspended = /* @__PURE__ */ __name((runtimeFlags2, blockingOn) => new Suspended(runtimeFlags2, blockingOn), "suspended");
var isFiberStatus = /* @__PURE__ */ __name((u) => hasProperty(u, FiberStatusTypeId), "isFiberStatus");
var isDone = /* @__PURE__ */ __name((self) => self._tag === OP_DONE, "isDone");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/FiberStatus.js
var done3 = done2;
var running2 = running;
var suspended2 = suspended;
var isDone2 = isDone;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Micro.js
init_esm();
var TypeId10 = /* @__PURE__ */ Symbol.for("effect/Micro");
var MicroExitTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit");
var MicroCauseTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause");
var microCauseVariance = {
  _E: identity
};
var MicroCauseImpl = class extends globalThis.Error {
  static {
    __name(this, "MicroCauseImpl");
  }
  _tag;
  traces;
  [MicroCauseTypeId];
  constructor(_tag, originalError, traces) {
    const causeName = `MicroCause.${_tag}`;
    let name;
    let message;
    let stack;
    if (originalError instanceof globalThis.Error) {
      name = `(${causeName}) ${originalError.name}`;
      message = originalError.message;
      const messageLines = message.split("\n").length;
      stack = originalError.stack ? `(${causeName}) ${originalError.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
    } else {
      name = causeName;
      message = toStringUnknown(originalError, 0);
      stack = `${name}: ${message}`;
    }
    if (traces.length > 0) {
      stack += `
    ${traces.join("\n    ")}`;
    }
    super(message);
    this._tag = _tag;
    this.traces = traces;
    this[MicroCauseTypeId] = microCauseVariance;
    this.name = name;
    this.stack = stack;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [NodeInspectSymbol]() {
    return this.stack;
  }
};
var Die = class extends MicroCauseImpl {
  static {
    __name(this, "Die");
  }
  defect;
  constructor(defect, traces = []) {
    super("Die", defect, traces);
    this.defect = defect;
  }
};
var causeDie = /* @__PURE__ */ __name((defect, traces = []) => new Die(defect, traces), "causeDie");
var Interrupt = class extends MicroCauseImpl {
  static {
    __name(this, "Interrupt");
  }
  constructor(traces = []) {
    super("Interrupt", "interrupted", traces);
  }
};
var causeInterrupt = /* @__PURE__ */ __name((traces = []) => new Interrupt(traces), "causeInterrupt");
var causeIsInterrupt = /* @__PURE__ */ __name((self) => self._tag === "Interrupt", "causeIsInterrupt");
var MicroFiberTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber");
var fiberVariance = {
  _A: identity,
  _E: identity
};
var MicroFiberImpl = class {
  static {
    __name(this, "MicroFiberImpl");
  }
  context;
  interruptible;
  [MicroFiberTypeId];
  _stack = [];
  _observers = [];
  _exit;
  _children;
  currentOpCount = 0;
  constructor(context2, interruptible4 = true) {
    this.context = context2;
    this.interruptible = interruptible4;
    this[MicroFiberTypeId] = fiberVariance;
  }
  getRef(ref) {
    return unsafeGetReference(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit) {
      cb(this._exit);
      return constVoid;
    }
    this._observers.push(cb);
    return () => {
      const index = this._observers.indexOf(cb);
      if (index >= 0) {
        this._observers.splice(index, 1);
      }
    };
  }
  _interrupted = false;
  unsafeInterrupt() {
    if (this._exit) {
      return;
    }
    this._interrupted = true;
    if (this.interruptible) {
      this.evaluate(exitInterrupt2);
    }
  }
  unsafePoll() {
    return this._exit;
  }
  evaluate(effect) {
    if (this._exit) {
      return;
    } else if (this._yielded !== void 0) {
      const yielded = this._yielded;
      this._yielded = void 0;
      yielded();
    }
    const exit3 = this.runLoop(effect);
    if (exit3 === Yield) {
      return;
    }
    const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0) {
      return this.evaluate(flatMap7(interruptChildren, () => exit3));
    }
    this._exit = exit3;
    for (let i = 0; i < this._observers.length; i++) {
      this._observers[i](exit3);
    }
    this._observers.length = 0;
  }
  runLoop(effect) {
    let yielding = false;
    let current = effect;
    this.currentOpCount = 0;
    try {
      while (true) {
        this.currentOpCount++;
        if (!yielding && this.getRef(CurrentScheduler).shouldYield(this)) {
          yielding = true;
          const prev = current;
          current = flatMap7(yieldNow2, () => prev);
        }
        current = current[evaluate](this);
        if (current === Yield) {
          const yielded = this._yielded;
          if (MicroExitTypeId in yielded) {
            this._yielded = void 0;
            return yielded;
          }
          return Yield;
        }
      }
    } catch (error2) {
      if (!hasProperty(current, evaluate)) {
        return exitDie2(`MicroFiber.runLoop: Not a valid effect: ${String(current)}`);
      }
      return exitDie2(error2);
    }
  }
  getCont(symbol3) {
    while (true) {
      const op = this._stack.pop();
      if (!op) return void 0;
      const cont = op[ensureCont] && op[ensureCont](this);
      if (cont) return {
        [symbol3]: cont
      };
      if (op[symbol3]) return op;
    }
  }
  // cancel the yielded operation, or for the yielded exit value
  _yielded = void 0;
  yieldWith(value) {
    this._yielded = value;
    return Yield;
  }
  children() {
    return this._children ??= /* @__PURE__ */ new Set();
  }
};
var fiberMiddleware = /* @__PURE__ */ globalValue("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
}));
var fiberInterruptAll = /* @__PURE__ */ __name((fibers) => suspend2(() => {
  for (const fiber of fibers) fiber.unsafeInterrupt();
  const iter = fibers[Symbol.iterator]();
  const wait = suspend2(() => {
    let result = iter.next();
    while (!result.done) {
      if (result.value.unsafePoll()) {
        result = iter.next();
        continue;
      }
      const fiber = result.value;
      return async((resume2) => {
        fiber.addObserver((_) => {
          resume2(wait);
        });
      });
    }
    return exitVoid2;
  });
  return wait;
}), "fiberInterruptAll");
var identifier = /* @__PURE__ */ Symbol.for("effect/Micro/identifier");
var args = /* @__PURE__ */ Symbol.for("effect/Micro/args");
var evaluate = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate");
var successCont = /* @__PURE__ */ Symbol.for("effect/Micro/successCont");
var failureCont = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont");
var ensureCont = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont");
var Yield = /* @__PURE__ */ Symbol.for("effect/Micro/Yield");
var microVariance = {
  _A: identity,
  _E: identity,
  _R: identity
};
var MicroProto = {
  ...EffectPrototype2,
  _op: "Micro",
  [TypeId10]: microVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  },
  toString() {
    return format(this);
  },
  [NodeInspectSymbol]() {
    return format(this);
  }
};
function defaultEvaluate(_fiber) {
  return exitDie2(`Micro.evaluate: Not implemented`);
}
__name(defaultEvaluate, "defaultEvaluate");
var makePrimitiveProto = /* @__PURE__ */ __name((options) => ({
  ...MicroProto,
  [identifier]: options.op,
  [evaluate]: options.eval ?? defaultEvaluate,
  [successCont]: options.contA,
  [failureCont]: options.contE,
  [ensureCont]: options.ensure
}), "makePrimitiveProto");
var makePrimitive = /* @__PURE__ */ __name((options) => {
  const Proto = makePrimitiveProto(options);
  return function() {
    const self = Object.create(Proto);
    self[args] = options.single === false ? arguments : arguments[0];
    return self;
  };
}, "makePrimitive");
var makeExit = /* @__PURE__ */ __name((options) => {
  const Proto = {
    ...makePrimitiveProto(options),
    [MicroExitTypeId]: MicroExitTypeId,
    _tag: options.op,
    get [options.prop]() {
      return this[args];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: options.op,
        [options.prop]: this[args]
      };
    },
    [symbol2](that) {
      return isMicroExit(that) && that._tag === options.op && equals(this[args], that[args]);
    },
    [symbol]() {
      return cached2(this, combine(string(options.op))(hash(this[args])));
    }
  };
  return function(value) {
    const self = Object.create(Proto);
    self[args] = value;
    self[successCont] = void 0;
    self[failureCont] = void 0;
    self[ensureCont] = void 0;
    return self;
  };
}, "makeExit");
var succeed2 = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  eval(fiber) {
    const cont = fiber.getCont(successCont);
    return cont ? cont[successCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
var failCause2 = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  eval(fiber) {
    let cont = fiber.getCont(failureCont);
    while (causeIsInterrupt(this[args]) && cont && fiber.interruptible) {
      cont = fiber.getCont(failureCont);
    }
    return cont ? cont[failureCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
var sync2 = /* @__PURE__ */ makePrimitive({
  op: "Sync",
  eval(fiber) {
    const value = this[args]();
    const cont = fiber.getCont(successCont);
    return cont ? cont[successCont](value, fiber) : fiber.yieldWith(exitSucceed2(value));
  }
});
var suspend2 = /* @__PURE__ */ makePrimitive({
  op: "Suspend",
  eval(_fiber) {
    return this[args]();
  }
});
var yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  eval(fiber) {
    let resumed = false;
    fiber.getRef(CurrentScheduler).scheduleTask(() => {
      if (resumed) return;
      fiber.evaluate(exitVoid2);
    }, this[args] ?? 0);
    return fiber.yieldWith(() => {
      resumed = true;
    });
  }
});
var yieldNow2 = /* @__PURE__ */ yieldNowWith(0);
var void_2 = /* @__PURE__ */ succeed2(void 0);
var withMicroFiber = /* @__PURE__ */ makePrimitive({
  op: "WithMicroFiber",
  eval(fiber) {
    return this[args](fiber);
  }
});
var asyncOptions = /* @__PURE__ */ makePrimitive({
  op: "Async",
  single: false,
  eval(fiber) {
    const register = this[args][0];
    let resumed = false;
    let yielded = false;
    const controller = this[args][1] ? new AbortController() : void 0;
    const onCancel = register((effect) => {
      if (resumed) return;
      resumed = true;
      if (yielded) {
        fiber.evaluate(effect);
      } else {
        yielded = effect;
      }
    }, controller?.signal);
    if (yielded !== false) return yielded;
    yielded = true;
    fiber._yielded = () => {
      resumed = true;
    };
    if (controller === void 0 && onCancel === void 0) {
      return Yield;
    }
    fiber._stack.push(asyncFinalizer(() => {
      resumed = true;
      controller?.abort();
      return onCancel ?? exitVoid2;
    }));
    return Yield;
  }
});
var asyncFinalizer = /* @__PURE__ */ makePrimitive({
  op: "AsyncFinalizer",
  ensure(fiber) {
    if (fiber.interruptible) {
      fiber.interruptible = false;
      fiber._stack.push(setInterruptible(true));
    }
  },
  contE(cause, _fiber) {
    return causeIsInterrupt(cause) ? flatMap7(this[args](), () => failCause2(cause)) : failCause2(cause);
  }
});
var async = /* @__PURE__ */ __name((register) => asyncOptions(register, register.length >= 2), "async");
var as2 = /* @__PURE__ */ dual(2, (self, value) => map10(self, (_) => value));
var exit2 = /* @__PURE__ */ __name((self) => matchCause2(self, {
  onFailure: exitFailCause2,
  onSuccess: exitSucceed2
}), "exit");
var flatMap7 = /* @__PURE__ */ dual(2, (self, f) => {
  const onSuccess = Object.create(OnSuccessProto);
  onSuccess[args] = self;
  onSuccess[successCont] = f;
  return onSuccess;
});
var OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
var map10 = /* @__PURE__ */ dual(2, (self, f) => flatMap7(self, (a) => succeed2(f(a))));
var isMicroExit = /* @__PURE__ */ __name((u) => hasProperty(u, MicroExitTypeId), "isMicroExit");
var exitSucceed2 = succeed2;
var exitFailCause2 = failCause2;
var exitInterrupt2 = /* @__PURE__ */ exitFailCause2(/* @__PURE__ */ causeInterrupt());
var exitDie2 = /* @__PURE__ */ __name((defect) => exitFailCause2(causeDie(defect)), "exitDie");
var exitVoid2 = /* @__PURE__ */ exitSucceed2(void 0);
var exitVoidAll = /* @__PURE__ */ __name((exits) => {
  for (const exit3 of exits) {
    if (exit3._tag === "Failure") {
      return exit3;
    }
  }
  return exitVoid2;
}, "exitVoidAll");
var setImmediate = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);
var MicroSchedulerDefault = class {
  static {
    __name(this, "MicroSchedulerDefault");
  }
  tasks = [];
  running = false;
  /**
   * @since 3.5.9
   */
  scheduleTask(task, _priority) {
    this.tasks.push(task);
    if (!this.running) {
      this.running = true;
      setImmediate(this.afterScheduled);
    }
  }
  /**
   * @since 3.5.9
   */
  afterScheduled = /* @__PURE__ */ __name(() => {
    this.running = false;
    this.runTasks();
  }, "afterScheduled");
  /**
   * @since 3.5.9
   */
  runTasks() {
    const tasks2 = this.tasks;
    this.tasks = [];
    for (let i = 0, len = tasks2.length; i < len; i++) {
      tasks2[i]();
    }
  }
  /**
   * @since 3.5.9
   */
  shouldYield(fiber) {
    return fiber.currentOpCount >= fiber.getRef(MaxOpsBeforeYield);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    while (this.tasks.length > 0) {
      this.runTasks();
    }
  }
};
var updateContext = /* @__PURE__ */ dual(2, (self, f) => withMicroFiber((fiber) => {
  const prev = fiber.context;
  fiber.context = f(prev);
  return onExit2(self, () => {
    fiber.context = prev;
    return void_2;
  });
}));
var provideContext2 = /* @__PURE__ */ dual(2, (self, provided) => updateContext(self, merge3(provided)));
var MaxOpsBeforeYield = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: /* @__PURE__ */ __name(() => 2048, "defaultValue")
})) {
  static {
    __name(this, "MaxOpsBeforeYield");
  }
};
var CurrentConcurrency = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentConcurrency", {
  defaultValue: /* @__PURE__ */ __name(() => "unbounded", "defaultValue")
})) {
  static {
    __name(this, "CurrentConcurrency");
  }
};
var CurrentScheduler = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentScheduler", {
  defaultValue: /* @__PURE__ */ __name(() => new MicroSchedulerDefault(), "defaultValue")
})) {
  static {
    __name(this, "CurrentScheduler");
  }
};
var matchCauseEffect2 = /* @__PURE__ */ dual(2, (self, options) => {
  const primitive = Object.create(OnSuccessAndFailureProto);
  primitive[args] = self;
  primitive[successCont] = options.onSuccess;
  primitive[failureCont] = options.onFailure;
  return primitive;
});
var OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
var matchCause2 = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect2(self, {
  onFailure: /* @__PURE__ */ __name((cause) => sync2(() => options.onFailure(cause)), "onFailure"),
  onSuccess: /* @__PURE__ */ __name((value) => sync2(() => options.onSuccess(value)), "onSuccess")
}));
var MicroScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroScope");
var MicroScopeImpl = class _MicroScopeImpl {
  static {
    __name(this, "MicroScopeImpl");
  }
  [MicroScopeTypeId];
  state = {
    _tag: "Open",
    finalizers: /* @__PURE__ */ new Set()
  };
  constructor() {
    this[MicroScopeTypeId] = MicroScopeTypeId;
  }
  unsafeAddFinalizer(finalizer) {
    if (this.state._tag === "Open") {
      this.state.finalizers.add(finalizer);
    }
  }
  addFinalizer(finalizer) {
    return suspend2(() => {
      if (this.state._tag === "Open") {
        this.state.finalizers.add(finalizer);
        return void_2;
      }
      return finalizer(this.state.exit);
    });
  }
  unsafeRemoveFinalizer(finalizer) {
    if (this.state._tag === "Open") {
      this.state.finalizers.delete(finalizer);
    }
  }
  close(microExit) {
    return suspend2(() => {
      if (this.state._tag === "Open") {
        const finalizers = Array.from(this.state.finalizers).reverse();
        this.state = {
          _tag: "Closed",
          exit: microExit
        };
        return flatMap7(forEach3(finalizers, (finalizer) => exit2(finalizer(microExit))), exitVoidAll);
      }
      return void_2;
    });
  }
  get fork() {
    return sync2(() => {
      const newScope = new _MicroScopeImpl();
      if (this.state._tag === "Closed") {
        newScope.state = this.state;
        return newScope;
      }
      function fin(exit3) {
        return newScope.close(exit3);
      }
      __name(fin, "fin");
      this.state.finalizers.add(fin);
      newScope.unsafeAddFinalizer((_) => sync2(() => this.unsafeRemoveFinalizer(fin)));
      return newScope;
    });
  }
};
var onExit2 = /* @__PURE__ */ dual(2, (self, f) => uninterruptibleMask2((restore) => matchCauseEffect2(restore(self), {
  onFailure: /* @__PURE__ */ __name((cause) => flatMap7(f(exitFailCause2(cause)), () => failCause2(cause)), "onFailure"),
  onSuccess: /* @__PURE__ */ __name((a) => flatMap7(f(exitSucceed2(a)), () => succeed2(a)), "onSuccess")
})));
var setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  ensure(fiber) {
    fiber.interruptible = this[args];
    if (fiber._interrupted && fiber.interruptible) {
      return () => exitInterrupt2;
    }
  }
});
var interruptible3 = /* @__PURE__ */ __name((self) => withMicroFiber((fiber) => {
  if (fiber.interruptible) return self;
  fiber.interruptible = true;
  fiber._stack.push(setInterruptible(false));
  if (fiber._interrupted) return exitInterrupt2;
  return self;
}), "interruptible");
var uninterruptibleMask2 = /* @__PURE__ */ __name((f) => withMicroFiber((fiber) => {
  if (!fiber.interruptible) return f(identity);
  fiber.interruptible = false;
  fiber._stack.push(setInterruptible(true));
  return f(interruptible3);
}), "uninterruptibleMask");
var whileLoop2 = /* @__PURE__ */ makePrimitive({
  op: "While",
  contA(value, fiber) {
    this[args].step(value);
    if (this[args].while()) {
      fiber._stack.push(this);
      return this[args].body();
    }
    return exitVoid2;
  },
  eval(fiber) {
    if (this[args].while()) {
      fiber._stack.push(this);
      return this[args].body();
    }
    return exitVoid2;
  }
});
var forEach3 = /* @__PURE__ */ __name((iterable, f, options) => withMicroFiber((parent) => {
  const concurrencyOption = options?.concurrency === "inherit" ? parent.getRef(CurrentConcurrency) : options?.concurrency ?? 1;
  const concurrency = concurrencyOption === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrencyOption);
  const items = fromIterable(iterable);
  let length = items.length;
  if (length === 0) {
    return options?.discard ? void_2 : succeed2([]);
  }
  const out = options?.discard ? void 0 : new Array(length);
  let index = 0;
  if (concurrency === 1) {
    return as2(whileLoop2({
      while: /* @__PURE__ */ __name(() => index < items.length, "while"),
      body: /* @__PURE__ */ __name(() => f(items[index], index), "body"),
      step: out ? (b) => out[index++] = b : (_) => index++
    }), out);
  }
  return async((resume2) => {
    const fibers = /* @__PURE__ */ new Set();
    let result = void 0;
    let inProgress = 0;
    let doneCount = 0;
    let pumping = false;
    let interrupted = false;
    function pump() {
      pumping = true;
      while (inProgress < concurrency && index < length) {
        const currentIndex = index;
        const item = items[currentIndex];
        index++;
        inProgress++;
        try {
          const child = unsafeFork(parent, f(item, currentIndex), true, true);
          fibers.add(child);
          child.addObserver((exit3) => {
            fibers.delete(child);
            if (interrupted) {
              return;
            } else if (exit3._tag === "Failure") {
              if (result === void 0) {
                result = exit3;
                length = index;
                fibers.forEach((fiber) => fiber.unsafeInterrupt());
              }
            } else if (out !== void 0) {
              out[currentIndex] = exit3.value;
            }
            doneCount++;
            inProgress--;
            if (doneCount === length) {
              resume2(result ?? succeed2(out));
            } else if (!pumping && inProgress < concurrency) {
              pump();
            }
          });
        } catch (err) {
          result = exitDie2(err);
          length = index;
          fibers.forEach((fiber) => fiber.unsafeInterrupt());
        }
      }
      pumping = false;
    }
    __name(pump, "pump");
    pump();
    return suspend2(() => {
      interrupted = true;
      index = length;
      return fiberInterruptAll(fibers);
    });
  });
}), "forEach");
var unsafeFork = /* @__PURE__ */ __name((parent, effect, immediate = false, daemon = false) => {
  const child = new MicroFiberImpl(parent.context, parent.interruptible);
  if (!daemon) {
    parent.children().add(child);
    child.addObserver(() => parent.children().delete(child));
  }
  if (immediate) {
    child.evaluate(effect);
  } else {
    parent.getRef(CurrentScheduler).scheduleTask(() => child.evaluate(effect), 0);
  }
  return child;
}, "unsafeFork");
var runFork = /* @__PURE__ */ __name((effect, options) => {
  const fiber = new MicroFiberImpl(CurrentScheduler.context(options?.scheduler ?? new MicroSchedulerDefault()));
  fiber.evaluate(effect);
  if (options?.signal) {
    if (options.signal.aborted) {
      fiber.unsafeInterrupt();
    } else {
      const abort = /* @__PURE__ */ __name(() => fiber.unsafeInterrupt(), "abort");
      options.signal.addEventListener("abort", abort, {
        once: true
      });
      fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
    }
  }
  return fiber;
}, "runFork");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Scheduler.js
init_esm();
var PriorityBuckets = class {
  static {
    __name(this, "PriorityBuckets");
  }
  /**
   * @since 2.0.0
   */
  buckets = [];
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    const length = this.buckets.length;
    let bucket = void 0;
    let index = 0;
    for (; index < length; index++) {
      if (this.buckets[index][0] <= priority) {
        bucket = this.buckets[index];
      } else {
        break;
      }
    }
    if (bucket && bucket[0] === priority) {
      bucket[1].push(task);
    } else if (index === length) {
      this.buckets.push([priority, [task]]);
    } else {
      this.buckets.splice(index, 0, [priority, [task]]);
    }
  }
};
var MixedScheduler = class {
  static {
    __name(this, "MixedScheduler");
  }
  maxNextTickBeforeTimer;
  /**
   * @since 2.0.0
   */
  running = false;
  /**
   * @since 2.0.0
   */
  tasks = /* @__PURE__ */ new PriorityBuckets();
  constructor(maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(depth) {
    const tasks2 = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks2) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  /**
   * @since 2.0.0
   */
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      setTimeout(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
};
var defaultScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
var SyncScheduler = class {
  static {
    __name(this, "SyncScheduler");
  }
  /**
   * @since 2.0.0
   */
  tasks = /* @__PURE__ */ new PriorityBuckets();
  /**
   * @since 2.0.0
   */
  deferred = false;
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    if (this.deferred) {
      defaultScheduler.scheduleTask(task, priority);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  flush() {
    while (this.tasks.buckets.length > 0) {
      const tasks2 = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks2) {
        for (let i = 0; i < toRun.length; i++) {
          toRun[i]();
        }
      }
    }
    this.deferred = true;
  }
};
var currentScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/completedRequestMap.js
init_esm();
var currentRequestMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(/* @__PURE__ */ new Map()));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/concurrency.js
init_esm();
var match7 = /* @__PURE__ */ __name((concurrency, sequential4, unbounded, bounded) => {
  switch (concurrency) {
    case void 0:
      return sequential4();
    case "unbounded":
      return unbounded();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" ? unbounded() : concurrency2 > 1 ? bounded(concurrency2) : sequential4());
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential4();
  }
}, "match");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiber.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberScope.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberMessage.js
init_esm();
var OP_INTERRUPT_SIGNAL = "InterruptSignal";
var OP_STATEFUL = "Stateful";
var OP_RESUME = "Resume";
var OP_YIELD_NOW = "YieldNow";
var interruptSignal = /* @__PURE__ */ __name((cause) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause
}), "interruptSignal");
var stateful = /* @__PURE__ */ __name((onFiber) => ({
  _tag: OP_STATEFUL,
  onFiber
}), "stateful");
var resume = /* @__PURE__ */ __name((effect) => ({
  _tag: OP_RESUME,
  effect
}), "resume");
var yieldNow3 = /* @__PURE__ */ __name(() => ({
  _tag: OP_YIELD_NOW
}), "yieldNow");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberScope.js
var FiberScopeSymbolKey = "effect/FiberScope";
var FiberScopeTypeId = /* @__PURE__ */ Symbol.for(FiberScopeSymbolKey);
var Global = class {
  static {
    __name(this, "Global");
  }
  [FiberScopeTypeId] = FiberScopeTypeId;
  fiberId = none4;
  roots = /* @__PURE__ */ new Set();
  add(_runtimeFlags, child) {
    this.roots.add(child);
    child.addObserver(() => {
      this.roots.delete(child);
    });
  }
};
var Local = class {
  static {
    __name(this, "Local");
  }
  fiberId;
  parent;
  [FiberScopeTypeId] = FiberScopeTypeId;
  constructor(fiberId2, parent) {
    this.fiberId = fiberId2;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(stateful((parentFiber) => {
      parentFiber.addChild(child);
      child.addObserver(() => {
        parentFiber.removeChild(child);
      });
    }));
  }
};
var unsafeMake4 = /* @__PURE__ */ __name((fiber) => {
  return new Local(fiber.id(), fiber);
}, "unsafeMake");
var globalScope = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new Global());

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiber.js
var FiberSymbolKey = "effect/Fiber";
var FiberTypeId = /* @__PURE__ */ Symbol.for(FiberSymbolKey);
var fiberVariance2 = {
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E"),
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A")
};
var fiberProto = {
  [FiberTypeId]: fiberVariance2,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var RuntimeFiberSymbolKey = "effect/Fiber";
var RuntimeFiberTypeId = /* @__PURE__ */ Symbol.for(RuntimeFiberSymbolKey);
var join2 = /* @__PURE__ */ __name((self) => zipLeft(flatten4(self.await), self.inheritAll), "join");
var _never = {
  ...CommitPrototype,
  commit() {
    return join2(this);
  },
  ...fiberProto,
  id: /* @__PURE__ */ __name(() => none4, "id"),
  await: never,
  children: /* @__PURE__ */ succeed([]),
  inheritAll: never,
  poll: /* @__PURE__ */ succeed(/* @__PURE__ */ none2()),
  interruptAsFork: /* @__PURE__ */ __name(() => never, "interruptAsFork")
};
var currentFiberURI = "effect/FiberCurrent";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/logger.js
init_esm();
var LoggerSymbolKey = "effect/Logger";
var LoggerTypeId = /* @__PURE__ */ Symbol.for(LoggerSymbolKey);
var loggerVariance = {
  /* c8 ignore next */
  _Message: /* @__PURE__ */ __name((_) => _, "_Message"),
  /* c8 ignore next */
  _Output: /* @__PURE__ */ __name((_) => _, "_Output")
};
var makeLogger = /* @__PURE__ */ __name((log) => ({
  [LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return pipeArguments(this, arguments);
  }
}), "makeLogger");
var none6 = {
  [LoggerTypeId]: loggerVariance,
  log: constVoid,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var textOnly = /^[^\s"=]*$/;
var format3 = /* @__PURE__ */ __name((quoteValue, whitespace) => ({
  annotations: annotations2,
  cause,
  date,
  fiberId: fiberId2,
  logLevel,
  message,
  spans
}) => {
  const formatValue = /* @__PURE__ */ __name((value) => value.match(textOnly) ? value : quoteValue(value), "formatValue");
  const format4 = /* @__PURE__ */ __name((label, value) => `${formatLabel(label)}=${formatValue(value)}`, "format");
  const append3 = /* @__PURE__ */ __name((label, value) => " " + format4(label, value), "append");
  let out = format4("timestamp", date.toISOString());
  out += append3("level", logLevel.label);
  out += append3("fiber", threadName(fiberId2));
  const messages = ensure(message);
  for (let i = 0; i < messages.length; i++) {
    out += append3("message", toStringUnknown(messages[i], whitespace));
  }
  if (!isEmptyType(cause)) {
    out += append3("cause", pretty(cause, {
      renderErrorCause: true
    }));
  }
  for (const span2 of spans) {
    out += " " + render(date.getTime())(span2);
  }
  for (const [label, value] of annotations2) {
    out += append3(label, toStringUnknown(value, whitespace));
  }
  return out;
}, "format");
var escapeDoubleQuotes = /* @__PURE__ */ __name((s) => `"${s.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`, "escapeDoubleQuotes");
var stringLogger = /* @__PURE__ */ makeLogger(/* @__PURE__ */ format3(escapeDoubleQuotes));
var colors = {
  bold: "1",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  cyan: "36",
  white: "37",
  gray: "90",
  black: "30",
  bgBrightRed: "101"
};
var logLevelColors = {
  None: [],
  All: [],
  Trace: [colors.gray],
  Debug: [colors.blue],
  Info: [colors.green],
  Warning: [colors.yellow],
  Error: [colors.red],
  Fatal: [colors.bgBrightRed, colors.black]
};
var hasProcessStdout = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null;
var processStdoutIsTTY = hasProcessStdout && process.stdout.isTTY === true;
var hasProcessStdoutOrDeno = hasProcessStdout || "Deno" in globalThis;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/boundaries.js
init_esm();
var MetricBoundariesSymbolKey = "effect/MetricBoundaries";
var MetricBoundariesTypeId = /* @__PURE__ */ Symbol.for(MetricBoundariesSymbolKey);
var MetricBoundariesImpl = class {
  static {
    __name(this, "MetricBoundariesImpl");
  }
  values;
  [MetricBoundariesTypeId] = MetricBoundariesTypeId;
  constructor(values3) {
    this.values = values3;
    this._hash = pipe(string(MetricBoundariesSymbolKey), combine(array2(this.values)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricBoundaries(u) && equals(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricBoundaries = /* @__PURE__ */ __name((u) => hasProperty(u, MetricBoundariesTypeId), "isMetricBoundaries");
var fromIterable7 = /* @__PURE__ */ __name((iterable) => {
  const values3 = pipe(iterable, appendAll(of2(Number.POSITIVE_INFINITY)), dedupe);
  return new MetricBoundariesImpl(values3);
}, "fromIterable");
var exponential = /* @__PURE__ */ __name((options) => pipe(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray, fromIterable7), "exponential");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/key.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/keyType.js
init_esm();
var MetricKeyTypeSymbolKey = "effect/MetricKeyType";
var MetricKeyTypeTypeId = /* @__PURE__ */ Symbol.for(MetricKeyTypeSymbolKey);
var CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
var CounterKeyTypeTypeId = /* @__PURE__ */ Symbol.for(CounterKeyTypeSymbolKey);
var FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
var FrequencyKeyTypeTypeId = /* @__PURE__ */ Symbol.for(FrequencyKeyTypeSymbolKey);
var GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
var GaugeKeyTypeTypeId = /* @__PURE__ */ Symbol.for(GaugeKeyTypeSymbolKey);
var HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
var HistogramKeyTypeTypeId = /* @__PURE__ */ Symbol.for(HistogramKeyTypeSymbolKey);
var SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
var SummaryKeyTypeTypeId = /* @__PURE__ */ Symbol.for(SummaryKeyTypeSymbolKey);
var metricKeyTypeVariance = {
  /* c8 ignore next */
  _In: /* @__PURE__ */ __name((_) => _, "_In"),
  /* c8 ignore next */
  _Out: /* @__PURE__ */ __name((_) => _, "_Out")
};
var CounterKeyType = class {
  static {
    __name(this, "CounterKeyType");
  }
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint) {
    this.incremental = incremental;
    this.bigint = bigint;
    this._hash = string(CounterKeyTypeSymbolKey);
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FrequencyKeyTypeHash = /* @__PURE__ */ string(FrequencyKeyTypeSymbolKey);
var FrequencyKeyType = class {
  static {
    __name(this, "FrequencyKeyType");
  }
  preregisteredWords;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [FrequencyKeyTypeTypeId] = FrequencyKeyTypeTypeId;
  constructor(preregisteredWords) {
    this.preregisteredWords = preregisteredWords;
  }
  [symbol]() {
    return FrequencyKeyTypeHash;
  }
  [symbol2](that) {
    return isFrequencyKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeKeyTypeHash = /* @__PURE__ */ string(GaugeKeyTypeSymbolKey);
var GaugeKeyType = class {
  static {
    __name(this, "GaugeKeyType");
  }
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [GaugeKeyTypeTypeId] = GaugeKeyTypeTypeId;
  constructor(bigint) {
    this.bigint = bigint;
  }
  [symbol]() {
    return GaugeKeyTypeHash;
  }
  [symbol2](that) {
    return isGaugeKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramKeyType = class {
  static {
    __name(this, "HistogramKeyType");
  }
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
    this._hash = pipe(string(HistogramKeyTypeSymbolKey), combine(hash(this.boundaries)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryKeyType = class {
  static {
    __name(this, "SummaryKeyType");
  }
  maxAge;
  maxSize;
  error;
  quantiles;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [SummaryKeyTypeTypeId] = SummaryKeyTypeTypeId;
  constructor(maxAge, maxSize, error2, quantiles) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
    this.error = error2;
    this.quantiles = quantiles;
    this._hash = pipe(string(SummaryKeyTypeSymbolKey), combine(hash(this.maxAge)), combine(hash(this.maxSize)), combine(hash(this.error)), combine(array2(this.quantiles)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isSummaryKey(that) && equals(this.maxAge, that.maxAge) && this.maxSize === that.maxSize && this.error === that.error && equals(this.quantiles, that.quantiles);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter = /* @__PURE__ */ __name((options) => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false), "counter");
var histogram = /* @__PURE__ */ __name((boundaries) => {
  return new HistogramKeyType(boundaries);
}, "histogram");
var isCounterKey = /* @__PURE__ */ __name((u) => hasProperty(u, CounterKeyTypeTypeId), "isCounterKey");
var isFrequencyKey = /* @__PURE__ */ __name((u) => hasProperty(u, FrequencyKeyTypeTypeId), "isFrequencyKey");
var isGaugeKey = /* @__PURE__ */ __name((u) => hasProperty(u, GaugeKeyTypeTypeId), "isGaugeKey");
var isHistogramKey = /* @__PURE__ */ __name((u) => hasProperty(u, HistogramKeyTypeTypeId), "isHistogramKey");
var isSummaryKey = /* @__PURE__ */ __name((u) => hasProperty(u, SummaryKeyTypeTypeId), "isSummaryKey");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/key.js
var MetricKeySymbolKey = "effect/MetricKey";
var MetricKeyTypeId = /* @__PURE__ */ Symbol.for(MetricKeySymbolKey);
var metricKeyVariance = {
  /* c8 ignore next */
  _Type: /* @__PURE__ */ __name((_) => _, "_Type")
};
var arrayEquivilence = /* @__PURE__ */ getEquivalence(equals);
var MetricKeyImpl = class {
  static {
    __name(this, "MetricKeyImpl");
  }
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = []) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
    this._hash = pipe(string(this.name + this.description), combine(hash(this.keyType)), combine(array2(this.tags)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricKey(u) && this.name === u.name && equals(this.keyType, u.keyType) && equals(this.description, u.description) && arrayEquivilence(this.tags, u.tags);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricKey = /* @__PURE__ */ __name((u) => hasProperty(u, MetricKeyTypeId), "isMetricKey");
var counter2 = /* @__PURE__ */ __name((name, options) => new MetricKeyImpl(name, counter(options), fromNullable(options?.description)), "counter");
var histogram2 = /* @__PURE__ */ __name((name, boundaries, description) => new MetricKeyImpl(name, histogram(boundaries), fromNullable(description)), "histogram");
var taggedWithLabels = /* @__PURE__ */ dual(2, (self, extraTags) => extraTags.length === 0 ? self : new MetricKeyImpl(self.name, self.keyType, self.description, union(self.tags, extraTags)));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/registry.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/hook.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/state.js
init_esm();
var MetricStateSymbolKey = "effect/MetricState";
var MetricStateTypeId = /* @__PURE__ */ Symbol.for(MetricStateSymbolKey);
var CounterStateSymbolKey = "effect/MetricState/Counter";
var CounterStateTypeId = /* @__PURE__ */ Symbol.for(CounterStateSymbolKey);
var FrequencyStateSymbolKey = "effect/MetricState/Frequency";
var FrequencyStateTypeId = /* @__PURE__ */ Symbol.for(FrequencyStateSymbolKey);
var GaugeStateSymbolKey = "effect/MetricState/Gauge";
var GaugeStateTypeId = /* @__PURE__ */ Symbol.for(GaugeStateSymbolKey);
var HistogramStateSymbolKey = "effect/MetricState/Histogram";
var HistogramStateTypeId = /* @__PURE__ */ Symbol.for(HistogramStateSymbolKey);
var SummaryStateSymbolKey = "effect/MetricState/Summary";
var SummaryStateTypeId = /* @__PURE__ */ Symbol.for(SummaryStateSymbolKey);
var metricStateVariance = {
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A")
};
var CounterState = class {
  static {
    __name(this, "CounterState");
  }
  count;
  [MetricStateTypeId] = metricStateVariance;
  [CounterStateTypeId] = CounterStateTypeId;
  constructor(count) {
    this.count = count;
  }
  [symbol]() {
    return pipe(hash(CounterStateSymbolKey), combine(hash(this.count)), cached2(this));
  }
  [symbol2](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var arrayEquals = /* @__PURE__ */ getEquivalence(equals);
var FrequencyState = class {
  static {
    __name(this, "FrequencyState");
  }
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  _hash;
  [symbol]() {
    return pipe(string(FrequencyStateSymbolKey), combine(array2(fromIterable(this.occurrences.entries()))), cached2(this));
  }
  [symbol2](that) {
    return isFrequencyState(that) && arrayEquals(fromIterable(this.occurrences.entries()), fromIterable(that.occurrences.entries()));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeState = class {
  static {
    __name(this, "GaugeState");
  }
  value;
  [MetricStateTypeId] = metricStateVariance;
  [GaugeStateTypeId] = GaugeStateTypeId;
  constructor(value) {
    this.value = value;
  }
  [symbol]() {
    return pipe(hash(GaugeStateSymbolKey), combine(hash(this.value)), cached2(this));
  }
  [symbol2](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramState = class {
  static {
    __name(this, "HistogramState");
  }
  buckets;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [HistogramStateTypeId] = HistogramStateTypeId;
  constructor(buckets, count, min2, max2, sum) {
    this.buckets = buckets;
    this.count = count;
    this.min = min2;
    this.max = max2;
    this.sum = sum;
  }
  [symbol]() {
    return pipe(hash(HistogramStateSymbolKey), combine(hash(this.buckets)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)), cached2(this));
  }
  [symbol2](that) {
    return isHistogramState(that) && equals(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryState = class {
  static {
    __name(this, "SummaryState");
  }
  error;
  quantiles;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [SummaryStateTypeId] = SummaryStateTypeId;
  constructor(error2, quantiles, count, min2, max2, sum) {
    this.error = error2;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min2;
    this.max = max2;
    this.sum = sum;
  }
  [symbol]() {
    return pipe(hash(SummaryStateSymbolKey), combine(hash(this.error)), combine(hash(this.quantiles)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)), cached2(this));
  }
  [symbol2](that) {
    return isSummaryState(that) && this.error === that.error && equals(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter3 = /* @__PURE__ */ __name((count) => new CounterState(count), "counter");
var frequency2 = /* @__PURE__ */ __name((occurrences) => {
  return new FrequencyState(occurrences);
}, "frequency");
var gauge2 = /* @__PURE__ */ __name((count) => new GaugeState(count), "gauge");
var histogram3 = /* @__PURE__ */ __name((options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum), "histogram");
var summary2 = /* @__PURE__ */ __name((options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum), "summary");
var isCounterState = /* @__PURE__ */ __name((u) => hasProperty(u, CounterStateTypeId), "isCounterState");
var isFrequencyState = /* @__PURE__ */ __name((u) => hasProperty(u, FrequencyStateTypeId), "isFrequencyState");
var isGaugeState = /* @__PURE__ */ __name((u) => hasProperty(u, GaugeStateTypeId), "isGaugeState");
var isHistogramState = /* @__PURE__ */ __name((u) => hasProperty(u, HistogramStateTypeId), "isHistogramState");
var isSummaryState = /* @__PURE__ */ __name((u) => hasProperty(u, SummaryStateTypeId), "isSummaryState");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/hook.js
var MetricHookSymbolKey = "effect/MetricHook";
var MetricHookTypeId = /* @__PURE__ */ Symbol.for(MetricHookSymbolKey);
var metricHookVariance = {
  /* c8 ignore next */
  _In: /* @__PURE__ */ __name((_) => _, "_In"),
  /* c8 ignore next */
  _Out: /* @__PURE__ */ __name((_) => _, "_Out")
};
var make24 = /* @__PURE__ */ __name((options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
}), "make");
var bigint02 = /* @__PURE__ */ BigInt(0);
var counter4 = /* @__PURE__ */ __name((key) => {
  let sum = key.keyType.bigint ? bigint02 : 0;
  const canUpdate = key.keyType.incremental ? key.keyType.bigint ? (value) => value >= bigint02 : (value) => value >= 0 : (_value) => true;
  const update3 = /* @__PURE__ */ __name((value) => {
    if (canUpdate(value)) {
      sum = sum + value;
    }
  }, "update");
  return make24({
    get: /* @__PURE__ */ __name(() => counter3(sum), "get"),
    update: update3,
    modify: update3
  });
}, "counter");
var frequency3 = /* @__PURE__ */ __name((key) => {
  const values3 = /* @__PURE__ */ new Map();
  for (const word of key.keyType.preregisteredWords) {
    values3.set(word, 0);
  }
  const update3 = /* @__PURE__ */ __name((word) => {
    const slotCount = values3.get(word) ?? 0;
    values3.set(word, slotCount + 1);
  }, "update");
  return make24({
    get: /* @__PURE__ */ __name(() => frequency2(values3), "get"),
    update: update3,
    modify: update3
  });
}, "frequency");
var gauge3 = /* @__PURE__ */ __name((_key, startAt) => {
  let value = startAt;
  return make24({
    get: /* @__PURE__ */ __name(() => gauge2(value), "get"),
    update: /* @__PURE__ */ __name((v) => {
      value = v;
    }, "update"),
    modify: /* @__PURE__ */ __name((v) => {
      value = value + v;
    }, "modify")
  });
}, "gauge");
var histogram4 = /* @__PURE__ */ __name((key) => {
  const bounds = key.keyType.boundaries.values;
  const size7 = bounds.length;
  const values3 = new Uint32Array(size7 + 1);
  const boundaries = new Float64Array(size7);
  let count = 0;
  let sum = 0;
  let min2 = Number.MAX_VALUE;
  let max2 = Number.MIN_VALUE;
  pipe(bounds, sort(Order), map3((n, i) => {
    boundaries[i] = n;
  }));
  const update3 = /* @__PURE__ */ __name((value) => {
    let from = 0;
    let to = size7;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      if (to === from + 1) {
        if (value <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values3[from] = values3[from] + 1;
    count = count + 1;
    sum = sum + value;
    if (value < min2) {
      min2 = value;
    }
    if (value > max2) {
      max2 = value;
    }
  }, "update");
  const getBuckets = /* @__PURE__ */ __name(() => {
    const builder = allocate(size7);
    let cumulated = 0;
    for (let i = 0; i < size7; i++) {
      const boundary = boundaries[i];
      const value = values3[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return builder;
  }, "getBuckets");
  return make24({
    get: /* @__PURE__ */ __name(() => histogram3({
      buckets: getBuckets(),
      count,
      min: min2,
      max: max2,
      sum
    }), "get"),
    update: update3,
    modify: update3
  });
}, "histogram");
var summary3 = /* @__PURE__ */ __name((key) => {
  const {
    error: error2,
    maxAge,
    maxSize,
    quantiles
  } = key.keyType;
  const sortedQuantiles = pipe(quantiles, sort(Order));
  const values3 = allocate(maxSize);
  let head3 = 0;
  let count = 0;
  let sum = 0;
  let min2 = 0;
  let max2 = 0;
  const snapshot = /* @__PURE__ */ __name((now) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values3[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now - t);
        if (greaterThanOrEqualTo2(age, zero) && lessThanOrEqualTo2(age, maxAge)) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error2, sortedQuantiles, sort(builder, Order));
  }, "snapshot");
  const observe = /* @__PURE__ */ __name((value, timestamp) => {
    if (maxSize > 0) {
      head3 = head3 + 1;
      const target = head3 % maxSize;
      values3[target] = [timestamp, value];
    }
    min2 = count === 0 ? value : Math.min(min2, value);
    max2 = count === 0 ? value : Math.max(max2, value);
    count = count + 1;
    sum = sum + value;
  }, "observe");
  return make24({
    get: /* @__PURE__ */ __name(() => summary2({
      error: error2,
      quantiles: snapshot(Date.now()),
      count,
      min: min2,
      max: max2,
      sum
    }), "get"),
    update: /* @__PURE__ */ __name(([value, timestamp]) => observe(value, timestamp), "update"),
    modify: /* @__PURE__ */ __name(([value, timestamp]) => observe(value, timestamp), "modify")
  });
}, "summary");
var calculateQuantiles = /* @__PURE__ */ __name((error2, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (!isNonEmptyReadonlyArray(sortedQuantiles)) {
    return empty();
  }
  const head3 = sortedQuantiles[0];
  const tail = sortedQuantiles.slice(1);
  const resolvedHead = resolveQuantile(error2, sampleCount, none2(), 0, head3, sortedSamples);
  const resolved = of(resolvedHead);
  tail.forEach((quantile) => {
    resolved.push(resolveQuantile(error2, sampleCount, resolvedHead.value, resolvedHead.consumed, quantile, resolvedHead.rest));
  });
  return map3(resolved, (rq) => [rq.quantile, rq.value]);
}, "calculateQuantiles");
var resolveQuantile = /* @__PURE__ */ __name((error2, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error2;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error2;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (1) {
    if (!isNonEmptyReadonlyArray(rest_1)) {
      return {
        quantile: quantile_1,
        value: none2(),
        consumed: consumed_1,
        rest: []
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some2(lastNonEmpty(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: []
      };
    }
    const headValue = headNonEmpty(rest_1);
    const sameHead = span(rest_1, (n) => n === headValue);
    const desired = quantile_1 * sampleCount_1;
    const allowedError = error_1 / 2 * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      const valueToReturn = isNone2(current_1) ? some2(headValue) : current_1;
      return {
        quantile: quantile_1,
        value: valueToReturn,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some2(current_1.value),
          consumed: consumed_1,
          rest: rest_1
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
}, "resolveQuantile");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/pair.js
init_esm();
var MetricPairSymbolKey = "effect/MetricPair";
var MetricPairTypeId = /* @__PURE__ */ Symbol.for(MetricPairSymbolKey);
var metricPairVariance = {
  /* c8 ignore next */
  _Type: /* @__PURE__ */ __name((_) => _, "_Type")
};
var unsafeMake5 = /* @__PURE__ */ __name((metricKey, metricState) => {
  return {
    [MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return pipeArguments(this, arguments);
    }
  };
}, "unsafeMake");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric/registry.js
var MetricRegistrySymbolKey = "effect/MetricRegistry";
var MetricRegistryTypeId = /* @__PURE__ */ Symbol.for(MetricRegistrySymbolKey);
var MetricRegistryImpl = class {
  static {
    __name(this, "MetricRegistryImpl");
  }
  [MetricRegistryTypeId] = MetricRegistryTypeId;
  map = /* @__PURE__ */ empty15();
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(unsafeMake5(key, hook.get()));
    }
    return result;
  }
  get(key) {
    const hook = pipe(this.map, get7(key), getOrUndefined);
    if (hook == null) {
      if (isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value = pipe(this.map, get7(key), getOrUndefined);
    if (value == null) {
      const counter6 = counter4(key);
      if (!pipe(this.map, has5(key))) {
        pipe(this.map, set4(key, counter6));
      }
      value = counter6;
    }
    return value;
  }
  getFrequency(key) {
    let value = pipe(this.map, get7(key), getOrUndefined);
    if (value == null) {
      const frequency5 = frequency3(key);
      if (!pipe(this.map, has5(key))) {
        pipe(this.map, set4(key, frequency5));
      }
      value = frequency5;
    }
    return value;
  }
  getGauge(key) {
    let value = pipe(this.map, get7(key), getOrUndefined);
    if (value == null) {
      const gauge5 = gauge3(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!pipe(this.map, has5(key))) {
        pipe(this.map, set4(key, gauge5));
      }
      value = gauge5;
    }
    return value;
  }
  getHistogram(key) {
    let value = pipe(this.map, get7(key), getOrUndefined);
    if (value == null) {
      const histogram6 = histogram4(key);
      if (!pipe(this.map, has5(key))) {
        pipe(this.map, set4(key, histogram6));
      }
      value = histogram6;
    }
    return value;
  }
  getSummary(key) {
    let value = pipe(this.map, get7(key), getOrUndefined);
    if (value == null) {
      const summary5 = summary3(key);
      if (!pipe(this.map, has5(key))) {
        pipe(this.map, set4(key, summary5));
      }
      value = summary5;
    }
    return value;
  }
};
var make25 = /* @__PURE__ */ __name(() => {
  return new MetricRegistryImpl();
}, "make");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/metric.js
var MetricSymbolKey = "effect/Metric";
var MetricTypeId = /* @__PURE__ */ Symbol.for(MetricSymbolKey);
var metricVariance = {
  /* c8 ignore next */
  _Type: /* @__PURE__ */ __name((_) => _, "_Type"),
  /* c8 ignore next */
  _In: /* @__PURE__ */ __name((_) => _, "_In"),
  /* c8 ignore next */
  _Out: /* @__PURE__ */ __name((_) => _, "_Out")
};
var globalMetricRegistry = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => make25());
var make26 = /* @__PURE__ */ __name(function(keyType, unsafeUpdate, unsafeValue, unsafeModify) {
  const metric = Object.assign((effect) => tap(effect, (a) => update2(metric, a)), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    unsafeModify,
    register() {
      this.unsafeValue([]);
      return this;
    },
    pipe() {
      return pipeArguments(this, arguments);
    }
  });
  return metric;
}, "make");
var counter5 = /* @__PURE__ */ __name((name, options) => fromMetricKey(counter2(name, options)), "counter");
var fromMetricKey = /* @__PURE__ */ __name((key) => {
  let untaggedHook;
  const hookCache = /* @__PURE__ */ new WeakMap();
  const hook = /* @__PURE__ */ __name((extraTags) => {
    if (extraTags.length === 0) {
      if (untaggedHook !== void 0) {
        return untaggedHook;
      }
      untaggedHook = globalMetricRegistry.get(key);
      return untaggedHook;
    }
    let hook2 = hookCache.get(extraTags);
    if (hook2 !== void 0) {
      return hook2;
    }
    hook2 = globalMetricRegistry.get(taggedWithLabels(key, extraTags));
    hookCache.set(extraTags, hook2);
    return hook2;
  }, "hook");
  return make26(key.keyType, (input, extraTags) => hook(extraTags).update(input), (extraTags) => hook(extraTags).get(), (input, extraTags) => hook(extraTags).modify(input));
}, "fromMetricKey");
var histogram5 = /* @__PURE__ */ __name((name, boundaries, description) => fromMetricKey(histogram2(name, boundaries, description)), "histogram");
var tagged = /* @__PURE__ */ dual(3, (self, key, value) => taggedWithLabels2(self, [make23(key, value)]));
var taggedWithLabels2 = /* @__PURE__ */ dual(2, (self, extraTags) => {
  return make26(self.keyType, (input, extraTags1) => self.unsafeUpdate(input, union(extraTags, extraTags1)), (extraTags1) => self.unsafeValue(union(extraTags, extraTags1)), (input, extraTags1) => self.unsafeModify(input, union(extraTags, extraTags1)));
});
var update2 = /* @__PURE__ */ dual(2, (self, input) => fiberRefGetWith(currentMetricLabels, (tags) => sync(() => self.unsafeUpdate(input, tags))));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/request.js
init_esm();
var RequestSymbolKey = "effect/Request";
var RequestTypeId = /* @__PURE__ */ Symbol.for(RequestSymbolKey);
var requestVariance = {
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E"),
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A")
};
var RequestPrototype = {
  ...StructuralPrototype,
  [RequestTypeId]: requestVariance
};
var complete = /* @__PURE__ */ dual(2, (self, result) => fiberRefGetWith(currentRequestMap, (map13) => sync(() => {
  if (map13.has(self)) {
    const entry = map13.get(self);
    if (!entry.state.completed) {
      entry.state.completed = true;
      deferredUnsafeDone(entry.result, result);
    }
  }
})));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/supervisor.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/SortedSet.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/RedBlackTree.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/redBlackTree.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/redBlackTree/iterator.js
init_esm();
var Direction = {
  Forward: 0,
  Backward: 1 << 0
};
var RedBlackTreeIterator = class _RedBlackTreeIterator {
  static {
    __name(this, "RedBlackTreeIterator");
  }
  self;
  stack;
  direction;
  count = 0;
  constructor(self, stack, direction) {
    this.self = self;
    this.stack = stack;
    this.direction = direction;
  }
  /**
   * Clones the iterator
   */
  clone() {
    return new _RedBlackTreeIterator(this.self, this.stack.slice(), this.direction);
  }
  /**
   * Reverse the traversal direction
   */
  reversed() {
    return new _RedBlackTreeIterator(this.self, this.stack.slice(), this.direction === Direction.Forward ? Direction.Backward : Direction.Forward);
  }
  /**
   * Iterator next
   */
  next() {
    const entry = this.entry;
    this.count++;
    if (this.direction === Direction.Forward) {
      this.moveNext();
    } else {
      this.movePrev();
    }
    switch (entry._tag) {
      case "None": {
        return {
          done: true,
          value: this.count
        };
      }
      case "Some": {
        return {
          done: false,
          value: entry.value
        };
      }
    }
  }
  /**
   * Returns the key
   */
  get key() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].key);
    }
    return none2();
  }
  /**
   * Returns the value
   */
  get value() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].value);
    }
    return none2();
  }
  /**
   * Returns the key
   */
  get entry() {
    return map2(last(this.stack), (node) => [node.key, node.value]);
  }
  /**
   * Returns the position of this iterator in the sorted list
   */
  get index() {
    let idx = 0;
    const stack = this.stack;
    if (stack.length === 0) {
      const r = this.self._root;
      if (r != null) {
        return r.count;
      }
      return 0;
    } else if (stack[stack.length - 1].left != null) {
      idx = stack[stack.length - 1].left.count;
    }
    for (let s = stack.length - 2; s >= 0; --s) {
      if (stack[s + 1] === stack[s].right) {
        ++idx;
        if (stack[s].left != null) {
          idx += stack[s].left.count;
        }
      }
    }
    return idx;
  }
  /**
   * Advances iterator to next element in list
   */
  moveNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n.right != null) {
      n = n.right;
      while (n != null) {
        stack.push(n);
        n = n.left;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].right === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  /**
   * Checks if there is a next element
   */
  get hasNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].right != null) {
      return true;
    }
    for (let s = stack.length - 1; s > 0; --s) {
      if (stack[s - 1].left === stack[s]) {
        return true;
      }
    }
    return false;
  }
  /**
   * Advances iterator to previous element in list
   */
  movePrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n != null && n.left != null) {
      n = n.left;
      while (n != null) {
        stack.push(n);
        n = n.right;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].left === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  /**
   * Checks if there is a previous element
   */
  get hasPrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].left != null) {
      return true;
    }
    for (let s = stack.length - 1; s > 0; --s) {
      if (stack[s - 1].right === stack[s]) {
        return true;
      }
    }
    return false;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/redBlackTree/node.js
init_esm();
var Color = {
  Red: 0,
  Black: 1 << 0
};
var clone2 = /* @__PURE__ */ __name(({
  color,
  count,
  key,
  left: left3,
  right: right3,
  value
}) => ({
  color,
  key,
  value,
  left: left3,
  right: right3,
  count
}), "clone");
function swap2(n, v) {
  n.key = v.key;
  n.value = v.value;
  n.left = v.left;
  n.right = v.right;
  n.color = v.color;
  n.count = v.count;
}
__name(swap2, "swap");
var repaint = /* @__PURE__ */ __name(({
  count,
  key,
  left: left3,
  right: right3,
  value
}, color) => ({
  color,
  key,
  value,
  left: left3,
  right: right3,
  count
}), "repaint");
var recount = /* @__PURE__ */ __name((node) => {
  node.count = 1 + (node.left?.count ?? 0) + (node.right?.count ?? 0);
}, "recount");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/redBlackTree.js
var RedBlackTreeSymbolKey = "effect/RedBlackTree";
var RedBlackTreeTypeId = /* @__PURE__ */ Symbol.for(RedBlackTreeSymbolKey);
var redBlackTreeVariance = {
  /* c8 ignore next */
  _Key: /* @__PURE__ */ __name((_) => _, "_Key"),
  /* c8 ignore next */
  _Value: /* @__PURE__ */ __name((_) => _, "_Value")
};
var RedBlackTreeProto = {
  [RedBlackTreeTypeId]: redBlackTreeVariance,
  [symbol]() {
    let hash2 = hash(RedBlackTreeSymbolKey);
    for (const item of this) {
      hash2 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return cached2(this, hash2);
  },
  [symbol2](that) {
    if (isRedBlackTree(that)) {
      if ((this._root?.count ?? 0) !== (that._root?.count ?? 0)) {
        return false;
      }
      const entries2 = Array.from(that);
      return Array.from(this).every((itemSelf, i) => {
        const itemThat = entries2[i];
        return equals(itemSelf[0], itemThat[0]) && equals(itemSelf[1], itemThat[1]);
      });
    }
    return false;
  },
  [Symbol.iterator]() {
    const stack = [];
    let n = this._root;
    while (n != null) {
      stack.push(n);
      n = n.left;
    }
    return new RedBlackTreeIterator(this, stack, Direction.Forward);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "RedBlackTree",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl3 = /* @__PURE__ */ __name((ord, root) => {
  const tree = Object.create(RedBlackTreeProto);
  tree._ord = ord;
  tree._root = root;
  return tree;
}, "makeImpl");
var isRedBlackTree = /* @__PURE__ */ __name((u) => hasProperty(u, RedBlackTreeTypeId), "isRedBlackTree");
var findFirst3 = /* @__PURE__ */ dual(2, (self, key) => {
  const cmp = self._ord;
  let node = self._root;
  while (node !== void 0) {
    const d = cmp(key, node.key);
    if (equals(key, node.key)) {
      return some2(node.value);
    }
    if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return none2();
});
var has6 = /* @__PURE__ */ dual(2, (self, key) => isSome2(findFirst3(self, key)));
var insert = /* @__PURE__ */ dual(3, (self, key, value) => {
  const cmp = self._ord;
  let n = self._root;
  const n_stack = [];
  const d_stack = [];
  while (n != null) {
    const d = cmp(key, n.key);
    n_stack.push(n);
    d_stack.push(d);
    if (d <= 0) {
      n = n.left;
    } else {
      n = n.right;
    }
  }
  n_stack.push({
    color: Color.Red,
    key,
    value,
    left: void 0,
    right: void 0,
    count: 1
  });
  for (let s = n_stack.length - 2; s >= 0; --s) {
    const n2 = n_stack[s];
    if (d_stack[s] <= 0) {
      n_stack[s] = {
        color: n2.color,
        key: n2.key,
        value: n2.value,
        left: n_stack[s + 1],
        right: n2.right,
        count: n2.count + 1
      };
    } else {
      n_stack[s] = {
        color: n2.color,
        key: n2.key,
        value: n2.value,
        left: n2.left,
        right: n_stack[s + 1],
        count: n2.count + 1
      };
    }
  }
  for (let s = n_stack.length - 1; s > 1; --s) {
    const p = n_stack[s - 1];
    const n3 = n_stack[s];
    if (p.color === Color.Black || n3.color === Color.Black) {
      break;
    }
    const pp = n_stack[s - 2];
    if (pp.left === p) {
      if (p.left === n3) {
        const y = pp.right;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.right = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          pp.color = Color.Red;
          pp.left = p.right;
          p.color = Color.Black;
          p.right = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          recount(pp);
          recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = p;
            } else {
              ppp.right = p;
            }
          }
          break;
        }
      } else {
        const y = pp.right;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.right = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          p.right = n3.left;
          pp.color = Color.Red;
          pp.left = n3.right;
          n3.color = Color.Black;
          n3.left = p;
          n3.right = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          recount(pp);
          recount(p);
          recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = n3;
            } else {
              ppp.right = n3;
            }
          }
          break;
        }
      }
    } else {
      if (p.right === n3) {
        const y = pp.left;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.left = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          pp.color = Color.Red;
          pp.right = p.left;
          p.color = Color.Black;
          p.left = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          recount(pp);
          recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = p;
            } else {
              ppp.left = p;
            }
          }
          break;
        }
      } else {
        const y = pp.left;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.left = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          p.left = n3.right;
          pp.color = Color.Red;
          pp.right = n3.left;
          n3.color = Color.Black;
          n3.right = p;
          n3.left = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          recount(pp);
          recount(p);
          recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = n3;
            } else {
              ppp.left = n3;
            }
          }
          break;
        }
      }
    }
  }
  n_stack[0].color = Color.Black;
  return makeImpl3(self._ord, n_stack[0]);
});
var keysForward = /* @__PURE__ */ __name((self) => keys4(self, Direction.Forward), "keysForward");
var keys4 = /* @__PURE__ */ __name((self, direction) => {
  const begin = self[Symbol.iterator]();
  let count = 0;
  return {
    [Symbol.iterator]: () => keys4(self, direction),
    next: /* @__PURE__ */ __name(() => {
      count++;
      const entry = begin.key;
      if (direction === Direction.Forward) {
        begin.moveNext();
      } else {
        begin.movePrev();
      }
      switch (entry._tag) {
        case "None": {
          return {
            done: true,
            value: count
          };
        }
        case "Some": {
          return {
            done: false,
            value: entry.value
          };
        }
      }
    }, "next")
  };
}, "keys");
var removeFirst = /* @__PURE__ */ dual(2, (self, key) => {
  if (!has6(self, key)) {
    return self;
  }
  const ord = self._ord;
  const cmp = ord;
  let node = self._root;
  const stack = [];
  while (node !== void 0) {
    const d = cmp(key, node.key);
    stack.push(node);
    if (equals(key, node.key)) {
      node = void 0;
    } else if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  if (stack.length === 0) {
    return self;
  }
  const cstack = new Array(stack.length);
  let n = stack[stack.length - 1];
  cstack[cstack.length - 1] = {
    color: n.color,
    key: n.key,
    value: n.value,
    left: n.left,
    right: n.right,
    count: n.count
  };
  for (let i = stack.length - 2; i >= 0; --i) {
    n = stack[i];
    if (n.left === stack[i + 1]) {
      cstack[i] = {
        color: n.color,
        key: n.key,
        value: n.value,
        left: cstack[i + 1],
        right: n.right,
        count: n.count
      };
    } else {
      cstack[i] = {
        color: n.color,
        key: n.key,
        value: n.value,
        left: n.left,
        right: cstack[i + 1],
        count: n.count
      };
    }
  }
  n = cstack[cstack.length - 1];
  if (n.left !== void 0 && n.right !== void 0) {
    const split = cstack.length;
    n = n.left;
    while (n.right != null) {
      cstack.push(n);
      n = n.right;
    }
    const v = cstack[split - 1];
    cstack.push({
      color: n.color,
      key: v.key,
      value: v.value,
      left: n.left,
      right: n.right,
      count: n.count
    });
    cstack[split - 1].key = n.key;
    cstack[split - 1].value = n.value;
    for (let i = cstack.length - 2; i >= split; --i) {
      n = cstack[i];
      cstack[i] = {
        color: n.color,
        key: n.key,
        value: n.value,
        left: n.left,
        right: cstack[i + 1],
        count: n.count
      };
    }
    cstack[split - 1].left = cstack[split];
  }
  n = cstack[cstack.length - 1];
  if (n.color === Color.Red) {
    const p = cstack[cstack.length - 2];
    if (p.left === n) {
      p.left = void 0;
    } else if (p.right === n) {
      p.right = void 0;
    }
    cstack.pop();
    for (let i = 0; i < cstack.length; ++i) {
      cstack[i].count--;
    }
    return makeImpl3(ord, cstack[0]);
  } else {
    if (n.left !== void 0 || n.right !== void 0) {
      if (n.left !== void 0) {
        swap2(n, n.left);
      } else if (n.right !== void 0) {
        swap2(n, n.right);
      }
      n.color = Color.Black;
      for (let i = 0; i < cstack.length - 1; ++i) {
        cstack[i].count--;
      }
      return makeImpl3(ord, cstack[0]);
    } else if (cstack.length === 1) {
      return makeImpl3(ord, void 0);
    } else {
      for (let i = 0; i < cstack.length; ++i) {
        cstack[i].count--;
      }
      const parent = cstack[cstack.length - 2];
      fixDoubleBlack(cstack);
      if (parent.left === n) {
        parent.left = void 0;
      } else {
        parent.right = void 0;
      }
    }
  }
  return makeImpl3(ord, cstack[0]);
});
var fixDoubleBlack = /* @__PURE__ */ __name((stack) => {
  let n, p, s, z;
  for (let i = stack.length - 1; i >= 0; --i) {
    n = stack[i];
    if (i === 0) {
      n.color = Color.Black;
      return;
    }
    p = stack[i - 1];
    if (p.left === n) {
      s = p.right;
      if (s !== void 0 && s.right !== void 0 && s.right.color === Color.Red) {
        s = p.right = clone2(s);
        z = s.right = clone2(s.right);
        p.right = s.left;
        s.left = p;
        s.right = z;
        s.color = p.color;
        n.color = Color.Black;
        p.color = Color.Black;
        z.color = Color.Black;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== void 0 && s.left !== void 0 && s.left.color === Color.Red) {
        s = p.right = clone2(s);
        z = s.left = clone2(s.left);
        p.right = z.left;
        s.left = z.right;
        z.left = p;
        z.right = s;
        z.color = p.color;
        p.color = Color.Black;
        s.color = Color.Black;
        n.color = Color.Black;
        recount(p);
        recount(s);
        recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = z;
          } else {
            pp.right = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== void 0 && s.color === Color.Black) {
        if (p.color === Color.Red) {
          p.color = Color.Black;
          p.right = repaint(s, Color.Red);
          return;
        } else {
          p.right = repaint(s, Color.Red);
          continue;
        }
      } else if (s !== void 0) {
        s = clone2(s);
        p.right = s.left;
        s.left = p;
        s.color = p.color;
        p.color = Color.Red;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    } else {
      s = p.left;
      if (s !== void 0 && s.left !== void 0 && s.left.color === Color.Red) {
        s = p.left = clone2(s);
        z = s.left = clone2(s.left);
        p.left = s.right;
        s.right = p;
        s.left = z;
        s.color = p.color;
        n.color = Color.Black;
        p.color = Color.Black;
        z.color = Color.Black;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== void 0 && s.right !== void 0 && s.right.color === Color.Red) {
        s = p.left = clone2(s);
        z = s.right = clone2(s.right);
        p.left = z.right;
        s.right = z.left;
        z.right = p;
        z.left = s;
        z.color = p.color;
        p.color = Color.Black;
        s.color = Color.Black;
        n.color = Color.Black;
        recount(p);
        recount(s);
        recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = z;
          } else {
            pp.left = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== void 0 && s.color === Color.Black) {
        if (p.color === Color.Red) {
          p.color = Color.Black;
          p.left = repaint(s, Color.Red);
          return;
        } else {
          p.left = repaint(s, Color.Red);
          continue;
        }
      } else if (s !== void 0) {
        s = clone2(s);
        p.left = s.right;
        s.right = p;
        s.color = p.color;
        p.color = Color.Red;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    }
  }
}, "fixDoubleBlack");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/RedBlackTree.js
var has7 = has6;
var insert2 = insert;
var keys5 = keysForward;
var removeFirst2 = removeFirst;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/SortedSet.js
var TypeId11 = /* @__PURE__ */ Symbol.for("effect/SortedSet");
var SortedSetProto = {
  [TypeId11]: {
    _A: /* @__PURE__ */ __name((_) => _, "_A")
  },
  [symbol]() {
    return pipe(hash(this.keyTree), combine(hash(TypeId11)), cached2(this));
  },
  [symbol2](that) {
    return isSortedSet(that) && equals(this.keyTree, that.keyTree);
  },
  [Symbol.iterator]() {
    return keys5(this.keyTree);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromTree = /* @__PURE__ */ __name((keyTree) => {
  const a = Object.create(SortedSetProto);
  a.keyTree = keyTree;
  return a;
}, "fromTree");
var isSortedSet = /* @__PURE__ */ __name((u) => hasProperty(u, TypeId11), "isSortedSet");
var add5 = /* @__PURE__ */ dual(2, (self, value) => has7(self.keyTree, value) ? self : fromTree(insert2(self.keyTree, value, true)));
var remove5 = /* @__PURE__ */ dual(2, (self, value) => fromTree(removeFirst2(self.keyTree, value)));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/supervisor.js
var SupervisorSymbolKey = "effect/Supervisor";
var SupervisorTypeId = /* @__PURE__ */ Symbol.for(SupervisorSymbolKey);
var supervisorVariance = {
  /* c8 ignore next */
  _T: /* @__PURE__ */ __name((_) => _, "_T")
};
var ProxySupervisor = class _ProxySupervisor {
  static {
    __name(this, "ProxySupervisor");
  }
  underlying;
  value0;
  [SupervisorTypeId] = supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
  }
  get value() {
    return this.value0;
  }
  onStart(context2, effect, parent, fiber) {
    this.underlying.onStart(context2, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.underlying.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.underlying.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new _ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
};
var Zip = class _Zip {
  static {
    __name(this, "Zip");
  }
  left;
  right;
  _tag = "Zip";
  [SupervisorTypeId] = supervisorVariance;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  get value() {
    return zip2(this.left.value, this.right.value);
  }
  onStart(context2, effect, parent, fiber) {
    this.left.onStart(context2, effect, parent, fiber);
    this.right.onStart(context2, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new _Zip(this, right3);
  }
};
var isZip = /* @__PURE__ */ __name((self) => hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip"), "isZip");
var Track = class {
  static {
    __name(this, "Track");
  }
  [SupervisorTypeId] = supervisorVariance;
  fibers = /* @__PURE__ */ new Set();
  get value() {
    return sync(() => Array.from(this.fibers));
  }
  onStart(_context, _effect, _parent, fiber) {
    this.fibers.add(fiber);
  }
  onEnd(_value, fiber) {
    this.fibers.delete(fiber);
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var Const = class {
  static {
    __name(this, "Const");
  }
  effect;
  [SupervisorTypeId] = supervisorVariance;
  constructor(effect) {
    this.effect = effect;
  }
  get value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
  }
  onEnd(_value, _fiber) {
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var FibersIn = class {
  static {
    __name(this, "FibersIn");
  }
  ref;
  [SupervisorTypeId] = supervisorVariance;
  constructor(ref) {
    this.ref = ref;
  }
  get value() {
    return sync(() => get5(this.ref));
  }
  onStart(_context, _effect, _parent, fiber) {
    pipe(this.ref, set2(pipe(get5(this.ref), add5(fiber))));
  }
  onEnd(_value, fiber) {
    pipe(this.ref, set2(pipe(get5(this.ref), remove5(fiber))));
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var fromEffect = /* @__PURE__ */ __name((effect) => {
  return new Const(effect);
}, "fromEffect");
var none7 = /* @__PURE__ */ globalValue("effect/Supervisor/none", () => fromEffect(void_));

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/supervisor/patch.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Differ.js
init_esm();
var make28 = make14;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/supervisor/patch.js
var OP_EMPTY3 = "Empty";
var OP_ADD_SUPERVISOR = "AddSupervisor";
var OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
var OP_AND_THEN2 = "AndThen";
var empty22 = {
  _tag: OP_EMPTY3
};
var combine7 = /* @__PURE__ */ __name((self, that) => {
  return {
    _tag: OP_AND_THEN2,
    first: self,
    second: that
  };
}, "combine");
var patch8 = /* @__PURE__ */ __name((self, supervisor) => {
  return patchLoop(supervisor, of2(self));
}, "patch");
var patchLoop = /* @__PURE__ */ __name((_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty2(patches)) {
    const head3 = headNonEmpty2(patches);
    switch (head3._tag) {
      case OP_EMPTY3: {
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head3.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head3.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_AND_THEN2: {
        patches = prepend2(head3.first)(prepend2(head3.second)(tailNonEmpty2(patches)));
        break;
      }
    }
  }
  return supervisor;
}, "patchLoop");
var removeSupervisor = /* @__PURE__ */ __name((self, that) => {
  if (equals(self, that)) {
    return none7;
  } else {
    if (isZip(self)) {
      return removeSupervisor(self.left, that).zip(removeSupervisor(self.right, that));
    } else {
      return self;
    }
  }
}, "removeSupervisor");
var toSet2 = /* @__PURE__ */ __name((self) => {
  if (equals(self, none7)) {
    return empty7();
  } else {
    if (isZip(self)) {
      return pipe(toSet2(self.left), union3(toSet2(self.right)));
    } else {
      return make10(self);
    }
  }
}, "toSet");
var diff7 = /* @__PURE__ */ __name((oldValue, newValue) => {
  if (equals(oldValue, newValue)) {
    return empty22;
  }
  const oldSupervisors = toSet2(oldValue);
  const newSupervisors = toSet2(newValue);
  const added = pipe(newSupervisors, difference3(oldSupervisors), reduce4(empty22, (patch9, supervisor) => combine7(patch9, {
    _tag: OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = pipe(oldSupervisors, difference3(newSupervisors), reduce4(empty22, (patch9, supervisor) => combine7(patch9, {
    _tag: OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return combine7(added, removed);
}, "diff");
var differ2 = /* @__PURE__ */ make28({
  empty: empty22,
  patch: patch8,
  combine: combine7,
  diff: diff7
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/fiberRuntime.js
var fiberStarted = /* @__PURE__ */ counter5("effect_fiber_started", {
  incremental: true
});
var fiberActive = /* @__PURE__ */ counter5("effect_fiber_active");
var fiberSuccesses = /* @__PURE__ */ counter5("effect_fiber_successes", {
  incremental: true
});
var fiberFailures = /* @__PURE__ */ counter5("effect_fiber_failures", {
  incremental: true
});
var fiberLifetimes = /* @__PURE__ */ tagged(/* @__PURE__ */ histogram5("effect_fiber_lifetimes", /* @__PURE__ */ exponential({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds");
var EvaluationSignalContinue = "Continue";
var EvaluationSignalDone = "Done";
var EvaluationSignalYieldNow = "Yield";
var runtimeFiberVariance = {
  /* c8 ignore next */
  _E: /* @__PURE__ */ __name((_) => _, "_E"),
  /* c8 ignore next */
  _A: /* @__PURE__ */ __name((_) => _, "_A")
};
var absurd = /* @__PURE__ */ __name((_) => {
  throw new Error(`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
}, "absurd");
var YieldedOp = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp");
var yieldedOpChannel = /* @__PURE__ */ globalValue("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
}));
var contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i1(value));
  },
  ["OnStep"]: /* @__PURE__ */ __name((_, _cont, value) => {
    return exitSucceed(exitSucceed(value));
  }, "OnStep"),
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i2(value));
  },
  [OP_REVERT_FLAGS]: (self, cont, value) => {
    self.patchRuntimeFlags(self.currentRuntimeFlags, cont.patch);
    if (interruptible(self.currentRuntimeFlags) && self.isInterrupted()) {
      return exitFailCause(self.getInterruptedCause());
    } else {
      return exitSucceed(value);
    }
  },
  [OP_WHILE]: (self, cont, value) => {
    internalCall(() => cont.effect_instruction_i2(value));
    if (internalCall(() => cont.effect_instruction_i0())) {
      self.pushStack(cont);
      return internalCall(() => cont.effect_instruction_i1());
    } else {
      return void_;
    }
  },
  [OP_ITERATOR]: (self, cont, value) => {
    const state = internalCall(() => cont.effect_instruction_i0.next(value));
    if (state.done) return exitSucceed(state.value);
    self.pushStack(cont);
    return yieldWrapGet(state.value);
  }
};
var drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self, runtimeFlags2, cur, message) => {
    self.processNewInterruptSignal(message.cause);
    return interruptible(runtimeFlags2) ? exitFailCause(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [OP_STATEFUL]: (self, runtimeFlags2, cur, message) => {
    message.onFiber(self, running2(runtimeFlags2));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return flatMap6(yieldNow(), () => cur);
  }
};
var runBlockedRequests = /* @__PURE__ */ __name((self) => forEachSequentialDiscard(flatten3(self), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential4]) => {
  const map13 = /* @__PURE__ */ new Map();
  const arr = [];
  for (const block of sequential4) {
    arr.push(toReadonlyArray(block));
    for (const entry of block) {
      map13.set(entry.request, entry);
    }
  }
  const flat = arr.flat();
  return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(arr), flat, () => flat.forEach((entry) => {
    entry.listeners.interrupted = true;
  })), currentRequestMap, map13);
}, false, false)), "runBlockedRequests");
var _version = /* @__PURE__ */ getCurrentVersion();
var FiberRuntime = class extends Class2 {
  static {
    __name(this, "FiberRuntime");
  }
  [FiberTypeId] = fiberVariance2;
  [RuntimeFiberTypeId] = runtimeFiberVariance;
  _fiberRefs;
  _fiberId;
  _queue = /* @__PURE__ */ new Array();
  _children = null;
  _observers = /* @__PURE__ */ new Array();
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [];
  _isYielding = false;
  currentRuntimeFlags;
  currentOpCount = 0;
  currentSupervisor;
  currentScheduler;
  currentTracer;
  currentSpan;
  currentContext;
  currentDefaultServices;
  constructor(fiberId2, fiberRefs0, runtimeFlags0) {
    super();
    this.currentRuntimeFlags = runtimeFlags0;
    this._fiberId = fiberId2;
    this._fiberRefs = fiberRefs0;
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this.refreshRefCache();
  }
  commit() {
    return join2(this);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(effect) {
    this.tell(resume(effect));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((_, status) => status);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((state, status) => {
      if (isDone2(status)) {
        return state.currentRuntimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return unsafeMake4(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    if (this._children === null) {
      this._children = /* @__PURE__ */ new Set();
    }
    return this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(f) {
    return suspend(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(stateful((fiber, status) => {
        deferredUnsafeDone(deferred, sync(() => f(fiber, status)));
      }));
      return deferredAwait(deferred);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async_((resume2) => {
      const cb = /* @__PURE__ */ __name((exit3) => resume2(succeed(exit3)), "cb");
      this.tell(stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return sync(() => this.tell(stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch9 = pipe(
        diff4(parentRuntimeFlags, updatedRuntimeFlags),
        // Do not inherit WindDown or Interruption!
        exclude2(Interruption),
        exclude2(WindDown)
      );
      return updateRuntimeFlags(patch9);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return sync(() => fromNullable(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(fiberId2) {
    return sync(() => this.tell(interruptSignal(interrupt(fiberId2))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(fiberId2) {
    this.tell(interruptSignal(interrupt(fiberId2)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(observer) {
    this._observers = this._observers.filter((o2) => o2 !== observer);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this.currentRuntimeFlags);
    return this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(fiberRef, value) {
    this._fiberRefs = updateAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(currentServices);
    this.currentTracer = this.currentDefaultServices.unsafeMap.get(tracerTag.key);
    this.currentSupervisor = this.getFiberRef(currentSupervisor);
    this.currentScheduler = this.getFiberRef(currentScheduler);
    this.currentContext = this.getFiberRef(currentContext);
    this.currentSpan = this.currentContext.unsafeMap.get(spanTag.key);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(fiberRefs2) {
    this._fiberRefs = fiberRefs2;
    this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(child) {
    this.getChildren().add(child);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(child) {
    this.getChildren().delete(child);
  }
  /**
   * Transfers all children of this fiber that are currently running to the
   * specified fiber scope.
   *
   * **NOTE**: This method must be invoked by the fiber itself after it has
   * evaluated the effects but prior to exiting.
   */
  transferChildren(scope2) {
    const children = this._children;
    this._children = null;
    if (children !== null && children.size > 0) {
      for (const child of children) {
        if (child._exitValue === null) {
          scope2.add(this.currentRuntimeFlags, child);
        }
      }
    }
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(runtimeFlags2, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags2, cur, message);
    }
    return cur;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !isEmpty5(this.getFiberRef(currentInterruptedCause));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(cause) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(cause) {
    this.addInterruptedCause(cause);
    this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone3 = false;
      const body = /* @__PURE__ */ __name(() => {
        const next = it.next();
        if (!next.done) {
          return asVoid(next.value.await);
        } else {
          return sync(() => {
            isDone3 = true;
          });
        }
      }, "body");
      return whileLoop({
        while: /* @__PURE__ */ __name(() => !isDone3, "while"),
        body,
        step: /* @__PURE__ */ __name(() => {
        }, "step")
      });
    }
    return null;
  }
  reportExitValue(exit3) {
    if (runtimeMetrics(this.currentRuntimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = Date.now();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit3._tag) {
        case OP_SUCCESS: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit3._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly(exit3.cause) && level._tag === "Some") {
        this.log("Fiber terminated with an unhandled error", exit3.cause, level);
      }
    }
  }
  setExitValue(exit3) {
    this._exitValue = exit3;
    this.reportExitValue(exit3);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit3);
    }
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel = isSome2(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan2(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations2 = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size3(loggers) > 0) {
      const clockService = get3(this.getFiberRef(currentServices), clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      withRedactableContext(contextMap, () => {
        for (const logger of loggers) {
          logger.log({
            fiberId: this.id(),
            logLevel,
            message,
            cause,
            context: contextMap,
            spans,
            annotations: annotations2,
            date
          });
        }
      });
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(this, this._exitValue !== null ? done3 : suspended2(this.currentRuntimeFlags, this._asyncBlockingOn));
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(effect0) {
    this.currentSupervisor.onResume(this);
    try {
      let effect = interruptible(this.currentRuntimeFlags) && this.isInterrupted() ? exitFailCause(this.getInterruptedCause()) : effect0;
      while (effect !== null) {
        const eff = effect;
        const exit3 = this.runLoop(eff);
        if (exit3 === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          yieldedOpChannel.currentOp = null;
          if (op._op === OP_YIELD) {
            if (cooperativeYielding(this.currentRuntimeFlags)) {
              this.tell(yieldNow3());
              this.tell(resume(exitVoid));
              effect = null;
            } else {
              effect = exitVoid;
            }
          } else if (op._op === OP_ASYNC) {
            effect = null;
          }
        } else {
          this.currentRuntimeFlags = pipe(this.currentRuntimeFlags, enable2(WindDown));
          const interruption2 = this.interruptAllChildren();
          if (interruption2 !== null) {
            effect = flatMap6(interruption2, () => exit3);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit3);
            } else {
              this.tell(resume(exit3));
            }
            effect = null;
          }
        }
      }
    } finally {
      this.currentSupervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect));
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(effect) {
    this.tell(resume(effect));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(oldRuntimeFlags, patch9) {
    const newRuntimeFlags = patch4(oldRuntimeFlags, patch9);
    globalThis[currentFiberURI] = this;
    this.currentRuntimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(runtimeFlags2, asyncRegister) {
    let alreadyCalled = false;
    const callback = /* @__PURE__ */ __name((effect) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect));
      }
    }, "callback");
    if (interruptible(runtimeFlags2)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause(die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this.currentRuntimeFlags
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE && frame._op !== OP_ITERATOR) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OP_TAG](op) {
    return sync(() => unsafeGet3(this.currentContext, op));
  }
  ["Left"](op) {
    return fail2(op.left);
  }
  ["None"](_) {
    return fail2(new NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  ["Micro"](op) {
    return unsafeAsync((microResume) => {
      let resume2 = microResume;
      const fiber = runFork(provideContext2(op, this.currentContext));
      fiber.addObserver((exit3) => {
        if (exit3._tag === "Success") {
          return resume2(exitSucceed(exit3.value));
        }
        switch (exit3.cause._tag) {
          case "Interrupt": {
            return resume2(exitFailCause(interrupt(none4)));
          }
          case "Fail": {
            return resume2(fail2(exit3.cause.error));
          }
          case "Die": {
            return resume2(die2(exit3.cause.defect));
          }
        }
      });
      return unsafeAsync((abortResume) => {
        resume2 = /* @__PURE__ */ __name((_) => {
          abortResume(void_);
        }, "resume");
        fiber.unsafeInterrupt();
      });
    });
  }
  [OP_SYNC](op) {
    const value = internalCall(() => op.effect_instruction_i0());
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      yieldedOpChannel.currentOp = exitSucceed(value);
      return YieldedOp;
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
    } else {
      yieldedOpChannel.currentOp = oldCur;
      return YieldedOp;
    }
  }
  [OP_FAILURE](op) {
    const cause = op.effect_instruction_i0;
    const cont = this.getNextFailCont();
    if (cont !== void 0) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible(this.currentRuntimeFlags) && this.isInterrupted())) {
            return internalCall(() => cont.effect_instruction_i1(cause));
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case "OnStep": {
          if (!(interruptible(this.currentRuntimeFlags) && this.isInterrupted())) {
            return exitSucceed(exitFailCause(cause));
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this.currentRuntimeFlags, cont.patch);
          if (interruptible(this.currentRuntimeFlags) && this.isInterrupted()) {
            return exitFailCause(sequential(cause, this.getInterruptedCause()));
          } else {
            return exitFailCause(cause);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      yieldedOpChannel.currentOp = exitFailCause(cause);
      return YieldedOp;
    }
  }
  [OP_WITH_RUNTIME](op) {
    return internalCall(() => op.effect_instruction_i0(this, running2(this.currentRuntimeFlags)));
  }
  ["Blocked"](op) {
    const refs = this.getFiberRefs();
    const flags = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this.currentRuntimeFlags = snap.flags;
      const patchRefs = diff6(snap.refs, refs);
      const patchFlags = diff4(snap.flags, flags);
      return exitSucceed(blocked(op.effect_instruction_i0, withFiberRuntime((newFiber) => {
        while (frames.length > 0) {
          newFiber.pushStack(frames.pop());
        }
        newFiber.setFiberRefs(patch7(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
        newFiber.currentRuntimeFlags = patch4(patchFlags)(newFiber.currentRuntimeFlags);
        return op.effect_instruction_i1;
      })));
    }
    return uninterruptibleMask((restore) => flatMap6(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () => restore(op.effect_instruction_i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.effect_instruction_i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.effect_instruction_i0;
    const oldRuntimeFlags = this.currentRuntimeFlags;
    const newRuntimeFlags = patch4(oldRuntimeFlags, updateFlags);
    if (interruptible(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this.currentRuntimeFlags, updateFlags);
      if (op.effect_instruction_i1) {
        const revertFlags = diff4(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags));
      } else {
        return exitVoid;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.effect_instruction_i1;
    this.initiateAsync(this.currentRuntimeFlags, op.effect_instruction_i0);
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_YIELD](op) {
    this._isYielding = false;
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_WHILE](op) {
    const check = op.effect_instruction_i0;
    const body = op.effect_instruction_i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return exitVoid;
    }
  }
  [OP_ITERATOR](op) {
    return contOpSuccess[OP_ITERATOR](this, op, void 0);
  }
  [OP_COMMIT](op) {
    return internalCall(() => op.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this.currentRuntimeFlags & OpSupervision) !== 0) {
        this.currentSupervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this.currentRuntimeFlags, cur);
      }
      if (!this._isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this.currentScheduler.shouldYield(this);
        if (shouldYield !== false) {
          this._isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap6(yieldNow({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        cur = this.currentTracer.context(() => {
          if (_version !== cur[EffectTypeId2]._V) {
            const level = this.getFiberRef(currentVersionMismatchErrorLogLevel);
            if (level._tag === "Some") {
              const effectVersion = cur[EffectTypeId2]._V;
              this.log(`Executing an Effect versioned ${effectVersion} with a Runtime of version ${getCurrentVersion()}, you may want to dedupe the effect dependencies, you can use the language service plugin to detect this at compile time: https://github.com/Effect-TS/language-service`, empty14, level);
            }
          }
          return this[cur._op](cur);
        }, this);
        if (cur === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          if (op._op === OP_YIELD || op._op === OP_ASYNC) {
            return YieldedOp;
          }
          yieldedOpChannel.currentOp = null;
          return op._op === OP_SUCCESS || op._op === OP_FAILURE ? op : exitFailCause(die(op));
        }
      } catch (e) {
        if (cur !== YieldedOp && !hasProperty(cur, "_op") || !(cur._op in this)) {
          cur = dieMessage(`Not a valid effect: ${toStringUnknown(cur)}`);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause(sequential(die(e), interrupt(none4)));
        } else {
          cur = die2(e);
        }
      }
    }
  }
  run = /* @__PURE__ */ __name(() => {
    this.drainQueueOnCurrentThread();
  }, "run");
};
var currentMinimumLogLevel = /* @__PURE__ */ globalValue("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
var loggerWithConsoleLog = /* @__PURE__ */ __name((self) => makeLogger((opts) => {
  const services = getOrDefault2(opts.context, currentServices);
  get3(services, consoleTag).unsafe.log(self.log(opts));
}), "loggerWithConsoleLog");
var defaultLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => loggerWithConsoleLog(stringLogger));
var tracerLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({
  annotations: annotations2,
  cause,
  context: context2,
  fiberId: fiberId2,
  logLevel,
  message
}) => {
  const span2 = getOption2(getOrDefault(context2, currentContext), spanTag);
  if (span2._tag === "None" || span2.value._tag === "ExternalSpan") {
    return;
  }
  const clockService = unsafeGet3(getOrDefault(context2, currentServices), clockTag);
  const attributes = {};
  for (const [key, value] of annotations2) {
    attributes[key] = value;
  }
  attributes["effect.fiberId"] = threadName2(fiberId2);
  attributes["effect.logLevel"] = logLevel.label;
  if (cause !== null && cause._tag !== "Empty") {
    attributes["effect.cause"] = pretty(cause, {
      renderErrorCause: true
    });
  }
  span2.value.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clockService.unsafeCurrentTimeNanos(), attributes);
}));
var currentLoggers = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make10(defaultLogger, tracerLogger)));
var forEach6 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (self, f, options) => withFiberRuntime((r) => {
  const isRequestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(currentRequestBatching);
  if (options?.discard) {
    return match7(options.concurrency, () => finalizersMaskInternal(sequential3, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), true, false, 1) : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel3, options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false)), (n) => finalizersMaskInternal(parallelN2(n), options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false, n)));
  }
  return match7(options?.concurrency, () => finalizersMaskInternal(sequential3, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true) : forEachSequential(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel3, options?.concurrentFinalizers)((restore) => forEachParUnbounded(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)), (n) => finalizersMaskInternal(parallelN2(n), options?.concurrentFinalizers)((restore) => forEachParN(self, n, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)));
}));
var forEachParUnbounded = /* @__PURE__ */ __name((self, f, batching) => suspend(() => {
  const as4 = fromIterable(self);
  const array3 = new Array(as4.length);
  const fn = /* @__PURE__ */ __name((a, i) => flatMap6(f(a, i), (b) => sync(() => array3[i] = b)), "fn");
  return zipRight(forEachConcurrentDiscard(as4, fn, batching, false), succeed(array3));
}), "forEachParUnbounded");
var forEachConcurrentDiscard = /* @__PURE__ */ __name((self, f, batching, processAll, n) => uninterruptibleMask((restore) => transplant((graft) => withFiberRuntime((parent) => {
  let todos = Array.from(self).reverse();
  let target = todos.length;
  if (target === 0) {
    return void_;
  }
  let counter6 = 0;
  let interrupted = false;
  const fibersCount = n ? Math.min(todos.length, n) : todos.length;
  const fibers = /* @__PURE__ */ new Set();
  const results = new Array();
  const interruptAll = /* @__PURE__ */ __name(() => fibers.forEach((fiber) => {
    fiber.currentScheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(parent.id());
    }, 0);
  }), "interruptAll");
  const startOrder = new Array();
  const joinOrder = new Array();
  const residual = new Array();
  const collectExits = /* @__PURE__ */ __name(() => {
    const exits = results.filter(({
      exit: exit3
    }) => exit3._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({
      exit: exit3
    }) => exit3);
    if (exits.length === 0) {
      exits.push(exitVoid);
    }
    return exits;
  }, "collectExits");
  const runFiber = /* @__PURE__ */ __name((eff, interruptImmediately = false) => {
    const runnable = uninterruptible(graft(eff));
    const fiber = unsafeForkUnstarted(runnable, parent, parent.currentRuntimeFlags, globalScope);
    parent.currentScheduler.scheduleTask(() => {
      if (interruptImmediately) {
        fiber.unsafeInterruptAsFork(parent.id());
      }
      fiber.resume(runnable);
    }, 0);
    return fiber;
  }, "runFiber");
  const onInterruptSignal = /* @__PURE__ */ __name(() => {
    if (!processAll) {
      target -= todos.length;
      todos = [];
    }
    interrupted = true;
    interruptAll();
  }, "onInterruptSignal");
  const stepOrExit = batching ? step2 : exit;
  const processingFiber = runFiber(async_((resume2) => {
    const pushResult = /* @__PURE__ */ __name((res, index) => {
      if (res._op === "Blocked") {
        residual.push(res);
      } else {
        results.push({
          index,
          exit: res
        });
        if (res._op === "Failure" && !interrupted) {
          onInterruptSignal();
        }
      }
    }, "pushResult");
    const next = /* @__PURE__ */ __name(() => {
      if (todos.length > 0) {
        const a = todos.pop();
        let index = counter6++;
        const returnNextElement = /* @__PURE__ */ __name(() => {
          const a2 = todos.pop();
          index = counter6++;
          return flatMap6(yieldNow(), () => flatMap6(stepOrExit(restore(f(a2, index))), onRes));
        }, "returnNextElement");
        const onRes = /* @__PURE__ */ __name((res) => {
          if (todos.length > 0) {
            pushResult(res, index);
            if (todos.length > 0) {
              return returnNextElement();
            }
          }
          return succeed(res);
        }, "onRes");
        const todo = flatMap6(stepOrExit(restore(f(a, index))), onRes);
        const fiber = runFiber(todo);
        startOrder.push(fiber);
        fibers.add(fiber);
        if (interrupted) {
          fiber.currentScheduler.scheduleTask(() => {
            fiber.unsafeInterruptAsFork(parent.id());
          }, 0);
        }
        fiber.addObserver((wrapped) => {
          let exit3;
          if (wrapped._op === "Failure") {
            exit3 = wrapped;
          } else {
            exit3 = wrapped.effect_instruction_i0;
          }
          joinOrder.push(fiber);
          fibers.delete(fiber);
          pushResult(exit3, index);
          if (results.length === target) {
            resume2(succeed(getOrElse(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitVoid)));
          } else if (residual.length + results.length === target) {
            const exits = collectExits();
            const requests = residual.map((blocked2) => blocked2.effect_instruction_i0).reduce(par);
            resume2(succeed(blocked(requests, forEachConcurrentDiscard([getOrElse(exitCollectAll(exits, {
              parallel: true
            }), () => exitVoid), ...residual.map((blocked2) => blocked2.effect_instruction_i1)], (i) => i, batching, true, n))));
          } else {
            next();
          }
        });
      }
    }, "next");
    for (let i = 0; i < fibersCount; i++) {
      next();
    }
  }));
  return asVoid(onExit(flatten4(restore(join2(processingFiber))), exitMatch({
    onFailure: /* @__PURE__ */ __name((cause) => {
      onInterruptSignal();
      const target2 = residual.length + 1;
      const concurrency = Math.min(typeof n === "number" ? n : residual.length, residual.length);
      const toPop = Array.from(residual);
      return async_((cb) => {
        const exits = [];
        let count = 0;
        let index = 0;
        const check = /* @__PURE__ */ __name((index2, hitNext) => (exit3) => {
          exits[index2] = exit3;
          count++;
          if (count === target2) {
            cb(exitSucceed(exitFailCause(cause)));
          }
          if (toPop.length > 0 && hitNext) {
            next();
          }
        }, "check");
        const next = /* @__PURE__ */ __name(() => {
          runFiber(toPop.pop(), true).addObserver(check(index, true));
          index++;
        }, "next");
        processingFiber.addObserver(check(index, false));
        index++;
        for (let i = 0; i < concurrency; i++) {
          next();
        }
      });
    }, "onFailure"),
    onSuccess: /* @__PURE__ */ __name(() => forEachSequential(joinOrder, (f2) => f2.inheritAll), "onSuccess")
  })));
}))), "forEachConcurrentDiscard");
var forEachParN = /* @__PURE__ */ __name((self, n, f, batching) => suspend(() => {
  const as4 = fromIterable(self);
  const array3 = new Array(as4.length);
  const fn = /* @__PURE__ */ __name((a, i) => map9(f(a, i), (b) => array3[i] = b), "fn");
  return zipRight(forEachConcurrentDiscard(as4, fn, batching, false, n), succeed(array3));
}), "forEachParN");
var forkDaemon = /* @__PURE__ */ __name((self) => forkWithScopeOverride(self, globalScope), "forkDaemon");
var unsafeFork2 = /* @__PURE__ */ __name((effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
}, "unsafeFork");
var unsafeForkUnstarted = /* @__PURE__ */ __name((effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  return childFiber;
}, "unsafeForkUnstarted");
var unsafeMakeChildFiber = /* @__PURE__ */ __name((effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = unsafeMake2();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = getOrDefault(childFiberRefs, currentContext);
  const supervisor = childFiber.currentSupervisor;
  supervisor.onStart(childContext, effect, some2(parentFiber), childFiber);
  childFiber.addObserver((exit3) => supervisor.onEnd(exit3, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
}, "unsafeMakeChildFiber");
var forkWithScopeOverride = /* @__PURE__ */ __name((self, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed(unsafeFork2(self, parentFiber, parentStatus.runtimeFlags, scopeOverride))), "forkWithScopeOverride");
var parallelFinalizers = /* @__PURE__ */ __name((self) => contextWithEffect((context2) => match2(getOption2(context2, scopeTag), {
  onNone: /* @__PURE__ */ __name(() => self, "onNone"),
  onSome: /* @__PURE__ */ __name((scope2) => {
    switch (scope2.strategy._tag) {
      case "Parallel":
        return self;
      case "Sequential":
      case "ParallelN":
        return flatMap6(scopeFork(scope2, parallel3), (inner) => scopeExtend(self, inner));
    }
  }, "onSome")
})), "parallelFinalizers");
var parallelNFinalizers = /* @__PURE__ */ __name((parallelism) => (self) => contextWithEffect((context2) => match2(getOption2(context2, scopeTag), {
  onNone: /* @__PURE__ */ __name(() => self, "onNone"),
  onSome: /* @__PURE__ */ __name((scope2) => {
    if (scope2.strategy._tag === "ParallelN" && scope2.strategy.parallelism === parallelism) {
      return self;
    }
    return flatMap6(scopeFork(scope2, parallelN2(parallelism)), (inner) => scopeExtend(self, inner));
  }, "onSome")
})), "parallelNFinalizers");
var finalizersMaskInternal = /* @__PURE__ */ __name((strategy, concurrentFinalizers) => (self) => contextWithEffect((context2) => match2(getOption2(context2, scopeTag), {
  onNone: /* @__PURE__ */ __name(() => self(identity), "onNone"),
  onSome: /* @__PURE__ */ __name((scope2) => {
    if (concurrentFinalizers === true) {
      const patch9 = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
      switch (scope2.strategy._tag) {
        case "Parallel":
          return patch9(self(parallelFinalizers));
        case "Sequential":
          return patch9(self(sequentialFinalizers));
        case "ParallelN":
          return patch9(self(parallelNFinalizers(scope2.strategy.parallelism)));
      }
    } else {
      return self(identity);
    }
  }, "onSome")
})), "finalizersMaskInternal");
var sequentialFinalizers = /* @__PURE__ */ __name((self) => contextWithEffect((context2) => match2(getOption2(context2, scopeTag), {
  onNone: /* @__PURE__ */ __name(() => self, "onNone"),
  onSome: /* @__PURE__ */ __name((scope2) => {
    switch (scope2.strategy._tag) {
      case "Sequential":
        return self;
      case "Parallel":
      case "ParallelN":
        return flatMap6(scopeFork(scope2, sequential3), (inner) => scopeExtend(self, inner));
    }
  }, "onSome")
})), "sequentialFinalizers");
var scopeTag = /* @__PURE__ */ GenericTag("effect/Scope");
var scopeUnsafeAddFinalizer = /* @__PURE__ */ __name((scope2, fin) => {
  if (scope2.state._tag === "Open") {
    scope2.state.finalizers.set({}, fin);
  }
}, "scopeUnsafeAddFinalizer");
var ScopeImplProto = {
  [ScopeTypeId]: ScopeTypeId,
  [CloseableScopeTypeId]: CloseableScopeTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  fork(strategy) {
    return sync(() => {
      const newScope = scopeUnsafeMake(strategy);
      if (this.state._tag === "Closed") {
        newScope.state = this.state;
        return newScope;
      }
      const key = {};
      const fin = /* @__PURE__ */ __name((exit3) => newScope.close(exit3), "fin");
      this.state.finalizers.set(key, fin);
      scopeUnsafeAddFinalizer(newScope, (_) => sync(() => {
        if (this.state._tag === "Open") {
          this.state.finalizers.delete(key);
        }
      }));
      return newScope;
    });
  },
  close(exit3) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return void_;
      }
      const finalizers = Array.from(this.state.finalizers.values()).reverse();
      this.state = {
        _tag: "Closed",
        exit: exit3
      };
      if (finalizers.length === 0) {
        return void_;
      }
      return isSequential(this.strategy) ? pipe(forEachSequential(finalizers, (fin) => exit(fin(exit3))), flatMap6((results) => pipe(exitCollectAll(results), map2(exitAsVoid), getOrElse(() => exitVoid)))) : isParallel(this.strategy) ? pipe(forEachParUnbounded(finalizers, (fin) => exit(fin(exit3)), false), flatMap6((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse(() => exitVoid)))) : pipe(forEachParN(finalizers, this.strategy.parallelism, (fin) => exit(fin(exit3)), false), flatMap6((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse(() => exitVoid))));
    });
  },
  addFinalizer(fin) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return fin(this.state.exit);
      }
      this.state.finalizers.set({}, fin);
      return void_;
    });
  }
};
var scopeUnsafeMake = /* @__PURE__ */ __name((strategy = sequential2) => {
  const scope2 = Object.create(ScopeImplProto);
  scope2.strategy = strategy;
  scope2.state = {
    _tag: "Open",
    finalizers: /* @__PURE__ */ new Map()
  };
  return scope2;
}, "scopeUnsafeMake");
var scopeExtend = /* @__PURE__ */ dual(2, (effect, scope2) => mapInputContext(
  effect,
  // @ts-expect-error
  merge3(make5(scopeTag, scope2))
));
var fiberRefUnsafeMakeSupervisor = /* @__PURE__ */ __name((initial) => fiberRefUnsafeMakePatch(initial, {
  differ: differ2,
  fork: empty22
}), "fiberRefUnsafeMakeSupervisor");
var currentRuntimeFlags = /* @__PURE__ */ fiberRefUnsafeMakeRuntimeFlags(none5);
var currentSupervisor = /* @__PURE__ */ fiberRefUnsafeMakeSupervisor(none7);
var invokeWithInterrupt = /* @__PURE__ */ __name((self, entries2, onInterrupt2) => fiberIdWith((id) => flatMap6(flatMap6(forkDaemon(interruptible2(self)), (processing) => async_((cb) => {
  const counts = entries2.map((_) => _.listeners.count);
  const checkDone = /* @__PURE__ */ __name(() => {
    if (counts.every((count) => count === 0)) {
      if (entries2.every((_) => {
        if (_.result.state.current._tag === "Pending") {
          return true;
        } else if (_.result.state.current._tag === "Done" && exitIsExit(_.result.state.current.effect) && _.result.state.current.effect._tag === "Failure" && isInterrupted(_.result.state.current.effect.cause)) {
          return true;
        } else {
          return false;
        }
      })) {
        cleanup.forEach((f) => f());
        onInterrupt2?.();
        cb(interruptFiber(processing));
      }
    }
  }, "checkDone");
  processing.addObserver((exit3) => {
    cleanup.forEach((f) => f());
    cb(exit3);
  });
  const cleanup = entries2.map((r, i) => {
    const observer = /* @__PURE__ */ __name((count) => {
      counts[i] = count;
      checkDone();
    }, "observer");
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return sync(() => {
    cleanup.forEach((f) => f());
  });
})), () => suspend(() => {
  const residual = entries2.flatMap((entry) => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return forEachSequentialDiscard(residual, (entry) => complete(entry.request, exitInterrupt(id)));
}))), "invokeWithInterrupt");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Cause.js
init_esm();
var isFailType2 = isFailType;
var pretty2 = pretty;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Effect.js
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Scope.js
init_esm();
var close = scopeClose;
var fork = scopeFork;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/internal/runtime.js
init_esm();
var makeDual = /* @__PURE__ */ __name((f) => function() {
  if (arguments.length === 1) {
    const runtime3 = arguments[0];
    return (effect, ...args2) => f(runtime3, effect, ...args2);
  }
  return f.apply(this, arguments);
}, "makeDual");
var unsafeFork3 = /* @__PURE__ */ makeDual((runtime3, self, options) => {
  const fiberId2 = unsafeMake2();
  const fiberRefUpdates = [[currentContext, [[fiberId2, runtime3.context]]]];
  if (options?.scheduler) {
    fiberRefUpdates.push([currentScheduler, [[fiberId2, options.scheduler]]]);
  }
  let fiberRefs2 = updateManyAs2(runtime3.fiberRefs, {
    entries: fiberRefUpdates,
    forkAs: fiberId2
  });
  if (options?.updateRefs) {
    fiberRefs2 = options.updateRefs(fiberRefs2, fiberId2);
  }
  const fiberRuntime = new FiberRuntime(fiberId2, fiberRefs2, runtime3.runtimeFlags);
  let effect = self;
  if (options?.scope) {
    effect = flatMap6(fork(options.scope, sequential2), (closeableScope) => zipRight(scopeAddFinalizer(closeableScope, fiberIdWith((id) => equals(id, fiberRuntime.id()) ? void_ : interruptAsFiber(fiberRuntime, id))), onExit(self, (exit3) => close(closeableScope, exit3))));
  }
  const supervisor = fiberRuntime.currentSupervisor;
  if (supervisor !== none7) {
    supervisor.onStart(runtime3.context, effect, none2(), fiberRuntime);
    fiberRuntime.addObserver((exit3) => supervisor.onEnd(exit3, fiberRuntime));
  }
  globalScope.add(runtime3.runtimeFlags, fiberRuntime);
  if (options?.immediate === false) {
    fiberRuntime.resume(effect);
  } else {
    fiberRuntime.start(effect);
  }
  return fiberRuntime;
});
var unsafeRunSync = /* @__PURE__ */ makeDual((runtime3, effect) => {
  const result = unsafeRunSyncExit(runtime3)(effect);
  if (result._tag === "Failure") {
    throw fiberFailure(result.effect_instruction_i0);
  }
  return result.effect_instruction_i0;
});
var AsyncFiberExceptionImpl = class extends Error {
  static {
    __name(this, "AsyncFiberExceptionImpl");
  }
  fiber;
  _tag = "AsyncFiberException";
  constructor(fiber) {
    super(`Fiber #${fiber.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
    this.fiber = fiber;
    this.name = this._tag;
    this.stack = this.message;
  }
};
var asyncFiberException = /* @__PURE__ */ __name((fiber) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error2 = new AsyncFiberExceptionImpl(fiber);
  Error.stackTraceLimit = limit;
  return error2;
}, "asyncFiberException");
var FiberFailureId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure");
var FiberFailureCauseId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var FiberFailureImpl = class extends Error {
  static {
    __name(this, "FiberFailureImpl");
  }
  [FiberFailureId];
  [FiberFailureCauseId];
  constructor(cause) {
    const head3 = prettyErrors(cause)[0];
    super(head3?.message || "An error has occurred");
    this[FiberFailureId] = FiberFailureId;
    this[FiberFailureCauseId] = cause;
    this.name = head3 ? `(FiberFailure) ${head3.name}` : "FiberFailure";
    if (head3?.stack) {
      this.stack = head3.stack;
    }
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[FiberFailureCauseId].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + pretty(this[FiberFailureCauseId], {
      renderErrorCause: true
    });
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var fiberFailure = /* @__PURE__ */ __name((cause) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error2 = new FiberFailureImpl(cause);
  Error.stackTraceLimit = limit;
  return error2;
}, "fiberFailure");
var fastPath = /* @__PURE__ */ __name((effect) => {
  const op = effect;
  switch (op._op) {
    case "Failure":
    case "Success": {
      return op;
    }
    case "Left": {
      return exitFail(op.left);
    }
    case "Right": {
      return exitSucceed(op.right);
    }
    case "Some": {
      return exitSucceed(op.value);
    }
    case "None": {
      return exitFail(NoSuchElementException());
    }
  }
}, "fastPath");
var unsafeRunSyncExit = /* @__PURE__ */ makeDual((runtime3, effect) => {
  const op = fastPath(effect);
  if (op) {
    return op;
  }
  const scheduler = new SyncScheduler();
  const fiberRuntime = unsafeFork3(runtime3)(effect, {
    scheduler
  });
  scheduler.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  return exitDie(capture(asyncFiberException(fiberRuntime), currentSpanFromFiber(fiberRuntime)));
});
var RuntimeImpl = class {
  static {
    __name(this, "RuntimeImpl");
  }
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context2, runtimeFlags2, fiberRefs2) {
    this.context = context2;
    this.runtimeFlags = runtimeFlags2;
    this.fiberRefs = fiberRefs2;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make29 = /* @__PURE__ */ __name((options) => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs), "make");
var defaultRuntimeFlags = /* @__PURE__ */ make16(Interruption, CooperativeYielding, RuntimeMetrics);
var defaultRuntime = /* @__PURE__ */ make29({
  context: /* @__PURE__ */ empty3(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: /* @__PURE__ */ empty18()
});
var unsafeForkEffect = /* @__PURE__ */ unsafeFork3(defaultRuntime);
var unsafeRunSyncEffect = /* @__PURE__ */ unsafeRunSync(defaultRuntime);

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Data.js
init_esm();
var Error3 = /* @__PURE__ */ function() {
  const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  const O = {
    BaseEffectError: class extends YieldableError {
      static {
        __name(this, "BaseEffectError");
      }
      constructor(args2) {
        super(args2?.message, args2?.cause ? {
          cause: args2.cause
        } : void 0);
        if (args2) {
          Object.assign(this, args2);
          Object.defineProperty(this, plainArgsSymbol, {
            value: args2,
            enumerable: false
          });
        }
      }
      toJSON() {
        return {
          ...this[plainArgsSymbol],
          ...this
        };
      }
    }
  };
  return O.BaseEffectError;
}();
var TaggedError = /* @__PURE__ */ __name((tag) => {
  const O = {
    BaseEffectError: class extends Error3 {
      static {
        __name(this, "BaseEffectError");
      }
      _tag = tag;
    }
  };
  O.BaseEffectError.prototype.name = tag;
  return O.BaseEffectError;
}, "TaggedError");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/Effect.js
var isEffect2 = isEffect;
var forEach7 = forEach6;
var suspend3 = suspend;
var _void = void_;
var catchAll2 = catchAll;
var map11 = map9;
var mapError2 = mapError;
var either3 = either2;
var flatMap9 = flatMap6;
var runFork2 = unsafeForkEffect;
var runSync = unsafeRunSyncEffect;

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/JSONSchema.js
var JSONSchema_exports = {};
__export(JSONSchema_exports, {
  fromAST: () => fromAST,
  make: () => make30
});
init_esm();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/ParseResult.js
init_esm();
var Pointer = class {
  static {
    __name(this, "Pointer");
  }
  path;
  actual;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Pointer";
  constructor(path, actual, issue) {
    this.path = path;
    this.actual = actual;
    this.issue = issue;
  }
};
var Unexpected = class {
  static {
    __name(this, "Unexpected");
  }
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Unexpected";
  constructor(actual, message) {
    this.actual = actual;
    this.message = message;
  }
};
var Missing = class {
  static {
    __name(this, "Missing");
  }
  ast;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Missing";
  /**
   * @since 3.10.0
   */
  actual = void 0;
  constructor(ast, message) {
    this.ast = ast;
    this.message = message;
  }
};
var Composite2 = class {
  static {
    __name(this, "Composite");
  }
  ast;
  actual;
  issues;
  output;
  /**
   * @since 3.10.0
   */
  _tag = "Composite";
  constructor(ast, actual, issues, output) {
    this.ast = ast;
    this.actual = actual;
    this.issues = issues;
    this.output = output;
  }
};
var Refinement2 = class {
  static {
    __name(this, "Refinement");
  }
  ast;
  actual;
  kind;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Refinement";
  constructor(ast, actual, kind, issue) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.issue = issue;
  }
};
var Transformation = class {
  static {
    __name(this, "Transformation");
  }
  ast;
  actual;
  kind;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Transformation";
  constructor(ast, actual, kind, issue) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.issue = issue;
  }
};
var Type2 = class {
  static {
    __name(this, "Type");
  }
  ast;
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Type";
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = message;
  }
};
var Forbidden = class {
  static {
    __name(this, "Forbidden");
  }
  ast;
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Forbidden";
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = message;
  }
};
var ParseErrorTypeId = /* @__PURE__ */ Symbol.for("effect/Schema/ParseErrorTypeId");
var ParseError = class extends (/* @__PURE__ */ TaggedError("ParseError")) {
  static {
    __name(this, "ParseError");
  }
  /**
   * @since 3.10.0
   */
  [ParseErrorTypeId] = ParseErrorTypeId;
  get message() {
    return this.toString();
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return TreeFormatter.formatIssueSync(this.issue);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _id: "ParseError",
      message: this.toString()
    };
  }
  /**
   * @since 3.10.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var isEither3 = isEither2;
var flatMap10 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? match(self, {
    onLeft: left2,
    onRight: f
  }) : flatMap9(self, f);
});
var map12 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? map(self, f) : map11(self, f);
});
var mapError3 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? mapLeft(self, f) : mapError2(self, f);
});
var orElse3 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? match(self, {
    onLeft: f,
    onRight: right2
  }) : catchAll2(self, f);
});
var mergeInternalOptions = /* @__PURE__ */ __name((options, overrideOptions) => {
  if (overrideOptions === void 0 || isNumber(overrideOptions)) {
    return options;
  }
  if (options === void 0) {
    return overrideOptions;
  }
  return {
    ...options,
    ...overrideOptions
  };
}, "mergeInternalOptions");
var getEither = /* @__PURE__ */ __name((ast, isDecoding, options) => {
  const parser = goMemo(ast, isDecoding);
  return (u, overrideOptions) => parser(u, mergeInternalOptions(options, overrideOptions));
}, "getEither");
var getOption3 = /* @__PURE__ */ __name((ast, isDecoding, options) => {
  const parser = getEither(ast, isDecoding, options);
  return (input, overrideOptions) => getRight2(parser(input, overrideOptions));
}, "getOption");
var decodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var encodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var goMemo = /* @__PURE__ */ __name((ast, isDecoding) => {
  const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap;
  const memo = memoMap.get(ast);
  if (memo) {
    return memo;
  }
  const raw = go(ast, isDecoding);
  const parseOptionsAnnotation = getParseOptionsAnnotation(ast);
  const parserWithOptions = isSome2(parseOptionsAnnotation) ? (i, options) => raw(i, mergeInternalOptions(options, parseOptionsAnnotation.value)) : raw;
  const decodingFallbackAnnotation = getDecodingFallbackAnnotation(ast);
  const parser = isDecoding && isSome2(decodingFallbackAnnotation) ? (i, options) => handleForbidden(orElse3(parserWithOptions(i, options), decodingFallbackAnnotation.value), ast, i, options) : parserWithOptions;
  memoMap.set(ast, parser);
  return parser;
}, "goMemo");
var getConcurrency = /* @__PURE__ */ __name((ast) => getOrUndefined(getConcurrencyAnnotation(ast)), "getConcurrency");
var getBatching = /* @__PURE__ */ __name((ast) => getOrUndefined(getBatchingAnnotation(ast)), "getBatching");
var go = /* @__PURE__ */ __name((ast, isDecoding) => {
  switch (ast._tag) {
    case "Refinement": {
      if (isDecoding) {
        const from = goMemo(ast.from, true);
        return (i, options) => {
          options = options ?? defaultParseOption;
          const allErrors = options?.errors === "all";
          const result = flatMap10(orElse3(from(i, options), (ef) => {
            const issue = new Refinement2(ast, i, "From", ef);
            if (allErrors && hasStableFilter(ast) && isComposite2(ef)) {
              return match2(ast.filter(i, options, ast), {
                onNone: /* @__PURE__ */ __name(() => left2(issue), "onNone"),
                onSome: /* @__PURE__ */ __name((ep) => left2(new Composite2(ast, i, [issue, new Refinement2(ast, i, "Predicate", ep)])), "onSome")
              });
            }
            return left2(issue);
          }), (a) => match2(ast.filter(a, options, ast), {
            onNone: /* @__PURE__ */ __name(() => right2(a), "onNone"),
            onSome: /* @__PURE__ */ __name((ep) => left2(new Refinement2(ast, i, "Predicate", ep)), "onSome")
          }));
          return handleForbidden(result, ast, i, options);
        };
      } else {
        const from = goMemo(typeAST(ast), true);
        const to = goMemo(dropRightRefinement(ast.from), false);
        return (i, options) => handleForbidden(flatMap10(from(i, options), (a) => to(a, options)), ast, i, options);
      }
    }
    case "Transformation": {
      const transform2 = getFinalTransformation(ast.transformation, isDecoding);
      const from = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
      const to = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
      return (i, options) => handleForbidden(flatMap10(mapError3(from(i, options), (e) => new Transformation(ast, i, isDecoding ? "Encoded" : "Type", e)), (a) => flatMap10(mapError3(transform2(a, options ?? defaultParseOption, ast, i), (e) => new Transformation(ast, i, "Transformation", e)), (i2) => mapError3(to(i2, options), (e) => new Transformation(ast, i, isDecoding ? "Type" : "Encoded", e)))), ast, i, options);
    }
    case "Declaration": {
      const parse = isDecoding ? ast.decodeUnknown(...ast.typeParameters) : ast.encodeUnknown(...ast.typeParameters);
      return (i, options) => handleForbidden(parse(i, options ?? defaultParseOption, ast), ast, i, options);
    }
    case "Literal":
      return fromRefinement(ast, (u) => u === ast.literal);
    case "UniqueSymbol":
      return fromRefinement(ast, (u) => u === ast.symbol);
    case "UndefinedKeyword":
      return fromRefinement(ast, isUndefined);
    case "NeverKeyword":
      return fromRefinement(ast, isNever);
    case "UnknownKeyword":
    case "AnyKeyword":
    case "VoidKeyword":
      return right2;
    case "StringKeyword":
      return fromRefinement(ast, isString);
    case "NumberKeyword":
      return fromRefinement(ast, isNumber);
    case "BooleanKeyword":
      return fromRefinement(ast, isBoolean);
    case "BigIntKeyword":
      return fromRefinement(ast, isBigInt);
    case "SymbolKeyword":
      return fromRefinement(ast, isSymbol);
    case "ObjectKeyword":
      return fromRefinement(ast, isObject);
    case "Enums":
      return fromRefinement(ast, (u) => ast.enums.some(([_, value]) => value === u));
    case "TemplateLiteral": {
      const regex = getTemplateLiteralRegExp(ast);
      return fromRefinement(ast, (u) => isString(u) && regex.test(u));
    }
    case "TupleType": {
      const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
      const rest = ast.rest.map((annotatedAST) => goMemo(annotatedAST.type, isDecoding));
      let requiredTypes = ast.elements.filter((e) => !e.isOptional);
      if (ast.rest.length > 0) {
        requiredTypes = requiredTypes.concat(ast.rest.slice(1));
      }
      const requiredLen = requiredTypes.length;
      const expectedIndexes = ast.elements.length > 0 ? ast.elements.map((_, i) => i).join(" | ") : "never";
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isArray(input)) {
          return left2(new Type2(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const output = [];
        const len = input.length;
        for (let i2 = len; i2 <= requiredLen - 1; i2++) {
          const e = new Pointer(i2, input, new Missing(requiredTypes[i2 - len]));
          if (allErrors) {
            es.push([stepKey++, e]);
            continue;
          } else {
            return left2(new Composite2(ast, input, e, output));
          }
        }
        if (ast.rest.length === 0) {
          for (let i2 = ast.elements.length; i2 <= len - 1; i2++) {
            const e = new Pointer(i2, input, new Unexpected(input[i2], `is unexpected, expected: ${expectedIndexes}`));
            if (allErrors) {
              es.push([stepKey++, e]);
              continue;
            } else {
              return left2(new Composite2(ast, input, e, output));
            }
          }
        }
        let i = 0;
        let queue = void 0;
        for (; i < elements.length; i++) {
          if (len < i + 1) {
            if (ast.elements[i].isOptional) {
              continue;
            }
          } else {
            const parser = elements[i];
            const te = parser(input[i], options);
            if (isEither3(te)) {
              if (isLeft2(te)) {
                const e = new Pointer(i, input, te.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, sortByIndex(output)));
                }
              }
              output.push([stepKey++, te.right]);
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap9(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = new Pointer(index, input, t.left);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return _void;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                  }
                }
                output2.push([nk, t.right]);
                return _void;
              }));
            }
          }
        }
        if (isNonEmptyReadonlyArray(rest)) {
          const [head3, ...tail] = rest;
          for (; i < len - tail.length; i++) {
            const te = head3(input[i], options);
            if (isEither3(te)) {
              if (isLeft2(te)) {
                const e = new Pointer(i, input, te.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, sortByIndex(output)));
                }
              } else {
                output.push([stepKey++, te.right]);
              }
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap9(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = new Pointer(index, input, t.left);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return _void;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                  }
                } else {
                  output2.push([nk, t.right]);
                  return _void;
                }
              }));
            }
          }
          for (let j = 0; j < tail.length; j++) {
            i += j;
            if (len < i + 1) {
              continue;
            } else {
              const te = tail[j](input[i], options);
              if (isEither3(te)) {
                if (isLeft2(te)) {
                  const e = new Pointer(i, input, te.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output)));
                  }
                }
                output.push([stepKey++, te.right]);
              } else {
                const nk = stepKey++;
                const index = i;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap9(either3(te), (t) => {
                  if (isLeft2(t)) {
                    const e = new Pointer(index, input, t.left);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return _void;
                    } else {
                      return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                    }
                  }
                  output2.push([nk, t.right]);
                  return _void;
                }));
              }
            }
          }
        }
        const computeResult = /* @__PURE__ */ __name(({
          es: es2,
          output: output2
        }) => isNonEmptyArray2(es2) ? left2(new Composite2(ast, input, sortByIndex(es2), sortByIndex(output2))) : right2(sortByIndex(output2)), "computeResult");
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend3(() => {
            const state = {
              es: copy(es),
              output: copy(output)
            };
            return flatMap9(forEach7(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          output,
          es
        });
      };
    }
    case "TypeLiteral": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return fromRefinement(ast, isNotNullable);
      }
      const propertySignatures = [];
      const expectedKeysMap = {};
      const expectedKeys = [];
      for (const ps of ast.propertySignatures) {
        propertySignatures.push([goMemo(ps.type, isDecoding), ps]);
        expectedKeysMap[ps.name] = null;
        expectedKeys.push(ps.name);
      }
      const indexSignatures = ast.indexSignatures.map((is) => [goMemo(is.parameter, isDecoding), goMemo(is.type, isDecoding), is.parameter]);
      const expectedAST = Union.make(ast.indexSignatures.map((is) => is.parameter).concat(expectedKeys.map((key) => isSymbol(key) ? new UniqueSymbol(key) : new Literal(key))));
      const expected = goMemo(expectedAST, isDecoding);
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isRecord(input)) {
          return left2(new Type2(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const onExcessPropertyError = options?.onExcessProperty === "error";
        const onExcessPropertyPreserve = options?.onExcessProperty === "preserve";
        const output = {};
        let inputKeys;
        if (onExcessPropertyError || onExcessPropertyPreserve) {
          inputKeys = Reflect.ownKeys(input);
          for (const key of inputKeys) {
            const te = expected(key, options);
            if (isEither3(te) && isLeft2(te)) {
              if (onExcessPropertyError) {
                const e = new Pointer(key, input, new Unexpected(input[key], `is unexpected, expected: ${String(expectedAST)}`));
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, output));
                }
              } else {
                output[key] = input[key];
              }
            }
          }
        }
        let queue = void 0;
        const isExact = options?.exact === true;
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = propertySignatures[i][1];
          const name = ps.name;
          const hasKey = Object.prototype.hasOwnProperty.call(input, name);
          if (!hasKey) {
            if (ps.isOptional) {
              continue;
            } else if (isExact) {
              const e = new Pointer(name, input, new Missing(ps));
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left2(new Composite2(ast, input, e, output));
              }
            }
          }
          const parser = propertySignatures[i][0];
          const te = parser(input[name], options);
          if (isEither3(te)) {
            if (isLeft2(te)) {
              const e = new Pointer(name, input, hasKey ? te.left : new Missing(ps));
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left2(new Composite2(ast, input, e, output));
              }
            }
            output[name] = te.right;
          } else {
            const nk = stepKey++;
            const index = name;
            if (!queue) {
              queue = [];
            }
            queue.push(({
              es: es2,
              output: output2
            }) => flatMap9(either3(te), (t) => {
              if (isLeft2(t)) {
                const e = new Pointer(index, input, hasKey ? t.left : new Missing(ps));
                if (allErrors) {
                  es2.push([nk, e]);
                  return _void;
                } else {
                  return left2(new Composite2(ast, input, e, output2));
                }
              }
              output2[index] = t.right;
              return _void;
            }));
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const indexSignature = indexSignatures[i];
          const parameter = indexSignature[0];
          const type = indexSignature[1];
          const keys6 = getKeysForIndexSignature(input, indexSignature[2]);
          for (const key of keys6) {
            const keu = parameter(key, options);
            if (isEither3(keu) && isRight2(keu)) {
              const vpr = type(input[key], options);
              if (isEither3(vpr)) {
                if (isLeft2(vpr)) {
                  const e = new Pointer(key, input, vpr.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left2(new Composite2(ast, input, e, output));
                  }
                } else {
                  if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) {
                    output[key] = vpr.right;
                  }
                }
              } else {
                const nk = stepKey++;
                const index = key;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap9(either3(vpr), (tv) => {
                  if (isLeft2(tv)) {
                    const e = new Pointer(index, input, tv.left);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return _void;
                    } else {
                      return left2(new Composite2(ast, input, e, output2));
                    }
                  } else {
                    if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) {
                      output2[key] = tv.right;
                    }
                    return _void;
                  }
                }));
              }
            }
          }
        }
        const computeResult = /* @__PURE__ */ __name(({
          es: es2,
          output: output2
        }) => {
          if (isNonEmptyArray2(es2)) {
            return left2(new Composite2(ast, input, sortByIndex(es2), output2));
          }
          if (options?.propertyOrder === "original") {
            const keys6 = inputKeys || Reflect.ownKeys(input);
            for (const name of expectedKeys) {
              if (keys6.indexOf(name) === -1) {
                keys6.push(name);
              }
            }
            const out = {};
            for (const key of keys6) {
              if (Object.prototype.hasOwnProperty.call(output2, key)) {
                out[key] = output2[key];
              }
            }
            return right2(out);
          }
          return right2(output2);
        }, "computeResult");
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend3(() => {
            const state = {
              es: copy(es),
              output: Object.assign({}, output)
            };
            return flatMap9(forEach7(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          es,
          output
        });
      };
    }
    case "Union": {
      const searchTree = getSearchTree(ast.types, isDecoding);
      const ownKeys = Reflect.ownKeys(searchTree.keys);
      const ownKeysLen = ownKeys.length;
      const astTypesLen = ast.types.length;
      const map13 = /* @__PURE__ */ new Map();
      for (let i = 0; i < astTypesLen; i++) {
        map13.set(ast.types[i], goMemo(ast.types[i], isDecoding));
      }
      const concurrency = getConcurrency(ast) ?? 1;
      const batching = getBatching(ast);
      return (input, options) => {
        const es = [];
        let stepKey = 0;
        let candidates = [];
        if (ownKeysLen > 0) {
          if (isRecordOrArray(input)) {
            for (let i = 0; i < ownKeysLen; i++) {
              const name = ownKeys[i];
              const buckets = searchTree.keys[name].buckets;
              if (Object.prototype.hasOwnProperty.call(input, name)) {
                const literal = String(input[name]);
                if (Object.prototype.hasOwnProperty.call(buckets, literal)) {
                  candidates = candidates.concat(buckets[literal]);
                } else {
                  const {
                    candidates: candidates2,
                    literals
                  } = searchTree.keys[name];
                  const literalsUnion = Union.make(literals);
                  const errorAst = candidates2.length === astTypesLen ? new TypeLiteral([new PropertySignature(name, literalsUnion, false, true)], []) : Union.make(candidates2);
                  es.push([stepKey++, new Composite2(errorAst, input, new Pointer(name, input, new Type2(literalsUnion, input[name])))]);
                }
              } else {
                const {
                  candidates: candidates2,
                  literals
                } = searchTree.keys[name];
                const fakePropertySignature = new PropertySignature(name, Union.make(literals), false, true);
                const errorAst = candidates2.length === astTypesLen ? new TypeLiteral([fakePropertySignature], []) : Union.make(candidates2);
                es.push([stepKey++, new Composite2(errorAst, input, new Pointer(name, input, new Missing(fakePropertySignature)))]);
              }
            }
          } else {
            const errorAst = searchTree.candidates.length === astTypesLen ? ast : Union.make(searchTree.candidates);
            es.push([stepKey++, new Type2(errorAst, input)]);
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        let queue = void 0;
        for (let i = 0; i < candidates.length; i++) {
          const candidate = candidates[i];
          const pr = map13.get(candidate)(input, options);
          if (isEither3(pr) && (!queue || queue.length === 0)) {
            if (isRight2(pr)) {
              return pr;
            } else {
              es.push([stepKey++, pr.left]);
            }
          } else {
            const nk = stepKey++;
            if (!queue) {
              queue = [];
            }
            queue.push((state) => suspend3(() => {
              if ("finalResult" in state) {
                return _void;
              } else {
                return flatMap9(either3(pr), (t) => {
                  if (isRight2(t)) {
                    state.finalResult = t;
                  } else {
                    state.es.push([nk, t.left]);
                  }
                  return _void;
                });
              }
            }));
          }
        }
        const computeResult = /* @__PURE__ */ __name((es2) => isNonEmptyArray2(es2) ? es2.length === 1 && es2[0][1]._tag === "Type" ? left2(es2[0][1]) : left2(new Composite2(ast, input, sortByIndex(es2))) : (
          // this should never happen
          left2(new Type2(ast, input))
        ), "computeResult");
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend3(() => {
            const state = {
              es: copy(es)
            };
            return flatMap9(forEach7(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => {
              if ("finalResult" in state) {
                return state.finalResult;
              }
              return computeResult(state.es);
            });
          });
        }
        return computeResult(es);
      };
    }
    case "Suspend": {
      const get9 = memoizeThunk(() => goMemo(ast.f(), isDecoding));
      return (a, options) => get9()(a, options);
    }
  }
}, "go");
var fromRefinement = /* @__PURE__ */ __name((ast, refinement) => (u) => refinement(u) ? right2(u) : left2(new Type2(ast, u)), "fromRefinement");
var getLiterals = /* @__PURE__ */ __name((ast, isDecoding) => {
  switch (ast._tag) {
    case "Declaration": {
      const annotation = getSurrogateAnnotation(ast);
      if (isSome2(annotation)) {
        return getLiterals(annotation.value, isDecoding);
      }
      break;
    }
    case "TypeLiteral": {
      const out = [];
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const propertySignature = ast.propertySignatures[i];
        const type = isDecoding ? encodedAST(propertySignature.type) : typeAST(propertySignature.type);
        if (isLiteral(type) && !propertySignature.isOptional) {
          out.push([propertySignature.name, type]);
        }
      }
      return out;
    }
    case "TupleType": {
      const out = [];
      for (let i = 0; i < ast.elements.length; i++) {
        const element = ast.elements[i];
        const type = isDecoding ? encodedAST(element.type) : typeAST(element.type);
        if (isLiteral(type) && !element.isOptional) {
          out.push([i, type]);
        }
      }
      return out;
    }
    case "Refinement":
      return getLiterals(ast.from, isDecoding);
    case "Suspend":
      return getLiterals(ast.f(), isDecoding);
    case "Transformation":
      return getLiterals(isDecoding ? ast.from : ast.to, isDecoding);
  }
  return [];
}, "getLiterals");
var getSearchTree = /* @__PURE__ */ __name((members, isDecoding) => {
  const keys6 = {};
  const otherwise = [];
  const candidates = [];
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const tags = getLiterals(member, isDecoding);
    if (tags.length > 0) {
      candidates.push(member);
      for (let j = 0; j < tags.length; j++) {
        const [key, literal] = tags[j];
        const hash2 = String(literal.literal);
        keys6[key] = keys6[key] || {
          buckets: {},
          literals: [],
          candidates: []
        };
        const buckets = keys6[key].buckets;
        if (Object.prototype.hasOwnProperty.call(buckets, hash2)) {
          if (j < tags.length - 1) {
            continue;
          }
          buckets[hash2].push(member);
          keys6[key].literals.push(literal);
          keys6[key].candidates.push(member);
        } else {
          buckets[hash2] = [member];
          keys6[key].literals.push(literal);
          keys6[key].candidates.push(member);
          break;
        }
      }
    } else {
      otherwise.push(member);
    }
  }
  return {
    keys: keys6,
    otherwise,
    candidates
  };
}, "getSearchTree");
var dropRightRefinement = /* @__PURE__ */ __name((ast) => isRefinement(ast) ? dropRightRefinement(ast.from) : ast, "dropRightRefinement");
var handleForbidden = /* @__PURE__ */ __name((effect, ast, actual, options) => {
  if (options?.isEffectAllowed === true) {
    return effect;
  }
  if (isEither3(effect)) {
    return effect;
  }
  const scheduler = new SyncScheduler();
  const fiber = runFork2(effect, {
    scheduler
  });
  scheduler.flush();
  const exit3 = fiber.unsafePoll();
  if (exit3) {
    if (isSuccess(exit3)) {
      return right2(exit3.value);
    }
    const cause = exit3.cause;
    if (isFailType2(cause)) {
      return left2(cause.error);
    }
    return left2(new Forbidden(ast, actual, pretty2(cause)));
  }
  return left2(new Forbidden(ast, actual, "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"));
}, "handleForbidden");
var compare = /* @__PURE__ */ __name(([a], [b]) => a > b ? 1 : a < b ? -1 : 0, "compare");
function sortByIndex(es) {
  return es.sort(compare).map((t) => t[1]);
}
__name(sortByIndex, "sortByIndex");
var getFinalTransformation = /* @__PURE__ */ __name((transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
    case "ComposeTransformation":
      return right2;
    case "TypeLiteralTransformation":
      return (input) => {
        let out = right2(input);
        for (const pst of transformation.propertySignatureTransformations) {
          const [from, to] = isDecoding ? [pst.from, pst.to] : [pst.to, pst.from];
          const transformation2 = isDecoding ? pst.decode : pst.encode;
          const f = /* @__PURE__ */ __name((input2) => {
            const o2 = transformation2(Object.prototype.hasOwnProperty.call(input2, from) ? some2(input2[from]) : none2());
            delete input2[from];
            if (isSome2(o2)) {
              input2[to] = o2.value;
            }
            return input2;
          }, "f");
          out = map12(out, f);
        }
        return out;
      };
  }
}, "getFinalTransformation");
var makeTree = /* @__PURE__ */ __name((value, forest = []) => ({
  value,
  forest
}), "makeTree");
var TreeFormatter = {
  formatIssue: /* @__PURE__ */ __name((issue) => map12(formatTree(issue), drawTree), "formatIssue"),
  formatIssueSync: /* @__PURE__ */ __name((issue) => {
    const e = TreeFormatter.formatIssue(issue);
    return isEither3(e) ? getOrThrow(e) : runSync(e);
  }, "formatIssueSync"),
  formatError: /* @__PURE__ */ __name((error2) => TreeFormatter.formatIssue(error2.issue), "formatError"),
  formatErrorSync: /* @__PURE__ */ __name((error2) => TreeFormatter.formatIssueSync(error2.issue), "formatErrorSync")
};
var drawTree = /* @__PURE__ */ __name((tree) => tree.value + draw("\n", tree.forest), "drawTree");
var draw = /* @__PURE__ */ __name((indentation, forest) => {
  let r = "";
  const len = forest.length;
  let tree;
  for (let i = 0; i < len; i++) {
    tree = forest[i];
    const isLast = i === len - 1;
    r += indentation + (isLast ? "└" : "├") + "─ " + tree.value;
    r += draw(indentation + (len > 1 && !isLast ? "│  " : "   "), tree.forest);
  }
  return r;
}, "draw");
var formatTransformationKind = /* @__PURE__ */ __name((kind) => {
  switch (kind) {
    case "Encoded":
      return "Encoded side transformation failure";
    case "Transformation":
      return "Transformation process failure";
    case "Type":
      return "Type side transformation failure";
  }
}, "formatTransformationKind");
var formatRefinementKind = /* @__PURE__ */ __name((kind) => {
  switch (kind) {
    case "From":
      return "From side refinement failure";
    case "Predicate":
      return "Predicate refinement failure";
  }
}, "formatRefinementKind");
var getAnnotated = /* @__PURE__ */ __name((issue) => "ast" in issue ? some2(issue.ast) : none2(), "getAnnotated");
var Either_void = /* @__PURE__ */ right2(void 0);
var getCurrentMessage = /* @__PURE__ */ __name((issue) => getAnnotated(issue).pipe(flatMap(getMessageAnnotation), match2({
  onNone: /* @__PURE__ */ __name(() => Either_void, "onNone"),
  onSome: /* @__PURE__ */ __name((messageAnnotation) => {
    const union5 = messageAnnotation(issue);
    if (isString(union5)) {
      return right2({
        message: union5,
        override: false
      });
    }
    if (isEffect2(union5)) {
      return map11(union5, (message) => ({
        message,
        override: false
      }));
    }
    if (isString(union5.message)) {
      return right2({
        message: union5.message,
        override: union5.override
      });
    }
    return map11(union5.message, (message) => ({
      message,
      override: union5.override
    }));
  }, "onSome")
})), "getCurrentMessage");
var createParseIssueGuard = /* @__PURE__ */ __name((tag) => (issue) => issue._tag === tag, "createParseIssueGuard");
var isComposite2 = /* @__PURE__ */ createParseIssueGuard("Composite");
var isRefinement2 = /* @__PURE__ */ createParseIssueGuard("Refinement");
var isTransformation2 = /* @__PURE__ */ createParseIssueGuard("Transformation");
var getMessage = /* @__PURE__ */ __name((issue) => flatMap10(getCurrentMessage(issue), (currentMessage) => {
  if (currentMessage !== void 0) {
    const useInnerMessage = !currentMessage.override && (isComposite2(issue) || isRefinement2(issue) && issue.kind === "From" || isTransformation2(issue) && issue.kind !== "Transformation");
    return useInnerMessage ? isTransformation2(issue) || isRefinement2(issue) ? getMessage(issue.issue) : Either_void : right2(currentMessage.message);
  }
  return Either_void;
}), "getMessage");
var getParseIssueTitleAnnotation2 = /* @__PURE__ */ __name((issue) => getAnnotated(issue).pipe(flatMap(getParseIssueTitleAnnotation), flatMapNullable((annotation) => annotation(issue)), getOrUndefined), "getParseIssueTitleAnnotation");
function getRefinementExpected(ast) {
  return getDescriptionAnnotation(ast).pipe(orElse(() => getTitleAnnotation(ast)), orElse(() => getAutoTitleAnnotation(ast)), orElse(() => getIdentifierAnnotation(ast)), getOrElse(() => `{ ${ast.from} | filter }`));
}
__name(getRefinementExpected, "getRefinementExpected");
function getDefaultTypeMessage(issue) {
  if (issue.message !== void 0) {
    return issue.message;
  }
  const expected = isRefinement(issue.ast) ? getRefinementExpected(issue.ast) : String(issue.ast);
  return `Expected ${expected}, actual ${formatUnknown(issue.actual)}`;
}
__name(getDefaultTypeMessage, "getDefaultTypeMessage");
var formatTypeMessage = /* @__PURE__ */ __name((issue) => map12(getMessage(issue), (message) => message ?? getParseIssueTitleAnnotation2(issue) ?? getDefaultTypeMessage(issue)), "formatTypeMessage");
var getParseIssueTitle = /* @__PURE__ */ __name((issue) => getParseIssueTitleAnnotation2(issue) ?? String(issue.ast), "getParseIssueTitle");
var formatForbiddenMessage = /* @__PURE__ */ __name((issue) => issue.message ?? "is forbidden", "formatForbiddenMessage");
var formatUnexpectedMessage = /* @__PURE__ */ __name((issue) => issue.message ?? "is unexpected", "formatUnexpectedMessage");
var formatMissingMessage = /* @__PURE__ */ __name((issue) => {
  const missingMessageAnnotation = getMissingMessageAnnotation(issue.ast);
  if (isSome2(missingMessageAnnotation)) {
    const annotation = missingMessageAnnotation.value();
    return isString(annotation) ? right2(annotation) : annotation;
  }
  return right2(issue.message ?? "is missing");
}, "formatMissingMessage");
var formatTree = /* @__PURE__ */ __name((issue) => {
  switch (issue._tag) {
    case "Type":
      return map12(formatTypeMessage(issue), makeTree);
    case "Forbidden":
      return right2(makeTree(getParseIssueTitle(issue), [makeTree(formatForbiddenMessage(issue))]));
    case "Unexpected":
      return right2(makeTree(formatUnexpectedMessage(issue)));
    case "Missing":
      return map12(formatMissingMessage(issue), makeTree);
    case "Transformation":
      return flatMap10(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        return map12(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatTransformationKind(issue.kind), [tree])]));
      });
    case "Refinement":
      return flatMap10(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        return map12(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatRefinementKind(issue.kind), [tree])]));
      });
    case "Pointer":
      return map12(formatTree(issue.issue), (tree) => makeTree(formatPath(issue.path), [tree]));
    case "Composite":
      return flatMap10(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        const parseIssueTitle = getParseIssueTitle(issue);
        return isNonEmpty(issue.issues) ? map12(forEach7(issue.issues, formatTree), (forest) => makeTree(parseIssueTitle, forest)) : map12(formatTree(issue.issues), (tree) => makeTree(parseIssueTitle, [tree]));
      });
  }
}, "formatTree");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/effect/dist/esm/JSONSchema.js
var make30 = /* @__PURE__ */ __name((schema) => {
  const definitions = {};
  const ast = isTransformation(schema.ast) && isParseJsonTransformation(schema.ast.from) ? schema.ast.to : schema.ast;
  const jsonSchema = fromAST(ast, {
    definitions
  });
  const out = {
    $schema,
    $defs: {},
    ...jsonSchema
  };
  if (isEmptyRecord(definitions)) {
    delete out.$defs;
  } else {
    out.$defs = definitions;
  }
  return out;
}, "make");
var fromAST = /* @__PURE__ */ __name((ast, options) => {
  const definitionPath = options.definitionPath ?? "#/$defs/";
  const getRef = /* @__PURE__ */ __name((id) => definitionPath + id, "getRef");
  const target = options.target ?? "jsonSchema7";
  const topLevelReferenceStrategy = options.topLevelReferenceStrategy ?? "keep";
  const additionalPropertiesStrategy = options.additionalPropertiesStrategy ?? "strict";
  return go2(ast, options.definitions, "handle-identifier", [], {
    getRef,
    target,
    topLevelReferenceStrategy,
    additionalPropertiesStrategy
  }, "handle-annotation", "handle-errors");
}, "fromAST");
var constNever = {
  $id: "/schemas/never",
  not: {}
};
var constAny = {
  $id: "/schemas/any"
};
var constUnknown = {
  $id: "/schemas/unknown"
};
var constVoid2 = {
  $id: "/schemas/void"
};
var constObject = {
  $id: "/schemas/object",
  "anyOf": [{
    "type": "object"
  }, {
    "type": "array"
  }]
};
var constEmptyStruct = {
  $id: "/schemas/%7B%7D",
  "anyOf": [{
    "type": "object"
  }, {
    "type": "array"
  }]
};
var $schema = "http://json-schema.org/draft-07/schema#";
function getRawDescription(annotated) {
  if (annotated !== void 0) return getOrUndefined(getDescriptionAnnotation(annotated));
}
__name(getRawDescription, "getRawDescription");
function getRawTitle(annotated) {
  if (annotated !== void 0) return getOrUndefined(getTitleAnnotation(annotated));
}
__name(getRawTitle, "getRawTitle");
function getRawDefault(annotated) {
  if (annotated !== void 0) return getDefaultAnnotation(annotated);
  return none2();
}
__name(getRawDefault, "getRawDefault");
function encodeDefault(ast, def) {
  const getOption4 = getOption3(ast, false);
  return getOption4(def);
}
__name(encodeDefault, "encodeDefault");
function getRawExamples(annotated) {
  if (annotated !== void 0) return getOrUndefined(getExamplesAnnotation(annotated));
}
__name(getRawExamples, "getRawExamples");
function encodeExamples(ast, examples) {
  const getOption4 = getOption3(ast, false);
  const out = filterMap(examples, (e) => getOption4(e));
  return out.length > 0 ? out : void 0;
}
__name(encodeExamples, "encodeExamples");
function filterBuiltIn(ast, annotation, key) {
  if (annotation !== void 0) {
    switch (ast._tag) {
      case "StringKeyword":
        return annotation !== stringKeyword.annotations[key] ? annotation : void 0;
      case "NumberKeyword":
        return annotation !== numberKeyword.annotations[key] ? annotation : void 0;
      case "BooleanKeyword":
        return annotation !== booleanKeyword.annotations[key] ? annotation : void 0;
    }
  }
  return annotation;
}
__name(filterBuiltIn, "filterBuiltIn");
function pruneJsonSchemaAnnotations(ast, description, title, def, examples) {
  const out = {};
  if (description !== void 0) out.description = description;
  if (title !== void 0) out.title = title;
  if (isSome2(def)) {
    const o2 = encodeDefault(ast, def.value);
    if (isSome2(o2)) {
      out.default = o2.value;
    }
  }
  if (examples !== void 0) {
    const encodedExamples = encodeExamples(ast, examples);
    if (encodedExamples !== void 0) {
      out.examples = encodedExamples;
    }
  }
  if (Object.keys(out).length === 0) {
    return void 0;
  }
  return out;
}
__name(pruneJsonSchemaAnnotations, "pruneJsonSchemaAnnotations");
function getContextJsonSchemaAnnotations(ast, annotated) {
  return pruneJsonSchemaAnnotations(ast, getRawDescription(annotated), getRawTitle(annotated), getRawDefault(annotated), getRawExamples(annotated));
}
__name(getContextJsonSchemaAnnotations, "getContextJsonSchemaAnnotations");
function getJsonSchemaAnnotations(ast) {
  return pruneJsonSchemaAnnotations(ast, filterBuiltIn(ast, getRawDescription(ast), DescriptionAnnotationId), filterBuiltIn(ast, getRawTitle(ast), TitleAnnotationId), getRawDefault(ast), getRawExamples(ast));
}
__name(getJsonSchemaAnnotations, "getJsonSchemaAnnotations");
function mergeJsonSchemaAnnotations(jsonSchema, jsonSchemaAnnotations) {
  if (jsonSchemaAnnotations) {
    if ("$ref" in jsonSchema) {
      return {
        allOf: [jsonSchema],
        ...jsonSchemaAnnotations
      };
    }
    return {
      ...jsonSchema,
      ...jsonSchemaAnnotations
    };
  }
  return jsonSchema;
}
__name(mergeJsonSchemaAnnotations, "mergeJsonSchemaAnnotations");
var pruneUndefined2 = /* @__PURE__ */ __name((ast) => {
  if (isNone2(getJSONSchemaAnnotation(ast))) {
    return pruneUndefined(ast, pruneUndefined2, (ast2) => pruneUndefined2(ast2.from));
  }
}, "pruneUndefined");
var isParseJsonTransformation = /* @__PURE__ */ __name((ast) => ast.annotations[SchemaIdAnnotationId] === ParseJsonSchemaId, "isParseJsonTransformation");
var isOverrideAnnotation = /* @__PURE__ */ __name((ast, jsonSchema) => {
  if (isRefinement(ast)) {
    const schemaId = ast.annotations[SchemaIdAnnotationId];
    if (schemaId === IntSchemaId) {
      return "type" in jsonSchema && jsonSchema.type !== "integer";
    }
  }
  return "type" in jsonSchema || "oneOf" in jsonSchema || "anyOf" in jsonSchema || "$ref" in jsonSchema;
}, "isOverrideAnnotation");
var mergeRefinements = /* @__PURE__ */ __name((from, jsonSchema, ast) => {
  const out = {
    ...from,
    ...getJsonSchemaAnnotations(ast),
    ...jsonSchema
  };
  out.allOf ??= [];
  const handle = /* @__PURE__ */ __name((name, filter6) => {
    if (name in jsonSchema && name in from) {
      out.allOf.unshift({
        [name]: from[name]
      });
      out.allOf = out.allOf.filter(filter6);
    }
  }, "handle");
  handle("minLength", (i) => i.minLength > jsonSchema.minLength);
  handle("maxLength", (i) => i.maxLength < jsonSchema.maxLength);
  handle("pattern", (i) => i.pattern !== jsonSchema.pattern);
  handle("minItems", (i) => i.minItems > jsonSchema.minItems);
  handle("maxItems", (i) => i.maxItems < jsonSchema.maxItems);
  handle("minimum", (i) => i.minimum > jsonSchema.minimum);
  handle("maximum", (i) => i.maximum < jsonSchema.maximum);
  handle("exclusiveMinimum", (i) => i.exclusiveMinimum > jsonSchema.exclusiveMinimum);
  handle("exclusiveMaximum", (i) => i.exclusiveMaximum < jsonSchema.exclusiveMaximum);
  handle("multipleOf", (i) => i.multipleOf !== jsonSchema.multipleOf);
  if (out.allOf.length === 0) {
    delete out.allOf;
  }
  return out;
}, "mergeRefinements");
function isContentSchemaSupported(options) {
  switch (options.target) {
    case "jsonSchema7":
      return false;
    case "jsonSchema2019-09":
    case "openApi3.1":
      return true;
  }
}
__name(isContentSchemaSupported, "isContentSchemaSupported");
function getAdditionalProperties(options) {
  switch (options.additionalPropertiesStrategy) {
    case "allow":
      return true;
    case "strict":
      return false;
  }
}
__name(getAdditionalProperties, "getAdditionalProperties");
function addASTAnnotations(jsonSchema, ast) {
  return addAnnotations(jsonSchema, getJsonSchemaAnnotations(ast));
}
__name(addASTAnnotations, "addASTAnnotations");
function addAnnotations(jsonSchema, annotations2) {
  if (annotations2 === void 0 || Object.keys(annotations2).length === 0) {
    return jsonSchema;
  }
  if ("$ref" in jsonSchema) {
    return {
      allOf: [jsonSchema],
      ...annotations2
    };
  }
  return {
    ...jsonSchema,
    ...annotations2
  };
}
__name(addAnnotations, "addAnnotations");
function getIdentifierAnnotation2(ast) {
  const identifier2 = getOrUndefined(getJSONIdentifier(ast));
  if (identifier2 === void 0) {
    if (isSuspend(ast)) {
      return getIdentifierAnnotation2(ast.f());
    }
    if (isTransformation(ast) && isTypeLiteral(ast.from) && isDeclaration(ast.to)) {
      const to = ast.to;
      const surrogate = getSurrogateAnnotation(to);
      if (isSome2(surrogate)) {
        return getIdentifierAnnotation2(to);
      }
    }
  }
  return identifier2;
}
__name(getIdentifierAnnotation2, "getIdentifierAnnotation");
function go2(ast, $defs, identifier2, path, options, annotation, errors) {
  if (identifier2 === "handle-identifier" && (options.topLevelReferenceStrategy !== "skip" || isSuspend(ast))) {
    const id = getIdentifierAnnotation2(ast);
    if (id !== void 0) {
      const escapedId = id.replace(/~/ig, "~0").replace(/\//ig, "~1");
      const out = {
        $ref: options.getRef(escapedId)
      };
      if (!has($defs, id)) {
        $defs[id] = out;
        $defs[id] = go2(ast, $defs, "ignore-identifier", path, options, "handle-annotation", errors);
      }
      return out;
    }
  }
  if (annotation === "handle-annotation") {
    const hook = getJSONSchemaAnnotation(ast);
    if (isSome2(hook)) {
      const handler = hook.value;
      if (isOverrideAnnotation(ast, handler)) {
        switch (ast._tag) {
          case "Declaration":
            return addASTAnnotations(handler, ast);
          default:
            return handler;
        }
      } else {
        switch (ast._tag) {
          case "Refinement": {
            const t = getTransformationFrom(ast);
            if (t === void 0) {
              return mergeRefinements(go2(ast.from, $defs, identifier2, path, options, "handle-annotation", errors), handler, ast);
            } else {
              return go2(t, $defs, identifier2, path, options, "handle-annotation", errors);
            }
          }
          default:
            return {
              ...go2(ast, $defs, identifier2, path, options, "ignore-annotation", errors),
              ...handler
            };
        }
      }
    }
  }
  const surrogate = getSurrogateAnnotation(ast);
  if (isSome2(surrogate)) {
    return go2(surrogate.value, $defs, identifier2, path, options, "handle-annotation", errors);
  }
  switch (ast._tag) {
    // Unsupported
    case "Declaration":
    case "UndefinedKeyword":
    case "BigIntKeyword":
    case "UniqueSymbol":
    case "SymbolKeyword": {
      if (errors === "ignore-errors") return addASTAnnotations(constAny, ast);
      throw new Error(getJSONSchemaMissingAnnotationErrorMessage(path, ast));
    }
    case "Suspend": {
      if (identifier2 === "handle-identifier") {
        if (errors === "ignore-errors") return addASTAnnotations(constAny, ast);
        throw new Error(getJSONSchemaMissingIdentifierAnnotationErrorMessage(path, ast));
      }
      return go2(ast.f(), $defs, "ignore-identifier", path, options, "handle-annotation", errors);
    }
    // Primitives
    case "NeverKeyword":
      return addASTAnnotations(constNever, ast);
    case "VoidKeyword":
      return addASTAnnotations(constVoid2, ast);
    case "UnknownKeyword":
      return addASTAnnotations(constUnknown, ast);
    case "AnyKeyword":
      return addASTAnnotations(constAny, ast);
    case "ObjectKeyword":
      return addASTAnnotations(constObject, ast);
    case "StringKeyword":
      return addASTAnnotations({
        type: "string"
      }, ast);
    case "NumberKeyword":
      return addASTAnnotations({
        type: "number"
      }, ast);
    case "BooleanKeyword":
      return addASTAnnotations({
        type: "boolean"
      }, ast);
    case "Literal": {
      const literal = ast.literal;
      if (literal === null) {
        return addASTAnnotations({
          type: "null"
        }, ast);
      } else if (isString(literal)) {
        return addASTAnnotations({
          type: "string",
          enum: [literal]
        }, ast);
      } else if (isNumber(literal)) {
        return addASTAnnotations({
          type: "number",
          enum: [literal]
        }, ast);
      } else if (isBoolean(literal)) {
        return addASTAnnotations({
          type: "boolean",
          enum: [literal]
        }, ast);
      }
      if (errors === "ignore-errors") return addASTAnnotations(constAny, ast);
      throw new Error(getJSONSchemaMissingAnnotationErrorMessage(path, ast));
    }
    case "Enums": {
      const anyOf = ast.enums.map((e) => {
        const type = isNumber(e[1]) ? "number" : "string";
        return {
          type,
          title: e[0],
          enum: [e[1]]
        };
      });
      return anyOf.length >= 1 ? addASTAnnotations({
        $comment: "/schemas/enums",
        anyOf
      }, ast) : addASTAnnotations(constNever, ast);
    }
    case "TupleType": {
      const elements = ast.elements.map((e, i) => mergeJsonSchemaAnnotations(go2(e.type, $defs, "handle-identifier", path.concat(i), options, "handle-annotation", errors), getContextJsonSchemaAnnotations(e.type, e)));
      const rest = ast.rest.map((type) => mergeJsonSchemaAnnotations(go2(type.type, $defs, "handle-identifier", path, options, "handle-annotation", errors), getContextJsonSchemaAnnotations(type.type, type)));
      const output = {
        type: "array"
      };
      const len = ast.elements.length;
      if (len > 0) {
        output.minItems = len - ast.elements.filter((element) => element.isOptional).length;
        output.items = elements;
      }
      const restLength = rest.length;
      if (restLength > 0) {
        const head3 = rest[0];
        const isHomogeneous = restLength === 1 && ast.elements.every((e) => e.type === ast.rest[0].type);
        if (isHomogeneous) {
          output.items = head3;
        } else {
          output.additionalItems = head3;
        }
        if (restLength > 1) {
          if (errors === "ignore-errors") return addASTAnnotations(constAny, ast);
          throw new Error(getJSONSchemaUnsupportedPostRestElementsErrorMessage(path));
        }
      } else {
        if (len > 0) {
          output.additionalItems = false;
        } else {
          output.maxItems = 0;
        }
      }
      return addASTAnnotations(output, ast);
    }
    case "TypeLiteral": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return addASTAnnotations(constEmptyStruct, ast);
      }
      const output = {
        type: "object",
        required: [],
        properties: {},
        additionalProperties: getAdditionalProperties(options)
      };
      let patternProperties = void 0;
      let propertyNames = void 0;
      for (const is of ast.indexSignatures) {
        const pruned = pruneUndefined2(is.type) ?? is.type;
        const parameter = is.parameter;
        switch (parameter._tag) {
          case "StringKeyword": {
            output.additionalProperties = go2(pruned, $defs, "handle-identifier", path, options, "handle-annotation", errors);
            break;
          }
          case "TemplateLiteral": {
            patternProperties = go2(pruned, $defs, "handle-identifier", path, options, "handle-annotation", errors);
            propertyNames = {
              type: "string",
              pattern: getTemplateLiteralRegExp(parameter).source
            };
            break;
          }
          case "Refinement": {
            patternProperties = go2(pruned, $defs, "handle-identifier", path, options, "handle-annotation", errors);
            propertyNames = go2(parameter, $defs, "handle-identifier", path, options, "handle-annotation", errors);
            break;
          }
          case "SymbolKeyword": {
            const indexSignaturePath = path.concat("[symbol]");
            output.additionalProperties = go2(pruned, $defs, "handle-identifier", indexSignaturePath, options, "handle-annotation", errors);
            propertyNames = go2(parameter, $defs, "handle-identifier", indexSignaturePath, options, "handle-annotation", errors);
            break;
          }
        }
      }
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const ps = ast.propertySignatures[i];
        const name = ps.name;
        if (isString(name)) {
          const pruned = pruneUndefined2(ps.type);
          const type = pruned ?? ps.type;
          output.properties[name] = mergeJsonSchemaAnnotations(go2(type, $defs, "handle-identifier", path.concat(ps.name), options, "handle-annotation", errors), getContextJsonSchemaAnnotations(type, ps));
          if (!ps.isOptional && pruned === void 0) {
            output.required.push(name);
          }
        } else {
          if (errors === "ignore-errors") return addASTAnnotations(constAny, ast);
          throw new Error(getJSONSchemaUnsupportedKeyErrorMessage(name, path));
        }
      }
      if (patternProperties !== void 0) {
        delete output.additionalProperties;
        output.patternProperties = {
          "": patternProperties
        };
      }
      if (propertyNames !== void 0) {
        output.propertyNames = propertyNames;
      }
      return addASTAnnotations(output, ast);
    }
    case "Union": {
      const members = ast.types.map((t) => go2(t, $defs, "handle-identifier", path, options, "handle-annotation", errors));
      const anyOf = compactUnion(members);
      switch (anyOf.length) {
        case 0:
          return constNever;
        case 1:
          return addASTAnnotations(anyOf[0], ast);
        default:
          return addASTAnnotations({
            anyOf
          }, ast);
      }
    }
    case "Refinement":
      return go2(ast.from, $defs, identifier2, path, options, "handle-annotation", errors);
    case "TemplateLiteral": {
      const regex = getTemplateLiteralRegExp(ast);
      return addASTAnnotations({
        type: "string",
        title: String(ast),
        description: "a template literal",
        pattern: regex.source
      }, ast);
    }
    case "Transformation": {
      if (isParseJsonTransformation(ast.from)) {
        const out = {
          "type": "string",
          "contentMediaType": "application/json"
        };
        if (isContentSchemaSupported(options)) {
          out["contentSchema"] = go2(ast.to, $defs, identifier2, path, options, "handle-annotation", errors);
        }
        return out;
      }
      const from = go2(ast.from, $defs, identifier2, path, options, "handle-annotation", errors);
      if (ast.transformation._tag === "TypeLiteralTransformation" && isJsonSchema7Object(from)) {
        const to = go2(ast.to, {}, "ignore-identifier", path, options, "handle-annotation", "ignore-errors");
        if (isJsonSchema7Object(to)) {
          for (const t of ast.transformation.propertySignatureTransformations) {
            const toKey = t.to;
            const fromKey = t.from;
            if (isString(toKey) && isString(fromKey)) {
              const toProperty = to.properties[toKey];
              if (isRecord(toProperty)) {
                const fromProperty = from.properties[fromKey];
                if (isRecord(fromProperty)) {
                  const annotations2 = {};
                  if (isString(toProperty.title)) annotations2.title = toProperty.title;
                  if (isString(toProperty.description)) annotations2.description = toProperty.description;
                  if (Array.isArray(toProperty.examples)) annotations2.examples = toProperty.examples;
                  if (Object.hasOwn(toProperty, "default")) annotations2.default = toProperty.default;
                  from.properties[fromKey] = addAnnotations(fromProperty, annotations2);
                }
              }
            }
          }
        }
      }
      return addASTAnnotations(from, ast);
    }
  }
}
__name(go2, "go");
function isJsonSchema7Object(jsonSchema) {
  return isRecord(jsonSchema) && jsonSchema.type === "object" && isRecord(jsonSchema.properties);
}
__name(isJsonSchema7Object, "isJsonSchema7Object");
function isNeverWithoutCustomAnnotations(jsonSchema) {
  return jsonSchema === constNever || hasProperty(jsonSchema, "$id") && jsonSchema.$id === constNever.$id && Object.keys(jsonSchema).length === 3 && jsonSchema.title === neverKeyword.annotations[TitleAnnotationId];
}
__name(isNeverWithoutCustomAnnotations, "isNeverWithoutCustomAnnotations");
function isAny(jsonSchema) {
  return "$id" in jsonSchema && jsonSchema.$id === constAny.$id;
}
__name(isAny, "isAny");
function isUnknown(jsonSchema) {
  return "$id" in jsonSchema && jsonSchema.$id === constUnknown.$id;
}
__name(isUnknown, "isUnknown");
function isVoid(jsonSchema) {
  return "$id" in jsonSchema && jsonSchema.$id === constVoid2.$id;
}
__name(isVoid, "isVoid");
function isCompactableLiteral(jsonSchema) {
  return hasProperty(jsonSchema, "enum") && "type" in jsonSchema && Object.keys(jsonSchema).length === 2;
}
__name(isCompactableLiteral, "isCompactableLiteral");
function compactUnion(members) {
  const out = [];
  for (const m of members) {
    if (isNeverWithoutCustomAnnotations(m)) continue;
    if (isAny(m) || isUnknown(m) || isVoid(m)) return [m];
    if (isCompactableLiteral(m) && out.length > 0) {
      const last3 = out[out.length - 1];
      if (isCompactableLiteral(last3) && last3.type === m.type) {
        out[out.length - 1] = {
          type: last3.type,
          enum: [...last3.enum, ...m.enum]
        };
        continue;
      }
    }
    out.push(m);
  }
  return out;
}
__name(compactUnion, "compactUnion");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/schema-to-json/dist/esm/index.js
function schemaToJsonSchema(schema, options) {
  const parser = schema;
  if (typeof parser.toJsonSchema === "function") {
    try {
      const jsonSchema = parser.toJsonSchema();
      return {
        jsonSchema
      };
    } catch (error2) {
    }
  }
  if (isZodSchema(parser)) {
    const jsonSchema = convertZodSchema(parser, options);
    if (jsonSchema) {
      return {
        jsonSchema
      };
    }
  }
  if (parser[Symbol.for("TypeBox.Kind")] !== void 0) {
    return {
      jsonSchema: parser
    };
  }
  if (isYupSchema(parser)) {
    const jsonSchema = convertYupSchema(parser);
    if (jsonSchema) {
      return {
        jsonSchema
      };
    }
  }
  if (isEffectSchema(parser)) {
    const jsonSchema = convertEffectSchema(parser);
    if (jsonSchema) {
      return {
        jsonSchema
      };
    }
  }
  return void 0;
}
__name(schemaToJsonSchema, "schemaToJsonSchema");
function isZodSchema(schema) {
  return isZod3Schema(schema) || isZod4Schema(schema);
}
__name(isZodSchema, "isZodSchema");
function isZod3Schema(schema) {
  return "_def" in schema && "parse" in schema && "parseAsync" in schema && "safeParse" in schema;
}
__name(isZod3Schema, "isZod3Schema");
function isZod4Schema(schema) {
  return "_zod" in schema;
}
__name(isZod4Schema, "isZod4Schema");
function convertZodSchema(schema, options) {
  if (isZod4Schema(schema)) {
    return convertZod4Schema(schema, options);
  }
  if (isZod3Schema(schema)) {
    return convertZod3Schema(schema, options);
  }
  return void 0;
}
__name(convertZodSchema, "convertZodSchema");
function convertZod3Schema(schema, options) {
  const useReferences = options?.useReferences ?? false;
  return zodToJsonSchema(schema, {
    $refStrategy: useReferences ? "root" : "none"
  });
}
__name(convertZod3Schema, "convertZod3Schema");
function convertZod4Schema(schema, options) {
  const useReferences = options?.useReferences ?? false;
  return toJSONSchema(schema, {
    target: "draft-7",
    io: "output",
    reused: useReferences ? "ref" : "inline"
  });
}
__name(convertZod4Schema, "convertZod4Schema");
function isYupSchema(schema) {
  return "spec" in schema && "_typeCheck" in schema;
}
__name(isYupSchema, "isYupSchema");
function convertYupSchema(schema) {
  try {
    return (0, import_yup_to_json_schema.convertSchema)(schema);
  } catch {
    return void 0;
  }
}
__name(convertYupSchema, "convertYupSchema");
function isEffectSchema(schema) {
  return "ast" in schema && typeof schema.ast === "object" && typeof schema.ast._tag === "string";
}
__name(isEffectSchema, "isEffectSchema");
function convertEffectSchema(schema) {
  try {
    return JSONSchema_exports.make(schema);
  } catch {
    return void 0;
  }
}
__name(convertEffectSchema, "convertEffectSchema");

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/entryPoints/dev-index-worker.js
import_source_map_support.default.install({
  handleUncaughtExceptions: false,
  environment: "node",
  hookRequire: false
});
process.on("uncaughtException", function(error2, origin) {
  if (error2 instanceof Error) {
    process.send && process.send({
      type: "UNCAUGHT_EXCEPTION",
      payload: {
        error: { name: error2.name, message: error2.message, stack: error2.stack },
        origin
      },
      version: "v1"
    });
  } else {
    process.send && process.send({
      type: "UNCAUGHT_EXCEPTION",
      payload: {
        error: {
          name: "Error",
          message: typeof error2 === "string" ? error2 : JSON.stringify(error2)
        },
        origin
      },
      version: "v1"
    });
  }
});
resourceCatalog.setGlobalResourceCatalog(new StandardResourceCatalog());
async function importConfig(configPath) {
  const configModule = await import(normalizeImportPath(configPath));
  const config3 = configModule?.default ?? configModule?.config;
  return {
    config: config3,
    handleError: configModule?.handleError
  };
}
__name(importConfig, "importConfig");
async function loadBuildManifest() {
  const manifestContents = await readFile(o.TRIGGER_BUILD_MANIFEST_PATH, "utf-8");
  const raw = JSON.parse(manifestContents);
  return BuildManifest.parse(raw);
}
__name(loadBuildManifest, "loadBuildManifest");
async function bootstrap() {
  const buildManifest2 = await loadBuildManifest();
  const { config: config3 } = await importConfig(buildManifest2.configPath);
  const tracingSDK = new TracingSDK({
    url: o.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://0.0.0.0:4318",
    instrumentations: config3.instrumentations ?? [],
    diagLogLevel: o.OTEL_LOG_LEVEL ?? "none",
    forceFlushTimeoutMillis: 3e4
  });
  const { importErrors: importErrors2, timings: timings2 } = await registerResources(buildManifest2);
  return {
    tracingSDK,
    config: config3,
    buildManifest: buildManifest2,
    importErrors: importErrors2,
    timings: timings2
  };
}
__name(bootstrap, "bootstrap");
var { buildManifest, importErrors, config: config2, timings } = await bootstrap();
var tasks = await convertSchemasToJsonSchemas(resourceCatalog.listTaskManifests());
if (config2.retries?.default) {
  tasks = tasks.map((task) => {
    if (!task.retry) {
      return {
        ...task,
        retry: config2.retries?.default
      };
    }
    return task;
  });
}
if (typeof config2.maxDuration === "number") {
  tasks = tasks.map((task) => {
    if (typeof task.maxDuration !== "number") {
      return {
        ...task,
        maxDuration: config2.maxDuration
      };
    }
    return task;
  });
}
if (typeof config2.machine === "string") {
  tasks = tasks.map((task) => {
    if (typeof task.machine?.preset !== "string") {
      return {
        ...task,
        machine: {
          preset: config2.machine
        }
      };
    }
    return task;
  });
}
await sendMessageInCatalog(indexerToWorkerMessages, "INDEX_COMPLETE", {
  manifest: {
    tasks,
    queues: resourceCatalog.listQueueManifests(),
    configPath: buildManifest.configPath,
    runtime: buildManifest.runtime,
    runtimeVersion: detectRuntimeVersion(),
    workerEntryPoint: buildManifest.runWorkerEntryPoint,
    controllerEntryPoint: buildManifest.runControllerEntryPoint,
    loaderEntryPoint: buildManifest.loaderEntryPoint,
    customConditions: buildManifest.customConditions,
    initEntryPoint: buildManifest.initEntryPoint,
    timings
  },
  importErrors
}, async (msg) => {
  process.send?.(msg);
}).catch((err) => {
  if (err instanceof ZodSchemaParsedError) {
    return sendMessageInCatalog(indexerToWorkerMessages, "TASKS_FAILED_TO_PARSE", { zodIssues: err.error.issues, tasks }, async (msg) => {
      process.send?.(msg);
    });
  } else {
    console.error("Failed to send TASKS_READY message", err);
  }
  return;
});
await new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 10);
});
async function convertSchemasToJsonSchemas(tasks2) {
  const convertedTasks = tasks2.map((task) => {
    const schema = resourceCatalog.getTaskSchema(task.id);
    if (schema) {
      try {
        const result = schemaToJsonSchema(schema);
        return { ...task, payloadSchema: result?.jsonSchema };
      } catch {
        return task;
      }
    }
    return task;
  });
  return convertedTasks;
}
__name(convertSchemasToJsonSchemas, "convertSchemasToJsonSchemas");
//# sourceMappingURL=dev-index-worker.mjs.map
