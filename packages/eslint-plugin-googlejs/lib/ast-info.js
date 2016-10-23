/**
 * @fileoverview Methods to get information about AST nodes.
 */

goog.module('googlejs.astInfo');

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
  getFullyQualifedName,
};
