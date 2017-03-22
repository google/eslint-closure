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
 * @fileoverview Test for inlineCommentSpacing.
 */

goog.module('eslintClosure.tests.rules.inlineCommentSpacing');

const inlineCommentSpacing = goog.require('eslintClosure.rules.inlineCommentSpacing');

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
