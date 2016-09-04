/**
 * @fileoverview Mocha test wrapper for testing entire ESLint configs with
 * plugins.
 * @author Joe Schafer
 /*
 * This is a wrapper around mocha to allow for DRY unittests for eslint
 * Format:
 * ConfigTester.add("{ruleName}", {
 *      valid: [
 *          "{code}",
 *          { code: "{code}", options: {options}, global: {globals}, globals: {globals}, parser: "{parser}", settings: {settings} }
 *      ],
 *      invalid: [
 *          { code: "{code}", errors: {numErrors} },
 *          { code: "{code}", errors: ["{errorMessage}"] },
 *          { code: "{code}", options: {options}, global: {globals}, parser: "{parser}", settings: {settings}, errors: [{ message: "{errorMessage}", type: "{errorNodeType}"}] }
 *      ]
 *  });
 *
 * Variables:
 * {code} - String that represents the code to be tested
 * {options} - Arguments that are passed to the configurable rules.
 * {globals} - An object representing a list of variables that are
 *             registered as globals
 * {parser} - String representing the parser to use
 * {settings} - An object representing global settings for all rules
 * {numErrors} - If failing case doesn't need to check error message,
 *               this integer will specify how many errors should be
 *               received
 * {errorMessage} - Message that is returned by the rule on failure
 * {errorNodeType} - AST node type that is returned by they rule as
 *                   a cause of the failure.
 */

/* global describe, it */
'use strict';

const lodash = require('lodash');
const assert = require('assert');
const util = require('util');
const linter = require('eslint').linter;

/*
 * List every parameters possible on a test case that are not related to eslint
 * configuration
 */
const RuleTesterParameters = [
  'code',
  'filename',
  'options',
  'args',
  'errors',
];

const hasOwnProperty = Function.call.bind(Object.hasOwnProperty);

/**
 * Freezes a given value deeply.
 *
 * @param {any} x - A value to freeze.
 * @return {void}
 */
function freezeDeeply(x) {
  if (typeof x === 'object' && x !== null) {
    if (Array.isArray(x)) {
      x.forEach(freezeDeeply);
    } else {
      for (const key in x) {
        if (key !== 'parent' && hasOwnProperty(x, key)) {
          freezeDeeply(x[key]);
        }
      }
    }
    Object.freeze(x);
  }
}

/**
 * Run the rule for the given item
 * @param {string} ruleName name of the rule
 * @param {string|Object} item Item to run the rule against
 * @param {!ESLint.Config} config config to use for the rule
 * @return {Object} Eslint run result
 * @private
 */
function runRuleForItem_(ruleName, item, config) {
  /** @type {!ESLint.config} */
  let config = lodash.cloneDeep(config);
  let code;
  let filename;

  if (typeof item === 'string') {
    code = item;
  } else {
    code = item.code;

    // Assumes everything on the item is a config except for the
    // parameters used by this tester
    const itemConfig = lodash.omit(item, RuleTesterParameters);

    // Create the config object from the tester config and this item
    // specific configurations.
    config = lodash.merge(
      config,
      itemConfig
    );
  }

  if (item.filename) {
    filename = item.filename;
  }

  if (item.options) {
    const options = item.options.concat();

    options.unshift(1);
    config.rules[ruleName] = options;
  } else {
    config.rules[ruleName] = 1;
  }

  linter.defineRule(ruleName, rule);

  return {
    messages: linter.verify(code, config, filename, true),
  };
}


/**
 * Check if the template is valid or not
 * all valid cases go through this
 * @param {string} ruleName name of the rule
 * @param {string|Object} item Item to run the rule against
 * @param {!ESLint.Config} config config to use for the rule
 * @return {void}
 * @private
 */
function testValidTemplate(ruleName, item, config) {
  const runResult = runRuleForItem_(ruleName, item, config);
  const messages = runResult.messages;

  assert.equal(messages.length, 0,
               util.format('Should have no errors but had %d: %s',
                           messages.length, util.inspect(messages)));
}

/**
 * Check if the template is invalid or not
 * all invalid cases go through this.
 * @param {string} ruleName name of the rule
 * @param {string|Object} item Item to run the rule against
 * @param {!ESLint.Config} config config to use for the rule
 * @return {void}
 * @private
 */
