const withTM = require("next-transpile-modules")([
  "@vercel/examples-ui",
  "@company/ui",
]);

module.exports = withTM({
  reactStrictMode: true,
});
