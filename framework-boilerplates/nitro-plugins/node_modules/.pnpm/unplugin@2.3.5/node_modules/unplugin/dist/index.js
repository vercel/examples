import { normalizeObjectHook, parse, toArray } from "./context-D49cMElb.js";
import { normalizeAbsolutePath, transformUse } from "./webpack-like-CSbnjTNU.js";
import { createBuildContext$1 as createBuildContext, normalizeMessage$1 as normalizeMessage } from "./context-DY6ggBKV.js";
import { FakeVirtualModulesPlugin, decodeVirtualModuleId, encodeVirtualModuleId, isVirtualModuleId } from "./utils-Cbrj-Du4.js";
import { contextOptionsFromCompilation, createBuildContext as createBuildContext$1, normalizeMessage as normalizeMessage$1 } from "./context-BZKy5Nsn.js";
import fs from "node:fs";
import path, { extname, resolve } from "node:path";
import { Buffer as Buffer$1 } from "node:buffer";
import * as querystring from "node:querystring";
import { fileURLToPath } from "node:url";
import process$1 from "node:process";
import VirtualModulesPlugin from "webpack-virtual-modules";

//#region node_modules/.pnpm/@jridgewell+sourcemap-codec@1.5.0/node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
const comma = ",".charCodeAt(0);
const semicolon = ";".charCodeAt(0);
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const intToChar = new Uint8Array(64);
const charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
	const c = chars.charCodeAt(i);
	intToChar[i] = c;
	charToInt[c] = i;
}
function decodeInteger(reader, relative) {
	let value = 0;
	let shift = 0;
	let integer = 0;
	do {
		const c = reader.next();
		integer = charToInt[c];
		value |= (integer & 31) << shift;
		shift += 5;
	} while (integer & 32);
	const shouldNegate = value & 1;
	value >>>= 1;
	if (shouldNegate) value = -2147483648 | -value;
	return relative + value;
}
function encodeInteger(builder, num, relative) {
	let delta = num - relative;
	delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
	do {
		let clamped = delta & 31;
		delta >>>= 5;
		if (delta > 0) clamped |= 32;
		builder.write(intToChar[clamped]);
	} while (delta > 0);
	return num;
}
function hasMoreVlq(reader, max) {
	if (reader.pos >= max) return false;
	return reader.peek() !== comma;
}
const bufLength = 1024 * 16;
const td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? { decode(buf) {
	const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
	return out.toString();
} } : { decode(buf) {
	let out = "";
	for (let i = 0; i < buf.length; i++) out += String.fromCharCode(buf[i]);
	return out;
} };
var StringWriter = class {
	constructor() {
		this.pos = 0;
		this.out = "";
		this.buffer = new Uint8Array(bufLength);
	}
	write(v) {
		const { buffer } = this;
		buffer[this.pos++] = v;
		if (this.pos === bufLength) {
			this.out += td.decode(buffer);
			this.pos = 0;
		}
	}
	flush() {
		const { buffer, out, pos } = this;
		return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
	}
};
var StringReader = class {
	constructor(buffer) {
		this.pos = 0;
		this.buffer = buffer;
	}
	next() {
		return this.buffer.charCodeAt(this.pos++);
	}
	peek() {
		return this.buffer.charCodeAt(this.pos);
	}
	indexOf(char) {
		const { buffer, pos } = this;
		const idx = buffer.indexOf(char, pos);
		return idx === -1 ? buffer.length : idx;
	}
};
function decode(mappings) {
	const { length } = mappings;
	const reader = new StringReader(mappings);
	const decoded = [];
	let genColumn = 0;
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	do {
		const semi = reader.indexOf(";");
		const line = [];
		let sorted = true;
		let lastCol = 0;
		genColumn = 0;
		while (reader.pos < semi) {
			let seg;
			genColumn = decodeInteger(reader, genColumn);
			if (genColumn < lastCol) sorted = false;
			lastCol = genColumn;
			if (hasMoreVlq(reader, semi)) {
				sourcesIndex = decodeInteger(reader, sourcesIndex);
				sourceLine = decodeInteger(reader, sourceLine);
				sourceColumn = decodeInteger(reader, sourceColumn);
				if (hasMoreVlq(reader, semi)) {
					namesIndex = decodeInteger(reader, namesIndex);
					seg = [
						genColumn,
						sourcesIndex,
						sourceLine,
						sourceColumn,
						namesIndex
					];
				} else seg = [
					genColumn,
					sourcesIndex,
					sourceLine,
					sourceColumn
				];
			} else seg = [genColumn];
			line.push(seg);
			reader.pos++;
		}
		if (!sorted) sort(line);
		decoded.push(line);
		reader.pos = semi + 1;
	} while (reader.pos <= length);
	return decoded;
}
function sort(line) {
	line.sort(sortComparator$1);
}
function sortComparator$1(a, b) {
	return a[0] - b[0];
}
function encode(decoded) {
	const writer = new StringWriter();
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	for (let i = 0; i < decoded.length; i++) {
		const line = decoded[i];
		if (i > 0) writer.write(semicolon);
		if (line.length === 0) continue;
		let genColumn = 0;
		for (let j = 0; j < line.length; j++) {
			const segment = line[j];
			if (j > 0) writer.write(comma);
			genColumn = encodeInteger(writer, segment[0], genColumn);
			if (segment.length === 1) continue;
			sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
			sourceLine = encodeInteger(writer, segment[2], sourceLine);
			sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
			if (segment.length === 4) continue;
			namesIndex = encodeInteger(writer, segment[4], namesIndex);
		}
	}
	return writer.flush();
}

//#endregion
//#region node_modules/.pnpm/@jridgewell+resolve-uri@3.1.2/node_modules/@jridgewell/resolve-uri/dist/resolve-uri.mjs
const schemeRegex = /^[\w+.-]+:\/\//;
/**
* Matches the parts of a URL:
* 1. Scheme, including ":", guaranteed.
* 2. User/password, including "@", optional.
* 3. Host, guaranteed.
* 4. Port, including ":", optional.
* 5. Path, including "/", optional.
* 6. Query, including "?", optional.
* 7. Hash, including "#", optional.
*/
const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
/**
* File URLs are weird. They dont' need the regular `//` in the scheme, they may or may not start
* with a leading `/`, they can have a domain (but only if they don't start with a Windows drive).
*
* 1. Host, optional.
* 2. Path, which may include "/", guaranteed.
* 3. Query, including "?", optional.
* 4. Hash, including "#", optional.
*/
const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
function isAbsoluteUrl(input) {
	return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
	return input.startsWith("//");
}
function isAbsolutePath(input) {
	return input.startsWith("/");
}
function isFileUrl(input) {
	return input.startsWith("file:");
}
function isRelative(input) {
	return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
	const match = urlRegex.exec(input);
	return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
}
function parseFileUrl(input) {
	const match = fileRegex.exec(input);
	const path$1 = match[2];
	return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path$1) ? path$1 : "/" + path$1, match[3] || "", match[4] || "");
}
function makeUrl(scheme, user, host, port, path$1, query, hash) {
	return {
		scheme,
		user,
		host,
		port,
		path: path$1,
		query,
		hash,
		type: 7
	};
}
function parseUrl(input) {
	if (isSchemeRelativeUrl(input)) {
		const url$1 = parseAbsoluteUrl("http:" + input);
		url$1.scheme = "";
		url$1.type = 6;
		return url$1;
	}
	if (isAbsolutePath(input)) {
		const url$1 = parseAbsoluteUrl("http://foo.com" + input);
		url$1.scheme = "";
		url$1.host = "";
		url$1.type = 5;
		return url$1;
	}
	if (isFileUrl(input)) return parseFileUrl(input);
	if (isAbsoluteUrl(input)) return parseAbsoluteUrl(input);
	const url = parseAbsoluteUrl("http://foo.com/" + input);
	url.scheme = "";
	url.host = "";
	url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
	return url;
}
function stripPathFilename(path$1) {
	if (path$1.endsWith("/..")) return path$1;
	const index = path$1.lastIndexOf("/");
	return path$1.slice(0, index + 1);
}
function mergePaths(url, base) {
	normalizePath(base, base.type);
	if (url.path === "/") url.path = base.path;
	else url.path = stripPathFilename(base.path) + url.path;
}
/**
* The path can have empty directories "//", unneeded parents "foo/..", or current directory
* "foo/.". We need to normalize to a standard representation.
*/
function normalizePath(url, type) {
	const rel = type <= 4;
	const pieces = url.path.split("/");
	let pointer = 1;
	let positive = 0;
	let addTrailingSlash = false;
	for (let i = 1; i < pieces.length; i++) {
		const piece = pieces[i];
		if (!piece) {
			addTrailingSlash = true;
			continue;
		}
		addTrailingSlash = false;
		if (piece === ".") continue;
		if (piece === "..") {
			if (positive) {
				addTrailingSlash = true;
				positive--;
				pointer--;
			} else if (rel) pieces[pointer++] = piece;
			continue;
		}
		pieces[pointer++] = piece;
		positive++;
	}
	let path$1 = "";
	for (let i = 1; i < pointer; i++) path$1 += "/" + pieces[i];
	if (!path$1 || addTrailingSlash && !path$1.endsWith("/..")) path$1 += "/";
	url.path = path$1;
}
/**
* Attempts to resolve `input` URL/path relative to `base`.
*/
function resolve$2(input, base) {
	if (!input && !base) return "";
	const url = parseUrl(input);
	let inputType = url.type;
	if (base && inputType !== 7) {
		const baseUrl = parseUrl(base);
		const baseType = baseUrl.type;
		switch (inputType) {
			case 1: url.hash = baseUrl.hash;
			case 2: url.query = baseUrl.query;
			case 3:
			case 4: mergePaths(url, baseUrl);
			case 5:
				url.user = baseUrl.user;
				url.host = baseUrl.host;
				url.port = baseUrl.port;
			case 6: url.scheme = baseUrl.scheme;
		}
		if (baseType > inputType) inputType = baseType;
	}
	normalizePath(url, inputType);
	const queryHash = url.query + url.hash;
	switch (inputType) {
		case 2:
		case 3: return queryHash;
		case 4: {
			const path$1 = url.path.slice(1);
			if (!path$1) return queryHash || ".";
			if (isRelative(base || input) && !isRelative(path$1)) return "./" + path$1 + queryHash;
			return path$1 + queryHash;
		}
		case 5: return url.path + queryHash;
		default: return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
	}
}

