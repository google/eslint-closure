/**
 * @fileoverview Rule to check JSDoc comments.
 * @suppress {checkDebuggerStatement}
 */

goog.module('googlejs.rules.jsdoc');

const googMap = goog.require('goog.structs.Map');
const jsdocUtils = goog.require('googlejs.jsdocUtils');
const utils = goog.require('googlejs.utils');

const doctrine = /** @type {!Doctrine.Module} */ (require('doctrine'));

/**
 * Returns true if @return tag type is void or undefined.
 * @param {!Doctrine.Tag} tag
 * @return {boolean}
 * @private
 */
function isValidReturnType_(tag) {
  return !goog.isDefAndNotNull(tag.type) ||
      jsdocUtils.isVoid(tag.type) ||
      tag.type.type === 'UndefinedLiteral';
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
 * Valid options for the JSDoc rule.
 * @typedef {{
 *   returnPresent: boolean,
 * }}
 */
let FunctionReturnInfo;

/**
 * All types that are NameExpressions and don't have their own literal in the
 * Doctrine parser.  We need this list so we don't mark these variables as used.
 * @const {!Array<string>}
 */
const BUILT_IN_TYPES = [
  'string',
  'number',
  'boolean',
  'Object',
  'Array',
  'Map',
  'Set',
];

/**
 * Returns true if tagName is a named type included in JSDoc.
 * @param {string} tagName
 * @return {boolean}
 */
function isbuiltInType(tagName) {
  return BUILT_IN_TYPES.indexOf(tagName) !== -1;
}

/**
 * Marks JSDoc types that are variables in the current scope as used.
 * @param {!ESLint.RuleContext} context
 * @param {!Doctrine.Tag} tag
 */
function markTypeVariablesAsUsed(context, tag) {
  if (!tag.type) return;
  jsdocUtils.traverseTags(tag.type, (childTag) => {
    if (childTag.type === 'NameExpression') {
      const name = /** @type {!Doctrine.NameExpression} */ (childTag).name;
      if (!isbuiltInType(name)) {
        context.markVariableAsUsed(name);
      }
    }
  });
}

/**
 * @param {!ESLint.RuleContext} context
 * @return {!Object<!AST.NodeType, function(!AST.Node)>}
 */
function create(context) {
  /**
   * A stack to store if a function returns or not to support handling nested
   * functions.
   * @const {!Array<!FunctionReturnInfo>}
   */
  const fns = [];
  const sourceCode = context.getSourceCode();


  /** @const {!JSDocOption} */
  const options = /** @type {!JSDocOption} */ (context.options[0]) || {};

  /** @const {!googMap<string, string>} */
  const prefer = new googMap(options.prefer);

  // these both default to true; so you have to explicitly make them false
  debugger;
  const requireReturn = !!options.requireReturn;
  const requireParamDescription = options.requireParamDescription !== false;
  const requireReturnDescription = options.requireReturnDescription !== false;
  const requireReturnType = options.requireReturnType !== false;
  const preferType = options.preferType || {};
  const checkPreferType = Object.keys(preferType).length !== 0;

  /**
   * When parsing a new function, store it in our function stack.
   * @param {!AST.AnyFunctionNode} node A function node to check.
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
   * @param {!AST.ReturnStatement} node The return node.
   * @return {void}
   */
  function addReturn(node) {
    const functionState = fns[fns.length - 1];

    if (functionState && !goog.isNull(node.argument)) {
      functionState.returnPresent = true;
    }
  }

  /**
   * Reports invalid type names, e.g Number instead of number.
   * @param {!Doctrine.NameExpression} tagType
   * @param {!AST.CommentToken} node Node to provide location information to
   *     report.
   */
  function checkTypeName(tagType, node) {
    const name = tagType.name;
    const expectedName = preferType[name];
    if (expectedName) {
      context.report({
        node,
        message: `Use '${expectedName}' instead of '${name}'.`,
      });
    }
  }

  /**
   * Checks and reports invalid type names recursively in the provide JSDoc
   * type.
   * @param {!AST.CommentToken} node JSDoc node
   * @param {!Doctrine.TagType} tagType
   * @return {void}
   */
  function checkTypeNames(node, tagType) {
    jsdocUtils.traverseTags(tagType, (tag) => {
      if (tag.type === 'NameExpression') {
        checkTypeName(/** @type {!Doctrine.NameExpression} */ (tag), node);
      }
    });
  }

  /**
   * Checks and reports invalid JSDoc on variable declarations.
   * @param {!AST.VariableDeclaration} varDeclaration
   */
  function checkVariableJSDoc(varDeclaration) {
    if (varDeclaration.declarations.length !== 1) return;

    const comment = jsdocUtils.getJSDocComment(varDeclaration);
    if (!comment) return;

    let jsdoc;
    try {
      jsdoc = jsdocUtils.parseComment(comment.value);
    } catch (e) {
      return;
    }

    const node = varDeclaration.declarations[0];
    if (node.id.type !== 'Identifier') return;
    const name = /** @type {!AST.Identifier} */ (node.id).name;

    // TODO(jschaf): We're blindly marking all variables with type information
    // as used.  A better approach would be be to traverse all JSDoc comments
    // and mark variables as used based on what types we actually use.  For
    // goog.provide dependencies, you need to mark any property on a provided
    // type as used because there's no explicit export.
    if (jsdocUtils.hasTypeInformation(jsdoc)) {
      context.markVariableAsUsed(name);
    }

    jsdoc.tags.forEach((tag) => {
      markTypeVariablesAsUsed(context, tag);
    });
  }

  /**
   * Validates the JSDoc node and output warnings if anything is wrong.
   * @param {!AST.Node} node The AST node to check.
   * @return {void}
   */
  function checkJSDoc(node) {
    // TODO(jschaf): This cast shouldn't be necessary because we check below
    // that jsdocNode is non-null with the if-statement.
    const jsdocNode = /** @type {!AST.CommentToken} */
          (sourceCode.getJSDocComment(node));
    /** @const {!FunctionReturnInfo} */
    const functionData = fns.pop();
    const params = Object.create(null);

    /** @type {boolean} */
    let hasReturns = false;
    /** @type {boolean} */
    let hasConstructor = false;
    /** @type {boolean} */
    let isInterface = false;
    /** @type {boolean} */
    let isOverride = false;
    /** @type {boolean} */
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

      jsdoc.tags.forEach((/** !Doctrine.Tag */ tag) => {
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
                (goog.isNull(tag.type) || !isValidReturnType_(tag)) &&
                !isAbstract) {
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
        const tagMismatch = prefer.containsKey(tag.title) &&
              tag.title != prefer.get(tag.title);
        if (tagMismatch) {
          context.report({
            node: jsdocNode,
            message: 'Use @{{name}} instead.',
            data: {name: prefer.get(tag.title)},
          });
        }


        markTypeVariablesAsUsed(context, tag);

        // validate the types
        if (checkPreferType && tag.type) {
          checkTypeNames(jsdocNode, tag.type);
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
            message: 'Missing JSDoc @{return} for function.',
            data: {
              returns: prefer.get('returns', 'returns'),
            },
          });
        }
      }

      // check the parameters
      const jsdocParams = Object.keys(params);

      if (node.params) {
        node.params.forEach((param, i) => {
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
    'VariableDeclaration': checkVariableJSDoc,
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
