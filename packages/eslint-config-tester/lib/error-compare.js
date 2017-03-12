/**
 * @fileoverview Compare expected errors with those from ESLint.
 * @suppress {reportUnknownTypes}
 */

goog.module('googlejs.configTester.errorCompare');

const types = goog.require('googlejs.configTester.types');

/* global describe, it */

const MochaShim = {};

function defaultTestHandler(text, method) {
  method.apply(null);
}

Object.defineProperties(MochaShim, {
  describe: {
    get() {
      return typeof describe === 'function' ? describe : defaultTestHandler;
    },
  },
  it: {
    get() {
      return typeof it === 'function' ? it : defaultTestHandler;
    },
  },
});

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
 * @param {!Object<string, !types.ExpectedErrors>} expectedErrorsByFile A map of an
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
    MochaShim.describe(eslintFile, () => {
      verifyEslintErrorsUsed(
          eslintMessage, expectedErrorsByFile[eslintFile]);
      verifyExpectedErrorsUsed(expectedErrorsByFile[eslintFile]);
    });
  }
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
 * This function also modifies expectedErrors.usedRules to include the ESLint
 * ruleId.  We need to modify usedRules so we can check that all expected errors
 * match an ESLint error in usedRules.
 * @param {!types.ESLintError} eslintMessage
 * @param {!types.ExpectedErrors} expectedErrors
 */
function verifyEslintErrorsUsed(eslintMessage, expectedErrors) {
  // Subtract 1 because the comment is above the error.
  const expectedLine = eslintMessage.line - 1;

  const lineErrors = expectedErrors.errorsByLineNumber[expectedLine];
  const eslintError = makeErrorMessage(eslintMessage, 'Missing expected error');
  MochaShim.it(`Line ${expectedLine}`, () => {
    if (!lineErrors || !lineErrors.expectedRules ||
        !lineErrors.expectedRules.includes(eslintMessage.ruleId)) {
      throw new Error(eslintError);
    }
  });
  lineErrors.usedRules.add(eslintMessage.ruleId);
}

/**
 * Verifies that each expected error was also found by ESLint.
 * @param {!types.ExpectedErrors} expectedErrors
 */
function verifyExpectedErrorsUsed(expectedErrors) {
  const filePath = expectedErrors.filePath;
  for (const line of Object.keys(expectedErrors.errorsByLineNumber)) {
    let lineErrors = expectedErrors.errorsByLineNumber[line];

    if (!lineErrors) {
      return;
    }

    const unusedRules = lineErrors.expectedRules
          .filter(rule => !lineErrors.usedRules.has(rule));

    MochaShim.it(`Line ${line}`, () => {
      if (unusedRules.length > 0) {
        throw new Error(`${filePath}:${line} The following rules were unused ` +
                        `by ESLint: ${unusedRules.join(', ')}`);
      }
    });
  }
}

exports = {
  compareEslintToExpected,
  compareErrorsForFile,
  makeErrorMessage,
  verifyEslintErrorsUsed,
  verifyExpectedErrorsUsed,
};
