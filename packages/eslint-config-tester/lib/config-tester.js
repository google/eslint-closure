const Promise = /** @type {!Promise} */ (require('bluebird'));
const eslint = /** @type {!ESLint.Module} */ (require('eslint'));
const fs = require('fs');
const glob = require('glob');
const path = require('path');


function testConfig(glob, configOptions) {

}

const cliEngine = new eslint.CLIEngine({
  configFile: './index.js',
});

const readFile = Promise.promisify(fs.readFile);
const globPromise = Promise.promisify(glob);

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

exports = {
  testConfig,
}
