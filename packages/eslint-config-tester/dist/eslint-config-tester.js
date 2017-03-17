var b = {scope:{}};
b.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, c, d) {
  if (d.get || d.set) {
    throw new TypeError("ES3 does not support getters and setters.");
  }
  a != Array.prototype && a != Object.prototype && (a[c] = d.value);
};
b.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
b.global = b.getGlobal(this);
b.SYMBOL_PREFIX = "jscomp_symbol_";
b.initSymbol = function() {
  b.initSymbol = function() {
  };
  b.global.Symbol || (b.global.Symbol = b.Symbol);
};
b.symbolCounter_ = 0;
b.Symbol = function(a) {
  return b.SYMBOL_PREFIX + (a || "") + b.symbolCounter_++;
};
b.initSymbolIterator = function() {
  b.initSymbol();
  var a = b.global.Symbol.iterator;
  a || (a = b.global.Symbol.iterator = b.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && b.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return b.arrayIterator(this);
  }});
  b.initSymbolIterator = function() {
  };
};
b.arrayIterator = function(a) {
  var c = 0;
  return b.iteratorPrototype(function() {
    return c < a.length ? {done:!1, value:a[c++]} : {done:!0};
  });
};
b.iteratorPrototype = function(a) {
  b.initSymbolIterator();
  a = {next:a};
  a[b.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
b.makeIterator = function(a) {
  b.initSymbolIterator();
  var c = a[Symbol.iterator];
  return c ? c.call(a) : b.arrayIterator(a);
};
var m = m || {};
m.global = this;
m.isDef = function(a) {
  return void 0 !== a;
};
m.exportPath_ = function(a, c, d) {
  a = a.split(".");
  d = d || m.global;
  a[0] in d || !d.execScript || d.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    !a.length && m.isDef(c) ? d[e] = c : d = d[e] ? d[e] : d[e] = {};
  }
};
m.define = function(a, c) {
  m.exportPath_(a, c);
};
m.DEBUG = !1;
m.LOCALE = "en";
m.TRUSTED_SITE = !0;
m.STRICT_MODE_COMPATIBLE = !1;
m.DISALLOW_TEST_ONLY_CODE = !m.DEBUG;
m.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
m.provide = function(a) {
  if (m.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  m.constructNamespace_(a);
};
m.constructNamespace_ = function(a, c) {
  m.exportPath_(a, c);
};
m.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
m.module = function(a) {
  if (!m.isString(a) || !a || -1 == a.search(m.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!m.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (m.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  m.moduleLoaderState_.moduleName = a;
};
m.module.get = function(a) {
  return m.module.getInternal_(a);
};
m.module.getInternal_ = function() {
};
m.moduleLoaderState_ = null;
m.isInModuleLoader_ = function() {
  return null != m.moduleLoaderState_;
};
m.module.declareLegacyNamespace = function() {
  m.moduleLoaderState_.declareLegacyNamespace = !0;
};
m.setTestOnly = function(a) {
  if (m.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
m.forwardDeclare = function() {
};
m.getObjectByName = function(a, c) {
  a = a.split(".");
  c = c || m.global;
  for (var d;d = a.shift();) {
    if (m.isDefAndNotNull(c[d])) {
      c = c[d];
    } else {
      return null;
    }
  }
  return c;
};
m.globalize = function(a, c) {
  c = c || m.global;
  for (var d in a) {
    c[d] = a[d];
  }
};
m.addDependency = function(a, c, d, e) {
  if (m.DEPENDENCIES_ENABLED) {
    var f;
    a = a.replace(/\\/g, "/");
    var g = m.dependencies_;
    e && "boolean" !== typeof e || (e = e ? {module:"goog"} : {});
    for (var h = 0;f = c[h];h++) {
      g.nameToPath[f] = a, g.loadFlags[a] = e;
    }
    for (e = 0;c = d[e];e++) {
      a in g.requires || (g.requires[a] = {}), g.requires[a][c] = !0;
    }
  }
};
m.ENABLE_DEBUG_LOADER = !0;
m.logToConsole_ = function(a) {
  m.global.console && m.global.console.error(a);
};
m.require = function() {
};
m.basePath = "";
m.nullFunction = function() {
};
m.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
m.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    m.DEBUG && (m.instantiatedSingletons_[m.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
m.instantiatedSingletons_ = [];
m.LOAD_MODULE_USING_EVAL = !0;
m.SEAL_MODULE_EXPORTS = m.DEBUG;
m.loadedModules_ = {};
m.DEPENDENCIES_ENABLED = !1;
m.TRANSPILE = "detect";
m.TRANSPILER = "transpile.js";
m.DEPENDENCIES_ENABLED && (m.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, m.inHtmlDocument_ = function() {
  var a = m.global.document;
  return null != a && "write" in a;
}, m.findBasePath_ = function() {
  if (m.isDef(m.global.CLOSURE_BASE_PATH)) {
    m.basePath = m.global.CLOSURE_BASE_PATH;
  } else {
    if (m.inHtmlDocument_()) {
      for (var a = m.global.document.getElementsByTagName("SCRIPT"), c = a.length - 1;0 <= c;--c) {
        var d = a[c].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if ("base.js" == d.substr(e - 7, 7)) {
          m.basePath = d.substr(0, e - 7);
          break;
        }
      }
    }
  }
}, m.importScript_ = function(a, c) {
  (m.global.CLOSURE_IMPORT_SCRIPT || m.writeScriptTag_)(a, c) && (m.dependencies_.written[a] = !0);
}, m.IS_OLD_IE_ = !(m.global.atob || !m.global.document || !m.global.document.all), m.importProcessedScript_ = function(a, c, d) {
  m.importScript_("", 'goog.retrieveAndExec_("' + a + '", ' + c + ", " + d + ");");
}, m.queuedModules_ = [], m.wrapModule_ = function(a, c) {
  return m.LOAD_MODULE_USING_EVAL && m.isDef(m.global.JSON) ? "goog.loadModule(" + m.global.JSON.stringify(c + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + c + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, m.loadQueuedModules_ = function() {
  var a = m.queuedModules_.length;
  if (0 < a) {
    var c = m.queuedModules_;
    m.queuedModules_ = [];
    for (var d = 0;d < a;d++) {
      m.maybeProcessDeferredPath_(c[d]);
    }
  }
}, m.maybeProcessDeferredDep_ = function(a) {
  m.isDeferredModule_(a) && m.allDepsAreAvailable_(a) && (a = m.getPathFromDeps_(a), m.maybeProcessDeferredPath_(m.basePath + a));
}, m.isDeferredModule_ = function(a) {
  var c = (a = m.getPathFromDeps_(a)) && m.dependencies_.loadFlags[a] || {}, d = c.lang || "es3";
  return a && ("goog" == c.module || m.needsTranspile_(d)) ? m.basePath + a in m.dependencies_.deferred : !1;
}, m.allDepsAreAvailable_ = function(a) {
  if ((a = m.getPathFromDeps_(a)) && a in m.dependencies_.requires) {
    for (var c in m.dependencies_.requires[a]) {
      if (!m.isProvided_(c) && !m.isDeferredModule_(c)) {
        return !1;
      }
    }
  }
  return !0;
}, m.maybeProcessDeferredPath_ = function(a) {
  if (a in m.dependencies_.deferred) {
    var c = m.dependencies_.deferred[a];
    delete m.dependencies_.deferred[a];
    m.globalEval(c);
  }
}, m.loadModuleFromUrl = function(a) {
  m.retrieveAndExec_(a, !0, !1);
}, m.writeScriptSrcNode_ = function(a) {
  m.global.document.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
}, m.appendScriptSrcNode_ = function(a) {
  var c = m.global.document, d = c.createElement("script");
  d.type = "text/javascript";
  d.src = a;
  d.defer = !1;
  d.async = !1;
  c.head.appendChild(d);
}, m.writeScriptTag_ = function(a, c) {
  if (m.inHtmlDocument_()) {
    var d = m.global.document;
    if (!m.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == d.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    void 0 === c ? m.IS_OLD_IE_ ? (c = " onreadystatechange='goog.onScriptLoad_(this, " + ++m.lastNonModuleScriptIndex_ + ")' ", d.write('<script type="text/javascript" src="' + a + '"' + c + ">\x3c/script>")) : m.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? m.appendScriptSrcNode_(a) : m.writeScriptSrcNode_(a) : d.write('<script type="text/javascript">' + c + "\x3c/script>");
    return !0;
  }
  return !1;
}, m.needsTranspile_ = function(a) {
  if ("always" == m.TRANSPILE) {
    return !0;
  }
  if ("never" == m.TRANSPILE) {
    return !1;
  }
  m.requiresTranspilation_ || (m.requiresTranspilation_ = m.createRequiresTranspilation_());
  if (a in m.requiresTranspilation_) {
    return m.requiresTranspilation_[a];
  }
  throw Error("Unknown language mode: " + a);
}, m.createRequiresTranspilation_ = function() {
  function a(a, c) {
    e ? d[a] = !0 : c() ? d[a] = !1 : e = d[a] = !0;
  }
  function c(a) {
    try {
      return !!eval(a);
    } catch (g) {
      return !1;
    }
  }
  var d = {es3:!1}, e = !1;
  a("es5", function() {
    return c("[1,].length==1");
  });
  a("es6", function() {
    return c('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()');
  });
  a("es6-impl", function() {
    return !0;
  });
  a("es7", function() {
    return c("2 ** 2 == 4");
  });
  a("es8", function() {
    return c("async () => 1, true");
  });
  return d;
}, m.requiresTranspilation_ = null, m.lastNonModuleScriptIndex_ = 0, m.onScriptLoad_ = function(a, c) {
  "complete" == a.readyState && m.lastNonModuleScriptIndex_ == c && m.loadQueuedModules_();
  return !0;
}, m.writeScripts_ = function(a) {
  function c(a) {
    if (!(a in f.written || a in f.visited)) {
      f.visited[a] = !0;
      if (a in f.requires) {
        for (var g in f.requires[a]) {
          if (!m.isProvided_(g)) {
            if (g in f.nameToPath) {
              c(f.nameToPath[g]);
            } else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      a in e || (e[a] = !0, d.push(a));
    }
  }
  var d = [], e = {}, f = m.dependencies_;
  c(a);
  for (a = 0;a < d.length;a++) {
    var g = d[a];
    m.dependencies_.written[g] = !0;
  }
  var h = m.moduleLoaderState_;
  m.moduleLoaderState_ = null;
  for (a = 0;a < d.length;a++) {
    if (g = d[a]) {
      var k = f.loadFlags[g] || {}, l = m.needsTranspile_(k.lang || "es3");
      "goog" == k.module || l ? m.importProcessedScript_(m.basePath + g, "goog" == k.module, l) : m.importScript_(m.basePath + g);
    } else {
      throw m.moduleLoaderState_ = h, Error("Undefined script input");
    }
  }
  m.moduleLoaderState_ = h;
}, m.getPathFromDeps_ = function(a) {
  return a in m.dependencies_.nameToPath ? m.dependencies_.nameToPath[a] : null;
}, m.findBasePath_(), m.global.CLOSURE_NO_DEPS || m.importScript_(m.basePath + "deps.js"));
m.loadModule = function(a) {
  var c = m.moduleLoaderState_;
  try {
    m.moduleLoaderState_ = {moduleName:void 0, declareLegacyNamespace:!1};
    var d;
    if (m.isFunction(a)) {
      d = a.call(void 0, {});
    } else {
      if (m.isString(a)) {
        d = m.loadModuleFromSource_.call(void 0, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var e = m.moduleLoaderState_.moduleName;
    if (!m.isString(e) || !e) {
      throw Error('Invalid module name "' + e + '"');
    }
    m.moduleLoaderState_.declareLegacyNamespace ? m.constructNamespace_(e, d) : m.SEAL_MODULE_EXPORTS && Object.seal && m.isObject(d) && Object.seal(d);
    m.loadedModules_[e] = d;
  } finally {
    m.moduleLoaderState_ = c;
  }
};
m.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
};
m.normalizePath_ = function(a) {
  a = a.split("/");
  for (var c = 0;c < a.length;) {
    "." == a[c] ? a.splice(c, 1) : c && ".." == a[c] && a[c - 1] && ".." != a[c - 1] ? a.splice(--c, 2) : c++;
  }
  return a.join("/");
};
m.loadFileSync_ = function(a) {
  if (m.global.CLOSURE_LOAD_FILE_SYNC) {
    return m.global.CLOSURE_LOAD_FILE_SYNC(a);
  }
  try {
    var c = new m.global.XMLHttpRequest;
    c.open("get", a, !1);
    c.send();
    return 0 == c.status || 200 == c.status ? c.responseText : null;
  } catch (d) {
    return null;
  }
};
m.retrieveAndExec_ = function() {
};
m.transpile_ = function(a, c) {
  var d = m.global.$jscomp;
  d || (m.global.$jscomp = d = {});
  var e = d.transpile;
  if (!e) {
    var f = m.basePath + m.TRANSPILER, g = m.loadFileSync_(f);
    if (g) {
      eval(g + "\n//# sourceURL=" + f);
      if (m.global.$gwtExport && m.global.$gwtExport.$jscomp && !m.global.$gwtExport.$jscomp.transpile) {
        throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(m.global.$gwtExport));
      }
      m.global.$jscomp.transpile = m.global.$gwtExport.$jscomp.transpile;
      d = m.global.$jscomp;
      e = d.transpile;
    }
  }
  e || (e = d.transpile = function(a, c) {
    m.logToConsole_(c + " requires transpilation but no transpiler was found.");
    return a;
  });
  return e(a, c);
};
m.typeOf = function(a) {
  var c = typeof a;
  if ("object" == c) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return c;
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
    if ("function" == c && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return c;
};
m.isNull = function(a) {
  return null === a;
};
m.isDefAndNotNull = function(a) {
  return null != a;
};
m.isArray = function(a) {
  return "array" == m.typeOf(a);
};
m.isArrayLike = function(a) {
  var c = m.typeOf(a);
  return "array" == c || "object" == c && "number" == typeof a.length;
};
m.isDateLike = function(a) {
  return m.isObject(a) && "function" == typeof a.getFullYear;
};
m.isString = function(a) {
  return "string" == typeof a;
};
m.isBoolean = function(a) {
  return "boolean" == typeof a;
};
m.isNumber = function(a) {
  return "number" == typeof a;
};
m.isFunction = function(a) {
  return "function" == m.typeOf(a);
};
m.isObject = function(a) {
  var c = typeof a;
  return "object" == c && null != a || "function" == c;
};
m.getUid = function(a) {
  return a[m.UID_PROPERTY_] || (a[m.UID_PROPERTY_] = ++m.uidCounter_);
};
m.hasUid = function(a) {
  return !!a[m.UID_PROPERTY_];
};
m.removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(m.UID_PROPERTY_);
  try {
    delete a[m.UID_PROPERTY_];
  } catch (c) {
  }
};
m.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
m.uidCounter_ = 0;
m.getHashCode = m.getUid;
m.removeHashCode = m.removeUid;
m.cloneObject = function(a) {
  var c = m.typeOf(a);
  if ("object" == c || "array" == c) {
    if (a.clone) {
      return a.clone();
    }
    var c = "array" == c ? [] : {}, d;
    for (d in a) {
      c[d] = m.cloneObject(a[d]);
    }
    return c;
  }
  return a;
};
m.bindNative_ = function(a, c, d) {
  return a.call.apply(a.bind, arguments);
};
m.bindJs_ = function(a, c, d) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var d = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(d, e);
      return a.apply(c, d);
    };
  }
  return function() {
    return a.apply(c, arguments);
  };
};
m.bind = function(a, c, d) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? m.bind = m.bindNative_ : m.bind = m.bindJs_;
  return m.bind.apply(null, arguments);
};
m.partial = function(a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = d.slice();
    c.push.apply(c, arguments);
    return a.apply(this, c);
  };
};
m.mixin = function(a, c) {
  for (var d in c) {
    a[d] = c[d];
  }
};
m.now = m.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
m.globalEval = function(a) {
  if (m.global.execScript) {
    m.global.execScript(a, "JavaScript");
  } else {
    if (m.global.eval) {
      if (null == m.evalWorksForGlobals_) {
        if (m.global.eval("var _evalTest_ = 1;"), "undefined" != typeof m.global._evalTest_) {
          try {
            delete m.global._evalTest_;
          } catch (e) {
          }
          m.evalWorksForGlobals_ = !0;
        } else {
          m.evalWorksForGlobals_ = !1;
        }
      }
      if (m.evalWorksForGlobals_) {
        m.global.eval(a);
      } else {
        var c = m.global.document, d = c.createElement("SCRIPT");
        d.type = "text/javascript";
        d.defer = !1;
        d.appendChild(c.createTextNode(a));
        c.body.appendChild(d);
        c.body.removeChild(d);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
m.evalWorksForGlobals_ = null;
m.getCssName = function(a, c) {
  function d(a) {
    a = a.split("-");
    for (var c = [], d = 0;d < a.length;d++) {
      c.push(e(a[d]));
    }
    return c.join("-");
  }
  function e(a) {
    return m.cssNameMapping_[a] || a;
  }
  if ("." == String(a).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
  }
  var f;
  f = m.cssNameMapping_ ? "BY_WHOLE" == m.cssNameMappingStyle_ ? e : d : function(a) {
    return a;
  };
  a = c ? a + "-" + f(c) : f(a);
  return m.global.CLOSURE_CSS_NAME_MAP_FN ? m.global.CLOSURE_CSS_NAME_MAP_FN(a) : a;
};
m.setCssNameMapping = function(a, c) {
  m.cssNameMapping_ = a;
  m.cssNameMappingStyle_ = c;
};
m.getMsg = function(a, c) {
  c && (a = a.replace(/\{\$([^}]+)}/g, function(a, e) {
    return null != c && e in c ? c[e] : a;
  }));
  return a;
};
m.getMsgWithFallback = function(a) {
  return a;
};
m.exportSymbol = function(a, c, d) {
  m.exportPath_(a, c, d);
};
m.exportProperty = function(a, c, d) {
  a[c] = d;
};
m.inherits = function(a, c) {
  function d() {
  }
  d.prototype = c.prototype;
  a.superClass_ = c.prototype;
  a.prototype = new d;
  a.prototype.constructor = a;
  a.base = function(a, d, g) {
    for (var e = Array(arguments.length - 2), f = 2;f < arguments.length;f++) {
      e[f - 2] = arguments[f];
    }
    return c.prototype[d].apply(a, e);
  };
};
m.base = function(a, c, d) {
  var e = arguments.callee.caller;
  if (m.STRICT_MODE_COMPATIBLE || m.DEBUG && !e) {
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
    if (h.prototype[c] === e) {
      g = !0;
    } else {
      if (g) {
        return h.prototype[c].apply(a, f);
      }
    }
  }
  if (a[c] === e) {
    return a.constructor.prototype[c].apply(a, f);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
m.scope = function(a) {
  if (m.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  a.call(m.global);
};
m.defineClass = function(a, c) {
  var d = c.constructor, e = c.statics;
  d && d != Object.prototype.constructor || (d = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  d = m.defineClass.createSealingConstructor_(d, a);
  a && m.inherits(d, a);
  delete c.constructor;
  delete c.statics;
  m.defineClass.applyProperties_(d.prototype, c);
  null != e && (e instanceof Function ? e(d) : m.defineClass.applyProperties_(d, e));
  return d;
};
m.defineClass.SEAL_CLASS_INSTANCES = m.DEBUG;
m.defineClass.createSealingConstructor_ = function(a, c) {
  function d() {
    var c = a.apply(this, arguments) || this;
    c[m.UID_PROPERTY_] = c[m.UID_PROPERTY_];
    this.constructor === d && e && Object.seal instanceof Function && Object.seal(c);
    return c;
  }
  if (!m.defineClass.SEAL_CLASS_INSTANCES) {
    return a;
  }
  var e = !m.defineClass.isUnsealable_(c);
  return d;
};
m.defineClass.isUnsealable_ = function(a) {
  return a && a.prototype && a.prototype[m.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
m.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
m.defineClass.applyProperties_ = function(a, c) {
  for (var d in c) {
    Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  }
  for (var e = 0;e < m.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;e++) {
    d = m.defineClass.OBJECT_PROTOTYPE_FIELDS_[e], Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  }
};
m.tagUnsealableClass = function() {
};
m.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
m.debug = {};
m.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, m.debug.Error);
  } else {
    var c = Error().stack;
    c && (this.stack = c);
  }
  a && (this.message = String(a));
  this.reportErrorToServer = !0;
};
m.inherits(m.debug.Error, Error);
m.debug.Error.prototype.name = "CustomError";
m.dom = {};
m.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
m.string = {};
m.string.DETECT_DOUBLE_ESCAPING = !1;
m.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
m.string.Unicode = {NBSP:"\u00a0"};
m.string.startsWith = function(a, c) {
  return 0 == a.lastIndexOf(c, 0);
};
m.string.endsWith = function(a, c) {
  var d = a.length - c.length;
  return 0 <= d && a.indexOf(c, d) == d;
};
m.string.caseInsensitiveStartsWith = function(a, c) {
  return 0 == m.string.caseInsensitiveCompare(c, a.substr(0, c.length));
};
m.string.caseInsensitiveEndsWith = function(a, c) {
  return 0 == m.string.caseInsensitiveCompare(c, a.substr(a.length - c.length, c.length));
};
m.string.caseInsensitiveEquals = function(a, c) {
  return a.toLowerCase() == c.toLowerCase();
};
m.string.subs = function(a, c) {
  for (var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < d.length;) {
    e += d.shift() + f.shift();
  }
  return e + d.join("%s");
};
m.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
m.string.isEmptyOrWhitespace = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
m.string.isEmptyString = function(a) {
  return 0 == a.length;
};
m.string.isEmpty = m.string.isEmptyOrWhitespace;
m.string.isEmptyOrWhitespaceSafe = function(a) {
  return m.string.isEmptyOrWhitespace(m.string.makeSafe(a));
};
m.string.isEmptySafe = m.string.isEmptyOrWhitespaceSafe;
m.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a);
};
m.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a);
};
m.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a);
};
m.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
m.string.isSpace = function(a) {
  return " " == a;
};
m.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
m.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
m.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
m.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
m.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
m.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
m.string.trim = m.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
m.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
m.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
m.string.caseInsensitiveCompare = function(a, c) {
  a = String(a).toLowerCase();
  c = String(c).toLowerCase();
  return a < c ? -1 : a == c ? 0 : 1;
};
m.string.numberAwareCompare_ = function(a, c, d) {
  if (a == c) {
    return 0;
  }
  if (!a) {
    return -1;
  }
  if (!c) {
    return 1;
  }
  for (var e = a.toLowerCase().match(d), f = c.toLowerCase().match(d), g = Math.min(e.length, f.length), h = 0;h < g;h++) {
    d = e[h];
    var k = f[h];
    if (d != k) {
      return a = parseInt(d, 10), !isNaN(a) && (c = parseInt(k, 10), !isNaN(c) && a - c) ? a - c : d < k ? -1 : 1;
    }
  }
  return e.length != f.length ? e.length - f.length : a < c ? -1 : 1;
};
m.string.intAwareCompare = function(a, c) {
  return m.string.numberAwareCompare_(a, c, /\d+|\D+/g);
};
m.string.floatAwareCompare = function(a, c) {
  return m.string.numberAwareCompare_(a, c, /\d+|\.\d+|\D+/g);
};
m.string.numerateCompare = m.string.floatAwareCompare;
m.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
m.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
m.string.newLineToBr = function(a, c) {
  return a.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>");
};
m.string.htmlEscape = function(a, c) {
  if (c) {
    a = a.replace(m.string.AMP_RE_, "&amp;").replace(m.string.LT_RE_, "&lt;").replace(m.string.GT_RE_, "&gt;").replace(m.string.QUOT_RE_, "&quot;").replace(m.string.SINGLE_QUOTE_RE_, "&#39;").replace(m.string.NULL_RE_, "&#0;"), m.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(m.string.E_RE_, "&#101;"));
  } else {
    if (!m.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(m.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(m.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(m.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(m.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(m.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(m.string.NULL_RE_, "&#0;"));
    m.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(m.string.E_RE_, "&#101;"));
  }
  return a;
};
m.string.AMP_RE_ = /&/g;
m.string.LT_RE_ = /</g;
m.string.GT_RE_ = />/g;
m.string.QUOT_RE_ = /"/g;
m.string.SINGLE_QUOTE_RE_ = /'/g;
m.string.NULL_RE_ = /\x00/g;
m.string.E_RE_ = /e/g;
m.string.ALL_RE_ = m.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
m.string.unescapeEntities = function(a) {
  return m.string.contains(a, "&") ? !m.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in m.global ? m.string.unescapeEntitiesUsingDom_(a) : m.string.unescapePureXmlEntities_(a) : a;
};
m.string.unescapeEntitiesWithDocument = function(a, c) {
  return m.string.contains(a, "&") ? m.string.unescapeEntitiesUsingDom_(a, c) : a;
};
m.string.unescapeEntitiesUsingDom_ = function(a, c) {
  var d = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = c ? c.createElement("div") : m.global.document.createElement("div");
  return a.replace(m.string.HTML_ENTITY_PATTERN_, function(a, c) {
    var f = d[a];
    if (f) {
      return f;
    }
    "#" == c.charAt(0) && (c = Number("0" + c.substr(1)), isNaN(c) || (f = String.fromCharCode(c)));
    f || (e.innerHTML = a + " ", f = e.firstChild.nodeValue.slice(0, -1));
    return d[a] = f;
  });
};
m.string.unescapePureXmlEntities_ = function(a) {
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
m.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
m.string.whitespaceEscape = function(a, c) {
  return m.string.newLineToBr(a.replace(/  /g, " &#160;"), c);
};
m.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + m.string.Unicode.NBSP);
};
m.string.stripQuotes = function(a, c) {
  for (var d = c.length, e = 0;e < d;e++) {
    var f = 1 == d ? c : c.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
m.string.truncate = function(a, c, d) {
  d && (a = m.string.unescapeEntities(a));
  a.length > c && (a = a.substring(0, c - 3) + "...");
  d && (a = m.string.htmlEscape(a));
  return a;
};
m.string.truncateMiddle = function(a, c, d, e) {
  d && (a = m.string.unescapeEntities(a));
  if (e && a.length > c) {
    e > c && (e = c);
    var f = a.length - e;
    a = a.substring(0, c - e) + "..." + a.substring(f);
  } else {
    a.length > c && (e = Math.floor(c / 2), f = a.length - e, a = a.substring(0, e + c % 2) + "..." + a.substring(f));
  }
  d && (a = m.string.htmlEscape(a));
  return a;
};
m.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
m.string.jsEscapeCache_ = {"'":"\\'"};
m.string.quote = function(a) {
  a = String(a);
  for (var c = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    c[d + 1] = m.string.specialEscapeChars_[e] || (31 < f && 127 > f ? e : m.string.escapeChar(e));
  }
  c.push('"');
  return c.join("");
};
m.string.escapeString = function(a) {
  for (var c = [], d = 0;d < a.length;d++) {
    c[d] = m.string.escapeChar(a.charAt(d));
  }
  return c.join("");
};
m.string.escapeChar = function(a) {
  if (a in m.string.jsEscapeCache_) {
    return m.string.jsEscapeCache_[a];
  }
  if (a in m.string.specialEscapeChars_) {
    return m.string.jsEscapeCache_[a] = m.string.specialEscapeChars_[a];
  }
  var c, d = a.charCodeAt(0);
  if (31 < d && 127 > d) {
    c = a;
  } else {
    if (256 > d) {
      if (c = "\\x", 16 > d || 256 < d) {
        c += "0";
      }
    } else {
      c = "\\u", 4096 > d && (c += "0");
    }
    c += d.toString(16).toUpperCase();
  }
  return m.string.jsEscapeCache_[a] = c;
};
m.string.contains = function(a, c) {
  return -1 != a.indexOf(c);
};
m.string.caseInsensitiveContains = function(a, c) {
  return m.string.contains(a.toLowerCase(), c.toLowerCase());
};
m.string.countOf = function(a, c) {
  return a && c ? a.split(c).length - 1 : 0;
};
m.string.removeAt = function(a, c, d) {
  var e = a;
  0 <= c && c < a.length && 0 < d && (e = a.substr(0, c) + a.substr(c + d, a.length - c - d));
  return e;
};
m.string.remove = function(a, c) {
  return a.replace(c, "");
};
m.string.removeAll = function(a, c) {
  c = new RegExp(m.string.regExpEscape(c), "g");
  return a.replace(c, "");
};
m.string.replaceAll = function(a, c, d) {
  c = new RegExp(m.string.regExpEscape(c), "g");
  return a.replace(c, d.replace(/\$/g, "$$$$"));
};
m.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
m.string.repeat = String.prototype.repeat ? function(a, c) {
  return a.repeat(c);
} : function(a, c) {
  return Array(c + 1).join(a);
};
m.string.padNumber = function(a, c, d) {
  a = m.isDef(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return m.string.repeat("0", Math.max(0, c - d)) + a;
};
m.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
m.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
m.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ m.now()).toString(36);
};
m.string.compareVersions = function(a, c) {
  var d = 0;
  a = m.string.trim(String(a)).split(".");
  c = m.string.trim(String(c)).split(".");
  for (var e = Math.max(a.length, c.length), f = 0;0 == d && f < e;f++) {
    var g = a[f] || "", h = c[f] || "";
    do {
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
      if (0 == g[0].length && 0 == h[0].length) {
        break;
      }
      var d = 0 == g[1].length ? 0 : parseInt(g[1], 10), k = 0 == h[1].length ? 0 : parseInt(h[1], 10), d = m.string.compareElements_(d, k) || m.string.compareElements_(0 == g[2].length, 0 == h[2].length) || m.string.compareElements_(g[2], h[2]), g = g[3], h = h[3];
    } while (0 == d);
  }
  return d;
};
m.string.compareElements_ = function(a, c) {
  return a < c ? -1 : a > c ? 1 : 0;
};
m.string.hashCode = function(a) {
  for (var c = 0, d = 0;d < a.length;++d) {
    c = 31 * c + a.charCodeAt(d) >>> 0;
  }
  return c;
};
m.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
m.string.createUniqueString = function() {
  return "goog_" + m.string.uniqueStringCounter_++;
};
m.string.toNumber = function(a) {
  var c = Number(a);
  return 0 == c && m.string.isEmptyOrWhitespace(a) ? NaN : c;
};
m.string.isLowerCamelCase = function(a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
m.string.isUpperCamelCase = function(a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
m.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase();
  });
};
m.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
m.string.toTitleCase = function(a, c) {
  c = m.isString(c) ? m.string.regExpEscape(c) : "\\s";
  return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, c, f) {
    return c + f.toUpperCase();
  });
};
m.string.capitalize = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
m.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return m.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
m.string.splitLimit = function(a, c, d) {
  a = a.split(c);
  for (var e = [];0 < d && a.length;) {
    e.push(a.shift()), d--;
  }
  a.length && e.push(a.join(c));
  return e;
};
m.string.lastComponent = function(a, c) {
  if (c) {
    "string" == typeof c && (c = [c]);
  } else {
    return a;
  }
  for (var d = -1, e = 0;e < c.length;e++) {
    if ("" != c[e]) {
      var f = a.lastIndexOf(c[e]);
      f > d && (d = f);
    }
  }
  return -1 == d ? a : a.slice(d + 1);
};
m.string.editDistance = function(a, c) {
  var d = [], e = [];
  if (a == c) {
    return 0;
  }
  if (!a.length || !c.length) {
    return Math.max(a.length, c.length);
  }
  for (var f = 0;f < c.length + 1;f++) {
    d[f] = f;
  }
  for (f = 0;f < a.length;f++) {
    e[0] = f + 1;
    for (var g = 0;g < c.length;g++) {
      e[g + 1] = Math.min(e[g] + 1, d[g + 1] + 1, d[g] + Number(a[f] != c[g]));
    }
    for (g = 0;g < d.length;g++) {
      d[g] = e[g];
    }
  }
  return e[c.length];
};
m.asserts = {};
m.asserts.ENABLE_ASSERTS = m.DEBUG;
m.asserts.AssertionError = function(a, c) {
  c.unshift(a);
  m.debug.Error.call(this, m.string.subs.apply(null, c));
  c.shift();
  this.messagePattern = a;
};
m.inherits(m.asserts.AssertionError, m.debug.Error);
m.asserts.AssertionError.prototype.name = "AssertionError";
m.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
m.asserts.errorHandler_ = m.asserts.DEFAULT_ERROR_HANDLER;
m.asserts.doAssertFailure_ = function(a, c, d, e) {
  var f = "Assertion failed";
  if (d) {
    var f = f + (": " + d), g = e;
  } else {
    a && (f += ": " + a, g = c);
  }
  a = new m.asserts.AssertionError("" + f, g || []);
  m.asserts.errorHandler_(a);
};
m.asserts.setErrorHandler = function(a) {
  m.asserts.ENABLE_ASSERTS && (m.asserts.errorHandler_ = a);
};
m.asserts.assert = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !a && m.asserts.doAssertFailure_("", null, c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.fail = function(a, c) {
  m.asserts.ENABLE_ASSERTS && m.asserts.errorHandler_(new m.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
m.asserts.assertNumber = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !m.isNumber(a) && m.asserts.doAssertFailure_("Expected number but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertString = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !m.isString(a) && m.asserts.doAssertFailure_("Expected string but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertFunction = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !m.isFunction(a) && m.asserts.doAssertFailure_("Expected function but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertObject = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !m.isObject(a) && m.asserts.doAssertFailure_("Expected object but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertArray = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !m.isArray(a) && m.asserts.doAssertFailure_("Expected array but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertBoolean = function(a, c, d) {
  m.asserts.ENABLE_ASSERTS && !m.isBoolean(a) && m.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertElement = function(a, c, d) {
  !m.asserts.ENABLE_ASSERTS || m.isObject(a) && a.nodeType == m.dom.NodeType.ELEMENT || m.asserts.doAssertFailure_("Expected Element but got %s: %s.", [m.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
m.asserts.assertInstanceof = function(a, c, d, e) {
  !m.asserts.ENABLE_ASSERTS || a instanceof c || m.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [m.asserts.getType_(c), m.asserts.getType_(a)], d, Array.prototype.slice.call(arguments, 3));
  return a;
};
m.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    m.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
m.asserts.getType_ = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
m.functions = {};
m.functions.constant = function(a) {
  return function() {
    return a;
  };
};
m.functions.FALSE = m.functions.constant(!1);
m.functions.TRUE = m.functions.constant(!0);
m.functions.NULL = m.functions.constant(null);
m.functions.identity = function(a) {
  return a;
};
m.functions.error = function(a) {
  return function() {
    throw Error(a);
  };
};
m.functions.fail = function(a) {
  return function() {
    throw a;
  };
};
m.functions.lock = function(a, c) {
  c = c || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, c));
  };
};
m.functions.nth = function(a) {
  return function() {
    return arguments[a];
  };
};
m.functions.partialRight = function(a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = Array.prototype.slice.call(arguments);
    c.push.apply(c, d);
    return a.apply(this, c);
  };
};
m.functions.withReturnValue = function(a, c) {
  return m.functions.sequence(a, m.functions.constant(c));
};
m.functions.equalTo = function(a, c) {
  return function(d) {
    return c ? a == d : a === d;
  };
};
m.functions.compose = function(a, c) {
  var d = arguments, e = d.length;
  return function() {
    var a;
    e && (a = d[e - 1].apply(this, arguments));
    for (var c = e - 2;0 <= c;c--) {
      a = d[c].call(this, a);
    }
    return a;
  };
};
m.functions.sequence = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a, f = 0;f < d;f++) {
      a = c[f].apply(this, arguments);
    }
    return a;
  };
};
m.functions.and = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a = 0;a < d;a++) {
      if (!c[a].apply(this, arguments)) {
        return !1;
      }
    }
    return !0;
  };
};
m.functions.or = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a = 0;a < d;a++) {
      if (c[a].apply(this, arguments)) {
        return !0;
      }
    }
    return !1;
  };
};
m.functions.not = function(a) {
  return function() {
    return !a.apply(this, arguments);
  };
};
m.functions.create = function(a, c) {
  function d() {
  }
  d.prototype = a.prototype;
  var e = new d;
  a.apply(e, Array.prototype.slice.call(arguments, 1));
  return e;
};
m.functions.CACHE_RETURN_VALUE = !0;
m.functions.cacheReturnValue = function(a) {
  var c = !1, d;
  return function() {
    if (!m.functions.CACHE_RETURN_VALUE) {
      return a();
    }
    c || (d = a(), c = !0);
    return d;
  };
};
m.functions.once = function(a) {
  var c = a;
  return function() {
    if (c) {
      var a = c;
      c = null;
      a();
    }
  };
};
m.functions.debounce = function(a, c, d) {
  d && (a = m.bind(a, d));
  var e = null;
  return function(d) {
    m.global.clearTimeout(e);
    var f = arguments;
    e = m.global.setTimeout(function() {
      a.apply(null, f);
    }, c);
  };
};
m.functions.throttle = function(a, c, d) {
  function e() {
    g = m.global.setTimeout(f, c);
    a.apply(null, k);
  }
  function f() {
    g = null;
    h && (h = !1, e());
  }
  d && (a = m.bind(a, d));
  var g = null, h = !1, k = [];
  return function(a) {
    k = arguments;
    g ? h = !0 : e();
  };
};
m.array = {};
m.NATIVE_ARRAY_PROTOTYPES = m.TRUSTED_SITE;
m.array.ASSUME_NATIVE_FUNCTIONS = !1;
m.array.peek = function(a) {
  return a[a.length - 1];
};
m.array.last = m.array.peek;
m.array.indexOf = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  return Array.prototype.indexOf.call(a, c, d);
} : function(a, c, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if (m.isString(a)) {
    return m.isString(c) && 1 == c.length ? a.indexOf(c, d) : -1;
  }
  for (;d < a.length;d++) {
    if (d in a && a[d] === c) {
      return d;
    }
  }
  return -1;
};
m.array.lastIndexOf = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  return Array.prototype.lastIndexOf.call(a, c, null == d ? a.length - 1 : d);
} : function(a, c, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if (m.isString(a)) {
    return m.isString(c) && 1 == c.length ? a.lastIndexOf(c, d) : -1;
  }
  for (;0 <= d;d--) {
    if (d in a && a[d] === c) {
      return d;
    }
  }
  return -1;
};
m.array.forEach = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  Array.prototype.forEach.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = m.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && c.call(d, f[g], g, a);
  }
};
m.array.forEachRight = function(a, c, d) {
  for (var e = a.length, f = m.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && c.call(d, f[e], e, a);
  }
};
m.array.filter = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  return Array.prototype.filter.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = [], g = 0, h = m.isString(a) ? a.split("") : a, k = 0;k < e;k++) {
    if (k in h) {
      var l = h[k];
      c.call(d, l, k, a) && (f[g++] = l);
    }
  }
  return f;
};
m.array.map = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  return Array.prototype.map.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = Array(e), g = m.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in g && (f[h] = c.call(d, g[h], h, a));
  }
  return f;
};
m.array.reduce = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(a, c, d, e) {
  m.asserts.assert(null != a.length);
  e && (c = m.bind(c, e));
  return Array.prototype.reduce.call(a, c, d);
} : function(a, c, d, e) {
  var f = d;
  m.array.forEach(a, function(d, h) {
    f = c.call(e, f, d, h, a);
  });
  return f;
};
m.array.reduceRight = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(a, c, d, e) {
  m.asserts.assert(null != a.length);
  m.asserts.assert(null != c);
  e && (c = m.bind(c, e));
  return Array.prototype.reduceRight.call(a, c, d);
} : function(a, c, d, e) {
  var f = d;
  m.array.forEachRight(a, function(d, h) {
    f = c.call(e, f, d, h, a);
  });
  return f;
};
m.array.some = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  return Array.prototype.some.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = m.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && c.call(d, f[g], g, a)) {
      return !0;
    }
  }
  return !1;
};
m.array.every = m.NATIVE_ARRAY_PROTOTYPES && (m.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(a, c, d) {
  m.asserts.assert(null != a.length);
  return Array.prototype.every.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = m.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && !c.call(d, f[g], g, a)) {
      return !1;
    }
  }
  return !0;
};
m.array.count = function(a, c, d) {
  var e = 0;
  m.array.forEach(a, function(a, g, h) {
    c.call(d, a, g, h) && ++e;
  }, d);
  return e;
};
m.array.find = function(a, c, d) {
  c = m.array.findIndex(a, c, d);
  return 0 > c ? null : m.isString(a) ? a.charAt(c) : a[c];
};
m.array.findIndex = function(a, c, d) {
  for (var e = a.length, f = m.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && c.call(d, f[g], g, a)) {
      return g;
    }
  }
  return -1;
};
m.array.findRight = function(a, c, d) {
  c = m.array.findIndexRight(a, c, d);
  return 0 > c ? null : m.isString(a) ? a.charAt(c) : a[c];
};
m.array.findIndexRight = function(a, c, d) {
  for (var e = a.length, f = m.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if (e in f && c.call(d, f[e], e, a)) {
      return e;
    }
  }
  return -1;
};
m.array.contains = function(a, c) {
  return 0 <= m.array.indexOf(a, c);
};
m.array.isEmpty = function(a) {
  return 0 == a.length;
};
m.array.clear = function(a) {
  if (!m.isArray(a)) {
    for (var c = a.length - 1;0 <= c;c--) {
      delete a[c];
    }
  }
  a.length = 0;
};
m.array.insert = function(a, c) {
  m.array.contains(a, c) || a.push(c);
};
m.array.insertAt = function(a, c, d) {
  m.array.splice(a, d, 0, c);
};
m.array.insertArrayAt = function(a, c, d) {
  m.partial(m.array.splice, a, d, 0).apply(null, c);
};
m.array.insertBefore = function(a, c, d) {
  var e;
  2 == arguments.length || 0 > (e = m.array.indexOf(a, d)) ? a.push(c) : m.array.insertAt(a, c, e);
};
m.array.remove = function(a, c) {
  c = m.array.indexOf(a, c);
  var d;
  (d = 0 <= c) && m.array.removeAt(a, c);
  return d;
};
m.array.removeLast = function(a, c) {
  c = m.array.lastIndexOf(a, c);
  return 0 <= c ? (m.array.removeAt(a, c), !0) : !1;
};
m.array.removeAt = function(a, c) {
  m.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, c, 1).length;
};
m.array.removeIf = function(a, c, d) {
  c = m.array.findIndex(a, c, d);
  return 0 <= c ? (m.array.removeAt(a, c), !0) : !1;
};
m.array.removeAllIf = function(a, c, d) {
  var e = 0;
  m.array.forEachRight(a, function(f, g) {
    c.call(d, f, g, a) && m.array.removeAt(a, g) && e++;
  });
  return e;
};
m.array.concat = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
m.array.join = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
m.array.toArray = function(a) {
  var c = a.length;
  if (0 < c) {
    for (var d = Array(c), e = 0;e < c;e++) {
      d[e] = a[e];
    }
    return d;
  }
  return [];
};
m.array.clone = m.array.toArray;
m.array.extend = function(a, c) {
  for (var d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    if (m.isArrayLike(e)) {
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
m.array.splice = function(a, c, d, e) {
  m.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, m.array.slice(arguments, 1));
};
m.array.slice = function(a, c, d) {
  m.asserts.assert(null != a.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(a, c) : Array.prototype.slice.call(a, c, d);
};
m.array.removeDuplicates = function(a, c, d) {
  function e(a) {
    return m.isObject(a) ? "o" + m.getUid(a) : (typeof a).charAt(0) + a;
  }
  c = c || a;
  d = d || e;
  for (var f = {}, g = 0, h = 0;h < a.length;) {
    var k = a[h++], l = d(k);
    Object.prototype.hasOwnProperty.call(f, l) || (f[l] = !0, c[g++] = k);
  }
  c.length = g;
};
m.array.binarySearch = function(a, c, d) {
  return m.array.binarySearch_(a, d || m.array.defaultCompare, !1, c);
};
m.array.binarySelect = function(a, c, d) {
  return m.array.binarySearch_(a, c, !0, void 0, d);
};
m.array.binarySearch_ = function(a, c, d, e, f) {
  for (var g = 0, h = a.length, k;g < h;) {
    var l = g + h >> 1, n;
    n = d ? c.call(f, a[l], l, a) : c(e, a[l]);
    0 < n ? g = l + 1 : (h = l, k = !n);
  }
  return k ? g : ~g;
};
m.array.sort = function(a, c) {
  a.sort(c || m.array.defaultCompare);
};
m.array.stableSort = function(a, c) {
  for (var d = Array(a.length), e = 0;e < a.length;e++) {
    d[e] = {index:e, value:a[e]};
  }
  var f = c || m.array.defaultCompare;
  m.array.sort(d, function(a, c) {
    return f(a.value, c.value) || a.index - c.index;
  });
  for (e = 0;e < a.length;e++) {
    a[e] = d[e].value;
  }
};
m.array.sortByKey = function(a, c, d) {
  var e = d || m.array.defaultCompare;
  m.array.sort(a, function(a, d) {
    return e(c(a), c(d));
  });
};
m.array.sortObjectsByKey = function(a, c, d) {
  m.array.sortByKey(a, function(a) {
    return a[c];
  }, d);
};
m.array.isSorted = function(a, c, d) {
  c = c || m.array.defaultCompare;
  for (var e = 1;e < a.length;e++) {
    var f = c(a[e - 1], a[e]);
    if (0 < f || 0 == f && d) {
      return !1;
    }
  }
  return !0;
};
m.array.equals = function(a, c, d) {
  if (!m.isArrayLike(a) || !m.isArrayLike(c) || a.length != c.length) {
    return !1;
  }
  var e = a.length;
  d = d || m.array.defaultCompareEquality;
  for (var f = 0;f < e;f++) {
    if (!d(a[f], c[f])) {
      return !1;
    }
  }
  return !0;
};
m.array.compare3 = function(a, c, d) {
  d = d || m.array.defaultCompare;
  for (var e = Math.min(a.length, c.length), f = 0;f < e;f++) {
    var g = d(a[f], c[f]);
    if (0 != g) {
      return g;
    }
  }
  return m.array.defaultCompare(a.length, c.length);
};
m.array.defaultCompare = function(a, c) {
  return a > c ? 1 : a < c ? -1 : 0;
};
m.array.inverseDefaultCompare = function(a, c) {
  return -m.array.defaultCompare(a, c);
};
m.array.defaultCompareEquality = function(a, c) {
  return a === c;
};
m.array.binaryInsert = function(a, c, d) {
  d = m.array.binarySearch(a, c, d);
  return 0 > d ? (m.array.insertAt(a, c, -(d + 1)), !0) : !1;
};
m.array.binaryRemove = function(a, c, d) {
  c = m.array.binarySearch(a, c, d);
  return 0 <= c ? m.array.removeAt(a, c) : !1;
};
m.array.bucket = function(a, c, d) {
  for (var e = {}, f = 0;f < a.length;f++) {
    var g = a[f], h = c.call(d, g, f, a);
    m.isDef(h) && (e[h] || (e[h] = [])).push(g);
  }
  return e;
};
m.array.toObject = function(a, c, d) {
  var e = {};
  m.array.forEach(a, function(f, g) {
    e[c.call(d, f, g, a)] = f;
  });
  return e;
};
m.array.range = function(a, c, d) {
  var e = [], f = 0, g = a;
  d = d || 1;
  void 0 !== c && (f = a, g = c);
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
m.array.repeat = function(a, c) {
  for (var d = [], e = 0;e < c;e++) {
    d[e] = a;
  }
  return d;
};
m.array.flatten = function(a) {
  for (var c = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    if (m.isArray(e)) {
      for (var f = 0;f < e.length;f += 8192) {
        for (var g = m.array.slice(e, f, f + 8192), g = m.array.flatten.apply(null, g), h = 0;h < g.length;h++) {
          c.push(g[h]);
        }
      }
    } else {
      c.push(e);
    }
  }
  return c;
};
m.array.rotate = function(a, c) {
  m.asserts.assert(null != a.length);
  a.length && (c %= a.length, 0 < c ? Array.prototype.unshift.apply(a, a.splice(-c, c)) : 0 > c && Array.prototype.push.apply(a, a.splice(0, -c)));
  return a;
};
m.array.moveItem = function(a, c, d) {
  m.asserts.assert(0 <= c && c < a.length);
  m.asserts.assert(0 <= d && d < a.length);
  c = Array.prototype.splice.call(a, c, 1);
  Array.prototype.splice.call(a, d, 0, c[0]);
};
m.array.zip = function(a) {
  if (!arguments.length) {
    return [];
  }
  for (var c = [], d = arguments[0].length, e = 1;e < arguments.length;e++) {
    arguments[e].length < d && (d = arguments[e].length);
  }
  for (e = 0;e < d;e++) {
    for (var f = [], g = 0;g < arguments.length;g++) {
      f.push(arguments[g][e]);
    }
    c.push(f);
  }
  return c;
};
m.array.shuffle = function(a, c) {
  c = c || Math.random;
  for (var d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
m.array.copyByIndex = function(a, c) {
  var d = [];
  m.array.forEach(c, function(c) {
    d.push(a[c]);
  });
  return d;
};
m.array.concatMap = function(a, c, d) {
  return m.array.concat.apply([], m.array.map(a, c, d));
};
m.object = {};
m.object.is = function(a, c) {
  return a === c ? 0 !== a || 1 / a === 1 / c : a !== a && c !== c;
};
m.object.forEach = function(a, c, d) {
  for (var e in a) {
    c.call(d, a[e], e, a);
  }
};
m.object.filter = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    c.call(d, a[f], f, a) && (e[f] = a[f]);
  }
  return e;
};
m.object.map = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = c.call(d, a[f], f, a);
  }
  return e;
};
m.object.some = function(a, c, d) {
  for (var e in a) {
    if (c.call(d, a[e], e, a)) {
      return !0;
    }
  }
  return !1;
};
m.object.every = function(a, c, d) {
  for (var e in a) {
    if (!c.call(d, a[e], e, a)) {
      return !1;
    }
  }
  return !0;
};
m.object.getCount = function(a) {
  var c = 0, d;
  for (d in a) {
    c++;
  }
  return c;
};
m.object.getAnyKey = function(a) {
  for (var c in a) {
    return c;
  }
};
m.object.getAnyValue = function(a) {
  for (var c in a) {
    return a[c];
  }
};
m.object.contains = function(a, c) {
  return m.object.containsValue(a, c);
};
m.object.getValues = function(a) {
  var c = [], d = 0, e;
  for (e in a) {
    c[d++] = a[e];
  }
  return c;
};
m.object.getKeys = function(a) {
  var c = [], d = 0, e;
  for (e in a) {
    c[d++] = e;
  }
  return c;
};
m.object.getValueByKeys = function(a, c) {
  for (var d = m.isArrayLike(c), e = d ? c : arguments, d = d ? 0 : 1;d < e.length && (a = a[e[d]], m.isDef(a));d++) {
  }
  return a;
};
m.object.containsKey = function(a, c) {
  return null !== a && c in a;
};
m.object.containsValue = function(a, c) {
  for (var d in a) {
    if (a[d] == c) {
      return !0;
    }
  }
  return !1;
};
m.object.findKey = function(a, c, d) {
  for (var e in a) {
    if (c.call(d, a[e], e, a)) {
      return e;
    }
  }
};
m.object.findValue = function(a, c, d) {
  return (c = m.object.findKey(a, c, d)) && a[c];
};
m.object.isEmpty = function(a) {
  for (var c in a) {
    return !1;
  }
  return !0;
};
m.object.clear = function(a) {
  for (var c in a) {
    delete a[c];
  }
};
m.object.remove = function(a, c) {
  var d;
  (d = c in a) && delete a[c];
  return d;
};
m.object.add = function(a, c, d) {
  if (null !== a && c in a) {
    throw Error('The object already contains the key "' + c + '"');
  }
  m.object.set(a, c, d);
};
m.object.get = function(a, c, d) {
  return null !== a && c in a ? a[c] : d;
};
m.object.set = function(a, c, d) {
  a[c] = d;
};
m.object.setIfUndefined = function(a, c, d) {
  return c in a ? a[c] : a[c] = d;
};
m.object.setWithReturnValueIfNotSet = function(a, c, d) {
  if (c in a) {
    return a[c];
  }
  d = d();
  return a[c] = d;
};
m.object.equals = function(a, c) {
  for (var d in a) {
    if (!(d in c) || a[d] !== c[d]) {
      return !1;
    }
  }
  for (d in c) {
    if (!(d in a)) {
      return !1;
    }
  }
  return !0;
};
m.object.clone = function(a) {
  var c = {}, d;
  for (d in a) {
    c[d] = a[d];
  }
  return c;
};
m.object.unsafeClone = function(a) {
  var c = m.typeOf(a);
  if ("object" == c || "array" == c) {
    if (m.isFunction(a.clone)) {
      return a.clone();
    }
    var c = "array" == c ? [] : {}, d;
    for (d in a) {
      c[d] = m.object.unsafeClone(a[d]);
    }
    return c;
  }
  return a;
};
m.object.transpose = function(a) {
  var c = {}, d;
  for (d in a) {
    c[a[d]] = d;
  }
  return c;
};
m.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
m.object.extend = function(a, c) {
  for (var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (d in e) {
      a[d] = e[d];
    }
    for (var g = 0;g < m.object.PROTOTYPE_FIELDS_.length;g++) {
      d = m.object.PROTOTYPE_FIELDS_[g], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }
};
m.object.create = function(a) {
  var c = arguments.length;
  if (1 == c && m.isArray(arguments[0])) {
    return m.object.create.apply(null, arguments[0]);
  }
  if (c % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var d = {}, e = 0;e < c;e += 2) {
    d[arguments[e]] = arguments[e + 1];
  }
  return d;
};
m.object.createSet = function(a) {
  var c = arguments.length;
  if (1 == c && m.isArray(arguments[0])) {
    return m.object.createSet.apply(null, arguments[0]);
  }
  for (var d = {}, e = 0;e < c;e++) {
    d[arguments[e]] = !0;
  }
  return d;
};
m.object.createImmutableView = function(a) {
  var c = a;
  Object.isFrozen && !Object.isFrozen(a) && (c = Object.create(a), Object.freeze(c));
  return c;
};
m.object.isImmutableView = function(a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
m.math = {};
m.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
m.math.uniformRandom = function(a, c) {
  return a + Math.random() * (c - a);
};
m.math.clamp = function(a, c, d) {
  return Math.min(Math.max(a, c), d);
};
m.math.modulo = function(a, c) {
  a %= c;
  return 0 > a * c ? a + c : a;
};
m.math.lerp = function(a, c, d) {
  return a + d * (c - a);
};
m.math.nearlyEquals = function(a, c, d) {
  return Math.abs(a - c) <= (d || 1E-6);
};
m.math.standardAngle = function(a) {
  return m.math.modulo(a, 360);
};
m.math.standardAngleInRadians = function(a) {
  return m.math.modulo(a, 2 * Math.PI);
};
m.math.toRadians = function(a) {
  return a * Math.PI / 180;
};
m.math.toDegrees = function(a) {
  return 180 * a / Math.PI;
};
m.math.angleDx = function(a, c) {
  return c * Math.cos(m.math.toRadians(a));
};
m.math.angleDy = function(a, c) {
  return c * Math.sin(m.math.toRadians(a));
};
m.math.angle = function(a, c, d, e) {
  return m.math.standardAngle(m.math.toDegrees(Math.atan2(e - c, d - a)));
};
m.math.angleDifference = function(a, c) {
  a = m.math.standardAngle(c) - m.math.standardAngle(a);
  180 < a ? a -= 360 : -180 >= a && (a = 360 + a);
  return a;
};
m.math.sign = function(a) {
  return 0 < a ? 1 : 0 > a ? -1 : a;
};
m.math.longestCommonSubsequence = function(a, c, d, e) {
  d = d || function(a, c) {
    return a == c;
  };
  e = e || function(c) {
    return a[c];
  };
  for (var f = a.length, g = c.length, h = [], k = 0;k < f + 1;k++) {
    h[k] = [], h[k][0] = 0;
  }
  for (var l = 0;l < g + 1;l++) {
    h[0][l] = 0;
  }
  for (k = 1;k <= f;k++) {
    for (l = 1;l <= g;l++) {
      d(a[k - 1], c[l - 1]) ? h[k][l] = h[k - 1][l - 1] + 1 : h[k][l] = Math.max(h[k - 1][l], h[k][l - 1]);
    }
  }
  for (var n = [], k = f, l = g;0 < k && 0 < l;) {
    d(a[k - 1], c[l - 1]) ? (n.unshift(e(k - 1, l - 1)), k--, l--) : h[k - 1][l] > h[k][l - 1] ? k-- : l--;
  }
  return n;
};
m.math.sum = function(a) {
  return m.array.reduce(arguments, function(a, d) {
    return a + d;
  }, 0);
};
m.math.average = function(a) {
  return m.math.sum.apply(null, arguments) / arguments.length;
};
m.math.sampleVariance = function(a) {
  var c = arguments.length;
  if (2 > c) {
    return 0;
  }
  var d = m.math.average.apply(null, arguments);
  return m.math.sum.apply(null, m.array.map(arguments, function(a) {
    return Math.pow(a - d, 2);
  })) / (c - 1);
};
m.math.standardDeviation = function(a) {
  return Math.sqrt(m.math.sampleVariance.apply(null, arguments));
};
m.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1;
};
m.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a);
};
m.math.isNegativeZero = function(a) {
  return 0 == a && 0 > 1 / a;
};
m.math.log10Floor = function(a) {
  if (0 < a) {
    var c = Math.round(Math.log(a) * Math.LOG10E);
    return c - (parseFloat("1e" + c) > a ? 1 : 0);
  }
  return 0 == a ? -Infinity : NaN;
};
m.math.safeFloor = function(a, c) {
  m.asserts.assert(!m.isDef(c) || 0 < c);
  return Math.floor(a + (c || 2E-15));
};
m.math.safeCeil = function(a, c) {
  m.asserts.assert(!m.isDef(c) || 0 < c);
  return Math.ceil(a - (c || 2E-15));
};
m.structs = {};
m.structs.getCount = function(a) {
  return a.getCount && "function" == typeof a.getCount ? a.getCount() : m.isArrayLike(a) || m.isString(a) ? a.length : m.object.getCount(a);
};
m.structs.getValues = function(a) {
  if (a.getValues && "function" == typeof a.getValues) {
    return a.getValues();
  }
  if (m.isString(a)) {
    return a.split("");
  }
  if (m.isArrayLike(a)) {
    for (var c = [], d = a.length, e = 0;e < d;e++) {
      c.push(a[e]);
    }
    return c;
  }
  return m.object.getValues(a);
};
m.structs.getKeys = function(a) {
  if (a.getKeys && "function" == typeof a.getKeys) {
    return a.getKeys();
  }
  if (!a.getValues || "function" != typeof a.getValues) {
    if (m.isArrayLike(a) || m.isString(a)) {
      var c = [];
      a = a.length;
      for (var d = 0;d < a;d++) {
        c.push(d);
      }
      return c;
    }
    return m.object.getKeys(a);
  }
};
m.structs.contains = function(a, c) {
  return a.contains && "function" == typeof a.contains ? a.contains(c) : a.containsValue && "function" == typeof a.containsValue ? a.containsValue(c) : m.isArrayLike(a) || m.isString(a) ? m.array.contains(a, c) : m.object.containsValue(a, c);
};
m.structs.isEmpty = function(a) {
  return a.isEmpty && "function" == typeof a.isEmpty ? a.isEmpty() : m.isArrayLike(a) || m.isString(a) ? m.array.isEmpty(a) : m.object.isEmpty(a);
};
m.structs.clear = function(a) {
  a.clear && "function" == typeof a.clear ? a.clear() : m.isArrayLike(a) ? m.array.clear(a) : m.object.clear(a);
};
m.structs.forEach = function(a, c, d) {
  if (a.forEach && "function" == typeof a.forEach) {
    a.forEach(c, d);
  } else {
    if (m.isArrayLike(a) || m.isString(a)) {
      m.array.forEach(a, c, d);
    } else {
      for (var e = m.structs.getKeys(a), f = m.structs.getValues(a), g = f.length, h = 0;h < g;h++) {
        c.call(d, f[h], e && e[h], a);
      }
    }
  }
};
m.structs.filter = function(a, c, d) {
  if ("function" == typeof a.filter) {
    return a.filter(c, d);
  }
  if (m.isArrayLike(a) || m.isString(a)) {
    return m.array.filter(a, c, d);
  }
  var e, f = m.structs.getKeys(a), g = m.structs.getValues(a), h = g.length;
  if (f) {
    e = {};
    for (var k = 0;k < h;k++) {
      c.call(d, g[k], f[k], a) && (e[f[k]] = g[k]);
    }
  } else {
    for (e = [], k = 0;k < h;k++) {
      c.call(d, g[k], void 0, a) && e.push(g[k]);
    }
  }
  return e;
};
m.structs.map = function(a, c, d) {
  if ("function" == typeof a.map) {
    return a.map(c, d);
  }
  if (m.isArrayLike(a) || m.isString(a)) {
    return m.array.map(a, c, d);
  }
  var e, f = m.structs.getKeys(a), g = m.structs.getValues(a), h = g.length;
  if (f) {
    e = {};
    for (var k = 0;k < h;k++) {
      e[f[k]] = c.call(d, g[k], f[k], a);
    }
  } else {
    for (e = [], k = 0;k < h;k++) {
      e[k] = c.call(d, g[k], void 0, a);
    }
  }
  return e;
};
m.structs.some = function(a, c, d) {
  if ("function" == typeof a.some) {
    return a.some(c, d);
  }
  if (m.isArrayLike(a) || m.isString(a)) {
    return m.array.some(a, c, d);
  }
  for (var e = m.structs.getKeys(a), f = m.structs.getValues(a), g = f.length, h = 0;h < g;h++) {
    if (c.call(d, f[h], e && e[h], a)) {
      return !0;
    }
  }
  return !1;
};
m.structs.every = function(a, c, d) {
  if ("function" == typeof a.every) {
    return a.every(c, d);
  }
  if (m.isArrayLike(a) || m.isString(a)) {
    return m.array.every(a, c, d);
  }
  for (var e = m.structs.getKeys(a), f = m.structs.getValues(a), g = f.length, h = 0;h < g;h++) {
    if (!c.call(d, f[h], e && e[h], a)) {
      return !1;
    }
  }
  return !0;
};
m.structs.Collection = function() {
};
m.iter = {};
m.iter.StopIteration = "StopIteration" in m.global ? m.global.StopIteration : {message:"StopIteration", stack:""};
m.iter.Iterator = function() {
};
m.iter.Iterator.prototype.next = function() {
  throw m.iter.StopIteration;
};
m.iter.Iterator.prototype.__iterator__ = function() {
  return this;
};
m.iter.toIterator = function(a) {
  if (a instanceof m.iter.Iterator) {
    return a;
  }
  if ("function" == typeof a.__iterator__) {
    return a.__iterator__(!1);
  }
  if (m.isArrayLike(a)) {
    var c = 0, d = new m.iter.Iterator;
    d.next = function() {
      for (;;) {
        if (c >= a.length) {
          throw m.iter.StopIteration;
        }
        if (c in a) {
          return a[c++];
        }
        c++;
      }
    };
    return d;
  }
  throw Error("Not implemented");
};
m.iter.forEach = function(a, c, d) {
  if (m.isArrayLike(a)) {
    try {
      m.array.forEach(a, c, d);
    } catch (e) {
      if (e !== m.iter.StopIteration) {
        throw e;
      }
    }
  } else {
    a = m.iter.toIterator(a);
    try {
      for (;;) {
        c.call(d, a.next(), void 0, a);
      }
    } catch (e) {
      if (e !== m.iter.StopIteration) {
        throw e;
      }
    }
  }
};
m.iter.filter = function(a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  a.next = function() {
    for (;;) {
      var a = e.next();
      if (c.call(d, a, void 0, e)) {
        return a;
      }
    }
  };
  return a;
};
m.iter.filterFalse = function(a, c, d) {
  return m.iter.filter(a, m.functions.not(c), d);
};
m.iter.range = function(a, c, d) {
  var e = 0, f = a, g = d || 1;
  1 < arguments.length && (e = a, f = c);
  if (0 == g) {
    throw Error("Range step argument must not be zero");
  }
  var h = new m.iter.Iterator;
  h.next = function() {
    if (0 < g && e >= f || 0 > g && e <= f) {
      throw m.iter.StopIteration;
    }
    var a = e;
    e += g;
    return a;
  };
  return h;
};
m.iter.join = function(a, c) {
  return m.iter.toArray(a).join(c);
};
m.iter.map = function(a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  a.next = function() {
    var a = e.next();
    return c.call(d, a, void 0, e);
  };
  return a;
};
m.iter.reduce = function(a, c, d, e) {
  var f = d;
  m.iter.forEach(a, function(a) {
    f = c.call(e, f, a);
  });
  return f;
};
m.iter.some = function(a, c, d) {
  a = m.iter.toIterator(a);
  try {
    for (;;) {
      if (c.call(d, a.next(), void 0, a)) {
        return !0;
      }
    }
  } catch (e) {
    if (e !== m.iter.StopIteration) {
      throw e;
    }
  }
  return !1;
};
m.iter.every = function(a, c, d) {
  a = m.iter.toIterator(a);
  try {
    for (;;) {
      if (!c.call(d, a.next(), void 0, a)) {
        return !1;
      }
    }
  } catch (e) {
    if (e !== m.iter.StopIteration) {
      throw e;
    }
  }
  return !0;
};
m.iter.chain = function(a) {
  return m.iter.chainFromIterable(arguments);
};
m.iter.chainFromIterable = function(a) {
  var c = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  var d = null;
  a.next = function() {
    for (;;) {
      if (null == d) {
        var a = c.next();
        d = m.iter.toIterator(a);
      }
      try {
        return d.next();
      } catch (f) {
        if (f !== m.iter.StopIteration) {
          throw f;
        }
        d = null;
      }
    }
  };
  return a;
};
m.iter.dropWhile = function(a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  var f = !0;
  a.next = function() {
    for (;;) {
      var a = e.next();
      if (!f || !c.call(d, a, void 0, e)) {
        return f = !1, a;
      }
    }
  };
  return a;
};
m.iter.takeWhile = function(a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  a.next = function() {
    var a = e.next();
    if (c.call(d, a, void 0, e)) {
      return a;
    }
    throw m.iter.StopIteration;
  };
  return a;
};
m.iter.toArray = function(a) {
  if (m.isArrayLike(a)) {
    return m.array.toArray(a);
  }
  a = m.iter.toIterator(a);
  var c = [];
  m.iter.forEach(a, function(a) {
    c.push(a);
  });
  return c;
};
m.iter.equals = function(a, c, d) {
  a = m.iter.zipLongest({}, a, c);
  var e = d || m.array.defaultCompareEquality;
  return m.iter.every(a, function(a) {
    return e(a[0], a[1]);
  });
};
m.iter.nextOrValue = function(a, c) {
  try {
    return m.iter.toIterator(a).next();
  } catch (d) {
    if (d != m.iter.StopIteration) {
      throw d;
    }
    return c;
  }
};
m.iter.product = function(a) {
  if (m.array.some(arguments, function(a) {
    return !a.length;
  }) || !arguments.length) {
    return new m.iter.Iterator;
  }
  var c = new m.iter.Iterator, d = arguments, e = m.array.repeat(0, d.length);
  c.next = function() {
    if (e) {
      for (var a = m.array.map(e, function(a, c) {
        return d[c][a];
      }), c = e.length - 1;0 <= c;c--) {
        m.asserts.assert(e);
        if (e[c] < d[c].length - 1) {
          e[c]++;
          break;
        }
        if (0 == c) {
          e = null;
          break;
        }
        e[c] = 0;
      }
      return a;
    }
    throw m.iter.StopIteration;
  };
  return c;
};
m.iter.cycle = function(a) {
  var c = m.iter.toIterator(a), d = [], e = 0;
  a = new m.iter.Iterator;
  var f = !1;
  a.next = function() {
    var a = null;
    if (!f) {
      try {
        return a = c.next(), d.push(a), a;
      } catch (h) {
        if (h != m.iter.StopIteration || m.array.isEmpty(d)) {
          throw h;
        }
        f = !0;
      }
    }
    a = d[e];
    e = (e + 1) % d.length;
    return a;
  };
  return a;
};
m.iter.count = function(a, c) {
  var d = a || 0, e = m.isDef(c) ? c : 1;
  a = new m.iter.Iterator;
  a.next = function() {
    var a = d;
    d += e;
    return a;
  };
  return a;
};
m.iter.repeat = function(a) {
  var c = new m.iter.Iterator;
  c.next = m.functions.constant(a);
  return c;
};
m.iter.accumulate = function(a) {
  var c = m.iter.toIterator(a), d = 0;
  a = new m.iter.Iterator;
  a.next = function() {
    return d += c.next();
  };
  return a;
};
m.iter.zip = function(a) {
  var c = arguments, d = new m.iter.Iterator;
  if (0 < c.length) {
    var e = m.array.map(c, m.iter.toIterator);
    d.next = function() {
      return m.array.map(e, function(a) {
        return a.next();
      });
    };
  }
  return d;
};
m.iter.zipLongest = function(a, c) {
  var d = m.array.slice(arguments, 1), e = new m.iter.Iterator;
  if (0 < d.length) {
    var f = m.array.map(d, m.iter.toIterator);
    e.next = function() {
      var c = !1, d = m.array.map(f, function(d) {
        var e;
        try {
          e = d.next(), c = !0;
        } catch (n) {
          if (n !== m.iter.StopIteration) {
            throw n;
          }
          e = a;
        }
        return e;
      });
      if (!c) {
        throw m.iter.StopIteration;
      }
      return d;
    };
  }
  return e;
};
m.iter.compress = function(a, c) {
  var d = m.iter.toIterator(c);
  return m.iter.filter(a, function() {
    return !!d.next();
  });
};
m.iter.GroupByIterator_ = function(a, c) {
  this.iterator = m.iter.toIterator(a);
  this.keyFunc = c || m.functions.identity;
};
m.inherits(m.iter.GroupByIterator_, m.iter.Iterator);
m.iter.GroupByIterator_.prototype.next = function() {
  for (;this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
m.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
  for (var c = [];this.currentKey == a;) {
    c.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (d) {
      if (d !== m.iter.StopIteration) {
        throw d;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return c;
};
m.iter.groupBy = function(a, c) {
  return new m.iter.GroupByIterator_(a, c);
};
m.iter.starMap = function(a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  a.next = function() {
    var a = m.iter.toArray(e.next());
    return c.apply(d, m.array.concat(a, void 0, e));
  };
  return a;
};
m.iter.tee = function(a, c) {
  function d() {
    var a = e.next();
    m.array.forEach(f, function(c) {
      c.push(a);
    });
  }
  var e = m.iter.toIterator(a);
  a = m.isNumber(c) ? c : 2;
  var f = m.array.map(m.array.range(a), function() {
    return [];
  });
  return m.array.map(f, function(a) {
    var c = new m.iter.Iterator;
    c.next = function() {
      m.array.isEmpty(a) && d();
      m.asserts.assert(!m.array.isEmpty(a));
      return a.shift();
    };
    return c;
  });
};
m.iter.enumerate = function(a, c) {
  return m.iter.zip(m.iter.count(c), a);
};
m.iter.limit = function(a, c) {
  m.asserts.assert(m.math.isInt(c) && 0 <= c);
  var d = m.iter.toIterator(a);
  a = new m.iter.Iterator;
  var e = c;
  a.next = function() {
    if (0 < e--) {
      return d.next();
    }
    throw m.iter.StopIteration;
  };
  return a;
};
m.iter.consume = function(a, c) {
  m.asserts.assert(m.math.isInt(c) && 0 <= c);
  for (a = m.iter.toIterator(a);0 < c--;) {
    m.iter.nextOrValue(a, null);
  }
  return a;
};
m.iter.slice = function(a, c, d) {
  m.asserts.assert(m.math.isInt(c) && 0 <= c);
  a = m.iter.consume(a, c);
  m.isNumber(d) && (m.asserts.assert(m.math.isInt(d) && d >= c), a = m.iter.limit(a, d - c));
  return a;
};
m.iter.hasDuplicates_ = function(a) {
  var c = [];
  m.array.removeDuplicates(a, c);
  return a.length != c.length;
};
m.iter.permutations = function(a, c) {
  a = m.iter.toArray(a);
  c = m.isNumber(c) ? c : a.length;
  c = m.array.repeat(a, c);
  c = m.iter.product.apply(void 0, c);
  return m.iter.filter(c, function(a) {
    return !m.iter.hasDuplicates_(a);
  });
};
m.iter.combinations = function(a, c) {
  function d(a) {
    return e[a];
  }
  var e = m.iter.toArray(a);
  a = m.iter.range(e.length);
  c = m.iter.permutations(a, c);
  var f = m.iter.filter(c, function(a) {
    return m.array.isSorted(a);
  });
  c = new m.iter.Iterator;
  c.next = function() {
    return m.array.map(f.next(), d);
  };
  return c;
};
m.iter.combinationsWithReplacement = function(a, c) {
  function d(a) {
    return e[a];
  }
  var e = m.iter.toArray(a);
  a = m.array.range(e.length);
  c = m.array.repeat(a, c);
  c = m.iter.product.apply(void 0, c);
  var f = m.iter.filter(c, function(a) {
    return m.array.isSorted(a);
  });
  c = new m.iter.Iterator;
  c.next = function() {
    return m.array.map(f.next(), d);
  };
  return c;
};
m.structs.Map = function(a, c) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var d = arguments.length;
  if (1 < d) {
    if (d % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var e = 0;e < d;e += 2) {
      this.set(arguments[e], arguments[e + 1]);
    }
  } else {
    a && this.addAll(a);
  }
};
m.structs.Map.prototype.getCount = function() {
  return this.count_;
};
m.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var a = [], c = 0;c < this.keys_.length;c++) {
    a.push(this.map_[this.keys_[c]]);
  }
  return a;
};
m.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
m.structs.Map.prototype.containsKey = function(a) {
  return m.structs.Map.hasKey_(this.map_, a);
};
m.structs.Map.prototype.containsValue = function(a) {
  for (var c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    if (m.structs.Map.hasKey_(this.map_, d) && this.map_[d] == a) {
      return !0;
    }
  }
  return !1;
};
m.structs.Map.prototype.equals = function(a, c) {
  if (this === a) {
    return !0;
  }
  if (this.count_ != a.getCount()) {
    return !1;
  }
  c = c || m.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var d, e = 0;d = this.keys_[e];e++) {
    if (!c(this.get(d), a.get(d))) {
      return !1;
    }
  }
  return !0;
};
m.structs.Map.defaultEquals = function(a, c) {
  return a === c;
};
m.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
m.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
m.structs.Map.prototype.remove = function(a) {
  return m.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
m.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var a = 0, c = 0;a < this.keys_.length;) {
      var d = this.keys_[a];
      m.structs.Map.hasKey_(this.map_, d) && (this.keys_[c++] = d);
      a++;
    }
    this.keys_.length = c;
  }
  if (this.count_ != this.keys_.length) {
    for (var e = {}, c = a = 0;a < this.keys_.length;) {
      d = this.keys_[a], m.structs.Map.hasKey_(e, d) || (this.keys_[c++] = d, e[d] = 1), a++;
    }
    this.keys_.length = c;
  }
};
m.structs.Map.prototype.get = function(a, c) {
  return m.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : c;
};
m.structs.Map.prototype.set = function(a, c) {
  m.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = c;
};
m.structs.Map.prototype.addAll = function(a) {
  var c;
  a instanceof m.structs.Map ? (c = a.getKeys(), a = a.getValues()) : (c = m.object.getKeys(a), a = m.object.getValues(a));
  for (var d = 0;d < c.length;d++) {
    this.set(c[d], a[d]);
  }
};
m.structs.Map.prototype.forEach = function(a, c) {
  for (var d = this.getKeys(), e = 0;e < d.length;e++) {
    var f = d[e], g = this.get(f);
    a.call(c, g, f, this);
  }
};
m.structs.Map.prototype.clone = function() {
  return new m.structs.Map(this);
};
m.structs.Map.prototype.transpose = function() {
  for (var a = new m.structs.Map, c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    a.set(this.map_[d], d);
  }
  return a;
};
m.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var a = {}, c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    a[d] = this.map_[d];
  }
  return a;
};
m.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0);
};
m.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1);
};
m.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var c = 0, d = this.version_, e = this, f = new m.iter.Iterator;
  f.next = function() {
    if (d != e.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (c >= e.keys_.length) {
      throw m.iter.StopIteration;
    }
    var f = e.keys_[c++];
    return a ? f : e.map_[f];
  };
  return f;
};
m.structs.Map.hasKey_ = function(a, c) {
  return Object.prototype.hasOwnProperty.call(a, c);
};
m.structs.Set = function(a) {
  this.map_ = new m.structs.Map;
  a && this.addAll(a);
};
m.structs.Set.getKey_ = function(a) {
  var c = typeof a;
  return "object" == c && a || "function" == c ? "o" + m.getUid(a) : c.substr(0, 1) + a;
};
m.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
m.structs.Set.prototype.add = function(a) {
  this.map_.set(m.structs.Set.getKey_(a), a);
};
m.structs.Set.prototype.addAll = function(a) {
  a = m.structs.getValues(a);
  for (var c = a.length, d = 0;d < c;d++) {
    this.add(a[d]);
  }
};
m.structs.Set.prototype.removeAll = function(a) {
  a = m.structs.getValues(a);
  for (var c = a.length, d = 0;d < c;d++) {
    this.remove(a[d]);
  }
};
m.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(m.structs.Set.getKey_(a));
};
m.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
m.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
m.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(m.structs.Set.getKey_(a));
};
m.structs.Set.prototype.containsAll = function(a) {
  return m.structs.every(a, this.contains, this);
};
m.structs.Set.prototype.intersection = function(a) {
  var c = new m.structs.Set;
  a = m.structs.getValues(a);
  for (var d = 0;d < a.length;d++) {
    var e = a[d];
    this.contains(e) && c.add(e);
  }
  return c;
};
m.structs.Set.prototype.difference = function(a) {
  var c = this.clone();
  c.removeAll(a);
  return c;
};
m.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
m.structs.Set.prototype.clone = function() {
  return new m.structs.Set(this);
};
m.structs.Set.prototype.equals = function(a) {
  return this.getCount() == m.structs.getCount(a) && this.isSubsetOf(a);
};
m.structs.Set.prototype.isSubsetOf = function(a) {
  var c = m.structs.getCount(a);
  if (this.getCount() > c) {
    return !1;
  }
  !(a instanceof m.structs.Set) && 5 < c && (a = new m.structs.Set(a));
  return m.structs.every(this, function(c) {
    return m.structs.contains(a, c);
  });
};
m.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(!1);
};
var p = require("mocha");
function q(a, c) {
  m.object.forEach(a.errorsByLineNumber, function(a) {
    if (c) {
      var d = new p.Test(" line " + a.line, function() {
        r(a);
        t(a);
      });
      c.addTest(d);
    } else {
      r(a), t(a);
    }
  });
}
function u(a, c) {
  return a.filePath + ":" + a.line + " - " + c;
}
function r(a) {
  var c = a.eslintRules, d = a.expectedRules;
  if (!c.isSubsetOf(d)) {
    throw c = "The following ESLint errors (" + c.difference(d).getValues().join(", ") + ") did not have a corresponding expected error.", Error(u(a, c));
  }
}
function t(a) {
  var c = a.eslintRules, d = a.expectedRules;
  if (!d.isSubsetOf(c)) {
    throw c = "The following expected errors (" + d.difference(c).getValues().join(", ") + ") were not found by ESLint.", Error(u(a, c));
  }
}
var v = {compareEslintToExpected:function(a, c) {
  m.object.forEach(a, function(a) {
    var d;
    d = a.filePath;
    d = d.includes("tests/") ? d.split("tests/", 2)[1] : d;
    d = c ? p.Suite.create(c, d) : void 0;
    q(a, d);
  });
}, compareErrorsForFile:q, makeErrorMessage:u, verifyEslintErrors:r, verifyExpectedErrors:t};
var w = require("eslint"), x = require("fs"), y = require("glob"), z = require("mocha"), A = require("path");
function B(a) {
  var c = x.readFileSync(a, {encoding:"utf-8"});
  return {filePath:A.resolve(a), errorsByLineNumber:C(c, a)};
}
function C(a, c) {
  var d = a.split(/\r?\n/);
  a = {};
  for (var e = /\/\/ ERROR: (.*)/, f = 1, d = b.makeIterator(d), g = d.next();!g.done;g = d.next()) {
    var h = g.value.match(e);
    h && (g = new m.structs.Set, h = new m.structs.Set(h[1].split(",").map(function(a) {
      return a.trim();
    })), a[f] = {eslintRules:g, expectedRules:h, line:f, filePath:c});
    f++;
  }
  return a;
}
function D(a, c) {
  c.forEach(function(c) {
    m.object.setIfUndefined(a, c.filePath, {filePath:c.filePath, errorsByLineNumber:{}});
    var d = a[c.filePath];
    c.messages.forEach(function(a) {
      var e = a.line - 1;
      m.object.setIfUndefined(d.errorsByLineNumber, e.toString(), {eslintRules:new m.structs.Set, expectedRules:new m.structs.Set, line:e, filePath:c.filePath});
      d.errorsByLineNumber[e].eslintRules.add(a.ruleId);
    });
  });
  return a;
}
module.exports = {};
m.exportProperty(module.exports, "testConfig", function(a, c) {
  var d = new w.CLIEngine(c.eslintOptions);
  c = new z(c.mochaOptions);
  var e = c.suite, f = y.sync(a);
  a = {};
  for (var g = f.map(B), g = b.makeIterator(g), h = g.next();!h.done;h = g.next()) {
    h = h.value, a[h.filePath] = h;
  }
  d = d.executeOnFiles(f).results;
  d = D(a, d);
  v.compareEslintToExpected(d, e);
  c.run();
});

