/**
 * @fileoverview Tests for camelcase rules.
 */

goog.module('googlejs.tests.rules.camelcase');
goog.setTestOnly('googlejs.tests.rules.camelcase');

const camelCaseRule = goog.require('googlejs.rules.camelcase');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();

ruleTester.run('camelcase', camelCaseRule, {
  valid: [
    'firstName = "Nicholas"',
    'FIRST_NAME = "Nicholas"',
    '__myPrivateVariable = "Patrick"',
    'myPrivateVariable_ = "Patrick"',
    'myPrivateVariable__ = "Patrick"',
    '__myPrivateVariable__ = "Patrick"',
    'function doSomething(){}',
    'do_something()',
    'foo.do_something()',
    'var foo = bar.baz_boom;',
    'var foo = bar.baz_boom.something;',
    'foo.boom_pow.qux = bar.baz_boom.something;',
    'if (bar.baz_boom) {}',
    'var obj = { key: foo.bar_baz };',
    'var arr = [foo.bar_baz];',
    '[foo.bar_baz]',
    'var arr = [foo.bar_baz.qux];',
    '[foo.bar_baz.nesting]',
    'if (foo.bar_baz === boom.bam_pow) { [foo.baz_boom] }',
    {
      code: 'var a = opt_test;',
      options: [{allowOptPrefix: true}],
    },
    {
      code: 'function foo(opt_test) {};',
      options: [{allowOptPrefix: true}],
    },
    {
      code: 'var args = var_args;',
      options: [{allowVarArgs: true}],
    },
    {
      code: 'foo.bar_baz = 2',
      options: [{checkObjectProperties: false}],
    },
    {
      code: 'var { bar_baz: foo} = require()',
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: 'var { bar_baz: foo} = require()',
      options: [{checkObjectProperties: false}],
      parserOptions: {ecmaVersion: 6},
    },
  ],
  invalid: [
    {
      code: 'first_name = "Nicholas"',
      errors: [
        {
          message: "Identifier 'first_name' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: '__private_first_name = "Patrick"',
      errors: [
        {
          message: "Identifier '__private_first_name' is not in camel case "
            + 'after the leading underscore.',
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'function foo_bar(){}',
      errors: [
        {
          message: "Identifier 'foo_bar' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'obj.foo_bar = function(){};',
      errors: [
        {
          message: "Identifier 'foo_bar' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'bar_baz.foo = function(){};',
      errors: [
        {
          message: "Identifier 'bar_baz' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: '[foo_bar.baz]',
      errors: [
        {
          message: "Identifier 'foo_bar' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'if (foo.bar_baz === boom.bam_pow) { [foo_bar.baz] }',
      errors: [
        {
          message: "Identifier 'foo_bar' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'foo.bar_baz = boom.bam_pow',
      errors: [
        {
          message: "Identifier 'bar_baz' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'var foo = { bar_baz: boom.bam_pow }',
      errors: [
        {
          message: "Identifier 'bar_baz' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'foo.qux.boom_pow = { bar: boom.bam_pow }',
      errors: [
        {
          message: "Identifier 'boom_pow' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'function bar(opt_foo) {}',
      errors: [
        {
          message: "The opt_ prefix is not allowed in 'opt_foo'.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'opt_foo_bar = { bar: boom.bam_pow }',
      errors: [
        {
          message: "The opt_ prefix is not allowed in 'opt_foo_bar'.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'opt_foo_bar = { bar: boom.bam_pow }',
      options: [{allowOptPrefix: true}],
      errors: [
        {
          message: "Identifier 'opt_foo_bar' is not in camel case after the"
              + " opt_ prefix.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'var_args = { bar: boom.bam_pow }',
      errors: [
        {
          message: "The var_args identifier is not allowed.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: '_foo_bar = 2',
      errors: [
        {
          message: "Identifier '_foo_bar' is not in camel case after the "
              + "leading underscore.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'foo_bar_ = 3',
      errors: [
        {
          message: "Identifier 'foo_bar_' is not in camel case before the "
            + "trailing underscore.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: '_fooBar = 4',
      options: [{allowLeadingUnderscore: false}],
      errors: [
        {
          message: "Leading underscores are not allowed in '_fooBar'.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'fooBar_ = 5',
      options: [{allowTrailingUnderscore: false}],
      errors: [
        {
          message: "Trailing underscores are not allowed in 'fooBar_'.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'var {foo_bar} = require()',
      parserOptions: {ecmaVersion: 6},
      errors: [
        {
          message: "Identifier 'foo_bar' is not in camel case.",
          type: 'Identifier',
        },
        {
          message: "Identifier 'foo_bar' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'var {foo_bar: bar_baz} = require()',
      parserOptions: {ecmaVersion: 6},
      errors: [
        {
          message: "Identifier 'bar_baz' is not in camel case.",
          type: 'Identifier',
        },
      ],
    },

  ],
});
