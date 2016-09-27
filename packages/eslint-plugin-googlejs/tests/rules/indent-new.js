/**
 * @fileoverview This option sets a specific tab width for your code
 * @author Joe Schafer
 */
goog.module('googlejs.tests.rules.indentNew');
goog.setTestOnly('googlejs.tests.rules.indentNew');

const indentRule = goog.require('googlejs.rules.indent');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

/**
 * Creates error message object for failure cases with a single 'found'
 * indentation type.
 * @param {string} indentType Indent type of string or tab.
 * @param {!Array} errors Error info.
 * @returns {!Object} The error messages collection.
 * @private
 */
function expectedErrors(indentType, errors) {
  if (Array.isArray(indentType)) {
    errors = indentType;
    indentType = 'space';
  }

  if (!errors[0].length) {
    errors = [errors];
  }

  return errors.map(function(err) {
    let message;

    if (typeof err[1] === 'string' && typeof err[2] === 'string') {
      message = `Expected indentation of ${err[1]} but found ${err[2]}.`;
    } else {
      const chars = indentType + (err[1] === 1 ? '' : 's');

      message =
          `Expected indentation of ${err[1]} ${chars} but found ${err[2]}.`;
    }
    return {message, type: err[3], line: err[0]};
  });
}

const ruleTester = new eslint.RuleTester();

ruleTester.run('indent', indentRule, {
  valid: [
    {
      code: `
while(true) {
  foo();
  bar();
}`,
      options: [2],
    },
    {
      code: `
if(true) {
  foo();
    bar();
}`,
      options: [2],
    },

  ],
  invalid: [
  ],
});
