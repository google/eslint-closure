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
 * @record
 */
Espree.Token = function() {}

/** @type {Espree.TokenType} */
Espree.Token.prototype.type;

/** @type {string} */
Espree.Token.prototype.value;

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
 * The main AST Node.
 * @record
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
Espree.ASTNode = function() {};

/** @type {!Espree.Node} */
Espree.ASTNode.prototype.type;

// This is technically nullable by the spec, but we trust Espree to return an
// object to avoid tedious nullability checking everywhere.
/** @type {!Espree.SourceLocation} */
Espree.ASTNode.prototype.loc;

/**
 * An identifier. Note that an identifier may be an expression or a
 * destructuring pattern.
 *
 * @record
 * @extends {Espree.ASTNode}
 */
Espree.Identifier = function() {};

/** @type {string} */
Espree.Identifier.prototype.name;


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

/** @typedef {Expression | SpreadElement;} */
Espree.ArgumentListElement;

/** @typedef {Expression | SpreadElement;} */
Espree.ArrayExpressionElement;

/** @typedef {AssignmentPattern | BindingIdentifier | BindingPattern | RestElement;} */
Espree.ArrayPatternElement;

/** @typedef {ArrayPattern | ObjectPattern;} */
Espree.BindingPattern;

/** @typedef {Identifier;} */
Espree.BindingIdentifier;

/** @typedef {ClassDeclaration | ExportDeclaration | FunctionDeclaration | ImportDeclaration | VariableDeclaration;} */
Espree.Declaration;

/** @typedef {ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration;} */
Espree.ExportDeclaration;

/** @typedef {ArrayExpression | ArrowFunctionExpression | AssignmentExpression | BinaryExpression | CallExpression | ClassExpression | ComputedMemberExpression | ConditionalExpression | Identifier | FunctionExpression | Literal | NewExpression | ObjectExpression | RegexLiteral | SequenceExpression | StaticMemberExpression | TaggedTemplateExpression | ThisExpression | UnaryExpression | UpdateExpression | YieldExpression;} */
Espree.Expression;

/** @typedef {AssignmentPattern | BindingIdentifier | BindingPattern;} */
Espree.FunctionParameter;

/** @typedef {ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;} */
Espree.ImportDeclarationSpecifier;

/** @typedef {BreakStatement | ContinueStatement | DebuggerStatement | DoWhileStatement | EmptyStatement | ExpressionStatement | Directive | ForStatement | ForInStatement | ForOfStatement | FunctionDeclaration | IfStatement | ReturnStatement | SwitchStatement | ThrowStatement | TryStatement | VariableDeclaration | WhileStatement | WithStatement;} */
Espree.Statement;

/** @typedef {Identifier | Literal;} */
Espree.PropertyKey;

/** @typedef {AssignmentPattern | BindingIdentifier | BindingPattern | FunctionExpression;} */
Espree.PropertyValue;

/** @typedef {Declaration | Statement;} */
Espree.StatementListItem;


/** @record */
Espree.ArrayExpression = function() {};

/** @type {string} */
Espree.ArrayExpression.prototype.type;

/** @type {!Array<!ArrayExpressionElement} */
Espree.ArrayExpression.prototype.Elements;

/** @record */
Espree.ArrayPattern = function() {};

/** @type {string} */
Espree.ArrayPattern.prototype.type;

/** @type {!Array<!ArrayPatternElement>} */
Espree.ArrayPattern.prototype.elements;


/** @record */
Espree.ArrowFunctionExpression = function() {};

/** @type {string} */
Espree.ArrowFunctionExpression.prototype.type;

/** @type {!Identifier} */
Espree.ArrowFunctionExpression.prototype.id;

/** @type {!Array<!FunctionParameter>} */
Espree.ArrowFunctionExpression.prototype.params;

/** @type {(!BlockStatement | !Expression)} */
Espree.ArrowFunctionExpression.prototype.body;

/** @type {boolean} */
Espree.ArrowFunctionExpression.prototype.generator;

/** @type {boolean} */
Espree.ArrowFunctionExpression.prototype.expression;


/** @record */
Espree.AssignmentExpression = function() {};

/** @type {string} */
Espree.AssignmentExpression.prototype.type;

/** @type {string} */
Espree.AssignmentExpression.prototype.operator;

/** @type {!Expression} */
Espree.AssignmentExpression.prototype.left;

/** @type {!Expression} */
Espree.AssignmentExpression.prototype.right;


/** @record */
Espree.AssignmentPattern = function() {};

/** @type {string} */
Espree.AssignmentPattern.prototype.type;

