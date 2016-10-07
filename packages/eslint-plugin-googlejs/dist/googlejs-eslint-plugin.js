'use strict';var m = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function q(a, b) {
  return a.loc.end.line === b.loc.start.line;
}
var r = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? m.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? m.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? m.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? m.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? m.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? m.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? m.UnderscoreForm.TRAILING : m.UnderscoreForm.MIDDLE;
}, getNodeAncestorOfType:function(a, b) {
  for (a = a.parent;a.type !== b && "Program" !== a.type;) {
    a = a.parent;
  }
  return a.type === b ? a : null;
}, isUnderscored:function(a) {
  return -1 < a.indexOf("_");
}, isNodeOneLine:function(a) {
  return q(a, a);
}, nodesEndOnSameLine:function(a, b) {
  return a.loc.end.line === b.loc.end.line;
}, nodesShareOneLine:q, nodesStartOnSameLine:function(a, b) {
  return a.loc.start.line === b.loc.start.line;
}};
var A = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function H(a, b) {
  function d(a) {
    return Object.assign(k, {message:a});
  }
  function c(c, k) {
    return I(c, a, b) ? f : d(k);
  }
  var f = {node:a, message:"", hasError:!1}, k = {node:a, message:"", hasError:!0};
  switch(r.categorizeUnderscoredIdentifier(a.name)) {
    case m.UnderscoreForm.CONSTANT:
      return f;
    case m.UnderscoreForm.LEADING:
      return b.allowLeadingUnderscore ? c(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : d("Leading underscores are not allowed in '" + a.name + "'.");
    case m.UnderscoreForm.NO_UNDERSCORE:
      return f;
    case m.UnderscoreForm.MIDDLE:
      return c(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case m.UnderscoreForm.OPT_PREFIX:
      return b.allowOptPrefix ? c(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : d("The opt_ prefix is not allowed in '" + a.name + "'.");
    case m.UnderscoreForm.TRAILING:
      return b.allowTrailingUnderscore ? c(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : d("Trailing underscores are not allowed in '" + a.name + "'.");
    case m.UnderscoreForm.VAR_ARGS:
      return b.allowVarArgs ? f : d("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);;
  }
}
function I(a, b, d) {
  var c = b.parent;
  if (!r.isUnderscored(a)) {
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
;function J(a, b, d, c) {
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
function K(a, b, d) {
  b = !0 === d ? b.getLastToken(a, 1) : b.getTokenBefore(a);
  return (!0 === d ? a.loc.end.line : a.loc.start.line) !== (b ? b.loc.end.line : -1);
}
function L(a, b) {
  return !!b && b.parent.loc.start.line === a.loc.start.line && 1 < b.parent.declarations.length;
}
function M(a) {
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
function N(a) {
  return a.declarations.reduce(function(b, d) {
    var c = b[b.length - 1];
    (d.loc.start.line !== a.loc.start.line && !c || c && c.loc.start.line !== d.loc.start.line) && b.push(d);
    return b;
  }, []);
}
function O(a) {
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
;var P = require("doctrine");
function Q(a) {
  return "ClassExpression" === a.type || "ClassDeclaration" === a.type;
}
function R(a) {
  return null === a.type || "void" === a.type.name || "UndefinedLiteral" === a.type.type;
}
function S(a) {
  return "UndefinedLiteral" !== a && "NullLiteral" !== a && "NullableLiteral" !== a && "FunctionType" !== a && "AllLiteral" !== a;
}
;module.exports = {rules:{camelcase:{meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = Object.assign({}, A, a.options[0] || {});
  return {Identifier:function(d) {
    d = H(d, b);
    d.hasError && a.report({node:d.node, message:d.message});
  }};
}}, indent:{meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", minimum:0}, 
MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:!1}]}, create:function(a) {
  function b(u, a, l) {
    var b = "space" + (1 === a ? "" : "s"), e = "tab" + (1 === l ? "" : "s");
    return "Expected indentation of " + (u + " " + h + (1 === u ? "" : "s")) + " but" + (" found " + (0 < a && 0 < l ? a + " " + b + " and " + (l + " " + e) : 0 < a ? "space" === h ? a : a + " " + b : 0 < l ? "tab" === h ? l : l + " " + e : "0") + ".");
  }
  function d(u, p, l, e, d, c) {
    var g = ("space" === h ? " " : "\t").repeat(p), f = c ? [u.range[1] - l - e - 1, u.range[1] - 1] : [u.range[0] - l - e, u.range[0]];
    a.report({node:u, loc:d, message:b(p, l, e), fix:function(a) {
      return a.replaceTextRange(f, g);
    }});
  }
  function c(a, p) {
    var l = J(a, g, h, !1);
    "ArrayExpression" === a.type || "ObjectExpression" === a.type || l.goodChar === p && 0 === l.badChar || !K(a, g) || d(a, p, l.space, l.tab);
  }
  function f(a, p) {
    a.forEach(function(a) {
      return c(a, p);
    });
  }
  function k(a, p) {
    var b = g.getLastToken(a), e = J(b, g, h, !0);
    e.goodChar === p && 0 === e.badChar || !K(a, g, !0) || d(a, p, e.space, e.tab, {start:{line:b.loc.start.line, column:b.loc.start.column}}, !0);
  }
  function D(a) {
    var p = J(a, g, h).goodChar, b = a.parent;
    if ("Property" === b.type || "ArrayExpression" === b.type) {
      p = J(a, g, h, !1).goodChar;
    } else {
      if ("CallExpression" === b.type) {
        var e;
        e = 1 <= b.arguments.length ? b.arguments[0].loc.end.line > b.arguments[0].loc.start.line : !1;
        e && r.isNodeOneLine(b.callee) && !K(a, g) && (p = J(b, g, h).goodChar);
      }
    }
    return p;
  }
  function t(a) {
    var b = a.body, l = D(a), d = e, c;
    if (c = -1 !== n.outerIIFEBody) {
      if (M(a)) {
        c = !0;
      } else {
        var h = a.parent;
        c = h.parent;
        if ("CallExpression" !== h.type || h.callee !== a) {
          c = !1;
        } else {
          for (;"UnaryExpression" === c.type || "AssignmentExpression" === c.type || "LogicalExpression" === c.type || "SequenceExpression" === c.type || "VariableDeclarator" === c.type;) {
            if ("UnaryExpression" === c.type) {
              if (h = c, "!" === h.operator || "~" === h.operator || "+" === h.operator || "-" === h.operator) {
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
    c ? d = n.outerIIFEBody * e : "FunctionExpression" === a.type ? d = n.FunctionExpression.body * e : "FunctionDeclaration" === a.type && (d = n.FunctionDeclaration.body * e);
    l += d;
    (c = r.getNodeAncestorOfType(a, "VariableDeclarator")) && L(a, c) && (l += e * n.VariableDeclarator[c.parent.kind]);
    y(b, l, l - d);
  }
  function x(a) {
    if (!r.isNodeOneLine(a)) {
      var b = a.body;
      a = D(a);
      y(b, a + e, a);
    }
  }
  function B(a) {
    var b = a.parent, c = r.getNodeAncestorOfType(a, "VariableDeclarator"), f = J(b, g, h).goodChar;
    if (K(a, g)) {
      if (c) {
        if (b === c) {
          c === c.parent.declarations[0] && (f += e * n.VariableDeclarator[c.parent.kind]);
        } else {
          if ("ObjectExpression" === b.type || "ArrayExpression" === b.type || "CallExpression" === b.type || "ArrowFunctionExpression" === b.type || "NewExpression" === b.type || "LogicalExpression" === b.type) {
            f += e;
          }
        }
      } else {
        var k;
        k = "ArrayExpression" !== b.type ? !1 : b.elements[0] ? "ObjectExpression" === b.elements[0].type && b.elements[0].loc.start.line === b.loc.start.line : !1;
        k || "MemberExpression" === b.type || "ExpressionStatement" === b.type || "AssignmentExpression" === b.type || "Property" === b.type || (f += e);
      }
      b = f + e;
      k = J(a, g, h, !1);
      k.goodChar === f && 0 === k.badChar || !K(a, g) || d(a, f, k.space, k.tab, {start:{line:a.loc.start.line, column:a.loc.start.column}});
    } else {
      f = J(a, g, h).goodChar, b = f + e;
    }
    L(a, c) && (b += e * n.VariableDeclarator[c.parent.kind]);
    return b;
  }
  function y(a, b, c) {
    r.isNodeOneLine(a) || (f(a.body, b), k(a, c));
  }
  function v(a) {
    var b = J(a, g, h).goodChar, c = b + e;
    "BlockStatement" === a.body.type ? y(a.body, c, b) : f([a.body], c);
  }
  function E(a, b, c) {
    "first" === c && a.params.length ? f(a.params.slice(1), a.params[0].loc.start.column) : f(a.params, b * c);
  }
  function w(a, b) {
    a = "SwitchStatement" === a.type ? a : a.parent;
    if (z[a.loc.start.line]) {
      return z[a.loc.start.line];
    }
    "undefined" === typeof b && (b = J(a, g, h).goodChar);
    b = 0 < a.cases.length && 0 === n.SwitchCase ? b : b + e * n.SwitchCase;
    return z[a.loc.start.line] = b;
  }
  var C = O(a.options), h = C.indentType, e = C.indentSize, n = C.indentOptions, g = a.getSourceCode(), z = {};
  return {Program:function(a) {
    f(a.body, 0);
  }, ClassDeclaration:x, ClassExpression:x, BlockStatement:function(a) {
    if (!r.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = J(a, g, h).goodChar;
      y(a, b + e, b);
    }
  }, DoWhileStatement:v, ForStatement:v, ForInStatement:v, ForOfStatement:v, WhileStatement:v, WithStatement:v, IfStatement:function(a) {
    var b = J(a, g, h).goodChar, d = b + e;
    "BlockStatement" !== a.consequent.type ? r.nodesStartOnSameLine(a, a.consequent) || c(a.consequent, d) : (f(a.consequent.body, d), k(a.consequent, b));
    if (a.alternate) {
      var n = g.getTokenBefore(a.alternate);
      c(n, b);
      "BlockStatement" !== a.alternate.type ? r.nodesStartOnSameLine(a.alternate, n) || c(a.alternate, d) : (f(a.alternate.body, d), k(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!r.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = N(a), c = J(a, g, h).goodChar, d = b[b.length - 1], c = c + e * n.VariableDeclarator[a.kind];
      f(b, c);
      g.getLastToken(a).loc.end.line <= d.loc.end.line || (b = g.getTokenBefore(d), "," === b.value ? k(a, J(b, g, h).goodChar) : k(a, c - e));
    }
  }, ObjectExpression:function(a) {
    if (!r.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && r.nodesStartOnSameLine(b[0], a))) {
        var c = B(a);
        f(b, c);
        k(a, c - e);
      }
    }
  }, ArrayExpression:function(a) {
    if (!r.isNodeOneLine(a)) {
      var b = a.elements.filter(function(a) {
        return null !== a;
      });
      if (!(0 < b.length && r.nodesStartOnSameLine(b[0], a))) {
        var c = B(a);
        f(b, c);
        k(a, c - e);
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== n.MemberExpression && !r.isNodeOneLine(a) && !r.getNodeAncestorOfType(a, "VariableDeclarator") && !r.getNodeAncestorOfType(a, "AssignmentExpression")) {
      var b = J(a, g, h).goodChar + e * n.MemberExpression, c = [a.property];
      a = g.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && c.push(a);
      f(c, b);
    }
  }, SwitchStatement:function(a) {
    var b = J(a, g, h).goodChar, c = w(a, b);
    f(a.cases, c);
    k(a, b);
  }, SwitchCase:function(a) {
    if (!r.isNodeOneLine(a)) {
      var b = w(a);
      f(a.consequent, b + e);
    }
  }, ArrowFunctionExpression:function(a) {
    r.isNodeOneLine(a) || "BlockStatement" === a.body.type && t(a);
  }, FunctionDeclaration:function(a) {
    r.isNodeOneLine(a) || (-1 !== n.FunctionDeclaration.parameters && E(a, e, n.FunctionDeclaration.parameters), t(a));
  }, FunctionExpression:function(a) {
    r.isNodeOneLine(a) || (-1 !== n.FunctionExpression.parameters && E(a, e, n.FunctionExpression.parameters), t(a));
  }};
}}, "inline-comment-spacing":{meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var b = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(d) {
    var c = a.getSourceCode();
    c.getComments(d);
    c = c.getTokenBefore(d, 1) || c.getTokenOrCommentBefore(d);
    if (null != c && r.nodesShareOneLine(d, c)) {
      var f = d.start - c.end;
      f < b && a.report({node:d, message:"Expected at least " + b + " " + (1 === b ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var c = Array(b - f + 1).join(" ");
        return a.insertTextBefore(d, c);
      }});
    }
  }};
}}, jsdoc:{meta:{docs:{description:"enforce valid JSDoc comments", category:"Possible Errors", recommended:!0}, schema:[{type:"object", properties:{prefer:{type:"object", additionalProperties:{type:"string"}}, preferType:{type:"object", additionalProperties:{type:"string"}}, requireReturn:{type:"boolean"}, requireParamDescription:{type:"boolean"}, requireReturnDescription:{type:"boolean"}, matchDescription:{type:"string"}, requireReturnType:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  function b(a) {
    k.push({returnPresent:"ArrowFunctionExpression" === a.type && "BlockStatement" !== a.body.type || Q(a)});
  }
  function d(a) {
    var b;
    a.name ? b = a.name : a.expression && (b = a.expression.name);
    return {currentType:b, expectedType:b && w[b]};
  }
  function c(b, e) {
    if (e && S(e.type)) {
      var f = [], g = [];
      switch(e.type) {
        case "TypeApplication":
          g = "UnionType" === e.applications[0].type ? e.applications[0].elements : e.applications;
          f.push(d(e));
          break;
        case "RecordType":
          g = e.fields;
          break;
        case "UnionType":
        ;
        case "ArrayType":
          g = e.elements;
          break;
        case "FieldType":
          e.value && f.push(d(e.value));
          break;
        default:
          f.push(d(e));
      }
      g.forEach(c.bind(null, b));
      f.forEach(function(c) {
        c.expectedType && c.expectedType !== c.currentType && a.report({node:b, message:"Use '{{expectedType}}' instead of '{{currentType}}'.", data:{currentType:c.currentType, expectedType:c.expectedType}});
      });
    }
  }
  function f(b) {
    var e = D.getJSDocComment(b), d = k.pop(), f = Object.create(null), z = !1, u = !1, p = !1, l = !1, w = !1, F;
    if (e) {
      try {
        F = P.parse(e.value, {strict:!0, unwrap:!0, sloppy:!0});
      } catch (T) {
        /braces/i.test(T.message) ? a.report(e, "JSDoc type missing brace.") : a.report(e, "JSDoc syntax error.");
        return;
      }
      F.tags.forEach(function(b) {
        switch(b.title.toLowerCase()) {
          case "param":
          ;
          case "arg":
          ;
          case "argument":
            b.type || a.report(e, "Missing JSDoc parameter type for '{{name}}'.", {name:b.name});
            !b.description && y && a.report(e, "Missing JSDoc parameter description for '{{name}}'.", {name:b.name});
            f[b.name] ? a.report(e, "Duplicate JSDoc parameter '{{name}}'.", {name:b.name}) : -1 === b.name.indexOf(".") && (f[b.name] = 1);
            break;
          case "return":
          ;
          case "returns":
            z = !0;
            B || d.returnPresent || null !== b.type && R(b) || w ? (E && !b.type && a.report(e, "Missing JSDoc return type."), R(b) || b.description || !v || a.report(e, "Missing JSDoc return description.")) : a.report({node:e, message:"Unexpected @{{title}} tag; function has no return statement.", data:{title:b.title}});
            break;
          case "constructor":
          ;
          case "class":
            u = !0;
            break;
          case "override":
          ;
          case "inheritdoc":
            l = !0;
            break;
          case "abstract":
          ;
          case "virtual":
            w = !0;
            break;
          case "interface":
            p = !0;
        }
        x.hasOwnProperty(b.title) && b.title !== x[b.title] && a.report(e, "Use @{{name}} instead.", {name:x[b.title]});
        C && b.type && c(e, b.type);
      });
      l || z || u || p || "get" === b.parent.kind || "constructor" === b.parent.kind || "set" === b.parent.kind || Q(b) || (B || d.returnPresent) && a.report({node:e, message:"Missing JSDoc @{{returns}} for function.", data:{returns:x.returns || "returns"}});
      var G = Object.keys(f);
      b.params && b.params.forEach(function(b, c) {
        "AssignmentPattern" === b.type && (b = b.left);
        var d = b.name;
        "Identifier" === b.type && (G[c] && d !== G[c] ? a.report(e, "Expected JSDoc for '{{name}}' but found '{{jsdocName}}'.", {name:d, jsdocName:G[c]}) : f[d] || l || a.report(e, "Missing JSDoc for parameter '{{name}}'.", {name:d}));
      });
      t.matchDescription && ((new RegExp(t.matchDescription)).test(F.description) || a.report(e, "JSDoc description does not satisfy the regex pattern."));
    }
  }
  var k = [], D = a.getSourceCode(), t = a.options[0] || {}, x = t.prefer || {}, B = !1 !== t.requireReturn, y = !1 !== t.requireParamDescription, v = !1 !== t.requireReturnDescription, E = !1 !== t.requireReturnType, w = t.preferType || {}, C = 0 !== Object.keys(w).length;
  return {ArrowFunctionExpression:b, FunctionExpression:b, FunctionDeclaration:b, ClassExpression:b, ClassDeclaration:b, "ArrowFunctionExpression:exit":f, "FunctionExpression:exit":f, "FunctionDeclaration:exit":f, "ClassExpression:exit":f, "ClassDeclaration:exit":f, ReturnStatement:function(a) {
    var b = k[k.length - 1];
    b && null !== a.argument && (b.returnPresent = !0);
  }};
}}}};

