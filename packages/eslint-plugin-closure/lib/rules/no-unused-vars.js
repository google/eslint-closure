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
 * @fileoverview Rule to flag declared but unused variables
 * @author Ilya Volodin
 */

goog.module('eslintClosure.rules.noUnusedVars');

const ast = goog.require('eslintClosure.ast');
const utils = goog.require('eslintClosure.utils');

/**
 * Valid options for the no-unused-vars rule.
 * @typedef {(string|{
 *   vars: (string|undefined),
 *   varsIgnorePattern: (string|undefined),
 *   args: (string|undefined),
 *   argsIgnorePattern: (string|undefined),
 *   caughtErrors: (string|undefined),
 *   caughtErrorsIgnorePattern: (string|undefined),
 *   allowUnusedTypes: (boolean|undefined),
 * })}
 */
let RuleOptionsRaw;

/**
 * Valid options for the no-unused-vars rule.
 * @typedef {{
 *   vars: string,
 *   varsIgnorePattern: (!RegExp|undefined),
 *   args: string,
 *   argsIgnorePattern: (!RegExp|undefined),
 *   caughtErrors: string,
 *   caughtErrorsIgnorePattern: (!RegExp|undefined),
 *   allowUnusedTypes: boolean,
 * }}
 */
let RuleOptions;

/**
 * @param {!ESLint.RuleContext} context
 * @return {!Object<!AST.NodeType, function(!AST.Node)>}
 */
