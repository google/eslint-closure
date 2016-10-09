/**
 * @fileoverview Rule to check JSDoc comments.
 */

goog.module('googlejs.rules.jsdoc');

const utils = goog.require('googlejs.utils');

const doctrine = /** @type {!Doctrine.Module} */ (require('doctrine'));

/**
 * Returns true if @return tag type is void or undefined.
 * @param {!Doctrine.Tag} tag
 * @return {boolean}
 * @private
 */
function isValidReturnType_(tag) {
  return tag.type === null ||
    (tag.type.name && tag.type.name === 'void') ||
    tag.type.type === 'UndefinedLiteral';
}


/**
 * Returns true if a type can be validated.
 * @param {Object} type JSDoc tag.
 * @return {boolean}
 * @private
 */
function canTypeBeValidated_(type) {
  return type !== 'UndefinedLiteral' &&  // {undefined} as there is no name
  // property available.
  type !== 'NullLiteral' &&          // {null}
  type !== 'NullableLiteral' &&      // {?}
  type !== 'FunctionType' &&         // {function(a)}
  type !== 'AllLiteral';             // {*}
}

/**
 * Valid options for the JSDoc rule.
 * @typedef {{
 *   prefer: (!Object<string, string>|undefined),
 *   preferType: (!Object<string, string>|undefined),
 *   requireReturn: (boolean|undefined),
 *   requireReturnType: (boolean|undefined),
 *   matchDescription: (string|undefined),
 *   requireParamDescription: (boolean|undefined),
 *   requireReturnDescription: (boolean|undefined),
 * }}
 */
let JSDocOption;


/**
 * @param {!ESLint.RuleContext} context
 * @return {!Object<!Espree.NodeType, function(!ESLint.ASTNode)>}
 */
