import type { ChildSegmentMap } from '../../shared/lib/app-router-context';
import type { FlightRouterState, FlightSegmentPath } from '../../server/app-render';
import type { ErrorComponent } from './error-boundary';
import type { ChildProp } from '../../server/app-render';
import React from 'react';
/**
 * InnerLayoutRouter handles rendering the provided segment based on the cache.
 */
export declare function InnerLayoutRouter({ parallelRouterKey, url, childNodes, childProp, segmentPath, tree, path, rootLayoutIncluded, }: {
    parallelRouterKey: string;
    url: string;
    childNodes: ChildSegmentMap;
    childProp: ChildProp | null;
    segmentPath: FlightSegmentPath;
    tree: FlightRouterState;
    isActive: boolean;
    path: string;
    rootLayoutIncluded: boolean;
}): JSX.Element | null;
/**
 * OuterLayoutRouter handles the current segment as well as <Offscreen> rendering of other segments.
 * It can be rendered next to each other with a different `parallelRouterKey`, allowing for Parallel routes.
 */
export default function OuterLayoutRouter({ parallelRouterKey, segmentPath, childProp, error, errorStyles, templateStyles, loading, loadingStyles, hasLoading, template, notFound, notFoundStyles, rootLayoutIncluded, }: {
    parallelRouterKey: string;
    segmentPath: FlightSegmentPath;
    childProp: ChildProp;
    error: ErrorComponent;
    errorStyles: React.ReactNode | undefined;
    templateStyles: React.ReactNode | undefined;
    template: React.ReactNode;
    loading: React.ReactNode | undefined;
    loadingStyles: React.ReactNode | undefined;
    hasLoading: boolean;
    notFound: React.ReactNode | undefined;
    notFoundStyles: React.ReactNode | undefined;
    rootLayoutIncluded: boolean;
}): JSX.Element;
