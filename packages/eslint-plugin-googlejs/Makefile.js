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

const MOCHA = `${NODE_MODULES}/mocha/bin/_mocha`;
const ESLINT = 'eslint';

const MAKEFILE = './Makefile.js';
const JS_FILES = 'lib/**/*.js';
const SOURCE_TEST_FILES = 'tests/*.js tests/**/*.js';

const MOCHA_TIMEOUT = 10000;

const COMPILER_ERROR_LIST = [
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

const COMPILER_WARNING_LIST = [
];

const COMPILER_OFF_LIST = [
  // Warnings for any place in the code where type is inferred to ?. NOT
  // RECOMMENDED!
  'reportUnknownTypes',
];

const CLOSURE_BASE_JS =
      './node_modules/google-closure-library/closure/goog/base.js';

const CLOSURE_LIB_JS =
    './node_modules/google-closure-library/closure/goog/**.js';


const COMMON_CLOSURE_COMPILER_SETTINGS = {
  js: [
    'index.js',
    "'./lib/**.js'",
    CLOSURE_LIB_JS,
  ],
  externs: [
    './externs/externs-ast.js',
    './externs/externs-chai.js',
    './externs/externs-commonjs.js',
    './externs/externs-doctrine.js',
    './externs/externs-eslint.js',
    './externs/externs-escope.js',
    './externs/externs-espree.js',
    './externs/externs-lodash.js',
    './externs/externs-mocha.js',
  ],
  language_in: 'ECMASCRIPT6_STRICT',
  language_out: 'ECMASCRIPT5_STRICT',

  warning_level: 'VERBOSE',
  jscomp_error: COMPILER_ERROR_LIST,
  jscomp_warning: COMPILER_WARNING_LIST,
  jscomp_off: COMPILER_OFF_LIST,

  // We use undefined for options that don't have a value.  Otherwise, the
  // compiler errors out because tries to pass '--new_type_inf=' to the command
  // line.  The existence of the 'checks-only' property is enough for it to be
  // included as an option.  Alternately, using true as the value doesn't seem
  // to work.  Sigh.
  new_type_inf: undefined,
  assume_function_wrapper: undefined,
  process_closure_primitives: undefined,
  // Assume node JS supports ES6.  Tests will fail if this assumption is wrong.
  rewrite_polyfills: false,
  hide_warnings_for: 'google-closure-library',
  dependency_mode: 'STRICT',
  entry_point: 'googlejs.config',
};

const CLOSURE_JAVA_OPTIONS = [];

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
  const fullTestFilePath = getFullTestFilePath(testFilePath);
  const compiler = new ClosureCompiler(
      Object.assign(COMMON_CLOSURE_COMPILER_SETTINGS, {
        js: [
          CLOSURE_LIB_JS,
          "'./lib/**.js'",
          fullTestFilePath,
        ],
        js_output_file: outputFile,
        create_source_map: `${outputFile}.map`,
        source_map_location_mapping: `'${__dirname}|../..'`,
        output_wrapper: `//# sourceMappingURL=${outputFile}.map
require('source-map-support').install();
%output%`,
        // This is slower but errors aren't reported with WHITESPACE_ONLY.
        compilation_level: 'SIMPLE',
        formatting: 'PRETTY_PRINT',
        entry_point: entryPoint,
        rewrite_polyfills: false,
      }),
      CLOSURE_JAVA_OPTIONS
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
 * Gets the full path of test file that is specified relative to the top level
 * directory.
 * @param {string} testFilePath
 * @return {string}
 */
function getFullTestFilePath(testFilePath) {
  const relPath = path.relative(__dirname, path.normalize(testFilePath));
  const fullPath = path.join(__dirname, relPath);
  return fullPath;
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
  nodeCLI.exec(
      MOCHA, '-R progress', ` -t  ${MOCHA_TIMEOUT}`, '--no-colors',
      testOutputFile);
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
      Object.assign(COMMON_CLOSURE_COMPILER_SETTINGS, {
        checks_only: undefined,
      }),
      CLOSURE_JAVA_OPTIONS
  );

  closureCompilerTypeCheck.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
};

target.buildSimple = () => {
  echo('Building the googlejs plugin library with SIMPLE optimizations.');
  const closureCompilerBuild = new ClosureCompiler(
      Object.assign(COMMON_CLOSURE_COMPILER_SETTINGS, {
        js_output_file: './dist/googlejs-eslint-plugin.js',
        compilation_level: 'SIMPLE',
        formatting: 'PRETTY_PRINT',
        rewrite_polyfills: false,
      }),
      CLOSURE_JAVA_OPTIONS
  );

  closureCompilerBuild.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
};

target.buildAdvanced = () => {
  echo('Building the googlejs plugin library with ADVANCED optimizations.');
  const closureCompilerBuild = new ClosureCompiler(
      Object.assign(COMMON_CLOSURE_COMPILER_SETTINGS, {
        js_output_file: './dist/googlejs-eslint-plugin.min.js',
        compilation_level: 'ADVANCED',
        use_types_for_optimization: undefined,
      }),
      CLOSURE_JAVA_OPTIONS
  );

  closureCompilerBuild.run((exitCode, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
  });
};

/**
 * Tests the supplied rules, i.e. npm run testRule no-undef indent.
 * @param {!Array<string>} rules
 */
target.testRule = (rules) => {
  const expandedRulesPaths = rules.map(rule => {
    const baseRule = path.basename(rule, '.js');
    return `tests/rules/${baseRule}.js`;
  });
  target.testFile(expandedRulesPaths);
};

/**
 * Tests the supplied files, i.e.
 * npm run testFile tests/rules/no-undef.js tests/utils.js
 * @param {!Array<string>} files
 */
target.testFile = (files) => {
  if (files.length == 0) {
    throw new Error('Need at least one file to test.');
  }
  for (const file of files) {
    // Remove any paths just in case.
    buildTest(file, runTest);
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

  // Remove stale tests.
  rm('-r', './dist/tests');
  testAllFiles((outputFile) => {
    lastReturn = nodeCLI.exec(
        MOCHA, '-R progress', ` -t  ${MOCHA_TIMEOUT}`, '-c', outputFile);
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
