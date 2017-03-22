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
 * @fileoverview Common utils for the AST.
 */

goog.module('eslintClosure.astMatcher');

const googObject = goog.require('goog.object');

const isMatchWith = /** @type {!Lodash.isMatchWith} */ (require('lodash.ismatchwith'));

/**
 * Creates a function that matches an AST against the given pattern.
 *
 * See: isASTMatch()
 *
 * @param {*} pattern Pattern to test against
 * @return {function(*):(!Object|boolean)} Function that returns
 *     an object with extracted fields or false when no match found.
 */
function matchesAST(pattern) {
  /**
   *
   * @param {*} ast
   * @return {(!Object|boolean)}
   */
  function matchHelper(ast) {
    return isASTMatch(ast, pattern);
  }
  return matchHelper;
}

/**
 * Matches AST against the given pattern.
 *
 * Similar to LoDash.isMatch(), but with the addition that a Function
 * can be provided to assert various conditions e.g. checking that
 * number is within a certain range.
 *
 * Additionally there are utility functions:
 *
 * - extractAST() can be used to give names to the parts of AST -
 *   these are then returned as a map of key-value pairs.
 *
 * - matchesASTAndLength() ensures the exact array length is respected.
 *
 * @param {*} ast The AST node to test.
 * @param {*} pattern Pattern to test against.
 * @return {(!Object|boolean)} An object with extracted fields
 *     or false when no match found.
 */
function isASTMatch(ast, pattern) {
  const extractedFields = {};

  /**
   * Adds matched fields to extractedFields.
   * @param {*} value
   * @param {*} matcher
   * @return {(boolean|undefined)}
   */
  function matchHelper(value, matcher) {
    if (typeof matcher === 'function') {
      const matcherFn =
            /** @type {function(*):(!Object|boolean|undefined)} */ (matcher);
      const result = matcherFn(value);
      if (goog.isObject(result)) {
        googObject.extend(extractedFields, result);
      }
      return !!result;
    } else {
      // Otherwise fall back to built-in comparison logic.
      return undefined;
    }
  }

  const matches = isMatchWith(ast, pattern, matchHelper);
  return matches ? extractedFields : false;
}

/**
 * Extracts values during matching with matchesAST().
 * @param {string} fieldName The name to give for the value
 * @param {(function(*)|!Object)=} matcher Optional matching function or pattern
 *     for matchesAST().
 * @return {function(*):(!Object|boolean)}
 */
function extractAST(fieldName, matcher) {

  /**
   * @param {*} ast
   * @return {(!Object<string, *>|boolean)}
   */
  function extractASTHelper(ast) {
    const extractedFields = {};
    extractedFields[fieldName] = ast;

    if (typeof matcher === 'object') {
      // Convert plain pattern into matcher function.
      matcher = matchesAST(matcher);
    }

    if (typeof matcher === 'function') {
      const result = matcher(ast);
      if (typeof result === 'object') {
        googObject.extend(extractedFields, result);
        return extractedFields;
      }
      if (!result) {
        return false;
      }
    }
    return extractedFields;
  }

  return extractASTHelper;
}

/**
 * Matches an array of ASTs and asserts that the pattern of ASTs is the same
 * length as the array of ASTs to examine.
 * @param {*} pattern
 * @return {function(*):(!Object|boolean)}
 */
function matchesASTLength(pattern) {
  const matcher = matchesAST(pattern);

  /**
   * @param {*} ast
   * @return {(!Object|boolean)}
   */
  function lengthMatcher(ast) {
    if (!goog.isArray(ast) || !goog.isArray(pattern)) {
      return false;
    }
    if (ast.length !== pattern.length) {
      return false;
    }
    return matcher(ast);
  }
  return lengthMatcher;
}

exports = {
  extractAST,
  isASTMatch,
  matchesAST,
  matchesASTLength,
};
