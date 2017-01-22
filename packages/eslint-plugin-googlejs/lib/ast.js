/**
 * @fileoverview Matchers for the AST.
 */

goog.module('googlejs.ast');

const astMatcher = goog.require('googlejs.astMatcher');

/**
 * Returns an ancestor node of the given node that matches the testFunction.  If
 * there is no ancestor node with the specified type then return null.
 * @param {!AST.Node} node Node to start from.
 * @param {function(!AST.Node): boolean} testFunction
 * @return {?AST.Node} A matching ancestor node or null.
 */
function findAncestor(node, testFunction) {
  let parent = node.parent;

  while (!testFunction(parent) && parent.type !== 'Program') {
    parent = parent.parent;
  }
  return testFunction(parent) ? parent : null;
}
/**
 * Returns an ancestor node of the given node that has the specified type.  If
 * there is no ancestor node with the specified type then return null.
 * @param {!AST.Node} node Node to examine.
 * @param {string} type The AST.NodeType that is being looked for.
 * @return {?AST.Node} A matching ancestor node or null.
 */
function findAncestorOfType(node, type) {
  return findAncestor(node, (ancestor) => ancestor.type == type);
}

/**
 * Checks whether a given node is a loop node or not.
 * The following types are loop nodes:
 *
 * - DoWhileStatement
 * - ForInStatement
 * - ForOfStatement
 * - ForStatement
 * - WhileStatement
 *
 * @param {!AST.Node} node - A node to check.
 * @return {boolean} `true` if the node is a loop node.
 */
function isLoop(node) {
  const anyLoopPattern = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/;
  return anyLoopPattern.test(node.type);
}

/**
 * Checks whether a given node is a function node or not.
 * The following types are function nodes:
 *
 * - ArrowFunctionExpression
 * - FunctionDeclaration
 * - FunctionExpression
 *
 * @param {!AST.Node} node - A node to check.
 * @return {boolean} `true` if the node is a function node.
 */
function isFunction(node) {
  const anyFunctionPattern =
        /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/;
  return anyFunctionPattern.test(node.type);
}

/**
 * Returns true if node is a string literal.
 * @param {!AST.Node} node
 * @return {(!Object|boolean)}
 */
function matchStringLiteral(node) {
  return astMatcher.isASTMatch(node, {
    type: 'Literal',
    value: (/** * */ v) => typeof v === 'string',
  });
}

/**
 * If node is a string literal then return an object with the given propertyName
 * set to the literal.
 * @param {!AST.Node} node
 * @param {string=} propertyName
 * @return {(!Object|boolean)}
 */
function matchExtractStringLiteral(node, propertyName) {
  // TODO(jschaf): Why don't default values work? e.g. propertyName = 'literal'
  const name = propertyName || 'literal';
  return astMatcher.isASTMatch(node, {
    type: 'Literal',
    value: (/** * */ v) => typeof v === 'string' &&
        astMatcher.extractAST(name)(v),
  });
}

/**
 * The extracted module name of a goog.require call or false.
 * @typedef {({
 *   source: string,
 * }|boolean)}
 */
let GoogDependencyMatch;

/**
 * If node is a bare goog.require call, return an object with it's source module
 * name.  Otherwise return false.
 * @param {!AST.Node} node
 * @return {!GoogDependencyMatch}
 */
function matchExtractBareGoogRequire(node) {
  return /** @type {!GoogDependencyMatch} */ (astMatcher.isASTMatch(node, {
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
        (/** !AST.Node */ v) => matchExtractStringLiteral(v, 'source'),
      ],
    },
  }));
}

/**
 * If node is a goog.provide call return an object with the provided name as the
 * property `source`, otherwise return false.
 * @param {!AST.Node} node
 * @return {!GoogDependencyMatch}
 */
function matchExtractGoogProvide(node) {
  return /** @type {!GoogDependencyMatch} */ (astMatcher.isASTMatch(node, {
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
        (/** !AST.Node */ v) => matchExtractStringLiteral(v, 'source'),
      ],
    },
  }));
}

/**
 * The extracted string literal of a directive, like 'use strict'.
 * @typedef {({
 *   directive: string,
 * }|boolean)}
 */
let DirectiveMatch;

/**
 * If node is a string directive return an object with the string literal as the
 * property directive, otherwise return false.
 * @param {!AST.Node} node
 * @return {!DirectiveMatch}
 */
function matchExtractDirective(node) {
  return /** @type {!DirectiveMatch} */ (astMatcher.isASTMatch(node, {
    type: 'ExpressionStatement',
    expression: (/** !AST.Node */ v) =>
        matchExtractStringLiteral(v, 'directive'),
  }));
}

/**
 * Returns the complete string of member expression node, e.g. `'foo.bar.baz'`.
 *
 * Assumes that the given node is the outer-most object, i.e. the `foo` in
 * `foo.bar.baz`.
 * @param {!AST.Identifier} node
 * @return {string}
 */
function getFullyQualifedName(node) {
  let fullName = node.name;
  let ancestor = node;
  while (ancestor.parent && ancestor.parent.type == 'MemberExpression') {
    ancestor = /** @type {!AST.MemberExpression} */ (ancestor.parent);
    // The property must be an identifier because MemberExpressions are left
    // associative.
    const identifier = /** @type {!AST.Identifier} */ (ancestor.property);
    fullName += `.${identifier.name}`;
  }
  return fullName;
}


exports = {
  findAncestor,
  findAncestorOfType,
  getFullyQualifedName,
  isLoop,
  isFunction,
  matchExtractBareGoogRequire,
  matchExtractGoogProvide,
  matchExtractDirective,
  matchExtractStringLiteral,
  matchStringLiteral,
};
