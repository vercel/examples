//https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: "2025-07-28",
  srcDir: "server",
  routeRules: {
    "/api/dashboard/**": {
      proxy: {
        to: "/**",
      },
    },
  },
});
