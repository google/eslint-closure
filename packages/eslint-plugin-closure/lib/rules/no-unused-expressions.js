/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * @author Michael Ficarra
 */

goog.module('eslintClosure.rules.noUnusedExpressions');

const array = goog.require('goog.array');

const ast = goog.require('eslintClosure.ast');
const jsdocUtils = goog.require('eslintClosure.jsdocUtils');

/**
  * @param {!AST.Node} node - any node
  * @return {boolean} whether the given node structurally represents a
  * directive
  */
function looksLikeDirective(node) {
  return !!ast.matchExtractDirective(node);
}

/**
  * @param {function(T): boolean} predicate
  * @param {!Array<T>} list
  * @return {!Array<T>}
  * @template T
  */
function takeWhile(predicate, list) {
  for (let i = 0; i < list.length; ++i) {
    if (!predicate(list[i])) {
      return list.slice(0, i);
    }
  }
  return list.slice();
}

/**
  * Returns an array of directives at the beginning of block or program.
  * @param {(!AST.Program|!AST.BlockStatement)} node
  * @return {!Array<!AST.Node>} The leading sequence of directive
  *     nodes.
  */
function getLeadingDirectives(node) {
  return takeWhile(looksLikeDirective, node.body);
}

/**
  * @param {!AST.Node} node
  * @param {!Array<!AST.Node>} ancestors
  * @return {boolean} Whether the given node is considered a directive in
  * its current position
  */
function isDirective(node, ancestors) {
  const parent = ancestors[ancestors.length - 1];
  const grandparent = ancestors[ancestors.length - 2];

  const isInFunction = parent.type === 'BlockStatement' &&
        /Function/.test(grandparent.type);
  if (parent.type === 'Program' || isInFunction) {
    const p = /** @type {(!AST.Program|!AST.BlockStatement)} */ (parent);
    return array.contains(getLeadingDirectives(p), node);
  } else {
    return false;
  }
}

/**
 * Returns true if a node has type information in its JSDoc comment.
 * @param {!AST.Node} node
 * @return {boolean}
 */
function hasJSDocTypeInfo(node) {
  const comment = jsdocUtils.getJSDocComment(node);
  if (!comment) return false;
  try {
    const jsdoc = jsdocUtils.parseComment(comment.value);
    return jsdocUtils.hasTypeInformation(jsdoc);
  } catch (e) {
    return false;
  }
}

/**
 * Valid options for the no-unused-expressions rule.
 * @typedef {{
 *   allowShortCircuit: (boolean|undefined),
 *   allowTernary: (boolean|undefined),
 * }}
 */
let RuleOptions;

/** @const {!ESLint.RuleDefinition} */
const NO_UNUSED_EXPRESSIONS_RULE = {
  meta: {
    docs: {
      description: 'disallow unused expressions',
      category: 'Best Practices',
      recommended: false,
    },

    schema: [
      {
        type: 'object',
        properties: {
          allowShortCircuit: {
            type: 'boolean',
          },
          allowTernary: {
            type: 'boolean',
          },
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
    /** @const {!RuleOptions} */
    const config = /** @type {!RuleOptions} */ (context.options[0]) || {};
    /** @const {boolean} */
    const allowShortCircuit = config.allowShortCircuit || false;
    /** @const {boolean} */
    const allowTernary = config.allowTernary || false;

    /**
     * Determines whether or not a given node is a valid expression. Recurses on
     * short circuit eval and ternary nodes if enabled by flags.
     * @param {!AST.Node} node - any node
     * @return {boolean} whether the given node is a valid expression
     */
    function isValidExpression(node) {
      if (allowTernary) {
        // Recursive check for ternary and logical expressions
        if (node.type === 'ConditionalExpression') {
          const conditional = /** @type {!AST.ConditionalExpression} */ (node);
          return isValidExpression(conditional.consequent) &&
              isValidExpression(conditional.alternate);
        }
      }
      if (allowShortCircuit) {
        if (node.type === 'LogicalExpression') {
          return isValidExpression(
              /** @type {!AST.LogicalExpression} */ (node).right);
        }
      }

      const isReturnableRegexp =
            /^(?:Assignment|Call|New|Update|Yield|Await)Expression$/;
      const isNodeReturnable = isReturnableRegexp.test(node.type);
      const isDeleteOrVoid = node.type === 'UnaryExpression' &&
            ['delete', 'void'].indexOf(
                /** @type {!AST.UnaryExpression} */ (node).operator) >= 0;

      return isNodeReturnable || isDeleteOrVoid;
    }

    return {

      /** @param {!AST.ExpressionStatement} node */
      ExpressionStatement(node) {
        if (!isValidExpression(node.expression) &&
            !isDirective(node, context.getAncestors()) &&
            !hasJSDocTypeInfo(node)) {
          context.report({
            node: node,
            message: 'Expected an assignment or function call and' +
                ' instead saw an expression.',
          });
        }
      },
    };

  },
};

exports = NO_UNUSED_EXPRESSIONS_RULE;
