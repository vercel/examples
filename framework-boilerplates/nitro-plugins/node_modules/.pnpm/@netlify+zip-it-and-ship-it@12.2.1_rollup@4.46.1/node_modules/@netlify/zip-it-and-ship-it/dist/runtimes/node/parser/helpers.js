const isDotExpression = (node, expression) => {
    if (node.type !== 'MemberExpression') {
        return false;
    }
    const object = expression.slice(0, -1);
    const [property] = expression.slice(-1);
    if (node.property.type !== 'Identifier' || node.property.name !== property) {
        return false;
    }
    if (object.length > 1) {
        return isDotExpression(node.object, object);
    }
    return node.object.type === 'Identifier' && object[0] === node.object.name && property === node.property.name;
};
export const isESMImportExport = (node) => node.type === 'ImportDeclaration' ||
    node.type === 'ExportNamedDeclaration' ||
    node.type === 'ExportDefaultDeclaration' ||
    node.type === 'ExportAllDeclaration';
export const isImport = (node, importPath) => node.type === 'ImportDeclaration' && node.source.value === importPath;
export const isModuleExports = (node, dotExpression = ['module', 'exports']) => node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    isDotExpression(node.expression.left, dotExpression);
export const isRequire = (node, requirePath) => {
    if (!node || node.type !== 'CallExpression') {
        return false;
    }
    const { arguments: args, callee } = node;
    const isRequiredModule = args[0]?.type === 'StringLiteral' && isRequirePath(args[0], requirePath);
    return isRequireCall(callee) && isRequiredModule;
};
const isRequireCall = (node) => node.type === 'Identifier' && node.name === 'require';
const isRequirePath = (node, path) => node.type === 'StringLiteral' && node.value === path;
