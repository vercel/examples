import { AssertionError, CallTracker, strict, fail, ok, throws, rejects, doesNotThrow, doesNotReject, ifError, match, doesNotMatch, notDeepStrictEqual, notDeepStrictEqual as notDeepEqual, strictEqual, strictEqual as equal, notStrictEqual, notStrictEqual as notEqual, deepStrictEqual, deepStrictEqual as deepEqual, partialDeepStrictEqual } from "../assert.mjs";
export { AssertionError, CallTracker, strict, fail, ok, throws, rejects, doesNotThrow, doesNotReject, ifError, match, doesNotMatch, notDeepStrictEqual, notDeepStrictEqual as notDeepEqual, strictEqual, strictEqual as equal, notStrictEqual, notStrictEqual as notEqual, deepStrictEqual, deepStrictEqual as deepEqual, partialDeepStrictEqual } from "../assert.mjs";
export default Object.assign(ok, {
	AssertionError,
	CallTracker,
	strict,
	fail,
	ok,
	throws,
	rejects,
	doesNotThrow,
	doesNotReject,
	ifError,
	match,
	doesNotMatch,
	notDeepStrictEqual,
	notDeepEqual,
	strictEqual,
	equal,
	notStrictEqual,
	notEqual,
	deepStrictEqual,
	deepEqual,
	partialDeepStrictEqual
});
