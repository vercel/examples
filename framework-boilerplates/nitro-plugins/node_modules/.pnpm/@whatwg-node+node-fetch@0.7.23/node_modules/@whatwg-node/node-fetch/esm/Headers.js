import { inspect } from 'node:util';
import { PonyfillIteratorObject } from './IteratorObject.js';
export function isHeadersLike(headers) {
    return headers?.get && headers?.forEach;
}
export class PonyfillHeaders {
    headersInit;
    _map;
    objectNormalizedKeysOfHeadersInit = [];
    objectOriginalKeysOfHeadersInit = [];
    _setCookies;
    constructor(headersInit) {
        this.headersInit = headersInit;
    }
    // perf: we don't need to build `this.map` for Requests, as we can access the headers directly
    _get(key) {
        const normalized = key.toLowerCase();
        if (normalized === 'set-cookie' && this._setCookies?.length) {
            return this._setCookies.join(', ');
        }
        // If the map is built, reuse it
        if (this._map) {
            return this._map.get(normalized) || null;
        }
        // If the map is not built, try to get the value from the this.headersInit
        if (this.headersInit == null) {
            return null;
        }
        if (Array.isArray(this.headersInit)) {
            const found = this.headersInit.filter(([headerKey]) => headerKey.toLowerCase() === normalized);
            if (found.length === 0) {
                return null;
            }
            if (found.length === 1) {
                return found[0][1];
            }
            return found.map(([, value]) => value).join(', ');
        }
        else if (isHeadersLike(this.headersInit)) {
            return this.headersInit.get(normalized);
        }
        else {
            const initValue = this.headersInit[key] || this.headersInit[normalized];
            if (initValue != null) {
                return initValue;
            }
            if (!this.objectNormalizedKeysOfHeadersInit.length) {
                Object.keys(this.headersInit).forEach(k => {
                    this.objectOriginalKeysOfHeadersInit.push(k);
                    this.objectNormalizedKeysOfHeadersInit.push(k.toLowerCase());
                });
            }
            const index = this.objectNormalizedKeysOfHeadersInit.indexOf(normalized);
            if (index === -1) {
                return null;
            }
            const originalKey = this.objectOriginalKeysOfHeadersInit[index];
            return this.headersInit[originalKey];
        }
    }
    // perf: Build the map of headers lazily, only when we need to access all headers or write to it.
    // I could do a getter here, but I'm too lazy to type `getter`.
    getMap() {
        if (!this._map) {
            this._setCookies ||= [];
            if (this.headersInit != null) {
                if (Array.isArray(this.headersInit)) {
                    this._map = new Map();
                    for (const [key, value] of this.headersInit) {
                        const normalizedKey = key.toLowerCase();
                        if (normalizedKey === 'set-cookie') {
                            this._setCookies.push(value);
                            continue;
                        }
                        this._map.set(normalizedKey, value);
                    }
                }
                else if (isHeadersLike(this.headersInit)) {
                    this._map = new Map();
                    this.headersInit.forEach((value, key) => {
                        if (key === 'set-cookie') {
                            this._setCookies ||= [];
                            this._setCookies.push(value);
                            return;
                        }
                        this._map.set(key, value);
                    });
                }
                else {
                    this._map = new Map();
                    for (const initKey in this.headersInit) {
                        const initValue = this.headersInit[initKey];
                        if (initValue != null) {
                            const normalizedKey = initKey.toLowerCase();
                            if (normalizedKey === 'set-cookie') {
                                this._setCookies ||= [];
                                this._setCookies.push(initValue);
                                continue;
                            }
                            this._map.set(normalizedKey, initValue);
                        }
                    }
                }
            }
            else {
                this._map = new Map();
            }
        }
        return this._map;
    }
    append(name, value) {
        const key = name.toLowerCase();
        if (key === 'set-cookie') {
            this._setCookies ||= [];
            this._setCookies.push(value);
            return;
        }
        const existingValue = this.getMap().get(key);
        const finalValue = existingValue ? `${existingValue}, ${value}` : value;
        this.getMap().set(key, finalValue);
    }
    get(name) {
        const value = this._get(name);
        if (value == null) {
            return null;
        }
        return value.toString();
    }
    has(name) {
        const key = name.toLowerCase();
        if (key === 'set-cookie') {
            return !!this._setCookies?.length;
        }
        return !!this._get(name); // we might need to check if header exists and not just check if it's not nullable
    }
    set(name, value) {
        const key = name.toLowerCase();
        if (key === 'set-cookie') {
            this._setCookies = [value];
            return;
        }
        if (!this._map && this.headersInit != null) {
            if (Array.isArray(this.headersInit)) {
                const found = this.headersInit.find(([headerKey]) => headerKey.toLowerCase() === key);
                if (found) {
                    found[1] = value;
                }
                else {
                    this.headersInit.push([key, value]);
                }
                return;
            }
            else if (isHeadersLike(this.headersInit)) {
                this.headersInit.set(key, value);
                return;
            }
            else {
                this.headersInit[key] = value;
                return;
            }
        }
        this.getMap().set(key, value);
    }
    delete(name) {
        const key = name.toLowerCase();
        if (key === 'set-cookie') {
            this._setCookies = [];
            return;
        }
        this.getMap().delete(key);
    }
    forEach(callback) {
        this._setCookies?.forEach(setCookie => {
            callback(setCookie, 'set-cookie', this);
        });
        if (!this._map) {
            if (this.headersInit) {
                if (Array.isArray(this.headersInit)) {
                    this.headersInit.forEach(([key, value]) => {
                        callback(value, key, this);
                    });
                    return;
                }
                if (isHeadersLike(this.headersInit)) {
                    this.headersInit.forEach(callback);
                    return;
                }
                Object.entries(this.headersInit).forEach(([key, value]) => {
                    if (value != null) {
                        callback(value, key, this);
                    }
                });
            }
            return;
        }
        this.getMap().forEach((value, key) => {
            callback(value, key, this);
        });
    }
    *_keys() {
        if (this._setCookies?.length) {
            yield 'set-cookie';
        }
        if (!this._map) {
            if (this.headersInit) {
                if (Array.isArray(this.headersInit)) {
                    yield* this.headersInit.map(([key]) => key)[Symbol.iterator]();
                    return;
                }
                if (isHeadersLike(this.headersInit)) {
                    yield* this.headersInit.keys();
                    return;
                }
                yield* Object.keys(this.headersInit)[Symbol.iterator]();
                return;
            }
        }
        yield* this.getMap().keys();
    }
    keys() {
        return new PonyfillIteratorObject(this._keys(), 'HeadersIterator');
    }
    *_values() {
        if (this._setCookies?.length) {
            yield* this._setCookies;
        }
        if (!this._map) {
            if (this.headersInit) {
                if (Array.isArray(this.headersInit)) {
                    yield* this.headersInit.map(([, value]) => value)[Symbol.iterator]();
                    return;
                }
                if (isHeadersLike(this.headersInit)) {
                    yield* this.headersInit.values();
                    return;
                }
                yield* Object.values(this.headersInit)[Symbol.iterator]();
                return;
            }
        }
        yield* this.getMap().values();
    }
    values() {
        return new PonyfillIteratorObject(this._values(), 'HeadersIterator');
    }
    *_entries() {
        if (this._setCookies?.length) {
            yield* this._setCookies.map(cookie => ['set-cookie', cookie]);
        }
        if (!this._map) {
            if (this.headersInit) {
                if (Array.isArray(this.headersInit)) {
                    yield* this.headersInit;
                    return;
                }
                if (isHeadersLike(this.headersInit)) {
                    yield* this.headersInit.entries();
                    return;
                }
                yield* Object.entries(this.headersInit);
                return;
            }
        }
        yield* this.getMap().entries();
    }
    entries() {
        return new PonyfillIteratorObject(this._entries(), 'HeadersIterator');
    }
    getSetCookie() {
        if (!this._setCookies) {
            this.getMap();
        }
        return this._setCookies;
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    [Symbol.for('nodejs.util.inspect.custom')]() {
        const record = {};
        this.forEach((value, key) => {
            if (key === 'set-cookie') {
                record['set-cookie'] = this._setCookies || [];
            }
            else {
                record[key] = value?.includes(',') ? value.split(',').map(el => el.trim()) : value;
            }
        });
        return `Headers ${inspect(record)}`;
    }
}
