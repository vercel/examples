import siteConfig from "../../next-log.config";
import type { SiteConfig } from "~types/config";

export type { SiteConfig };

export function getConfig(): SiteConfig {
  return siteConfig;
}
