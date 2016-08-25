/** @fileoverview An extern for the ESTree spec at
 * https://github.com/estree/estree
 * @externs
 */


const ESTree = {};

/**
 * @enum {string}
 */
ESTree.NodeType = {
  Identifier: 'Identifier',
};

/**
 * The main AST Node.
 * @record
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
ESTree.ASTNode = function() {};

/** @type {!ESTree.NodeType} */
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