//#endregion
//#region node_modules/.pnpm/@jridgewell+trace-mapping@0.3.25/node_modules/@jridgewell/trace-mapping/dist/trace-mapping.mjs
function resolve$1(input, base) {
	if (base && !base.endsWith("/")) base += "/";
	return resolve$2(input, base);
}
/**
* Removes everything after the last "/", but leaves the slash.
*/
function stripFilename(path$1) {
	if (!path$1) return "";
	const index = path$1.lastIndexOf("/");
	return path$1.slice(0, index + 1);
}
const COLUMN$1 = 0;
function maybeSort(mappings, owned) {
	const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
	if (unsortedIndex === mappings.length) return mappings;
	if (!owned) mappings = mappings.slice();
	for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) mappings[i] = sortSegments(mappings[i], owned);
	return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
	for (let i = start; i < mappings.length; i++) if (!isSorted(mappings[i])) return i;
	return mappings.length;
}
function isSorted(line) {
	for (let j = 1; j < line.length; j++) if (line[j][COLUMN$1] < line[j - 1][COLUMN$1]) return false;
	return true;
}
function sortSegments(line, owned) {
	if (!owned) line = line.slice();
	return line.sort(sortComparator);
}
function sortComparator(a, b) {
	return a[COLUMN$1] - b[COLUMN$1];
}
let found = false;
/**
* A binary search implementation that returns the index if a match is found.
* If no match is found, then the left-index (the index associated with the item that comes just
* before the desired index) is returned. To maintain proper sort order, a splice would happen at
* the next index:
*
* ```js
* const array = [1, 3];
* const needle = 2;
* const index = binarySearch(array, needle, (item, needle) => item - needle);
*
* assert.equal(index, 0);
* array.splice(index + 1, 0, needle);
* assert.deepEqual(array, [1, 2, 3]);
* ```
*/
function binarySearch(haystack, needle, low, high) {
	while (low <= high) {
		const mid = low + (high - low >> 1);
		const cmp = haystack[mid][COLUMN$1] - needle;
		if (cmp === 0) {
			found = true;
			return mid;
		}
		if (cmp < 0) low = mid + 1;
		else high = mid - 1;
	}
	found = false;
	return low - 1;
}
function upperBound(haystack, needle, index) {
	for (let i = index + 1; i < haystack.length; index = i++) if (haystack[i][COLUMN$1] !== needle) break;
	return index;
}
function lowerBound(haystack, needle, index) {
	for (let i = index - 1; i >= 0; index = i--) if (haystack[i][COLUMN$1] !== needle) break;
	return index;
}
function memoizedState() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
/**
* This overly complicated beast is just to record the last tested line/column and the resulting
* index, allowing us to skip a few tests if mappings are monotonically increasing.
*/
function memoizedBinarySearch(haystack, needle, state, key) {
	const { lastKey, lastNeedle, lastIndex } = state;
	let low = 0;
	let high = haystack.length - 1;
	if (key === lastKey) {
		if (needle === lastNeedle) {
			found = lastIndex !== -1 && haystack[lastIndex][COLUMN$1] === needle;
			return lastIndex;
		}
		if (needle >= lastNeedle) low = lastIndex === -1 ? 0 : lastIndex;
		else high = lastIndex;
	}
	state.lastKey = key;
	state.lastNeedle = needle;
	return state.lastIndex = binarySearch(haystack, needle, low, high);
}
const LEAST_UPPER_BOUND = -1;
const GREATEST_LOWER_BOUND = 1;
var TraceMap = class {
	constructor(map, mapUrl) {
		const isString$1 = typeof map === "string";
		if (!isString$1 && map._decodedMemo) return map;
		const parsed = isString$1 ? JSON.parse(map) : map;
		const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
		this.version = version;
		this.file = file;
		this.names = names || [];
		this.sourceRoot = sourceRoot;
		this.sources = sources;
		this.sourcesContent = sourcesContent;
		this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
		const from = resolve$1(sourceRoot || "", stripFilename(mapUrl));
		this.resolvedSources = sources.map((s) => resolve$1(s || "", from));
		const { mappings } = parsed;
		if (typeof mappings === "string") {
			this._encoded = mappings;
			this._decoded = void 0;
		} else {
			this._encoded = void 0;
			this._decoded = maybeSort(mappings, isString$1);
		}
		this._decodedMemo = memoizedState();
		this._bySources = void 0;
		this._bySourceMemos = void 0;
	}
};
/**
* Typescript doesn't allow friend access to private fields, so this just casts the map into a type
* with public access modifiers.
*/
function cast$2(map) {
	return map;
}
/**
* Returns the decoded (array of lines of segments) form of the SourceMap's mappings field.
*/
function decodedMappings(map) {
	var _a;
	return (_a = cast$2(map))._decoded || (_a._decoded = decode(cast$2(map)._encoded));
}
/**
* A low-level API to find the segment associated with a generated line/column (think, from a
* stack trace). Line and column here are 0-based, unlike `originalPositionFor`.
*/
function traceSegment(map, line, column) {
	const decoded = decodedMappings(map);
	if (line >= decoded.length) return null;
	const segments = decoded[line];
	const index = traceSegmentInternal(segments, cast$2(map)._decodedMemo, line, column, GREATEST_LOWER_BOUND);
	return index === -1 ? null : segments[index];
}
function traceSegmentInternal(segments, memo, line, column, bias) {
	let index = memoizedBinarySearch(segments, column, memo, line);
	if (found) index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
	else if (bias === LEAST_UPPER_BOUND) index++;
	if (index === -1 || index === segments.length) return -1;
	return index;
}

