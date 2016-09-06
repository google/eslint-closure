/**
 * @fileoverview Rule to flag non-camelcased identifiers except for the "opt_" prefix
 */
'use strict';

var utils = require('../utils');
var types = require('../types');

/**
 * Valid options for the camelcase rule.
 * @typedef {{
 *   allowVarArgs: boolean,
 *   allowOptPrefix: boolean,
 *   allowLeadingUnderscore: boolean,
 *   allowTrailingUnderscore: boolean,
 * }}
 */
let CamelCaseRuleOptions;

/**
 * An object to describe an underscored identifier.
 * @typedef {{
 *   node: !Espree.Identifier,
 *   message: string,
 *   hasError: boolean,
 * }}
 */
let UnderscoreReport;

/** @const {!CamelCaseRuleOptions} */
const DEFAULT_CAMELCASE_OPTIONS = {
  allowVarArgs: false,
  allowOptPrefix: false,
  allowLeadingUnderscore: true,
  allowTrailingUnderscore: true,
  checkObjectProperties: true,
}

/**
 * Flags identifiers that have incorrect underscores.
 * @param {!Espree.Identifier} node The node to check.
 * @param {!CamelCaseRuleOptions} options The ESLint camelcase rule options.
 * @return {!UnderscoreReport} Message describing the underscore identifier.
 *     If incorrectly underscored, the `message` field describes the error and
 *     `hasError` is set to True.  If the identifier is correct, `message` is
 *     the empty string and `hasError` is set to false.
 * @private
 */
function describeIncorrectUnderscores_(node, options) {

  /** @const {!UnderscoreReport} */
  const validReport = {
    node,
    message: '',
    hasError: false,
  };

  /** @const {!UnderscoreReport} */
  const invalidReport = {
    node,
    message: '',
    hasError: true
  }

  /**
   * @param {string} message
   * @return {!UnderscoreReport}
   */
  function makeReport(message) {
    return /** @type {UnderscoreReport} */ (Object.assign(invalidReport,
                                                          {message}));
  }

  /**
   * @param {string} effectiveName
   * @param {string} message
   * @return {!UnderscoreReport}
   */
  function checkAndReport(effectiveName, message) {
    if (isCorrectlyUnderscored_(effectiveName, node, options)) {
      return validReport;
    } else {
      return makeReport(message);
    }
  }

  switch (utils.categorizeUnderscoredIdentifier(node.name)) {
    case types.UnderscoreForm.CONSTANT:
      return validReport;

    case types.UnderscoreForm.LEADING:
      if (options.allowLeadingUnderscore) {
        return checkAndReport(
          node.name.replace(/^_+/g, '').replace(/_+$/g, ''),
            `Identifier '${node.name}' is not in camel case after the leading `
            + `underscore.`
        );
      } else {
        return makeReport('Leading underscores are not allowed in '
                          + `'${node.name}'.`);
      }

    case types.UnderscoreForm.NO_UNDERSCORE:
      return validReport;

    case types.UnderscoreForm.MIDDLE:
      return checkAndReport(
          node.name,
          `Identifier '${node.name}' is not in camel case.`
      );

    case types.UnderscoreForm.OPT_PREFIX:
      if (options.allowOptPrefix) {
        return checkAndReport(
            node.name.replace(/^opt_/g, ''),
            `Identifier '${node.name}' is not in camel case after the opt_ `
            + `prefix.`
        );
      } else {
        return makeReport(`The opt_ prefix is not allowed in '${node.name}'.`);
      }

    case types.UnderscoreForm.TRAILING:
      if (options.allowTrailingUnderscore) {
        return checkAndReport(
          node.name.replace(/^_+/g, '').replace(/_+$/g, ''),
            `Identifier '${node.name}' is not in camel case before the trailing`
            + ` underscore.`
        );
      } else {
        return makeReport('Trailing underscores are not allowed in '
                          + `'${node.name}'.`);
      }

    case types.UnderscoreForm.VAR_ARGS:
      if (options.allowVarArgs) {
        return validReport;
      } else {
        return makeReport('The var_args identifier is not allowed.');
      }

    default:
      throw new Error('Unknown undercore form: ' + node.name);
  }
}

