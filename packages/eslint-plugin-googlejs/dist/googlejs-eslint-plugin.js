'use strict';var k = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function p(a, b) {
  return a.loc.end.line === b.loc.start.line;
}
var q = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? k.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? k.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? k.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? k.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? k.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? k.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? k.UnderscoreForm.TRAILING : k.UnderscoreForm.MIDDLE;
}, getNodeAncestorOfType:function(a, b) {
  for (a = a.parent;a.type !== b && "Program" !== a.type;) {
    a = a.parent;
  }
  return a.type === b ? a : null;
}, isUnderscored:function(a) {
  return -1 < a.indexOf("_");
}, isNodeOneLine:function(a) {
  return p(a, a);
}, nodesEndOnSameLine:function(a, b) {
  return a.loc.end.line === b.loc.end.line;
}, nodesShareOneLine:p, nodesStartOnSameLine:function(a, b) {
  return a.loc.start.line === b.loc.start.line;
}};
var u = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function z(a, b) {
  function d(a) {
    return Object.assign(r, {message:a});
  }
  function c(c, r) {
    return B(c, a, b) ? g : d(r);
  }
  var g = {node:a, message:"", hasError:!1}, r = {node:a, message:"", hasError:!0};
  switch(q.categorizeUnderscoredIdentifier(a.name)) {
    case k.UnderscoreForm.CONSTANT:
      return g;
    case k.UnderscoreForm.LEADING:
      return b.allowLeadingUnderscore ? c(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : d("Leading underscores are not allowed in '" + a.name + "'.");
    case k.UnderscoreForm.NO_UNDERSCORE:
      return g;
    case k.UnderscoreForm.MIDDLE:
      return c(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case k.UnderscoreForm.OPT_PREFIX:
      return b.allowOptPrefix ? c(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : d("The opt_ prefix is not allowed in '" + a.name + "'.");
    case k.UnderscoreForm.TRAILING:
      return b.allowTrailingUnderscore ? c(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : d("Trailing underscores are not allowed in '" + a.name + "'.");
    case k.UnderscoreForm.VAR_ARGS:
      return b.allowVarArgs ? g : d("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);;
  }
}
function B(a, b, d) {
  var c = b.parent;
  if (!q.isUnderscored(a)) {
    return !0;
  }
  switch(c.type) {
    case "MemberExpression":
      c = b.parent;
      if (!d.checkObjectProperties) {
        return !0;
      }
      if (c.property === b) {
        return c.parent && "AssignmentExpression" === c.parent.type ? c.parent.right === c : !0;
      }
      break;
    case "Property":
      c = b.parent;
      if (!d.checkObjectProperties || c.parent && "ObjectPattern" === c.parent.type && c.key === b && c.value !== b) {
        return !0;
      }
      break;
    case "CallExpression":
      return !0;
  }
  return !1;
}
;function H(a, b, d, c) {
  a = c ? b.getLastToken(a) : b.getFirstToken(a);
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
  return {space:b, tab:a, goodChar:"space" === d ? b : a, badChar:"space" === d ? a : b};
}
function I(a, b, d) {
  b = !0 === d ? b.getLastToken(a, 1) : b.getTokenBefore(a);
  return (!0 === d ? a.loc.end.line : a.loc.start.line) !== (b ? b.loc.end.line : -1);
}
function J(a, b) {
  return !!b && b.parent.loc.start.line === a.loc.start.line && 1 < b.parent.declarations.length;
}
function K(a) {
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
function L(a) {
  return a.declarations.reduce(function(b, d) {
    var c = b[b.length - 1];
    (d.loc.start.line !== a.loc.start.line && !c || c && c.loc.start.line !== d.loc.start.line) && b.push(d);
    return b;
  }, []);
}
function M(a) {
  var b = {indentSize:4, indentType:"space", indentOptions:{SwitchCase:0, VariableDeclarator:{var:1, let:1, const:1}, outerIIFEBody:-1, MemberExpression:-1, FunctionDeclaration:{parameters:-1, body:1}, FunctionExpression:{parameters:-1, body:1}}}, d = b.indentOptions;
  if (a.length && ("tab" === a[0] ? (b.indentSize = 1, b.indentType = "tab") : "number" === typeof a[0] && (b.indentSize = a[0], b.indentType = "space"), a[1])) {
    a = a[1];
    d.SwitchCase = a.SwitchCase || 0;
    if ("number" === typeof a.VariableDeclarator) {
      var c = a.VariableDeclarator;
      d.VariableDeclarator = {var:c, let:c, const:c};
    } else {
      "object" === typeof a.VariableDeclarator && Object.assign(d.VariableDeclarator, a.VariableDeclarator);
    }
    "number" === typeof a.outerIIFEBody && (d.outerIIFEBody = a.outerIIFEBody);
    "number" === typeof a.MemberExpression && (d.MemberExpression = a.MemberExpression);
    "object" === typeof a.FunctionDeclaration && Object.assign(d.FunctionDeclaration, a.FunctionDeclaration);
    "object" === typeof a.FunctionExpression && Object.assign(d.FunctionExpression, a.FunctionExpression);
  }
  return b;
}
;module.exports = {rules:{camelcase:{meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = Object.assign({}, u, a.options[0] || {});
  return {Identifier:function(d) {
    d = z(d, b);
    d.hasError && a.report({node:d.node, message:d.message});
  }};
}}, indent:{meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", minimum:0}, 
MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:!1}]}, create:function(a) {
  function b(e, a, m) {
    var b = "space" + (1 === a ? "" : "s"), d = "tab" + (1 === m ? "" : "s");
    return "Expected indentation of " + (e + " " + l + (1 === e ? "" : "s")) + " but" + (" found " + (0 < a && 0 < m ? a + " " + b + " and " + (m + " " + d) : 0 < a ? "space" === l ? a : a + " " + b : 0 < m ? "tab" === l ? m : m + " " + d : "0") + ".");
  }
  function d(e, C, m, d, c, f) {
    var h = ("space" === l ? " " : "\t").repeat(C), g = f ? [e.range[1] - m - d - 1, e.range[1] - 1] : [e.range[0] - m - d, e.range[0]];
    a.report({node:e, loc:c, message:b(C, m, d), fix:function(e) {
      return e.replaceTextRange(g, h);
    }});
  }
  function c(e, a) {
    var m = H(e, f, l, !1);
    "ArrayExpression" === e.type || "ObjectExpression" === e.type || m.goodChar === a && 0 === m.badChar || !I(e, f) || d(e, a, m.space, m.tab);
  }
  function g(e, a) {
    e.forEach(function(e) {
      return c(e, a);
    });
  }
  function r(e, a) {
    var m = f.getLastToken(e), b = H(m, f, l, !0);
    b.goodChar === a && 0 === b.badChar || !I(e, f, !0) || d(e, a, b.space, b.tab, {start:{line:m.loc.start.line, column:m.loc.start.column}}, !0);
  }
  function A(e) {
    var a = H(e, f, l).goodChar, b = e.parent;
    if ("Property" === b.type || "ArrayExpression" === b.type) {
      a = H(e, f, l, !1).goodChar;
    } else {
      if ("CallExpression" === b.type) {
        var d;
        d = 1 <= b.arguments.length ? b.arguments[0].loc.end.line > b.arguments[0].loc.start.line : !1;
        d && q.isNodeOneLine(b.callee) && !I(e, f) && (a = H(b, f, l).goodChar);
      }
    }
    return a;
  }
  function w(e) {
    var a = e.body, b = A(e), d = h, c;
    if (c = -1 !== n.outerIIFEBody) {
      if (K(e)) {
        c = !0;
      } else {
        var f = e.parent;
        c = f.parent;
        if ("CallExpression" !== f.type || f.callee !== e) {
          c = !1;
        } else {
          for (;"UnaryExpression" === c.type || "AssignmentExpression" === c.type || "LogicalExpression" === c.type || "SequenceExpression" === c.type || "VariableDeclarator" === c.type;) {
            if ("UnaryExpression" === c.type) {
              if (f = c, "!" === f.operator || "~" === f.operator || "+" === f.operator || "-" === f.operator) {
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
    c ? d = n.outerIIFEBody * h : "FunctionExpression" === e.type ? d = n.FunctionExpression.body * h : "FunctionDeclaration" === e.type && (d = n.FunctionDeclaration.body * h);
    b += d;
    (c = q.getNodeAncestorOfType(e, "VariableDeclarator")) && J(e, c) && (b += h * n.VariableDeclarator[c.parent.kind]);
    v(a, b, b - d);
  }
  function D(e) {
    if (!q.isNodeOneLine(e)) {
      var a = e.body;
      e = A(e);
      v(a, e + h, e);
    }
  }
  function E(e) {
    var a = e.parent, b = q.getNodeAncestorOfType(e, "VariableDeclarator"), c = H(a, f, l).goodChar;
    if (I(e, f)) {
      if (b) {
        if (a === b) {
          b === b.parent.declarations[0] && (c += h * n.VariableDeclarator[b.parent.kind]);
        } else {
          if ("ObjectExpression" === a.type || "ArrayExpression" === a.type || "CallExpression" === a.type || "ArrowFunctionExpression" === a.type || "NewExpression" === a.type || "LogicalExpression" === a.type) {
            c += h;
          }
        }
      } else {
        var g;
        g = "ArrayExpression" !== a.type ? !1 : a.elements[0] ? "ObjectExpression" === a.elements[0].type && a.elements[0].loc.start.line === a.loc.start.line : !1;
        g || "MemberExpression" === a.type || "ExpressionStatement" === a.type || "AssignmentExpression" === a.type || "Property" === a.type || (c += h);
      }
      a = c + h;
      g = H(e, f, l, !1);
      g.goodChar === c && 0 === g.badChar || !I(e, f) || d(e, c, g.space, g.tab, {start:{line:e.loc.start.line, column:e.loc.start.column}});
    } else {
      c = H(e, f, l).goodChar, a = c + h;
    }
    J(e, b) && (a += h * n.VariableDeclarator[b.parent.kind]);
    return a;
  }
  function v(a, b, c) {
    q.isNodeOneLine(a) || (g(a.body, b), r(a, c));
  }
  function t(a) {
    var b = H(a, f, l).goodChar, c = b + h;
    "BlockStatement" === a.body.type ? v(a.body, c, b) : g([a.body], c);
  }
  function F(a, b, c) {
    "first" === c && a.params.length ? g(a.params.slice(1), a.params[0].loc.start.column) : g(a.params, b * c);
  }
  function G(a, b) {
    a = "SwitchStatement" === a.type ? a : a.parent;
    if (x[a.loc.start.line]) {
      return x[a.loc.start.line];
    }
    "undefined" === typeof b && (b = H(a, f, l).goodChar);
    b = 0 < a.cases.length && 0 === n.SwitchCase ? b : b + h * n.SwitchCase;
    return x[a.loc.start.line] = b;
  }
  var y = M(a.options), l = y.indentType, h = y.indentSize, n = y.indentOptions, f = a.getSourceCode(), x = {};
  return {Program:function(a) {
    g(a.body, 0);
  }, ClassDeclaration:D, ClassExpression:D, BlockStatement:function(a) {
    if (!q.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = H(a, f, l).goodChar;
      v(a, b + h, b);
    }
  }, DoWhileStatement:t, ForStatement:t, ForInStatement:t, ForOfStatement:t, WhileStatement:t, WithStatement:t, IfStatement:function(a) {
    var b = H(a, f, l).goodChar, d = b + h;
    "BlockStatement" !== a.consequent.type ? q.nodesStartOnSameLine(a, a.consequent) || c(a.consequent, d) : (g(a.consequent.body, d), r(a.consequent, b));
    if (a.alternate) {
      var n = f.getTokenBefore(a.alternate);
      c(n, b);
      "BlockStatement" !== a.alternate.type ? q.nodesStartOnSameLine(a.alternate, n) || c(a.alternate, d) : (g(a.alternate.body, d), r(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!q.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = L(a), c = H(a, f, l).goodChar, d = b[b.length - 1], c = c + h * n.VariableDeclarator[a.kind];
      g(b, c);
      f.getLastToken(a).loc.end.line <= d.loc.end.line || (b = f.getTokenBefore(d), "," === b.value ? r(a, H(b, f, l).goodChar) : r(a, c - h));
    }
  }, ObjectExpression:function(a) {
    if (!q.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && q.nodesStartOnSameLine(b[0], a))) {
        var c = E(a);
        g(b, c);
        r(a, c - h);
      }
    }
  }, ArrayExpression:function(a) {
    if (!q.isNodeOneLine(a)) {
      var b = a.elements.filter(function(a) {
        return null !== a;
      });
      if (!(0 < b.length && q.nodesStartOnSameLine(b[0], a))) {
        var c = E(a);
        g(b, c);
        r(a, c - h);
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== n.MemberExpression && !q.isNodeOneLine(a) && !q.getNodeAncestorOfType(a, "VariableDeclarator") && !q.getNodeAncestorOfType(a, "AssignmentExpression")) {
      var b = H(a, f, l).goodChar + h * n.MemberExpression, c = [a.property];
      a = f.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && c.push(a);
      g(c, b);
    }
  }, SwitchStatement:function(a) {
    var b = H(a, f, l).goodChar, c = G(a, b);
    g(a.cases, c);
    r(a, b);
  }, SwitchCase:function(a) {
    if (!q.isNodeOneLine(a)) {
      var b = G(a);
      g(a.consequent, b + h);
    }
  }, ArrowFunctionExpression:function(a) {
    q.isNodeOneLine(a) || "BlockStatement" === a.body.type && w(a);
  }, FunctionDeclaration:function(a) {
    q.isNodeOneLine(a) || (-1 !== n.FunctionDeclaration.parameters && F(a, h, n.FunctionDeclaration.parameters), w(a));
  }, FunctionExpression:function(a) {
    q.isNodeOneLine(a) || (-1 !== n.FunctionExpression.parameters && F(a, h, n.FunctionExpression.parameters), w(a));
  }};
}}, inlineCommentSpacing:{meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var b = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(d) {
    var c = a.getSourceCode();
    c.getComments(d);
    c = c.getTokenBefore(d, 1) || c.getTokenOrCommentBefore(d);
    if (null != c && q.nodesShareOneLine(d, c)) {
      var g = d.start - c.end;
      g < b && a.report({node:d, message:"Expected at least " + b + " " + (1 === b ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var c = Array(b - g + 1).join(" ");
        return a.insertTextBefore(d, c);
      }});
    }
  }};
}}}};

