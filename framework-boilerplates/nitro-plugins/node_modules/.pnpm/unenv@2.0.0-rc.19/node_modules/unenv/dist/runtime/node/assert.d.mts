// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
// Copyright Node.js contributors. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Based on Node.js' assert module
// https://github.com/nodejs/node/blob/0db95d371274104a5acf09214bf8325c45bfb64a/lib/assert.js
import type nodeAssert from "node:assert";
export declare class AssertionError extends Error implements nodeAssert.AssertionError {
	actual: unknown;
	expected: unknown;
	operator: string;
	generatedMessage: boolean;
	code: "ERR_ASSERTION";
	constructor(options: {
		message?: string;
		actual?: unknown;
		expected?: unknown;
		operator?: string;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		stackStartFn?: Function;
	});
}
// All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided. All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.
// ----------------------------------------------------------------------------
// Assertions
// ----------------------------------------------------------------------------
/**
* Pure assertion tests whether a value is truthy, as determined
* by !!value.
* @param {...any} args
* @returns {void}
*/
export declare function ok(...args: unknown[]);
/**
* The equality assertion tests shallow, coercive equality with ==.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function equal(actual: unknown, expected: unknown, message?: string | Error): void;
/**
* The non-equality assertion tests for whether two objects are not
* equal with !=.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function notEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* The deep equivalence assertion tests a deep equality relation.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function deepEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* The deep non-equivalence assertion tests for any deep inequality.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function notDeepEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* The deep strict equivalence assertion tests a deep strict equality
* relation.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function deepStrictEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* The deep strict non-equivalence assertion tests for any deep strict
* inequality.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function notDeepStrictEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* The strict equivalence assertion tests a strict equality relation.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function strictEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* The strict non-equivalence assertion tests for any strict inequality.
* @param {any} actual
* @param {any} expected
* @param {string | Error} [message]
* @returns {void}
*/
export declare function notStrictEqual(actual: unknown, expected: unknown, message?: string | Error);
/**
* Expects the function `promiseFn` to throw an error.
*/
export declare function throws(promiseFn: () => any, ...args: unknown[]): void;
/**
* Expects `promiseFn` function or its value to reject.
*/
export declare function rejects(promiseFn: (() => Promise<unknown>) | Promise<unknown>, ...args: unknown[]): Promise<void>;
/**
* Asserts that the function `fn` does not throw an error.
*/
export declare function doesNotThrow(fn: () => any, ...args: unknown[]): void;
/**
* Expects `fn` or its value to not reject.
*/
export declare function doesNotReject(fn: (() => Promise<unknown>) | Promise<unknown>, ...args: unknown[]): Promise<void>;
/**
* Throws `value` if the value is not `null` or `undefined`.
* @param {any} err
* @returns {void}
*/
export declare function ifError(err: unknown);
/**
* Expects the `string` input to match the regular expression.
* @param {string} string
* @param {RegExp} regexp
* @param {string | Error} [message]
* @returns {void}
*/
export declare function match(string: string, regexp: RegExp, message?: string | Error);
/**
* Expects the `string` input not to match the regular expression.
* @param {string} string
* @param {RegExp} regexp
* @param {string | Error} [message]
* @returns {void}
*/
export declare function doesNotMatch(string: string, regexp: RegExp, message?: string | Error);
export declare function fail(actual: unknown, expected?: unknown, message?: string | Error, operator?: string, stackStartFn?: Function): never;
// deprecated
export declare const CallTracker: typeof nodeAssert.CallTracker;
export declare const partialDeepStrictEqual: unknown;
export declare const strict: unknown;
declare const _default;
export default _default;
