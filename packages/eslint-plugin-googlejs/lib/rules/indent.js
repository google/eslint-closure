/**
 * @fileoverview This rule enforces a specific indent width for code.
 *
 * This rule has been ported and modified from ESLint.
 */

goog.module('googlejs.rules.indent');

// TODO(jschaf): Why won't this build?
// const {assert} = goog.require('goog.asserts');

const utils = goog.require('googlejs.utils');

/**
 * Information about the indentation preceeding an ESLint.ASTNode.
 * @record
 */
const IndentInfo = function() {};

/**
 * The number of spaces preceding a Node.
 * @type {number}
 */
IndentInfo.prototype.space;

/**
 * The number of tabs preceding a Node.
 * @type {number}
 */
IndentInfo.prototype.tab;

/**
 * The number of the desired indentation character preceding a node.  If a user
 * selected 'spaces' for indentation, `goodChar` is the number of spaces.
 * @type {number}
 */
IndentInfo.prototype.goodChar;

/**
 * The number of unwanted indentation characters preceding a node.  If a user
 * selected 'spaces' for indentation, `badChar` is the number of tabs.
 * @type {number}
 */
IndentInfo.prototype.badChar;

/**
  * Gets the indent of the node by examining the number of whitespace characters
  * at the beginning of the line.
  * @param {!Espree.Node} node Node to examine.
  * @param {!ESLint.SourceCode} sourceCode
  * @param {string} indentType
  * @param {boolean=} opt_byLastLine Get indent of node's last line.
  * @return {!IndentInfo} The node's indent information.
  * @private
  */
function getNodeIndent_(node, sourceCode, indentType, opt_byLastLine) {
  const token = opt_byLastLine ?
        sourceCode.getLastToken(node) :
        sourceCode.getFirstToken(node);
  const srcCharsBeforeNode = sourceCode.getText(
    token, token.loc.start.column).split('');
  const indentChars = srcCharsBeforeNode.slice(
    0,
    srcCharsBeforeNode.findIndex(char => char !== ' ' && char !== '\t'));
  const spaces = indentChars.filter(char => char === ' ').length;
  const tabs = indentChars.filter(char => char === '\t').length;

  return {
    space: spaces,
    tab: tabs,
    goodChar: indentType === 'space' ? spaces : tabs,
    badChar: indentType === 'space' ? tabs : spaces,
  };
}

/**
 * Returns true if node is the first node on its own start line. Can optionally
 * check the end line instead of the start line.
 * @param {!Espree.Node} node
 * @param {!ESLint.SourceCode} sourceCode
 * @param {boolean=} opt_byEndLocation Lookup based on start position or end.
 * @return {boolean} true if it's the first in it's start line.
 * @private
 */
function isNodeFirstInLine_(node, sourceCode, opt_byEndLocation) {
  const firstToken = opt_byEndLocation === true ?
        sourceCode.getLastToken(node, 1) :
        sourceCode.getTokenBefore(node);
  const startLine = opt_byEndLocation === true ?
        node.loc.end.line :
        node.loc.start.line;
  const endLine = firstToken ? firstToken.loc.end.line : -1;
  return startLine !== endLine;
}

/**
 * Returns true if the node is part of the multi-variable declaration and the
 * node starts on the same line as the VariableDeclaration, i.e. the `var`,
 * `let`, or `const`.
 * @param {!Espree.Node} node
 * @param {?Espree.VariableDeclarator} varNode Variable declaration node to
 *     check against.
 * @return {boolean} True if all the above condition are satisfied.
 * @private
 */
function isNodeInVarOnTop_(node, varNode) {
  return !!varNode &&
    varNode.parent.loc.start.line === node.loc.start.line &&
    varNode.parent.declarations.length > 1;
}

/**
 * Returns true if a CallExpression's first argument is multi-line.
 * @param {!Espree.CallExpression} node
 * @return {boolean} True if arguments are multi-line.
 * @private
 */
function isCalleeNodeFirstArgMultiline_(node) {
  if (node.arguments.length >= 1) {
    return node.arguments[0].loc.end.line >
      node.arguments[0].loc.start.line;
  } else {
    return false;
  }
}

/**
 * Returns true if the function is a parameter in `goog.scope`.
 * @param {!Espree.AnyFunctionNode} node
 * @return {boolean}
 */
function isGoogScopeFunction_(node) {
  // Verify that the node is an IIFE.
  if (node.parent.type !== 'CallExpression') {
    return false;
  }
  const parent = /** @type {!Espree.CallExpression} */ (node.parent);
  if (parent.callee.type !== 'MemberExpression') {
    return false;
  }
  const callee = /** @type {!Espree.MemberExpression} */ (parent.callee);

  if (callee.object.type !== 'Identifier' ||
      callee.property.type !== 'Identifier') {
    return false;
  }
  const calleeObject = /** @type {!Espree.Identifier} */ (callee.object);
  const calleeProperty = /** @type {!Espree.Identifier} */ (callee.property);

  return calleeObject.name === 'goog' && calleeProperty.name === 'scope';
}