/**
 * Report names that have incorrect underscores.
 * @param {string} effectiveNodeName The node name with valid underscores
 *     removed.
 * @param {!Espree.Identifier} node The node to check.
 * @param {!CamelCaseRuleOptions} options The ESLint camelcase rule options.
 * @return {boolean} If the node is correctly underscored.
 * @private
 */
function isCorrectlyUnderscored_(effectiveNodeName, node, options) {
  let parent = node.parent;
  const isCorrect = true;
  const isWrong = false;

  if (!utils.isUnderscored(effectiveNodeName)) {
    return isCorrect;
  }

  switch (parent.type) {
    case 'MemberExpression':
      parent = /** @type {!Espree.MemberExpression} */ (node.parent);

      if (!options.checkObjectProperties) {
        return isCorrect;
      }

      // Using a camelcased identifier on an object is okay since we don't
      // control the name, e.g. `foo.bar_baz`.
      if (parent.property === node) {
        // But it's not okay if we're defining a new variable, e.g.
        // `foo.bar_baz = 2`;
        if (parent.parent && parent.parent.type === 'AssignmentExpression') {
          let grandParent =
              /** @type {!Espree.AssignmentExpression} */ (parent.parent);
          // But it's okay if the identifier is on the right side.  If it's on
          // the left, it's wrong because we're probably defining it.
          return grandParent.right === parent;
        } else {
          return isCorrect;
        }
      }
      break;

    case 'Property':
      parent = /** @type {!Espree.Property} */ (node.parent);

      // Properties have their own rules.  Properties are just defined in object
      // literals.
      if (!options.checkObjectProperties) {
        return isCorrect;
      }

      // An ObjectPattern is a destructuring pattern, e.g.
      // var {a, b} = require('module');
      if (parent.parent && parent.parent.type === "ObjectPattern") {
        // TODO: this block will error twice on code like: var {foo_bar} =
        // require(); because it's checking foo_bar twice.  Once as a key and
        // once as a value.  The node for key and value is the same node, so
        // there's now way to figure out which node we're supposed to be in this
        // code.  To reduce the error count to 1 would involve processing the
        // messages outside this function.

        // If we're assigning to a new variable name with destructuring then
        // don't check the original name because we don't control that
        // name.  For example, we wouldn't want to check original_name below.
        // var {original_name: newName} = require('module);
        if (parent.key === node && parent.value !== node) {
          return isCorrect;
        }
      }
      break;

    case 'CallExpression':
      // Ignore method or function calls.
      return isCorrect;

    default:
      return isWrong;
  }
  return isWrong;
}


/** @const {!ESLint.RuleDefinition} */
const CAMELCASE_RULE = {
  meta: {
    docs: {
      description: 'check identifiers for camel case with options for opt_ '
          + 'prefix and var_args identifiers',
      category:  'Stylistic Issues',
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          allowVarArgs: {
            type: "boolean",
          },
          allowOptPrefix: {
            type: "boolean",
          },
          allowLeadingUnderscore: {
            type: "boolean",
          },
          allowTrailingUnderscore: {
            type: "boolean",
          },
          checkObjectProperties: {
            type: "boolean",
          }
        },
        additionalProperties: false
      }
    ],
  },

  /**
   * @param {!ESLint.RuleContext} context
   * @return {!Object<!Espree.NodeType, function(!ESLint.ASTNode)>}
   */
  create(context) {

    const userOptions = /** @const {!Object} */ (context.options[0]) || {};
    const options = /** @type {!CamelCaseRuleOptions}*/
          (Object.assign({}, DEFAULT_CAMELCASE_OPTIONS, userOptions));
    /**
     * Reports incorrectly underscored identifiers.
     * @param {!Espree.Identifier} node The node to check.
     */
    function reportIncorrectUnderscores(node) {
      const underscoreReport = describeIncorrectUnderscores_(node, options);
      if (underscoreReport.hasError) {
        context.report({
          node: underscoreReport.node,
          message: underscoreReport.message,
        });
      }
    }

    return {
      Identifier: reportIncorrectUnderscores,
    };
  },
};

module.exports = CAMELCASE_RULE;
