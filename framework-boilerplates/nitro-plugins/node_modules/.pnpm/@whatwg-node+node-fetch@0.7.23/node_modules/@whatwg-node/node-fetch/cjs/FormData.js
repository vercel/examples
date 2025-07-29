"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillFormData = void 0;
exports.getStreamFromFormData = getStreamFromFormData;
const node_buffer_1 = require("node:buffer");
const IteratorObject_js_1 = require("./IteratorObject.js");
const ReadableStream_js_1 = require("./ReadableStream.js");
class PonyfillFormData {
    map = new Map();
    append(name, value, fileName) {
        let values = this.map.get(name);
        if (!values) {
            values = [];
            this.map.set(name, values);
        }
        const entry = isBlob(value)
            ? getNormalizedFile(name, value, fileName)
            : value;
        values.push(entry);
    }
    delete(name) {
        this.map.delete(name);
    }
    get(name) {
        const values = this.map.get(name);
        return values ? values[0] : null;
    }
    getAll(name) {
        return this.map.get(name) || [];
    }
    has(name) {
        return this.map.has(name);
    }
    set(name, value, fileName) {
        const entry = isBlob(value)
            ? getNormalizedFile(name, value, fileName)
            : value;
        this.map.set(name, [entry]);
    }
    [Symbol.iterator]() {
        return this._entries();
    }
    *_entries() {
        for (const [key, values] of this.map) {
            for (const value of values) {
                yield [key, value];
            }
        }
    }
    entries() {
        return new IteratorObject_js_1.PonyfillIteratorObject(this._entries(), 'FormDataIterator');
    }
    _keys() {
        return this.map.keys();
    }
    keys() {
        return new IteratorObject_js_1.PonyfillIteratorObject(this._keys(), 'FormDataIterator');
    }
    *_values() {
        for (const values of this.map.values()) {
            for (const value of values) {
                yield value;
            }
        }
    }
    values() {
        return new IteratorObject_js_1.PonyfillIteratorObject(this._values(), 'FormDataIterator');
    }
    forEach(callback) {
        for (const [key, value] of this) {
            callback(value, key, this);
        }
    }
}
exports.PonyfillFormData = PonyfillFormData;
function getStreamFromFormData(formData, boundary = '---') {
    let entriesIterator;
    let sentInitialHeader = false;
    let currentAsyncIterator;
    let hasBefore = false;
    function handleNextEntry(controller) {
        const { done, value } = entriesIterator.next();
        if (done) {
            controller.enqueue(node_buffer_1.Buffer.from(`\r\n--${boundary}--\r\n`));
            return controller.close();
        }
        if (hasBefore) {
            controller.enqueue(node_buffer_1.Buffer.from(`\r\n--${boundary}\r\n`));
        }
        if (value) {
            const [key, blobOrString] = value;
            if (typeof blobOrString === 'string') {
                controller.enqueue(node_buffer_1.Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`));
                controller.enqueue(node_buffer_1.Buffer.from(blobOrString));
            }
            else {
                let filenamePart = '';
                if (blobOrString.name) {
                    filenamePart = `; filename="${blobOrString.name}"`;
                }
                controller.enqueue(node_buffer_1.Buffer.from(`Content-Disposition: form-data; name="${key}"${filenamePart}\r\n`));
                controller.enqueue(node_buffer_1.Buffer.from(`Content-Type: ${blobOrString.type || 'application/octet-stream'}\r\n\r\n`));
                const entryStream = blobOrString.stream();
                // @ts-expect-error - ReadableStream is async iterable
                currentAsyncIterator = entryStream[Symbol.asyncIterator]();
            }
            hasBefore = true;
        }
    }
    return new ReadableStream_js_1.PonyfillReadableStream({
        start: () => {
            entriesIterator = formData.entries();
        },
        pull: controller => {
            if (!sentInitialHeader) {
                sentInitialHeader = true;
                return controller.enqueue(node_buffer_1.Buffer.from(`--${boundary}\r\n`));
            }
            if (currentAsyncIterator) {
                return currentAsyncIterator.next().then(({ done, value }) => {
                    if (done) {
                        currentAsyncIterator = undefined;
                    }
                    if (value) {
                        return controller.enqueue(value);
                    }
                    else {
                        return handleNextEntry(controller);
                    }
                });
            }
            return handleNextEntry(controller);
        },
        cancel: err => {
            entriesIterator?.return?.(err);
            currentAsyncIterator?.return?.(err);
        },
    });
}
function getNormalizedFile(name, blob, fileName) {
    Object.defineProperty(blob, 'name', {
        configurable: true,
        enumerable: true,
        value: fileName || blob.name || name,
    });
    return blob;
}
function isBlob(value) {
    return value?.arrayBuffer != null;
}
