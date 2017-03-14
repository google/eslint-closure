/**
 * @fileoverview Compare expected errors with those from ESLint.
 * @suppress {reportUnknownTypes}
 */

goog.module('googlejs.configTester.errorCompare');

const types = goog.require('googlejs.configTester.types');

/**
 * Compares all ESLint results to the expected results for a list of files.
 * @param {!Array<!ESLint.LintResult>} eslintResults A list of ESLint errors,
 *     where each LintResult corresponds to one file.
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of
 *     an absolute filepath to the expected errors for the file.
 */
function compareEslintToExpected(eslintResults, expectedErrorsByFile) {
  eslintResults.forEach(/** !ESLint.LintResult */ eslintResult => {
    compareErrorsForFile(eslintResult, expectedErrorsByFile);
  });
}

/**
 * Compares errors between ESLint and the expected errors for one file.
 * @param {!ESLint.LintResult} eslintError ESLint errors for one file.
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of
 *     an absolute filepath to the expected errors for the file.
 */
function compareErrorsForFile(eslintError, expectedErrorsByFile) {
  /** @const {string} */
  const eslintFile = eslintError.filePath;
  if (eslintError.messages.length > 0 && !expectedErrorsByFile[eslintFile]) {
    throw new Error(`No expected errors found for ${eslintFile} but found ` +
                   `ESLint errors.`);
  }

  eslintError.messages.forEach(eslintMessage => {
    // Patch the file path so we can print useful error messages.
    eslintMessage.filePath = eslintFile;
    verifyEslintErrorsUsed(
        eslintMessage, expectedErrorsByFile[eslintFile]);
    verifyExpectedErrorsUsed(expectedErrorsByFile[eslintFile]);
  });
}

/**
 * Create an error string from an ESLint message.
 * @param {!types.ESLintError} message
 * @param {string} explanation
 * @return {string}
 */
function makeErrorMessage(message, explanation) {
  return `${message.filePath}:${message.line} (${message.ruleId}) - ` +
      `${explanation}`;
}

/**
 * Verifies that all ESLint messages match with an expected error message.
 *
 * This function also modifies expectedErrors.eslintRules to include the ESLint
 * ruleId.  We need to modify eslintRules so we can check that all expected errors
 * match an ESLint error in eslintRules.
 * @param {!types.ESLintError} eslintMessage
 * @param {!types.ExpectedErrors} expectedErrors
 */
function verifyEslintErrorsUsed(eslintMessage, expectedErrors) {
  // Subtract 1 because the comment is above the error.
  const expectedLine = eslintMessage.line - 1;

  /** @const {(!types.LineErrors|undefined)} */
  const lineErrors = expectedErrors.errorsByLineNumber[expectedLine];
  const eslintError = makeErrorMessage(eslintMessage, 'Missing expected error');
  if (!lineErrors || !lineErrors.expectedRules ||
      !lineErrors.expectedRules.has(eslintMessage.ruleId)) {
    throw new Error(eslintError);
  }
  lineErrors.eslintRules.add(eslintMessage.ruleId);
}

/**
 *
 * @param {!Set<string>} set1
 * @param {!Set<string>} set2
 * @return {!Set<string>}
 */
function setDifference(set1, set2) {
  return new Set([...set1].filter(x => !set2.has(x)));
}

/**
 * Verifies that each expected error was also found by ESLint.
 * @param {!types.ExpectedErrors} expectedErrors
 */
function verifyExpectedErrorsUsed(expectedErrors) {
  const filePath = expectedErrors.filePath;
  Object.keys(expectedErrors.errorsByLineNumber).forEach(line => {
    /** @type {!types.LineErrors} */
    const lineErrors = expectedErrors.errorsByLineNumber[line];

    if (!lineErrors) {
      return;
    }

    /** @type {!Set<string>} */
    const unusedRules = setDifference(
        lineErrors.expectedRules, lineErrors.eslintRules);
    if (unusedRules.size > 0) {
      throw new Error(`${filePath}:${line} The following rules were unused ` +
                      `by ESLint: ${[...unusedRules.keys()].join(', ')}`);
    }
  });
}

exports = {
  compareEslintToExpected,
  compareErrorsForFile,
  makeErrorMessage,
  verifyEslintErrorsUsed,
  verifyExpectedErrorsUsed,
};