/** @type {(!BindingIdentifier | !BindingPattern)} */
Espree.AssignmentPattern.prototype.left;

/** @type {!Expression} */
Espree.AssignmentPattern.prototype.right;


/** @record */
Espree.BinaryExpression = function() {};

/** @type {string} */
Espree.BinaryExpression.prototype.type;

/** @type {string} */
Espree.BinaryExpression.prototype.operator;

/** @type {!Expression} */
Espree.BinaryExpression.prototype.left;

/** @type {!Expression} */
Espree.BinaryExpression.prototype.right;


/** @record */
Espree.BlockStatement = function() {};

/** @type {string} */
Espree.BlockStatement.prototype.type;

/** @type {!Array<!Statement>} */
Espree.BlockStatement.prototype.body;


/** @record */
Espree.BreakStatement = function() {};

/** @type {string} */
Espree.BreakStatement.prototype.type;

/** @type {!Identifier} */
Espree.BreakStatement.prototype.label;


/** @record */
Espree.CallExpression = function() {};

/** @type {string} */
Espree.CallExpression.prototype.type;

/** @type {!Expression} */
Espree.CallExpression.prototype.callee;

/** @type {!Array<!ArgumentListElement>} */
Espree.CallExpression.prototype.arguments;


/** @record */
Espree.CatchClause = function() {};

/** @type {string} */
Espree.CatchClause.prototype.type;

/** @type {(!BindingIdentifier | !BindingPattern)} */
Espree.CatchClause.prototype.param;

/** @type {!BlockStatement} */
Espree.CatchClause.prototype.body;


/** @record */
Espree.ClassBody = function() {};

/** @type {string} */
Espree.ClassBody.prototype.type;

/** @type {!Array<!Property>} */
Espree.ClassBody.prototype.body;


/** @record */
Espree.ClassDeclaration = function() {};

/** @type {string} */
Espree.ClassDeclaration.prototype.type;

/** @type {!Identifier} */
Espree.ClassDeclaration.prototype.id;

/** @type {!Identifier} */
Espree.ClassDeclaration.prototype.superClass;

/** @type {!ClassBody} */
Espree.ClassDeclaration.prototype.body;


/** @record */
Espree.ClassExpression = function() {};

/** @type {string} */
Espree.ClassExpression.prototype.type;

/** @type {!Identifier} */
Espree.ClassExpression.prototype.id;

/** @type {!Identifier} */
Espree.ClassExpression.prototype.superClass;

/** @type {!ClassBody} */
Espree.ClassExpression.prototype.body;


/** @record */
Espree.ComputedMemberExpression = function() {};

/** @type {string} */
Espree.ComputedMemberExpression.prototype.type;

/** @type {boolean} */
Espree.ComputedMemberExpression.prototype.computed;

/** @type {!Expression} */
Espree.ComputedMemberExpression.prototype.object;

/** @type {!Expression} */
Espree.ComputedMemberExpression.prototype.property;


/** @record */
Espree.ContinueStatement = function() {};
/** @type {string} */
Espree.ContinueStatement.prototype.type;

/** @type {!Identifier} */
Espree.ContinueStatement.prototype.label;


/** @record */
Espree.DebuggerStatement = function() {};

/** @type {string} */
Espree.DebuggerStatement.prototype.type;


/** @record */
Espree.Directive = function() {};

/** @type {string} */
Espree.Directive.prototype.type;

/** @type {!Expression} */
Espree.Directive.prototype.expression;

/** @type {string} */
Espree.Directive.prototype.directive;


/** @record */
Espree.DoWhileStatement = function() {};

/** @type {string} */
Espree.DoWhileStatement.prototype.type;

/** @type {!Statement} */
Espree.DoWhileStatement.prototype.body;

/** @type {!Expression} */
Espree.DoWhileStatement.prototype.test;


/** @record */
Espree.EmptyStatement = function() {};

/** @type {string} */
Espree.EmptyStatement.prototype.type;


/** @record */
Espree.ExportAllDeclaration = function() {};

/** @type {string} */
Espree.ExportAllDeclaration.prototype.type;

/** @type {!Literal} */
Espree.ExportAllDeclaration.prototype.source;


/** @record */
Espree.ExportDefaultDeclaration = function() {};

/** @type {string} */
Espree.ExportDefaultDeclaration.prototype.type;

/** @type {(!BindingIdentifier | !BindingPattern | !ClassDeclaration | !Expression | !FunctionDeclaration)} */
Espree.ExportDefaultDeclaration.prototype.declaration;


/** @record */
Espree.ExportNamedDeclaration = function() {};

/** @type {string} */
Espree.ExportNamedDeclaration.prototype.type;

