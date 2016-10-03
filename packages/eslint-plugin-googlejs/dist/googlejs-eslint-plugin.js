'use strict';var l = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function n(a, b) {
  return a.loc.end.line === b.loc.start.line;
}
var q = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? l.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? l.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? l.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? l.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? l.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? l.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? l.UnderscoreForm.TRAILING : l.UnderscoreForm.MIDDLE;
}, getNodeAncestorOfType:function(a, b) {
  for (a = a.parent;a.type !== b && "Program" !== a.type;) {
    a = a.parent;
  }
  return a.type === b ? a : null;
}, isUnderscored:function(a) {
  return -1 < a.indexOf("_");
}, isNodeOneLine:function(a) {
  return n(a, a);
}, nodesShareOneLine:n, nodesStartOnSameLine:function(a, b) {
  return a.loc.start.line === b.loc.start.line;
}};
var u = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function x(a, b) {
  function c(a) {
    return Object.assign(r, {message:a});
  }
  function e(e, r) {
    return B(e, a, b) ? k : c(r);
  }
  var k = {node:a, message:"", hasError:!1}, r = {node:a, message:"", hasError:!0};
  switch(q.categorizeUnderscoredIdentifier(a.name)) {
    case l.UnderscoreForm.CONSTANT:
      return k;
    case l.UnderscoreForm.LEADING:
      return b.allowLeadingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : c("Leading underscores are not allowed in '" + a.name + "'.");
    case l.UnderscoreForm.NO_UNDERSCORE:
      return k;
    case l.UnderscoreForm.MIDDLE:
      return e(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case l.UnderscoreForm.OPT_PREFIX:
      return b.allowOptPrefix ? e(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : c("The opt_ prefix is not allowed in '" + a.name + "'.");
    case l.UnderscoreForm.TRAILING:
      return b.allowTrailingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : c("Trailing underscores are not allowed in '" + a.name + "'.");
    case l.UnderscoreForm.VAR_ARGS:
      return b.allowVarArgs ? k : c("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);;
  }
}
function B(a, b, c) {
  var e = b.parent;
  if (!q.isUnderscored(a)) {
    return !0;
  }
  switch(e.type) {
    case "MemberExpression":
      e = b.parent;
      if (!c.checkObjectProperties) {
        return !0;
      }
      if (e.property === b) {
        return e.parent && "AssignmentExpression" === e.parent.type ? e.parent.right === e : !0;
      }
      break;
    case "Property":
      e = b.parent;
      if (!c.checkObjectProperties || e.parent && "ObjectPattern" === e.parent.type && e.key === b && e.value !== b) {
        return !0;
      }
      break;
    case "CallExpression":
      return !0;
  }
  return !1;
}
;function E(a, b, c, e) {
  a = e ? b.getLastToken(a) : b.getFirstToken(a);
  b = b.getText(a, a.loc.start.column).split("");
  a = b.slice(0, b.findIndex(function(a) {
    return " " !== a && "\t" !== a;
  }));
  b = a.filter(function(a) {
    return " " === a;
  }).length;
  a = a.filter(function(a) {
    return "\t" === a;
  }).length;
  return {space:b, tab:a, goodChar:"space" === c ? b : a, badChar:"space" === c ? a : b};
}
function J(a, b, c) {
  b = !0 === c ? b.getLastToken(a, 1) : b.getTokenBefore(a);
  return (!0 === c ? a.loc.end.line : a.loc.start.line) !== (b ? b.loc.end.line : -1);
}
function K(a, b) {
  return !!b && b.parent.loc.start.line === a.loc.start.line && 1 < b.parent.declarations.length;
}
function L(a) {
  if ("CallExpression" !== a.parent.type) {
    return !1;
  }
  a = a.parent;
  if ("MemberExpression" !== a.callee.type) {
    return !1;
  }
  a = a.callee;
  if ("Identifier" !== a.object.type || "Identifier" !== a.property.type) {
    return !1;
  }
  var b = a.property;
  return "goog" === a.object.name && "scope" === b.name;
}
function M(a) {
  return "ArrayExpression" !== a.type ? !1 : a.elements[0] ? "ObjectExpression" === a.elements[0].type && a.elements[0].loc.start.line === a.loc.start.line : !1;
}
function N(a) {
  return a.declarations.reduce(function(b, c) {
    var e = b[b.length - 1];
    (c.loc.start.line !== a.loc.start.line && !e || e && e.loc.start.line !== c.loc.start.line) && b.push(c);
    return b;
  }, []);
}
function O(a) {
  var b = {indentSize:4, indentType:"space", indentOptions:{SwitchCase:0, VariableDeclarator:{var:1, let:1, const:1}, outerIIFEBody:-1, MemberExpression:-1, FunctionDeclaration:{parameters:-1, body:1}, FunctionExpression:{parameters:-1, body:1}}}, c = b.indentOptions;
  if (a.length && ("tab" === a[0] ? (b.indentSize = 1, b.indentType = "tab") : "number" === typeof a[0] && (b.indentSize = a[0], b.indentType = "space"), a[1])) {
    a = a[1];
    c.SwitchCase = a.SwitchCase || 0;
    if ("number" === typeof a.VariableDeclarator) {
      var e = a.VariableDeclarator;
      c.VariableDeclarator = {var:e, let:e, const:e};
    } else {
      "object" === typeof a.VariableDeclarator && Object.assign(c.VariableDeclarator, a.VariableDeclarator);
    }
    "number" === typeof a.outerIIFEBody && (c.outerIIFEBody = a.outerIIFEBody);
    "number" === typeof a.MemberExpression && (c.MemberExpression = a.MemberExpression);
    "object" === typeof a.FunctionDeclaration && Object.assign(c.FunctionDeclaration, a.FunctionDeclaration);
    "object" === typeof a.FunctionExpression && Object.assign(c.FunctionExpression, a.FunctionExpression);
  }
  return b;
}
;module.exports = {rules:{camelcase:{meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = Object.assign({}, u, a.options[0] || {});
  return {Identifier:function(c) {
    c = x(c, b);
    c.hasError && a.report({node:c.node, message:c.message});
  }};
}}, indent:{meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", minimum:0}, 
MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:!1}]}, create:function(a) {
  function b(d, a, f) {
    var b = "space" + (1 === a ? "" : "s"), c = "tab" + (1 === f ? "" : "s");
    return "Expected indentation of " + (d + " " + m + (1 === d ? "" : "s")) + " but" + (" found " + (0 < a && 0 < f ? a + " " + b + " and " + (f + " " + c) : 0 < a ? "space" === m ? a : a + " " + b : 0 < f ? "tab" === m ? f : f + " " + c : "0") + ".");
  }
  function c(d, F, f, c, e, g) {
    var h = ("space" === m ? " " : "\t").repeat(F), k = g ? [d.range[1] - f - c - 1, d.range[1] - 1] : [d.range[0] - f - c, d.range[0]];
    a.report({node:d, loc:e, message:b(F, f, c), fix:function(d) {
      return d.replaceTextRange(k, h);
    }});
  }
  function e(d, a) {
    var f = E(d, g, m, !1);
    "ArrayExpression" === d.type || "ObjectExpression" === d.type || f.goodChar === a && 0 === f.badChar || !J(d, g) || c(d, a, f.space, f.tab);
  }
  function k(d, a) {
    d.forEach(function(d) {
      return e(d, a);
    });
  }
  function r(d, a) {
    var f = g.getLastToken(d), b = E(f, g, m, !0);
    b.goodChar === a && 0 === b.badChar || !J(d, g, !0) || c(d, a, b.space, b.tab, {start:{line:f.loc.start.line, column:f.loc.start.column}}, !0);
  }
  function C(d, a) {
    var f = E(d, g, m, !1);
    f.goodChar === a && 0 === f.badChar || !J(d, g) || c(d, a, f.space, f.tab, {start:{line:d.loc.start.line, column:d.loc.start.column}});
  }
  function D(d) {
    var a = E(d, g, m).goodChar, f = d.parent;
    if ("Property" === f.type || "ArrayExpression" === f.type) {
      a = E(d, g, m, !1).goodChar;
    } else {
      if ("CallExpression" === f.type) {
        var b;
        b = 1 <= f.arguments.length ? f.arguments[0].loc.end.line > f.arguments[0].loc.start.line : !1;
        b && q.isNodeOneLine(f.callee) && !J(d, g) && (a = E(f, g, m).goodChar);
      }
    }
    return a;
  }
  function y(d) {
    var a = d.body, f = D(d), b = h, c;
    if (c = -1 !== p.outerIIFEBody) {
      if (L(d)) {
        c = !0;
      } else {
        var e = d.parent;
        c = e.parent;
        if ("CallExpression" !== e.type || e.callee !== d) {
          c = !1;
        } else {
          for (;"UnaryExpression" === c.type || "AssignmentExpression" === c.type || "LogicalExpression" === c.type || "SequenceExpression" === c.type || "VariableDeclarator" === c.type;) {
            if ("UnaryExpression" === c.type) {
              if (e = c, "!" === e.operator || "~" === e.operator || "+" === e.operator || "-" === e.operator) {
                c = c.parent;
              } else {
                break;
              }
            } else {
              c = c.parent;
            }
          }
          c = ("ExpressionStatement" === c.type || "VariableDeclaration" === c.type) && c.parent && "Program" === c.parent.type;
        }
      }
    }
    c ? b = p.outerIIFEBody * h : "FunctionExpression" === d.type ? b = p.FunctionExpression.body * h : "FunctionDeclaration" === d.type && (b = p.FunctionDeclaration.body * h);
    f += b;
    (c = q.getNodeAncestorOfType(d, "VariableDeclarator")) && K(d, c) && (f += h * p.VariableDeclarator[c.parent.kind]);
    w(a, f, f - b);
  }
  function G(d) {
    if (!q.isNodeOneLine(d)) {
      var a = d.body;
      d = D(d);
      w(a, d + h, d);
    }
  }
  function w(d, a, f) {
    q.isNodeOneLine(d) || (k(d.body, a), r(d, f));
  }
  function t(d) {
    var a = E(d, g, m).goodChar, f = a + h;
    "BlockStatement" === d.body.type ? w(d.body, f, a) : k([d.body], f);
  }
  function H(d, a, f) {
    "first" === f && d.params.length ? k(d.params.slice(1), d.params[0].loc.start.column) : k(d.params, a * f);
  }
  function I(d, a) {
    d = "SwitchStatement" === d.type ? d : d.parent;
    if (z[d.loc.start.line]) {
      return z[d.loc.start.line];
    }
    "undefined" === typeof a && (a = E(d, g, m).goodChar);
    a = 0 < d.cases.length && 0 === p.SwitchCase ? a : a + h * p.SwitchCase;
    return z[d.loc.start.line] = a;
  }
  var A = O(a.options), m = A.indentType, h = A.indentSize, p = A.indentOptions, g = a.getSourceCode(), z = {};
  return {Program:function(a) {
    k(a.body, 0);
  }, ClassDeclaration:G, ClassExpression:G, BlockStatement:function(a) {
    if (!q.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = E(a, g, m).goodChar;
      w(a, b + h, b);
    }
  }, DoWhileStatement:t, ForStatement:t, ForInStatement:t, ForOfStatement:t, WhileStatement:t, WithStatement:t, IfStatement:function(a) {
    var b = E(a, g, m).goodChar, f = b + h;
    "BlockStatement" !== a.consequent.type ? q.nodesStartOnSameLine(a, a.consequent) || e(a.consequent, f) : (k(a.consequent.body, f), r(a.consequent, b));
    if (a.alternate) {
      var c = g.getTokenBefore(a.alternate);
      e(c, b);
      "BlockStatement" !== a.alternate.type ? q.nodesStartOnSameLine(a.alternate, c) || e(a.alternate, f) : (k(a.alternate.body, f), r(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!q.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = N(a), f = E(a, g, m).goodChar, c = b[b.length - 1], f = f + h * p.VariableDeclarator[a.kind];
      k(b, f);
      g.getLastToken(a).loc.end.line <= c.loc.end.line || (b = g.getTokenBefore(c), "," === b.value ? r(a, E(b, g, m).goodChar) : r(a, f - h));
    }
  }, ObjectExpression:function(a) {
    if (!q.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && b[0].loc.start.line === a.loc.start.line)) {
        var f = a.parent, c = q.getNodeAncestorOfType(a, "VariableDeclarator"), e = E(f, g, m).goodChar;
        if (J(a, g)) {
          if (c) {
            if (f === c) {
              c === c.parent.declarations[0] && (e += h * p.VariableDeclarator[c.parent.kind]);
            } else {
              if ("ObjectExpression" === f.type || "ArrayExpression" === f.type || "CallExpression" === f.type || "ArrowFunctionExpression" === f.type || "NewExpression" === f.type || "LogicalExpression" === f.type) {
                e += h;
              }
            }
          } else {
            M(f) || "MemberExpression" === f.type || "ExpressionStatement" === f.type || "AssignmentExpression" === f.type || "Property" === f.type || (e += h);
          }
          f = e + h;
          C(a, e);
        } else {
          e = E(a, g, m).goodChar, f = e + h;
        }
        K(a, c) && (f += h * p.VariableDeclarator[c.parent.kind]);
        c = f;
        k(b, c);
        r(a, c - h);
      }
    }
  }, ArrayExpression:function(a) {
    if (!q.isNodeOneLine(a)) {
      var b = a.elements, b = b.filter(function(a) {
        return null !== a;
      });
      if (!(0 < b.length && b[0].loc.start.line === a.loc.start.line)) {
        var c, e, t = q.getNodeAncestorOfType(a, "VariableDeclarator");
        if (J(a, g)) {
          var v = e = a.parent;
          "MemberExpression" === e.type && (v = J(e, g) ? e.parent.parent : e.parent);
          c = E(v, g, m).goodChar;
          t ? t.loc.start.line === v.loc.start.line && (c += h * p.VariableDeclarator[t.parent.kind]) : M(e) || "MemberExpression" === v.type || "ExpressionStatement" === v.type || "AssignmentExpression" === v.type || "Property" === v.type || (c += h);
          e = c + h;
          C(a, c);
        } else {
          c = E(a, g, m).goodChar, e = c + h;
        }
        K(a, t) && (e += h * p.VariableDeclarator[t.parent.kind]);
        b[b.length - 1].loc.end.line !== a.loc.end.line && (k(b, e), r(a, e - h));
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== p.MemberExpression && !q.isNodeOneLine(a) && !q.getNodeAncestorOfType(a, "VariableDeclarator") && !q.getNodeAncestorOfType(a, "AssignmentExpression")) {
      var b = E(a, g, m).goodChar + h * p.MemberExpression, c = [a.property];
      a = g.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && c.push(a);
      k(c, b);
    }
  }, SwitchStatement:function(a) {
    var b = E(a, g, m).goodChar, c = I(a, b);
    k(a.cases, c);
    r(a, b);
  }, SwitchCase:function(a) {
    if (!q.isNodeOneLine(a)) {
      var b = I(a);
      k(a.consequent, b + h);
    }
  }, ArrowFunctionExpression:function(a) {
    q.isNodeOneLine(a) || "BlockStatement" === a.body.type && y(a);
  }, FunctionDeclaration:function(a) {
    q.isNodeOneLine(a) || (-1 !== p.FunctionDeclaration.parameters && H(a, h, p.FunctionDeclaration.parameters), y(a));
  }, FunctionExpression:function(a) {
    q.isNodeOneLine(a) || (-1 !== p.FunctionExpression.parameters && H(a, h, p.FunctionExpression.parameters), y(a));
  }};
}}, inlineCommentSpacing:{meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var b = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(c) {
    var e = a.getSourceCode();
    e.getComments(c);
    e = e.getTokenBefore(c, 1) || e.getTokenOrCommentBefore(c);
    if (null != e && q.nodesShareOneLine(c, e)) {
      var k = c.start - e.end;
      k < b && a.report({node:c, message:"Expected at least " + b + " " + (1 === b ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var e = Array(b - k + 1).join(" ");
        return a.insertTextBefore(c, e);
      }});
    }
  }};
}}}};

