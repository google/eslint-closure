/**
 * @param {function()} opt_bar
 */
function _foo(opt_bar) { // ERROR: closure/camelcase
  // ERROR:  closure/camelcase
  opt_bar();
}

function bar_(var_args) { // ERROR: closure/camelcase
  var_args(); // ERROR: closure/camelcase
}

function qux(foo_bar) { // ERROR: closure/camelcase
  foo_bar();
  return {
    // GOOD: too many false positives with protos.
    baz_bar: 2,
  };
}

function qux_qux() { // ERROR: closure/camelcase
}

_foo();
bar_();
qux();
qux_qux();
