import {
  S2Error,
  createClient,
  createConfig,
  meteredSizeBytes,
  value
} from "./chunk-4DSI7GE4.mjs";
import {
  __commonJS,
  __name,
  __toESM,
  init_esm
} from "./chunk-3R76H35D.mjs";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/json-typings.js
var require_json_typings = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/json-typings.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isJsonObject = exports.typeofJsonValue = void 0;
    function typeofJsonValue(value2) {
      let t = typeof value2;
      if (t == "object") {
        if (Array.isArray(value2))
          return "array";
        if (value2 === null)
          return "null";
      }
      return t;
    }
    __name(typeofJsonValue, "typeofJsonValue");
    exports.typeofJsonValue = typeofJsonValue;
    function isJsonObject(value2) {
      return value2 !== null && typeof value2 == "object" && !Array.isArray(value2);
    }
    __name(isJsonObject, "isJsonObject");
    exports.isJsonObject = isJsonObject;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/base64.js
var require_base64 = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/base64.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.base64encode = exports.base64decode = void 0;
    var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    var decTable = [];
    for (let i = 0; i < encTable.length; i++)
      decTable[encTable[i].charCodeAt(0)] = i;
    decTable["-".charCodeAt(0)] = encTable.indexOf("+");
    decTable["_".charCodeAt(0)] = encTable.indexOf("/");
    function base64decode(base64Str) {
      let es = base64Str.length * 3 / 4;
      if (base64Str[base64Str.length - 2] == "=")
        es -= 2;
      else if (base64Str[base64Str.length - 1] == "=")
        es -= 1;
      let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
      for (let i = 0; i < base64Str.length; i++) {
        b = decTable[base64Str.charCodeAt(i)];
        if (b === void 0) {
          switch (base64Str[i]) {
            case "=":
              groupPos = 0;
            // reset state when padding found
            case "\n":
            case "\r":
            case "	":
            case " ":
              continue;
            // skip white-space, and padding
            default:
              throw Error(`invalid base64 string.`);
          }
        }
        switch (groupPos) {
          case 0:
            p = b;
            groupPos = 1;
            break;
          case 1:
            bytes[bytePos++] = p << 2 | (b & 48) >> 4;
            p = b;
            groupPos = 2;
            break;
          case 2:
            bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
            p = b;
            groupPos = 3;
            break;
          case 3:
            bytes[bytePos++] = (p & 3) << 6 | b;
            groupPos = 0;
            break;
        }
      }
      if (groupPos == 1)
        throw Error(`invalid base64 string.`);
      return bytes.subarray(0, bytePos);
    }
    __name(base64decode, "base64decode");
    exports.base64decode = base64decode;
    function base64encode(bytes) {
      let base64 = "", groupPos = 0, b, p = 0;
      for (let i = 0; i < bytes.length; i++) {
        b = bytes[i];
        switch (groupPos) {
          case 0:
            base64 += encTable[b >> 2];
            p = (b & 3) << 4;
            groupPos = 1;
            break;
          case 1:
            base64 += encTable[p | b >> 4];
            p = (b & 15) << 2;
            groupPos = 2;
            break;
          case 2:
            base64 += encTable[p | b >> 6];
            base64 += encTable[b & 63];
            groupPos = 0;
            break;
        }
      }
      if (groupPos) {
        base64 += encTable[p];
        base64 += "=";
        if (groupPos == 1)
          base64 += "=";
      }
      return base64;
    }
    __name(base64encode, "base64encode");
    exports.base64encode = base64encode;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/protobufjs-utf8.js
