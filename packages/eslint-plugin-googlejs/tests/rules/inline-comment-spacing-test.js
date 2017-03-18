/**
 * @fileoverview Test for inlineCommentSpacing.
 */

goog.module('closureLint.tests.rules.inlineCommentSpacing');

const inlineCommentSpacing = goog.require('closureLint.rules.inlineCommentSpacing');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

const RuleTester = eslint.RuleTester;
const ruleTester = new RuleTester();

ruleTester.run('inlineCommentSpacing', inlineCommentSpacing, {

  valid: [
    {
      code: 'var j;// A valid comment with no space after the stmt',
      options: [0],
    },
    {
      code: 'var j; // A valid comment that exceeds required space;',
      options: [0],
    },
    {
      code: '// A valid comment that exceeds required space;',
      options: [0],
    },
    {
      code: 'var j; // Use default of 1',
    },
    {
      code: 'var j; // A valid comment that matches required space',
      options: [1],
    },
    {
      code: 'var j;  // Equals required space',
      options: [2],
    },
    {
      code: 'var j;     // Equals required space',
      options: [2],
    },
    {
      code: '// Comment is first in doc',
      options: [0],
    },
    {
      code: ' // Comment is first in doc with leading whitespace',
      options: [0],
    },
    {
      code: ' // A valid comment',
      options: [1],
    },
    {
      code: '// A valid comment',
      options: [1],
    },
  ],

  invalid: [
    {
      code: 'var j;// An invalid comment with no space after the stmt',
      output: 'var j; // An invalid comment with no space after the stmt',
      errors: [{
        message: 'Expected at least 1 space before inline comment.',
        type: 'Line',
      }],
      options: [1],
    },
    {
      code: 'var j; // An invalid comment with one space after the stmt',
      output: 'var j;  // An invalid comment with one space after the stmt',
      errors: [{
        message: 'Expected at least 2 spaces before inline comment.',
        type: 'Line',
      }],
      options: [2],
    },
    {
      code: 'var j; // invalid',
      output: 'var j;    // invalid',
      errors: [{
        message: 'Expected at least 4 spaces before inline comment.',
        type: 'Line',
      }],
      options: [4],
    },
  ],

});
