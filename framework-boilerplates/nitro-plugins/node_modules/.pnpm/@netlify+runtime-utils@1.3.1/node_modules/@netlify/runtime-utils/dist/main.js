// src/lib/base64.ts
var base64Decode = globalThis.Buffer ? (input) => Buffer.from(input, "base64").toString() : (input) => atob(input);
var base64Encode = globalThis.Buffer ? (input) => Buffer.from(input).toString("base64") : (input) => btoa(input);
export {
  base64Decode,
  base64Encode
};
