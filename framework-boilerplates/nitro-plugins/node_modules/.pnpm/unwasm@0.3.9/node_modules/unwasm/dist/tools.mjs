// webassemblyjs (MIT) - Copyright (c) 2018 Sven Sauleau <sven@sauleau.com>

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/@webassemblyjs+helper-api-error@1.11.6/node_modules/@webassemblyjs/helper-api-error/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+helper-api-error@1.11.6/node_modules/@webassemblyjs/helper-api-error/lib/index.js"(exports) {
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LinkError = exports.CompileError = exports.RuntimeError = void 0;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      if (superClass)
        _setPrototypeOf(subClass, superClass);
    }
    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();
      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;
          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
      };
    }
    function _possibleConstructorReturn(self, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized(self);
    }
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
        if (Class2 === null || !_isNativeFunction(Class2))
          return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2))
            return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
        return _setPrototypeOf(Wrapper, Class2);
      };
      return _wrapNativeSuper(Class);
    }
    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct2(Parent2, args2, Class2) {
          var a = [null];
          a.push.apply(a, args2);
          var Constructor = Function.bind.apply(Parent2, a);
          var instance = new Constructor();
          if (Class2)
            _setPrototypeOf(instance, Class2.prototype);
          return instance;
        };
      }
      return _construct.apply(null, arguments);
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e) {
        return false;
      }
    }
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    var RuntimeError = /* @__PURE__ */ function(_Error) {
      _inherits(RuntimeError2, _Error);
      var _super = _createSuper(RuntimeError2);
      function RuntimeError2() {
        _classCallCheck(this, RuntimeError2);
        return _super.apply(this, arguments);
      }
      return RuntimeError2;
    }(/* @__PURE__ */ _wrapNativeSuper(Error));
    exports.RuntimeError = RuntimeError;
    var CompileError = /* @__PURE__ */ function(_Error2) {
      _inherits(CompileError2, _Error2);
      var _super2 = _createSuper(CompileError2);
      function CompileError2() {
        _classCallCheck(this, CompileError2);
        return _super2.apply(this, arguments);
      }
      return CompileError2;
    }(/* @__PURE__ */ _wrapNativeSuper(Error));
    exports.CompileError = CompileError;
    var LinkError = /* @__PURE__ */ function(_Error3) {
      _inherits(LinkError2, _Error3);
      var _super3 = _createSuper(LinkError2);
      function LinkError2() {
        _classCallCheck(this, LinkError2);
        return _super3.apply(this, arguments);
      }
      return LinkError2;
    }(/* @__PURE__ */ _wrapNativeSuper(Error));
    exports.LinkError = LinkError;
  }
});

