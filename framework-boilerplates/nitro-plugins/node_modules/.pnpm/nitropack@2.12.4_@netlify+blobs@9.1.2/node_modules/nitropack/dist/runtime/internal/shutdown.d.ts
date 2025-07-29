import type { Server as HttpServer } from "node:http";
import type { NitroApp } from "nitropack/types";
export declare function getGracefulShutdownConfig(): {
    disabled: boolean;
    signals: string[];
    timeout: number;
    forceExit: boolean;
};
export declare function setupGracefulShutdown(listener: HttpServer, nitroApp: NitroApp): void;
