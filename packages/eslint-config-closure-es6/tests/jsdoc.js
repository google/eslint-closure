/**
 * @param {!types} arg1
 * @param {!Baz} arg2
 * @return {void}
 */
function foo(arg1, arg2) {
  arg1.fakeMethod();
  arg2.call(null);
}

// ERROR: googlejs/jsdoc
/**
 * @param {!types} arg
 * @return {void}
 */
function bar(arg1) {
  arg1.fakeMethod();
}

// ERROR: googlejs/jsdoc
/**
 * @param {} arg1
 * @return {void}
 */
function baz(arg1) {
  arg1.fakeMethod();
}

foo();
bar();
baz();
