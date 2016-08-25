/**
 * @fileoverview This option controls spacing before a inline comment.
 * @author Joe Schafer
 */

'use strict';

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {!ESTree.ASTNode} left The left token object.
 * @param {!ESTree.ASTNode} right The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 */
function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

const DEFAULT_PRECEDING_SPACES = 1;

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
   * @param {!RuleContext} context
   * @return {number}
   */
  create(context) {
    // Check for null explicitily because 0 is a falsey value.
    const minPrecedingSpaces = context.options[0] == null
          ? DEFAULT_PRECEDING_SPACES : context.options[0];


    /**
     * Reports a given comment if it's invalid.
     * @param {!ESTree.ASTNode} commentNode - a comment node to check
     * @returns {void}
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
          || !isTokenOnSameLine(commentNode, previousToken)) {
        return;
      }

      const whiteSpaceGap = commentNode.start - previousToken.end;

      if (whiteSpaceGap < minPrecedingSpaces) {
        const spacesNoun = minPrecedingSpaces === 1 ? 'space' : 'spaces';
        context.report({
          node: commentNode,
          message: 'Expected at least ' + minPrecedingSpaces + ' ' + spacesNoun
            + ' before inline comment.',

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
