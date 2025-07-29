// @ts-nocheck
// Source: https://github.com/beatgammit/base64-js/blob/88957c9943c7e2a0f03cdf73e71d579e433627d3/index.js
const lookup = [];
const revLookup = [];
const Arr = typeof Uint8Array === "undefined" ? Array : Uint8Array;
const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (let i = 0, len = code.length; i < len; ++i) {
	lookup[i] = code[i];
	revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
	const len = b64.length;
	if (len % 4 > 0) {
		throw new Error("Invalid string. Length must be a multiple of 4");
	}
	// Trim off extra bytes after placeholder bytes are found
	// See: https://github.com/beatgammit/base64-js/issues/42
	let validLen = b64.indexOf("=");
	if (validLen === -1) {
		validLen = len;
	}
	const placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
	return [validLen, placeHoldersLen];
}
// base64 is 4/3 + up to two characters of the original data
export function byteLength(b64) {
	const lens = getLens(b64);
	const validLen = lens[0];
	const placeHoldersLen = lens[1];
	return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
	return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
export function toByteArray(b64) {
	let tmp;
	const lens = getLens(b64);
	const validLen = lens[0];
	const placeHoldersLen = lens[1];
	const arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
	let curByte = 0;
	// if there are placeholders, only get up to the last complete 4 chars
	const len = placeHoldersLen > 0 ? validLen - 4 : validLen;
	let i;
	for (i = 0; i < len; i += 4) {
		tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
		arr[curByte++] = tmp >> 16 & 255;
		arr[curByte++] = tmp >> 8 & 255;
		arr[curByte++] = tmp & 255;
	}
	if (placeHoldersLen === 2) {
		tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
		arr[curByte++] = tmp & 255;
	}
	if (placeHoldersLen === 1) {
		tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
		arr[curByte++] = tmp >> 8 & 255;
		arr[curByte++] = tmp & 255;
	}
	return arr;
}
function tripletToBase64(num) {
	return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
	let tmp;
	const output = [];
	for (let i = start; i < end; i += 3) {
		tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
		output.push(tripletToBase64(tmp));
	}
	return output.join("");
}
export function fromByteArray(uint8) {
	let tmp;
	const len = uint8.length;
	const extraBytes = len % 3;
	const parts = [];
	const maxChunkLength = 16383;
	// go through the array every three bytes, we'll deal with trailing stuff later
	for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
		parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
	}
	// pad the end with zeros, but make sure to not forget the extra bytes
	if (extraBytes === 1) {
		tmp = uint8[len - 1];
		parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
	} else if (extraBytes === 2) {
		tmp = (uint8[len - 2] << 8) + uint8[len - 1];
		parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
	}
	return parts.join("");
}