//#endregion
//#region node_modules/.pnpm/@jridgewell+set-array@1.2.1/node_modules/@jridgewell/set-array/dist/set-array.mjs
/**
* SetArray acts like a `Set` (allowing only one occurrence of a string `key`), but provides the
* index of the `key` in the backing array.
*
* This is designed to allow synchronizing a second array with the contents of the backing array,
* like how in a sourcemap `sourcesContent[i]` is the source content associated with `source[i]`,
* and there are never duplicates.
*/
var SetArray = class {
	constructor() {
		this._indexes = { __proto__: null };
		this.array = [];
	}
};
/**
* Typescript doesn't allow friend access to private fields, so this just casts the set into a type
* with public access modifiers.
*/
function cast$1(set) {
	return set;
}
/**
* Gets the index associated with `key` in the backing array, if it is already present.
*/
function get(setarr, key) {
	return cast$1(setarr)._indexes[key];
}
/**
* Puts `key` into the backing array, if it is not already present. Returns
* the index of the `key` in the backing array.
*/
function put(setarr, key) {
	const index = get(setarr, key);
	if (index !== void 0) return index;
	const { array, _indexes: indexes } = cast$1(setarr);
	const length = array.push(key);
	return indexes[key] = length - 1;
}
/**
* Removes the key, if it exists in the set.
*/
function remove(setarr, key) {
	const index = get(setarr, key);
	if (index === void 0) return;
	const { array, _indexes: indexes } = cast$1(setarr);
	for (let i = index + 1; i < array.length; i++) {
		const k = array[i];
		array[i - 1] = k;
		indexes[k]--;
	}
	indexes[key] = void 0;
	array.pop();
}

//#endregion
//#region node_modules/.pnpm/@jridgewell+gen-mapping@0.3.8/node_modules/@jridgewell/gen-mapping/dist/gen-mapping.mjs
const COLUMN = 0;
const SOURCES_INDEX = 1;
const SOURCE_LINE = 2;
const SOURCE_COLUMN = 3;
const NAMES_INDEX = 4;
const NO_NAME = -1;
/**
* Provides the state to generate a sourcemap.
*/
var GenMapping = class {
	constructor({ file, sourceRoot } = {}) {
		this._names = new SetArray();
		this._sources = new SetArray();
		this._sourcesContent = [];
		this._mappings = [];
		this.file = file;
		this.sourceRoot = sourceRoot;
		this._ignoreList = new SetArray();
	}
};
/**
* Typescript doesn't allow friend access to private fields, so this just casts the map into a type
* with public access modifiers.
*/
function cast(map) {
	return map;
}
/**
* Same as `addSegment`, but will only add the segment if it generates useful information in the
* resulting map. This only works correctly if segments are added **in order**, meaning you should
* not add a segment with a lower generated line/column than one that came before.
*/
const maybeAddSegment = (map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
	return addSegmentInternal(true, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content);
};
/**
* Adds/removes the content of the source file to the source map.
*/
function setSourceContent(map, source, content) {
	const { _sources: sources, _sourcesContent: sourcesContent } = cast(map);
	const index = put(sources, source);
	sourcesContent[index] = content;
}
function setIgnore(map, source, ignore = true) {
	const { _sources: sources, _sourcesContent: sourcesContent, _ignoreList: ignoreList } = cast(map);
	const index = put(sources, source);
	if (index === sourcesContent.length) sourcesContent[index] = null;
	if (ignore) put(ignoreList, index);
	else remove(ignoreList, index);
}
/**
* Returns a sourcemap object (with decoded mappings) suitable for passing to a library that expects
* a sourcemap, or to JSON.stringify.
*/
function toDecodedMap(map) {
	const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names, _ignoreList: ignoreList } = cast(map);
	removeEmptyFinalLines(mappings);
	return {
		version: 3,
		file: map.file || void 0,
		names: names.array,
		sourceRoot: map.sourceRoot || void 0,
		sources: sources.array,
		sourcesContent,
		mappings,
		ignoreList: ignoreList.array
	};
}
/**
* Returns a sourcemap object (with encoded mappings) suitable for passing to a library that expects
* a sourcemap, or to JSON.stringify.
*/
function toEncodedMap(map) {
	const decoded = toDecodedMap(map);
	return Object.assign(Object.assign({}, decoded), { mappings: encode(decoded.mappings) });
}
function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
	const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names } = cast(map);
	const line = getLine(mappings, genLine);
	const index = getColumnIndex(line, genColumn);
	if (!source) {
		if (skipable && skipSourceless(line, index)) return;
		return insert(line, index, [genColumn]);
	}
	const sourcesIndex = put(sources, source);
	const namesIndex = name ? put(names, name) : NO_NAME;
	if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = content !== null && content !== void 0 ? content : null;
	if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) return;
	return insert(line, index, name ? [
		genColumn,
		sourcesIndex,
		sourceLine,
		sourceColumn,
		namesIndex
	] : [
		genColumn,
		sourcesIndex,
		sourceLine,
		sourceColumn
	]);
}
function getLine(mappings, index) {
	for (let i = mappings.length; i <= index; i++) mappings[i] = [];
	return mappings[index];
}
function getColumnIndex(line, genColumn) {
	let index = line.length;
	for (let i = index - 1; i >= 0; index = i--) {
		const current = line[i];
		if (genColumn >= current[COLUMN]) break;
	}
	return index;
}
function insert(array, index, value) {
	for (let i = array.length; i > index; i--) array[i] = array[i - 1];
	array[index] = value;
}
function removeEmptyFinalLines(mappings) {
	const { length } = mappings;
	let len = length;
	for (let i = len - 1; i >= 0; len = i, i--) if (mappings[i].length > 0) break;
	if (len < length) mappings.length = len;
}
function skipSourceless(line, index) {
	if (index === 0) return true;
	const prev = line[index - 1];
	return prev.length === 1;
}
function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
	if (index === 0) return false;
	const prev = line[index - 1];
	if (prev.length === 1) return false;
	return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
}

