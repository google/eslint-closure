/**
 * @fileoverview Build file for the googlejs ESLint plugin.
 */

/* global echo, exec, exit, find, target, rm */
/* eslint no-use-before-define: "off", no-console: "off" */
'use strict';

require('shelljs/make');

const closurePackage = require('google-closure-compiler');
const ClosureCompiler = closurePackage.compiler;
const nodeCLI = require('shelljs-nodecli');

/* eslint-disable googlejs/camelcase */


const NODE_MODULES = './node_modules';

// Utilities - intentional extra space at the end of each string.
const MOCHA = `${NODE_MODULES}/mocha/bin/_mocha `;
const ESLINT = 'eslint ';

// Files
const MAKEFILE = './Makefile.js';
const JS_FILES = 'lib/**/*.js';
const TEST_FILES = 'dist/tests/rules/**/*.js dist/tests/*.js';

// Settings
const MOCHA_TIMEOUT = 10000;

const commonClosureCompilerSettings = {
  js: [
    'index.js',
    "'./lib/**.js'",
  ],
  externs: [
    './externs/externs-chai.js',
    './externs/externs-commonjs.js',
    './externs/externs-eslint.js',
    './externs/externs-espree.js',
    './externs/externs-escope.js',
    './externs/externs-mocha.js',
  ],
  language_in: 'ECMASCRIPT6_STRICT',
  language_out: 'ECMASCRIPT5_STRICT',
  // warning_level: 'VERBOSE',
  // jscomp_error: "'*'",
  // We use null for options that don't have a value.  Otherwise, it errors
  // out.  The existence of 'checks-only' is enough for it to be included as
  // an option.
  new_type_inf: null,
  assume_function_wrapper: null,
  process_closure_primitives: null,
  hide_warnings_for: 'google-closure-library',
  dependency_mode: 'STRICT',
  entry_point: 'googlejs.config',
};

const closureJavaOptions = [];

const CLOSURE_BASE_JS =
      './node_modules/google-closure-library/closure/goog/base.js';

const CLOSURE_LIB_JS =
      './node_modules/google-closure-library/closure/goog/**.js';
target.all = function() {
  target.test();
};

target.checkTypes = function() {
  console.log('Checking types.');
  const closureCompilerTypeCheck = new ClosureCompiler(
    Object.assign(commonClosureCompilerSettings, {
      checks_only: null,
    }),
    closureJavaOptions
  );

  closureCompilerTypeCheck.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
};

target.buildSimple = function() {
  console.log('Building the googlejs plugin library with SIMPLE ' +
              'optimizations.');
  const closureCompilerBuild = new ClosureCompiler(
    Object.assign(commonClosureCompilerSettings, {
      js_output_file: './dist/googlejs-eslint-plugin.js',
      compilation_level: 'SIMPLE',
      assume_function_wrapper: null,
      formatting: 'PRETTY_PRINT',
      rewrite_polyfills: false,
    }),
    closureJavaOptions
  );

  closureCompilerBuild.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
};


/**
  * Translate a file name into a module name.
  * @param {string} testFile
  * @return {string} The module name.
  */
function getModuleFromFile(testFile) {
  return testFile.replace(/^\.\//, '')
      .replace(/\.js$/, '')
      .replace(/\//g, '.')
      .replace(/^/, 'googlejs.');
}

/**
  * @param {string} testFile
  * @param {string} entryPoint
  * @return {!Object} The closure compiler.
  */
function buildTestCompiler(testFile, entryPoint) {
  const compiler = new ClosureCompiler(
      Object.assign(commonClosureCompilerSettings, {
        js: [
          CLOSURE_BASE_JS,
          // CLOSURE_LIB_JS,
          "'./lib/**.js'",
          testFile,
        ],
        js_output_file: `./dist/${testFile}`,
        compilation_level: 'WHITESPACE_ONLY',
        formatting: 'PRETTY_PRINT',
        entry_point: entryPoint,
        rewrite_polyfills: false,
      }),
      closureJavaOptions
  );
  return compiler;
}

target.buildTest = function() {
  console.log('Building the googlejs plugin library for testing.');

  const testFiles = [
    './tests/utils.js',
    './tests/rules/camelcase.js',
    './tests/rules/indent.js',
    './tests/rules/inlineCommentSpacing.js',
  ];

  for (const testFile of testFiles) {
    const entryPoint = getModuleFromFile(testFile);
    const compiler = buildTestCompiler(testFile, entryPoint);
    compiler.run(function(exitCode, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  }
};

target.testIndent = function() {
  console.log('Testing the googlejs plugin indent functionality.');

  const testFileOld = './tests/rules/indent.js';
  const testFileNew = './tests/rules/indent-new.js';
  const compilerTest = buildTestCompiler(
    testFileOld, 'googlejs.tests.rules.indent');
  const compilerNewIndentTest = buildTestCompiler(
    testFileNew, 'googlejs.tests.rules.indentNew');

  compilerTest.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });

  compilerNewIndentTest.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });

};

