// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Compare expected errors with those from ESLint.
 * @suppress {reportUnknownTypes}
 */

goog.module('eslintClosure.configTester.errorCompare');

const googObject = goog.require('goog.object');
const types = goog.require('eslintClosure.configTester.types');

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
    const suiteDescription = shortenFilePath(expectedErrors.filePath);
    const fileSuite = testSuite ?
        Mocha.Suite.create(testSuite, suiteDescription) :
        undefined;
    compareErrorsForFile(expectedErrors, fileSuite);
  });
}

/**
 * Shorten a file path of a test file.
 * @param {string} filePath
 * @return {string}
 */
function shortenFilePath(filePath) {
  if (filePath.includes('tests/')) {
    return filePath.split('tests/', 2)[1];
  }
  return filePath;
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
      const lineTest = new Mocha.Test(` line ${lineErrors.line}`, () => {
        verifyEslintErrors(lineErrors);
        verifyExpectedErrors(lineErrors);
      });
      fileSuite.addTest(lineTest);
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
