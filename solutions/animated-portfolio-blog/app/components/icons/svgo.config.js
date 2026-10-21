/**
 * SVGO configuration file
 * Usage:
 *        svgo --config svgo.config.js -f ./
 */
module.exports = {
  plugins: [
    "removeXMLNS",
    "removeDimensions",
    {
      name: "cleanupAttrs",
      params: { newlines: true },
    },
    "removeUselessDefs",
    "convertStyleToAttrs",
    "removeScripts",
    "removeUnknownsAndDefaults",
    "cleanupIds",
    "removeDoctype",
    "removeComments",
  ],
};
