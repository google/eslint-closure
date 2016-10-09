/**
 * @fileoverview An extern for the Espree JS Parser at
 * https://github.com/eslint/espree
 * @externs
 */


/** @const */
const Espree = {};

/**
 * The source location information of a node.
 * @record
 */
Espree.SourceLocation = function() {};

/** @type {(string|null)} */
Espree.SourceLocation.prototype.source;

/** @type {!Espree.Position} */
Espree.SourceLocation.prototype.start;

/** @type {!Espree.Position} */
Espree.SourceLocation.prototype.end;

/**
 * Each Position object consists of a line number (1-indexed) and a column
 * number (0-indexed).
 * @record
 */
Espree.Position = function() {};

/** @type {number} */
Espree.Position.prototype.line;

/** @type {number} */
Espree.Position.prototype.column;

/**
 * Represents a Node for Espree.
 * @record
 */
Espree.Node = function() {};

/** @type {!Espree.NodeType} */
Espree.Node.prototype.type;

/** @type {!Array<number>} */
Espree.Node.prototype.range;

/** @type {!Espree.SourceLocation} */
Espree.Node.prototype.loc;

/** @type {number} */
Espree.Node.prototype.start;

/** @type {number} */
Espree.Node.prototype.end;

/**
 * A JavaScript token such as a keyword or comma.
 * @record
 * @extends {Espree.Node}
 */
Espree.Token = function() {};

/** @type {string} */
Espree.Token.prototype.value;

/**
 * A JavaScript token such as a keyword or comma.  This needs to be separate
 * from token, because otherwise we get a cycle.
 * @record
 */
Espree.CommentToken = function() {};

/** @type {!Espree.NodeType} */
Espree.CommentToken.prototype.type;

/** @type {!Array<number>} */
Espree.CommentToken.prototype.range;

/** @type {!Espree.SourceLocation} */
Espree.CommentToken.prototype.loc;

/** @type {number} */
Espree.CommentToken.prototype.start;

/** @type {number} */
Espree.CommentToken.prototype.end;

/** @type {string} */
Espree.CommentToken.prototype.value;
/**
 * Token types are re-used from Esprima.
 * @enum {string}
 * @see https://github.com/eslint/espree/blob/master/lib/token-translator.js
 * @see https://github.com/jquery/esprima/blob/master/src/token.ts
 */
Espree.TokenType = {
  BOOLEAN: 'Boolean',
  EOF: '<end>',
  IDENTIFIER: 'Identifier',
  KEYWORD: 'Keyword',
  NULL: 'Null',
  NUMERIC: 'Numeric',
  PUNCTUATOR: 'Punctuator',
  STRING: 'String',
  REGULAR_EXPRESSION: 'RegularExpression',
  TEMPLATE: 'Template',
  JSX_IDENTIFIER: 'JSXIdentifier',
  JSX_TEXT: 'JSXText',
};


/**
 * The main AST Node.  This really belongs to ESLint, but all the ASTNodes below
 * need these properties and it's easier to just define it here.
 * @record
 * @extends {Espree.Node}
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
Espree.ASTNode = function() {};

/**
 * Provided by ESLint.
 * @type {!Espree.ASTNode}
 */
Espree.ASTNode.prototype.parent;

/** @type {(!Array<!Espree.CommentToken>|undefined)} */
Espree.ASTNode.prototype.leadingComments;

/** @type {(!Array<!Espree.CommentToken>|undefined)} */
Espree.ASTNode.prototype.trailingComments;
/**
 * @enum {string}
 * @see https://github.com/eslint/espree/blob/master/lib/visitor-keys.js
 */
