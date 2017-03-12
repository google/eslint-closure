goog.module('googlejs.configTester.errorCompare');

const asserts = goog.require('goog.asserts');
const types = goog.require('googlejs.configTester.types');

/**
 * Compares all ESLint results to the expected results for a list of files.
 * @param {!Array<!ESLint.LintResult>} eslintResults A list of ESLint errors,
 *     where each LintResult corresponds to one file.
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of
 *     an absolute filepath to the expected errors for the file.
 */
function compareEslintToExpected(eslintResults, expectedErrorsByFile) {
  for (const eslintError of eslintResults) {
    compareErrorsForFile(eslintError, expectedErrorsByFile);
  }
}

/**
 * Compares errors between ESLint and the expected errors for one file.
 * @param {!ESLint.LintResult} eslintError ESLint errors for one file.
 * @param {!Object<string, !ExpectedErrors>} expectedErrorsByFile A map of an
 *     absolute filepath to the expected errors for the file.
 */
function compareErrorsForFile(eslintError, expectedErrorsByFile) {
  const eslintFile = eslintError.filePath;
  if (eslintError.messages.length > 0 && !expectedErrorsByFile[eslintFile]) {
    throw new Error(`No expected errors found for ${eslintFile} but found ` +
                   `ESLint errors.`);
  }

  for (const eslintMessage of eslintError.messages) {
    // Patch the file path so we can print useful error messages.
    eslintMessage.filePath = eslintFile;
    verifyEslintErrorsUsed(
        eslintMessage, expectedErrorsByFile[eslintFile]);
    verifyExpectedErrorsUsed(expectedErrorsByFile[eslintFile]);
  }
}

/**
 * Create an error string from an ESLint message.
 * @param {!ESLint.LintMessage} message
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
 * This function also modifies expectedErrors.usedRules to include the ESLint
 * ruleId.  We need to modify usedRules so we can check that all expected errors
 * match an ESLint error in usedRules.
 * @param {!ESLint.LintMessage} eslintMessage
 * @param {!ExpectedErrors} expectedErrors
 */
function verifyEslintErrorsUsed(eslintMessage, expectedErrors) {
  // Subtract 1 because the comment is above the error.
  const expectedLine = eslintMessage.line - 1;
  const {usedRules, expectedRules} =
        expectedErrors.errorsByLineNumber[expectedLine];

  const eslintError = makeErrorMessage(eslintMessage, 'Missing expected error');
  if (!expectedRules) {
    throw new Error(eslintError);
  }
  if (!expectedRules.includes(eslintMessage.ruleId)) {
    throw new Error(eslintError);
  }

  asserts.assert(goog.isDefAndNotNull(usedRules));
  usedRules.add(eslintMessage.ruleId);
}

/**
 * Verifies that each expected error was also found by ESLint.
 * @param {!ExpectedErrors} expectedErrors
 */
function verifyExpectedErrorsUsed(expectedErrors) {
  const filePath = expectedErrors.filePath;
  for (const line of Object.keys(expectedErrors.errorsByLineNumber)) {
    const {usedRules, expectedRules} = expectedErrors.errorsByLineNumber[line];
    const unusedRules = expectedRules.filter(rule => !usedRules.has(rule));
    if (unusedRules.length > 0) {
      throw new Error(`${filePath}:${line} The following rules were unused ` +
                      `by ESLint: ${unusedRules.join(', ')}`);
    }
  }
}

exports = {
  compareEslintToExpected,
  compareErrorsForFile,
  makeErrorMessage,
  verifyEslintErrorsUsed,
  verifyExpectedErrorsUsed,
};
