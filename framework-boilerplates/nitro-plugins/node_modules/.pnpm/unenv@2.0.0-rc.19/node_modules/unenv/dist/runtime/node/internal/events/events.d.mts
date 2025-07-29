// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// Based on Node.js EventEmitter implementation
// https://github.com/nodejs/node/blob/26f2cbdd59957e9a33a94ee2e0fdbeb9aadb0be6/lib/events.js
import type nodeEvents from "node:events";
import { EventEmitter as NodeEventEmitter } from "node:events";
// Types
type Listener = (...args: any[]) => void;
// ----------------------------------------------------------------------------
// EventEmitter
// ----------------------------------------------------------------------------
export declare class _EventEmitter implements NodeEventEmitter {
	// Internal state
	_events: any;
	_eventsCount: number;
	_maxListeners: number | undefined;
	// Symbols
	static captureRejectionSymbol;
	static errorMonitor;
	static kMaxEventTargetListeners;
	static kMaxEventTargetListenersWarned;
	// Static utils
	static usingDomains: boolean;
	static get on();
	static get once();
	static get getEventListeners();
	static get getMaxListeners();
	static get addAbortListener();
	static get EventEmitterAsyncResource();
	static get EventEmitter();
	static setMaxListeners(n?, ...eventTargets: (_EventEmitter | EventTarget)[]);
	static listenerCount(emitter: NodeEventEmitter, type: string);
	static init();
	static get captureRejections();
	static set captureRejections(value);
	static get defaultMaxListeners();
	static set defaultMaxListeners(arg);
	// Constructor
	constructor(opts?: any);
	/**
	* Increases the max listeners of the event emitter.
	* @param {number} n
	* @returns {EventEmitter}
	*/
	setMaxListeners(n: number);
	/**
	* Returns the current max listener value for the event emitter.
	* @returns {number}
	*/
	getMaxListeners();
	/**
	* Synchronously calls each of the listeners registered
	* for the event.
	* @param {...any} [args]
	* @returns {boolean}
	*/
	emit(type: string | symbol, ...args: any[]);
	/**
	* Adds a listener to the event emitter.
	* @returns {EventEmitter}
	*/
	addListener(type: string | symbol, listener: Listener);
	on(type: string | symbol, listener: Listener);
	/**
	* Adds the `listener` function to the beginning of
	* the listeners array.
	*/
	prependListener(type: string | symbol, listener: Listener);
	/**
	* Adds a one-time `listener` function to the event emitter.
	*/
	once(type: string | symbol, listener: Listener);
	/**
	* Adds a one-time `listener` function to the beginning of
	* the listeners array.
	*/
	prependOnceListener(type: string | symbol, listener: Listener);
	/**
	* Removes the specified `listener` from the listeners array.
	* @param {string | symbol} type
	* @param {Function} listener
	* @returns {EventEmitter}
	*/
	removeListener(type: string | symbol, listener: Listener);
	off(type: string | symbol, listener: Listener);
	/**
	* Removes all listeners from the event emitter. (Only
	* removes listeners for a specific event name if specified
	* as `type`).
	*/
	removeAllListeners(type?: string | symbol);
	/**
	* Returns a copy of the array of listeners for the event name
	* specified as `type`.
	* @param {string | symbol} type
	* @returns {Function[]}
	*/
	listeners(type: string | symbol);
	/**
	* Returns a copy of the array of listeners and wrappers for
	* the event name specified as `type`.
	* @returns {Function[]}
	*/
	rawListeners(type: string | symbol);
	/**
	* Returns an array listing the events for which
	* the emitter has registered listeners.
	* @returns {any[]}
	*/
	eventNames();
	/**
	* Returns the number of listeners listening to event name
	*/
	listenerCount(eventName: string | symbol, listener?: Listener): number;
}
// ----------------------------------------------------------------------------
// EventEmitterAsyncResource
// ----------------------------------------------------------------------------
export declare class EventEmitterAsyncResource extends _EventEmitter {
	/**
	* @param {{
	*   name?: string,
	*   triggerAsyncId?: number,
	*   requireManualDestroy?: boolean,
	* }} [options]
	*/
	constructor(options: any);
	/**
	* @param {symbol,string} event
	* @param  {...any} args
	* @returns {boolean}
	*/
	emit(event: string | symbol, ...args: any[]): boolean;
	/**
	* @returns {void}
	*/
	emitDestroy();
	/**
	* @type {number}
	*/
	get asyncId();
	/**
	* @type {number}
	*/
	get triggerAsyncId();
	/**
	* @type {EventEmitterReferencingAsyncResource}
	*/
	get asyncResource();
}
// ----------------------------------------------------------------------------
// Exported utils
// ----------------------------------------------------------------------------
/**
* Returns an `AsyncIterator` that iterates `event` events.
* @param {EventEmitter} emitter
* @param {string | symbol} event
* @param {{
*    signal: AbortSignal;
*    close?: string[];
*    highWaterMark?: number,
*    lowWaterMark?: number
*   }} [options]
* @returns {AsyncIterator}
*/
export declare const on: typeof nodeEvents.on;
/**
* Creates a `Promise` that is fulfilled when the emitter
* emits the given event.
* @param {EventEmitter} emitter
* @param {string} name
* @param {{ signal: AbortSignal; }} [options]
* @returns {Promise}
*/
export declare const once: typeof nodeEvents.once;
export declare const addAbortListener: typeof nodeEvents.addAbortListener;
/**
* Returns a copy of the array of listeners for the event name
* specified as `type`.
* @returns {Function[]}
*/
export declare const getEventListeners: typeof nodeEvents.getEventListeners;
/**
* Returns the max listeners set.
* @param {EventEmitter | EventTarget} emitterOrTarget
* @returns {number}
*/
export declare const getMaxListeners: typeof nodeEvents.getMaxListeners;
export {};
