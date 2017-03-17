/**
 * @fileoverview Test ESLint config against expected errors.
 * @suppress {reportUnknownTypes}
 */

goog.module('googlejs.configTester.runner');

const errorCompare = goog.require('googlejs.configTester.errorCompare');
const googObject = goog.require('goog.object');
const googSet = goog.require('goog.structs.Set');
const types = goog.require('googlejs.configTester.types');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));
const fs = /** @type {!NodeJS.fs} */ (require('fs'));
const glob = /** @type {!NodeJS.glob} */ (require('glob'));
/** @type {!MochaJS.Module} */
const Mocha = /** @type {!MochaJS.Module} */ (require('mocha'));
const path = /** @type {!NodeJS.path} */ (require('path'));


/**
 * @typedef {{
 *   eslintOptions: (!ESLint.CLIEngineOptions|undefined),
 *   mochaOptions: (!MochaJS.Options|undefined),
 * }}
 */
let ConfigOptions;

/**
 * Checks that ESLint errors match expected errors for all files in the glob.
 * @param {string} pattern
 * @param {!ConfigOptions} options
 */
function testConfig(pattern, options) {
  const cliEngine = new eslint.CLIEngine(options.eslintOptions);
  const mochaInstance = new Mocha(options.mochaOptions);
  checkGlob(pattern, cliEngine, mochaInstance.suite);
  mochaInstance.run();
}

/**
 * Collects all expected and ESLint errors from the given files.
 * @param {!Array<string>} filePaths
 * @param {!ESLint.CLIEngine} eslintEngine
 * @return {!Object<string, !types.ExpectedErrors>} A map from the
 *     absolute file path to all errors.
 */
function collectAllErrors(filePaths, eslintEngine) {
  const errorsByFile = {};

  const allExpectedErrors = filePaths.map(parseExpectedErrors);
  addAllExpectedErrors(errorsByFile, allExpectedErrors);

  const eslintErrors = parseAllEslintErrors(filePaths, eslintEngine);
  return addAllEslintErrors(errorsByFile, eslintErrors);
}

/**
 * Parses all known errors within a JavaScript file by examining comments.
 * @param {string} filePath
 * @return {!types.ExpectedErrors}
 */
function parseExpectedErrors(filePath) {
  const content = fs.readFileSync(filePath, {encoding: 'utf-8'});
  return {
    filePath: path.resolve(filePath),
    errorsByLineNumber: parseExpectedErrorsInString(content, filePath),
  };
}

/**
 * Modifies errorsByFile to include allExpectedErrors.
 * @param {!Object<string, !types.ExpectedErrors>} errorsByFile
 * @param {!Array<!types.ExpectedErrors>} allExpectedErrors
 * @return {!Object<string, !types.ExpectedErrors>}
 */
function addAllExpectedErrors(errorsByFile, allExpectedErrors) {
  for (const expectedErrors of allExpectedErrors) {
    errorsByFile[expectedErrors.filePath] = expectedErrors;
  }
  return errorsByFile;
}

/**
 * Parses expected errors within a string.
 * @param {string} content
 * @param {string} filePath
 * @return {!Object<number, !types.LineErrors>}
 */
function parseExpectedErrorsInString(content, filePath) {
  const lines = content.split(/\r?\n/);
  const errorsByLineNumber = {};
  const errorLineRegExp = new RegExp('// ERROR: (.*)');
  let lineNumber = 1;
  for (const line of lines) {
    const match = line.match(errorLineRegExp);
    if (match) {
      const eslintRules = new googSet();
      const expectedRules = new googSet(match[1].split(',').map(s => s.trim()));
      errorsByLineNumber[lineNumber] = {
        eslintRules,
        expectedRules,
        line: lineNumber,
        filePath,
      };
    }
    lineNumber++;
  }
  return errorsByLineNumber;
}

/**
 * Runs ESLint on each file in filePaths and returns all ESLint findings.
 * @param {!Array<string>} filePaths
 * @param {!ESLint.CLIEngine} eslintEngine
 * @return {!Array<!ESLint.LintResult>}
 */
function parseAllEslintErrors(filePaths, eslintEngine) {
  return eslintEngine.executeOnFiles(filePaths).results;
}

/**
 * Collects all ESLint errors from filePaths and adds them to errorsByFile.
 * @param {!Object<string, !types.ExpectedErrors>} errorsByFile
 * @param {!Array<!ESLint.LintResult>} eslintResults
 * @return {!Object<string, !types.ExpectedErrors>}
 */
function addAllEslintErrors(errorsByFile, eslintResults) {
  eslintResults.forEach(result => {
    googObject.setIfUndefined(errorsByFile, result.filePath, {
      filePath: result.filePath,
      errorsByLineNumber: {},
    });
    /** @type {!types.ExpectedErrors} */
    const expectedErrors = errorsByFile[result.filePath];
    result.messages.forEach(message => {
      // Subtract 1 because the comment is above the error.
      const line = message.line - 1;
      googObject.setIfUndefined(
          expectedErrors.errorsByLineNumber, line.toString(), {
            eslintRules: new googSet(),
            expectedRules: new googSet(),
            line,
            filePath: result.filePath,
          });
      expectedErrors.errorsByLineNumber[line].eslintRules.add(message.ruleId);
    });
  });
  return errorsByFile;
}

/**
 * Checks that ESLint errors match expected errors for all files in the glob.
 * @param {string} pattern
 * @param {!ESLint.CLIEngine} eslintEngine
 * @param {!MochaJS.Suite} testSuite
 */
function checkGlob(pattern, eslintEngine, testSuite) {
  const filePaths = glob.sync(pattern);
  checkFiles(filePaths, eslintEngine, testSuite);
}

/**
 * Checks that ESLint errors match expected errors for all files.
 * @param {!Array<string>} filePaths
 * @param {!ESLint.CLIEngine} eslintEngine
 * @param {!MochaJS.Suite} testSuite
 */
function checkFiles(filePaths, eslintEngine, testSuite) {
  const errorsByFile = collectAllErrors(filePaths, eslintEngine);
  errorCompare.compareEslintToExpected(errorsByFile, testSuite);
}


exports = {
  testConfig,
  addAllExpectedErrors,
  parseExpectedErrorsInString,
  addAllEslintErrors,
};

module.exports = {};
goog.exportProperty(module.exports, 'testConfig', testConfig);
