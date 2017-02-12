goog.module('googlejs.configTester.errorCompare');

const types = goog.require('googlejs.configTester.types');

/**
 * Compares all ESLint results to the expected results for a list of files.
 * @param {!Array<!ESLint.LintResult>} eslintResults A list of ESLint errors,
 *     where each LintResult corresponds to one file.
 * @param {!Object<string, !ExpectedErrors>} expectedErrorsByFile A map of an
 *     absolute filepath to the expected errors for the file.
 */
function compareEslintToExpected(eslintResults, expectedErrorsByFile) {
  for (const eslintError of eslintResults.results) {
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
  if (!expectedErrorsByFile[eslintFile]) {
    throw new Error(`No expected errors found for ${eslintFile}`);
  }

  for (const eslintMessage of eslintError.messages) {
    // Patch the file path so we can print useful error messages.
    eslintMessage.filePath = eslintFile;
    verifyEslintMessageExpected(
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
 * @param {!ESLint.LintMessage} eslintMessage
 * @param {!ExpectedErrors} expectedErrors
 */
function verifyEslintMessageExpected(eslintMessage, expectedErrors) {
  // Subtract 1 because the comment is above the error.
  const expectedLine = eslintMessage.line - 1;
  const expectedRuleIds = expectedErrors.messagesByLineNumber[expectedLine];

  const eslintError = makeErrorMessage(eslintMessage, 'Missing expected error');
  if (!expectedRuleIds) {
    throw new Error(eslintError);
  }
  if (!expectedRuleIds.includes(eslintMessage.ruleId)) {
    throw new Error(eslintError);
  }

  if (!expectedRuleIds.usedRuleIds) {
    expectedRuleIds.usedRuleIds = new Set();
  }
  expectedRuleIds.usedRuleIds.add(eslintMessage.ruleId);
}

/**
 * Verifies that each expected error was also found by ESLint.
 * @param {!ExpectedErrors} expectedErrors
 */
function verifyExpectedErrorsUsed(expectedErrors) {
  const filePath = expectedErrors.filePath;
  for (const line of Object.keys(expectedErrors.messagesByLineNumber)) {
    const expectedRuleIds = expectedErrors.messagesByLineNumber[line];
    const usedRulesIds = expectedRuleIds.usedRuleIds || new Set();
    const unusedRuleIds = expectedRuleIds
          .filter(ruleId => !usedRulesIds.has(ruleId));
    if (unusedRuleIds.length > 0) {
      throw new Error(`${filePath}:${line} The following rules were unused ` +
                      `by ESLint ${unusedRuleIds.join(', ')}`);
    }
  }
}

exports = {
  compareEslintToExpected,
  compareErrorsForFile,
  makeErrorMessage,
  verifyEslintMessageExpected,
  verifyExpectedErrorsUsed,
};
