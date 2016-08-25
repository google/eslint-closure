/** @fileoverview An extern for the ESTree spec at
 * https://github.com/estree/estree
 * @externs
 */

/**
 * The main AST Node.
 * @record
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
const ASTNode = function() {};

/** @type {!Node} */
ASTNode.prototype.type;

/** @type {?SourceLocation} */
ASTNode.prototype.loc;

/**
 * The source location information of a node.
 * @record
 */
const SourceLocation = function() {};

/** @type {(string|null)} */
SourceLocation.prototype.source;

/** @type {!Position} */
SourceLocation.prototype.start;

/** @type {!Position} */
SourceLocation.prototype.end;

/**
 * Each Position object consists of a line number (1-indexed) and a column
 * number (0-indexed).
 * @record
 */
const Position = function() {};

/** @type {number} */
Position.prototype.line;

/** @type {number} */
Position.prototype.column;


/**
 * An identifier. Note that an identifier may be an expression or a
 * destructuring pattern.
 *
 * @record
 * @extends {ASTNode}
 */
const Identifier = function() {};

/** @type {string} */
Identifier.prototype.name;

