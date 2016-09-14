goog.module('googlejs.plugin.config');

const inlineCommentSpacing = goog.require('googlejs.plugin.rules.inline-comment-spacing');
const camelcase = goog.require('googlejs.plugin.rules.camelcase');

/** @const {!ESLint.Config} */
const PLUGIN_ESLINT_CONFIG = {
  rules: {
    'inline-comment-spacing': inlineCommentSpacing,
    'camelcase': camelcase,
  },
  configs: {},
};

exports = PLUGIN_ESLINT_CONFIG;