/**
  * Returns true if the node is a file level IIFE.
  * @param {!Espree.AnyFunctionNode} node
  * @return {boolean} True if the node is the outer IIFE.
  * @private
  */
function isOuterIIFE_(node) {
  if (isGoogScopeFunction_(node)) {
    return true;
  }
  const parent = node.parent;
  let stmt = parent.parent;

  // Verify that the node is an IIFE.
  if (parent.type !== 'CallExpression') {
    return false;
  }

  // Parent must be a CallExpression.
  if (/** @type {!Espree.CallExpression} */ (parent).callee !== node) {
    return false;
  }

  // Navigate legal ancestors to determine whether this IIFE is outer.
  while (stmt.type === 'UnaryExpression' ||
         stmt.type === 'AssignmentExpression' ||
         stmt.type === 'LogicalExpression' ||
         stmt.type === 'SequenceExpression' ||
         stmt.type === 'VariableDeclarator') {
    // Check for valid unary expressions.
    if (stmt.type === 'UnaryExpression') {
      const unaryStmt = /** @type {!Espree.UnaryExpression} */ (stmt);
      if (unaryStmt.operator === '!' ||
          unaryStmt.operator === '~' ||
          unaryStmt.operator === '+' ||
          unaryStmt.operator === '-') {
        stmt = stmt.parent;
      } else {
        break;
      }
    } else {
      stmt = stmt.parent;
    }
  }

  return ((stmt.type === 'ExpressionStatement' ||
            stmt.type === 'VariableDeclaration') &&
          stmt.parent && stmt.parent.type === 'Program');
}

/**
 * Returns true if the array's first element is an object and that object starts
 * on the same line as the array.
 * @param {!Espree.ASTNode} node
 * @return {boolean} True if above conditions are met.
 * @private
 */
function isFirstArrayElementOnSameLine_(node) {
  if (node.type !== 'ArrayExpression') return false;
  const arrayNode = /** @type {!Espree.ArrayExpression} */ (node);
  if (arrayNode.elements[0]) {
    return arrayNode.elements[0].type === 'ObjectExpression' &&
      arrayNode.elements[0].loc.start.line === arrayNode.loc.start.line;
  } else {
    return false;
  }
}

/**
 * Returns a list of VariableDeclarators from the given VariableDeclaration
 * where each VariableDeclarator is the first VariableDeclarator on a line.
 * @param {!Espree.VariableDeclaration} varDeclaration Variable declaration
 *     node.
 * @return {!Array<!Espree.VariableDeclarator>} Filtered elements
 * @private
 */
function getLeadingVariableDeclarators_(varDeclaration) {
  return varDeclaration.declarations.reduce(function(finalCollection, elem) {
    const lastElem = finalCollection[finalCollection.length - 1];

    if ((elem.loc.start.line !== varDeclaration.loc.start.line && !lastElem) ||
        (lastElem && lastElem.loc.start.line !== elem.loc.start.line)) {
      finalCollection.push(elem);
    }

    return finalCollection;
  }, []);
}


/**
 * Valid options for variable declarator indents.
 * @typedef {{
 *   var: number,
 *   let: number,
 *   const: number,
 * }}
 */
let IndentOptionsVariableDeclarator;


/**
 * Valid options for function indents.
 * @typedef {{
 *   body: number,
 *   parameters: (number|string),
 * }}
 */
let IndentOptionsFunction;

/**
 * Valid options for the indent rule.
 * @typedef {{
 *   SwitchCase: number,
 *   VariableDeclarator: !IndentOptionsVariableDeclarator,
 *   outerIIFEBody: number,
 *   MemberExpression: number,
 *   FunctionDeclaration: !IndentOptionsFunction,
 *   FunctionExpression: !IndentOptionsFunction,
 * }}
 */
let IndentOption;

/**
 * Valid options for the indent rule.
 * @typedef {{
 *   SwitchCase: (number|undefined),
 *   VariableDeclarator: (!IndentOptionsVariableDeclarator|number|undefined),
 *   outerIIFEBody: (number|undefined),
 *   MemberExpression: (number|undefined),
 *   FunctionDeclaration: (!IndentOptionsFunction|undefined),
 *   FunctionExpression: (!IndentOptionsFunction|undefined),
 * }}
 */
let IndentOptionShortHand;

