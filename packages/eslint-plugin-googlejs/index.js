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

window['googlejs-eslint-plugin'] = PLUGIN_ESLINT_CONFIG;

// if (typeof define === 'function' && define['amd']) {
//   // AMD
//   define(['googlejs-eslint-plugin'], PLUGIN_ESLINT_CONFIG);
// } else if (typeof require === 'function' && typeof module === 'object' &&
//            module && module['exports']) {
//   // CommonJS
//   module['exports'] = require('googlejs-eslint-plugin');
// } else {
//   // Global
  
//   goog.global['googlejs-eslint-plugin'] = goog.global['googlejs-eslint-plugin'] || {}
//   ['ProtoBuf'] = factory(global['googlejs-eslint-plugin']);
// }
exports = PLUGIN_ESLINT_CONFIG;
