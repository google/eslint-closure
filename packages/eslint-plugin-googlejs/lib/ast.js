/**
 * @fileoverview Matchers for the AST.
 */

goog.module('googlejs.ast');

const astMatcher = goog.require('googlejs.astMatcher');

/**
 * If node is a string literal then return true.
 * @param {!AST.Node} node
 * @return {(!Object|boolean)}
 */
function matchStringLiteral(node) {
  return astMatcher.isASTMatch(node, {
    type: 'Literal',
    value: (v) => typeof v === 'string',
  });
}

/**
 * The extracted module name of a goog.require call or false.
 * @type {({
 *   source: string,
 * }|boolean)}
 */
let GoogDependencyMatch;

/**
 * If node is a bare goog.require call return an object with it's source module
 * name.  Otherwise return false.
 * @param {!AST.Node} node
 * @return {!GoogDependencyMatch}
 */
function matchExtractBareGoogRequire(node) {
  return astMatcher.isASTMatch(node, {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'goog',
        },
        property: {
          type: 'Identifier',
          name: 'require',
        },
      },
      arguments: [
        {
          type: 'Literal',
          value: (v) => typeof v === 'string' &&
              astMatcher.extractAST('source')(v),
        },
      ],
    },
  });
}


/**
 * If node is a goog.provide call return an object with the provided name as the
 * property source, otherwise return false.
 * @param {!AST.Node} node
 * @return {!GoogDependencyMatch}
 */
function matchExtractGoogProvide(node) {
  return astMatcher.isASTMatch(node, {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'goog',
        },
        property: {
          type: 'Identifier',
          name: 'provide',
        },
      },
      arguments: [
        {
          type: 'Literal',
          value: (v) => typeof v === 'string' &&
              astMatcher.extractAST('source')(v),
        },
      ],
    },
  });
}

exports = {
  matchExtractBareGoogRequire,
  matchExtractGoogProvide,
  matchStringLiteral,
};
