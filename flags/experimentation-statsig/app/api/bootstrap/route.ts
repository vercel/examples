import { getStableId } from "@/utils/get-stable-id";
import { statsigAdapter } from "@flags-sdk/statsig";
import { NextResponse } from "next/server";
import Statsig, { StatsigUser } from "statsig-node-lite";

export const runtime = "edge";

export async function GET(request: Request): Promise<NextResponse> {
  await statsigAdapter.initialize();
  const visitorId = await getStableId();

  const user: StatsigUser = {
    customIDs: {
      stableID: visitorId.value,
    },
  };

  const values = await Statsig.getClientInitializeResponse(user, {
    hash: "djb2",
  });

  /**
   * ```
   * Response {
   *  values: <StatsigClientInitializeResponse>
   *  user: <StatsigUser>,
   *  }
   */
  return new NextResponse(JSON.stringify({ user, values: JSON.stringify(values) }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, max-age=60",
      Vary: "Cookie",
    },
  });
}