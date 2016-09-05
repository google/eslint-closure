/**
 * @fileoverview Utilities for working with ESLint AST nodes and tokens.
 */

'use strict';

const types = require('./types');

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {(!ESLint.ASTNode|!Espree.Token)} left The left token object.
 * @param {(!ESLint.ASTNode|!Espree.Token)} right The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 */
function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

/**
 * Checks if a string contains an underscore.
 * @param {string} name The string to check.
 * @returns {boolean} if the string is underscored
 */
function isUnderscored(name) {
  return name.indexOf("_") > -1;
}


/**
 * Determine the type of underscore that an indentifer contains.
 * @param {string} name The string to check.
 * @return {!types.UnderscoreForm} the type of underscored identifier.
 */
function categorizeUnderscoredIdentifier(name) {
  if (name === "" || name.length === 0) {
    return 'no_underscore';
  } else if (name.toUpperCase() === name) {
    return 'constant';
  } else if (name.indexOf('_') === -1) {
    // This check must come after the constant check otherwise we wrongly
    // categorize identifiers like ALLCAPS.
    return 'no_underscore';
  } else if (name === 'var_args') {
    return 'var_args';
  } else if (name.substring(0, 4) === 'opt_' && name != 'opt_') {
    return 'opt_prefix';
  } else if (name[0] === '_') {
    return 'leading';
  } else if (name[name.length - 1] === '_') {
    return 'trailing';
  } else {
    return 'middle';
  }
}


module.exports = {
  categorizeUnderscoredIdentifier,
  isTokenOnSameLine,
  isUnderscored,
};
