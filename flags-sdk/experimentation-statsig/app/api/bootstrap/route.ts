import { getStableId } from "@/utils/get-stable-id";
import { statsigAdapter, Statsig, type StatsigUser } from "@flags-sdk/statsig";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request): Promise<NextResponse> {
  await statsigAdapter.initialize();
  const stableId = await getStableId();

  const user: StatsigUser = {
    customIDs: {
      // since we're not having authentication, we're using the stable id for targeting
      // otherwise, you can define a userID at the root of the user object
      stableID: stableId.value,
    },
  };

  const values = await Statsig.getClientInitializeResponse(user, {
    hash: "djb2",
  });

  return NextResponse.json(values, {
    headers: {
      "Cache-Control": "private, max-age=60",
      Vary: "Cookie",
    },
  });
}