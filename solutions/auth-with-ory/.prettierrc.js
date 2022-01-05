module.exports = {
  ...require('ory-prettier-styles'),
  importOrder: ['^\\.\\./(?!.*\\.[a-z]+$)(.*)$', '^\\./(?!.*\\.[a-z]+$)(.*)$'],
  importOrderSeparation: true,
  experimentalBabelParserPluginsList: ['jsx', 'typescript']
}
