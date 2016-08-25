/** @fileoverview An extern for the ESTree spec at
 * https://github.com/estree/estree
 * @externs
 */


const ESTree = {};

/**
 * The main AST Node.
 * @record
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
ESTree.ASTNode = function() {};

/** @type {!ESTree.Node} */
ESTree.ASTNode.prototype.type;

// This is technically nullable by the spec, but we trust Espree to return an
// object to avoid tedious nullability checking everywhere.
/** @type {!ESTree.SourceLocation} */
ESTree.ASTNode.prototype.loc;

/**
 * The source location information of a node.
 * @record
 */
ESTree.SourceLocation = function() {};

/** @type {(string|null)} */
ESTree.SourceLocation.prototype.source;

/** @type {!ESTree.Position} */
ESTree.SourceLocation.prototype.start;

/** @type {!ESTree.Position} */
ESTree.SourceLocation.prototype.end;

/**
 * Each Position object consists of a line number (1-indexed) and a column
 * number (0-indexed).
 * @record
 */
ESTree.Position = function() {};

/** @type {number} */
ESTree.Position.prototype.line;

/** @type {number} */
ESTree.Position.prototype.column;


/**
 * An identifier. Note that an identifier may be an expression or a
 * destructuring pattern.
 *
 * @record
 * @extends {ESTree.ASTNode}
 */
ESTree.Identifier = function() {};

/** @type {string} */
ESTree.Identifier.prototype.name;


/**
 * @enum {string}
 */
ESTree.Node = {
  NODE: 'Node',
  IDENTIFIER: 'Identifier',
  LITERAL: 'Literal',
  REG_EXP_LITERAL: 'RegExpLiteral',
  PROGRAM: 'Program',
  FUNCTION: 'Function',
  STATEMENT: 'Statement',
  EXPRESSION_STATEMENT: 'ExpressionStatement',
  BLOCK_STATEMENT: 'BlockStatement',
  EMPTY_STATEMENT: 'EmptyStatement',
  DEBUGGER_STATEMENT: 'DebuggerStatement',
  WITH_STATEMENT: 'WithStatement',
  RETURN_STATEMENT: 'ReturnStatement',
  LABELED_STATEMENT: 'LabeledStatement',
  BREAK_STATEMENT: 'BreakStatement',
  CONTINUE_STATEMENT: 'ContinueStatement',
  IF_STATEMENT: 'IfStatement',
  SWITCH_STATEMENT: 'SwitchStatement',
  SWITCH_CASE: 'SwitchCase',
  THROW_STATEMENT: 'ThrowStatement',
  TRY_STATEMENT: 'TryStatement',
  CATCH_CLAUSE: 'CatchClause',
  WHILE_STATEMENT: 'WhileStatement',
  DO_WHILE_STATEMENT: 'DoWhileStatement',
  FOR_STATEMENT: 'ForStatement',
  FOR_IN_STATEMENT: 'ForInStatement',
  DECLARATION: 'Declaration',
  FUNCTION_DECLARATION: 'FunctionDeclaration',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  VARIABLE_DECLARATOR: 'VariableDeclarator',
  EXPRESSION: 'Expression',
  THIS_EXPRESSION: 'ThisExpression',
  ARRAY_EXPRESSION: 'ArrayExpression',
  OBJECT_EXPRESSION: 'ObjectExpression',
  PROPERTY: 'Property',
  FUNCTION_EXPRESSION: 'FunctionExpression',
  UNARY_EXPRESSION: 'UnaryExpression',
  UPDATE_EXPRESSION: 'UpdateExpression',
  BINARY_EXPRESSION: 'BinaryExpression',
  ASSIGNMENT_EXPRESSION: 'AssignmentExpression',
  LOGICAL_EXPRESSION: 'LogicalExpression',
  MEMBER_EXPRESSION: 'MemberExpression',
  CONDITIONAL_EXPRESSION: 'ConditionalExpression',
  CALL_EXPRESSION: 'CallExpression',
  NEW_EXPRESSION: 'NewExpression',
  SEQUENCE_EXPRESSION: 'SequenceExpression',
  PATTERN: 'Pattern',
};
