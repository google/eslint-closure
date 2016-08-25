/**
 * @fileoverview Tests for whitespace characters.
 */

const es6Config = require('../index.js');
const emptyRule = require('../emptyRule');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();
RuleTester.setDefaultConfig(es6Config);

ruleTester.run('whitespace-characters', emptyRule, {
  valid: [
    'var foo = 2;',
    'let foo = 2;',
    'const bar = 3;',
  ],

  invalid: [
    {
      code: '\tlet foo = 2;',
      errors: [{message: 'Whitespapce yo', type: 'Identifier'}],

    },
  ],
});
