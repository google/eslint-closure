'use strict';

/** @type {!ESLint.Config} */
module.exports = {
  rules: {
    'inline-comment-spacing': require('./lib/rules/inline-comment-spacing'),
    'camelcase': require('./lib/rules/camelcase'),
  },
  configs: {},
};
