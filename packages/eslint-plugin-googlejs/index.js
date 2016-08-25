'use strict';

/** @const {ESLint.Config} */
module.exports = {
  /** @const {Object<string,ESLint.RuleDefinition>}*/
  rules: {
    'inline-comment-spacing': require('./lib/inline-comment-spacing'),
    'camelcase': require('./lib/camelcase'),
  },
};
