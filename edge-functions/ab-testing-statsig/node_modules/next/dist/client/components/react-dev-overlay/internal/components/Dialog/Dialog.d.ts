import * as React from 'react';
export declare type DialogProps = {
    type: 'error' | 'warning';
    'aria-labelledby': string;
    'aria-describedby': string;
    onClose?: (e: MouseEvent | TouchEvent) => void;
};
declare const Dialog: React.FC<DialogProps>;
export { Dialog };
