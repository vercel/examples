interface Site {
    id?: string;
    name?: string;
    url?: string;
}
declare const getSiteObject: () => Site;
export { getSiteObject, Site };
