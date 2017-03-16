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