function create(context) {
  // Using a stack to store if a function returns or not (handling nested
  // functions)
  const fns = [];
  const sourceCode = context.getSourceCode();


  /** @const {!JSDocOption} */
  const options = /** @type {!JSDocOption} */ (context.options[0]) || {};

  const prefer = options.prefer || {};

  // these both default to true; so you have to explicitly make them false
  const requireReturn = options.requireReturn !== false;
  const requireParamDescription = options.requireParamDescription !== false;
  const requireReturnDescription = options.requireReturnDescription !== false;
  const requireReturnType = options.requireReturnType !== false;
  const preferType = options.preferType || {};
  const checkPreferType = Object.keys(preferType).length !== 0;

  /**
   * When parsing a new function, store it in our function stack.
   * @param {!Espree.AnyFunctionNode} node A function node to check.
   * @return {void}
   */
  function startFunction(node) {
    fns.push({
      returnPresent: (node.type === 'ArrowFunctionExpression' &&
                      node.body.type !== 'BlockStatement') ||
          utils.isNodeClassType(node),
    });
  }

  /**
   * Indicates that return has been found in the current function.
   * @param {!Espree.ReturnStatement} node The return node.
   * @return {void}
   */
  function addReturn(node) {
    const functionState = fns[fns.length - 1];

    if (functionState && node.argument !== null) {
      functionState.returnPresent = true;
    }
  }

  /**
   * Extracts the current and expected type based on the input type object
   * @param {!Doctrine.TagType} type JSDoc tag
   * @return {Object} current and expected type object
   */
  function getCurrentExpectedTypes(type) {
    let currentType;

    if (type.name) {
      currentType = type.name;
    } else if (type.expression) {
      currentType = type.expression.name;
    }

    const expectedType = currentType && preferType[currentType];

    return {currentType, expectedType};
  }

  /**
   * Recursively validates a type for a given JSDoc node.
   * @param {!Espree.CommentToken} jsdocNode JSDoc node
   * @param {!Doctrine.TagType} type JSDoc tag
   * @return {void}
   */
  function validateType(jsdocNode, type) {
    if (!type || !canTypeBeValidated_(type.type)) {
      return;
    }

    const typesToCheck = [];
    let elements = [];

    switch (type.type) {
      case 'TypeApplication': {  // {Array<String>}
        const typeApplication = /** @type {Doctrine.TypeApplication} */ (type);
        elements = typeApplication.applications[0].type === 'UnionType' ?
            typeApplication.applications[0].elements :
            typeApplication.applications;
        typesToCheck.push(getCurrentExpectedTypes(type));
        break;
      }
      case 'RecordType':  // {{20:String}}
        elements = /** @type {Doctrine.RecordType} */ (type).fields;
        break;
      case 'UnionType':  // {String|number|Test}
      case 'ArrayType':  // {[String, number, Test]}
        elements = /** @type {(Doctrine.ArrayType|Doctrine.UnionType} */
            (type.elements);
        break;
      case 'FieldType':  // Array.<{count: number, votes: number}>
        if (type.value) {
          typesToCheck.push(getCurrentExpectedTypes(type.value));
        }
        break;
      default:
        typesToCheck.push(getCurrentExpectedTypes(type));
    }

    elements.forEach(validateType.bind(null, jsdocNode));

    typesToCheck.forEach(function(typeToCheck) {
      if (typeToCheck.expectedType &&
          typeToCheck.expectedType !== typeToCheck.currentType) {
        context.report({
          node: jsdocNode,
          message: "Use '{{expectedType}}' instead of '{{currentType}}'.",
          data: {
            currentType: typeToCheck.currentType,
            expectedType: typeToCheck.expectedType,
          },
        });
      }
    });
  }

  /**
   * Validate the JSDoc node and output warnings if anything is wrong.
   * @param {!ESLint.ASTNode} node The AST node to check.
   * @return {void}
   */
  function checkJSDoc(node) {
    const jsdocNode = sourceCode.getJSDocComment(node);
    const functionData = fns.pop();
    const params = Object.create(null);

    let hasReturns = false;
    let hasConstructor = false;
    let isInterface = false;
    let isOverride = false;
    let isAbstract = false;
    let jsdoc;

    // make sure only to validate JSDoc comments
    if (jsdocNode) {
      try {
        jsdoc = doctrine.parse(jsdocNode.value, {
          strict: true,
          unwrap: true,
          sloppy: true,
        });
      } catch (ex) {
        if (/braces/i.test(ex.message)) {
          context.report({
            node: jsdocNode,
            message: 'JSDoc type missing brace.',
          });
        } else {
          context.report({
            node: jsdocNode,
            message: 'JSDoc syntax error.',
          });
        }

        return;
      }

      jsdoc.tags.forEach(function(tag) {

        switch (tag.title.toLowerCase()) {
          case 'param':
          case 'arg':
          case 'argument':
            if (!tag.type) {
              context.report({
                node: jsdocNode,
                message: `Missing JSDoc parameter type for '${tag.name}'.`,
              });
            }

            if (!tag.description && requireParamDescription) {
              context.report({
                node: jsdocNode,
                message: `Missing JSDoc parameter description for ` +
                    `'${tag.name}'.`,
              });
            }

            if (params[tag.name]) {
              context.report({
                node: jsdocNode,
                message: `Duplicate JSDoc parameter '${tag.name}'.`,
              });
            } else if (tag.name.indexOf('.') === -1) {
              params[tag.name] = 1;
            }
            break;

          case 'return':
          case 'returns':
            hasReturns = true;

            if (!requireReturn && !functionData.returnPresent &&
                (tag.type === null || !isValidReturnType_(tag)) && !isAbstract) {
              context.report({
                node: jsdocNode,
                message: 'Unexpected @{{title}} tag; function has no return ' +
                    'statement.',
                data: {
                  title: tag.title,
                },
              });
            } else {
              if (requireReturnType && !tag.type) {
                context.report({
                  node: jsdocNode,
                  message: 'Missing JSDoc return type.',
                });
              }

              if (!isValidReturnType_(tag) && !tag.description &&
                  requireReturnDescription) {
                context.report({
                  node: jsdocNode,
                  message: 'Missing JSDoc return description.',
                });
              }
            }

            break;

          case 'constructor':
          case 'class':
            hasConstructor = true;
            break;

          case 'override':
          case 'inheritdoc':
            isOverride = true;
            break;

          case 'abstract':
          case 'virtual':
            isAbstract = true;
            break;

          case 'interface':
            isInterface = true;
            break;

            // no default
        }

        // check tag preferences
        if (prefer.hasOwnProperty(tag.title) &&
            tag.title !== prefer[tag.title]) {
          context.report({
            node: jsdocNode,
            message: 'Use @{{name}} instead.',
            data: {name: prefer[tag.title]},
          });
        }

        // validate the types
        if (checkPreferType && tag.type) {
          validateType(jsdocNode, tag.type);
        }
      });

      // check for functions missing @return
      if (!isOverride && !hasReturns && !hasConstructor && !isInterface &&
          !utils.isNodeGetterFunction(node) &&
          !utils.isNodeSetterFunction(node) &&
          !utils.isNodeConstructorFunction(node) &&
          !utils.isNodeClassType(node)) {
        if (requireReturn || functionData.returnPresent) {
          context.report({
            node: jsdocNode,
            message: 'Missing JSDoc @{{returns}} for function.',
            data: {
              returns: prefer.returns || 'returns',
            },
          });
        }
      }

      // check the parameters
      const jsdocParams = Object.keys(params);

      if (node.params) {
        node.params.forEach(function(param, i) {
          if (param.type === 'AssignmentPattern') {
            param = param.left;
          }

          const name = param.name;

          // TODO(nzakas): Figure out logical things to do with destructured,
          // default, rest params
          if (param.type === 'Identifier') {
            if (jsdocParams[i] && (name !== jsdocParams[i])) {
              context.report({
                node: jsdocNode,
                message: `Expected JSDoc for '${name}' but found ` +
                    `'${jsdocParams[i]}'.`,
              });
            } else if (!params[name] && !isOverride) {
              context.report({
                node: jsdocNode,
                message: `Missing JSDoc for parameter '${name}'.`,
              });
            }
          }
        });
      }

      if (options.matchDescription) {
        const regex = new RegExp(options.matchDescription);

        if (!regex.test(jsdoc.description)) {
          context.report({
            node: jsdocNode,
            message: 'JSDoc description does not satisfy the regex pattern.',
          });
        }
      }
    }
  }

  return {
    'ArrowFunctionExpression': startFunction,
    'FunctionExpression': startFunction,
    'FunctionDeclaration': startFunction,
    'ClassExpression': startFunction,
    'ClassDeclaration': startFunction,
    'ArrowFunctionExpression:exit': checkJSDoc,
    'FunctionExpression:exit': checkJSDoc,
    'FunctionDeclaration:exit': checkJSDoc,
    'ClassExpression:exit': checkJSDoc,
    'ClassDeclaration:exit': checkJSDoc,
    'ReturnStatement': addReturn,
  };
}

/** @const {!ESLint.RuleDefinition} */
const JSDOC_RULE = {
  meta: {
    docs: {
      description: 'enforce valid JSDoc comments',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          prefer: {
            type: 'object',
            additionalProperties: {type: 'string'},
          },
          preferType: {
            type: 'object',
            additionalProperties: {type: 'string'},
          },
          requireReturn: {type: 'boolean'},
          requireParamDescription: {type: 'boolean'},
          requireReturnDescription: {type: 'boolean'},
          matchDescription: {type: 'string'},
          requireReturnType: {type: 'boolean'},
        },

        additionalProperties: false,
      },
    ],
  },
  create,
};

exports = JSDOC_RULE;
