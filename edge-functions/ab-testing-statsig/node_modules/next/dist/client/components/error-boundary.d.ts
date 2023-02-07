import React from 'react';
export declare type ErrorComponent = React.ComponentType<{
    error: Error;
    reset: () => void;
}>;
interface ErrorBoundaryProps {
    errorComponent: ErrorComponent;
    errorStyles?: React.ReactNode | undefined;
}
/**
 * Renders error boundary with the provided "errorComponent" property as the fallback.
 * If no "errorComponent" property is provided it renders the children without an error boundary.
 */
export declare function ErrorBoundary({ errorComponent, errorStyles, children, }: ErrorBoundaryProps & {
    children: React.ReactNode;
}): JSX.Element;
export declare function GlobalErrorComponent({ error }: {
    error: any;
}): JSX.Element;
export {};
