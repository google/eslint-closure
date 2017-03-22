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
 * @fileoverview Custom ESLint configuration to adhere to the Google style guide
 * at https://google.github.io/styleguide/javascriptguide.xml.
 *
 * Short link to the Google JS Style Guide: https://git.io/vured
 * Short link to the Google C++ Style Guide: https://git.io/v6Mp3
 */


// Named constants for the numbers eslint uses to indicate lint severity.
const OFF = 0;
const WARNING = 1;
const ERROR = 2;


// Possible Errors
// These rules relate to possible syntax or logic errors in JavaScript code.
const POSSIBLE_ERROR_RULES = {};


// Best Practices
// These rules relate to better ways of doing things to help you avoid problems.
const BEST_PRACTICE_RULES = {};


// Strict Mode
// These rules relate to strict mode directives.
const STRICT_MODE_RULES = {};


// Variables
// These rules relate to variable declarations.
const VARIABLE_DECLARATION_RULES = {};


// Node.js and CommonJS
// These rules relate to code running in Node.js, or in browsers with CommonJS.
const NODEJS_RULES = {};


// Stylistic Issues
// These rules relate to style guidelines, and are therefore quite subjective.
const STYLISTIC_RULES = {

};


// ECMAScript 6
// These rules relate to ES6, also known as ES2015.
const ES6_RULES = {};


// Google Plugin Rules
// These rules are specific to Google code.  See
// https://github.com/google/eslint-closure/packages/eslint-plugin-closure
const GOOGLE_PLUGIN_RULES = {
  // Allow opt_ prefix and var_args in identifiers.  From
  // https://git.io/vured#Naming
  'closure/camelcase': [ERROR, {
    allowVarArgs: true,
    allowOptPrefix: true,
    allowLeadingUnderscore: true,
    allowTrailingUnderscore: true,
    // Too many warnings, often required for interop with protobufs.
    checkObjectProperties: false,
  }],

  // TODO(jschaf): Is this still valid?
  // The JS style guide 'follows the C++ style guide in spirit'.  The C++ style
  // guide mandates two spaces before line-end comments.  See the 'Line
  // Comments' section under
  // https://git.io/v6Mp3#Implementation_Comments
  'closure/inline-comment-spacing': [ERROR, 2],
};


const GOOGLE_ES5_RULES = {

  extends: [
    require.resolve('eslint-config-closure-base'),
  ],

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script',
  },

  // The list of rules and options are available at
  // http://eslint.org/docs/rules/.
  rules: Object.assign(
      {},

      // ESLint built-in rules.
      POSSIBLE_ERROR_RULES,
      BEST_PRACTICE_RULES,
      STRICT_MODE_RULES,
      VARIABLE_DECLARATION_RULES,
      NODEJS_RULES,
      STYLISTIC_RULES,
      ES6_RULES,

      // Custom plugin rules.
      GOOGLE_PLUGIN_RULES
      ),
};

module.exports = GOOGLE_ES5_RULES;
