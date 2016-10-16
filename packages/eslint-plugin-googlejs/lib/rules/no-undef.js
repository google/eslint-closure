/**
 * @fileoverview Rule to flag references to undeclared variables.
 */
goog.module('googlejs.rules.noUndef');

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {!ESLint.ASTNode} node The AST node being checked.
 * @return {boolean} Whether or not the node is the argument of a typeof
 *     operator.
 */
function hasTypeOfOperator(node) {
  const parent = node.parent;

  return parent.type === 'UnaryExpression' &&
      /** @type {!Espree.UnaryExpression} */ (parent).operator === 'typeof';
}

/**
 * Valid options for the no-undef rule.
 * @typedef {{
 *   typeof: boolean,
 * }}
 */
let NoUndefRuleOptions;

/** @const {!ESLint.RuleDefinition} */
const NO_UNDEF_RULE = {
  meta: {
    docs: {
      description: 'disallow the use of undeclared variables unless ' +
          'mentioned in `/*global */` comments',
      category: 'Variables',
      recommended: true,
    },

    schema: [
      {
        type: 'object',
        properties: {
          typeof: {type: 'boolean'},
        },
        additionalProperties: false,
      },
    ],
  },

  /**
   * @param {!ESLint.RuleContext} context
   * @return {!Object<!Espree.NodeType, function(!ESLint.ASTNode)>}
   */
  create(context) {
    const options = /** @type {!NoUndefRuleOptions} */ (context.options[0]);
    const considerTypeOf = options && options.typeof === true || false;

    return {
      'Program:exit': () => {
        const globalScope = context.getScope();

        globalScope.through.forEach((ref) => {
          const identifier = ref.identifier;

          if (!considerTypeOf && hasTypeOfOperator(identifier)) {
            return;
          }

          context.report({
            node: identifier,
            message: `'${identifier.name}' is not defined.`,
          });
        });
      },
    };
  },
};

exports = NO_UNDEF_RULE;
