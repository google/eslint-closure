goog.module('googlejs.configTester.types');

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
 * @type {record}
 */
const ExpectedErrors = function() {};
/** @type {string} */
ExpectedErrors.prototype.filePath;
/** @type {!Object<number, !LineErrors>} */
ExpectedErrors.prototype.errorsByLineNumber;