/** @type {(!ClassDeclaration | !Function | !VariableDeclaration)} */
Espree.ExportNamedDeclaration.prototype.declaration;

/** @type {!Array<!ExportSpecifier>} */
Espree.ExportNamedDeclaration.prototype.specifiers;

/** @type {!Literal} */
Espree.ExportNamedDeclaration.prototype.source;


/** @record */
Espree.ExportSpecifier = function() {};

/** @type {string} */
Espree.ExportSpecifier.prototype.type;

/** @type {!Identifier} */
Espree.ExportSpecifier.prototype.exported;

/** @type {!Identifier} */
Espree.ExportSpecifier.prototype.local;


/** @record */
Espree.ExpressionStatement = function() {};

/** @type {string} */
Espree.ExpressionStatement.prototype.type;

/** @type {!Expression} */
Espree.ExpressionStatement.prototype.expression;


/** @record */
Espree.ForInStatement = function() {};

/** @type {string} */
Espree.ForInStatement.prototype.type;

/** @type {!Expression} */
Espree.ForInStatement.prototype.left;

/** @type {!Expression} */
Espree.ForInStatement.prototype.right;

/** @type {!Statement} */
Espree.ForInStatement.prototype.body;

/** @type {boolean} */
Espree.ForInStatement.prototype.each;


/** @record */
Espree.ForOfStatement = function() {};

/** @type {string} */
Espree.ForOfStatement.prototype.type;

/** @type {!Expression} */
Espree.ForOfStatement.prototype.left;

/** @type {!Expression} */
Espree.ForOfStatement.prototype.right;

/** @type {!Statement} */
Espree.ForOfStatement.prototype.body;


/** @record */
Espree.ForStatement = function() {};

/** @type {string} */
Espree.ForStatement.prototype.type;

/** @type {!Expression} */
Espree.ForStatement.prototype.init;

/** @type {!Expression} */
Espree.ForStatement.prototype.test;

/** @type {!Expression} */
Espree.ForStatement.prototype.update;

/** @type {!Statement} */
Espree.ForStatement.prototype.body;


/** @record */
Espree.FunctionDeclaration = function() {};

/** @type {string} */
Espree.FunctionDeclaration.prototype.type;

/** @type {!Identifier} */
Espree.FunctionDeclaration.prototype.id;

/** @type {!Array<!FunctionParameter>} */
Espree.FunctionDeclaration.prototype.params;

/** @type {!BlockStatement} */
Espree.FunctionDeclaration.prototype.body;

/** @type {boolean} */
Espree.FunctionDeclaration.prototype.generator;

/** @type {boolean} */
Espree.FunctionDeclaration.prototype.expression;


/** @record */
Espree.FunctionExpression = function() {};

/** @type {string} */
Espree.FunctionExpression.prototype.type;

/** @type {!Identifier} */
Espree.FunctionExpression.prototype.id;

/** @type {!Array<!FunctionParameter>} */
Espree.FunctionExpression.prototype.params;

/** @type {!BlockStatement} */
Espree.FunctionExpression.prototype.body;

/** @type {boolean} */
Espree.FunctionExpression.prototype.generator;

/** @type {boolean} */
Espree.FunctionExpression.prototype.expression;


/** @record */
Espree.Identifier = function() {};

/** @type {string} */
Espree.Identifier.prototype.type;

/** @type {string} */
Espree.Identifier.prototype.name;


/** @record */
Espree.IfStatement = function() {};

/** @type {string} */
Espree.IfStatement.prototype.type;

/** @type {!Expression} */
Espree.IfStatement.prototype.test;

/** @type {!Statement} */
Espree.IfStatement.prototype.consequent;

/** @type {!Statement} */
Espree.IfStatement.prototype.alternate;


/** @record */
Espree.ImportDeclaration = function() {};

/** @type {string} */
Espree.ImportDeclaration.prototype.type;

/** @type {!Array<!ImportDeclarationSpecifier>} */
Espree.ImportDeclaration.prototype.specifiers;

/** @type {!Literal} */
Espree.ImportDeclaration.prototype.source;


/** @record */
Espree.ImportDefaultSpecifier = function() {};

/** @type {string} */
Espree.ImportDefaultSpecifier.prototype.type;

/** @type {!Identifier} */
Espree.ImportDefaultSpecifier.prototype.local;


/** @record */
Espree.ImportNamespaceSpecifier = function() {};

/** @type {string} */
Espree.ImportNamespaceSpecifier.prototype.type;

/** @type {!Identifier} */
Espree.ImportNamespaceSpecifier.prototype.local;


