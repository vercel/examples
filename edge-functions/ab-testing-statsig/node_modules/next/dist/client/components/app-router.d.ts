import type { ReactNode } from 'react';
import type { FlightRouterState, FlightData } from '../../server/app-render';
/**
 * Fetch the flight data for the provided url. Takes in the current router state to decide what to render server-side.
 */
export declare function fetchServerResponse(url: URL, flightRouterState: FlightRouterState, prefetch?: true): Promise<[FlightData: FlightData, canonicalUrlOverride: URL | undefined]>;
declare type AppRouterProps = {
    initialHead: ReactNode;
    initialTree: FlightRouterState;
    initialCanonicalUrl: string;
    children: ReactNode;
    assetPrefix: string;
};
export default function AppRouter(props: AppRouterProps): JSX.Element;
export {};
