/**
 * @fileoverview Test ESLint config against expected errors.
 */

goog.module('googlejs.configTester.runner');

const errorCompare = goog.require('googlejs.configTester.errorCompare');
const types = goog.require('googlejs.configTester.types');

const Promise = /** @type {!Bluebird} */ (require('bluebird'));
const eslint = /** @type {!ESLint.Module} */ (require('eslint'));
const fs = /** @type {!NodeJS.fs} */ (require('fs'));
const glob = /** @type {!NodeJS.glob} */ (require('glob'));
const path = /** @type {!NodeJS.path} */ (require('path'));


/** @const {function(string): !Promise<!Uint8Array>} */
const readFile = Promise.promisify(fs.readFile);

/** @const {function(string): !Promise<!Array<string>>} */
const globPromise = Promise.promisify(glob);

/**
 * @typedef {{
 *   eslintOptions: (!ESLint.CLIEngineOptions|undefined)
 * }}
 */
let ConfigOptions;

/**
 * Checks that ESLint errors match expected errors for all files in the glob.
 * @param {string} glob
 * @param {!ConfigOptions} options
 */
function testConfig(glob, options) {
  const cliEngine = new eslint.CLIEngine(options.eslintOptions);
  checkGlob(glob, cliEngine);
}

/**
 * Collects all expected and ESLint errors from the given files.
 * @param {!Array<string>} filePaths
 * @param {!ESLint.CLIEngine} eslintEngine
 * @return {!Promise<!Object<string, !types.ExpectedErrors>>} A map from the
 *     absolute file path to all errors.
 */
function collectAllErrors(filePaths, eslintEngine) {
  collectExpectedErrorsInFiles(filePaths).then(errorsByFile => {
    return collectEslintErrors(errorsByFile, filePaths, eslintEngine);
  });
}

/**
 * Collects all expected errors in test files.
 * @param {!Array<string>} filePaths
 * @return {!Promise<!Object<string, !types.ExpectedErrors>>} A map from the
 *     absolute file path to its expected errors.
 */
function collectExpectedErrorsInFiles(filePaths) {
  const errorsByFile = {};
  const fileErrors = filePaths.map(parseExpectedErrors);
  return Promise.all(fileErrors).then((expectedErrors) => {
    for (const expectedError of expectedErrors) {
      errorsByFile[expectedError.filePath] = expectedError;
    }
    return errorsByFile;
  });
}

/**
 * Collects all ESLint errors from filePaths and adds them to errorsByFile.
 * @param {!Object<string, !types.ExpectedErrors>} errorsByFile
 * @param {!Array<string>} filePaths
 * @param {!ESLint.CLIEngine} eslintEngine
 * @return {!Object<string, !types.ExpectedErrors>}
 */
function collectEslintErrors(errorsByFile, filePaths, eslintEngine) {
  const eslintResults = /** @type {{results: !Array<!ESLint.LintResult>}} */ (
      eslintEngine.executeOnFiles(filePaths)).results;
  for (const message of eslintResults.messages) {

  }
  return errorsByFile;
}

/**
 * Parses all known errors within a JavaScript file by examining comments.
 * @param {string} filePath
 * @return {!Promise<!types.ExpectedErrors>}
 */
function parseExpectedErrors(filePath) {
  return readFile(filePath).then(buffer => {
    return {
      filePath: path.resolve(filePath),
      errorsByLineNumber: parseExpectedErrorsInBuffer(buffer),
    };
  });
}

/**
 * Parses expected errors within a string.
 * @param {!Uint8Array} buffer
 * @return {!Object<number, !types.LineErrors>}
 */
function parseExpectedErrorsInBuffer(buffer) {
  const lines = buffer.toString().split(/\r?\n/);
  const errorsByLineNumber = {};
  const errorLineRegExp = new RegExp('// ERROR: (.*)');
  let lineNumber = 1;
  for (const line of lines) {
    const match = line.match(errorLineRegExp);
    if (match) {
      // To be filled by ESLint.
      const eslintRules = new Set();
      const expectedRules = new Set(match[1].split(',').map(s => s.trim()));
      errorsByLineNumber[lineNumber] = {eslintRules, expectedRules};
    }
    lineNumber++;
  }
  return errorsByLineNumber;
}

/**
 * Checks that ESLint errors match expected errors for all files in the glob.
 * @param {string} glob
 * @param {!ESLint.CLIEngine} eslintEngine
 */
function checkGlob(glob, eslintEngine) {
  globPromise(glob).then(filePaths => {
    checkFiles(filePaths, eslintEngine);
  });
}

function checkFiles(filePaths, eslintEngine) {
  collectExpectedErrorsInFiles(filePaths).then(errorsByFile => {
    const eslintResults = eslintEngine.executeOnFiles(filePaths).results;
    errorCompare.compareEslintToExpected(eslintResults, errorsByFile);
  });
}

exports = {
  testConfig,
};

module.exports = {};
module.exports['testConfig'] = testConfig;
