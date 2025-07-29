export interface Geo {
    city?: string;
    country?: {
        code?: string;
        name?: string;
    };
    postalCode?: string;
    subdivision?: {
        code?: string;
        name?: string;
    };
    latitude?: number;
    longitude?: number;
    timezone?: string;
}
export declare const parseGeoHeader: (geoHeader: string | null) => Geo;
