/**
 * @fileoverview Utilities for working with ESLint syntax tree.
 */

'use strict';

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {Object} left - The left token object.
 * @param {Object} right - The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 */
function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

module.exports = {
  isTokenOnSameLine,
};
