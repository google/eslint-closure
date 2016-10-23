'use strict';var c = c || {};
c.global = this;
c.isDef = function(a) {
  return void 0 !== a;
};
c.exportPath_ = function(a, b, d) {
  a = a.split(".");
  d = d || c.global;
  a[0] in d || !d.execScript || d.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    !a.length && c.isDef(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {};
  }
};
c.define = function(a, b) {
  c.exportPath_(a, b);
};
c.DEBUG = !0;
c.LOCALE = "en";
c.TRUSTED_SITE = !0;
c.STRICT_MODE_COMPATIBLE = !1;
c.DISALLOW_TEST_ONLY_CODE = !c.DEBUG;
c.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
c.provide = function(a) {
  if (c.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  c.constructNamespace_(a);
};
c.constructNamespace_ = function(a, b) {
  c.exportPath_(a, b);
};
c.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
c.module = function(a) {
  if (!c.isString(a) || !a || -1 == a.search(c.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!c.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (c.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  c.moduleLoaderState_.moduleName = a;
};
c.module.get = function(a) {
  return c.module.getInternal_(a);
};
c.module.getInternal_ = function() {
};
c.moduleLoaderState_ = null;
c.isInModuleLoader_ = function() {
  return null != c.moduleLoaderState_;
};
c.module.declareLegacyNamespace = function() {
  c.moduleLoaderState_.declareLegacyNamespace = !0;
};
c.setTestOnly = function(a) {
  if (c.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
c.forwardDeclare = function() {
};
c.getObjectByName = function(a, b) {
  a = a.split(".");
  b = b || c.global;
  for (var d;d = a.shift();) {
    if (c.isDefAndNotNull(b[d])) {
      b = b[d];
    } else {
      return null;
    }
  }
  return b;
};
c.globalize = function(a, b) {
  b = b || c.global;
  for (var d in a) {
    b[d] = a[d];
  }
};
c.addDependency = function(a, b, d, e) {
  if (c.DEPENDENCIES_ENABLED) {
    var f;
    a = a.replace(/\\/g, "/");
    var g = c.dependencies_;
    e && "boolean" !== typeof e || (e = e ? {module:"goog"} : {});
    for (var l = 0;f = b[l];l++) {
      g.nameToPath[f] = a, g.loadFlags[a] = e;
    }
    for (e = 0;b = d[e];e++) {
      a in g.requires || (g.requires[a] = {}), g.requires[a][b] = !0;
    }
  }
};
c.ENABLE_DEBUG_LOADER = !0;
c.logToConsole_ = function(a) {
  c.global.console && c.global.console.error(a);
};
c.require = function() {
};
c.basePath = "";
c.nullFunction = function() {
};
c.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
c.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    c.DEBUG && (c.instantiatedSingletons_[c.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
c.instantiatedSingletons_ = [];
c.LOAD_MODULE_USING_EVAL = !0;
c.SEAL_MODULE_EXPORTS = c.DEBUG;
c.loadedModules_ = {};
c.DEPENDENCIES_ENABLED = !1;
c.TRANSPILE = "detect";
c.TRANSPILER = "transpile.js";
c.DEPENDENCIES_ENABLED && (c.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, c.inHtmlDocument_ = function() {
  var a = c.global.document;
  return null != a && "write" in a;
}, c.findBasePath_ = function() {
  if (c.isDef(c.global.CLOSURE_BASE_PATH)) {
    c.basePath = c.global.CLOSURE_BASE_PATH;
  } else {
    if (c.inHtmlDocument_()) {
      for (var a = c.global.document.getElementsByTagName("SCRIPT"), b = a.length - 1;0 <= b;--b) {
        var d = a[b].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if ("base.js" == d.substr(e - 7, 7)) {
          c.basePath = d.substr(0, e - 7);
          break;
        }
      }
    }
  }
}, c.importScript_ = function(a, b) {
  (c.global.CLOSURE_IMPORT_SCRIPT || c.writeScriptTag_)(a, b) && (c.dependencies_.written[a] = !0);
}, c.IS_OLD_IE_ = !(c.global.atob || !c.global.document || !c.global.document.all), c.importProcessedScript_ = function(a, b, d) {
  c.importScript_("", 'goog.retrieveAndExec_("' + a + '", ' + b + ", " + d + ");");
}, c.queuedModules_ = [], c.wrapModule_ = function(a, b) {
  return c.LOAD_MODULE_USING_EVAL && c.isDef(c.global.JSON) ? "goog.loadModule(" + c.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, c.loadQueuedModules_ = function() {
  var a = c.queuedModules_.length;
  if (0 < a) {
    var b = c.queuedModules_;
    c.queuedModules_ = [];
    for (var d = 0;d < a;d++) {
      c.maybeProcessDeferredPath_(b[d]);
    }
  }
}, c.maybeProcessDeferredDep_ = function(a) {
  c.isDeferredModule_(a) && c.allDepsAreAvailable_(a) && (a = c.getPathFromDeps_(a), c.maybeProcessDeferredPath_(c.basePath + a));
}, c.isDeferredModule_ = function(a) {
  var b = (a = c.getPathFromDeps_(a)) && c.dependencies_.loadFlags[a] || {};
  return a && ("goog" == b.module || c.needsTranspile_(b.lang)) ? c.basePath + a in c.dependencies_.deferred : !1;
}, c.allDepsAreAvailable_ = function(a) {
  if ((a = c.getPathFromDeps_(a)) && a in c.dependencies_.requires) {
    for (var b in c.dependencies_.requires[a]) {
      if (!c.isProvided_(b) && !c.isDeferredModule_(b)) {
        return !1;
      }
    }
  }
  return !0;
}, c.maybeProcessDeferredPath_ = function(a) {
  if (a in c.dependencies_.deferred) {
    var b = c.dependencies_.deferred[a];
    delete c.dependencies_.deferred[a];
    c.globalEval(b);
  }
}, c.loadModuleFromUrl = function(a) {
  c.retrieveAndExec_(a, !0, !1);
}, c.writeScriptSrcNode_ = function(a) {
  c.global.document.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
}, c.appendScriptSrcNode_ = function(a) {
  var b = c.global.document, d = b.createElement("script");
  d.type = "text/javascript";
  d.src = a;
  d.defer = !1;
  d.async = !1;
  b.head.appendChild(d);
}, c.writeScriptTag_ = function(a, b) {
  if (c.inHtmlDocument_()) {
    var d = c.global.document;
    if (!c.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == d.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    void 0 === b ? c.IS_OLD_IE_ ? (b = " onreadystatechange='goog.onScriptLoad_(this, " + ++c.lastNonModuleScriptIndex_ + ")' ", d.write('<script type="text/javascript" src="' + a + '"' + b + ">\x3c/script>")) : c.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? c.appendScriptSrcNode_(a) : c.writeScriptSrcNode_(a) : d.write('<script type="text/javascript">' + b + "\x3c/script>");
    return !0;
  }
  return !1;
}, c.needsTranspile_ = function(a) {
  if ("always" == c.TRANSPILE) {
    return !0;
  }
  if ("never" == c.TRANSPILE) {
    return !1;
  }
  if (!c.transpiledLanguages_) {
    c.transpiledLanguages_ = {es5:!0, es6:!0, "es6-impl":!0};
    try {
      c.transpiledLanguages_.es5 = eval("[1,].length!=1"), eval('(()=>{"use strict";let a={};const X=class{constructor(){}x(z){return new Map([...arguments]).get(z[0])==3}};return new X().x([a,3])})()') && (c.transpiledLanguages_["es6-impl"] = !1), eval('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()') && 
      (c.transpiledLanguages_.es6 = !1);
    } catch (b) {
    }
  }
  return !!c.transpiledLanguages_[a];
}, c.transpiledLanguages_ = null, c.lastNonModuleScriptIndex_ = 0, c.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && c.lastNonModuleScriptIndex_ == b && c.loadQueuedModules_();
  return !0;
}, c.writeScripts_ = function(a) {
  function b(a) {
    if (!(a in f.written || a in f.visited)) {
      f.visited[a] = !0;
      if (a in f.requires) {
        for (var g in f.requires[a]) {
          if (!c.isProvided_(g)) {
            if (g in f.nameToPath) {
              b(f.nameToPath[g]);
            } else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      a in e || (e[a] = !0, d.push(a));
    }
  }
  var d = [], e = {}, f = c.dependencies_;
  b(a);
  for (a = 0;a < d.length;a++) {
    var g = d[a];
    c.dependencies_.written[g] = !0;
  }
  var l = c.moduleLoaderState_;
  c.moduleLoaderState_ = null;
  for (a = 0;a < d.length;a++) {
    if (g = d[a]) {
      var n = f.loadFlags[g] || {}, w = c.needsTranspile_(n.lang);
      "goog" == n.module || w ? c.importProcessedScript_(c.basePath + g, "goog" == n.module, w) : c.importScript_(c.basePath + g);
    } else {
      throw c.moduleLoaderState_ = l, Error("Undefined script input");
    }
  }
  c.moduleLoaderState_ = l;
}, c.getPathFromDeps_ = function(a) {
  return a in c.dependencies_.nameToPath ? c.dependencies_.nameToPath[a] : null;
}, c.findBasePath_(), c.global.CLOSURE_NO_DEPS || c.importScript_(c.basePath + "deps.js"));
c.loadModule = function(a) {
  var b = c.moduleLoaderState_;
  try {
    c.moduleLoaderState_ = {moduleName:void 0, declareLegacyNamespace:!1};
    var d;
    if (c.isFunction(a)) {
      d = a.call(void 0, {});
    } else {
      if (c.isString(a)) {
        d = c.loadModuleFromSource_.call(void 0, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var e = c.moduleLoaderState_.moduleName;
    if (!c.isString(e) || !e) {
      throw Error('Invalid module name "' + e + '"');
    }
    c.moduleLoaderState_.declareLegacyNamespace ? c.constructNamespace_(e, d) : c.SEAL_MODULE_EXPORTS && Object.seal && c.isObject(d) && Object.seal(d);
    c.loadedModules_[e] = d;
  } finally {
    c.moduleLoaderState_ = b;
  }
};
c.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
};
c.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0;b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
c.loadFileSync_ = function(a) {
  if (c.global.CLOSURE_LOAD_FILE_SYNC) {
    return c.global.CLOSURE_LOAD_FILE_SYNC(a);
  }
  try {
    var b = new c.global.XMLHttpRequest;
    b.open("get", a, !1);
    b.send();
    return 0 == b.status || 200 == b.status ? b.responseText : null;
  } catch (d) {
    return null;
  }
};
c.retrieveAndExec_ = function() {
};
c.transpile_ = function(a, b) {
  var d = c.global.$jscomp;
  d || (c.global.$jscomp = d = {});
  var e = d.transpile;
  if (!e) {
    var f = c.basePath + c.TRANSPILER, g = c.loadFileSync_(f);
    g && (eval(g + "\n//# sourceURL=" + f), d = c.global.$jscomp, e = d.transpile);
  }
  e || (e = d.transpile = function(a, b) {
    c.logToConsole_(b + " requires transpilation but no transpiler was found.");
    return a;
  });
  return e(a, b);
};
c.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var d = Object.prototype.toString.call(a);
      if ("[object Window]" == d) {
        return "object";
      }
      if ("[object Array]" == d || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == d || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
c.isNull = function(a) {
  return null === a;
};
c.isDefAndNotNull = function(a) {
  return null != a;
};
c.isArray = function(a) {
  return "array" == c.typeOf(a);
};
c.isArrayLike = function(a) {
  var b = c.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
c.isDateLike = function(a) {
  return c.isObject(a) && "function" == typeof a.getFullYear;
};
c.isString = function(a) {
  return "string" == typeof a;
};
c.isBoolean = function(a) {
  return "boolean" == typeof a;
};
c.isNumber = function(a) {
  return "number" == typeof a;
};
c.isFunction = function(a) {
  return "function" == c.typeOf(a);
};
c.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
c.getUid = function(a) {
  return a[c.UID_PROPERTY_] || (a[c.UID_PROPERTY_] = ++c.uidCounter_);
};
c.hasUid = function(a) {
  return !!a[c.UID_PROPERTY_];
};
c.removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(c.UID_PROPERTY_);
  try {
    delete a[c.UID_PROPERTY_];
  } catch (b) {
  }
};
c.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
c.uidCounter_ = 0;
c.getHashCode = c.getUid;
c.removeHashCode = c.removeUid;
c.cloneObject = function(a) {
  var b = c.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, d;
    for (d in a) {
      b[d] = c.cloneObject(a[d]);
    }
    return b;
  }
  return a;
};
c.bindNative_ = function(a, b, d) {
  return a.call.apply(a.bind, arguments);
};
c.bindJs_ = function(a, b, d) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var d = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(d, e);
      return a.apply(b, d);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
c.bind = function(a, b, d) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? c.bind = c.bindNative_ : c.bind = c.bindJs_;
  return c.bind.apply(null, arguments);
};
c.partial = function(a, b) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = d.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
c.mixin = function(a, b) {
  for (var d in b) {
    a[d] = b[d];
  }
};
c.now = c.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
c.globalEval = function(a) {
  if (c.global.execScript) {
    c.global.execScript(a, "JavaScript");
  } else {
    if (c.global.eval) {
      if (null == c.evalWorksForGlobals_) {
        if (c.global.eval("var _evalTest_ = 1;"), "undefined" != typeof c.global._evalTest_) {
          try {
            delete c.global._evalTest_;
          } catch (e) {
          }
          c.evalWorksForGlobals_ = !0;
        } else {
          c.evalWorksForGlobals_ = !1;
        }
      }
      if (c.evalWorksForGlobals_) {
        c.global.eval(a);
      } else {
        var b = c.global.document, d = b.createElement("SCRIPT");
        d.type = "text/javascript";
        d.defer = !1;
        d.appendChild(b.createTextNode(a));
        b.body.appendChild(d);
        b.body.removeChild(d);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
c.evalWorksForGlobals_ = null;
c.getCssName = function(a, b) {
  function d(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(e(a[d]));
    }
    return b.join("-");
  }
  function e(a) {
    return c.cssNameMapping_[a] || a;
  }
  if ("." == String(a).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
  }
  var f;
  f = c.cssNameMapping_ ? "BY_WHOLE" == c.cssNameMappingStyle_ ? e : d : function(a) {
    return a;
  };
  a = b ? a + "-" + f(b) : f(a);
  return c.global.CLOSURE_CSS_NAME_MAP_FN ? c.global.CLOSURE_CSS_NAME_MAP_FN(a) : a;
};
c.setCssNameMapping = function(a, b) {
  c.cssNameMapping_ = a;
  c.cssNameMappingStyle_ = b;
};
c.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, e) {
    return null != b && e in b ? b[e] : a;
  }));
  return a;
};
c.getMsgWithFallback = function(a) {
  return a;
};
c.exportSymbol = function(a, b, d) {
  c.exportPath_(a, b, d);
};
c.exportProperty = function(a, b, d) {
  a[b] = d;
};
c.inherits = function(a, b) {
  function d() {
  }
  d.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new d;
  a.prototype.constructor = a;
  a.base = function(a, d, g) {
    for (var l = Array(arguments.length - 2), n = 2;n < arguments.length;n++) {
      l[n - 2] = arguments[n];
    }
    return b.prototype[d].apply(a, l);
  };
};
c.base = function(a, b, d) {
  var e = arguments.callee.caller;
  if (c.STRICT_MODE_COMPATIBLE || c.DEBUG && !e) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (e.superClass_) {
    for (var f = Array(arguments.length - 1), g = 1;g < arguments.length;g++) {
      f[g - 1] = arguments[g];
    }
    return e.superClass_.constructor.apply(a, f);
  }
  f = Array(arguments.length - 2);
  for (g = 2;g < arguments.length;g++) {
    f[g - 2] = arguments[g];
  }
  for (var g = !1, l = a.constructor;l;l = l.superClass_ && l.superClass_.constructor) {
    if (l.prototype[b] === e) {
      g = !0;
    } else {
      if (g) {
        return l.prototype[b].apply(a, f);
      }
    }
  }
  if (a[b] === e) {
    return a.constructor.prototype[b].apply(a, f);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
c.scope = function(a) {
  if (c.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  a.call(c.global);
};
c.defineClass = function(a, b) {
  var d = b.constructor, e = b.statics;
  d && d != Object.prototype.constructor || (d = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  d = c.defineClass.createSealingConstructor_(d, a);
  a && c.inherits(d, a);
  delete b.constructor;
  delete b.statics;
  c.defineClass.applyProperties_(d.prototype, b);
  null != e && (e instanceof Function ? e(d) : c.defineClass.applyProperties_(d, e));
  return d;
};
c.defineClass.SEAL_CLASS_INSTANCES = c.DEBUG;
c.defineClass.createSealingConstructor_ = function(a, b) {
  function d() {
    var b = a.apply(this, arguments) || this;
    b[c.UID_PROPERTY_] = b[c.UID_PROPERTY_];
    this.constructor === d && e && Object.seal instanceof Function && Object.seal(b);
    return b;
  }
  if (!c.defineClass.SEAL_CLASS_INSTANCES) {
    return a;
  }
  var e = !c.defineClass.isUnsealable_(b);
  return d;
};
c.defineClass.isUnsealable_ = function(a) {
  return a && a.prototype && a.prototype[c.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
c.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
c.defineClass.applyProperties_ = function(a, b) {
  for (var d in b) {
    Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
  }
  for (var e = 0;e < c.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;e++) {
    d = c.defineClass.OBJECT_PROTOTYPE_FIELDS_[e], Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
  }
};
c.tagUnsealableClass = function() {
};
c.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
var k = {getFullyQualifedName:function(a) {
  for (var b = a.name;a.parent && "MemberExpression" == a.parent.type;) {
    a = a.parent, b += "." + a.property.name;
  }
  return b;
}};
c.object = {};
c.object.is = function(a, b) {
  return a === b ? 0 !== a || 1 / a === 1 / b : a !== a && b !== b;
};
c.object.forEach = function(a, b, d) {
  for (var e in a) {
    b.call(d, a[e], e, a);
  }
};
c.object.filter = function(a, b, d) {
  var e = {}, f;
  for (f in a) {
    b.call(d, a[f], f, a) && (e[f] = a[f]);
  }
  return e;
};
c.object.map = function(a, b, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = b.call(d, a[f], f, a);
  }
  return e;
};
c.object.some = function(a, b, d) {
  for (var e in a) {
    if (b.call(d, a[e], e, a)) {
      return !0;
    }
  }
  return !1;
};
c.object.every = function(a, b, d) {
  for (var e in a) {
    if (!b.call(d, a[e], e, a)) {
      return !1;
    }
  }
  return !0;
};
c.object.getCount = function(a) {
  var b = 0, d;
  for (d in a) {
    b++;
  }
  return b;
};
c.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
c.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
c.object.contains = function(a, b) {
  return c.object.containsValue(a, b);
};
c.object.getValues = function(a) {
  var b = [], d = 0, e;
  for (e in a) {
    b[d++] = a[e];
  }
  return b;
};
c.object.getKeys = function(a) {
  var b = [], d = 0, e;
  for (e in a) {
    b[d++] = e;
  }
  return b;
};
c.object.getValueByKeys = function(a, b) {
  for (var d = c.isArrayLike(b), e = d ? b : arguments, d = d ? 0 : 1;d < e.length && (a = a[e[d]], c.isDef(a));d++) {
  }
  return a;
};
c.object.containsKey = function(a, b) {
  return null !== a && b in a;
};
c.object.containsValue = function(a, b) {
  for (var d in a) {
    if (a[d] == b) {
      return !0;
    }
  }
  return !1;
};
c.object.findKey = function(a, b, d) {
  for (var e in a) {
    if (b.call(d, a[e], e, a)) {
      return e;
    }
  }
};
c.object.findValue = function(a, b, d) {
  return (b = c.object.findKey(a, b, d)) && a[b];
};
c.object.isEmpty = function(a) {
  for (var b in a) {
    return !1;
  }
  return !0;
};
c.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
c.object.remove = function(a, b) {
  var d;
  (d = b in a) && delete a[b];
  return d;
};
c.object.add = function(a, b, d) {
  if (null !== a && b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  c.object.set(a, b, d);
};
c.object.get = function(a, b, d) {
  return null !== a && b in a ? a[b] : d;
};
c.object.set = function(a, b, d) {
  a[b] = d;
};
c.object.setIfUndefined = function(a, b, d) {
  return b in a ? a[b] : a[b] = d;
};
c.object.setWithReturnValueIfNotSet = function(a, b, d) {
  if (b in a) {
    return a[b];
  }
  d = d();
  return a[b] = d;
};
c.object.equals = function(a, b) {
  for (var d in a) {
    if (!(d in b) || a[d] !== b[d]) {
      return !1;
    }
  }
  for (d in b) {
    if (!(d in a)) {
      return !1;
    }
  }
  return !0;
};
c.object.clone = function(a) {
  var b = {}, d;
  for (d in a) {
    b[d] = a[d];
  }
  return b;
};
c.object.unsafeClone = function(a) {
  var b = c.typeOf(a);
  if ("object" == b || "array" == b) {
    if (c.isFunction(a.clone)) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, d;
    for (d in a) {
      b[d] = c.object.unsafeClone(a[d]);
    }
    return b;
  }
  return a;
};
c.object.transpose = function(a) {
  var b = {}, d;
  for (d in a) {
    b[a[d]] = d;
  }
  return b;
};
c.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
c.object.extend = function(a, b) {
  for (var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (d in e) {
      a[d] = e[d];
    }
    for (var g = 0;g < c.object.PROTOTYPE_FIELDS_.length;g++) {
      d = c.object.PROTOTYPE_FIELDS_[g], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }
};
c.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && c.isArray(arguments[0])) {
    return c.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var d = {}, e = 0;e < b;e += 2) {
    d[arguments[e]] = arguments[e + 1];
  }
  return d;
};
c.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && c.isArray(arguments[0])) {
    return c.object.createSet.apply(null, arguments[0]);
  }
  for (var d = {}, e = 0;e < b;e++) {
    d[arguments[e]] = !0;
  }
  return d;
};
c.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
c.object.isImmutableView = function(a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
var r = require("lodash.ismatchwith");
function t(a) {
  return function(b) {
    return v(b, a);
  };
}
function v(a, b) {
  var d = {};
  return r(a, b, function(a, b) {
    if ("function" === typeof b) {
      return a = b(a), "object" === typeof a && c.object.extend(d, a), a;
    }
  }) ? d : !1;
}
var A = {extractAST:function(a, b) {
  return function(d) {
    var e = {}, e = (e[a] = d, e);
    "object" === typeof b && (b = t(b));
    if ("function" === typeof b) {
      d = b(d);
      if ("object" === typeof d) {
        return c.object.extend(e, d), e;
      }
      if (!d) {
        return !1;
      }
    }
    return e;
  };
}, isASTMatch:v, matchesAST:t, matchesASTLength:function(a) {
  var b = t(a);
  return function(d) {
    return d.length !== a.length ? !1 : b(d);
  };
}};
var B = {matchExtractBareGoogRequire:function(a) {
  return A.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"require"}}, arguments:[{type:"Literal", value:function(a) {
    return "string" === typeof a && A.extractAST("source")(a);
  }}]}});
}, matchExtractGoogProvide:function(a) {
  return A.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"provide"}}, arguments:[{type:"Literal", value:function(a) {
    return "string" === typeof a && A.extractAST("source")(a);
  }}]}});
}, matchStringLiteral:function(a) {
  return A.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a;
  }});
}};
var E = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function K(a, b) {
  return a.loc.end.line === b.loc.start.line;
}
var L = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? E.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? E.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? E.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? E.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? E.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? E.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? E.UnderscoreForm.TRAILING : E.UnderscoreForm.MIDDLE;
}, getNodeAncestorOfType:function(a, b) {
  for (a = a.parent;a.type !== b && "Program" !== a.type;) {
    a = a.parent;
  }
  return a.type === b ? a : null;
}, isUnderscored:function(a) {
  return -1 < a.indexOf("_");
}, isNodeConstructorFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "MethodDefinition" === a.parent.type && "constructor" === a.parent.kind;
}, isNodeClassType:function(a) {
  return "ClassExpression" === a.type || "ClassDeclaration" === a.type;
}, isNodeGetterFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "Property" === a.parent.type && "get" === a.parent.kind;
}, isNodeOneLine:function(a) {
  return K(a, a);
}, isNodeSetterFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "Property" === a.parent.type && "set" === a.parent.kind;
}, isValidPrefix:function(a, b) {
  return a.startsWith(b) ? a === b || "." === a[b.length] : !1;
}, nodesEndOnSameLine:function(a, b) {
  return a.loc.end.line === b.loc.end.line;
}, nodesShareOneLine:K, nodesStartOnSameLine:function(a, b) {
  return a.loc.start.line === b.loc.start.line;
}};
var M = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function N(a, b) {
  function d(a) {
    return Object.assign(g, {message:a});
  }
  function e(e, g) {
    return O(e, a, b) ? f : d(g);
  }
  var f = {node:a, message:"", hasError:!1}, g = {node:a, message:"", hasError:!0};
  switch(L.categorizeUnderscoredIdentifier(a.name)) {
    case E.UnderscoreForm.CONSTANT:
      return f;
    case E.UnderscoreForm.LEADING:
      return b.allowLeadingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : d("Leading underscores are not allowed in '" + a.name + "'.");
    case E.UnderscoreForm.NO_UNDERSCORE:
      return f;
    case E.UnderscoreForm.MIDDLE:
      return e(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case E.UnderscoreForm.OPT_PREFIX:
      return b.allowOptPrefix ? e(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : d("The opt_ prefix is not allowed in '" + a.name + "'.");
    case E.UnderscoreForm.TRAILING:
      return b.allowTrailingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : d("Trailing underscores are not allowed in '" + a.name + "'.");
    case E.UnderscoreForm.VAR_ARGS:
      return b.allowVarArgs ? f : d("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);;
  }
}
function O(a, b, d) {
  var e = b.parent;
  if (!L.isUnderscored(a)) {
    return !0;
  }
  switch(e.type) {
    case "MemberExpression":
      e = b.parent;
      if (!d.checkObjectProperties) {
        return !0;
      }
      if (e.property === b) {
        return e.parent && "AssignmentExpression" === e.parent.type ? e.parent.right === e : !0;
      }
      break;
    case "Property":
      e = b.parent;
      if (!d.checkObjectProperties || e.parent && "ObjectPattern" === e.parent.type && e.key === b && e.value !== b) {
        return !0;
      }
      break;
    case "CallExpression":
      return !0;
  }
  return !1;
}
;function P(a, b, d, e) {
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
  return {space:b, tab:a, goodChar:"space" === d ? b : a, badChar:"space" === d ? a : b};
}
function Q(a, b, d) {
  b = !0 === d ? b.getLastToken(a, 1) : b.getTokenBefore(a);
  return (!0 === d ? a.loc.end.line : a.loc.start.line) !== (b ? b.loc.end.line : -1);
}
function V(a, b) {
  return !!b && b.parent.loc.start.line === a.loc.start.line && 1 < b.parent.declarations.length;
}
function aa(a) {
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
function ba(a) {
  return a.declarations.reduce(function(b, d) {
    var e = b[b.length - 1];
    (d.loc.start.line !== a.loc.start.line && !e || e && e.loc.start.line !== d.loc.start.line) && b.push(d);
    return b;
  }, []);
}
function ca(a) {
  var b = {indentSize:4, indentType:"space", indentOptions:{SwitchCase:0, VariableDeclarator:{var:1, let:1, const:1}, outerIIFEBody:-1, MemberExpression:-1, FunctionDeclaration:{parameters:-1, body:1}, FunctionExpression:{parameters:-1, body:1}}}, d = b.indentOptions;
  if (a.length && ("tab" === a[0] ? (b.indentSize = 1, b.indentType = "tab") : "number" === typeof a[0] && (b.indentSize = a[0], b.indentType = "space"), a[1])) {
    a = a[1];
    d.SwitchCase = a.SwitchCase || 0;
    if ("number" === typeof a.VariableDeclarator) {
      var e = a.VariableDeclarator;
      d.VariableDeclarator = {var:e, let:e, const:e};
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
;function W(a) {
  return "NullableLiteral" === a.type || "AllLiteral" === a.type || "NullLiteral" === a.type || "UndefinedLiteral" === a.type || "VoidLiteral" === a.type || "StringLiteralType" === a.type || "NumericLiteralType" === a.type;
}
function da(a) {
  return W(a) || "NameExpression" === a.type;
}
function X(a, b) {
  b(a);
  if (!da(a)) {
    switch(a.type) {
      case "ArrayType":
        a.elements.forEach(function(a) {
          return X(a, b);
        });
        break;
      case "RecordType":
        a.fields.forEach(function(a) {
          return X(a, b);
        });
        break;
      case "FunctionType":
        a.params.forEach(function(a) {
          return X(a, b);
        });
        a.result && X(a.result, b);
        a.this && X(a.this, b);
        break;
      case "FieldType":
        a.value && X(a.value, b);
        break;
      case "ParameterType":
      ;
      case "RestType":
      ;
      case "NonNullableType":
      ;
      case "OptionalType":
      ;
      case "NullableType":
        X(a.expression, b);
        break;
      case "TypeApplication":
        X(a.expression, b);
        a.applications.forEach(function(a) {
          return X(a, b);
        });
        break;
      case "UnionType":
        a.elements.forEach(function(a) {
          return X(a, b);
        });
        break;
      default:
        throw Error("Unrecoginized tag type.");;
    }
  }
}
var Y = {isLiteral:W, traverseJSDocTagTypes:X};
var ea = require("doctrine");
function Z(a) {
  return null === a.type || a.type.name && "void" === a.type.name || "UndefinedLiteral" === a.type.type;
}
;module.exports = {rules:{camelcase:{meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = Object.assign({}, M, a.options[0] || {});
  return {Identifier:function(d) {
    d = N(d, b);
    d.hasError && a.report({node:d.node, message:d.message});
  }};
}}, indent:{meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", minimum:0}, 
MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:!1}]}, create:function(a) {
  function b(a, b, d) {
    var e = "space" + (1 === b ? "" : "s"), f = "tab" + (1 === d ? "" : "s");
    return "Expected indentation of " + (a + " " + p + (1 === a ? "" : "s")) + " but" + (" found " + (0 < b && 0 < d ? b + " " + e + " and " + (d + " " + f) : 0 < b ? "space" === p ? b : b + " " + e : 0 < d ? "tab" === p ? d : d + " " + f : "0") + ".");
  }
  function d(d, e, f, g, m, h) {
    var l = ("space" === p ? " " : "\t").repeat(e), I = h ? [d.range[1] - f - g - 1, d.range[1] - 1] : [d.range[0] - f - g, d.range[0]];
    a.report({node:d, loc:m, message:b(e, f, g), fix:function(a) {
      return a.replaceTextRange(I, l);
    }});
  }
  function e(a, b) {
    var e = P(a, h, p, !1);
    "ArrayExpression" === a.type || "ObjectExpression" === a.type || e.goodChar === b && 0 === e.badChar || !Q(a, h) || d(a, b, e.space, e.tab);
  }
  function f(a, b) {
    a.forEach(function(a) {
      return e(a, b);
    });
  }
  function g(a, b) {
    var e = h.getLastToken(a), f = P(e, h, p, !0);
    f.goodChar === b && 0 === f.badChar || !Q(a, h, !0) || d(a, b, f.space, f.tab, {start:{line:e.loc.start.line, column:e.loc.start.column}}, !0);
  }
  function l(a) {
    var b = P(a, h, p).goodChar, d = a.parent;
    if ("Property" === d.type || "ArrayExpression" === d.type) {
      b = P(a, h, p, !1).goodChar;
    } else {
      if ("CallExpression" === d.type) {
        var e;
        e = 1 <= d.arguments.length ? d.arguments[0].loc.end.line > d.arguments[0].loc.start.line : !1;
        e && L.isNodeOneLine(d.callee) && !Q(a, h) && (b = P(d, h, p).goodChar);
      }
    }
    return b;
  }
  function n(a) {
    var b = a.body, d = l(a), e = m, f;
    if (f = -1 !== q.outerIIFEBody) {
      if (aa(a)) {
        f = !0;
      } else {
        var g = a.parent;
        f = g.parent;
        if ("CallExpression" !== g.type || g.callee !== a) {
          f = !1;
        } else {
          for (;"UnaryExpression" === f.type || "AssignmentExpression" === f.type || "LogicalExpression" === f.type || "SequenceExpression" === f.type || "VariableDeclarator" === f.type;) {
            if ("UnaryExpression" === f.type) {
              if (g = f, "!" === g.operator || "~" === g.operator || "+" === g.operator || "-" === g.operator) {
                f = f.parent;
              } else {
                break;
              }
            } else {
              f = f.parent;
            }
          }
          f = ("ExpressionStatement" === f.type || "VariableDeclaration" === f.type) && f.parent && "Program" === f.parent.type;
        }
      }
    }
    f ? e = q.outerIIFEBody * m : "FunctionExpression" === a.type ? e = q.FunctionExpression.body * m : "FunctionDeclaration" === a.type && (e = q.FunctionDeclaration.body * m);
    d += e;
    (f = L.getNodeAncestorOfType(a, "VariableDeclarator")) && V(a, f) && (d += m * q.VariableDeclarator[f.parent.kind]);
    z(b, d, d - e);
  }
  function w(a) {
    if (!L.isNodeOneLine(a)) {
      var b = a.body;
      a = l(a);
      z(b, a + m, a);
    }
  }
  function u(a) {
    var b = a.parent, e = L.getNodeAncestorOfType(a, "VariableDeclarator"), f = P(b, h, p).goodChar;
    if (Q(a, h)) {
      if (e) {
        if (b === e) {
          e === e.parent.declarations[0] && (f += m * q.VariableDeclarator[e.parent.kind]);
        } else {
          if ("ObjectExpression" === b.type || "ArrayExpression" === b.type || "CallExpression" === b.type || "ArrowFunctionExpression" === b.type || "NewExpression" === b.type || "LogicalExpression" === b.type) {
            f += m;
          }
        }
      } else {
        var g;
        g = "ArrayExpression" !== b.type ? !1 : b.elements[0] ? "ObjectExpression" === b.elements[0].type && b.elements[0].loc.start.line === b.loc.start.line : !1;
        g || "MemberExpression" === b.type || "ExpressionStatement" === b.type || "AssignmentExpression" === b.type || "Property" === b.type || (f += m);
      }
      b = f + m;
      g = P(a, h, p, !1);
      g.goodChar === f && 0 === g.badChar || !Q(a, h) || d(a, f, g.space, g.tab, {start:{line:a.loc.start.line, column:a.loc.start.column}});
    } else {
      f = P(a, h, p).goodChar, b = f + m;
    }
    V(a, e) && (b += m * q.VariableDeclarator[e.parent.kind]);
    return b;
  }
  function z(a, b, d) {
    L.isNodeOneLine(a) || (f(a.body, b), g(a, d));
  }
  function x(a) {
    var b = P(a, h, p).goodChar, d = b + m;
    "BlockStatement" === a.body.type ? z(a.body, d, b) : f([a.body], d);
  }
  function D(a, b, d) {
    "first" === d && a.params.length ? f(a.params.slice(1), a.params[0].loc.start.column) : f(a.params, b * d);
  }
  function y(a, b) {
    a = "SwitchStatement" === a.type ? a : a.parent;
    if (J[a.loc.start.line]) {
      return J[a.loc.start.line];
    }
    "undefined" === typeof b && (b = P(a, h, p).goodChar);
    b = 0 < a.cases.length && 0 === q.SwitchCase ? b : b + m * q.SwitchCase;
    return J[a.loc.start.line] = b;
  }
  var C = ca(a.options), p = C.indentType, m = C.indentSize, q = C.indentOptions, h = a.getSourceCode(), J = {};
  return {Program:function(a) {
    f(a.body, 0);
  }, ClassDeclaration:w, ClassExpression:w, BlockStatement:function(a) {
    if (!L.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = P(a, h, p).goodChar;
      z(a, b + m, b);
    }
  }, DoWhileStatement:x, ForStatement:x, ForInStatement:x, ForOfStatement:x, WhileStatement:x, WithStatement:x, IfStatement:function(a) {
    var b = P(a, h, p).goodChar, d = b + m;
    "BlockStatement" !== a.consequent.type ? L.nodesStartOnSameLine(a, a.consequent) || e(a.consequent, d) : (f(a.consequent.body, d), g(a.consequent, b));
    if (a.alternate) {
      var l = h.getTokenBefore(a.alternate);
      e(l, b);
      "BlockStatement" !== a.alternate.type ? L.nodesStartOnSameLine(a.alternate, l) || e(a.alternate, d) : (f(a.alternate.body, d), g(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!L.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = ba(a), d = P(a, h, p).goodChar, e = b[b.length - 1], d = d + m * q.VariableDeclarator[a.kind];
      f(b, d);
      h.getLastToken(a).loc.end.line <= e.loc.end.line || (b = h.getTokenBefore(e), "," === b.value ? g(a, P(b, h, p).goodChar) : g(a, d - m));
    }
  }, ObjectExpression:function(a) {
    if (!L.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && L.nodesStartOnSameLine(b[0], a))) {
        var d = u(a);
        f(b, d);
        g(a, d - m);
      }
    }
  }, ArrayExpression:function(a) {
    if (!L.isNodeOneLine(a)) {
      var b = a.elements.filter(function(a) {
        return null !== a;
      });
      if (!(0 < b.length && L.nodesStartOnSameLine(b[0], a))) {
        var d = u(a);
        f(b, d);
        g(a, d - m);
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== q.MemberExpression && !L.isNodeOneLine(a) && !L.getNodeAncestorOfType(a, "VariableDeclarator") && !L.getNodeAncestorOfType(a, "AssignmentExpression")) {
      var b = P(a, h, p).goodChar + m * q.MemberExpression, d = [a.property];
      a = h.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && d.push(a);
      f(d, b);
    }
  }, SwitchStatement:function(a) {
    var b = P(a, h, p).goodChar, d = y(a, b);
    f(a.cases, d);
    g(a, b);
  }, SwitchCase:function(a) {
    if (!L.isNodeOneLine(a)) {
      var b = y(a);
      f(a.consequent, b + m);
    }
  }, ArrowFunctionExpression:function(a) {
    L.isNodeOneLine(a) || "BlockStatement" === a.body.type && n(a);
  }, FunctionDeclaration:function(a) {
    L.isNodeOneLine(a) || (-1 !== q.FunctionDeclaration.parameters && D(a, m, q.FunctionDeclaration.parameters), n(a));
  }, FunctionExpression:function(a) {
    L.isNodeOneLine(a) || (-1 !== q.FunctionExpression.parameters && D(a, m, q.FunctionExpression.parameters), n(a));
  }};
}}, "inline-comment-spacing":{meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var b = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(d) {
    var e = a.getSourceCode();
    e.getComments(d);
    e = e.getTokenBefore(d, 1) || e.getTokenOrCommentBefore(d);
    if (null != e && L.nodesShareOneLine(d, e)) {
      var f = d.start - e.end;
      f < b && a.report({node:d, message:"Expected at least " + b + " " + (1 === b ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var e = Array(b - f + 1).join(" ");
        return a.insertTextBefore(d, e);
      }});
    }
  }};
}}, jsdoc:{meta:{docs:{description:"enforce valid JSDoc comments", category:"Possible Errors", recommended:!0}, schema:[{type:"object", properties:{prefer:{type:"object", additionalProperties:{type:"string"}}, preferType:{type:"object", additionalProperties:{type:"string"}}, requireReturn:{type:"boolean"}, requireParamDescription:{type:"boolean"}, requireReturnDescription:{type:"boolean"}, matchDescription:{type:"string"}, requireReturnType:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  function b(a) {
    g.push({returnPresent:"ArrowFunctionExpression" === a.type && "BlockStatement" !== a.body.type || L.isNodeClassType(a)});
  }
  function d(b, d) {
    Y.traverseJSDocTagTypes(d, function(d) {
      if ("NameExpression" === d.type) {
        d = d.name;
        var e = y[d];
        e && a.report({node:b, message:"Use '" + e + "' instead of '" + d + "'."});
      }
    });
  }
  function e(b, d) {
    var e = b.map(function(a) {
      return a;
    });
    Y.traverseJSDocTagTypes(d, function(b) {
      "NameExpression" === b.type && (b = d.name, "nonsense" == e && a.markVariableAsUsed(b));
    });
  }
  function f(b) {
    var f = l.getJSDocComment(b), q = g.pop(), h = Object.create(null), y = a.getScope(), R = !1, S = !1, T = !1, F = !1, U = !1, G;
    if (f) {
      try {
        G = ea.parse(f.value, {strict:!0, unwrap:!0, sloppy:!0});
      } catch (I) {
        /braces/i.test(I.message) ? a.report({node:f, message:"JSDoc type missing brace."}) : a.report({node:f, message:"JSDoc syntax error."});
        return;
      }
      G.tags.forEach(function(b) {
        switch(b.title.toLowerCase()) {
          case "param":
          ;
          case "arg":
          ;
          case "argument":
            b.type || a.report({node:f, message:"Missing JSDoc parameter type for '" + b.name + "'."});
            !b.description && z && a.report({node:f, message:"Missing JSDoc parameter description for " + ("'" + b.name + "'.")});
            h[b.name] ? a.report({node:f, message:"Duplicate JSDoc parameter '" + b.name + "'."}) : -1 === b.name.indexOf(".") && (h[b.name] = 1);
            break;
          case "return":
          ;
          case "returns":
            R = !0;
            u || q.returnPresent || null !== b.type && Z(b) || U ? (D && !b.type && a.report({node:f, message:"Missing JSDoc return type."}), Z(b) || b.description || !x || a.report({node:f, message:"Missing JSDoc return description."})) : a.report({node:f, message:"Unexpected @{{title}} tag; function has no return statement.", data:{title:b.title}});
            break;
          case "constructor":
          ;
          case "class":
            S = !0;
            break;
          case "override":
          ;
          case "inheritdoc":
            F = !0;
            break;
          case "abstract":
          ;
          case "virtual":
            U = !0;
            break;
          case "interface":
            T = !0;
        }
        w.hasOwnProperty(b.title) && b.title !== w[b.title] && a.report({node:f, message:"Use @{{name}} instead.", data:{name:w[b.title]}});
        b.type && e(y.through, b.type);
        C && b.type && d(f, b.type);
      });
      F || R || S || T || L.isNodeGetterFunction(b) || L.isNodeSetterFunction(b) || L.isNodeConstructorFunction(b) || L.isNodeClassType(b) || (u || q.returnPresent) && a.report({node:f, message:"Missing JSDoc @{{returns}} for function.", data:{returns:w.returns || "returns"}});
      var H = Object.keys(h);
      b.params && b.params.forEach(function(b, d) {
        "AssignmentPattern" === b.type && (b = b.left);
        var e = b.name;
        "Identifier" === b.type && (H[d] && e !== H[d] ? a.report({node:f, message:"Expected JSDoc for '" + e + "' but found " + ("'" + H[d] + "'.")}) : h[e] || F || a.report({node:f, message:"Missing JSDoc for parameter '" + e + "'."}));
      });
      n.matchDescription && ((new RegExp(n.matchDescription)).test(G.description) || a.report({node:f, message:"JSDoc description does not satisfy the regex pattern."}));
    }
  }
  var g = [], l = a.getSourceCode(), n = a.options[0] || {}, w = n.prefer || {}, u = !1 !== n.requireReturn, z = !1 !== n.requireParamDescription, x = !1 !== n.requireReturnDescription, D = !1 !== n.requireReturnType, y = n.preferType || {}, C = 0 !== Object.keys(y).length;
  return {ArrowFunctionExpression:b, FunctionExpression:b, FunctionDeclaration:b, ClassExpression:b, ClassDeclaration:b, "ArrowFunctionExpression:exit":f, "FunctionExpression:exit":f, "FunctionDeclaration:exit":f, "ClassExpression:exit":f, "ClassDeclaration:exit":f, ReturnStatement:function(a) {
    var b = g[g.length - 1];
    b && null !== a.argument && (b.returnPresent = !0);
  }};
}}, "no-undef":{meta:{docs:{description:"disallow the use of undeclared variables unless mentioned in `/*global */` comments", category:"Variables", recommended:!0}, schema:[{type:"object", properties:{typeof:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = a.options[0], d = b && !0 === b.typeof || !1, e = [], f = [];
  return {Program:function(a) {
    e = a.body.map(B.matchExtractBareGoogRequire).filter(function(a) {
      return !!a;
    }).map(function(a) {
      return a.source;
    });
    f = a.body.map(B.matchExtractGoogProvide).filter(function(a) {
      return !!a;
    }).map(function(a) {
      return a.source;
    });
  }, "Program:exit":function() {
    function b(a) {
      return e.some(function(b) {
        return L.isValidPrefix(a, b);
      });
    }
    function l(a) {
      return f.some(function(b) {
        return L.isValidPrefix(a, b);
      });
    }
    a.getScope().through.forEach(function(e) {
      e = e.identifier;
      var f = k.getFullyQualifedName(e), u;
      if (u = !d) {
        u = e.parent, u = "UnaryExpression" === u.type && "typeof" === u.operator;
      }
      u || l(f) || b(f) || a.report({node:e, message:"'" + e.name + "' is not defined."});
    });
  }};
}}}};

