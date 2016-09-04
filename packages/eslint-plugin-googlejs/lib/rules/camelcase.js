/**
 * @fileoverview Rule to flag non-camelcased identifiers except for the "opt_" prefix
 */

/**
 * An object to describe an underscored identifier.
 * @typedef {{
 *   node: !Espree.Identifier,
 *   message: string,
 *   hasError: boolean,
 * }}
 */
var UnderscoreReport;

/** @const {!UnderscoreReport} */
const validIdentifier = {
  node,
  message: '',
  hasError: false,
};

/** @const {!UnderscoreReport} */
const invalidIdentifier = {
  node,
  message: '',
  hasError: true
}

/**
 * Create an new message for an incorrectly underscored node.
 * @param {string} message The message to use for the UnderscoreMesage.
 * @return {!UnderscoreReport} The new underscore message.
 */
function makeInvalidUnderscoreReport(message) {
  return Object.assign(invalidIdentifier, {message});
}

/**
 * Flags identifiers that have incorrect underscores.
 * @param {!Espree.Identifier} node The node to check.
 * @param {!ESLint.RuleContext} context The ESLint rule context.
 * @return {!UnderscoreReport} Message describing the underscore identifier.
 *     If incorrectly underscored, the `message` field describes the error and
 *     `hasError` is set to True.  If the identifier is correct, `message` is
 *     the empty string and `hasError` is set to false.
 * @private
 */
function describeIncorrectUnderscores_(node, context) {
  let name;
  let message;

  
  /**
   * @param {string} effectiveName
   * @param {string} message
   * @return {!UnderscoreReport}
   */
  function checkAndReport(effectiveName, message) {
    message = isCorrectlyUnderscored_(effectiveName, node);
    if (message == null) {
      return validIdentifier;
    } else {
      return makeInvalidUnderscoreReport(message);
    }
  }

  switch (categorizeUnderscoredIdentifier(node)) {
    case UnderscoreForm.CONSTANT:
    return validIdentifier;
    break;

    case UnderscoreForm.LEADING:
      name = node.name.replace(/^_+/g, '');
      checkAndReport(`Identifier ${node.name} is not in camel case after the` +
    ' leading underscore.');
      
      break;

    case UnderscoreForm.NO_UNDERSCORE:
    return validIdentifier;
    break;

    case UnderscoreForm.OTHER:
    message = isCorrectlyUnderscored_(name, node);
    if (message == null) {
      return validIdentifier;
    } else {
      return makeInvalidUnderscoreReport(
        `Identifier ${node.name} is not in camel case.`
      );
    }
    break;

    case UnderscoreForm.OPT_PREFIX:
    // TODO: check if opt is allowed
    name = node.name.replace(/^opt_/g, '');
    message = isCorrectlyUnderscored_(name, node);
    if (message == null) {
      return validIdentifier;
    } else {
      return makeInvalidUnderscoreReport(
        `Identifier ${node.name} is not in camel case after the opt_ prefix.`
      );
    }
    break;

    case UnderscoreForm.TRAILING:
    name = node.name.replace(/_+$/g, '');
    message = isCorrectlyUnderscored_(name, node);
    if (message == null) {
      return validIdentifier;
    } else {
      return makeInvalidUnderscoreReport(
        `Identifier ${node.name} is not in camel case before the trailing`
          + ` underscore.`
      );
    }
    break;

    case UnderscoreForm.VAR_ARGS:
    // TODO: check if var_args is allowed
    return validIdentifier;
    break;

    default:
      throw new Error('Unknown undercore form: ' + node.name);
  }
}



/**
 * Report names that have incorrect underscores.
 * @param {string} effectiveNodeName The node name with valid underscores
 *     removed.
 * @param {!Espree.Identifier} node The node to check.
 * @return {boolean} If the node is correctly underscored.
 * @private
 */
function isCorrectlyUnderscored_(effectiveNodeName, node) {
  /** @const {!ESLint.ASTNode} */
  const parent = node.parent;
  const isCorrect = true;
  const isWrong = false;

  if (!isUnderscored(effectiveNodeName) {
    return isCorrect;
  }

  // MemberExpressions get special rules
  if (node.parent.type === "MemberExpression") {

    // Never check properties, i.e. baz.foo_bar.
    if (properties === "never") {
      return isCorrect;
    }

    // Always report underscored object names, i.e. foo_bar.baz.
    if (node.parent.object.type === "Identifier"
        && node.parent.object.name === node.name) {
      return isWrong;

      // Report AssignmentExpressions only if they are the left side of the assignment
    } else if (parent.type === "AssignmentExpression" &&
               (parent.right.type !== "MemberExpression" ||
                parent.left.type === "MemberExpression" &&
                parent.left.property.name === node.name)) {
      return isWrong;
    }

    // Properties have their own rules
  } else if (parent.type === "Property") {

    // "never" check properties
    if (properties === "never") {
      return isCorrect;
    }

    if (parent.parent && parent.type === "ObjectPattern" &&
        parent.key === node && parent.value !== node) {
      return isCorrect;
    }

    if (parent.type !== "CallExpression") {
      return isWrong;
    }

    // Check if it's an import specifier
  } else if (["ImportSpecifier", "ImportNamespaceSpecifier", "ImportDefaultSpecifier"].indexOf(node.parent.type) >= 0) {

    // Report only if the local imported identifier is underscored
    if (node.parent.local && node.parent.local.name === node.name) {
      return isWrong;
    }

    // Report anything that is underscored that isn't a CallExpression
  } else if (parent.type !== "CallExpression") {
    return isWrong;
  }

}


/** @const {!ESLint.RuleDefinition} */
const CAMELCASE_RULE = {

  meta: {
    docs: {
      description: 'allow opt_ prefix and var_args variable identifiers',
      category: 'Stylistic Issues',
      recommended: true,
    },
    schema: [],
  },

  /**
   * @param {!ESLint.RuleContext} context The thing
   * @return {!Object<Espree.NodeType, function(!ESLint.ASTNode)>}
   */
  create(context) {

    /**
     * Reports incorrectly underscored identifiers.
     * @param {!Espree.Identifier} node The node to check.
     */
    function reportIncorrectUnderscores(node) {
      const underscoreMessage = describeIncorrectUnderscores_(node);
      if (underscoreMessage.hasError) {
        context.report({
          node: underscoreMessage.node,
          message: underscoreMessage.message,
        });
      }
    }

    return {
      Identifier: reportIncorrectUnderscores,
    };
  },
};

module.exports = CAMELCASE_RULE;
