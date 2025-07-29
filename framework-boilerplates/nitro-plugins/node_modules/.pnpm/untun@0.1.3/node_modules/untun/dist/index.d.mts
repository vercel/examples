interface TunnelOptions {
    url?: string;
    port?: number | string;
    hostname?: string;
    protocol?: "http" | "https";
    verifyTLS?: boolean;
    acceptCloudflareNotice?: boolean;
}
interface Tunnel {
    getURL: () => Promise<string>;
    close: () => Promise<void>;
}
declare function startTunnel(opts: TunnelOptions): Promise<undefined | Tunnel>;

export { type Tunnel, type TunnelOptions, startTunnel };