/** @record */
Espree.ImportSpecifier = function() {};

/** @type {string} */
Espree.ImportSpecifier.prototype.type;

/** @type {!Identifier} */
Espree.ImportSpecifier.prototype.local;

/** @type {!Identifier} */
Espree.ImportSpecifier.prototype.imported;


/** @record */
Espree.LabeledStatement = function() {};

/** @type {string} */
Espree.LabeledStatement.prototype.type;

/** @type {!Identifier} */
Espree.LabeledStatement.prototype.label;

/** @type {!Statement} */
Espree.LabeledStatement.prototype.body;


/** @record */
Espree.Literal = function() {};

/** @type {string} */
Espree.Literal.prototype.type;

/** @type {(boolean | number | string)} */
Espree.Literal.prototype.value;

/** @type {string} */
Espree.Literal.prototype.raw;


/** @record */
Espree.MetaProperty = function() {};

/** @type {string} */
Espree.MetaProperty.prototype.type;

/** @type {!Identifier} */
Espree.MetaProperty.prototype.meta;

/** @type {!Identifier} */
Espree.MetaProperty.prototype.property;


/** @record */
Espree.MethodDefinition = function() {};

/** @type {string} */
Espree.MethodDefinition.prototype.type;

/** @type {!Expression} */
Espree.MethodDefinition.prototype.key;

/** @type {boolean} */
Espree.MethodDefinition.prototype.computed;

/** @type {!FunctionExpression} */
Espree.MethodDefinition.prototype.value;

/** @type {string} */
Espree.MethodDefinition.prototype.kind;

/** @type {boolean} */
Espree.MethodDefinition.prototype.static;


/** @record */
Espree.NewExpression = function() {};

/** @type {string} */
Espree.NewExpression.prototype.type;

/** @type {!Expression} */
Espree.NewExpression.prototype.callee;

/** @type {!Array<!ArgumentListElement>} */
Espree.NewExpression.prototype.arguments;


/** @record */
Espree.ObjectExpression = function() {};

/** @type {string} */
Espree.ObjectExpression.prototype.type;

/** @type {!Array<!Property>} */
Espree.ObjectExpression.prototype.properties;


/** @record */
Espree.ObjectPattern = function() {};

/** @type {string} */
Espree.ObjectPattern.prototype.type;

/** @type {!Array<!Property>} */
Espree.ObjectPattern.prototype.properties;


/** @record */
Espree.Program = function() {};

/** @type {string} */
Espree.Program.prototype.type;

/** @type {!Array<!StatementListItem>} */
Espree.Program.prototype.body;

/** @type {string} */
Espree.Program.prototype.sourceType;


/** @record */
Espree.Property = function() {};

/** @type {string} */
Espree.Property.prototype.type;

/** @type {!PropertyKey} */
Espree.Property.prototype.key;

/** @type {boolean} */
Espree.Property.prototype.computed;

/** @type {!PropertyValue} */
Espree.Property.prototype.value;

/** @type {string} */
Espree.Property.prototype.kind;

/** @type {boolean} */
Espree.Property.prototype.method;

/** @type {boolean} */
Espree.Property.prototype.shorthand;

/** @record */
Espree.RegexLiteral = function() {};

/** @type {string} */
Espree.Property.prototype.type;

/** @type {string} */
Espree.Property.prototype.value;

/** @type {string} */
Espree.Property.prototype.raw;

/** @type {any} */
Espree.Property.prototype.regex;


/** @record */
Espree.RestElement = function() {};

/** @type {string} */
Espree.RestElement.prototype.type;

/** @type {!Identifier} */
Espree.RestElement.prototype.argument;


/** @record */
Espree.ReturnStatement = function() {};

/** @type {string} */
Espree.ReturnStatement.prototype.type;

/** @type {!Expression} */
Espree.ReturnStatement.prototype.argument;


/** @record */
Espree.SequenceExpression = function() {};

/** @type {string} */
Espree.SequenceExpression.prototype.type;

/** @type {!Array<!Expression>} */
Espree.SequenceExpression.prototype.expressions;


/** @record */
Espree.SpreadElement = function() {};

/** @type {string} */
Espree.SpreadElement.prototype.type;

/** @type {!Expression} */
Espree.SpreadElement.prototype.argument;


/** @record */
Espree.StaticMemberExpression = function() {};

/** @type {string} */
Espree.StaticMemberExpression.prototype.type;

/** @type {boolean} */
Espree.StaticMemberExpression.prototype.computed;

/** @type {!Expression} */
Espree.StaticMemberExpression.prototype.object;

/** @type {!Expression} */
Espree.StaticMemberExpression.prototype.property;


