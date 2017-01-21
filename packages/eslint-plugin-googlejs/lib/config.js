goog.module('googlejs.config');

const camelcase = goog.require('googlejs.rules.camelcase');
const indent = goog.require('googlejs.rules.indent');
const inlineCommentSpacing = goog.require('googlejs.rules.inlineCommentSpacing');
const jsdoc = goog.require('googlejs.rules.jsdoc');
const noUndef = goog.require('googlejs.rules.noUndef');
const noUnusedExpressions = goog.require('googlejs.rules.noUnusedExpressions');
const noUnusedVars = goog.require('googlejs.rules.noUnusedVars');

/**
 * @const {!ESLint.Config}
 */
const PLUGIN_ESLINT_CONFIG = {rules: {}};

goog.exportProperty(PLUGIN_ESLINT_CONFIG, 'rules', {});

goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'camelcase', camelcase);
goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'indent', indent);
goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'inline-comment-spacing',
                    inlineCommentSpacing);
goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'jsdoc', jsdoc);
goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'no-undef', noUndef);
goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'no-unused-expressions',
                    noUnusedExpressions);
goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, 'no-unused-vars', noUnusedVars);

// For closure in case anyone decides to goog.require this module.
exports = PLUGIN_ESLINT_CONFIG;