// node_modules/.pnpm/@xtuc+ieee754@1.2.0/node_modules/@xtuc/ieee754/dist/index.cjs.js
var require_index_cjs = __commonJS({
  "node_modules/.pnpm/@xtuc+ieee754@1.2.0/node_modules/@xtuc/ieee754/dist/index.cjs.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.read = read;
    exports.write = write;
    function read(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    }
    function write(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ieee754@1.12.1/node_modules/@webassemblyjs/ieee754/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ieee754@1.12.1/node_modules/@webassemblyjs/ieee754/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.encodeF32 = encodeF32;
    exports.encodeF64 = encodeF64;
    exports.decodeF32 = decodeF32;
    exports.decodeF64 = decodeF64;
    exports.DOUBLE_PRECISION_MANTISSA = exports.SINGLE_PRECISION_MANTISSA = exports.NUMBER_OF_BYTE_F64 = exports.NUMBER_OF_BYTE_F32 = void 0;
    var _ieee = require_index_cjs();
    var NUMBER_OF_BYTE_F32 = 4;
    exports.NUMBER_OF_BYTE_F32 = NUMBER_OF_BYTE_F32;
    var NUMBER_OF_BYTE_F64 = 8;
    exports.NUMBER_OF_BYTE_F64 = NUMBER_OF_BYTE_F64;
    var SINGLE_PRECISION_MANTISSA = 23;
    exports.SINGLE_PRECISION_MANTISSA = SINGLE_PRECISION_MANTISSA;
    var DOUBLE_PRECISION_MANTISSA = 52;
    exports.DOUBLE_PRECISION_MANTISSA = DOUBLE_PRECISION_MANTISSA;
    function encodeF32(v) {
      var buffer = [];
      (0, _ieee.write)(buffer, v, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
      return buffer;
    }
    function encodeF64(v) {
      var buffer = [];
      (0, _ieee.write)(buffer, v, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
      return buffer;
    }
    function decodeF32(bytes) {
      var buffer = new Uint8Array(bytes);
      return (0, _ieee.read)(buffer, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
    }
    function decodeF64(bytes) {
      var buffer = new Uint8Array(bytes);
      return (0, _ieee.read)(buffer, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+utf8@1.12.1/node_modules/@webassemblyjs/utf8/lib/decoder.js
var require_decoder = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+utf8@1.12.1/node_modules/@webassemblyjs/utf8/lib/decoder.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.decode = decode2;
    function con(b) {
      if ((b & 192) === 128) {
        return b & 63;
      } else {
        throw new Error("invalid UTF-8 encoding");
      }
    }
    function code(min, n) {
      if (n < min || 55296 <= n && n < 57344 || n >= 65536) {
        throw new Error("invalid UTF-8 encoding");
      } else {
        return n;
      }
    }
    function decode2(bytes) {
      return _decode(bytes).map(function(x) {
        return String.fromCharCode(x);
      }).join("");
    }
    function _decode(bytes) {
      var result = [];
      while (bytes.length > 0) {
        var b1 = bytes[0];
        if (b1 < 128) {
          result.push(code(0, b1));
          bytes = bytes.slice(1);
          continue;
        }
        if (b1 < 192) {
          throw new Error("invalid UTF-8 encoding");
        }
        var b2 = bytes[1];
        if (b1 < 224) {
          result.push(code(128, ((b1 & 31) << 6) + con(b2)));
          bytes = bytes.slice(2);
          continue;
        }
        var b3 = bytes[2];
        if (b1 < 240) {
          result.push(code(2048, ((b1 & 15) << 12) + (con(b2) << 6) + con(b3)));
          bytes = bytes.slice(3);
          continue;
        }
        var b4 = bytes[3];
        if (b1 < 248) {
          result.push(code(65536, (((b1 & 7) << 18) + con(b2) << 12) + (con(b3) << 6) + con(b4)));
          bytes = bytes.slice(4);
          continue;
        }
        throw new Error("invalid UTF-8 encoding");
      }
      return result;
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+utf8@1.12.1/node_modules/@webassemblyjs/utf8/lib/encoder.js
var require_encoder = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+utf8@1.12.1/node_modules/@webassemblyjs/utf8/lib/encoder.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.encode = encode;
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr))
        return _arrayLikeToArray(arr);
    }
    function _toArray(arr) {
      return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
        return Array.from(iter);
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr))
        return arr;
    }
    function con(n) {
      return 128 | n & 63;
    }
    function encode(str) {
      var arr = str.split("").map(function(x) {
        return x.charCodeAt(0);
      });
      return _encode(arr);
    }
    function _encode(arr) {
      if (arr.length === 0) {
        return [];
      }
      var _arr = _toArray(arr), n = _arr[0], ns = _arr.slice(1);
      if (n < 0) {
        throw new Error("utf8");
      }
      if (n < 128) {
        return [n].concat(_toConsumableArray(_encode(ns)));
      }
      if (n < 2048) {
        return [192 | n >>> 6, con(n)].concat(_toConsumableArray(_encode(ns)));
      }
      if (n < 65536) {
        return [224 | n >>> 12, con(n >>> 6), con(n)].concat(_toConsumableArray(_encode(ns)));
      }
      if (n < 1114112) {
        return [240 | n >>> 18, con(n >>> 12), con(n >>> 6), con(n)].concat(_toConsumableArray(_encode(ns)));
      }
      throw new Error("utf8");
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+utf8@1.12.1/node_modules/@webassemblyjs/utf8/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+utf8@1.12.1/node_modules/@webassemblyjs/utf8/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "decode", {
      enumerable: true,
      get: function get() {
        return _decoder.decode;
      }
    });
    Object.defineProperty(exports, "encode", {
      enumerable: true,
      get: function get() {
        return _encoder.encode;
      }
    });
    var _decoder = require_decoder();
    var _encoder = require_encoder();
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/nodes.js
var require_nodes = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/nodes.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.module = _module;
    exports.moduleMetadata = moduleMetadata;
    exports.moduleNameMetadata = moduleNameMetadata;
    exports.functionNameMetadata = functionNameMetadata;
    exports.localNameMetadata = localNameMetadata;
    exports.binaryModule = binaryModule;
    exports.quoteModule = quoteModule;
    exports.sectionMetadata = sectionMetadata;
    exports.producersSectionMetadata = producersSectionMetadata;
    exports.producerMetadata = producerMetadata;
    exports.producerMetadataVersionedName = producerMetadataVersionedName;
    exports.loopInstruction = loopInstruction;
    exports.instr = instr;
    exports.ifInstruction = ifInstruction;
    exports.stringLiteral = stringLiteral;
    exports.numberLiteral = numberLiteral;
    exports.longNumberLiteral = longNumberLiteral;
    exports.floatLiteral = floatLiteral;
    exports.elem = elem;
    exports.indexInFuncSection = indexInFuncSection;
    exports.valtypeLiteral = valtypeLiteral;
    exports.typeInstruction = typeInstruction;
    exports.start = start;
    exports.globalType = globalType;
    exports.leadingComment = leadingComment;
    exports.blockComment = blockComment;
    exports.data = data;
    exports.global = global;
    exports.table = table;
    exports.memory = memory;
    exports.funcImportDescr = funcImportDescr;
    exports.moduleImport = moduleImport;
    exports.moduleExportDescr = moduleExportDescr;
    exports.moduleExport = moduleExport;
    exports.limit = limit;
    exports.signature = signature;
    exports.program = program;
    exports.identifier = identifier;
    exports.blockInstruction = blockInstruction;
    exports.callInstruction = callInstruction;
    exports.callIndirectInstruction = callIndirectInstruction;
    exports.byteArray = byteArray;
    exports.func = func;
    exports.internalBrUnless = internalBrUnless;
    exports.internalGoto = internalGoto;
    exports.internalCallExtern = internalCallExtern;
    exports.internalEndAndReturn = internalEndAndReturn;
    exports.assertInternalCallExtern = exports.assertInternalGoto = exports.assertInternalBrUnless = exports.assertFunc = exports.assertByteArray = exports.assertCallIndirectInstruction = exports.assertCallInstruction = exports.assertBlockInstruction = exports.assertIdentifier = exports.assertProgram = exports.assertSignature = exports.assertLimit = exports.assertModuleExport = exports.assertModuleExportDescr = exports.assertModuleImport = exports.assertFuncImportDescr = exports.assertMemory = exports.assertTable = exports.assertGlobal = exports.assertData = exports.assertBlockComment = exports.assertLeadingComment = exports.assertGlobalType = exports.assertStart = exports.assertTypeInstruction = exports.assertValtypeLiteral = exports.assertIndexInFuncSection = exports.assertElem = exports.assertFloatLiteral = exports.assertLongNumberLiteral = exports.assertNumberLiteral = exports.assertStringLiteral = exports.assertIfInstruction = exports.assertInstr = exports.assertLoopInstruction = exports.assertProducerMetadataVersionedName = exports.assertProducerMetadata = exports.assertProducersSectionMetadata = exports.assertSectionMetadata = exports.assertQuoteModule = exports.assertBinaryModule = exports.assertLocalNameMetadata = exports.assertFunctionNameMetadata = exports.assertModuleNameMetadata = exports.assertModuleMetadata = exports.assertModule = exports.isIntrinsic = exports.isImportDescr = exports.isNumericLiteral = exports.isExpression = exports.isInstruction = exports.isBlock = exports.isNode = exports.isInternalEndAndReturn = exports.isInternalCallExtern = exports.isInternalGoto = exports.isInternalBrUnless = exports.isFunc = exports.isByteArray = exports.isCallIndirectInstruction = exports.isCallInstruction = exports.isBlockInstruction = exports.isIdentifier = exports.isProgram = exports.isSignature = exports.isLimit = exports.isModuleExport = exports.isModuleExportDescr = exports.isModuleImport = exports.isFuncImportDescr = exports.isMemory = exports.isTable = exports.isGlobal = exports.isData = exports.isBlockComment = exports.isLeadingComment = exports.isGlobalType = exports.isStart = exports.isTypeInstruction = exports.isValtypeLiteral = exports.isIndexInFuncSection = exports.isElem = exports.isFloatLiteral = exports.isLongNumberLiteral = exports.isNumberLiteral = exports.isStringLiteral = exports.isIfInstruction = exports.isInstr = exports.isLoopInstruction = exports.isProducerMetadataVersionedName = exports.isProducerMetadata = exports.isProducersSectionMetadata = exports.isSectionMetadata = exports.isQuoteModule = exports.isBinaryModule = exports.isLocalNameMetadata = exports.isFunctionNameMetadata = exports.isModuleNameMetadata = exports.isModuleMetadata = exports.isModule = void 0;
    exports.nodeAndUnionTypes = exports.unionTypesMap = exports.assertInternalEndAndReturn = void 0;
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function isTypeOf(t) {
      return function(n) {
        return n.type === t;
      };
    }
    function assertTypeOf(t) {
      return function(n) {
        return function() {
          if (!(n.type === t)) {
            throw new Error("n.type === t error: unknown");
          }
        }();
      };
    }
    function _module(id, fields, metadata) {
      if (id !== null && id !== void 0) {
        if (!(typeof id === "string")) {
          throw new Error('typeof id === "string" error: ' + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
        }
      }
      if (!(_typeof(fields) === "object" && typeof fields.length !== "undefined")) {
        throw new Error('typeof fields === "object" && typeof fields.length !== "undefined" error: unknown');
      }
      var node = {
        type: "Module",
        id,
        fields
      };
      if (typeof metadata !== "undefined") {
        node.metadata = metadata;
      }
      return node;
    }
    function moduleMetadata(sections, functionNames, localNames, producers) {
      if (!(_typeof(sections) === "object" && typeof sections.length !== "undefined")) {
        throw new Error('typeof sections === "object" && typeof sections.length !== "undefined" error: unknown');
      }
      if (functionNames !== null && functionNames !== void 0) {
        if (!(_typeof(functionNames) === "object" && typeof functionNames.length !== "undefined")) {
          throw new Error('typeof functionNames === "object" && typeof functionNames.length !== "undefined" error: unknown');
        }
      }
      if (localNames !== null && localNames !== void 0) {
        if (!(_typeof(localNames) === "object" && typeof localNames.length !== "undefined")) {
          throw new Error('typeof localNames === "object" && typeof localNames.length !== "undefined" error: unknown');
        }
      }
      if (producers !== null && producers !== void 0) {
        if (!(_typeof(producers) === "object" && typeof producers.length !== "undefined")) {
          throw new Error('typeof producers === "object" && typeof producers.length !== "undefined" error: unknown');
        }
      }
      var node = {
        type: "ModuleMetadata",
        sections
      };
      if (typeof functionNames !== "undefined" && functionNames.length > 0) {
        node.functionNames = functionNames;
      }
      if (typeof localNames !== "undefined" && localNames.length > 0) {
        node.localNames = localNames;
      }
      if (typeof producers !== "undefined" && producers.length > 0) {
        node.producers = producers;
      }
      return node;
    }
    function moduleNameMetadata(value) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      var node = {
        type: "ModuleNameMetadata",
        value
      };
      return node;
    }
    function functionNameMetadata(value, index) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      if (!(typeof index === "number")) {
        throw new Error('typeof index === "number" error: ' + ("Argument index must be of type number, given: " + _typeof(index) || "unknown"));
      }
      var node = {
        type: "FunctionNameMetadata",
        value,
        index
      };
      return node;
    }
    function localNameMetadata(value, localIndex, functionIndex) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      if (!(typeof localIndex === "number")) {
        throw new Error('typeof localIndex === "number" error: ' + ("Argument localIndex must be of type number, given: " + _typeof(localIndex) || "unknown"));
      }
      if (!(typeof functionIndex === "number")) {
        throw new Error('typeof functionIndex === "number" error: ' + ("Argument functionIndex must be of type number, given: " + _typeof(functionIndex) || "unknown"));
      }
      var node = {
        type: "LocalNameMetadata",
        value,
        localIndex,
        functionIndex
      };
      return node;
    }
    function binaryModule(id, blob) {
      if (id !== null && id !== void 0) {
        if (!(typeof id === "string")) {
          throw new Error('typeof id === "string" error: ' + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
        }
      }
      if (!(_typeof(blob) === "object" && typeof blob.length !== "undefined")) {
        throw new Error('typeof blob === "object" && typeof blob.length !== "undefined" error: unknown');
      }
      var node = {
        type: "BinaryModule",
        id,
        blob
      };
      return node;
    }
    function quoteModule(id, string) {
      if (id !== null && id !== void 0) {
        if (!(typeof id === "string")) {
          throw new Error('typeof id === "string" error: ' + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
        }
      }
      if (!(_typeof(string) === "object" && typeof string.length !== "undefined")) {
        throw new Error('typeof string === "object" && typeof string.length !== "undefined" error: unknown');
      }
      var node = {
        type: "QuoteModule",
        id,
        string
      };
      return node;
    }
    function sectionMetadata(section, startOffset, size, vectorOfSize) {
      if (!(typeof startOffset === "number")) {
        throw new Error('typeof startOffset === "number" error: ' + ("Argument startOffset must be of type number, given: " + _typeof(startOffset) || "unknown"));
      }
      var node = {
        type: "SectionMetadata",
        section,
        startOffset,
        size,
        vectorOfSize
      };
      return node;
    }
    function producersSectionMetadata(producers) {
      if (!(_typeof(producers) === "object" && typeof producers.length !== "undefined")) {
        throw new Error('typeof producers === "object" && typeof producers.length !== "undefined" error: unknown');
      }
      var node = {
        type: "ProducersSectionMetadata",
        producers
      };
      return node;
    }
    function producerMetadata(language, processedBy, sdk) {
      if (!(_typeof(language) === "object" && typeof language.length !== "undefined")) {
        throw new Error('typeof language === "object" && typeof language.length !== "undefined" error: unknown');
      }
      if (!(_typeof(processedBy) === "object" && typeof processedBy.length !== "undefined")) {
        throw new Error('typeof processedBy === "object" && typeof processedBy.length !== "undefined" error: unknown');
      }
      if (!(_typeof(sdk) === "object" && typeof sdk.length !== "undefined")) {
        throw new Error('typeof sdk === "object" && typeof sdk.length !== "undefined" error: unknown');
      }
      var node = {
        type: "ProducerMetadata",
        language,
        processedBy,
        sdk
      };
      return node;
    }
    function producerMetadataVersionedName(name, version) {
      if (!(typeof name === "string")) {
        throw new Error('typeof name === "string" error: ' + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
      }
      if (!(typeof version === "string")) {
        throw new Error('typeof version === "string" error: ' + ("Argument version must be of type string, given: " + _typeof(version) || "unknown"));
      }
      var node = {
        type: "ProducerMetadataVersionedName",
        name,
        version
      };
      return node;
    }
    function loopInstruction(label, resulttype, instr2) {
      if (!(_typeof(instr2) === "object" && typeof instr2.length !== "undefined")) {
        throw new Error('typeof instr === "object" && typeof instr.length !== "undefined" error: unknown');
      }
      var node = {
        type: "LoopInstruction",
        id: "loop",
        label,
        resulttype,
        instr: instr2
      };
      return node;
    }
    function instr(id, object, args, namedArgs) {
      if (!(typeof id === "string")) {
        throw new Error('typeof id === "string" error: ' + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
      }
      if (!(_typeof(args) === "object" && typeof args.length !== "undefined")) {
        throw new Error('typeof args === "object" && typeof args.length !== "undefined" error: unknown');
      }
      var node = {
        type: "Instr",
        id,
        args
      };
      if (typeof object !== "undefined") {
        node.object = object;
      }
      if (typeof namedArgs !== "undefined" && Object.keys(namedArgs).length !== 0) {
        node.namedArgs = namedArgs;
      }
      return node;
    }
    function ifInstruction(testLabel, test, result, consequent, alternate) {
      if (!(_typeof(test) === "object" && typeof test.length !== "undefined")) {
        throw new Error('typeof test === "object" && typeof test.length !== "undefined" error: unknown');
      }
      if (!(_typeof(consequent) === "object" && typeof consequent.length !== "undefined")) {
        throw new Error('typeof consequent === "object" && typeof consequent.length !== "undefined" error: unknown');
      }
      if (!(_typeof(alternate) === "object" && typeof alternate.length !== "undefined")) {
        throw new Error('typeof alternate === "object" && typeof alternate.length !== "undefined" error: unknown');
      }
      var node = {
        type: "IfInstruction",
        id: "if",
        testLabel,
        test,
        result,
        consequent,
        alternate
      };
      return node;
    }
    function stringLiteral(value) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      var node = {
        type: "StringLiteral",
        value
      };
      return node;
    }
    function numberLiteral(value, raw) {
      if (!(typeof value === "number")) {
        throw new Error('typeof value === "number" error: ' + ("Argument value must be of type number, given: " + _typeof(value) || "unknown"));
      }
      if (!(typeof raw === "string")) {
        throw new Error('typeof raw === "string" error: ' + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
      }
      var node = {
        type: "NumberLiteral",
        value,
        raw
      };
      return node;
    }
    function longNumberLiteral(value, raw) {
      if (!(typeof raw === "string")) {
        throw new Error('typeof raw === "string" error: ' + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
      }
      var node = {
        type: "LongNumberLiteral",
        value,
        raw
      };
      return node;
    }
    function floatLiteral(value, nan, inf, raw) {
      if (!(typeof value === "number")) {
        throw new Error('typeof value === "number" error: ' + ("Argument value must be of type number, given: " + _typeof(value) || "unknown"));
      }
      if (nan !== null && nan !== void 0) {
        if (!(typeof nan === "boolean")) {
          throw new Error('typeof nan === "boolean" error: ' + ("Argument nan must be of type boolean, given: " + _typeof(nan) || "unknown"));
        }
      }
      if (inf !== null && inf !== void 0) {
        if (!(typeof inf === "boolean")) {
          throw new Error('typeof inf === "boolean" error: ' + ("Argument inf must be of type boolean, given: " + _typeof(inf) || "unknown"));
        }
      }
      if (!(typeof raw === "string")) {
        throw new Error('typeof raw === "string" error: ' + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
      }
      var node = {
        type: "FloatLiteral",
        value,
        raw
      };
      if (nan === true) {
        node.nan = true;
      }
      if (inf === true) {
        node.inf = true;
      }
      return node;
    }
    function elem(table2, offset, funcs) {
      if (!(_typeof(offset) === "object" && typeof offset.length !== "undefined")) {
        throw new Error('typeof offset === "object" && typeof offset.length !== "undefined" error: unknown');
      }
      if (!(_typeof(funcs) === "object" && typeof funcs.length !== "undefined")) {
        throw new Error('typeof funcs === "object" && typeof funcs.length !== "undefined" error: unknown');
      }
      var node = {
        type: "Elem",
        table: table2,
        offset,
        funcs
      };
      return node;
    }
    function indexInFuncSection(index) {
      var node = {
        type: "IndexInFuncSection",
        index
      };
      return node;
    }
    function valtypeLiteral(name) {
      var node = {
        type: "ValtypeLiteral",
        name
      };
      return node;
    }
    function typeInstruction(id, functype) {
      var node = {
        type: "TypeInstruction",
        id,
        functype
      };
      return node;
    }
    function start(index) {
      var node = {
        type: "Start",
        index
      };
      return node;
    }
    function globalType(valtype, mutability) {
      var node = {
        type: "GlobalType",
        valtype,
        mutability
      };
      return node;
    }
    function leadingComment(value) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      var node = {
        type: "LeadingComment",
        value
      };
      return node;
    }
    function blockComment(value) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      var node = {
        type: "BlockComment",
        value
      };
      return node;
    }
    function data(memoryIndex, offset, init) {
      var node = {
        type: "Data",
        memoryIndex,
        offset,
        init
      };
      return node;
    }
    function global(globalType2, init, name) {
      if (!(_typeof(init) === "object" && typeof init.length !== "undefined")) {
        throw new Error('typeof init === "object" && typeof init.length !== "undefined" error: unknown');
      }
      var node = {
        type: "Global",
        globalType: globalType2,
        init,
        name
      };
      return node;
    }
    function table(elementType, limits, name, elements) {
      if (!(limits.type === "Limit")) {
        throw new Error('limits.type === "Limit" error: ' + ("Argument limits must be of type Limit, given: " + limits.type || "unknown"));
      }
      if (elements !== null && elements !== void 0) {
        if (!(_typeof(elements) === "object" && typeof elements.length !== "undefined")) {
          throw new Error('typeof elements === "object" && typeof elements.length !== "undefined" error: unknown');
        }
      }
      var node = {
        type: "Table",
        elementType,
        limits,
        name
      };
      if (typeof elements !== "undefined" && elements.length > 0) {
        node.elements = elements;
      }
      return node;
    }
    function memory(limits, id) {
      var node = {
        type: "Memory",
        limits,
        id
      };
      return node;
    }
    function funcImportDescr(id, signature2) {
      var node = {
        type: "FuncImportDescr",
        id,
        signature: signature2
      };
      return node;
    }
    function moduleImport(module2, name, descr) {
      if (!(typeof module2 === "string")) {
        throw new Error('typeof module === "string" error: ' + ("Argument module must be of type string, given: " + _typeof(module2) || "unknown"));
      }
      if (!(typeof name === "string")) {
        throw new Error('typeof name === "string" error: ' + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
      }
      var node = {
        type: "ModuleImport",
        module: module2,
        name,
        descr
      };
      return node;
    }
    function moduleExportDescr(exportType, id) {
      var node = {
        type: "ModuleExportDescr",
        exportType,
        id
      };
      return node;
    }
    function moduleExport(name, descr) {
      if (!(typeof name === "string")) {
        throw new Error('typeof name === "string" error: ' + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
      }
      var node = {
        type: "ModuleExport",
        name,
        descr
      };
      return node;
    }
    function limit(min, max, shared) {
      if (!(typeof min === "number")) {
        throw new Error('typeof min === "number" error: ' + ("Argument min must be of type number, given: " + _typeof(min) || "unknown"));
      }
      if (max !== null && max !== void 0) {
        if (!(typeof max === "number")) {
          throw new Error('typeof max === "number" error: ' + ("Argument max must be of type number, given: " + _typeof(max) || "unknown"));
        }
      }
      if (shared !== null && shared !== void 0) {
        if (!(typeof shared === "boolean")) {
          throw new Error('typeof shared === "boolean" error: ' + ("Argument shared must be of type boolean, given: " + _typeof(shared) || "unknown"));
        }
      }
      var node = {
        type: "Limit",
        min
      };
      if (typeof max !== "undefined") {
        node.max = max;
      }
      if (shared === true) {
        node.shared = true;
      }
      return node;
    }
    function signature(params, results) {
      if (!(_typeof(params) === "object" && typeof params.length !== "undefined")) {
        throw new Error('typeof params === "object" && typeof params.length !== "undefined" error: unknown');
      }
      if (!(_typeof(results) === "object" && typeof results.length !== "undefined")) {
        throw new Error('typeof results === "object" && typeof results.length !== "undefined" error: unknown');
      }
      var node = {
        type: "Signature",
        params,
        results
      };
      return node;
    }
    function program(body) {
      if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) {
        throw new Error('typeof body === "object" && typeof body.length !== "undefined" error: unknown');
      }
      var node = {
        type: "Program",
        body
      };
      return node;
    }
    function identifier(value, raw) {
      if (!(typeof value === "string")) {
        throw new Error('typeof value === "string" error: ' + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
      }
      if (raw !== null && raw !== void 0) {
        if (!(typeof raw === "string")) {
          throw new Error('typeof raw === "string" error: ' + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
        }
      }
      var node = {
        type: "Identifier",
        value
      };
      if (typeof raw !== "undefined") {
        node.raw = raw;
      }
      return node;
    }
    function blockInstruction(label, instr2, result) {
      if (!(_typeof(instr2) === "object" && typeof instr2.length !== "undefined")) {
        throw new Error('typeof instr === "object" && typeof instr.length !== "undefined" error: unknown');
      }
      var node = {
        type: "BlockInstruction",
        id: "block",
        label,
        instr: instr2,
        result
      };
      return node;
    }
    function callInstruction(index, instrArgs, numeric) {
      if (instrArgs !== null && instrArgs !== void 0) {
        if (!(_typeof(instrArgs) === "object" && typeof instrArgs.length !== "undefined")) {
          throw new Error('typeof instrArgs === "object" && typeof instrArgs.length !== "undefined" error: unknown');
        }
      }
      var node = {
        type: "CallInstruction",
        id: "call",
        index
      };
      if (typeof instrArgs !== "undefined" && instrArgs.length > 0) {
        node.instrArgs = instrArgs;
      }
      if (typeof numeric !== "undefined") {
        node.numeric = numeric;
      }
      return node;
    }
    function callIndirectInstruction(signature2, intrs) {
      if (intrs !== null && intrs !== void 0) {
        if (!(_typeof(intrs) === "object" && typeof intrs.length !== "undefined")) {
          throw new Error('typeof intrs === "object" && typeof intrs.length !== "undefined" error: unknown');
        }
      }
      var node = {
        type: "CallIndirectInstruction",
        id: "call_indirect",
        signature: signature2
      };
      if (typeof intrs !== "undefined" && intrs.length > 0) {
        node.intrs = intrs;
      }
      return node;
    }
    function byteArray(values) {
      if (!(_typeof(values) === "object" && typeof values.length !== "undefined")) {
        throw new Error('typeof values === "object" && typeof values.length !== "undefined" error: unknown');
      }
      var node = {
        type: "ByteArray",
        values
      };
      return node;
    }
    function func(name, signature2, body, isExternal, metadata) {
      if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) {
        throw new Error('typeof body === "object" && typeof body.length !== "undefined" error: unknown');
      }
      if (isExternal !== null && isExternal !== void 0) {
        if (!(typeof isExternal === "boolean")) {
          throw new Error('typeof isExternal === "boolean" error: ' + ("Argument isExternal must be of type boolean, given: " + _typeof(isExternal) || "unknown"));
        }
      }
      var node = {
        type: "Func",
        name,
        signature: signature2,
        body
      };
      if (isExternal === true) {
        node.isExternal = true;
      }
      if (typeof metadata !== "undefined") {
        node.metadata = metadata;
      }
      return node;
    }
    function internalBrUnless(target) {
      if (!(typeof target === "number")) {
        throw new Error('typeof target === "number" error: ' + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
      }
      var node = {
        type: "InternalBrUnless",
        target
      };
      return node;
    }
    function internalGoto(target) {
      if (!(typeof target === "number")) {
        throw new Error('typeof target === "number" error: ' + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
      }
      var node = {
        type: "InternalGoto",
        target
      };
      return node;
    }
    function internalCallExtern(target) {
      if (!(typeof target === "number")) {
        throw new Error('typeof target === "number" error: ' + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
      }
      var node = {
        type: "InternalCallExtern",
        target
      };
      return node;
    }
    function internalEndAndReturn() {
      var node = {
        type: "InternalEndAndReturn"
      };
      return node;
    }
    var isModule = isTypeOf("Module");
    exports.isModule = isModule;
    var isModuleMetadata = isTypeOf("ModuleMetadata");
    exports.isModuleMetadata = isModuleMetadata;
    var isModuleNameMetadata = isTypeOf("ModuleNameMetadata");
    exports.isModuleNameMetadata = isModuleNameMetadata;
    var isFunctionNameMetadata = isTypeOf("FunctionNameMetadata");
    exports.isFunctionNameMetadata = isFunctionNameMetadata;
    var isLocalNameMetadata = isTypeOf("LocalNameMetadata");
    exports.isLocalNameMetadata = isLocalNameMetadata;
    var isBinaryModule = isTypeOf("BinaryModule");
    exports.isBinaryModule = isBinaryModule;
    var isQuoteModule = isTypeOf("QuoteModule");
    exports.isQuoteModule = isQuoteModule;
    var isSectionMetadata = isTypeOf("SectionMetadata");
    exports.isSectionMetadata = isSectionMetadata;
    var isProducersSectionMetadata = isTypeOf("ProducersSectionMetadata");
    exports.isProducersSectionMetadata = isProducersSectionMetadata;
    var isProducerMetadata = isTypeOf("ProducerMetadata");
    exports.isProducerMetadata = isProducerMetadata;
    var isProducerMetadataVersionedName = isTypeOf("ProducerMetadataVersionedName");
    exports.isProducerMetadataVersionedName = isProducerMetadataVersionedName;
    var isLoopInstruction = isTypeOf("LoopInstruction");
    exports.isLoopInstruction = isLoopInstruction;
    var isInstr = isTypeOf("Instr");
    exports.isInstr = isInstr;
    var isIfInstruction = isTypeOf("IfInstruction");
    exports.isIfInstruction = isIfInstruction;
    var isStringLiteral = isTypeOf("StringLiteral");
    exports.isStringLiteral = isStringLiteral;
    var isNumberLiteral = isTypeOf("NumberLiteral");
    exports.isNumberLiteral = isNumberLiteral;
    var isLongNumberLiteral = isTypeOf("LongNumberLiteral");
    exports.isLongNumberLiteral = isLongNumberLiteral;
    var isFloatLiteral = isTypeOf("FloatLiteral");
    exports.isFloatLiteral = isFloatLiteral;
    var isElem = isTypeOf("Elem");
    exports.isElem = isElem;
    var isIndexInFuncSection = isTypeOf("IndexInFuncSection");
    exports.isIndexInFuncSection = isIndexInFuncSection;
    var isValtypeLiteral = isTypeOf("ValtypeLiteral");
    exports.isValtypeLiteral = isValtypeLiteral;
    var isTypeInstruction = isTypeOf("TypeInstruction");
    exports.isTypeInstruction = isTypeInstruction;
    var isStart = isTypeOf("Start");
    exports.isStart = isStart;
    var isGlobalType = isTypeOf("GlobalType");
    exports.isGlobalType = isGlobalType;
    var isLeadingComment = isTypeOf("LeadingComment");
    exports.isLeadingComment = isLeadingComment;
    var isBlockComment = isTypeOf("BlockComment");
    exports.isBlockComment = isBlockComment;
    var isData = isTypeOf("Data");
    exports.isData = isData;
    var isGlobal = isTypeOf("Global");
    exports.isGlobal = isGlobal;
    var isTable = isTypeOf("Table");
    exports.isTable = isTable;
    var isMemory = isTypeOf("Memory");
    exports.isMemory = isMemory;
    var isFuncImportDescr = isTypeOf("FuncImportDescr");
    exports.isFuncImportDescr = isFuncImportDescr;
    var isModuleImport = isTypeOf("ModuleImport");
    exports.isModuleImport = isModuleImport;
    var isModuleExportDescr = isTypeOf("ModuleExportDescr");
    exports.isModuleExportDescr = isModuleExportDescr;
    var isModuleExport = isTypeOf("ModuleExport");
    exports.isModuleExport = isModuleExport;
    var isLimit = isTypeOf("Limit");
    exports.isLimit = isLimit;
    var isSignature = isTypeOf("Signature");
    exports.isSignature = isSignature;
    var isProgram = isTypeOf("Program");
    exports.isProgram = isProgram;
    var isIdentifier = isTypeOf("Identifier");
    exports.isIdentifier = isIdentifier;
    var isBlockInstruction = isTypeOf("BlockInstruction");
    exports.isBlockInstruction = isBlockInstruction;
    var isCallInstruction = isTypeOf("CallInstruction");
    exports.isCallInstruction = isCallInstruction;
    var isCallIndirectInstruction = isTypeOf("CallIndirectInstruction");
    exports.isCallIndirectInstruction = isCallIndirectInstruction;
    var isByteArray = isTypeOf("ByteArray");
    exports.isByteArray = isByteArray;
    var isFunc = isTypeOf("Func");
    exports.isFunc = isFunc;
    var isInternalBrUnless = isTypeOf("InternalBrUnless");
    exports.isInternalBrUnless = isInternalBrUnless;
    var isInternalGoto = isTypeOf("InternalGoto");
    exports.isInternalGoto = isInternalGoto;
    var isInternalCallExtern = isTypeOf("InternalCallExtern");
    exports.isInternalCallExtern = isInternalCallExtern;
    var isInternalEndAndReturn = isTypeOf("InternalEndAndReturn");
    exports.isInternalEndAndReturn = isInternalEndAndReturn;
    var isNode = function isNode2(node) {
      return isModule(node) || isModuleMetadata(node) || isModuleNameMetadata(node) || isFunctionNameMetadata(node) || isLocalNameMetadata(node) || isBinaryModule(node) || isQuoteModule(node) || isSectionMetadata(node) || isProducersSectionMetadata(node) || isProducerMetadata(node) || isProducerMetadataVersionedName(node) || isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isElem(node) || isIndexInFuncSection(node) || isValtypeLiteral(node) || isTypeInstruction(node) || isStart(node) || isGlobalType(node) || isLeadingComment(node) || isBlockComment(node) || isData(node) || isGlobal(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node) || isModuleImport(node) || isModuleExportDescr(node) || isModuleExport(node) || isLimit(node) || isSignature(node) || isProgram(node) || isIdentifier(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node) || isByteArray(node) || isFunc(node) || isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
    };
    exports.isNode = isNode;
    var isBlock = function isBlock2(node) {
      return isLoopInstruction(node) || isBlockInstruction(node) || isFunc(node);
    };
    exports.isBlock = isBlock;
    var isInstruction = function isInstruction2(node) {
      return isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isTypeInstruction(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node);
    };
    exports.isInstruction = isInstruction;
    var isExpression = function isExpression2(node) {
      return isInstr(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isValtypeLiteral(node) || isIdentifier(node);
    };
    exports.isExpression = isExpression;
    var isNumericLiteral = function isNumericLiteral2(node) {
      return isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node);
    };
    exports.isNumericLiteral = isNumericLiteral;
    var isImportDescr = function isImportDescr2(node) {
      return isGlobalType(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node);
    };
    exports.isImportDescr = isImportDescr;
    var isIntrinsic = function isIntrinsic2(node) {
      return isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
    };
    exports.isIntrinsic = isIntrinsic;
    var assertModule = assertTypeOf("Module");
    exports.assertModule = assertModule;
    var assertModuleMetadata = assertTypeOf("ModuleMetadata");
    exports.assertModuleMetadata = assertModuleMetadata;
    var assertModuleNameMetadata = assertTypeOf("ModuleNameMetadata");
    exports.assertModuleNameMetadata = assertModuleNameMetadata;
    var assertFunctionNameMetadata = assertTypeOf("FunctionNameMetadata");
    exports.assertFunctionNameMetadata = assertFunctionNameMetadata;
    var assertLocalNameMetadata = assertTypeOf("LocalNameMetadata");
    exports.assertLocalNameMetadata = assertLocalNameMetadata;
    var assertBinaryModule = assertTypeOf("BinaryModule");
    exports.assertBinaryModule = assertBinaryModule;
    var assertQuoteModule = assertTypeOf("QuoteModule");
    exports.assertQuoteModule = assertQuoteModule;
    var assertSectionMetadata = assertTypeOf("SectionMetadata");
    exports.assertSectionMetadata = assertSectionMetadata;
    var assertProducersSectionMetadata = assertTypeOf("ProducersSectionMetadata");
    exports.assertProducersSectionMetadata = assertProducersSectionMetadata;
    var assertProducerMetadata = assertTypeOf("ProducerMetadata");
    exports.assertProducerMetadata = assertProducerMetadata;
    var assertProducerMetadataVersionedName = assertTypeOf("ProducerMetadataVersionedName");
    exports.assertProducerMetadataVersionedName = assertProducerMetadataVersionedName;
    var assertLoopInstruction = assertTypeOf("LoopInstruction");
    exports.assertLoopInstruction = assertLoopInstruction;
    var assertInstr = assertTypeOf("Instr");
    exports.assertInstr = assertInstr;
    var assertIfInstruction = assertTypeOf("IfInstruction");
    exports.assertIfInstruction = assertIfInstruction;
    var assertStringLiteral = assertTypeOf("StringLiteral");
    exports.assertStringLiteral = assertStringLiteral;
    var assertNumberLiteral = assertTypeOf("NumberLiteral");
    exports.assertNumberLiteral = assertNumberLiteral;
    var assertLongNumberLiteral = assertTypeOf("LongNumberLiteral");
    exports.assertLongNumberLiteral = assertLongNumberLiteral;
    var assertFloatLiteral = assertTypeOf("FloatLiteral");
    exports.assertFloatLiteral = assertFloatLiteral;
    var assertElem = assertTypeOf("Elem");
    exports.assertElem = assertElem;
    var assertIndexInFuncSection = assertTypeOf("IndexInFuncSection");
    exports.assertIndexInFuncSection = assertIndexInFuncSection;
    var assertValtypeLiteral = assertTypeOf("ValtypeLiteral");
    exports.assertValtypeLiteral = assertValtypeLiteral;
    var assertTypeInstruction = assertTypeOf("TypeInstruction");
    exports.assertTypeInstruction = assertTypeInstruction;
    var assertStart = assertTypeOf("Start");
    exports.assertStart = assertStart;
    var assertGlobalType = assertTypeOf("GlobalType");
    exports.assertGlobalType = assertGlobalType;
    var assertLeadingComment = assertTypeOf("LeadingComment");
    exports.assertLeadingComment = assertLeadingComment;
    var assertBlockComment = assertTypeOf("BlockComment");
    exports.assertBlockComment = assertBlockComment;
    var assertData = assertTypeOf("Data");
    exports.assertData = assertData;
    var assertGlobal = assertTypeOf("Global");
    exports.assertGlobal = assertGlobal;
    var assertTable = assertTypeOf("Table");
    exports.assertTable = assertTable;
    var assertMemory = assertTypeOf("Memory");
    exports.assertMemory = assertMemory;
    var assertFuncImportDescr = assertTypeOf("FuncImportDescr");
    exports.assertFuncImportDescr = assertFuncImportDescr;
    var assertModuleImport = assertTypeOf("ModuleImport");
    exports.assertModuleImport = assertModuleImport;
    var assertModuleExportDescr = assertTypeOf("ModuleExportDescr");
    exports.assertModuleExportDescr = assertModuleExportDescr;
    var assertModuleExport = assertTypeOf("ModuleExport");
    exports.assertModuleExport = assertModuleExport;
    var assertLimit = assertTypeOf("Limit");
    exports.assertLimit = assertLimit;
    var assertSignature = assertTypeOf("Signature");
    exports.assertSignature = assertSignature;
    var assertProgram = assertTypeOf("Program");
    exports.assertProgram = assertProgram;
    var assertIdentifier = assertTypeOf("Identifier");
    exports.assertIdentifier = assertIdentifier;
    var assertBlockInstruction = assertTypeOf("BlockInstruction");
    exports.assertBlockInstruction = assertBlockInstruction;
    var assertCallInstruction = assertTypeOf("CallInstruction");
    exports.assertCallInstruction = assertCallInstruction;
    var assertCallIndirectInstruction = assertTypeOf("CallIndirectInstruction");
    exports.assertCallIndirectInstruction = assertCallIndirectInstruction;
    var assertByteArray = assertTypeOf("ByteArray");
    exports.assertByteArray = assertByteArray;
    var assertFunc = assertTypeOf("Func");
    exports.assertFunc = assertFunc;
    var assertInternalBrUnless = assertTypeOf("InternalBrUnless");
    exports.assertInternalBrUnless = assertInternalBrUnless;
    var assertInternalGoto = assertTypeOf("InternalGoto");
    exports.assertInternalGoto = assertInternalGoto;
    var assertInternalCallExtern = assertTypeOf("InternalCallExtern");
    exports.assertInternalCallExtern = assertInternalCallExtern;
    var assertInternalEndAndReturn = assertTypeOf("InternalEndAndReturn");
    exports.assertInternalEndAndReturn = assertInternalEndAndReturn;
    var unionTypesMap = {
      Module: ["Node"],
      ModuleMetadata: ["Node"],
      ModuleNameMetadata: ["Node"],
      FunctionNameMetadata: ["Node"],
      LocalNameMetadata: ["Node"],
      BinaryModule: ["Node"],
      QuoteModule: ["Node"],
      SectionMetadata: ["Node"],
      ProducersSectionMetadata: ["Node"],
      ProducerMetadata: ["Node"],
      ProducerMetadataVersionedName: ["Node"],
      LoopInstruction: ["Node", "Block", "Instruction"],
      Instr: ["Node", "Expression", "Instruction"],
      IfInstruction: ["Node", "Instruction"],
      StringLiteral: ["Node", "Expression"],
      NumberLiteral: ["Node", "NumericLiteral", "Expression"],
      LongNumberLiteral: ["Node", "NumericLiteral", "Expression"],
      FloatLiteral: ["Node", "NumericLiteral", "Expression"],
      Elem: ["Node"],
      IndexInFuncSection: ["Node"],
      ValtypeLiteral: ["Node", "Expression"],
      TypeInstruction: ["Node", "Instruction"],
      Start: ["Node"],
      GlobalType: ["Node", "ImportDescr"],
      LeadingComment: ["Node"],
      BlockComment: ["Node"],
      Data: ["Node"],
      Global: ["Node"],
      Table: ["Node", "ImportDescr"],
      Memory: ["Node", "ImportDescr"],
      FuncImportDescr: ["Node", "ImportDescr"],
      ModuleImport: ["Node"],
      ModuleExportDescr: ["Node"],
      ModuleExport: ["Node"],
      Limit: ["Node"],
      Signature: ["Node"],
      Program: ["Node"],
      Identifier: ["Node", "Expression"],
      BlockInstruction: ["Node", "Block", "Instruction"],
      CallInstruction: ["Node", "Instruction"],
      CallIndirectInstruction: ["Node", "Instruction"],
      ByteArray: ["Node"],
      Func: ["Node", "Block"],
      InternalBrUnless: ["Node", "Intrinsic"],
      InternalGoto: ["Node", "Intrinsic"],
      InternalCallExtern: ["Node", "Intrinsic"],
      InternalEndAndReturn: ["Node", "Intrinsic"]
    };
    exports.unionTypesMap = unionTypesMap;
    var nodeAndUnionTypes = ["Module", "ModuleMetadata", "ModuleNameMetadata", "FunctionNameMetadata", "LocalNameMetadata", "BinaryModule", "QuoteModule", "SectionMetadata", "ProducersSectionMetadata", "ProducerMetadata", "ProducerMetadataVersionedName", "LoopInstruction", "Instr", "IfInstruction", "StringLiteral", "NumberLiteral", "LongNumberLiteral", "FloatLiteral", "Elem", "IndexInFuncSection", "ValtypeLiteral", "TypeInstruction", "Start", "GlobalType", "LeadingComment", "BlockComment", "Data", "Global", "Table", "Memory", "FuncImportDescr", "ModuleImport", "ModuleExportDescr", "ModuleExport", "Limit", "Signature", "Program", "Identifier", "BlockInstruction", "CallInstruction", "CallIndirectInstruction", "ByteArray", "Func", "InternalBrUnless", "InternalGoto", "InternalCallExtern", "InternalEndAndReturn", "Node", "Block", "Instruction", "Expression", "NumericLiteral", "ImportDescr", "Intrinsic"];
    exports.nodeAndUnionTypes = nodeAndUnionTypes;
  }
});

// node_modules/.pnpm/@xtuc+long@4.2.2/node_modules/@xtuc/long/src/long.js
var require_long = __commonJS({
  "node_modules/.pnpm/@xtuc+long@4.2.2/node_modules/@xtuc/long/src/long.js"(exports, module) {
    module.exports = Long;
    var wasm = null;
    try {
      wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        13,
        2,
        96,
        0,
        1,
        127,
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        3,
        7,
        6,
        0,
        1,
        1,
        1,
        1,
        1,
        6,
        6,
        1,
        127,
        1,
        65,
        0,
        11,
        7,
        50,
        6,
        3,
        109,
        117,
        108,
        0,
        1,
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        10,
        191,
        1,
        6,
        4,
        0,
        35,
        0,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])), {}).exports;
    } catch (e) {
    }
    function Long(low, high, unsigned) {
      this.low = low | 0;
      this.high = high | 0;
      this.unsigned = !!unsigned;
    }
    Long.prototype.__isLong__;
    Object.defineProperty(Long.prototype, "__isLong__", { value: true });
    function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
    }
    Long.isLong = isLong;
    var INT_CACHE = {};
    var UINT_CACHE = {};
    function fromInt(value, unsigned) {
      var obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if (cache = 0 <= value && value < 256) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
          UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if (cache = -128 <= value && value < 128) {
          cachedObj = INT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
          INT_CACHE[value] = obj;
        return obj;
      }
    }
    Long.fromInt = fromInt;
    function fromNumber(value, unsigned) {
      if (isNaN(value))
        return unsigned ? UZERO : ZERO;
      if (unsigned) {
        if (value < 0)
          return UZERO;
        if (value >= TWO_PWR_64_DBL)
          return MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL)
          return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
          return MAX_VALUE;
      }
      if (value < 0)
        return fromNumber(-value, unsigned).neg();
      return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    Long.fromNumber = fromNumber;
    function fromBits(lowBits, highBits, unsigned) {
      return new Long(lowBits, highBits, unsigned);
    }
    Long.fromBits = fromBits;
    var pow_dbl = Math.pow;
    function fromString(str, unsigned, radix) {
      if (str.length === 0)
        throw Error("empty string");
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
      if (typeof unsigned === "number") {
        radix = unsigned, unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      var p;
      if ((p = str.indexOf("-")) > 0)
        throw Error("interior hyphen");
      else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
      }
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = fromNumber(pow_dbl(radix, size));
          result = result.mul(power).add(fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }
    Long.fromString = fromString;
    function fromValue(val, unsigned) {
      if (typeof val === "number")
        return fromNumber(val, unsigned);
      if (typeof val === "string")
        return fromString(val, unsigned);
      return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    Long.fromValue = fromValue;
    var TWO_PWR_16_DBL = 1 << 16;
    var TWO_PWR_24_DBL = 1 << 24;
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    var ZERO = fromInt(0);
    Long.ZERO = ZERO;
    var UZERO = fromInt(0, true);
    Long.UZERO = UZERO;
    var ONE = fromInt(1);
    Long.ONE = ONE;
    var UONE = fromInt(1, true);
    Long.UONE = UONE;
    var NEG_ONE = fromInt(-1);
    Long.NEG_ONE = NEG_ONE;
    var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
    Long.MAX_VALUE = MAX_VALUE;
    var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
    Long.MIN_VALUE = MIN_VALUE;
    var LongPrototype = Long.prototype;
    LongPrototype.toInt = function toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };
    LongPrototype.toNumber = function toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    LongPrototype.toString = function toString(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      if (this.isZero())
        return "0";
      if (this.isNegative()) {
        if (this.eq(MIN_VALUE)) {
          var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else
          return "-" + this.neg().toString(radix);
      }
      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
      var result = "";
      while (true) {
        var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
          return digits + result;
        else {
          while (digits.length < 6)
            digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    };
    LongPrototype.getHighBits = function getHighBits() {
      return this.high;
    };
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
      return this.high >>> 0;
    };
    LongPrototype.getLowBits = function getLowBits() {
      return this.low;
    };
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
      return this.low >>> 0;
    };
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
      if (this.isNegative())
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      var val = this.high != 0 ? this.high : this.low;
      for (var bit = 31; bit > 0; bit--)
        if ((val & 1 << bit) != 0)
          break;
      return this.high != 0 ? bit + 33 : bit + 1;
    };
    LongPrototype.isZero = function isZero() {
      return this.high === 0 && this.low === 0;
    };
    LongPrototype.eqz = LongPrototype.isZero;
    LongPrototype.isNegative = function isNegative() {
      return !this.unsigned && this.high < 0;
    };
    LongPrototype.isPositive = function isPositive() {
      return this.unsigned || this.high >= 0;
    };
    LongPrototype.isOdd = function isOdd() {
      return (this.low & 1) === 1;
    };
    LongPrototype.isEven = function isEven() {
      return (this.low & 1) === 0;
    };
    LongPrototype.equals = function equals(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
        return false;
      return this.high === other.high && this.low === other.low;
    };
    LongPrototype.eq = LongPrototype.equals;
    LongPrototype.notEquals = function notEquals(other) {
      return !this.eq(
        /* validates */
        other
      );
    };
    LongPrototype.neq = LongPrototype.notEquals;
    LongPrototype.ne = LongPrototype.notEquals;
    LongPrototype.lessThan = function lessThan(other) {
      return this.comp(
        /* validates */
        other
      ) < 0;
    };
    LongPrototype.lt = LongPrototype.lessThan;
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) <= 0;
    };
    LongPrototype.lte = LongPrototype.lessThanOrEqual;
    LongPrototype.le = LongPrototype.lessThanOrEqual;
    LongPrototype.greaterThan = function greaterThan(other) {
      return this.comp(
        /* validates */
        other
      ) > 0;
    };
    LongPrototype.gt = LongPrototype.greaterThan;
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) >= 0;
    };
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    LongPrototype.compare = function compare(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.eq(other))
        return 0;
      var thisNeg = this.isNegative(), otherNeg = other.isNegative();
      if (thisNeg && !otherNeg)
        return -1;
      if (!thisNeg && otherNeg)
        return 1;
      if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
      return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    LongPrototype.comp = LongPrototype.compare;
    LongPrototype.negate = function negate() {
      if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
      return this.not().add(ONE);
    };
    LongPrototype.neg = LongPrototype.negate;
    LongPrototype.add = function add(addend) {
      if (!isLong(addend))
        addend = fromValue(addend);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = addend.high >>> 16;
      var b32 = addend.high & 65535;
      var b16 = addend.low >>> 16;
      var b00 = addend.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 + b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.subtract = function subtract(subtrahend) {
      if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
      return this.add(subtrahend.neg());
    };
    LongPrototype.sub = LongPrototype.subtract;
    LongPrototype.multiply = function multiply(multiplier) {
      if (this.isZero())
        return ZERO;
      if (!isLong(multiplier))
        multiplier = fromValue(multiplier);
      if (wasm) {
        var low = wasm["mul"](
          this.low,
          this.high,
          multiplier.low,
          multiplier.high
        );
        return fromBits(low, wasm["get_high"](), this.unsigned);
      }
      if (multiplier.isZero())
        return ZERO;
      if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
      if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative())
          return this.neg().mul(multiplier.neg());
        else
          return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();
      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = multiplier.high >>> 16;
      var b32 = multiplier.high & 65535;
      var b16 = multiplier.low >>> 16;
      var b00 = multiplier.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.mul = LongPrototype.multiply;
    LongPrototype.divide = function divide(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (divisor.isZero())
        throw Error("division by zero");
      if (wasm) {
        if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
          return this;
        }
        var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm["get_high"](), this.unsigned);
      }
      if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
      var approx, rem, res;
      if (!this.unsigned) {
        if (this.eq(MIN_VALUE)) {
          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
            return MIN_VALUE;
          else if (divisor.eq(MIN_VALUE))
            return ONE;
          else {
            var halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(ZERO)) {
              return divisor.isNegative() ? ONE : NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(MIN_VALUE))
          return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative())
            return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
          return this.div(divisor.neg()).neg();
        res = ZERO;
      } else {
        if (!divisor.unsigned)
          divisor = divisor.toUnsigned();
        if (divisor.gt(this))
          return UZERO;
        if (divisor.gt(this.shru(1)))
          return UONE;
        res = UZERO;
      }
      rem = this;
      while (rem.gte(divisor)) {
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
        var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }
        if (approxRes.isZero())
          approxRes = ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    };
    LongPrototype.div = LongPrototype.divide;
    LongPrototype.modulo = function modulo(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (wasm) {
        var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm["get_high"](), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    };
    LongPrototype.mod = LongPrototype.modulo;
    LongPrototype.rem = LongPrototype.modulo;
    LongPrototype.not = function not() {
      return fromBits(~this.low, ~this.high, this.unsigned);
    };
    LongPrototype.and = function and(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    LongPrototype.or = function or(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    LongPrototype.xor = function xor(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
      else
        return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    LongPrototype.shl = LongPrototype.shiftLeft;
    LongPrototype.shiftRight = function shiftRight(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
      else
        return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    LongPrototype.shr = LongPrototype.shiftRight;
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      if (numBits < 32)
        return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
      if (numBits === 32)
        return fromBits(this.high, 0, this.unsigned);
      return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
    };
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    LongPrototype.rotateLeft = function rotateLeft(numBits) {
      var b;
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      if (numBits === 32)
        return fromBits(this.high, this.low, this.unsigned);
      if (numBits < 32) {
        b = 32 - numBits;
        return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
      }
      numBits -= 32;
      b = 32 - numBits;
      return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
    };
    LongPrototype.rotl = LongPrototype.rotateLeft;
    LongPrototype.rotateRight = function rotateRight(numBits) {
      var b;
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      if (numBits === 32)
        return fromBits(this.high, this.low, this.unsigned);
      if (numBits < 32) {
        b = 32 - numBits;
        return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
      }
      numBits -= 32;
      b = 32 - numBits;
      return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
    };
    LongPrototype.rotr = LongPrototype.rotateRight;
    LongPrototype.toSigned = function toSigned() {
      if (!this.unsigned)
        return this;
      return fromBits(this.low, this.high, false);
    };
    LongPrototype.toUnsigned = function toUnsigned() {
      if (this.unsigned)
        return this;
      return fromBits(this.low, this.high, true);
    };
    LongPrototype.toBytes = function toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    };
    LongPrototype.toBytesLE = function toBytesLE() {
      var hi = this.high, lo = this.low;
      return [
        lo & 255,
        lo >>> 8 & 255,
        lo >>> 16 & 255,
        lo >>> 24,
        hi & 255,
        hi >>> 8 & 255,
        hi >>> 16 & 255,
        hi >>> 24
      ];
    };
    LongPrototype.toBytesBE = function toBytesBE() {
      var hi = this.high, lo = this.low;
      return [
        hi >>> 24,
        hi >>> 16 & 255,
        hi >>> 8 & 255,
        hi & 255,
        lo >>> 24,
        lo >>> 16 & 255,
        lo >>> 8 & 255,
        lo & 255
      ];
    };
    Long.fromBytes = function fromBytes(bytes, unsigned, le) {
      return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    };
    Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
      return new Long(
        bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
        bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
        unsigned
      );
    };
    Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
      return new Long(
        bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
        bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
        unsigned
      );
    };
  }
});

