'use strict';

/** @const {ESLint.Config} */
module.exports = {
  /** @const {Object<string,ESLint.RuleDefinition>} */
  rules: {
    'inline-comment-spacing': require('./lib/rules/inline-comment-spacing'),
    'camelcase': require('./lib/rules/camelcase'),
  },
  configs: {},
};