//#endregion
//#region node_modules/.pnpm/@ampproject+remapping@2.3.0/node_modules/@ampproject/remapping/dist/remapping.mjs
const SOURCELESS_MAPPING = /* @__PURE__ */ SegmentObject("", -1, -1, "", null, false);
const EMPTY_SOURCES = [];
function SegmentObject(source, line, column, name, content, ignore) {
	return {
		source,
		line,
		column,
		name,
		content,
		ignore
	};
}
function Source(map, sources, source, content, ignore) {
	return {
		map,
		sources,
		source,
		content,
		ignore
	};
}
/**
* MapSource represents a single sourcemap, with the ability to trace mappings into its child nodes
* (which may themselves be SourceMapTrees).
*/
function MapSource(map, sources) {
	return Source(map, sources, "", null, false);
}
/**
* A "leaf" node in the sourcemap tree, representing an original, unmodified source file. Recursive
* segment tracing ends at the `OriginalSource`.
*/
function OriginalSource(source, content, ignore) {
	return Source(null, EMPTY_SOURCES, source, content, ignore);
}
/**
* traceMappings is only called on the root level SourceMapTree, and begins the process of
* resolving each mapping in terms of the original source files.
*/
function traceMappings(tree) {
	const gen = new GenMapping({ file: tree.map.file });
	const { sources: rootSources, map } = tree;
	const rootNames = map.names;
	const rootMappings = decodedMappings(map);
	for (let i = 0; i < rootMappings.length; i++) {
		const segments = rootMappings[i];
		for (let j = 0; j < segments.length; j++) {
			const segment = segments[j];
			const genCol = segment[0];
			let traced = SOURCELESS_MAPPING;
			if (segment.length !== 1) {
				const source$1 = rootSources[segment[1]];
				traced = originalPositionFor(source$1, segment[2], segment[3], segment.length === 5 ? rootNames[segment[4]] : "");
				if (traced == null) continue;
			}
			const { column, line, name, content, source, ignore } = traced;
			maybeAddSegment(gen, i, genCol, source, line, column, name);
			if (source && content != null) setSourceContent(gen, source, content);
			if (ignore) setIgnore(gen, source, true);
		}
	}
	return gen;
}
/**
* originalPositionFor is only called on children SourceMapTrees. It recurses down into its own
* child SourceMapTrees, until we find the original source map.
*/
function originalPositionFor(source, line, column, name) {
	if (!source.map) return SegmentObject(source.source, line, column, name, source.content, source.ignore);
	const segment = traceSegment(source.map, line, column);
	if (segment == null) return null;
	if (segment.length === 1) return SOURCELESS_MAPPING;
	return originalPositionFor(source.sources[segment[1]], segment[2], segment[3], segment.length === 5 ? source.map.names[segment[4]] : name);
}
function asArray(value) {
	if (Array.isArray(value)) return value;
	return [value];
}
/**
* Recursively builds a tree structure out of sourcemap files, with each node
* being either an `OriginalSource` "leaf" or a `SourceMapTree` composed of
* `OriginalSource`s and `SourceMapTree`s.
*
* Every sourcemap is composed of a collection of source files and mappings
* into locations of those source files. When we generate a `SourceMapTree` for
* the sourcemap, we attempt to load each source file's own sourcemap. If it
* does not have an associated sourcemap, it is considered an original,
* unmodified source file.
*/
function buildSourceMapTree(input, loader) {
	const maps = asArray(input).map((m) => new TraceMap(m, ""));
	const map = maps.pop();
	for (let i = 0; i < maps.length; i++) if (maps[i].sources.length > 1) throw new Error(`Transformation map ${i} must have exactly one source file.\nDid you specify these with the most recent transformation maps first?`);
	let tree = build(map, loader, "", 0);
	for (let i = maps.length - 1; i >= 0; i--) tree = MapSource(maps[i], [tree]);
	return tree;
}
function build(map, loader, importer, importerDepth) {
	const { resolvedSources, sourcesContent, ignoreList } = map;
	const depth = importerDepth + 1;
	const children = resolvedSources.map((sourceFile, i) => {
		const ctx = {
			importer,
			depth,
			source: sourceFile || "",
			content: void 0,
			ignore: void 0
		};
		const sourceMap = loader(ctx.source, ctx);
		const { source, content, ignore } = ctx;
		if (sourceMap) return build(new TraceMap(sourceMap, source), loader, source, depth);
		const sourceContent = content !== void 0 ? content : sourcesContent ? sourcesContent[i] : null;
		const ignored = ignore !== void 0 ? ignore : ignoreList ? ignoreList.includes(i) : false;
		return OriginalSource(source, sourceContent, ignored);
	});
	return MapSource(map, children);
}
/**
* A SourceMap v3 compatible sourcemap, which only includes fields that were
* provided to it.
*/
var SourceMap = class {
	constructor(map, options) {
		const out = options.decodedMappings ? toDecodedMap(map) : toEncodedMap(map);
		this.version = out.version;
		this.file = out.file;
		this.mappings = out.mappings;
		this.names = out.names;
		this.ignoreList = out.ignoreList;
		this.sourceRoot = out.sourceRoot;
		this.sources = out.sources;
		if (!options.excludeContent) this.sourcesContent = out.sourcesContent;
	}
	toString() {
		return JSON.stringify(this);
	}
};
/**
* Traces through all the mappings in the root sourcemap, through the sources
* (and their sourcemaps), all the way back to the original source location.
*
* `loader` will be called every time we encounter a source file. If it returns
* a sourcemap, we will recurse into that sourcemap to continue the trace. If
* it returns a falsey value, that source file is treated as an original,
* unmodified source file.
*
* Pass `excludeContent` to exclude any self-containing source file content
* from the output sourcemap.
*
* Pass `decodedMappings` to receive a SourceMap with decoded (instead of
* VLQ encoded) mappings.
*/
function remapping(input, loader, options) {
	const opts = typeof options === "object" ? options : {
		excludeContent: !!options,
		decodedMappings: false
	};
	const tree = buildSourceMapTree(input, loader);
	return new SourceMap(traceMappings(tree), opts);
}

//#endregion
//#region src/esbuild/utils.ts
const ExtToLoader = {
	".js": "js",
	".mjs": "js",
	".cjs": "js",
	".jsx": "jsx",
	".ts": "ts",
	".cts": "ts",
	".mts": "ts",
	".tsx": "tsx",
	".css": "css",
	".less": "css",
	".stylus": "css",
	".scss": "css",
	".sass": "css",
	".json": "json",
	".txt": "text"
};
function guessLoader(code, id) {
	return ExtToLoader[path.extname(id).toLowerCase()] || "js";
}
function unwrapLoader(loader, code, id) {
	if (typeof loader === "function") return loader(code, id);
	return loader;
}
function fixSourceMap(map) {
	if (!Object.prototype.hasOwnProperty.call(map, "toString")) Object.defineProperty(map, "toString", {
		enumerable: false,
		value: function toString() {
			return JSON.stringify(this);
		}
	});
	if (!Object.prototype.hasOwnProperty.call(map, "toUrl")) Object.defineProperty(map, "toUrl", {
		enumerable: false,
		value: function toUrl() {
			return `data:application/json;charset=utf-8;base64,${Buffer$1.from(this.toString()).toString("base64")}`;
		}
	});
	return map;
}
const nullSourceMap = {
	names: [],
	sources: [],
	mappings: "",
	version: 3
};
function combineSourcemaps(filename, sourcemapList) {
	sourcemapList = sourcemapList.filter((m) => m.sources);
	if (sourcemapList.length === 0 || sourcemapList.every((m) => m.sources.length === 0)) return { ...nullSourceMap };
	let map;
	let mapIndex = 1;
	const useArrayInterface = sourcemapList.slice(0, -1).find((m) => m.sources.length !== 1) === void 0;
	if (useArrayInterface) map = remapping(sourcemapList, () => null, true);
	else map = remapping(sourcemapList[0], (sourcefile) => {
		if (sourcefile === filename && sourcemapList[mapIndex]) return sourcemapList[mapIndex++];
		else return { ...nullSourceMap };
	}, true);
	if (!map.file) delete map.file;
	return map;
}
function createBuildContext$2(build$1) {
	const watchFiles = [];
	const { initialOptions } = build$1;
	return {
		parse,
		addWatchFile() {
			throw new Error("unplugin/esbuild: addWatchFile outside supported hooks (resolveId, load, transform)");
		},
		emitFile(emittedFile) {
			const outFileName = emittedFile.fileName || emittedFile.name;
			if (initialOptions.outdir && emittedFile.source && outFileName) {
				const outPath = path.resolve(initialOptions.outdir, outFileName);
				const outDir = path.dirname(outPath);
				if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
				fs.writeFileSync(outPath, emittedFile.source);
			}
		},
		getWatchFiles() {
			return watchFiles;
		},
		getNativeBuildContext() {
			return {
				framework: "esbuild",
				build: build$1
			};
		}
	};
}
function createPluginContext(context) {
	const errors = [];
	const warnings = [];
	const pluginContext = {
		error(message) {
			errors.push(normalizeMessage$2(message));
		},
		warn(message) {
			warnings.push(normalizeMessage$2(message));
		}
	};
	const mixedContext = {
		...context,
		...pluginContext,
		addWatchFile(id) {
			context.getWatchFiles().push(id);
		}
	};
	return {
		errors,
		warnings,
		mixedContext
	};
}
function normalizeMessage$2(message) {
	if (typeof message === "string") message = { message };
	return {
		id: message.id,
		pluginName: message.plugin,
		text: message.message,
		location: message.loc ? {
			file: message.loc.file,
			line: message.loc.line,
			column: message.loc.column
		} : null,
		detail: message.meta,
		notes: []
	};
}
function processCodeWithSourceMap(map, code) {
	if (map) {
		if (!map.sourcesContent || map.sourcesContent.length === 0) map.sourcesContent = [code];
		map = fixSourceMap(map);
		code += `\n//# sourceMappingURL=${map.toUrl()}`;
	}
	return code;
}

