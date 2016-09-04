const closurePackage = require('google-closure-compiler');
const ClosureCompiler = closurePackage.compiler;

/* eslint-disable googlejs/camelcase */

var compiler = new ClosureCompiler(
  {
    js: [
      'index.js',
      './lib/**.js',
    ],
    externs: [
      './externs/externs-eslint.js',
      './externs/externs-espree.js',
      './externs/externs-commonjs.js',
    ],
    language_in: 'ECMASCRIPT6_STRICT',
    warning_level: 'VERBOSE',
    jscomp_error: '*',
    // We use null for options that don't have a value.  Otherwise, it errors
    // out.  The existence of 'checks-only' is enough for it to be included as
    // an option.
    checks_only: null,
    // Don't process commonjs modules.  Use an externs to stub them out.  We
    // rely on externs for typechecking.  Including node_modules is expensive
    // and we'd have to ignore errors or use externs for all libraries.
    // process_common_js_modules: null,
    new_type_inf: null,
    dependency_mode: 'STRICT',
    entry_point: './index.js',
  },
  // Java options.
  [
  ]
  );

compiler.run(function(exitCode, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
});


