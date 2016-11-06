'use strict';var c = {scope:{}};
c.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, d) {
  if (d.get || d.set) {
    throw new TypeError("ES3 does not support getters and setters.");
  }
  a != Array.prototype && a != Object.prototype && (a[b] = d.value);
};
c.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
c.global = c.getGlobal(this);
c.SYMBOL_PREFIX = "jscomp_symbol_";
c.initSymbol = function() {
  c.initSymbol = function() {
  };
  c.global.Symbol || (c.global.Symbol = c.Symbol);
};
c.symbolCounter_ = 0;
c.Symbol = function(a) {
  return c.SYMBOL_PREFIX + (a || "") + c.symbolCounter_++;
};
c.initSymbolIterator = function() {
  c.initSymbol();
  var a = c.global.Symbol.iterator;
  a || (a = c.global.Symbol.iterator = c.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && c.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return c.arrayIterator(this);
  }});
  c.initSymbolIterator = function() {
  };
};
c.arrayIterator = function(a) {
  var b = 0;
  return c.iteratorPrototype(function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  });
};
c.iteratorPrototype = function(a) {
  c.initSymbolIterator();
  a = {next:a};
  a[c.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
c.makeIterator = function(a) {
  c.initSymbolIterator();
  var b = a[Symbol.iterator];
  return b ? b.call(a) : c.arrayIterator(a);
};
var q = q || {};
q.global = this;
q.isDef = function(a) {
  return void 0 !== a;
};
q.exportPath_ = function(a, b, d) {
  a = a.split(".");
  d = d || q.global;
  a[0] in d || !d.execScript || d.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    !a.length && q.isDef(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {};
  }
};
q.define = function(a, b) {
  q.exportPath_(a, b);
};
q.DEBUG = !0;
q.LOCALE = "en";
q.TRUSTED_SITE = !0;
q.STRICT_MODE_COMPATIBLE = !1;
q.DISALLOW_TEST_ONLY_CODE = !q.DEBUG;
q.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
q.provide = function(a) {
  if (q.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  q.constructNamespace_(a);
};
q.constructNamespace_ = function(a, b) {
  q.exportPath_(a, b);
};
q.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
q.module = function(a) {
  if (!q.isString(a) || !a || -1 == a.search(q.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!q.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (q.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  q.moduleLoaderState_.moduleName = a;
};
q.module.get = function(a) {
  return q.module.getInternal_(a);
};
q.module.getInternal_ = function() {
};
q.moduleLoaderState_ = null;
q.isInModuleLoader_ = function() {
  return null != q.moduleLoaderState_;
};
q.module.declareLegacyNamespace = function() {
  q.moduleLoaderState_.declareLegacyNamespace = !0;
};
q.setTestOnly = function(a) {
  if (q.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
q.forwardDeclare = function() {
};
q.getObjectByName = function(a, b) {
  a = a.split(".");
  b = b || q.global;
  for (var d;d = a.shift();) {
    if (q.isDefAndNotNull(b[d])) {
      b = b[d];
    } else {
      return null;
    }
  }
  return b;
};
q.globalize = function(a, b) {
  b = b || q.global;
  for (var d in a) {
    b[d] = a[d];
  }
};
q.addDependency = function(a, b, d, e) {
  if (q.DEPENDENCIES_ENABLED) {
    var f;
    a = a.replace(/\\/g, "/");
    var g = q.dependencies_;
    e && "boolean" !== typeof e || (e = e ? {module:"goog"} : {});
    for (var h = 0;f = b[h];h++) {
      g.nameToPath[f] = a, g.loadFlags[a] = e;
    }
    for (e = 0;b = d[e];e++) {
      a in g.requires || (g.requires[a] = {}), g.requires[a][b] = !0;
    }
  }
};
q.ENABLE_DEBUG_LOADER = !0;
q.logToConsole_ = function(a) {
  q.global.console && q.global.console.error(a);
};
q.require = function() {
};
q.basePath = "";
q.nullFunction = function() {
};
q.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
q.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    q.DEBUG && (q.instantiatedSingletons_[q.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
q.instantiatedSingletons_ = [];
q.LOAD_MODULE_USING_EVAL = !0;
q.SEAL_MODULE_EXPORTS = q.DEBUG;
q.loadedModules_ = {};
q.DEPENDENCIES_ENABLED = !1;
q.TRANSPILE = "detect";
q.TRANSPILER = "transpile.js";
q.DEPENDENCIES_ENABLED && (q.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, q.inHtmlDocument_ = function() {
  var a = q.global.document;
  return null != a && "write" in a;
}, q.findBasePath_ = function() {
  if (q.isDef(q.global.CLOSURE_BASE_PATH)) {
    q.basePath = q.global.CLOSURE_BASE_PATH;
  } else {
    if (q.inHtmlDocument_()) {
      for (var a = q.global.document.getElementsByTagName("SCRIPT"), b = a.length - 1;0 <= b;--b) {
        var d = a[b].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if ("base.js" == d.substr(e - 7, 7)) {
          q.basePath = d.substr(0, e - 7);
          break;
        }
      }
    }
  }
}, q.importScript_ = function(a, b) {
  (q.global.CLOSURE_IMPORT_SCRIPT || q.writeScriptTag_)(a, b) && (q.dependencies_.written[a] = !0);
}, q.IS_OLD_IE_ = !(q.global.atob || !q.global.document || !q.global.document.all), q.importProcessedScript_ = function(a, b, d) {
  q.importScript_("", 'goog.retrieveAndExec_("' + a + '", ' + b + ", " + d + ");");
}, q.queuedModules_ = [], q.wrapModule_ = function(a, b) {
  return q.LOAD_MODULE_USING_EVAL && q.isDef(q.global.JSON) ? "goog.loadModule(" + q.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, q.loadQueuedModules_ = function() {
  var a = q.queuedModules_.length;
  if (0 < a) {
    var b = q.queuedModules_;
    q.queuedModules_ = [];
    for (var d = 0;d < a;d++) {
      q.maybeProcessDeferredPath_(b[d]);
    }
  }
}, q.maybeProcessDeferredDep_ = function(a) {
  q.isDeferredModule_(a) && q.allDepsAreAvailable_(a) && (a = q.getPathFromDeps_(a), q.maybeProcessDeferredPath_(q.basePath + a));
}, q.isDeferredModule_ = function(a) {
  var b = (a = q.getPathFromDeps_(a)) && q.dependencies_.loadFlags[a] || {};
  return a && ("goog" == b.module || q.needsTranspile_(b.lang)) ? q.basePath + a in q.dependencies_.deferred : !1;
}, q.allDepsAreAvailable_ = function(a) {
  if ((a = q.getPathFromDeps_(a)) && a in q.dependencies_.requires) {
    for (var b in q.dependencies_.requires[a]) {
      if (!q.isProvided_(b) && !q.isDeferredModule_(b)) {
        return !1;
      }
    }
  }
  return !0;
}, q.maybeProcessDeferredPath_ = function(a) {
  if (a in q.dependencies_.deferred) {
    var b = q.dependencies_.deferred[a];
    delete q.dependencies_.deferred[a];
    q.globalEval(b);
  }
}, q.loadModuleFromUrl = function(a) {
  q.retrieveAndExec_(a, !0, !1);
}, q.writeScriptSrcNode_ = function(a) {
  q.global.document.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
}, q.appendScriptSrcNode_ = function(a) {
  var b = q.global.document, d = b.createElement("script");
  d.type = "text/javascript";
  d.src = a;
  d.defer = !1;
  d.async = !1;
  b.head.appendChild(d);
}, q.writeScriptTag_ = function(a, b) {
  if (q.inHtmlDocument_()) {
    var d = q.global.document;
    if (!q.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == d.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    void 0 === b ? q.IS_OLD_IE_ ? (b = " onreadystatechange='goog.onScriptLoad_(this, " + ++q.lastNonModuleScriptIndex_ + ")' ", d.write('<script type="text/javascript" src="' + a + '"' + b + ">\x3c/script>")) : q.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? q.appendScriptSrcNode_(a) : q.writeScriptSrcNode_(a) : d.write('<script type="text/javascript">' + b + "\x3c/script>");
    return !0;
  }
  return !1;
}, q.needsTranspile_ = function(a) {
  if ("always" == q.TRANSPILE) {
    return !0;
  }
  if ("never" == q.TRANSPILE) {
    return !1;
  }
  if (!q.transpiledLanguages_) {
    q.transpiledLanguages_ = {es5:!0, es6:!0, "es6-impl":!0};
    try {
      q.transpiledLanguages_.es5 = eval("[1,].length!=1"), eval('(()=>{"use strict";let a={};const X=class{constructor(){}x(z){return new Map([...arguments]).get(z[0])==3}};return new X().x([a,3])})()') && (q.transpiledLanguages_["es6-impl"] = !1), eval('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()') && 
      (q.transpiledLanguages_.es6 = !1);
    } catch (b) {
    }
  }
  return !!q.transpiledLanguages_[a];
}, q.transpiledLanguages_ = null, q.lastNonModuleScriptIndex_ = 0, q.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && q.lastNonModuleScriptIndex_ == b && q.loadQueuedModules_();
  return !0;
}, q.writeScripts_ = function(a) {
  function b(a) {
    if (!(a in f.written || a in f.visited)) {
      f.visited[a] = !0;
      if (a in f.requires) {
        for (var g in f.requires[a]) {
          if (!q.isProvided_(g)) {
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
  var d = [], e = {}, f = q.dependencies_;
  b(a);
  for (a = 0;a < d.length;a++) {
    var g = d[a];
    q.dependencies_.written[g] = !0;
  }
  var h = q.moduleLoaderState_;
  q.moduleLoaderState_ = null;
  for (a = 0;a < d.length;a++) {
    if (g = d[a]) {
      var k = f.loadFlags[g] || {}, l = q.needsTranspile_(k.lang);
      "goog" == k.module || l ? q.importProcessedScript_(q.basePath + g, "goog" == k.module, l) : q.importScript_(q.basePath + g);
    } else {
      throw q.moduleLoaderState_ = h, Error("Undefined script input");
    }
  }
  q.moduleLoaderState_ = h;
}, q.getPathFromDeps_ = function(a) {
  return a in q.dependencies_.nameToPath ? q.dependencies_.nameToPath[a] : null;
}, q.findBasePath_(), q.global.CLOSURE_NO_DEPS || q.importScript_(q.basePath + "deps.js"));
q.loadModule = function(a) {
  var b = q.moduleLoaderState_;
  try {
    q.moduleLoaderState_ = {moduleName:void 0, declareLegacyNamespace:!1};
    var d;
    if (q.isFunction(a)) {
      d = a.call(void 0, {});
    } else {
      if (q.isString(a)) {
        d = q.loadModuleFromSource_.call(void 0, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var e = q.moduleLoaderState_.moduleName;
    if (!q.isString(e) || !e) {
      throw Error('Invalid module name "' + e + '"');
    }
    q.moduleLoaderState_.declareLegacyNamespace ? q.constructNamespace_(e, d) : q.SEAL_MODULE_EXPORTS && Object.seal && q.isObject(d) && Object.seal(d);
    q.loadedModules_[e] = d;
  } finally {
    q.moduleLoaderState_ = b;
  }
};
q.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
};
q.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0;b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
q.loadFileSync_ = function(a) {
  if (q.global.CLOSURE_LOAD_FILE_SYNC) {
    return q.global.CLOSURE_LOAD_FILE_SYNC(a);
  }
  try {
    var b = new q.global.XMLHttpRequest;
    b.open("get", a, !1);
    b.send();
    return 0 == b.status || 200 == b.status ? b.responseText : null;
  } catch (d) {
    return null;
  }
};
q.retrieveAndExec_ = function() {
};
q.transpile_ = function(a, b) {
  var d = q.global.$jscomp;
  d || (q.global.$jscomp = d = {});
  var e = d.transpile;
  if (!e) {
    var f = q.basePath + q.TRANSPILER, g = q.loadFileSync_(f);
    g && (eval(g + "\n//# sourceURL=" + f), d = q.global.$jscomp, e = d.transpile);
  }
  e || (e = d.transpile = function(a, b) {
    q.logToConsole_(b + " requires transpilation but no transpiler was found.");
    return a;
  });
  return e(a, b);
};
q.typeOf = function(a) {
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
q.isNull = function(a) {
  return null === a;
};
q.isDefAndNotNull = function(a) {
  return null != a;
};
q.isArray = function(a) {
  return "array" == q.typeOf(a);
};
q.isArrayLike = function(a) {
  var b = q.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
q.isDateLike = function(a) {
  return q.isObject(a) && "function" == typeof a.getFullYear;
};
q.isString = function(a) {
  return "string" == typeof a;
};
q.isBoolean = function(a) {
  return "boolean" == typeof a;
};
q.isNumber = function(a) {
  return "number" == typeof a;
};
q.isFunction = function(a) {
  return "function" == q.typeOf(a);
};
q.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
q.getUid = function(a) {
  return a[q.UID_PROPERTY_] || (a[q.UID_PROPERTY_] = ++q.uidCounter_);
};
q.hasUid = function(a) {
  return !!a[q.UID_PROPERTY_];
};
q.removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(q.UID_PROPERTY_);
  try {
    delete a[q.UID_PROPERTY_];
  } catch (b) {
  }
};
q.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
q.uidCounter_ = 0;
q.getHashCode = q.getUid;
q.removeHashCode = q.removeUid;
q.cloneObject = function(a) {
  var b = q.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, d;
    for (d in a) {
      b[d] = q.cloneObject(a[d]);
    }
    return b;
  }
  return a;
};
q.bindNative_ = function(a, b, d) {
  return a.call.apply(a.bind, arguments);
};
q.bindJs_ = function(a, b, d) {
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
q.bind = function(a, b, d) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? q.bind = q.bindNative_ : q.bind = q.bindJs_;
  return q.bind.apply(null, arguments);
};
q.partial = function(a, b) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = d.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
q.mixin = function(a, b) {
  for (var d in b) {
    a[d] = b[d];
  }
};
q.now = q.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
q.globalEval = function(a) {
  if (q.global.execScript) {
    q.global.execScript(a, "JavaScript");
  } else {
    if (q.global.eval) {
      if (null == q.evalWorksForGlobals_) {
        if (q.global.eval("var _evalTest_ = 1;"), "undefined" != typeof q.global._evalTest_) {
          try {
            delete q.global._evalTest_;
          } catch (e) {
          }
          q.evalWorksForGlobals_ = !0;
        } else {
          q.evalWorksForGlobals_ = !1;
        }
      }
      if (q.evalWorksForGlobals_) {
        q.global.eval(a);
      } else {
        var b = q.global.document, d = b.createElement("SCRIPT");
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
q.evalWorksForGlobals_ = null;
q.getCssName = function(a, b) {
  function d(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(e(a[d]));
    }
    return b.join("-");
  }
  function e(a) {
    return q.cssNameMapping_[a] || a;
  }
  if ("." == String(a).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
  }
  var f;
  f = q.cssNameMapping_ ? "BY_WHOLE" == q.cssNameMappingStyle_ ? e : d : function(a) {
    return a;
  };
  a = b ? a + "-" + f(b) : f(a);
  return q.global.CLOSURE_CSS_NAME_MAP_FN ? q.global.CLOSURE_CSS_NAME_MAP_FN(a) : a;
};
q.setCssNameMapping = function(a, b) {
  q.cssNameMapping_ = a;
  q.cssNameMappingStyle_ = b;
};
q.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, e) {
    return null != b && e in b ? b[e] : a;
  }));
  return a;
};
q.getMsgWithFallback = function(a) {
  return a;
};
q.exportSymbol = function(a, b, d) {
  q.exportPath_(a, b, d);
};
q.exportProperty = function(a, b, d) {
  a[b] = d;
};
q.inherits = function(a, b) {
  function d() {
  }
  d.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new d;
  a.prototype.constructor = a;
  a.base = function(a, d, g) {
    for (var e = Array(arguments.length - 2), f = 2;f < arguments.length;f++) {
      e[f - 2] = arguments[f];
    }
    return b.prototype[d].apply(a, e);
  };
};
q.base = function(a, b, d) {
  var e = arguments.callee.caller;
  if (q.STRICT_MODE_COMPATIBLE || q.DEBUG && !e) {
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
  for (var g = !1, h = a.constructor;h;h = h.superClass_ && h.superClass_.constructor) {
    if (h.prototype[b] === e) {
      g = !0;
    } else {
      if (g) {
        return h.prototype[b].apply(a, f);
      }
    }
  }
  if (a[b] === e) {
    return a.constructor.prototype[b].apply(a, f);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
q.scope = function(a) {
  if (q.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  a.call(q.global);
};
q.defineClass = function(a, b) {
  var d = b.constructor, e = b.statics;
  d && d != Object.prototype.constructor || (d = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  d = q.defineClass.createSealingConstructor_(d, a);
  a && q.inherits(d, a);
  delete b.constructor;
  delete b.statics;
  q.defineClass.applyProperties_(d.prototype, b);
  null != e && (e instanceof Function ? e(d) : q.defineClass.applyProperties_(d, e));
  return d;
};
q.defineClass.SEAL_CLASS_INSTANCES = q.DEBUG;
q.defineClass.createSealingConstructor_ = function(a, b) {
  function d() {
    var b = a.apply(this, arguments) || this;
    b[q.UID_PROPERTY_] = b[q.UID_PROPERTY_];
    this.constructor === d && e && Object.seal instanceof Function && Object.seal(b);
    return b;
  }
  if (!q.defineClass.SEAL_CLASS_INSTANCES) {
    return a;
  }
  var e = !q.defineClass.isUnsealable_(b);
  return d;
};
q.defineClass.isUnsealable_ = function(a) {
  return a && a.prototype && a.prototype[q.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
q.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
q.defineClass.applyProperties_ = function(a, b) {
  for (var d in b) {
    Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
  }
  for (var e = 0;e < q.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;e++) {
    d = q.defineClass.OBJECT_PROTOTYPE_FIELDS_[e], Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
  }
};
q.tagUnsealableClass = function() {
};
q.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
q.object = {};
q.object.is = function(a, b) {
  return a === b ? 0 !== a || 1 / a === 1 / b : a !== a && b !== b;
};
q.object.forEach = function(a, b, d) {
  for (var e in a) {
    b.call(d, a[e], e, a);
  }
};
q.object.filter = function(a, b, d) {
  var e = {}, f;
  for (f in a) {
    b.call(d, a[f], f, a) && (e[f] = a[f]);
  }
  return e;
};
q.object.map = function(a, b, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = b.call(d, a[f], f, a);
  }
  return e;
};
q.object.some = function(a, b, d) {
  for (var e in a) {
    if (b.call(d, a[e], e, a)) {
      return !0;
    }
  }
  return !1;
};
q.object.every = function(a, b, d) {
  for (var e in a) {
    if (!b.call(d, a[e], e, a)) {
      return !1;
    }
  }
  return !0;
};
q.object.getCount = function(a) {
  var b = 0, d;
  for (d in a) {
    b++;
  }
  return b;
};
q.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
q.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
q.object.contains = function(a, b) {
  return q.object.containsValue(a, b);
};
q.object.getValues = function(a) {
  var b = [], d = 0, e;
  for (e in a) {
    b[d++] = a[e];
  }
  return b;
};
q.object.getKeys = function(a) {
  var b = [], d = 0, e;
  for (e in a) {
    b[d++] = e;
  }
  return b;
};
q.object.getValueByKeys = function(a, b) {
  for (var d = q.isArrayLike(b), e = d ? b : arguments, d = d ? 0 : 1;d < e.length && (a = a[e[d]], q.isDef(a));d++) {
  }
  return a;
};
q.object.containsKey = function(a, b) {
  return null !== a && b in a;
};
q.object.containsValue = function(a, b) {
  for (var d in a) {
    if (a[d] == b) {
      return !0;
    }
  }
  return !1;
};
q.object.findKey = function(a, b, d) {
  for (var e in a) {
    if (b.call(d, a[e], e, a)) {
      return e;
    }
  }
};
q.object.findValue = function(a, b, d) {
  return (b = q.object.findKey(a, b, d)) && a[b];
};
q.object.isEmpty = function(a) {
  for (var b in a) {
    return !1;
  }
  return !0;
};
q.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
q.object.remove = function(a, b) {
  var d;
  (d = b in a) && delete a[b];
  return d;
};
q.object.add = function(a, b, d) {
  if (null !== a && b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  q.object.set(a, b, d);
};
q.object.get = function(a, b, d) {
  return null !== a && b in a ? a[b] : d;
};
q.object.set = function(a, b, d) {
  a[b] = d;
};
q.object.setIfUndefined = function(a, b, d) {
  return b in a ? a[b] : a[b] = d;
};
q.object.setWithReturnValueIfNotSet = function(a, b, d) {
  if (b in a) {
    return a[b];
  }
  d = d();
  return a[b] = d;
};
q.object.equals = function(a, b) {
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
q.object.clone = function(a) {
  var b = {}, d;
  for (d in a) {
    b[d] = a[d];
  }
  return b;
};
q.object.unsafeClone = function(a) {
  var b = q.typeOf(a);
  if ("object" == b || "array" == b) {
    if (q.isFunction(a.clone)) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, d;
    for (d in a) {
      b[d] = q.object.unsafeClone(a[d]);
    }
    return b;
  }
  return a;
};
q.object.transpose = function(a) {
  var b = {}, d;
  for (d in a) {
    b[a[d]] = d;
  }
  return b;
};
q.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
q.object.extend = function(a, b) {
  for (var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (d in e) {
      a[d] = e[d];
    }
    for (var g = 0;g < q.object.PROTOTYPE_FIELDS_.length;g++) {
      d = q.object.PROTOTYPE_FIELDS_[g], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }
};
q.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && q.isArray(arguments[0])) {
    return q.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var d = {}, e = 0;e < b;e += 2) {
    d[arguments[e]] = arguments[e + 1];
  }
  return d;
};
q.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && q.isArray(arguments[0])) {
    return q.object.createSet.apply(null, arguments[0]);
  }
  for (var d = {}, e = 0;e < b;e++) {
    d[arguments[e]] = !0;
  }
  return d;
};
q.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
q.object.isImmutableView = function(a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
var r = require("lodash.ismatchwith");
function v(a) {
  return function(b) {
    return w(b, a);
  };
}
function w(a, b) {
  var d = {};
  return r(a, b, function(a, b) {
    if ("function" === typeof b) {
      return a = b(a), "object" === typeof a && q.object.extend(d, a), a;
    }
  }) ? d : !1;
}
var y = {extractAST:function(a, b) {
  return function(d) {
    var e = {}, e = (e[a] = d, e);
    "object" === typeof b && (b = v(b));
    if ("function" === typeof b) {
      d = b(d);
      if ("object" === typeof d) {
        return q.object.extend(e, d), e;
      }
      if (!d) {
        return !1;
      }
    }
    return e;
  };
}, isASTMatch:w, matchesAST:v, matchesASTLength:function(a) {
  var b = v(a);
  return function(d) {
    return d.length !== a.length ? !1 : b(d);
  };
}};
function z(a, b) {
  for (a = a.parent;!b(a) && "Program" !== a.type;) {
    a = a.parent;
  }
  return b(a) ? a : null;
}
function A(a, b) {
  b = void 0 === b ? "literal" : b;
  return y.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a && y.extractAST(b)(a);
  }});
}
var D = {findAncestor:z, findAncestorOfType:function(a, b) {
  return z(a, function(a) {
    return a.type == b;
  });
}, getFullyQualifedName:function(a) {
  for (var b = a.name;a.parent && "MemberExpression" == a.parent.type;) {
    a = a.parent, b += "." + a.property.name;
  }
  return b;
}, isLoop:function(a) {
  return /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/.test(a.type);
}, isFunction:function(a) {
  return /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/.test(a.type);
}, matchExtractBareGoogRequire:function(a) {
  return y.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"require"}}, arguments:[function(a) {
    return A(a, "source");
  }]}});
}, matchExtractGoogProvide:function(a) {
  return y.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"provide"}}, arguments:[function(a) {
    return A(a, "source");
  }]}});
}, matchExtractDirective:function(a) {
  return y.isASTMatch(a, {type:"ExpressionStatement", expression:function(a) {
    return A(a, "directive");
  }});
}, matchExtractStringLiteral:A, matchStringLiteral:function(a) {
  return y.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a;
  }});
}};
var F = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function H(a, b) {
  return a.loc.end.line === b.loc.start.line;
}
var J = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? F.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? F.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? F.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? F.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? F.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? F.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? F.UnderscoreForm.TRAILING : F.UnderscoreForm.MIDDLE;
}, escapeRegexp:function(a) {
  return String(a).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}, isUnderscored:function(a) {
  return -1 < a.indexOf("_");
}, isNodeConstructorFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "MethodDefinition" === a.parent.type && "constructor" === a.parent.kind;
}, isNodeClassType:function(a) {
  return "ClassExpression" === a.type || "ClassDeclaration" === a.type;
}, isNodeGetterFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "Property" === a.parent.type && "get" === a.parent.kind;
}, isNodeOneLine:function(a) {
  return H(a, a);
}, isNodeSetterFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "Property" === a.parent.type && "set" === a.parent.kind;
}, isValidPrefix:function(a, b) {
  return a.startsWith(b) ? a === b || "." === a[b.length] : !1;
}, nodesEndOnSameLine:function(a, b) {
  return a.loc.end.line === b.loc.end.line;
}, nodesShareOneLine:H, nodesStartOnSameLine:function(a, b) {
  return a.loc.start.line === b.loc.start.line;
}};
var N = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function O(a, b) {
  function d(a) {
    return Object.assign(g, {message:a});
  }
  function e(e, g) {
    return P(e, a, b) ? f : d(g);
  }
  var f = {node:a, message:"", hasError:!1}, g = {node:a, message:"", hasError:!0};
  switch(J.categorizeUnderscoredIdentifier(a.name)) {
    case F.UnderscoreForm.CONSTANT:
      return f;
    case F.UnderscoreForm.LEADING:
      return b.allowLeadingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : d("Leading underscores are not allowed in '" + a.name + "'.");
    case F.UnderscoreForm.NO_UNDERSCORE:
      return f;
    case F.UnderscoreForm.MIDDLE:
      return e(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case F.UnderscoreForm.OPT_PREFIX:
      return b.allowOptPrefix ? e(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : d("The opt_ prefix is not allowed in '" + a.name + "'.");
    case F.UnderscoreForm.TRAILING:
      return b.allowTrailingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : d("Trailing underscores are not allowed in '" + a.name + "'.");
    case F.UnderscoreForm.VAR_ARGS:
      return b.allowVarArgs ? f : d("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);
  }
}
function P(a, b, d) {
  var e = b.parent;
  if (!J.isUnderscored(a)) {
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
;function Q(a, b, d, e) {
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
function R(a, b, d) {
  b = !0 === d ? b.getLastToken(a, 1) : b.getTokenBefore(a);
  return (!0 === d ? a.loc.end.line : a.loc.start.line) !== (b ? b.loc.end.line : -1);
}
function S(a, b) {
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
;q.debug = {};
q.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, q.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
  this.reportErrorToServer = !0;
};
q.inherits(q.debug.Error, Error);
q.debug.Error.prototype.name = "CustomError";
q.dom = {};
q.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
q.string = {};
q.string.DETECT_DOUBLE_ESCAPING = !1;
q.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
q.string.Unicode = {NBSP:"\u00a0"};
q.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
q.string.endsWith = function(a, b) {
  var d = a.length - b.length;
  return 0 <= d && a.indexOf(b, d) == d;
};
q.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == q.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
q.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == q.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
q.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
q.string.subs = function(a, b) {
  for (var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < d.length;) {
    e += d.shift() + f.shift();
  }
  return e + d.join("%s");
};
q.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
q.string.isEmptyOrWhitespace = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
q.string.isEmptyString = function(a) {
  return 0 == a.length;
};
q.string.isEmpty = q.string.isEmptyOrWhitespace;
q.string.isEmptyOrWhitespaceSafe = function(a) {
  return q.string.isEmptyOrWhitespace(q.string.makeSafe(a));
};
q.string.isEmptySafe = q.string.isEmptyOrWhitespaceSafe;
q.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a);
};
q.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a);
};
q.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a);
};
q.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
q.string.isSpace = function(a) {
  return " " == a;
};
q.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
q.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
q.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
q.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
q.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
q.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
q.string.trim = q.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
q.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
q.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
q.string.caseInsensitiveCompare = function(a, b) {
  a = String(a).toLowerCase();
  b = String(b).toLowerCase();
  return a < b ? -1 : a == b ? 0 : 1;
};
q.string.numberAwareCompare_ = function(a, b, d) {
  if (a == b) {
    return 0;
  }
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  for (var e = a.toLowerCase().match(d), f = b.toLowerCase().match(d), g = Math.min(e.length, f.length), h = 0;h < g;h++) {
    d = e[h];
    var k = f[h];
    if (d != k) {
      return a = parseInt(d, 10), !isNaN(a) && (b = parseInt(k, 10), !isNaN(b) && a - b) ? a - b : d < k ? -1 : 1;
    }
  }
  return e.length != f.length ? e.length - f.length : a < b ? -1 : 1;
};
q.string.intAwareCompare = function(a, b) {
  return q.string.numberAwareCompare_(a, b, /\d+|\D+/g);
};
q.string.floatAwareCompare = function(a, b) {
  return q.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g);
};
q.string.numerateCompare = q.string.floatAwareCompare;
q.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
q.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
q.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
};
q.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(q.string.AMP_RE_, "&amp;").replace(q.string.LT_RE_, "&lt;").replace(q.string.GT_RE_, "&gt;").replace(q.string.QUOT_RE_, "&quot;").replace(q.string.SINGLE_QUOTE_RE_, "&#39;").replace(q.string.NULL_RE_, "&#0;"), q.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(q.string.E_RE_, "&#101;"));
  } else {
    if (!q.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(q.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(q.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(q.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(q.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(q.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(q.string.NULL_RE_, "&#0;"));
    q.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(q.string.E_RE_, "&#101;"));
  }
  return a;
};
q.string.AMP_RE_ = /&/g;
q.string.LT_RE_ = /</g;
q.string.GT_RE_ = />/g;
q.string.QUOT_RE_ = /"/g;
q.string.SINGLE_QUOTE_RE_ = /'/g;
q.string.NULL_RE_ = /\x00/g;
q.string.E_RE_ = /e/g;
q.string.ALL_RE_ = q.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
q.string.unescapeEntities = function(a) {
  return q.string.contains(a, "&") ? !q.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in q.global ? q.string.unescapeEntitiesUsingDom_(a) : q.string.unescapePureXmlEntities_(a) : a;
};
q.string.unescapeEntitiesWithDocument = function(a, b) {
  return q.string.contains(a, "&") ? q.string.unescapeEntitiesUsingDom_(a, b) : a;
};
q.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var d = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = b ? b.createElement("div") : q.global.document.createElement("div");
  return a.replace(q.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var f = d[a];
    if (f) {
      return f;
    }
    "#" == b.charAt(0) && (b = Number("0" + b.substr(1)), isNaN(b) || (f = String.fromCharCode(b)));
    f || (e.innerHTML = a + " ", f = e.firstChild.nodeValue.slice(0, -1));
    return d[a] = f;
  });
};
q.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, d) {
    switch(d) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        return "#" != d.charAt(0) || (d = Number("0" + d.substr(1)), isNaN(d)) ? a : String.fromCharCode(d);
    }
  });
};
q.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
q.string.whitespaceEscape = function(a, b) {
  return q.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
};
q.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + q.string.Unicode.NBSP);
};
q.string.stripQuotes = function(a, b) {
  for (var d = b.length, e = 0;e < d;e++) {
    var f = 1 == d ? b : b.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
q.string.truncate = function(a, b, d) {
  d && (a = q.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  d && (a = q.string.htmlEscape(a));
  return a;
};
q.string.truncateMiddle = function(a, b, d, e) {
  d && (a = q.string.unescapeEntities(a));
  if (e && a.length > b) {
    e > b && (e = b);
    var f = a.length - e;
    a = a.substring(0, b - e) + "..." + a.substring(f);
  } else {
    a.length > b && (e = Math.floor(b / 2), f = a.length - e, a = a.substring(0, e + b % 2) + "..." + a.substring(f));
  }
  d && (a = q.string.htmlEscape(a));
  return a;
};
q.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
q.string.jsEscapeCache_ = {"'":"\\'"};
q.string.quote = function(a) {
  a = String(a);
  for (var b = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    b[d + 1] = q.string.specialEscapeChars_[e] || (31 < f && 127 > f ? e : q.string.escapeChar(e));
  }
  b.push('"');
  return b.join("");
};
q.string.escapeString = function(a) {
  for (var b = [], d = 0;d < a.length;d++) {
    b[d] = q.string.escapeChar(a.charAt(d));
  }
  return b.join("");
};
q.string.escapeChar = function(a) {
  if (a in q.string.jsEscapeCache_) {
    return q.string.jsEscapeCache_[a];
  }
  if (a in q.string.specialEscapeChars_) {
    return q.string.jsEscapeCache_[a] = q.string.specialEscapeChars_[a];
  }
  var b, d = a.charCodeAt(0);
  if (31 < d && 127 > d) {
    b = a;
  } else {
    if (256 > d) {
      if (b = "\\x", 16 > d || 256 < d) {
        b += "0";
      }
    } else {
      b = "\\u", 4096 > d && (b += "0");
    }
    b += d.toString(16).toUpperCase();
  }
  return q.string.jsEscapeCache_[a] = b;
};
q.string.contains = function(a, b) {
  return -1 != a.indexOf(b);
};
q.string.caseInsensitiveContains = function(a, b) {
  return q.string.contains(a.toLowerCase(), b.toLowerCase());
};
q.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
q.string.removeAt = function(a, b, d) {
  var e = a;
  0 <= b && b < a.length && 0 < d && (e = a.substr(0, b) + a.substr(b + d, a.length - b - d));
  return e;
};
q.string.remove = function(a, b) {
  b = new RegExp(q.string.regExpEscape(b), "");
  return a.replace(b, "");
};
q.string.removeAll = function(a, b) {
  b = new RegExp(q.string.regExpEscape(b), "g");
  return a.replace(b, "");
};
q.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
q.string.repeat = String.prototype.repeat ? function(a, b) {
  return a.repeat(b);
} : function(a, b) {
  return Array(b + 1).join(a);
};
q.string.padNumber = function(a, b, d) {
  a = q.isDef(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return q.string.repeat("0", Math.max(0, b - d)) + a;
};
q.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
q.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
q.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ q.now()).toString(36);
};
q.string.compareVersions = function(a, b) {
  var d = 0;
  a = q.string.trim(String(a)).split(".");
  b = q.string.trim(String(b)).split(".");
  for (var e = Math.max(a.length, b.length), f = 0;0 == d && f < e;f++) {
    var g = a[f] || "", h = b[f] || "";
    do {
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
      if (0 == g[0].length && 0 == h[0].length) {
        break;
      }
      var d = 0 == g[1].length ? 0 : parseInt(g[1], 10), k = 0 == h[1].length ? 0 : parseInt(h[1], 10), d = q.string.compareElements_(d, k) || q.string.compareElements_(0 == g[2].length, 0 == h[2].length) || q.string.compareElements_(g[2], h[2]), g = g[3], h = h[3];
    } while (0 == d);
  }
  return d;
};
q.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
q.string.hashCode = function(a) {
  for (var b = 0, d = 0;d < a.length;++d) {
    b = 31 * b + a.charCodeAt(d) >>> 0;
  }
  return b;
};
q.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
q.string.createUniqueString = function() {
  return "goog_" + q.string.uniqueStringCounter_++;
};
q.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && q.string.isEmptyOrWhitespace(a) ? NaN : b;
};
q.string.isLowerCamelCase = function(a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
q.string.isUpperCamelCase = function(a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
q.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase();
  });
};
q.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
q.string.toTitleCase = function(a, b) {
  b = q.isString(b) ? q.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, f) {
    return b + f.toUpperCase();
  });
};
q.string.capitalize = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
q.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return q.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
q.string.splitLimit = function(a, b, d) {
  a = a.split(b);
  for (var e = [];0 < d && a.length;) {
    e.push(a.shift()), d--;
  }
  a.length && e.push(a.join(b));
  return e;
};
q.string.lastComponent = function(a, b) {
  if (b) {
    "string" == typeof b && (b = [b]);
  } else {
    return a;
  }
  for (var d = -1, e = 0;e < b.length;e++) {
    if ("" != b[e]) {
      var f = a.lastIndexOf(b[e]);
      f > d && (d = f);
    }
  }
  return -1 == d ? a : a.slice(d + 1);
};
q.string.editDistance = function(a, b) {
  var d = [], e = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var f = 0;f < b.length + 1;f++) {
    d[f] = f;
  }
  for (f = 0;f < a.length;f++) {
    e[0] = f + 1;
    for (var g = 0;g < b.length;g++) {
      e[g + 1] = Math.min(e[g] + 1, d[g + 1] + 1, d[g] + Number(a[f] != b[g]));
    }
    for (g = 0;g < d.length;g++) {
      d[g] = e[g];
    }
  }
  return e[b.length];
};
q.asserts = {};
q.asserts.ENABLE_ASSERTS = q.DEBUG;
q.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  q.debug.Error.call(this, q.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
q.inherits(q.asserts.AssertionError, q.debug.Error);
q.asserts.AssertionError.prototype.name = "AssertionError";
q.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
q.asserts.errorHandler_ = q.asserts.DEFAULT_ERROR_HANDLER;
q.asserts.doAssertFailure_ = function(a, b, d, e) {
  var f = "Assertion failed";
  if (d) {
    var f = f + (": " + d), g = e;
  } else {
    a && (f += ": " + a, g = b);
  }
  a = new q.asserts.AssertionError("" + f, g || []);
  q.asserts.errorHandler_(a);
};
q.asserts.setErrorHandler = function(a) {
  q.asserts.ENABLE_ASSERTS && (q.asserts.errorHandler_ = a);
};
q.asserts.assert = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !a && q.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.fail = function(a, b) {
  q.asserts.ENABLE_ASSERTS && q.asserts.errorHandler_(new q.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
q.asserts.assertNumber = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !q.isNumber(a) && q.asserts.doAssertFailure_("Expected number but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertString = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !q.isString(a) && q.asserts.doAssertFailure_("Expected string but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertFunction = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !q.isFunction(a) && q.asserts.doAssertFailure_("Expected function but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertObject = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !q.isObject(a) && q.asserts.doAssertFailure_("Expected object but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertArray = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !q.isArray(a) && q.asserts.doAssertFailure_("Expected array but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertBoolean = function(a, b, d) {
  q.asserts.ENABLE_ASSERTS && !q.isBoolean(a) && q.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertElement = function(a, b, d) {
  !q.asserts.ENABLE_ASSERTS || q.isObject(a) && a.nodeType == q.dom.NodeType.ELEMENT || q.asserts.doAssertFailure_("Expected Element but got %s: %s.", [q.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
q.asserts.assertInstanceof = function(a, b, d, e) {
  !q.asserts.ENABLE_ASSERTS || a instanceof b || q.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [q.asserts.getType_(b), q.asserts.getType_(a)], d, Array.prototype.slice.call(arguments, 3));
  return a;
};
q.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    q.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
q.asserts.getType_ = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
q.array = {};
q.NATIVE_ARRAY_PROTOTYPES = q.TRUSTED_SITE;
q.array.ASSUME_NATIVE_FUNCTIONS = !1;
q.array.peek = function(a) {
  return a[a.length - 1];
};
q.array.last = q.array.peek;
q.array.indexOf = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  return Array.prototype.indexOf.call(a, b, d);
} : function(a, b, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if (q.isString(a)) {
    return q.isString(b) && 1 == b.length ? a.indexOf(b, d) : -1;
  }
  for (;d < a.length;d++) {
    if (d in a && a[d] === b) {
      return d;
    }
  }
  return -1;
};
q.array.lastIndexOf = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  return Array.prototype.lastIndexOf.call(a, b, null == d ? a.length - 1 : d);
} : function(a, b, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if (q.isString(a)) {
    return q.isString(b) && 1 == b.length ? a.lastIndexOf(b, d) : -1;
  }
  for (;0 <= d;d--) {
    if (d in a && a[d] === b) {
      return d;
    }
  }
  return -1;
};
q.array.forEach = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  Array.prototype.forEach.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = q.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && b.call(d, f[g], g, a);
  }
};
q.array.forEachRight = function(a, b, d) {
  for (var e = a.length, f = q.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && b.call(d, f[e], e, a);
  }
};
q.array.filter = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  return Array.prototype.filter.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = [], g = 0, h = q.isString(a) ? a.split("") : a, k = 0;k < e;k++) {
    if (k in h) {
      var l = h[k];
      b.call(d, l, k, a) && (f[g++] = l);
    }
  }
  return f;
};
q.array.map = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  return Array.prototype.map.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = Array(e), g = q.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in g && (f[h] = b.call(d, g[h], h, a));
  }
  return f;
};
q.array.reduce = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(a, b, d, e) {
  q.asserts.assert(null != a.length);
  e && (b = q.bind(b, e));
  return Array.prototype.reduce.call(a, b, d);
} : function(a, b, d, e) {
  var f = d;
  q.array.forEach(a, function(d, h) {
    f = b.call(e, f, d, h, a);
  });
  return f;
};
q.array.reduceRight = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(a, b, d, e) {
  q.asserts.assert(null != a.length);
  q.asserts.assert(null != b);
  e && (b = q.bind(b, e));
  return Array.prototype.reduceRight.call(a, b, d);
} : function(a, b, d, e) {
  var f = d;
  q.array.forEachRight(a, function(d, h) {
    f = b.call(e, f, d, h, a);
  });
  return f;
};
q.array.some = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  return Array.prototype.some.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = q.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(d, f[g], g, a)) {
      return !0;
    }
  }
  return !1;
};
q.array.every = q.NATIVE_ARRAY_PROTOTYPES && (q.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(a, b, d) {
  q.asserts.assert(null != a.length);
  return Array.prototype.every.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = q.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && !b.call(d, f[g], g, a)) {
      return !1;
    }
  }
  return !0;
};
q.array.count = function(a, b, d) {
  var e = 0;
  q.array.forEach(a, function(a, g, h) {
    b.call(d, a, g, h) && ++e;
  }, d);
  return e;
};
q.array.find = function(a, b, d) {
  b = q.array.findIndex(a, b, d);
  return 0 > b ? null : q.isString(a) ? a.charAt(b) : a[b];
};
q.array.findIndex = function(a, b, d) {
  for (var e = a.length, f = q.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(d, f[g], g, a)) {
      return g;
    }
  }
  return -1;
};
q.array.findRight = function(a, b, d) {
  b = q.array.findIndexRight(a, b, d);
  return 0 > b ? null : q.isString(a) ? a.charAt(b) : a[b];
};
q.array.findIndexRight = function(a, b, d) {
  for (var e = a.length, f = q.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if (e in f && b.call(d, f[e], e, a)) {
      return e;
    }
  }
  return -1;
};
q.array.contains = function(a, b) {
  return 0 <= q.array.indexOf(a, b);
};
q.array.isEmpty = function(a) {
  return 0 == a.length;
};
q.array.clear = function(a) {
  if (!q.isArray(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
q.array.insert = function(a, b) {
  q.array.contains(a, b) || a.push(b);
};
q.array.insertAt = function(a, b, d) {
  q.array.splice(a, d, 0, b);
};
q.array.insertArrayAt = function(a, b, d) {
  q.partial(q.array.splice, a, d, 0).apply(null, b);
};
q.array.insertBefore = function(a, b, d) {
  var e;
  2 == arguments.length || 0 > (e = q.array.indexOf(a, d)) ? a.push(b) : q.array.insertAt(a, b, e);
};
q.array.remove = function(a, b) {
  b = q.array.indexOf(a, b);
  var d;
  (d = 0 <= b) && q.array.removeAt(a, b);
  return d;
};
q.array.removeLast = function(a, b) {
  b = q.array.lastIndexOf(a, b);
  return 0 <= b ? (q.array.removeAt(a, b), !0) : !1;
};
q.array.removeAt = function(a, b) {
  q.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, b, 1).length;
};
q.array.removeIf = function(a, b, d) {
  b = q.array.findIndex(a, b, d);
  return 0 <= b ? (q.array.removeAt(a, b), !0) : !1;
};
q.array.removeAllIf = function(a, b, d) {
  var e = 0;
  q.array.forEachRight(a, function(f, g) {
    b.call(d, f, g, a) && q.array.removeAt(a, g) && e++;
  });
  return e;
};
q.array.concat = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
q.array.join = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
q.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var d = Array(b), e = 0;e < b;e++) {
      d[e] = a[e];
    }
    return d;
  }
  return [];
};
q.array.clone = q.array.toArray;
q.array.extend = function(a, b) {
  for (var d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    if (q.isArrayLike(e)) {
      var f = a.length || 0, g = e.length || 0;
      a.length = f + g;
      for (var h = 0;h < g;h++) {
        a[f + h] = e[h];
      }
    } else {
      a.push(e);
    }
  }
};
q.array.splice = function(a, b, d, e) {
  q.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, q.array.slice(arguments, 1));
};
q.array.slice = function(a, b, d) {
  q.asserts.assert(null != a.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, d);
};
q.array.removeDuplicates = function(a, b, d) {
  function e(a) {
    return q.isObject(a) ? "o" + q.getUid(a) : (typeof a).charAt(0) + a;
  }
  b = b || a;
  d = d || e;
  for (var f = {}, g = 0, h = 0;h < a.length;) {
    var k = a[h++], l = d(k);
    Object.prototype.hasOwnProperty.call(f, l) || (f[l] = !0, b[g++] = k);
  }
  b.length = g;
};
q.array.binarySearch = function(a, b, d) {
  return q.array.binarySearch_(a, d || q.array.defaultCompare, !1, b);
};
q.array.binarySelect = function(a, b, d) {
  return q.array.binarySearch_(a, b, !0, void 0, d);
};
q.array.binarySearch_ = function(a, b, d, e, f) {
  for (var g = 0, h = a.length, k;g < h;) {
    var l = g + h >> 1, x;
    x = d ? b.call(f, a[l], l, a) : b(e, a[l]);
    0 < x ? g = l + 1 : (h = l, k = !x);
  }
  return k ? g : ~g;
};
q.array.sort = function(a, b) {
  a.sort(b || q.array.defaultCompare);
};
q.array.stableSort = function(a, b) {
  for (var d = Array(a.length), e = 0;e < a.length;e++) {
    d[e] = {index:e, value:a[e]};
  }
  var f = b || q.array.defaultCompare;
  q.array.sort(d, function(a, b) {
    return f(a.value, b.value) || a.index - b.index;
  });
  for (e = 0;e < a.length;e++) {
    a[e] = d[e].value;
  }
};
q.array.sortByKey = function(a, b, d) {
  var e = d || q.array.defaultCompare;
  q.array.sort(a, function(a, d) {
    return e(b(a), b(d));
  });
};
q.array.sortObjectsByKey = function(a, b, d) {
  q.array.sortByKey(a, function(a) {
    return a[b];
  }, d);
};
q.array.isSorted = function(a, b, d) {
  b = b || q.array.defaultCompare;
  for (var e = 1;e < a.length;e++) {
    var f = b(a[e - 1], a[e]);
    if (0 < f || 0 == f && d) {
      return !1;
    }
  }
  return !0;
};
q.array.equals = function(a, b, d) {
  if (!q.isArrayLike(a) || !q.isArrayLike(b) || a.length != b.length) {
    return !1;
  }
  var e = a.length;
  d = d || q.array.defaultCompareEquality;
  for (var f = 0;f < e;f++) {
    if (!d(a[f], b[f])) {
      return !1;
    }
  }
  return !0;
};
q.array.compare3 = function(a, b, d) {
  d = d || q.array.defaultCompare;
  for (var e = Math.min(a.length, b.length), f = 0;f < e;f++) {
    var g = d(a[f], b[f]);
    if (0 != g) {
      return g;
    }
  }
  return q.array.defaultCompare(a.length, b.length);
};
q.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
q.array.inverseDefaultCompare = function(a, b) {
  return -q.array.defaultCompare(a, b);
};
q.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
q.array.binaryInsert = function(a, b, d) {
  d = q.array.binarySearch(a, b, d);
  return 0 > d ? (q.array.insertAt(a, b, -(d + 1)), !0) : !1;
};
q.array.binaryRemove = function(a, b, d) {
  b = q.array.binarySearch(a, b, d);
  return 0 <= b ? q.array.removeAt(a, b) : !1;
};
q.array.bucket = function(a, b, d) {
  for (var e = {}, f = 0;f < a.length;f++) {
    var g = a[f], h = b.call(d, g, f, a);
    q.isDef(h) && (e[h] || (e[h] = [])).push(g);
  }
  return e;
};
q.array.toObject = function(a, b, d) {
  var e = {};
  q.array.forEach(a, function(f, g) {
    e[b.call(d, f, g, a)] = f;
  });
  return e;
};
q.array.range = function(a, b, d) {
  var e = [], f = 0, g = a;
  d = d || 1;
  void 0 !== b && (f = a, g = b);
  if (0 > d * (g - f)) {
    return [];
  }
  if (0 < d) {
    for (a = f;a < g;a += d) {
      e.push(a);
    }
  } else {
    for (a = f;a > g;a += d) {
      e.push(a);
    }
  }
  return e;
};
q.array.repeat = function(a, b) {
  for (var d = [], e = 0;e < b;e++) {
    d[e] = a;
  }
  return d;
};
q.array.flatten = function(a) {
  for (var b = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    if (q.isArray(e)) {
      for (var f = 0;f < e.length;f += 8192) {
        for (var g = q.array.slice(e, f, f + 8192), g = q.array.flatten.apply(null, g), h = 0;h < g.length;h++) {
          b.push(g[h]);
        }
      }
    } else {
      b.push(e);
    }
  }
  return b;
};
q.array.rotate = function(a, b) {
  q.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));
  return a;
};
q.array.moveItem = function(a, b, d) {
  q.asserts.assert(0 <= b && b < a.length);
  q.asserts.assert(0 <= d && d < a.length);
  b = Array.prototype.splice.call(a, b, 1);
  Array.prototype.splice.call(a, d, 0, b[0]);
};
q.array.zip = function(a) {
  if (!arguments.length) {
    return [];
  }
  for (var b = [], d = arguments[0].length, e = 1;e < arguments.length;e++) {
    arguments[e].length < d && (d = arguments[e].length);
  }
  for (e = 0;e < d;e++) {
    for (var f = [], g = 0;g < arguments.length;g++) {
      f.push(arguments[g][e]);
    }
    b.push(f);
  }
  return b;
};
q.array.shuffle = function(a, b) {
  b = b || Math.random;
  for (var d = a.length - 1;0 < d;d--) {
    var e = Math.floor(b() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
q.array.copyByIndex = function(a, b) {
  var d = [];
  q.array.forEach(b, function(b) {
    d.push(a[b]);
  });
  return d;
};
q.array.concatMap = function(a, b, d) {
  return q.array.concat.apply([], q.array.map(a, b, d));
};
var da = require("doctrine");
function T(a) {
  return "NullableLiteral" === a.type || "AllLiteral" === a.type || "NullLiteral" === a.type || "UndefinedLiteral" === a.type || "VoidLiteral" === a.type || "StringLiteralType" === a.type || "NumericLiteralType" === a.type;
}
function ea(a) {
  return T(a) || "NameExpression" === a.type;
}
function U(a, b) {
  b(a);
  if (!ea(a)) {
    switch(a.type) {
      case "ArrayType":
        a.elements.forEach(function(a) {
          return U(a, b);
        });
        break;
      case "RecordType":
        a.fields.forEach(function(a) {
          return U(a, b);
        });
        break;
      case "FunctionType":
        a.this && U(a.this, b);
        a.params.forEach(function(a) {
          return U(a, b);
        });
        a.result && U(a.result, b);
        break;
      case "FieldType":
        a.value && U(a.value, b);
        break;
      case "ParameterType":
      case "RestType":
      case "NonNullableType":
      case "OptionalType":
      case "NullableType":
        U(a.expression, b);
        break;
      case "TypeApplication":
        U(a.expression, b);
        a.applications.forEach(function(a) {
          return U(a, b);
        });
        break;
      case "UnionType":
        a.elements.forEach(function(a) {
          return U(a, b);
        });
        break;
      default:
        throw Error("Unrecoginized tag type.");
    }
  }
}
function W(a) {
  return "Block" === a.type && "*" === a.value.charAt(0);
}
function fa(a) {
  var b = ["FunctionExpression", "ArrowFunctionExpression", "ClassExpression"];
  return y.isASTMatch(a, {type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", init:function(a) {
    return !!a && -1 !== b.indexOf(a.type);
  }}]});
}
var X = {getJSDocComment:function(a) {
  return !a.leadingComments || 0 == a.leadingComments.length || fa(a) ? null : a.leadingComments.filter(W).reduce(function(a, d) {
    return d || a;
  }, null);
}, hasTypeInformation:function(a) {
  var b = "type typedef record const private package protected public export".split(" ");
  return a.tags.some(function(a) {
    return q.array.contains(b, a.title);
  });
}, isLiteral:T, isJSDocComment:W, parseComment:function(a) {
  try {
    return da.parse(a, {strict:!0, unwrap:!0, sloppy:!0});
  } catch (b) {
    if (/braces/i.test(b.message)) {
      throw Error("JSDoc type missing brace.");
    }
    throw Error("JSDoc syntax error.");
  }
}, traverseTags:U};
var ga = require("doctrine");
function Y(a) {
  return null === a.type || a.type.name && "void" === a.type.name || "UndefinedLiteral" === a.type.type;
}
var ha = "string number boolean Object Array Map Set".split(" ");
function Z(a, b) {
  b.type && X.traverseTags(b.type, function(b) {
    "NameExpression" === b.type && (b = b.name, -1 === ha.indexOf(b) && a.markVariableAsUsed(b));
  });
}
;function ia(a) {
  return !!D.matchExtractDirective(a);
}
function ja(a, b) {
  for (var d = 0;d < b.length;++d) {
    if (!a(b[d])) {
      return b.slice(0, d);
    }
  }
  return b.slice();
}
;module.exports = {rules:{camelcase:{meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = Object.assign({}, N, a.options[0] || {});
  return {Identifier:function(d) {
    d = O(d, b);
    d.hasError && a.report({node:d.node, message:d.message});
  }};
}}, indent:{meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", minimum:0}, 
MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:!1}]}, create:function(a) {
  function b(a, b, d) {
    var e = "space" + (1 === b ? "" : "s"), f = "tab" + (1 === d ? "" : "s");
    return "Expected indentation of " + (a + " " + t + (1 === a ? "" : "s")) + " but" + (" found " + (0 < b && 0 < d ? b + " " + e + " and " + (d + " " + f) : 0 < b ? "space" === t ? b : b + " " + e : 0 < d ? "tab" === t ? d : d + " " + f : "0") + ".");
  }
  function d(d, e, f, g, h, k) {
    var ka = ("space" === t ? " " : "\t").repeat(e), G = k ? [d.range[1] - f - g - 1, d.range[1] - 1] : [d.range[0] - f - g, d.range[0]];
    a.report({node:d, loc:h, message:b(e, f, g), fix:function(a) {
      return a.replaceTextRange(G, ka);
    }});
  }
  function e(a, b) {
    var e = Q(a, n, t, !1);
    "ArrayExpression" === a.type || "ObjectExpression" === a.type || e.goodChar === b && 0 === e.badChar || !R(a, n) || d(a, b, e.space, e.tab);
  }
  function f(a, b) {
    a.forEach(function(a) {
      return e(a, b);
    });
  }
  function g(a, b) {
    var e = n.getLastToken(a), f = Q(e, n, t, !0);
    f.goodChar === b && 0 === f.badChar || !R(a, n, !0) || d(a, b, f.space, f.tab, {start:{line:e.loc.start.line, column:e.loc.start.column}}, !0);
  }
  function h(a) {
    var b = Q(a, n, t).goodChar, d = a.parent;
    if ("Property" === d.type || "ArrayExpression" === d.type) {
      b = Q(a, n, t, !1).goodChar;
    } else {
      if ("CallExpression" === d.type) {
        var e;
        e = 1 <= d.arguments.length ? d.arguments[0].loc.end.line > d.arguments[0].loc.start.line : !1;
        e && J.isNodeOneLine(d.callee) && !R(a, n) && (b = Q(d, n, t).goodChar);
      }
    }
    return b;
  }
  function k(a) {
    var b = a.body, d = h(a), e = p, f;
    if (f = -1 !== m.outerIIFEBody) {
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
    f ? e = m.outerIIFEBody * p : "FunctionExpression" === a.type ? e = m.FunctionExpression.body * p : "FunctionDeclaration" === a.type && (e = m.FunctionDeclaration.body * p);
    d += e;
    (f = D.findAncestorOfType(a, "VariableDeclarator")) && S(a, f) && (d += p * m.VariableDeclarator[f.parent.kind]);
    u(b, d, d - e);
  }
  function l(a) {
    if (!J.isNodeOneLine(a)) {
      var b = a.body;
      a = h(a);
      u(b, a + p, a);
    }
  }
  function x(a) {
    var b = a.parent, e = D.findAncestorOfType(a, "VariableDeclarator"), f = Q(b, n, t).goodChar;
    if (R(a, n)) {
      if (e) {
        if (b === e) {
          e === e.parent.declarations[0] && (f += p * m.VariableDeclarator[e.parent.kind]);
        } else {
          if ("ObjectExpression" === b.type || "ArrayExpression" === b.type || "CallExpression" === b.type || "ArrowFunctionExpression" === b.type || "NewExpression" === b.type || "LogicalExpression" === b.type) {
            f += p;
          }
        }
      } else {
        var g;
        g = "ArrayExpression" !== b.type ? !1 : b.elements[0] ? "ObjectExpression" === b.elements[0].type && b.elements[0].loc.start.line === b.loc.start.line : !1;
        g || "MemberExpression" === b.type || "ExpressionStatement" === b.type || "AssignmentExpression" === b.type || "Property" === b.type || (f += p);
      }
      b = f + p;
      g = Q(a, n, t, !1);
      g.goodChar === f && 0 === g.badChar || !R(a, n) || d(a, f, g.space, g.tab, {start:{line:a.loc.start.line, column:a.loc.start.column}});
    } else {
      f = Q(a, n, t).goodChar, b = f + p;
    }
    S(a, e) && (b += p * m.VariableDeclarator[e.parent.kind]);
    return b;
  }
  function u(a, b, d) {
    J.isNodeOneLine(a) || (f(a.body, b), g(a, d));
  }
  function B(a) {
    var b = Q(a, n, t).goodChar, d = b + p;
    "BlockStatement" === a.body.type ? u(a.body, d, b) : f([a.body], d);
  }
  function C(a, b, d) {
    "first" === d && a.params.length ? f(a.params.slice(1), a.params[0].loc.start.column) : f(a.params, b * d);
  }
  function I(a, b) {
    a = "SwitchStatement" === a.type ? a : a.parent;
    if (M[a.loc.start.line]) {
      return M[a.loc.start.line];
    }
    "undefined" === typeof b && (b = Q(a, n, t).goodChar);
    b = 0 < a.cases.length && 0 === m.SwitchCase ? b : b + p * m.SwitchCase;
    return M[a.loc.start.line] = b;
  }
  var E = ca(a.options), t = E.indentType, p = E.indentSize, m = E.indentOptions, n = a.getSourceCode(), M = {};
  return {Program:function(a) {
    f(a.body, 0);
  }, ClassDeclaration:l, ClassExpression:l, BlockStatement:function(a) {
    if (!J.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = Q(a, n, t).goodChar;
      u(a, b + p, b);
    }
  }, DoWhileStatement:B, ForStatement:B, ForInStatement:B, ForOfStatement:B, WhileStatement:B, WithStatement:B, IfStatement:function(a) {
    var b = Q(a, n, t).goodChar, d = b + p;
    "BlockStatement" !== a.consequent.type ? J.nodesStartOnSameLine(a, a.consequent) || e(a.consequent, d) : (f(a.consequent.body, d), g(a.consequent, b));
    if (a.alternate) {
      var h = n.getTokenBefore(a.alternate);
      e(h, b);
      "BlockStatement" !== a.alternate.type ? J.nodesStartOnSameLine(a.alternate, h) || e(a.alternate, d) : (f(a.alternate.body, d), g(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!J.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = ba(a), d = Q(a, n, t).goodChar, e = b[b.length - 1], d = d + p * m.VariableDeclarator[a.kind];
      f(b, d);
      n.getLastToken(a).loc.end.line <= e.loc.end.line || (b = n.getTokenBefore(e), "," === b.value ? g(a, Q(b, n, t).goodChar) : g(a, d - p));
    }
  }, ObjectExpression:function(a) {
    if (!J.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && J.nodesStartOnSameLine(b[0], a))) {
        var d = x(a);
        f(b, d);
        g(a, d - p);
      }
    }
  }, ArrayExpression:function(a) {
    if (!J.isNodeOneLine(a)) {
      var b = a.elements.filter(function(a) {
        return null !== a;
      });
      if (!(0 < b.length && J.nodesStartOnSameLine(b[0], a))) {
        var d = x(a);
        f(b, d);
        g(a, d - p);
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== m.MemberExpression && !J.isNodeOneLine(a) && !D.findAncestorOfType(a, "VariableDeclarator") && !D.findAncestorOfType(a, "AssignmentExpression")) {
      var b = Q(a, n, t).goodChar + p * m.MemberExpression, d = [a.property];
      a = n.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && d.push(a);
      f(d, b);
    }
  }, SwitchStatement:function(a) {
    var b = Q(a, n, t).goodChar, d = I(a, b);
    f(a.cases, d);
    g(a, b);
  }, SwitchCase:function(a) {
    if (!J.isNodeOneLine(a)) {
      var b = I(a);
      f(a.consequent, b + p);
    }
  }, ArrowFunctionExpression:function(a) {
    J.isNodeOneLine(a) || "BlockStatement" === a.body.type && k(a);
  }, FunctionDeclaration:function(a) {
    J.isNodeOneLine(a) || (-1 !== m.FunctionDeclaration.parameters && C(a, p, m.FunctionDeclaration.parameters), k(a));
  }, FunctionExpression:function(a) {
    J.isNodeOneLine(a) || (-1 !== m.FunctionExpression.parameters && C(a, p, m.FunctionExpression.parameters), k(a));
  }};
}}, "inline-comment-spacing":{meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var b = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(d) {
    var e = a.getSourceCode();
    e.getComments(d);
    e = e.getTokenBefore(d, 1) || e.getTokenOrCommentBefore(d);
    if (null != e && J.nodesShareOneLine(d, e)) {
      var f = d.start - e.end;
      f < b && a.report({node:d, message:"Expected at least " + b + " " + (1 === b ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var e = Array(b - f + 1).join(" ");
        return a.insertTextBefore(d, e);
      }});
    }
  }};
}}, jsdoc:{meta:{docs:{description:"enforce valid JSDoc comments", category:"Possible Errors", recommended:!0}, schema:[{type:"object", properties:{prefer:{type:"object", additionalProperties:{type:"string"}}, preferType:{type:"object", additionalProperties:{type:"string"}}, requireReturn:{type:"boolean"}, requireParamDescription:{type:"boolean"}, requireReturnDescription:{type:"boolean"}, matchDescription:{type:"string"}, requireReturnType:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  function b(a) {
    f.push({returnPresent:"ArrowFunctionExpression" === a.type && "BlockStatement" !== a.body.type || J.isNodeClassType(a)});
  }
  function d(b, d) {
    X.traverseTags(d, function(d) {
      if ("NameExpression" === d.type) {
        d = d.name;
        var e = C[d];
        e && a.report({node:b, message:"Use '" + e + "' instead of '" + d + "'."});
      }
    });
  }
  function e(b) {
    var e = g.getJSDocComment(b), p = f.pop(), m = Object.create(null), n = !1, E = !1, C = !1, G = !1, V = !1, K;
    if (e) {
      try {
        K = ga.parse(e.value, {strict:!0, unwrap:!0, sloppy:!0});
      } catch (la) {
        /braces/i.test(la.message) ? a.report({node:e, message:"JSDoc type missing brace."}) : a.report({node:e, message:"JSDoc syntax error."});
        return;
      }
      K.tags.forEach(function(b) {
        switch(b.title.toLowerCase()) {
          case "param":
          case "arg":
          case "argument":
            b.type || a.report({node:e, message:"Missing JSDoc parameter type for '" + b.name + "'."});
            !b.description && x && a.report({node:e, message:"Missing JSDoc parameter description for " + ("'" + b.name + "'.")});
            m[b.name] ? a.report({node:e, message:"Duplicate JSDoc parameter '" + b.name + "'."}) : -1 === b.name.indexOf(".") && (m[b.name] = 1);
            break;
          case "return":
          case "returns":
            n = !0;
            l || p.returnPresent || null !== b.type && Y(b) || V ? (B && !b.type && a.report({node:e, message:"Missing JSDoc return type."}), Y(b) || b.description || !u || a.report({node:e, message:"Missing JSDoc return description."})) : a.report({node:e, message:"Unexpected @{{title}} tag; function has no return statement.", data:{title:b.title}});
            break;
          case "constructor":
          case "class":
            E = !0;
            break;
          case "override":
          case "inheritdoc":
            G = !0;
            break;
          case "abstract":
          case "virtual":
            V = !0;
            break;
          case "interface":
            C = !0;
        }
        k.hasOwnProperty(b.title) && b.title !== k[b.title] && a.report({node:e, message:"Use @{{name}} instead.", data:{name:k[b.title]}});
        Z(a, b);
        I && b.type && d(e, b.type);
      });
      G || n || E || C || J.isNodeGetterFunction(b) || J.isNodeSetterFunction(b) || J.isNodeConstructorFunction(b) || J.isNodeClassType(b) || (l || p.returnPresent) && a.report({node:e, message:"Missing JSDoc @{{returns}} for function.", data:{returns:k.returns || "returns"}});
      var L = Object.keys(m);
      b.params && b.params.forEach(function(b, d) {
        "AssignmentPattern" === b.type && (b = b.left);
        var f = b.name;
        "Identifier" === b.type && (L[d] && f !== L[d] ? a.report({node:e, message:"Expected JSDoc for '" + f + "' but found " + ("'" + L[d] + "'.")}) : m[f] || G || a.report({node:e, message:"Missing JSDoc for parameter '" + f + "'."}));
      });
      h.matchDescription && ((new RegExp(h.matchDescription)).test(K.description) || a.report({node:e, message:"JSDoc description does not satisfy the regex pattern."}));
    }
  }
  var f = [], g = a.getSourceCode(), h = a.options[0] || {}, k = h.prefer || {}, l = !1 !== h.requireReturn, x = !1 !== h.requireParamDescription, u = !1 !== h.requireReturnDescription, B = !1 !== h.requireReturnType, C = h.preferType || {}, I = 0 !== Object.keys(C).length;
  return {ArrowFunctionExpression:b, FunctionExpression:b, FunctionDeclaration:b, ClassExpression:b, ClassDeclaration:b, "ArrowFunctionExpression:exit":e, "FunctionExpression:exit":e, "FunctionDeclaration:exit":e, "ClassExpression:exit":e, "ClassDeclaration:exit":e, ReturnStatement:function(a) {
    var b = f[f.length - 1];
    b && null !== a.argument && (b.returnPresent = !0);
  }, VariableDeclaration:function(b) {
    if (1 === b.declarations.length) {
      var d = X.getJSDocComment(b);
      if (d) {
        var e;
        try {
          e = X.parseComment(d.value);
        } catch (m) {
          return;
        }
        b = b.declarations[0];
        "Identifier" === b.id.type && (b = b.id.name, X.hasTypeInformation(e) && a.markVariableAsUsed(b), e.tags.forEach(function(b) {
          Z(a, b);
        }));
      }
    }
  }};
}}, "no-undef":{meta:{docs:{description:"disallow the use of undeclared variables unless mentioned in `/*global */` comments", category:"Variables", recommended:!0}, schema:[{type:"object", properties:{typeof:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = a.options[0], d = b && !0 === b.typeof || !1, e = [], f = [];
  return {Program:function(a) {
    e = a.body.map(D.matchExtractBareGoogRequire).filter(function(a) {
      return !!a;
    }).map(function(a) {
      return a.source;
    });
    f = a.body.map(D.matchExtractGoogProvide).filter(function(a) {
      return !!a;
    }).map(function(a) {
      return a.source;
    });
  }, "Program:exit":function() {
    function b(a) {
      return e.some(function(b) {
        return J.isValidPrefix(a, b);
      });
    }
    function h(a) {
      return f.some(function(b) {
        return J.isValidPrefix(a, b);
      });
    }
    a.getScope().through.forEach(function(e) {
      e = e.identifier;
      var f = D.getFullyQualifedName(e), g;
      if (g = !d) {
        g = e.parent, g = "UnaryExpression" === g.type && "typeof" === g.operator;
      }
      g || h(f) || b(f) || a.report({node:e, message:"'" + e.name + "' is not defined."});
    });
  }};
}}, "no-unused-expressions":{meta:{docs:{description:"disallow unused expressions", category:"Best Practices", recommended:!1}, schema:[{type:"object", properties:{allowShortCircuit:{type:"boolean"}, allowTernary:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  function b(a) {
    if (f && "ConditionalExpression" === a.type) {
      return b(a.consequent) && b(a.alternate);
    }
    if (e && "LogicalExpression" === a.type) {
      return b(a.right);
    }
    var d = /^(?:Assignment|Call|New|Update|Yield|Await)Expression$/.test(a.type);
    a = "UnaryExpression" === a.type && 0 <= ["delete", "void"].indexOf(a.operator);
    return d || a;
  }
  var d = a.options[0] || {}, e = d.allowShortCircuit || !1, f = d.allowTernary || !1;
  return {ExpressionStatement:function(d) {
    var e;
    if (e = !b(d.expression)) {
      var f = a.getAncestors();
      e = f[f.length - 1];
      f = f[f.length - 2];
      f = "BlockStatement" === e.type && /Function/.test(f.type);
      e = "Program" === e.type || f ? q.array.contains(ja(ia, e.body), d) : !1;
      e = !e;
    }
    if (e) {
      var g;
      if (e = X.getJSDocComment(d)) {
        try {
          var x = X.parseComment(e.value);
          g = X.hasTypeInformation(x);
        } catch (u) {
          g = !1;
        }
      } else {
        g = !1;
      }
      e = !g;
    }
    e && a.report({node:d, message:"Expected an assignment or function call and instead saw an expression."});
  }};
}}, "no-unused-vars":{meta:{docs:{description:"disallow unused variables", category:"Variables", recommended:!0}, schema:[{oneOf:[{enum:["all", "local"]}, {type:"object", properties:{vars:{enum:["all", "local"]}, varsIgnorePattern:{type:"string"}, args:{enum:["all", "after-used", "none"]}, argsIgnorePattern:{type:"string"}, caughtErrors:{enum:["all", "none"]}, caughtErrorsIgnorePattern:{type:"string"}, allowUnusedTypes:{type:"boolean"}}}]}]}, create:function(a) {
  function b(a, b) {
    return a.range[0] >= b.range[0] && a.range[1] <= b.range[1];
  }
  function d(a, d) {
    var e = a;
    for (a = a.parent;a && b(a, d);) {
      switch(a.type) {
        case "SequenceExpression":
          var f = a;
          if (f.expressions[f.expressions.length - 1] !== e) {
            return !1;
          }
          break;
        case "CallExpression":
        case "NewExpression":
          return a.callee !== e;
        case "AssignmentExpression":
        case "TaggedTemplateExpression":
        case "YieldExpression":
          return !0;
        default:
          if (x.test(a.type)) {
            return !0;
          }
      }
      e = a;
      a = a.parent;
    }
    return !1;
  }
  function e(a) {
    var e = a.defs.filter(function(a) {
      return "FunctionName" === a.type;
    }).map(function(a) {
      return a.node;
    }), f = 0 < e.length, g = null;
    return a.references.some(function(a) {
      var h;
      h = a.identifier.parent;
      "VariableDeclarator" === h.type && (h = h.parent.parent);
      h = "ForInStatement" !== h.type ? !1 : (h = "BlockStatement" === h.body.type ? h.body.body[0] : h.body) ? "ReturnStatement" === h.type : !1;
      if (h) {
        return !0;
      }
      h = g;
      var k = a.identifier, m = k.parent, n = m.parent, u;
      if (u = a.isRead()) {
        !(m = "AssignmentExpression" === m.type && "ExpressionStatement" === n.type && m.left === k || "UpdateExpression" === m.type && "ExpressionStatement" === n.type) && (m = h && b(k, h)) && (k = D.findAncestor(k, D.isFunction), m = !(k && b(k, h) && d(k, h))), u = m;
      }
      h = u;
      k = g;
      m = a.identifier;
      n = m.parent;
      u = n.parent;
      var l;
      if (!(l = a.from.variableScope !== a.resolved.scope.variableScope)) {
        b: {
          for (l = m;l;) {
            if (D.isLoop(l)) {
              l = !0;
              break b;
            }
            if (D.isFunction(l)) {
              break;
            }
            l = l.parent;
          }
          l = !1;
        }
      }
      g = k && b(m, k) ? k : "AssignmentExpression" !== n.type || "ExpressionStatement" !== u.type || m !== n.left || l ? null : n.right;
      if (h = a.isRead() && !h) {
        if (h = f) {
          a: {
            for (a = a.from;a;) {
              if (0 <= e.indexOf(a.block)) {
                h = !0;
                break a;
              }
              a = a.upper;
            }
            h = !1;
          }
        }
        h = !h;
      }
      return h;
    });
  }
  function f(b) {
    var d = b.defs[0];
    return d.index === d.node.params.length - 1 || k.argsIgnorePattern && (d = a.getDeclaredVariables(d.node), d.slice(d.indexOf(b) + 1).every(function(a) {
      return 0 === a.references.length && k.argsIgnorePattern.test(a.name);
    })) ? !0 : !1;
  }
  function g(a, b) {
    var d = a.variables, h = a.childScopes, l, u;
    if ("TDZ" !== a.type && ("global" !== a.type || "all" === k.vars)) {
      for (l = 0, u = d.length;l < u;++l) {
        var p = d[l];
        if (!("class" === a.type && a.block.id === p.identifiers[0] || a.functionExpressionScope || p.eslintUsed || "function" === a.type && "arguments" === p.name && 0 === p.identifiers.length)) {
          var m = p.defs[0];
          if (m) {
            var n = m.type;
            if ("CatchClause" === n) {
              if ("none" === k.caughtErrors) {
                continue;
              }
              if (k.caughtErrorsIgnorePattern && k.caughtErrorsIgnorePattern.test(m.name.name)) {
                continue;
              }
            }
            if ("Parameter" === n) {
              if ("Property" === m.node.parent.type && "set" === m.node.parent.kind) {
                continue;
              }
              if ("none" === k.args) {
                continue;
              }
              if (k.argsIgnorePattern && k.argsIgnorePattern.test(m.name.name)) {
                continue;
              }
              if ("after-used" === k.args && !f(p)) {
                continue;
              }
            } else {
              if (k.varsIgnorePattern && k.varsIgnorePattern.test(m.name.name)) {
                continue;
              }
            }
          }
          if (m = !e(p)) {
            a: {
              if (m = p.defs[0]) {
                n = m.node;
                if ("VariableDeclarator" === n.type) {
                  n = n.parent;
                } else {
                  if ("Parameter" === m.type) {
                    m = !1;
                    break a;
                  }
                }
                m = 0 === n.parent.type.indexOf("Export");
              } else {
                m = !1;
              }
            }
            m = !m;
          }
          m && b.push(p);
        }
      }
    }
    l = 0;
    for (u = h.length;l < u;++l) {
      g(h[l], b);
    }
    return b;
  }
  function h(a) {
    var b = a.eslintExplicitGlobalComment, d = b.loc.start;
    a = new RegExp("[\\s,]" + J.escapeRegexp(a.name) + "(?:$|[\\s,:])", "g");
    a.lastIndex = b.value.indexOf("global") + 6;
    a = (a = a.exec(b.value)) ? a.index + 1 : 0;
    var b = b.value.slice(0, a), e = (b.match(/\n/g) || []).length;
    a = 0 < e ? a - (1 + b.lastIndexOf("\n")) : a + (d.column + 2);
    return {start:{line:d.line + e, column:a}};
  }
  var k = {vars:"all", args:"after-used", caughtErrors:"none", allowUnusedTypes:!1}, l = a.options[0];
  l && ("string" === typeof l ? k.vars = l : (k.vars = l.vars || k.vars, k.args = l.args || k.args, k.caughtErrors = l.caughtErrors || k.caughtErrors, l.varsIgnorePattern && (k.varsIgnorePattern = new RegExp(l.varsIgnorePattern)), l.argsIgnorePattern && (k.argsIgnorePattern = new RegExp(l.argsIgnorePattern)), l.caughtErrorsIgnorePattern && (k.caughtErrorsIgnorePattern = new RegExp(l.caughtErrorsIgnorePattern)), l.allowUnusedTypes && (k.allowUnusedTypes = l.allowUnusedTypes)));
  var x = /(?:Statement|Declaration)$/;
  return {"Program:exit":function(b) {
    for (var d = g(a.getScope(), []), d = c.makeIterator(d), e = d.next();!e.done;e = d.next()) {
      e = e.value, e.eslintExplicitGlobal ? a.report({node:b, loc:h(e), message:"'{{name}}' is defined but never used.", data:e}) : 0 < e.defs.length && a.report({node:e.identifiers[0], message:"'{{name}}' is defined but never used.", data:e});
    }
  }};
}}}};