// node_modules/.pnpm/@webassemblyjs+floating-point-hex-parser@1.11.6/node_modules/@webassemblyjs/floating-point-hex-parser/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+floating-point-hex-parser@1.11.6/node_modules/@webassemblyjs/floating-point-hex-parser/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = parse;
    function parse(input) {
      input = input.toUpperCase();
      var splitIndex = input.indexOf("P");
      var mantissa, exponent;
      if (splitIndex !== -1) {
        mantissa = input.substring(0, splitIndex);
        exponent = parseInt(input.substring(splitIndex + 1));
      } else {
        mantissa = input;
        exponent = 0;
      }
      var dotIndex = mantissa.indexOf(".");
      if (dotIndex !== -1) {
        var integerPart = parseInt(mantissa.substring(0, dotIndex), 16);
        var sign = Math.sign(integerPart);
        integerPart = sign * integerPart;
        var fractionLength = mantissa.length - dotIndex - 1;
        var fractionalPart = parseInt(mantissa.substring(dotIndex + 1), 16);
        var fraction = fractionLength > 0 ? fractionalPart / Math.pow(16, fractionLength) : 0;
        if (sign === 0) {
          if (fraction === 0) {
            mantissa = sign;
          } else {
            if (Object.is(sign, -0)) {
              mantissa = -fraction;
            } else {
              mantissa = fraction;
            }
          }
        } else {
          mantissa = sign * (integerPart + fraction);
        }
      } else {
        mantissa = parseInt(mantissa, 16);
      }
      return mantissa * (splitIndex !== -1 ? Math.pow(2, exponent) : 1);
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+helper-numbers@1.11.6/node_modules/@webassemblyjs/helper-numbers/lib/index.js
var require_lib5 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+helper-numbers@1.11.6/node_modules/@webassemblyjs/helper-numbers/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parse32F = parse32F;
    exports.parse64F = parse64F;
    exports.parse32I = parse32I;
    exports.parseU32 = parseU32;
    exports.parse64I = parse64I;
    exports.isInfLiteral = isInfLiteral;
    exports.isNanLiteral = isNanLiteral;
    var _long2 = _interopRequireDefault(require_long());
    var _floatingPointHexParser = _interopRequireDefault(require_lib4());
    var _helperApiError = require_lib();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function parse32F(sourceString) {
      if (isHexLiteral(sourceString)) {
        return (0, _floatingPointHexParser["default"])(sourceString);
      }
      if (isInfLiteral(sourceString)) {
        return sourceString[0] === "-" ? -1 : 1;
      }
      if (isNanLiteral(sourceString)) {
        return (sourceString[0] === "-" ? -1 : 1) * (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 4194304);
      }
      return parseFloat(sourceString);
    }
    function parse64F(sourceString) {
      if (isHexLiteral(sourceString)) {
        return (0, _floatingPointHexParser["default"])(sourceString);
      }
      if (isInfLiteral(sourceString)) {
        return sourceString[0] === "-" ? -1 : 1;
      }
      if (isNanLiteral(sourceString)) {
        return (sourceString[0] === "-" ? -1 : 1) * (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 2251799813685248);
      }
      if (isHexLiteral(sourceString)) {
        return (0, _floatingPointHexParser["default"])(sourceString);
      }
      return parseFloat(sourceString);
    }
    function parse32I(sourceString) {
      var value = 0;
      if (isHexLiteral(sourceString)) {
        value = ~~parseInt(sourceString, 16);
      } else if (isDecimalExponentLiteral(sourceString)) {
        throw new Error("This number literal format is yet to be implemented.");
      } else {
        value = parseInt(sourceString, 10);
      }
      return value;
    }
    function parseU32(sourceString) {
      var value = parse32I(sourceString);
      if (value < 0) {
        throw new _helperApiError.CompileError("Illegal value for u32: " + sourceString);
      }
      return value;
    }
    function parse64I(sourceString) {
      var _long;
      if (isHexLiteral(sourceString)) {
        _long = _long2["default"].fromString(sourceString, false, 16);
      } else if (isDecimalExponentLiteral(sourceString)) {
        throw new Error("This number literal format is yet to be implemented.");
      } else {
        _long = _long2["default"].fromString(sourceString);
      }
      return {
        high: _long.high,
        low: _long.low
      };
    }
    var NAN_WORD = /^\+?-?nan/;
    var INF_WORD = /^\+?-?inf/;
    function isInfLiteral(sourceString) {
      return INF_WORD.test(sourceString.toLowerCase());
    }
    function isNanLiteral(sourceString) {
      return NAN_WORD.test(sourceString.toLowerCase());
    }
    function isDecimalExponentLiteral(sourceString) {
      return !isHexLiteral(sourceString) && sourceString.toUpperCase().includes("E");
    }
    function isHexLiteral(sourceString) {
      return sourceString.substring(0, 2).toUpperCase() === "0X" || sourceString.substring(0, 3).toUpperCase() === "-0X";
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/node-helpers.js
var require_node_helpers = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/node-helpers.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.numberLiteralFromRaw = numberLiteralFromRaw;
    exports.instruction = instruction;
    exports.objectInstruction = objectInstruction;
    exports.withLoc = withLoc;
    exports.withRaw = withRaw;
    exports.funcParam = funcParam;
    exports.indexLiteral = indexLiteral;
    exports.memIndexLiteral = memIndexLiteral;
    var _helperNumbers = require_lib5();
    var _nodes = require_nodes();
    function numberLiteralFromRaw(rawValue) {
      var instructionType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "i32";
      var original = rawValue;
      if (typeof rawValue === "string") {
        rawValue = rawValue.replace(/_/g, "");
      }
      if (typeof rawValue === "number") {
        return (0, _nodes.numberLiteral)(rawValue, String(original));
      } else {
        switch (instructionType) {
          case "i32": {
            return (0, _nodes.numberLiteral)((0, _helperNumbers.parse32I)(rawValue), String(original));
          }
          case "u32": {
            return (0, _nodes.numberLiteral)((0, _helperNumbers.parseU32)(rawValue), String(original));
          }
          case "i64": {
            return (0, _nodes.longNumberLiteral)((0, _helperNumbers.parse64I)(rawValue), String(original));
          }
          case "f32": {
            return (0, _nodes.floatLiteral)((0, _helperNumbers.parse32F)(rawValue), (0, _helperNumbers.isNanLiteral)(rawValue), (0, _helperNumbers.isInfLiteral)(rawValue), String(original));
          }
          default: {
            return (0, _nodes.floatLiteral)((0, _helperNumbers.parse64F)(rawValue), (0, _helperNumbers.isNanLiteral)(rawValue), (0, _helperNumbers.isInfLiteral)(rawValue), String(original));
          }
        }
      }
    }
    function instruction(id) {
      var args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      var namedArgs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return (0, _nodes.instr)(id, void 0, args, namedArgs);
    }
    function objectInstruction(id, object) {
      var args = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
      var namedArgs = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      return (0, _nodes.instr)(id, object, args, namedArgs);
    }
    function withLoc(n, end, start) {
      var loc = {
        start,
        end
      };
      n.loc = loc;
      return n;
    }
    function withRaw(n, raw) {
      n.raw = raw;
      return n;
    }
    function funcParam(valtype, id) {
      return {
        id,
        valtype
      };
    }
    function indexLiteral(value) {
      var x = numberLiteralFromRaw(value, "u32");
      return x;
    }
    function memIndexLiteral(value) {
      var x = numberLiteralFromRaw(value, "u32");
      return x;
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/node-path.js
var require_node_path = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/node-path.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.createPath = createPath;
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        }
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function findParent(_ref, cb) {
      var parentPath = _ref.parentPath;
      if (parentPath == null) {
        throw new Error("node is root");
      }
      var currentPath = parentPath;
      while (cb(currentPath) !== false) {
        if (currentPath.parentPath == null) {
          return null;
        }
        currentPath = currentPath.parentPath;
      }
      return currentPath.node;
    }
    function insertBefore(context, newNode) {
      return insert(context, newNode);
    }
    function insertAfter(context, newNode) {
      return insert(context, newNode, 1);
    }
    function insert(_ref2, newNode) {
      var node = _ref2.node, inList = _ref2.inList, parentPath = _ref2.parentPath, parentKey = _ref2.parentKey;
      var indexOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
      if (!inList) {
        throw new Error("inList error: insert can only be used for nodes that are within lists");
      }
      if (!(parentPath != null)) {
        throw new Error("parentPath != null error: Can not remove root node");
      }
      var parentList = parentPath.node[parentKey];
      var indexInList = parentList.findIndex(function(n) {
        return n === node;
      });
      parentList.splice(indexInList + indexOffset, 0, newNode);
    }
    function remove(_ref3) {
      var node = _ref3.node, parentKey = _ref3.parentKey, parentPath = _ref3.parentPath;
      if (!(parentPath != null)) {
        throw new Error("parentPath != null error: Can not remove root node");
      }
      var parentNode = parentPath.node;
      var parentProperty = parentNode[parentKey];
      if (Array.isArray(parentProperty)) {
        parentNode[parentKey] = parentProperty.filter(function(n) {
          return n !== node;
        });
      } else {
        delete parentNode[parentKey];
      }
      node._deleted = true;
    }
    function stop(context) {
      context.shouldStop = true;
    }
    function replaceWith(context, newNode) {
      var parentNode = context.parentPath.node;
      var parentProperty = parentNode[context.parentKey];
      if (Array.isArray(parentProperty)) {
        var indexInList = parentProperty.findIndex(function(n) {
          return n === context.node;
        });
        parentProperty.splice(indexInList, 1, newNode);
      } else {
        parentNode[context.parentKey] = newNode;
      }
      context.node._deleted = true;
      context.node = newNode;
    }
    function bindNodeOperations(operations, context) {
      var keys = Object.keys(operations);
      var boundOperations = {};
      keys.forEach(function(key) {
        boundOperations[key] = operations[key].bind(null, context);
      });
      return boundOperations;
    }
    function createPathOperations(context) {
      return bindNodeOperations({
        findParent,
        replaceWith,
        remove,
        insertBefore,
        insertAfter,
        stop
      }, context);
    }
    function createPath(context) {
      var path = _objectSpread({}, context);
      Object.assign(path, createPathOperations(path));
      return path;
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/traverse.js
var require_traverse = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/traverse.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.traverse = traverse;
    var _nodePath = require_node_path();
    var _nodes = require_nodes();
    function walk(context, callback) {
      var stop = false;
      function innerWalk(context2, callback2) {
        if (stop) {
          return;
        }
        var node = context2.node;
        if (node === void 0) {
          console.warn("traversing with an empty context");
          return;
        }
        if (node._deleted === true) {
          return;
        }
        var path = (0, _nodePath.createPath)(context2);
        callback2(node.type, path);
        if (path.shouldStop) {
          stop = true;
          return;
        }
        Object.keys(node).forEach(function(prop) {
          var value = node[prop];
          if (value === null || value === void 0) {
            return;
          }
          var valueAsArray = Array.isArray(value) ? value : [value];
          valueAsArray.forEach(function(childNode) {
            if (typeof childNode.type === "string") {
              var childContext = {
                node: childNode,
                parentKey: prop,
                parentPath: path,
                shouldStop: false,
                inList: Array.isArray(value)
              };
              innerWalk(childContext, callback2);
            }
          });
        });
      }
      innerWalk(context, callback);
    }
    var noop = function noop2() {
    };
    function traverse(node, visitors) {
      var before = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : noop;
      var after = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : noop;
      Object.keys(visitors).forEach(function(visitor) {
        if (!_nodes.nodeAndUnionTypes.includes(visitor)) {
          throw new Error("Unexpected visitor ".concat(visitor));
        }
      });
      var context = {
        node,
        inList: false,
        shouldStop: false,
        parentPath: null,
        parentKey: null
      };
      walk(context, function(type, path) {
        if (typeof visitors[type] === "function") {
          before(type, path);
          visitors[type](path);
          after(type, path);
        }
        var unionTypes = _nodes.unionTypesMap[type];
        if (!unionTypes) {
          throw new Error("Unexpected node type ".concat(type));
        }
        unionTypes.forEach(function(unionType) {
          if (typeof visitors[unionType] === "function") {
            before(unionType, path);
            visitors[unionType](path);
            after(unionType, path);
          }
        });
      });
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/signatures.js
var require_signatures = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/signatures.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.signatures = void 0;
    function sign(input, output) {
      return [input, output];
    }
    var u32 = "u32";
    var i32 = "i32";
    var i64 = "i64";
    var f32 = "f32";
    var f64 = "f64";
    var vector = function vector2(t) {
      var vecType = [t];
      vecType.vector = true;
      return vecType;
    };
    var controlInstructions = {
      unreachable: sign([], []),
      nop: sign([], []),
      // block ?
      // loop ?
      // if ?
      // if else ?
      br: sign([u32], []),
      br_if: sign([u32], []),
      br_table: sign(vector(u32), []),
      "return": sign([], []),
      call: sign([u32], []),
      call_indirect: sign([u32], [])
    };
    var parametricInstructions = {
      drop: sign([], []),
      select: sign([], [])
    };
    var variableInstructions = {
      get_local: sign([u32], []),
      set_local: sign([u32], []),
      tee_local: sign([u32], []),
      get_global: sign([u32], []),
      set_global: sign([u32], [])
    };
    var memoryInstructions = {
      "i32.load": sign([u32, u32], [i32]),
      "i64.load": sign([u32, u32], []),
      "f32.load": sign([u32, u32], []),
      "f64.load": sign([u32, u32], []),
      "i32.load8_s": sign([u32, u32], [i32]),
      "i32.load8_u": sign([u32, u32], [i32]),
      "i32.load16_s": sign([u32, u32], [i32]),
      "i32.load16_u": sign([u32, u32], [i32]),
      "i64.load8_s": sign([u32, u32], [i64]),
      "i64.load8_u": sign([u32, u32], [i64]),
      "i64.load16_s": sign([u32, u32], [i64]),
      "i64.load16_u": sign([u32, u32], [i64]),
      "i64.load32_s": sign([u32, u32], [i64]),
      "i64.load32_u": sign([u32, u32], [i64]),
      "i32.store": sign([u32, u32], []),
      "i64.store": sign([u32, u32], []),
      "f32.store": sign([u32, u32], []),
      "f64.store": sign([u32, u32], []),
      "i32.store8": sign([u32, u32], []),
      "i32.store16": sign([u32, u32], []),
      "i64.store8": sign([u32, u32], []),
      "i64.store16": sign([u32, u32], []),
      "i64.store32": sign([u32, u32], []),
      current_memory: sign([], []),
      grow_memory: sign([], [])
    };
    var numericInstructions = {
      "i32.const": sign([i32], [i32]),
      "i64.const": sign([i64], [i64]),
      "f32.const": sign([f32], [f32]),
      "f64.const": sign([f64], [f64]),
      "i32.eqz": sign([i32], [i32]),
      "i32.eq": sign([i32, i32], [i32]),
      "i32.ne": sign([i32, i32], [i32]),
      "i32.lt_s": sign([i32, i32], [i32]),
      "i32.lt_u": sign([i32, i32], [i32]),
      "i32.gt_s": sign([i32, i32], [i32]),
      "i32.gt_u": sign([i32, i32], [i32]),
      "i32.le_s": sign([i32, i32], [i32]),
      "i32.le_u": sign([i32, i32], [i32]),
      "i32.ge_s": sign([i32, i32], [i32]),
      "i32.ge_u": sign([i32, i32], [i32]),
      "i64.eqz": sign([i64], [i64]),
      "i64.eq": sign([i64, i64], [i32]),
      "i64.ne": sign([i64, i64], [i32]),
      "i64.lt_s": sign([i64, i64], [i32]),
      "i64.lt_u": sign([i64, i64], [i32]),
      "i64.gt_s": sign([i64, i64], [i32]),
      "i64.gt_u": sign([i64, i64], [i32]),
      "i64.le_s": sign([i64, i64], [i32]),
      "i64.le_u": sign([i64, i64], [i32]),
      "i64.ge_s": sign([i64, i64], [i32]),
      "i64.ge_u": sign([i64, i64], [i32]),
      "f32.eq": sign([f32, f32], [i32]),
      "f32.ne": sign([f32, f32], [i32]),
      "f32.lt": sign([f32, f32], [i32]),
      "f32.gt": sign([f32, f32], [i32]),
      "f32.le": sign([f32, f32], [i32]),
      "f32.ge": sign([f32, f32], [i32]),
      "f64.eq": sign([f64, f64], [i32]),
      "f64.ne": sign([f64, f64], [i32]),
      "f64.lt": sign([f64, f64], [i32]),
      "f64.gt": sign([f64, f64], [i32]),
      "f64.le": sign([f64, f64], [i32]),
      "f64.ge": sign([f64, f64], [i32]),
      "i32.clz": sign([i32], [i32]),
      "i32.ctz": sign([i32], [i32]),
      "i32.popcnt": sign([i32], [i32]),
      "i32.add": sign([i32, i32], [i32]),
      "i32.sub": sign([i32, i32], [i32]),
      "i32.mul": sign([i32, i32], [i32]),
      "i32.div_s": sign([i32, i32], [i32]),
      "i32.div_u": sign([i32, i32], [i32]),
      "i32.rem_s": sign([i32, i32], [i32]),
      "i32.rem_u": sign([i32, i32], [i32]),
      "i32.and": sign([i32, i32], [i32]),
      "i32.or": sign([i32, i32], [i32]),
      "i32.xor": sign([i32, i32], [i32]),
      "i32.shl": sign([i32, i32], [i32]),
      "i32.shr_s": sign([i32, i32], [i32]),
      "i32.shr_u": sign([i32, i32], [i32]),
      "i32.rotl": sign([i32, i32], [i32]),
      "i32.rotr": sign([i32, i32], [i32]),
      "i64.clz": sign([i64], [i64]),
      "i64.ctz": sign([i64], [i64]),
      "i64.popcnt": sign([i64], [i64]),
      "i64.add": sign([i64, i64], [i64]),
      "i64.sub": sign([i64, i64], [i64]),
      "i64.mul": sign([i64, i64], [i64]),
      "i64.div_s": sign([i64, i64], [i64]),
      "i64.div_u": sign([i64, i64], [i64]),
      "i64.rem_s": sign([i64, i64], [i64]),
      "i64.rem_u": sign([i64, i64], [i64]),
      "i64.and": sign([i64, i64], [i64]),
      "i64.or": sign([i64, i64], [i64]),
      "i64.xor": sign([i64, i64], [i64]),
      "i64.shl": sign([i64, i64], [i64]),
      "i64.shr_s": sign([i64, i64], [i64]),
      "i64.shr_u": sign([i64, i64], [i64]),
      "i64.rotl": sign([i64, i64], [i64]),
      "i64.rotr": sign([i64, i64], [i64]),
      "f32.abs": sign([f32], [f32]),
      "f32.neg": sign([f32], [f32]),
      "f32.ceil": sign([f32], [f32]),
      "f32.floor": sign([f32], [f32]),
      "f32.trunc": sign([f32], [f32]),
      "f32.nearest": sign([f32], [f32]),
      "f32.sqrt": sign([f32], [f32]),
      "f32.add": sign([f32, f32], [f32]),
      "f32.sub": sign([f32, f32], [f32]),
      "f32.mul": sign([f32, f32], [f32]),
      "f32.div": sign([f32, f32], [f32]),
      "f32.min": sign([f32, f32], [f32]),
      "f32.max": sign([f32, f32], [f32]),
      "f32.copysign": sign([f32, f32], [f32]),
      "f64.abs": sign([f64], [f64]),
      "f64.neg": sign([f64], [f64]),
      "f64.ceil": sign([f64], [f64]),
      "f64.floor": sign([f64], [f64]),
      "f64.trunc": sign([f64], [f64]),
      "f64.nearest": sign([f64], [f64]),
      "f64.sqrt": sign([f64], [f64]),
      "f64.add": sign([f64, f64], [f64]),
      "f64.sub": sign([f64, f64], [f64]),
      "f64.mul": sign([f64, f64], [f64]),
      "f64.div": sign([f64, f64], [f64]),
      "f64.min": sign([f64, f64], [f64]),
      "f64.max": sign([f64, f64], [f64]),
      "f64.copysign": sign([f64, f64], [f64]),
      "i32.wrap/i64": sign([i64], [i32]),
      "i32.trunc_s/f32": sign([f32], [i32]),
      "i32.trunc_u/f32": sign([f32], [i32]),
      "i32.trunc_s/f64": sign([f32], [i32]),
      "i32.trunc_u/f64": sign([f64], [i32]),
      "i64.extend_s/i32": sign([i32], [i64]),
      "i64.extend_u/i32": sign([i32], [i64]),
      "i64.trunc_s/f32": sign([f32], [i64]),
      "i64.trunc_u/f32": sign([f32], [i64]),
      "i64.trunc_s/f64": sign([f64], [i64]),
      "i64.trunc_u/f64": sign([f64], [i64]),
      "f32.convert_s/i32": sign([i32], [f32]),
      "f32.convert_u/i32": sign([i32], [f32]),
      "f32.convert_s/i64": sign([i64], [f32]),
      "f32.convert_u/i64": sign([i64], [f32]),
      "f32.demote/f64": sign([f64], [f32]),
      "f64.convert_s/i32": sign([i32], [f64]),
      "f64.convert_u/i32": sign([i32], [f64]),
      "f64.convert_s/i64": sign([i64], [f64]),
      "f64.convert_u/i64": sign([i64], [f64]),
      "f64.promote/f32": sign([f32], [f64]),
      "i32.reinterpret/f32": sign([f32], [i32]),
      "i64.reinterpret/f64": sign([f64], [i64]),
      "f32.reinterpret/i32": sign([i32], [f32]),
      "f64.reinterpret/i64": sign([i64], [f64])
    };
    var signatures = Object.assign({}, controlInstructions, parametricInstructions, variableInstructions, memoryInstructions, numericInstructions);
    exports.signatures = signatures;
  }
});

// node_modules/.pnpm/@webassemblyjs+helper-wasm-bytecode@1.12.1/node_modules/@webassemblyjs/helper-wasm-bytecode/lib/section.js
var require_section = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+helper-wasm-bytecode@1.12.1/node_modules/@webassemblyjs/helper-wasm-bytecode/lib/section.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getSectionForNode = getSectionForNode;
    function getSectionForNode(n) {
      switch (n.type) {
        case "ModuleImport":
          return "import";
        case "CallInstruction":
        case "CallIndirectInstruction":
        case "Func":
        case "Instr":
          return "code";
        case "ModuleExport":
          return "export";
        case "Start":
          return "start";
        case "TypeInstruction":
          return "type";
        case "IndexInFuncSection":
          return "func";
        case "Global":
          return "global";
        default:
          return;
      }
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+helper-wasm-bytecode@1.12.1/node_modules/@webassemblyjs/helper-wasm-bytecode/lib/index.js
var require_lib6 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+helper-wasm-bytecode@1.12.1/node_modules/@webassemblyjs/helper-wasm-bytecode/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "getSectionForNode", {
      enumerable: true,
      get: function get() {
        return _section.getSectionForNode;
      }
    });
    exports["default"] = void 0;
    var _section = require_section();
    var illegalop = "illegal";
    var magicModuleHeader = [0, 97, 115, 109];
    var moduleVersion = [1, 0, 0, 0];
    function invertMap(obj) {
      var keyModifierFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function(k) {
        return k;
      };
      var result = {};
      var keys = Object.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        result[keyModifierFn(obj[keys[i]])] = keys[i];
      }
      return result;
    }
    function createSymbolObject(name, object) {
      var numberOfArgs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
      return {
        name,
        object,
        numberOfArgs
      };
    }
    function createSymbol(name) {
      var numberOfArgs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      return {
        name,
        numberOfArgs
      };
    }
    var types = {
      func: 96,
      result: 64
    };
    var exportTypes = {
      0: "Func",
      1: "Table",
      2: "Memory",
      3: "Global"
    };
    var exportTypesByName = invertMap(exportTypes);
    var valtypes = {
      127: "i32",
      126: "i64",
      125: "f32",
      124: "f64",
      123: "v128"
    };
    var valtypesByString = invertMap(valtypes);
    var tableTypes = {
      112: "anyfunc"
    };
    var blockTypes = Object.assign({}, valtypes, {
      // https://webassembly.github.io/spec/core/binary/types.html#binary-blocktype
      64: null,
      // https://webassembly.github.io/spec/core/binary/types.html#binary-valtype
      127: "i32",
      126: "i64",
      125: "f32",
      124: "f64"
    });
    var globalTypes = {
      0: "const",
      1: "var"
    };
    var globalTypesByString = invertMap(globalTypes);
    var importTypes = {
      0: "func",
      1: "table",
      2: "memory",
      3: "global"
    };
    var sections = {
      custom: 0,
      type: 1,
      "import": 2,
      func: 3,
      table: 4,
      memory: 5,
      global: 6,
      "export": 7,
      start: 8,
      element: 9,
      code: 10,
      data: 11
    };
    var symbolsByByte = {
      0: createSymbol("unreachable"),
      1: createSymbol("nop"),
      2: createSymbol("block"),
      3: createSymbol("loop"),
      4: createSymbol("if"),
      5: createSymbol("else"),
      6: illegalop,
      7: illegalop,
      8: illegalop,
      9: illegalop,
      10: illegalop,
      11: createSymbol("end"),
      12: createSymbol("br", 1),
      13: createSymbol("br_if", 1),
      14: createSymbol("br_table"),
      15: createSymbol("return"),
      16: createSymbol("call", 1),
      17: createSymbol("call_indirect", 2),
      18: illegalop,
      19: illegalop,
      20: illegalop,
      21: illegalop,
      22: illegalop,
      23: illegalop,
      24: illegalop,
      25: illegalop,
      26: createSymbol("drop"),
      27: createSymbol("select"),
      28: illegalop,
      29: illegalop,
      30: illegalop,
      31: illegalop,
      32: createSymbol("get_local", 1),
      33: createSymbol("set_local", 1),
      34: createSymbol("tee_local", 1),
      35: createSymbol("get_global", 1),
      36: createSymbol("set_global", 1),
      37: illegalop,
      38: illegalop,
      39: illegalop,
      40: createSymbolObject("load", "u32", 1),
      41: createSymbolObject("load", "u64", 1),
      42: createSymbolObject("load", "f32", 1),
      43: createSymbolObject("load", "f64", 1),
      44: createSymbolObject("load8_s", "u32", 1),
      45: createSymbolObject("load8_u", "u32", 1),
      46: createSymbolObject("load16_s", "u32", 1),
      47: createSymbolObject("load16_u", "u32", 1),
      48: createSymbolObject("load8_s", "u64", 1),
      49: createSymbolObject("load8_u", "u64", 1),
      50: createSymbolObject("load16_s", "u64", 1),
      51: createSymbolObject("load16_u", "u64", 1),
      52: createSymbolObject("load32_s", "u64", 1),
      53: createSymbolObject("load32_u", "u64", 1),
      54: createSymbolObject("store", "u32", 1),
      55: createSymbolObject("store", "u64", 1),
      56: createSymbolObject("store", "f32", 1),
      57: createSymbolObject("store", "f64", 1),
      58: createSymbolObject("store8", "u32", 1),
      59: createSymbolObject("store16", "u32", 1),
      60: createSymbolObject("store8", "u64", 1),
      61: createSymbolObject("store16", "u64", 1),
      62: createSymbolObject("store32", "u64", 1),
      63: createSymbolObject("current_memory"),
      64: createSymbolObject("grow_memory"),
      65: createSymbolObject("const", "i32", 1),
      66: createSymbolObject("const", "i64", 1),
      67: createSymbolObject("const", "f32", 1),
      68: createSymbolObject("const", "f64", 1),
      69: createSymbolObject("eqz", "i32"),
      70: createSymbolObject("eq", "i32"),
      71: createSymbolObject("ne", "i32"),
      72: createSymbolObject("lt_s", "i32"),
      73: createSymbolObject("lt_u", "i32"),
      74: createSymbolObject("gt_s", "i32"),
      75: createSymbolObject("gt_u", "i32"),
      76: createSymbolObject("le_s", "i32"),
      77: createSymbolObject("le_u", "i32"),
      78: createSymbolObject("ge_s", "i32"),
      79: createSymbolObject("ge_u", "i32"),
      80: createSymbolObject("eqz", "i64"),
      81: createSymbolObject("eq", "i64"),
      82: createSymbolObject("ne", "i64"),
      83: createSymbolObject("lt_s", "i64"),
      84: createSymbolObject("lt_u", "i64"),
      85: createSymbolObject("gt_s", "i64"),
      86: createSymbolObject("gt_u", "i64"),
      87: createSymbolObject("le_s", "i64"),
      88: createSymbolObject("le_u", "i64"),
      89: createSymbolObject("ge_s", "i64"),
      90: createSymbolObject("ge_u", "i64"),
      91: createSymbolObject("eq", "f32"),
      92: createSymbolObject("ne", "f32"),
      93: createSymbolObject("lt", "f32"),
      94: createSymbolObject("gt", "f32"),
      95: createSymbolObject("le", "f32"),
      96: createSymbolObject("ge", "f32"),
      97: createSymbolObject("eq", "f64"),
      98: createSymbolObject("ne", "f64"),
      99: createSymbolObject("lt", "f64"),
      100: createSymbolObject("gt", "f64"),
      101: createSymbolObject("le", "f64"),
      102: createSymbolObject("ge", "f64"),
      103: createSymbolObject("clz", "i32"),
      104: createSymbolObject("ctz", "i32"),
      105: createSymbolObject("popcnt", "i32"),
      106: createSymbolObject("add", "i32"),
      107: createSymbolObject("sub", "i32"),
      108: createSymbolObject("mul", "i32"),
      109: createSymbolObject("div_s", "i32"),
      110: createSymbolObject("div_u", "i32"),
      111: createSymbolObject("rem_s", "i32"),
      112: createSymbolObject("rem_u", "i32"),
      113: createSymbolObject("and", "i32"),
      114: createSymbolObject("or", "i32"),
      115: createSymbolObject("xor", "i32"),
      116: createSymbolObject("shl", "i32"),
      117: createSymbolObject("shr_s", "i32"),
      118: createSymbolObject("shr_u", "i32"),
      119: createSymbolObject("rotl", "i32"),
      120: createSymbolObject("rotr", "i32"),
      121: createSymbolObject("clz", "i64"),
      122: createSymbolObject("ctz", "i64"),
      123: createSymbolObject("popcnt", "i64"),
      124: createSymbolObject("add", "i64"),
      125: createSymbolObject("sub", "i64"),
      126: createSymbolObject("mul", "i64"),
      127: createSymbolObject("div_s", "i64"),
      128: createSymbolObject("div_u", "i64"),
      129: createSymbolObject("rem_s", "i64"),
      130: createSymbolObject("rem_u", "i64"),
      131: createSymbolObject("and", "i64"),
      132: createSymbolObject("or", "i64"),
      133: createSymbolObject("xor", "i64"),
      134: createSymbolObject("shl", "i64"),
      135: createSymbolObject("shr_s", "i64"),
      136: createSymbolObject("shr_u", "i64"),
      137: createSymbolObject("rotl", "i64"),
      138: createSymbolObject("rotr", "i64"),
      139: createSymbolObject("abs", "f32"),
      140: createSymbolObject("neg", "f32"),
      141: createSymbolObject("ceil", "f32"),
      142: createSymbolObject("floor", "f32"),
      143: createSymbolObject("trunc", "f32"),
      144: createSymbolObject("nearest", "f32"),
      145: createSymbolObject("sqrt", "f32"),
      146: createSymbolObject("add", "f32"),
      147: createSymbolObject("sub", "f32"),
      148: createSymbolObject("mul", "f32"),
      149: createSymbolObject("div", "f32"),
      150: createSymbolObject("min", "f32"),
      151: createSymbolObject("max", "f32"),
      152: createSymbolObject("copysign", "f32"),
      153: createSymbolObject("abs", "f64"),
      154: createSymbolObject("neg", "f64"),
      155: createSymbolObject("ceil", "f64"),
      156: createSymbolObject("floor", "f64"),
      157: createSymbolObject("trunc", "f64"),
      158: createSymbolObject("nearest", "f64"),
      159: createSymbolObject("sqrt", "f64"),
      160: createSymbolObject("add", "f64"),
      161: createSymbolObject("sub", "f64"),
      162: createSymbolObject("mul", "f64"),
      163: createSymbolObject("div", "f64"),
      164: createSymbolObject("min", "f64"),
      165: createSymbolObject("max", "f64"),
      166: createSymbolObject("copysign", "f64"),
      167: createSymbolObject("wrap/i64", "i32"),
      168: createSymbolObject("trunc_s/f32", "i32"),
      169: createSymbolObject("trunc_u/f32", "i32"),
      170: createSymbolObject("trunc_s/f64", "i32"),
      171: createSymbolObject("trunc_u/f64", "i32"),
      172: createSymbolObject("extend_s/i32", "i64"),
      173: createSymbolObject("extend_u/i32", "i64"),
      174: createSymbolObject("trunc_s/f32", "i64"),
      175: createSymbolObject("trunc_u/f32", "i64"),
      176: createSymbolObject("trunc_s/f64", "i64"),
      177: createSymbolObject("trunc_u/f64", "i64"),
      178: createSymbolObject("convert_s/i32", "f32"),
      179: createSymbolObject("convert_u/i32", "f32"),
      180: createSymbolObject("convert_s/i64", "f32"),
      181: createSymbolObject("convert_u/i64", "f32"),
      182: createSymbolObject("demote/f64", "f32"),
      183: createSymbolObject("convert_s/i32", "f64"),
      184: createSymbolObject("convert_u/i32", "f64"),
      185: createSymbolObject("convert_s/i64", "f64"),
      186: createSymbolObject("convert_u/i64", "f64"),
      187: createSymbolObject("promote/f32", "f64"),
      188: createSymbolObject("reinterpret/f32", "i32"),
      189: createSymbolObject("reinterpret/f64", "i64"),
      190: createSymbolObject("reinterpret/i32", "f32"),
      191: createSymbolObject("reinterpret/i64", "f64"),
      192: createSymbolObject("extend8_s", "i32"),
      193: createSymbolObject("extend16_s", "i32"),
      194: createSymbolObject("extend8_s", "i64"),
      195: createSymbolObject("extend16_s", "i64"),
      196: createSymbolObject("extend32_s", "i64"),
      // Atomic Memory Instructions
      65024: createSymbol("memory.atomic.notify", 1),
      65025: createSymbol("memory.atomic.wait32", 1),
      65026: createSymbol("memory.atomic.wait64", 1),
      65040: createSymbolObject("atomic.load", "i32", 1),
      65041: createSymbolObject("atomic.load", "i64", 1),
      65042: createSymbolObject("atomic.load8_u", "i32", 1),
      65043: createSymbolObject("atomic.load16_u", "i32", 1),
      65044: createSymbolObject("atomic.load8_u", "i64", 1),
      65045: createSymbolObject("atomic.load16_u", "i64", 1),
      65046: createSymbolObject("atomic.load32_u", "i64", 1),
      65047: createSymbolObject("atomic.store", "i32", 1),
      65048: createSymbolObject("atomic.store", "i64", 1),
      65049: createSymbolObject("atomic.store8_u", "i32", 1),
      65050: createSymbolObject("atomic.store16_u", "i32", 1),
      65051: createSymbolObject("atomic.store8_u", "i64", 1),
      65052: createSymbolObject("atomic.store16_u", "i64", 1),
      65053: createSymbolObject("atomic.store32_u", "i64", 1),
      65054: createSymbolObject("atomic.rmw.add", "i32", 1),
      65055: createSymbolObject("atomic.rmw.add", "i64", 1),
      65056: createSymbolObject("atomic.rmw8_u.add_u", "i32", 1),
      65057: createSymbolObject("atomic.rmw16_u.add_u", "i32", 1),
      65058: createSymbolObject("atomic.rmw8_u.add_u", "i64", 1),
      65059: createSymbolObject("atomic.rmw16_u.add_u", "i64", 1),
      65060: createSymbolObject("atomic.rmw32_u.add_u", "i64", 1),
      65061: createSymbolObject("atomic.rmw.sub", "i32", 1),
      65062: createSymbolObject("atomic.rmw.sub", "i64", 1),
      65063: createSymbolObject("atomic.rmw8_u.sub_u", "i32", 1),
      65064: createSymbolObject("atomic.rmw16_u.sub_u", "i32", 1),
      65065: createSymbolObject("atomic.rmw8_u.sub_u", "i64", 1),
      65066: createSymbolObject("atomic.rmw16_u.sub_u", "i64", 1),
      65067: createSymbolObject("atomic.rmw32_u.sub_u", "i64", 1),
      65068: createSymbolObject("atomic.rmw.and", "i32", 1),
      65069: createSymbolObject("atomic.rmw.and", "i64", 1),
      65070: createSymbolObject("atomic.rmw8_u.and_u", "i32", 1),
      65071: createSymbolObject("atomic.rmw16_u.and_u", "i32", 1),
      65072: createSymbolObject("atomic.rmw8_u.and_u", "i64", 1),
      65073: createSymbolObject("atomic.rmw16_u.and_u", "i64", 1),
      65074: createSymbolObject("atomic.rmw32_u.and_u", "i64", 1),
      65075: createSymbolObject("atomic.rmw.or", "i32", 1),
      65076: createSymbolObject("atomic.rmw.or", "i64", 1),
      65077: createSymbolObject("atomic.rmw8_u.or_u", "i32", 1),
      65078: createSymbolObject("atomic.rmw16_u.or_u", "i32", 1),
      65079: createSymbolObject("atomic.rmw8_u.or_u", "i64", 1),
      65080: createSymbolObject("atomic.rmw16_u.or_u", "i64", 1),
      65081: createSymbolObject("atomic.rmw32_u.or_u", "i64", 1),
      65082: createSymbolObject("atomic.rmw.xor", "i32", 1),
      65083: createSymbolObject("atomic.rmw.xor", "i64", 1),
      65084: createSymbolObject("atomic.rmw8_u.xor_u", "i32", 1),
      65085: createSymbolObject("atomic.rmw16_u.xor_u", "i32", 1),
      65086: createSymbolObject("atomic.rmw8_u.xor_u", "i64", 1),
      65087: createSymbolObject("atomic.rmw16_u.xor_u", "i64", 1),
      65088: createSymbolObject("atomic.rmw32_u.xor_u", "i64", 1),
      65089: createSymbolObject("atomic.rmw.xchg", "i32", 1),
      65090: createSymbolObject("atomic.rmw.xchg", "i64", 1),
      65091: createSymbolObject("atomic.rmw8_u.xchg_u", "i32", 1),
      65092: createSymbolObject("atomic.rmw16_u.xchg_u", "i32", 1),
      65093: createSymbolObject("atomic.rmw8_u.xchg_u", "i64", 1),
      65094: createSymbolObject("atomic.rmw16_u.xchg_u", "i64", 1),
      65095: createSymbolObject("atomic.rmw32_u.xchg_u", "i64", 1),
      65096: createSymbolObject("atomic.rmw.cmpxchg", "i32", 1),
      65097: createSymbolObject("atomic.rmw.cmpxchg", "i64", 1),
      65098: createSymbolObject("atomic.rmw8_u.cmpxchg_u", "i32", 1),
      65099: createSymbolObject("atomic.rmw16_u.cmpxchg_u", "i32", 1),
      65100: createSymbolObject("atomic.rmw8_u.cmpxchg_u", "i64", 1),
      65101: createSymbolObject("atomic.rmw16_u.cmpxchg_u", "i64", 1),
      65102: createSymbolObject("atomic.rmw32_u.cmpxchg_u", "i64", 1)
    };
    var symbolsByName = invertMap(symbolsByByte, function(obj) {
      if (typeof obj.object === "string") {
        return "".concat(obj.object, ".").concat(obj.name);
      }
      return obj.name;
    });
    var _default = {
      symbolsByByte,
      sections,
      magicModuleHeader,
      moduleVersion,
      types,
      valtypes,
      exportTypes,
      blockTypes,
      tableTypes,
      globalTypes,
      importTypes,
      valtypesByString,
      globalTypesByString,
      exportTypesByName,
      symbolsByName
    };
    exports["default"] = _default;
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/utils.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isAnonymous = isAnonymous;
    exports.getSectionMetadata = getSectionMetadata;
    exports.getSectionMetadatas = getSectionMetadatas;
    exports.sortSectionMetadata = sortSectionMetadata;
    exports.orderedInsertNode = orderedInsertNode;
    exports.assertHasLoc = assertHasLoc;
    exports.getEndOfSection = getEndOfSection;
    exports.shiftLoc = shiftLoc;
    exports.shiftSection = shiftSection;
    exports.signatureForOpcode = signatureForOpcode;
    exports.getUniqueNameGenerator = getUniqueNameGenerator;
    exports.getStartByteOffset = getStartByteOffset;
    exports.getEndByteOffset = getEndByteOffset;
    exports.getFunctionBeginingByteOffset = getFunctionBeginingByteOffset;
    exports.getEndBlockByteOffset = getEndBlockByteOffset;
    exports.getStartBlockByteOffset = getStartBlockByteOffset;
    var _signatures = require_signatures();
    var _traverse = require_traverse();
    var _helperWasmBytecode = _interopRequireWildcard(require_lib6());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function")
        return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null)
        return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _s, _e;
      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null)
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr))
        return arr;
    }
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function isAnonymous(ident) {
      return ident.raw === "";
    }
    function getSectionMetadata(ast, name) {
      var section;
      (0, _traverse.traverse)(ast, {
        SectionMetadata: function(_SectionMetadata) {
          function SectionMetadata(_x) {
            return _SectionMetadata.apply(this, arguments);
          }
          SectionMetadata.toString = function() {
            return _SectionMetadata.toString();
          };
          return SectionMetadata;
        }(function(_ref) {
          var node = _ref.node;
          if (node.section === name) {
            section = node;
          }
        })
      });
      return section;
    }
    function getSectionMetadatas(ast, name) {
      var sections = [];
      (0, _traverse.traverse)(ast, {
        SectionMetadata: function(_SectionMetadata2) {
          function SectionMetadata(_x2) {
            return _SectionMetadata2.apply(this, arguments);
          }
          SectionMetadata.toString = function() {
            return _SectionMetadata2.toString();
          };
          return SectionMetadata;
        }(function(_ref2) {
          var node = _ref2.node;
          if (node.section === name) {
            sections.push(node);
          }
        })
      });
      return sections;
    }
    function sortSectionMetadata(m) {
      if (m.metadata == null) {
        console.warn("sortSectionMetadata: no metadata to sort");
        return;
      }
      m.metadata.sections.sort(function(a, b) {
        var aId = _helperWasmBytecode["default"].sections[a.section];
        var bId = _helperWasmBytecode["default"].sections[b.section];
        if (typeof aId !== "number" || typeof bId !== "number") {
          throw new Error("Section id not found");
        }
        return aId - bId;
      });
    }
    function orderedInsertNode(m, n) {
      assertHasLoc(n);
      var didInsert = false;
      if (n.type === "ModuleExport") {
        m.fields.push(n);
        return;
      }
      m.fields = m.fields.reduce(function(acc, field) {
        var fieldEndCol = Infinity;
        if (field.loc != null) {
          fieldEndCol = field.loc.end.column;
        }
        if (didInsert === false && n.loc.start.column < fieldEndCol) {
          didInsert = true;
          acc.push(n);
        }
        acc.push(field);
        return acc;
      }, []);
      if (didInsert === false) {
        m.fields.push(n);
      }
    }
    function assertHasLoc(n) {
      if (n.loc == null || n.loc.start == null || n.loc.end == null) {
        throw new Error("Internal failure: node (".concat(JSON.stringify(n.type), ") has no location information"));
      }
    }
    function getEndOfSection(s) {
      assertHasLoc(s.size);
      return s.startOffset + s.size.value + (s.size.loc.end.column - s.size.loc.start.column);
    }
    function shiftLoc(node, delta) {
      node.loc.start.column += delta;
      node.loc.end.column += delta;
    }
    function shiftSection(ast, node, delta) {
      if (node.type !== "SectionMetadata") {
        throw new Error("Can not shift node " + JSON.stringify(node.type));
      }
      node.startOffset += delta;
      if (_typeof(node.size.loc) === "object") {
        shiftLoc(node.size, delta);
      }
      if (_typeof(node.vectorOfSize) === "object" && _typeof(node.vectorOfSize.loc) === "object") {
        shiftLoc(node.vectorOfSize, delta);
      }
      var sectionName = node.section;
      (0, _traverse.traverse)(ast, {
        Node: function Node(_ref3) {
          var node2 = _ref3.node;
          var section = (0, _helperWasmBytecode.getSectionForNode)(node2);
          if (section === sectionName && _typeof(node2.loc) === "object") {
            shiftLoc(node2, delta);
          }
        }
      });
    }
    function signatureForOpcode(object, name) {
      var opcodeName = name;
      if (object !== void 0 && object !== "") {
        opcodeName = object + "." + name;
      }
      var sign = _signatures.signatures[opcodeName];
      if (sign == void 0) {
        return [object, object];
      }
      return sign[0];
    }
    function getUniqueNameGenerator() {
      var inc = {};
      return function() {
        var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "temp";
        if (!(prefix in inc)) {
          inc[prefix] = 0;
        } else {
          inc[prefix] = inc[prefix] + 1;
        }
        return prefix + "_" + inc[prefix];
      };
    }
    function getStartByteOffset(n) {
      if (typeof n.loc === "undefined" || typeof n.loc.start === "undefined") {
        throw new Error(
          // $FlowIgnore
          "Can not get byte offset without loc informations, node: " + String(n.id)
        );
      }
      return n.loc.start.column;
    }
    function getEndByteOffset(n) {
      if (typeof n.loc === "undefined" || typeof n.loc.end === "undefined") {
        throw new Error("Can not get byte offset without loc informations, node: " + n.type);
      }
      return n.loc.end.column;
    }
    function getFunctionBeginingByteOffset(n) {
      if (!(n.body.length > 0)) {
        throw new Error("n.body.length > 0 error: unknown");
      }
      var _n$body = _slicedToArray(n.body, 1), firstInstruction = _n$body[0];
      return getStartByteOffset(firstInstruction);
    }
    function getEndBlockByteOffset(n) {
      if (!(n.instr.length > 0 || n.body.length > 0)) {
        throw new Error("n.instr.length > 0 || n.body.length > 0 error: unknown");
      }
      var lastInstruction;
      if (n.instr) {
        lastInstruction = n.instr[n.instr.length - 1];
      }
      if (n.body) {
        lastInstruction = n.body[n.body.length - 1];
      }
      if (!(_typeof(lastInstruction) === "object")) {
        throw new Error('typeof lastInstruction === "object" error: unknown');
      }
      return getStartByteOffset(lastInstruction);
    }
    function getStartBlockByteOffset(n) {
      if (!(n.instr.length > 0 || n.body.length > 0)) {
        throw new Error("n.instr.length > 0 || n.body.length > 0 error: unknown");
      }
      var fistInstruction;
      if (n.instr) {
        var _n$instr = _slicedToArray(n.instr, 1);
        fistInstruction = _n$instr[0];
      }
      if (n.body) {
        var _n$body2 = _slicedToArray(n.body, 1);
        fistInstruction = _n$body2[0];
      }
      if (!(_typeof(fistInstruction) === "object")) {
        throw new Error('typeof fistInstruction === "object" error: unknown');
      }
      return getStartByteOffset(fistInstruction);
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/clone.js
var require_clone = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/clone.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.cloneNode = cloneNode;
    function cloneNode(n) {
      return Object.assign({}, n);
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/transform/ast-module-to-module-context/index.js
var require_ast_module_to_module_context = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/transform/ast-module-to-module-context/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.moduleContextFromModuleAST = moduleContextFromModuleAST;
    exports.ModuleContext = void 0;
    var _nodes = require_nodes();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function moduleContextFromModuleAST(m) {
      var moduleContext = new ModuleContext();
      if (!(m.type === "Module")) {
        throw new Error('m.type === "Module" error: unknown');
      }
      m.fields.forEach(function(field) {
        switch (field.type) {
          case "Start": {
            moduleContext.setStart(field.index);
            break;
          }
          case "TypeInstruction": {
            moduleContext.addType(field);
            break;
          }
          case "Func": {
            moduleContext.addFunction(field);
            break;
          }
          case "Global": {
            moduleContext.defineGlobal(field);
            break;
          }
          case "ModuleImport": {
            switch (field.descr.type) {
              case "GlobalType": {
                moduleContext.importGlobal(field.descr.valtype, field.descr.mutability);
                break;
              }
              case "Memory": {
                moduleContext.addMemory(field.descr.limits.min, field.descr.limits.max);
                break;
              }
              case "FuncImportDescr": {
                moduleContext.importFunction(field.descr);
                break;
              }
              case "Table": {
                break;
              }
              default:
                throw new Error("Unsupported ModuleImport of type " + JSON.stringify(field.descr.type));
            }
            break;
          }
          case "Memory": {
            moduleContext.addMemory(field.limits.min, field.limits.max);
            break;
          }
        }
      });
      return moduleContext;
    }
    var ModuleContext = /* @__PURE__ */ function() {
      function ModuleContext2() {
        _classCallCheck(this, ModuleContext2);
        this.funcs = [];
        this.funcsOffsetByIdentifier = [];
        this.types = [];
        this.globals = [];
        this.globalsOffsetByIdentifier = [];
        this.mems = [];
        this.locals = [];
        this.labels = [];
        this["return"] = [];
        this.debugName = "unknown";
        this.start = null;
      }
      _createClass(ModuleContext2, [{
        key: "setStart",
        value: function setStart(index) {
          this.start = index.value;
        }
        /**
         * Get start function
         */
      }, {
        key: "getStart",
        value: function getStart() {
          return this.start;
        }
        /**
         * Reset the active stack frame
         */
      }, {
        key: "newContext",
        value: function newContext(debugName, expectedResult) {
          this.locals = [];
          this.labels = [expectedResult];
          this["return"] = expectedResult;
          this.debugName = debugName;
        }
        /**
         * Functions
         */
      }, {
        key: "addFunction",
        value: function addFunction(func) {
          var _ref = func.signature || {}, _ref$params = _ref.params, args = _ref$params === void 0 ? [] : _ref$params, _ref$results = _ref.results, result = _ref$results === void 0 ? [] : _ref$results;
          args = args.map(function(arg) {
            return arg.valtype;
          });
          this.funcs.push({
            args,
            result
          });
          if (typeof func.name !== "undefined") {
            this.funcsOffsetByIdentifier[func.name.value] = this.funcs.length - 1;
          }
        }
      }, {
        key: "importFunction",
        value: function importFunction(funcimport) {
          if ((0, _nodes.isSignature)(funcimport.signature)) {
            var _funcimport$signature = funcimport.signature, args = _funcimport$signature.params, result = _funcimport$signature.results;
            args = args.map(function(arg) {
              return arg.valtype;
            });
            this.funcs.push({
              args,
              result
            });
          } else {
            if (!(0, _nodes.isNumberLiteral)(funcimport.signature)) {
              throw new Error("isNumberLiteral(funcimport.signature) error: unknown");
            }
            var typeId = funcimport.signature.value;
            if (!this.hasType(typeId)) {
              throw new Error("this.hasType(typeId) error: unknown");
            }
            var signature = this.getType(typeId);
            this.funcs.push({
              args: signature.params.map(function(arg) {
                return arg.valtype;
              }),
              result: signature.results
            });
          }
          if (typeof funcimport.id !== "undefined") {
            this.funcsOffsetByIdentifier[funcimport.id.value] = this.funcs.length - 1;
          }
        }
      }, {
        key: "hasFunction",
        value: function hasFunction(index) {
          return typeof this.getFunction(index) !== "undefined";
        }
      }, {
        key: "getFunction",
        value: function getFunction(index) {
          if (typeof index !== "number") {
            throw new Error("getFunction only supported for number index");
          }
          return this.funcs[index];
        }
      }, {
        key: "getFunctionOffsetByIdentifier",
        value: function getFunctionOffsetByIdentifier(name) {
          if (!(typeof name === "string")) {
            throw new Error('typeof name === "string" error: unknown');
          }
          return this.funcsOffsetByIdentifier[name];
        }
        /**
         * Labels
         */
      }, {
        key: "addLabel",
        value: function addLabel(result) {
          this.labels.unshift(result);
        }
      }, {
        key: "hasLabel",
        value: function hasLabel(index) {
          return this.labels.length > index && index >= 0;
        }
      }, {
        key: "getLabel",
        value: function getLabel(index) {
          return this.labels[index];
        }
      }, {
        key: "popLabel",
        value: function popLabel() {
          this.labels.shift();
        }
        /**
         * Locals
         */
      }, {
        key: "hasLocal",
        value: function hasLocal(index) {
          return typeof this.getLocal(index) !== "undefined";
        }
      }, {
        key: "getLocal",
        value: function getLocal(index) {
          return this.locals[index];
        }
      }, {
        key: "addLocal",
        value: function addLocal(type) {
          this.locals.push(type);
        }
        /**
         * Types
         */
      }, {
        key: "addType",
        value: function addType(type) {
          if (!(type.functype.type === "Signature")) {
            throw new Error('type.functype.type === "Signature" error: unknown');
          }
          this.types.push(type.functype);
        }
      }, {
        key: "hasType",
        value: function hasType(index) {
          return this.types[index] !== void 0;
        }
      }, {
        key: "getType",
        value: function getType(index) {
          return this.types[index];
        }
        /**
         * Globals
         */
      }, {
        key: "hasGlobal",
        value: function hasGlobal(index) {
          return this.globals.length > index && index >= 0;
        }
      }, {
        key: "getGlobal",
        value: function getGlobal(index) {
          return this.globals[index].type;
        }
      }, {
        key: "getGlobalOffsetByIdentifier",
        value: function getGlobalOffsetByIdentifier(name) {
          if (!(typeof name === "string")) {
            throw new Error('typeof name === "string" error: unknown');
          }
          return this.globalsOffsetByIdentifier[name];
        }
      }, {
        key: "defineGlobal",
        value: function defineGlobal(global) {
          var type = global.globalType.valtype;
          var mutability = global.globalType.mutability;
          this.globals.push({
            type,
            mutability
          });
          if (typeof global.name !== "undefined") {
            this.globalsOffsetByIdentifier[global.name.value] = this.globals.length - 1;
          }
        }
      }, {
        key: "importGlobal",
        value: function importGlobal(type, mutability) {
          this.globals.push({
            type,
            mutability
          });
        }
      }, {
        key: "isMutableGlobal",
        value: function isMutableGlobal(index) {
          return this.globals[index].mutability === "var";
        }
      }, {
        key: "isImmutableGlobal",
        value: function isImmutableGlobal(index) {
          return this.globals[index].mutability === "const";
        }
        /**
         * Memories
         */
      }, {
        key: "hasMemory",
        value: function hasMemory(index) {
          return this.mems.length > index && index >= 0;
        }
      }, {
        key: "addMemory",
        value: function addMemory(min, max) {
          this.mems.push({
            min,
            max
          });
        }
      }, {
        key: "getMemory",
        value: function getMemory(index) {
          return this.mems[index];
        }
      }]);
      return ModuleContext2;
    }();
    exports.ModuleContext = ModuleContext;
  }
});

