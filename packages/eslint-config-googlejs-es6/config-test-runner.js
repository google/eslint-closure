const Promise = require('bluebird');
const eslint = require('eslint');
const fs = require('fs');
const glob = require('glob');
const path = require('path');


const cliEngine = new eslint.CLIEngine({
  configFile: './index.js',
});


// { 'tests/invalid/functions.js':
//   { filePath: 'tests/invalid/functions.js',
//     messagesByLineNumber: { '2': [Object] } } }


// Get all error comments in all files in an object like:
// { fileName: {lineNumber: [ruleId]}}

const readFile = Promise.promisify(fs.readFile);
const globPromise = Promise.promisify(glob);


// For each result:
//   subtract 1 from the line number
//   get the list of rules broken from EXPECTED_ERRORS
//   Make sure the broken ruleId occurs
//   If it doesn't throw an error using mocha

const ESLint = {};

/**
 * A linting result.
 * @typedef {{
 *   filePath: string,
 *   messages: !Array<!ESLint.LintMessage>,
 *   errorCount: number,
 *   warningCount: number,
 * }}
 */
ESLint.LintResult;

/**
 * A linting warning or error.
 * @typedef {{
 *   ruleId: string,
 *   severity: number,
 *   nodeType: string,
 *   line: number,
 *   column: number,
 *   message: string,
 *   source: string,
 * }}
 */
ESLint.LintMessage;

/**
 *
 * @param {!Array<!ESLint.LintResult} eslintResults
 * @param {!ExpectedErrors} expectedErrors
 */
function compareEslintToExpected(eslintErrors, expectedErrors) {
  for (const eslintError of eslintErrors.results) {
    compareErrorsForFile(eslintError, expectedErrors);
  }
}

function compareErrorsForFile(eslintError, expectedErrors) {
  const eslintFile = eslintError.filePath;
  if (!expectedErrors[eslintFile]) {
    throw new Error(`No expected errors found for ${eslintFile}`);
  }

  const eslintMessages = eslintError.messages;
  const expectedMessages = expectedErrors[eslintFile].messagesByLineNumber;

  for (const eslintMessage of eslintMessages) {
    // Patch the file path so we can print useful error messages.
    eslintMessage.filePath = eslintFile;
    verifyEslintMessageExpected(eslintMessage, expectedMessages);
  }
}

function makeErrorMessage(message, explanation) {
  return `${message.filePath}:${message.line} (${message.ruleId}) - ` +
      `${explanation}`;
}

/**
 *
 * @param {!ESLint.LintMessage} eslintMessage
 * @param {!Object<number, !Array<string>} expectedMessages
 */
function verifyEslintMessageExpected(eslintMessage, expectedMessages) {
  // Subtract 1 because the comment is above the error.
  const expectedLine = eslintMessage.line - 1;
  const eslintError = makeErrorMessage(eslintMessage, 'Missing expected error');
  if (!expectedMessages[expectedLine]) {
    throw new Error(eslintError);
  }
  if (!expectedMessages[expectedLine].includes(eslintMessage.ruleId)) {
    throw new Error(eslintError);
  }
}

/**
 * @typedef {{
 *     filePath: string,
 *     messagesByLineNumber: !Object<number, !Array<string>>
 * }}
 */
let ExpectedErrors;

/**
 * Collect all expected errors in test files.
 * @return {!Promise<!Object<string, !ExpectedErrors>>} A map from the absolute
 *     file path to its expected errors.
 */
function collectExpectedErrorsInFiles() {
  return globPromise('tests/**/*.js').then(filePaths => {
    const errorsByFile = {};
    return Promise.all(filePaths.map(parseExpectedErrors))
        .then(fileErrors => {
          for (const expectedError of fileErrors) {
            errorsByFile[expectedError.filePath] = expectedError;
          }
          return errorsByFile;
        });
  });
}

/**
 * Parses all known errors within a JavaScript file by examining comments.
 * @param {string} filePath
 * @return {!Promise<!ExpectedErrors>}
 */
function parseExpectedErrors(filePath) {
  return readFile(filePath).then(buffer => {
    return {
      filePath: path.resolve(filePath),
      messagesByLineNumber: parseExpectedErrorsInBuffer(buffer),
    };
  });
}

/**
 * Parses expected errors within a string.
 * @param {!Buffer} buffer
 * @return {!ExpectedErrors}
 */
function parseExpectedErrorsInBuffer(buffer) {
  const lines = buffer.toString().split(/\r?\n/);
  const expectedErrors = {};
  const errorLineRegExp = new RegExp('// ERROR: (.*)');
  let lineNumber = 1;
  for (const line of lines) {
    const match = line.match(errorLineRegExp);
    if (match) {
      expectedErrors[lineNumber] = match[1].split(',').map(s => s.trim());
    }
    lineNumber++;
  }
  return expectedErrors;
}

collectExpectedErrorsInFiles().then(expectedErrorsMap => {
  const eslintErrors = cliEngine.executeOnFiles(['tests/**/*.js']);
  compareEslintToExpected(eslintErrors, expectedErrorsMap);
});
