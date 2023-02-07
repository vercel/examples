import * as React from 'react';
import { ReadyRuntimeError } from '../helpers/getErrorByType';
export declare type RuntimeErrorProps = {
    error: ReadyRuntimeError;
};
declare const RuntimeError: React.FC<RuntimeErrorProps>;
export declare const styles: string;
export { RuntimeError };
