/**
 * @fileoverview Build file for the googlejs ESLint plugin.
 */

/* global echo, exec, exit, find, ls, target, test*/
/* eslint no-use-before-define: "off", no-console: "off" */
'use strict';

require("shelljs/make");

const closurePackage = require('google-closure-compiler');
const ClosureCompiler = closurePackage.compiler;
const nodeCLI = require("shelljs-nodecli");

/* eslint-disable googlejs/camelcase */


const NODE_MODULES = "./node_modules/",

    // Utilities - intentional extra space at the end of each string.
    MOCHA = NODE_MODULES + "mocha/bin/_mocha ",
    KARMA = NODE_MODULES + "karma/bin/karma ",
    ESLINT = "eslint ",

    // Files
    MAKEFILE = "./Makefile.js",
    JS_FILES = "lib/**/*.js",
    TEST_FILES = "tests/lib/rules/**/*.js tests/lib/*.js",

    // Settings
    MOCHA_TIMEOUT = 10000;

const closureCompiler = new ClosureCompiler(
  {
    js: [
      'index.js',
      "'./lib/**.js'",
    ],
    externs: [
      './externs/externs-eslint.js',
      './externs/externs-espree.js',
      // './externs/externs-commonjs.js',
    ],
    language_in: 'ECMASCRIPT6_STRICT',
    warning_level: 'VERBOSE',
    jscomp_error: "'*'",
    // We use null for options that don't have a value.  Otherwise, it errors
    // out.  The existence of 'checks-only' is enough for it to be included as
    // an option.
    checks_only: null,
    // Don't process commonjs modules.  Use an externs to stub them out.  We
    // rely on externs for typechecking.  Including node_modules is expensive
    // and we'd have to ignore errors or use externs for all libraries.
    process_common_js_modules: null,
    new_type_inf: null,
    // We need LOOSE because we might as well type check all files.  If we used
    // STRICT, closure would ignore all files it couldn't reach from the
    // entry_point.
    dependency_mode: 'LOOSE',
    entry_point: './index.js',
    js_module_root: '.',
    // output_manifest: 'manifest.MF',
    // debug: null,
  },
  // Java options.
  [
  ]
);



target.all = function() {
  target.test();
};

target.checkTypes = function() {
  closureCompiler.run(function(exitCode, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
};


target.lint = function() {
    let errors = 0,
        makeFileCache = " ",
        jsCache = " ",
        testCache = " ",
        lastReturn;

    // using the cache locally to speed up linting process
    if (!process.env.TRAVIS) {
        makeFileCache = " --cache --cache-file .cache/makefile_cache ";
        jsCache = " --cache --cache-file .cache/js_cache ";
        testCache = " --cache --cache-file .cache/test_cache ";
    }

    echo("Linting Makefile.js");
    lastReturn = exec(ESLINT + makeFileCache + MAKEFILE);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Linting JavaScript files");
    lastReturn = exec(ESLINT + jsCache + JS_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Linting JavaScript test files");
    lastReturn = exec(ESLINT + testCache + TEST_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }
};


target.test = function() {
  target.lint();
  // target.checkRuleFiles();
  let errors = 0,
      lastReturn;

  // exec(ISTANBUL + " cover " + MOCHA + "-- -c " + TEST_FILES);
  lastReturn = nodeCLI.exec("istanbul", "cover", MOCHA, "-- -R progress -t " + MOCHA_TIMEOUT, "-c", TEST_FILES);
  if (lastReturn.code !== 0) {
    errors++;
  }

  // exec(ISTANBUL + "check-coverage --statement 99 --branch 98 --function 99 --lines 99");
  lastReturn = nodeCLI.exec("istanbul", "check-coverage", "--statement 99 --branch 98 --function 99 --lines 99");
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

  target.checkLicenses();
};
