/**
 * @fileoverview Tests for ast-info.js.
 */

/* global describe it */
goog.module('googlejs.tests.astInfo');
goog.setTestOnly('googlejs.tests.astInfo');

const astInfo = goog.require('googlejs.astInfo');

const chai = /** @type {!Chai.Module} */ (require('chai'));
const espree = /** @type {!Espree.Module} */ (require('espree'));

const expect = chai.expect;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
  comment: true,
  tokens: true,
  range: true,
  loc: true,
};

describe('getFullyQualifedName', () => {
  /**
   * Parses sourceCode and returns the first identifier node.  This method also
   * adds parent links since Espree doesn't provide that automatically.
   * @param {string} sourceCode
   * @return {!AST.Identifier}
   */
  const parseGetIdentifier = (sourceCode) => {
    const program = espree.parse(sourceCode, DEFAULT_CONFIG);
    // We only pass in expression statements.
    const exprStmt = /** @type {!AST.ExpressionStatement} */ (program.body[0]);
    let nodeSearcher = exprStmt.expression;
    nodeSearcher.parent = exprStmt;
    if (nodeSearcher.type === 'CallExpression') {
      const child = /** @type {!AST.CallExpression} */ (nodeSearcher).callee;
      child.parent = nodeSearcher;
      nodeSearcher = child;
    }
    while (nodeSearcher.type === 'MemberExpression') {
      const child = /** @type {!AST.MemberExpression} */ (nodeSearcher).object;
      child.parent = nodeSearcher;
      nodeSearcher = child;
    }
    if (nodeSearcher.type !== 'Identifier') {
      throw new Error('Malformed source code, provide a simple member' +
                      ' expression with an optional outer call expression.');
    }
    return /** @type {!AST.Identifier} */ (nodeSearcher);
  };

  /**
   * Returns the last identifer name, e.g. `baz` in `foo.bar.baz`.
   * The last identifier name is used soley for ease of testing.
   * @param {string} sourceCode
   * @return {string}
   */
  const getFullName = (sourceCode) => {
    const firstIdentifier = parseGetIdentifier(sourceCode);
    return astInfo.getFullyQualifedName(firstIdentifier);
  };

  it('should get the outer most member expression property name', () => {
    expect(getFullName(`foo;`)).to.equal('foo');
    expect(getFullName(`foo.bar;`)).to.equal('foo.bar');
    expect(getFullName(`foo.bar.baz`)).to.equal('foo.bar.baz');
    expect(getFullName(`foo.bar.baz.qux`)).to.equal('foo.bar.baz.qux');

    expect(getFullName(`foo();`)).to.equal('foo');
    expect(getFullName(`foo.bar();`)).to.equal('foo.bar');
    expect(getFullName(`foo.bar.baz()`)).to.equal('foo.bar.baz');
    expect(getFullName(`foo.bar.baz.qux()`)).to.equal('foo.bar.baz.qux');
  });
});