// node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/index.js
var require_lib7 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+ast@1.12.1/node_modules/@webassemblyjs/ast/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _exportNames = {
      numberLiteralFromRaw: true,
      withLoc: true,
      withRaw: true,
      funcParam: true,
      indexLiteral: true,
      memIndexLiteral: true,
      instruction: true,
      objectInstruction: true,
      traverse: true,
      signatures: true,
      cloneNode: true,
      moduleContextFromModuleAST: true
    };
    Object.defineProperty(exports, "numberLiteralFromRaw", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.numberLiteralFromRaw;
      }
    });
    Object.defineProperty(exports, "withLoc", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.withLoc;
      }
    });
    Object.defineProperty(exports, "withRaw", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.withRaw;
      }
    });
    Object.defineProperty(exports, "funcParam", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.funcParam;
      }
    });
    Object.defineProperty(exports, "indexLiteral", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.indexLiteral;
      }
    });
    Object.defineProperty(exports, "memIndexLiteral", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.memIndexLiteral;
      }
    });
    Object.defineProperty(exports, "instruction", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.instruction;
      }
    });
    Object.defineProperty(exports, "objectInstruction", {
      enumerable: true,
      get: function get() {
        return _nodeHelpers.objectInstruction;
      }
    });
    Object.defineProperty(exports, "traverse", {
      enumerable: true,
      get: function get() {
        return _traverse.traverse;
      }
    });
    Object.defineProperty(exports, "signatures", {
      enumerable: true,
      get: function get() {
        return _signatures.signatures;
      }
    });
    Object.defineProperty(exports, "cloneNode", {
      enumerable: true,
      get: function get() {
        return _clone.cloneNode;
      }
    });
    Object.defineProperty(exports, "moduleContextFromModuleAST", {
      enumerable: true,
      get: function get() {
        return _astModuleToModuleContext.moduleContextFromModuleAST;
      }
    });
    var _nodes = require_nodes();
    Object.keys(_nodes).forEach(function(key) {
      if (key === "default" || key === "__esModule")
        return;
      if (Object.prototype.hasOwnProperty.call(_exportNames, key))
        return;
      if (key in exports && exports[key] === _nodes[key])
        return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return _nodes[key];
        }
      });
    });
    var _nodeHelpers = require_node_helpers();
    var _traverse = require_traverse();
    var _signatures = require_signatures();
    var _utils = require_utils();
    Object.keys(_utils).forEach(function(key) {
      if (key === "default" || key === "__esModule")
        return;
      if (Object.prototype.hasOwnProperty.call(_exportNames, key))
        return;
      if (key in exports && exports[key] === _utils[key])
        return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return _utils[key];
        }
      });
    });
    var _clone = require_clone();
    var _astModuleToModuleContext = require_ast_module_to_module_context();
  }
});