Espree.NodeType = {
  ARRAY_EXPRESSION: 'ArrayExpression',
  ARRAY_PATTERN: 'ArrayPattern',
  ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
  ASSIGNMENT_EXPRESSION: 'AssignmentExpression',
  ASSIGNMENT_PATTERN: 'AssignmentPattern',
  BINARY_EXPRESSION: 'BinaryExpression',
  BLOCK_COMMENT: 'BlockComment',
  BLOCK_STATEMENT: 'BlockStatement',
  BREAK_STATEMENT: 'BreakStatement',
  CALL_EXPRESSION: 'CallExpression',
  CATCH_CLAUSE: 'CatchClause',
  CLASS_BODY: 'ClassBody',
  CLASS_DECLARATION: 'ClassDeclaration',
  CLASS_EXPRESSION: 'ClassExpression',
  CONDITIONAL_EXPRESSION: 'ConditionalExpression',
  CONTINUE_STATEMENT: 'ContinueStatement',
  DEBUGGER_STATEMENT: 'DebuggerStatement',
  DO_WHILE_STATEMENT: 'DoWhileStatement',
  EMPTY_STATEMENT: 'EmptyStatement',
  EXPERIMENTAL_REST_PROPERTY: 'ExperimentalRestProperty',
  EXPERIMENTAL_SPREAD_PROPERTY: 'ExperimentalSpreadProperty',
  EXPORT_ALL_DECLARATION: 'ExportAllDeclaration',
  EXPORT_DEFAULT_DECLARATION: 'ExportDefaultDeclaration',
  EXPORT_NAMED_DECLARATION: 'ExportNamedDeclaration',
  EXPORT_SPECIFIER: 'ExportSpecifier',
  EXPRESSION_STATEMENT: 'ExpressionStatement',
  FOR_IN_STATEMENT: 'ForInStatement',
  FOR_OF_STATEMENT: 'ForOfStatement',
  FOR_STATEMENT: 'ForStatement',
  FUNCTION_DECLARATION: 'FunctionDeclaration',
  FUNCTION_EXPRESSION: 'FunctionExpression',
  IDENTIFIER: 'Identifier',
  IF_STATEMENT: 'IfStatement',
  IMPORT_DECLARATION: 'ImportDeclaration',
  IMPORT_DEFAULT_SPECIFIER: 'ImportDefaultSpecifier',
  IMPORT_NAMESPACE_SPECIFIER: 'ImportNamespaceSpecifier',
  IMPORT_SPECIFIER: 'ImportSpecifier',
  JSX_ATTRIBUTE: 'JSXAttribute',
  JSX_CLOSING_ELEMENT: 'JSXClosingElement',
  JSX_ELEMENT: 'JSXElement',
  JSX_EMPTY_EXPRESSION: 'JSXEmptyExpression',
  JSX_EXPRESSION_CONTAINER: 'JSXExpressionContainer',
  JSX_IDENTIFIER: 'JSXIdentifier',
  JSX_MEMBER_EXPRESSION: 'JSXMemberExpression',
  JSX_NAMESPACED_NAME: 'JSXNamespacedName',
  JSX_OPENING_ELEMENT: 'JSXOpeningElement',
  JSX_SPREAD_ATTRIBUTE: 'JSXSpreadAttribute',
  JSX_TEXT: 'JSXText',
  LABELED_STATEMENT: 'LabeledStatement',
  LINE_COMMENT: 'LineComment',
  LITERAL: 'Literal',
  LOGICAL_EXPRESSION: 'LogicalExpression',
  MEMBER_EXPRESSION: 'MemberExpression',
  META_PROPERTY: 'MetaProperty',
  METHOD_DEFINITION: 'MethodDefinition',
  NEW_EXPRESSION: 'NewExpression',
  OBJECT_EXPRESSION: 'ObjectExpression',
  OBJECT_PATTERN: 'ObjectPattern',
  PROGRAM: 'Program',
  PROPERTY: 'Property',
  REST_ELEMENT: 'RestElement',
  RETURN_STATEMENT: 'ReturnStatement',
  SEQUENCE_EXPRESSION: 'SequenceExpression',
  SPREAD_ELEMENT: 'SpreadElement',
  SUPER: 'Super',
  SWITCH_CASE: 'SwitchCase',
  SWITCH_STATEMENT: 'SwitchStatement',
  TAGGED_TEMPLATE_EXPRESSION: 'TaggedTemplateExpression',
  TEMPLATE_ELEMENT: 'TemplateElement',
  TEMPLATE_LITERAL: 'TemplateLiteral',
  THIS_EXPRESSION: 'ThisExpression',
  THROW_STATEMENT: 'ThrowStatement',
  TRY_STATEMENT: 'TryStatement',
  UNARY_EXPRESSION: 'UnaryExpression',
  UPDATE_EXPRESSION: 'UpdateExpression',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  VARIABLE_DECLARATOR: 'VariableDeclarator',
  WHILE_STATEMENT: 'WhileStatement',
  WITH_STATEMENT: 'WithStatement',
  YIELD_EXPRESSION: 'YieldExpression',
};

