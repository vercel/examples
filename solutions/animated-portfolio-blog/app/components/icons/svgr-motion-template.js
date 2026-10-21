/**
 *
 * Usage:
 *        npx @svgr/cli ./ --template svgr-motion-template.js --out-dir ./ --ext tsx --no-svgo
 * */
module.exports = ({ imports, interfaces, componentName, props, jsx, exports }, { tpl }) => {
  let jsxString = jsx;
  // Generate final component
  return tpl`
${imports}


${interfaces}

const ${componentName} = (${props}) => (
  ${jsxString}
);

${componentName}.displayName = "${componentName}";

${exports}
  `;
};