// node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/bits.js
var require_bits = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/bits.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.extract = extract;
    exports.inject = inject;
    exports.getSign = getSign;
    exports.highOrder = highOrder;
    function extract(buffer, bitIndex, bitLength, defaultBit) {
      if (bitLength < 0 || bitLength > 32) {
        throw new Error("Bad value for bitLength.");
      }
      if (defaultBit === void 0) {
        defaultBit = 0;
      } else if (defaultBit !== 0 && defaultBit !== 1) {
        throw new Error("Bad value for defaultBit.");
      }
      var defaultByte = defaultBit * 255;
      var result = 0;
      var lastBit = bitIndex + bitLength;
      var startByte = Math.floor(bitIndex / 8);
      var startBit = bitIndex % 8;
      var endByte = Math.floor(lastBit / 8);
      var endBit = lastBit % 8;
      if (endBit !== 0) {
        result = get(endByte) & (1 << endBit) - 1;
      }
      while (endByte > startByte) {
        endByte--;
        result = result << 8 | get(endByte);
      }
      result >>>= startBit;
      return result;
      function get(index) {
        var result2 = buffer[index];
        return result2 === void 0 ? defaultByte : result2;
      }
    }
    function inject(buffer, bitIndex, bitLength, value) {
      if (bitLength < 0 || bitLength > 32) {
        throw new Error("Bad value for bitLength.");
      }
      var lastByte = Math.floor((bitIndex + bitLength - 1) / 8);
      if (bitIndex < 0 || lastByte >= buffer.length) {
        throw new Error("Index out of range.");
      }
      var atByte = Math.floor(bitIndex / 8);
      var atBit = bitIndex % 8;
      while (bitLength > 0) {
        if (value & 1) {
          buffer[atByte] |= 1 << atBit;
        } else {
          buffer[atByte] &= ~(1 << atBit);
        }
        value >>= 1;
        bitLength--;
        atBit = (atBit + 1) % 8;
        if (atBit === 0) {
          atByte++;
        }
      }
    }
    function getSign(buffer) {
      return buffer[buffer.length - 1] >>> 7;
    }
    function highOrder(bit, buffer) {
      var length = buffer.length;
      var fullyWrongByte = (bit ^ 1) * 255;
      while (length > 0 && buffer[length - 1] === fullyWrongByte) {
        length--;
      }
      if (length === 0) {
        return -1;
      }
      var byteToCheck = buffer[length - 1];
      var result = length * 8 - 1;
      for (var i = 7; i > 0; i--) {
        if ((byteToCheck >> i & 1) === bit) {
          break;
        }
        result--;
      }
      return result;
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/bufs.js
var require_bufs = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/bufs.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.alloc = alloc;
    exports.free = free;
    exports.resize = resize;
    exports.readInt = readInt;
    exports.readUInt = readUInt;
    exports.writeInt64 = writeInt64;
    exports.writeUInt64 = writeUInt64;
    var bufPool = [];
    var TEMP_BUF_MAXIMUM_LENGTH = 20;
    var MIN_EXACT_INT64 = -9223372036854776e3;
    var MAX_EXACT_INT64 = 9223372036854775e3;
    var MAX_EXACT_UINT64 = 1844674407370955e4;
    var BIT_32 = 4294967296;
    var BIT_64 = 18446744073709552e3;
    function lowestBit(num) {
      return num & -num;
    }
    function isLossyToAdd(accum, num) {
      if (num === 0) {
        return false;
      }
      var lowBit = lowestBit(num);
      var added = accum + lowBit;
      if (added === accum) {
        return true;
      }
      if (added - lowBit !== accum) {
        return true;
      }
      return false;
    }
    function alloc(length) {
      var result = bufPool[length];
      if (result) {
        bufPool[length] = void 0;
      } else {
        result = new Uint8Array(length);
      }
      result.fill(0);
      return result;
    }
    function free(buffer) {
      var length = buffer.length;
      if (length < TEMP_BUF_MAXIMUM_LENGTH) {
        bufPool[length] = buffer;
      }
    }
    function resize(buffer, length) {
      if (length === buffer.length) {
        return buffer;
      }
      var newBuf = alloc(length);
      for (var i = 0; i <= buffer.length; i++) {
        newBuf[i] = buffer[i];
      }
      free(buffer);
      return newBuf;
    }
    function readInt(buffer) {
      var length = buffer.length;
      var positive = buffer[length - 1] < 128;
      var result = positive ? 0 : -1;
      var lossy = false;
      if (length < 7) {
        for (var i = length - 1; i >= 0; i--) {
          result = result * 256 + buffer[i];
        }
      } else {
        for (var _i = length - 1; _i >= 0; _i--) {
          var one = buffer[_i];
          result *= 256;
          if (isLossyToAdd(result, one)) {
            lossy = true;
          }
          result += one;
        }
      }
      return {
        value: result,
        lossy
      };
    }
    function readUInt(buffer) {
      var length = buffer.length;
      var result = 0;
      var lossy = false;
      if (length < 7) {
        for (var i = length - 1; i >= 0; i--) {
          result = result * 256 + buffer[i];
        }
      } else {
        for (var _i2 = length - 1; _i2 >= 0; _i2--) {
          var one = buffer[_i2];
          result *= 256;
          if (isLossyToAdd(result, one)) {
            lossy = true;
          }
          result += one;
        }
      }
      return {
        value: result,
        lossy
      };
    }
    function writeInt64(value, buffer) {
      if (value < MIN_EXACT_INT64 || value > MAX_EXACT_INT64) {
        throw new Error("Value out of range.");
      }
      if (value < 0) {
        value += BIT_64;
      }
      writeUInt64(value, buffer);
    }
    function writeUInt64(value, buffer) {
      if (value < 0 || value > MAX_EXACT_UINT64) {
        throw new Error("Value out of range.");
      }
      var lowWord = value % BIT_32;
      var highWord = Math.floor(value / BIT_32);
      buffer[0] = lowWord & 255;
      buffer[1] = lowWord >> 8 & 255;
      buffer[2] = lowWord >> 16 & 255;
      buffer[3] = lowWord >> 24 & 255;
      buffer[4] = highWord & 255;
      buffer[5] = highWord >> 8 & 255;
      buffer[6] = highWord >> 16 & 255;
      buffer[7] = highWord >> 24 & 255;
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/leb.js
var require_leb = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/leb.js"(exports) {
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _long = _interopRequireDefault(require_long());
    var bits = _interopRequireWildcard(require_bits());
    var bufs = _interopRequireWildcard(require_bufs());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function")
        return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var MIN_INT32 = -2147483648;
    var MAX_INT32 = 2147483647;
    var MAX_UINT32 = 4294967295;
    function signedBitCount(buffer) {
      return bits.highOrder(bits.getSign(buffer) ^ 1, buffer) + 2;
    }
    function unsignedBitCount(buffer) {
      var result = bits.highOrder(1, buffer) + 1;
      return result ? result : 1;
    }
    function encodeBufferCommon(buffer, signed) {
      var signBit;
      var bitCount;
      if (signed) {
        signBit = bits.getSign(buffer);
        bitCount = signedBitCount(buffer);
      } else {
        signBit = 0;
        bitCount = unsignedBitCount(buffer);
      }
      var byteCount = Math.ceil(bitCount / 7);
      var result = bufs.alloc(byteCount);
      for (var i = 0; i < byteCount; i++) {
        var payload = bits.extract(buffer, i * 7, 7, signBit);
        result[i] = payload | 128;
      }
      result[byteCount - 1] &= 127;
      return result;
    }
    function encodedLength(encodedBuffer, index) {
      var result = 0;
      while (encodedBuffer[index + result] >= 128) {
        result++;
      }
      result++;
      if (index + result > encodedBuffer.length) ;
      return result;
    }
    function decodeBufferCommon(encodedBuffer, index, signed) {
      index = index === void 0 ? 0 : index;
      var length = encodedLength(encodedBuffer, index);
      var bitLength = length * 7;
      var byteLength = Math.ceil(bitLength / 8);
      var result = bufs.alloc(byteLength);
      var outIndex = 0;
      while (length > 0) {
        bits.inject(result, outIndex, 7, encodedBuffer[index]);
        outIndex += 7;
        index++;
        length--;
      }
      var signBit;
      var signByte;
      if (signed) {
        var lastByte = result[byteLength - 1];
        var endBit = outIndex % 8;
        if (endBit !== 0) {
          var shift = 32 - endBit;
          lastByte = result[byteLength - 1] = lastByte << shift >> shift & 255;
        }
        signBit = lastByte >> 7;
        signByte = signBit * 255;
      } else {
        signBit = 0;
        signByte = 0;
      }
      while (byteLength > 1 && result[byteLength - 1] === signByte && (!signed || result[byteLength - 2] >> 7 === signBit)) {
        byteLength--;
      }
      result = bufs.resize(result, byteLength);
      return {
        value: result,
        nextIndex: index
      };
    }
    function encodeIntBuffer(buffer) {
      return encodeBufferCommon(buffer, true);
    }
    function decodeIntBuffer(encodedBuffer, index) {
      return decodeBufferCommon(encodedBuffer, index, true);
    }
    function encodeInt32(num) {
      var buf = new Uint8Array(4);
      buf[0] = num & 255;
      buf[1] = num >> 8 & 255;
      buf[2] = num >> 16 & 255;
      buf[3] = num >> 24 & 255;
      var result = encodeIntBuffer(buf);
      return result;
    }
    function decodeInt32(encodedBuffer, index) {
      var result = decodeIntBuffer(encodedBuffer, index);
      var parsed = bufs.readInt(result.value);
      var value = parsed.value;
      bufs.free(result.value);
      if (value < MIN_INT32 || value > MAX_INT32) {
        throw new Error("integer too large");
      }
      return {
        value,
        nextIndex: result.nextIndex
      };
    }
    function encodeInt64(num) {
      var buf = bufs.alloc(8);
      bufs.writeInt64(num, buf);
      var result = encodeIntBuffer(buf);
      bufs.free(buf);
      return result;
    }
    function decodeInt64(encodedBuffer, index) {
      var result = decodeIntBuffer(encodedBuffer, index);
      var length = result.value.length;
      if (result.value[length - 1] >> 7) {
        result.value = bufs.resize(result.value, 8);
        result.value.fill(255, length);
      }
      var value = _long["default"].fromBytesLE(result.value, false);
      bufs.free(result.value);
      return {
        value,
        nextIndex: result.nextIndex,
        lossy: false
      };
    }
    function encodeUIntBuffer(buffer) {
      return encodeBufferCommon(buffer, false);
    }
    function decodeUIntBuffer(encodedBuffer, index) {
      return decodeBufferCommon(encodedBuffer, index, false);
    }
    function encodeUInt32(num) {
      var buf = new Uint8Array(4);
      buf[0] = num & 255;
      buf[1] = num >> 8 & 255;
      buf[2] = num >> 16 & 255;
      buf[3] = num >> 24 & 255;
      var result = encodeUIntBuffer(buf);
      return result;
    }
    function decodeUInt32(encodedBuffer, index) {
      var result = decodeUIntBuffer(encodedBuffer, index);
      var parsed = bufs.readUInt(result.value);
      var value = parsed.value;
      bufs.free(result.value);
      if (value > MAX_UINT32) {
        throw new Error("integer too large");
      }
      return {
        value,
        nextIndex: result.nextIndex
      };
    }
    function encodeUInt64(num) {
      var buf = bufs.alloc(8);
      bufs.writeUInt64(num, buf);
      var result = encodeUIntBuffer(buf);
      bufs.free(buf);
      return result;
    }
    function decodeUInt64(encodedBuffer, index) {
      var result = decodeUIntBuffer(encodedBuffer, index);
      var value = _long["default"].fromBytesLE(result.value, true);
      bufs.free(result.value);
      return {
        value,
        nextIndex: result.nextIndex,
        lossy: false
      };
    }
    var _default = {
      decodeInt32,
      decodeInt64,
      decodeIntBuffer,
      decodeUInt32,
      decodeUInt64,
      decodeUIntBuffer,
      encodeInt32,
      encodeInt64,
      encodeIntBuffer,
      encodeUInt32,
      encodeUInt64,
      encodeUIntBuffer
    };
    exports["default"] = _default;
  }
});

