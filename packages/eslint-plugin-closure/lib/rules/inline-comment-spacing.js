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
 * @fileoverview This option controls spacing before a inline comment.
 * @author Joe Schafer
 */

goog.module('eslintClosure.rules.inlineCommentSpacing');

const utils = goog.require('eslintClosure.utils');

/** @const {number} */
const DEFAULT_PRECEDING_SPACES = 1;

/** @const {!ESLint.RuleDefinition} */
const INLINE_COMMENT_SPACING_RULE = {
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
    const minPrecedingSpaces = context.options[0] == null ?
          DEFAULT_PRECEDING_SPACES :
          /** @type {number} */ (context.options[0]);

    /**
     * Reports a given comment if it's invalid..
     * @param {!AST.LineComment} commentNode A comment node to check.
     * @return {undefined}
     */
    function checkLineCommentForPrecedingSpace(commentNode) {

      const sourceCode = context.getSourceCode();
      // Need to call getComments to attach comments to the AST.
      sourceCode.getComments(commentNode);
      // TODO: I'm not sure why I can't just call getTokenBefore.  The tests
      // fail if either of the two calls is missing.
      const previousToken = sourceCode.getTokenBefore(commentNode, 1) ||
            sourceCode.getTokenOrCommentBefore(commentNode);

      // Return early if there's no tokens before commentNode or there's only
      // whitespace.
      if (previousToken == null ||
          !utils.nodesShareOneLine(commentNode, previousToken)) {
        return;
      }

      const whiteSpaceGap = commentNode.start - previousToken.end;

      if (whiteSpaceGap < minPrecedingSpaces) {
        const spacesNoun = minPrecedingSpaces === 1 ? 'space' : 'spaces';
        context.report({
          node: commentNode,
          message: `Expected at least ${minPrecedingSpaces} ${spacesNoun} ` +
              `before inline comment.`,

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

exports = INLINE_COMMENT_SPACING_RULE;
