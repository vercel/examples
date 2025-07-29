export type Filter = {
    bundle?: string | null | undefined;
    file?: string | null | undefined;
};
export declare const createFilter: (include: Filter | Filter[] | undefined, exclude: Filter | Filter[] | undefined) => (bundleId: string, id: string) => boolean;
