/**
 * @fileoverview Compare expected errors with those from ESLint.
 */

goog.module('googlejs.configTester.errorCompare');

const asserts = goog.require('goog.asserts');
const googObject = goog.require('goog.object');
const types = goog.require('googlejs.configTester.types');

const Mocha = /** @type {!Mocha} */ (require('mocha'));

/**
 * Compares all ESLint results to the expected results for a list of files.
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of
 *     an absolute filepath to the expected errors for the file.
 */
function compareEslintToExpected(expectedErrorsByFile) {
  googObject.forEach(expectedErrorsByFile, (expectedErrors, filePath) => {
    compareErrorsForFile(expectedErrors);
  });
}

/**
 * Wraps compareEslintToExpected to use Mocha describe and it blocks.
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of
 *     an absolute filepath to the expected errors for the file.
 * @param {!Mocha.Suite} testSuite
 */
function compareEslintToExpectedMocha(expectedErrorsByFile, testSuite) {
  googObject.forEach(expectedErrorsByFile, (expectedErrors, filePath) => {
    const fileSuite = Mocha.Suite.create(testSuite, expectedErrors.filePath);
    compareErrorsForFileMocha(expectedErrors, fileSuite);
  });
}

/**
 * Compares errors between ESLint and the expected errors for one file.
 * @param {!types.ExpectedErrors} expectedErrors A map of an absolute filepath
 *     to the expected errors for the file.
 * @param {function(!types.LineErrors)=} verifyEslint
 * @param {function(!types.LineErrors)=} verifyExpected
 */
function compareErrorsForFile(
    expectedErrors, verifyEslint = verifyEslintErrors,
    verifyExpected = verifyExpectedErrors) {
  asserts.assertFunction(verifyEslint);
  asserts.assertFunction(verifyExpected);
  googObject.forEach(expectedErrors.errorsByLineNumber, (lineErrors, line) => {
    verifyEslint(lineErrors);
    verifyExpected(lineErrors);
  });
}

/**
 * Wraps compareErrorsForFile with a describe block.
 * @param {!types.ExpectedErrors} expectedErrors
 * @param {!Mocha.Suite} fileSuite
 */
function compareErrorsForFileMocha(expectedErrors, fileSuite) {
  compareErrorsForFile(
      expectedErrors, verifyEslintErrorsMocha, verifyExpectedErrorsMocha,
      fileSuite);
}

/**
 * Creates an error string from an ESLint message.
 * @param {!types.LineErrors} lineErrors
 * @param {string} explanation
 * @return {string}
 */
function makeErrorMessage(lineErrors, explanation) {
  return `${lineErrors.filePath}:${lineErrors.line} - ${explanation}`;
}

/**
 * Verifies that all ESLint messages match with an expected error message.
 * @param {!types.LineErrors} lineErrors
 */
function verifyEslintErrors(lineErrors) {
  const {eslintRules, expectedRules} = lineErrors;
  if (eslintRules.isSubsetOf(expectedRules)) {
    return;
  }
  const unmatched = eslintRules.difference(expectedRules);
  const ruleList = unmatched.getValues();
  const message = `The following ESLint errors (${ruleList.join(', ')}) ` +
        `did not have a corresponding expected error.`;
  throw new Error(makeErrorMessage(lineErrors, message));
}

/**
 * Wraps verifyEslintErrors with a Mocha `it` block.
 * @param {!types.LineErrors} lineErrors
 */
function verifyEslintErrorsMocha(lineErrors) {
  it(`line ${lineErrors.line}`, () => {
    verifyEslintErrors(lineErrors);
  });
}

/**
 * Verifies that each expected error was also found by ESLint.
 * @param {!types.LineErrors} lineErrors
 */
function verifyExpectedErrors(lineErrors) {
  const {eslintRules, expectedRules} = lineErrors;
  if (expectedRules.isSubsetOf(eslintRules)) {
    return;
  }
  const unmatched = expectedRules.difference(eslintRules);
  const ruleList = unmatched.getValues();
  const message = `The following expected errors (${ruleList.join(', ')}) ` +
        `were not found by ESLint.`;
  throw new Error(makeErrorMessage(lineErrors, message));
}

/**
 * Wraps verifyExpectedErrors with a Mocha `it` block.
 * @param {!types.LineErrors} lineErrors
 */
function verifyExpectedErrorsMocha(lineErrors) {
  it(`line ${lineErrors.line}`, () => {
    verifyExpectedErrors(lineErrors);
  });
}

exports = {
  compareEslintToExpected,
  compareEslintToExpectedMocha,
  compareErrorsForFile,
  makeErrorMessage,
  verifyEslintErrors,
  verifyExpectedErrors,
};
