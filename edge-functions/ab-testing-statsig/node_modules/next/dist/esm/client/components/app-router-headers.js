export const RSC = 'RSC';
export const NEXT_ROUTER_STATE_TREE = 'Next-Router-State-Tree';
export const NEXT_ROUTER_PREFETCH = 'Next-Router-Prefetch';
export const FETCH_CACHE_HEADER = 'x-vercel-sc-headers';
export const RSC_VARY_HEADER = `${RSC}, ${NEXT_ROUTER_STATE_TREE}, ${NEXT_ROUTER_PREFETCH}`;
export const FLIGHT_PARAMETERS = [
    [
        RSC
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH
    ], 
];

//# sourceMappingURL=app-router-headers.js.map