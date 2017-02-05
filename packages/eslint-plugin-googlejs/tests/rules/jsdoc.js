/**
 * @fileoverview Tests for JSDoc rule.
 */

goog.module('googlejs.tests.rules.jsdoc');

const jsdocRule = goog.require('googlejs.rules.jsdoc');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));
const noUnusedVarsRule = /** @type {!ESLint.RuleDefinition} */ (require('eslint/lib/rules/no-unused-vars'));

const RuleTester = eslint.RuleTester;
const ruleTester = new RuleTester();

ruleTester.run('jsdoc', jsdocRule, {

  valid: [
    {
      code: `
/**
 * @typedef {{bar: string}}
 */
let Bar;

/**
 * @param {Bar} baz its a time stamp
 * @return {void}
 */
function qux(baz){}`,
      parserOptions: {ecmaVersion: 6},

    },
    `
/**
 * Description
 * @param {Object[]} screenings Array of screenings.
 * @param {Number} screenings[].timestamp its a time stamp
 * @return {void}
 */
function foo(){}`,

    `
/**
 * Description
 */
var x = new Foo(function foo(){})`,

    `
/**
 * Description
 * @returns {void}
 */
function foo(){}`,

    `
/**
 * Description
 * @returns {undefined}
 */
function foo(){}`,

    `
/**
 * Description
 * @alias Test#test
 * @returns {void}
 */
function foo(){}`,

    `
/**
 * Description
 *@extends MyClass
 * @returns {void}
 */
function foo(){}`,

    `
/**
 * Description
 * @constructor
 */
function Foo(){}`,

    `
/**
 * Description
 * @class
 */
function Foo(){}`,

    `
/**
 * Description
 * @param {string} p bar
 * @returns {string} desc
 */
function foo(p){}`,

    `
/**
 * Description
 * @arg {string} p bar
 * @returns {string} desc
 */
function foo(p){}`,

    `
/**
 * Description
 * @argument {string} p bar
 * @returns {string} desc
 */
function foo(p){}`,

    `
/**
 * Description
 * @param {string} [p] bar
 * @returns {string} desc
 */
function foo(p){}`,

    `
/**
 * Description
 * @param {Object} p bar
 * @param {string} p.name bar
 * @returns {string} desc
 */
 Foo.bar =function(p){};`,

    `
(function(){
 /**
 * Description
 * @param {string} p bar
 * @returns {string} desc
 */
function foo(p){}
 }())`,

    `
var o = {
 /**
 * Description
 * @param {string} p bar
 * @returns {string} desc
 */
 foo:function(p){}
 };`,

    `
/**
 * Description
 * @param {Object} p bar
 * @param {string[]} p.files qux
 * @param {Function} cb baz
 * @returns {void}
 */
function foo(p, cb){}`,

    `
/**
 * Description
 * @override
 */
function foo(arg1, arg2){ return ''; }`,

    `
/**
 * Description
 * @inheritdoc
 */
function foo(arg1, arg2){ return ''; }`,

    `
/**
 * Description
 * @inheritDoc
 */
function foo(arg1, arg2){ return ''; }`,

    `
/**
 * Description
 * @Returns {void}
 */
function foo(){}`,

    {
      code: `
call(
  /**
   * Doc for a function expression in a call expression.
   * @param {string} argName This is the param description.
   * @return {string} This is the return description.
   */
  function(argName) {
    return 'the return';
  }
);`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Create a new thing.
*/
var thing = new Thing({
  foo: function() {
    return 'bar';
  }
});`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Create a new thing.
*/
var thing = new Thing({
  /**
   * @return {string} A string.
   */
  foo: function() {
    return 'bar';
  }
});`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @return {void} */
function foo(){}`,
      options: [{}],
    },
    {
      code: `
/**
* Description
* @param {string} p bar
*/
Foo.bar = (p) => {};`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
/**
* Description
* @param {string} p bar
*/
Foo.bar = function({p}){};`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
/**
* Description
* @param {string} p bar
*/
Foo.bar = function(p){};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
*/
Foo.bar = function(p){var t = function(){return p;}};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
*/
Foo.bar = function(p){function func(){return p;}};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
*/
Foo.bar = function(p){var t = false; if(t){ return; }};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
* @returns {void} */
Foo.bar = function(p){var t = false; if(t){ return; }};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
*/
Foo.bar = function(p){var t = function(){function name(){return p;}}};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
*/
Foo.bar = function(p){var t = function(){function name(){}; return name;}};`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p
* @returns {void}*/
Foo.bar = function(p){var t = function(){function name(){}; return name;}};`,
      options: [{requireParamDescription: false}],
    },
    {
      code: `
/**
* Description
* @param {string} p mytest
* @returns {Object}*/
Foo.bar = function(p){return name;};`,
      options: [{requireReturnDescription: false}],
    },
   `
var obj = {
 /**
 * Getter
 * @type {string}
 */
 get location() {
 return this._location;
 }
 }`,
   `
var obj = {
 /**
 * Setter
 * @param {string} value The location
 */
 set location(value) {
 this._location = value;
 }
 }`,
    {
      code: `
/**
 * Description for A.
 */
 class A {
 /**
 * Description for constructor.
 * @param {object[]} xs - xs
 */
 constructor(xs) {
 /**
 * Description for this.xs;
 * @type {object[]}
 */
 this.xs = xs.filter(x => x != null);
 }
}`,
      options: [{requireReturn: false}],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/** @returns {object} foo */ var foo = () => bar();`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
/** @returns {object} foo */ var foo = () => { return bar(); };`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
/** foo */ var foo = () => { bar(); };`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
/**
* Start with caps and end with period.
* @return {void} */
function foo(){}`,
      options: [{
        matchDescription: '^[A-Z][A-Za-z0-9\\s]*[.]$',
      }],
    },
    {
      code: `
/** Foo
@return {void} Foo
 */
function foo(){}`,
      options: [{prefer: {return: 'return'}}],
    },
    {
      code: `
/** Foo
@return Foo
 */
function foo(){}`,
      options: [{requireReturnType: false}],
    },
    {
      code: `
/**
 * A thing interface.
 * @interface
 */
function Thing() {}`,
      options: [{requireReturn: true}],
    },

        // classes
    {
      code: `
/**
 * Description for A.
 */
class A {
    /**
     * Description for constructor.
     * @param {object[]} xs - xs
     */
    constructor(xs) {
        this.a = xs;
    }
}`,
      options: [{requireReturn: true}],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
 * Description for A.
 */
class A {
    /**
     * Description for method.
     * @param {object[]} xs - xs
     */
    print(xs) {
        this.a = xs;
    }
}`,
      options: [{requireReturn: false}],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
 * Description for A.
 */
class A {
    /**
     * Description for constructor.
     * @param {object[]} xs - xs
     * @returns {void}
     */
    constructor(xs) {
        this.a = xs;
    }
    /**
     * Description for method.
     * @param {object[]} xs - xs
     * @returns {void}
     */
    print(xs) {
        this.a = xs;
    }
}`,
      options: [],
      parserOptions: {
        ecmaVersion: 6,
      },
    },


    {
      code: `
/**
 * Use of this with a 'namepath'.
 * @this some.name
 */
function foo() {}`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
 * Use of this with a type expression.
 * @this {some.name}
 */
function foo() {}`,
      options: [{requireReturn: false}],
    },

        // type validations
    {
      code: `
/**
* Foo
* @param {Array.<*>} hi - desc
* @returns {*} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          Astnode: 'ASTNode',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} hi - desc
* @returns {ASTNode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          Astnode: 'ASTNode',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {{20:string}} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {{String:foo}} hi - desc
* @returns {ASTNode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {String|number|Test} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          test: 'Test',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {Array.<string>} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
    },
    {
      code: `
/**
 * Test dash and slash.
 * @extends module:stb/emitter~Emitter
 */
function foo() {}`,
      options: [{
        requireReturn: false,
      }],
    },
    {
      code: `
/**
 * Test dash and slash.
 * @requires module:config
 * @requires module:modules/notifications
 */
function foo() {}`,
      options: [{
        requireReturn: false,
      }],
    },
    {
      code: `
/**
 * Foo
 * @module module-name
 */
function foo() {}`,
      options: [{
        requireReturn: false,
      }],
    },
    {
      code: `
/**
 * Foo
 * @alias module:module-name
 */
function foo() {}`,
      options: [{
        requireReturn: false,
      }],
    },
    {
      code: `
/**
* Foo
* @param {Array.<string>} hi - desc
* @returns {Array.<string|number>} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {Array.<string|number>} hi - desc
* @returns {Array.<string>} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {Array.<{id: number, votes: number}>} hi - desc
* @returns {Array.<{summary: string}>} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          Number: 'number',
          String: 'string',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {Array.<[string, number]>} hi - desc
* @returns {Array.<[string, string]>} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          Number: 'number',
          String: 'string',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {Object<string,Object<string, number>>} hi - because why not
* @returns {Boolean} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          Number: 'number',
          String: 'string',
        },
      }],
    },
    {
      code: `
/**
* Description
* @param {string} a bar
* @returns {string} desc */
function foo(a = 1){}`,
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
* Description
* @param {string} b bar
* @param {string} a bar
* @returns {string} desc */
function foo(b, a = 1){}`,
      parserOptions: {
        ecmaVersion: 6,
      },
    },

        // abstract
    {
      code: `
/**
* Description
* @abstract
* @returns {Number} desc
*/
function foo(){ throw new Error('Not Implemented'); }`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @virtual
* @returns {Number} desc
*/
function foo(){ throw new Error('Not Implemented'); }`,
      options: [{requireReturn: false}],
    },
    {
      code: `
/**
* Description
* @abstract
* @returns {Number} desc
*/
function foo(){ throw new Error('Not Implemented'); }`,
      options: [{requireReturn: true}],
    },
    {
      code: `
/**
* Description
* @abstract
* @returns {Number} desc
*/
function foo(){}`,
      options: [{requireReturn: true}],
    },
    {
      code: `
/**
 * @param {string} a - a.
 * @param {object} [obj] - obj.
 * @param {string} obj.b - b.
 * @param {string} obj.c - c.
 * @returns {void}
 */
function foo(a, {b, c} = {}) {
    // empty
}`,
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
/**
 * @param {string} a - a.
 * @param {any[]} [list] - list.
 * @returns {void}
 */
function foo(a, [b, c] = []) {
    // empty
}`,
      parserOptions: {ecmaVersion: 6},
    },

    // https://github.com/eslint/eslint/issues/7184
    {
      code: `
/**
* Foo
* @param {{foo}} hi - desc
* @returns {ASTNode} returns a node
*/
function foo(hi){}`,
    },
    {
      code: `
/**
* Foo
* @param {{foo:String, bar, baz:Array}} hi - desc
* @returns {ASTNode} returns a node
*/
function foo(hi){}`,
    },
    {
      code: `
/**
* Foo
* @param {{String}} hi - desc
* @returns {ASTNode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
    },
    {
      code: `
/**
* Foo
* @param {{foo:string, astnode:Object, bar}} hi - desc
* @returns {ASTNode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
    },
  ],

  invalid: [
    {
      code: `
call(
  /**
   * Doc for a function expression in a call expression.
   * @param {string} bogusName This is the param description.
   * @return {string} This is the return description.
   */
  function(argName) {
    return 'the return';
  }
);`,
      options: [{requireReturn: false}],
      errors: [{
        message: "Expected JSDoc for 'argName' but found 'bogusName'.",
        type: 'Block',
      }],
    },
    {
      code: `
/** @@foo */
function foo(){}`,
      errors: [{
        message: 'JSDoc syntax error.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Create a new thing.
*/
var thing = new Thing({
  /**
   * Missing return tag.
   */
  foo: function() {
    return 'bar';
  }
});`,
      options: [{requireReturn: false}],
      errors: [{
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/** @@returns {void} Foo */
function foo(){}`,
      errors: [{
        message: 'JSDoc syntax error.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@returns {void Foo
 */
function foo(){}`,
      errors: [{
        message: 'JSDoc type missing brace.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@return {void} Foo
 */
function foo(){}`,
      options: [{prefer: {return: 'returns'}}],
      errors: [{
        message: 'Use @returns instead.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@argument {int} bar baz
 */
function foo(bar){}`,
      options: [{prefer: {argument: 'arg'}}],
      errors: [{
        message: 'Use @arg instead.',
        type: 'Block',
      }, {
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
 */
function foo(){}`,
      options: [{prefer: {returns: 'return'}}],
      errors: [{
        message: 'Missing JSDoc @return for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@return {void} Foo
 */
foo.bar = () => {}`,
      options: [{prefer: {return: 'returns'}}],
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: 'Use @returns instead.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@param {void Foo
 */
function foo(){}`,
      errors: [{
        message: 'JSDoc type missing brace.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@param {} p Bar
 */
function foo(){}`,
      errors: [{
        message: 'JSDoc syntax error.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@param {void Foo */
function foo(){}`,
      errors: [{
        message: 'JSDoc type missing brace.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
* @param p Desc
*/
function foo(){}`,
      errors: [{
        message: "Missing JSDoc parameter type for 'p'.",
        type: 'Block',
      }, {
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} p
*/
function foo(){}`,
      errors: [{
        message: "Missing JSDoc parameter description for 'p'.",
        type: 'Block',
      }, {
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} p
*/
var foo = function(){}`,
      errors: [{
        message: "Missing JSDoc parameter description for 'p'.",
        type: 'Block',
      }, {
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} p
*/
var foo =
function(){}`,
      errors: [{
        message: "Missing JSDoc parameter description for 'p'.",
        type: 'Block',
      }, {
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
 * Description for a
 */
var A =
  class {
    /**
     * Description for method.
     * @param {object[]} xs - xs
     */
    print(xs) {
        this.a = xs;
    }
};`,
      options: [{
        requireReturn: true,
        matchDescription: '^[A-Z][A-Za-z0-9\\s]*[.]$',
      }],
      errors: [
        {
          message: 'JSDoc description does not satisfy the regex pattern.',
          type: 'Block',
        },
        {
          message: 'Missing JSDoc @returns for function.',
          type: 'Block',
        },
      ],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
* Foo
* @returns {string}
*/
function foo(){}`,
      errors: [{
        message: 'Missing JSDoc return description.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @returns {string} something
*/
function foo(p){}`,
      errors: [{
        message: "Missing JSDoc for parameter 'p'.",
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @returns {string} something
*/
var foo =
function foo(a = 1){}`,
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: "Missing JSDoc for parameter 'a'.",
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} a Description
* @param {string} b Description
* @returns {string} something
*/
var foo =
function foo(b, a = 1){}`,
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: "Expected JSDoc for 'b' but found 'a'.",
        type: 'Block',
      },
      {
        message: "Expected JSDoc for 'a' but found 'b'.",
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} p desc
* @param {string} p desc
*/
function foo(){}`,
      errors: [{
        message: "Duplicate JSDoc parameter 'p'.",
        type: 'Block',
      }, {
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} a desc
@returns {void}*/
function foo(b){}`,
      errors: [{
        message: "Expected JSDoc for 'b' but found 'a'.",
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @override
* @param {string} a desc
 */
function foo(b){}`,
      errors: [{
        message: "Expected JSDoc for 'b' but found 'a'.",
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @inheritdoc
* @param {string} a desc
 */
function foo(b){}`,
      errors: [{
        message: "Expected JSDoc for 'b' but found 'a'.",
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} a desc
*/
function foo(a){var t = false; if(t) {return t;}}`,
      options: [{requireReturn: false}],
      errors: [{
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} a desc
*/
function foo(a){var t = false; if(t) {return null;}}`,
      options: [{requireReturn: false}],
      errors: [{
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* Foo
* @param {string} a desc
@returns {MyClass}*/
function foo(a){var t = false; if(t) {process(t);}}`,
      options: [{requireReturn: false}],
      errors: [{
        message: 'Unexpected @returns tag; function has no return statement.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
 * Does something.
* @param {string} a - this is a
* @return {Array<number>} The result of doing it
*/
 export function doSomething(a) { }`,
      options: [{prefer: {return: 'returns'}}],
      parserOptions: {sourceType: 'module'},
      errors: [{
        message: 'Use @returns instead.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
 * Does something.
* @param {string} a - this is a
* @return {Array<number>} The result of doing it
*/
 export default function doSomething(a) { }`,
      options: [{prefer: {return: 'returns'}}],
      parserOptions: {sourceType: 'module'},
      errors: [{
        message: 'Use @returns instead.',
        type: 'Block',
      }],
    },
    {
      code: '/** foo */ var foo = () => bar();',
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/** foo */ var foo = () => { return bar(); };`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: 'Missing JSDoc @returns for function.',
        type: 'Block',
      }],
    },
    {
      code: `
/** @returns {object} foo */ var foo = () => { bar(); };`,
      options: [{requireReturn: false}],
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: 'Unexpected @returns tag; function has no return statement.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
* @param fields [Array]
 */
 function foo(){}`,
      errors: [
        {
          message: "Missing JSDoc parameter type for 'fields'.",
          type: 'Block',
        },
        {
          message: 'Missing JSDoc @returns for function.',
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Start with caps and end with period
* @return {void} */
function foo(){}`,
      options: [{
        matchDescription: '^[A-Z][A-Za-z0-9\\s]*[.]$',
      }],
      errors: [{
        message: 'JSDoc description does not satisfy the regex pattern.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@return Foo
 */
function foo(){}`,
      options: [{prefer: {return: 'return'}}],
      errors: [{
        message: 'Missing JSDoc return type.',
        type: 'Block',
      }],
    },
    {
      code: `
/** Foo
@return sdf
 */
function foo(){}`,
      options: [{
        prefer: {return: 'return'},
        requireReturn: false,
      }],
      errors: [{
        message: 'Unexpected @return tag; function has no return statement.',
        type: 'Block',
      }],
    },

        // classes
    {
      code: `
/**
 * Description for A
 */
class A {
    /**
     * Description for constructor
     * @param {object[]} xs - xs
     */
    constructor(xs) {
        this.a = xs;
    }
}`,
      options: [{
        requireReturn: false,
        matchDescription: '^[A-Z][A-Za-z0-9\\s]*[.]$',
      }],
      errors: [
        {
          message: 'JSDoc description does not satisfy the regex pattern.',
          type: 'Block',
        },
        {
          message: 'JSDoc description does not satisfy the regex pattern.',
          type: 'Block',
        },
      ],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
 * Description for a
 */
var A = class {
    /**
     * Description for constructor.
     * @param {object[]} xs - xs
     */
    print(xs) {
        this.a = xs;
    }
};`,
      options: [{
        requireReturn: true,
        matchDescription: '^[A-Z][A-Za-z0-9\\s]*[.]$',
      }],
      errors: [
        {
          message: 'JSDoc description does not satisfy the regex pattern.',
          type: 'Block',
        },
        {
          message: 'Missing JSDoc @returns for function.',
          type: 'Block',
        },
      ],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
 * Description for A.
 */
class A {
    /**
     * Description for constructor.
     * @param {object[]} xs - xs
     * @returns {void}
     */
    constructor(xs) {
        this.a = xs;
    }
    /**
     * Description for method.
     */
    print(xs) {
        this.a = xs;
    }
}`,
      options: [],
      errors: [
        {
          message: 'Missing JSDoc @returns for function.',
          type: 'Block',
        },
        {
          message: "Missing JSDoc for parameter 'xs'.",
          type: 'Block',
        },
      ],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: `
/**
 * Use of this with an invalid type expression
 * @this {not.a.valid.type.expression
 */
function foo() {}`,
      options: [{requireReturn: false}],
      errors: [{
        message: 'JSDoc type missing brace.',
        type: 'Block',
      }],
    },
    {
      code: `
/**
 * Use of this with a type that is not a member expression
 * @this {Array<string>}
 */
function foo() {}`,
      options: [{requireReturn: false}],
      errors: [{
        message: 'JSDoc syntax error.',
        type: 'Block',
      }],
    },

        // type validations
    {
      code: `
/**
* Foo
* @param {String} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          Astnode: 'ASTNode',
        },
      }],
      errors: [
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
        {
          message: "Use 'ASTNode' instead of 'Astnode'.",
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Foo
* @param {{20:String}} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          Astnode: 'ASTNode',
        },
      }],
      errors: [
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
        {
          message: "Use 'ASTNode' instead of 'Astnode'.",
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Foo
* @param {String|number|test} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          test: 'Test',
        },
      }],
      errors: [
        {
          message: "Use 'Test' instead of 'test'.",
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Foo
* @param {Array.<String>} hi - desc
* @returns {Astnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
      errors: [
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Foo
* @param {Array.<{id: Number, votes: Number}>} hi - desc
* @returns {Array.<{summary: String}>} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          Number: 'number',
          String: 'string',
        },
      }],
      errors: [
        {
          message: "Use 'number' instead of 'Number'.",
          type: 'Block',
        },
        {
          message: "Use 'number' instead of 'Number'.",
          type: 'Block',
        },
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Foo
* @param {Array.<[String, Number]>} hi - desc
* @returns {Array.<[String, String]>} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          Number: 'number',
          String: 'string',
        },
      }],
      errors: [
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
        {
          message: "Use 'number' instead of 'Number'.",
          type: 'Block',
        },
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
      ],
    },
    {
      code: `
/**
* Foo
* @param {object<String,object<String, Number>>} hi - because why not
* @returns {Boolean} desc
*/
function foo(hi){}`,
      options: [{
        preferType: {
          Number: 'number',
          String: 'string',
          object: 'Object',
        },
      }],
      errors: [
        {
          message: "Use 'Object' instead of 'object'.",
          type: 'Block',
        },
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
        {
          message: "Use 'Object' instead of 'object'.",
          type: 'Block',
        },
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
        {
          message: "Use 'number' instead of 'Number'.",
          type: 'Block',
        },
      ],
    },

        // https://github.com/eslint/eslint/issues/7184
    {
      code: `
/**
* Foo
* @param {{foo:String, astnode:Object, bar}} hi - desc
* @returns {ASTnode} returns a node
*/
function foo(hi){}`,
      options: [{
        preferType: {
          String: 'string',
          astnode: 'ASTNode',
        },
      }],
      errors: [
        {
          message: "Use 'string' instead of 'String'.",
          type: 'Block',
        },
      ],
    },
  ],
});

// Tests that the jsdoc rule marks type variables as used.  ruleTester limits us
// to testing one rule at a time.  We can work around that limitation by loading
// rules with an ESLint comment.
ruleTester.defineRule('tempJsdoc', jsdocRule);
const jsdocInlineOptions = `/* eslint tempJsdoc: 1 */`;

ruleTester.run('no-unused-vars', noUnusedVarsRule, {
  valid: [
    {
      code: `${jsdocInlineOptions}
/** @export {number} */
var Corge;`,
    },
    {
      code: `${jsdocInlineOptions}
/** @type {number} */
var Corge;`,
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
var Corge;
/** @const {Corge} */
window.qux = 2;`,
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
var Foo;
/** @return {Foo} A number. */
window.qux = function() { return 2; }`,
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
let Bar;
/** @return {Bar} A number. */
window.qux = function() { return 2; }`,
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
let Bar;
/** @return {{bar: Bar}} A number. */
window.qux = function() { return 2; }`,
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
let Bar;
/** @return {Array<Bar>} A number. */
window.qux = function() { return 2; }`,
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
var Bar;
/** @return {Object<string, Bar>} A number. */
window.qux = function() { return 2; }`,
    },
    {
      code: `${jsdocInlineOptions}
/** @typedef {number} */
var Bar;
/**
 * @param {Bar=} corge A number.
 * @return {number} A number.
 */
window.qux = function(corge) { return corge; }`,
    },
  ],
  invalid: [],

});
