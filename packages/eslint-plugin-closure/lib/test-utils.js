// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
