goog.module('googlejs.config');

const inlineCommentSpacing = goog.require('googlejs.rules.inline-comment-spacing');
const camelcase = goog.require('googlejs.rules.camelcase');

/**
 *  @const {!ESLint.Config}
 */
const PLUGIN_ESLINT_CONFIG = {
  rules: {
    'inline-comment-spacing': inlineCommentSpacing,
    'camelcase': camelcase,
  },
  configs: {},
};

module.exports = PLUGIN_ESLINT_CONFIG;

exports = PLUGIN_ESLINT_CONFIG;
