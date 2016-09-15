/**
 * @fileoverview Utilities for working with ESLint AST nodes and tokens.
 */
goog.module('googlejs.utils');

const types = goog.require('googlejs.types');

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
 * @returns {boolean} If the string is underscored.
 */
function isUnderscored(name) {
  return name.indexOf("_") > -1;
}

/**
 * Determine the type of underscore that an indentifer contains.
 * @param {string} name The string to check.
 * @return {!types.UnderscoreForm} The type of underscored identifier.
 */
function categorizeUnderscoredIdentifier(name) {
  if (name === "" || name.length === 0) {
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


exports = {
  categorizeUnderscoredIdentifier,
  isTokenOnSameLine,
  isUnderscored,
};