/**
 * Valid options for the indent rule.
 * @typedef {{
 *   indentSize: number,
 *   indentType: string,
 *   indentOptions: !IndentOption,
 * }}
 */
let IndentPreference;

/**
 * Builds a completely new !IndentPreference object.
 * @return {!IndentPreference}
 * @private
 */
function buildDefaultPreferences_() {
  const DEFAULT_INDENT_TYPE = 'space';
  const DEFAULT_INDENT_SIZE = 4;
  /** @type {IndentOption} */
  const DEFAULT_INDENT_OPTIONS = {
    SwitchCase: 0,
    VariableDeclarator: {
      var: 1,
      let: 1,
      const: 1,
    },
    outerIIFEBody: -1,
    MemberExpression: -1,
    FunctionDeclaration: {
      parameters: -1,
      body: 1,
    },
    FunctionExpression: {
      parameters: -1,
      body: 1,
    },
  };

  return {
    indentSize: DEFAULT_INDENT_SIZE,
    indentType: DEFAULT_INDENT_TYPE,
    indentOptions: DEFAULT_INDENT_OPTIONS,
  };
}

/**
 * Builds a complete sete of indentation preferences from the user's options.
 * @param {!IndentOptionShortHand} userOptions
 * @return {!IndentPreference}
 * @private
 */
function buildIndentPreferences_(userOptions) {

  const preferences = buildDefaultPreferences_();
  const options = preferences.indentOptions;

  if (userOptions.length) {
    if (userOptions[0] === 'tab') {
      preferences.indentSize = 1;
      preferences.indentType = 'tab';
    } else if (typeof userOptions[0] === 'number') {
      preferences.indentSize = userOptions[0];
      preferences.indentType = 'space';
    }

    if (userOptions[1]) {
      // Type is enforced by the rule schema.
      const opts = /** @type {!IndentOptionShortHand} */ (userOptions[1]);

      options.SwitchCase = opts.SwitchCase || 0;

      if (typeof opts.VariableDeclarator === 'number') {
        const variableDeclaratorIndent = /** @type {number} */
            (opts.VariableDeclarator);
        options.VariableDeclarator = {
          var: variableDeclaratorIndent,
          let: variableDeclaratorIndent,
          const: variableDeclaratorIndent,
        };
      } else if (typeof opts.VariableDeclarator === 'object') {
        Object.assign(options.VariableDeclarator,
            /** @type {!IndentOptionsVariableDeclarator} */
            (opts.VariableDeclarator));
      }

      if (typeof opts.outerIIFEBody === 'number') {
        options.outerIIFEBody =
          /** @type {number} */ (opts.outerIIFEBody);
      }

      if (typeof opts.MemberExpression === 'number') {
        options.MemberExpression =
            /** @type {number} */ (opts.MemberExpression);
      }

      if (typeof opts.FunctionDeclaration === 'object') {
        Object.assign(options.FunctionDeclaration,
            /** @type {!IndentOptionsFunction} */ (opts.FunctionDeclaration));
      }

      if (typeof opts.FunctionExpression === 'object') {
        Object.assign(options.FunctionExpression,
            /** @type {!IndentOptionsFunction} */ (opts.FunctionExpression));
      }
    }
  }
  return preferences;

}

/**
 * @param {!ESLint.RuleContext} context
 * @return {!Object<!Espree.NodeType, function(!ESLint.ASTNode)>}
 */
