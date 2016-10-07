goog.module('googlejs.config');

const camelcase = goog.require('googlejs.rules.camelcase');
const indent = goog.require('googlejs.rules.indent');
const inlineCommentSpacing = goog.require('googlejs.rules.inlineCommentSpacing');
const jsdoc = goog.require('googlejs.rules.jsdoc');

/**
 *  @const {!ESLint.Config}
 */
const PLUGIN_ESLINT_CONFIG = {
  rules: {
    camelcase,
    indent,
    'inline-comment-spacing': inlineCommentSpacing,
    jsdoc,
  },
};

// For node.js.
module.exports = PLUGIN_ESLINT_CONFIG;

// For closure in case anyone decides to goog.require this module.
exports = PLUGIN_ESLINT_CONFIG;
