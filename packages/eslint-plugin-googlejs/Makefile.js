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
const path = require('path');

/* eslint-disable googlejs/camelcase */


const NODE_MODULES = './node_modules';

// Intentional extra space at the end of each string so it still works if we
// forget to concat with an extra space.
const MOCHA = `${NODE_MODULES}/mocha/bin/_mocha `;
const ESLINT = 'eslint ';

const MAKEFILE = './Makefile.js';
const JS_FILES = 'lib/**/*.js';
const SOURCE_TEST_FILES = 'tests/*.js tests/**/*.js';
const DIST_TEST_FILES = 'dist/tests/*.js dist/tests/**/*.js';

const MOCHA_TIMEOUT = 10000;

const COMPILER_ERROR_LIST = [
  // Warnings about ambiguous definitions of functions. On Chrome, if (false) {
  // function f() {} } declared 'f' in the global scope anyway. Future versions
  // of javascript forbid this, because the actual semantics differ between
  // browsers.
  'ambiguousFunctionDecl',
  // Warnings when vars are not declared or declared multiple times in the
  // global scope.
  'checkVars',
  // Warnings about misused goog.provide/goog.require calls
  'closureDepMethodUsageChecks',
  // Warnings when a variable is declared twice in the global scope
  'duplicate',
  // Warnings when two i18n messages have the same id
  'duplicateMessage',
  // Warnings about EcmaScript3
  'es3',
  // Warnings about EcmaScript5 strict mode
  'es5Strict',
  // Warnings about syntax error on Internet Explorer.
  'internetExplorerChecks',
  // Warnings when a variable is never defined.
  'undefinedVars',
  // Warnings when there are references in earlier modules to variables defined
  // in later modules
  'violatedModuleDep',
];

const COMPILER_OFF_LIST = [
  // Warnings when @deprecated, @private, @protected, or @package are violated.
  'accessControls',
  // Warnings when the 'debugger' keyword is used.
  'checkDebuggerStatement',
  // Warnings about undisposed eventful objects.
  'checkEventfulObjectDisposal',
  // Warnings about weird regular expression literals
  'checkRegExp',
  // Warnings when a variable or member property marked @const is reassigned.
  'const',
  // Warnings when a member property marked @const is reassigned.
  'constantProperty',
  // Warnings when non-deprecated code accesses code that's marked @deprecated
  'deprecated',
  // Warnings when using annotations that are deprecated
  'deprecatedAnnotations',
  // Warnings about unnecessary goog.require calls
  'extraRequire',
  // Warnings if a @const declaration contains no declared type and the compiler
  // cannot infer one
  'inferredConstCheck',
  // Warnings about strings that should only be used inside calls to
  // goog.getCssName
  'missingGetCssName',
  // Warnings about whether a property will ever be defined on an object. Part
  // of type-checking.
  'missingProperties',
  // Warnings if missing a goog.provide('Foo') when defining a Foo class
  'missingProvide',
  // Warnings if missing a goog.require('Foo') when a new Foo() is encountered
  'missingRequire',
  // Warnings if missing return in a function which a non-void return type
  'missingReturn',
  // Warnings from new type checker
  'newCheckTypes',
  // Warnings for any place in the code where type is inferred to ?. NOT
  // RECOMMENDED!
  'reportUnknownTypes',
  // Warnings about all references potentially violating module dependencies
  'strictModuleDepCheck',
  // Warnings about goog.tweak primitives
  'tweakValidation',
  // Warn about properties that cannot be disambiguated when using type based
  // optimizations
  'typeInvalidation',
  // Warnings when a property of a global name is not defined.
  'undefinedNames',
  // Warnings aout usages of goog.base, which is not compatible with strict mode
  'useOfGoogBase',
  // Warnings when @private and @protected are violated.
  'visibility',
];

const COMPILER_WARNING_LIST = [
  // Type-checking
  'checkTypes',
  // Warnings about conformance violations and possible conformance violations.
  'conformanceViolations',
  // Warnings about malformed externs files
  'externsValidation',
  // Warnings about duplicate @fileoverview tags
  'fileoverviewTags',
  // Warnings about improper use of the global this.
  'globalThis',
  // Warnings about invalid type casts.
  'invalidCasts',
  // Warnings about jsdoc type annotations that are misplaced
  'misplacedTypeAnnotation',
  // Warnings when JSDoc has annotations that the compiler thinks you
  // misspelled.
  'nonStandardJsDocs',
  // Warning about things like missing semicolons and comparisons to NaN
  'suspiciousCode',
  // Warnings when unknown @define values are specified.
  'unknownDefines',
  // Warnings when the compiler sees useless code that it plans to remove.
  'uselessCode',
];