//#endregion
//#region src/esbuild/index.ts
function getEsbuildPlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "esbuild" };
		const plugins = toArray(factory(userOptions, meta));
		const setupPlugins = async (build$1) => {
			const setup = buildSetup();
			const loaders = [];
			for (const plugin of plugins) {
				const loader = {};
				await setup(plugin)({
					...build$1,
					onLoad(_options, callback) {
						loader.options = _options;
						loader.onLoadCb = callback;
					},
					onTransform(_options, callback) {
						loader.options ||= _options;
						loader.onTransformCb = callback;
					}
				}, build$1);
				if (loader.onLoadCb || loader.onTransformCb) loaders.push(loader);
			}
			if (loaders.length) build$1.onLoad(loaders.length === 1 ? loaders[0].options : { filter: /.*/ }, async (args) => {
				function checkFilter(options) {
					return loaders.length === 1 || !options?.filter || options.filter.test(args.path);
				}
				let result;
				for (const { options, onLoadCb } of loaders) {
					if (!checkFilter(options)) continue;
					if (onLoadCb) result = await onLoadCb(args);
					if (result?.contents) break;
				}
				let fsContentsCache;
				for (const { options, onTransformCb } of loaders) {
					if (!checkFilter(options)) continue;
					if (onTransformCb) {
						const newArgs = {
							...result,
							...args,
							async getContents() {
								if (result?.contents) return result.contents;
								if (fsContentsCache) return fsContentsCache;
								return fsContentsCache = await fs.promises.readFile(args.path, "utf8");
							}
						};
						const _result = await onTransformCb(newArgs);
						if (_result?.contents) result = _result;
					}
				}
				if (result?.contents) return result;
			});
		};
		return {
			name: (plugins.length === 1 ? plugins[0].name : meta.esbuildHostName) ?? `unplugin-host:${plugins.map((p) => p.name).join(":")}`,
			setup: setupPlugins
		};
	};
}
function buildSetup() {
	return (plugin) => {
		return (build$1, rawBuild) => {
			const context = createBuildContext$2(rawBuild);
			const { onStart, onEnd, onResolve, onLoad, onTransform, initialOptions } = build$1;
			const onResolveFilter = plugin.esbuild?.onResolveFilter ?? /.*/;
			const onLoadFilter = plugin.esbuild?.onLoadFilter ?? /.*/;
			const loader = plugin.esbuild?.loader ?? guessLoader;
			plugin.esbuild?.config?.call(context, initialOptions);
			if (plugin.buildStart) onStart(() => plugin.buildStart.call(context));
			if (plugin.buildEnd || plugin.writeBundle) onEnd(async () => {
				if (plugin.buildEnd) await plugin.buildEnd.call(context);
				if (plugin.writeBundle) await plugin.writeBundle();
			});
			if (plugin.resolveId) onResolve({ filter: onResolveFilter }, async (args) => {
				const id = args.path;
				if (initialOptions.external?.includes(id)) return;
				const { handler, filter } = normalizeObjectHook("resolveId", plugin.resolveId);
				if (!filter(id)) return;
				const { errors, warnings, mixedContext } = createPluginContext(context);
				const isEntry = args.kind === "entry-point";
				const result = await handler.call(mixedContext, id, isEntry ? void 0 : args.importer, { isEntry });
				if (typeof result === "string") return {
					path: result,
					namespace: plugin.name,
					errors,
					warnings,
					watchFiles: mixedContext.getWatchFiles()
				};
				else if (typeof result === "object" && result !== null) return {
					path: result.id,
					external: result.external,
					namespace: plugin.name,
					errors,
					warnings,
					watchFiles: mixedContext.getWatchFiles()
				};
			});
			if (plugin.load) onLoad({ filter: onLoadFilter }, async (args) => {
				const { handler, filter } = normalizeObjectHook("load", plugin.load);
				const id = args.path + (args.suffix || "");
				if (plugin.loadInclude && !plugin.loadInclude(id)) return;
				if (!filter(id)) return;
				const { errors, warnings, mixedContext } = createPluginContext(context);
				let code;
				let map;
				const result = await handler.call(mixedContext, id);
				if (typeof result === "string") code = result;
				else if (typeof result === "object" && result !== null) {
					code = result.code;
					map = result.map;
				}
				if (code === void 0) return null;
				if (map) code = processCodeWithSourceMap(map, code);
				const resolveDir = path.dirname(args.path);
				return {
					contents: code,
					errors,
					warnings,
					watchFiles: mixedContext.getWatchFiles(),
					loader: unwrapLoader(loader, code, args.path),
					resolveDir
				};
			});
			if (plugin.transform) onTransform({ filter: onLoadFilter }, async (args) => {
				const { handler, filter } = normalizeObjectHook("transform", plugin.transform);
				const id = args.path + (args.suffix || "");
				if (plugin.transformInclude && !plugin.transformInclude(id)) return;
				let code = await args.getContents();
				if (!filter(id, code)) return;
				const { mixedContext, errors, warnings } = createPluginContext(context);
				const resolveDir = path.dirname(args.path);
				let map;
				const result = await handler.call(mixedContext, code, id);
				if (typeof result === "string") code = result;
				else if (typeof result === "object" && result !== null) {
					code = result.code;
					if (map && result.map) map = combineSourcemaps(args.path, [result.map === "string" ? JSON.parse(result.map) : result.map, map]);
					else if (typeof result.map === "string") map = JSON.parse(result.map);
					else map = result.map;
				}
				if (code) {
					if (map) code = processCodeWithSourceMap(map, code);
					return {
						contents: code,
						errors,
						warnings,
						watchFiles: mixedContext.getWatchFiles(),
						loader: unwrapLoader(loader, code, args.path),
						resolveDir
					};
				}
			});
			if (plugin.esbuild?.setup) return plugin.esbuild.setup(rawBuild);
		};
	};
}

//#endregion
//#region src/farm/context.ts
function createFarmContext(context, currentResolveId) {
	return {
		parse,
		addWatchFile(id) {
			context.addWatchFile(id, currentResolveId || id);
		},
		emitFile(emittedFile) {
			const outFileName = emittedFile.fileName || emittedFile.name;
			if (emittedFile.source && outFileName) context.emitFile({
				resolvedPath: outFileName,
				name: outFileName,
				content: [...Buffer$1.from(emittedFile.source)],
				resourceType: extname(outFileName)
			});
		},
		getWatchFiles() {
			return context.getWatchFiles();
		},
		getNativeBuildContext() {
			return {
				framework: "farm",
				context
			};
		}
	};
}
function unpluginContext(context) {
	return {
		error: (error) => context.error(typeof error === "string" ? new Error(error) : error),
		warn: (error) => context.warn(typeof error === "string" ? new Error(error) : error)
	};
}