/** @record */
Espree.Super = function() {};

/** @type {string} */
Espree.Super.prototype.type;


/** @record */
Espree.SwitchCase = function() {};

/** @type {string} */
Espree.SwitchCase.prototype.type;

/** @type {!Expression} */
Espree.SwitchCase.prototype.test;

/** @type {!Array<!Statement>} */
Espree.SwitchCase.prototype.consequent;


/** @record */
Espree.SwitchStatement = function() {};

/** @type {string} */
Espree.SwitchStatement.prototype.type;

/** @type {!Expression} */
Espree.SwitchStatement.prototype.discriminant;

/** @type {!Array<!SwitchCase>} */
Espree.SwitchStatement.prototype.cases;


/** @record */
Espree.TaggedTemplateExpression = function() {};

/** @type {string} */
Espree.TaggedTemplateExpression.prototype.type;

/** @type {!Expression} */
Espree.TaggedTemplateExpression.prototype.tag;

/** @type {!TemplateLiteral} */
Espree.TaggedTemplateExpression.prototype.quasi;


/** @record */
Espree.TemplateElement = function() {};

/** @type {string} */
Espree.TemplateElement.prototype.type;

/** @type {{cooked: string, raw: string}} */
Espree.TemplateElement.prototype.value;

/** @type {boolean} */
Espree.TemplateElement.prototype.tail;


/** @record */
Espree.TemplateLiteral = function() {};

/** @type {string} */
Espree.TemplateLiteral.prototype.type;

/** @type {!Array<!TemplateElement>} */
Espree.TemplateLiteral.prototype.quasis;

/** @type {!Array<!Expression>} */
Espree.TemplateLiteral.prototype.expressions;


/** @record */
Espree.ThisExpression = function() {};

/** @type {string} */
Espree.ThisExpression.prototype.type;


/** @record */
Espree.ThrowStatement = function() {};

/** @type {string} */
Espree.ThrowStatement.prototype.type;

/** @type {!Expression} */
Espree.ThrowStatement.prototype.argument;


/** @record */
Espree.TryStatement = function() {};

/** @type {string} */
Espree.TryStatement.prototype.type;

/** @type {!BlockStatement} */
Espree.TryStatement.prototype.block;

/** @type {!CatchClause} */
Espree.TryStatement.prototype.handler;

/** @type {!BlockStatement} */
Espree.TryStatement.prototype.finalizer;


/** @record */
Espree.UnaryExpression = function() {};

/** @type {string} */
Espree.UnaryExpression.prototype.type;

/** @type {string} */
Espree.UnaryExpression.prototype.operator;

/** @type {!Expression} */
Espree.UnaryExpression.prototype.argument;

/** @type {boolean} */
Espree.UnaryExpression.prototype.prefix;


/** @record */
Espree.UpdateExpression = function() {};

/** @type {string} */
Espree.UpdateExpression.prototype.type;

/** @type {string} */
Espree.UpdateExpression.prototype.operator;

/** @type {!Expression} */
Espree.UpdateExpression.prototype.argument;

/** @type {boolean} */
Espree.UpdateExpression.prototype.prefix;


/** @record */
Espree.VariableDeclaration = function() {};

/** @type {string} */
Espree.VariableDeclaration.prototype.type;

/** @type {!Array<!VariableDeclarator>} */
Espree.VariableDeclaration.prototype.declarations;

/** @type {string} */
Espree.VariableDeclaration.prototype.kind;


/** @record */
Espree.VariableDeclarator = function() {};

/** @type {string} */
Espree.VariableDeclarator.prototype.type;

/** @type {(!BindingIdentifier | !BindingPattern)} */
Espree.VariableDeclarator.prototype.id;

/** @type {!Expression} */
Espree.VariableDeclarator.prototype.init;


/** @record */
Espree.WhileStatement = function() {};

/** @type {string} */
Espree.WhileStatement.prototype.type;

/** @type {!Expression} */
Espree.WhileStatement.prototype.test;

/** @type {!Statement} */
Espree.WhileStatement.prototype.body;


/** @record */
Espree.WithStatement = function() {};

/** @type {string} */
Espree.WithStatement.prototype.type;

/** @type {!Expression} */
Espree.WithStatement.prototype.object;

/** @type {!Statement} */
Espree.WithStatement.prototype.body;


/** @record */
Espree.YieldExpression = function() {};

/** @type {string} */
Espree.YieldExpression.prototype.type;

/** @type {!Expression} */
Espree.YieldExpression.prototype.argument;

/** @type {boolean} */
Espree.YieldExpression.prototype.delegate;