/** @typedef {!Espree.Expression | !Espree.SpreadElement} */
Espree.ArgumentListElement;

/** @typedef {!Espree.Expression | !Espree.SpreadElement} */
Espree.ArrayExpressionElement;

/** @typedef {(
 *      !Espree.AssignmentPattern |
 *      !Espree.BindingIdentifier |
 *      !Espree.BindingPattern |
 *      !Espree.RestElement
 *  )}
 */
Espree.ArrayPatternElement;

/** @typedef {!Espree.ArrayPattern | !Espree.ObjectPattern} */
Espree.BindingPattern;

/** @typedef {!Espree.Identifier} */
Espree.BindingIdentifier;

/** @typedef {(
 *      !Espree.ClassDeclaration |
 *      !Espree.ExportDeclaration |
 *      !Espree.FunctionDeclaration |
 *      !Espree.ImportDeclaration |
 *      !Espree.VariableDeclaration
 *  )}
 */
Espree.Declaration;

/** @typedef {(
 *      !Espree.ExportAllDeclaration |
 *      !Espree.ExportDefaultDeclaration |
 *      !Espree.ExportNamedDeclaration
 *  )}
 */
Espree.ExportDeclaration;

/**
 * @typedef {(
 *      !Espree.ArrayExpression |
 *      !Espree.ArrowFunctionExpression |
 *      !Espree.AssignmentExpression |
 *      !Espree.BinaryExpression |
 *      !Espree.CallExpression |
 *      !Espree.ClassExpression |
 *      !Espree.ComputedMemberExpression |
 *      !Espree.ConditionalExpression |
 *      !Espree.Identifier |
 *      !Espree.FunctionExpression |
 *      !Espree.Literal |
 *      !Espree.MemberExpression |
 *      !Espree.NewExpression |
 *      !Espree.ObjectExpression |
 *      !Espree.RegexLiteral |
 *      !Espree.SequenceExpression |
 *      !Espree.StaticMemberExpression |
 *      !Espree.TaggedTemplateExpression |
 *      !Espree.ThisExpression |
 *      !Espree.UnaryExpression |
 *      !Espree.UpdateExpression |
 *      !Espree.YieldExpression
 *  )}
 */
Espree.Expression;

/** @typedef {(
 *      !Espree.AssignmentPattern |
 *      !Espree.BindingIdentifier |
 *      !Espree.BindingPattern
 *  )}
 */
Espree.FunctionParameter;

/**
 * All function types.
 * @typedef {(
 *      !Espree.ArrowFunctionExpression|
 *      !Espree.FunctionDeclaration|
 *      !Espree.FunctionExpression
 * )}
 */
Espree.AnyFunctionNode;

/** @typedef {(
 *      !Espree.ImportDefaultSpecifier |
 *      !Espree.ImportNamespaceSpecifier |
 *      !Espree.ImportSpecifier
 *  )}
 */
Espree.ImportDeclarationSpecifier;

/** @typedef {(
 *      !Espree.BreakStatement |
 *      !Espree.ContinueStatement |
 *      !Espree.DebuggerStatement |
 *      !Espree.DoWhileStatement |
 *      !Espree.EmptyStatement |
 *      !Espree.ExpressionStatement |
 *      !Espree.Directive |
 *      !Espree.ForStatement |
 *      !Espree.ForInStatement |
 *      !Espree.ForOfStatement |
 *      !Espree.FunctionDeclaration |
 *      !Espree.IfStatement |
 *      !Espree.ReturnStatement |
 *      !Espree.SwitchStatement |
 *      !Espree.ThrowStatement |
 *      !Espree.TryStatement |
 *      !Espree.VariableDeclaration |
 *      !Espree.WhileStatement |
 *      !Espree.WithStatement
 *  )}
 */
