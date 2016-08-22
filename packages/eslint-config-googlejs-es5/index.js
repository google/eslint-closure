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

const GOOGLE_ES5_RULES = {
  extends: [
    require.resolve('eslint-config-googlejs-base'),
  ],

  rules: {
    'comma-dangle': [ERROR, 'always-multiline'],
  },
}

module.exports = GOOGLE_ES5_RULES;
