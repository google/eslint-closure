/**
 * @fileoverview Tests for no-unused-expressions rule.
 * @author Michael Ficarra
 */

goog.module('googlejs.tests.rules.noUnusedExpressions');
goog.setTestOnly('googlejs.tests.rules.noUnusedExpressions');

const noUnusedExpressionsRule = goog.require('googlejs.rules.noUnusedExpressions');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

const RuleTester = eslint.RuleTester;
const ruleTester = new RuleTester();

const DEFAULT_MESSAGE = 'Expected an assignment or function call and instead ' +
      'saw an expression.';

ruleTester.run('no-unused-expressions', noUnusedExpressionsRule, {
  valid: [
    'function f(){}',
    'a = b',
    'new a',
    '{}',
    'f(); g()',
    'i++',
    'a()',
    {code: 'a && a()', options: [{allowShortCircuit: true}]},
    {code: 'a() || (b = c)', options: [{allowShortCircuit: true}]},
    {code: 'a ? b() : c()', options: [{allowTernary: true}]},
    {
      code: 'a ? b() || (c = d) : e()',
      options: [{allowShortCircuit: true, allowTernary: true}],
    },
    'delete foo.bar',
    'void new C',
    '"use strict";',
    '"directive one"; "directive two"; f();',
    'function foo() {"use strict"; return true; }',
    {
      code: 'var foo = () => {"use strict"; return true; }',
      parserOptions: {ecmaVersion: 6},
    },
    'function foo() {"directive one"; "directive two"; f(); }',
    'function foo() { var foo = "use strict"; return true; }',
    {
      code: 'function* foo(){ yield 0; }',
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: 'async function foo() { await 5; }',
      parserOptions: {ecmaVersion: 8},
    },
    {
      code: 'async function foo() { await foo.bar; }',
      parserOptions: {ecmaVersion: 8},
    },
    {
      code: 'async function foo() { bar && await baz; }',
      options: [{allowShortCircuit: true}],
      parserOptions: {ecmaVersion: 8},
    },
    {
      code: 'async function foo() { foo ? await bar : await baz; }',
      options: [{allowTernary: true}],
      parserOptions: {ecmaVersion: 8},
    },
    ` /** @type {number} */ this.foo;`,
    ` /** @const {number} */ this.foo;`,
    ` /** @private {number} */ this.foo;`,
    ` /** @package {number} */ this.foo;`,
    ` /** @protected {number} */ this.foo;`,
    ` /** @public {number} */ this.foo;`,
    ` /** @export {number} */ this.foo;`,
  ],
  invalid: [
    {
      code: '0',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'f(), 0',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: '{0}',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: '[]',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a && b();',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a() || false',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a || (b = c)',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a ? b() || (c = d) : e',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a && b()',
      options: [{allowTernary: true}],
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a ? b() : c()',
      options: [{allowShortCircuit: true}],
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a || b',
      options: [{allowShortCircuit: true}],
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a() && b',
      options: [{allowShortCircuit: true}],
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a ? b : 0',
      options: [{allowTernary: true}],
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'a ? b : c()',
      options: [{allowTernary: true}],
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'foo.bar;',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: '!a',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: '+a',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: '"directive one"; f(); "directive two";',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'function foo() {"directive one"; f(); "directive two"; }',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'if (0) { "not a directive"; f(); }',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'function foo() { var foo = true; "use strict"; }',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: '/** @ {number} */ this.foo;',
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
    {
      code: 'var foo = () => { var foo = true; "use strict"; }',
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: DEFAULT_MESSAGE,
        type: 'ExpressionStatement',
      }],
    },
  ],
});
