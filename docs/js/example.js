goog.require('module.name')

// goog.scope recoginized as an IIFE.
goog.scope(function() {

  /**
   * Typedefs are marked as used.
   * @typedef {number}
   */
  let Bar;

  // BAD: unused variable.
  let unusedVar = 2;

  /**
   * @param {Bar} arg1
   * @returns {Bar}
   * BAD: unused function.
   */
  function foo(arg1) {
    // BAD(es6): prefer const for unchanging variables
    let result = arg1 + 2;
    // BAD(es6): use template strings.
    const myString = 'string' + result;
    // BAD: incorrect indentation.
    return myString;
  }

  // OKAY: ES6 features with either the ES5 or ES6 config.
  const myMap = new Map();
  myMap.set(2, 'foo');
  // BAD: undeclared variable and trailing space
  undeclaredVar.foo();

  // OKAY: module.name is goog.provide'd
  module.name.fooBar();
  // BAD: module.wrongName is not goog.provide'd.
  module.wrongName();
});
