goog.module('googlejs.config');

const camelcase = goog.require('googlejs.rules.camelcase');
const indent = goog.require('googlejs.rules.indent');
const inlineCommentSpacing = goog.require('googlejs.rules.inlineCommentSpacing');
const noUnusedVars = goog.require('googlejs.rules.noUnusedVars');

/**
 *  @const {!ESLint.Config}
 */
const PLUGIN_ESLINT_CONFIG = {
  rules: {
    camelcase,
    indent,
    inlineCommentSpacing,
    noUnusedVars,
  },
};

// For node.js.
module.exports = PLUGIN_ESLINT_CONFIG;

// For closure in case anyone decides to goog.require this module.
exports = PLUGIN_ESLINT_CONFIG;
