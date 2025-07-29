import type { BindingMethod } from '../../parser/bindings.js';
import type { ISCHandlerArg } from '../index.js';
export declare const parse: ({ args }: {
    args: ISCHandlerArg[];
}, getAllBindings: BindingMethod) => {
    schedule: string | undefined;
};
