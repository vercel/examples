import {
  task
} from "../../../../../../chunk-UVB5KPWO.mjs";
import "../../../../../../chunk-HCD45DYG.mjs";
import {
  __commonJS,
  __name,
  __require,
  __toESM,
  init_esm
} from "../../../../../../chunk-3R76H35D.mjs";

// node_modules/openapi-typescript-fetch/dist/cjs/types.js
var require_types = __commonJS({
  "node_modules/openapi-typescript-fetch/dist/cjs/types.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiError = void 0;
    var never = Symbol();
    var ApiError = class extends Error {
      static {
        __name(this, "ApiError");
      }
      constructor(response) {
        super(response.statusText);
        Object.defineProperty(this, "headers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "statusText", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.setPrototypeOf(this, new.target.prototype);
        this.headers = response.headers;
        this.url = response.url;
        this.status = response.status;
        this.statusText = response.statusText;
        this.data = response.data;
      }
    };
    exports.ApiError = ApiError;
  }
});

// node_modules/openapi-typescript-fetch/dist/cjs/fetcher.js
var require_fetcher = __commonJS({
  "node_modules/openapi-typescript-fetch/dist/cjs/fetcher.js"(exports) {
    "use strict";
    init_esm();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Fetcher = void 0;
    var types_1 = require_types();
    var sendBody = /* @__PURE__ */ __name((method) => method === "post" || method === "put" || method === "patch" || method === "delete", "sendBody");
    function queryString(params) {
      const qs = [];
      const encode = /* @__PURE__ */ __name((key, value) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`, "encode");
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value != null) {
          if (Array.isArray(value)) {
            value.forEach((value2) => qs.push(encode(key, value2)));
          } else {
            qs.push(encode(key, value));
          }
        }
      });
      if (qs.length > 0) {
        return `?${qs.join("&")}`;
      }
      return "";
    }
    __name(queryString, "queryString");
    function getPath(path, payload) {
      return path.replace(/\{([^}]+)\}/g, (_, key) => {
        const value = encodeURIComponent(payload[key]);
        delete payload[key];
        return value;
      });
    }
    __name(getPath, "getPath");
    function getQuery(method, payload, query) {
      let queryObj = {};
      if (sendBody(method)) {
        query.forEach((key) => {
          queryObj[key] = payload[key];
          delete payload[key];
        });
      } else {
        queryObj = Object.assign({}, payload);
      }
      return queryString(queryObj);
    }
    __name(getQuery, "getQuery");
    function getHeaders(body, init) {
      const headers = new Headers(init);
      if (body !== void 0 && !headers.has("Content-Type")) {
        headers.append("Content-Type", "application/json");
      }
      if (!headers.has("Accept")) {
        headers.append("Accept", "application/json");
      }
      return headers;
    }
    __name(getHeaders, "getHeaders");
    function getBody(method, payload) {
      const body = sendBody(method) ? JSON.stringify(payload) : void 0;
      return method === "delete" && body === "{}" ? void 0 : body;
    }
    __name(getBody, "getBody");
    function mergeRequestInit(first, second) {
      const headers = new Headers(first === null || first === void 0 ? void 0 : first.headers);
      const other = new Headers(second === null || second === void 0 ? void 0 : second.headers);
      for (const key of other.keys()) {
        const value = other.get(key);
        if (value != null) {
          headers.set(key, value);
        }
      }
      return Object.assign(Object.assign(Object.assign({}, first), second), { headers });
    }
    __name(mergeRequestInit, "mergeRequestInit");
    function getFetchParams(request) {
      var _a;
      const payload = Object.assign(Array.isArray(request.payload) ? [] : {}, request.payload);
      const path = getPath(request.path, payload);
      const query = getQuery(request.method, payload, request.queryParams);
      const body = getBody(request.method, payload);
      const headers = getHeaders(body, (_a = request.init) === null || _a === void 0 ? void 0 : _a.headers);
      const url = request.baseUrl + path + query;
      const init = Object.assign(Object.assign({}, request.init), {
        method: request.method.toUpperCase(),
        headers,
        body
      });
      return { url, init };
    }
    __name(getFetchParams, "getFetchParams");
    function getResponseData(response) {
      return __awaiter(this, void 0, void 0, function* () {
        const contentType = response.headers.get("content-type");
        if (response.status === 204) {
          return void 0;
        }
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return yield response.json();
        }
        const text = yield response.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          return text;
        }
      });
    }
    __name(getResponseData, "getResponseData");
    function fetchJson(url, init) {
      return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, init);
        const data = yield getResponseData(response);
        const result = {
          headers: response.headers,
          url: response.url,
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          data
        };
        if (result.ok) {
          return result;
        }
        throw new types_1.ApiError(result);
      });
    }
    __name(fetchJson, "fetchJson");
    function wrapMiddlewares(middlewares, fetch2) {
      const handler = /* @__PURE__ */ __name((index, url, init) => __awaiter(this, void 0, void 0, function* () {
        if (middlewares == null || index === middlewares.length) {
          return fetch2(url, init);
        }
        const current = middlewares[index];
        return yield current(url, init, (nextUrl, nextInit) => handler(index + 1, nextUrl, nextInit));
      }), "handler");
      return (url, init) => handler(0, url, init);
    }
    __name(wrapMiddlewares, "wrapMiddlewares");
    function fetchUrl(request) {
      return __awaiter(this, void 0, void 0, function* () {
        const { url, init } = getFetchParams(request);
        const response = yield request.fetch(url, init);
        return response;
      });
    }
    __name(fetchUrl, "fetchUrl");
    function createFetch(fetch2) {
      const fun = /* @__PURE__ */ __name((payload, init) => __awaiter(this, void 0, void 0, function* () {
        try {
          return yield fetch2(payload, init);
        } catch (err) {
          if (err instanceof types_1.ApiError) {
            throw new fun.Error(err);
          }
          throw err;
        }
      }), "fun");
      fun.Error = class extends types_1.ApiError {
        constructor(error) {
          super(error);
          Object.setPrototypeOf(this, new.target.prototype);
        }
        getActualType() {
          return {
            status: this.status,
            data: this.data
          };
        }
      };
      return fun;
    }
    __name(createFetch, "createFetch");
    function fetcher() {
      let baseUrl = "";
      let defaultInit = {};
      const middlewares = [];
      const fetch2 = wrapMiddlewares(middlewares, fetchJson);
      return {
        configure: /* @__PURE__ */ __name((config) => {
          baseUrl = config.baseUrl || "";
          defaultInit = config.init || {};
          middlewares.splice(0);
          middlewares.push(...config.use || []);
        }, "configure"),
        use: /* @__PURE__ */ __name((mw) => middlewares.push(mw), "use"),
        path: /* @__PURE__ */ __name((path) => ({
          method: /* @__PURE__ */ __name((method) => ({
            create: /* @__PURE__ */ __name((queryParams) => createFetch((payload, init) => fetchUrl({
              baseUrl: baseUrl || "",
              path,
              method,
              queryParams: Object.keys(queryParams || {}),
              payload,
              init: mergeRequestInit(defaultInit, init),
              fetch: fetch2
            })), "create")
          }), "method")
        }), "path")
      };
    }
    __name(fetcher, "fetcher");
    exports.Fetcher = {
      for: /* @__PURE__ */ __name(() => fetcher(), "for")
    };
  }
});

// node_modules/openapi-typescript-fetch/dist/cjs/utils.js
var require_utils = __commonJS({
  "node_modules/openapi-typescript-fetch/dist/cjs/utils.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arrayRequestBody = void 0;
    function arrayRequestBody(array, params) {
      return Object.assign([...array], params);
    }
    __name(arrayRequestBody, "arrayRequestBody");
    exports.arrayRequestBody = arrayRequestBody;
  }
});

// node_modules/openapi-typescript-fetch/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/openapi-typescript-fetch/dist/cjs/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arrayRequestBody = exports.ApiError = exports.Fetcher = void 0;
    var fetcher_1 = require_fetcher();
    Object.defineProperty(exports, "Fetcher", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return fetcher_1.Fetcher;
    }, "get") });
    var utils_1 = require_utils();
    Object.defineProperty(exports, "arrayRequestBody", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.arrayRequestBody;
    }, "get") });
    var types_1 = require_types();
    Object.defineProperty(exports, "ApiError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return types_1.ApiError;
    }, "get") });
  }
});

// node_modules/platform/platform.js
var require_platform = __commonJS({
  "node_modules/platform/platform.js"(exports, module) {
    init_esm();
    (function() {
      "use strict";
      var objectTypes = {
        "function": true,
        "object": true
      };
      var root = objectTypes[typeof window] && window || this;
      var oldRoot = root;
      var freeExports = objectTypes[typeof exports] && exports;
      var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
      var freeGlobal = freeExports && freeModule && typeof global == "object" && global;
      if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
      }
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var reOpera = /\bOpera/;
      var thisBinding = this;
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var toString = objectProto.toString;
      function capitalize(string) {
        string = String(string);
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      __name(capitalize, "capitalize");
      function cleanupOS(os, pattern, label) {
        var data = {
          "10.0": "10",
          "6.4": "10 Technical Preview",
          "6.3": "8.1",
          "6.2": "8",
          "6.1": "Server 2008 R2 / 7",
          "6.0": "Server 2008 / Vista",
          "5.2": "Server 2003 / XP 64-bit",
          "5.1": "XP",
          "5.01": "2000 SP1",
          "5.0": "2000",
          "4.0": "NT",
          "4.90": "ME"
        };
        if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
          os = "Windows " + data;
        }
        os = String(os);
        if (pattern && label) {
          os = os.replace(RegExp(pattern, "i"), label);
        }
        os = format(
          os.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0]
        );
        return os;
      }
      __name(cleanupOS, "cleanupOS");
      function each(object, callback) {
        var index = -1, length = object ? object.length : 0;
        if (typeof length == "number" && length > -1 && length <= maxSafeInteger) {
          while (++index < length) {
            callback(object[index], index, object);
          }
        } else {
          forOwn(object, callback);
        }
      }
      __name(each, "each");
      function format(string) {
        string = trim(string);
        return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
      }
      __name(format, "format");
      function forOwn(object, callback) {
        for (var key in object) {
          if (hasOwnProperty.call(object, key)) {
            callback(object[key], key, object);
          }
        }
      }
      __name(forOwn, "forOwn");
      function getClassOf(value) {
        return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
      }
      __name(getClassOf, "getClassOf");
      function isHostType(object, property) {
        var type = object != null ? typeof object[property] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == "object" ? !!object[property] : true);
      }
      __name(isHostType, "isHostType");
      function qualify(string) {
        return String(string).replace(/([ -])(?!$)/g, "$1?");
      }
      __name(qualify, "qualify");
      function reduce(array, callback) {
        var accumulator = null;
        each(array, function(value, index) {
          accumulator = callback(accumulator, value, index, array);
        });
        return accumulator;
      }
      __name(reduce, "reduce");
      function trim(string) {
        return String(string).replace(/^ +| +$/g, "");
      }
      __name(trim, "trim");
      function parse(ua) {
        var context = root;
        var isCustomContext = ua && typeof ua == "object" && getClassOf(ua) != "String";
        if (isCustomContext) {
          context = ua;
          ua = null;
        }
        var nav = context.navigator || {};
        var userAgent = nav.userAgent || "";
        ua || (ua = userAgent);
        var isModuleScope = isCustomContext || thisBinding == oldRoot;
        var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());
        var objectClass = "Object", airRuntimeClass = isCustomContext ? objectClass : "ScriptBridgingProxyObject", enviroClass = isCustomContext ? objectClass : "Environment", javaClass = isCustomContext && context.java ? "JavaPackage" : getClassOf(context.java), phantomClass = isCustomContext ? objectClass : "RuntimeObject";
        var java = /\bJava/.test(javaClass) && context.java;
        var rhino = java && getClassOf(context.environment) == enviroClass;
        var alpha = java ? "a" : "α";
        var beta = java ? "b" : "β";
        var doc = context.document || {};
        var opera = context.operamini || context.opera;
        var operaClass = reOpera.test(operaClass = isCustomContext && opera ? opera["[[Class]]"] : getClassOf(opera)) ? operaClass : opera = null;
        var data;
        var arch = ua;
        var description = [];
        var prerelease = null;
        var useFeatures = ua == userAgent;
        var version = useFeatures && opera && typeof opera.version == "function" && opera.version();
        var isSpecialCasedOS;
        var layout = getLayout([
          { "label": "EdgeHTML", "pattern": "Edge" },
          "Trident",
          { "label": "WebKit", "pattern": "AppleWebKit" },
          "iCab",
          "Presto",
          "NetFront",
          "Tasman",
          "KHTML",
          "Gecko"
        ]);
        var name = getName([
          "Adobe AIR",
          "Arora",
          "Avant Browser",
          "Breach",
          "Camino",
          "Electron",
          "Epiphany",
          "Fennec",
          "Flock",
          "Galeon",
          "GreenBrowser",
          "iCab",
          "Iceweasel",
          "K-Meleon",
          "Konqueror",
          "Lunascape",
          "Maxthon",
          { "label": "Microsoft Edge", "pattern": "(?:Edge|Edg|EdgA|EdgiOS)" },
          "Midori",
          "Nook Browser",
          "PaleMoon",
          "PhantomJS",
          "Raven",
          "Rekonq",
          "RockMelt",
          { "label": "Samsung Internet", "pattern": "SamsungBrowser" },
          "SeaMonkey",
          { "label": "Silk", "pattern": "(?:Cloud9|Silk-Accelerated)" },
          "Sleipnir",
          "SlimBrowser",
          { "label": "SRWare Iron", "pattern": "Iron" },
          "Sunrise",
          "Swiftfox",
          "Vivaldi",
          "Waterfox",
          "WebPositive",
          { "label": "Yandex Browser", "pattern": "YaBrowser" },
          { "label": "UC Browser", "pattern": "UCBrowser" },
          "Opera Mini",
          { "label": "Opera Mini", "pattern": "OPiOS" },
          "Opera",
          { "label": "Opera", "pattern": "OPR" },
          "Chromium",
          "Chrome",
          { "label": "Chrome", "pattern": "(?:HeadlessChrome)" },
          { "label": "Chrome Mobile", "pattern": "(?:CriOS|CrMo)" },
          { "label": "Firefox", "pattern": "(?:Firefox|Minefield)" },
          { "label": "Firefox for iOS", "pattern": "FxiOS" },
          { "label": "IE", "pattern": "IEMobile" },
          { "label": "IE", "pattern": "MSIE" },
          "Safari"
        ]);
        var product = getProduct([
          { "label": "BlackBerry", "pattern": "BB10" },
          "BlackBerry",
          { "label": "Galaxy S", "pattern": "GT-I9000" },
          { "label": "Galaxy S2", "pattern": "GT-I9100" },
          { "label": "Galaxy S3", "pattern": "GT-I9300" },
          { "label": "Galaxy S4", "pattern": "GT-I9500" },
          { "label": "Galaxy S5", "pattern": "SM-G900" },
          { "label": "Galaxy S6", "pattern": "SM-G920" },
          { "label": "Galaxy S6 Edge", "pattern": "SM-G925" },
          { "label": "Galaxy S7", "pattern": "SM-G930" },
          { "label": "Galaxy S7 Edge", "pattern": "SM-G935" },
          "Google TV",
          "Lumia",
          "iPad",
          "iPod",
          "iPhone",
          "Kindle",
          { "label": "Kindle Fire", "pattern": "(?:Cloud9|Silk-Accelerated)" },
          "Nexus",
          "Nook",
          "PlayBook",
          "PlayStation Vita",
          "PlayStation",
          "TouchPad",
          "Transformer",
          { "label": "Wii U", "pattern": "WiiU" },
          "Wii",
          "Xbox One",
          { "label": "Xbox 360", "pattern": "Xbox" },
          "Xoom"
        ]);
        var manufacturer = getManufacturer({
          "Apple": { "iPad": 1, "iPhone": 1, "iPod": 1 },
          "Alcatel": {},
          "Archos": {},
          "Amazon": { "Kindle": 1, "Kindle Fire": 1 },
          "Asus": { "Transformer": 1 },
          "Barnes & Noble": { "Nook": 1 },
          "BlackBerry": { "PlayBook": 1 },
          "Google": { "Google TV": 1, "Nexus": 1 },
          "HP": { "TouchPad": 1 },
          "HTC": {},
          "Huawei": {},
          "Lenovo": {},
          "LG": {},
          "Microsoft": { "Xbox": 1, "Xbox One": 1 },
          "Motorola": { "Xoom": 1 },
          "Nintendo": { "Wii U": 1, "Wii": 1 },
          "Nokia": { "Lumia": 1 },
          "Oppo": {},
          "Samsung": { "Galaxy S": 1, "Galaxy S2": 1, "Galaxy S3": 1, "Galaxy S4": 1 },
          "Sony": { "PlayStation": 1, "PlayStation Vita": 1 },
          "Xiaomi": { "Mi": 1, "Redmi": 1 }
        });
        var os = getOS([
          "Windows Phone",
          "KaiOS",
          "Android",
          "CentOS",
          { "label": "Chrome OS", "pattern": "CrOS" },
          "Debian",
          { "label": "DragonFly BSD", "pattern": "DragonFly" },
          "Fedora",
          "FreeBSD",
          "Gentoo",
          "Haiku",
          "Kubuntu",
          "Linux Mint",
          "OpenBSD",
          "Red Hat",
          "SuSE",
          "Ubuntu",
          "Xubuntu",
          "Cygwin",
          "Symbian OS",
          "hpwOS",
          "webOS ",
          "webOS",
          "Tablet OS",
          "Tizen",
          "Linux",
          "Mac OS X",
          "Macintosh",
          "Mac",
          "Windows 98;",
          "Windows "
        ]);
        function getLayout(guesses) {
          return reduce(guesses, function(result, guess) {
            return result || RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
          });
        }
        __name(getLayout, "getLayout");
        function getManufacturer(guesses) {
          return reduce(guesses, function(result, value, key) {
            return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp("\\b" + qualify(key) + "(?:\\b|\\w*\\d)", "i").exec(ua)) && key;
          });
        }
        __name(getManufacturer, "getManufacturer");
        function getName(guesses) {
          return reduce(guesses, function(result, guess) {
            return result || RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
          });
        }
        __name(getName, "getName");
        function getOS(guesses) {
          return reduce(guesses, function(result, guess) {
            var pattern = guess.pattern || qualify(guess);
            if (!result && (result = RegExp("\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(ua))) {
              result = cleanupOS(result, pattern, guess.label || guess);
            }
            return result;
          });
        }
        __name(getOS, "getOS");
        function getProduct(guesses) {
          return reduce(guesses, function(result, guess) {
            var pattern = guess.pattern || qualify(guess);
            if (!result && (result = RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(ua) || RegExp("\\b" + pattern + " *\\w+-[\\w]*", "i").exec(ua) || RegExp("\\b" + pattern + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(ua))) {
              if ((result = String(guess.label && !RegExp(pattern, "i").test(guess.label) ? guess.label : result).split("/"))[1] && !/[\d.]+/.test(result[0])) {
                result[0] += " " + result[1];
              }
              guess = guess.label || guess;
              result = format(result[0].replace(RegExp(pattern, "i"), guess).replace(RegExp("; *(?:" + guess + "[_-])?", "i"), " ").replace(RegExp("(" + guess + ")[-_.]?(\\w)", "i"), "$1 $2"));
            }
            return result;
          });
        }
        __name(getProduct, "getProduct");
        function getVersion(patterns) {
          return reduce(patterns, function(result, pattern) {
            return result || (RegExp(pattern + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(ua) || 0)[1] || null;
          });
        }
        __name(getVersion, "getVersion");
        function toStringPlatform() {
          return this.description || "";
        }
        __name(toStringPlatform, "toStringPlatform");
        layout && (layout = [layout]);
        if (/\bAndroid\b/.test(os) && !product && (data = /\bAndroid[^;]*;(.*?)(?:Build|\) AppleWebKit)\b/i.exec(ua))) {
          product = trim(data[1]).replace(/^[a-z]{2}-[a-z]{2};\s*/i, "") || null;
        }
        if (manufacturer && !product) {
          product = getProduct([manufacturer]);
        } else if (manufacturer && product) {
          product = product.replace(RegExp("^(" + qualify(manufacturer) + ")[-_.\\s]", "i"), manufacturer + " ").replace(RegExp("^(" + qualify(manufacturer) + ")[-_.]?(\\w)", "i"), manufacturer + " $2");
        }
        if (data = /\bGoogle TV\b/.exec(product)) {
          product = data[0];
        }
        if (/\bSimulator\b/i.test(ua)) {
          product = (product ? product + " " : "") + "Simulator";
        }
        if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
          description.push("running in Turbo/Uncompressed mode");
        }
        if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
          data = parse(ua.replace(/like iPhone OS/, ""));
          manufacturer = data.manufacturer;
          product = data.product;
        } else if (/^iP/.test(product)) {
          name || (name = "Safari");
          os = "iOS" + ((data = / OS ([\d_]+)/i.exec(ua)) ? " " + data[1].replace(/_/g, ".") : "");
        } else if (name == "Konqueror" && /^Linux\b/i.test(os)) {
          os = "Kubuntu";
        } else if (manufacturer && manufacturer != "Google" && (/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua) || /\bVita\b/.test(product)) || /\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua)) {
          name = "Android Browser";
          os = /\bAndroid\b/.test(os) ? os : "Android";
        } else if (name == "Silk") {
          if (!/\bMobi/i.test(ua)) {
            os = "Android";
            description.unshift("desktop mode");
          }
          if (/Accelerated *= *true/i.test(ua)) {
            description.unshift("accelerated");
          }
        } else if (name == "UC Browser" && /\bUCWEB\b/.test(ua)) {
          description.push("speed mode");
        } else if (name == "PaleMoon" && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
          description.push("identifying as Firefox " + data[1]);
        } else if (name == "Firefox" && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
          os || (os = "Firefox OS");
          product || (product = data[1]);
        } else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
          if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))) {
            name = null;
          }
          if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
            name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + " Browser";
          }
        } else if (name == "Electron" && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
          description.push("Chromium " + data);
        }
        if (!version) {
          version = getVersion([
            "(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|HeadlessChrome|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$)|UCBrowser|YaBrowser)",
            "Version",
            qualify(name),
            "(?:Firefox|Minefield|NetFront)"
          ]);
        }
        if (data = layout == "iCab" && parseFloat(version) > 3 && "WebKit" || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && "WebKit" || !layout && /\bMSIE\b/i.test(ua) && (os == "Mac OS" ? "Tasman" : "Trident") || layout == "WebKit" && /\bPlayStation\b(?! Vita\b)/i.test(name) && "NetFront") {
          layout = [data];
        }
        if (name == "IE" && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
          name += " Mobile";
          os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
          description.unshift("desktop mode");
        } else if (/\bWPDesktop\b/i.test(ua)) {
          name = "IE Mobile";
          os = "Windows Phone 8.x";
          description.unshift("desktop mode");
          version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
        } else if (name != "IE" && layout == "Trident" && (data = /\brv:([\d.]+)/.exec(ua))) {
          if (name) {
            description.push("identifying as " + name + (version ? " " + version : ""));
          }
          name = "IE";
          version = data[1];
        }
        if (useFeatures) {
          if (isHostType(context, "global")) {
            if (java) {
              data = java.lang.System;
              arch = data.getProperty("os.arch");
              os = os || data.getProperty("os.name") + " " + data.getProperty("os.version");
            }
            if (rhino) {
              try {
                version = context.require("ringo/engine").version.join(".");
                name = "RingoJS";
              } catch (e) {
                if ((data = context.system) && data.global.system == context.system) {
                  name = "Narwhal";
                  os || (os = data[0].os || null);
                }
              }
              if (!name) {
                name = "Rhino";
              }
            } else if (typeof context.process == "object" && !context.process.browser && (data = context.process)) {
              if (typeof data.versions == "object") {
                if (typeof data.versions.electron == "string") {
                  description.push("Node " + data.versions.node);
                  name = "Electron";
                  version = data.versions.electron;
                } else if (typeof data.versions.nw == "string") {
                  description.push("Chromium " + version, "Node " + data.versions.node);
                  name = "NW.js";
                  version = data.versions.nw;
                }
              }
              if (!name) {
                name = "Node.js";
                arch = data.arch;
                os = data.platform;
                version = /[\d.]+/.exec(data.version);
                version = version ? version[0] : null;
              }
            }
          } else if (getClassOf(data = context.runtime) == airRuntimeClass) {
            name = "Adobe AIR";
            os = data.flash.system.Capabilities.os;
          } else if (getClassOf(data = context.phantom) == phantomClass) {
            name = "PhantomJS";
            version = (data = data.version || null) && data.major + "." + data.minor + "." + data.patch;
          } else if (typeof doc.documentMode == "number" && (data = /\bTrident\/(\d+)/i.exec(ua))) {
            version = [version, doc.documentMode];
            if ((data = +data[1] + 4) != version[1]) {
              description.push("IE " + version[1] + " mode");
              layout && (layout[1] = "");
              version[1] = data;
            }
            version = name == "IE" ? String(version[1].toFixed(1)) : version[0];
          } else if (typeof doc.documentMode == "number" && /^(?:Chrome|Firefox)\b/.test(name)) {
            description.push("masking as " + name + " " + version);
            name = "IE";
            version = "11.0";
            layout = ["Trident"];
            os = "Windows";
          }
          os = os && format(os);
        }
        if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ";" + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && "a")) {
          prerelease = /b/i.test(data) ? "beta" : "alpha";
          version = version.replace(RegExp(data + "\\+?$"), "") + (prerelease == "beta" ? beta : alpha) + (/\d+\+?/.exec(data) || "");
        }
        if (name == "Fennec" || name == "Firefox" && /\b(?:Android|Firefox OS|KaiOS)\b/.test(os)) {
          name = "Firefox Mobile";
        } else if (name == "Maxthon" && version) {
          version = version.replace(/\.[\d.]+/, ".x");
        } else if (/\bXbox\b/i.test(product)) {
          if (product == "Xbox 360") {
            os = null;
          }
          if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
            description.unshift("mobile mode");
          }
        } else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == "Windows CE" || /Mobi/i.test(ua))) {
          name += " Mobile";
        } else if (name == "IE" && useFeatures) {
          try {
            if (context.external === null) {
              description.unshift("platform preview");
            }
          } catch (e) {
            description.unshift("embedded");
          }
        } else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(ua) || 0)[1] || version)) {
          data = [data, /BB10/.test(ua)];
          os = (data[1] ? (product = null, manufacturer = "BlackBerry") : "Device Software") + " " + data[0];
          version = null;
        } else if (this != forOwn && product != "Wii" && (useFeatures && opera || /Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua) || name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os) || name == "IE" && (os && !/^Win/.test(os) && version > 5.5 || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua))) && !reOpera.test(data = parse.call(forOwn, ua.replace(reOpera, "") + ";")) && data.name) {
          data = "ing as " + data.name + ((data = data.version) ? " " + data : "");
          if (reOpera.test(name)) {
            if (/\bIE\b/.test(data) && os == "Mac OS") {
              os = null;
            }
            data = "identify" + data;
          } else {
            data = "mask" + data;
            if (operaClass) {
              name = format(operaClass.replace(/([a-z])([A-Z])/g, "$1 $2"));
            } else {
              name = "Opera";
            }
            if (/\bIE\b/.test(data)) {
              os = null;
            }
            if (!useFeatures) {
              version = null;
            }
          }
          layout = ["Presto"];
          description.push(data);
        }
        if (data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1]) {
          data = [parseFloat(data.replace(/\.(\d)$/, ".0$1")), data];
          if (name == "Safari" && data[1].slice(-1) == "+") {
            name = "WebKit Nightly";
            prerelease = "alpha";
            version = data[1].slice(0, -1);
          } else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
            version = null;
          }
          data[1] = (/\b(?:Headless)?Chrome\/([\d.]+)/i.exec(ua) || 0)[1];
          if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == "WebKit") {
            layout = ["Blink"];
          }
          if (!useFeatures || !likeChrome && !data[1]) {
            layout && (layout[1] = "like Safari");
            data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? "4+" : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : data < 602 ? 9 : data < 604 ? 10 : data < 606 ? 11 : data < 608 ? 12 : "12");
          } else {
            layout && (layout[1] = "like Chrome");
            data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.1 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.3 ? 11 : data < 535.01 ? 12 : data < 535.02 ? "13+" : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.1 ? 19 : data < 537.01 ? 20 : data < 537.11 ? "21+" : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != "Blink" ? "27" : "28");
          }
          layout && (layout[1] += " " + (data += typeof data == "number" ? ".x" : /[.+]/.test(data) ? "" : "+"));
          if (name == "Safari" && (!version || parseInt(version) > 45)) {
            version = data;
          } else if (name == "Chrome" && /\bHeadlessChrome/i.test(ua)) {
            description.unshift("headless");
          }
        }
        if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
          name += " ";
          description.unshift("desktop mode");
          if (data == "zvav") {
            name += "Mini";
            version = null;
          } else {
            name += "Mobile";
          }
          os = os.replace(RegExp(" *" + data + "$"), "");
        } else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
          description.unshift("desktop mode");
          name = "Chrome Mobile";
          version = null;
          if (/\bOS X\b/.test(os)) {
            manufacturer = "Apple";
            os = "iOS 4.3+";
          } else {
            os = null;
          }
        } else if (/\bSRWare Iron\b/.test(name) && !version) {
          version = getVersion("Chrome");
        }
        if (version && version.indexOf(data = /[\d.]+$/.exec(os)) == 0 && ua.indexOf("/" + data + "-") > -1) {
          os = trim(os.replace(data, ""));
        }
        if (os && os.indexOf(name) != -1 && !RegExp(name + " OS").test(os)) {
          os = os.replace(RegExp(" *" + qualify(name) + " *"), "");
        }
        if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != "Safari" && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|SRWare Iron|Vivaldi|Web)/.test(name) && layout[1])) {
          (data = layout[layout.length - 1]) && description.push(data);
        }
        if (description.length) {
          description = ["(" + description.join("; ") + ")"];
        }
        if (manufacturer && product && product.indexOf(manufacturer) < 0) {
          description.push("on " + manufacturer);
        }
        if (product) {
          description.push((/^on /.test(description[description.length - 1]) ? "" : "on ") + product);
        }
        if (os) {
          data = / ([\d.+]+)$/.exec(os);
          isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == "/";
          os = {
            "architecture": 32,
            "family": data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
            "version": data ? data[1] : null,
            "toString": /* @__PURE__ */ __name(function() {
              var version2 = this.version;
              return this.family + (version2 && !isSpecialCasedOS ? " " + version2 : "") + (this.architecture == 64 ? " 64-bit" : "");
            }, "toString")
          };
        }
        if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
          if (os) {
            os.architecture = 64;
            os.family = os.family.replace(RegExp(" *" + data), "");
          }
          if (name && (/\bWOW64\b/i.test(ua) || useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua))) {
            description.unshift("32-bit");
          }
        } else if (os && /^OS X/.test(os.family) && name == "Chrome" && parseFloat(version) >= 39) {
          os.architecture = 64;
        }
        ua || (ua = null);
        var platform2 = {};
        platform2.description = ua;
        platform2.layout = layout && layout[0];
        platform2.manufacturer = manufacturer;
        platform2.name = name;
        platform2.prerelease = prerelease;
        platform2.product = product;
        platform2.ua = ua;
        platform2.version = name && version;
        platform2.os = os || {
          /**
           * The CPU architecture the OS is built for.
           *
           * @memberOf platform.os
           * @type number|null
           */
          "architecture": null,
          /**
           * The family of the OS.
           *
           * Common values include:
           * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
           * "Windows XP", "OS X", "Linux", "Ubuntu", "Debian", "Fedora", "Red Hat",
           * "SuSE", "Android", "iOS" and "Windows Phone"
           *
           * @memberOf platform.os
           * @type string|null
           */
          "family": null,
          /**
           * The version of the OS.
           *
           * @memberOf platform.os
           * @type string|null
           */
          "version": null,
          /**
           * Returns the OS string.
           *
           * @memberOf platform.os
           * @returns {string} The OS string.
           */
          "toString": /* @__PURE__ */ __name(function() {
            return "null";
          }, "toString")
        };
        platform2.parse = parse;
        platform2.toString = toStringPlatform;
        if (platform2.version) {
          description.unshift(version);
        }
        if (platform2.name) {
          description.unshift(name);
        }
        if (os && name && !(os == String(os).split(" ")[0] && (os == name.split(" ")[0] || product))) {
          description.push(product ? "(" + os + ")" : "on " + os);
        }
        if (description.length) {
          platform2.description = description.join(" ");
        }
        return platform2;
      }
      __name(parse, "parse");
      var platform = parse();
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        root.platform = platform;
        define(function() {
          return platform;
        });
      } else if (freeExports && freeModule) {
        forOwn(platform, function(value, key) {
          freeExports[key] = value;
        });
      } else {
        root.platform = platform;
      }
    }).call(exports);
  }
});

// node_modules/normalize-path/index.js
var require_normalize_path = __commonJS({
  "node_modules/normalize-path/index.js"(exports, module) {
    init_esm();
    module.exports = function(path, stripTrailing) {
      if (typeof path !== "string") {
        throw new TypeError("expected path to be a string");
      }
      if (path === "\\" || path === "/") return "/";
      var len = path.length;
      if (len <= 1) return path;
      var prefix = "";
      if (len > 4 && path[3] === "\\") {
        var ch = path[2];
        if ((ch === "?" || ch === ".") && path.slice(0, 2) === "\\\\") {
          path = path.slice(2);
          prefix = "//";
        }
      }
      var segs = path.split(/[/\\]+/);
      if (stripTrailing !== false && segs[segs.length - 1] === "") {
        segs.pop();
      }
      return prefix + segs.join("/");
    };
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    init_esm();
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: /* @__PURE__ */ __name(() => {
      }, "NOOP")
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    init_esm();
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    __name(concat, "concat");
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    __name(_mask, "_mask");
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    __name(_unmask, "_unmask");
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    __name(toArrayBuffer, "toArrayBuffer");
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    __name(toBuffer, "toBuffer");
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    init_esm();
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      static {
        __name(this, "Limiter");
      }
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    init_esm();
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      static {
        __name(this, "PerMessageDeflate");
      }
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    __name(deflateOnData, "deflateOnData");
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    __name(inflateOnData, "inflateOnData");
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
    __name(inflateOnError, "inflateOnError");
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    init_esm();
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    __name(isValidStatusCode, "isValidStatusCode");
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    __name(_isValidUTF8, "_isValidUTF8");
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    __name(isBlob, "isBlob");
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    init_esm();
    var { Writable } = __require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver = class extends Writable {
      static {
        __name(this, "Receiver");
      }
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    init_esm();
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender = class _Sender {
      static {
        __name(this, "Sender");
      }
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    __name(callCallbacks, "callCallbacks");
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
    __name(onError, "onError");
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    init_esm();
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      static {
        __name(this, "Event");
      }
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      static {
        __name(this, "CloseEvent");
      }
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      static {
        __name(this, "ErrorEvent");
      }
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      static {
        __name(this, "MessageEvent");
      }
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = /* @__PURE__ */ __name(function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onMessage");
        } else if (type === "close") {
          wrapper = /* @__PURE__ */ __name(function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onClose");
        } else if (type === "error") {
          wrapper = /* @__PURE__ */ __name(function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onError");
        } else if (type === "open") {
          wrapper = /* @__PURE__ */ __name(function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onOpen");
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
    __name(callListener, "callListener");
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    init_esm();
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    __name(push, "push");
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    __name(parse, "parse");
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    __name(format, "format");
    module.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    init_esm();
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL } = __require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver = require_receiver();
    var Sender = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket = class _WebSocket extends EventEmitter {
      static {
        __name(this, "WebSocket");
      }
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket.prototype.addEventListener = addEventListener;
    WebSocket.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    __name(initAsClient, "initAsClient");
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    __name(emitErrorAndClose, "emitErrorAndClose");
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    __name(netConnect, "netConnect");
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    __name(tlsConnect, "tlsConnect");
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    __name(abortHandshake, "abortHandshake");
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    __name(sendAfterClose, "sendAfterClose");
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    __name(receiverOnConclude, "receiverOnConclude");
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    __name(receiverOnDrain, "receiverOnDrain");
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    __name(receiverOnError, "receiverOnError");
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    __name(receiverOnFinish, "receiverOnFinish");
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    __name(receiverOnMessage, "receiverOnMessage");
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    __name(receiverOnPing, "receiverOnPing");
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    __name(receiverOnPong, "receiverOnPong");
    function resume(stream) {
      stream.resume();
    }
    __name(resume, "resume");
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket.CLOSED) return;
      if (websocket.readyState === WebSocket.OPEN) {
        websocket._readyState = WebSocket.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    __name(senderOnError, "senderOnError");
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    __name(setCloseTimer, "setCloseTimer");
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    __name(socketOnClose, "socketOnClose");
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    __name(socketOnData, "socketOnData");
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    __name(socketOnEnd, "socketOnEnd");
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket.CLOSING;
        this.destroy();
      }
    }
    __name(socketOnError, "socketOnError");
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    init_esm();
    var WebSocket = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    __name(emitClose, "emitClose");
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    __name(duplexOnEnd, "duplexOnEnd");
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    __name(duplexOnError, "duplexOnError");
    function createWebSocketStream(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", /* @__PURE__ */ __name(function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      }, "message"));
      ws.once("error", /* @__PURE__ */ __name(function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      }, "error"));
      ws.once("close", /* @__PURE__ */ __name(function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      }, "close"));
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", /* @__PURE__ */ __name(function error(err2) {
          called = true;
          callback(err2);
        }, "error"));
        ws.once("close", /* @__PURE__ */ __name(function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        }, "close"));
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", /* @__PURE__ */ __name(function open() {
            duplex._final(callback);
          }, "open"));
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", /* @__PURE__ */ __name(function finish() {
            callback();
          }, "finish"));
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", /* @__PURE__ */ __name(function open() {
            duplex._write(chunk, encoding, callback);
          }, "open"));
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    __name(createWebSocketStream, "createWebSocketStream");
    module.exports = createWebSocketStream;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    init_esm();
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    __name(parse, "parse");
    module.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    init_esm();
    var EventEmitter = __require("events");
    var http = __require("http");
    var { Duplex } = __require("stream");
    var { createHash } = __require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer = class extends EventEmitter {
      static {
        __name(this, "WebSocketServer");
      }
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: /* @__PURE__ */ __name((req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }, "upgrade")
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return /* @__PURE__ */ __name(function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      }, "removeListeners");
    }
    __name(addListeners, "addListeners");
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    __name(emitClose, "emitClose");
    function socketOnError() {
      this.destroy();
    }
    __name(socketOnError, "socketOnError");
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    __name(abortHandshake, "abortHandshake");
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
    __name(abortHandshakeOrEmitwsClientError, "abortHandshakeOrEmitwsClientError");
  }
});

// node_modules/ws/index.js
var require_ws = __commonJS({
  "node_modules/ws/index.js"(exports, module) {
    "use strict";
    init_esm();
    var WebSocket = require_websocket();
    WebSocket.createWebSocketStream = require_stream();
    WebSocket.Server = require_websocket_server();
    WebSocket.Receiver = require_receiver();
    WebSocket.Sender = require_sender();
    WebSocket.WebSocket = WebSocket;
    WebSocket.WebSocketServer = WebSocket.Server;
    module.exports = WebSocket;
  }
});

// node_modules/isomorphic-ws/node.js
var require_node = __commonJS({
  "node_modules/isomorphic-ws/node.js"(exports, module) {
    "use strict";
    init_esm();
    module.exports = require_ws();
  }
});

// node_modules/path-browserify/index.js
var require_path_browserify = __commonJS({
  "node_modules/path-browserify/index.js"(exports, module) {
    "use strict";
    init_esm();
    function assertPath(path) {
      if (typeof path !== "string") {
        throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
      }
    }
    __name(assertPath, "assertPath");
    function normalizeStringPosix(path, allowAboveRoot) {
      var res = "";
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var code;
      for (var i = 0; i <= path.length; ++i) {
        if (i < path.length)
          code = path.charCodeAt(i);
        else if (code === 47)
          break;
        else
          code = 47;
        if (code === 47) {
          if (lastSlash === i - 1 || dots === 1) {
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf("/");
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = "";
                    lastSegmentLength = 0;
                  } else {
                    res = res.slice(0, lastSlashIndex);
                    lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                  }
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0)
                res += "/..";
              else
                res = "..";
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0)
              res += "/" + path.slice(lastSlash + 1, i);
            else
              res = path.slice(lastSlash + 1, i);
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === 46 && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    __name(normalizeStringPosix, "normalizeStringPosix");
    function _format(sep, pathObject) {
      var dir = pathObject.dir || pathObject.root;
      var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    __name(_format, "_format");
    var posix = {
      // path.resolve([from ...], to)
      resolve: /* @__PURE__ */ __name(function resolve() {
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path;
          if (i >= 0)
            path = arguments[i];
          else {
            if (cwd === void 0)
              cwd = process.cwd();
            path = cwd;
          }
          assertPath(path);
          if (path.length === 0) {
            continue;
          }
          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = path.charCodeAt(0) === 47;
        }
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0)
            return "/" + resolvedPath;
          else
            return "/";
        } else if (resolvedPath.length > 0) {
          return resolvedPath;
        } else {
          return ".";
        }
      }, "resolve"),
      normalize: /* @__PURE__ */ __name(function normalize(path) {
        assertPath(path);
        if (path.length === 0) return ".";
        var isAbsolute = path.charCodeAt(0) === 47;
        var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
        path = normalizeStringPosix(path, !isAbsolute);
        if (path.length === 0 && !isAbsolute) path = ".";
        if (path.length > 0 && trailingSeparator) path += "/";
        if (isAbsolute) return "/" + path;
        return path;
      }, "normalize"),
      isAbsolute: /* @__PURE__ */ __name(function isAbsolute(path) {
        assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === 47;
      }, "isAbsolute"),
      join: /* @__PURE__ */ __name(function join() {
        if (arguments.length === 0)
          return ".";
        var joined;
        for (var i = 0; i < arguments.length; ++i) {
          var arg = arguments[i];
          assertPath(arg);
          if (arg.length > 0) {
            if (joined === void 0)
              joined = arg;
            else
              joined += "/" + arg;
          }
        }
        if (joined === void 0)
          return ".";
        return posix.normalize(joined);
      }, "join"),
      relative: /* @__PURE__ */ __name(function relative(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to) return "";
        from = posix.resolve(from);
        to = posix.resolve(to);
        if (from === to) return "";
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
          if (from.charCodeAt(fromStart) !== 47)
            break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        var toStart = 1;
        for (; toStart < to.length; ++toStart) {
          if (to.charCodeAt(toStart) !== 47)
            break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
          if (i === length) {
            if (toLen > length) {
              if (to.charCodeAt(toStart + i) === 47) {
                return to.slice(toStart + i + 1);
              } else if (i === 0) {
                return to.slice(toStart + i);
              }
            } else if (fromLen > length) {
              if (from.charCodeAt(fromStart + i) === 47) {
                lastCommonSep = i;
              } else if (i === 0) {
                lastCommonSep = 0;
              }
            }
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i);
          var toCode = to.charCodeAt(toStart + i);
          if (fromCode !== toCode)
            break;
          else if (fromCode === 47)
            lastCommonSep = i;
        }
        var out = "";
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
          if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0)
              out += "..";
            else
              out += "/..";
          }
        }
        if (out.length > 0)
          return out + to.slice(toStart + lastCommonSep);
        else {
          toStart += lastCommonSep;
          if (to.charCodeAt(toStart) === 47)
            ++toStart;
          return to.slice(toStart);
        }
      }, "relative"),
      _makeLong: /* @__PURE__ */ __name(function _makeLong(path) {
        return path;
      }, "_makeLong"),
      dirname: /* @__PURE__ */ __name(function dirname(path) {
        assertPath(path);
        if (path.length === 0) return ".";
        var code = path.charCodeAt(0);
        var hasRoot = code === 47;
        var end = -1;
        var matchedSlash = true;
        for (var i = path.length - 1; i >= 1; --i) {
          code = path.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              end = i;
              break;
            }
          } else {
            matchedSlash = false;
          }
        }
        if (end === -1) return hasRoot ? "/" : ".";
        if (hasRoot && end === 1) return "//";
        return path.slice(0, end);
      }, "dirname"),
      basename: /* @__PURE__ */ __name(function basename(path, ext) {
        if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
        assertPath(path);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
          if (ext.length === path.length && ext === path) return "";
          var extIdx = ext.length - 1;
          var firstNonSlashEnd = -1;
          for (i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else {
              if (firstNonSlashEnd === -1) {
                matchedSlash = false;
                firstNonSlashEnd = i + 1;
              }
              if (extIdx >= 0) {
                if (code === ext.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    end = i;
                  }
                } else {
                  extIdx = -1;
                  end = firstNonSlashEnd;
                }
              }
            }
          }
          if (start === end) end = firstNonSlashEnd;
          else if (end === -1) end = path.length;
          return path.slice(start, end);
        } else {
          for (i = path.length - 1; i >= 0; --i) {
            if (path.charCodeAt(i) === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
          }
          if (end === -1) return "";
          return path.slice(start, end);
        }
      }, "basename"),
      extname: /* @__PURE__ */ __name(function extname(path) {
        assertPath(path);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var preDotState = 0;
        for (var i = path.length - 1; i >= 0; --i) {
          var code = path.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46) {
            if (startDot === -1)
              startDot = i;
            else if (preDotState !== 1)
              preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          return "";
        }
        return path.slice(startDot, end);
      }, "extname"),
      format: /* @__PURE__ */ __name(function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format("/", pathObject);
      }, "format"),
      parse: /* @__PURE__ */ __name(function parse(path) {
        assertPath(path);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path.length === 0) return ret;
        var code = path.charCodeAt(0);
        var isAbsolute = code === 47;
        var start;
        if (isAbsolute) {
          ret.root = "/";
          start = 1;
        } else {
          start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
        var preDotState = 0;
        for (; i >= start; --i) {
          code = path.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
            else ret.base = ret.name = path.slice(startPart, end);
          }
        } else {
          if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
          } else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
          }
          ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute) ret.dir = "/";
        return ret;
      }, "parse"),
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null
    };
    posix.posix = posix;
    module.exports = posix;
  }
});

// node_modules/@e2b/sdk/dist/index.js
var require_dist = __commonJS({
  "node_modules/@e2b/sdk/dist/index.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __reflectGet = Reflect.get;
    var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
    var __spreadValues = /* @__PURE__ */ __name((a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    }, "__spreadValues");
    var __spreadProps = /* @__PURE__ */ __name((a, b) => __defProps(a, __getOwnPropDescs(b)), "__spreadProps");
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM2 = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var __superGet = /* @__PURE__ */ __name((cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj), "__superGet");
    var __async = /* @__PURE__ */ __name((__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = /* @__PURE__ */ __name((value) => {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }, "fulfilled");
        var rejected = /* @__PURE__ */ __name((value) => {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        }, "rejected");
        var step = /* @__PURE__ */ __name((x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected), "step");
        step((generator = generator.apply(__this, __arguments)).next());
      });
    }, "__async");
    var src_exports = {};
    __export(src_exports, {
      API_HOST: /* @__PURE__ */ __name(() => API_HOST, "API_HOST"),
      Artifact: /* @__PURE__ */ __name(() => Artifact, "Artifact"),
      CodeInterpreter: /* @__PURE__ */ __name(() => DataAnalysis, "CodeInterpreter"),
      CodeRuntime: /* @__PURE__ */ __name(() => CodeRuntime, "CodeRuntime"),
      DataAnalysis: /* @__PURE__ */ __name(() => DataAnalysis, "DataAnalysis"),
      FilesystemOperation: /* @__PURE__ */ __name(() => FilesystemOperation, "FilesystemOperation"),
      FilesystemWatcher: /* @__PURE__ */ __name(() => filesystemWatcher_default, "FilesystemWatcher"),
      Process: /* @__PURE__ */ __name(() => Process, "Process"),
      ProcessMessage: /* @__PURE__ */ __name(() => ProcessMessage, "ProcessMessage"),
      ProcessOutput: /* @__PURE__ */ __name(() => ProcessOutput, "ProcessOutput"),
      SANDBOX_DOMAIN: /* @__PURE__ */ __name(() => SANDBOX_DOMAIN, "SANDBOX_DOMAIN"),
      Sandbox: /* @__PURE__ */ __name(() => Sandbox2, "Sandbox"),
      Terminal: /* @__PURE__ */ __name(() => Terminal, "Terminal"),
      TerminalOutput: /* @__PURE__ */ __name(() => TerminalOutput, "TerminalOutput"),
      api: /* @__PURE__ */ __name(() => api_default, "api"),
      default: /* @__PURE__ */ __name(() => src_default, "default"),
      runCode: /* @__PURE__ */ __name(() => runCode, "runCode"),
      withAPIKey: /* @__PURE__ */ __name(() => withAPIKey, "withAPIKey"),
      withAccessToken: /* @__PURE__ */ __name(() => withAccessToken, "withAccessToken")
    });
    module.exports = __toCommonJS(src_exports);
    var fetcher = __toESM2(require_cjs());
    var SANDBOX_REFRESH_PERIOD = 5e3;
    var WS_RECONNECT_INTERVAL = 150;
    var TIMEOUT = 6e4;
    var _a;
    var DEBUG = (_a = process == null ? void 0 : process.env) == null ? void 0 : _a.E2B_DEBUG;
    var _a2;
    var DOMAIN = ((_a2 = process == null ? void 0 : process.env) == null ? void 0 : _a2.E2B_DOMAIN) || "e2b.dev";
    var _a3;
    var SECURE = (((_a3 = process == null ? void 0 : process.env) == null ? void 0 : _a3.E2B_SECURE) || "true").toLowerCase() === "true";
    var API_DOMAIN = DEBUG ? "localhost:3000" : `api.${DOMAIN}`;
    var API_HOST = `${SECURE && !DEBUG ? "https" : "http"}://${API_DOMAIN}`;
    var SANDBOX_DOMAIN = DOMAIN;
    var ENVD_PORT = 49982;
    var WS_ROUTE = "/ws";
    var FILE_ROUTE = "/file";
    var import_platform = __toESM2(require_platform());
    var version = "0.12.5";
    var _a4;
    var defaultHeaders = {
      browser: typeof window !== "undefined" && import_platform.default.name || "undefined",
      lang: "js",
      lang_version: import_platform.default.version || "unknown",
      package_version: version,
      publisher: "e2b",
      sdk_runtime: typeof window === "undefined" ? "node" : "browser",
      system: ((_a4 = import_platform.default.os) == null ? void 0 : _a4.family) || "unknown"
    };
    var { Fetcher } = fetcher;
    var client = Fetcher.for();
    client.configure({
      baseUrl: API_HOST,
      init: {
        headers: defaultHeaders
      }
    });
    function withAccessToken(f) {
      const wrapped = /* @__PURE__ */ __name((accessToken, arg, init) => {
        return f(arg, __spreadProps(__spreadValues({}, init), {
          headers: __spreadValues({
            Authorization: `Bearer ${accessToken}`
          }, init == null ? void 0 : init.headers)
        }));
      }, "wrapped");
      wrapped.Error = f.Error;
      return wrapped;
    }
    __name(withAccessToken, "withAccessToken");
    function withAPIKey(f) {
      const wrapped = /* @__PURE__ */ __name((apiKey, arg, init) => {
        return f(arg, __spreadProps(__spreadValues({}, init), {
          headers: __spreadValues({
            "X-API-KEY": apiKey
          }, init == null ? void 0 : init.headers)
        }));
      }, "wrapped");
      wrapped.Error = f.Error;
      return wrapped;
    }
    __name(withAPIKey, "withAPIKey");
    var api_default = client;
    var terminalService = "terminal";
    var TerminalOutput = class {
      static {
        __name(this, "TerminalOutput");
      }
      constructor() {
        this._data = "";
      }
      get data() {
        return this._data;
      }
      addData(data) {
        this._data += data;
      }
    };
    var Terminal = class {
      static {
        __name(this, "Terminal");
      }
      constructor(terminalID, sandbox, triggerExit, finished, output) {
        this.terminalID = terminalID;
        this.sandbox = sandbox;
        this.triggerExit = triggerExit;
        this.output = output;
        this.finished = finished;
      }
      get data() {
        return this.output.data;
      }
      /**
       * Kills the terminal session.
       */
      kill() {
        return __async(this, null, function* () {
          try {
            yield this.sandbox._call(terminalService, "destroy", [this.terminalID]);
          } finally {
            this.triggerExit();
            yield this.finished;
          }
        });
      }
      /**
       * Waits for the terminal to finish.
       */
      wait() {
        return __async(this, null, function* () {
          return this.finished;
        });
      }
      /**
       * Sends data to the terminal standard input.
       *
       * @param data Data to send
       */
      sendData(data) {
        return __async(this, null, function* () {
          yield this.sandbox._call(terminalService, "data", [this.terminalID, data]);
        });
      }
      /**
       * Resizes the terminal tty.
       *
       * @param cols Number of columns
       * @param rows Number of rows
       */
      resize(_0) {
        return __async(this, arguments, function* ({ cols, rows }) {
          yield this.sandbox._call(terminalService, "resize", [
            this.terminalID,
            cols,
            rows
          ]);
        });
      }
    };
    var TimeoutError = class extends Error {
      static {
        __name(this, "TimeoutError");
      }
      constructor(message) {
        super(message);
        this.name = "TimeoutError";
      }
    };
    var AbortError = class extends Error {
      static {
        __name(this, "AbortError");
      }
      constructor(message) {
        super();
        this.name = "AbortError";
        this.message = message;
      }
    };
    var getDOMException = /* @__PURE__ */ __name((errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage), "getDOMException");
    var getAbortedReason = /* @__PURE__ */ __name((signal) => {
      const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
      return reason instanceof Error ? reason : getDOMException(reason);
    }, "getAbortedReason");
    function pTimeout(promise, options) {
      const {
        milliseconds,
        fallback,
        message,
        customTimers = { setTimeout, clearTimeout }
      } = options;
      let timer;
      const wrappedPromise = new Promise((resolve, reject) => {
        if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
          throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
        }
        if (options.signal) {
          const { signal } = options;
          if (signal.aborted) {
            reject(getAbortedReason(signal));
          }
          signal.addEventListener("abort", () => {
            reject(getAbortedReason(signal));
          });
        }
        if (milliseconds === Number.POSITIVE_INFINITY) {
          promise.then(resolve, reject);
          return;
        }
        const timeoutError = new TimeoutError();
        timer = customTimers.setTimeout.call(void 0, () => {
          if (fallback) {
            try {
              resolve(fallback());
            } catch (error) {
              reject(error);
            }
            return;
          }
          if (typeof promise.cancel === "function") {
            promise.cancel();
          }
          if (message === false) {
            resolve();
          } else if (message instanceof Error) {
            reject(message);
          } else {
            timeoutError.message = message != null ? message : `Promise timed out after ${milliseconds} milliseconds`;
            reject(timeoutError);
          }
        }, milliseconds);
        (() => __async(this, null, function* () {
          try {
            resolve(yield promise);
          } catch (error) {
            reject(error);
          }
        }))();
      });
      const cancelablePromise = wrappedPromise.finally(() => {
        cancelablePromise.clear();
      });
      cancelablePromise.clear = () => {
        customTimers.clearTimeout.call(void 0, timer);
        timer = void 0;
      };
      return cancelablePromise;
    }
    __name(pTimeout, "pTimeout");
    function assertFulfilled(item) {
      return item.status === "fulfilled";
    }
    __name(assertFulfilled, "assertFulfilled");
    function formatSettledErrors(settled) {
      if (settled.every((s) => s.status === "fulfilled"))
        return;
      return settled.reduce((prev, curr, i) => {
        if (curr.status === "rejected") {
          return prev + `
[${i}]: ${JSON.stringify(curr)}`;
        }
        return prev;
      }, "errors:\n");
    }
    __name(formatSettledErrors, "formatSettledErrors");
    function createDeferredPromise() {
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return {
        promise,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        reject,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        resolve
      };
    }
    __name(createDeferredPromise, "createDeferredPromise");
    function withTimeout(fn, timeout = TIMEOUT) {
      if (timeout === void 0 || timeout <= 0 || timeout === Number.POSITIVE_INFINITY) {
        return fn;
      }
      return (...args) => pTimeout(fn(...args), { milliseconds: timeout });
    }
    __name(withTimeout, "withTimeout");
    var filesystemService = "filesystem";
    var FilesystemOperation = /* @__PURE__ */ ((FilesystemOperation2) => {
      FilesystemOperation2["Create"] = "Create";
      FilesystemOperation2["Write"] = "Write";
      FilesystemOperation2["Remove"] = "Remove";
      FilesystemOperation2["Rename"] = "Rename";
      FilesystemOperation2["Chmod"] = "Chmod";
      return FilesystemOperation2;
    })(FilesystemOperation || {});
    var FilesystemWatcher = class {
      static {
        __name(this, "FilesystemWatcher");
      }
      constructor(sessConn, path2) {
        this.sessConn = sessConn;
        this.path = path2;
        this.listeners = /* @__PURE__ */ new Set();
      }
      // Starts watching the path that was passed to the contructor
      start(opts) {
        return __async(this, null, function* () {
          const start = /* @__PURE__ */ __name(() => __async(this, null, function* () {
            if (this.rpcSubscriptionID)
              return;
            this.handleFilesystemEvents = this.handleFilesystemEvents.bind(this);
            this.rpcSubscriptionID = yield this.sessConn._subscribe(
              filesystemService,
              this.handleFilesystemEvents,
              "watchDir",
              this.path
            );
          }), "start");
          return yield withTimeout(start, opts == null ? void 0 : opts.timeout)();
        });
      }
      // Stops watching the path and removes all listeners.
      stop() {
        return __async(this, null, function* () {
          this.listeners.clear();
          if (this.rpcSubscriptionID) {
            yield this.sessConn._unsubscribe(this.rpcSubscriptionID);
          }
        });
      }
      addEventListener(l) {
        this.listeners.add(l);
        return () => this.listeners.delete(l);
      }
      handleFilesystemEvents(fsChange) {
        this.listeners.forEach((l) => {
          l(fsChange);
        });
      }
    };
    var filesystemWatcher_default = FilesystemWatcher;
    var processService = "process";
    var ProcessMessage = class {
      static {
        __name(this, "ProcessMessage");
      }
      constructor(line, timestamp, error) {
        this.line = line;
        this.timestamp = timestamp;
        this.error = error;
      }
      toString() {
        return this.line;
      }
    };
    var ProcessOutput = class {
      static {
        __name(this, "ProcessOutput");
      }
      constructor() {
        this.delimiter = "\n";
        this.messages = [];
        this._finished = false;
        this._error = false;
      }
      /**
       * Whether the process has errored.
       */
      get error() {
        return this._error;
      }
      /**
       * The exit code of the process.
       */
      get exitCode() {
        if (!this._finished) {
          throw new Error("Process has not finished yet");
        }
        return this._exitCode;
      }
      /**
       * The stdout from the process.
       */
      get stdout() {
        return this.messages.filter((out) => !out.error).map((out) => out.line).join(this.delimiter);
      }
      /**
       * The stderr from the process.
       */
      get stderr() {
        return this.messages.filter((out) => out.error).map((out) => out.line).join(this.delimiter);
      }
      addStdout(message) {
        this.insertByTimestamp(message);
      }
      addStderr(message) {
        this._error = true;
        this.insertByTimestamp(message);
      }
      setExitCode(exitCode) {
        this._exitCode = exitCode;
        this._finished = true;
      }
      insertByTimestamp(message) {
        let i = this.messages.length - 1;
        while (i >= 0 && this.messages[i].timestamp > message.timestamp) {
          i -= 1;
        }
        this.messages.splice(i + 1, 0, message);
      }
    };
    var Process = class {
      static {
        __name(this, "Process");
      }
      constructor(processID, sandbox, triggerExit, finished, output) {
        this.processID = processID;
        this.sandbox = sandbox;
        this.triggerExit = triggerExit;
        this.output = output;
        this.finished = finished;
      }
      /**
       * Kills the process.
       */
      kill() {
        return __async(this, null, function* () {
          try {
            yield this.sandbox._call(processService, "kill", [this.processID]);
          } finally {
            this.triggerExit();
            yield this.finished;
          }
        });
      }
      /**
       * Waits for the process to finish.
       *
       * @param timeout Timeout for the process to finish in milliseconds
       */
      wait(timeout) {
        return __async(this, null, function* () {
          return yield withTimeout(() => this.finished, timeout)();
        });
      }
      /**
       * Sends data to the process stdin.
       *
       * @param data Data to send
       * @param opts Call options
       * @param {timeout} [opts.timeout] Timeout for call in milliseconds (default is 60 seconds)
       */
      sendStdin(data, opts) {
        return __async(this, null, function* () {
          yield this.sandbox._call(
            processService,
            "stdin",
            [this.processID, data],
            opts
          );
        });
      }
    };
    var import_normalize_path = __toESM2(require_normalize_path());
    function id(length) {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    __name(id, "id");
    var codeSnippetService = "codeSnippet";
    var import_isomorphic_ws = __toESM2(require_node());
    var RpcWebSocketClient = class {
      static {
        __name(this, "RpcWebSocketClient");
      }
      // constructor
      /**
       * Does not start WebSocket connection!
       * You need to call connect() method first.
       * @memberof RpcWebSocketClient
       */
      constructor() {
        this.onOpenHandlers = [];
        this.onAnyMessageHandlers = [];
        this.onNotification = [];
        this.onRequest = [];
        this.onSuccessResponse = [];
        this.onErrorResponse = [];
        this.onErrorHandlers = [];
        this.onCloseHandlers = [];
        this.config = {
          responseTimeout: 1e4
        };
        this.idAwaiter = {};
        this.ws = void 0;
      }
      // public
      /**
       * Starts WebSocket connection. Returns Promise when connection is established.
       * @param {string} url
       * @param {(string | string[])} [protocols]
       * @memberof RpcWebSocketClient
       */
      connect(url, protocols) {
        this.ws = new import_isomorphic_ws.default(url, protocols);
        return this.listen();
      }
      // events
      onOpen(fn) {
        this.onOpenHandlers.push(fn);
      }
      /**
       * Native onMessage event. DO NOT USE THIS unless you really have to or for debugging purposes.
       * Proper RPC events are onRequest, onNotification, onSuccessResponse and onErrorResponse (or just awaiting response).
       * @param {RpcMessageEventFunction} fn
       * @memberof RpcWebSocketClient
       */
      onAnyMessage(fn) {
        this.onAnyMessageHandlers.push(fn);
      }
      onError(fn) {
        this.onErrorHandlers.push(fn);
      }
      onClose(fn) {
        this.onCloseHandlers.push(fn);
      }
      /**
       * Appends onmessage listener on native websocket with RPC handlers.
       * If onmessage function was already there, it will call it on beggining.
       * Useful if you want to use RPC WebSocket Client on already established WebSocket along with function changeSocket().
       * @memberof RpcWebSocketClient
       */
      listenMessages() {
        let previousOnMessage;
        if (this.ws.onmessage) {
          previousOnMessage = this.ws.onmessage.bind(this.ws);
        }
        this.ws.onmessage = (e) => {
          if (previousOnMessage) {
            previousOnMessage(e);
          }
          for (const handler of this.onAnyMessageHandlers) {
            handler(e);
          }
          const data = JSON.parse(e.data.toString());
          if (this.isNotification(data)) {
            for (const handler of this.onNotification) {
              handler(data);
            }
          } else if (this.isRequest(data)) {
            for (const handler of this.onRequest) {
              handler(data);
            }
          } else if (this.isSuccessResponse(data)) {
            for (const handler of this.onSuccessResponse) {
              handler(data);
            }
            this.idAwaiter[data.id](data.result);
          } else if (this.isErrorResponse(data)) {
            for (const handler of this.onErrorResponse) {
              handler(data);
            }
            this.idAwaiter[data.id](data.error);
          }
        };
      }
      // communication
      /**
       * Creates and sends RPC request. Resolves when appropirate response is returned from server or after config.responseTimeout.
       * @param {string} method
       * @param {*} [params]
       * @returns
       * @memberof RpcWebSocketClient
       */
      call(method, params) {
        return new Promise((resolve, reject) => {
          const data = this.buildRequest(method, params);
          let timeout;
          if (this.config.responseTimeout) {
            timeout = setTimeout(() => {
              delete this.idAwaiter[data.id];
              reject(
                new Error(`Awaiting response to "${method}" with id: ${data.id} timed out.`)
              );
            }, this.config.responseTimeout);
          }
          this.idAwaiter[data.id] = (responseData) => {
            clearInterval(timeout);
            delete this.idAwaiter[data.id];
            if (this.isRpcError(responseData)) {
              reject(new Error(`RPC Error (${responseData.code}): ${responseData.message}`));
              return;
            }
            resolve(responseData);
          };
          const json = JSON.stringify(data);
          this.ws.send(json);
        });
      }
      /**
       * Creates and sends RPC Notification.
       * @param {string} method
       * @param {*} [params]
       * @memberof RpcWebSocketClient
       */
      notify(method, params) {
        this.ws.send(JSON.stringify(this.buildNotification(method, params)));
      }
      // setup
      /**
       * You can provide custom id generation function to replace default uuid/v1.
       * @param {() => string} idFn
       * @memberof RpcWebSocketClient
       */
      customId(idFn) {
        this.idFn = idFn;
      }
      /**
       * Removed jsonrpc from sent messages. Good if you don't care about standards or need better performance.
       * @memberof RpcWebSocketClient
       */
      noRpc() {
        this.buildRequest = this.buildRequestBase;
        this.buildNotification = this.buildNotificationBase;
        this.buildRpcSuccessResponse = this.buildRpcSuccessResponseBase;
        this.buildRpcErrorResponse = this.buildRpcErrorResponseBase;
      }
      /**
       * Allows modifying configuration.
       * @param {IRpcWebSocketConfig} options
       * @memberof RpcWebSocketClient
       */
      configure(options) {
        Object.assign(this.config, options);
      }
      /**
       * Allows you to change used native WebSocket client to another one.
       * If you have already-connected WebSocket, use this with listenMessages().
       * @param {WebSocket} ws
       * @memberof RpcWebSocketClient
       */
      changeSocket(ws) {
        this.ws = ws;
      }
      // private
      // events
      listen() {
        return new Promise((resolve, reject) => {
          this.ws.onopen = (e) => {
            for (const handler of this.onOpenHandlers) {
              handler(e);
            }
            resolve(e);
          };
          this.listenMessages();
          this.ws.onerror = (e) => {
            for (const handler of this.onErrorHandlers) {
              handler(e);
            }
          };
          this.ws.onclose = (e) => {
            for (const handler of this.onCloseHandlers) {
              handler(e);
            }
            reject(new Error(`WebSocket closed with code: ${e.code} and reason: ${e.reason}`));
          };
        });
      }
      // request
      buildRequest(method, params) {
        const data = this.buildRequestBase(method, params);
        data.jsonrpc = "2.0";
        return data;
      }
      buildRequestBase(method, params) {
        const data = {};
        data.id = this.idFn();
        data.method = method;
        if (params) {
          data.params = params;
        }
        return data;
      }
      // notification
      buildNotification(method, params) {
        const data = this.buildNotificationBase(method, params);
        data.jsonrpc = "2.0";
        return data;
      }
      buildNotificationBase(method, params) {
        const data = {};
        data.method = method;
        if (params) {
          data.params = params;
        }
        return data;
      }
      // success response
      buildRpcSuccessResponse(id2, result) {
        const data = this.buildRpcSuccessResponseBase(id2, result);
        data.jsonrpc = "2.0";
        return data;
      }
      buildRpcSuccessResponseBase(id2, result) {
        const data = {};
        data.id = id2;
        data.result = result;
        return data;
      }
      // error response
      buildRpcErrorResponse(id2, error) {
        const data = this.buildRpcErrorResponseBase(id2, error);
        data.jsonrpc = "2.0";
        return data;
      }
      buildRpcErrorResponseBase(id2, error) {
        const data = {};
        data.id = id2;
        data.error = error;
        return data;
      }
      idFn() {
        return id(12);
      }
      // tests
      isNotification(data) {
        return !data.id;
      }
      isRequest(data) {
        return data.method;
      }
      isSuccessResponse(data) {
        return data.hasOwnProperty(`result`);
      }
      isErrorResponse(data) {
        return data.hasOwnProperty(`error`);
      }
      isRpcError(data) {
        return typeof (data == null ? void 0 : data.code) !== "undefined";
      }
    };
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    __name(wait, "wait");
    var wait_default = wait;
    var AuthenticationError = class extends Error {
      static {
        __name(this, "AuthenticationError");
      }
      constructor(message) {
        super(message);
        this.name = "AuthenticationError";
      }
    };
    var CurrentWorkingDirectoryDoesntExistError = class extends Error {
      static {
        __name(this, "CurrentWorkingDirectoryDoesntExistError");
      }
      constructor(message) {
        super(message);
        this.name = "CurrentWorkingDirectoryDoesntExistError";
      }
    };
    function getApiKey(apiKey) {
      var _a5;
      apiKey = apiKey || ((_a5 = process == null ? void 0 : process.env) == null ? void 0 : _a5.E2B_API_KEY);
      if (!apiKey) {
        throw new AuthenticationError(
          "API key is required, please visit https://e2b.dev/docs to get your API key. You can either set the environment variable `E2B_API_KEY` or you can pass it directly to the sandbox like Sandbox.create({apiKey: 'e2b_...'})"
        );
      }
      return apiKey;
    }
    __name(getApiKey, "getApiKey");
    var listSandboxes = withAPIKey(
      api_default.path("/sandboxes").method("get").create()
    );
    var createSandbox = withAPIKey(
      api_default.path("/sandboxes").method("post").create()
    );
    var killSandbox = withAPIKey(
      api_default.path("/sandboxes/{sandboxID}").method("delete").create()
    );
    var refreshSandbox = withAPIKey(
      api_default.path("/sandboxes/{sandboxID}/refreshes").method("post").create()
    );
    var SandboxConnection = class {
      static {
        __name(this, "SandboxConnection");
      }
      // let's keep opts readonly, but public - for convenience, mainly when debugging
      constructor(opts) {
        this.opts = opts;
        this.isOpen = false;
        this.rpc = new RpcWebSocketClient();
        this.subscribers = [];
        var _a5, _b, _c;
        this.sandbox = opts.__sandbox;
        this.apiKey = getApiKey(opts.apiKey);
        this.cwd = opts.cwd;
        if (this.cwd && this.cwd.startsWith("~")) {
          this.cwd = this.cwd.replace("~", "/home/user");
        }
        const defaultEnvVars = { PYTHONUNBUFFERED: "1" };
        this.envVars = __spreadValues(__spreadValues({}, defaultEnvVars), opts.envVars || {});
        this.logger = (_a5 = opts.logger) != null ? _a5 : {
          // by default, we log to the console
          // we don't log debug messages by default
          info: console.info,
          warn: console.warn,
          error: console.error
        };
        (_c = (_b = this.logger).debug) == null ? void 0 : _c.call(_b, `Sandbox "${this.templateID}" initialized`);
      }
      /**
       * ID of the sandbox.
       * 
       * You can use this ID to reconnect to the sandbox later.
       */
      get id() {
        var _a5, _b;
        return `${(_a5 = this.sandbox) == null ? void 0 : _a5.sandboxID}-${(_b = this.sandbox) == null ? void 0 : _b.clientID}`;
      }
      get templateID() {
        return this.opts.template || this.opts.id || "base";
      }
      /**
       * List all running sandboxes
       * 
       * @param apiKey API key to use for authentication. If not provided, the `E2B_API_KEY` environment variable will be used.
       */
      static list(apiKey) {
        return __async(this, null, function* () {
          apiKey = getApiKey(apiKey);
          try {
            const res = yield listSandboxes(apiKey, {});
            return res.data.map((sandbox) => __spreadProps(__spreadValues(__spreadValues({
              sandboxID: `${sandbox.sandboxID}-${sandbox.clientID}`,
              templateID: sandbox.templateID,
              cpuCount: sandbox.cpuCount,
              memoryMB: sandbox.memoryMB
            }, sandbox.alias && { alias: sandbox.alias }), sandbox.metadata && { metadata: sandbox.metadata }), {
              startedAt: new Date(sandbox.startedAt)
            }));
          } catch (e) {
            if (e instanceof listSandboxes.Error) {
              const error = e.getActualType();
              if (error.status === 401) {
                throw new Error(
                  `Error listing sandboxes - (${error.status}) unauthenticated: ${error.data.message}`
                );
              }
              if (error.status === 500) {
                throw new Error(
                  `Error listing sandboxes - (${error.status}) server error: ${error.data.message}`
                );
              }
            }
            throw e;
          }
        });
      }
      /**
       * List all running sandboxes
       * @param sandboxID ID of the sandbox to kill
       * @param apiKey API key to use for authentication. If not provided, the `E2B_API_KEY` environment variable will be used.
       */
      static kill(sandboxID, apiKey) {
        return __async(this, null, function* () {
          apiKey = getApiKey(apiKey);
          const shortID = sandboxID.split("-")[0];
          try {
            yield killSandbox(apiKey, { sandboxID: shortID });
          } catch (e) {
            if (e instanceof killSandbox.Error) {
              const error = e.getActualType();
              if (error.status === 401) {
                throw new Error(
                  `Error killing sandbox (${sandboxID}) - (${error.status}) unauthenticated: ${error.data.message}`
                );
              }
              if (error.status === 500) {
                throw new Error(
                  `Error killing sandbox (${sandboxID}) - (${error.status}) server error: ${error.data.message}`
                );
              }
            }
            throw e;
          }
        });
      }
      /**
       * Keep the sandbox alive for the specified duration.
       *
       * `keepAlive` method requires `this` context - you may need to bind it.
       * @param duration Duration in milliseconds. Must be between 0 and 3600000 milliseconds
       * @returns Promise that resolves when the sandbox is kept alive
       */
      keepAlive(duration) {
        return __async(this, null, function* () {
          var _a5;
          duration = Math.round(duration / 1e3);
          if (duration < 0 || duration > 3600) {
            throw new Error("Duration must be between 0 and 3600 seconds");
          }
          if (!this.sandbox) {
            throw new Error("Cannot keep alive - sandbox is not initialized");
          }
          yield refreshSandbox(this.apiKey, {
            sandboxID: (_a5 = this.sandbox) == null ? void 0 : _a5.sandboxID,
            duration
          });
        });
      }
      /**
       * Get the hostname for the sandbox or for the specified sandbox's port.
       *
       * `getHostname` method requires `this` context - you may need to bind it.
       *
       * @param port Specify if you want to connect to a specific port of the sandbox
       * @returns Hostname of the sandbox or sandbox's port
       */
      getHostname(port) {
        if (this.opts.__debug_hostname) {
          if (port && this.opts.__debug_devEnv === "remote") {
            return `${port}-${this.opts.__debug_hostname}`;
          } else if (port) {
            return `${this.opts.__debug_hostname}:${port}`;
          } else {
            return this.opts.__debug_hostname;
          }
        }
        if (!this.sandbox) {
          throw new Error("Cannot get sandbox's hostname - sandbox is not initialized");
        }
        const hostname = `${this.id}.${SANDBOX_DOMAIN}`;
        if (port) {
          return `${port}-${hostname}`;
        } else {
          return hostname;
        }
      }
      /**
       * The function decides whether to use the secure or insecure protocol.
       * @param baseProtocol Specify the specific protocol you want to use. Do not include the `s` in `https` or `wss`.
       * @param secure Specify if you want to use the secure protocol
       * @returns Protocol for the connection to the sandbox
       */
      getProtocol(baseProtocol = "http", secure = SECURE) {
        return secure ? `${baseProtocol}s` : baseProtocol;
      }
      /**
       * Close the connection to the sandbox
       *
       * `close` method requires `this` context - you may need to bind it.
       */
      close() {
        return __async(this, null, function* () {
          var _a5, _b, _c, _d, _e, _f, _g, _h;
          if (this.isOpen) {
            (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, `Closing sandbox "${this.id}"`);
            this.isOpen = false;
            (_d = (_c = this.rpc.ws) == null ? void 0 : _c.terminate) == null ? void 0 : _d.call(_c);
            (_f = (_e = this.rpc.ws) == null ? void 0 : _e.close) == null ? void 0 : _f.call(_e);
            this.subscribers = [];
            (_h = (_g = this.logger).debug) == null ? void 0 : _h.call(_g, "Disconnected from the sandbox");
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _call(service, method, params, opts) {
        return __async(this, null, function* () {
          var _a5, _b;
          (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, `Calling "${service}_${method}" with params:`, params);
          const call = /* @__PURE__ */ __name((method2, params2) => __async(this, null, function* () {
            return yield this.rpc.call(method2, params2);
          }), "call");
          return yield withTimeout(call, opts == null ? void 0 : opts.timeout)(
            `${service}_${method}`,
            params
          );
        });
      }
      _handleSubscriptions(...subs) {
        return __async(this, null, function* () {
          const results = yield Promise.allSettled(subs);
          if (results.every((r) => r.status === "fulfilled")) {
            return results.map(
              (r) => r.status === "fulfilled" ? r.value : void 0
            );
          }
          yield Promise.all(
            results.filter(assertFulfilled).map((r) => r.value ? this._unsubscribe(r.value) : void 0)
          );
          throw new Error(formatSettledErrors(results));
        });
      }
      // eslint-disable-next-line @typescript-eslint/member-ordering
      _unsubscribe(subID) {
        return __async(this, null, function* () {
          var _a5, _b;
          const subscription = this.subscribers.find((s) => s.subID === subID);
          if (!subscription)
            return;
          yield this._call(subscription.service, "unsubscribe", [subscription.subID]);
          this.subscribers = this.subscribers.filter((s) => s !== subscription);
          (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(
            _a5,
            `Unsubscribed '${subID}' from '${subscription.service}'`
          );
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/member-ordering
      _subscribe(service, handler, method, ...params) {
        return __async(this, null, function* () {
          var _a5, _b;
          const subID = yield this._call(service, "subscribe", [method, ...params]);
          if (typeof subID !== "string") {
            throw new Error(
              `Cannot subscribe to ${service}_${method}${params.length > 0 ? " with params [" + params.join(", ") + "]" : ""}. Expected response should have been a subscription ID, instead we got ${JSON.stringify(
                subID
              )}`
            );
          }
          this.subscribers.push({
            handler,
            service,
            subID
          });
          (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(
            _a5,
            `Subscribed to "${service}_${method}"${params.length > 0 ? " with params [" + params.join(", ") + "] and" : ""} with id "${subID}"`
          );
          return subID;
        });
      }
      /**
       * Open a connection to a new sandbox
       *
       * `open` method requires `this` context - you may need to bind it.
       * @param opts Call options
       * @param {timeout} [opts.timeout] Timeout for sandbox to open in milliseconds (default is 60 seconds)
       */
      _open(opts) {
        return __async(this, null, function* () {
          const open = /* @__PURE__ */ __name(() => __async(this, null, function* () {
            var _a5, _b, _c, _d;
            if (this.isOpen) {
              throw new Error("Sandbox connect was already called");
            } else {
              this.isOpen = true;
            }
            (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, "Opening sandbox...");
            if (!this.sandbox && !this.opts.__debug_hostname) {
              try {
                const res = yield createSandbox(this.apiKey, {
                  templateID: this.templateID,
                  metadata: this.opts.metadata
                });
                this.sandbox = res.data;
                (_d = (_c = this.logger).debug) == null ? void 0 : _d.call(_c, `Acquired sandbox "${this.id}"`);
              } catch (e) {
                if (e instanceof createSandbox.Error) {
                  const error = e.getActualType();
                  if (error.status === 400) {
                    throw new Error(
                      `Error creating sandbox - (${error.status}) bad request: ${error.data.message}`
                    );
                  }
                  if (error.status === 401) {
                    throw new Error(
                      `Error creating sandbox - (${error.status}) unauthenticated: ${error.data.message}`
                    );
                  }
                  if (error.status === 500) {
                    throw new Error(
                      `Error creating sandbox - (${error.status}) server error: ${error.data.message}`
                    );
                  }
                }
                throw e;
              }
            }
            if (this.sandbox && !this.opts.__debug_hostname) {
              this.refresh(this.sandbox.sandboxID);
            }
            yield this.connectRpc();
            return this;
          }), "open");
          try {
            return yield withTimeout(open, opts == null ? void 0 : opts.timeout)();
          } catch (err) {
            yield this.close();
            throw err;
          }
        });
      }
      connectRpc() {
        return __async(this, null, function* () {
          const hostname = this.getHostname(this.opts.__debug_port || ENVD_PORT);
          const protocol = this.getProtocol("ws", this.opts.__debug_devEnv !== "local");
          const sandboxURL = `${protocol}://${hostname}${WS_ROUTE}`;
          let isFinished = false;
          let resolveOpening;
          let rejectOpening;
          const openingPromise = new Promise((resolve, reject) => {
            resolveOpening = /* @__PURE__ */ __name(() => {
              if (isFinished)
                return;
              isFinished = true;
              resolve();
            }, "resolveOpening");
            rejectOpening = /* @__PURE__ */ __name(() => {
              if (isFinished)
                return;
              isFinished = true;
              reject();
            }, "rejectOpening");
          });
          this.rpc.onOpen(() => {
            var _a5, _b;
            (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(
              _a5,
              `Connected to sandbox "${this.id}"`
            );
            resolveOpening == null ? void 0 : resolveOpening();
          });
          this.rpc.onError((err) => __async(this, null, function* () {
            var _a5, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
            (_d = (_c = this.logger).debug) == null ? void 0 : _d.call(
              _c,
              `Error in WebSocket of sandbox "${this.id}": ${(_b = (_a5 = err.message) != null ? _a5 : err.code) != null ? _b : err.toString()}. Trying to reconnect...`
            );
            if (this.isOpen) {
              yield wait_default(WS_RECONNECT_INTERVAL);
              (_f = (_e = this.logger).debug) == null ? void 0 : _f.call(
                _e,
                `Reconnecting to sandbox "${this.id}"`
              );
              try {
                this.subscribers = [];
                yield this.rpc.connect(sandboxURL);
                (_h = (_g = this.logger).debug) == null ? void 0 : _h.call(
                  _g,
                  `Reconnected to sandbox "${this.id}"`
                );
              } catch (err2) {
                (_l = (_k = this.logger).debug) == null ? void 0 : _l.call(
                  _k,
                  `Failed reconnecting to sandbox "${this.id}": ${(_j = (_i = err2.message) != null ? _i : err2.code) != null ? _j : err2.toString()}`
                );
              }
            } else {
              rejectOpening == null ? void 0 : rejectOpening();
            }
          }));
          this.rpc.onClose(() => __async(this, null, function* () {
            var _a5, _b;
            (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(
              _a5,
              `WebSocket connection to sandbox "${this.id}" closed`
            );
          }));
          this.rpc.onNotification.push(this.handleNotification.bind(this));
          (() => __async(this, null, function* () {
            var _a5, _b, _c, _d, _e, _f;
            try {
              (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(
                _a5,
                `Connecting to sandbox "${this.id}"`
              );
              yield this.rpc.connect(sandboxURL);
            } catch (err) {
              (_f = (_e = this.logger).debug) == null ? void 0 : _f.call(
                _e,
                `Error connecting to sandbox "${this.id}": ${(_d = (_c = err.message) != null ? _c : err.code) != null ? _d : err.toString()}`
              );
            }
          }))();
          yield openingPromise;
        });
      }
      handleNotification(data) {
        var _a5, _b;
        (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, "Handling notification:", data);
        this.subscribers.filter((s) => {
          var _a6;
          return s.subID === ((_a6 = data.params) == null ? void 0 : _a6.subscription);
        }).forEach((s) => {
          var _a6;
          return s.handler((_a6 = data.params) == null ? void 0 : _a6.result);
        });
      }
      refresh(sandboxID) {
        return __async(this, null, function* () {
          var _a5, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, `Started refreshing sandbox "${sandboxID}"`);
          try {
            while (true) {
              if (!this.isOpen) {
                (_d = (_c = this.logger).debug) == null ? void 0 : _d.call(
                  _c,
                  `Cannot refresh sandbox ${this.id} - it was closed`
                );
                return;
              }
              yield wait_default(SANDBOX_REFRESH_PERIOD);
              try {
                yield refreshSandbox(this.apiKey, {
                  sandboxID,
                  duration: 0
                });
                (_f = (_e = this.logger).debug) == null ? void 0 : _f.call(_e, `Refreshed sandbox "${sandboxID}"`);
              } catch (e) {
                if (e instanceof refreshSandbox.Error) {
                  const error = e.getActualType();
                  if (error.status === 404) {
                    (_h = (_g = this.logger).warn) == null ? void 0 : _h.call(
                      _g,
                      `Error refreshing sandbox - (${error.status}): ${error.data.message}`
                    );
                    return;
                  }
                  (_j = (_i = this.logger).warn) == null ? void 0 : _j.call(
                    _i,
                    `Refreshing sandbox "${sandboxID}" failed - (${error.status})`
                  );
                }
              }
            }
          } finally {
            (_l = (_k = this.logger).debug) == null ? void 0 : _l.call(_k, `Stopped refreshing sandbox "${sandboxID}"`);
            yield this.close();
          }
        });
      }
    };
    var import_path_browserify = __toESM2(require_path_browserify());
    var resolvePath = /* @__PURE__ */ __name((inputPath, cwd, logger) => {
      var _a5, _b, _c;
      let result;
      if (inputPath.startsWith("./")) {
        result = import_path_browserify.default.posix.join(cwd || "/home/user", inputPath);
        if (!cwd) {
          (_a5 = logger.warn) == null ? void 0 : _a5.call(
            logger,
            `Path starts with './' and cwd isn't set. The path '${inputPath}' will evaluate to '${result}', which may not be what you want.`
          );
        }
        return result;
      }
      if (inputPath.startsWith("../")) {
        result = import_path_browserify.default.posix.join(cwd || "/home/user", inputPath);
        if (!cwd) {
          (_b = logger.warn) == null ? void 0 : _b.call(
            logger,
            `Path starts with '../' and cwd isn't set. The path '${inputPath}' will evaluate to '${result}', which may not be what you want.`
          );
        }
        return result;
      }
      if (inputPath.startsWith("~/")) {
        result = import_path_browserify.default.posix.join(cwd || "/home/user", inputPath.substring(2));
        if (!cwd) {
          (_c = logger.warn) == null ? void 0 : _c.call(
            logger,
            `Path starts with '~/' and cwd isn't set. The path '${inputPath}' will evaluate to '${result}', which may not be what you want.`
          );
        }
        return result;
      }
      if (!inputPath.startsWith("/") && cwd) {
        return import_path_browserify.default.posix.join(cwd, inputPath);
      }
      return inputPath;
    }, "resolvePath");
    var Actions = class {
      static {
        __name(this, "Actions");
      }
      constructor(sandbox) {
        this.sandbox = sandbox;
      }
      /**
       * Call the required actions for the provided run and return their outputs.
       * 
       * @param run OpenAI run object from `openai.beta.threads.runs.retrieve` or `openai.beta.threads.runs.retrieve.create` call that contains the names of the required actions and their arguments.
       * @returns The outputs of the required actions in the run.
       */
      run(run) {
        return __async(this, null, function* () {
          if (run.status !== "requires_action") {
            return [];
          }
          if (!run.required_action) {
            return [];
          }
          const outputs = [];
          for (const toolCall of run.required_action.submit_tool_outputs.tool_calls) {
            const action = this.sandbox._actions.get(toolCall.function.name);
            if (!action) {
              console.warn(`Action ${toolCall.function.name} not found`);
              continue;
            }
            const args = JSON.parse(toolCall.function.arguments);
            const output = yield action(this.sandbox, args);
            outputs.push({
              tool_call_id: toolCall.id,
              output
            });
          }
          return outputs;
        });
      }
    };
    var Sandbox2 = class extends SandboxConnection {
      static {
        __name(this, "Sandbox");
      }
      /**
       * Use `Sandbox.create()` instead.
       * 
       * @hidden
       * @hide
       * @internal
       * @access protected
       */
      constructor(opts) {
        opts = opts || {};
        super(opts);
        this._actions = /* @__PURE__ */ new Map();
        this.onScanPorts = opts.onScanPorts;
        this.filesystem = {
          list: /* @__PURE__ */ __name((path2, opts2) => __async(this, null, function* () {
            return yield this._call(
              filesystemService,
              "list",
              [_resolvePath(path2)],
              opts2
            );
          }), "list"),
          read: /* @__PURE__ */ __name((path2, opts2) => __async(this, null, function* () {
            return yield this._call(
              filesystemService,
              "read",
              [_resolvePath(path2)],
              opts2
            );
          }), "read"),
          remove: /* @__PURE__ */ __name((path2, opts2) => __async(this, null, function* () {
            yield this._call(
              filesystemService,
              "remove",
              [_resolvePath(path2)],
              opts2
            );
          }), "remove"),
          write: /* @__PURE__ */ __name((path2, content, opts2) => __async(this, null, function* () {
            yield this._call(
              filesystemService,
              "write",
              [_resolvePath(path2), content],
              opts2
            );
          }), "write"),
          writeBytes: /* @__PURE__ */ __name((path2, content) => __async(this, null, function* () {
            const base64Content = Buffer.from(content).toString("base64");
            yield this._call(filesystemService, "writeBase64", [
              _resolvePath(path2),
              base64Content
            ]);
          }), "writeBytes"),
          readBytes: /* @__PURE__ */ __name((path2) => __async(this, null, function* () {
            const base64Content = yield this._call(
              filesystemService,
              "readBase64",
              [_resolvePath(path2)]
            );
            return Buffer.from(base64Content, "base64");
          }), "readBytes"),
          makeDir: /* @__PURE__ */ __name((path2, opts2) => __async(this, null, function* () {
            yield this._call(
              filesystemService,
              "makeDir",
              [_resolvePath(path2)],
              opts2
            );
          }), "makeDir"),
          watchDir: /* @__PURE__ */ __name((path2) => {
            var _a5, _b;
            (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, `Watching directory "${path2}"`);
            const npath = (0, import_normalize_path.default)(_resolvePath(path2));
            return new filesystemWatcher_default(this, npath);
          }, "watchDir")
        };
        this.terminal = {
          start: /* @__PURE__ */ __name((_0) => __async(this, [_0], function* ({
            onData,
            size,
            onExit,
            envVars,
            cmd,
            cwd = "",
            terminalID = id(12),
            timeout = void 0
          }) {
            const start = /* @__PURE__ */ __name((_02) => __async(this, [_02], function* ({
              onData: onData2,
              size: size2,
              onExit: onExit2,
              envVars: envVars2,
              cmd: cmd2,
              cwd: cwd2 = "",
              rootDir,
              terminalID: terminalID2 = id(12)
            }) {
              var _a5, _b, _c, _d;
              (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, `Starting terminal "${terminalID2}"`);
              if (!cwd2 && rootDir) {
                (_d = (_c = this.logger).warn) == null ? void 0 : _d.call(
                  _c,
                  "The rootDir parameter is deprecated, use cwd instead."
                );
                cwd2 = rootDir;
              }
              if (!cwd2 && this.cwd) {
                cwd2 = this.cwd;
              }
              envVars2 = envVars2 || {};
              envVars2 = __spreadValues(__spreadValues({}, this.envVars), envVars2);
              const { promise: terminalExited, resolve: triggerExit } = createDeferredPromise();
              const output = new TerminalOutput();
              function handleData(data) {
                output.addData(data);
                onData2 == null ? void 0 : onData2(data);
              }
              __name(handleData, "handleData");
              const [onDataSubID, onExitSubID] = yield this._handleSubscriptions(
                this._subscribe(terminalService, handleData, "onData", terminalID2),
                this._subscribe(terminalService, triggerExit, "onExit", terminalID2)
              );
              const { promise: unsubscribing, resolve: handleFinishUnsubscribing } = createDeferredPromise();
              terminalExited.then(() => __async(this, null, function* () {
                var _a6, _b2;
                Promise.allSettled([
                  this._unsubscribe(onExitSubID),
                  this._unsubscribe(onDataSubID)
                ]).then((results) => {
                  var _a7, _b3;
                  const errMsg = formatSettledErrors(results);
                  if (errMsg) {
                    (_b3 = (_a7 = this.logger).debug) == null ? void 0 : _b3.call(_a7, errMsg);
                  }
                });
                (_b2 = (_a6 = this.logger).debug) == null ? void 0 : _b2.call(_a6, `Terminal "${terminalID2}" exited`);
                onExit2 == null ? void 0 : onExit2();
                handleFinishUnsubscribing(output);
              }));
              try {
                yield this._call(terminalService, "start", [
                  terminalID2,
                  size2.cols,
                  size2.rows,
                  // Handle optional args for old devbookd compatibility
                  ...cmd2 !== void 0 ? [envVars2, cmd2, cwd2] : []
                ]);
              } catch (err) {
                triggerExit();
                yield unsubscribing;
                throw err;
              }
              return new Terminal(
                terminalID2,
                this,
                triggerExit,
                unsubscribing,
                output
              );
            }), "start");
            return yield withTimeout(
              start,
              timeout
            )({
              onData,
              size,
              onExit,
              envVars,
              cmd,
              cwd,
              terminalID
            });
          }), "start")
        };
        this.process = {
          start: /* @__PURE__ */ __name((optsOrCmd) => __async(this, null, function* () {
            const opts2 = typeof optsOrCmd === "string" ? { cmd: optsOrCmd } : optsOrCmd;
            const start = /* @__PURE__ */ __name((_0) => __async(this, [_0], function* ({
              cmd,
              onStdout,
              onStderr,
              onExit,
              envVars = {},
              cwd = "",
              rootDir,
              processID = id(12)
            }) {
              var _a5, _b, _c, _d;
              if (!cwd && rootDir) {
                (_b = (_a5 = this.logger).warn) == null ? void 0 : _b.call(
                  _a5,
                  "The rootDir parameter is deprecated, use cwd instead."
                );
                cwd = rootDir;
              }
              if (!cwd && this.cwd) {
                cwd = this.cwd;
              }
              if (!cmd)
                throw new Error("cmd is required");
              envVars = envVars || {};
              envVars = __spreadValues(__spreadValues({}, this.envVars), envVars);
              (_d = (_c = this.logger).debug) == null ? void 0 : _d.call(_c, `Starting process "${processID}", cmd: "${cmd}"`);
              const { promise: processExited, resolve: triggerExit } = createDeferredPromise();
              const output = new ProcessOutput();
              const handleExit = /* @__PURE__ */ __name((exitCode) => {
                output.setExitCode(exitCode);
                triggerExit();
              }, "handleExit");
              const handleStdout = /* @__PURE__ */ __name((data) => {
                const message = new ProcessMessage(
                  data.line,
                  data.timestamp,
                  false
                );
                output.addStdout(message);
                if (onStdout) {
                  onStdout(message);
                } else if (this.opts.onStdout) {
                  this.opts.onStdout(message);
                }
              }, "handleStdout");
              const handleStderr = /* @__PURE__ */ __name((data) => {
                const message = new ProcessMessage(data.line, data.timestamp, true);
                output.addStderr(message);
                if (onStderr) {
                  onStderr(message);
                } else if (this.opts.onStderr) {
                  this.opts.onStderr(message);
                }
              }, "handleStderr");
              const [onExitSubID, onStdoutSubID, onStderrSubID] = yield this._handleSubscriptions(
                this._subscribe(processService, handleExit, "onExit", processID),
                this._subscribe(
                  processService,
                  handleStdout,
                  "onStdout",
                  processID
                ),
                this._subscribe(
                  processService,
                  handleStderr,
                  "onStderr",
                  processID
                )
              );
              const { promise: unsubscribing, resolve: handleFinishUnsubscribing } = createDeferredPromise();
              processExited.then(() => __async(this, null, function* () {
                var _a6, _b2;
                Promise.allSettled([
                  this._unsubscribe(onExitSubID),
                  onStdoutSubID ? this._unsubscribe(onStdoutSubID) : void 0,
                  onStderrSubID ? this._unsubscribe(onStderrSubID) : void 0
                ]).then((results) => {
                  var _a7, _b3;
                  const errMsg = formatSettledErrors(results);
                  if (errMsg) {
                    (_b3 = (_a7 = this.logger).debug) == null ? void 0 : _b3.call(_a7, errMsg);
                  }
                });
                (_b2 = (_a6 = this.logger).debug) == null ? void 0 : _b2.call(_a6, `Process "${processID}" exited`);
                if (onExit) {
                  onExit(output.exitCode || 0);
                } else if (this.opts.onExit) {
                  this.opts.onExit();
                }
                handleFinishUnsubscribing(output);
              }));
              try {
                yield this._call(processService, "start", [
                  processID,
                  cmd,
                  envVars,
                  cwd
                ]);
              } catch (err) {
                triggerExit();
                yield unsubscribing;
                if (/error starting process '\w+': fork\/exec \/bin\/bash: no such file or directory/.test(err == null ? void 0 : err.message)) {
                  throw new CurrentWorkingDirectoryDoesntExistError(
                    `Failed to start the process. You are trying set 'cwd' to a directory that does not exist.
${err == null ? void 0 : err.message}`
                  );
                }
                throw err;
              }
              return new Process(
                processID,
                this,
                triggerExit,
                unsubscribing,
                output
              );
            }), "start");
            const timeout = opts2.timeout;
            return yield withTimeout(start, timeout)(opts2);
          }), "start"),
          startAndWait: /* @__PURE__ */ __name((optsOrCmd) => __async(this, null, function* () {
            const opts2 = typeof optsOrCmd === "string" ? { cmd: optsOrCmd } : optsOrCmd;
            const process2 = yield this.process.start(opts2);
            const out = yield process2.wait();
            return out;
          }), "startAndWait")
        };
        const _resolvePath = /* @__PURE__ */ __name((path2) => resolvePath(path2, this.cwd, this.logger), "_resolvePath");
      }
      /**
       * URL that can be used to download or upload file to the sandbox via a multipart/form-data POST request.
       * This is useful if you're uploading files directly from the browser.
       * The file will be uploaded to the user's home directory with the same name.
       * If a file with the same name already exists, it will be overwritten.
       */
      get fileURL() {
        const protocol = this.getProtocol("http", this.opts.__debug_devEnv !== "local");
        const hostname = this.getHostname(this.opts.__debug_port || ENVD_PORT);
        return `${protocol}://${hostname}${FILE_ROUTE}`;
      }
      /**
       * Returns a map of added actions.
       *
       * @returns Map of added actions
       */
      get actions() {
        return new Map(this._actions);
      }
      /**
       * OpenAI integration that can be used to get output for the actions added in the sandbox.
       *
       * @returns OpenAI integration
       */
      get openai() {
        return {
          actions: new Actions(this)
        };
      }
      static create(optsOrTemplate) {
        return __async(this, null, function* () {
          const opts = typeof optsOrTemplate === "string" ? { template: optsOrTemplate } : optsOrTemplate;
          const sandbox = new Sandbox2(opts);
          yield sandbox._open({ timeout: opts == null ? void 0 : opts.timeout });
          return sandbox;
        });
      }
      static reconnect(sandboxIDorOpts) {
        return __async(this, null, function* () {
          let id2;
          let opts;
          if (typeof sandboxIDorOpts === "string") {
            id2 = sandboxIDorOpts;
            opts = {};
          } else {
            id2 = sandboxIDorOpts.sandboxID;
            opts = sandboxIDorOpts;
          }
          const sandboxIDAndClientID = id2.split("-");
          const sandboxID = sandboxIDAndClientID[0];
          const clientID = sandboxIDAndClientID[1];
          opts.__sandbox = { sandboxID, clientID, templateID: "unknown" };
          const sandbox = new this(opts);
          yield sandbox._open({ timeout: opts == null ? void 0 : opts.timeout });
          return sandbox;
        });
      }
      addAction(actionOrName, action) {
        if (typeof actionOrName === "string") {
          if (!action)
            throw new Error("Action is required");
          this._actions.set(actionOrName, action);
          return this;
        } else if (typeof actionOrName === "function") {
          action = actionOrName;
          if (!action.name) {
            throw new Error("Action name is required");
          }
          this._actions.set(action.name, action);
        } else {
          throw new Error("Action or action name and action is required");
        }
        return this;
      }
      /**
       * Remove an action.
       * @param name Action name
       * @returns Sandbox
       *
       * @example
       * ```ts
       * const sandbox = await Sandbox.create()
       * sandbox.addAction('hello', (sandbox, args) => 'Hello World')
       * sandbox.removeAction('hello')
       * ```
       */
      removeAction(name) {
        this._actions.delete(name);
        return this;
      }
      /**
       * Uploads a file to the sandbox.
       * The file will be uploaded to the user's home directory with the same name.
       * If a file with the same name already exists, it will be overwritten.
       *
       * **You can use the {@link Sandbox.fileURL} property and upload file directly via POST multipart/form-data**
       *
       */
      uploadFile(file, filename) {
        return __async(this, null, function* () {
          const body = new FormData();
          const blob = file instanceof Blob ? file : new Blob([file], { type: "application/octet-stream" });
          body.append("file", blob, filename);
          const response = yield fetch(this.fileURL, {
            method: "POST",
            body
          });
          if (!response.ok) {
            const text = yield response.text();
            throw new Error(
              `Failed to upload file ${response.status} - ${response.statusText}: ${text}`
            );
          }
          return `/home/user/${filename}`;
        });
      }
      /**
       * Downloads a file from the sandbox.
       * @param remotePath Path to a file on the sandbox
       * @param format Format of the downloaded file
       * @returns File content
       *
       * @example
       * ```ts
       * const sandbox = await Sandbox.create()
       * const content = await sandbox.downloadFile('/home/user/file.txt')
       * ```
       */
      downloadFile(remotePath, format) {
        return __async(this, null, function* () {
          remotePath = encodeURIComponent(remotePath);
          const response = yield fetch(`${this.fileURL}?path=${remotePath}`);
          if (!response.ok) {
            const text = yield response.text();
            throw new Error(`Failed to download file '${remotePath}': ${text}`);
          }
          switch (format) {
            case "base64":
              return Buffer.from(yield response.arrayBuffer()).toString("base64");
            case "blob":
              return yield response.blob();
            case "buffer":
              return Buffer.from(yield response.arrayBuffer());
            case "arraybuffer":
              return yield response.arrayBuffer();
            case "text":
              return yield response.text();
            default:
              return yield response.arrayBuffer();
          }
        });
      }
      _open(opts) {
        return __async(this, null, function* () {
          yield __superGet(Sandbox2.prototype, this, "_open").call(this, opts);
          const portsHandler = this.onScanPorts ? (ports) => {
            var _a5;
            return (_a5 = this.onScanPorts) == null ? void 0 : _a5.call(
              this,
              ports.map((p) => ({ ip: p.Ip, port: p.Port, state: p.State }))
            );
          } : void 0;
          yield this._handleSubscriptions(
            portsHandler ? this._subscribe(codeSnippetService, portsHandler, "scanOpenedPorts") : void 0
          );
          if (this.cwd) {
            yield this.filesystem.makeDir(this.cwd);
          }
          if (this.opts.onStdout || this.opts.onStderr) {
            this.handleStartCmdLogs();
          }
          return this;
        });
      }
      handleStartCmdLogs() {
        return __async(this, null, function* () {
          var _a5, _b;
          try {
            yield this.process.startAndWait({
              cmd: "sudo journalctl --follow --lines=all -o cat _SYSTEMD_UNIT=start_cmd.service",
              envVars: {},
              cwd: "/"
            });
          } catch (err) {
            (_b = (_a5 = this.logger).debug) == null ? void 0 : _b.call(_a5, "start command not started", err);
          }
        });
      }
    };
    var CodeRuntime = /* @__PURE__ */ ((CodeRuntime2) => {
      CodeRuntime2["Node16"] = "Node16";
      CodeRuntime2["Python3"] = "Python3";
      CodeRuntime2["Bash"] = "Bash";
      CodeRuntime2["Python3_DataAnalysis"] = "Python3-DataAnalysis";
      return CodeRuntime2;
    })(CodeRuntime || {});
    function runCode(runtime, code, opts) {
      return __async(this, null, function* () {
        var _a5;
        let binary = "";
        let filepath = "";
        let envID = "";
        switch (runtime) {
          case "Node16":
            envID = "base";
            binary = "node";
            filepath = "/index.js";
            break;
          case "Python3":
            envID = "base";
            binary = "python3";
            filepath = "/main.py";
            break;
          case "Python3-DataAnalysis":
            envID = "Python3-DataAnalysis";
            binary = "python3";
            filepath = "/main.py";
            break;
          case "Bash":
            envID = "base";
            binary = "bash";
            filepath = "/main.sh";
            break;
          default:
            throw new Error(
              `The "${runtime}" runtime isn't supported. Please contact us (hello@e2b.dev) if you need support for this runtime`
            );
        }
        const sandbox = yield Sandbox2.create({
          template: envID,
          apiKey: (opts == null ? void 0 : opts.apiKey) || ((_a5 = process == null ? void 0 : process.env) == null ? void 0 : _a5.E2B_API_KEY) || ""
          // Sandbox.create will throw an error if the API key is not provided so no need to check here
        });
        yield sandbox.filesystem.write(filepath, code);
        const out = yield sandbox.process.startAndWait(`${binary} ${filepath}`);
        yield sandbox.close();
        return {
          stdout: out.stdout,
          stderr: out.stderr
        };
      });
    }
    __name(runCode, "runCode");
    var Artifact = class {
      static {
        __name(this, "Artifact");
      }
      constructor(path2, sandbox) {
        this.path = path2;
        this._sandbox = sandbox;
      }
    };
    var _DataAnalysis = class extends Sandbox2 {
      static {
        __name(this, "_DataAnalysis");
      }
      /**
       * Use `DataAnalysis.create()` instead.
       * 
       * @hidden
       * @hide
       * @internal
       * @access protected
       */
      constructor(opts) {
        super(__spreadValues({ template: opts.template || _DataAnalysis.template }, opts));
      }
      static create(opts) {
        return __async(this, null, function* () {
          const sandbox = new _DataAnalysis(__spreadValues({}, opts ? opts : {}));
          yield sandbox._open({ timeout: opts == null ? void 0 : opts.timeout });
          return sandbox;
        });
      }
      runPython(_0) {
        return __async(this, arguments, function* (code, opts = {}) {
          const artifacts = [];
          const registerArtifacts = /* @__PURE__ */ __name((event) => __async(this, null, function* () {
            var _a5;
            if (event.operation === "Create") {
              const artifact = new Artifact(event.path, this);
              artifacts.push(event.path);
              yield (_a5 = opts.onArtifact) == null ? void 0 : _a5.call(opts, artifact);
            }
          }), "registerArtifacts");
          const watcher = this.filesystem.watchDir("/home/user/artifacts");
          watcher.addEventListener(registerArtifacts);
          yield watcher.start();
          const currentEpoch = (/* @__PURE__ */ new Date()).getTime();
          const codefilePath = `/tmp/main-${currentEpoch}.py`;
          yield this.filesystem.write(codefilePath, code);
          const output = yield this.process.startAndWait(__spreadValues({
            cmd: `python ${codefilePath}`
          }, opts));
          yield watcher.stop();
          return {
            stdout: output.stdout,
            stderr: output.stderr,
            artifacts: artifacts.map((artifact) => new Artifact(artifact, this))
          };
        });
      }
      installPythonPackages(packageNames) {
        return __async(this, null, function* () {
          yield this.installPackages("pip install", packageNames);
        });
      }
      installSystemPackages(packageNames) {
        return __async(this, null, function* () {
          yield this.installPackages("sudo apt-get install -y", packageNames);
        });
      }
      installPackages(command, packageNames) {
        return __async(this, null, function* () {
          if (Array.isArray(packageNames)) {
            packageNames = packageNames.join(" ");
          }
          packageNames = packageNames.trim();
          if (packageNames.length === 0) {
            return;
          }
          const out = yield this.process.startAndWait(`${command} ${packageNames}`);
          if (out.exitCode !== 0) {
            throw new Error(`Failed to install package ${packageNames}: ${out.stderr}`);
          }
        });
      }
    };
    var DataAnalysis = _DataAnalysis;
    DataAnalysis.template = "Python3-DataAnalysis";
    var src_default = Sandbox2;
  }
});

// trigger/run-command.ts
init_esm();
var import_sdk = __toESM(require_dist());
var runCommandTask = task({
  id: "run-command",
  run: /* @__PURE__ */ __name(async (payload) => {
    try {
      const sandbox = await import_sdk.Sandbox.reconnect(payload.sandboxId);
      const fullCommand = `${payload.command} ${payload.args.join(" ")}`;
      console.log(`Executing E2B: ${fullCommand}`);
      const result = await sandbox.commands.run(fullCommand);
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode
      };
    } catch (error) {
      console.error("E2B Execution failed:", error);
      return {
        stdout: "",
        stderr: error.message,
        exitCode: 1
      };
    }
  }, "run")
});
export {
  runCommandTask
};
/*! Bundled license information:

platform/platform.js:
  (*!
   * Platform.js v1.3.6
   * Copyright 2014-2020 Benjamin Tan
   * Copyright 2011-2013 John-David Dalton
   * Available under MIT license
   *)

normalize-path/index.js:
  (*!
   * normalize-path <https://github.com/jonschlinkert/normalize-path>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
//# sourceMappingURL=run-command.mjs.map
