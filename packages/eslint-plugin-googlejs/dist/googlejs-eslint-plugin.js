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
var n = n || {};
n.global = this;
n.isDef = function(a) {
  return void 0 !== a;
};
n.exportPath_ = function(a, b, d) {
  a = a.split(".");
  d = d || n.global;
  a[0] in d || !d.execScript || d.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    !a.length && n.isDef(b) ? d[e] = b : d = d[e] ? d[e] : d[e] = {};
  }
};
n.define = function(a, b) {
  n.exportPath_(a, b);
};
n.DEBUG = !0;
n.LOCALE = "en";
n.TRUSTED_SITE = !0;
n.STRICT_MODE_COMPATIBLE = !1;
n.DISALLOW_TEST_ONLY_CODE = !n.DEBUG;
n.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
n.provide = function(a) {
  if (n.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  n.constructNamespace_(a);
};
n.constructNamespace_ = function(a, b) {
  n.exportPath_(a, b);
};
n.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
n.module = function(a) {
  if (!n.isString(a) || !a || -1 == a.search(n.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!n.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (n.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  n.moduleLoaderState_.moduleName = a;
};
n.module.get = function(a) {
  return n.module.getInternal_(a);
};
n.module.getInternal_ = function() {
};
n.moduleLoaderState_ = null;
n.isInModuleLoader_ = function() {
  return null != n.moduleLoaderState_;
};
n.module.declareLegacyNamespace = function() {
  n.moduleLoaderState_.declareLegacyNamespace = !0;
};
n.setTestOnly = function(a) {
  if (n.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
n.forwardDeclare = function() {
};
n.getObjectByName = function(a, b) {
  a = a.split(".");
  b = b || n.global;
  for (var d;d = a.shift();) {
    if (n.isDefAndNotNull(b[d])) {
      b = b[d];
    } else {
      return null;
    }
  }
  return b;
};
n.globalize = function(a, b) {
  b = b || n.global;
  for (var d in a) {
    b[d] = a[d];
  }
};
n.addDependency = function(a, b, d, e) {
  if (n.DEPENDENCIES_ENABLED) {
    var f;
    a = a.replace(/\\/g, "/");
    var g = n.dependencies_;
    e && "boolean" !== typeof e || (e = e ? {module:"goog"} : {});
    for (var h = 0;f = b[h];h++) {
      g.nameToPath[f] = a, g.loadFlags[a] = e;
    }
    for (e = 0;b = d[e];e++) {
      a in g.requires || (g.requires[a] = {}), g.requires[a][b] = !0;
    }
  }
};
n.ENABLE_DEBUG_LOADER = !0;
n.logToConsole_ = function(a) {
  n.global.console && n.global.console.error(a);
};
n.require = function() {
};
n.basePath = "";
n.nullFunction = function() {
};
n.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
n.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    n.DEBUG && (n.instantiatedSingletons_[n.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
n.instantiatedSingletons_ = [];
n.LOAD_MODULE_USING_EVAL = !0;
n.SEAL_MODULE_EXPORTS = n.DEBUG;
n.loadedModules_ = {};
n.DEPENDENCIES_ENABLED = !1;
n.TRANSPILE = "detect";
n.TRANSPILER = "transpile.js";
n.DEPENDENCIES_ENABLED && (n.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, n.inHtmlDocument_ = function() {
  var a = n.global.document;
  return null != a && "write" in a;
}, n.findBasePath_ = function() {
  if (n.isDef(n.global.CLOSURE_BASE_PATH)) {
    n.basePath = n.global.CLOSURE_BASE_PATH;
  } else {
    if (n.inHtmlDocument_()) {
      for (var a = n.global.document.getElementsByTagName("SCRIPT"), b = a.length - 1;0 <= b;--b) {
        var d = a[b].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if ("base.js" == d.substr(e - 7, 7)) {
          n.basePath = d.substr(0, e - 7);
          break;
        }
      }
    }
  }
}, n.importScript_ = function(a, b) {
  (n.global.CLOSURE_IMPORT_SCRIPT || n.writeScriptTag_)(a, b) && (n.dependencies_.written[a] = !0);
}, n.IS_OLD_IE_ = !(n.global.atob || !n.global.document || !n.global.document.all), n.importProcessedScript_ = function(a, b, d) {
  n.importScript_("", 'goog.retrieveAndExec_("' + a + '", ' + b + ", " + d + ");");
}, n.queuedModules_ = [], n.wrapModule_ = function(a, b) {
  return n.LOAD_MODULE_USING_EVAL && n.isDef(n.global.JSON) ? "goog.loadModule(" + n.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, n.loadQueuedModules_ = function() {
  var a = n.queuedModules_.length;
  if (0 < a) {
    var b = n.queuedModules_;
    n.queuedModules_ = [];
    for (var d = 0;d < a;d++) {
      n.maybeProcessDeferredPath_(b[d]);
    }
  }
}, n.maybeProcessDeferredDep_ = function(a) {
  n.isDeferredModule_(a) && n.allDepsAreAvailable_(a) && (a = n.getPathFromDeps_(a), n.maybeProcessDeferredPath_(n.basePath + a));
}, n.isDeferredModule_ = function(a) {
  var b = (a = n.getPathFromDeps_(a)) && n.dependencies_.loadFlags[a] || {};
  return a && ("goog" == b.module || n.needsTranspile_(b.lang)) ? n.basePath + a in n.dependencies_.deferred : !1;
}, n.allDepsAreAvailable_ = function(a) {
  if ((a = n.getPathFromDeps_(a)) && a in n.dependencies_.requires) {
    for (var b in n.dependencies_.requires[a]) {
      if (!n.isProvided_(b) && !n.isDeferredModule_(b)) {
        return !1;
      }
    }
  }
  return !0;
}, n.maybeProcessDeferredPath_ = function(a) {
  if (a in n.dependencies_.deferred) {
    var b = n.dependencies_.deferred[a];
    delete n.dependencies_.deferred[a];
    n.globalEval(b);
  }
}, n.loadModuleFromUrl = function(a) {
  n.retrieveAndExec_(a, !0, !1);
}, n.writeScriptSrcNode_ = function(a) {
  n.global.document.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
}, n.appendScriptSrcNode_ = function(a) {
  var b = n.global.document, d = b.createElement("script");
  d.type = "text/javascript";
  d.src = a;
  d.defer = !1;
  d.async = !1;
  b.head.appendChild(d);
}, n.writeScriptTag_ = function(a, b) {
  if (n.inHtmlDocument_()) {
    var d = n.global.document;
    if (!n.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == d.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    void 0 === b ? n.IS_OLD_IE_ ? (b = " onreadystatechange='goog.onScriptLoad_(this, " + ++n.lastNonModuleScriptIndex_ + ")' ", d.write('<script type="text/javascript" src="' + a + '"' + b + ">\x3c/script>")) : n.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? n.appendScriptSrcNode_(a) : n.writeScriptSrcNode_(a) : d.write('<script type="text/javascript">' + b + "\x3c/script>");
    return !0;
  }
  return !1;
}, n.needsTranspile_ = function(a) {
  if ("always" == n.TRANSPILE) {
    return !0;
  }
  if ("never" == n.TRANSPILE) {
    return !1;
  }
  if (!n.transpiledLanguages_) {
    n.transpiledLanguages_ = {es5:!0, es6:!0, "es6-impl":!0};
    try {
      n.transpiledLanguages_.es5 = eval("[1,].length!=1"), eval('(()=>{"use strict";let a={};const X=class{constructor(){}x(z){return new Map([...arguments]).get(z[0])==3}};return new X().x([a,3])})()') && (n.transpiledLanguages_["es6-impl"] = !1), eval('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()') && 
      (n.transpiledLanguages_.es6 = !1);
    } catch (b) {
    }
  }
  return !!n.transpiledLanguages_[a];
}, n.transpiledLanguages_ = null, n.lastNonModuleScriptIndex_ = 0, n.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && n.lastNonModuleScriptIndex_ == b && n.loadQueuedModules_();
  return !0;
}, n.writeScripts_ = function(a) {
  function b(a) {
    if (!(a in f.written || a in f.visited)) {
      f.visited[a] = !0;
      if (a in f.requires) {
        for (var g in f.requires[a]) {
          if (!n.isProvided_(g)) {
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
  var d = [], e = {}, f = n.dependencies_;
  b(a);
  for (a = 0;a < d.length;a++) {
    var g = d[a];
    n.dependencies_.written[g] = !0;
  }
  var h = n.moduleLoaderState_;
  n.moduleLoaderState_ = null;
  for (a = 0;a < d.length;a++) {
    if (g = d[a]) {
      var m = f.loadFlags[g] || {}, l = n.needsTranspile_(m.lang);
      "goog" == m.module || l ? n.importProcessedScript_(n.basePath + g, "goog" == m.module, l) : n.importScript_(n.basePath + g);
    } else {
      throw n.moduleLoaderState_ = h, Error("Undefined script input");
    }
  }
  n.moduleLoaderState_ = h;
}, n.getPathFromDeps_ = function(a) {
  return a in n.dependencies_.nameToPath ? n.dependencies_.nameToPath[a] : null;
}, n.findBasePath_(), n.global.CLOSURE_NO_DEPS || n.importScript_(n.basePath + "deps.js"));
n.loadModule = function(a) {
  var b = n.moduleLoaderState_;
  try {
    n.moduleLoaderState_ = {moduleName:void 0, declareLegacyNamespace:!1};
    var d;
    if (n.isFunction(a)) {
      d = a.call(void 0, {});
    } else {
      if (n.isString(a)) {
        d = n.loadModuleFromSource_.call(void 0, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var e = n.moduleLoaderState_.moduleName;
    if (!n.isString(e) || !e) {
      throw Error('Invalid module name "' + e + '"');
    }
    n.moduleLoaderState_.declareLegacyNamespace ? n.constructNamespace_(e, d) : n.SEAL_MODULE_EXPORTS && Object.seal && n.isObject(d) && Object.seal(d);
    n.loadedModules_[e] = d;
  } finally {
    n.moduleLoaderState_ = b;
  }
};
n.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
};
n.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0;b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
n.loadFileSync_ = function(a) {
  if (n.global.CLOSURE_LOAD_FILE_SYNC) {
    return n.global.CLOSURE_LOAD_FILE_SYNC(a);
  }
  try {
    var b = new n.global.XMLHttpRequest;
    b.open("get", a, !1);
    b.send();
    return 0 == b.status || 200 == b.status ? b.responseText : null;
  } catch (d) {
    return null;
  }
};
n.retrieveAndExec_ = function() {
};
n.transpile_ = function(a, b) {
  var d = n.global.$jscomp;
  d || (n.global.$jscomp = d = {});
  var e = d.transpile;
  if (!e) {
    var f = n.basePath + n.TRANSPILER, g = n.loadFileSync_(f);
    g && (eval(g + "\n//# sourceURL=" + f), d = n.global.$jscomp, e = d.transpile);
  }
  e || (e = d.transpile = function(a, b) {
    n.logToConsole_(b + " requires transpilation but no transpiler was found.");
    return a;
  });
  return e(a, b);
};
n.typeOf = function(a) {
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
n.isNull = function(a) {
  return null === a;
};
n.isDefAndNotNull = function(a) {
  return null != a;
};
n.isArray = function(a) {
  return "array" == n.typeOf(a);
};
n.isArrayLike = function(a) {
  var b = n.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
n.isDateLike = function(a) {
  return n.isObject(a) && "function" == typeof a.getFullYear;
};
n.isString = function(a) {
  return "string" == typeof a;
};
n.isBoolean = function(a) {
  return "boolean" == typeof a;
};
n.isNumber = function(a) {
  return "number" == typeof a;
};
n.isFunction = function(a) {
  return "function" == n.typeOf(a);
};
n.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
n.getUid = function(a) {
  return a[n.UID_PROPERTY_] || (a[n.UID_PROPERTY_] = ++n.uidCounter_);
};
n.hasUid = function(a) {
  return !!a[n.UID_PROPERTY_];
};
n.removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(n.UID_PROPERTY_);
  try {
    delete a[n.UID_PROPERTY_];
  } catch (b) {
  }
};
n.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
n.uidCounter_ = 0;
n.getHashCode = n.getUid;
n.removeHashCode = n.removeUid;
n.cloneObject = function(a) {
  var b = n.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, d;
    for (d in a) {
      b[d] = n.cloneObject(a[d]);
    }
    return b;
  }
  return a;
};
n.bindNative_ = function(a, b, d) {
  return a.call.apply(a.bind, arguments);
};
n.bindJs_ = function(a, b, d) {
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
n.bind = function(a, b, d) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? n.bind = n.bindNative_ : n.bind = n.bindJs_;
  return n.bind.apply(null, arguments);
};
n.partial = function(a, b) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = d.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
n.mixin = function(a, b) {
  for (var d in b) {
    a[d] = b[d];
  }
};
n.now = n.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
n.globalEval = function(a) {
  if (n.global.execScript) {
    n.global.execScript(a, "JavaScript");
  } else {
    if (n.global.eval) {
      if (null == n.evalWorksForGlobals_) {
        if (n.global.eval("var _evalTest_ = 1;"), "undefined" != typeof n.global._evalTest_) {
          try {
            delete n.global._evalTest_;
          } catch (e) {
          }
          n.evalWorksForGlobals_ = !0;
        } else {
          n.evalWorksForGlobals_ = !1;
        }
      }
      if (n.evalWorksForGlobals_) {
        n.global.eval(a);
      } else {
        var b = n.global.document, d = b.createElement("SCRIPT");
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
n.evalWorksForGlobals_ = null;
n.getCssName = function(a, b) {
  function d(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(e(a[d]));
    }
    return b.join("-");
  }
  function e(a) {
    return n.cssNameMapping_[a] || a;
  }
  if ("." == String(a).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
  }
  var f;
  f = n.cssNameMapping_ ? "BY_WHOLE" == n.cssNameMappingStyle_ ? e : d : function(a) {
    return a;
  };
  a = b ? a + "-" + f(b) : f(a);
  return n.global.CLOSURE_CSS_NAME_MAP_FN ? n.global.CLOSURE_CSS_NAME_MAP_FN(a) : a;
};
n.setCssNameMapping = function(a, b) {
  n.cssNameMapping_ = a;
  n.cssNameMappingStyle_ = b;
};
n.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, e) {
    return null != b && e in b ? b[e] : a;
  }));
  return a;
};
n.getMsgWithFallback = function(a) {
  return a;
};
n.exportSymbol = function(a, b, d) {
  n.exportPath_(a, b, d);
};
n.exportProperty = function(a, b, d) {
  a[b] = d;
};
n.inherits = function(a, b) {
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
n.base = function(a, b, d) {
  var e = arguments.callee.caller;
  if (n.STRICT_MODE_COMPATIBLE || n.DEBUG && !e) {
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
n.scope = function(a) {
  if (n.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  a.call(n.global);
};
n.defineClass = function(a, b) {
  var d = b.constructor, e = b.statics;
  d && d != Object.prototype.constructor || (d = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  d = n.defineClass.createSealingConstructor_(d, a);
  a && n.inherits(d, a);
  delete b.constructor;
  delete b.statics;
  n.defineClass.applyProperties_(d.prototype, b);
  null != e && (e instanceof Function ? e(d) : n.defineClass.applyProperties_(d, e));
  return d;
};
n.defineClass.SEAL_CLASS_INSTANCES = n.DEBUG;
n.defineClass.createSealingConstructor_ = function(a, b) {
  function d() {
    var b = a.apply(this, arguments) || this;
    b[n.UID_PROPERTY_] = b[n.UID_PROPERTY_];
    this.constructor === d && e && Object.seal instanceof Function && Object.seal(b);
    return b;
  }
  if (!n.defineClass.SEAL_CLASS_INSTANCES) {
    return a;
  }
  var e = !n.defineClass.isUnsealable_(b);
  return d;
};
n.defineClass.isUnsealable_ = function(a) {
  return a && a.prototype && a.prototype[n.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
n.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
n.defineClass.applyProperties_ = function(a, b) {
  for (var d in b) {
    Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
  }
  for (var e = 0;e < n.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;e++) {
    d = n.defineClass.OBJECT_PROTOTYPE_FIELDS_[e], Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
  }
};
n.tagUnsealableClass = function() {
};
n.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
n.object = {};
n.object.is = function(a, b) {
  return a === b ? 0 !== a || 1 / a === 1 / b : a !== a && b !== b;
};
n.object.forEach = function(a, b, d) {
  for (var e in a) {
    b.call(d, a[e], e, a);
  }
};
n.object.filter = function(a, b, d) {
  var e = {}, f;
  for (f in a) {
    b.call(d, a[f], f, a) && (e[f] = a[f]);
  }
  return e;
};
n.object.map = function(a, b, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = b.call(d, a[f], f, a);
  }
  return e;
};
n.object.some = function(a, b, d) {
  for (var e in a) {
    if (b.call(d, a[e], e, a)) {
      return !0;
    }
  }
  return !1;
};
n.object.every = function(a, b, d) {
  for (var e in a) {
    if (!b.call(d, a[e], e, a)) {
      return !1;
    }
  }
  return !0;
};
n.object.getCount = function(a) {
  var b = 0, d;
  for (d in a) {
    b++;
  }
  return b;
};
n.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
n.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
n.object.contains = function(a, b) {
  return n.object.containsValue(a, b);
};
n.object.getValues = function(a) {
  var b = [], d = 0, e;
  for (e in a) {
    b[d++] = a[e];
  }
  return b;
};
n.object.getKeys = function(a) {
  var b = [], d = 0, e;
  for (e in a) {
    b[d++] = e;
  }
  return b;
};
n.object.getValueByKeys = function(a, b) {
  for (var d = n.isArrayLike(b), e = d ? b : arguments, d = d ? 0 : 1;d < e.length && (a = a[e[d]], n.isDef(a));d++) {
  }
  return a;
};
n.object.containsKey = function(a, b) {
  return null !== a && b in a;
};
n.object.containsValue = function(a, b) {
  for (var d in a) {
    if (a[d] == b) {
      return !0;
    }
  }
  return !1;
};
n.object.findKey = function(a, b, d) {
  for (var e in a) {
    if (b.call(d, a[e], e, a)) {
      return e;
    }
  }
};
n.object.findValue = function(a, b, d) {
  return (b = n.object.findKey(a, b, d)) && a[b];
};
n.object.isEmpty = function(a) {
  for (var b in a) {
    return !1;
  }
  return !0;
};
n.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
n.object.remove = function(a, b) {
  var d;
  (d = b in a) && delete a[b];
  return d;
};
n.object.add = function(a, b, d) {
  if (null !== a && b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  n.object.set(a, b, d);
};
n.object.get = function(a, b, d) {
  return null !== a && b in a ? a[b] : d;
};
n.object.set = function(a, b, d) {
  a[b] = d;
};
n.object.setIfUndefined = function(a, b, d) {
  return b in a ? a[b] : a[b] = d;
};
n.object.setWithReturnValueIfNotSet = function(a, b, d) {
  if (b in a) {
    return a[b];
  }
  d = d();
  return a[b] = d;
};
n.object.equals = function(a, b) {
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
n.object.clone = function(a) {
  var b = {}, d;
  for (d in a) {
    b[d] = a[d];
  }
  return b;
};
n.object.unsafeClone = function(a) {
  var b = n.typeOf(a);
  if ("object" == b || "array" == b) {
    if (n.isFunction(a.clone)) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, d;
    for (d in a) {
      b[d] = n.object.unsafeClone(a[d]);
    }
    return b;
  }
  return a;
};
n.object.transpose = function(a) {
  var b = {}, d;
  for (d in a) {
    b[a[d]] = d;
  }
  return b;
};
n.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
n.object.extend = function(a, b) {
  for (var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (d in e) {
      a[d] = e[d];
    }
    for (var g = 0;g < n.object.PROTOTYPE_FIELDS_.length;g++) {
      d = n.object.PROTOTYPE_FIELDS_[g], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }
};
n.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && n.isArray(arguments[0])) {
    return n.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var d = {}, e = 0;e < b;e += 2) {
    d[arguments[e]] = arguments[e + 1];
  }
  return d;
};
n.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && n.isArray(arguments[0])) {
    return n.object.createSet.apply(null, arguments[0]);
  }
  for (var d = {}, e = 0;e < b;e++) {
    d[arguments[e]] = !0;
  }
  return d;
};
n.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
n.object.isImmutableView = function(a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
var r = require("lodash.ismatchwith");
function x(a) {
  return function(b) {
    return y(b, a);
  };
}
function y(a, b) {
  var d = {};
  return r(a, b, function(a, b) {
    if ("function" === typeof b) {
      return a = b(a), "object" === typeof a && n.object.extend(d, a), a;
    }
  }) ? d : !1;
}
var z = {extractAST:function(a, b) {
  return function(d) {
    var e = {}, e = (e[a] = d, e);
    "object" === typeof b && (b = x(b));
    if ("function" === typeof b) {
      d = b(d);
      if ("object" === typeof d) {
        return n.object.extend(e, d), e;
      }
      if (!d) {
        return !1;
      }
    }
    return e;
  };
}, isASTMatch:y, matchesAST:x, matchesASTLength:function(a) {
  var b = x(a);
  return function(d) {
    return d.length !== a.length ? !1 : b(d);
  };
}};
function A(a, b) {
  for (a = a.parent;!b(a) && "Program" !== a.type;) {
    a = a.parent;
  }
  return b(a) ? a : null;
}
function C(a, b) {
  b = void 0 === b ? "literal" : b;
  return z.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a && z.extractAST(b)(a);
  }});
}
var D = {findAncestor:A, findAncestorOfType:function(a, b) {
  return A(a, function(a) {
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
  return z.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"require"}}, arguments:[function(a) {
    return C(a, "source");
  }]}});
}, matchExtractGoogProvide:function(a) {
  return z.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"provide"}}, arguments:[function(a) {
    return C(a, "source");
  }]}});
}, matchExtractDirective:function(a) {
  return z.isASTMatch(a, {type:"ExpressionStatement", expression:function(a) {
    return C(a, "directive");
  }});
}, matchExtractStringLiteral:C, matchStringLiteral:function(a) {
  return z.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a;
  }});
}};
var F = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function I(a, b) {
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
  return I(a, a);
}, isNodeSetterFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "Property" === a.parent.type && "set" === a.parent.kind;
}, isValidPrefix:function(a, b) {
  return a.startsWith(b) ? a === b || "." === a[b.length] : !1;
}, nodesEndOnSameLine:function(a, b) {
  return a.loc.end.line === b.loc.end.line;
}, nodesShareOneLine:I, nodesStartOnSameLine:function(a, b) {
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
function T(a) {
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
function aa(a) {
  return a.declarations.reduce(function(b, d) {
    var e = b[b.length - 1];
    (d.loc.start.line !== a.loc.start.line && !e || e && e.loc.start.line !== d.loc.start.line) && b.push(d);
    return b;
  }, []);
}
function ba(a) {
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
;n.debug = {};
n.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, n.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
  this.reportErrorToServer = !0;
};
n.inherits(n.debug.Error, Error);
n.debug.Error.prototype.name = "CustomError";
n.dom = {};
n.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
n.string = {};
n.string.DETECT_DOUBLE_ESCAPING = !1;
n.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
n.string.Unicode = {NBSP:"\u00a0"};
n.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
n.string.endsWith = function(a, b) {
  var d = a.length - b.length;
  return 0 <= d && a.indexOf(b, d) == d;
};
n.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == n.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
n.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == n.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
n.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
n.string.subs = function(a, b) {
  for (var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < d.length;) {
    e += d.shift() + f.shift();
  }
  return e + d.join("%s");
};
n.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
n.string.isEmptyOrWhitespace = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
n.string.isEmptyString = function(a) {
  return 0 == a.length;
};
n.string.isEmpty = n.string.isEmptyOrWhitespace;
n.string.isEmptyOrWhitespaceSafe = function(a) {
  return n.string.isEmptyOrWhitespace(n.string.makeSafe(a));
};
n.string.isEmptySafe = n.string.isEmptyOrWhitespaceSafe;
n.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a);
};
n.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a);
};
n.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a);
};
n.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
n.string.isSpace = function(a) {
  return " " == a;
};
n.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
n.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
n.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
n.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
n.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
n.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
n.string.trim = n.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
n.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
n.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
n.string.caseInsensitiveCompare = function(a, b) {
  a = String(a).toLowerCase();
  b = String(b).toLowerCase();
  return a < b ? -1 : a == b ? 0 : 1;
};
n.string.numberAwareCompare_ = function(a, b, d) {
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
    var m = f[h];
    if (d != m) {
      return a = parseInt(d, 10), !isNaN(a) && (b = parseInt(m, 10), !isNaN(b) && a - b) ? a - b : d < m ? -1 : 1;
    }
  }
  return e.length != f.length ? e.length - f.length : a < b ? -1 : 1;
};
n.string.intAwareCompare = function(a, b) {
  return n.string.numberAwareCompare_(a, b, /\d+|\D+/g);
};
n.string.floatAwareCompare = function(a, b) {
  return n.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g);
};
n.string.numerateCompare = n.string.floatAwareCompare;
n.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
n.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
n.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
};
n.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(n.string.AMP_RE_, "&amp;").replace(n.string.LT_RE_, "&lt;").replace(n.string.GT_RE_, "&gt;").replace(n.string.QUOT_RE_, "&quot;").replace(n.string.SINGLE_QUOTE_RE_, "&#39;").replace(n.string.NULL_RE_, "&#0;"), n.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(n.string.E_RE_, "&#101;"));
  } else {
    if (!n.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(n.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(n.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(n.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(n.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(n.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(n.string.NULL_RE_, "&#0;"));
    n.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(n.string.E_RE_, "&#101;"));
  }
  return a;
};
n.string.AMP_RE_ = /&/g;
n.string.LT_RE_ = /</g;
n.string.GT_RE_ = />/g;
n.string.QUOT_RE_ = /"/g;
n.string.SINGLE_QUOTE_RE_ = /'/g;
n.string.NULL_RE_ = /\x00/g;
n.string.E_RE_ = /e/g;
n.string.ALL_RE_ = n.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
n.string.unescapeEntities = function(a) {
  return n.string.contains(a, "&") ? !n.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in n.global ? n.string.unescapeEntitiesUsingDom_(a) : n.string.unescapePureXmlEntities_(a) : a;
};
n.string.unescapeEntitiesWithDocument = function(a, b) {
  return n.string.contains(a, "&") ? n.string.unescapeEntitiesUsingDom_(a, b) : a;
};
n.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var d = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = b ? b.createElement("div") : n.global.document.createElement("div");
  return a.replace(n.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var f = d[a];
    if (f) {
      return f;
    }
    "#" == b.charAt(0) && (b = Number("0" + b.substr(1)), isNaN(b) || (f = String.fromCharCode(b)));
    f || (e.innerHTML = a + " ", f = e.firstChild.nodeValue.slice(0, -1));
    return d[a] = f;
  });
};
n.string.unescapePureXmlEntities_ = function(a) {
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
n.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
n.string.whitespaceEscape = function(a, b) {
  return n.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
};
n.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + n.string.Unicode.NBSP);
};
n.string.stripQuotes = function(a, b) {
  for (var d = b.length, e = 0;e < d;e++) {
    var f = 1 == d ? b : b.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
n.string.truncate = function(a, b, d) {
  d && (a = n.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  d && (a = n.string.htmlEscape(a));
  return a;
};
n.string.truncateMiddle = function(a, b, d, e) {
  d && (a = n.string.unescapeEntities(a));
  if (e && a.length > b) {
    e > b && (e = b);
    var f = a.length - e;
    a = a.substring(0, b - e) + "..." + a.substring(f);
  } else {
    a.length > b && (e = Math.floor(b / 2), f = a.length - e, a = a.substring(0, e + b % 2) + "..." + a.substring(f));
  }
  d && (a = n.string.htmlEscape(a));
  return a;
};
n.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
n.string.jsEscapeCache_ = {"'":"\\'"};
n.string.quote = function(a) {
  a = String(a);
  for (var b = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    b[d + 1] = n.string.specialEscapeChars_[e] || (31 < f && 127 > f ? e : n.string.escapeChar(e));
  }
  b.push('"');
  return b.join("");
};
n.string.escapeString = function(a) {
  for (var b = [], d = 0;d < a.length;d++) {
    b[d] = n.string.escapeChar(a.charAt(d));
  }
  return b.join("");
};
n.string.escapeChar = function(a) {
  if (a in n.string.jsEscapeCache_) {
    return n.string.jsEscapeCache_[a];
  }
  if (a in n.string.specialEscapeChars_) {
    return n.string.jsEscapeCache_[a] = n.string.specialEscapeChars_[a];
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
  return n.string.jsEscapeCache_[a] = b;
};
n.string.contains = function(a, b) {
  return -1 != a.indexOf(b);
};
n.string.caseInsensitiveContains = function(a, b) {
  return n.string.contains(a.toLowerCase(), b.toLowerCase());
};
n.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
n.string.removeAt = function(a, b, d) {
  var e = a;
  0 <= b && b < a.length && 0 < d && (e = a.substr(0, b) + a.substr(b + d, a.length - b - d));
  return e;
};
n.string.remove = function(a, b) {
  b = new RegExp(n.string.regExpEscape(b), "");
  return a.replace(b, "");
};
n.string.removeAll = function(a, b) {
  b = new RegExp(n.string.regExpEscape(b), "g");
  return a.replace(b, "");
};
n.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
n.string.repeat = String.prototype.repeat ? function(a, b) {
  return a.repeat(b);
} : function(a, b) {
  return Array(b + 1).join(a);
};
n.string.padNumber = function(a, b, d) {
  a = n.isDef(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return n.string.repeat("0", Math.max(0, b - d)) + a;
};
n.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
n.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
n.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ n.now()).toString(36);
};
n.string.compareVersions = function(a, b) {
  var d = 0;
  a = n.string.trim(String(a)).split(".");
  b = n.string.trim(String(b)).split(".");
  for (var e = Math.max(a.length, b.length), f = 0;0 == d && f < e;f++) {
    var g = a[f] || "", h = b[f] || "";
    do {
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
      if (0 == g[0].length && 0 == h[0].length) {
        break;
      }
      var d = 0 == g[1].length ? 0 : parseInt(g[1], 10), m = 0 == h[1].length ? 0 : parseInt(h[1], 10), d = n.string.compareElements_(d, m) || n.string.compareElements_(0 == g[2].length, 0 == h[2].length) || n.string.compareElements_(g[2], h[2]), g = g[3], h = h[3];
    } while (0 == d);
  }
  return d;
};
n.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
n.string.hashCode = function(a) {
  for (var b = 0, d = 0;d < a.length;++d) {
    b = 31 * b + a.charCodeAt(d) >>> 0;
  }
  return b;
};
n.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
n.string.createUniqueString = function() {
  return "goog_" + n.string.uniqueStringCounter_++;
};
n.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && n.string.isEmptyOrWhitespace(a) ? NaN : b;
};
n.string.isLowerCamelCase = function(a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
n.string.isUpperCamelCase = function(a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
n.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase();
  });
};
n.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
n.string.toTitleCase = function(a, b) {
  b = n.isString(b) ? n.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, f) {
    return b + f.toUpperCase();
  });
};
n.string.capitalize = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
n.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return n.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
n.string.splitLimit = function(a, b, d) {
  a = a.split(b);
  for (var e = [];0 < d && a.length;) {
    e.push(a.shift()), d--;
  }
  a.length && e.push(a.join(b));
  return e;
};
n.string.lastComponent = function(a, b) {
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
n.string.editDistance = function(a, b) {
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
n.asserts = {};
n.asserts.ENABLE_ASSERTS = n.DEBUG;
n.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  n.debug.Error.call(this, n.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
n.inherits(n.asserts.AssertionError, n.debug.Error);
n.asserts.AssertionError.prototype.name = "AssertionError";
n.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
n.asserts.errorHandler_ = n.asserts.DEFAULT_ERROR_HANDLER;
n.asserts.doAssertFailure_ = function(a, b, d, e) {
  var f = "Assertion failed";
  if (d) {
    var f = f + (": " + d), g = e;
  } else {
    a && (f += ": " + a, g = b);
  }
  a = new n.asserts.AssertionError("" + f, g || []);
  n.asserts.errorHandler_(a);
};
n.asserts.setErrorHandler = function(a) {
  n.asserts.ENABLE_ASSERTS && (n.asserts.errorHandler_ = a);
};
n.asserts.assert = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !a && n.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.fail = function(a, b) {
  n.asserts.ENABLE_ASSERTS && n.asserts.errorHandler_(new n.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
n.asserts.assertNumber = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !n.isNumber(a) && n.asserts.doAssertFailure_("Expected number but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertString = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !n.isString(a) && n.asserts.doAssertFailure_("Expected string but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertFunction = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !n.isFunction(a) && n.asserts.doAssertFailure_("Expected function but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertObject = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !n.isObject(a) && n.asserts.doAssertFailure_("Expected object but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertArray = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !n.isArray(a) && n.asserts.doAssertFailure_("Expected array but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertBoolean = function(a, b, d) {
  n.asserts.ENABLE_ASSERTS && !n.isBoolean(a) && n.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertElement = function(a, b, d) {
  !n.asserts.ENABLE_ASSERTS || n.isObject(a) && a.nodeType == n.dom.NodeType.ELEMENT || n.asserts.doAssertFailure_("Expected Element but got %s: %s.", [n.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
n.asserts.assertInstanceof = function(a, b, d, e) {
  !n.asserts.ENABLE_ASSERTS || a instanceof b || n.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [n.asserts.getType_(b), n.asserts.getType_(a)], d, Array.prototype.slice.call(arguments, 3));
  return a;
};
n.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    n.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
n.asserts.getType_ = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
n.array = {};
n.NATIVE_ARRAY_PROTOTYPES = n.TRUSTED_SITE;
n.array.ASSUME_NATIVE_FUNCTIONS = !1;
n.array.peek = function(a) {
  return a[a.length - 1];
};
n.array.last = n.array.peek;
n.array.indexOf = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  return Array.prototype.indexOf.call(a, b, d);
} : function(a, b, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if (n.isString(a)) {
    return n.isString(b) && 1 == b.length ? a.indexOf(b, d) : -1;
  }
  for (;d < a.length;d++) {
    if (d in a && a[d] === b) {
      return d;
    }
  }
  return -1;
};
n.array.lastIndexOf = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  return Array.prototype.lastIndexOf.call(a, b, null == d ? a.length - 1 : d);
} : function(a, b, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if (n.isString(a)) {
    return n.isString(b) && 1 == b.length ? a.lastIndexOf(b, d) : -1;
  }
  for (;0 <= d;d--) {
    if (d in a && a[d] === b) {
      return d;
    }
  }
  return -1;
};
n.array.forEach = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  Array.prototype.forEach.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = n.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && b.call(d, f[g], g, a);
  }
};
n.array.forEachRight = function(a, b, d) {
  for (var e = a.length, f = n.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && b.call(d, f[e], e, a);
  }
};
n.array.filter = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  return Array.prototype.filter.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = [], g = 0, h = n.isString(a) ? a.split("") : a, m = 0;m < e;m++) {
    if (m in h) {
      var l = h[m];
      b.call(d, l, m, a) && (f[g++] = l);
    }
  }
  return f;
};
n.array.map = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  return Array.prototype.map.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = Array(e), g = n.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in g && (f[h] = b.call(d, g[h], h, a));
  }
  return f;
};
n.array.reduce = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(a, b, d, e) {
  n.asserts.assert(null != a.length);
  e && (b = n.bind(b, e));
  return Array.prototype.reduce.call(a, b, d);
} : function(a, b, d, e) {
  var f = d;
  n.array.forEach(a, function(d, h) {
    f = b.call(e, f, d, h, a);
  });
  return f;
};
n.array.reduceRight = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(a, b, d, e) {
  n.asserts.assert(null != a.length);
  n.asserts.assert(null != b);
  e && (b = n.bind(b, e));
  return Array.prototype.reduceRight.call(a, b, d);
} : function(a, b, d, e) {
  var f = d;
  n.array.forEachRight(a, function(d, h) {
    f = b.call(e, f, d, h, a);
  });
  return f;
};
n.array.some = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  return Array.prototype.some.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = n.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(d, f[g], g, a)) {
      return !0;
    }
  }
  return !1;
};
n.array.every = n.NATIVE_ARRAY_PROTOTYPES && (n.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(a, b, d) {
  n.asserts.assert(null != a.length);
  return Array.prototype.every.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = n.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && !b.call(d, f[g], g, a)) {
      return !1;
    }
  }
  return !0;
};
n.array.count = function(a, b, d) {
  var e = 0;
  n.array.forEach(a, function(a, g, h) {
    b.call(d, a, g, h) && ++e;
  }, d);
  return e;
};
n.array.find = function(a, b, d) {
  b = n.array.findIndex(a, b, d);
  return 0 > b ? null : n.isString(a) ? a.charAt(b) : a[b];
};
n.array.findIndex = function(a, b, d) {
  for (var e = a.length, f = n.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(d, f[g], g, a)) {
      return g;
    }
  }
  return -1;
};
n.array.findRight = function(a, b, d) {
  b = n.array.findIndexRight(a, b, d);
  return 0 > b ? null : n.isString(a) ? a.charAt(b) : a[b];
};
n.array.findIndexRight = function(a, b, d) {
  for (var e = a.length, f = n.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if (e in f && b.call(d, f[e], e, a)) {
      return e;
    }
  }
  return -1;
};
n.array.contains = function(a, b) {
  return 0 <= n.array.indexOf(a, b);
};
n.array.isEmpty = function(a) {
  return 0 == a.length;
};
n.array.clear = function(a) {
  if (!n.isArray(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
n.array.insert = function(a, b) {
  n.array.contains(a, b) || a.push(b);
};
n.array.insertAt = function(a, b, d) {
  n.array.splice(a, d, 0, b);
};
n.array.insertArrayAt = function(a, b, d) {
  n.partial(n.array.splice, a, d, 0).apply(null, b);
};
n.array.insertBefore = function(a, b, d) {
  var e;
  2 == arguments.length || 0 > (e = n.array.indexOf(a, d)) ? a.push(b) : n.array.insertAt(a, b, e);
};
n.array.remove = function(a, b) {
  b = n.array.indexOf(a, b);
  var d;
  (d = 0 <= b) && n.array.removeAt(a, b);
  return d;
};
n.array.removeLast = function(a, b) {
  b = n.array.lastIndexOf(a, b);
  return 0 <= b ? (n.array.removeAt(a, b), !0) : !1;
};
n.array.removeAt = function(a, b) {
  n.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, b, 1).length;
};
n.array.removeIf = function(a, b, d) {
  b = n.array.findIndex(a, b, d);
  return 0 <= b ? (n.array.removeAt(a, b), !0) : !1;
};
n.array.removeAllIf = function(a, b, d) {
  var e = 0;
  n.array.forEachRight(a, function(f, g) {
    b.call(d, f, g, a) && n.array.removeAt(a, g) && e++;
  });
  return e;
};
n.array.concat = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
n.array.join = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
n.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var d = Array(b), e = 0;e < b;e++) {
      d[e] = a[e];
    }
    return d;
  }
  return [];
};
n.array.clone = n.array.toArray;
n.array.extend = function(a, b) {
  for (var d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    if (n.isArrayLike(e)) {
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
n.array.splice = function(a, b, d, e) {
  n.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, n.array.slice(arguments, 1));
};
n.array.slice = function(a, b, d) {
  n.asserts.assert(null != a.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, d);
};
n.array.removeDuplicates = function(a, b, d) {
  function e(a) {
    return n.isObject(a) ? "o" + n.getUid(a) : (typeof a).charAt(0) + a;
  }
  b = b || a;
  d = d || e;
  for (var f = {}, g = 0, h = 0;h < a.length;) {
    var m = a[h++], l = d(m);
    Object.prototype.hasOwnProperty.call(f, l) || (f[l] = !0, b[g++] = m);
  }
  b.length = g;
};
n.array.binarySearch = function(a, b, d) {
  return n.array.binarySearch_(a, d || n.array.defaultCompare, !1, b);
};
n.array.binarySelect = function(a, b, d) {
  return n.array.binarySearch_(a, b, !0, void 0, d);
};
n.array.binarySearch_ = function(a, b, d, e, f) {
  for (var g = 0, h = a.length, m;g < h;) {
    var l = g + h >> 1, t;
    t = d ? b.call(f, a[l], l, a) : b(e, a[l]);
    0 < t ? g = l + 1 : (h = l, m = !t);
  }
  return m ? g : ~g;
};
n.array.sort = function(a, b) {
  a.sort(b || n.array.defaultCompare);
};
n.array.stableSort = function(a, b) {
  for (var d = Array(a.length), e = 0;e < a.length;e++) {
    d[e] = {index:e, value:a[e]};
  }
  var f = b || n.array.defaultCompare;
  n.array.sort(d, function(a, b) {
    return f(a.value, b.value) || a.index - b.index;
  });
  for (e = 0;e < a.length;e++) {
    a[e] = d[e].value;
  }
};
n.array.sortByKey = function(a, b, d) {
  var e = d || n.array.defaultCompare;
  n.array.sort(a, function(a, d) {
    return e(b(a), b(d));
  });
};
n.array.sortObjectsByKey = function(a, b, d) {
  n.array.sortByKey(a, function(a) {
    return a[b];
  }, d);
};
n.array.isSorted = function(a, b, d) {
  b = b || n.array.defaultCompare;
  for (var e = 1;e < a.length;e++) {
    var f = b(a[e - 1], a[e]);
    if (0 < f || 0 == f && d) {
      return !1;
    }
  }
  return !0;
};
n.array.equals = function(a, b, d) {
  if (!n.isArrayLike(a) || !n.isArrayLike(b) || a.length != b.length) {
    return !1;
  }
  var e = a.length;
  d = d || n.array.defaultCompareEquality;
  for (var f = 0;f < e;f++) {
    if (!d(a[f], b[f])) {
      return !1;
    }
  }
  return !0;
};
n.array.compare3 = function(a, b, d) {
  d = d || n.array.defaultCompare;
  for (var e = Math.min(a.length, b.length), f = 0;f < e;f++) {
    var g = d(a[f], b[f]);
    if (0 != g) {
      return g;
    }
  }
  return n.array.defaultCompare(a.length, b.length);
};
n.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
n.array.inverseDefaultCompare = function(a, b) {
  return -n.array.defaultCompare(a, b);
};
n.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
n.array.binaryInsert = function(a, b, d) {
  d = n.array.binarySearch(a, b, d);
  return 0 > d ? (n.array.insertAt(a, b, -(d + 1)), !0) : !1;
};
n.array.binaryRemove = function(a, b, d) {
  b = n.array.binarySearch(a, b, d);
  return 0 <= b ? n.array.removeAt(a, b) : !1;
};
n.array.bucket = function(a, b, d) {
  for (var e = {}, f = 0;f < a.length;f++) {
    var g = a[f], h = b.call(d, g, f, a);
    n.isDef(h) && (e[h] || (e[h] = [])).push(g);
  }
  return e;
};
n.array.toObject = function(a, b, d) {
  var e = {};
  n.array.forEach(a, function(f, g) {
    e[b.call(d, f, g, a)] = f;
  });
  return e;
};
n.array.range = function(a, b, d) {
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
n.array.repeat = function(a, b) {
  for (var d = [], e = 0;e < b;e++) {
    d[e] = a;
  }
  return d;
};
n.array.flatten = function(a) {
  for (var b = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    if (n.isArray(e)) {
      for (var f = 0;f < e.length;f += 8192) {
        for (var g = n.array.slice(e, f, f + 8192), g = n.array.flatten.apply(null, g), h = 0;h < g.length;h++) {
          b.push(g[h]);
        }
      }
    } else {
      b.push(e);
    }
  }
  return b;
};
n.array.rotate = function(a, b) {
  n.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));
  return a;
};
n.array.moveItem = function(a, b, d) {
  n.asserts.assert(0 <= b && b < a.length);
  n.asserts.assert(0 <= d && d < a.length);
  b = Array.prototype.splice.call(a, b, 1);
  Array.prototype.splice.call(a, d, 0, b[0]);
};
n.array.zip = function(a) {
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
n.array.shuffle = function(a, b) {
  b = b || Math.random;
  for (var d = a.length - 1;0 < d;d--) {
    var e = Math.floor(b() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
n.array.copyByIndex = function(a, b) {
  var d = [];
  n.array.forEach(b, function(b) {
    d.push(a[b]);
  });
  return d;
};
n.array.concatMap = function(a, b, d) {
  return n.array.concat.apply([], n.array.map(a, b, d));
};
var ca = require("doctrine");
function V(a) {
  return "NullableLiteral" === a.type || "AllLiteral" === a.type || "NullLiteral" === a.type || "UndefinedLiteral" === a.type || "VoidLiteral" === a.type || "StringLiteralType" === a.type || "NumericLiteralType" === a.type;
}
function da(a) {
  return V(a) || "NameExpression" === a.type;
}
function W(a, b) {
  b(a);
  if (!da(a)) {
    switch(a.type) {
      case "ArrayType":
        a.elements.forEach(function(a) {
          return W(a, b);
        });
        break;
      case "RecordType":
        a.fields.forEach(function(a) {
          return W(a, b);
        });
        break;
      case "FunctionType":
        a.this && W(a.this, b);
        a.params.forEach(function(a) {
          return W(a, b);
        });
        a.result && W(a.result, b);
        break;
      case "FieldType":
        a.value && W(a.value, b);
        break;
      case "ParameterType":
      case "RestType":
      case "NonNullableType":
      case "OptionalType":
      case "NullableType":
        W(a.expression, b);
        break;
      case "TypeApplication":
        W(a.expression, b);
        a.applications.forEach(function(a) {
          return W(a, b);
        });
        break;
      case "UnionType":
        a.elements.forEach(function(a) {
          return W(a, b);
        });
        break;
      default:
        throw Error("Unrecoginized tag type.");
    }
  }
}
function X(a) {
  return "Block" === a.type && "*" === a.value.charAt(0);
}
function ea(a) {
  var b = ["FunctionExpression", "ArrowFunctionExpression", "ClassExpression"];
  return z.isASTMatch(a, {type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", init:function(a) {
    return !!a && -1 !== b.indexOf(a.type);
  }}]});
}
var Y = {getJSDocComment:function(a) {
  return !a.leadingComments || 0 == a.leadingComments.length || ea(a) ? null : a.leadingComments.filter(X).reduce(function(a, d) {
    return d || a;
  }, null);
}, hasTypeInformation:function(a) {
  var b = "type const private package protected public export".split(" ");
  return a.tags.some(function(a) {
    return n.array.contains(b, a.title);
  });
}, isLiteral:V, isJSDocComment:X, parseComment:function(a) {
  try {
    return ca.parse(a, {strict:!0, unwrap:!0, sloppy:!0});
  } catch (b) {
    if (/braces/i.test(b.message)) {
      throw Error("JSDoc type missing brace.");
    }
    throw Error("JSDoc syntax error.");
  }
}, traverseTags:W};
var fa = require("doctrine");
function Z(a) {
  return null === a.type || a.type.name && "void" === a.type.name || "UndefinedLiteral" === a.type.type;
}
var ga = "string number boolean Object Array Map Set".split(" ");
function ha(a, b) {
  b.type && Y.traverseTags(b.type, function(b) {
    "NameExpression" === b.type && (b = b.name, -1 === ga.indexOf(b) && a.markVariableAsUsed(b));
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
    return "Expected indentation of " + (a + " " + w + (1 === a ? "" : "s")) + " but" + (" found " + (0 < b && 0 < d ? b + " " + e + " and " + (d + " " + f) : 0 < b ? "space" === w ? b : b + " " + e : 0 < d ? "tab" === w ? d : d + " " + f : "0") + ".");
  }
  function d(d, e, f, g, h, q) {
    var ka = ("space" === w ? " " : "\t").repeat(e), G = q ? [d.range[1] - f - g - 1, d.range[1] - 1] : [d.range[0] - f - g, d.range[0]];
    a.report({node:d, loc:h, message:b(e, f, g), fix:function(a) {
      return a.replaceTextRange(G, ka);
    }});
  }
  function e(a, b) {
    var e = Q(a, k, w, !1);
    "ArrayExpression" === a.type || "ObjectExpression" === a.type || e.goodChar === b && 0 === e.badChar || !R(a, k) || d(a, b, e.space, e.tab);
  }
  function f(a, b) {
    a.forEach(function(a) {
      return e(a, b);
    });
  }
  function g(a, b) {
    var e = k.getLastToken(a), f = Q(e, k, w, !0);
    f.goodChar === b && 0 === f.badChar || !R(a, k, !0) || d(a, b, f.space, f.tab, {start:{line:e.loc.start.line, column:e.loc.start.column}}, !0);
  }
  function h(a) {
    var b = Q(a, k, w).goodChar, d = a.parent;
    if ("Property" === d.type || "ArrayExpression" === d.type) {
      b = Q(a, k, w, !1).goodChar;
    } else {
      if ("CallExpression" === d.type) {
        var e;
        e = 1 <= d.arguments.length ? d.arguments[0].loc.end.line > d.arguments[0].loc.start.line : !1;
        e && J.isNodeOneLine(d.callee) && !R(a, k) && (b = Q(d, k, w).goodChar);
      }
    }
    return b;
  }
  function m(a) {
    var b = a.body, d = h(a), e = q, f;
    if (f = -1 !== p.outerIIFEBody) {
      if (T(a)) {
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
    f ? e = p.outerIIFEBody * q : "FunctionExpression" === a.type ? e = p.FunctionExpression.body * q : "FunctionDeclaration" === a.type && (e = p.FunctionDeclaration.body * q);
    d += e;
    (f = D.findAncestorOfType(a, "VariableDeclarator")) && S(a, f) && (d += q * p.VariableDeclarator[f.parent.kind]);
    B(b, d, d - e);
  }
  function l(a) {
    if (!J.isNodeOneLine(a)) {
      var b = a.body;
      a = h(a);
      B(b, a + q, a);
    }
  }
  function t(a) {
    var b = a.parent, e = D.findAncestorOfType(a, "VariableDeclarator"), f = Q(b, k, w).goodChar;
    if (R(a, k)) {
      if (e) {
        if (b === e) {
          e === e.parent.declarations[0] && (f += q * p.VariableDeclarator[e.parent.kind]);
        } else {
          if ("ObjectExpression" === b.type || "ArrayExpression" === b.type || "CallExpression" === b.type || "ArrowFunctionExpression" === b.type || "NewExpression" === b.type || "LogicalExpression" === b.type) {
            f += q;
          }
        }
      } else {
        var g;
        g = "ArrayExpression" !== b.type ? !1 : b.elements[0] ? "ObjectExpression" === b.elements[0].type && b.elements[0].loc.start.line === b.loc.start.line : !1;
        g || "MemberExpression" === b.type || "ExpressionStatement" === b.type || "AssignmentExpression" === b.type || "Property" === b.type || (f += q);
      }
      b = f + q;
      g = Q(a, k, w, !1);
      g.goodChar === f && 0 === g.badChar || !R(a, k) || d(a, f, g.space, g.tab, {start:{line:a.loc.start.line, column:a.loc.start.column}});
    } else {
      f = Q(a, k, w).goodChar, b = f + q;
    }
    S(a, e) && (b += q * p.VariableDeclarator[e.parent.kind]);
    return b;
  }
  function B(a, b, d) {
    J.isNodeOneLine(a) || (f(a.body, b), g(a, d));
  }
  function v(a) {
    var b = Q(a, k, w).goodChar, d = b + q;
    "BlockStatement" === a.body.type ? B(a.body, d, b) : f([a.body], d);
  }
  function u(a, b, d) {
    "first" === d && a.params.length ? f(a.params.slice(1), a.params[0].loc.start.column) : f(a.params, b * d);
  }
  function H(a, b) {
    a = "SwitchStatement" === a.type ? a : a.parent;
    if (M[a.loc.start.line]) {
      return M[a.loc.start.line];
    }
    "undefined" === typeof b && (b = Q(a, k, w).goodChar);
    b = 0 < a.cases.length && 0 === p.SwitchCase ? b : b + q * p.SwitchCase;
    return M[a.loc.start.line] = b;
  }
  var E = ba(a.options), w = E.indentType, q = E.indentSize, p = E.indentOptions, k = a.getSourceCode(), M = {};
  return {Program:function(a) {
    f(a.body, 0);
  }, ClassDeclaration:l, ClassExpression:l, BlockStatement:function(a) {
    if (!J.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = Q(a, k, w).goodChar;
      B(a, b + q, b);
    }
  }, DoWhileStatement:v, ForStatement:v, ForInStatement:v, ForOfStatement:v, WhileStatement:v, WithStatement:v, IfStatement:function(a) {
    var b = Q(a, k, w).goodChar, d = b + q;
    "BlockStatement" !== a.consequent.type ? J.nodesStartOnSameLine(a, a.consequent) || e(a.consequent, d) : (f(a.consequent.body, d), g(a.consequent, b));
    if (a.alternate) {
      var h = k.getTokenBefore(a.alternate);
      e(h, b);
      "BlockStatement" !== a.alternate.type ? J.nodesStartOnSameLine(a.alternate, h) || e(a.alternate, d) : (f(a.alternate.body, d), g(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!J.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = aa(a), d = Q(a, k, w).goodChar, e = b[b.length - 1], d = d + q * p.VariableDeclarator[a.kind];
      f(b, d);
      k.getLastToken(a).loc.end.line <= e.loc.end.line || (b = k.getTokenBefore(e), "," === b.value ? g(a, Q(b, k, w).goodChar) : g(a, d - q));
    }
  }, ObjectExpression:function(a) {
    if (!J.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && J.nodesStartOnSameLine(b[0], a))) {
        var d = t(a);
        f(b, d);
        g(a, d - q);
      }
    }
  }, ArrayExpression:function(a) {
    if (!J.isNodeOneLine(a)) {
      var b = a.elements.filter(function(a) {
        return null !== a;
      });
      if (!(0 < b.length && J.nodesStartOnSameLine(b[0], a))) {
        var d = t(a);
        f(b, d);
        g(a, d - q);
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== p.MemberExpression && !J.isNodeOneLine(a) && !D.findAncestorOfType(a, "VariableDeclarator") && !D.findAncestorOfType(a, "AssignmentExpression")) {
      var b = Q(a, k, w).goodChar + q * p.MemberExpression, d = [a.property];
      a = k.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && d.push(a);
      f(d, b);
    }
  }, SwitchStatement:function(a) {
    var b = Q(a, k, w).goodChar, d = H(a, b);
    f(a.cases, d);
    g(a, b);
  }, SwitchCase:function(a) {
    if (!J.isNodeOneLine(a)) {
      var b = H(a);
      f(a.consequent, b + q);
    }
  }, ArrowFunctionExpression:function(a) {
    J.isNodeOneLine(a) || "BlockStatement" === a.body.type && m(a);
  }, FunctionDeclaration:function(a) {
    J.isNodeOneLine(a) || (-1 !== p.FunctionDeclaration.parameters && u(a, q, p.FunctionDeclaration.parameters), m(a));
  }, FunctionExpression:function(a) {
    J.isNodeOneLine(a) || (-1 !== p.FunctionExpression.parameters && u(a, q, p.FunctionExpression.parameters), m(a));
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
    Y.traverseTags(d, function(d) {
      if ("NameExpression" === d.type) {
        d = d.name;
        var e = u[d];
        e && a.report({node:b, message:"Use '" + e + "' instead of '" + d + "'."});
      }
    });
  }
  function e(b) {
    var e = g.getJSDocComment(b), q = f.pop(), p = Object.create(null), k = !1, u = !1, E = !1, G = !1, U = !1, K;
    if (e) {
      try {
        K = fa.parse(e.value, {strict:!0, unwrap:!0, sloppy:!0});
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
            !b.description && t && a.report({node:e, message:"Missing JSDoc parameter description for " + ("'" + b.name + "'.")});
            p[b.name] ? a.report({node:e, message:"Duplicate JSDoc parameter '" + b.name + "'."}) : -1 === b.name.indexOf(".") && (p[b.name] = 1);
            break;
          case "return":
          case "returns":
            k = !0;
            l || q.returnPresent || null !== b.type && Z(b) || U ? (v && !b.type && a.report({node:e, message:"Missing JSDoc return type."}), Z(b) || b.description || !B || a.report({node:e, message:"Missing JSDoc return description."})) : a.report({node:e, message:"Unexpected @{{title}} tag; function has no return statement.", data:{title:b.title}});
            break;
          case "constructor":
          case "class":
            u = !0;
            break;
          case "override":
          case "inheritdoc":
            G = !0;
            break;
          case "abstract":
          case "virtual":
            U = !0;
            break;
          case "interface":
            E = !0;
        }
        m.hasOwnProperty(b.title) && b.title !== m[b.title] && a.report({node:e, message:"Use @{{name}} instead.", data:{name:m[b.title]}});
        ha(a, b);
        H && b.type && d(e, b.type);
      });
      G || k || u || E || J.isNodeGetterFunction(b) || J.isNodeSetterFunction(b) || J.isNodeConstructorFunction(b) || J.isNodeClassType(b) || (l || q.returnPresent) && a.report({node:e, message:"Missing JSDoc @{{returns}} for function.", data:{returns:m.returns || "returns"}});
      var L = Object.keys(p);
      b.params && b.params.forEach(function(b, d) {
        "AssignmentPattern" === b.type && (b = b.left);
        var f = b.name;
        "Identifier" === b.type && (L[d] && f !== L[d] ? a.report({node:e, message:"Expected JSDoc for '" + f + "' but found " + ("'" + L[d] + "'.")}) : p[f] || G || a.report({node:e, message:"Missing JSDoc for parameter '" + f + "'."}));
      });
      h.matchDescription && ((new RegExp(h.matchDescription)).test(K.description) || a.report({node:e, message:"JSDoc description does not satisfy the regex pattern."}));
    }
  }
  var f = [], g = a.getSourceCode(), h = a.options[0] || {}, m = h.prefer || {}, l = !1 !== h.requireReturn, t = !1 !== h.requireParamDescription, B = !1 !== h.requireReturnDescription, v = !1 !== h.requireReturnType, u = h.preferType || {}, H = 0 !== Object.keys(u).length;
  return {ArrowFunctionExpression:b, FunctionExpression:b, FunctionDeclaration:b, ClassExpression:b, ClassDeclaration:b, "ArrowFunctionExpression:exit":e, "FunctionExpression:exit":e, "FunctionDeclaration:exit":e, "ClassExpression:exit":e, "ClassDeclaration:exit":e, ReturnStatement:function(a) {
    var b = f[f.length - 1];
    b && null !== a.argument && (b.returnPresent = !0);
  }, VariableDeclaration:function(a) {
    g.getJSDocComment(a);
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
      e = "Program" === e.type || f ? n.array.contains(ja(ia, e.body), d) : !1;
      e = !e;
    }
    if (e) {
      var g;
      if (e = Y.getJSDocComment(d)) {
        try {
          var t = Y.parseComment(e.value);
          g = Y.hasTypeInformation(t);
        } catch (B) {
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
          if (B.test(a.type)) {
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
      var l = a.identifier, k = l.parent, v = k.parent, u;
      if (u = a.isRead()) {
        !(k = "AssignmentExpression" === k.type && "ExpressionStatement" === v.type && k.left === l || "UpdateExpression" === k.type && "ExpressionStatement" === v.type) && (k = h && b(l, h)) && (l = D.findAncestor(l, D.isFunction), k = !(l && b(l, h) && d(l, h))), u = k;
      }
      h = u;
      l = g;
      k = a.identifier;
      v = k.parent;
      u = v.parent;
      var m;
      if (!(m = a.from.variableScope !== a.resolved.scope.variableScope)) {
        b: {
          for (m = k;m;) {
            if (D.isLoop(m)) {
              m = !0;
              break b;
            }
            if (D.isFunction(m)) {
              break;
            }
            m = m.parent;
          }
          m = !1;
        }
      }
      g = l && b(k, l) ? l : "AssignmentExpression" !== v.type || "ExpressionStatement" !== u.type || k !== v.left || m ? null : v.right;
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
    return d.index === d.node.params.length - 1 || l.argsIgnorePattern && (d = a.getDeclaredVariables(d.node), d.slice(d.indexOf(b) + 1).every(function(a) {
      return 0 === a.references.length && l.argsIgnorePattern.test(a.name);
    })) ? !0 : !1;
  }
  function g(a, b) {
    var d = a.variables, h = a.childScopes, m, v;
    if ("TDZ" !== a.type && ("global" !== a.type || "all" === l.vars)) {
      for (m = 0, v = d.length;m < v;++m) {
        var p = d[m];
        if (!("class" === a.type && a.block.id === p.identifiers[0] || a.functionExpressionScope || p.eslintUsed || "function" === a.type && "arguments" === p.name && 0 === p.identifiers.length)) {
          var k = p.defs[0];
          if (k) {
            var u = k.type;
            if ("CatchClause" === u) {
              if ("none" === l.caughtErrors) {
                continue;
              }
              if (l.caughtErrorsIgnorePattern && l.caughtErrorsIgnorePattern.test(k.name.name)) {
                continue;
              }
            }
            if ("Parameter" === u) {
              if ("Property" === k.node.parent.type && "set" === k.node.parent.kind) {
                continue;
              }
              if ("none" === l.args) {
                continue;
              }
              if (l.argsIgnorePattern && l.argsIgnorePattern.test(k.name.name)) {
                continue;
              }
              if ("after-used" === l.args && !f(p)) {
                continue;
              }
            } else {
              if (l.varsIgnorePattern && l.varsIgnorePattern.test(k.name.name)) {
                continue;
              }
            }
          }
          if (k = !e(p)) {
            a: {
              if (k = p.defs[0]) {
                u = k.node;
                if ("VariableDeclarator" === u.type) {
                  u = u.parent;
                } else {
                  if ("Parameter" === k.type) {
                    k = !1;
                    break a;
                  }
                }
                k = 0 === u.parent.type.indexOf("Export");
              } else {
                k = !1;
              }
            }
            k = !k;
          }
          k && b.push(p);
        }
      }
    }
    m = 0;
    for (v = h.length;m < v;++m) {
      g(h[m], b);
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
  function m(a) {
    if (0 >= a.defs.length) {
      return !1;
    }
    a = Y.getJSDocComment(a.defs[0].node);
    if (!a) {
      return !1;
    }
    var b;
    try {
      b = Y.parseComment(a.value);
    } catch (H) {
      return !1;
    }
    return b.tags.some(function(a) {
      return "typedef" == a.title;
    });
  }
  var l = {vars:"all", args:"after-used", caughtErrors:"none", allowUnusedTypes:!1}, t = a.options[0];
  t && ("string" === typeof t ? l.vars = t : (l.vars = t.vars || l.vars, l.args = t.args || l.args, l.caughtErrors = t.caughtErrors || l.caughtErrors, t.varsIgnorePattern && (l.varsIgnorePattern = new RegExp(t.varsIgnorePattern)), t.argsIgnorePattern && (l.argsIgnorePattern = new RegExp(t.argsIgnorePattern)), t.caughtErrorsIgnorePattern && (l.caughtErrorsIgnorePattern = new RegExp(t.caughtErrorsIgnorePattern)), t.allowUnusedTypes && (l.allowUnusedTypes = t.allowUnusedTypes)));
  var B = /(?:Statement|Declaration)$/;
  return {"Program:exit":function(b) {
    for (var d = g(a.getScope(), []), d = c.makeIterator(d), e = d.next();!e.done;e = d.next()) {
      e = e.value, l.allowUnusedTypes && m(e) || (e.eslintExplicitGlobal ? a.report({node:b, loc:h(e), message:"'{{name}}' is defined but never used.", data:e}) : 0 < e.defs.length && a.report({node:e.identifiers[0], message:"'{{name}}' is defined but never used.", data:e}));
    }
  }};
}}}};

