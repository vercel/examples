import type nodeAssert from "node:assert";
export { AssertionError, CallTracker, strict, fail, ok, throws, rejects, doesNotThrow, doesNotReject, ifError, match, doesNotMatch, notDeepStrictEqual, notDeepStrictEqual as notDeepEqual, strictEqual, strictEqual as equal, notStrictEqual, notStrictEqual as notEqual, deepStrictEqual, deepStrictEqual as deepEqual, partialDeepStrictEqual } from "../assert.mjs";
declare const _default: typeof nodeAssert.strict;
export default _default;
