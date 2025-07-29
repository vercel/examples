interface GetPortOptions {
    name: string;
    random: boolean;
    port: number;
    ports: number[];
    portRange: [fromInclusive: number, toInclusive: number];
    alternativePortRange: [fromInclusive: number, toInclusive: number];
    host: string;
    verbose?: boolean;
    public?: boolean;
}
interface WaitForPortOptions {
    host?: HostAddress;
    delay?: number;
    retries?: number;
}
type GetPortInput = Partial<GetPortOptions> | number | string;
type HostAddress = undefined | string;
type PortNumber = number;

declare function getPort(_userOptions?: GetPortInput): Promise<PortNumber>;
declare function getRandomPort(host?: HostAddress): Promise<number>;
declare function waitForPort(port: PortNumber, options?: WaitForPortOptions): Promise<void>;
declare function checkPort(port: PortNumber, host?: HostAddress | HostAddress[], verbose?: boolean): Promise<PortNumber | false>;

declare function isUnsafePort(port: number): boolean;
declare function isSafePort(port: number): boolean;

interface GetSocketOptions {
    name: string;
    /**
     * Use process ID in the socket name.
     */
    pid?: boolean;
    /**
     * Use a random number in the socket name.
     *
     */
    random?: boolean;
}
/**
 * Generates a socket address based on the provided options.
 */
declare function getSocketAddress(opts: GetSocketOptions): string;
/**
 * Test if the current environment supports sockets.
 */
declare function isSocketSupported(): Promise<boolean>;
declare function cleanSocket(path: string): Promise<void>;

export { checkPort, cleanSocket, getPort, getRandomPort, getSocketAddress, isSafePort, isSocketSupported, isUnsafePort, waitForPort };
export type { GetPortInput, GetPortOptions, GetSocketOptions, HostAddress, PortNumber, WaitForPortOptions };
