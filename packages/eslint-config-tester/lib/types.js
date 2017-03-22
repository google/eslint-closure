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

goog.module('eslintClosure.configTester.types');

/** @record @extends {ESLint.LintMessage} */ const ESLintError = function() {};
/** @type {string} */ ESLintError.prototype.filePath;

/**
 * The errors on a given line of a source file.
 * @record
 */
const LineErrors = function() {};
/**
 * Rules found by ESLint.
 * @type {!goog.structs.Set<string>}
 */
LineErrors.prototype.eslintRules;
/**
 * Expected rules annotated in the source file.
 * @type {!goog.structs.Set<string>}
 */
LineErrors.prototype.expectedRules;
/**
 * The file path for these errors.
 * @type {string}
 */
LineErrors.prototype.filePath;
/**
 * The line number for these errors.
 * @type {number}
 */
LineErrors.prototype.line;

/**
 * The expected errors annotated in a source file.
 * @record
 */
const ExpectedErrors = function() {};
/** @type {string} */
ExpectedErrors.prototype.filePath;
/** @type {!Object<number, !LineErrors>} */
ExpectedErrors.prototype.errorsByLineNumber;

exports = {
  ESLintError,
  ExpectedErrors,
  LineErrors,
};