var require_protobufjs_utf8 = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/protobufjs-utf8.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utf8read = void 0;
    var fromCharCodes = /* @__PURE__ */ __name((chunk) => String.fromCharCode.apply(String, chunk), "fromCharCodes");
    function utf8read(bytes) {
      if (bytes.length < 1)
        return "";
      let pos = 0, parts = [], chunk = [], i = 0, t;
      let len = bytes.length;
      while (pos < len) {
        t = bytes[pos++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | bytes[pos++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (bytes[pos++] & 63) << 12 | (bytes[pos++] & 63) << 6 | bytes[pos++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (bytes[pos++] & 63) << 6 | bytes[pos++] & 63;
        if (i > 8191) {
          parts.push(fromCharCodes(chunk));
          i = 0;
        }
      }
      if (parts.length) {
        if (i)
          parts.push(fromCharCodes(chunk.slice(0, i)));
        return parts.join("");
      }
      return fromCharCodes(chunk.slice(0, i));
    }
    __name(utf8read, "utf8read");
    exports.utf8read = utf8read;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/binary-format-contract.js
var require_binary_format_contract = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/binary-format-contract.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WireType = exports.mergeBinaryOptions = exports.UnknownFieldHandler = void 0;
    var UnknownFieldHandler2;
    (function(UnknownFieldHandler3) {
      UnknownFieldHandler3.symbol = Symbol.for("protobuf-ts/unknown");
      UnknownFieldHandler3.onRead = (typeName, message, fieldNo, wireType, data) => {
        let container = is(message) ? message[UnknownFieldHandler3.symbol] : message[UnknownFieldHandler3.symbol] = [];
        container.push({ no: fieldNo, wireType, data });
      };
      UnknownFieldHandler3.onWrite = (typeName, message, writer) => {
        for (let { no, wireType, data } of UnknownFieldHandler3.list(message))
          writer.tag(no, wireType).raw(data);
      };
      UnknownFieldHandler3.list = (message, fieldNo) => {
        if (is(message)) {
          let all = message[UnknownFieldHandler3.symbol];
          return fieldNo ? all.filter((uf) => uf.no == fieldNo) : all;
        }
        return [];
      };
      UnknownFieldHandler3.last = (message, fieldNo) => UnknownFieldHandler3.list(message, fieldNo).slice(-1)[0];
      const is = /* @__PURE__ */ __name((message) => message && Array.isArray(message[UnknownFieldHandler3.symbol]), "is");
    })(UnknownFieldHandler2 = exports.UnknownFieldHandler || (exports.UnknownFieldHandler = {}));
    function mergeBinaryOptions(a, b) {
      return Object.assign(Object.assign({}, a), b);
    }
    __name(mergeBinaryOptions, "mergeBinaryOptions");
    exports.mergeBinaryOptions = mergeBinaryOptions;
    var WireType2;
    (function(WireType3) {
      WireType3[WireType3["Varint"] = 0] = "Varint";
      WireType3[WireType3["Bit64"] = 1] = "Bit64";
      WireType3[WireType3["LengthDelimited"] = 2] = "LengthDelimited";
      WireType3[WireType3["StartGroup"] = 3] = "StartGroup";
      WireType3[WireType3["EndGroup"] = 4] = "EndGroup";
      WireType3[WireType3["Bit32"] = 5] = "Bit32";
    })(WireType2 = exports.WireType || (exports.WireType = {}));
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/goog-varint.js
var require_goog_varint = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/goog-varint.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.varint32read = exports.varint32write = exports.int64toString = exports.int64fromString = exports.varint64write = exports.varint64read = void 0;
    function varint64read() {
      let lowBits = 0;
      let highBits = 0;
      for (let shift = 0; shift < 28; shift += 7) {
        let b = this.buf[this.pos++];
        lowBits |= (b & 127) << shift;
        if ((b & 128) == 0) {
          this.assertBounds();
          return [lowBits, highBits];
        }
      }
      let middleByte = this.buf[this.pos++];
      lowBits |= (middleByte & 15) << 28;
      highBits = (middleByte & 112) >> 4;
      if ((middleByte & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
      for (let shift = 3; shift <= 31; shift += 7) {
        let b = this.buf[this.pos++];
        highBits |= (b & 127) << shift;
        if ((b & 128) == 0) {
          this.assertBounds();
          return [lowBits, highBits];
        }
      }
      throw new Error("invalid varint");
    }
    __name(varint64read, "varint64read");
    exports.varint64read = varint64read;
    function varint64write(lo, hi, bytes) {
      for (let i = 0; i < 28; i = i + 7) {
        const shift = lo >>> i;
        const hasNext = !(shift >>> 7 == 0 && hi == 0);
        const byte = (hasNext ? shift | 128 : shift) & 255;
        bytes.push(byte);
        if (!hasNext) {
          return;
        }
      }
      const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
      const hasMoreBits = !(hi >> 3 == 0);
      bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
      if (!hasMoreBits) {
        return;
      }
      for (let i = 3; i < 31; i = i + 7) {
        const shift = hi >>> i;
        const hasNext = !(shift >>> 7 == 0);
        const byte = (hasNext ? shift | 128 : shift) & 255;
        bytes.push(byte);
        if (!hasNext) {
          return;
        }
      }
      bytes.push(hi >>> 31 & 1);
    }
    __name(varint64write, "varint64write");
    exports.varint64write = varint64write;
    var TWO_PWR_32_DBL = (1 << 16) * (1 << 16);
    function int64fromString(dec) {
      let minus = dec[0] == "-";
      if (minus)
        dec = dec.slice(1);
      const base = 1e6;
      let lowBits = 0;
      let highBits = 0;
      function add1e6digit(begin, end) {
        const digit1e6 = Number(dec.slice(begin, end));
        highBits *= base;
        lowBits = lowBits * base + digit1e6;
        if (lowBits >= TWO_PWR_32_DBL) {
          highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
          lowBits = lowBits % TWO_PWR_32_DBL;
        }
      }
      __name(add1e6digit, "add1e6digit");
      add1e6digit(-24, -18);
      add1e6digit(-18, -12);
      add1e6digit(-12, -6);
      add1e6digit(-6);
      return [minus, lowBits, highBits];
    }
    __name(int64fromString, "int64fromString");
    exports.int64fromString = int64fromString;
    function int64toString(bitsLow, bitsHigh) {
      if (bitsHigh >>> 0 <= 2097151) {
        return "" + (TWO_PWR_32_DBL * bitsHigh + (bitsLow >>> 0));
      }
      let low = bitsLow & 16777215;
      let mid = (bitsLow >>> 24 | bitsHigh << 8) >>> 0 & 16777215;
      let high = bitsHigh >> 16 & 65535;
      let digitA = low + mid * 6777216 + high * 6710656;
      let digitB = mid + high * 8147497;
      let digitC = high * 2;
      let base = 1e7;
      if (digitA >= base) {
        digitB += Math.floor(digitA / base);
        digitA %= base;
      }
      if (digitB >= base) {
        digitC += Math.floor(digitB / base);
        digitB %= base;
      }
      function decimalFrom1e7(digit1e7, needLeadingZeros) {
        let partial = digit1e7 ? String(digit1e7) : "";
        if (needLeadingZeros) {
          return "0000000".slice(partial.length) + partial;
        }
        return partial;
      }
      __name(decimalFrom1e7, "decimalFrom1e7");
      return decimalFrom1e7(
        digitC,
        /*needLeadingZeros=*/
        0
      ) + decimalFrom1e7(
        digitB,
        /*needLeadingZeros=*/
        digitC
      ) + // If the final 1e7 digit didn't need leading zeros, we would have
      // returned via the trivial code path at the top.
      decimalFrom1e7(
        digitA,
        /*needLeadingZeros=*/
        1
      );
    }
    __name(int64toString, "int64toString");
    exports.int64toString = int64toString;
    function varint32write(value2, bytes) {
      if (value2 >= 0) {
        while (value2 > 127) {
          bytes.push(value2 & 127 | 128);
          value2 = value2 >>> 7;
        }
        bytes.push(value2);
      } else {
        for (let i = 0; i < 9; i++) {
          bytes.push(value2 & 127 | 128);
          value2 = value2 >> 7;
        }
        bytes.push(1);
      }
    }
    __name(varint32write, "varint32write");
    exports.varint32write = varint32write;
    function varint32read() {
      let b = this.buf[this.pos++];
      let result = b & 127;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 127) << 7;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 127) << 14;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 127) << 21;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 15) << 28;
      for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
        b = this.buf[this.pos++];
      if ((b & 128) != 0)
        throw new Error("invalid varint");
      this.assertBounds();
      return result >>> 0;
    }
    __name(varint32read, "varint32read");
    exports.varint32read = varint32read;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/pb-long.js
var require_pb_long = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/pb-long.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PbLong = exports.PbULong = exports.detectBi = void 0;
    var goog_varint_1 = require_goog_varint();
    var BI;
    function detectBi() {
      const dv = new DataView(new ArrayBuffer(8));
      const ok = globalThis.BigInt !== void 0 && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function";
      BI = ok ? {
        MIN: BigInt("-9223372036854775808"),
        MAX: BigInt("9223372036854775807"),
        UMIN: BigInt("0"),
        UMAX: BigInt("18446744073709551615"),
        C: BigInt,
        V: dv
      } : void 0;
    }
    __name(detectBi, "detectBi");
    exports.detectBi = detectBi;
    detectBi();
    function assertBi(bi) {
      if (!bi)
        throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
    }
    __name(assertBi, "assertBi");
    var RE_DECIMAL_STR = /^-?[0-9]+$/;
    var TWO_PWR_32_DBL = 4294967296;
    var HALF_2_PWR_32 = 2147483648;
    var SharedPbLong = class {
      static {
        __name(this, "SharedPbLong");
      }
      /**
       * Create a new instance with the given bits.
       */
      constructor(lo, hi) {
        this.lo = lo | 0;
        this.hi = hi | 0;
      }
      /**
       * Is this instance equal to 0?
       */
      isZero() {
        return this.lo == 0 && this.hi == 0;
      }
      /**
       * Convert to a native number.
       */
      toNumber() {
        let result = this.hi * TWO_PWR_32_DBL + (this.lo >>> 0);
        if (!Number.isSafeInteger(result))
          throw new Error("cannot convert to safe number");
        return result;
      }
    };
    var PbULong = class _PbULong extends SharedPbLong {
      static {
        __name(this, "PbULong");
      }
      /**
       * Create instance from a `string`, `number` or `bigint`.
       */
      static from(value2) {
        if (BI)
          switch (typeof value2) {
            case "string":
              if (value2 == "0")
                return this.ZERO;
              if (value2 == "")
                throw new Error("string is no integer");
              value2 = BI.C(value2);
            case "number":
              if (value2 === 0)
                return this.ZERO;
              value2 = BI.C(value2);
            case "bigint":
              if (!value2)
                return this.ZERO;
              if (value2 < BI.UMIN)
                throw new Error("signed value for ulong");
              if (value2 > BI.UMAX)
                throw new Error("ulong too large");
              BI.V.setBigUint64(0, value2, true);
              return new _PbULong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
          }
        else
          switch (typeof value2) {
            case "string":
              if (value2 == "0")
                return this.ZERO;
              value2 = value2.trim();
              if (!RE_DECIMAL_STR.test(value2))
                throw new Error("string is no integer");
              let [minus, lo, hi] = goog_varint_1.int64fromString(value2);
              if (minus)
                throw new Error("signed value for ulong");
              return new _PbULong(lo, hi);
            case "number":
              if (value2 == 0)
                return this.ZERO;
              if (!Number.isSafeInteger(value2))
                throw new Error("number is no integer");
              if (value2 < 0)
                throw new Error("signed value for ulong");
              return new _PbULong(value2, value2 / TWO_PWR_32_DBL);
          }
        throw new Error("unknown value " + typeof value2);
      }
      /**
       * Convert to decimal string.
       */
      toString() {
        return BI ? this.toBigInt().toString() : goog_varint_1.int64toString(this.lo, this.hi);
      }
      /**
       * Convert to native bigint.
       */
      toBigInt() {
        assertBi(BI);
        BI.V.setInt32(0, this.lo, true);
        BI.V.setInt32(4, this.hi, true);
        return BI.V.getBigUint64(0, true);
      }
    };
    exports.PbULong = PbULong;
    PbULong.ZERO = new PbULong(0, 0);
    var PbLong = class _PbLong extends SharedPbLong {
      static {
        __name(this, "PbLong");
      }
      /**
       * Create instance from a `string`, `number` or `bigint`.
       */
      static from(value2) {
        if (BI)
          switch (typeof value2) {
            case "string":
              if (value2 == "0")
                return this.ZERO;
              if (value2 == "")
                throw new Error("string is no integer");
              value2 = BI.C(value2);
            case "number":
              if (value2 === 0)
                return this.ZERO;
              value2 = BI.C(value2);
            case "bigint":
              if (!value2)
                return this.ZERO;
              if (value2 < BI.MIN)
                throw new Error("signed long too small");
              if (value2 > BI.MAX)
                throw new Error("signed long too large");
              BI.V.setBigInt64(0, value2, true);
              return new _PbLong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
          }
        else
          switch (typeof value2) {
            case "string":
              if (value2 == "0")
                return this.ZERO;
              value2 = value2.trim();
              if (!RE_DECIMAL_STR.test(value2))
                throw new Error("string is no integer");
              let [minus, lo, hi] = goog_varint_1.int64fromString(value2);
              if (minus) {
                if (hi > HALF_2_PWR_32 || hi == HALF_2_PWR_32 && lo != 0)
                  throw new Error("signed long too small");
              } else if (hi >= HALF_2_PWR_32)
                throw new Error("signed long too large");
              let pbl = new _PbLong(lo, hi);
              return minus ? pbl.negate() : pbl;
            case "number":
              if (value2 == 0)
                return this.ZERO;
              if (!Number.isSafeInteger(value2))
                throw new Error("number is no integer");
              return value2 > 0 ? new _PbLong(value2, value2 / TWO_PWR_32_DBL) : new _PbLong(-value2, -value2 / TWO_PWR_32_DBL).negate();
          }
        throw new Error("unknown value " + typeof value2);
      }
      /**
       * Do we have a minus sign?
       */
      isNegative() {
        return (this.hi & HALF_2_PWR_32) !== 0;
      }
      /**
       * Negate two's complement.
       * Invert all the bits and add one to the result.
       */
      negate() {
        let hi = ~this.hi, lo = this.lo;
        if (lo)
          lo = ~lo + 1;
        else
          hi += 1;
        return new _PbLong(lo, hi);
      }
      /**
       * Convert to decimal string.
       */
      toString() {
        if (BI)
          return this.toBigInt().toString();
        if (this.isNegative()) {
          let n = this.negate();
          return "-" + goog_varint_1.int64toString(n.lo, n.hi);
        }
        return goog_varint_1.int64toString(this.lo, this.hi);
      }
      /**
       * Convert to native bigint.
       */
      toBigInt() {
        assertBi(BI);
        BI.V.setInt32(0, this.lo, true);
        BI.V.setInt32(4, this.hi, true);
        return BI.V.getBigInt64(0, true);
      }
    };
    exports.PbLong = PbLong;
    PbLong.ZERO = new PbLong(0, 0);
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/binary-reader.js
var require_binary_reader = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/binary-reader.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryReader = exports.binaryReadOptions = void 0;
    var binary_format_contract_1 = require_binary_format_contract();
    var pb_long_1 = require_pb_long();
    var goog_varint_1 = require_goog_varint();
    var defaultsRead = {
      readUnknownField: true,
      readerFactory: /* @__PURE__ */ __name((bytes) => new BinaryReader(bytes), "readerFactory")
    };
    function binaryReadOptions(options) {
      return options ? Object.assign(Object.assign({}, defaultsRead), options) : defaultsRead;
    }
    __name(binaryReadOptions, "binaryReadOptions");
    exports.binaryReadOptions = binaryReadOptions;
    var BinaryReader = class {
      static {
        __name(this, "BinaryReader");
      }
      constructor(buf, textDecoder) {
        this.varint64 = goog_varint_1.varint64read;
        this.uint32 = goog_varint_1.varint32read;
        this.buf = buf;
        this.len = buf.length;
        this.pos = 0;
        this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder("utf-8", {
          fatal: true,
          ignoreBOM: true
        });
      }
      /**
       * Reads a tag - field number and wire type.
       */
      tag() {
        let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
        if (fieldNo <= 0 || wireType < 0 || wireType > 5)
          throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
        return [fieldNo, wireType];
      }
      /**
       * Skip one element on the wire and return the skipped data.
       * Supports WireType.StartGroup since v2.0.0-alpha.23.
       */
      skip(wireType) {
        let start = this.pos;
        switch (wireType) {
          case binary_format_contract_1.WireType.Varint:
            while (this.buf[this.pos++] & 128) {
            }
            break;
          case binary_format_contract_1.WireType.Bit64:
            this.pos += 4;
          case binary_format_contract_1.WireType.Bit32:
            this.pos += 4;
            break;
          case binary_format_contract_1.WireType.LengthDelimited:
            let len = this.uint32();
            this.pos += len;
            break;
          case binary_format_contract_1.WireType.StartGroup:
            let t;
            while ((t = this.tag()[1]) !== binary_format_contract_1.WireType.EndGroup) {
              this.skip(t);
            }
            break;
          default:
            throw new Error("cant skip wire type " + wireType);
        }
        this.assertBounds();
        return this.buf.subarray(start, this.pos);
      }
      /**
       * Throws error if position in byte array is out of range.
       */
      assertBounds() {
        if (this.pos > this.len)
          throw new RangeError("premature EOF");
      }
      /**
       * Read a `int32` field, a signed 32 bit varint.
       */
      int32() {
        return this.uint32() | 0;
      }
      /**
       * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
       */
      sint32() {
        let zze = this.uint32();
        return zze >>> 1 ^ -(zze & 1);
      }
      /**
       * Read a `int64` field, a signed 64-bit varint.
       */
      int64() {
        return new pb_long_1.PbLong(...this.varint64());
      }
      /**
       * Read a `uint64` field, an unsigned 64-bit varint.
       */
      uint64() {
        return new pb_long_1.PbULong(...this.varint64());
      }
      /**
       * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
       */
      sint64() {
        let [lo, hi] = this.varint64();
        let s = -(lo & 1);
        lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
        hi = hi >>> 1 ^ s;
        return new pb_long_1.PbLong(lo, hi);
      }
      /**
       * Read a `bool` field, a variant.
       */
      bool() {
        let [lo, hi] = this.varint64();
        return lo !== 0 || hi !== 0;
      }
      /**
       * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
       */
      fixed32() {
        return this.view.getUint32((this.pos += 4) - 4, true);
      }
      /**
       * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
       */
      sfixed32() {
        return this.view.getInt32((this.pos += 4) - 4, true);
      }
      /**
       * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
       */
      fixed64() {
        return new pb_long_1.PbULong(this.sfixed32(), this.sfixed32());
      }
      /**
       * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
       */
      sfixed64() {
        return new pb_long_1.PbLong(this.sfixed32(), this.sfixed32());
      }
      /**
       * Read a `float` field, 32-bit floating point number.
       */
      float() {
        return this.view.getFloat32((this.pos += 4) - 4, true);
      }
      /**
       * Read a `double` field, a 64-bit floating point number.
       */
      double() {
        return this.view.getFloat64((this.pos += 8) - 8, true);
      }
      /**
       * Read a `bytes` field, length-delimited arbitrary data.
       */
      bytes() {
        let len = this.uint32();
        let start = this.pos;
        this.pos += len;
        this.assertBounds();
        return this.buf.subarray(start, start + len);
      }
      /**
       * Read a `string` field, length-delimited data converted to UTF-8 text.
       */
      string() {
        return this.textDecoder.decode(this.bytes());
      }
    };
    exports.BinaryReader = BinaryReader;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/assert.js
var require_assert = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/assert.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertFloat32 = exports.assertUInt32 = exports.assertInt32 = exports.assertNever = exports.assert = void 0;
    function assert(condition, msg) {
      if (!condition) {
        throw new Error(msg);
      }
    }
    __name(assert, "assert");
    exports.assert = assert;
    function assertNever(value2, msg) {
      throw new Error(msg !== null && msg !== void 0 ? msg : "Unexpected object: " + value2);
    }
    __name(assertNever, "assertNever");
    exports.assertNever = assertNever;
    var FLOAT32_MAX = 34028234663852886e22;
    var FLOAT32_MIN = -34028234663852886e22;
    var UINT32_MAX = 4294967295;
    var INT32_MAX = 2147483647;
    var INT32_MIN = -2147483648;
    function assertInt32(arg) {
      if (typeof arg !== "number")
        throw new Error("invalid int 32: " + typeof arg);
      if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
        throw new Error("invalid int 32: " + arg);
    }
    __name(assertInt32, "assertInt32");
    exports.assertInt32 = assertInt32;
    function assertUInt32(arg) {
      if (typeof arg !== "number")
        throw new Error("invalid uint 32: " + typeof arg);
      if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
        throw new Error("invalid uint 32: " + arg);
    }
    __name(assertUInt32, "assertUInt32");
    exports.assertUInt32 = assertUInt32;
    function assertFloat32(arg) {
      if (typeof arg !== "number")
        throw new Error("invalid float 32: " + typeof arg);
      if (!Number.isFinite(arg))
        return;
      if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
        throw new Error("invalid float 32: " + arg);
    }
    __name(assertFloat32, "assertFloat32");
    exports.assertFloat32 = assertFloat32;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/binary-writer.js
var require_binary_writer = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/binary-writer.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryWriter = exports.binaryWriteOptions = void 0;
    var pb_long_1 = require_pb_long();
    var goog_varint_1 = require_goog_varint();
    var assert_1 = require_assert();
    var defaultsWrite = {
      writeUnknownFields: true,
      writerFactory: /* @__PURE__ */ __name(() => new BinaryWriter(), "writerFactory")
    };
    function binaryWriteOptions(options) {
      return options ? Object.assign(Object.assign({}, defaultsWrite), options) : defaultsWrite;
    }
    __name(binaryWriteOptions, "binaryWriteOptions");
    exports.binaryWriteOptions = binaryWriteOptions;
    var BinaryWriter = class {
      static {
        __name(this, "BinaryWriter");
      }
      constructor(textEncoder) {
        this.stack = [];
        this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
        this.chunks = [];
        this.buf = [];
      }
      /**
       * Return all bytes written and reset this writer.
       */
      finish() {
        this.chunks.push(new Uint8Array(this.buf));
        let len = 0;
        for (let i = 0; i < this.chunks.length; i++)
          len += this.chunks[i].length;
        let bytes = new Uint8Array(len);
        let offset = 0;
        for (let i = 0; i < this.chunks.length; i++) {
          bytes.set(this.chunks[i], offset);
          offset += this.chunks[i].length;
        }
        this.chunks = [];
        return bytes;
      }
      /**
       * Start a new fork for length-delimited data like a message
       * or a packed repeated field.
       *
       * Must be joined later with `join()`.
       */
      fork() {
        this.stack.push({ chunks: this.chunks, buf: this.buf });
        this.chunks = [];
        this.buf = [];
        return this;
      }
      /**
       * Join the last fork. Write its length and bytes, then
       * return to the previous state.
       */
      join() {
        let chunk = this.finish();
        let prev = this.stack.pop();
        if (!prev)
          throw new Error("invalid state, fork stack empty");
        this.chunks = prev.chunks;
        this.buf = prev.buf;
        this.uint32(chunk.byteLength);
        return this.raw(chunk);
      }
      /**
       * Writes a tag (field number and wire type).
       *
       * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
       *
       * Generated code should compute the tag ahead of time and call `uint32()`.
       */
      tag(fieldNo, type) {
        return this.uint32((fieldNo << 3 | type) >>> 0);
      }
      /**
       * Write a chunk of raw bytes.
       */
      raw(chunk) {
        if (this.buf.length) {
          this.chunks.push(new Uint8Array(this.buf));
          this.buf = [];
        }
        this.chunks.push(chunk);
        return this;
      }
      /**
       * Write a `uint32` value, an unsigned 32 bit varint.
       */
      uint32(value2) {
        assert_1.assertUInt32(value2);
        while (value2 > 127) {
          this.buf.push(value2 & 127 | 128);
          value2 = value2 >>> 7;
        }
        this.buf.push(value2);
        return this;
      }
      /**
       * Write a `int32` value, a signed 32 bit varint.
       */
      int32(value2) {
        assert_1.assertInt32(value2);
        goog_varint_1.varint32write(value2, this.buf);
        return this;
      }
      /**
       * Write a `bool` value, a variant.
       */
      bool(value2) {
        this.buf.push(value2 ? 1 : 0);
        return this;
      }
      /**
       * Write a `bytes` value, length-delimited arbitrary data.
       */
      bytes(value2) {
        this.uint32(value2.byteLength);
        return this.raw(value2);
      }
      /**
       * Write a `string` value, length-delimited data converted to UTF-8 text.
       */
      string(value2) {
        let chunk = this.textEncoder.encode(value2);
        this.uint32(chunk.byteLength);
        return this.raw(chunk);
      }
      /**
       * Write a `float` value, 32-bit floating point number.
       */
      float(value2) {
        assert_1.assertFloat32(value2);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setFloat32(0, value2, true);
        return this.raw(chunk);
      }
      /**
       * Write a `double` value, a 64-bit floating point number.
       */
      double(value2) {
        let chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setFloat64(0, value2, true);
        return this.raw(chunk);
      }
      /**
       * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
       */
      fixed32(value2) {
        assert_1.assertUInt32(value2);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setUint32(0, value2, true);
        return this.raw(chunk);
      }
      /**
       * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
       */
      sfixed32(value2) {
        assert_1.assertInt32(value2);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setInt32(0, value2, true);
        return this.raw(chunk);
      }
      /**
       * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
       */
      sint32(value2) {
        assert_1.assertInt32(value2);
        value2 = (value2 << 1 ^ value2 >> 31) >>> 0;
        goog_varint_1.varint32write(value2, this.buf);
        return this;
      }
      /**
       * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
       */
      sfixed64(value2) {
        let chunk = new Uint8Array(8);
        let view = new DataView(chunk.buffer);
        let long = pb_long_1.PbLong.from(value2);
        view.setInt32(0, long.lo, true);
        view.setInt32(4, long.hi, true);
        return this.raw(chunk);
      }
      /**
       * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
       */
      fixed64(value2) {
        let chunk = new Uint8Array(8);
        let view = new DataView(chunk.buffer);
        let long = pb_long_1.PbULong.from(value2);
        view.setInt32(0, long.lo, true);
        view.setInt32(4, long.hi, true);
        return this.raw(chunk);
      }
      /**
       * Write a `int64` value, a signed 64-bit varint.
       */
      int64(value2) {
        let long = pb_long_1.PbLong.from(value2);
        goog_varint_1.varint64write(long.lo, long.hi, this.buf);
        return this;
      }
      /**
       * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
       */
      sint64(value2) {
        let long = pb_long_1.PbLong.from(value2), sign = long.hi >> 31, lo = long.lo << 1 ^ sign, hi = (long.hi << 1 | long.lo >>> 31) ^ sign;
        goog_varint_1.varint64write(lo, hi, this.buf);
        return this;
      }
      /**
       * Write a `uint64` value, an unsigned 64-bit varint.
       */
      uint64(value2) {
        let long = pb_long_1.PbULong.from(value2);
        goog_varint_1.varint64write(long.lo, long.hi, this.buf);
        return this;
      }
    };
    exports.BinaryWriter = BinaryWriter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/json-format-contract.js
var require_json_format_contract = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/json-format-contract.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeJsonOptions = exports.jsonWriteOptions = exports.jsonReadOptions = void 0;
    var defaultsWrite = {
      emitDefaultValues: false,
      enumAsInteger: false,
      useProtoFieldName: false,
      prettySpaces: 0
    };
    var defaultsRead = {
      ignoreUnknownFields: false
    };
    function jsonReadOptions(options) {
      return options ? Object.assign(Object.assign({}, defaultsRead), options) : defaultsRead;
    }
    __name(jsonReadOptions, "jsonReadOptions");
    exports.jsonReadOptions = jsonReadOptions;
    function jsonWriteOptions(options) {
      return options ? Object.assign(Object.assign({}, defaultsWrite), options) : defaultsWrite;
    }
    __name(jsonWriteOptions, "jsonWriteOptions");
    exports.jsonWriteOptions = jsonWriteOptions;
    function mergeJsonOptions(a, b) {
      var _a, _b;
      let c = Object.assign(Object.assign({}, a), b);
      c.typeRegistry = [...(_a = a === null || a === void 0 ? void 0 : a.typeRegistry) !== null && _a !== void 0 ? _a : [], ...(_b = b === null || b === void 0 ? void 0 : b.typeRegistry) !== null && _b !== void 0 ? _b : []];
      return c;
    }
    __name(mergeJsonOptions, "mergeJsonOptions");
    exports.mergeJsonOptions = mergeJsonOptions;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/message-type-contract.js
var require_message_type_contract = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/message-type-contract.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MESSAGE_TYPE = void 0;
    exports.MESSAGE_TYPE = Symbol.for("protobuf-ts/message-type");
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/lower-camel-case.js
var require_lower_camel_case = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/lower-camel-case.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lowerCamelCase = void 0;
    function lowerCamelCase(snakeCase) {
      let capNext = false;
      const sb = [];
      for (let i = 0; i < snakeCase.length; i++) {
        let next = snakeCase.charAt(i);
        if (next == "_") {
          capNext = true;
        } else if (/\d/.test(next)) {
          sb.push(next);
          capNext = true;
        } else if (capNext) {
          sb.push(next.toUpperCase());
          capNext = false;
        } else if (i == 0) {
          sb.push(next.toLowerCase());
        } else {
          sb.push(next);
        }
      }
      return sb.join("");
    }
    __name(lowerCamelCase, "lowerCamelCase");
    exports.lowerCamelCase = lowerCamelCase;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-info.js
var require_reflection_info = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-info.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readMessageOption = exports.readFieldOption = exports.readFieldOptions = exports.normalizeFieldInfo = exports.RepeatType = exports.LongType = exports.ScalarType = void 0;
    var lower_camel_case_1 = require_lower_camel_case();
    var ScalarType;
    (function(ScalarType2) {
      ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
      ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
      ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
      ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
      ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
      ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
      ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
      ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
      ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
      ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
      ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
      ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
      ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
      ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
      ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
    })(ScalarType = exports.ScalarType || (exports.ScalarType = {}));
    var LongType;
    (function(LongType2) {
      LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
      LongType2[LongType2["STRING"] = 1] = "STRING";
      LongType2[LongType2["NUMBER"] = 2] = "NUMBER";
    })(LongType = exports.LongType || (exports.LongType = {}));
    var RepeatType;
    (function(RepeatType2) {
      RepeatType2[RepeatType2["NO"] = 0] = "NO";
      RepeatType2[RepeatType2["PACKED"] = 1] = "PACKED";
      RepeatType2[RepeatType2["UNPACKED"] = 2] = "UNPACKED";
    })(RepeatType = exports.RepeatType || (exports.RepeatType = {}));
    function normalizeFieldInfo(field) {
      var _a, _b, _c, _d;
      field.localName = (_a = field.localName) !== null && _a !== void 0 ? _a : lower_camel_case_1.lowerCamelCase(field.name);
      field.jsonName = (_b = field.jsonName) !== null && _b !== void 0 ? _b : lower_camel_case_1.lowerCamelCase(field.name);
      field.repeat = (_c = field.repeat) !== null && _c !== void 0 ? _c : RepeatType.NO;
      field.opt = (_d = field.opt) !== null && _d !== void 0 ? _d : field.repeat ? false : field.oneof ? false : field.kind == "message";
      return field;
    }
    __name(normalizeFieldInfo, "normalizeFieldInfo");
    exports.normalizeFieldInfo = normalizeFieldInfo;
    function readFieldOptions(messageType, fieldName, extensionName, extensionType) {
      var _a;
      const options = (_a = messageType.fields.find((m, i) => m.localName == fieldName || i == fieldName)) === null || _a === void 0 ? void 0 : _a.options;
      return options && options[extensionName] ? extensionType.fromJson(options[extensionName]) : void 0;
    }
    __name(readFieldOptions, "readFieldOptions");
    exports.readFieldOptions = readFieldOptions;
    function readFieldOption(messageType, fieldName, extensionName, extensionType) {
      var _a;
      const options = (_a = messageType.fields.find((m, i) => m.localName == fieldName || i == fieldName)) === null || _a === void 0 ? void 0 : _a.options;
      if (!options) {
        return void 0;
      }
      const optionVal = options[extensionName];
      if (optionVal === void 0) {
        return optionVal;
      }
      return extensionType ? extensionType.fromJson(optionVal) : optionVal;
    }
    __name(readFieldOption, "readFieldOption");
    exports.readFieldOption = readFieldOption;
    function readMessageOption(messageType, extensionName, extensionType) {
      const options = messageType.options;
      const optionVal = options[extensionName];
      if (optionVal === void 0) {
        return optionVal;
      }
      return extensionType ? extensionType.fromJson(optionVal) : optionVal;
    }
    __name(readMessageOption, "readMessageOption");
    exports.readMessageOption = readMessageOption;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/oneof.js
var require_oneof = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/oneof.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSelectedOneofValue = exports.clearOneofValue = exports.setUnknownOneofValue = exports.setOneofValue = exports.getOneofValue = exports.isOneofGroup = void 0;
    function isOneofGroup(any) {
      if (typeof any != "object" || any === null || !any.hasOwnProperty("oneofKind")) {
        return false;
      }
      switch (typeof any.oneofKind) {
        case "string":
          if (any[any.oneofKind] === void 0)
            return false;
          return Object.keys(any).length == 2;
        case "undefined":
          return Object.keys(any).length == 1;
        default:
          return false;
      }
    }
    __name(isOneofGroup, "isOneofGroup");
    exports.isOneofGroup = isOneofGroup;
    function getOneofValue(oneof, kind) {
      return oneof[kind];
    }
    __name(getOneofValue, "getOneofValue");
    exports.getOneofValue = getOneofValue;
    function setOneofValue(oneof, kind, value2) {
      if (oneof.oneofKind !== void 0) {
        delete oneof[oneof.oneofKind];
      }
      oneof.oneofKind = kind;
      if (value2 !== void 0) {
        oneof[kind] = value2;
      }
    }
    __name(setOneofValue, "setOneofValue");
    exports.setOneofValue = setOneofValue;
    function setUnknownOneofValue(oneof, kind, value2) {
      if (oneof.oneofKind !== void 0) {
        delete oneof[oneof.oneofKind];
      }
      oneof.oneofKind = kind;
      if (value2 !== void 0 && kind !== void 0) {
        oneof[kind] = value2;
      }
    }
    __name(setUnknownOneofValue, "setUnknownOneofValue");
    exports.setUnknownOneofValue = setUnknownOneofValue;
    function clearOneofValue(oneof) {
      if (oneof.oneofKind !== void 0) {
        delete oneof[oneof.oneofKind];
      }
      oneof.oneofKind = void 0;
    }
    __name(clearOneofValue, "clearOneofValue");
    exports.clearOneofValue = clearOneofValue;
    function getSelectedOneofValue(oneof) {
      if (oneof.oneofKind === void 0) {
        return void 0;
      }
      return oneof[oneof.oneofKind];
    }
    __name(getSelectedOneofValue, "getSelectedOneofValue");
    exports.getSelectedOneofValue = getSelectedOneofValue;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-type-check.js
var require_reflection_type_check = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-type-check.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReflectionTypeCheck = void 0;
    var reflection_info_1 = require_reflection_info();
    var oneof_1 = require_oneof();
    var ReflectionTypeCheck = class {
      static {
        __name(this, "ReflectionTypeCheck");
      }
      constructor(info) {
        var _a;
        this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : [];
      }
      prepare() {
        if (this.data)
          return;
        const req = [], known = [], oneofs = [];
        for (let field of this.fields) {
          if (field.oneof) {
            if (!oneofs.includes(field.oneof)) {
              oneofs.push(field.oneof);
              req.push(field.oneof);
              known.push(field.oneof);
            }
          } else {
            known.push(field.localName);
            switch (field.kind) {
              case "scalar":
              case "enum":
                if (!field.opt || field.repeat)
                  req.push(field.localName);
                break;
              case "message":
                if (field.repeat)
                  req.push(field.localName);
                break;
              case "map":
                req.push(field.localName);
                break;
            }
          }
        }
        this.data = { req, known, oneofs: Object.values(oneofs) };
      }
      /**
       * Is the argument a valid message as specified by the
       * reflection information?
       *
       * Checks all field types recursively. The `depth`
       * specifies how deep into the structure the check will be.
       *
       * With a depth of 0, only the presence of fields
       * is checked.
       *
       * With a depth of 1 or more, the field types are checked.
       *
       * With a depth of 2 or more, the members of map, repeated
       * and message fields are checked.
       *
       * Message fields will be checked recursively with depth - 1.
       *
       * The number of map entries / repeated values being checked
       * is < depth.
       */
      is(message, depth, allowExcessProperties = false) {
        if (depth < 0)
          return true;
        if (message === null || message === void 0 || typeof message != "object")
          return false;
        this.prepare();
        let keys = Object.keys(message), data = this.data;
        if (keys.length < data.req.length || data.req.some((n) => !keys.includes(n)))
          return false;
        if (!allowExcessProperties) {
          if (keys.some((k) => !data.known.includes(k)))
            return false;
        }
        if (depth < 1) {
          return true;
        }
        for (const name of data.oneofs) {
          const group = message[name];
          if (!oneof_1.isOneofGroup(group))
            return false;
          if (group.oneofKind === void 0)
            continue;
          const field = this.fields.find((f) => f.localName === group.oneofKind);
          if (!field)
            return false;
          if (!this.field(group[group.oneofKind], field, allowExcessProperties, depth))
            return false;
        }
        for (const field of this.fields) {
          if (field.oneof !== void 0)
            continue;
          if (!this.field(message[field.localName], field, allowExcessProperties, depth))
            return false;
        }
        return true;
      }
      field(arg, field, allowExcessProperties, depth) {
        let repeated = field.repeat;
        switch (field.kind) {
          case "scalar":
            if (arg === void 0)
              return field.opt;
            if (repeated)
              return this.scalars(arg, field.T, depth, field.L);
            return this.scalar(arg, field.T, field.L);
          case "enum":
            if (arg === void 0)
              return field.opt;
            if (repeated)
              return this.scalars(arg, reflection_info_1.ScalarType.INT32, depth);
            return this.scalar(arg, reflection_info_1.ScalarType.INT32);
          case "message":
            if (arg === void 0)
              return true;
            if (repeated)
              return this.messages(arg, field.T(), allowExcessProperties, depth);
            return this.message(arg, field.T(), allowExcessProperties, depth);
          case "map":
            if (typeof arg != "object" || arg === null)
              return false;
            if (depth < 2)
              return true;
            if (!this.mapKeys(arg, field.K, depth))
              return false;
            switch (field.V.kind) {
              case "scalar":
                return this.scalars(Object.values(arg), field.V.T, depth, field.V.L);
              case "enum":
                return this.scalars(Object.values(arg), reflection_info_1.ScalarType.INT32, depth);
              case "message":
                return this.messages(Object.values(arg), field.V.T(), allowExcessProperties, depth);
            }
            break;
        }
        return true;
      }
      message(arg, type, allowExcessProperties, depth) {
        if (allowExcessProperties) {
          return type.isAssignable(arg, depth);
        }
        return type.is(arg, depth);
      }
      messages(arg, type, allowExcessProperties, depth) {
        if (!Array.isArray(arg))
          return false;
        if (depth < 2)
          return true;
        if (allowExcessProperties) {
          for (let i = 0; i < arg.length && i < depth; i++)
            if (!type.isAssignable(arg[i], depth - 1))
              return false;
        } else {
          for (let i = 0; i < arg.length && i < depth; i++)
            if (!type.is(arg[i], depth - 1))
              return false;
        }
        return true;
      }
      scalar(arg, type, longType) {
        let argType = typeof arg;
        switch (type) {
          case reflection_info_1.ScalarType.UINT64:
          case reflection_info_1.ScalarType.FIXED64:
          case reflection_info_1.ScalarType.INT64:
          case reflection_info_1.ScalarType.SFIXED64:
          case reflection_info_1.ScalarType.SINT64:
            switch (longType) {
              case reflection_info_1.LongType.BIGINT:
                return argType == "bigint";
              case reflection_info_1.LongType.NUMBER:
                return argType == "number" && !isNaN(arg);
              default:
                return argType == "string";
            }
          case reflection_info_1.ScalarType.BOOL:
            return argType == "boolean";
          case reflection_info_1.ScalarType.STRING:
            return argType == "string";
          case reflection_info_1.ScalarType.BYTES:
            return arg instanceof Uint8Array;
          case reflection_info_1.ScalarType.DOUBLE:
          case reflection_info_1.ScalarType.FLOAT:
            return argType == "number" && !isNaN(arg);
          default:
            return argType == "number" && Number.isInteger(arg);
        }
      }
      scalars(arg, type, depth, longType) {
        if (!Array.isArray(arg))
          return false;
        if (depth < 2)
          return true;
        if (Array.isArray(arg)) {
          for (let i = 0; i < arg.length && i < depth; i++)
            if (!this.scalar(arg[i], type, longType))
              return false;
        }
        return true;
      }
      mapKeys(map, type, depth) {
        let keys = Object.keys(map);
        switch (type) {
          case reflection_info_1.ScalarType.INT32:
          case reflection_info_1.ScalarType.FIXED32:
          case reflection_info_1.ScalarType.SFIXED32:
          case reflection_info_1.ScalarType.SINT32:
          case reflection_info_1.ScalarType.UINT32:
            return this.scalars(keys.slice(0, depth).map((k) => parseInt(k)), type, depth);
          case reflection_info_1.ScalarType.BOOL:
            return this.scalars(keys.slice(0, depth).map((k) => k == "true" ? true : k == "false" ? false : k), type, depth);
          default:
            return this.scalars(keys, type, depth, reflection_info_1.LongType.STRING);
        }
      }
    };
    exports.ReflectionTypeCheck = ReflectionTypeCheck;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-long-convert.js
var require_reflection_long_convert = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-long-convert.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reflectionLongConvert = void 0;
    var reflection_info_1 = require_reflection_info();
    function reflectionLongConvert(long, type) {
      switch (type) {
        case reflection_info_1.LongType.BIGINT:
          return long.toBigInt();
        case reflection_info_1.LongType.NUMBER:
          return long.toNumber();
        default:
          return long.toString();
      }
    }
    __name(reflectionLongConvert, "reflectionLongConvert");
    exports.reflectionLongConvert = reflectionLongConvert;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-json-reader.js
var require_reflection_json_reader = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-json-reader.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReflectionJsonReader = void 0;
    var json_typings_1 = require_json_typings();
    var base64_1 = require_base64();
    var reflection_info_1 = require_reflection_info();
    var pb_long_1 = require_pb_long();
    var assert_1 = require_assert();
    var reflection_long_convert_1 = require_reflection_long_convert();
    var ReflectionJsonReader = class {
      static {
        __name(this, "ReflectionJsonReader");
      }
      constructor(info) {
        this.info = info;
      }
      prepare() {
        var _a;
        if (this.fMap === void 0) {
          this.fMap = {};
          const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : [];
          for (const field of fieldsInput) {
            this.fMap[field.name] = field;
            this.fMap[field.jsonName] = field;
            this.fMap[field.localName] = field;
          }
        }
      }
      // Cannot parse JSON <type of jsonValue> for <type name>#<fieldName>.
      assert(condition, fieldName, jsonValue) {
        if (!condition) {
          let what = json_typings_1.typeofJsonValue(jsonValue);
          if (what == "number" || what == "boolean")
            what = jsonValue.toString();
          throw new Error(`Cannot parse JSON ${what} for ${this.info.typeName}#${fieldName}`);
        }
      }
      /**
       * Reads a message from canonical JSON format into the target message.
       *
       * Repeated fields are appended. Map entries are added, overwriting
       * existing keys.
       *
       * If a message field is already present, it will be merged with the
       * new data.
       */
      read(input, message, options) {
        this.prepare();
        const oneofsHandled = [];
        for (const [jsonKey, jsonValue] of Object.entries(input)) {
          const field = this.fMap[jsonKey];
          if (!field) {
            if (!options.ignoreUnknownFields)
              throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${jsonKey}`);
            continue;
          }
          const localName = field.localName;
          let target;
          if (field.oneof) {
            if (jsonValue === null && (field.kind !== "enum" || field.T()[0] !== "google.protobuf.NullValue")) {
              continue;
            }
            if (oneofsHandled.includes(field.oneof))
              throw new Error(`Multiple members of the oneof group "${field.oneof}" of ${this.info.typeName} are present in JSON.`);
            oneofsHandled.push(field.oneof);
            target = message[field.oneof] = {
              oneofKind: localName
            };
          } else {
            target = message;
          }
          if (field.kind == "map") {
            if (jsonValue === null) {
              continue;
            }
            this.assert(json_typings_1.isJsonObject(jsonValue), field.name, jsonValue);
            const fieldObj = target[localName];
            for (const [jsonObjKey, jsonObjValue] of Object.entries(jsonValue)) {
              this.assert(jsonObjValue !== null, field.name + " map value", null);
              let val;
              switch (field.V.kind) {
                case "message":
                  val = field.V.T().internalJsonRead(jsonObjValue, options);
                  break;
                case "enum":
                  val = this.enum(field.V.T(), jsonObjValue, field.name, options.ignoreUnknownFields);
                  if (val === false)
                    continue;
                  break;
                case "scalar":
                  val = this.scalar(jsonObjValue, field.V.T, field.V.L, field.name);
                  break;
              }
              this.assert(val !== void 0, field.name + " map value", jsonObjValue);
              let key = jsonObjKey;
              if (field.K == reflection_info_1.ScalarType.BOOL)
                key = key == "true" ? true : key == "false" ? false : key;
              key = this.scalar(key, field.K, reflection_info_1.LongType.STRING, field.name).toString();
              fieldObj[key] = val;
            }
          } else if (field.repeat) {
            if (jsonValue === null)
              continue;
            this.assert(Array.isArray(jsonValue), field.name, jsonValue);
            const fieldArr = target[localName];
            for (const jsonItem of jsonValue) {
              this.assert(jsonItem !== null, field.name, null);
              let val;
              switch (field.kind) {
                case "message":
                  val = field.T().internalJsonRead(jsonItem, options);
                  break;
                case "enum":
                  val = this.enum(field.T(), jsonItem, field.name, options.ignoreUnknownFields);
                  if (val === false)
                    continue;
                  break;
                case "scalar":
                  val = this.scalar(jsonItem, field.T, field.L, field.name);
                  break;
              }
              this.assert(val !== void 0, field.name, jsonValue);
              fieldArr.push(val);
            }
          } else {
            switch (field.kind) {
              case "message":
                if (jsonValue === null && field.T().typeName != "google.protobuf.Value") {
                  this.assert(field.oneof === void 0, field.name + " (oneof member)", null);
                  continue;
                }
                target[localName] = field.T().internalJsonRead(jsonValue, options, target[localName]);
                break;
              case "enum":
                if (jsonValue === null)
                  continue;
                let val = this.enum(field.T(), jsonValue, field.name, options.ignoreUnknownFields);
                if (val === false)
                  continue;
                target[localName] = val;
                break;
              case "scalar":
                if (jsonValue === null)
                  continue;
                target[localName] = this.scalar(jsonValue, field.T, field.L, field.name);
                break;
            }
          }
        }
      }
      /**
       * Returns `false` for unrecognized string representations.
       *
       * google.protobuf.NullValue accepts only JSON `null` (or the old `"NULL_VALUE"`).
       */
      enum(type, json, fieldName, ignoreUnknownFields) {
        if (type[0] == "google.protobuf.NullValue")
          assert_1.assert(json === null || json === "NULL_VALUE", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} only accepts null.`);
        if (json === null)
          return 0;
        switch (typeof json) {
          case "number":
            assert_1.assert(Number.isInteger(json), `Unable to parse field ${this.info.typeName}#${fieldName}, enum can only be integral number, got ${json}.`);
            return json;
          case "string":
            let localEnumName = json;
            if (type[2] && json.substring(0, type[2].length) === type[2])
              localEnumName = json.substring(type[2].length);
            let enumNumber = type[1][localEnumName];
            if (typeof enumNumber === "undefined" && ignoreUnknownFields) {
              return false;
            }
            assert_1.assert(typeof enumNumber == "number", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} has no value for "${json}".`);
            return enumNumber;
        }
        assert_1.assert(false, `Unable to parse field ${this.info.typeName}#${fieldName}, cannot parse enum value from ${typeof json}".`);
      }
      scalar(json, type, longType, fieldName) {
        let e;
        try {
          switch (type) {
            // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
            // Either numbers or strings are accepted. Exponent notation is also accepted.
            case reflection_info_1.ScalarType.DOUBLE:
            case reflection_info_1.ScalarType.FLOAT:
              if (json === null)
                return 0;
              if (json === "NaN")
                return Number.NaN;
              if (json === "Infinity")
                return Number.POSITIVE_INFINITY;
              if (json === "-Infinity")
                return Number.NEGATIVE_INFINITY;
              if (json === "") {
                e = "empty string";
                break;
              }
              if (typeof json == "string" && json.trim().length !== json.length) {
                e = "extra whitespace";
                break;
              }
              if (typeof json != "string" && typeof json != "number") {
                break;
              }
              let float = Number(json);
              if (Number.isNaN(float)) {
                e = "not a number";
                break;
              }
              if (!Number.isFinite(float)) {
                e = "too large or small";
                break;
              }
              if (type == reflection_info_1.ScalarType.FLOAT)
                assert_1.assertFloat32(float);
              return float;
            // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
            case reflection_info_1.ScalarType.INT32:
            case reflection_info_1.ScalarType.FIXED32:
            case reflection_info_1.ScalarType.SFIXED32:
            case reflection_info_1.ScalarType.SINT32:
            case reflection_info_1.ScalarType.UINT32:
              if (json === null)
                return 0;
              let int32;
              if (typeof json == "number")
                int32 = json;
              else if (json === "")
                e = "empty string";
              else if (typeof json == "string") {
                if (json.trim().length !== json.length)
                  e = "extra whitespace";
                else
                  int32 = Number(json);
              }
              if (int32 === void 0)
                break;
              if (type == reflection_info_1.ScalarType.UINT32)
                assert_1.assertUInt32(int32);
              else
                assert_1.assertInt32(int32);
              return int32;
            // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
            case reflection_info_1.ScalarType.INT64:
            case reflection_info_1.ScalarType.SFIXED64:
            case reflection_info_1.ScalarType.SINT64:
              if (json === null)
                return reflection_long_convert_1.reflectionLongConvert(pb_long_1.PbLong.ZERO, longType);
              if (typeof json != "number" && typeof json != "string")
                break;
              return reflection_long_convert_1.reflectionLongConvert(pb_long_1.PbLong.from(json), longType);
            case reflection_info_1.ScalarType.FIXED64:
            case reflection_info_1.ScalarType.UINT64:
              if (json === null)
                return reflection_long_convert_1.reflectionLongConvert(pb_long_1.PbULong.ZERO, longType);
              if (typeof json != "number" && typeof json != "string")
                break;
              return reflection_long_convert_1.reflectionLongConvert(pb_long_1.PbULong.from(json), longType);
            // bool:
            case reflection_info_1.ScalarType.BOOL:
              if (json === null)
                return false;
              if (typeof json !== "boolean")
                break;
              return json;
            // string:
            case reflection_info_1.ScalarType.STRING:
              if (json === null)
                return "";
              if (typeof json !== "string") {
                e = "extra whitespace";
                break;
              }
              try {
                encodeURIComponent(json);
              } catch (e2) {
                e2 = "invalid UTF8";
                break;
              }
              return json;
            // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
            // Either standard or URL-safe base64 encoding with/without paddings are accepted.
            case reflection_info_1.ScalarType.BYTES:
              if (json === null || json === "")
                return new Uint8Array(0);
              if (typeof json !== "string")
                break;
              return base64_1.base64decode(json);
          }
        } catch (error) {
          e = error.message;
        }
        this.assert(false, fieldName + (e ? " - " + e : ""), json);
      }
    };
    exports.ReflectionJsonReader = ReflectionJsonReader;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-json-writer.js
var require_reflection_json_writer = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-json-writer.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReflectionJsonWriter = void 0;
    var base64_1 = require_base64();
    var pb_long_1 = require_pb_long();
    var reflection_info_1 = require_reflection_info();
    var assert_1 = require_assert();
    var ReflectionJsonWriter = class {
      static {
        __name(this, "ReflectionJsonWriter");
      }
      constructor(info) {
        var _a;
        this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : [];
      }
      /**
       * Converts the message to a JSON object, based on the field descriptors.
       */
      write(message, options) {
        const json = {}, source = message;
        for (const field of this.fields) {
          if (!field.oneof) {
            let jsonValue2 = this.field(field, source[field.localName], options);
            if (jsonValue2 !== void 0)
              json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue2;
            continue;
          }
          const group = source[field.oneof];
          if (group.oneofKind !== field.localName)
            continue;
          const opt = field.kind == "scalar" || field.kind == "enum" ? Object.assign(Object.assign({}, options), { emitDefaultValues: true }) : options;
          let jsonValue = this.field(field, group[field.localName], opt);
          assert_1.assert(jsonValue !== void 0);
          json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
        }
        return json;
      }
      field(field, value2, options) {
        let jsonValue = void 0;
        if (field.kind == "map") {
          assert_1.assert(typeof value2 == "object" && value2 !== null);
          const jsonObj = {};
          switch (field.V.kind) {
            case "scalar":
              for (const [entryKey, entryValue] of Object.entries(value2)) {
                const val = this.scalar(field.V.T, entryValue, field.name, false, true);
                assert_1.assert(val !== void 0);
                jsonObj[entryKey.toString()] = val;
              }
              break;
            case "message":
              const messageType = field.V.T();
              for (const [entryKey, entryValue] of Object.entries(value2)) {
                const val = this.message(messageType, entryValue, field.name, options);
                assert_1.assert(val !== void 0);
                jsonObj[entryKey.toString()] = val;
              }
              break;
            case "enum":
              const enumInfo = field.V.T();
              for (const [entryKey, entryValue] of Object.entries(value2)) {
                assert_1.assert(entryValue === void 0 || typeof entryValue == "number");
                const val = this.enum(enumInfo, entryValue, field.name, false, true, options.enumAsInteger);
                assert_1.assert(val !== void 0);
                jsonObj[entryKey.toString()] = val;
              }
              break;
          }
          if (options.emitDefaultValues || Object.keys(jsonObj).length > 0)
            jsonValue = jsonObj;
        } else if (field.repeat) {
          assert_1.assert(Array.isArray(value2));
          const jsonArr = [];
          switch (field.kind) {
            case "scalar":
              for (let i = 0; i < value2.length; i++) {
                const val = this.scalar(field.T, value2[i], field.name, field.opt, true);
                assert_1.assert(val !== void 0);
                jsonArr.push(val);
              }
              break;
            case "enum":
              const enumInfo = field.T();
              for (let i = 0; i < value2.length; i++) {
                assert_1.assert(value2[i] === void 0 || typeof value2[i] == "number");
                const val = this.enum(enumInfo, value2[i], field.name, field.opt, true, options.enumAsInteger);
                assert_1.assert(val !== void 0);
                jsonArr.push(val);
              }
              break;
            case "message":
              const messageType = field.T();
              for (let i = 0; i < value2.length; i++) {
                const val = this.message(messageType, value2[i], field.name, options);
                assert_1.assert(val !== void 0);
                jsonArr.push(val);
              }
              break;
          }
          if (options.emitDefaultValues || jsonArr.length > 0 || options.emitDefaultValues)
            jsonValue = jsonArr;
        } else {
          switch (field.kind) {
            case "scalar":
              jsonValue = this.scalar(field.T, value2, field.name, field.opt, options.emitDefaultValues);
              break;
            case "enum":
              jsonValue = this.enum(field.T(), value2, field.name, field.opt, options.emitDefaultValues, options.enumAsInteger);
              break;
            case "message":
              jsonValue = this.message(field.T(), value2, field.name, options);
              break;
          }
        }
        return jsonValue;
      }
      /**
       * Returns `null` as the default for google.protobuf.NullValue.
       */
      enum(type, value2, fieldName, optional, emitDefaultValues, enumAsInteger) {
        if (type[0] == "google.protobuf.NullValue")
          return !emitDefaultValues && !optional ? void 0 : null;
        if (value2 === void 0) {
          assert_1.assert(optional);
          return void 0;
        }
        if (value2 === 0 && !emitDefaultValues && !optional)
          return void 0;
        assert_1.assert(typeof value2 == "number");
        assert_1.assert(Number.isInteger(value2));
        if (enumAsInteger || !type[1].hasOwnProperty(value2))
          return value2;
        if (type[2])
          return type[2] + type[1][value2];
        return type[1][value2];
      }
      message(type, value2, fieldName, options) {
        if (value2 === void 0)
          return options.emitDefaultValues ? null : void 0;
        return type.internalJsonWrite(value2, options);
      }
      scalar(type, value2, fieldName, optional, emitDefaultValues) {
        if (value2 === void 0) {
          assert_1.assert(optional);
          return void 0;
        }
        const ed = emitDefaultValues || optional;
        switch (type) {
          // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
          case reflection_info_1.ScalarType.INT32:
          case reflection_info_1.ScalarType.SFIXED32:
          case reflection_info_1.ScalarType.SINT32:
            if (value2 === 0)
              return ed ? 0 : void 0;
            assert_1.assertInt32(value2);
            return value2;
          case reflection_info_1.ScalarType.FIXED32:
          case reflection_info_1.ScalarType.UINT32:
            if (value2 === 0)
              return ed ? 0 : void 0;
            assert_1.assertUInt32(value2);
            return value2;
          // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
          // Either numbers or strings are accepted. Exponent notation is also accepted.
          case reflection_info_1.ScalarType.FLOAT:
            assert_1.assertFloat32(value2);
          case reflection_info_1.ScalarType.DOUBLE:
            if (value2 === 0)
              return ed ? 0 : void 0;
            assert_1.assert(typeof value2 == "number");
            if (Number.isNaN(value2))
              return "NaN";
            if (value2 === Number.POSITIVE_INFINITY)
              return "Infinity";
            if (value2 === Number.NEGATIVE_INFINITY)
              return "-Infinity";
            return value2;
          // string:
          case reflection_info_1.ScalarType.STRING:
            if (value2 === "")
              return ed ? "" : void 0;
            assert_1.assert(typeof value2 == "string");
            return value2;
          // bool:
          case reflection_info_1.ScalarType.BOOL:
            if (value2 === false)
              return ed ? false : void 0;
            assert_1.assert(typeof value2 == "boolean");
            return value2;
          // JSON value will be a decimal string. Either numbers or strings are accepted.
          case reflection_info_1.ScalarType.UINT64:
          case reflection_info_1.ScalarType.FIXED64:
            assert_1.assert(typeof value2 == "number" || typeof value2 == "string" || typeof value2 == "bigint");
            let ulong = pb_long_1.PbULong.from(value2);
            if (ulong.isZero() && !ed)
              return void 0;
            return ulong.toString();
          // JSON value will be a decimal string. Either numbers or strings are accepted.
          case reflection_info_1.ScalarType.INT64:
          case reflection_info_1.ScalarType.SFIXED64:
          case reflection_info_1.ScalarType.SINT64:
            assert_1.assert(typeof value2 == "number" || typeof value2 == "string" || typeof value2 == "bigint");
            let long = pb_long_1.PbLong.from(value2);
            if (long.isZero() && !ed)
              return void 0;
            return long.toString();
          // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
          // Either standard or URL-safe base64 encoding with/without paddings are accepted.
          case reflection_info_1.ScalarType.BYTES:
            assert_1.assert(value2 instanceof Uint8Array);
            if (!value2.byteLength)
              return ed ? "" : void 0;
            return base64_1.base64encode(value2);
        }
      }
    };
    exports.ReflectionJsonWriter = ReflectionJsonWriter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-scalar-default.js
var require_reflection_scalar_default = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-scalar-default.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reflectionScalarDefault = void 0;
    var reflection_info_1 = require_reflection_info();
    var reflection_long_convert_1 = require_reflection_long_convert();
    var pb_long_1 = require_pb_long();
    function reflectionScalarDefault(type, longType = reflection_info_1.LongType.STRING) {
      switch (type) {
        case reflection_info_1.ScalarType.BOOL:
          return false;
        case reflection_info_1.ScalarType.UINT64:
        case reflection_info_1.ScalarType.FIXED64:
          return reflection_long_convert_1.reflectionLongConvert(pb_long_1.PbULong.ZERO, longType);
        case reflection_info_1.ScalarType.INT64:
        case reflection_info_1.ScalarType.SFIXED64:
        case reflection_info_1.ScalarType.SINT64:
          return reflection_long_convert_1.reflectionLongConvert(pb_long_1.PbLong.ZERO, longType);
        case reflection_info_1.ScalarType.DOUBLE:
        case reflection_info_1.ScalarType.FLOAT:
          return 0;
        case reflection_info_1.ScalarType.BYTES:
          return new Uint8Array(0);
        case reflection_info_1.ScalarType.STRING:
          return "";
        default:
          return 0;
      }
    }
    __name(reflectionScalarDefault, "reflectionScalarDefault");
    exports.reflectionScalarDefault = reflectionScalarDefault;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-binary-reader.js
var require_reflection_binary_reader = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-binary-reader.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReflectionBinaryReader = void 0;
    var binary_format_contract_1 = require_binary_format_contract();
    var reflection_info_1 = require_reflection_info();
    var reflection_long_convert_1 = require_reflection_long_convert();
    var reflection_scalar_default_1 = require_reflection_scalar_default();
    var ReflectionBinaryReader = class {
      static {
        __name(this, "ReflectionBinaryReader");
      }
      constructor(info) {
        this.info = info;
      }
      prepare() {
        var _a;
        if (!this.fieldNoToField) {
          const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : [];
          this.fieldNoToField = new Map(fieldsInput.map((field) => [field.no, field]));
        }
      }
      /**
       * Reads a message from binary format into the target message.
       *
       * Repeated fields are appended. Map entries are added, overwriting
       * existing keys.
       *
       * If a message field is already present, it will be merged with the
       * new data.
       */
      read(reader, message, options, length) {
        this.prepare();
        const end = length === void 0 ? reader.len : reader.pos + length;
        while (reader.pos < end) {
          const [fieldNo, wireType] = reader.tag(), field = this.fieldNoToField.get(fieldNo);
          if (!field) {
            let u = options.readUnknownField;
            if (u == "throw")
              throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.info.typeName}`);
            let d = reader.skip(wireType);
            if (u !== false)
              (u === true ? binary_format_contract_1.UnknownFieldHandler.onRead : u)(this.info.typeName, message, fieldNo, wireType, d);
            continue;
          }
          let target = message, repeated = field.repeat, localName = field.localName;
          if (field.oneof) {
            target = target[field.oneof];
            if (target.oneofKind !== localName)
              target = message[field.oneof] = {
                oneofKind: localName
              };
          }
          switch (field.kind) {
            case "scalar":
            case "enum":
              let T = field.kind == "enum" ? reflection_info_1.ScalarType.INT32 : field.T;
              let L = field.kind == "scalar" ? field.L : void 0;
              if (repeated) {
                let arr = target[localName];
                if (wireType == binary_format_contract_1.WireType.LengthDelimited && T != reflection_info_1.ScalarType.STRING && T != reflection_info_1.ScalarType.BYTES) {
                  let e = reader.uint32() + reader.pos;
                  while (reader.pos < e)
                    arr.push(this.scalar(reader, T, L));
                } else
                  arr.push(this.scalar(reader, T, L));
              } else
                target[localName] = this.scalar(reader, T, L);
              break;
            case "message":
              if (repeated) {
                let arr = target[localName];
                let msg = field.T().internalBinaryRead(reader, reader.uint32(), options);
                arr.push(msg);
              } else
                target[localName] = field.T().internalBinaryRead(reader, reader.uint32(), options, target[localName]);
              break;
            case "map":
              let [mapKey, mapVal] = this.mapEntry(field, reader, options);
              target[localName][mapKey] = mapVal;
              break;
          }
        }
      }
      /**
       * Read a map field, expecting key field = 1, value field = 2
       */
      mapEntry(field, reader, options) {
        let length = reader.uint32();
        let end = reader.pos + length;
        let key = void 0;
        let val = void 0;
        while (reader.pos < end) {
          let [fieldNo, wireType] = reader.tag();
          switch (fieldNo) {
            case 1:
              if (field.K == reflection_info_1.ScalarType.BOOL)
                key = reader.bool().toString();
              else
                key = this.scalar(reader, field.K, reflection_info_1.LongType.STRING);
              break;
            case 2:
              switch (field.V.kind) {
                case "scalar":
                  val = this.scalar(reader, field.V.T, field.V.L);
                  break;
                case "enum":
                  val = reader.int32();
                  break;
                case "message":
                  val = field.V.T().internalBinaryRead(reader, reader.uint32(), options);
                  break;
              }
              break;
            default:
              throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) in map entry for ${this.info.typeName}#${field.name}`);
          }
        }
        if (key === void 0) {
          let keyRaw = reflection_scalar_default_1.reflectionScalarDefault(field.K);
          key = field.K == reflection_info_1.ScalarType.BOOL ? keyRaw.toString() : keyRaw;
        }
        if (val === void 0)
          switch (field.V.kind) {
            case "scalar":
              val = reflection_scalar_default_1.reflectionScalarDefault(field.V.T, field.V.L);
              break;
            case "enum":
              val = 0;
              break;
            case "message":
              val = field.V.T().create();
              break;
          }
        return [key, val];
      }
      scalar(reader, type, longType) {
        switch (type) {
          case reflection_info_1.ScalarType.INT32:
            return reader.int32();
          case reflection_info_1.ScalarType.STRING:
            return reader.string();
          case reflection_info_1.ScalarType.BOOL:
            return reader.bool();
          case reflection_info_1.ScalarType.DOUBLE:
            return reader.double();
          case reflection_info_1.ScalarType.FLOAT:
            return reader.float();
          case reflection_info_1.ScalarType.INT64:
            return reflection_long_convert_1.reflectionLongConvert(reader.int64(), longType);
          case reflection_info_1.ScalarType.UINT64:
            return reflection_long_convert_1.reflectionLongConvert(reader.uint64(), longType);
          case reflection_info_1.ScalarType.FIXED64:
            return reflection_long_convert_1.reflectionLongConvert(reader.fixed64(), longType);
          case reflection_info_1.ScalarType.FIXED32:
            return reader.fixed32();
          case reflection_info_1.ScalarType.BYTES:
            return reader.bytes();
          case reflection_info_1.ScalarType.UINT32:
            return reader.uint32();
          case reflection_info_1.ScalarType.SFIXED32:
            return reader.sfixed32();
          case reflection_info_1.ScalarType.SFIXED64:
            return reflection_long_convert_1.reflectionLongConvert(reader.sfixed64(), longType);
          case reflection_info_1.ScalarType.SINT32:
            return reader.sint32();
          case reflection_info_1.ScalarType.SINT64:
            return reflection_long_convert_1.reflectionLongConvert(reader.sint64(), longType);
        }
      }
    };
    exports.ReflectionBinaryReader = ReflectionBinaryReader;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-binary-writer.js
var require_reflection_binary_writer = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-binary-writer.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReflectionBinaryWriter = void 0;
    var binary_format_contract_1 = require_binary_format_contract();
    var reflection_info_1 = require_reflection_info();
    var assert_1 = require_assert();
    var pb_long_1 = require_pb_long();
    var ReflectionBinaryWriter = class {
      static {
        __name(this, "ReflectionBinaryWriter");
      }
      constructor(info) {
        this.info = info;
      }
      prepare() {
        if (!this.fields) {
          const fieldsInput = this.info.fields ? this.info.fields.concat() : [];
          this.fields = fieldsInput.sort((a, b) => a.no - b.no);
        }
      }
      /**
       * Writes the message to binary format.
       */
      write(message, writer, options) {
        this.prepare();
        for (const field of this.fields) {
          let value2, emitDefault, repeated = field.repeat, localName = field.localName;
          if (field.oneof) {
            const group = message[field.oneof];
            if (group.oneofKind !== localName)
              continue;
            value2 = group[localName];
            emitDefault = true;
          } else {
            value2 = message[localName];
            emitDefault = false;
          }
          switch (field.kind) {
            case "scalar":
            case "enum":
              let T = field.kind == "enum" ? reflection_info_1.ScalarType.INT32 : field.T;
              if (repeated) {
                assert_1.assert(Array.isArray(value2));
                if (repeated == reflection_info_1.RepeatType.PACKED)
                  this.packed(writer, T, field.no, value2);
                else
                  for (const item of value2)
                    this.scalar(writer, T, field.no, item, true);
              } else if (value2 === void 0)
                assert_1.assert(field.opt);
              else
                this.scalar(writer, T, field.no, value2, emitDefault || field.opt);
              break;
            case "message":
              if (repeated) {
                assert_1.assert(Array.isArray(value2));
                for (const item of value2)
                  this.message(writer, options, field.T(), field.no, item);
              } else {
                this.message(writer, options, field.T(), field.no, value2);
              }
              break;
            case "map":
              assert_1.assert(typeof value2 == "object" && value2 !== null);
              for (const [key, val] of Object.entries(value2))
                this.mapEntry(writer, options, field, key, val);
              break;
          }
        }
        let u = options.writeUnknownFields;
        if (u !== false)
          (u === true ? binary_format_contract_1.UnknownFieldHandler.onWrite : u)(this.info.typeName, message, writer);
      }
      mapEntry(writer, options, field, key, value2) {
        writer.tag(field.no, binary_format_contract_1.WireType.LengthDelimited);
        writer.fork();
        let keyValue = key;
        switch (field.K) {
          case reflection_info_1.ScalarType.INT32:
          case reflection_info_1.ScalarType.FIXED32:
          case reflection_info_1.ScalarType.UINT32:
          case reflection_info_1.ScalarType.SFIXED32:
          case reflection_info_1.ScalarType.SINT32:
            keyValue = Number.parseInt(key);
            break;
          case reflection_info_1.ScalarType.BOOL:
            assert_1.assert(key == "true" || key == "false");
            keyValue = key == "true";
            break;
        }
        this.scalar(writer, field.K, 1, keyValue, true);
        switch (field.V.kind) {
          case "scalar":
            this.scalar(writer, field.V.T, 2, value2, true);
            break;
          case "enum":
            this.scalar(writer, reflection_info_1.ScalarType.INT32, 2, value2, true);
            break;
          case "message":
            this.message(writer, options, field.V.T(), 2, value2);
            break;
        }
        writer.join();
      }
      message(writer, options, handler, fieldNo, value2) {
        if (value2 === void 0)
          return;
        handler.internalBinaryWrite(value2, writer.tag(fieldNo, binary_format_contract_1.WireType.LengthDelimited).fork(), options);
        writer.join();
      }
      /**
       * Write a single scalar value.
       */
      scalar(writer, type, fieldNo, value2, emitDefault) {
        let [wireType, method, isDefault] = this.scalarInfo(type, value2);
        if (!isDefault || emitDefault) {
          writer.tag(fieldNo, wireType);
          writer[method](value2);
        }
      }
      /**
       * Write an array of scalar values in packed format.
       */
      packed(writer, type, fieldNo, value2) {
        if (!value2.length)
          return;
        assert_1.assert(type !== reflection_info_1.ScalarType.BYTES && type !== reflection_info_1.ScalarType.STRING);
        writer.tag(fieldNo, binary_format_contract_1.WireType.LengthDelimited);
        writer.fork();
        let [, method] = this.scalarInfo(type);
        for (let i = 0; i < value2.length; i++)
          writer[method](value2[i]);
        writer.join();
      }
      /**
       * Get information for writing a scalar value.
       *
       * Returns tuple:
       * [0]: appropriate WireType
       * [1]: name of the appropriate method of IBinaryWriter
       * [2]: whether the given value is a default value
       *
       * If argument `value` is omitted, [2] is always false.
       */
      scalarInfo(type, value2) {
        let t = binary_format_contract_1.WireType.Varint;
        let m;
        let i = value2 === void 0;
        let d = value2 === 0;
        switch (type) {
          case reflection_info_1.ScalarType.INT32:
            m = "int32";
            break;
          case reflection_info_1.ScalarType.STRING:
            d = i || !value2.length;
            t = binary_format_contract_1.WireType.LengthDelimited;
            m = "string";
            break;
          case reflection_info_1.ScalarType.BOOL:
            d = value2 === false;
            m = "bool";
            break;
          case reflection_info_1.ScalarType.UINT32:
            m = "uint32";
            break;
          case reflection_info_1.ScalarType.DOUBLE:
            t = binary_format_contract_1.WireType.Bit64;
            m = "double";
            break;
          case reflection_info_1.ScalarType.FLOAT:
            t = binary_format_contract_1.WireType.Bit32;
            m = "float";
            break;
          case reflection_info_1.ScalarType.INT64:
            d = i || pb_long_1.PbLong.from(value2).isZero();
            m = "int64";
            break;
          case reflection_info_1.ScalarType.UINT64:
            d = i || pb_long_1.PbULong.from(value2).isZero();
            m = "uint64";
            break;
          case reflection_info_1.ScalarType.FIXED64:
            d = i || pb_long_1.PbULong.from(value2).isZero();
            t = binary_format_contract_1.WireType.Bit64;
            m = "fixed64";
            break;
          case reflection_info_1.ScalarType.BYTES:
            d = i || !value2.byteLength;
            t = binary_format_contract_1.WireType.LengthDelimited;
            m = "bytes";
            break;
          case reflection_info_1.ScalarType.FIXED32:
            t = binary_format_contract_1.WireType.Bit32;
            m = "fixed32";
            break;
          case reflection_info_1.ScalarType.SFIXED32:
            t = binary_format_contract_1.WireType.Bit32;
            m = "sfixed32";
            break;
          case reflection_info_1.ScalarType.SFIXED64:
            d = i || pb_long_1.PbLong.from(value2).isZero();
            t = binary_format_contract_1.WireType.Bit64;
            m = "sfixed64";
            break;
          case reflection_info_1.ScalarType.SINT32:
            m = "sint32";
            break;
          case reflection_info_1.ScalarType.SINT64:
            d = i || pb_long_1.PbLong.from(value2).isZero();
            m = "sint64";
            break;
        }
        return [t, m, i || d];
      }
    };
    exports.ReflectionBinaryWriter = ReflectionBinaryWriter;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-create.js
var require_reflection_create = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-create.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reflectionCreate = void 0;
    var reflection_scalar_default_1 = require_reflection_scalar_default();
    var message_type_contract_1 = require_message_type_contract();
    function reflectionCreate(type) {
      const msg = type.messagePrototype ? Object.create(type.messagePrototype) : Object.defineProperty({}, message_type_contract_1.MESSAGE_TYPE, { value: type });
      for (let field of type.fields) {
        let name = field.localName;
        if (field.opt)
          continue;
        if (field.oneof)
          msg[field.oneof] = { oneofKind: void 0 };
        else if (field.repeat)
          msg[name] = [];
        else
          switch (field.kind) {
            case "scalar":
              msg[name] = reflection_scalar_default_1.reflectionScalarDefault(field.T, field.L);
              break;
            case "enum":
              msg[name] = 0;
              break;
            case "map":
              msg[name] = {};
              break;
          }
      }
      return msg;
    }
    __name(reflectionCreate, "reflectionCreate");
    exports.reflectionCreate = reflectionCreate;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-merge-partial.js
var require_reflection_merge_partial = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-merge-partial.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reflectionMergePartial = void 0;
    function reflectionMergePartial2(info, target, source) {
      let fieldValue, input = source, output;
      for (let field of info.fields) {
        let name = field.localName;
        if (field.oneof) {
          const group = input[field.oneof];
          if ((group === null || group === void 0 ? void 0 : group.oneofKind) == void 0) {
            continue;
          }
          fieldValue = group[name];
          output = target[field.oneof];
          output.oneofKind = group.oneofKind;
          if (fieldValue == void 0) {
            delete output[name];
            continue;
          }
        } else {
          fieldValue = input[name];
          output = target;
          if (fieldValue == void 0) {
            continue;
          }
        }
        if (field.repeat)
          output[name].length = fieldValue.length;
        switch (field.kind) {
          case "scalar":
          case "enum":
            if (field.repeat)
              for (let i = 0; i < fieldValue.length; i++)
                output[name][i] = fieldValue[i];
            else
              output[name] = fieldValue;
            break;
          case "message":
            let T = field.T();
            if (field.repeat)
              for (let i = 0; i < fieldValue.length; i++)
                output[name][i] = T.create(fieldValue[i]);
            else if (output[name] === void 0)
              output[name] = T.create(fieldValue);
            else
              T.mergePartial(output[name], fieldValue);
            break;
          case "map":
            switch (field.V.kind) {
              case "scalar":
              case "enum":
                Object.assign(output[name], fieldValue);
                break;
              case "message":
                let T2 = field.V.T();
                for (let k of Object.keys(fieldValue))
                  output[name][k] = T2.create(fieldValue[k]);
                break;
            }
            break;
        }
      }
    }
    __name(reflectionMergePartial2, "reflectionMergePartial");
    exports.reflectionMergePartial = reflectionMergePartial2;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-equals.js
var require_reflection_equals = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-equals.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reflectionEquals = void 0;
    var reflection_info_1 = require_reflection_info();
    function reflectionEquals(info, a, b) {
      if (a === b)
        return true;
      if (!a || !b)
        return false;
      for (let field of info.fields) {
        let localName = field.localName;
        let val_a = field.oneof ? a[field.oneof][localName] : a[localName];
        let val_b = field.oneof ? b[field.oneof][localName] : b[localName];
        switch (field.kind) {
          case "enum":
          case "scalar":
            let t = field.kind == "enum" ? reflection_info_1.ScalarType.INT32 : field.T;
            if (!(field.repeat ? repeatedPrimitiveEq(t, val_a, val_b) : primitiveEq(t, val_a, val_b)))
              return false;
            break;
          case "map":
            if (!(field.V.kind == "message" ? repeatedMsgEq(field.V.T(), objectValues(val_a), objectValues(val_b)) : repeatedPrimitiveEq(field.V.kind == "enum" ? reflection_info_1.ScalarType.INT32 : field.V.T, objectValues(val_a), objectValues(val_b))))
              return false;
            break;
          case "message":
            let T = field.T();
            if (!(field.repeat ? repeatedMsgEq(T, val_a, val_b) : T.equals(val_a, val_b)))
              return false;
            break;
        }
      }
      return true;
    }
    __name(reflectionEquals, "reflectionEquals");
    exports.reflectionEquals = reflectionEquals;
    var objectValues = Object.values;
    function primitiveEq(type, a, b) {
      if (a === b)
        return true;
      if (type !== reflection_info_1.ScalarType.BYTES)
        return false;
      let ba = a;
      let bb = b;
      if (ba.length !== bb.length)
        return false;
      for (let i = 0; i < ba.length; i++)
        if (ba[i] != bb[i])
          return false;
      return true;
    }
    __name(primitiveEq, "primitiveEq");
    function repeatedPrimitiveEq(type, a, b) {
      if (a.length !== b.length)
        return false;
      for (let i = 0; i < a.length; i++)
        if (!primitiveEq(type, a[i], b[i]))
          return false;
      return true;
    }
    __name(repeatedPrimitiveEq, "repeatedPrimitiveEq");
    function repeatedMsgEq(type, a, b) {
      if (a.length !== b.length)
        return false;
      for (let i = 0; i < a.length; i++)
        if (!type.equals(a[i], b[i]))
          return false;
      return true;
    }
    __name(repeatedMsgEq, "repeatedMsgEq");
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/message-type.js
var require_message_type = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/message-type.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageType = void 0;
    var message_type_contract_1 = require_message_type_contract();
    var reflection_info_1 = require_reflection_info();
    var reflection_type_check_1 = require_reflection_type_check();
    var reflection_json_reader_1 = require_reflection_json_reader();
    var reflection_json_writer_1 = require_reflection_json_writer();
    var reflection_binary_reader_1 = require_reflection_binary_reader();
    var reflection_binary_writer_1 = require_reflection_binary_writer();
    var reflection_create_1 = require_reflection_create();
    var reflection_merge_partial_1 = require_reflection_merge_partial();
    var json_typings_1 = require_json_typings();
    var json_format_contract_1 = require_json_format_contract();
    var reflection_equals_1 = require_reflection_equals();
    var binary_writer_1 = require_binary_writer();
    var binary_reader_1 = require_binary_reader();
    var baseDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));
    var messageTypeDescriptor = baseDescriptors[message_type_contract_1.MESSAGE_TYPE] = {};
    var MessageType2 = class {
      static {
        __name(this, "MessageType");
      }
      constructor(name, fields, options) {
        this.defaultCheckDepth = 16;
        this.typeName = name;
        this.fields = fields.map(reflection_info_1.normalizeFieldInfo);
        this.options = options !== null && options !== void 0 ? options : {};
        messageTypeDescriptor.value = this;
        this.messagePrototype = Object.create(null, baseDescriptors);
        this.refTypeCheck = new reflection_type_check_1.ReflectionTypeCheck(this);
        this.refJsonReader = new reflection_json_reader_1.ReflectionJsonReader(this);
        this.refJsonWriter = new reflection_json_writer_1.ReflectionJsonWriter(this);
        this.refBinReader = new reflection_binary_reader_1.ReflectionBinaryReader(this);
        this.refBinWriter = new reflection_binary_writer_1.ReflectionBinaryWriter(this);
      }
      create(value2) {
        let message = reflection_create_1.reflectionCreate(this);
        if (value2 !== void 0) {
          reflection_merge_partial_1.reflectionMergePartial(this, message, value2);
        }
        return message;
      }
      /**
       * Clone the message.
       *
       * Unknown fields are discarded.
       */
      clone(message) {
        let copy = this.create();
        reflection_merge_partial_1.reflectionMergePartial(this, copy, message);
        return copy;
      }
      /**
       * Determines whether two message of the same type have the same field values.
       * Checks for deep equality, traversing repeated fields, oneof groups, maps
       * and messages recursively.
       * Will also return true if both messages are `undefined`.
       */
      equals(a, b) {
        return reflection_equals_1.reflectionEquals(this, a, b);
      }
      /**
       * Is the given value assignable to our message type
       * and contains no [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
       */
      is(arg, depth = this.defaultCheckDepth) {
        return this.refTypeCheck.is(arg, depth, false);
      }
      /**
       * Is the given value assignable to our message type,
       * regardless of [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
       */
      isAssignable(arg, depth = this.defaultCheckDepth) {
        return this.refTypeCheck.is(arg, depth, true);
      }
      /**
       * Copy partial data into the target message.
       */
      mergePartial(target, source) {
        reflection_merge_partial_1.reflectionMergePartial(this, target, source);
      }
      /**
       * Create a new message from binary format.
       */
      fromBinary(data, options) {
        let opt = binary_reader_1.binaryReadOptions(options);
        return this.internalBinaryRead(opt.readerFactory(data), data.byteLength, opt);
      }
      /**
       * Read a new message from a JSON value.
       */
      fromJson(json, options) {
        return this.internalJsonRead(json, json_format_contract_1.jsonReadOptions(options));
      }
      /**
       * Read a new message from a JSON string.
       * This is equivalent to `T.fromJson(JSON.parse(json))`.
       */
      fromJsonString(json, options) {
        let value2 = JSON.parse(json);
        return this.fromJson(value2, options);
      }
      /**
       * Write the message to canonical JSON value.
       */
      toJson(message, options) {
        return this.internalJsonWrite(message, json_format_contract_1.jsonWriteOptions(options));
      }
      /**
       * Convert the message to canonical JSON string.
       * This is equivalent to `JSON.stringify(T.toJson(t))`
       */
      toJsonString(message, options) {
        var _a;
        let value2 = this.toJson(message, options);
        return JSON.stringify(value2, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
      }
      /**
       * Write the message to binary format.
       */
      toBinary(message, options) {
        let opt = binary_writer_1.binaryWriteOptions(options);
        return this.internalBinaryWrite(message, opt.writerFactory(), opt).finish();
      }
      /**
       * This is an internal method. If you just want to read a message from
       * JSON, use `fromJson()` or `fromJsonString()`.
       *
       * Reads JSON value and merges the fields into the target
       * according to protobuf rules. If the target is omitted,
       * a new instance is created first.
       */
      internalJsonRead(json, options, target) {
        if (json !== null && typeof json == "object" && !Array.isArray(json)) {
          let message = target !== null && target !== void 0 ? target : this.create();
          this.refJsonReader.read(json, message, options);
          return message;
        }
        throw new Error(`Unable to parse message ${this.typeName} from JSON ${json_typings_1.typeofJsonValue(json)}.`);
      }
      /**
       * This is an internal method. If you just want to write a message
       * to JSON, use `toJson()` or `toJsonString().
       *
       * Writes JSON value and returns it.
       */
      internalJsonWrite(message, options) {
        return this.refJsonWriter.write(message, options);
      }
      /**
       * This is an internal method. If you just want to write a message
       * in binary format, use `toBinary()`.
       *
       * Serializes the message in binary format and appends it to the given
       * writer. Returns passed writer.
       */
      internalBinaryWrite(message, writer, options) {
        this.refBinWriter.write(message, writer, options);
        return writer;
      }
      /**
       * This is an internal method. If you just want to read a message from
       * binary data, use `fromBinary()`.
       *
       * Reads data from binary format and merges the fields into
       * the target according to protobuf rules. If the target is
       * omitted, a new instance is created first.
       */
      internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create();
        this.refBinReader.read(reader, message, options, length);
        return message;
      }
    };
    exports.MessageType = MessageType2;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-contains-message-type.js
