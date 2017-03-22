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

