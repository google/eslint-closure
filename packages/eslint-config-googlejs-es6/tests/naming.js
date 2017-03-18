/**
 * @param {function()} opt_bar
 */
function foo(opt_bar) { // ERROR: googlejs/camelcase
  // ERROR:  googlejs/camelcase
  opt_bar();
}
foo();
