/**
 * @fileoverview Tests for camelcase rules.
 */

'use strict';

const rule = require('../../../lib/rules/camelcase');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();

ruleTester.run('camelcase', rule, {
  valid: [
    'firstName = "Nicholas"',
    'FIRST_NAME = "Nicholas"',
    '__myPrivateVariable = "Patrick"',
    'myPrivateVariable_ = "Patrick"',
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
      options: [{allowOptPrefix: true}]
    },
    {
      code: 'function foo(opt_test) {};',
      options: [{allowOptPrefix: true}]
    },
    {
      code: 'var args = var_args;',
      options: [{allowVarArgs: true}]
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
      code: 'opt_foo_bar = { bar: boom.bam_pow }',
      errors: [
        {
          message: "Identifier 'opt_foo_bar' is not in camel case after the"
              + " opt_ prefix.",
          type: 'Identifier',
        },
      ],
    },

  ],
});