function kebabToCamel(string) {
  return string.replace(/(\-\w)/g, (match) => match[1].toUpperCase());
}

target.testRule = function(args) {
  const rule = args[0];
  console.log(`Testing the googlejs plugin rule ${rule}.`);

  const testOutput = `./dist/tests/rules/${rule}.js`;
  rm('-f', testOutput);

  const testPath = './tests/rules';
  const camelRule = kebabToCamel(rule);
  const compilerTest = buildTestCompiler(
    `${testPath}/${rule}.js`, `googlejs.tests.rules.${camelRule}`);

  compilerTest.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log('pwd', process.cwd());
    nodeCLI.exec('./node_modules/mocha/bin/_mocha', '-R progress',
                 ` -t  ${MOCHA_TIMEOUT}`, '-c', testOutput);
  });
};

target.buildAdvanced = function() {
  console.log('Building the googlejs plugin library with ADVANCED ' +
              'optimizations.');
  const closureCompilerBuild = new ClosureCompiler(
    Object.assign(commonClosureCompilerSettings, {
      js_output_file: './dist/googlejs-eslint-plugin.min.js',
      compilation_level: 'ADVANCED',
      use_types_for_optimization: null,
      rewrite_polyfills: false,
    }),
    closureJavaOptions
  );

  closureCompilerBuild.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
};

target.lint = function() {
  let errors = 0;
  let makeFileCache = ' ';
  let jsCache = ' ';
  let testCache = ' ';
  let lastReturn;

    // using the cache locally to speed up linting process
  if (!process.env.TRAVIS) {
    makeFileCache = ' --cache --cache-file .cache/makefile_cache ';
    jsCache = ' --cache --cache-file .cache/js_cache ';
    testCache = ' --cache --cache-file .cache/test_cache ';
  }

  echo('Linting Makefile.js');
  lastReturn = exec(ESLINT + makeFileCache + MAKEFILE);
  if (lastReturn.code !== 0) {
    errors++;
  }

  echo('Linting JavaScript files');
  lastReturn = exec(ESLINT + jsCache + JS_FILES);
  if (lastReturn.code !== 0) {
    errors++;
  }

  echo('Linting JavaScript test files');
  lastReturn = exec(ESLINT + testCache + TEST_FILES);
  if (lastReturn.code !== 0) {
    errors++;
  }

  if (errors) {
    exit(1);
  }
};


target.test = function() {
  // target.lint();
  // target.checkRuleFiles();
  let errors = 0;
  let lastReturn;

  // exec(ISTANBUL + " cover " + MOCHA + "-- -c " + TEST_FILES);
  lastReturn = nodeCLI.exec('istanbul', 'cover', MOCHA,
                            `-- -R progress -t  ${MOCHA_TIMEOUT}`,
                            '-c', TEST_FILES);
  if (lastReturn.code !== 0) {
    errors++;
  }

  lastReturn = nodeCLI.exec(
      'istanbul', 'check-coverage',
      '--statement 99 --branch 98 --function 99 --lines 99');
  if (lastReturn.code !== 0) {
    errors++;
  }

  // target.browserify();

  // lastReturn = nodeCLI.exec('karma', "start karma.conf.js");
  // if (lastReturn.code !== 0) {
  //   errors++;
  // }

  if (errors) {
    exit(1);
  }

  // target.checkLicenses();
};