//#endregion
//#region src/farm/utils.ts
function convertEnforceToPriority(value) {
	const defaultPriority = 100;
	const enforceToPriority = {
		pre: 102,
		post: 98
	};
	return enforceToPriority[value] !== void 0 ? enforceToPriority[value] : defaultPriority;
}
function convertWatchEventChange(value) {
	const watchEventChange = {
		Added: "create",
		Updated: "update",
		Removed: "delete"
	};
	return watchEventChange[value];
}
function isString(variable) {
	return typeof variable === "string";
}
function isObject(variable) {
	return typeof variable === "object" && variable !== null;
}
function customParseQueryString(url) {
	if (!url) return [];
	const queryString = url.split("?")[1];
	const parsedParams = querystring.parse(queryString);
	const paramsArray = [];
	for (const key in parsedParams) paramsArray.push([key, parsedParams[key]]);
	return paramsArray;
}
function encodeStr(str) {
	const len = str.length;
	if (len === 0) return str;
	const firstNullIndex = str.indexOf("\0");
	if (firstNullIndex === -1) return str;
	const result = Array.from({ length: len + countNulls(str, firstNullIndex) });
	let pos = 0;
	for (let i = 0; i < firstNullIndex; i++) result[pos++] = str[i];
	for (let i = firstNullIndex; i < len; i++) {
		const char = str[i];
		if (char === "\0") {
			result[pos++] = "\\";
			result[pos++] = "0";
		} else result[pos++] = char;
	}
	return path.posix.normalize(result.join(""));
}
function decodeStr(str) {
	const len = str.length;
	if (len === 0) return str;
	const firstIndex = str.indexOf("\\0");
	if (firstIndex === -1) return str;
	const result = Array.from({ length: len - countBackslashZeros(str, firstIndex) });
	let pos = 0;
	for (let i$1 = 0; i$1 < firstIndex; i$1++) result[pos++] = str[i$1];
	let i = firstIndex;
	while (i < len) if (str[i] === "\\" && str[i + 1] === "0") {
		result[pos++] = "\0";
		i += 2;
	} else result[pos++] = str[i++];
	return path.posix.normalize(result.join(""));
}
function getContentValue(content) {
	if (content === null || content === void 0) throw new Error("Content cannot be null or undefined");
	const strContent = typeof content === "string" ? content : content.code || "";
	return encodeStr(strContent);
}
function countNulls(str, startIndex) {
	let count = 0;
	const len = str.length;
	for (let i = startIndex; i < len; i++) if (str[i] === "\0") count++;
	return count;
}
function countBackslashZeros(str, startIndex) {
	let count = 0;
	const len = str.length;
	for (let i = startIndex; i < len - 1; i++) if (str[i] === "\\" && str[i + 1] === "0") {
		count++;
		i++;
	}
	return count;
}
function removeQuery(pathe) {
	const queryIndex = pathe.indexOf("?");
	if (queryIndex !== -1) return path.posix.normalize(pathe.slice(0, queryIndex));
	return path.posix.normalize(pathe);
}
function isStartsWithSlash(str) {
	return str?.startsWith("/");
}
function appendQuery(id, query) {
	if (!query.length) return id;
	return `${id}?${stringifyQuery(query)}`;
}
function stringifyQuery(query) {
	if (!query.length) return "";
	let queryStr = "";
	for (const [key, value] of query) queryStr += `${key}${value ? `=${value}` : ""}&`;
	return `${queryStr.slice(0, -1)}`;
}
const CSS_LANGS_RES = [
	[/\.(less)(?:$|\?)/, "less"],
	[/\.(scss|sass)(?:$|\?)/, "sass"],
	[/\.(styl|stylus)(?:$|\?)/, "stylus"],
	[/\.(css)(?:$|\?)/, "css"]
];
const JS_LANGS_RES = [
	[/\.(js|mjs|cjs)(?:$|\?)/, "js"],
	[/\.(jsx)(?:$|\?)/, "jsx"],
	[/\.(ts|cts|mts)(?:$|\?)/, "ts"],
	[/\.(tsx)(?:$|\?)/, "tsx"]
];
function getCssModuleType(id) {
	for (const [reg, lang] of CSS_LANGS_RES) if (reg.test(id)) return lang;
	return null;
}
function getJsModuleType(id) {
	for (const [reg, lang] of JS_LANGS_RES) if (reg.test(id)) return lang;
	return null;
}
function formatLoadModuleType(id) {
	const cssModuleType = getCssModuleType(id);
	if (cssModuleType) return cssModuleType;
	const jsModuleType = getJsModuleType(id);
	if (jsModuleType) return jsModuleType;
	return "js";
}
function formatTransformModuleType(id) {
	return formatLoadModuleType(id);
}

//#endregion
//#region src/farm/index.ts
function getFarmPlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "farm" };
		const rawPlugins = toArray(factory(userOptions, meta));
		const plugins = rawPlugins.map((rawPlugin) => {
			const plugin = toFarmPlugin(rawPlugin, userOptions);
			if (rawPlugin.farm) Object.assign(plugin, rawPlugin.farm);
			return plugin;
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	};
}
function toFarmPlugin(plugin, options) {
	const farmPlugin = {
		name: plugin.name,
		priority: convertEnforceToPriority(plugin.enforce)
	};
	if (plugin.farm) Object.keys(plugin.farm).forEach((key) => {
		const value = plugin.farm[key];
		if (value) Reflect.set(farmPlugin, key, value);
	});
	if (plugin.buildStart) {
		const _buildStart = plugin.buildStart;
		farmPlugin.buildStart = { async executor(_, context) {
			await _buildStart.call(createFarmContext(context));
		} };
	}
	if (plugin.resolveId) {
		const _resolveId = plugin.resolveId;
		let filters = [];
		if (options) filters = options?.filters ?? [];
		farmPlugin.resolve = {
			filters: {
				sources: filters.length ? filters : [".*"],
				importers: [".*"]
			},
			async executor(params, context) {
				const resolvedIdPath = path.resolve(params.importer ?? "");
				const id = decodeStr(params.source);
				const { handler, filter } = normalizeObjectHook("resolveId", _resolveId);
				if (!filter(id)) return null;
				let isEntry = false;
				if (isObject(params.kind) && "entry" in params.kind) {
					const kindWithEntry = params.kind;
					isEntry = kindWithEntry.entry === "index";
				}
				const farmContext = createFarmContext(context, resolvedIdPath);
				const resolveIdResult = await handler.call(Object.assign(unpluginContext(context), farmContext), id, resolvedIdPath ?? null, { isEntry });
				if (isString(resolveIdResult)) return {
					resolvedPath: removeQuery(encodeStr(resolveIdResult)),
					query: customParseQueryString(resolveIdResult),
					sideEffects: true,
					external: false,
					meta: {}
				};
				if (isObject(resolveIdResult)) return {
					resolvedPath: removeQuery(encodeStr(resolveIdResult?.id)),
					query: customParseQueryString(resolveIdResult?.id),
					sideEffects: false,
					external: Boolean(resolveIdResult?.external),
					meta: {}
				};
				if (!isStartsWithSlash(params.source)) return null;
			}
		};
	}
	if (plugin.load) {
		const _load = plugin.load;
		farmPlugin.load = {
			filters: { resolvedPaths: [".*"] },
			async executor(params, context) {
				const resolvedPath = decodeStr(params.resolvedPath);
				const id = appendQuery(resolvedPath, params.query);
				const loader = formatTransformModuleType(id);
				if (plugin.loadInclude && !plugin.loadInclude?.(id)) return null;
				const { handler, filter } = normalizeObjectHook("load", _load);
				if (!filter(id)) return null;
				const farmContext = createFarmContext(context, id);
				const content = await handler.call(Object.assign(unpluginContext(context), farmContext), id);
				const loadFarmResult = {
					content: getContentValue(content),
					moduleType: loader
				};
				return loadFarmResult;
			}
		};
	}
	if (plugin.transform) {
		const _transform = plugin.transform;
		farmPlugin.transform = {
			filters: {
				resolvedPaths: [".*"],
				moduleTypes: [".*"]
			},
			async executor(params, context) {
				const resolvedPath = decodeStr(params.resolvedPath);
				const id = appendQuery(resolvedPath, params.query);
				const loader = formatTransformModuleType(id);
				if (plugin.transformInclude && !plugin.transformInclude(id)) return null;
				const { handler, filter } = normalizeObjectHook("transform", _transform);
				if (!filter(id, params.content)) return null;
				const farmContext = createFarmContext(context, id);
				const resource = await handler.call(Object.assign(unpluginContext(context), farmContext), params.content, id);
				if (resource && typeof resource !== "string") {
					const transformFarmResult = {
						content: getContentValue(resource),
						moduleType: loader,
						sourceMap: typeof resource.map === "object" && resource.map !== null ? JSON.stringify(resource.map) : void 0
					};
					return transformFarmResult;
				}
			}
		};
	}
	if (plugin.watchChange) {
		const _watchChange = plugin.watchChange;
		farmPlugin.updateModules = { async executor(param, context) {
			const updatePathContent = param.paths[0];
			const ModifiedPath = updatePathContent[0];
			const eventChange = convertWatchEventChange(updatePathContent[1]);
			await _watchChange.call(createFarmContext(context), ModifiedPath, { event: eventChange });
		} };
	}
	if (plugin.buildEnd) {
		const _buildEnd = plugin.buildEnd;
		farmPlugin.buildEnd = { async executor(_, context) {
			await _buildEnd.call(createFarmContext(context));
		} };
	}
	if (plugin.writeBundle) {
		const _writeBundle = plugin.writeBundle;
		farmPlugin.finish = { async executor() {
			await _writeBundle();
		} };
	}
	return farmPlugin;
}

