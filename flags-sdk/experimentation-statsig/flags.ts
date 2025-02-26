import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
import { Identify } from "flags";
import { dedupe, flag } from "flags/next";
import { getStableId } from "./utils/get-stable-id";

const identify = dedupe(async () => {
  const stableId = await getStableId();

  return {
    customIDs: {
      stableID: stableId.value
    },
  };
}) satisfies Identify<StatsigUser>;

export const showSummerBannerFlag = flag<boolean, StatsigUser>({
  key: 'summer_sale',
  adapter: statsigAdapter.featureGate((gate) => gate.value),
  defaultValue: false,
  identify,
});

export const showFreeDeliveryBannerFlag = flag<boolean, StatsigUser>({
  key: 'free_delivery',
  adapter: statsigAdapter.featureGate((gate) => gate.value),
  defaultValue: false,
  identify,
});

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const;
