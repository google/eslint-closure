/**
 * @fileoverview This option controls spacing before a inline comment.
 * @author Joe Schafer
 */

'use strict';

const util = require('../utils');

/** @const {number} */
const DEFAULT_PRECEDING_SPACES = 1;

/** @type {!ESLint.RuleDefinition} */
module.exports = {
  meta: {
    docs: {
      description: 'enforce consistent spacing before the `//` at line end',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'integer',
        minimum: 0,
        maximum: 5,
      },
    ],
  },

  /**
   * @param {!ESLint.RuleContext} context
   * @return {!ESLint.VisitorMapping}
   */
  create(context) {
    // Check for null explicitily because 0 is a falsey value.
    /** @const {number} */
    const minPrecedingSpaces = context.options[0] == null
          ? DEFAULT_PRECEDING_SPACES
          : /** @type {number} */ (context.options[0]);


    /**
     * Reports a given comment if it's invalid.
     * @param {!Espree.LineComment} commentNode a comment node to check
     * @return {undefined}
     */
    function checkLineCommentForPrecedingSpace(commentNode) {

      const sourceCode = context.getSourceCode();
      // Need to call getComments to attach comments to the AST.
      sourceCode.getComments(commentNode);
      // TODO: I'm not sure why I can't just call getTokenBefore.  The tests
      // fail if either of the two calls is missing.
      const previousToken = sourceCode.getTokenBefore(commentNode, 1)
            || sourceCode.getTokenOrCommentBefore(commentNode);

      // Return early if there's no tokens before commentNode or there's only
      // whitespace.
      if (previousToken == null
          || !utils.isTokenOnSameLine(commentNode, previousToken)) {
        return;
      }

      const whiteSpaceGap = commentNode.start - previousToken.end;

      if (whiteSpaceGap < minPrecedingSpaces) {
        const spacesNoun = minPrecedingSpaces === 1 ? 'space' : 'spaces';
        context.report({
          node: commentNode,
          message: 'Expected at least ' + minPrecedingSpaces + ' ' + spacesNoun
            + ' before inline comment.',

          /**
           * @param {!ESLint.Fixer} fixer
           * @return {!ESLint.FixCommand}
           */
          fix(fixer) {
            const numNeededSpaces = minPrecedingSpaces - whiteSpaceGap;
            const spaces = new Array(numNeededSpaces + 1).join(' ');
            return fixer.insertTextBefore(commentNode, spaces);
          },
        });
      }
    }


    return {
      LineComment: checkLineCommentForPrecedingSpace,
    };

  },
};
