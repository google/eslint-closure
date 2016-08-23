/**
 * @fileoverview Tests for whitespace characters.
 */

const es6Config = {
  parserOptions: {
    ecmaVersion: 6,
  },
}
const emptyRule = require('../emptyRule');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  global: {test: true},
  parserOptions: {ecmaVersion: 6},
});
ruleTester.run('whitespace-characters', emptyRule, {
  valid: [
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
