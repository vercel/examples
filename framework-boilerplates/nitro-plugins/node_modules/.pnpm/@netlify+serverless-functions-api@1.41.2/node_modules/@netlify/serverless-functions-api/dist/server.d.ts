interface Server {
    region?: string;
}
declare const getServerObject: () => Server;
export { getServerObject, Server };
