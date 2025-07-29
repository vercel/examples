import { $fetch } from "ofetch";
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch;
}
