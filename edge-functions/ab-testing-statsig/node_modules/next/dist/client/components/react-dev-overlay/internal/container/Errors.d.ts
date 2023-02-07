import * as React from 'react';
import { UnhandledErrorAction, UnhandledRejectionAction } from '../error-overlay-reducer';
export declare type SupportedErrorEvent = {
    id: number;
    event: UnhandledErrorAction | UnhandledRejectionAction;
};
export declare type ErrorsProps = {
    errors: SupportedErrorEvent[];
    initialDisplayState: DisplayState;
};
declare type DisplayState = 'minimized' | 'fullscreen' | 'hidden';
export declare const Errors: React.FC<ErrorsProps>;
export declare const styles: string;
export {};
