/**
 * @fileoverview This option controls indentation within a goog.scope declaration.
 * @author Joe Schafer
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce consistent indentation within goog.scope',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'integer',
        minimum: 0,
      },
    ],
  },

  create(context) {
    // Helpers

    /**
     * Check to see if the node is a file level IIFE
     * @param {ASTNode} node The function node to check.
     * @returns {boolean} True if the node is the outer IIFE
     */
    function isOuterIIFE(node) {
      const parent = node.parent;
      let stmt = parent.parent;

      /*
       * Verify that the node is an IIEF
       */
      if (
        parent.type !== 'CallExpression' ||
          parent.callee !== node) {

        return false;
      }

      /*
       * Navigate legal ancestors to determine whether this IIEF is outer
       */
      while (
        stmt.type === 'UnaryExpression' && (
          stmt.operator === '!' ||
            stmt.operator === '~' ||
            stmt.operator === '+' ||
            stmt.operator === '-') ||
          stmt.type === 'AssignmentExpression' ||
          stmt.type === 'LogicalExpression' ||
          stmt.type === 'SequenceExpression' ||
          stmt.type === 'VariableDeclarator') {

        stmt = stmt.parent;
      }

      return ((
        stmt.type === 'ExpressionStatement' ||
          stmt.type === 'VariableDeclaration') &&
              stmt.parent && stmt.parent.type === 'Program'
             );
    }

    return {
      'Function': isOuterIIFE,
    };
  },
};