Espree.Statement;


/**
 * Nodes that have a `body` field that is either a `BlockStatement` or a single
 * node.  For example:
 *
 *     `while (condition) foo();`   // body is a CallExpression
 *     `while (condition) {foo();}` // body is a BlockStatement
 *
 * @typedef {(
 *     !Espree.DoWhileStatement|
 *     !Espree.ForStatement|
 *     !Espree.ForInStatement|
 *     !Espree.ForOfStatement|
 *     !Espree.WhileStatement|
 *     !Espree.WithStatement
 * )}
 */
Espree.OptionallyBodiedNode;

/** @typedef {!Espree.Identifier | !Espree.Literal} */
Espree.PropertyKey;

/** @typedef {(
 *      !Espree.AssignmentPattern |
 *      !Espree.BindingIdentifier |
 *      !Espree.BindingPattern |
 *      !Espree.FunctionExpression
 *  )}
 */
Espree.PropertyValue;

/** @typedef {!Espree.Declaration | !Espree.Statement} */
Espree.StatementListItem;


/** @record @extends {Espree.ASTNode} */
Espree.ArrayExpression = function() {};

/** @type {!Array<!Espree.ArrayExpressionElement>} */
Espree.ArrayExpression.prototype.elements;

/** @record @extends {Espree.ASTNode} */
Espree.ArrayPattern = function() {};

/** @type {!Array<!Espree.ArrayPatternElement>} */
Espree.ArrayPattern.prototype.elements;


/** @record @extends {Espree.ASTNode} */
Espree.ArrowFunctionExpression = function() {};

/** @type {!Espree.Identifier} */
Espree.ArrowFunctionExpression.prototype.id;

/** @type {!Array<!Espree.FunctionParameter>} */
Espree.ArrowFunctionExpression.prototype.params;

/** @type {(!Espree.BlockStatement | !Espree.Expression)} */
Espree.ArrowFunctionExpression.prototype.body;

/** @type {boolean} */
Espree.ArrowFunctionExpression.prototype.generator;

/** @type {boolean} */
Espree.ArrowFunctionExpression.prototype.expression;


/** @record @extends {Espree.ASTNode} */
Espree.AssignmentExpression = function() {};

/** @type {string} */
Espree.AssignmentExpression.prototype.operator;

/** @type {!Espree.Expression} */
Espree.AssignmentExpression.prototype.left;

/** @type {!Espree.Expression} */
Espree.AssignmentExpression.prototype.right;


/** @record @extends {Espree.ASTNode} */
Espree.AssignmentPattern = function() {};

/** @type {(!Espree.BindingIdentifier | !Espree.BindingPattern)} */
Espree.AssignmentPattern.prototype.left;

/** @type {!Espree.Expression} */
Espree.AssignmentPattern.prototype.right;


/** @record @extends {Espree.ASTNode} */
Espree.BinaryExpression = function() {};

/** @type {string} */
Espree.BinaryExpression.prototype.operator;

/** @type {!Espree.Expression} */
Espree.BinaryExpression.prototype.left;

/** @type {!Espree.Expression} */
Espree.BinaryExpression.prototype.right;


/** @record @extends {Espree.ASTNode} */
Espree.BlockStatement = function() {};

/** @type {!Array<!Espree.Statement>} */
Espree.BlockStatement.prototype.body;


/** @record @extends {Espree.CommentToken} */
Espree.BlockComment = function() {};


/** @record @extends {Espree.ASTNode} */
Espree.BreakStatement = function() {};

/** @type {!Espree.Identifier} */
Espree.BreakStatement.prototype.label;


/** @record @extends {Espree.ASTNode} */
Espree.CallExpression = function() {};

/** @type {!Espree.Expression} */
Espree.CallExpression.prototype.callee;

/** @type {!Array<!Espree.ArgumentListElement>} */
Espree.CallExpression.prototype.arguments;


/** @record @extends {Espree.ASTNode} */
Espree.CatchClause = function() {};

/** @type {(!Espree.BindingIdentifier | !Espree.BindingPattern)} */
Espree.CatchClause.prototype.param;

