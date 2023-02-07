/// <reference types="react" />
import type { FlightRouterState } from './app-render';
export declare type ReactReadableStream = ReadableStream<Uint8Array> & {
    allReady?: Promise<void> | undefined;
};
export declare function encodeText(input: string): Uint8Array;
export declare function decodeText(input?: Uint8Array, textDecoder?: TextDecoder): string;
export declare function readableStreamTee<T = any>(readable: ReadableStream<T>): [ReadableStream<T>, ReadableStream<T>];
export declare function chainStreams<T>(streams: ReadableStream<T>[]): ReadableStream<T>;
export declare function streamFromArray(strings: string[]): ReadableStream<Uint8Array>;
export declare function streamToString(stream: ReadableStream<Uint8Array>): Promise<string>;
export declare function createBufferedTransformStream(transform?: (v: string) => string | Promise<string>): TransformStream<Uint8Array, Uint8Array>;
export declare function createInsertedHTMLStream(getServerInsertedHTML: () => Promise<string>): TransformStream<Uint8Array, Uint8Array>;
export declare function renderToInitialStream({ ReactDOMServer, element, streamOptions, }: {
    ReactDOMServer: any;
    element: React.ReactElement;
    streamOptions?: any;
}): Promise<ReactReadableStream>;
export declare function createDeferredSuffixStream(suffix: string): TransformStream<Uint8Array, Uint8Array>;
export declare function createInlineDataStream(dataStream: ReadableStream<Uint8Array>): TransformStream<Uint8Array, Uint8Array>;
export declare function createSuffixStream(suffix: string): TransformStream<Uint8Array, Uint8Array>;
export declare function createRootLayoutValidatorStream(assetPrefix: string | undefined, getTree: () => FlightRouterState): TransformStream<Uint8Array, Uint8Array>;
export declare function continueFromInitialStream(renderStream: ReactReadableStream, { suffix, dataStream, generateStaticHTML, getServerInsertedHTML, serverInsertedHTMLToHead, validateRootLayout, }: {
    suffix?: string;
    dataStream?: ReadableStream<Uint8Array>;
    generateStaticHTML: boolean;
    getServerInsertedHTML?: () => Promise<string>;
    serverInsertedHTMLToHead: boolean;
    validateRootLayout?: {
        assetPrefix?: string;
        getTree: () => FlightRouterState;
    };
}): Promise<ReadableStream<Uint8Array>>;
