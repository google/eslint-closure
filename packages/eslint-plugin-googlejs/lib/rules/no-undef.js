/**
 * @fileoverview Rule to flag references to undeclared variables.
 */

goog.module('closureLint.rules.noUndef');

const ast = goog.require('closureLint.ast');
const utils = goog.require('closureLint.utils');

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {!AST.Node} node The AST node being checked.
 * @return {boolean} Whether or not the node is the argument of a typeof
 *     operator.
 */
function hasTypeOfOperator(node) {
  const parent = node.parent;

  return parent.type === 'UnaryExpression' &&
      /** @type {!AST.UnaryExpression} */ (parent).operator === 'typeof';
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
   * @return {!Object<!AST.NodeType, function(!AST.Node)>}
   */
  create(context) {
    const options = /** @type {!NoUndefRuleOptions} */ (context.options[0]);
    const considerTypeOf = options && options.typeof === true || false;

    /** @type {!Array<string>} */
    let googRequiredStrings = [];

    /** @type {!Array<string>} */
    let googProvidedStrings = [];

    return {
      /** @param {!AST.Program} programNode */
      Program(programNode) {
        googRequiredStrings = programNode.body
            .map(ast.matchExtractBareGoogRequire)
             // No eta reduction because Closure complains about types.
            .filter((b) => Boolean(b))
            .map((dependency) => dependency.source);

        googProvidedStrings = programNode.body
            .map(ast.matchExtractGoogProvide)
            .filter((b) => Boolean(b))
            .map((dependency) => dependency.source);
      },

      'Program:exit': () => {
        const globalScope = context.getScope();
        const undeclaredVariables = globalScope.through;

        /**
         * @param {string} fullName
         * @return {boolean}
         */
        function isGoogProvided(fullName) {
          return googProvidedStrings.some(
            (provided) => utils.isValidPrefix(fullName, provided));
        }

        /**
         * @param {string} fullName
         * @return {boolean}
         */
        function isGoogRequired(fullName) {
          return googRequiredStrings.some(
            (required) => utils.isValidPrefix(fullName, required));
        }

        undeclaredVariables.forEach((ref) => {
          /** @type {!AST.Identifier} */
          const identifier = ref.identifier;
          const fullName = ast.getFullyQualifedName(identifier);

          if (!considerTypeOf && hasTypeOfOperator(identifier)) {
            return;
          } else if (isGoogProvided(fullName) || isGoogRequired(fullName)) {
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
