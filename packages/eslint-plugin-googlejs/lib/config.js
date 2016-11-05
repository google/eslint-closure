goog.module('googlejs.config');

// TODO(jschaf): Why are all these suppresses required?  They're clearly
// exported.
/** @suppress {extraRequire} */
const camelcase = goog.require('googlejs.rules.camelcase');
/** @suppress {extraRequire} */
const indent = goog.require('googlejs.rules.indent');
/** @suppress {extraRequire} */
const inlineCommentSpacing = goog.require('googlejs.rules.inlineCommentSpacing');
/** @suppress {extraRequire} */
const jsdoc = goog.require('googlejs.rules.jsdoc');
/** @suppress {extraRequire} */
const noUndef = goog.require('googlejs.rules.noUndef');
/** @suppress {extraRequire} */
const noUnusedExpressions = goog.require('googlejs.rules.noUnusedExpressions');
/** @suppress {extraRequire} */
const noUnusedVars = goog.require('googlejs.rules.noUnusedVars');

/**
 * @const {!ESLint.Config}
 */
const PLUGIN_ESLINT_CONFIG = {
  rules: {
    camelcase,
    indent,
    'inline-comment-spacing': inlineCommentSpacing,
    jsdoc,
    'no-undef': noUndef,
    'no-unused-expresssions': noUnusedExpressions,
    'no-unused-vars': noUnusedVars,
  },
};

// For node.js.
module.exports = PLUGIN_ESLINT_CONFIG;

// For closure in case anyone decides to goog.require this module.
exports = PLUGIN_ESLINT_CONFIG;
