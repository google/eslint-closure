/**
 * @fileoverview This option sets a specific indent width for your code.
 *
 * This rule has been ported and modified from ESLint.
 * @author Vitaly Puzrin
 * @author Gyandeep Singh
 * @author Joe Schafer
 */

goog.module('googlejs.rules.indent');

const {getNodeAncestorOfType, tokensStartOnSameLine} = goog.require('googlejs.utils');
/**
 * Information about the indentation preceeding a Node.
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
 * Nodes that may have a body with curly braces or might just have a single body
 * node.
 * @typedef {(!Espree.WhileStatement|!Espree.ForStatement|
 *     !Espree.ForInStatement|!Espree.ForOfStatement|!Espree.DoWhileStatement)
 * }
 */
let OptionallyBodiedNode;

/**
 * Nodes that have a body property.
 * @typedef {(
*      !Espree.ArrowFunctionExpression|
*      !Espree.BlockStatement|
*      !Espree.CatchClause|
*      !Espree.ClassBody|
*      !Espree.ClassDeclaration|
*      !Espree.ClassExpression|
*      !Espree.DoWhileStatement|
*      !Espree.ForInStatement|
*      !Espree.ForOfStatement|
*      !Espree.ForStatement|
*      !Espree.FunctionDeclaration|
*      !Espree.FunctionExpression|
*      !Espree.LabeledStatement|
*      !Espree.Program|
*      !Espree.WhileStatement|
*      !Espree.WithStatement
 * )}
 */
let BodiedNode;

/**
  * Gets the actual indent of the node.
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
 * Checks node is the first in its own start line. By default it looks by
 * start line.
 * @param {!Espree.Node} node The node to check.
 * @param {!ESLint.SourceCode} sourceCode
 * @param {boolean=} opt_byEndLocation Lookup based on start position or
 *     end.
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
 * Checks if the given node starts and ends on the same line.
 * @param {!ESLint.ASTNode} node The node to check.
 * @param {!ESLint.SourceCode} sourceCode
 * @return {boolean} Whether or not the block starts and ends on the same
 *     line.
 * @private
 */
function isSingleLineNode_(node, sourceCode) {
  const lastToken = sourceCode.getLastToken(node);
  const startLine = node.loc.start.line;
  const endLine = lastToken.loc.end.line;
  return startLine == endLine;
}

/**
 * Check to see if the node is part of the multi-line variable declaration.
 * Also if its on the same line as the varNode.
 * @param {!ESLint.ASTNode} node Node to check.
 * @param {?Espree.VariableDeclarator} varNode Variable declaration node to
 *     check against.
 * @return {boolean} True if all the above condition are satisfied.
 */
function isNodeInVarOnTop(node, varNode) {
  return !!varNode &&
    varNode.parent.loc.start.line === node.loc.start.line &&
    varNode.parent.declarations.length > 1;
}

/**
 * Checks to see if the argument before the callee node is multi-line and
 * there should only be 1 argument before the callee node.
 * @param {!Espree.Expression} node Node to check.
 * @return {boolean} True if arguments are multi-line.
 * @private
 */
function isArgBeforeCalleeNodeMultiline_(node) {
  const parent = /** @type {!Espree.CallExpression} */ (node.parent);
  if (parent.arguments.length >= 2 && parent.arguments[1] === node) {
    return parent.arguments[0].loc.end.line >
      parent.arguments[0].loc.start.line;
  }
  return false;
}

/**
  * Checks to see if the node is a file level IIFE.
  * @param {!ESLint.ASTNode} node The function node to check.
  * @return {boolean} True if the node is the outer IIFE.
  * @private
  */