var require_reflection_contains_message_type = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/reflection-contains-message-type.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.containsMessageType = void 0;
    var message_type_contract_1 = require_message_type_contract();
    function containsMessageType(msg) {
      return msg[message_type_contract_1.MESSAGE_TYPE] != null;
    }
    __name(containsMessageType, "containsMessageType");
    exports.containsMessageType = containsMessageType;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/enum-object.js
var require_enum_object = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/enum-object.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.listEnumNumbers = exports.listEnumNames = exports.listEnumValues = exports.isEnumObject = void 0;
    function isEnumObject(arg) {
      if (typeof arg != "object" || arg === null) {
        return false;
      }
      if (!arg.hasOwnProperty(0)) {
        return false;
      }
      for (let k of Object.keys(arg)) {
        let num = parseInt(k);
        if (!Number.isNaN(num)) {
          let nam = arg[num];
          if (nam === void 0)
            return false;
          if (arg[nam] !== num)
            return false;
        } else {
          let num2 = arg[k];
          if (num2 === void 0)
            return false;
          if (typeof num2 !== "number")
            return false;
          if (arg[num2] === void 0)
            return false;
        }
      }
      return true;
    }
    __name(isEnumObject, "isEnumObject");
    exports.isEnumObject = isEnumObject;
    function listEnumValues(enumObject) {
      if (!isEnumObject(enumObject))
        throw new Error("not a typescript enum object");
      let values = [];
      for (let [name, number] of Object.entries(enumObject))
        if (typeof number == "number")
          values.push({ name, number });
      return values;
    }
    __name(listEnumValues, "listEnumValues");
    exports.listEnumValues = listEnumValues;
    function listEnumNames(enumObject) {
      return listEnumValues(enumObject).map((val) => val.name);
    }
    __name(listEnumNames, "listEnumNames");
    exports.listEnumNames = listEnumNames;
    function listEnumNumbers(enumObject) {
      return listEnumValues(enumObject).map((val) => val.number).filter((num, index, arr) => arr.indexOf(num) == index);
    }
    __name(listEnumNumbers, "listEnumNumbers");
    exports.listEnumNumbers = listEnumNumbers;
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/index.js
var require_commonjs = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@protobuf-ts/runtime/build/commonjs/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    var json_typings_1 = require_json_typings();
    Object.defineProperty(exports, "typeofJsonValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return json_typings_1.typeofJsonValue;
    }, "get") });
    Object.defineProperty(exports, "isJsonObject", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return json_typings_1.isJsonObject;
    }, "get") });
    var base64_1 = require_base64();
    Object.defineProperty(exports, "base64decode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return base64_1.base64decode;
    }, "get") });
    Object.defineProperty(exports, "base64encode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return base64_1.base64encode;
    }, "get") });
    var protobufjs_utf8_1 = require_protobufjs_utf8();
    Object.defineProperty(exports, "utf8read", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return protobufjs_utf8_1.utf8read;
    }, "get") });
    var binary_format_contract_1 = require_binary_format_contract();
    Object.defineProperty(exports, "WireType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_format_contract_1.WireType;
    }, "get") });
    Object.defineProperty(exports, "mergeBinaryOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_format_contract_1.mergeBinaryOptions;
    }, "get") });
    Object.defineProperty(exports, "UnknownFieldHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_format_contract_1.UnknownFieldHandler;
    }, "get") });
    var binary_reader_1 = require_binary_reader();
    Object.defineProperty(exports, "BinaryReader", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_reader_1.BinaryReader;
    }, "get") });
    Object.defineProperty(exports, "binaryReadOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_reader_1.binaryReadOptions;
    }, "get") });
    var binary_writer_1 = require_binary_writer();
    Object.defineProperty(exports, "BinaryWriter", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_writer_1.BinaryWriter;
    }, "get") });
    Object.defineProperty(exports, "binaryWriteOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return binary_writer_1.binaryWriteOptions;
    }, "get") });
    var pb_long_1 = require_pb_long();
    Object.defineProperty(exports, "PbLong", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return pb_long_1.PbLong;
    }, "get") });
    Object.defineProperty(exports, "PbULong", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return pb_long_1.PbULong;
    }, "get") });
    var json_format_contract_1 = require_json_format_contract();
    Object.defineProperty(exports, "jsonReadOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return json_format_contract_1.jsonReadOptions;
    }, "get") });
    Object.defineProperty(exports, "jsonWriteOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return json_format_contract_1.jsonWriteOptions;
    }, "get") });
    Object.defineProperty(exports, "mergeJsonOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return json_format_contract_1.mergeJsonOptions;
    }, "get") });
    var message_type_contract_1 = require_message_type_contract();
    Object.defineProperty(exports, "MESSAGE_TYPE", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return message_type_contract_1.MESSAGE_TYPE;
    }, "get") });
    var message_type_1 = require_message_type();
    Object.defineProperty(exports, "MessageType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return message_type_1.MessageType;
    }, "get") });
    var reflection_info_1 = require_reflection_info();
    Object.defineProperty(exports, "ScalarType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.ScalarType;
    }, "get") });
    Object.defineProperty(exports, "LongType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.LongType;
    }, "get") });
    Object.defineProperty(exports, "RepeatType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.RepeatType;
    }, "get") });
    Object.defineProperty(exports, "normalizeFieldInfo", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.normalizeFieldInfo;
    }, "get") });
    Object.defineProperty(exports, "readFieldOptions", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.readFieldOptions;
    }, "get") });
    Object.defineProperty(exports, "readFieldOption", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.readFieldOption;
    }, "get") });
    Object.defineProperty(exports, "readMessageOption", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_info_1.readMessageOption;
    }, "get") });
    var reflection_type_check_1 = require_reflection_type_check();
    Object.defineProperty(exports, "ReflectionTypeCheck", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_type_check_1.ReflectionTypeCheck;
    }, "get") });
    var reflection_create_1 = require_reflection_create();
    Object.defineProperty(exports, "reflectionCreate", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_create_1.reflectionCreate;
    }, "get") });
    var reflection_scalar_default_1 = require_reflection_scalar_default();
    Object.defineProperty(exports, "reflectionScalarDefault", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_scalar_default_1.reflectionScalarDefault;
    }, "get") });
    var reflection_merge_partial_1 = require_reflection_merge_partial();
    Object.defineProperty(exports, "reflectionMergePartial", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_merge_partial_1.reflectionMergePartial;
    }, "get") });
    var reflection_equals_1 = require_reflection_equals();
    Object.defineProperty(exports, "reflectionEquals", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_equals_1.reflectionEquals;
    }, "get") });
    var reflection_binary_reader_1 = require_reflection_binary_reader();
    Object.defineProperty(exports, "ReflectionBinaryReader", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_binary_reader_1.ReflectionBinaryReader;
    }, "get") });
    var reflection_binary_writer_1 = require_reflection_binary_writer();
    Object.defineProperty(exports, "ReflectionBinaryWriter", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_binary_writer_1.ReflectionBinaryWriter;
    }, "get") });
    var reflection_json_reader_1 = require_reflection_json_reader();
    Object.defineProperty(exports, "ReflectionJsonReader", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_json_reader_1.ReflectionJsonReader;
    }, "get") });
    var reflection_json_writer_1 = require_reflection_json_writer();
    Object.defineProperty(exports, "ReflectionJsonWriter", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_json_writer_1.ReflectionJsonWriter;
    }, "get") });
    var reflection_contains_message_type_1 = require_reflection_contains_message_type();
    Object.defineProperty(exports, "containsMessageType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return reflection_contains_message_type_1.containsMessageType;
    }, "get") });
    var oneof_1 = require_oneof();
    Object.defineProperty(exports, "isOneofGroup", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return oneof_1.isOneofGroup;
    }, "get") });
    Object.defineProperty(exports, "setOneofValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return oneof_1.setOneofValue;
    }, "get") });
    Object.defineProperty(exports, "getOneofValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return oneof_1.getOneofValue;
    }, "get") });
    Object.defineProperty(exports, "clearOneofValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return oneof_1.clearOneofValue;
    }, "get") });
    Object.defineProperty(exports, "getSelectedOneofValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return oneof_1.getSelectedOneofValue;
    }, "get") });
    var enum_object_1 = require_enum_object();
    Object.defineProperty(exports, "listEnumValues", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return enum_object_1.listEnumValues;
    }, "get") });
    Object.defineProperty(exports, "listEnumNames", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return enum_object_1.listEnumNames;
    }, "get") });
    Object.defineProperty(exports, "listEnumNumbers", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return enum_object_1.listEnumNumbers;
    }, "get") });
    Object.defineProperty(exports, "isEnumObject", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return enum_object_1.isEnumObject;
    }, "get") });
    var lower_camel_case_1 = require_lower_camel_case();
    Object.defineProperty(exports, "lowerCamelCase", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return lower_camel_case_1.lowerCamelCase;
    }, "get") });
    var assert_1 = require_assert();
    Object.defineProperty(exports, "assert", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return assert_1.assert;
    }, "get") });
    Object.defineProperty(exports, "assertNever", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return assert_1.assertNever;
    }, "get") });
    Object.defineProperty(exports, "assertInt32", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return assert_1.assertInt32;
    }, "get") });
    Object.defineProperty(exports, "assertUInt32", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return assert_1.assertUInt32;
    }, "get") });
    Object.defineProperty(exports, "assertFloat32", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return assert_1.assertFloat32;
    }, "get") });
  }
});

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/index.js
init_esm();
import * as http2 from "node:http2";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/generated/proto/s2.js
init_esm();
var import_runtime = __toESM(require_commonjs(), 1);
var import_runtime2 = __toESM(require_commonjs(), 1);
var import_runtime3 = __toESM(require_commonjs(), 1);
var import_runtime4 = __toESM(require_commonjs(), 1);
var StreamPosition$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "StreamPosition$Type");
  }
  constructor() {
    super("s2.v1.StreamPosition", [
      {
        no: 1,
        name: "seq_num",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 2,
        name: "timestamp",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.seqNum = 0n;
    message.timestamp = 0n;
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 seq_num */
        1:
          message.seqNum = reader.uint64().toBigInt();
          break;
        case /* uint64 timestamp */
        2:
          message.timestamp = reader.uint64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.seqNum !== 0n)
      writer.tag(1, import_runtime.WireType.Varint).uint64(message.seqNum);
    if (message.timestamp !== 0n)
      writer.tag(2, import_runtime.WireType.Varint).uint64(message.timestamp);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var StreamPosition = new StreamPosition$Type();
var Header$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "Header$Type");
  }
  constructor() {
    super("s2.v1.Header", [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "value",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.name = new Uint8Array(0);
    message.value = new Uint8Array(0);
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes name */
        1:
          message.name = reader.bytes();
          break;
        case /* bytes value */
        2:
          message.value = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.name.length)
      writer.tag(1, import_runtime.WireType.LengthDelimited).bytes(message.name);
    if (message.value.length)
      writer.tag(2, import_runtime.WireType.LengthDelimited).bytes(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var Header = new Header$Type();
var AppendRecord$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "AppendRecord$Type");
  }
  constructor() {
    super("s2.v1.AppendRecord", [
      {
        no: 1,
        name: "timestamp",
        kind: "scalar",
        opt: true,
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 2, name: "headers", kind: "message", repeat: 2, T: /* @__PURE__ */ __name(() => Header, "T") },
      {
        no: 3,
        name: "body",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.headers = [];
    message.body = new Uint8Array(0);
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* optional uint64 timestamp */
        1:
          message.timestamp = reader.uint64().toBigInt();
          break;
        case /* repeated s2.v1.Header headers */
        2:
          message.headers.push(Header.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case /* bytes body */
        3:
          message.body = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.timestamp !== void 0)
      writer.tag(1, import_runtime.WireType.Varint).uint64(message.timestamp);
    for (let i = 0; i < message.headers.length; i++)
      Header.internalBinaryWrite(message.headers[i], writer.tag(2, import_runtime.WireType.LengthDelimited).fork(), options).join();
    if (message.body.length)
      writer.tag(3, import_runtime.WireType.LengthDelimited).bytes(message.body);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var AppendRecord = new AppendRecord$Type();
var AppendInput$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "AppendInput$Type");
  }
  constructor() {
    super("s2.v1.AppendInput", [
      { no: 1, name: "records", kind: "message", repeat: 2, T: /* @__PURE__ */ __name(() => AppendRecord, "T") },
      {
        no: 2,
        name: "match_seq_num",
        kind: "scalar",
        opt: true,
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 3,
        name: "fencing_token",
        kind: "scalar",
        opt: true,
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.records = [];
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated s2.v1.AppendRecord records */
        1:
          message.records.push(AppendRecord.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case /* optional uint64 match_seq_num */
        2:
          message.matchSeqNum = reader.uint64().toBigInt();
          break;
        case /* optional string fencing_token */
        3:
          message.fencingToken = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.records.length; i++)
      AppendRecord.internalBinaryWrite(message.records[i], writer.tag(1, import_runtime.WireType.LengthDelimited).fork(), options).join();
    if (message.matchSeqNum !== void 0)
      writer.tag(2, import_runtime.WireType.Varint).uint64(message.matchSeqNum);
    if (message.fencingToken !== void 0)
      writer.tag(3, import_runtime.WireType.LengthDelimited).string(message.fencingToken);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var AppendInput = new AppendInput$Type();
var AppendAck$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "AppendAck$Type");
  }
  constructor() {
    super("s2.v1.AppendAck", [
      { no: 1, name: "start", kind: "message", T: /* @__PURE__ */ __name(() => StreamPosition, "T") },
      { no: 2, name: "end", kind: "message", T: /* @__PURE__ */ __name(() => StreamPosition, "T") },
      { no: 3, name: "tail", kind: "message", T: /* @__PURE__ */ __name(() => StreamPosition, "T") }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* s2.v1.StreamPosition start */
        1:
          message.start = StreamPosition.internalBinaryRead(reader, reader.uint32(), options, message.start);
          break;
        case /* s2.v1.StreamPosition end */
        2:
          message.end = StreamPosition.internalBinaryRead(reader, reader.uint32(), options, message.end);
          break;
        case /* s2.v1.StreamPosition tail */
        3:
          message.tail = StreamPosition.internalBinaryRead(reader, reader.uint32(), options, message.tail);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.start)
      StreamPosition.internalBinaryWrite(message.start, writer.tag(1, import_runtime.WireType.LengthDelimited).fork(), options).join();
    if (message.end)
      StreamPosition.internalBinaryWrite(message.end, writer.tag(2, import_runtime.WireType.LengthDelimited).fork(), options).join();
    if (message.tail)
      StreamPosition.internalBinaryWrite(message.tail, writer.tag(3, import_runtime.WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var AppendAck = new AppendAck$Type();
var SequencedRecord$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "SequencedRecord$Type");
  }
  constructor() {
    super("s2.v1.SequencedRecord", [
      {
        no: 1,
        name: "seq_num",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 2,
        name: "timestamp",
        kind: "scalar",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      { no: 3, name: "headers", kind: "message", repeat: 2, T: /* @__PURE__ */ __name(() => Header, "T") },
      {
        no: 4,
        name: "body",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.seqNum = 0n;
    message.timestamp = 0n;
    message.headers = [];
    message.body = new Uint8Array(0);
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* uint64 seq_num */
        1:
          message.seqNum = reader.uint64().toBigInt();
          break;
        case /* uint64 timestamp */
        2:
          message.timestamp = reader.uint64().toBigInt();
          break;
        case /* repeated s2.v1.Header headers */
        3:
          message.headers.push(Header.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case /* bytes body */
        4:
          message.body = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.seqNum !== 0n)
      writer.tag(1, import_runtime.WireType.Varint).uint64(message.seqNum);
    if (message.timestamp !== 0n)
      writer.tag(2, import_runtime.WireType.Varint).uint64(message.timestamp);
    for (let i = 0; i < message.headers.length; i++)
      Header.internalBinaryWrite(message.headers[i], writer.tag(3, import_runtime.WireType.LengthDelimited).fork(), options).join();
    if (message.body.length)
      writer.tag(4, import_runtime.WireType.LengthDelimited).bytes(message.body);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var SequencedRecord = new SequencedRecord$Type();
var ReadBatch$Type = class extends import_runtime4.MessageType {
  static {
    __name(this, "ReadBatch$Type");
  }
  constructor() {
    super("s2.v1.ReadBatch", [
      { no: 1, name: "records", kind: "message", repeat: 2, T: /* @__PURE__ */ __name(() => SequencedRecord, "T") },
      { no: 2, name: "tail", kind: "message", T: /* @__PURE__ */ __name(() => StreamPosition, "T") }
    ]);
  }
  create(value2) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.records = [];
    if (value2 !== void 0)
      (0, import_runtime3.reflectionMergePartial)(this, message, value2);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* repeated s2.v1.SequencedRecord records */
        1:
          message.records.push(SequencedRecord.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case /* optional s2.v1.StreamPosition tail */
        2:
          message.tail = StreamPosition.internalBinaryRead(reader, reader.uint32(), options, message.tail);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? import_runtime2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0; i < message.records.length; i++)
      SequencedRecord.internalBinaryWrite(message.records[i], writer.tag(1, import_runtime.WireType.LengthDelimited).fork(), options).join();
    if (message.tail)
      StreamPosition.internalBinaryWrite(message.tail, writer.tag(2, import_runtime.WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? import_runtime2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
};
var ReadBatch = new ReadBatch$Type();

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/framing.js
init_esm();
function frameMessage(opts) {
  const compression = opts.compression ?? "none";
  let flag = 0;
  if (opts.terminal) {
    flag |= 128;
  }
  if (compression === "zstd") {
    flag |= 32;
  } else if (compression === "gzip") {
    flag |= 64;
  }
  let body = opts.body;
  if (opts.terminal && opts.statusCode !== void 0) {
    const statusBytes = new Uint8Array(2);
    statusBytes[0] = opts.statusCode >> 8 & 255;
    statusBytes[1] = opts.statusCode & 255;
    body = new Uint8Array(statusBytes.length + opts.body.length);
    body.set(statusBytes, 0);
    body.set(opts.body, statusBytes.length);
  }
  const length = 1 + body.length;
  if (length > 16777215) {
    throw new Error(`Message too large: ${length} bytes (max 16MB)`);
  }
  const frame = new Uint8Array(3 + length);
  frame[0] = length >> 16 & 255;
  frame[1] = length >> 8 & 255;
  frame[2] = length & 255;
  frame[3] = flag;
  frame.set(body, 4);
  return frame;
}
__name(frameMessage, "frameMessage");
var S2SFrameParser = class {
  static {
    __name(this, "S2SFrameParser");
  }
  buffer = new Uint8Array(0);
  /**
   * Add data to the parser buffer
   */
  push(data) {
    const newBuffer = new Uint8Array(this.buffer.length + data.length);
    newBuffer.set(this.buffer, 0);
    newBuffer.set(data, this.buffer.length);
    this.buffer = newBuffer;
  }
  /**
   * Try to parse the next frame from the buffer
   * Returns null if not enough data available
   */
  parseFrame() {
    if (this.buffer.length < 4) {
      return null;
    }
    const length = this.buffer[0] << 16 | this.buffer[1] << 8 | this.buffer[2];
    if (this.buffer.length < 3 + length) {
      return null;
    }
    const flag = this.buffer[3];
    const terminal = (flag & 128) !== 0;
    let compression = "none";
    if ((flag & 32) !== 0) {
      compression = "zstd";
    } else if ((flag & 64) !== 0) {
      compression = "gzip";
    }
    let body = this.buffer.slice(4, 4 + length - 1);
    let statusCode;
    if (terminal && body.length >= 2) {
      statusCode = body[0] << 8 | body[1];
      body = body.slice(2);
    }
    this.buffer = this.buffer.slice(3 + length);
    return {
      terminal,
      compression,
      body,
      statusCode
    };
  }
  /**
   * Check if parser has any buffered data
   */
  hasData() {
    return this.buffer.length > 0;
  }
};

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/index.js
var S2STransport = class {
  static {
    __name(this, "S2STransport");
  }
  client;
  transportConfig;
  connection;
  connectionPromise;
  constructor(config) {
    this.client = createClient(createConfig({
      baseUrl: config.baseUrl,
      auth: /* @__PURE__ */ __name(() => value(config.accessToken), "auth")
    }));
    this.transportConfig = config;
  }
  async makeAppendSession(stream, sessionOptions, requestOptions) {
    return S2SAppendSession.create(this.transportConfig.baseUrl, this.transportConfig.accessToken, stream, () => this.getConnection(), sessionOptions, requestOptions);
  }
  async makeReadSession(stream, args, options) {
    return S2SReadSession.create(this.transportConfig.baseUrl, this.transportConfig.accessToken, stream, args, options, () => this.getConnection());
  }
  /**
   * Get or create HTTP/2 connection (one per transport)
   */
  async getConnection() {
    if (this.connection && !this.connection.closed && !this.connection.destroyed) {
      return this.connection;
    }
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    this.connectionPromise = this.createConnection();
    try {
      this.connection = await this.connectionPromise;
      return this.connection;
    } finally {
      this.connectionPromise = void 0;
    }
  }
  async createConnection() {
    const url = new URL(this.transportConfig.baseUrl);
    const client = http2.connect(url.origin, {
      // Use HTTPS settings
      ...url.protocol === "https:" ? {
        // TLS options can go here if needed
      } : {},
      settings: {
        initialWindowSize: 10 * 1024 * 1024
        // 10 MB
      }
    });
    return new Promise((resolve, reject) => {
      client.once("connect", () => {
        client.setLocalWindowSize(10 * 1024 * 1024);
        resolve(client);
      });
      client.once("error", (err) => {
        reject(err);
      });
      client.once("close", () => {
        if (this.connection === client) {
          this.connection = void 0;
        }
      });
    });
  }
};
var S2SReadSession = class _S2SReadSession extends ReadableStream {
  static {
    __name(this, "S2SReadSession");
  }
  streamName;
  args;
  authToken;
  url;
  options;
  getConnection;
  http2Stream;
  _lastReadPosition;
  parser = new S2SFrameParser();
  static async create(baseUrl, bearerToken, streamName, args, options, getConnection) {
    const url = new URL(baseUrl);
    return new _S2SReadSession(streamName, args, bearerToken, url, options, getConnection);
  }
  constructor(streamName, args, authToken, url, options, getConnection) {
    const parser = new S2SFrameParser();
    const textDecoder = new TextDecoder();
    let http2Stream;
    let lastReadPosition;
    super({
      start: /* @__PURE__ */ __name(async (controller) => {
        let controllerClosed = false;
        const safeClose = /* @__PURE__ */ __name(() => {
          if (!controllerClosed) {
            controllerClosed = true;
            try {
              controller.close();
            } catch {
            }
          }
        }, "safeClose");
        const safeError = /* @__PURE__ */ __name((err) => {
          if (!controllerClosed) {
            controllerClosed = true;
            controller.error(err);
          }
        }, "safeError");
        try {
          const connection = await getConnection();
          const queryParams = new URLSearchParams();
          const { as, ...readParams } = args ?? {};
          if (readParams.seq_num !== void 0)
            queryParams.set("seq_num", readParams.seq_num.toString());
          if (readParams.timestamp !== void 0)
            queryParams.set("timestamp", readParams.timestamp.toString());
          if (readParams.tail_offset !== void 0)
            queryParams.set("tail_offset", readParams.tail_offset.toString());
          if (readParams.count !== void 0)
            queryParams.set("count", readParams.count.toString());
          if (readParams.bytes !== void 0)
            queryParams.set("bytes", readParams.bytes.toString());
          if (readParams.wait !== void 0)
            queryParams.set("wait", readParams.wait.toString());
          if (typeof readParams.until === "number") {
            queryParams.set("until", readParams.until.toString());
          }
          const queryString = queryParams.toString();
          const path = `${url.pathname}/streams/${encodeURIComponent(streamName)}/records${queryString ? `?${queryString}` : ""}`;
          const stream = connection.request({
            ":method": "GET",
            ":path": path,
            ":scheme": url.protocol.slice(0, -1),
            ":authority": url.host,
            authorization: `Bearer ${value(authToken)}`,
            accept: "application/protobuf",
            "content-type": "s2s/proto"
          });
          http2Stream = stream;
          options?.signal?.addEventListener("abort", () => {
            if (!stream.closed) {
              stream.close();
            }
          });
          stream.on("data", (chunk) => {
            parser.push(chunk);
            let frame = parser.parseFrame();
            while (frame) {
              if (frame.terminal) {
                if (frame.statusCode && frame.statusCode >= 400) {
                  const errorText = textDecoder.decode(frame.body);
                  try {
                    const errorJson = JSON.parse(errorText);
                    safeError(new S2Error({
                      message: errorJson.message ?? "Unknown error",
                      code: errorJson.code,
                      status: frame.statusCode
                    }));
                  } catch {
                    safeError(new S2Error({
                      message: errorText || "Unknown error",
                      status: frame.statusCode
                    }));
                  }
                } else {
                  safeClose();
                }
                stream.close();
              } else {
                try {
                  const protoBatch = ReadBatch.fromBinary(frame.body);
                  if (protoBatch.tail) {
                    lastReadPosition = convertStreamPosition(protoBatch.tail);
                    this._lastReadPosition = lastReadPosition;
                  }
                  for (const record of protoBatch.records) {
                    const converted = this.convertRecord(record, as ?? "string", textDecoder);
                    controller.enqueue(converted);
                  }
                } catch (err) {
                  safeError(new S2Error({
                    message: `Failed to parse ReadBatch: ${err}`
                  }));
                }
              }
              frame = parser.parseFrame();
            }
          });
          stream.on("error", (err) => {
            safeError(err);
          });
          stream.on("close", () => {
            safeClose();
          });
        } catch (err) {
          safeError(err);
        }
      }, "start"),
      cancel: /* @__PURE__ */ __name(async () => {
        if (http2Stream && !http2Stream.closed) {
          http2Stream.close();
        }
      }, "cancel")
    });
    this.streamName = streamName;
    this.args = args;
    this.authToken = authToken;
    this.url = url;
    this.options = options;
    this.getConnection = getConnection;
    this.parser = parser;
    this.http2Stream = http2Stream;
  }
  /**
   * Convert a protobuf SequencedRecord to the requested format
   */
  convertRecord(record, format, textDecoder) {
    if (format === "bytes") {
      return {
        seq_num: Number(record.seqNum),
        timestamp: Number(record.timestamp),
        headers: record.headers?.map((h) => [h.name ?? new Uint8Array(), h.value ?? new Uint8Array()]),
        body: record.body
      };
    } else {
      return {
        seq_num: Number(record.seqNum),
        timestamp: Number(record.timestamp),
        headers: record.headers?.map((h) => [
          h.name ? textDecoder.decode(h.name) : "",
          h.value ? textDecoder.decode(h.value) : ""
        ]),
        body: record.body ? textDecoder.decode(record.body) : void 0
      };
    }
  }
  async [Symbol.asyncDispose]() {
    await this.cancel("disposed");
  }
  // Polyfill for older browsers / Node.js environments
  [Symbol.asyncIterator]() {
    const fn = ReadableStream.prototype[Symbol.asyncIterator];
    if (typeof fn === "function")
      return fn.call(this);
    const reader = this.getReader();
    return {
      next: /* @__PURE__ */ __name(async () => {
        const r = await reader.read();
        if (r.done) {
          reader.releaseLock();
          return { done: true, value: void 0 };
        }
        return { done: false, value: r.value };
      }, "next"),
      throw: /* @__PURE__ */ __name(async (e) => {
        await reader.cancel(e);
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "throw"),
      return: /* @__PURE__ */ __name(async () => {
        await reader.cancel("done");
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "return"),
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  lastReadPosition() {
    return this._lastReadPosition;
  }
};
var S2SAcksStream = class extends ReadableStream {
  static {
    __name(this, "S2SAcksStream");
  }
  constructor(setController) {
    super({
      start: /* @__PURE__ */ __name((controller) => {
        setController(controller);
      }, "start")
    });
  }
  async [Symbol.asyncDispose]() {
    await this.cancel("disposed");
  }
  // Polyfill for older browsers
  [Symbol.asyncIterator]() {
    const fn = ReadableStream.prototype[Symbol.asyncIterator];
    if (typeof fn === "function")
      return fn.call(this);
    const reader = this.getReader();
    return {
      next: /* @__PURE__ */ __name(async () => {
        const r = await reader.read();
        if (r.done) {
          reader.releaseLock();
          return { done: true, value: void 0 };
        }
        return { done: false, value: r.value };
      }, "next"),
      throw: /* @__PURE__ */ __name(async (e) => {
        await reader.cancel(e);
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "throw"),
      return: /* @__PURE__ */ __name(async () => {
        await reader.cancel("done");
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "return"),
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
};
var S2SAppendSession = class _S2SAppendSession {
  static {
    __name(this, "S2SAppendSession");
  }
  baseUrl;
  authToken;
  streamName;
  getConnection;
  options;
  http2Stream;
  _lastAckedPosition;
  parser = new S2SFrameParser();
  acksController;
  _readable;
  _writable;
  closed = false;
  queuedBytes = 0;
  maxQueuedBytes;
  waitingForCapacity = [];
  pendingAcks = [];
  initPromise;
  readable;
  writable;
  static async create(baseUrl, bearerToken, streamName, getConnection, sessionOptions, requestOptions) {
    return new _S2SAppendSession(baseUrl, bearerToken, streamName, getConnection, sessionOptions, requestOptions);
  }
  constructor(baseUrl, authToken, streamName, getConnection, sessionOptions, options) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
    this.streamName = streamName;
    this.getConnection = getConnection;
    this.options = options;
    this.maxQueuedBytes = sessionOptions?.maxQueuedBytes ?? 10 * 1024 * 1024;
    this._readable = new S2SAcksStream((controller) => {
      this.acksController = controller;
    });
    this.readable = this._readable;
    this._writable = new WritableStream({
      start: /* @__PURE__ */ __name(async (controller) => {
        this.initPromise = this.initializeStream();
        await this.initPromise;
      }, "start"),
      write: /* @__PURE__ */ __name(async (chunk) => {
        if (this.closed) {
          throw new S2Error({ message: "AppendSession is closed" });
        }
        const recordsArray = Array.isArray(chunk.records) ? chunk.records : [chunk.records];
        if (recordsArray.length > 1e3) {
          throw new S2Error({
            message: `Batch of ${recordsArray.length} exceeds maximum batch size of 1000 records`
          });
        }
        let batchMeteredSize = 0;
        for (const record of recordsArray) {
          batchMeteredSize += meteredSizeBytes(record);
        }
        if (batchMeteredSize > 1024 * 1024) {
          throw new S2Error({
            message: `Batch size ${batchMeteredSize} bytes exceeds maximum of 1 MiB (1048576 bytes)`
          });
        }
        while (this.queuedBytes + batchMeteredSize > this.maxQueuedBytes && !this.closed) {
          await new Promise((resolve) => {
            this.waitingForCapacity.push(resolve);
          });
        }
        if (this.closed) {
          throw new S2Error({ message: "AppendSession is closed" });
        }
        await this.sendBatchNonBlocking(recordsArray, chunk, batchMeteredSize);
      }, "write"),
      close: /* @__PURE__ */ __name(async () => {
        this.closed = true;
        await this.closeStream();
      }, "close"),
      abort: /* @__PURE__ */ __name(async (reason) => {
        this.closed = true;
        this.queuedBytes = 0;
        const error = new S2Error({
          message: `AppendSession was aborted: ${reason}`
        });
        for (const pending of this.pendingAcks) {
          pending.reject(error);
        }
        this.pendingAcks = [];
        for (const resolver of this.waitingForCapacity) {
          resolver();
        }
        this.waitingForCapacity = [];
        if (this.http2Stream && !this.http2Stream.closed) {
          this.http2Stream.close();
        }
      }, "abort")
    });
    this.writable = this._writable;
  }
  async initializeStream() {
    const url = new URL(this.baseUrl);
    const connection = await this.getConnection();
    const path = `${url.pathname}/streams/${encodeURIComponent(this.streamName)}/records`;
    const stream = connection.request({
      ":method": "POST",
      ":path": path,
      ":scheme": url.protocol.slice(0, -1),
      ":authority": url.host,
      authorization: `Bearer ${value(this.authToken)}`,
      "content-type": "s2s/proto",
      accept: "application/protobuf"
    });
    this.http2Stream = stream;
    this.options?.signal?.addEventListener("abort", () => {
      if (!stream.closed) {
        stream.close();
      }
    });
    const textDecoder = new TextDecoder();
    let controllerClosed = false;
    const safeClose = /* @__PURE__ */ __name(() => {
      if (!controllerClosed && this.acksController) {
        controllerClosed = true;
        try {
          this.acksController.close();
        } catch {
        }
      }
    }, "safeClose");
    const safeError = /* @__PURE__ */ __name((err) => {
      if (!controllerClosed && this.acksController) {
        controllerClosed = true;
        this.acksController.error(err);
      }
      for (const pending of this.pendingAcks) {
        pending.reject(err);
      }
      this.pendingAcks = [];
    }, "safeError");
    stream.on("data", (chunk) => {
      this.parser.push(chunk);
      let frame = this.parser.parseFrame();
      while (frame) {
        if (frame.terminal) {
          if (frame.statusCode && frame.statusCode >= 400) {
            const errorText = textDecoder.decode(frame.body);
            try {
              const errorJson = JSON.parse(errorText);
              safeError(new S2Error({
                message: errorJson.message ?? "Unknown error",
                code: errorJson.code,
                status: frame.statusCode
              }));
            } catch {
              safeError(new S2Error({
                message: errorText || "Unknown error",
                status: frame.statusCode
              }));
            }
          } else {
            safeClose();
          }
          stream.close();
        } else {
          try {
            const protoAck = AppendAck.fromBinary(frame.body);
            const ack = convertAppendAck(protoAck);
            this._lastAckedPosition = ack;
            if (this.acksController) {
              this.acksController.enqueue(ack);
            }
            const pending = this.pendingAcks.shift();
            if (pending) {
              pending.resolve(ack);
              this.queuedBytes -= pending.batchSize;
              if (this.waitingForCapacity.length > 0) {
                const waiter = this.waitingForCapacity.shift();
                waiter();
              }
            }
          } catch (err) {
            safeError(new S2Error({
              message: `Failed to parse AppendAck: ${err}`
            }));
          }
        }
        frame = this.parser.parseFrame();
      }
    });
    stream.on("error", (err) => {
      safeError(err);
    });
    stream.on("close", () => {
      safeClose();
    });
  }
  /**
   * Send a batch non-blocking (returns when frame is sent, not when ack is received)
   */
  sendBatchNonBlocking(records, args, batchMeteredSize) {
    if (!this.http2Stream || this.http2Stream.closed) {
      return Promise.reject(new S2Error({ message: "HTTP/2 stream is not open" }));
    }
    const textEncoder = new TextEncoder();
    const protoInput = AppendInput.create({
      records: records.map((record) => {
        let headersArray;
        if (record.headers) {
          if (Array.isArray(record.headers)) {
            headersArray = record.headers;
          } else {
            headersArray = Object.entries(record.headers);
          }
        }
        return {
          timestamp: record.timestamp ? BigInt(record.timestamp) : void 0,
          headers: headersArray?.map((h) => ({
            name: typeof h[0] === "string" ? textEncoder.encode(h[0]) : h[0],
            value: typeof h[1] === "string" ? textEncoder.encode(h[1]) : h[1]
          })),
          body: typeof record.body === "string" ? textEncoder.encode(record.body) : record.body
        };
      }),
      fencingToken: args.fencing_token ?? void 0,
      matchSeqNum: args.match_seq_num ? BigInt(args.match_seq_num) : void 0
    });
    const bodyBytes = AppendInput.toBinary(protoInput);
    const frame = frameMessage({
      terminal: false,
      body: bodyBytes
    });
    return new Promise((resolve, reject) => {
      const ackPromise = {
        resolve: /* @__PURE__ */ __name(() => {
        }, "resolve"),
        reject,
        batchSize: batchMeteredSize
      };
      this.pendingAcks.push(ackPromise);
      this.queuedBytes += batchMeteredSize;
      this.http2Stream.write(frame, (err) => {
        if (err) {
          const idx = this.pendingAcks.indexOf(ackPromise);
          if (idx !== -1) {
            this.pendingAcks.splice(idx, 1);
            this.queuedBytes -= batchMeteredSize;
          }
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  /**
   * Send a batch and wait for ack (used by submit method)
   */
  sendBatch(records, args, batchMeteredSize) {
    if (!this.http2Stream || this.http2Stream.closed) {
      return Promise.reject(new S2Error({ message: "HTTP/2 stream is not open" }));
    }
    const textEncoder = new TextEncoder();
    const protoInput = AppendInput.create({
      records: records.map((record) => {
        let headersArray;
        if (record.headers) {
          if (Array.isArray(record.headers)) {
            headersArray = record.headers;
          } else {
            headersArray = Object.entries(record.headers);
          }
        }
        return {
          timestamp: record.timestamp ? BigInt(record.timestamp) : void 0,
          headers: headersArray?.map((h) => ({
            name: typeof h[0] === "string" ? textEncoder.encode(h[0]) : h[0],
            value: typeof h[1] === "string" ? textEncoder.encode(h[1]) : h[1]
          })),
          body: typeof record.body === "string" ? textEncoder.encode(record.body) : record.body
        };
      }),
      fencingToken: args.fencing_token ?? void 0,
      matchSeqNum: args.match_seq_num ? BigInt(args.match_seq_num) : void 0
    });
    const bodyBytes = AppendInput.toBinary(protoInput);
    const frame = frameMessage({
      terminal: false,
      body: bodyBytes
    });
    return new Promise((resolve, reject) => {
      this.pendingAcks.push({
        resolve,
        reject,
        batchSize: batchMeteredSize
      });
      this.queuedBytes += batchMeteredSize;
      this.http2Stream.write(frame, (err) => {
        if (err) {
          const idx = this.pendingAcks.findIndex((p) => p.reject === reject);
          if (idx !== -1) {
            this.pendingAcks.splice(idx, 1);
            this.queuedBytes -= batchMeteredSize;
          }
          reject(err);
        }
      });
    });
  }
  async closeStream() {
    while (this.pendingAcks.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (this.http2Stream && !this.http2Stream.closed) {
      this.http2Stream.end();
    }
  }
  async [Symbol.asyncDispose]() {
    await this.close();
  }
  /**
   * Get a stream of acknowledgements for appends.
   */
  acks() {
    return this._readable;
  }
  /**
   * Close the append session.
   * Waits for all pending appends to complete before resolving.
   */
  async close() {
    await this.writable.close();
  }
  /**
   * Submit an append request to the session.
   * Returns a promise that resolves with the ack when received.
   */
  async submit(records, args) {
    if (this.closed) {
      return Promise.reject(new S2Error({ message: "AppendSession is closed" }));
    }
    if (this.initPromise) {
      await this.initPromise;
    }
    const recordsArray = Array.isArray(records) ? records : [records];
    if (recordsArray.length > 1e3) {
      return Promise.reject(new S2Error({
        message: `Batch of ${recordsArray.length} exceeds maximum batch size of 1000 records`
      }));
    }
    let batchMeteredSize = 0;
    for (const record of recordsArray) {
      batchMeteredSize += meteredSizeBytes(record);
    }
    if (batchMeteredSize > 1024 * 1024) {
      return Promise.reject(new S2Error({
        message: `Batch size ${batchMeteredSize} bytes exceeds maximum of 1 MiB (1048576 bytes)`
      }));
    }
    return this.sendBatch(recordsArray, {
      records: recordsArray,
      fencing_token: args?.fencing_token,
      match_seq_num: args?.match_seq_num
    }, batchMeteredSize);
  }
  lastAckedPosition() {
    return this._lastAckedPosition;
  }
};
function convertStreamPosition(proto) {
  return {
    seq_num: Number(proto.seqNum),
    timestamp: Number(proto.timestamp)
  };
}
__name(convertStreamPosition, "convertStreamPosition");
function convertAppendAck(proto) {
  if (!proto.start || !proto.end || !proto.tail) {
    throw new Error("Invariant violation: AppendAck is missing required fields");
  }
  return {
    start: convertStreamPosition(proto.start),
    end: convertStreamPosition(proto.end),
    tail: convertStreamPosition(proto.tail)
  };
}
__name(convertAppendAck, "convertAppendAck");
export {
  S2STransport
};
//# sourceMappingURL=s2s-JFEOHMO4.mjs.map
