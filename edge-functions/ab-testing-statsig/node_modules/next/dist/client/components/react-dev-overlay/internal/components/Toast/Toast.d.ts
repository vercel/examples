import * as React from 'react';
export declare type ToastProps = {
    onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    className?: string;
};
export declare const Toast: React.FC<ToastProps>;
