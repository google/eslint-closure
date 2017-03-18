goog.module('closureLint.plugin');

const camelcase = goog.require('closureLint.rules.camelcase');
const indent = goog.require('closureLint.rules.indent');
const inlineCommentSpacing = goog.require('closureLint.rules.inlineCommentSpacing');
const jsdoc = goog.require('closureLint.rules.jsdoc');
const noUndef = goog.require('closureLint.rules.noUndef');
const noUnusedExpressions = goog.require('closureLint.rules.noUnusedExpressions');
const noUnusedVars = goog.require('closureLint.rules.noUnusedVars');

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

module.exports = PLUGIN_ESLINT_CONFIG;

// For closure in case anyone decides to goog.require this module.
exports = PLUGIN_ESLINT_CONFIG;
