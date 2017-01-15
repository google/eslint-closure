/**
 * @fileoverview An extern for the Espree parser.
 * @externs
 */

/** @const */
const Espree = {};


/**
 * The overall Espree module.
 * @record
 */
Espree.Module = function() {};


/**
 * Tokenizes the given code.
 * @param {string} code The code to tokenize.
 * @param {Object} options Options defining how to tokenize.
 * @returns {!Array<!AST.Token>} An array of tokens.
 */
Espree.Module.prototype.tokenize = function tokenize(code, options) {};

/**
 * Parses the given code.
 * @param {string} code The code to tokenize.
 * @param {!Object} options Options defining how to tokenize.
 * @returns {!AST.Program} The "Program" AST node.
 */
Espree.Module.prototype.parse = function parse(code, options) {};

/**
 * @type {!Object<!AST.NodeType, string>}
 */
Espree.Module.prototype.Syntax;

/**
 * A mapping of node types to supported fields.
 * @type {!Object<!AST.NodeType, !Array<string>>}
 */
Espree.Module.prototype.VisitorKeys;

