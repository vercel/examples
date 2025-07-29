import type { PGliteOptions, PGliteInterfaceExtensions } from "@electric-sql/pglite";
import { PGlite } from "@electric-sql/pglite";
import type { Connector } from "db0";
export type ConnectorOptions = PGliteOptions;
export default function pgliteConnector<TOptions extends ConnectorOptions>(opts?: TOptions): Connector<PGlite & PGliteInterfaceExtensions<TOptions["extensions"]>>;
