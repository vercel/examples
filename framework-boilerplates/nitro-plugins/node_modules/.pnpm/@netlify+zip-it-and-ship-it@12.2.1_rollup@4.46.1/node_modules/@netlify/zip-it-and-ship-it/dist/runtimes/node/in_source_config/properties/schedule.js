import babelTypes from '@babel/types';
export const parse = ({ args }, getAllBindings) => {
    let [expression] = args;
    if (expression.type === 'Identifier') {
        const binding = getAllBindings().get(expression.name);
        if (binding && babelTypes.isExpression(binding)) {
            expression = binding;
        }
    }
    const schedule = expression.type === 'StringLiteral' ? expression.value : undefined;
    return {
        schedule,
    };
};