//#endregion
//#region src/rollup/index.ts
function getRollupPlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "rollup" };
		const rawPlugins = toArray(factory(userOptions, meta));
		const plugins = rawPlugins.map((plugin) => toRollupPlugin(plugin, "rollup"));
		return plugins.length === 1 ? plugins[0] : plugins;
	};
}
function toRollupPlugin(plugin, key) {
	const nativeFilter = key === "rolldown";
	if (plugin.resolveId && !nativeFilter && typeof plugin.resolveId === "object" && plugin.resolveId.filter) {
		const resolveIdHook = plugin.resolveId;
		const { handler, filter } = normalizeObjectHook("load", resolveIdHook);
		replaceHookHandler("resolveId", resolveIdHook, function(...args) {
			const [id] = args;
			const supportFilter = supportNativeFilter(this);
			if (!supportFilter && !filter(id)) return;
			return handler.apply(this, args);
		});
	}
	if (plugin.load && (plugin.loadInclude || !nativeFilter && typeof plugin.load === "object" && plugin.load.filter)) {
		const loadHook = plugin.load;
		const { handler, filter } = normalizeObjectHook("load", loadHook);
		replaceHookHandler("load", loadHook, function(...args) {
			const [id] = args;
			if (plugin.loadInclude && !plugin.loadInclude(id)) return;
			const supportFilter = supportNativeFilter(this);
			if (!supportFilter && !filter(id)) return;
			return handler.apply(this, args);
		});
	}
	if (plugin.transform && (plugin.transformInclude || !nativeFilter && typeof plugin.transform === "object" && plugin.transform.filter)) {
		const transformHook = plugin.transform;
		const { handler, filter } = normalizeObjectHook("transform", transformHook);
		replaceHookHandler("transform", transformHook, function(...args) {
			const [code, id] = args;
			if (plugin.transformInclude && !plugin.transformInclude(id)) return;
			const supportFilter = supportNativeFilter(this);
			if (!supportFilter && !filter(id, code)) return;
			return handler.apply(this, args);
		});
	}
	if (plugin[key]) Object.assign(plugin, plugin[key]);
	return plugin;
	function replaceHookHandler(name, hook, handler) {
		if (typeof hook === "function") plugin[name] = handler;
		else hook.handler = handler;
	}
}
function supportNativeFilter(context) {
	const rollupVersion = context?.meta?.rollupVersion;
	if (!rollupVersion) return false;
	const [major, minor] = rollupVersion.split(".");
	return Number(major) > 4 || Number(major) === 4 && Number(minor) >= 40;
}

//#endregion
//#region src/rolldown/index.ts
function getRolldownPlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "rolldown" };
		const rawPlugins = toArray(factory(userOptions, meta));
		const plugins = rawPlugins.map((rawPlugin) => {
			const plugin = toRollupPlugin(rawPlugin, "rolldown");
			return plugin;
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	};
}

//#endregion
//#region node_modules/.pnpm/tsdown@0.12.3_publint@0.3.5_typescript@5.8.3_unplugin-unused@0.5.0_vue-tsc@2.2.10_typescript@5.8.3_/node_modules/tsdown/esm-shims.js
const getFilename = () => fileURLToPath(import.meta.url);
const getDirname = () => path.dirname(getFilename());
const __dirname = /* @__PURE__ */ getDirname();

//#endregion
//#region src/rspack/index.ts
const TRANSFORM_LOADER$1 = resolve(__dirname, "rspack/loaders/transform");
const LOAD_LOADER$1 = resolve(__dirname, "rspack/loaders/load");
function getRspackPlugin(factory) {
	return (userOptions) => {
		return { apply(compiler) {
			const VIRTUAL_MODULE_PREFIX = resolve(compiler.options.context ?? process.cwd(), "node_modules/.virtual");
			const meta = {
				framework: "rspack",
				rspack: { compiler }
			};
			const rawPlugins = toArray(factory(userOptions, meta));
			for (const rawPlugin of rawPlugins) {
				const plugin = Object.assign(rawPlugin, {
					__unpluginMeta: meta,
					__virtualModulePrefix: VIRTUAL_MODULE_PREFIX
				});
				const externalModules = new Set();
				if (plugin.resolveId) {
					const vfs = new FakeVirtualModulesPlugin(plugin);
					vfs.apply(compiler);
					const vfsModules = new Map();
					plugin.__vfsModules = vfsModules;
					plugin.__vfs = vfs;
					compiler.hooks.compilation.tap(plugin.name, (compilation, { normalModuleFactory }) => {
						normalModuleFactory.hooks.resolve.tapPromise(plugin.name, async (resolveData) => {
							const id = normalizeAbsolutePath(resolveData.request);
							const requestContext = resolveData.contextInfo;
							let importer = requestContext.issuer !== "" ? requestContext.issuer : void 0;
							const isEntry = requestContext.issuer === "";
							if (importer?.startsWith(plugin.__virtualModulePrefix)) importer = decodeURIComponent(importer.slice(plugin.__virtualModulePrefix.length));
							const context = createBuildContext(compiler, compilation);
							let error;
							const pluginContext = {
								error(msg) {
									if (error == null) error = normalizeMessage(msg);
									else console.error(`unplugin/rspack: multiple errors returned from resolveId hook: ${msg}`);
								},
								warn(msg) {
									console.warn(`unplugin/rspack: warning from resolveId hook: ${msg}`);
								}
							};
							const { handler, filter } = normalizeObjectHook("resolveId", plugin.resolveId);
							if (!filter(id)) return;
							const resolveIdResult = await handler.call({
								...context,
								...pluginContext
							}, id, importer, { isEntry });
							if (error != null) throw error;
							if (resolveIdResult == null) return;
							let resolved = typeof resolveIdResult === "string" ? resolveIdResult : resolveIdResult.id;
							const isExternal = typeof resolveIdResult === "string" ? false : resolveIdResult.external === true;
							if (isExternal) externalModules.add(resolved);
							if (!fs.existsSync(resolved)) {
								if (!vfsModules.has(resolved)) {
									const fsPromise = vfs.writeModule(resolved);
									vfsModules.set(resolved, fsPromise);
									await fsPromise;
								} else await vfsModules.get(resolved);
								resolved = encodeVirtualModuleId(resolved, plugin);
							}
							resolveData.request = resolved;
						});
					});
				}
				if (plugin.load) compiler.options.module.rules.unshift({
					enforce: plugin.enforce,
					include(id) {
						if (isVirtualModuleId(id, plugin)) id = decodeVirtualModuleId(id, plugin);
						if (plugin.loadInclude && !plugin.loadInclude(id)) return false;
						const { filter } = normalizeObjectHook("load", plugin.load);
						if (!filter(id)) return false;
						return !externalModules.has(id);
					},
					use: [{
						loader: LOAD_LOADER$1,
						options: { plugin }
					}],
					type: "javascript/auto"
				});
				if (plugin.transform) compiler.options.module.rules.unshift({
					enforce: plugin.enforce,
					use(data) {
						return transformUse(data, plugin, TRANSFORM_LOADER$1);
					}
				});
				if (plugin.rspack) plugin.rspack(compiler);
				if (plugin.watchChange || plugin.buildStart) compiler.hooks.make.tapPromise(plugin.name, async (compilation) => {
					const context = createBuildContext(compiler, compilation);
					if (plugin.watchChange && (compiler.modifiedFiles || compiler.removedFiles)) {
						const promises = [];
						if (compiler.modifiedFiles) compiler.modifiedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "update" }))));
						if (compiler.removedFiles) compiler.removedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "delete" }))));
						await Promise.all(promises);
					}
					if (plugin.buildStart) return await plugin.buildStart.call(context);
				});
				if (plugin.buildEnd) compiler.hooks.emit.tapPromise(plugin.name, async (compilation) => {
					await plugin.buildEnd.call(createBuildContext(compiler, compilation));
				});
				if (plugin.writeBundle) compiler.hooks.afterEmit.tapPromise(plugin.name, async () => {
					await plugin.writeBundle();
				});
			}
		} };
	};
}

