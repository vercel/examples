import { getStableId } from "@/utils/get-stable-id";
import { ldAdapter, type LDContext } from "@flags-sdk/launchdarkly";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request): Promise<NextResponse> {
  await ldAdapter.ldClient.waitForInitialization();
  const stableId = await getStableId();

  const user: LDContext = {
    kind: 'user',
    key: stableId.value,
  };

  const values = (await ldAdapter.ldClient.allFlagsState(user))?.toJSON();

  return NextResponse.json({ user, values }, {
    headers: {
      "Cache-Control": "private, max-age=60",
      Vary: "Cookie",
    },
  });
}
