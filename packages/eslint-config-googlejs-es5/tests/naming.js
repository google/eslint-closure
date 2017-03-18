function qux(foo_bar) { // ERROR: googlejs/camelcase
  foo_bar();
}

function foo(opt_bar) {
  opt_bar();
}

function bar(var_args) {
  var_args();
}

qux();
foo();
bar();