function create(context) {
  const indentPreferences = buildIndentPreferences_(
    /** @type {!IndentOptionShortHand} */ (context.options));

  const indentType = indentPreferences.indentType;
  const indentSize = indentPreferences.indentSize;
  const options = indentPreferences.indentOptions;

  const sourceCode = context.getSourceCode();

  const caseIndentStore = {};

  /**
   * Creates an error message for a line, given the expected/actual
   * indentation.
   * @param {number} expectedAmount The expected amount of indentation
   *     characters for this line.
   * @param {number} actualSpaces The actual number of indentation spaces that
   *     were found on this line.
   * @param {number} actualTabs The actual number of indentation tabs that
   *     were found on this line.
   * @return {string} An error message for this line
   */
  function createErrorMessage(expectedAmount, actualSpaces, actualTabs) {
    // Creates message like: "2 tabs"
    const expectedStatement =
          `${expectedAmount} ${indentType}${expectedAmount === 1 ? '' : 's'}`;
    const foundSpacesWord = `space${actualSpaces === 1 ? '' : 's'}`;
    const foundTabsWord = `tab${actualTabs === 1 ? '' : 's'}`;
    let foundStatement;

    if (actualSpaces > 0 && actualTabs > 0) {
      // Statement like "1 space and 2 tabs".
      foundStatement = `${actualSpaces} ${foundSpacesWord} and ` +
        `${actualTabs} ${foundTabsWord}`;
    } else if (actualSpaces > 0) {
      // Abbreviate the message if the expected indentation is also spaces.
      // e.g. 'Expected 4 spaces but found 2' rather than 'Expected 4 spaces
      // but found 2 spaces'
      foundStatement = indentType === 'space' ?
        actualSpaces :
        `${actualSpaces} ${foundSpacesWord}`;
    } else if (actualTabs > 0) {
      foundStatement = indentType === 'tab' ?
        actualTabs :
        `${actualTabs} ${foundTabsWord}`;
    } else {
      foundStatement = '0';
    }

    return `Expected indentation of ${expectedStatement} but` +
      ` found ${foundStatement}.`;
  }

  /**
   * Reports a given indent violation.
   * @param {!Espree.Node} node Node violating the indent rule.
   * @param {number} needed Expected indentation character count.
   * @param {number} gottenSpaces Indentation space count in the actual
   *     node/code.
   * @param {number} gottenTabs Indentation tab count in the actual node/code.
   * @param {!ESLint.Location=} opt_loc Error line and column location.
   * @param {boolean=} opt_isLastNodeCheck Is the error for last node check.
   * @return {void}
   */
  function report(node, needed, gottenSpaces, gottenTabs, opt_loc,
          opt_isLastNodeCheck) {

    const desiredIndent =
          (indentType === 'space' ? ' ' : '\t').repeat(needed);

    /** @type {!Array<number>} */
    const textRange = opt_isLastNodeCheck ?
          [node.range[1] - gottenSpaces - gottenTabs - 1, node.range[1] - 1] :
          [node.range[0] - gottenSpaces - gottenTabs, node.range[0]];

    context.report({
      node,
      loc: opt_loc,
      message: createErrorMessage(needed, gottenSpaces, gottenTabs),
      /**
       * @param {!ESLint.Fixer} fixer
       * @return {!ESLint.FixCommand}
       */
      fix(fixer) {
        return fixer.replaceTextRange(textRange, desiredIndent);
      },
    });
  }

  /**
   * Checks indent for node.
   * @param {(!ESLint.ASTNode|!Espree.Token)} node Node to check.
   * @param {number} neededIndent The needed indent.
   * @return {void}
   */
  function checkNodeIndent(node, neededIndent) {
    const actualIndent = getNodeIndent_(node, sourceCode, indentType, false);

    if (node.type !== 'ArrayExpression' &&
        node.type !== 'ObjectExpression' &&
        (actualIndent.goodChar !== neededIndent ||
         actualIndent.badChar !== 0) &&
        isNodeFirstInLine_(node, sourceCode)
       ) {
      report(node, neededIndent, actualIndent.space, actualIndent.tab);
    }
  }

  /**
   * Checks indentation of an array of nodes with a given indent.
   * @param {!Array<!ESLint.ASTNode>} nodes List of node objects.
   * @param {number} indent Needed indent.
   * @return {void}
   */
  function checkNodesIndent(nodes, indent) {
    nodes.forEach(node => checkNodeIndent(node, indent));
  }

  /**
   * Checks that the indentation of the last token of a node matches the given
   * indent.
   * @param {!ESLint.ASTNode} node
   * @param {number} lastLineIndent Needed indent.
   * @return {void}
   */
  function checkLastNodeLineIndent(node, lastLineIndent) {
    const lastToken = sourceCode.getLastToken(node);
    const endIndent = getNodeIndent_(lastToken, sourceCode, indentType, true);

    if ((endIndent.goodChar !== lastLineIndent || endIndent.badChar !== 0) &&
        isNodeFirstInLine_(node, sourceCode, true)) {
      const location = {start: {
        line: lastToken.loc.start.line,
        column: lastToken.loc.start.column,
      }};
      report(
        node,
        lastLineIndent,
        endIndent.space,
        endIndent.tab,
        location,
        true
      );
    }
  }

  /**
   * Checks that the indentation of the first node on a line matches the given
   * indent.
   * @param {!ESLint.ASTNode} node
   * @param {number} firstLineIndent Needed indent.
   * @return {void}
   */
  function checkFirstNodeLineIndent(node, firstLineIndent) {
    const startIndent = getNodeIndent_(node, sourceCode, indentType, false);

    if ((startIndent.goodChar !== firstLineIndent ||
         startIndent.badChar !== 0) &&
        isNodeFirstInLine_(node, sourceCode)) {
      const location = {start: {
        line: node.loc.start.line,
        column: node.loc.start.column,
      }};
      report(
        node,
        firstLineIndent,
        startIndent.space,
        startIndent.tab,
        location
      );
    }
  }

  /**
   * Gets the base indent for the function node.
   * @param {(!Espree.AnyFunctionNode|!Espree.ClassExpression)} functionNode
   * @return {number}
   */
  function getFunctionBaseIndent(functionNode) {
    // Search first caller in chain.
    // Ex.:
    //
    // Models <- Identifier
    //   .User
    //   .find()
    //   .exec(function() {
    //   // function body
    // });
    //
    // Looks for 'Models'

    // Assume a regular standalone function.
    let indent = getNodeIndent_(functionNode, sourceCode, indentType).goodChar;

    const parent = functionNode.parent;

    if (parent.type === 'Property' || parent.type === 'ArrayExpression') {
      // If function is part of array or object, comma can be put at left
      indent = getNodeIndent_(functionNode, sourceCode, indentType,
                              false).goodChar;

    } else if (parent.type === 'CallExpression') {
      // This functionNode is a call back.
      const calleeParent = /** @type {!Espree.CallExpression} */ (parent);

      if (isCalleeNodeFirstArgMultiline_(calleeParent) &&
          utils.isNodeOneLine(calleeParent.callee) &&
          !isNodeFirstInLine_(functionNode, sourceCode)) {
        indent = getNodeIndent_(calleeParent, sourceCode, indentType)
          .goodChar;
      }
    }
    return indent;
  }

  /**
   * Checks indentation of a function with a BlockStatement body.
   * @param {!Espree.AnyFunctionNode} functionNode
   * @return {void}
   */
  function checkFunctionIndent(functionNode) {
    // TODO: assert that if functionNode is an arrow function, that it's body is
    // a BlockStatement.
    const bodyNode = /** @type {!Espree.BlockStatement} */ (functionNode.body);
    const baseIndent = getFunctionBaseIndent(functionNode);
    let bodyIndent = baseIndent;
    let functionOffset = indentSize;

    if (options.outerIIFEBody !== -1 && isOuterIIFE_(functionNode)) {
      functionOffset = options.outerIIFEBody * indentSize;
    } else if (functionNode.type === 'FunctionExpression') {
      functionOffset = options.FunctionExpression.body * indentSize;
    } else if (functionNode.type === 'FunctionDeclaration') {
      functionOffset = options.FunctionDeclaration.body * indentSize;
    }
    bodyIndent += functionOffset;

    // Check if the bodyNode is inside a variable.
    const parentVarNode = /** @type {?Espree.VariableDeclarator} */
        (utils.getNodeAncestorOfType(functionNode, 'VariableDeclarator'));

    if (parentVarNode && isNodeInVarOnTop_(functionNode, parentVarNode)) {
      bodyIndent += indentSize *
        options.VariableDeclarator[parentVarNode.parent.kind];
    }

    checkBlockIndent(bodyNode, bodyIndent, bodyIndent - functionOffset);
  }

  /**
   * Checks indentation of a ClassDeclaration or ClassExpression.
   * @param {(!Espree.ClassDeclaration|!Espree.ClassExpression)} classNode
   * @return {void}
   */
  function checkClassIndent(classNode) {
    if (utils.isNodeOneLine(classNode)) return;
    const classBody = classNode.body;
    const baseIndent = getFunctionBaseIndent(classNode);
    const bodyIndent = baseIndent + indentSize;
    checkBlockIndent(classBody, bodyIndent, baseIndent);
  }

  /**
   * Checks indentation in arrays.
   * @param {!Espree.ArrayExpression} node
   */
  function checkArrayExpressionIndent(node) {
    if (utils.isNodeOneLine(node)) return;

    // Filter out empty elements from an array like [1, , 2] because espree
    // considers it as null.
    const elements = node.elements.filter((elem) => elem !== null);

    // Skip checks if the first element is on same line as the beginning of the
    // ArrayExpression.
    if (elements.length > 0 && utils.nodesStartOnSameLine(elements[0], node)) {
      return;
    }

    const elementsIndent = getIndentforObjectOrArrayElements(node);
    checkNodesIndent(elements, elementsIndent);
    checkLastNodeLineIndent(node, elementsIndent - indentSize);
  }

  /**
   * Checks indentation for array block content or object block content.
   * @param {!Espree.ObjectExpression} node
   * @return {void}
   */
  function checkObjectExpressionIndent(node) {
    if (utils.isNodeOneLine(node)) return;

    const elements = node.properties;

    // Skip checks if the first element is on same line as the beginning of the
    // ObjectExpression.
    if (elements.length > 0 && utils.nodesStartOnSameLine(elements[0], node)) {
      return;
    }
    const elementsIndent = getIndentforObjectOrArrayElements(node);
    checkNodesIndent(elements, elementsIndent);
    checkLastNodeLineIndent(node, elementsIndent - indentSize);
  }

  /**
   * Computes the proper indent for object properties or array elements.
   * @param {(!Espree.ObjectExpression|!Espree.ArrayExpression)} node
   * @return {number} The required indent of object properties.
   */
  function getIndentforObjectOrArrayElements(node) {
    const parent = node.parent;
    const varDeclAncestor = /** @type {?Espree.VariableDeclarator} */
         (utils.getNodeAncestorOfType(node, 'VariableDeclarator'));

    let baseIndent = getNodeIndent_(parent, sourceCode, indentType).goodChar;
    let elementsIndent;
    if (isNodeFirstInLine_(node, sourceCode)) {
      if (varDeclAncestor) {
        if (parent === varDeclAncestor) {
          if (varDeclAncestor === varDeclAncestor.parent.declarations[0]) {
            // We have something like:
            // var foo =
            //     {
            //       foo: 2,
            //     }
            baseIndent = baseIndent +
              (indentSize *
               options.VariableDeclarator[varDeclAncestor.parent.kind]);
          }
        } else {
          // Parent is not a VariableDeclarator.  The VariableDeclarator is
          // further up.
          if (
              parent.type === 'ObjectExpression' ||
              parent.type === 'ArrayExpression' ||
              parent.type === 'CallExpression' ||
              parent.type === 'ArrowFunctionExpression' ||
              parent.type === 'NewExpression' ||
              parent.type === 'LogicalExpression'
          ) {
            // We have something like:
            // var foo = [
            //   {
            //     foo: 2,
            //   }
            // ]
            baseIndent = baseIndent + indentSize;
          }
        }

      } else {
        // There is no VariableDeclarator ancestor.
        if (!isFirstArrayElementOnSameLine_(parent) &&
            parent.type !== 'MemberExpression' &&
            parent.type !== 'ExpressionStatement' &&
            parent.type !== 'AssignmentExpression' &&
            parent.type !== 'Property') {
          // We have something like:
          // foobar(
          //     {
          //       a: 1,
          //     }
          // );
          baseIndent = baseIndent + indentSize;
        }
      }
      elementsIndent = baseIndent + indentSize;

      checkFirstNodeLineIndent(node, baseIndent);
    } else {
      baseIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
      elementsIndent = baseIndent + indentSize;
    }

    // Checks if the node is a multiple variable declaration; if so, then make
    // sure indentation takes that into account.
    if (isNodeInVarOnTop_(node, varDeclAncestor)) {
      elementsIndent += indentSize *
        options.VariableDeclarator[varDeclAncestor.parent.kind];
    }
    return elementsIndent;
  }

  /**
   * Checks indentation for BlockStatements with a known indent.
   * @param {(!Espree.BlockStatement|!Espree.ClassBody)} node
   * @param {number} bodyIndent The indent required for the body nodes.
   * @param {number} closingIndent The indent required for the closing brace.
   * @return {void}
   */
  function checkBlockIndent(node, bodyIndent, closingIndent) {
    if (utils.isNodeOneLine(node)) return;
    checkNodesIndent(node.body, bodyIndent);
    checkLastNodeLineIndent(node, closingIndent);
  }

  /**
   * Checks indentation for BlockStatements without a known indent.  The only
   * use for this should be standalone blocks used to create a new scope.
   * BlockStatemnts for functions, loops, etc. get checked in dedicated
   * functions.
   * @param {!Espree.BlockStatement} blockNode
   * @return {void}
   */
  function checkBlockStatementIndent(blockNode) {
    if (utils.isNodeOneLine(blockNode)) return;

    if (!(blockNode.parent.type == 'BlockStatement' ||
          blockNode.parent.type == 'Program')) {
      return;
    }

    const baseIndent = getNodeIndent_(blockNode, sourceCode, indentType)
        .goodChar;
    const bodyIndent = baseIndent + indentSize;
    checkBlockIndent(blockNode, bodyIndent, baseIndent);
  }

  /**
   * Checks indentation for IfStatements.
   * @param {!Espree.IfStatement} node
   * @return {void}
   */
  function checkIfStatementIndent(node) {
    const baseIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
    const expectedIndent = baseIndent + indentSize;

    if (node.consequent.type !== 'BlockStatement') {
      if (!utils.nodesStartOnSameLine(node, node.consequent)) {
        checkNodeIndent(node.consequent, expectedIndent);
      }
    } else {
      checkNodesIndent(
          /** @type {!Espree.BlockStatement} */ (node.consequent).body,
          expectedIndent);
      checkLastNodeLineIndent(node.consequent, baseIndent);
    }

    if (node.alternate) {
      const elseKeyword = sourceCode.getTokenBefore(node.alternate);
      checkNodeIndent(elseKeyword, baseIndent);

      if (node.alternate.type !== 'BlockStatement') {
        if (!utils.nodesStartOnSameLine(node.alternate, elseKeyword)) {
          checkNodeIndent(node.alternate, expectedIndent);
        }
      } else {
        checkNodesIndent(
            /** @type {!Espree.BlockStatement} */ (node.alternate).body,
            expectedIndent);
        checkLastNodeLineIndent(node.alternate, baseIndent);
      }
    }
  }

  /**
   * Checks indentation for VariableDeclarations.
   * @param {!Espree.VariableDeclaration} node
   * @return {void}
   */
  function checkVariableDeclarationIndent(node) {
    const startDeclarator = node.declarations[0];
    const endDeclarator = node.declarations[node.declarations.length - 1];
    if (utils.nodesStartOnSameLine(startDeclarator, endDeclarator)) {
      return;
    }

    const elements = getLeadingVariableDeclarators_(node);
    const nodeIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
    const lastElement = elements[elements.length - 1];

    const elementsIndent = nodeIndent +
          indentSize * options.VariableDeclarator[node.kind];

    checkNodesIndent(elements, elementsIndent);

    // Only check the last line if there is any token after the last item
    if (sourceCode.getLastToken(node).loc.end.line <=
        lastElement.loc.end.line) {
      return;
    }

    const tokenBeforeLastElement = sourceCode.getTokenBefore(lastElement);

    if (tokenBeforeLastElement.value === ',') {

      // Special case for comma-first syntax where the semicolon is indented.
      checkLastNodeLineIndent(
          node,
          getNodeIndent_(tokenBeforeLastElement, sourceCode, indentType)
              .goodChar
      );
    } else {
      checkLastNodeLineIndent(node, elementsIndent - indentSize);
    }
  }

  /**
   * Checks indentation for nodes that may have a single element body without
   * curly braces, e.g. a short `WhileStatement`.
   * @param {!Espree.OptionallyBodiedNode} node The node to examine.
   * @return {void}
   */
  function checkOptionallyBodiedIndent(node) {
    const baseIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
    const bodyIndent = baseIndent + indentSize;
    if (node.body.type === 'BlockStatement') {
      checkBlockIndent(
        /** @type {!Espree.BlockStatement} */ (node.body),
        bodyIndent,
        baseIndent);
    } else {
      const nodesToCheck = [node.body];
      checkNodesIndent(nodesToCheck, bodyIndent);
    }
  }

  /**
   * Checks indentation of function parameters.
   * @param {(!Espree.FunctionExpression|!Espree.FunctionDeclaration)} node
   * @param {number} indentSize The base baseIndent width.
   * @param {(number|string)} indentMultiple The ident multiple of `indentSize`.
   */
  function checkFunctionParamsIndent(node, indentSize, indentMultiple) {
    if (indentMultiple === 'first' && node.params.length) {
      checkNodesIndent(
        node.params.slice(1), node.params[0].loc.start.column);
    } else {
      // indentMultiple must be a number because only 'first' and numbers are
      // allowed by the schema.
      checkNodesIndent(
        node.params, indentSize * /** @type {number} */ (indentMultiple));
    }
  }

  /**
   * Returns the expected indentation for the case statement.
   * @param {!ESLint.ASTNode} node The node to examine.
   * @param {number=} opt_switchIndent The baseIndent for switch statement.
   * @return {number} The baseIndent size.
   */
  function expectedCaseIndent(node, opt_switchIndent) {
    const switchNode = /** @type {!Espree.SwitchStatement} */
        ((node.type === 'SwitchStatement') ? node : node.parent);
    let caseIndent;

    if (caseIndentStore[switchNode.loc.start.line]) {
      return caseIndentStore[switchNode.loc.start.line];
    } else {
      if (typeof opt_switchIndent === 'undefined') {
        opt_switchIndent = getNodeIndent_(switchNode, sourceCode, indentType)
            .goodChar;
      }

      if (switchNode.cases.length > 0 && options.SwitchCase === 0) {
        caseIndent = opt_switchIndent;
      } else {
        caseIndent = opt_switchIndent + (indentSize * options.SwitchCase);
      }

      caseIndentStore[switchNode.loc.start.line] = caseIndent;
      return caseIndent;
    }
  }

  return {
    /**
     * @param {!Espree.Program} node
     */
    Program(node) {
      checkNodesIndent(node.body, 0);
    },

    ClassDeclaration: checkClassIndent,
    ClassExpression: checkClassIndent,

    BlockStatement: checkBlockStatementIndent,

    DoWhileStatement: checkOptionallyBodiedIndent,
    ForStatement: checkOptionallyBodiedIndent,
    ForInStatement: checkOptionallyBodiedIndent,
    ForOfStatement: checkOptionallyBodiedIndent,
    WhileStatement: checkOptionallyBodiedIndent,
    WithStatement: checkOptionallyBodiedIndent,

    IfStatement: checkIfStatementIndent,

    VariableDeclaration: checkVariableDeclarationIndent,

    ObjectExpression: checkObjectExpressionIndent,

    ArrayExpression: checkArrayExpressionIndent,

    /**
     * @param {!Espree.MemberExpression} node
     */
    MemberExpression(node) {
      if (options.MemberExpression === -1) {
        return;
      }

      if (utils.isNodeOneLine(node)) return;

      // The typical layout of variable declarations and assignments
      // alter the expectation of correct indentation. Skip them.
      // TODO: Add appropriate configuration options for variable
      // declarations and assignments.
      if (utils.getNodeAncestorOfType(node, 'VariableDeclarator')) {
        return;
      }

      if (utils.getNodeAncestorOfType(node, 'AssignmentExpression')) {
        return;
      }

      const propertyIndent =
            getNodeIndent_(node, sourceCode, indentType).goodChar +
            indentSize * options.MemberExpression;

      const checkNodes = [node.property];

      const dot = sourceCode.getTokenBefore(node.property);

      if (dot.type === 'Punctuator' && dot.value === '.') {
        checkNodes.push(dot);
      }

      checkNodesIndent(checkNodes, propertyIndent);
    },

    /**
     * @param {!Espree.SwitchStatement} node
     */
    SwitchStatement(node) {
      // Switch is not a 'BlockStatement'
      const switchIndent = getNodeIndent_(
          node, sourceCode, indentType).goodChar;
      const caseIndent = expectedCaseIndent(node, switchIndent);
      checkNodesIndent(node.cases, caseIndent);
      checkLastNodeLineIndent(node, switchIndent);
    },

    /**
     * @param {!Espree.SwitchCase} node
     */
    SwitchCase(node) {
      if (utils.isNodeOneLine(node)) return;
      const caseIndent = expectedCaseIndent(node);

      checkNodesIndent(node.consequent, caseIndent + indentSize);
    },


    /**
     * @param {!Espree.ArrowFunctionExpression} node
     */
    ArrowFunctionExpression(node) {
      if (utils.isNodeOneLine(node)) return;
      if (node.body.type === 'BlockStatement') {
        checkFunctionIndent(node);
      } else {
        // TODO: Check when an arrow function just has an expression.
      }

    },

    /**
     * @param {!Espree.FunctionDeclaration} node
     */
    FunctionDeclaration(node) {
      if (utils.isNodeOneLine(node)) return;
      if (options.FunctionDeclaration.parameters !== -1) {
        checkFunctionParamsIndent(
            node, indentSize, options.FunctionDeclaration.parameters);
      }
      checkFunctionIndent(node);
    },

    /**
     * @param {!Espree.FunctionExpression} node
     */
    FunctionExpression(node) {
      if (utils.isNodeOneLine(node)) return;
      if (options.FunctionExpression.parameters !== -1) {
        checkFunctionParamsIndent(
          node, indentSize, options.FunctionExpression.parameters);
      }
      checkFunctionIndent(node);
    },
  };

}

