/**
 * @fileoverview An extern for the Escope, an ECMAScript scope analyser at:
 * https://github.com/estools/escope/blob/master/src/reference.js
 * @externs
 */

/** @const */
const Escope = {};

/**
 * A Reference represents a single occurrence of an identifier in code.
 * @record
 */
Escope.Reference = function() {};

/**
 * Identifier syntax node.
 * @type {!Espree.Identifier}
 */
Escope.Reference.prototype.identifier;

/**
 * Reference to the enclosing Scope.
 * @type {!Escope.Scope}
 */
Escope.Reference.prototype.from;

/**
 * Whether the reference comes from a dynamic scope (such as 'eval',
 * 'with', etc.), and may be trapped by dynamic scopes.
 * @type {boolean}
 */
Escope.Reference.prototype.tainted;

/**
 * The variable this reference is resolved with.
 * @type {!Escope.Variable}
 */
Escope.Reference.prototype.resolved;

/**
 * If reference is writeable, this is the tree being written to it.
 * @type {!Espree.ASTNode}
 */
Escope.Reference.prototype.writeExpr;

/**
 * Whether the Reference might refer to a partial value of writeExpr.
 * @type {boolean}
 */
Escope.Reference.prototype.partial;

/**
 * Whether the Reference is to write of initialization.
 * @type {boolean}
 */
Escope.Reference.prototype.init;

/**
 * Whether the reference is static.
 * @return {boolean}
 */
Escope.Reference.prototype.isStatic = function() {};

/**
 * Whether the reference is writeable.
 * @return {boolean}
 */
Escope.Reference.prototype.isWrite = function() {};

/**
 * Whether the reference is readable.
 * @return {boolean}
 */
Escope.Reference.prototype.isRead = function() {};

/**
 * Whether the reference is read-only.
 * @return {boolean}
 */
Escope.Reference.prototype.isReadOnly = function() {};

/**
 * Whether the reference is write-only.
 * @return {boolean}
 */
Escope.Reference.prototype.isWriteOnly = function() {};

/**
 * Whether the reference is read-write.
 * @return {boolean}
 */
Escope.Reference.prototype.isReadWrite = function() {};


/**
 * A Variable represents a locally scoped identifier. These include arguments to
 * functions.
 * @record
 */
Escope.Variable = function() {};

/**
 * The variable name, as given in the source code.
 * @type {String}
 */
Escope.Variable.prototype.name;

/**
 * List of defining occurrences of this variable (like in 'var ...'
 * statements or as parameter), as AST nodes.
 * @type {!Array<!Espree.Identifier>}
 */
Escope.Variable.prototype.identifiers;

/**
 * List of Escope.References of this variable (excluding parameter entries)
 * in its defining scope and all nested scopes. For defining
 * occurrences only see
 * @type {!Array<!Escope.Reference>}
 */
Escope.Variable.prototype.references;

/**
 * List of defining occurrences of this variable (like in 'var ...'
 * statements or as parameter), as custom objects.
 * @type {!Array<!Escope.Definition>}
 */
Escope.Variable.prototype.defs;

/**
 * @type {boolean}
 */
Escope.Variable.prototype.tainted;

/**
 * Whether this is a stack variable.
 * @type {boolean}
 */
Escope.Variable.prototype.stack;

/**
 * Reference to the enclosing Scope.
 * @type {!Escope.Scope}
 */
Escope.Variable.prototype.scope;


/**
 * @record
 */
Escope.Scope = function() {};

/**
 * One of 'TDZ', 'module', 'block', 'switch', 'function', 'catch', 'with',
 * 'function', 'class', 'global'.
 * @type {String}
 */
Escope.Scope.prototype.type;

/**
 * The scoped Escope.Variables of this scope, as <code>{ Variable.name :
 * Variable }</code>.
 * @type {!Map<string, !Escope.Variable>}
 */
Escope.Scope.prototype.set;

/**
 * The tainted variables of this scope, as <code>{ Variable.name :
 * boolean }</code>.
 * @type {!Map<string, boolean>}
 */
Escope.Scope.prototype.taints;

/**
 * Generally, through the lexical scoping of JS you can always know
 * which variable an identifier in the source code refers to. There are
 * a few exceptions to this rule. With 'global' and 'with' scopes you
 * can only decide at runtime which variable a reference refers to.
 * Moreover, if 'eval()' is used in a scope, it might introduce new
 * bindings in this or its parent scopes.
 * All those scopes are considered 'dynamic'.
 * @type {boolean}
 */
Escope.Scope.prototype.dynamic;

/**
 * A reference to the scope-defining syntax node.
 * @type {!Espree.Node}
 */
Escope.Scope.prototype.block;

/**
 * The {@link Reference|references} that are not resolved with this scope.
 * @type {!Array<!Escope.Reference>}
 */
Escope.Scope.prototype.through;

/**
 * The scoped {@link Variable}s of this scope. In the case of a
 * 'function' scope this includes the automatic argument <em>arguments</em> as
 * its first element, as well as all further formal arguments.
 * @type {!Array<!Escope.Variable>}
 */
Escope.Scope.prototype.variables;

/**
 * Any variable {@link Reference|reference} found in this scope. This
 * includes occurrences of local variables as well as variables from
 * parent scopes (including the global scope). For local variables
 * this also includes defining occurrences (like in a 'var' statement).
 * In a 'function' scope this does not include the occurrences of the
 * formal parameter in the parameter list.
 * @type {!Array<!Escope.Reference>}
 */
Escope.Scope.prototype.references;

/**
 * For 'global' and 'function' scopes, this is a self-reference. For
 * other scope types this is the <em>variableScope</em> value of the
 * parent scope.
 * @type {!Escope.Scope}
 */
Escope.Scope.prototype.variableScope;

/**
 * Whether this scope is created by a FunctionExpression.
 * @type {boolean}
 */
Escope.Scope.prototype.functionExpressionScope;

/**
 * Whether this is a scope that contains an 'eval()' invocation.
 * @type {boolean}
 */
Escope.Scope.prototype.directCallToEvalScope;

/**
 * @type {boolean}
 */
Escope.Scope.prototype.thisFound;

/**
 * Reference to the parent {@link Scope|scope}.
 * @type {!Escope.Scope}
 */
Escope.Scope.prototype.upper;

/**
 * Whether 'use strict' is in effect in this scope.
 * @type {boolean}
 */
Escope.Scope.prototype.isStrict;

/**
 * List of nested {@link Scope}s.
 * @type {!Array<!Escope.Scope>}
 */
Escope.Scope.prototype.childScopes;

/**
 * Defintion.
 * @record
 */
Escope.Definition = function() {};
/**
 * @type {string} type of the occurrence (e.g. "Parameter", "Variable", ...).
 */
Escope.Definition.prototype.type;
/**
 * @type {!Espree.Identifier} the identifier AST node of the occurrence.
 */
Escope.Definition.prototype.name;
/**
 * @type {!Espree.Node} the enclosing node of the identifier.
 */
Escope.Definition.prototype.node;
/**
 * @type {?Espree.Node} the enclosing statement node of the identifier.
 */
Escope.Definition.prototype.parent;
/**
 * @type {(number|null)} the index in the declaration statement.
 */
Escope.Definition.prototype.index;
/**
 * @type {(string|null)} the kind of the declaration statement.
 */
Escope.Definition.prototype.kind;
