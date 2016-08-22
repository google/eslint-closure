'use strict';

module.exports = {
  /** @type {ESLintRule} */
  rules: {
    'inline-comment-spacing': require('./lib/inline-comment-spacing'),
    'camelcase-optionals': require('./lib/camelcase-optionals'),
  },
};