/** @const {!ESLint.RuleDefinition} */
const INDENT_RULE = {
  meta: {
    docs: {
      description: 'enforce consistent indentation',
      category: 'Stylistic Issues',
      recommended: false,
    },

    fixable: 'whitespace',

    schema: [
      {
        oneOf: [
          {enum: ['tab']},
          {type: 'integer', minimum: 0},
        ],
      },
      {
        type: 'object',
        properties: {
          SwitchCase: {
            type: 'integer',
            minimum: 0,
          },
          VariableDeclarator: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'object',
                properties: {
                  var: {type: 'integer', minimum: 0},
                  let: {type: 'integer', minimum: 0},
                  const: {type: 'integer', minimum: 0},
                },
              },
            ],
          },
          outerIIFEBody: {type: 'integer', minimum: 0},
          MemberExpression: {type: 'integer', minimum: 0},
          FunctionDeclaration: {
            type: 'object',
            properties: {
              parameters: {
                oneOf: [
                  {type: 'integer', minimum: 0},
                  {enum: ['first']},
                ],
              },
              body: {type: 'integer', minimum: 0},
            },
          },
          FunctionExpression: {
            type: 'object',
            properties: {
              parameters: {
                oneOf: [
                  {type: 'integer', minimum: 0},
                  {enum: ['first']},
                ],
              },
              body: {type: 'integer', minimum: 0},
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create,
};

exports = INDENT_RULE;