// node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/index.js
var require_lib8 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+leb128@1.12.1/node_modules/@webassemblyjs/leb128/lib/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.decodeInt64 = decodeInt64;
    exports.decodeUInt64 = decodeUInt64;
    exports.decodeInt32 = decodeInt32;
    exports.decodeUInt32 = decodeUInt32;
    exports.encodeU32 = encodeU32;
    exports.encodeI32 = encodeI32;
    exports.encodeI64 = encodeI64;
    exports.MAX_NUMBER_OF_BYTE_U64 = exports.MAX_NUMBER_OF_BYTE_U32 = void 0;
    var _leb = _interopRequireDefault(require_leb());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var MAX_NUMBER_OF_BYTE_U32 = 5;
    exports.MAX_NUMBER_OF_BYTE_U32 = MAX_NUMBER_OF_BYTE_U32;
    var MAX_NUMBER_OF_BYTE_U64 = 10;
    exports.MAX_NUMBER_OF_BYTE_U64 = MAX_NUMBER_OF_BYTE_U64;
    function decodeInt64(encodedBuffer, index) {
      return _leb["default"].decodeInt64(encodedBuffer, index);
    }
    function decodeUInt64(encodedBuffer, index) {
      return _leb["default"].decodeUInt64(encodedBuffer, index);
    }
    function decodeInt32(encodedBuffer, index) {
      return _leb["default"].decodeInt32(encodedBuffer, index);
    }
    function decodeUInt32(encodedBuffer, index) {
      return _leb["default"].decodeUInt32(encodedBuffer, index);
    }
    function encodeU32(v) {
      return _leb["default"].encodeUInt32(v);
    }
    function encodeI32(v) {
      return _leb["default"].encodeInt32(v);
    }
    function encodeI64(v) {
      return _leb["default"].encodeInt64(v);
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+wasm-parser@1.12.1/node_modules/@webassemblyjs/wasm-parser/lib/decoder.js
var require_decoder2 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+wasm-parser@1.12.1/node_modules/@webassemblyjs/wasm-parser/lib/decoder.js"(exports) {
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.decode = decode2;
    var _helperApiError = require_lib();
    var ieee754 = _interopRequireWildcard(require_lib2());
    var utf8 = _interopRequireWildcard(require_lib3());
    var t = _interopRequireWildcard(require_lib7());
    var _leb = require_lib8();
    var _helperWasmBytecode = _interopRequireDefault(require_lib6());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function")
        return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
        return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr))
        return _arrayLikeToArray(arr);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function toHex(n) {
      return "0x" + Number(n).toString(16);
    }
    function byteArrayEq(l, r) {
      if (l.length !== r.length) {
        return false;
      }
      for (var i = 0; i < l.length; i++) {
        if (l[i] !== r[i]) {
          return false;
        }
      }
      return true;
    }
    function decode2(ab, opts) {
      var buf = new Uint8Array(ab);
      var getUniqueName = t.getUniqueNameGenerator();
      var offset = 0;
      function getPosition() {
        return {
          line: -1,
          column: offset
        };
      }
      function dump(b, msg) {
        if (opts.dump === false)
          return;
        var pad = "										";
        var str = "";
        if (b.length < 5) {
          str = b.map(toHex).join(" ");
        } else {
          str = "...";
        }
        console.log(toHex(offset) + ":	", str, pad, ";", msg);
      }
      function dumpSep(msg) {
        if (opts.dump === false)
          return;
        console.log(";", msg);
      }
      var state = {
        elementsInFuncSection: [],
        elementsInExportSection: [],
        elementsInCodeSection: [],
        /**
         * Decode memory from:
         * - Memory section
         */
        memoriesInModule: [],
        /**
         * Decoded types from:
         * - Type section
         */
        typesInModule: [],
        /**
         * Decoded functions from:
         * - Function section
         * - Import section
         */
        functionsInModule: [],
        /**
         * Decoded tables from:
         * - Table section
         */
        tablesInModule: [],
        /**
         * Decoded globals from:
         * - Global section
         */
        globalsInModule: []
      };
      function isEOF() {
        return offset >= buf.length;
      }
      function eatBytes(n) {
        offset = offset + n;
      }
      function readBytesAtOffset(_offset, numberOfBytes) {
        var arr = [];
        for (var i = 0; i < numberOfBytes; i++) {
          arr.push(buf[_offset + i]);
        }
        return arr;
      }
      function readBytes(numberOfBytes) {
        return readBytesAtOffset(offset, numberOfBytes);
      }
      function readF64() {
        var bytes = readBytes(ieee754.NUMBER_OF_BYTE_F64);
        var value = ieee754.decodeF64(bytes);
        if (Math.sign(value) * value === Infinity) {
          return {
            value: Math.sign(value),
            inf: true,
            nextIndex: ieee754.NUMBER_OF_BYTE_F64
          };
        }
        if (isNaN(value)) {
          var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1;
          var mantissa = 0;
          for (var i = 0; i < bytes.length - 2; ++i) {
            mantissa += bytes[i] * Math.pow(256, i);
          }
          mantissa += bytes[bytes.length - 2] % 16 * Math.pow(256, bytes.length - 2);
          return {
            value: sign * mantissa,
            nan: true,
            nextIndex: ieee754.NUMBER_OF_BYTE_F64
          };
        }
        return {
          value,
          nextIndex: ieee754.NUMBER_OF_BYTE_F64
        };
      }
      function readF32() {
        var bytes = readBytes(ieee754.NUMBER_OF_BYTE_F32);
        var value = ieee754.decodeF32(bytes);
        if (Math.sign(value) * value === Infinity) {
          return {
            value: Math.sign(value),
            inf: true,
            nextIndex: ieee754.NUMBER_OF_BYTE_F32
          };
        }
        if (isNaN(value)) {
          var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1;
          var mantissa = 0;
          for (var i = 0; i < bytes.length - 2; ++i) {
            mantissa += bytes[i] * Math.pow(256, i);
          }
          mantissa += bytes[bytes.length - 2] % 128 * Math.pow(256, bytes.length - 2);
          return {
            value: sign * mantissa,
            nan: true,
            nextIndex: ieee754.NUMBER_OF_BYTE_F32
          };
        }
        return {
          value,
          nextIndex: ieee754.NUMBER_OF_BYTE_F32
        };
      }
      function readUTF8String() {
        var lenu32 = readU32();
        var strlen = lenu32.value;
        dump([strlen], "string length");
        var bytes = readBytesAtOffset(offset + lenu32.nextIndex, strlen);
        var value = utf8.decode(bytes);
        return {
          value,
          nextIndex: strlen + lenu32.nextIndex
        };
      }
      function readU32() {
        var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U32);
        var buffer = new Uint8Array(bytes);
        return (0, _leb.decodeUInt32)(buffer);
      }
      function readVaruint32() {
        var bytes = readBytes(4);
        var buffer = new Uint8Array(bytes);
        return (0, _leb.decodeUInt32)(buffer);
      }
      function readVaruint7() {
        var bytes = readBytes(1);
        var buffer = new Uint8Array(bytes);
        return (0, _leb.decodeUInt32)(buffer);
      }
      function read32() {
        var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U32);
        var buffer = new Uint8Array(bytes);
        return (0, _leb.decodeInt32)(buffer);
      }
      function read64() {
        var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U64);
        var buffer = new Uint8Array(bytes);
        return (0, _leb.decodeInt64)(buffer);
      }
      function readU64() {
        var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U64);
        var buffer = new Uint8Array(bytes);
        return (0, _leb.decodeUInt64)(buffer);
      }
      function readByte() {
        return readBytes(1)[0];
      }
      function parseModuleHeader() {
        if (isEOF() === true || offset + 4 > buf.length) {
          throw new Error("unexpected end");
        }
        var header = readBytes(4);
        if (byteArrayEq(_helperWasmBytecode["default"].magicModuleHeader, header) === false) {
          throw new _helperApiError.CompileError("magic header not detected");
        }
        dump(header, "wasm magic header");
        eatBytes(4);
      }
      function parseVersion() {
        if (isEOF() === true || offset + 4 > buf.length) {
          throw new Error("unexpected end");
        }
        var version = readBytes(4);
        if (byteArrayEq(_helperWasmBytecode["default"].moduleVersion, version) === false) {
          throw new _helperApiError.CompileError("unknown binary version");
        }
        dump(version, "wasm version");
        eatBytes(4);
      }
      function parseVec(cast) {
        var u32 = readU32();
        var length = u32.value;
        eatBytes(u32.nextIndex);
        dump([length], "number");
        if (length === 0) {
          return [];
        }
        var elements = [];
        for (var i = 0; i < length; i++) {
          var _byte = readByte();
          eatBytes(1);
          var value = cast(_byte);
          dump([_byte], value);
          if (typeof value === "undefined") {
            throw new _helperApiError.CompileError("Internal failure: parseVec could not cast the value");
          }
          elements.push(value);
        }
        return elements;
      }
      function parseTypeSection(numberOfTypes) {
        var typeInstructionNodes = [];
        dump([numberOfTypes], "num types");
        for (var i = 0; i < numberOfTypes; i++) {
          var _startLoc = getPosition();
          dumpSep("type " + i);
          var type = readByte();
          eatBytes(1);
          if (type == _helperWasmBytecode["default"].types.func) {
            dump([type], "func");
            var paramValtypes = parseVec(function(b) {
              return _helperWasmBytecode["default"].valtypes[b];
            });
            var params = paramValtypes.map(function(v) {
              return t.funcParam(
                /*valtype*/
                v
              );
            });
            var result = parseVec(function(b) {
              return _helperWasmBytecode["default"].valtypes[b];
            });
            typeInstructionNodes.push(function() {
              var endLoc = getPosition();
              return t.withLoc(t.typeInstruction(void 0, t.signature(params, result)), endLoc, _startLoc);
            }());
            state.typesInModule.push({
              params,
              result
            });
          } else {
            throw new Error("Unsupported type: " + toHex(type));
          }
        }
        return typeInstructionNodes;
      }
      function parseImportSection(numberOfImports) {
        var imports = [];
        for (var i = 0; i < numberOfImports; i++) {
          dumpSep("import header " + i);
          var _startLoc2 = getPosition();
          var moduleName = readUTF8String();
          eatBytes(moduleName.nextIndex);
          dump([], "module name (".concat(moduleName.value, ")"));
          var name = readUTF8String();
          eatBytes(name.nextIndex);
          dump([], "name (".concat(name.value, ")"));
          var descrTypeByte = readByte();
          eatBytes(1);
          var descrType = _helperWasmBytecode["default"].importTypes[descrTypeByte];
          dump([descrTypeByte], "import kind");
          if (typeof descrType === "undefined") {
            throw new _helperApiError.CompileError("Unknown import description type: " + toHex(descrTypeByte));
          }
          var importDescr = void 0;
          if (descrType === "func") {
            var indexU32 = readU32();
            var typeindex = indexU32.value;
            eatBytes(indexU32.nextIndex);
            dump([typeindex], "type index");
            var signature = state.typesInModule[typeindex];
            if (typeof signature === "undefined") {
              throw new _helperApiError.CompileError("function signature not found (".concat(typeindex, ")"));
            }
            var id = getUniqueName("func");
            importDescr = t.funcImportDescr(id, t.signature(signature.params, signature.result));
            state.functionsInModule.push({
              id: t.identifier(name.value),
              signature,
              isExternal: true
            });
          } else if (descrType === "global") {
            importDescr = parseGlobalType();
            var globalNode = t.global(importDescr, []);
            state.globalsInModule.push(globalNode);
          } else if (descrType === "table") {
            importDescr = parseTableType(i);
          } else if (descrType === "memory") {
            var memoryNode = parseMemoryType(0);
            state.memoriesInModule.push(memoryNode);
            importDescr = memoryNode;
          } else {
            throw new _helperApiError.CompileError("Unsupported import of type: " + descrType);
          }
          imports.push(function() {
            var endLoc = getPosition();
            return t.withLoc(t.moduleImport(moduleName.value, name.value, importDescr), endLoc, _startLoc2);
          }());
        }
        return imports;
      }
      function parseFuncSection(numberOfFunctions) {
        dump([numberOfFunctions], "num funcs");
        for (var i = 0; i < numberOfFunctions; i++) {
          var indexU32 = readU32();
          var typeindex = indexU32.value;
          eatBytes(indexU32.nextIndex);
          dump([typeindex], "type index");
          var signature = state.typesInModule[typeindex];
          if (typeof signature === "undefined") {
            throw new _helperApiError.CompileError("function signature not found (".concat(typeindex, ")"));
          }
          var id = t.withRaw(t.identifier(getUniqueName("func")), "");
          state.functionsInModule.push({
            id,
            signature,
            isExternal: false
          });
        }
      }
      function parseExportSection(numberOfExport) {
        dump([numberOfExport], "num exports");
        for (var i = 0; i < numberOfExport; i++) {
          var _startLoc3 = getPosition();
          var name = readUTF8String();
          eatBytes(name.nextIndex);
          dump([], "export name (".concat(name.value, ")"));
          var typeIndex = readByte();
          eatBytes(1);
          dump([typeIndex], "export kind");
          var indexu32 = readU32();
          var index = indexu32.value;
          eatBytes(indexu32.nextIndex);
          dump([index], "export index");
          var id = void 0, signature = void 0;
          if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Func") {
            var func = state.functionsInModule[index];
            if (typeof func === "undefined") {
              throw new _helperApiError.CompileError("unknown function (".concat(index, ")"));
            }
            id = t.numberLiteralFromRaw(index, String(index));
            signature = func.signature;
          } else if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Table") {
            var table = state.tablesInModule[index];
            if (typeof table === "undefined") {
              throw new _helperApiError.CompileError("unknown table ".concat(index));
            }
            id = t.numberLiteralFromRaw(index, String(index));
            signature = null;
          } else if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Memory") {
            var memNode = state.memoriesInModule[index];
            if (typeof memNode === "undefined") {
              throw new _helperApiError.CompileError("unknown memory ".concat(index));
            }
            id = t.numberLiteralFromRaw(index, String(index));
            signature = null;
          } else if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Global") {
            var global = state.globalsInModule[index];
            if (typeof global === "undefined") {
              throw new _helperApiError.CompileError("unknown global ".concat(index));
            }
            id = t.numberLiteralFromRaw(index, String(index));
            signature = null;
          } else {
            console.warn("Unsupported export type: " + toHex(typeIndex));
            return;
          }
          var endLoc = getPosition();
          state.elementsInExportSection.push({
            name: name.value,
            type: _helperWasmBytecode["default"].exportTypes[typeIndex],
            signature,
            id,
            index,
            endLoc,
            startLoc: _startLoc3
          });
        }
      }
      function parseCodeSection(numberOfFuncs) {
        dump([numberOfFuncs], "number functions");
        for (var i = 0; i < numberOfFuncs; i++) {
          var _startLoc4 = getPosition();
          dumpSep("function body " + i);
          var bodySizeU32 = readU32();
          eatBytes(bodySizeU32.nextIndex);
          dump([bodySizeU32.value], "function body size");
          var code = [];
          var funcLocalNumU32 = readU32();
          var funcLocalNum = funcLocalNumU32.value;
          eatBytes(funcLocalNumU32.nextIndex);
          dump([funcLocalNum], "num locals");
          var locals = [];
          for (var _i = 0; _i < funcLocalNum; _i++) {
            var _startLoc5 = getPosition();
            var localCountU32 = readU32();
            var localCount = localCountU32.value;
            eatBytes(localCountU32.nextIndex);
            dump([localCount], "num local");
            var valtypeByte = readByte();
            eatBytes(1);
            var type = _helperWasmBytecode["default"].valtypes[valtypeByte];
            var args = [];
            for (var _i2 = 0; _i2 < localCount; _i2++) {
              args.push(t.valtypeLiteral(type));
            }
            var localNode = function() {
              var endLoc2 = getPosition();
              return t.withLoc(t.instruction("local", args), endLoc2, _startLoc5);
            }();
            locals.push(localNode);
            dump([valtypeByte], type);
            if (typeof type === "undefined") {
              throw new _helperApiError.CompileError("Unexpected valtype: " + toHex(valtypeByte));
            }
          }
          code.push.apply(code, locals);
          parseInstructionBlock(code);
          var endLoc = getPosition();
          state.elementsInCodeSection.push({
            code,
            locals,
            endLoc,
            startLoc: _startLoc4,
            bodySize: bodySizeU32.value
          });
        }
      }
      function parseInstructionBlock(code) {
        while (true) {
          var _startLoc6 = getPosition();
          var instructionAlreadyCreated = false;
          var instructionByte = readByte();
          eatBytes(1);
          if (instructionByte === 254) {
            instructionByte = 65024 + readByte();
            eatBytes(1);
          }
          var instruction = _helperWasmBytecode["default"].symbolsByByte[instructionByte];
          if (typeof instruction === "undefined") {
            throw new _helperApiError.CompileError("Unexpected instruction: " + toHex(instructionByte));
          }
          if (typeof instruction.object === "string") {
            dump([instructionByte], "".concat(instruction.object, ".").concat(instruction.name));
          } else {
            dump([instructionByte], instruction.name);
          }
          if (instruction.name === "end") {
            var node = function() {
              var endLoc = getPosition();
              return t.withLoc(t.instruction(instruction.name), endLoc, _startLoc6);
            }();
            code.push(node);
            break;
          }
          var args = [];
          var namedArgs = void 0;
          if (instruction.name === "loop") {
            var _startLoc7 = getPosition();
            var blocktypeByte = readByte();
            eatBytes(1);
            var blocktype = _helperWasmBytecode["default"].blockTypes[blocktypeByte];
            dump([blocktypeByte], "blocktype");
            if (typeof blocktype === "undefined") {
              throw new _helperApiError.CompileError("Unexpected blocktype: " + toHex(blocktypeByte));
            }
            var instr = [];
            parseInstructionBlock(instr);
            var label = t.withRaw(t.identifier(getUniqueName("loop")), "");
            var loopNode = function() {
              var endLoc = getPosition();
              return t.withLoc(t.loopInstruction(label, blocktype, instr), endLoc, _startLoc7);
            }();
            code.push(loopNode);
            instructionAlreadyCreated = true;
          } else if (instruction.name === "if") {
            var _startLoc8 = getPosition();
            var _blocktypeByte = readByte();
            eatBytes(1);
            var _blocktype = _helperWasmBytecode["default"].blockTypes[_blocktypeByte];
            dump([_blocktypeByte], "blocktype");
            if (typeof _blocktype === "undefined") {
              throw new _helperApiError.CompileError("Unexpected blocktype: " + toHex(_blocktypeByte));
            }
            var testIndex = t.withRaw(t.identifier(getUniqueName("if")), "");
            var ifBody = [];
            parseInstructionBlock(ifBody);
            var elseIndex = 0;
            for (elseIndex = 0; elseIndex < ifBody.length; ++elseIndex) {
              var _instr = ifBody[elseIndex];
              if (_instr.type === "Instr" && _instr.id === "else") {
                break;
              }
            }
            var consequentInstr = ifBody.slice(0, elseIndex);
            var alternate = ifBody.slice(elseIndex + 1);
            var testInstrs = [];
            var ifNode = function() {
              var endLoc = getPosition();
              return t.withLoc(t.ifInstruction(testIndex, testInstrs, _blocktype, consequentInstr, alternate), endLoc, _startLoc8);
            }();
            code.push(ifNode);
            instructionAlreadyCreated = true;
          } else if (instruction.name === "block") {
            var _startLoc9 = getPosition();
            var _blocktypeByte2 = readByte();
            eatBytes(1);
            var _blocktype2 = _helperWasmBytecode["default"].blockTypes[_blocktypeByte2];
            dump([_blocktypeByte2], "blocktype");
            if (typeof _blocktype2 === "undefined") {
              throw new _helperApiError.CompileError("Unexpected blocktype: " + toHex(_blocktypeByte2));
            }
            var _instr2 = [];
            parseInstructionBlock(_instr2);
            var _label = t.withRaw(t.identifier(getUniqueName("block")), "");
            var blockNode = function() {
              var endLoc = getPosition();
              return t.withLoc(t.blockInstruction(_label, _instr2, _blocktype2), endLoc, _startLoc9);
            }();
            code.push(blockNode);
            instructionAlreadyCreated = true;
          } else if (instruction.name === "call") {
            var indexu32 = readU32();
            var index = indexu32.value;
            eatBytes(indexu32.nextIndex);
            dump([index], "index");
            var callNode = function() {
              var endLoc = getPosition();
              return t.withLoc(t.callInstruction(t.indexLiteral(index)), endLoc, _startLoc6);
            }();
            code.push(callNode);
            instructionAlreadyCreated = true;
          } else if (instruction.name === "call_indirect") {
            var _startLoc10 = getPosition();
            var indexU32 = readU32();
            var typeindex = indexU32.value;
            eatBytes(indexU32.nextIndex);
            dump([typeindex], "type index");
            var signature = state.typesInModule[typeindex];
            if (typeof signature === "undefined") {
              throw new _helperApiError.CompileError("call_indirect signature not found (".concat(typeindex, ")"));
            }
            var _callNode = t.callIndirectInstruction(t.signature(signature.params, signature.result), []);
            var flagU32 = readU32();
            var flag = flagU32.value;
            eatBytes(flagU32.nextIndex);
            if (flag !== 0) {
              throw new _helperApiError.CompileError("zero flag expected");
            }
            code.push(function() {
              var endLoc = getPosition();
              return t.withLoc(_callNode, endLoc, _startLoc10);
            }());
            instructionAlreadyCreated = true;
          } else if (instruction.name === "br_table") {
            var indicesu32 = readU32();
            var indices = indicesu32.value;
            eatBytes(indicesu32.nextIndex);
            dump([indices], "num indices");
            for (var i = 0; i <= indices; i++) {
              var _indexu = readU32();
              var _index = _indexu.value;
              eatBytes(_indexu.nextIndex);
              dump([_index], "index");
              args.push(t.numberLiteralFromRaw(_indexu.value.toString(), "u32"));
            }
          } else if (instructionByte >= 40 && instructionByte <= 64) {
            if (instruction.name === "grow_memory" || instruction.name === "current_memory") {
              var _indexU = readU32();
              var _index2 = _indexU.value;
              eatBytes(_indexU.nextIndex);
              if (_index2 !== 0) {
                throw new Error("zero flag expected");
              }
              dump([_index2], "index");
            } else {
              var aligun32 = readU32();
              var align = aligun32.value;
              eatBytes(aligun32.nextIndex);
              dump([align], "align");
              var offsetu32 = readU32();
              var _offset2 = offsetu32.value;
              eatBytes(offsetu32.nextIndex);
              dump([_offset2], "offset");
              if (namedArgs === void 0)
                namedArgs = {};
              namedArgs.offset = t.numberLiteralFromRaw(_offset2);
            }
          } else if (instructionByte >= 65 && instructionByte <= 68) {
            if (instruction.object === "i32") {
              var value32 = read32();
              var value = value32.value;
              eatBytes(value32.nextIndex);
              dump([value], "i32 value");
              args.push(t.numberLiteralFromRaw(value));
            }
            if (instruction.object === "u32") {
              var valueu32 = readU32();
              var _value = valueu32.value;
              eatBytes(valueu32.nextIndex);
              dump([_value], "u32 value");
              args.push(t.numberLiteralFromRaw(_value));
            }
            if (instruction.object === "i64") {
              var value64 = read64();
              var _value2 = value64.value;
              eatBytes(value64.nextIndex);
              dump([Number(_value2.toString())], "i64 value");
              var high = _value2.high, low = _value2.low;
              var _node = {
                type: "LongNumberLiteral",
                value: {
                  high,
                  low
                }
              };
              args.push(_node);
            }
            if (instruction.object === "u64") {
              var valueu64 = readU64();
              var _value3 = valueu64.value;
              eatBytes(valueu64.nextIndex);
              dump([Number(_value3.toString())], "u64 value");
              var _high = _value3.high, _low = _value3.low;
              var _node2 = {
                type: "LongNumberLiteral",
                value: {
                  high: _high,
                  low: _low
                }
              };
              args.push(_node2);
            }
            if (instruction.object === "f32") {
              var valuef32 = readF32();
              var _value4 = valuef32.value;
              eatBytes(valuef32.nextIndex);
              dump([_value4], "f32 value");
              args.push(
                // $FlowIgnore
                t.floatLiteral(_value4, valuef32.nan, valuef32.inf, String(_value4))
              );
            }
            if (instruction.object === "f64") {
              var valuef64 = readF64();
              var _value5 = valuef64.value;
              eatBytes(valuef64.nextIndex);
              dump([_value5], "f64 value");
              args.push(
                // $FlowIgnore
                t.floatLiteral(_value5, valuef64.nan, valuef64.inf, String(_value5))
              );
            }
          } else if (instructionByte >= 65024 && instructionByte <= 65279) {
            var align32 = readU32();
            var _align = align32.value;
            eatBytes(align32.nextIndex);
            dump([_align], "align");
            var _offsetu = readU32();
            var _offset3 = _offsetu.value;
            eatBytes(_offsetu.nextIndex);
            dump([_offset3], "offset");
          } else {
            for (var _i3 = 0; _i3 < instruction.numberOfArgs; _i3++) {
              var u32 = readU32();
              eatBytes(u32.nextIndex);
              dump([u32.value], "argument " + _i3);
              args.push(t.numberLiteralFromRaw(u32.value));
            }
          }
          if (instructionAlreadyCreated === false) {
            if (typeof instruction.object === "string") {
              var _node3 = function() {
                var endLoc = getPosition();
                return t.withLoc(t.objectInstruction(instruction.name, instruction.object, args, namedArgs), endLoc, _startLoc6);
              }();
              code.push(_node3);
            } else {
              var _node4 = function() {
                var endLoc = getPosition();
                return t.withLoc(t.instruction(instruction.name, args, namedArgs), endLoc, _startLoc6);
              }();
              code.push(_node4);
            }
          }
        }
      }
      function parseLimits() {
        var limitType = readByte();
        eatBytes(1);
        var shared = limitType === 3;
        dump([limitType], "limit type" + (shared ? " (shared)" : ""));
        var min, max;
        if (limitType === 1 || limitType === 3) {
          var u32min = readU32();
          min = parseInt(u32min.value);
          eatBytes(u32min.nextIndex);
          dump([min], "min");
          var u32max = readU32();
          max = parseInt(u32max.value);
          eatBytes(u32max.nextIndex);
          dump([max], "max");
        }
        if (limitType === 0) {
          var _u32min = readU32();
          min = parseInt(_u32min.value);
          eatBytes(_u32min.nextIndex);
          dump([min], "min");
        }
        return t.limit(min, max, shared);
      }
      function parseTableType(index) {
        var name = t.withRaw(t.identifier(getUniqueName("table")), String(index));
        var elementTypeByte = readByte();
        eatBytes(1);
        dump([elementTypeByte], "element type");
        var elementType = _helperWasmBytecode["default"].tableTypes[elementTypeByte];
        if (typeof elementType === "undefined") {
          throw new _helperApiError.CompileError("Unknown element type in table: " + toHex(elementType));
        }
        var limits = parseLimits();
        return t.table(elementType, limits, name);
      }
      function parseGlobalType() {
        var valtypeByte = readByte();
        eatBytes(1);
        var type = _helperWasmBytecode["default"].valtypes[valtypeByte];
        dump([valtypeByte], type);
        if (typeof type === "undefined") {
          throw new _helperApiError.CompileError("Unknown valtype: " + toHex(valtypeByte));
        }
        var globalTypeByte = readByte();
        eatBytes(1);
        var globalType = _helperWasmBytecode["default"].globalTypes[globalTypeByte];
        dump([globalTypeByte], "global type (".concat(globalType, ")"));
        if (typeof globalType === "undefined") {
          throw new _helperApiError.CompileError("Invalid mutability: " + toHex(globalTypeByte));
        }
        return t.globalType(type, globalType);
      }
      function parseNameSectionFunctions() {
        var functionNames = [];
        var numberOfFunctionsu32 = readU32();
        var numbeOfFunctions = numberOfFunctionsu32.value;
        eatBytes(numberOfFunctionsu32.nextIndex);
        for (var i = 0; i < numbeOfFunctions; i++) {
          var indexu32 = readU32();
          var index = indexu32.value;
          eatBytes(indexu32.nextIndex);
          var name = readUTF8String();
          eatBytes(name.nextIndex);
          functionNames.push(t.functionNameMetadata(name.value, index));
        }
        return functionNames;
      }
      function parseNameSectionLocals() {
        var localNames = [];
        var numbeOfFunctionsu32 = readU32();
        var numbeOfFunctions = numbeOfFunctionsu32.value;
        eatBytes(numbeOfFunctionsu32.nextIndex);
        for (var i = 0; i < numbeOfFunctions; i++) {
          var functionIndexu32 = readU32();
          var functionIndex = functionIndexu32.value;
          eatBytes(functionIndexu32.nextIndex);
          var numLocalsu32 = readU32();
          var numLocals = numLocalsu32.value;
          eatBytes(numLocalsu32.nextIndex);
          for (var _i4 = 0; _i4 < numLocals; _i4++) {
            var localIndexu32 = readU32();
            var localIndex = localIndexu32.value;
            eatBytes(localIndexu32.nextIndex);
            var name = readUTF8String();
            eatBytes(name.nextIndex);
            localNames.push(t.localNameMetadata(name.value, localIndex, functionIndex));
          }
        }
        return localNames;
      }
      function parseNameSection(remainingBytes) {
        var nameMetadata = [];
        var initialOffset = offset;
        while (offset - initialOffset < remainingBytes) {
          var sectionTypeByte = readVaruint7();
          eatBytes(sectionTypeByte.nextIndex);
          var subSectionSizeInBytesu32 = readVaruint32();
          eatBytes(subSectionSizeInBytesu32.nextIndex);
          switch (sectionTypeByte.value) {
            case 1: {
              nameMetadata.push.apply(nameMetadata, _toConsumableArray(parseNameSectionFunctions()));
              break;
            }
            case 2: {
              nameMetadata.push.apply(nameMetadata, _toConsumableArray(parseNameSectionLocals()));
              break;
            }
            default: {
              eatBytes(subSectionSizeInBytesu32.value);
            }
          }
        }
        return nameMetadata;
      }
      function parseProducersSection() {
        var metadata2 = t.producersSectionMetadata([]);
        var sectionTypeByte = readVaruint32();
        eatBytes(sectionTypeByte.nextIndex);
        dump([sectionTypeByte.value], "num of producers");
        var fields = {
          language: [],
          "processed-by": [],
          sdk: []
        };
        for (var fieldI = 0; fieldI < sectionTypeByte.value; fieldI++) {
          var fieldName = readUTF8String();
          eatBytes(fieldName.nextIndex);
          var valueCount = readVaruint32();
          eatBytes(valueCount.nextIndex);
          for (var producerI = 0; producerI < valueCount.value; producerI++) {
            var producerName = readUTF8String();
            eatBytes(producerName.nextIndex);
            var producerVersion = readUTF8String();
            eatBytes(producerVersion.nextIndex);
            fields[fieldName.value].push(t.producerMetadataVersionedName(producerName.value, producerVersion.value));
          }
          metadata2.producers.push(fields[fieldName.value]);
        }
        return metadata2;
      }
      function parseGlobalSection(numberOfGlobals) {
        var globals = [];
        dump([numberOfGlobals], "num globals");
        for (var i = 0; i < numberOfGlobals; i++) {
          var _startLoc11 = getPosition();
          var globalType = parseGlobalType();
          var init = [];
          parseInstructionBlock(init);
          var node = function() {
            var endLoc = getPosition();
            return t.withLoc(t.global(globalType, init), endLoc, _startLoc11);
          }();
          globals.push(node);
          state.globalsInModule.push(node);
        }
        return globals;
      }
      function parseElemSection(numberOfElements) {
        var elems = [];
        dump([numberOfElements], "num elements");
        for (var i = 0; i < numberOfElements; i++) {
          var _startLoc12 = getPosition();
          var tableindexu32 = readU32();
          var tableindex = tableindexu32.value;
          eatBytes(tableindexu32.nextIndex);
          dump([tableindex], "table index");
          var instr = [];
          parseInstructionBlock(instr);
          var indicesu32 = readU32();
          var indices = indicesu32.value;
          eatBytes(indicesu32.nextIndex);
          dump([indices], "num indices");
          var indexValues = [];
          for (var _i5 = 0; _i5 < indices; _i5++) {
            var indexu32 = readU32();
            var index = indexu32.value;
            eatBytes(indexu32.nextIndex);
            dump([index], "index");
            indexValues.push(t.indexLiteral(index));
          }
          var elemNode = function() {
            var endLoc = getPosition();
            return t.withLoc(t.elem(t.indexLiteral(tableindex), instr, indexValues), endLoc, _startLoc12);
          }();
          elems.push(elemNode);
        }
        return elems;
      }
      function parseMemoryType(i) {
        var limits = parseLimits();
        return t.memory(limits, t.indexLiteral(i));
      }
      function parseTableSection(numberOfElements) {
        var tables = [];
        dump([numberOfElements], "num elements");
        for (var i = 0; i < numberOfElements; i++) {
          var tablesNode = parseTableType(i);
          state.tablesInModule.push(tablesNode);
          tables.push(tablesNode);
        }
        return tables;
      }
      function parseMemorySection(numberOfElements) {
        var memories = [];
        dump([numberOfElements], "num elements");
        for (var i = 0; i < numberOfElements; i++) {
          var memoryNode = parseMemoryType(i);
          state.memoriesInModule.push(memoryNode);
          memories.push(memoryNode);
        }
        return memories;
      }
      function parseStartSection() {
        var startLoc = getPosition();
        var u32 = readU32();
        var startFuncIndex = u32.value;
        eatBytes(u32.nextIndex);
        dump([startFuncIndex], "index");
        return function() {
          var endLoc = getPosition();
          return t.withLoc(t.start(t.indexLiteral(startFuncIndex)), endLoc, startLoc);
        }();
      }
      function parseDataSection(numberOfElements) {
        var dataEntries = [];
        dump([numberOfElements], "num elements");
        for (var i = 0; i < numberOfElements; i++) {
          var memoryIndexu32 = readU32();
          var memoryIndex = memoryIndexu32.value;
          eatBytes(memoryIndexu32.nextIndex);
          dump([memoryIndex], "memory index");
          var instrs = [];
          parseInstructionBlock(instrs);
          var hasExtraInstrs = instrs.filter(function(i2) {
            return i2.id !== "end";
          }).length !== 1;
          if (hasExtraInstrs) {
            throw new _helperApiError.CompileError("data section offset must be a single instruction");
          }
          var bytes = parseVec(function(b) {
            return b;
          });
          dump([], "init");
          dataEntries.push(t.data(t.memIndexLiteral(memoryIndex), instrs[0], t.byteArray(bytes)));
        }
        return dataEntries;
      }
      function parseSection(sectionIndex2) {
        var sectionId = readByte();
        eatBytes(1);
        if (sectionId >= sectionIndex2 || sectionIndex2 === _helperWasmBytecode["default"].sections.custom) {
          sectionIndex2 = sectionId + 1;
        } else {
          if (sectionId !== _helperWasmBytecode["default"].sections.custom)
            throw new _helperApiError.CompileError("Unexpected section: " + toHex(sectionId));
        }
        var nextSectionIndex2 = sectionIndex2;
        var startOffset = offset;
        var startLoc = getPosition();
        var u32 = readU32();
        var sectionSizeInBytes = u32.value;
        eatBytes(u32.nextIndex);
        var sectionSizeInBytesNode = function() {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(sectionSizeInBytes), endLoc, startLoc);
        }();
        switch (sectionId) {
          case _helperWasmBytecode["default"].sections.type: {
            dumpSep("section Type");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc13 = getPosition();
            var _u = readU32();
            var numberOfTypes = _u.value;
            eatBytes(_u.nextIndex);
            var metadata2 = t.sectionMetadata("type", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfTypes), endLoc, _startLoc13);
            }());
            var nodes2 = parseTypeSection(numberOfTypes);
            return {
              nodes: nodes2,
              metadata: metadata2,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.table: {
            dumpSep("section Table");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc14 = getPosition();
            var _u2 = readU32();
            var numberOfTable = _u2.value;
            eatBytes(_u2.nextIndex);
            dump([numberOfTable], "num tables");
            var _metadata = t.sectionMetadata("table", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfTable), endLoc, _startLoc14);
            }());
            var _nodes = parseTableSection(numberOfTable);
            return {
              nodes: _nodes,
              metadata: _metadata,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections["import"]: {
            dumpSep("section Import");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc15 = getPosition();
            var numberOfImportsu32 = readU32();
            var numberOfImports = numberOfImportsu32.value;
            eatBytes(numberOfImportsu32.nextIndex);
            dump([numberOfImports], "number of imports");
            var _metadata2 = t.sectionMetadata("import", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfImports), endLoc, _startLoc15);
            }());
            var _nodes2 = parseImportSection(numberOfImports);
            return {
              nodes: _nodes2,
              metadata: _metadata2,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.func: {
            dumpSep("section Function");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc16 = getPosition();
            var numberOfFunctionsu32 = readU32();
            var numberOfFunctions = numberOfFunctionsu32.value;
            eatBytes(numberOfFunctionsu32.nextIndex);
            var _metadata3 = t.sectionMetadata("func", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfFunctions), endLoc, _startLoc16);
            }());
            parseFuncSection(numberOfFunctions);
            var _nodes3 = [];
            return {
              nodes: _nodes3,
              metadata: _metadata3,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections["export"]: {
            dumpSep("section Export");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc17 = getPosition();
            var _u3 = readU32();
            var numberOfExport = _u3.value;
            eatBytes(_u3.nextIndex);
            var _metadata4 = t.sectionMetadata("export", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfExport), endLoc, _startLoc17);
            }());
            parseExportSection(numberOfExport);
            var _nodes4 = [];
            return {
              nodes: _nodes4,
              metadata: _metadata4,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.code: {
            dumpSep("section Code");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc18 = getPosition();
            var _u4 = readU32();
            var numberOfFuncs = _u4.value;
            eatBytes(_u4.nextIndex);
            var _metadata5 = t.sectionMetadata("code", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfFuncs), endLoc, _startLoc18);
            }());
            if (opts.ignoreCodeSection === true) {
              var remainingBytes = sectionSizeInBytes - _u4.nextIndex;
              eatBytes(remainingBytes);
            } else {
              parseCodeSection(numberOfFuncs);
            }
            var _nodes5 = [];
            return {
              nodes: _nodes5,
              metadata: _metadata5,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.start: {
            dumpSep("section Start");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _metadata6 = t.sectionMetadata("start", startOffset, sectionSizeInBytesNode);
            var _nodes6 = [parseStartSection()];
            return {
              nodes: _nodes6,
              metadata: _metadata6,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.element: {
            dumpSep("section Element");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc19 = getPosition();
            var numberOfElementsu32 = readU32();
            var numberOfElements = numberOfElementsu32.value;
            eatBytes(numberOfElementsu32.nextIndex);
            var _metadata7 = t.sectionMetadata("element", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfElements), endLoc, _startLoc19);
            }());
            var _nodes7 = parseElemSection(numberOfElements);
            return {
              nodes: _nodes7,
              metadata: _metadata7,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.global: {
            dumpSep("section Global");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc20 = getPosition();
            var numberOfGlobalsu32 = readU32();
            var numberOfGlobals = numberOfGlobalsu32.value;
            eatBytes(numberOfGlobalsu32.nextIndex);
            var _metadata8 = t.sectionMetadata("global", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(numberOfGlobals), endLoc, _startLoc20);
            }());
            var _nodes8 = parseGlobalSection(numberOfGlobals);
            return {
              nodes: _nodes8,
              metadata: _metadata8,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.memory: {
            dumpSep("section Memory");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _startLoc21 = getPosition();
            var _numberOfElementsu = readU32();
            var _numberOfElements = _numberOfElementsu.value;
            eatBytes(_numberOfElementsu.nextIndex);
            var _metadata9 = t.sectionMetadata("memory", startOffset, sectionSizeInBytesNode, function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(_numberOfElements), endLoc, _startLoc21);
            }());
            var _nodes9 = parseMemorySection(_numberOfElements);
            return {
              nodes: _nodes9,
              metadata: _metadata9,
              nextSectionIndex: nextSectionIndex2
            };
          }
          case _helperWasmBytecode["default"].sections.data: {
            dumpSep("section Data");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _metadata10 = t.sectionMetadata("data", startOffset, sectionSizeInBytesNode);
            var _startLoc22 = getPosition();
            var _numberOfElementsu2 = readU32();
            var _numberOfElements2 = _numberOfElementsu2.value;
            eatBytes(_numberOfElementsu2.nextIndex);
            _metadata10.vectorOfSize = function() {
              var endLoc = getPosition();
              return t.withLoc(t.numberLiteralFromRaw(_numberOfElements2), endLoc, _startLoc22);
            }();
            if (opts.ignoreDataSection === true) {
              var _remainingBytes = sectionSizeInBytes - _numberOfElementsu2.nextIndex;
              eatBytes(_remainingBytes);
              dumpSep("ignore data (" + sectionSizeInBytes + " bytes)");
              return {
                nodes: [],
                metadata: _metadata10,
                nextSectionIndex: nextSectionIndex2
              };
            } else {
              var _nodes10 = parseDataSection(_numberOfElements2);
              return {
                nodes: _nodes10,
                metadata: _metadata10,
                nextSectionIndex: nextSectionIndex2
              };
            }
          }
          case _helperWasmBytecode["default"].sections.custom: {
            dumpSep("section Custom");
            dump([sectionId], "section code");
            dump([sectionSizeInBytes], "section size");
            var _metadata11 = [t.sectionMetadata("custom", startOffset, sectionSizeInBytesNode)];
            var sectionName = readUTF8String();
            eatBytes(sectionName.nextIndex);
            dump([], "section name (".concat(sectionName.value, ")"));
            var _remainingBytes2 = sectionSizeInBytes - sectionName.nextIndex;
            if (sectionName.value === "name") {
              var initialOffset = offset;
              try {
                _metadata11.push.apply(_metadata11, _toConsumableArray(parseNameSection(_remainingBytes2)));
              } catch (e) {
                console.warn('Failed to decode custom "name" section @'.concat(offset, "; ignoring (").concat(e.message, ")."));
                eatBytes(offset - (initialOffset + _remainingBytes2));
              }
            } else if (sectionName.value === "producers") {
              var _initialOffset = offset;
              try {
                _metadata11.push(parseProducersSection());
              } catch (e) {
                console.warn('Failed to decode custom "producers" section @'.concat(offset, "; ignoring (").concat(e.message, ")."));
                eatBytes(offset - (_initialOffset + _remainingBytes2));
              }
            } else {
              eatBytes(_remainingBytes2);
              dumpSep("ignore custom " + JSON.stringify(sectionName.value) + " section (" + _remainingBytes2 + " bytes)");
            }
            return {
              nodes: [],
              metadata: _metadata11,
              nextSectionIndex: nextSectionIndex2
            };
          }
        }
        if (opts.errorOnUnknownSection) {
          throw new _helperApiError.CompileError("Unexpected section: " + toHex(sectionId));
        } else {
          dumpSep("section " + toHex(sectionId));
          dump([sectionId], "section code");
          dump([sectionSizeInBytes], "section size");
          eatBytes(sectionSizeInBytes);
          dumpSep("ignoring (" + sectionSizeInBytes + " bytes)");
          return {
            nodes: [],
            metadata: [],
            nextSectionIndex: 0
          };
        }
      }
      parseModuleHeader();
      parseVersion();
      var moduleFields = [];
      var sectionIndex = 0;
      var moduleMetadata = {
        sections: [],
        functionNames: [],
        localNames: [],
        producers: []
      };
      while (offset < buf.length) {
        var _parseSection = parseSection(sectionIndex), nodes = _parseSection.nodes, metadata = _parseSection.metadata, nextSectionIndex = _parseSection.nextSectionIndex;
        moduleFields.push.apply(moduleFields, _toConsumableArray(nodes));
        var metadataArray = Array.isArray(metadata) ? metadata : [metadata];
        metadataArray.forEach(function(metadataItem) {
          if (metadataItem.type === "FunctionNameMetadata") {
            moduleMetadata.functionNames.push(metadataItem);
          } else if (metadataItem.type === "LocalNameMetadata") {
            moduleMetadata.localNames.push(metadataItem);
          } else if (metadataItem.type === "ProducersSectionMetadata") {
            moduleMetadata.producers.push(metadataItem);
          } else {
            moduleMetadata.sections.push(metadataItem);
          }
        });
        if (nextSectionIndex) {
          sectionIndex = nextSectionIndex;
        }
      }
      var funcIndex = 0;
      state.functionsInModule.forEach(function(func) {
        var params = func.signature.params;
        var result = func.signature.result;
        var body = [];
        if (func.isExternal === true) {
          return;
        }
        var decodedElementInCodeSection = state.elementsInCodeSection[funcIndex];
        if (opts.ignoreCodeSection === false) {
          if (typeof decodedElementInCodeSection === "undefined") {
            throw new _helperApiError.CompileError("func " + toHex(funcIndex) + " code not found");
          }
          body = decodedElementInCodeSection.code;
        }
        funcIndex++;
        var funcNode = t.func(func.id, t.signature(params, result), body);
        if (func.isExternal === true) {
          funcNode.isExternal = func.isExternal;
        }
        if (opts.ignoreCodeSection === false) {
          var _startLoc23 = decodedElementInCodeSection.startLoc, endLoc = decodedElementInCodeSection.endLoc, bodySize = decodedElementInCodeSection.bodySize;
          funcNode = t.withLoc(funcNode, endLoc, _startLoc23);
          funcNode.metadata = {
            bodySize
          };
        }
        moduleFields.push(funcNode);
      });
      state.elementsInExportSection.forEach(function(moduleExport) {
        if (moduleExport.id != null) {
          moduleFields.push(t.withLoc(t.moduleExport(moduleExport.name, t.moduleExportDescr(moduleExport.type, moduleExport.id)), moduleExport.endLoc, moduleExport.startLoc));
        }
      });
      dumpSep("end of program");
      var module2 = t.module(null, moduleFields, t.moduleMetadata(moduleMetadata.sections, moduleMetadata.functionNames, moduleMetadata.localNames, moduleMetadata.producers));
      return t.program([module2]);
    }
  }
});

