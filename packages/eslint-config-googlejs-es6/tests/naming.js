/**
 * @param {function()} opt_bar
 */
function _foo(opt_bar) { // ERROR: googlejs/camelcase
  // ERROR:  googlejs/camelcase
  opt_bar();
}

function bar_(var_args) { // ERROR: googlejs/camelcase
  var_args(); // ERROR: googlejs/camelcase
}

function qux(foo_bar) { // ERROR: googlejs/camelcase
  foo_bar();
  return {
    // GOOD: too many false positives with protos.
    baz_bar: 2,
  };
}

function qux_qux() { // ERROR: googlejs/camelcase
}

_foo();
bar_();
qux();
qux_qux();
