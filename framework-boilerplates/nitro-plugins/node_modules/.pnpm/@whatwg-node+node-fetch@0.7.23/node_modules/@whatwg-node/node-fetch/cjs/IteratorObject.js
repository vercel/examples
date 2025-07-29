"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillIteratorObject = void 0;
const node_util_1 = require("node:util");
const disposablestack_1 = require("@whatwg-node/disposablestack");
const utils_js_1 = require("./utils.js");
class PonyfillIteratorObject {
    iterableIterator;
    [Symbol.toStringTag] = 'IteratorObject';
    constructor(iterableIterator, className) {
        this.iterableIterator = iterableIterator;
        this[Symbol.toStringTag] = className;
    }
    *map(callbackfn) {
        let index = 0;
        for (const value of this.iterableIterator) {
            yield callbackfn(value, index++);
        }
        return undefined;
    }
    *filter(callbackfn) {
        let index = 0;
        for (const value of this.iterableIterator) {
            if (callbackfn(value, index++)) {
                yield value;
            }
        }
        return undefined;
    }
    reduce(callbackfn, initialValue) {
        let index = 0;
        let accumulator = initialValue;
        for (const value of this.iterableIterator) {
            accumulator = callbackfn(accumulator, value, index++);
        }
        return accumulator;
    }
    forEach(callbackfn) {
        let index = 0;
        for (const value of this.iterableIterator) {
            callbackfn(value, index++);
        }
    }
    *take(limit) {
        let index = 0;
        for (const value of this.iterableIterator) {
            if (index >= limit) {
                break;
            }
            yield value;
            index++;
        }
        return undefined;
    }
    *drop(count) {
        let index = 0;
        for (const value of this.iterableIterator) {
            if (index >= count) {
                yield value;
            }
            index++;
        }
        return undefined;
    }
    *flatMap(callback) {
        let index = 0;
        for (const value of this.iterableIterator) {
            const iteratorOrIterable = callback(value, index++);
            if ((0, utils_js_1.isIterable)(iteratorOrIterable)) {
                for (const innerValue of iteratorOrIterable) {
                    yield innerValue;
                }
            }
            else {
                for (const innerValue of {
                    [Symbol.iterator]: () => iteratorOrIterable,
                }) {
                    yield innerValue;
                }
            }
        }
        return undefined;
    }
    some(predicate) {
        let index = 0;
        for (const value of this.iterableIterator) {
            if (predicate(value, index++)) {
                return true;
            }
        }
        return false;
    }
    every(predicate) {
        let index = 0;
        for (const value of this.iterableIterator) {
            if (!predicate(value, index++)) {
                return false;
            }
        }
        return true;
    }
    find(predicate) {
        let index = 0;
        for (const value of this.iterableIterator) {
            if (predicate(value, index++)) {
                return value;
            }
        }
        return undefined;
    }
    toArray() {
        return Array.from(this.iterableIterator);
    }
    [disposablestack_1.DisposableSymbols.dispose]() {
        this.iterableIterator.return?.();
    }
    next(...[value]) {
        return this.iterableIterator.next(value);
    }
    [Symbol.iterator]() {
        return this;
    }
    [Symbol.for('nodejs.util.inspect.custom')]() {
        const record = {};
        this.forEach((value, key) => {
            const inspectedValue = (0, node_util_1.inspect)(value);
            record[key] = inspectedValue.includes(',')
                ? inspectedValue.split(',').map(el => el.trim())
                : inspectedValue;
        });
        return `${this[Symbol.toStringTag]} ${(0, node_util_1.inspect)(record)}`;
    }
}
exports.PonyfillIteratorObject = PonyfillIteratorObject;
