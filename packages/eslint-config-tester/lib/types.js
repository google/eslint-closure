goog.module('googlejs.configTester.types');

/** @record @extends {ESLint.LintMessage} */ const ESLintError = function() {};
/** @type {string} */ ESLintError.prototype.filePath;

/**
 * The errors on a given line of a source file.
 * @record
 */
const LineErrors = function() {};
/**
 * Rules found by ESLint.
 * @type {!Set<string>}
 */
LineErrors.prototype.usedRules;
/**
 * Expected rules annotated in the source file.
 * @type {!Array<string>}
 */
LineErrors.prototype.expectedRules;

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