const commonClosureCompilerSettings = {
  js: [
    'index.js',
    "'./lib/**.js'",
  ],
  externs: [
    './externs/externs-chai.js',
    './externs/externs-commonjs.js',
    './externs/externs-doctrine.js',
    './externs/externs-eslint.js',
    './externs/externs-espree.js',
    './externs/externs-escope.js',
    './externs/externs-mocha.js',
  ],
  language_in: 'ECMASCRIPT6_STRICT',
  language_out: 'ECMASCRIPT5_STRICT',
  warning_level: 'VERBOSE',
  jscomp_error: COMPILER_ERROR_LIST,
  jscomp_warning: COMPILER_WARNING_LIST,
  jscomp_off: COMPILER_OFF_LIST,

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

/**
 * @typedef {{
 *   compiler: !Object,
 *   outputFile: string,
 * }}
 */
let CompiledInfo;

/**
 * Builds a compiler object suitable for building the output test file that's
 * directly runnable by Node JS.
 * @param {string} testFilePath
 * @param {string} entryPoint
 * @return {!CompiledInfo} An object with the closure compiler and the output
 *     file.
 */
function buildTestCompiler(testFilePath, entryPoint) {
  const outputFile = getTestFilePathOutputLocation(testFilePath);
  const compiler = new ClosureCompiler(
      Object.assign(commonClosureCompilerSettings, {
        js: [
          CLOSURE_BASE_JS,
          // CLOSURE_LIB_JS,
          "'./lib/**.js'",
          testFilePath,
        ],
        js_output_file: outputFile,
        compilation_level: 'WHITESPACE_ONLY',
        formatting: 'PRETTY_PRINT',
        entry_point: entryPoint,
        rewrite_polyfills: false,
      }),
      closureJavaOptions
  );
  return {compiler, outputFile};
}

/**
 * Changes code-like-this to codeLikeThis, i.e. kebab-case to camelCase.
 * @param {string} string
 * @return {string}
 */
function kebabToCamel(string) {
  return string.replace(/(\-\w)/g, (match) => match[1].toUpperCase());
}

/**
 * Converts a path to a test file to the corresponding goog.module name.
 * @param {string} testFilePath
 * @return {string}
 */
function convertTestFilePathToModuleName(testFilePath) {
  const pathComponents = path.parse(path.normalize(testFilePath));
  const relPath = path.relative(__dirname, pathComponents.dir);
  const moduleNamePath = relPath.split(path.sep).join('.');
  const moduleName = kebabToCamel(pathComponents.name);
  const fullModuleName = `googlejs.${moduleNamePath}.${moduleName}`;
  return fullModuleName;
}

/**
 * Gets the corresponding output file path for a test file.
 * @param {string} testFilePath
 * @return {string} The output path for the compiled test file.
 */
function getTestFilePathOutputLocation(testFilePath) {
  const relPath = path.relative(__dirname, path.normalize(testFilePath));
  const outputPath = path.join(__dirname, 'dist', relPath);
  return outputPath;
}

/**
 * Builds a runnable test for mocha and return the output file path.
 * @param {string} testFilePath
 * @param {function(string)} onCompilation Function to run after compilation.
 * @return {string} The output file.
 */
function buildTest(testFilePath, onCompilation) {
  const moduleName = convertTestFilePathToModuleName(testFilePath);
  const compilerInfo = buildTestCompiler(testFilePath, moduleName);
  // Delete existing test so we don't run it again if the compilation fails.
  rm('-f', compilerInfo.outputFile);
  compilerInfo.compiler.run((exitCode, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    onCompilation(compilerInfo.outputFile);
  });
  return compilerInfo.outputFile;
}

/**
 * Runs a compiled test.
 * @param {string} testOutputFile
 */
function runTest(testOutputFile) {
  nodeCLI.exec('./node_modules/mocha/bin/_mocha', '-R progress',
               ` -t  ${MOCHA_TIMEOUT}`, '-c', testOutputFile);
}

/**
 * Builds all tests in project and runs the callback onCompilation for each
 * test.
 * @param {function(string)} onCompilation Function to run after compilation.
 */
function testAllFiles(onCompilation) {
  /** @type {!Array<string>} */
  const allTests = find('./tests').filter((file) => file.match(/\.js$/));
  allTests.forEach((path) => buildTest(path, onCompilation));
}


target.all = () => {
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

target.buildSimple = () => {
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

target.buildAdvanced = () => {
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

/**
 * Tests the supplied rules, i.e. no-undef indent.
 * @param {!Array<string>} args
 */
target.testRule = (args) => {
  if (args.length == 0) {
    throw new Error('Need at least one rule to test.');
  }
  for (const rule of args) {
    // Remove any paths just in case.
    const baseRule = path.basename(rule, '.js');
    buildTest(`tests/rules/${baseRule}.js`, runTest);
  }
};

target.lint = () => {
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
  lastReturn = exec(ESLINT + testCache + SOURCE_TEST_FILES);
  if (lastReturn.code !== 0) {
    errors++;
  }

  if (errors) {
    exit(1);
  }
};

target.test = () => {
  // target.lint();

  let errors = 0;
  let lastReturn = 0;

  rm('-r', './dist/tests');
  testAllFiles((outputFile) => {
    lastReturn = nodeCLI.exec(
        'istanbul', 'cover', MOCHA, `-- -R progress -t  ${MOCHA_TIMEOUT}`,
        '-c', outputFile);

    if (lastReturn.code !== 0) {
      errors++;
    }
  });

  // lastReturn = nodeCLI.exec(
  //     'istanbul', 'check-coverage',
  //     '--statement 99 --branch 98 --function 99 --lines 99');
  // if (lastReturn.code !== 0) {
  //   errors++;
  // }

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
