/**
 * @fileoverview Utilities for working with ESLint AST nodes and tokens.
 */
goog.module('googlejs.utils');

const types = goog.require('googlejs.types');

/**
 * Returns true if the end of the left node is the same as the start of the
 * right node.
 * @param {!Espree.Node} left The left token object.
 * @param {!Espree.Node} right The right token object.
 * @return {boolean} Whether or not the tokens are on the same line.
 */
function nodesShareOneLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

/**
 * Returns true if a node exists entirely on one line.
 * @param {!Espree.Node} node
 * @return {boolean} Whether or not the tokens are on the same line.
 */
function isNodeOneLine(node) {
  return nodesShareOneLine(node, node);
}

/**
 * Returns true if both tokens start on the same line.
 * @param {!Espree.Node} node1
 * @param {!Espree.Node} node2
 * @return {boolean}
 */
function nodesStartOnSameLine(node1, node2) {
  return node1.loc.start.line === node2.loc.start.line;
}

/**
 * Returns true if both tokens end on the same line.
 * @param {!Espree.Node} node1
 * @param {!Espree.Node} node2
 * @return {boolean}
 */
function nodesEndOnSameLine(node1, node2) {
  return node1.loc.end.line === node2.loc.end.line;
}

/**
 * Checks if a string contains an underscore.
 * @param {string} name The string to check.
 * @return {boolean} If the string is underscored.
 */
function isUnderscored(name) {
  return name.indexOf('_') > -1;
}

/**
 * Determines the type of underscore that an indentifer contains.
 * @param {string} name The string to check.
 * @return {!types.UnderscoreForm} The type of underscored identifier.
 */
function categorizeUnderscoredIdentifier(name) {
  if (name === '' || name.length === 0) {
    return types.UnderscoreForm.NO_UNDERSCORE;

  } else if (name.toUpperCase() === name) {
    return types.UnderscoreForm.CONSTANT;

  } else if (name.indexOf('_') === -1) {
    // This check must come after the constant check otherwise we wrongly
    // categorize identifiers like ALLCAPS.
    return types.UnderscoreForm.NO_UNDERSCORE;

  } else if (name === 'var_args') {
    return types.UnderscoreForm.VAR_ARGS;

  } else if (name.substring(0, 4) === 'opt_' && name != 'opt_') {
    return types.UnderscoreForm.OPT_PREFIX;

  } else if (name[0] === '_') {
    return types.UnderscoreForm.LEADING;

  } else if (name[name.length - 1] === '_') {
    return types.UnderscoreForm.TRAILING;

  } else {
    return types.UnderscoreForm.MIDDLE;
  }
}

/**
 * Returns true if the node is a class expression or declaration.
 * @param {!ESLint.ASTNode} node
 * @return {boolean}
 */
function isNodeClassType(node) {
  return node.type === 'ClassExpression' || node.type === 'ClassDeclaration';
}

/**
 * Returns an ancestor node of the given node that has the specified type.  If
 * there is no ancestor node with the specified type then return null.
 * @param {!ESLint.ASTNode} node Node to examine.
 * @param {string} type The Espree.NodeType that is being looked for.
 * @return {(!ESLint.ASTNode|null)} If found ancestor node or null.
 */
function getNodeAncestorOfType(node, type) {
  let parent = node.parent;

  while (parent.type !== type && parent.type !== 'Program') {
    parent = parent.parent;
  }
  return parent.type === type ? parent : null;
}

/**
 * Returns true if node is a getter function.
 * @param {!Espree.ASTNode} node
 * @return {boolean}
 */
function isNodeGetterFunction(node) {
  return node.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'Property' &&
      /** @type {!Espree.Property} */ (node.parent).kind === 'get';
}

/**
 * Returns true if node is a setter function.
 * @param {!Espree.ASTNode} node
 * @return {boolean}
 */
function isNodeSetterFunction(node) {
  return node.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'Property' &&
      /** @type {!Espree.Property} */ (node.parent).kind === 'set';
}


/**
 * Returns true if node is a constructor function.
 * @param {!Espree.ASTNode} node
 * @return {boolean}
 */
function isNodeConstructorFunction(node) {
  return node.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'MethodDefinition' &&
      /** @type {!Espree.MethodDefinition} */
      (node.parent).kind === 'constructor';
}

exports = {
  categorizeUnderscoredIdentifier,
  getNodeAncestorOfType,
  isUnderscored,
  isNodeConstructorFunction,
  isNodeClassType,
  isNodeGetterFunction,
  isNodeOneLine,
  isNodeSetterFunction,
  nodesEndOnSameLine,
  nodesShareOneLine,
  nodesStartOnSameLine,
};
