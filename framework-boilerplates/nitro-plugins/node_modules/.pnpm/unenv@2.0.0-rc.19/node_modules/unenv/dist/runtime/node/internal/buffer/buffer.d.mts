export declare const INSPECT_MAX_BYTES = 50;
export declare const kMaxLength: unknown;
/**
* The Buffer constructor returns instances of `Uint8Array` that have their
* prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
* `Uint8Array`, so the returned instances will have all the node `Buffer` methods
* and the `Uint8Array` methods. Square bracket notation works as expected -- it
* returns a single octet.
*
* The `Uint8Array` prototype remains unmodified.
*/
export declare function Buffer(arg, encodingOrOffset, length);
export declare function SlowBuffer(length);