// node_modules/.pnpm/@webassemblyjs+wasm-parser@1.12.1/node_modules/@webassemblyjs/wasm-parser/lib/index.js
var require_lib9 = __commonJS({
  "node_modules/.pnpm/@webassemblyjs+wasm-parser@1.12.1/node_modules/@webassemblyjs/wasm-parser/lib/index.js"(exports) {
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.decode = decode2;
    var decoder = _interopRequireWildcard(require_decoder2());
    var t = _interopRequireWildcard(require_lib7());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function")
        return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    var defaultDecoderOpts = {
      dump: false,
      ignoreCodeSection: false,
      ignoreDataSection: false,
      ignoreCustomNameSection: false
    };
    function restoreFunctionNames(ast) {
      var functionNames = [];
      t.traverse(ast, {
        FunctionNameMetadata: function FunctionNameMetadata(_ref) {
          var node = _ref.node;
          functionNames.push({
            name: node.value,
            index: node.index
          });
        }
      });
      if (functionNames.length === 0) {
        return;
      }
      t.traverse(ast, {
        Func: function(_Func) {
          function Func(_x) {
            return _Func.apply(this, arguments);
          }
          Func.toString = function() {
            return _Func.toString();
          };
          return Func;
        }(function(_ref2) {
          var node = _ref2.node;
          var nodeName = node.name;
          var indexBasedFunctionName = nodeName.value;
          var index = Number(indexBasedFunctionName.replace("func_", ""));
          var functionName = functionNames.find(function(f) {
            return f.index === index;
          });
          if (functionName) {
            var oldValue = nodeName.value;
            nodeName.value = functionName.name;
            nodeName.numeric = oldValue;
            delete nodeName.raw;
          }
        }),
        // Also update the reference in the export
        ModuleExport: function(_ModuleExport) {
          function ModuleExport(_x2) {
            return _ModuleExport.apply(this, arguments);
          }
          ModuleExport.toString = function() {
            return _ModuleExport.toString();
          };
          return ModuleExport;
        }(function(_ref3) {
          var node = _ref3.node;
          if (node.descr.exportType === "Func") {
            var nodeName = node.descr.id;
            var index = nodeName.value;
            var functionName = functionNames.find(function(f) {
              return f.index === index;
            });
            if (functionName) {
              node.descr.id = t.identifier(functionName.name);
            }
          }
        }),
        ModuleImport: function(_ModuleImport) {
          function ModuleImport(_x3) {
            return _ModuleImport.apply(this, arguments);
          }
          ModuleImport.toString = function() {
            return _ModuleImport.toString();
          };
          return ModuleImport;
        }(function(_ref4) {
          var node = _ref4.node;
          if (node.descr.type === "FuncImportDescr") {
            var indexBasedFunctionName = node.descr.id;
            var index = Number(indexBasedFunctionName.replace("func_", ""));
            var functionName = functionNames.find(function(f) {
              return f.index === index;
            });
            if (functionName) {
              node.descr.id = t.identifier(functionName.name);
            }
          }
        }),
        CallInstruction: function(_CallInstruction) {
          function CallInstruction(_x4) {
            return _CallInstruction.apply(this, arguments);
          }
          CallInstruction.toString = function() {
            return _CallInstruction.toString();
          };
          return CallInstruction;
        }(function(nodePath) {
          var node = nodePath.node;
          var index = node.index.value;
          var functionName = functionNames.find(function(f) {
            return f.index === index;
          });
          if (functionName) {
            var oldValue = node.index;
            node.index = t.identifier(functionName.name);
            node.numeric = oldValue;
            delete node.raw;
          }
        })
      });
    }
    function restoreLocalNames(ast) {
      var localNames = [];
      t.traverse(ast, {
        LocalNameMetadata: function LocalNameMetadata(_ref5) {
          var node = _ref5.node;
          localNames.push({
            name: node.value,
            localIndex: node.localIndex,
            functionIndex: node.functionIndex
          });
        }
      });
      if (localNames.length === 0) {
        return;
      }
      t.traverse(ast, {
        Func: function(_Func2) {
          function Func(_x5) {
            return _Func2.apply(this, arguments);
          }
          Func.toString = function() {
            return _Func2.toString();
          };
          return Func;
        }(function(_ref6) {
          var node = _ref6.node;
          var signature = node.signature;
          if (signature.type !== "Signature") {
            return;
          }
          var nodeName = node.name;
          var indexBasedFunctionName = nodeName.value;
          var functionIndex = Number(indexBasedFunctionName.replace("func_", ""));
          signature.params.forEach(function(param, paramIndex) {
            var paramName = localNames.find(function(f) {
              return f.localIndex === paramIndex && f.functionIndex === functionIndex;
            });
            if (paramName && paramName.name !== "") {
              param.id = paramName.name;
            }
          });
        })
      });
    }
    function restoreModuleName(ast) {
      t.traverse(ast, {
        ModuleNameMetadata: function(_ModuleNameMetadata) {
          function ModuleNameMetadata(_x6) {
            return _ModuleNameMetadata.apply(this, arguments);
          }
          ModuleNameMetadata.toString = function() {
            return _ModuleNameMetadata.toString();
          };
          return ModuleNameMetadata;
        }(function(moduleNameMetadataPath) {
          t.traverse(ast, {
            Module: function(_Module) {
              function Module(_x7) {
                return _Module.apply(this, arguments);
              }
              Module.toString = function() {
                return _Module.toString();
              };
              return Module;
            }(function(_ref7) {
              var node = _ref7.node;
              var name = moduleNameMetadataPath.node.value;
              if (name === "") {
                name = null;
              }
              node.id = name;
            })
          });
        })
      });
    }
    function decode2(buf, customOpts) {
      var opts = Object.assign({}, defaultDecoderOpts, customOpts);
      var ast = decoder.decode(buf, opts);
      if (opts.ignoreCustomNameSection === false) {
        restoreFunctionNames(ast);
        restoreLocalNames(ast);
        restoreModuleName(ast);
      }
      return ast;
    }
  }
});

// lib/wasm-parser.in.mjs
var import_wasm_parser = __toESM(require_lib9(), 1);
var export_decode = import_wasm_parser.decode;

function parseWasm(source, opts = {}) {
  let ast;
  try {
    ast = export_decode(source);
  } catch (error) {
    throw new Error(
      `[unwasm] Failed to parse ${opts.name || "wasm module"}: ${error}`,
      {
        cause: error
      }
    );
  }
  const modules = [];
  for (const body of ast.body) {
    if (body.type === "Module") {
      const module = {
        imports: [],
        exports: []
      };
      modules.push(module);
      for (const field of body.fields) {
        if (field.type === "ModuleImport") {
          module.imports.push({
            module: field.module,
            name: field.name,
            returnType: field.descr?.signature?.results?.[0],
            params: field.descr.signature.params?.map(
              (p) => ({
                id: p.id,
                type: p.valtype
              })
            )
          });
        } else if (field.type === "ModuleExport") {
          module.exports.push({
            name: field.name,
            id: field.descr.id.value,
            type: field.descr.exportType
          });
        }
      }
    }
  }
  return {
    modules
  };
}

export { parseWasm };
