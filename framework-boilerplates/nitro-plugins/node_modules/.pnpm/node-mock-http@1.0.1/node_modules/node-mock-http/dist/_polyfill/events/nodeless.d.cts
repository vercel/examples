import nodeEvents, { EventEmitter as EventEmitter$1 } from 'node:events';

declare const kCapture: unique symbol;
declare const kShapeMode: unique symbol;
type Listener = (...args: any[]) => void;
declare class EventEmitter implements EventEmitter$1 {
    _events: any;
    _eventsCount: number;
    _maxListeners: number | undefined;
    [kCapture]: boolean;
    [kShapeMode]: boolean;
    static captureRejectionSymbol: symbol;
    static errorMonitor: symbol;
    static kMaxEventTargetListeners: symbol;
    static kMaxEventTargetListenersWarned: symbol;
    static usingDomains: boolean;
    static get on(): typeof nodeEvents.on;
    static get once(): typeof nodeEvents.once;
    static get getEventListeners(): typeof nodeEvents.getEventListeners;
    static get getMaxListeners(): typeof nodeEvents.getMaxListeners;
    static get addAbortListener(): typeof nodeEvents.addAbortListener;
    static get EventEmitterAsyncResource(): typeof EventEmitterAsyncResource;
    static get EventEmitter(): typeof EventEmitter;
    static setMaxListeners(n?: number, ...eventTargets: (EventEmitter | EventTarget)[]): void;
    static listenerCount(emitter: EventEmitter$1, type: string): number | undefined;
    static init(): void;
    static get captureRejections(): any;
    static set captureRejections(value: any);
    static get defaultMaxListeners(): number;
    static set defaultMaxListeners(arg: number);
    constructor(opts?: any);
    /**
     * Increases the max listeners of the event emitter.
     * @param {number} n
     * @returns {EventEmitter}
     */
    setMaxListeners(n: number): this;
    /**
     * Returns the current max listener value for the event emitter.
     * @returns {number}
     */
    getMaxListeners(): number;
    /**
     * Synchronously calls each of the listeners registered
     * for the event.
     * @param {...any} [args]
     * @returns {boolean}
     */
    emit(type: string | symbol, ...args: any[]): boolean;
    /**
     * Adds a listener to the event emitter.
     * @returns {EventEmitter}
     */
    addListener(type: string | symbol, listener: Listener): this;
    on(type: string | symbol, listener: Listener): this;
    /**
     * Adds the `listener` function to the beginning of
     * the listeners array.
     */
    prependListener(type: string | symbol, listener: Listener): this;
    /**
     * Adds a one-time `listener` function to the event emitter.
     */
    once(type: string | symbol, listener: Listener): this;
    /**
     * Adds a one-time `listener` function to the beginning of
     * the listeners array.
     */
    prependOnceListener(type: string | symbol, listener: Listener): this;
    /**
     * Removes the specified `listener` from the listeners array.
     * @param {string | symbol} type
     * @param {Function} listener
     * @returns {EventEmitter}
     */
    removeListener(type: string | symbol, listener: Listener): this;
    off(type: string | symbol, listener: Listener): this;
    /**
     * Removes all listeners from the event emitter. (Only
     * removes listeners for a specific event name if specified
     * as `type`).
     */
    removeAllListeners(type?: string | symbol): this;
    /**
     * Returns a copy of the array of listeners for the event name
     * specified as `type`.
     * @param {string | symbol} type
     * @returns {Function[]}
     */
    listeners(type: string | symbol): any[];
    /**
     * Returns a copy of the array of listeners and wrappers for
     * the event name specified as `type`.
     * @returns {Function[]}
     */
    rawListeners(type: string | symbol): any[];
    /**
     * Returns an array listing the events for which
     * the emitter has registered listeners.
     * @returns {any[]}
     */
    eventNames(): (string | symbol)[];
    /**
     * Returns the number of listeners listening to event name
     */
    listenerCount(eventName: string | symbol, listener?: Listener): number;
}
declare class EventEmitterAsyncResource extends EventEmitter {
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
    emitDestroy(): void;
    /**
     * @type {number}
     */
    get asyncId(): any;
    /**
     * @type {number}
     */
    get triggerAsyncId(): any;
    /**
     * @type {EventEmitterReferencingAsyncResource}
     */
    get asyncResource(): any;
}

export { EventEmitter };