/** @type {!Espree.BlockStatement} */
Espree.CatchClause.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.ClassBody = function() {};

/** @type {!Array<!Espree.Property>} */
Espree.ClassBody.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.ClassDeclaration = function() {};

/** @type {!Espree.Identifier} */
Espree.ClassDeclaration.prototype.id;

/** @type {!Espree.Identifier} */
Espree.ClassDeclaration.prototype.superClass;

/** @type {!Espree.ClassBody} */
Espree.ClassDeclaration.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.ClassExpression = function() {};

/** @type {!Espree.Identifier} */
Espree.ClassExpression.prototype.id;

/** @type {!Espree.Identifier} */
Espree.ClassExpression.prototype.superClass;

/** @type {!Espree.ClassBody} */
Espree.ClassExpression.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.ComputedMemberExpression = function() {};

/** @type {boolean} */
Espree.ComputedMemberExpression.prototype.computed;

/** @type {!Espree.Expression} */
Espree.ComputedMemberExpression.prototype.object;

/** @type {!Espree.Expression} */
Espree.ComputedMemberExpression.prototype.property;


/** @record @extends {Espree.ASTNode} */
Espree.ConditionalExpression = function() {};

/** @type {!Espree.Expression} */
Espree.ConditionalExpression.prototype.test;

/** @type {!Espree.Expression} */
Espree.ConditionalExpression.prototype.consequent;

/** @type {!Espree.Expression} */
Espree.ConditionalExpression.prototype.alternate;


/** @record @extends {Espree.ASTNode} */
Espree.ContinueStatement = function() {};
/** @type {!Espree.Identifier} */
Espree.ContinueStatement.prototype.label;


/** @record @extends {Espree.ASTNode} */
Espree.DebuggerStatement = function() {};


/** @record @extends {Espree.ASTNode} */
Espree.Directive = function() {};

/** @type {!Espree.Expression} */
Espree.Directive.prototype.expression;

/** @type {string} */
Espree.Directive.prototype.directive;


/** @record @extends {Espree.ASTNode} */
Espree.DoWhileStatement = function() {};

/** @type {!Espree.Statement} */
Espree.DoWhileStatement.prototype.body;

/** @type {!Espree.Expression} */
Espree.DoWhileStatement.prototype.test;


/** @record @extends {Espree.ASTNode} */
Espree.EmptyStatement = function() {};


/** @record @extends {Espree.ASTNode} */
Espree.ExportAllDeclaration = function() {};

/** @type {!Espree.Literal} */
Espree.ExportAllDeclaration.prototype.source;


/** @record @extends {Espree.ASTNode} */
Espree.ExportDefaultDeclaration = function() {};

/** @type {(
 *      !Espree.BindingIdentifier |
 *      !Espree.BindingPattern |
 *      !Espree.ClassDeclaration |
 *      !Espree.Expression |
 *      !Espree.FunctionDeclaration
 * )}
 */
Espree.ExportDefaultDeclaration.prototype.declaration;


/** @record @extends {Espree.ASTNode} */
Espree.ExportNamedDeclaration = function() {};

/** @type {(
 *      !Espree.ClassDeclaration |
 *      !Function |
 *      !Espree.VariableDeclaration
 *  )}
 */
Espree.ExportNamedDeclaration.prototype.declaration;

/** @type {!Array<!Espree.ExportSpecifier>} */
Espree.ExportNamedDeclaration.prototype.specifiers;

/** @type {!Espree.Literal} */
Espree.ExportNamedDeclaration.prototype.source;


/** @record @extends {Espree.ASTNode} */
Espree.ExportSpecifier = function() {};

/** @type {!Espree.Identifier} */
Espree.ExportSpecifier.prototype.exported;

/** @type {!Espree.Identifier} */
Espree.ExportSpecifier.prototype.local;


/** @record @extends {Espree.ASTNode} */
Espree.ExpressionStatement = function() {};

/** @type {!Espree.Expression} */
Espree.ExpressionStatement.prototype.expression;


/** @record @extends {Espree.ASTNode} */
Espree.ForInStatement = function() {};

