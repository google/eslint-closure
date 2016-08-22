const closurePackage = require('google-closure-compiler');
const ClosureCompiler = closurePackage.compiler;

var compiler = new ClosureCompiler(
  {
    js: [
      'index.js',
      './lib/*.js',
    ],
    externs: [
      './externs.js',
    ],
    language_in: 'ECMASCRIPT6_STRICT',
    warning_level: 'VERBOSE',
    jscomp_error: '*',
    checks_only: null,
    process_common_js_modules: null,
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