function testInvalidTemplate(ruleName, item, config) {
  assert.ok(item.errors || item.errors === 0,
            'Did not specify errors for an invalid test of ' + ruleName);

  const runResult = runRuleForItem_(ruleName, item, config);
  const messages = runResult.messages;

  if (typeof item.errors === 'number') {
    assert.equal(messages.length,
                 item.errors,
                 util.format('Should have %d error%s but had %d: %s',
                             item.errors,
                             item.errors === 1 ? '' : 's',
                             messages.length,
                             util.inspect(messages)));
  } else {
    assert.equal(messages.length, item.errors.length,
                 util.format('Should have %d error%s but had %d: %s',
                             item.errors.length,
                             item.errors.length === 1 ? '' : 's',
                             messages.length,
                             util.inspect(messages)));

    for (let i = 0, l = item.errors.length; i < l; i++) {
      assert.ok(!('fatal' in messages[i]),
                'A fatal parsing error occurred: ' + messages[i].message);
      assert.equal(messages[i].ruleId, ruleName,
                   'Error rule name should be the same as the name of the'
                   + ' rule being tested');

      if (typeof item.errors[i] === 'string') {
        // Just an error message.
        assert.equal(messages[i].message, item.errors[i]);
      } else if (typeof item.errors[i] === 'object') {
        /*
         * Error object.
         * This may have a message, node type, line, and/or
         * column.
         */
        if (item.errors[i].message) {
          assert.equal(messages[i].message, item.errors[i].message);
        }

        if (item.errors[i].type) {
          assert.equal(messages[i].nodeType, item.errors[i].type,
                       'Error type should be ' + item.errors[i].type);
        }

        if (item.errors[i].hasOwnProperty('line')) {
          assert.equal(messages[i].line, item.errors[i].line,
                       'Error line should be ' + item.errors[i].line);
        }

        if (item.errors[i].hasOwnProperty('column')) {
          assert.equal(messages[i].column, item.errors[i].column,
                       'Error column should be ' + item.errors[i].column);
        }

        if (item.errors[i].hasOwnProperty('endLine')) {
          assert.equal(messages[i].endLine, item.errors[i].endLine,
                       'Error endLine should be ' + item.errors[i].endLine);
        }

        if (item.errors[i].hasOwnProperty('endColumn')) {
          assert.equal(messages[i].endColumn, item.errors[i].endColumn,
                       'Error endColumn should be '
                       + item.errors[i].endColumn);
        }
      } else {
        // Only string or object errors are valid.
        assert.fail(messages[i], null,
                    'Error should be a string or object.');
      }
    }
  }
}

/**
 * Creates a new instance of ConfigTester.
 * @param {!ESLint.Config} config Complete ESLint config to test.
 * @constructor @struct @final
 */
function ConfigTester(config) {
  /**
   * The configuration to use for this tester. Combination of the tester
   * configuration and the default configuration.
   * @type {!ESLint.Config}
   */
  this.testerConfig = config;
}

// Default separators for testing.
ConfigTester.describe = (typeof describe === 'function')
  ? describe
  : function(text, method) {
    return method.apply(this);
  };

ConfigTester.it = (typeof it === 'function')
  ? it
  : function(text, method) {
    return method.apply(this);
  };

ConfigTester.prototype = {

  /**
   * Define a rule for one particular run of tests.
   * @param {string} name The name of the rule to define.
   * @param {!ESLint.RuleDefinition} rule The rule definition.
   * @return {void}
   */
  defineRule(name, rule) {
    linter.defineRule(name, rule);
  },

  /**
   * Adds a new rule test to execute.
   * @param {string} ruleName The name of the rule to run.
   * @param {Function} rule The rule to test.
   * @param {Object} test The collection of tests to run.
   * @return {void}
   */
  run(ruleName, rule, test) {

    const result = {};


    /*
     * This creates a mocha test suite and pipes all supplied info through
     * one of the templates above.
     */
    ConfigTester.describe(ruleName, function() {
      ConfigTester.describe('valid', function() {
        test.valid.forEach(function(valid) {
          ConfigTester.it(valid.code || valid, function() {
            testValidTemplate(ruleName, valid, this.testerConfig);
          });
        });
      });

      ConfigTester.describe('invalid', function() {
        test.invalid.forEach(function(invalid) {
          ConfigTester.it(invalid.code, function() {
            testInvalidTemplate(ruleName, invalid, this.testerConfig);
          });
        });
      });
    });

    return result.suite;
  },
};


module.exports = ConfigTester;