/** @type {!Espree.Expression} */
Espree.ForInStatement.prototype.left;

/** @type {!Espree.Expression} */
Espree.ForInStatement.prototype.right;

/** @type {!Espree.Statement} */
Espree.ForInStatement.prototype.body;

/** @type {boolean} */
Espree.ForInStatement.prototype.each;


/** @record @extends {Espree.ASTNode} */
Espree.ForOfStatement = function() {};

/** @type {!Espree.Expression} */
Espree.ForOfStatement.prototype.left;

/** @type {!Espree.Expression} */
Espree.ForOfStatement.prototype.right;

/** @type {!Espree.Statement} */
Espree.ForOfStatement.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.ForStatement = function() {};

/** @type {!Espree.Expression} */
Espree.ForStatement.prototype.init;

/** @type {!Espree.Expression} */
Espree.ForStatement.prototype.test;

/** @type {!Espree.Expression} */
Espree.ForStatement.prototype.update;

/** @type {!Espree.Statement} */
Espree.ForStatement.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.FunctionDeclaration = function() {};

/** @type {!Espree.Identifier} */
Espree.FunctionDeclaration.prototype.id;

/** @type {!Array<!Espree.FunctionParameter>} */
Espree.FunctionDeclaration.prototype.params;

/** @type {!Espree.BlockStatement} */
Espree.FunctionDeclaration.prototype.body;

/** @type {boolean} */
Espree.FunctionDeclaration.prototype.generator;

/** @type {boolean} */
Espree.FunctionDeclaration.prototype.expression;


/** @record @extends {Espree.ASTNode} */
Espree.FunctionExpression = function() {};

/** @type {!Espree.Identifier} */
Espree.FunctionExpression.prototype.id;

/** @type {!Array<!Espree.FunctionParameter>} */
Espree.FunctionExpression.prototype.params;

/** @type {!Espree.BlockStatement} */
Espree.FunctionExpression.prototype.body;

/** @type {boolean} */
Espree.FunctionExpression.prototype.generator;

/** @type {boolean} */
Espree.FunctionExpression.prototype.expression;


/** @record @extends {Espree.ASTNode} */
Espree.Identifier = function() {};

/** @type {string} */
Espree.Identifier.prototype.name;


/** @record @extends {Espree.ASTNode} */
Espree.IfStatement = function() {};

/** @type {!Espree.Expression} */
Espree.IfStatement.prototype.test;

/** @type {!Espree.Statement} */
Espree.IfStatement.prototype.consequent;

/** @type {?Espree.Statement} */
Espree.IfStatement.prototype.alternate;


/** @record @extends {Espree.ASTNode} */
Espree.ImportDeclaration = function() {};

/** @type {!Array<!Espree.ImportDeclarationSpecifier>} */
Espree.ImportDeclaration.prototype.specifiers;

/** @type {!Espree.Literal} */
Espree.ImportDeclaration.prototype.source;


/** @record @extends {Espree.ASTNode} */
Espree.ImportDefaultSpecifier = function() {};

/** @type {!Espree.Identifier} */
Espree.ImportDefaultSpecifier.prototype.local;


/** @record @extends {Espree.ASTNode} */
Espree.ImportNamespaceSpecifier = function() {};

/** @type {!Espree.Identifier} */
Espree.ImportNamespaceSpecifier.prototype.local;


/** @record @extends {Espree.ASTNode} */
Espree.ImportSpecifier = function() {};

/** @type {!Espree.Identifier} */
Espree.ImportSpecifier.prototype.local;

/** @type {!Espree.Identifier} */
Espree.ImportSpecifier.prototype.imported;


/** @record @extends {Espree.ASTNode} */
Espree.LabeledStatement = function() {};

/** @type {!Espree.Identifier} */
Espree.LabeledStatement.prototype.label;

/** @type {!Espree.Statement} */
Espree.LabeledStatement.prototype.body;


/** @record @extends {Espree.CommentToken} */
Espree.LineComment = function() {};

/** @record @extends {Espree.ASTNode} */
Espree.Literal = function() {};

/** @type {(boolean | number | string)} */
Espree.Literal.prototype.value;

/** @type {string} */
Espree.Literal.prototype.raw;