function create(context) {

  const MESSAGE = "'{{name}}' is defined but never used.";

  /** @type {!RuleOptions} */
  const config = {
    vars: 'all',
    args: 'after-used',
    caughtErrors: 'none',
    allowUnusedTypes: false,
  };

  const firstOption = /** @type {!RuleOptionsRaw} */ (context.options[0]);

  if (firstOption) {
    if (goog.isString(firstOption)) {
      config.vars = firstOption;
    } else {
      config.vars = firstOption.vars || config.vars;
      config.args = firstOption.args || config.args;
      config.caughtErrors = firstOption.caughtErrors || config.caughtErrors;

      if (firstOption.varsIgnorePattern) {
        config.varsIgnorePattern = new RegExp(firstOption.varsIgnorePattern);
      }

      if (firstOption.argsIgnorePattern) {
        config.argsIgnorePattern = new RegExp(firstOption.argsIgnorePattern);
      }

      if (firstOption.caughtErrorsIgnorePattern) {
        config.caughtErrorsIgnorePattern =
            new RegExp(firstOption.caughtErrorsIgnorePattern);
      }

      if (firstOption.allowUnusedTypes) {
        config.allowUnusedTypes = firstOption.allowUnusedTypes;
      }
    }
  }

  const STATEMENT_TYPE = /(?:Statement|Declaration)$/;

  /**
   * Determines if a given variable is being exported from a module.
   * @param {!Escope.Variable} variable - EScope variable object.
   * @return {boolean} True if the variable is exported, false if not.
   * @private
   */
  function isExported(variable) {
    const definition = variable.defs[0];

    if (definition) {
      let node = definition.node;

      if (node.type === 'VariableDeclarator') {
        node = node.parent;
      } else if (definition.type === 'Parameter') {
        return false;
      }

      return node.parent.type.indexOf('Export') === 0;
    } else {
      return false;
    }
  }

  /**
   * Determines if an identifier is referencing an enclosing function name.
   * @param {!Escope.Reference} ref The reference to check.
   * @param {!Array<!AST.Node>} nodes The candidate function nodes.
   * @return {boolean} True if it's a self-reference, false if not.
   * @private
   */
  function isSelfReference(ref, nodes) {
    let scope = ref.from;
    while (scope) {
      if (nodes.indexOf(scope.block) >= 0) {
        return true;
      }
      scope = scope.upper;
    }
    return false;
  }

  /**
   * Checks whether a given node is inside of a loop.
   *
   * @param {!AST.Node} node A node to check.
   * @return {boolean} `true` if the node is inside of a loop.
   * @private
   */
  function isInsideOfLoop(node) {
    while (node) {
      if (ast.isLoop(node)) {
        return true;
      }
      if (ast.isFunction(node)) {
        return false;
      }
      node = node.parent;
    }
    return false;
  }

  /**
   * Checks the position of given nodes.
   *
   * @param {!AST.Node} inner - A node which is expected as inside.
   * @param {!AST.Node} outer - A node which is expected as outside.
   * @return {boolean} `true` if the `inner` node exists in the `outer` node.
   * @private
   */
  function isInside(inner, outer) {
    return (
        inner.range[0] >= outer.range[0] && inner.range[1] <= outer.range[1]);
  }

  /**
   * If a given reference is left-hand side of an assignment, this gets
   * the right-hand side node of the assignment.
   *
   * In the following cases, this returns null.
   *
   * - The reference is not the LHS of an assignment expression.
   * - The reference is inside of a loop.
   * - The reference is inside of a function scope which is different from
   *   the declaration.
   *
   * @param {!Escope.Reference} ref - A reference to check.
   * @param {!AST.Node} prevRhsNode - The previous RHS node.
   * @return {!AST.Node|null} The RHS node or null.
   * @private
   */
  function getRhsNode(ref, prevRhsNode) {
    const id = ref.identifier;
    const parent = id.parent;
    const granpa = parent.parent;
    const refScope = ref.from.variableScope;
    const varScope = ref.resolved.scope.variableScope;
    const canBeUsedLater = refScope !== varScope || isInsideOfLoop(id);

    /*
     * Inherits the previous node if this reference is in the node.
     * This is for `a = a + a`-like code.
     */
    if (prevRhsNode && isInside(id, prevRhsNode)) {
      return prevRhsNode;
    }

    if (parent.type === 'AssignmentExpression' &&
        granpa.type === 'ExpressionStatement' &&
        id === /** @type {!AST.AssignmentExpression} */ (parent).left &&
        !canBeUsedLater) {
      return /** @type {!AST.AssignmentExpression} */ (parent).right;
    }
    return null;
  }

  /**
   * Checks whether a given function node is stored to somewhere or not.
   * If the function node is stored, the function can be used later.
   *
   * @param {!AST.Node} funcNode - A function node to check.
   * @param {!AST.Node} rhsNode - The RHS node of the previous assignment.
   * @return {boolean} `true` if under the following conditions:
   *      - the funcNode is assigned to a variable.
   *      - the funcNode is bound as an argument of a function call.
   *      - the function is bound to a property and the object satisfies above
   * conditions.
   * @private
   */
  function isStorableFunction(funcNode, rhsNode) {
    let node = funcNode;
    let parent = funcNode.parent;

    while (parent && isInside(parent, rhsNode)) {
      switch (parent.type) {
        case 'SequenceExpression': {
          const seq = /** @type {!AST.SequenceExpression} */ (parent);
          if (seq.expressions[seq.expressions.length - 1] !== node) {
            return false;
          }
          break;
        }

        case 'CallExpression':
        case 'NewExpression':
          return /** @type {!AST.CallExpression} */ (parent).callee !== node;

        case 'AssignmentExpression':
        case 'TaggedTemplateExpression':
        case 'YieldExpression':
          return true;

        default:
          if (STATEMENT_TYPE.test(parent.type)) {
            /*
             * If it encountered statements, this is a complex pattern.
             * Since analyzeing complex patterns is hard, this returns `true`
             * to avoid false positive.
             */
            return true;
          }
      }

      node = parent;
      parent = parent.parent;
    }

    return false;
  }

  /**
   * Checks whether a given Identifier node exists inside of a function node
   * which can be used later.
   *
   * "can be used later" means:
   * - the function is assigned to a variable.
   * - the function is bound to a property and the object can be used later.
   * - the function is bound as an argument of a function call.
   *
   * If a reference exists in a function which can be used later, the
   * reference is read when the function is called.
   *
   * @param {!AST.Node} id - An Identifier node to check.
   * @param {!AST.Node} rhsNode - The RHS node of the previous assignment.
   * @return {boolean} `true` if the `id` node exists inside of a function
   * node which can be used later.
   * @private
   */
  function isInsideOfStorableFunction(id, rhsNode) {
    const funcNode = ast.findAncestor(id, ast.isFunction);

    if (funcNode) {
      return isInside(funcNode, rhsNode) &&
          isStorableFunction(funcNode, rhsNode);
    } else {
      return false;
    }
  }

  /**
   * Checks whether a given reference is a read to update itself or not.
   *
   * @param {!Escope.Reference} ref - A reference to check.
   * @param {!AST.Node} rhsNode - The RHS node of the previous assignment.
   * @return {boolean} The reference is a read to update itself.
   * @private
   */
  function isReadForItself(ref, rhsNode) {
    const id = ref.identifier;
    const parent = id.parent;
    const granpa = parent.parent;

    return ref.isRead() &&
        (
            // self update. e.g. `a += 1`, `a++`
            (parent.type === 'AssignmentExpression' &&
             granpa.type === 'ExpressionStatement' &&
             /** @type {!AST.AssignmentExpression} */ (parent).left === id) ||
              (parent.type === 'UpdateExpression' &&
               granpa.type === 'ExpressionStatement') ||

            // in RHS of an assignment for itself. e.g. `a = a + 1`
            (rhsNode && isInside(id, rhsNode) &&
             !isInsideOfStorableFunction(id, rhsNode)));
  }

  /**
   * Determine if an identifier is used either in for-in loops.
   *
   * @param {!Escope.Reference} ref - The reference to check.
   * @return {boolean} whether reference is used in the for-in loops
   * @private
   */
  function isForInRef(ref) {
    let target = ref.identifier.parent;

    // "for (var ...) { return; }"
    if (target.type === 'VariableDeclarator') {
      target = target.parent.parent;
    }

    if (target.type !== 'ForInStatement') {
      return false;
    }

    let forInNode = /** @type {!AST.ForInStatement} */ (target);

    // "for (...) { return; }"
    if (forInNode.body.type === 'BlockStatement') {
      forInNode = /** @type {!AST.BlockStatement} */ (forInNode.body).body[0];

      // "for (...) return;"
    } else {
      forInNode = forInNode.body;
    }

    // For empty loop body
    if (!forInNode) {
      return false;
    }

    return forInNode.type === 'ReturnStatement';
  }

  /**
   * Determines if the variable is used.
   * @param {!Escope.Variable} variable - The variable to check.
   * @return {boolean} True if the variable is used
   * @private
   */
  function isUsedVariable(variable) {
    /** @type {!Array<!AST.AnyFunctionNode>} */
    const functionNodes = variable.defs
        .filter((def) => def.type === 'FunctionName')
        .map((def) => def.node);
    const isFunctionDefinition = functionNodes.length > 0;
    let rhsNode = null;

    return variable.references.some(function(ref) {
      if (isForInRef(ref)) {
        return true;
      }

      const forItself = isReadForItself(ref, rhsNode);

      rhsNode = getRhsNode(ref, rhsNode);

      return (
          ref.isRead() && !forItself &&
            !(isFunctionDefinition && isSelfReference(ref, functionNodes)));
    });
  }

  /**
   * Checks whether the given variable is the last parameter in the
   * non-ignored parameters.
   *
   * @param {!Escope.Variable} variable - The variable to check.
   * @return {boolean} `true` if the variable is the last.
   */
  function isLastInNonIgnoredParameters(variable) {
    const def = variable.defs[0];

    // This is the last.
    if (def.index ===
        /** @type {!AST.AnyFunctionNode} */ (def.node).params.length - 1) {
      return true;
    }

    // if all parameters preceded by this variable are ignored and unused,
    // this is the last.
    if (config.argsIgnorePattern) {
      const params = context.getDeclaredVariables(def.node);
      const posteriorParams = params.slice(params.indexOf(variable) + 1);

      if (posteriorParams.every(
          v => v.references.length === 0 &&
            config.argsIgnorePattern &&
            config.argsIgnorePattern.test(v.name))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets an array of variables without read references.
   * @param {!Escope.Scope} scope
   * @param {!Array<!Escope.Variable>} unusedVars An array that saving result.
   * @return {!Array<!Escope.Variable>} unused variables of the scope and
   *     descendant scopes.
   * @private
   */
  function collectUnusedVariables(scope, unusedVars) {
    const variables = scope.variables;
    const childScopes = scope.childScopes;
    let i;
    let l;

    if (scope.type !== 'TDZ' &&
        (scope.type !== 'global' || config.vars === 'all')) {
      for (i = 0, l = variables.length; i < l; ++i) {
        const variable = variables[i];

        // skip a variable of class itself name in the class scope
        if (scope.type === 'class' &&
            /** @type {!AST.ClassExpression} */ (scope.block).id ===
            variable.identifiers[0]) {
          continue;
        }

        // skip function expression names and variables marked with
        // markVariableAsUsed()
        if (scope.functionExpressionScope || variable.eslintUsed) {
          continue;
        }

        // skip implicit "arguments" variable
        if (scope.type === 'function' && variable.name === 'arguments' &&
            variable.identifiers.length === 0) {
          continue;
        }

        // explicit global variables don't have definitions.
        const def = variable.defs[0];

        if (def) {
          const type = def.type;

          // skip catch variables
          if (type === 'CatchClause') {
            if (config.caughtErrors === 'none') {
              continue;
            }

            // skip ignored parameters
            if (config.caughtErrorsIgnorePattern &&
                config.caughtErrorsIgnorePattern.test(def.name.name)) {
              continue;
            }
          }

          if (type === 'Parameter') {
            // skip any setter argument
            if (def.node.parent.type === 'Property' &&
                /** @type {!AST.Property} */ (def.node.parent).kind ===
                'set') {
              continue;
            }

            // if "args" option is "none", skip any parameter
            if (config.args === 'none') {
              continue;
            }

            // skip ignored parameters
            if (config.argsIgnorePattern &&
                config.argsIgnorePattern.test(def.name.name)) {
              continue;
            }

            // if "args" option is "after-used", skip all but the last
            // parameter
            if (config.args === 'after-used' &&
                !isLastInNonIgnoredParameters(variable)) {
              continue;
            }
          } else {
            // skip ignored variables
            if (config.varsIgnorePattern &&
                config.varsIgnorePattern.test(def.name.name)) {
              continue;
            }
          }
        }

        if (!isUsedVariable(variable) && !isExported(variable)) {
          unusedVars.push(variable);
        }
      }
    }

    for (i = 0, l = childScopes.length; i < l; ++i) {
      collectUnusedVariables(childScopes[i], unusedVars);
    }

    return unusedVars;
  }

  /**
   * Gets the index of a given variable name in a given comment.
   * @param {!Escope.Variable} variable A variable to get.
   * @param {!AST.CommentToken} comment A comment node which includes the
   *     variable name.
   * @return {number} The index of the variable name's location.
   * @private
   */
  function getColumnInComment(variable, comment) {
    // TODO(jschaf): Closure removes escaped backslashes in template literals.
    const namePattern = new RegExp(
        // eslint-disable-next-line prefer-template
        '[\\s,]' + utils.escapeRegexp(variable.name) + '(?:$|[\\s,:])', 'g');

    // To ignore the first text "global".
    namePattern.lastIndex = comment.value.indexOf('global') + 6;

    // Search a given variable name.
    const match = namePattern.exec(comment.value);

    return match ? match.index + 1 : 0;
  }

  /**
   * Creates the correct location of a given variables.
   * The location is at its name string in a `/*global` comment.
   *
   * @param {!Escope.Variable} variable A variable to get its location.
   * @return {!ESLint.Location} The location object for the
   *     variable.
   */
  function getLocation(variable) {
    const comment = variable.eslintExplicitGlobalComment;
    const baseLoc = comment.loc.start;
    let column = getColumnInComment(variable, comment);
    const prefix = comment.value.slice(0, column);
    const lineInComment = (prefix.match(/\n/g) || []).length;

    if (lineInComment > 0) {
      column -= 1 + prefix.lastIndexOf('\n');
    } else {
      column += baseLoc.column + '/*'.length;
    }

    return {
      start: {
        line: baseLoc.line + lineInComment,
        column,
      },
    };
  }

  return {
    'Program:exit': (programNode) => {
      const unusedVars = collectUnusedVariables(context.getScope(), []);

      unusedVars.forEach((unusedVar) => {

        if (unusedVar.eslintExplicitGlobal) {
          context.report({
            node: programNode,
            loc: getLocation(unusedVar),
            message: MESSAGE,
            data: unusedVar,
          });
        } else if (unusedVar.defs.length > 0) {
          context.report({
            node: unusedVar.identifiers[0],
            message: MESSAGE,
            data: unusedVar,
          });
        }
      });
    },
  };
}

/** @const {!ESLint.RuleDefinition} */
const NO_UNUSED_VARS_RULE = {
  meta: {
    docs: {
      description: 'disallow unused variables',
      category: 'Variables',
      recommended: true,
    },

    schema: [
      {
        oneOf: [
          {
            enum: ['all', 'local'],
          },
          {
            type: 'object',
            properties: {
              vars: {
                enum: ['all', 'local'],
              },
              varsIgnorePattern: {
                type: 'string',
              },
              args: {
                enum: ['all', 'after-used', 'none'],
              },
              argsIgnorePattern: {
                type: 'string',
              },
              caughtErrors: {
                enum: ['all', 'none'],
              },
              caughtErrorsIgnorePattern: {
                type: 'string',
              },
              allowUnusedTypes: {
                type: 'boolean',
              },
            },
          },
        ],
      },
    ],
  },
  create,
};

exports = NO_UNUSED_VARS_RULE;
