'use strict';var e = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
var g = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? e.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? e.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? e.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? e.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? e.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? e.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? e.UnderscoreForm.TRAILING : e.UnderscoreForm.MIDDLE;
}, tokensOnSameLine:function(a, d) {
  return a.loc.end.line === d.loc.start.line;
}, isUnderscored:function(a) {
  return -1 < a.indexOf("_");
}};
var k = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function l(a, d) {
  function c(a) {
    return Object.assign(h, {message:a});
  }
  function b(b, h) {
    return m(b, a, d) ? f : c(h);
  }
  var f = {node:a, message:"", hasError:!1}, h = {node:a, message:"", hasError:!0};
  switch(g.categorizeUnderscoredIdentifier(a.name)) {
    case e.UnderscoreForm.CONSTANT:
      return f;
    case e.UnderscoreForm.LEADING:
      return d.allowLeadingUnderscore ? b(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : c("Leading underscores are not allowed in '" + a.name + "'.");
    case e.UnderscoreForm.NO_UNDERSCORE:
      return f;
    case e.UnderscoreForm.MIDDLE:
      return b(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case e.UnderscoreForm.OPT_PREFIX:
      return d.allowOptPrefix ? b(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : c("The opt_ prefix is not allowed in '" + a.name + "'.");
    case e.UnderscoreForm.TRAILING:
      return d.allowTrailingUnderscore ? b(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : c("Trailing underscores are not allowed in '" + a.name + "'.");
    case e.UnderscoreForm.VAR_ARGS:
      return d.allowVarArgs ? f : c("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);;
  }
}
function m(a, d, c) {
  var b = d.parent;
  if (!g.isUnderscored(a)) {
    return !0;
  }
  switch(b.type) {
    case "MemberExpression":
      b = d.parent;
      if (!c.checkObjectProperties) {
        return !0;
      }
      if (b.property === d) {
        return b.parent && "AssignmentExpression" === b.parent.type ? b.parent.right === b : !0;
      }
      break;
    case "Property":
      b = d.parent;
      if (!c.checkObjectProperties || b.parent && "ObjectPattern" === b.parent.type && b.key === d && b.value !== d) {
        return !0;
      }
      break;
    case "CallExpression":
      return !0;
  }
  return !1;
}
;module.exports = {rules:{camelcase:{meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var d = Object.assign({}, k, a.options[0] || {});
  return {Identifier:function(c) {
    c = l(c, d);
    c.hasError && a.report({node:c.node, message:c.message});
  }};
}}, inlineCommentSpacing:{meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var d = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(c) {
    var b = a.getSourceCode();
    b.getComments(c);
    b = b.getTokenBefore(c, 1) || b.getTokenOrCommentBefore(c);
    if (null != b && g.tokensOnSameLine(c, b)) {
      var f = c.start - b.end;
      f < d && a.report({node:c, message:"Expected at least " + d + " " + (1 === d ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var b = Array(d - f + 1).join(" ");
        return a.insertTextBefore(c, b);
      }});
    }
  }};
}}}};