/** @record @extends {Espree.ASTNode} */
Espree.MemberExpression = function() {};

/** @type {boolean} */
Espree.MemberExpression.prototype.computed;

/** @type {!Espree.Expression} */
Espree.MemberExpression.prototype.object;

/** @type {!Espree.Expression} */
Espree.MemberExpression.prototype.property;


/** @record @extends {Espree.ASTNode} */
Espree.MetaProperty = function() {};

/** @type {!Espree.Identifier} */
Espree.MetaProperty.prototype.meta;

/** @type {!Espree.Identifier} */
Espree.MetaProperty.prototype.property;


/** @record @extends {Espree.ASTNode} */
Espree.MethodDefinition = function() {};

/** @type {!Espree.Expression} */
Espree.MethodDefinition.prototype.key;

/** @type {boolean} */
Espree.MethodDefinition.prototype.computed;

/** @type {!Espree.FunctionExpression} */
Espree.MethodDefinition.prototype.value;

/** @type {string} */
Espree.MethodDefinition.prototype.kind;

/** @type {boolean} */
Espree.MethodDefinition.prototype.static;


/** @record @extends {Espree.ASTNode} */
Espree.NewExpression = function() {};

/** @type {!Espree.Expression} */
Espree.NewExpression.prototype.callee;

/** @type {!Array<!Espree.ArgumentListElement>} */
Espree.NewExpression.prototype.arguments;


/** @record @extends {Espree.ASTNode} */
Espree.ObjectExpression = function() {};

/** @type {!Array<!Espree.Property>} */
Espree.ObjectExpression.prototype.properties;


/** @record @extends {Espree.ASTNode} */
Espree.ObjectPattern = function() {};

/** @type {!Array<!Espree.Property>} */
Espree.ObjectPattern.prototype.properties;


/** @record @extends {Espree.ASTNode} */
Espree.Program = function() {};

/** @type {!Array<!Espree.StatementListItem>} */
Espree.Program.prototype.body;

/** @type {string} */
Espree.Program.prototype.sourceType;


/** @record @extends {Espree.ASTNode} */
Espree.Property = function() {};

/** @type {!Espree.PropertyKey} */
Espree.Property.prototype.key;

/** @type {boolean} */
Espree.Property.prototype.computed;

/** @type {!Espree.PropertyValue} */
Espree.Property.prototype.value;

/** @type {string} */
Espree.Property.prototype.kind;

/** @type {boolean} */
Espree.Property.prototype.method;

/** @type {boolean} */
Espree.Property.prototype.shorthand;

/** @record @extends {Espree.ASTNode} */
Espree.RegexLiteral = function() {};

/** @type {string} */
Espree.RegexLiteral.prototype.value;

/** @type {string} */
Espree.RegexLiteral.prototype.raw;

/** @type {*} */
Espree.RegexLiteral.prototype.regex;


/** @record @extends {Espree.ASTNode} */
Espree.RestElement = function() {};

/** @type {!Espree.Identifier} */
Espree.RestElement.prototype.argument;


/** @record @extends {Espree.ASTNode} */
Espree.ReturnStatement = function() {};

/** @type {!Espree.Expression} */
Espree.ReturnStatement.prototype.argument;


/** @record @extends {Espree.ASTNode} */
Espree.SequenceExpression = function() {};

/** @type {!Array<!Espree.Expression>} */
Espree.SequenceExpression.prototype.expressions;


/** @record @extends {Espree.ASTNode} */
Espree.SpreadElement = function() {};

/** @type {!Espree.Expression} */
Espree.SpreadElement.prototype.argument;


/** @record @extends {Espree.ASTNode} */
Espree.StaticMemberExpression = function() {};

/** @type {boolean} */
Espree.StaticMemberExpression.prototype.computed;

/** @type {!Espree.Expression} */
Espree.StaticMemberExpression.prototype.object;

/** @type {!Espree.Expression} */
Espree.StaticMemberExpression.prototype.property;


/** @record @extends {Espree.ASTNode} */
Espree.Super = function() {};


/** @record @extends {Espree.ASTNode} */
Espree.SwitchCase = function() {};

