const getBindingFromVariableDeclaration = function (node, bindings) {
    node.declarations.forEach((declaration) => {
        if (declaration.id.type === 'Identifier' && declaration.init) {
            bindings.set(declaration.id.name, declaration.init);
        }
    });
};
const getBindingsFromNode = function (node, bindings) {
    if (node.type === 'FunctionDeclaration' && node.id?.name) {
        bindings.set(node.id.name, node);
    }
    else if (node.type === 'VariableDeclaration') {
        // A variable was created, so create it and store the potential value
        getBindingFromVariableDeclaration(node, bindings);
    }
    else if (node.type === 'ExpressionStatement' &&
        node.expression.type === 'AssignmentExpression' &&
        node.expression.left.type === 'Identifier') {
        // The variable was reassigned, so let's store the new value
        bindings.set(node.expression.left.name, node.expression.right);
    }
    else if (node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'VariableDeclaration') {
        // A `export const|let ...` creates a binding that can later be referenced again
        getBindingFromVariableDeclaration(node.declaration, bindings);
    }
};
/**
 * Goes through all relevant nodes and creates a map from binding name to assigned value/expression
 */
const getAllBindings = function (nodes) {
    const bindings = new Map();
    nodes.forEach((node) => {
        getBindingsFromNode(node, bindings);
    });
    return bindings;
};
export const createBindingsMethod = function (nodes) {
    // memoize the result for these nodes
    let result;
    return () => {
        if (!result) {
            result = getAllBindings(nodes);
        }
        return result;
    };
};
