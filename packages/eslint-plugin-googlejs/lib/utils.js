/**
 * @fileoverview Utilities for working with ESLint AST nodes and tokens.
 */
goog.module('googlejs.utils');

const types = goog.require('googlejs.types');

/**
 * Returns true if the end of the left node is the same as the start of the
 * right node.
 * @param {!AST.Locatable} left The left token object.
 * @param {!AST.Locatable} right The right token object.
 * @return {boolean} Whether or not the tokens are on the same line.
 */
function nodesShareOneLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

/**
 * Returns true if a node exists entirely on one line.
 * @param {!AST.Locatable} node
 * @return {boolean} Whether or not the tokens are on the same line.
 */
function isNodeOneLine(node) {
  return nodesShareOneLine(node, node);
}

/**
 * Returns true if both tokens start on the same line.
 * @param {!AST.Locatable} node1
 * @param {!AST.Locatable} node2
 * @return {boolean}
 */
function nodesStartOnSameLine(node1, node2) {
  return node1.loc.start.line === node2.loc.start.line;
}

/**
 * Returns true if both tokens end on the same line.
 * @param {!AST.Locatable} node1
 * @param {!AST.Locatable} node2
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
 * @param {!AST.Node} node
 * @return {boolean}
 */
function isNodeClassType(node) {
  return node.type === 'ClassExpression' || node.type === 'ClassDeclaration';
}

/**
 * Returns true if node is a getter function.
 * @param {!AST.Node} node
 * @return {boolean}
 */
function isNodeGetterFunction(node) {
  return node.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'Property' &&
      /** @type {!AST.Property} */ (node.parent).kind === 'get';
}

/**
 * Returns true if node is a setter function.
 * @param {!AST.Node} node
 * @return {boolean}
 */
function isNodeSetterFunction(node) {
  return node.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'Property' &&
      /** @type {!AST.Property} */ (node.parent).kind === 'set';
}


/**
 * Returns true if node is a constructor function.
 * @param {!AST.Node} node
 * @return {boolean}
 */
function isNodeConstructorFunction(node) {
  return node.type === 'FunctionExpression' &&
      node.parent && node.parent.type === 'MethodDefinition' &&
      /** @type {!AST.MethodDefinition} */
      (node.parent).kind === 'constructor';
}


/**
 * Returns true if a prefix is a valid member expression prefix of a name.
 * For example, `foo.bar` is a prefix of `foo.bar.baz`, but `foo.bar` is not a
 * valid prefix of `foo.barbaz`.
 * @param {string} name
 * @param {string} prefix
 * @return {boolean}
 */
function isValidPrefix(name, prefix) {
  if (name.startsWith(prefix)) {
    // If name isn't prefix then we know it has more characters.  The
    // only valid character after the prefix is a dot to signify another
    // member expression.
    return name === prefix || name[prefix.length] === '.';
  } else {
    return false;
  }
}

/**
 * Escapes regular expression characters in the provided string.
 * @param {string} string
 * @return {string}
 */
function escapeRegexp(string) {
  return String(string).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

exports = {
  categorizeUnderscoredIdentifier,
  escapeRegexp,
  isUnderscored,
  isNodeConstructorFunction,
  isNodeClassType,
  isNodeGetterFunction,
  isNodeOneLine,
  isNodeSetterFunction,
  isValidPrefix,
  nodesEndOnSameLine,
  nodesShareOneLine,
  nodesStartOnSameLine,
};