/** @type {!Espree.Expression} */
Espree.SwitchCase.prototype.test;

/** @type {!Array<!Espree.Statement>} */
Espree.SwitchCase.prototype.consequent;


/** @record @extends {Espree.ASTNode} */
Espree.SwitchStatement = function() {};

/** @type {!Espree.Expression} */
Espree.SwitchStatement.prototype.discriminant;

/** @type {!Array<!Espree.SwitchCase>} */
Espree.SwitchStatement.prototype.cases;


/** @record @extends {Espree.ASTNode} */
Espree.TaggedTemplateExpression = function() {};

/** @type {!Espree.Expression} */
Espree.TaggedTemplateExpression.prototype.tag;

/** @type {!Espree.TemplateLiteral} */
Espree.TaggedTemplateExpression.prototype.quasi;


/** @record @extends {Espree.ASTNode} */
Espree.TemplateElement = function() {};

/** @type {{cooked: string, raw: string}} */
Espree.TemplateElement.prototype.value;

/** @type {boolean} */
Espree.TemplateElement.prototype.tail;


/** @record @extends {Espree.ASTNode} */
Espree.TemplateLiteral = function() {};

/** @type {!Array<!Espree.TemplateElement>} */
Espree.TemplateLiteral.prototype.quasis;

/** @type {!Array<!Espree.Expression>} */
Espree.TemplateLiteral.prototype.expressions;


/** @record @extends {Espree.ASTNode} */
Espree.ThisExpression = function() {};


/** @record @extends {Espree.ASTNode} */
Espree.ThrowStatement = function() {};

/** @type {!Espree.Expression} */
Espree.ThrowStatement.prototype.argument;


/** @record @extends {Espree.ASTNode} */
Espree.TryStatement = function() {};

/** @type {!Espree.BlockStatement} */
Espree.TryStatement.prototype.block;

/** @type {!Espree.CatchClause} */
Espree.TryStatement.prototype.handler;

/** @type {!Espree.BlockStatement} */
Espree.TryStatement.prototype.finalizer;


/** @record @extends {Espree.ASTNode} */
Espree.UnaryExpression = function() {};

/** @type {string} */
Espree.UnaryExpression.prototype.operator;

/** @type {!Espree.Expression} */
Espree.UnaryExpression.prototype.argument;

/** @type {boolean} */
Espree.UnaryExpression.prototype.prefix;


/** @record @extends {Espree.ASTNode} */
Espree.UpdateExpression = function() {};

/** @type {string} */
Espree.UpdateExpression.prototype.operator;

/** @type {!Espree.Expression} */
Espree.UpdateExpression.prototype.argument;

/** @type {boolean} */
Espree.UpdateExpression.prototype.prefix;


/** @record @extends {Espree.ASTNode} */
Espree.VariableDeclaration = function() {};

/** @type {!Array<!Espree.VariableDeclarator>} */
Espree.VariableDeclaration.prototype.declarations;

/** @type {string} */
Espree.VariableDeclaration.prototype.kind;


/** @record @extends {Espree.ASTNode} */
Espree.VariableDeclarator = function() {};

/** @type {(!Espree.BindingIdentifier | !Espree.BindingPattern)} */
Espree.VariableDeclarator.prototype.id;

/** @type {!Espree.Expression} */
Espree.VariableDeclarator.prototype.init;

/** @type {!Espree.VariableDeclaration} */
Espree.VariableDeclarator.prototype.parent;

/** @record @extends {Espree.ASTNode} */
Espree.WhileStatement = function() {};

/** @type {!Espree.Expression} */
Espree.WhileStatement.prototype.test;

/** @type {!Espree.Statement} */
Espree.WhileStatement.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.WithStatement = function() {};

/** @type {!Espree.Expression} */
Espree.WithStatement.prototype.object;

/** @type {!Espree.Statement} */
Espree.WithStatement.prototype.body;


/** @record @extends {Espree.ASTNode} */
Espree.YieldExpression = function() {};

/** @type {!Espree.Expression} */
Espree.YieldExpression.prototype.argument;

/** @type {boolean} */
Espree.YieldExpression.prototype.delegate;