function isOuterIIFE_(node) {
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
 * Check to see if the first element inside an array is an object and on the
 * same line as the node.  If the node is not an array then it will return
 * false.
 * @param {!ESLint.ASTNode} node Node to check.
 * @return {boolean} Success or failure.
 * @private
 */
function isFirstArrayElementOnSameLine_(node) {
  if (node.type != 'ArrayExpression') {
    return false;
  }
  const arrayExpression = /** @type {!Espree.ArrayExpression} */ (node);

  if (arrayExpression.elements[0]) {
    return arrayExpression.elements[0].loc.start.line ===
        arrayExpression.loc.start.line &&
        arrayExpression.elements[0].type === 'ObjectExpression';
  } else {
    return false;
  }
}

/**
 * Checks if the node or node body is a BlockStatement or not.
 * @param {!ESLint.ASTNode} node Node to test.
 * @return {boolean} True if it or its body is a block statement.
 * @private
*/
function isNodeBodyBlock_(node) {
  return node.type === 'BlockStatement' || node.type === 'ClassBody' ||
    (node.body && node.body.type === 'BlockStatement') ||
    (node.consequent && node.consequent.type === 'BlockStatement');
}

/**
 * Filters out the elements which are on the same line of each other or the
 * node.  Basically have only 1 elements from each line except the variable
 * declaration line.
 *
 * @param {!Espree.VariableDeclaration} varDeclaration Variable declaration
 *     node.
 * @return {!Array<!ESLint.ASTNode>} Filtered elements
 * @private
 */
function filterOutSameLineVars_(varDeclaration) {
  return varDeclaration.declarations.reduce(function(finalCollection, elem) {
    const lastElem = finalCollection[finalCollection.length - 1];

    if ((elem.loc.start.line !== varDeclaration.loc.start.line && !lastElem) ||
        (lastElem && lastElem.loc.start.line !== elem.loc.start.line)) {
      finalCollection.push(elem);
    }

    return finalCollection;
  }, []);
}

function create(context) {
  const DEFAULT_VARIABLE_INDENT = 1;
  // For backwards compatibility, don't check parameter indentation unless
  // specified in the config
  const DEFAULT_PARAMETER_INDENT = -1;
  const DEFAULT_FUNCTION_BODY_INDENT = 1;

  let indentType = 'space';
  let indentSize = 4;
  const options = {
    SwitchCase: 0,
    VariableDeclarator: {
      var: DEFAULT_VARIABLE_INDENT,
      let: DEFAULT_VARIABLE_INDENT,
      const: DEFAULT_VARIABLE_INDENT,
    },
    outerIIFEBody: -1,
    FunctionDeclaration: {
      parameters: DEFAULT_PARAMETER_INDENT,
      body: DEFAULT_FUNCTION_BODY_INDENT,
    },
    FunctionExpression: {
      parameters: DEFAULT_PARAMETER_INDENT,
      body: DEFAULT_FUNCTION_BODY_INDENT,
    },
  };

  /** @type {!ESLint.SourceCode} */
  const sourceCode = context.getSourceCode();

  if (context.options.length) {
    if (context.options[0] === 'tab') {
      indentSize = 1;
      indentType = 'tab';
    } else if (typeof context.options[0] === 'number') {
      indentSize = context.options[0];
      indentType = 'space';
    }

    if (context.options[1]) {
      const opts = context.options[1];

      options.SwitchCase = opts.SwitchCase || 0;
      const variableDeclaratorRules = opts.VariableDeclarator;

      if (typeof variableDeclaratorRules === 'number') {
        options.VariableDeclarator = {
          var: variableDeclaratorRules,
          let: variableDeclaratorRules,
          const: variableDeclaratorRules,
        };
      } else if (typeof variableDeclaratorRules === 'object') {
        Object.assign(options.VariableDeclarator, variableDeclaratorRules);
      }

      if (typeof opts.outerIIFEBody === 'number') {
        options.outerIIFEBody = opts.outerIIFEBody;
      }

      if (typeof opts.MemberExpression === 'number') {
        options.MemberExpression = opts.MemberExpression;
      }

      if (typeof opts.FunctionDeclaration === 'object') {
        Object.assign(options.FunctionDeclaration, opts.FunctionDeclaration);
      }

      if (typeof opts.FunctionExpression === 'object') {
        Object.assign(options.FunctionExpression, opts.FunctionExpression);
      }
    }
  }

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
   * @param {Object=} opt_loc Error line and column location.
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
      fix: fixer => fixer.replaceTextRange(textRange, desiredIndent),
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

    if (node.type === 'IfStatement' && node.alternate) {
      const elseToken = sourceCode.getTokenBefore(node.alternate);

      checkNodeIndent(elseToken, neededIndent);

      if (!isNodeFirstInLine_(node.alternate, sourceCode)) {
        checkNodeIndent(node.alternate, neededIndent);
      }
    }
  }

  /**
   * Checks indent for nodes list.
   * @param {!Array<!ESLint.ASTNode>} nodes List of node objects.
   * @param {number} indent Needed indent.
   * @return {void}
   */
  function checkNodesIndent(nodes, indent) {
    nodes.forEach(node => checkNodeIndent(node, indent));
  }

  /**
   * Checks that last node line indent this detects, that block closed
   * correctly.
   * @param {!ESLint.ASTNode} node Node to examine.
   * @param {number} lastLineIndent Needed indent.
   * @return {void}
   */
  function checkLastNodeLineIndent(node, lastLineIndent) {
    const lastToken = sourceCode.getLastToken(node);
    const endIndent = getNodeIndent_(lastToken, sourceCode, indentType, true);

    if ((endIndent.goodChar !== lastLineIndent || endIndent.badChar !== 0) &&
        isNodeFirstInLine_(node, sourceCode, true)) {
      report(
        node,
        lastLineIndent,
        endIndent.space,
        endIndent.tab,
        {line: lastToken.loc.start.line, column: lastToken.loc.start.column},
        true
      );
    }
  }

  /**
   * Checks that first node line indent is correct.
   * @param {!ESLint.ASTNode} node Node to examine.
   * @param {number} firstLineIndent Needed indent.
   * @return {void}
   */
  function checkFirstNodeLineIndent(node, firstLineIndent) {
    const startIndent = getNodeIndent_(node, sourceCode, indentType, false);

    if ((startIndent.goodChar !== firstLineIndent ||
         startIndent.badChar !== 0) &&
        isNodeFirstInLine_(node, sourceCode)) {
      report(
        node,
        firstLineIndent,
        startIndent.space,
        startIndent.tab,
        {line: node.loc.start.line, column: node.loc.start.column}
      );
    }
  }

  /**
   * Checks indent for function block content.
   * @param {!BodiedNode} node A BlockStatement node that is inside of a
   *     function.
   * @return {void}
   */
  function checkIndentInFunctionBlock(node) {

    /*
     * Search first caller in chain.
     * Ex.:
     *
     * Models <- Identifier
     *   .User
     *   .find()
     *   .exec(function() {
     *   // function body
     * });
     *
     * Looks for 'Models'
     */
    const calleeNode = node.parent; // FunctionExpression
    let indent;

    if (calleeNode.parent &&
        (calleeNode.parent.type === 'Property' ||
         calleeNode.parent.type === 'ArrayExpression')) {

      // If function is part of array or object, comma can be put at left
      indent = getNodeIndent_(calleeNode, sourceCode, indentType,
          false).goodChar;
    } else {

      // If function is standalone, simple calculate indent
      indent = getNodeIndent_(calleeNode, sourceCode, indentType).goodChar;
    }

    if (calleeNode.parent.type === 'CallExpression') {
      const calleeParent =
           /** @type {!Espree.CallExpression} */ (calleeNode.parent);

      if (calleeNode.type !== 'FunctionExpression' &&
          calleeNode.type !== 'ArrowFunctionExpression') {
        if (calleeParent && calleeParent.loc.start.line <
            node.loc.start.line) {
          indent = getNodeIndent_(calleeParent, sourceCode, indentType)
              .goodChar;
        }
      } else {
        if (isArgBeforeCalleeNodeMultiline_(calleeNode) &&
            calleeParent.callee.loc.start.line ==
            calleeParent.callee.loc.end.line &&
            !isNodeFirstInLine_(calleeNode, sourceCode)) {
          indent = getNodeIndent_(calleeParent, sourceCode, indentType)
              .goodChar;
        }
      }
    }

    // function body indent should be indent + indent size, unless this is a
    // FunctionDeclaration, FunctionExpression, or outer IIFE and the
    // corresponding options are enabled.
    let functionOffset = indentSize;

    if (options.outerIIFEBody !== -1 && isOuterIIFE_(calleeNode)) {
      functionOffset = options.outerIIFEBody * indentSize;
    } else if (calleeNode.type === 'FunctionExpression') {
      functionOffset = options.FunctionExpression.body * indentSize;
    } else if (calleeNode.type === 'FunctionDeclaration') {
      functionOffset = options.FunctionDeclaration.body * indentSize;
    }
    indent += functionOffset;

    // Check if the node is inside a variable.
    const parentVarNode = /** @type {!Espree.VariableDeclarator} */
        (getNodeAncestorOfType(node, 'VariableDeclarator'));

    if (parentVarNode && isNodeInVarOnTop(node, parentVarNode)) {
      indent += indentSize *
        options.VariableDeclarator[parentVarNode.parent.kind];
    }

    if (node.body.length > 0) {
      checkNodesIndent(node.body, indent);
    }

    checkLastNodeLineIndent(node, indent - functionOffset);
  }

  /**
   * Checks indent for array block content or object block content.
   * @param {(!Espree.ArrayExpression|!Espree.ObjectExpression)} node Node to
   *     examine.
   * @return {void}
   */
  function checkIndentInArrayOrObjectBlock(node) {

    if (!(node.type === 'ArrayExpression' ||
            node.type === 'ObjectExpression')) {
      throw new Error(
        `Expected an ArrayExpression or ObjectExpression, got ${node.type}`);
    }

    // Skip inline
    if (isSingleLineNode_(node, sourceCode)) {
      return;
    }

    let elements = (node.type === 'ArrayExpression') ?
      node.elements :
      node.properties;

    // Filters out empty elements example would be [ , 2] so remove first
    // element as espree considers it as null.
    elements = elements.filter(function(elem) {
      return elem !== null;
    });

    // Skip if first element is in same line with this node
    if (elements.length > 0 && elements[0].loc.start.line ===
        node.loc.start.line) {
      return;
    }

    let nodeIndent;
    let elementsIndent;
    const parentVarNode = /** @type {?Espree.VariableDeclarator} */
         (getNodeAncestorOfType(node, 'VariableDeclarator'));

    // TODO - come up with a better strategy in future
    if (isNodeFirstInLine_(node, sourceCode)) {
      const parent = node.parent;
      let effectiveParent = parent;

      if (parent.type === 'MemberExpression') {
        if (isNodeFirstInLine_(parent, sourceCode)) {
          effectiveParent = parent.parent.parent;
        } else {
          effectiveParent = parent.parent;
        }
      }
      nodeIndent = getNodeIndent_(effectiveParent, sourceCode, indentType)
          .goodChar;

      if (parentVarNode && !tokensStartOnSameLine(parentVarNode, node)) {
        if (parent.type !== 'VariableDeclarator' ||
            parentVarNode === parentVarNode.parent.declarations[0]) {
          if (parent.type === 'VariableDeclarator' &&
              parentVarNode.loc.start.line === effectiveParent.loc.start.line) {
            nodeIndent = nodeIndent +
              (indentSize *
               options.VariableDeclarator[parentVarNode.parent.kind]);
          } else if (
            parent.type === 'ObjectExpression' ||
              parent.type === 'ArrayExpression' ||
              parent.type === 'CallExpression' ||
              parent.type === 'ArrowFunctionExpression' ||
              parent.type === 'NewExpression' ||
              parent.type === 'LogicalExpression'
          ) {
            nodeIndent = nodeIndent + indentSize;
          }
        }
      } else if (!parentVarNode && !isFirstArrayElementOnSameLine_(parent) &&
                 effectiveParent.type !== 'MemberExpression' &&
                 effectiveParent.type !== 'ExpressionStatement' &&
                 effectiveParent.type !== 'AssignmentExpression' &&
                 effectiveParent.type !== 'Property') {
        nodeIndent = nodeIndent + indentSize;
      }

      elementsIndent = nodeIndent + indentSize;

      checkFirstNodeLineIndent(node, nodeIndent);
    } else {
      nodeIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
      elementsIndent = nodeIndent + indentSize;
    }

    /*
     * Checks if the node is a multiple variable declaration; if so, then
     * make sure indentation takes that into account.
     */
    if (isNodeInVarOnTop(node, parentVarNode)) {
      elementsIndent += indentSize *
        options.VariableDeclarator[parentVarNode.parent.kind];
    }

    checkNodesIndent(elements, elementsIndent);

    if (elements.length > 0) {

      // Skip last block line check if last item in same line
      if (elements[elements.length - 1].loc.end.line === node.loc.end.line) {
        return;
      }
    }

    checkLastNodeLineIndent(node, elementsIndent - indentSize);
  }

  /**
   * Checks indentation for blocks.
   * @param {!ESLint.ASTNode} node Node to check.
   * @return {void}
   */
  function blockIndentationCheck(node) {

    // Skip inline blocks
    if (isSingleLineNode_(node, sourceCode)) {
      return;
    }

    if (node.parent && (
        node.parent.type === 'FunctionExpression' ||
        node.parent.type === 'FunctionDeclaration' ||
        node.parent.type === 'ArrowFunctionExpression'
    )) {
      checkIndentInFunctionBlock(/** @type {!BodiedNode} */ (node));
      return;
    }

    let indent;
    let nodesToCheck = [];

    // For these statements we should check indent from statement beginning, not
    // from the beginning of the block.
    const statementsWithProperties = [
      'IfStatement', 'WhileStatement', 'ForStatement', 'ForInStatement',
      'ForOfStatement', 'DoWhileStatement', 'ClassDeclaration',
    ];

    if (node.parent &&
        statementsWithProperties.indexOf(node.parent.type) !== -1 &&
        isNodeBodyBlock_(node)) {
      indent = getNodeIndent_(node.parent, sourceCode, indentType).goodChar;
    } else {
      indent = getNodeIndent_(node, sourceCode, indentType).goodChar;
    }

    if (node.type === 'IfStatement' &&
        /** @type {!Espree.IfStatement} */
        (node).consequent.type !== 'BlockStatement') {
      nodesToCheck = [/** @type {!Espree.IfStatement} */(node).consequent];
    } else if (Array.isArray(node.body)) {
      nodesToCheck = node.body;
    } else {
      nodesToCheck = [node.body];
    }

    if (nodesToCheck.length > 0) {
      checkNodesIndent(nodesToCheck, indent + indentSize);
    }

    if (node.type === 'BlockStatement') {
      checkLastNodeLineIndent(node, indent);
    }
  }

  /**
   * Check indentation for variable declarations.
   * @param {!Espree.VariableDeclaration} node The node to examine.
   * @return {void}
   */
  function checkIndentInVariableDeclarations(node) {
    const elements = filterOutSameLineVars_(node);
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
   * Check and decide whether to check for indentation for blockless nodes.
   * Scenarios are for or while statements without braces around them.
   * @param {!OptionallyBodiedNode} node The node to examine.
   * @return {void}
   */
  function blockLessNodes(node) {
    if (node.body.type !== 'BlockStatement') {
      blockIndentationCheck(node);
    }
  }

  /**
   * Returns the expected indentation for the case statement.
   * @param {!ESLint.ASTNode} node The node to examine.
   * @param {number=} opt_switchIndent The indent for switch statement.
   * @return {number} The indent size.
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
      if (node.body.length > 0) {

        // Root nodes should have no indent
        checkNodesIndent(
            node.body, getNodeIndent_(node, sourceCode, indentType).goodChar);
      }
    },

    ClassBody: blockIndentationCheck,

    BlockStatement: blockIndentationCheck,

    WhileStatement: blockLessNodes,

    ForStatement: blockLessNodes,

    ForInStatement: blockLessNodes,

    ForOfStatement: blockLessNodes,

    DoWhileStatement: blockLessNodes,

    /**
     * @param {!Espree.IfStatement} node
     */
    IfStatement(node) {
      if (node.consequent.type !== 'BlockStatement' &&
          node.consequent.loc.start.line > node.loc.start.line) {
        blockIndentationCheck(node);
      }
    },

    /**
     * @param {!Espree.VariableDeclaration} node
     */
    VariableDeclaration(node) {
      if (node.declarations[node.declarations.length - 1].loc.start.line >
          node.declarations[0].loc.start.line) {
        checkIndentInVariableDeclarations(node);
      }
    },

    /**
     * @param {!Espree.ObjectExpression} node
     */
    ObjectExpression(node) {
      checkIndentInArrayOrObjectBlock(node);
    },

    /**
     * @param {!Espree.ArrayExpression} node
     */
    ArrayExpression(node) {
      checkIndentInArrayOrObjectBlock(node);
    },

    /**
     * @param {!Espree.MemberExpression} node
     */
    MemberExpression(node) {
      if (typeof options.MemberExpression === 'undefined') {
        return;
      }

      if (isSingleLineNode_(node, sourceCode)) {
        return;
      }

      // The typical layout of variable declarations and assignments
      // alter the expectation of correct indentation. Skip them.
      // TODO: Add appropriate configuration options for variable
      // declarations and assignments.
      if (getNodeAncestorOfType(node, 'VariableDeclarator')) {
        return;
      }

      if (getNodeAncestorOfType(node, 'AssignmentExpression')) {
        return;
      }

      const propertyIndent =
            getNodeIndent_(node, sourceCode, indentType).goodChar +
            indentSize * options.MemberExpression;

      const checkNodes = [node.property];

      const dot = context.getTokenBefore(node.property);

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

      // Skip inline cases
      if (isSingleLineNode_(node, sourceCode)) {
        return;
      }
      const caseIndent = expectedCaseIndent(node);

      checkNodesIndent(node.consequent, caseIndent + indentSize);
    },

    /**
     * @param {!Espree.FunctionDeclaration} node
     */
    FunctionDeclaration(node) {
      if (isSingleLineNode_(node, sourceCode)) {
        return;
      }
      if (options.FunctionDeclaration.parameters === 'first' &&
          node.params.length) {
        checkNodesIndent(
          node.params.slice(1), node.params[0].loc.start.column);
      } else if (options.FunctionDeclaration.parameters !== -1) {
        checkNodesIndent(
          node.params, indentSize * options.FunctionDeclaration.parameters);
      }
    },

    /**
     * @param {!Espree.FunctionExpression} node
     */
    FunctionExpression(node) {
      if (isSingleLineNode_(node, sourceCode)) {
        return;
      }
      if (options.FunctionExpression.parameters == 'first' &&
          node.params.length) {
        checkNodesIndent(
          node.params.slice(1), node.params[0].loc.start.column);
      } else if (options.FunctionExpression.parameters !== -1) {
        checkNodesIndent(
          node.params, indentSize * options.FunctionExpression.parameters);
      }
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
