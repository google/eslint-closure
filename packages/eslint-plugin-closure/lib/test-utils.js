/**
 * @fileoverview Test utilities.
 */

goog.module('eslintClosure.testUtils');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

/**
 * Creates a function thats takes a string of source code and returns the result
 * of executing nodeFunction on the first nodeType in the parsed source code.
 * @param {string} nodeType A node type like 'VariableDeclaration'.
 * @param {function(!AST.Node):*} nodeFunction Function to call on the node
 *     type.
 * @return {function(string):*}
 */
function eslintVerifier(nodeType, nodeFunction) {
  return (/** string */ code) => eslintVerify(nodeType, nodeFunction, code);
}

/**
 * Executes the provided function on the first parsed node of nodeType and
 * returns the result.
 * @param {string} nodeType A node type like 'VariableDeclaration'.
 * @param {function(!AST.Node):*} nodeFunction Function to call on the node
 *     type.
 * @param {string} code The source code to parse.
 * @return {*}
 */
function eslintVerify(nodeType, nodeFunction, code) {
  const filename = 'test.js';
  const eslintOptions = {
    parserOptions: {ecmaVersion: 6},
    rules: {},
  };
  /** @type {*} */
  let result;
  eslint.linter.reset();
  eslint.linter.once(nodeType, (node) => {
    result = nodeFunction(node);
  });
  eslint.linter.verify(code, eslintOptions, filename, true);
  return result;
}

exports = {
  eslintVerifier,
  eslintVerify,
};
