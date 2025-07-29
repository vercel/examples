import { type ExportResult } from '@opentelemetry/core';
import { type IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';
import type { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-node';
export declare class NetlifySpanExporter implements SpanExporter {
    #private;
    constructor();
    /** Convert a readable span array to the OTLP Trace protocol */
    convert(spans: ReadableSpan[]): IExportTraceServiceRequest;
    /** Export spans. */
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    /**
     * Shutdown the exporter.
     */
    shutdown(): Promise<void>;
    /**
     * Exports any pending spans in the exporter
     */
    forceFlush(): Promise<void>;
}
