import { SupportedErrorEvent } from '../container/Errors';
import { OriginalStackFrame } from './stack-frame';
export declare type ReadyRuntimeError = {
    id: number;
    runtime: true;
    error: Error;
    frames: OriginalStackFrame[];
};
export declare function getErrorByType(ev: SupportedErrorEvent): Promise<ReadyRuntimeError>;