//#endregion
//#region src/unloader/index.ts
function getUnloaderPlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "unloader" };
		const rawPlugins = toArray(factory(userOptions, meta));
		const plugins = rawPlugins.map((rawPlugin) => {
			const plugin = toRollupPlugin(rawPlugin, "unloader");
			return plugin;
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	};
}

//#endregion
//#region src/vite/index.ts
function getVitePlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "vite" };
		const rawPlugins = toArray(factory(userOptions, meta));
		const plugins = rawPlugins.map((rawPlugin) => {
			const plugin = toRollupPlugin(rawPlugin, "vite");
			return plugin;
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	};
}

//#endregion
//#region src/webpack/index.ts
const TRANSFORM_LOADER = resolve(__dirname, "webpack/loaders/transform");
const LOAD_LOADER = resolve(__dirname, "webpack/loaders/load");
function getWebpackPlugin(factory) {
	return (userOptions) => {
		return { apply(compiler) {
			const VIRTUAL_MODULE_PREFIX = resolve(compiler.options.context ?? process$1.cwd(), "_virtual_");
			const meta = {
				framework: "webpack",
				webpack: { compiler }
			};
			const rawPlugins = toArray(factory(userOptions, meta));
			for (const rawPlugin of rawPlugins) {
				const plugin = Object.assign(rawPlugin, {
					__unpluginMeta: meta,
					__virtualModulePrefix: VIRTUAL_MODULE_PREFIX
				});
				const externalModules = new Set();
				if (plugin.resolveId) {
					let vfs = compiler.options.plugins.find((i) => i instanceof VirtualModulesPlugin);
					if (!vfs) {
						vfs = new VirtualModulesPlugin();
						compiler.options.plugins.push(vfs);
					}
					const vfsModules = new Set();
					plugin.__vfsModules = vfsModules;
					plugin.__vfs = vfs;
					const resolverPlugin = { apply(resolver) {
						const target = resolver.ensureHook("resolve");
						resolver.getHook("resolve").tapAsync(plugin.name, async (request, resolveContext, callback) => {
							if (!request.request) return callback();
							if (normalizeAbsolutePath(request.request).startsWith(plugin.__virtualModulePrefix)) return callback();
							const id = normalizeAbsolutePath(request.request);
							const requestContext = request.context;
							let importer = requestContext.issuer !== "" ? requestContext.issuer : void 0;
							const isEntry = requestContext.issuer === "";
							if (importer?.startsWith(plugin.__virtualModulePrefix)) importer = decodeURIComponent(importer.slice(plugin.__virtualModulePrefix.length));
							const fileDependencies = new Set();
							const context = createBuildContext$1({
								addWatchFile(file) {
									fileDependencies.add(file);
									resolveContext.fileDependencies?.add(file);
								},
								getWatchFiles() {
									return Array.from(fileDependencies);
								}
							}, compiler);
							let error;
							const pluginContext = {
								error(msg) {
									if (error == null) error = normalizeMessage$1(msg);
									else console.error(`unplugin/webpack: multiple errors returned from resolveId hook: ${msg}`);
								},
								warn(msg) {
									console.warn(`unplugin/webpack: warning from resolveId hook: ${msg}`);
								}
							};
							const { handler, filter } = normalizeObjectHook("resolveId", plugin.resolveId);
							if (!filter(id)) return callback();
							const resolveIdResult = await handler.call({
								...context,
								...pluginContext
							}, id, importer, { isEntry });
							if (error != null) return callback(error);
							if (resolveIdResult == null) return callback();
							let resolved = typeof resolveIdResult === "string" ? resolveIdResult : resolveIdResult.id;
							const isExternal = typeof resolveIdResult === "string" ? false : resolveIdResult.external === true;
							if (isExternal) externalModules.add(resolved);
							if (!fs.existsSync(resolved)) {
								resolved = normalizeAbsolutePath(plugin.__virtualModulePrefix + encodeURIComponent(resolved));
								// webpack virtual module should pass in the correct path
								if (!vfsModules.has(resolved)) {
									plugin.__vfs.writeModule(resolved, "");
									vfsModules.add(resolved);
								}
							}
							const newRequest = {
								...request,
								request: resolved
							};
							resolver.doResolve(target, newRequest, null, resolveContext, callback);
						});
					} };
					compiler.options.resolve.plugins = compiler.options.resolve.plugins || [];
					compiler.options.resolve.plugins.push(resolverPlugin);
				}
				if (plugin.load) compiler.options.module.rules.unshift({
					include(id) {
						return shouldLoad(id, plugin, externalModules);
					},
					enforce: plugin.enforce,
					use: [{
						loader: LOAD_LOADER,
						options: { plugin }
					}],
					type: "javascript/auto"
				});
				if (plugin.transform) compiler.options.module.rules.unshift({
					enforce: plugin.enforce,
					use(data) {
						return transformUse(data, plugin, TRANSFORM_LOADER);
					}
				});
				if (plugin.webpack) plugin.webpack(compiler);
				if (plugin.watchChange || plugin.buildStart) compiler.hooks.make.tapPromise(plugin.name, async (compilation) => {
					const context = createBuildContext$1(contextOptionsFromCompilation(compilation), compiler, compilation);
					if (plugin.watchChange && (compiler.modifiedFiles || compiler.removedFiles)) {
						const promises = [];
						if (compiler.modifiedFiles) compiler.modifiedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "update" }))));
						if (compiler.removedFiles) compiler.removedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "delete" }))));
						await Promise.all(promises);
					}
					if (plugin.buildStart) return await plugin.buildStart.call(context);
				});
				if (plugin.buildEnd) compiler.hooks.emit.tapPromise(plugin.name, async (compilation) => {
					await plugin.buildEnd.call(createBuildContext$1(contextOptionsFromCompilation(compilation), compiler, compilation));
				});
				if (plugin.writeBundle) compiler.hooks.afterEmit.tapPromise(plugin.name, async () => {
					await plugin.writeBundle();
				});
			}
		} };
	};
}
function shouldLoad(id, plugin, externalModules) {
	if (id.startsWith(plugin.__virtualModulePrefix)) id = decodeURIComponent(id.slice(plugin.__virtualModulePrefix.length));
	if (plugin.loadInclude && !plugin.loadInclude(id)) return false;
	const { filter } = normalizeObjectHook("load", plugin.load);
	if (!filter(id)) return false;
	return !externalModules.has(id);
}

//#endregion
//#region src/define.ts
function createUnplugin(factory) {
	return {
		get esbuild() {
			return getEsbuildPlugin(factory);
		},
		get rollup() {
			return getRollupPlugin(factory);
		},
		get vite() {
			return getVitePlugin(factory);
		},
		get rolldown() {
			return getRolldownPlugin(factory);
		},
		get webpack() {
			return getWebpackPlugin(factory);
		},
		get rspack() {
			return getRspackPlugin(factory);
		},
		get farm() {
			return getFarmPlugin(factory);
		},
		get unloader() {
			return getUnloaderPlugin(factory);
		},
		get raw() {
			return factory;
		}
	};
}
function createEsbuildPlugin(factory) {
	return getEsbuildPlugin(factory);
}
function createRollupPlugin(factory) {
	return getRollupPlugin(factory);
}
function createVitePlugin(factory) {
	return getVitePlugin(factory);
}
function createRolldownPlugin(factory) {
	return getRolldownPlugin(factory);
}
function createWebpackPlugin(factory) {
	return getWebpackPlugin(factory);
}
function createRspackPlugin(factory) {
	return getRspackPlugin(factory);
}
function createFarmPlugin(factory) {
	return getFarmPlugin(factory);
}
function createUnloaderPlugin(factory) {
	return getUnloaderPlugin(factory);
}

//#endregion
export { createEsbuildPlugin, createFarmPlugin, createRolldownPlugin, createRollupPlugin, createRspackPlugin, createUnloaderPlugin, createUnplugin, createVitePlugin, createWebpackPlugin };