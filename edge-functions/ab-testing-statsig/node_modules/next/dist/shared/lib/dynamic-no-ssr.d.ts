import React from 'react';
export declare function suspense(): void;
declare type Child = React.ReactElement<any, any>;
export default function NoSSR({ children }: {
    children: Child;
}): Child;
export {};
