import type { APIGatewayProxyEventV2 } from "aws-lambda";
import "#nitro-internal-pollyfills";
export declare const handler: import("aws-lambda").StreamifyHandler<APIGatewayProxyEventV2, void>;
