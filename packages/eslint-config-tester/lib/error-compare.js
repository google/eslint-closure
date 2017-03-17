/**
 * @fileoverview Compare expected errors with those from ESLint.
 */

goog.module('googlejs.configTester.errorCompare');

const googObject = goog.require('goog.object');
const types = goog.require('googlejs.configTester.types');

/** @type {!MochaJS.Module} */
const Mocha = /** @type {!MochaJS.Module} */ (require('mocha'));

/**
 * Compares all ESLint results to the expected results for a list of files.
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of
 *     an absolute filepath to the expected errors for the file.
 * @param {!MochaJS.Suite=} testSuite
 */
function compareEslintToExpected(expectedErrorsByFile, testSuite) {
  googObject.forEach(expectedErrorsByFile, (expectedErrors, filePath) => {
    const fileSuite = testSuite ?
        Mocha.Suite.create(testSuite, expectedErrors.filePath) :
        undefined;
    compareErrorsForFile(expectedErrors, fileSuite);
  });
}

/**
 * Compares errors between ESLint and the expected errors for one file.
 * @param {!types.ExpectedErrors} expectedErrors A map of an absolute filepath
 *     to the expected errors for the file.
 * @param {!MochaJS.Suite=} fileSuite
 */
function compareErrorsForFile(expectedErrors, fileSuite) {
  googObject.forEach(expectedErrors.errorsByLineNumber, (lineErrors, line) => {
    if (fileSuite) {
      const eslintTest = new Mocha.Test(() => verifyEslintErrors(lineErrors));
      const expectedTest = new Mocha.Test(
          () => verifyExpectedErrors(lineErrors));
      fileSuite.addTest(eslintTest);
      fileSuite.addTest(expectedTest);
    } else {
      verifyEslintErrors(lineErrors);
      verifyExpectedErrors(lineErrors);
    }
  });
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

exports = {
  compareEslintToExpected,
  compareErrorsForFile,
  makeErrorMessage,
  verifyEslintErrors,
  verifyExpectedErrors,
};
