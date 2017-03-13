goog.require('module.name');


/**
 * Typedefs are marked as used.
 * @typedef {number}
 */
var Foo;

/**
 * @typedef {number}
 */
var Bar;

/**
 * @param {Bar} arg1
 * @return {Bar}
 */
function foo(arg1) {
  return arg1;
}

module.name.fooBar();
