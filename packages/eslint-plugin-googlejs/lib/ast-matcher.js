/**
 * @fileoverview Common utils for the AST.
 */

goog.module('googlejs.astMatcher');

const googObject = goog.require('goog.object');

/** @const {!Lodash.isMatchWith} */
const isMatchWith = require('lodash.ismatchwith');

/**
 * Creates a function that matches AST against the given pattern.
 *
 * See: isASTMatch()
 *
 * @param {!Object} pattern Pattern to test against
 * @return {function(!Object):(!Object|boolean)} Function that returns
 *     an object with extracted fields or false when no match found.
 */
function matchesAST(pattern) {
  return (ast) => isASTMatch(ast, pattern);
}

/**
 * Matches AST against the given pattern,
 *
 * Similar to LoDash.isMatch(), but with the addition that a Function
 * can be provided to assert various conditions e.g. checking that
 * number is within a certain range.
 *
 * Additionally there are utility functions:
 *
 * - extract() can be used to give names to the parts of AST -
 *   these are then returned as a map of key-value pairs.
 *
 * - matchesLength() ensures the exact array length is respected.
 *
 * @param {!Object} ast The AST node to test.
 * @param {!Object} pattern Pattern to test against.
 * @return {(!Object|boolean)} An object with extracted fields
 *     or false when no match found.
 */
function isASTMatch(ast, pattern) {
  const extractedFields = {};

  const matches = isMatchWith(ast, pattern, (value, matcher) => {
    if (typeof matcher === 'function') {
      const result = matcher(value);
      if (typeof result === 'object') {
        googObject.extend(extractedFields, result);
      }
      return result;
    } else {
      // Otherwise fall back to built-in comparison logic.
      return undefined;
    }
  });

  if (matches) {
    return extractedFields;
  } else {
    return false;
  }
}

/**
 * Extracts values during matching with matchesAST().
 * @param {string} fieldName The name to give for the value
 * @param {(function(*)|!Object)} matcher Optional matching function or pattern
 *     for matchesAST()
 * @return {!function(!Object):(boolean|!Object)}
 */
function extract(fieldName, matcher) {
  return (ast) => {
    const extractedFields = {[fieldName]: ast};

    if (typeof matcher === 'object') {
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
  };
}

/**
 * Asserts that AST also matches the exact length of the specified array pattern
 * (in addition to matching the first items in the array).
 * @param {!Array} pattern
 * @return {(!Object|boolean)}
 */
function matchesLength(pattern) {
  const matcher = matchesAST(pattern);

  return (ast) => {
    if (ast.length !== pattern.length) {
      return false;
    }
    return matcher(ast);
  };
}

exports = {
  extract,
  isASTMatch,
  matchesAST,
  matchesLength,
};
