var c = c || {};
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
c.DEBUG = !1;
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
    throw Error("Module " + a + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
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
    for (var h = 0;f = b[h];h++) {
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
  var b = (a = c.getPathFromDeps_(a)) && c.dependencies_.loadFlags[a] || {}, d = b.lang || "es3";
  return a && ("goog" == b.module || c.needsTranspile_(d)) ? c.basePath + a in c.dependencies_.deferred : !1;
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
  c.requiresTranspilation_ || (c.requiresTranspilation_ = c.createRequiresTranspilation_());
  if (a in c.requiresTranspilation_) {
    return c.requiresTranspilation_[a];
  }
  throw Error("Unknown language mode: " + a);
}, c.createRequiresTranspilation_ = function() {
  function a(a, b) {
    e ? d[a] = !0 : b() ? d[a] = !1 : e = d[a] = !0;
  }
  function b(a) {
    try {
      return !!eval(a);
    } catch (g) {
      return !1;
    }
  }
  var d = {es3:!1}, e = !1;
  a("es5", function() {
    return b("[1,].length==1");
  });
  a("es6", function() {
    return b('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()');
  });
  a("es6-impl", function() {
    return !0;
  });
  a("es7", function() {
    return b("2 ** 2 == 4");
  });
  a("es8", function() {
    return b("async () => 1, true");
  });
  return d;
}, c.requiresTranspilation_ = null, c.lastNonModuleScriptIndex_ = 0, c.onScriptLoad_ = function(a, b) {
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
  var h = c.moduleLoaderState_;
  c.moduleLoaderState_ = null;
  for (a = 0;a < d.length;a++) {
    if (g = d[a]) {
      var k = f.loadFlags[g] || {}, l = c.needsTranspile_(k.lang || "es3");
      "goog" == k.module || l ? c.importProcessedScript_(c.basePath + g, "goog" == k.module, l) : c.importScript_(c.basePath + g);
    } else {
      throw c.moduleLoaderState_ = h, Error("Undefined script input");
    }
  }
  c.moduleLoaderState_ = h;
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
    if (g) {
      eval(g + "\n//# sourceURL=" + f);
      if (c.global.$gwtExport && c.global.$gwtExport.$jscomp && !c.global.$gwtExport.$jscomp.transpile) {
        throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(c.global.$gwtExport));
      }
      c.global.$jscomp.transpile = c.global.$gwtExport.$jscomp.transpile;
      d = c.global.$jscomp;
      e = d.transpile;
    }
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
    for (var e = Array(arguments.length - 2), f = 2;f < arguments.length;f++) {
      e[f - 2] = arguments[f];
    }
    return b.prototype[d].apply(a, e);
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
var q = {UnderscoreForm:{CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"}};
function v(a, b) {
  return a.loc.end.line === b.loc.start.line;
}
var w = {categorizeUnderscoredIdentifier:function(a) {
  return "" === a || 0 === a.length ? q.UnderscoreForm.NO_UNDERSCORE : a.toUpperCase() === a ? q.UnderscoreForm.CONSTANT : -1 === a.indexOf("_") ? q.UnderscoreForm.NO_UNDERSCORE : "var_args" === a ? q.UnderscoreForm.VAR_ARGS : "opt_" === a.substring(0, 4) && "opt_" != a ? q.UnderscoreForm.OPT_PREFIX : "_" === a[0] ? q.UnderscoreForm.LEADING : "_" === a[a.length - 1] ? q.UnderscoreForm.TRAILING : q.UnderscoreForm.MIDDLE;
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
  return v(a, a);
}, isNodeSetterFunction:function(a) {
  return "FunctionExpression" === a.type && a.parent && "Property" === a.parent.type && "set" === a.parent.kind;
}, isValidPrefix:function(a, b) {
  return a.startsWith(b) ? a === b || "." === a[b.length] : !1;
}, isTruthy:function(a) {
  return !!a;
}, nodesEndOnSameLine:function(a, b) {
  return a.loc.end.line === b.loc.end.line;
}, nodesShareOneLine:v, nodesStartOnSameLine:function(a, b) {
  return a.loc.start.line === b.loc.start.line;
}};
var y = {allowVarArgs:!1, allowOptPrefix:!1, allowLeadingUnderscore:!0, allowTrailingUnderscore:!0, checkObjectProperties:!0};
function z(a, b) {
  function d(a) {
    return Object.assign(g, {message:a});
  }
  function e(e, g) {
    return A(e, a, b) ? f : d(g);
  }
  var f = {node:a, message:"", hasError:!1}, g = {node:a, message:"", hasError:!0};
  switch(w.categorizeUnderscoredIdentifier(a.name)) {
    case q.UnderscoreForm.CONSTANT:
      return f;
    case q.UnderscoreForm.LEADING:
      return b.allowLeadingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case after the leading underscore.") : d("Leading underscores are not allowed in '" + a.name + "'.");
    case q.UnderscoreForm.NO_UNDERSCORE:
      return f;
    case q.UnderscoreForm.MIDDLE:
      return e(a.name, "Identifier '" + a.name + "' is not in camel case.");
    case q.UnderscoreForm.OPT_PREFIX:
      return b.allowOptPrefix ? e(a.name.replace(/^opt_/g, ""), "Identifier '" + a.name + "' is not in camel case after the opt_ prefix.") : d("The opt_ prefix is not allowed in '" + a.name + "'.");
    case q.UnderscoreForm.TRAILING:
      return b.allowTrailingUnderscore ? e(a.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + a.name + "' is not in camel case before the trailing underscore.") : d("Trailing underscores are not allowed in '" + a.name + "'.");
    case q.UnderscoreForm.VAR_ARGS:
      return b.allowVarArgs ? f : d("The var_args identifier is not allowed.");
    default:
      throw Error("Unknown undercore form: " + a.name);
  }
}
function A(a, b, d) {
  var e = b.parent;
  if (!w.isUnderscored(a)) {
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
;c.debug = {};
c.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, c.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
  this.reportErrorToServer = !0;
};
c.inherits(c.debug.Error, Error);
c.debug.Error.prototype.name = "CustomError";
c.dom = {};
c.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
c.string = {};
c.string.DETECT_DOUBLE_ESCAPING = !1;
c.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
c.string.Unicode = {NBSP:"\u00a0"};
c.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
c.string.endsWith = function(a, b) {
  var d = a.length - b.length;
  return 0 <= d && a.indexOf(b, d) == d;
};
c.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == c.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
c.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == c.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
c.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
c.string.subs = function(a, b) {
  for (var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < d.length;) {
    e += d.shift() + f.shift();
  }
  return e + d.join("%s");
};
c.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
c.string.isEmptyOrWhitespace = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
c.string.isEmptyString = function(a) {
  return 0 == a.length;
};
c.string.isEmpty = c.string.isEmptyOrWhitespace;
c.string.isEmptyOrWhitespaceSafe = function(a) {
  return c.string.isEmptyOrWhitespace(c.string.makeSafe(a));
};
c.string.isEmptySafe = c.string.isEmptyOrWhitespaceSafe;
c.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a);
};
c.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a);
};
c.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a);
};
c.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
c.string.isSpace = function(a) {
  return " " == a;
};
c.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
c.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
c.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
c.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
c.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
c.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
c.string.trim = c.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
c.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
c.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
c.string.caseInsensitiveCompare = function(a, b) {
  a = String(a).toLowerCase();
  b = String(b).toLowerCase();
  return a < b ? -1 : a == b ? 0 : 1;
};
c.string.numberAwareCompare_ = function(a, b, d) {
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
c.string.intAwareCompare = function(a, b) {
  return c.string.numberAwareCompare_(a, b, /\d+|\D+/g);
};
c.string.floatAwareCompare = function(a, b) {
  return c.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g);
};
c.string.numerateCompare = c.string.floatAwareCompare;
c.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
c.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
c.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
};
c.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(c.string.AMP_RE_, "&amp;").replace(c.string.LT_RE_, "&lt;").replace(c.string.GT_RE_, "&gt;").replace(c.string.QUOT_RE_, "&quot;").replace(c.string.SINGLE_QUOTE_RE_, "&#39;").replace(c.string.NULL_RE_, "&#0;"), c.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(c.string.E_RE_, "&#101;"));
  } else {
    if (!c.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(c.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(c.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(c.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(c.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(c.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(c.string.NULL_RE_, "&#0;"));
    c.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(c.string.E_RE_, "&#101;"));
  }
  return a;
};
c.string.AMP_RE_ = /&/g;
c.string.LT_RE_ = /</g;
c.string.GT_RE_ = />/g;
c.string.QUOT_RE_ = /"/g;
c.string.SINGLE_QUOTE_RE_ = /'/g;
c.string.NULL_RE_ = /\x00/g;
c.string.E_RE_ = /e/g;
c.string.ALL_RE_ = c.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
c.string.unescapeEntities = function(a) {
  return c.string.contains(a, "&") ? !c.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in c.global ? c.string.unescapeEntitiesUsingDom_(a) : c.string.unescapePureXmlEntities_(a) : a;
};
c.string.unescapeEntitiesWithDocument = function(a, b) {
  return c.string.contains(a, "&") ? c.string.unescapeEntitiesUsingDom_(a, b) : a;
};
c.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var d = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = b ? b.createElement("div") : c.global.document.createElement("div");
  return a.replace(c.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var f = d[a];
    if (f) {
      return f;
    }
    "#" == b.charAt(0) && (b = Number("0" + b.substr(1)), isNaN(b) || (f = String.fromCharCode(b)));
    f || (e.innerHTML = a + " ", f = e.firstChild.nodeValue.slice(0, -1));
    return d[a] = f;
  });
};
c.string.unescapePureXmlEntities_ = function(a) {
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
c.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
c.string.whitespaceEscape = function(a, b) {
  return c.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
};
c.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + c.string.Unicode.NBSP);
};
c.string.stripQuotes = function(a, b) {
  for (var d = b.length, e = 0;e < d;e++) {
    var f = 1 == d ? b : b.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
c.string.truncate = function(a, b, d) {
  d && (a = c.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  d && (a = c.string.htmlEscape(a));
  return a;
};
c.string.truncateMiddle = function(a, b, d, e) {
  d && (a = c.string.unescapeEntities(a));
  if (e && a.length > b) {
    e > b && (e = b);
    var f = a.length - e;
    a = a.substring(0, b - e) + "..." + a.substring(f);
  } else {
    a.length > b && (e = Math.floor(b / 2), f = a.length - e, a = a.substring(0, e + b % 2) + "..." + a.substring(f));
  }
  d && (a = c.string.htmlEscape(a));
  return a;
};
c.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
c.string.jsEscapeCache_ = {"'":"\\'"};
c.string.quote = function(a) {
  a = String(a);
  for (var b = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    b[d + 1] = c.string.specialEscapeChars_[e] || (31 < f && 127 > f ? e : c.string.escapeChar(e));
  }
  b.push('"');
  return b.join("");
};
c.string.escapeString = function(a) {
  for (var b = [], d = 0;d < a.length;d++) {
    b[d] = c.string.escapeChar(a.charAt(d));
  }
  return b.join("");
};
c.string.escapeChar = function(a) {
  if (a in c.string.jsEscapeCache_) {
    return c.string.jsEscapeCache_[a];
  }
  if (a in c.string.specialEscapeChars_) {
    return c.string.jsEscapeCache_[a] = c.string.specialEscapeChars_[a];
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
  return c.string.jsEscapeCache_[a] = b;
};
c.string.contains = function(a, b) {
  return -1 != a.indexOf(b);
};
c.string.caseInsensitiveContains = function(a, b) {
  return c.string.contains(a.toLowerCase(), b.toLowerCase());
};
c.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
c.string.removeAt = function(a, b, d) {
  var e = a;
  0 <= b && b < a.length && 0 < d && (e = a.substr(0, b) + a.substr(b + d, a.length - b - d));
  return e;
};
c.string.remove = function(a, b) {
  return a.replace(b, "");
};
c.string.removeAll = function(a, b) {
  b = new RegExp(c.string.regExpEscape(b), "g");
  return a.replace(b, "");
};
c.string.replaceAll = function(a, b, d) {
  b = new RegExp(c.string.regExpEscape(b), "g");
  return a.replace(b, d.replace(/\$/g, "$$$$"));
};
c.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
c.string.repeat = String.prototype.repeat ? function(a, b) {
  return a.repeat(b);
} : function(a, b) {
  return Array(b + 1).join(a);
};
c.string.padNumber = function(a, b, d) {
  a = c.isDef(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return c.string.repeat("0", Math.max(0, b - d)) + a;
};
c.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
c.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
c.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ c.now()).toString(36);
};
c.string.compareVersions = function(a, b) {
  var d = 0;
  a = c.string.trim(String(a)).split(".");
  b = c.string.trim(String(b)).split(".");
  for (var e = Math.max(a.length, b.length), f = 0;0 == d && f < e;f++) {
    var g = a[f] || "", h = b[f] || "";
    do {
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
      if (0 == g[0].length && 0 == h[0].length) {
        break;
      }
      var d = 0 == g[1].length ? 0 : parseInt(g[1], 10), k = 0 == h[1].length ? 0 : parseInt(h[1], 10), d = c.string.compareElements_(d, k) || c.string.compareElements_(0 == g[2].length, 0 == h[2].length) || c.string.compareElements_(g[2], h[2]), g = g[3], h = h[3];
    } while (0 == d);
  }
  return d;
};
c.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
c.string.hashCode = function(a) {
  for (var b = 0, d = 0;d < a.length;++d) {
    b = 31 * b + a.charCodeAt(d) >>> 0;
  }
  return b;
};
c.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
c.string.createUniqueString = function() {
  return "goog_" + c.string.uniqueStringCounter_++;
};
c.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && c.string.isEmptyOrWhitespace(a) ? NaN : b;
};
c.string.isLowerCamelCase = function(a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
c.string.isUpperCamelCase = function(a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
c.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase();
  });
};
c.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
c.string.toTitleCase = function(a, b) {
  b = c.isString(b) ? c.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, f) {
    return b + f.toUpperCase();
  });
};
c.string.capitalize = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
c.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return c.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
c.string.splitLimit = function(a, b, d) {
  a = a.split(b);
  for (var e = [];0 < d && a.length;) {
    e.push(a.shift()), d--;
  }
  a.length && e.push(a.join(b));
  return e;
};
c.string.lastComponent = function(a, b) {
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
c.string.editDistance = function(a, b) {
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
c.asserts = {};
c.asserts.ENABLE_ASSERTS = c.DEBUG;
c.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  c.debug.Error.call(this, c.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
c.inherits(c.asserts.AssertionError, c.debug.Error);
c.asserts.AssertionError.prototype.name = "AssertionError";
c.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
c.asserts.errorHandler_ = c.asserts.DEFAULT_ERROR_HANDLER;
c.asserts.doAssertFailure_ = function(a, b, d, e) {
  var f = "Assertion failed";
  if (d) {
    var f = f + (": " + d), g = e;
  } else {
    a && (f += ": " + a, g = b);
  }
  a = new c.asserts.AssertionError("" + f, g || []);
  c.asserts.errorHandler_(a);
};
c.asserts.setErrorHandler = function(a) {
  c.asserts.ENABLE_ASSERTS && (c.asserts.errorHandler_ = a);
};
c.asserts.assert = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !a && c.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.fail = function(a, b) {
  c.asserts.ENABLE_ASSERTS && c.asserts.errorHandler_(new c.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
c.asserts.assertNumber = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !c.isNumber(a) && c.asserts.doAssertFailure_("Expected number but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertString = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !c.isString(a) && c.asserts.doAssertFailure_("Expected string but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertFunction = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !c.isFunction(a) && c.asserts.doAssertFailure_("Expected function but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertObject = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !c.isObject(a) && c.asserts.doAssertFailure_("Expected object but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertArray = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !c.isArray(a) && c.asserts.doAssertFailure_("Expected array but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertBoolean = function(a, b, d) {
  c.asserts.ENABLE_ASSERTS && !c.isBoolean(a) && c.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertElement = function(a, b, d) {
  !c.asserts.ENABLE_ASSERTS || c.isObject(a) && a.nodeType == c.dom.NodeType.ELEMENT || c.asserts.doAssertFailure_("Expected Element but got %s: %s.", [c.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
c.asserts.assertInstanceof = function(a, b, d, e) {
  !c.asserts.ENABLE_ASSERTS || a instanceof b || c.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [c.asserts.getType_(b), c.asserts.getType_(a)], d, Array.prototype.slice.call(arguments, 3));
  return a;
};
c.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    c.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
c.asserts.getType_ = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
c.functions = {};
c.functions.constant = function(a) {
  return function() {
    return a;
  };
};
c.functions.FALSE = c.functions.constant(!1);
c.functions.TRUE = c.functions.constant(!0);
c.functions.NULL = c.functions.constant(null);
c.functions.identity = function(a) {
  return a;
};
c.functions.error = function(a) {
  return function() {
    throw Error(a);
  };
};
c.functions.fail = function(a) {
  return function() {
    throw a;
  };
};
c.functions.lock = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b));
  };
};
c.functions.nth = function(a) {
  return function() {
    return arguments[a];
  };
};
c.functions.partialRight = function(a, b) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.push.apply(b, d);
    return a.apply(this, b);
  };
};
c.functions.withReturnValue = function(a, b) {
  return c.functions.sequence(a, c.functions.constant(b));
};
c.functions.equalTo = function(a, b) {
  return function(d) {
    return b ? a == d : a === d;
  };
};
c.functions.compose = function(a, b) {
  var d = arguments, e = d.length;
  return function() {
    var a;
    e && (a = d[e - 1].apply(this, arguments));
    for (var b = e - 2;0 <= b;b--) {
      a = d[b].call(this, a);
    }
    return a;
  };
};
c.functions.sequence = function(a) {
  var b = arguments, d = b.length;
  return function() {
    for (var a, f = 0;f < d;f++) {
      a = b[f].apply(this, arguments);
    }
    return a;
  };
};
c.functions.and = function(a) {
  var b = arguments, d = b.length;
  return function() {
    for (var a = 0;a < d;a++) {
      if (!b[a].apply(this, arguments)) {
        return !1;
      }
    }
    return !0;
  };
};
c.functions.or = function(a) {
  var b = arguments, d = b.length;
  return function() {
    for (var a = 0;a < d;a++) {
      if (b[a].apply(this, arguments)) {
        return !0;
      }
    }
    return !1;
  };
};
c.functions.not = function(a) {
  return function() {
    return !a.apply(this, arguments);
  };
};
c.functions.create = function(a, b) {
  function d() {
  }
  d.prototype = a.prototype;
  var e = new d;
  a.apply(e, Array.prototype.slice.call(arguments, 1));
  return e;
};
c.functions.CACHE_RETURN_VALUE = !0;
c.functions.cacheReturnValue = function(a) {
  var b = !1, d;
  return function() {
    if (!c.functions.CACHE_RETURN_VALUE) {
      return a();
    }
    b || (d = a(), b = !0);
    return d;
  };
};
c.functions.once = function(a) {
  var b = a;
  return function() {
    if (b) {
      var a = b;
      b = null;
      a();
    }
  };
};
c.functions.debounce = function(a, b, d) {
  d && (a = c.bind(a, d));
  var e = null;
  return function(d) {
    c.global.clearTimeout(e);
    var f = arguments;
    e = c.global.setTimeout(function() {
      a.apply(null, f);
    }, b);
  };
};
c.functions.throttle = function(a, b, d) {
  function e() {
    g = c.global.setTimeout(f, b);
    a.apply(null, k);
  }
  function f() {
    g = null;
    h && (h = !1, e());
  }
  d && (a = c.bind(a, d));
  var g = null, h = !1, k = [];
  return function(a) {
    k = arguments;
    g ? h = !0 : e();
  };
};
c.array = {};
c.NATIVE_ARRAY_PROTOTYPES = c.TRUSTED_SITE;
c.array.ASSUME_NATIVE_FUNCTIONS = !1;
c.array.peek = function(a) {
  return a[a.length - 1];
};
c.array.last = c.array.peek;
c.array.indexOf = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  return Array.prototype.indexOf.call(a, b, d);
} : function(a, b, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if (c.isString(a)) {
    return c.isString(b) && 1 == b.length ? a.indexOf(b, d) : -1;
  }
  for (;d < a.length;d++) {
    if (d in a && a[d] === b) {
      return d;
    }
  }
  return -1;
};
c.array.lastIndexOf = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  return Array.prototype.lastIndexOf.call(a, b, null == d ? a.length - 1 : d);
} : function(a, b, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if (c.isString(a)) {
    return c.isString(b) && 1 == b.length ? a.lastIndexOf(b, d) : -1;
  }
  for (;0 <= d;d--) {
    if (d in a && a[d] === b) {
      return d;
    }
  }
  return -1;
};
c.array.forEach = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  Array.prototype.forEach.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = c.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && b.call(d, f[g], g, a);
  }
};
c.array.forEachRight = function(a, b, d) {
  for (var e = a.length, f = c.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && b.call(d, f[e], e, a);
  }
};
c.array.filter = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  return Array.prototype.filter.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = [], g = 0, h = c.isString(a) ? a.split("") : a, k = 0;k < e;k++) {
    if (k in h) {
      var l = h[k];
      b.call(d, l, k, a) && (f[g++] = l);
    }
  }
  return f;
};
c.array.map = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  return Array.prototype.map.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = Array(e), g = c.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in g && (f[h] = b.call(d, g[h], h, a));
  }
  return f;
};
c.array.reduce = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(a, b, d, e) {
  c.asserts.assert(null != a.length);
  e && (b = c.bind(b, e));
  return Array.prototype.reduce.call(a, b, d);
} : function(a, b, d, e) {
  var f = d;
  c.array.forEach(a, function(d, h) {
    f = b.call(e, f, d, h, a);
  });
  return f;
};
c.array.reduceRight = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(a, b, d, e) {
  c.asserts.assert(null != a.length);
  c.asserts.assert(null != b);
  e && (b = c.bind(b, e));
  return Array.prototype.reduceRight.call(a, b, d);
} : function(a, b, d, e) {
  var f = d;
  c.array.forEachRight(a, function(d, h) {
    f = b.call(e, f, d, h, a);
  });
  return f;
};
c.array.some = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  return Array.prototype.some.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = c.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(d, f[g], g, a)) {
      return !0;
    }
  }
  return !1;
};
c.array.every = c.NATIVE_ARRAY_PROTOTYPES && (c.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(a, b, d) {
  c.asserts.assert(null != a.length);
  return Array.prototype.every.call(a, b, d);
} : function(a, b, d) {
  for (var e = a.length, f = c.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && !b.call(d, f[g], g, a)) {
      return !1;
    }
  }
  return !0;
};
c.array.count = function(a, b, d) {
  var e = 0;
  c.array.forEach(a, function(a, g, h) {
    b.call(d, a, g, h) && ++e;
  }, d);
  return e;
};
c.array.find = function(a, b, d) {
  b = c.array.findIndex(a, b, d);
  return 0 > b ? null : c.isString(a) ? a.charAt(b) : a[b];
};
c.array.findIndex = function(a, b, d) {
  for (var e = a.length, f = c.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && b.call(d, f[g], g, a)) {
      return g;
    }
  }
  return -1;
};
c.array.findRight = function(a, b, d) {
  b = c.array.findIndexRight(a, b, d);
  return 0 > b ? null : c.isString(a) ? a.charAt(b) : a[b];
};
c.array.findIndexRight = function(a, b, d) {
  for (var e = a.length, f = c.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if (e in f && b.call(d, f[e], e, a)) {
      return e;
    }
  }
  return -1;
};
c.array.contains = function(a, b) {
  return 0 <= c.array.indexOf(a, b);
};
c.array.isEmpty = function(a) {
  return 0 == a.length;
};
c.array.clear = function(a) {
  if (!c.isArray(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
c.array.insert = function(a, b) {
  c.array.contains(a, b) || a.push(b);
};
c.array.insertAt = function(a, b, d) {
  c.array.splice(a, d, 0, b);
};
c.array.insertArrayAt = function(a, b, d) {
  c.partial(c.array.splice, a, d, 0).apply(null, b);
};
c.array.insertBefore = function(a, b, d) {
  var e;
  2 == arguments.length || 0 > (e = c.array.indexOf(a, d)) ? a.push(b) : c.array.insertAt(a, b, e);
};
c.array.remove = function(a, b) {
  b = c.array.indexOf(a, b);
  var d;
  (d = 0 <= b) && c.array.removeAt(a, b);
  return d;
};
c.array.removeLast = function(a, b) {
  b = c.array.lastIndexOf(a, b);
  return 0 <= b ? (c.array.removeAt(a, b), !0) : !1;
};
c.array.removeAt = function(a, b) {
  c.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, b, 1).length;
};
c.array.removeIf = function(a, b, d) {
  b = c.array.findIndex(a, b, d);
  return 0 <= b ? (c.array.removeAt(a, b), !0) : !1;
};
c.array.removeAllIf = function(a, b, d) {
  var e = 0;
  c.array.forEachRight(a, function(f, g) {
    b.call(d, f, g, a) && c.array.removeAt(a, g) && e++;
  });
  return e;
};
c.array.concat = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
c.array.join = function(a) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
c.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var d = Array(b), e = 0;e < b;e++) {
      d[e] = a[e];
    }
    return d;
  }
  return [];
};
c.array.clone = c.array.toArray;
c.array.extend = function(a, b) {
  for (var d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    if (c.isArrayLike(e)) {
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
c.array.splice = function(a, b, d, e) {
  c.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, c.array.slice(arguments, 1));
};
c.array.slice = function(a, b, d) {
  c.asserts.assert(null != a.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, d);
};
c.array.removeDuplicates = function(a, b, d) {
  function e(a) {
    return c.isObject(a) ? "o" + c.getUid(a) : (typeof a).charAt(0) + a;
  }
  b = b || a;
  d = d || e;
  for (var f = {}, g = 0, h = 0;h < a.length;) {
    var k = a[h++], l = d(k);
    Object.prototype.hasOwnProperty.call(f, l) || (f[l] = !0, b[g++] = k);
  }
  b.length = g;
};
c.array.binarySearch = function(a, b, d) {
  return c.array.binarySearch_(a, d || c.array.defaultCompare, !1, b);
};
c.array.binarySelect = function(a, b, d) {
  return c.array.binarySearch_(a, b, !0, void 0, d);
};
c.array.binarySearch_ = function(a, b, d, e, f) {
  for (var g = 0, h = a.length, k;g < h;) {
    var l = g + h >> 1, u;
    u = d ? b.call(f, a[l], l, a) : b(e, a[l]);
    0 < u ? g = l + 1 : (h = l, k = !u);
  }
  return k ? g : ~g;
};
c.array.sort = function(a, b) {
  a.sort(b || c.array.defaultCompare);
};
c.array.stableSort = function(a, b) {
  for (var d = Array(a.length), e = 0;e < a.length;e++) {
    d[e] = {index:e, value:a[e]};
  }
  var f = b || c.array.defaultCompare;
  c.array.sort(d, function(a, b) {
    return f(a.value, b.value) || a.index - b.index;
  });
  for (e = 0;e < a.length;e++) {
    a[e] = d[e].value;
  }
};
c.array.sortByKey = function(a, b, d) {
  var e = d || c.array.defaultCompare;
  c.array.sort(a, function(a, d) {
    return e(b(a), b(d));
  });
};
c.array.sortObjectsByKey = function(a, b, d) {
  c.array.sortByKey(a, function(a) {
    return a[b];
  }, d);
};
c.array.isSorted = function(a, b, d) {
  b = b || c.array.defaultCompare;
  for (var e = 1;e < a.length;e++) {
    var f = b(a[e - 1], a[e]);
    if (0 < f || 0 == f && d) {
      return !1;
    }
  }
  return !0;
};
c.array.equals = function(a, b, d) {
  if (!c.isArrayLike(a) || !c.isArrayLike(b) || a.length != b.length) {
    return !1;
  }
  var e = a.length;
  d = d || c.array.defaultCompareEquality;
  for (var f = 0;f < e;f++) {
    if (!d(a[f], b[f])) {
      return !1;
    }
  }
  return !0;
};
c.array.compare3 = function(a, b, d) {
  d = d || c.array.defaultCompare;
  for (var e = Math.min(a.length, b.length), f = 0;f < e;f++) {
    var g = d(a[f], b[f]);
    if (0 != g) {
      return g;
    }
  }
  return c.array.defaultCompare(a.length, b.length);
};
c.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
c.array.inverseDefaultCompare = function(a, b) {
  return -c.array.defaultCompare(a, b);
};
c.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
c.array.binaryInsert = function(a, b, d) {
  d = c.array.binarySearch(a, b, d);
  return 0 > d ? (c.array.insertAt(a, b, -(d + 1)), !0) : !1;
};
c.array.binaryRemove = function(a, b, d) {
  b = c.array.binarySearch(a, b, d);
  return 0 <= b ? c.array.removeAt(a, b) : !1;
};
c.array.bucket = function(a, b, d) {
  for (var e = {}, f = 0;f < a.length;f++) {
    var g = a[f], h = b.call(d, g, f, a);
    c.isDef(h) && (e[h] || (e[h] = [])).push(g);
  }
  return e;
};
c.array.toObject = function(a, b, d) {
  var e = {};
  c.array.forEach(a, function(f, g) {
    e[b.call(d, f, g, a)] = f;
  });
  return e;
};
c.array.range = function(a, b, d) {
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
c.array.repeat = function(a, b) {
  for (var d = [], e = 0;e < b;e++) {
    d[e] = a;
  }
  return d;
};
c.array.flatten = function(a) {
  for (var b = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    if (c.isArray(e)) {
      for (var f = 0;f < e.length;f += 8192) {
        for (var g = c.array.slice(e, f, f + 8192), g = c.array.flatten.apply(null, g), h = 0;h < g.length;h++) {
          b.push(g[h]);
        }
      }
    } else {
      b.push(e);
    }
  }
  return b;
};
c.array.rotate = function(a, b) {
  c.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));
  return a;
};
c.array.moveItem = function(a, b, d) {
  c.asserts.assert(0 <= b && b < a.length);
  c.asserts.assert(0 <= d && d < a.length);
  b = Array.prototype.splice.call(a, b, 1);
  Array.prototype.splice.call(a, d, 0, b[0]);
};
c.array.zip = function(a) {
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
c.array.shuffle = function(a, b) {
  b = b || Math.random;
  for (var d = a.length - 1;0 < d;d--) {
    var e = Math.floor(b() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
c.array.copyByIndex = function(a, b) {
  var d = [];
  c.array.forEach(b, function(b) {
    d.push(a[b]);
  });
  return d;
};
c.array.concatMap = function(a, b, d) {
  return c.array.concat.apply([], c.array.map(a, b, d));
};
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
c.math = {};
c.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
c.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
c.math.clamp = function(a, b, d) {
  return Math.min(Math.max(a, b), d);
};
c.math.modulo = function(a, b) {
  a %= b;
  return 0 > a * b ? a + b : a;
};
c.math.lerp = function(a, b, d) {
  return a + d * (b - a);
};
c.math.nearlyEquals = function(a, b, d) {
  return Math.abs(a - b) <= (d || 1E-6);
};
c.math.standardAngle = function(a) {
  return c.math.modulo(a, 360);
};
c.math.standardAngleInRadians = function(a) {
  return c.math.modulo(a, 2 * Math.PI);
};
c.math.toRadians = function(a) {
  return a * Math.PI / 180;
};
c.math.toDegrees = function(a) {
  return 180 * a / Math.PI;
};
c.math.angleDx = function(a, b) {
  return b * Math.cos(c.math.toRadians(a));
};
c.math.angleDy = function(a, b) {
  return b * Math.sin(c.math.toRadians(a));
};
c.math.angle = function(a, b, d, e) {
  return c.math.standardAngle(c.math.toDegrees(Math.atan2(e - b, d - a)));
};
c.math.angleDifference = function(a, b) {
  a = c.math.standardAngle(b) - c.math.standardAngle(a);
  180 < a ? a -= 360 : -180 >= a && (a = 360 + a);
  return a;
};
c.math.sign = function(a) {
  return 0 < a ? 1 : 0 > a ? -1 : a;
};
c.math.longestCommonSubsequence = function(a, b, d, e) {
  d = d || function(a, b) {
    return a == b;
  };
  e = e || function(b) {
    return a[b];
  };
  for (var f = a.length, g = b.length, h = [], k = 0;k < f + 1;k++) {
    h[k] = [], h[k][0] = 0;
  }
  for (var l = 0;l < g + 1;l++) {
    h[0][l] = 0;
  }
  for (k = 1;k <= f;k++) {
    for (l = 1;l <= g;l++) {
      d(a[k - 1], b[l - 1]) ? h[k][l] = h[k - 1][l - 1] + 1 : h[k][l] = Math.max(h[k - 1][l], h[k][l - 1]);
    }
  }
  for (var u = [], k = f, l = g;0 < k && 0 < l;) {
    d(a[k - 1], b[l - 1]) ? (u.unshift(e(k - 1, l - 1)), k--, l--) : h[k - 1][l] > h[k][l - 1] ? k-- : l--;
  }
  return u;
};
c.math.sum = function(a) {
  return c.array.reduce(arguments, function(a, d) {
    return a + d;
  }, 0);
};
c.math.average = function(a) {
  return c.math.sum.apply(null, arguments) / arguments.length;
};
c.math.sampleVariance = function(a) {
  var b = arguments.length;
  if (2 > b) {
    return 0;
  }
  var d = c.math.average.apply(null, arguments);
  return c.math.sum.apply(null, c.array.map(arguments, function(a) {
    return Math.pow(a - d, 2);
  })) / (b - 1);
};
c.math.standardDeviation = function(a) {
  return Math.sqrt(c.math.sampleVariance.apply(null, arguments));
};
c.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1;
};
c.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a);
};
c.math.isNegativeZero = function(a) {
  return 0 == a && 0 > 1 / a;
};
c.math.log10Floor = function(a) {
  if (0 < a) {
    var b = Math.round(Math.log(a) * Math.LOG10E);
    return b - (parseFloat("1e" + b) > a ? 1 : 0);
  }
  return 0 == a ? -Infinity : NaN;
};
c.math.safeFloor = function(a, b) {
  c.asserts.assert(!c.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2E-15));
};
c.math.safeCeil = function(a, b) {
  c.asserts.assert(!c.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2E-15));
};
c.iter = {};
c.iter.StopIteration = "StopIteration" in c.global ? c.global.StopIteration : {message:"StopIteration", stack:""};
c.iter.Iterator = function() {
};
c.iter.Iterator.prototype.next = function() {
  throw c.iter.StopIteration;
};
c.iter.Iterator.prototype.__iterator__ = function() {
  return this;
};
c.iter.toIterator = function(a) {
  if (a instanceof c.iter.Iterator) {
    return a;
  }
  if ("function" == typeof a.__iterator__) {
    return a.__iterator__(!1);
  }
  if (c.isArrayLike(a)) {
    var b = 0, d = new c.iter.Iterator;
    d.next = function() {
      for (;;) {
        if (b >= a.length) {
          throw c.iter.StopIteration;
        }
        if (b in a) {
          return a[b++];
        }
        b++;
      }
    };
    return d;
  }
  throw Error("Not implemented");
};
c.iter.forEach = function(a, b, d) {
  if (c.isArrayLike(a)) {
    try {
      c.array.forEach(a, b, d);
    } catch (e) {
      if (e !== c.iter.StopIteration) {
        throw e;
      }
    }
  } else {
    a = c.iter.toIterator(a);
    try {
      for (;;) {
        b.call(d, a.next(), void 0, a);
      }
    } catch (e) {
      if (e !== c.iter.StopIteration) {
        throw e;
      }
    }
  }
};
c.iter.filter = function(a, b, d) {
  var e = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  a.next = function() {
    for (;;) {
      var a = e.next();
      if (b.call(d, a, void 0, e)) {
        return a;
      }
    }
  };
  return a;
};
c.iter.filterFalse = function(a, b, d) {
  return c.iter.filter(a, c.functions.not(b), d);
};
c.iter.range = function(a, b, d) {
  var e = 0, f = a, g = d || 1;
  1 < arguments.length && (e = a, f = b);
  if (0 == g) {
    throw Error("Range step argument must not be zero");
  }
  var h = new c.iter.Iterator;
  h.next = function() {
    if (0 < g && e >= f || 0 > g && e <= f) {
      throw c.iter.StopIteration;
    }
    var a = e;
    e += g;
    return a;
  };
  return h;
};
c.iter.join = function(a, b) {
  return c.iter.toArray(a).join(b);
};
c.iter.map = function(a, b, d) {
  var e = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  a.next = function() {
    var a = e.next();
    return b.call(d, a, void 0, e);
  };
  return a;
};
c.iter.reduce = function(a, b, d, e) {
  var f = d;
  c.iter.forEach(a, function(a) {
    f = b.call(e, f, a);
  });
  return f;
};
c.iter.some = function(a, b, d) {
  a = c.iter.toIterator(a);
  try {
    for (;;) {
      if (b.call(d, a.next(), void 0, a)) {
        return !0;
      }
    }
  } catch (e) {
    if (e !== c.iter.StopIteration) {
      throw e;
    }
  }
  return !1;
};
c.iter.every = function(a, b, d) {
  a = c.iter.toIterator(a);
  try {
    for (;;) {
      if (!b.call(d, a.next(), void 0, a)) {
        return !1;
      }
    }
  } catch (e) {
    if (e !== c.iter.StopIteration) {
      throw e;
    }
  }
  return !0;
};
c.iter.chain = function(a) {
  return c.iter.chainFromIterable(arguments);
};
c.iter.chainFromIterable = function(a) {
  var b = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  var d = null;
  a.next = function() {
    for (;;) {
      if (null == d) {
        var a = b.next();
        d = c.iter.toIterator(a);
      }
      try {
        return d.next();
      } catch (f) {
        if (f !== c.iter.StopIteration) {
          throw f;
        }
        d = null;
      }
    }
  };
  return a;
};
c.iter.dropWhile = function(a, b, d) {
  var e = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  var f = !0;
  a.next = function() {
    for (;;) {
      var a = e.next();
      if (!f || !b.call(d, a, void 0, e)) {
        return f = !1, a;
      }
    }
  };
  return a;
};
c.iter.takeWhile = function(a, b, d) {
  var e = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  a.next = function() {
    var a = e.next();
    if (b.call(d, a, void 0, e)) {
      return a;
    }
    throw c.iter.StopIteration;
  };
  return a;
};
c.iter.toArray = function(a) {
  if (c.isArrayLike(a)) {
    return c.array.toArray(a);
  }
  a = c.iter.toIterator(a);
  var b = [];
  c.iter.forEach(a, function(a) {
    b.push(a);
  });
  return b;
};
c.iter.equals = function(a, b, d) {
  a = c.iter.zipLongest({}, a, b);
  var e = d || c.array.defaultCompareEquality;
  return c.iter.every(a, function(a) {
    return e(a[0], a[1]);
  });
};
c.iter.nextOrValue = function(a, b) {
  try {
    return c.iter.toIterator(a).next();
  } catch (d) {
    if (d != c.iter.StopIteration) {
      throw d;
    }
    return b;
  }
};
c.iter.product = function(a) {
  if (c.array.some(arguments, function(a) {
    return !a.length;
  }) || !arguments.length) {
    return new c.iter.Iterator;
  }
  var b = new c.iter.Iterator, d = arguments, e = c.array.repeat(0, d.length);
  b.next = function() {
    if (e) {
      for (var a = c.array.map(e, function(a, b) {
        return d[b][a];
      }), b = e.length - 1;0 <= b;b--) {
        c.asserts.assert(e);
        if (e[b] < d[b].length - 1) {
          e[b]++;
          break;
        }
        if (0 == b) {
          e = null;
          break;
        }
        e[b] = 0;
      }
      return a;
    }
    throw c.iter.StopIteration;
  };
  return b;
};
c.iter.cycle = function(a) {
  var b = c.iter.toIterator(a), d = [], e = 0;
  a = new c.iter.Iterator;
  var f = !1;
  a.next = function() {
    var a = null;
    if (!f) {
      try {
        return a = b.next(), d.push(a), a;
      } catch (h) {
        if (h != c.iter.StopIteration || c.array.isEmpty(d)) {
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
c.iter.count = function(a, b) {
  var d = a || 0, e = c.isDef(b) ? b : 1;
  a = new c.iter.Iterator;
  a.next = function() {
    var a = d;
    d += e;
    return a;
  };
  return a;
};
c.iter.repeat = function(a) {
  var b = new c.iter.Iterator;
  b.next = c.functions.constant(a);
  return b;
};
c.iter.accumulate = function(a) {
  var b = c.iter.toIterator(a), d = 0;
  a = new c.iter.Iterator;
  a.next = function() {
    return d += b.next();
  };
  return a;
};
c.iter.zip = function(a) {
  var b = arguments, d = new c.iter.Iterator;
  if (0 < b.length) {
    var e = c.array.map(b, c.iter.toIterator);
    d.next = function() {
      return c.array.map(e, function(a) {
        return a.next();
      });
    };
  }
  return d;
};
c.iter.zipLongest = function(a, b) {
  var d = c.array.slice(arguments, 1), e = new c.iter.Iterator;
  if (0 < d.length) {
    var f = c.array.map(d, c.iter.toIterator);
    e.next = function() {
      var b = !1, d = c.array.map(f, function(d) {
        var e;
        try {
          e = d.next(), b = !0;
        } catch (u) {
          if (u !== c.iter.StopIteration) {
            throw u;
          }
          e = a;
        }
        return e;
      });
      if (!b) {
        throw c.iter.StopIteration;
      }
      return d;
    };
  }
  return e;
};
c.iter.compress = function(a, b) {
  var d = c.iter.toIterator(b);
  return c.iter.filter(a, function() {
    return !!d.next();
  });
};
c.iter.GroupByIterator_ = function(a, b) {
  this.iterator = c.iter.toIterator(a);
  this.keyFunc = b || c.functions.identity;
};
c.inherits(c.iter.GroupByIterator_, c.iter.Iterator);
c.iter.GroupByIterator_.prototype.next = function() {
  for (;this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
c.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
  for (var b = [];this.currentKey == a;) {
    b.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (d) {
      if (d !== c.iter.StopIteration) {
        throw d;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return b;
};
c.iter.groupBy = function(a, b) {
  return new c.iter.GroupByIterator_(a, b);
};
c.iter.starMap = function(a, b, d) {
  var e = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  a.next = function() {
    var a = c.iter.toArray(e.next());
    return b.apply(d, c.array.concat(a, void 0, e));
  };
  return a;
};
c.iter.tee = function(a, b) {
  function d() {
    var a = e.next();
    c.array.forEach(f, function(b) {
      b.push(a);
    });
  }
  var e = c.iter.toIterator(a);
  a = c.isNumber(b) ? b : 2;
  var f = c.array.map(c.array.range(a), function() {
    return [];
  });
  return c.array.map(f, function(a) {
    var b = new c.iter.Iterator;
    b.next = function() {
      c.array.isEmpty(a) && d();
      c.asserts.assert(!c.array.isEmpty(a));
      return a.shift();
    };
    return b;
  });
};
c.iter.enumerate = function(a, b) {
  return c.iter.zip(c.iter.count(b), a);
};
c.iter.limit = function(a, b) {
  c.asserts.assert(c.math.isInt(b) && 0 <= b);
  var d = c.iter.toIterator(a);
  a = new c.iter.Iterator;
  var e = b;
  a.next = function() {
    if (0 < e--) {
      return d.next();
    }
    throw c.iter.StopIteration;
  };
  return a;
};
c.iter.consume = function(a, b) {
  c.asserts.assert(c.math.isInt(b) && 0 <= b);
  for (a = c.iter.toIterator(a);0 < b--;) {
    c.iter.nextOrValue(a, null);
  }
  return a;
};
c.iter.slice = function(a, b, d) {
  c.asserts.assert(c.math.isInt(b) && 0 <= b);
  a = c.iter.consume(a, b);
  c.isNumber(d) && (c.asserts.assert(c.math.isInt(d) && d >= b), a = c.iter.limit(a, d - b));
  return a;
};
c.iter.hasDuplicates_ = function(a) {
  var b = [];
  c.array.removeDuplicates(a, b);
  return a.length != b.length;
};
c.iter.permutations = function(a, b) {
  a = c.iter.toArray(a);
  b = c.isNumber(b) ? b : a.length;
  b = c.array.repeat(a, b);
  b = c.iter.product.apply(void 0, b);
  return c.iter.filter(b, function(a) {
    return !c.iter.hasDuplicates_(a);
  });
};
c.iter.combinations = function(a, b) {
  function d(a) {
    return e[a];
  }
  var e = c.iter.toArray(a);
  a = c.iter.range(e.length);
  b = c.iter.permutations(a, b);
  var f = c.iter.filter(b, function(a) {
    return c.array.isSorted(a);
  });
  b = new c.iter.Iterator;
  b.next = function() {
    return c.array.map(f.next(), d);
  };
  return b;
};
c.iter.combinationsWithReplacement = function(a, b) {
  function d(a) {
    return e[a];
  }
  var e = c.iter.toArray(a);
  a = c.array.range(e.length);
  b = c.array.repeat(a, b);
  b = c.iter.product.apply(void 0, b);
  var f = c.iter.filter(b, function(a) {
    return c.array.isSorted(a);
  });
  b = new c.iter.Iterator;
  b.next = function() {
    return c.array.map(f.next(), d);
  };
  return b;
};
c.structs = {};
c.structs.Map = function(a, b) {
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
c.structs.Map.prototype.getCount = function() {
  return this.count_;
};
c.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var a = [], b = 0;b < this.keys_.length;b++) {
    a.push(this.map_[this.keys_[b]]);
  }
  return a;
};
c.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
c.structs.Map.prototype.containsKey = function(a) {
  return c.structs.Map.hasKey_(this.map_, a);
};
c.structs.Map.prototype.containsValue = function(a) {
  for (var b = 0;b < this.keys_.length;b++) {
    var d = this.keys_[b];
    if (c.structs.Map.hasKey_(this.map_, d) && this.map_[d] == a) {
      return !0;
    }
  }
  return !1;
};
c.structs.Map.prototype.equals = function(a, b) {
  if (this === a) {
    return !0;
  }
  if (this.count_ != a.getCount()) {
    return !1;
  }
  b = b || c.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var d, e = 0;d = this.keys_[e];e++) {
    if (!b(this.get(d), a.get(d))) {
      return !1;
    }
  }
  return !0;
};
c.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
c.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
c.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
c.structs.Map.prototype.remove = function(a) {
  return c.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
c.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var a = 0, b = 0;a < this.keys_.length;) {
      var d = this.keys_[a];
      c.structs.Map.hasKey_(this.map_, d) && (this.keys_[b++] = d);
      a++;
    }
    this.keys_.length = b;
  }
  if (this.count_ != this.keys_.length) {
    for (var e = {}, b = a = 0;a < this.keys_.length;) {
      d = this.keys_[a], c.structs.Map.hasKey_(e, d) || (this.keys_[b++] = d, e[d] = 1), a++;
    }
    this.keys_.length = b;
  }
};
c.structs.Map.prototype.get = function(a, b) {
  return c.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b;
};
c.structs.Map.prototype.set = function(a, b) {
  c.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = b;
};
c.structs.Map.prototype.addAll = function(a) {
  var b;
  a instanceof c.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = c.object.getKeys(a), a = c.object.getValues(a));
  for (var d = 0;d < b.length;d++) {
    this.set(b[d], a[d]);
  }
};
c.structs.Map.prototype.forEach = function(a, b) {
  for (var d = this.getKeys(), e = 0;e < d.length;e++) {
    var f = d[e], g = this.get(f);
    a.call(b, g, f, this);
  }
};
c.structs.Map.prototype.clone = function() {
  return new c.structs.Map(this);
};
c.structs.Map.prototype.transpose = function() {
  for (var a = new c.structs.Map, b = 0;b < this.keys_.length;b++) {
    var d = this.keys_[b];
    a.set(this.map_[d], d);
  }
  return a;
};
c.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var a = {}, b = 0;b < this.keys_.length;b++) {
    var d = this.keys_[b];
    a[d] = this.map_[d];
  }
  return a;
};
c.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0);
};
c.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1);
};
c.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, d = this.version_, e = this, f = new c.iter.Iterator;
  f.next = function() {
    if (d != e.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (b >= e.keys_.length) {
      throw c.iter.StopIteration;
    }
    var f = e.keys_[b++];
    return a ? f : e.map_[f];
  };
  return f;
};
c.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
var B = require("lodash.ismatchwith");
function D(a) {
  return function(b) {
    return F(b, a);
  };
}
function F(a, b) {
  var d = {};
  return B(a, b, function(a, b) {
    if ("function" === typeof b) {
      return a = b(a), c.isObject(a) && c.object.extend(d, a), !!a;
    }
  }) ? d : !1;
}
var H = {extractAST:function(a, b) {
  return function(d) {
    var e = {};
    e[a] = d;
    "object" === typeof b && (b = D(b));
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
}, isASTMatch:F, matchesAST:D, matchesASTLength:function(a) {
  var b = D(a);
  return function(d) {
    return c.isArray(d) && c.isArray(a) && d.length === a.length ? b(d) : !1;
  };
}};
function J(a, b) {
  for (a = a.parent;!b(a) && "Program" !== a.type;) {
    a = a.parent;
  }
  return b(a) ? a : null;
}
function N(a, b) {
  var d = b || "literal";
  return H.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a && H.extractAST(d)(a);
  }});
}
var O = {GoogDependencyMatch:void 0, findAncestor:J, findAncestorOfType:function(a, b) {
  return J(a, function(a) {
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
  return H.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"require"}}, arguments:[function(a) {
    return N(a, "source");
  }]}});
}, matchExtractGoogProvide:function(a) {
  return H.isASTMatch(a, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"provide"}}, arguments:[function(a) {
    return N(a, "source");
  }]}});
}, matchExtractDirective:function(a) {
  return H.isASTMatch(a, {type:"ExpressionStatement", expression:function(a) {
    return N(a, "directive");
  }});
}, matchExtractStringLiteral:N, matchStringLiteral:function(a) {
  return H.isASTMatch(a, {type:"Literal", value:function(a) {
    return "string" === typeof a;
  }});
}};
function aa(a) {
  return " " == a || "\t" == a;
}
function ba(a) {
  return "\t" == a;
}
function P(a, b, d, e) {
  a = e ? b.getLastToken(a) : b.getFirstToken(a);
  b = Array.from(b.getText(a, a.loc.start.column));
  a = b.slice(0, b.findIndex(c.functions.not(aa)));
  b = a.filter(c.string.isSpace).length;
  a = a.filter(ba).length;
  return {space:b, tab:a, goodChar:"space" === d ? b : a, badChar:"space" === d ? a : b};
}
function Q(a, b, d) {
  b = !0 === d ? b.getLastToken(a, 1) : b.getTokenBefore(a);
  return (!0 === d ? a.loc.end.line : a.loc.start.line) !== (b ? b.loc.end.line : -1);
}
function R(a, b) {
  return !!b && b.parent.loc.start.line === a.loc.start.line && 1 < b.parent.declarations.length;
}
function ca(a) {
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
function da(a) {
  return a.declarations.reduce(function(b, d) {
    var e = b[b.length - 1];
    (d.loc.start.line !== a.loc.start.line && !e || e && e.loc.start.line !== d.loc.start.line) && b.push(d);
    return b;
  }, []);
}
function ea(a) {
  var b = {indentSize:4, indentType:"space", indentOptions:{SwitchCase:0, VariableDeclarator:{var:1, let:1, const:1}, outerIIFEBody:-1, MemberExpression:-1, FunctionDeclaration:{parameters:-1, body:1}, FunctionExpression:{parameters:-1, body:1}}}, d = b.indentOptions;
  if (0 < a.length && ("tab" == a[0] ? (b.indentSize = 1, b.indentType = "tab") : "number" === typeof a[0] && (b.indentSize = a[0], b.indentType = "space"), a[1])) {
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
;var fa = require("doctrine");
function S(a) {
  return "NullableLiteral" === a.type || "AllLiteral" === a.type || "NullLiteral" === a.type || "UndefinedLiteral" === a.type || "VoidLiteral" === a.type || "StringLiteralType" === a.type || "NumericLiteralType" === a.type;
}
function ga(a) {
  return S(a) || "NameExpression" === a.type;
}
function T(a, b) {
  b(a);
  if (!ga(a)) {
    switch(a.type) {
      case "ArrayType":
        a.elements.forEach(function(a) {
          return T(a, b);
        });
        break;
      case "RecordType":
        a.fields.forEach(function(a) {
          return T(a, b);
        });
        break;
      case "FunctionType":
        a.this && T(a.this, b);
        a.params.forEach(function(a) {
          return T(a, b);
        });
        a.result && T(a.result, b);
        break;
      case "FieldType":
        a.value && T(a.value, b);
        break;
      case "ParameterType":
      case "RestType":
      case "NonNullableType":
      case "OptionalType":
      case "NullableType":
        T(a.expression, b);
        break;
      case "TypeApplication":
        T(a.expression, b);
        a.applications.forEach(function(a) {
          return T(a, b);
        });
        break;
      case "UnionType":
        a.elements.forEach(function(a) {
          return T(a, b);
        });
        break;
      default:
        throw Error("Unrecoginized tag type: " + a + ".");
    }
  }
}
function U(a) {
  return "Block" === a.type && "*" === a.value.charAt(0);
}
function ha(a) {
  var b = ["FunctionExpression", "ArrowFunctionExpression", "ClassExpression"];
  return H.isASTMatch(a, {type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", init:function(a) {
    return !!a && -1 !== b.indexOf(a.type);
  }}]});
}
var W = {getJSDocComment:function(a) {
  return !a.leadingComments || 0 == a.leadingComments.length || ha(a) ? null : a.leadingComments.filter(U).reverse().pop() || null;
}, hasTypeInformation:function(a) {
  var b = "type typedef record const private package protected public export".split(" ");
  return a.tags.some(function(a) {
    return c.array.contains(b, a.title);
  });
}, isLiteral:S, isVoid:function(a) {
  var b = "NameExpression" == a.type && "void" == a.name;
  return "VoidLiteral" == a.type || b;
}, isJSDocComment:U, parseComment:function(a) {
  try {
    return fa.parse(a, {strict:!0, unwrap:!0, sloppy:!0});
  } catch (b) {
    if (b instanceof Error && /braces/i.test(b.message)) {
      throw Error("JSDoc type missing brace.");
    }
    throw Error("JSDoc syntax error.");
  }
}, traverseTags:T};
var ia = require("doctrine");
function X(a) {
  return !c.isDefAndNotNull(a.type) || W.isVoid(a.type) || "UndefinedLiteral" === a.type.type;
}
var ja = "string number boolean Object Array Map Set".split(" ");
function Y(a, b) {
  b.type && W.traverseTags(b.type, function(b) {
    "NameExpression" === b.type && (b = b.name, -1 === ja.indexOf(b) && a.markVariableAsUsed(b));
  });
}
;function ka(a) {
  return !!O.matchExtractDirective(a);
}
function la(a, b) {
  for (var d = 0;d < b.length;++d) {
    if (!a(b[d])) {
      return b.slice(0, d);
    }
  }
  return b.slice();
}
;var Z = {rules:{}};
c.exportProperty(Z, "rules", {});
c.exportProperty(Z.rules, "camelcase", {meta:{docs:{description:"check identifiers for camel case with options for opt_ prefix and var_args identifiers", category:"Stylistic Issues", recommended:!0}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = Object.assign({}, y, a.options[0] || {});
  return {Identifier:function(d) {
    d = z(d, b);
    d.hasError && a.report({node:d.node, message:d.message});
  }};
}});
c.exportProperty(Z.rules, "indent", {meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", 
minimum:0}, MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:!1}]}, create:function(a) {
  function b(a, b, d) {
    var e = "space" + (1 === b ? "" : "s"), f = "tab" + (1 === d ? "" : "s");
    return "Expected indentation of " + (a + " " + t + (1 === a ? "" : "s")) + " but" + (" found " + (0 < b && 0 < d ? b + " " + e + " and " + (d + " " + f) : 0 < b ? "space" === t ? b : b + " " + e : 0 < d ? "tab" === t ? d : d + " " + f : "0") + ".");
  }
  function d(d, e, f, g, h, k) {
    var ma = ("space" === t ? " " : "\t").repeat(e), G = k ? [d.range[1] - f - g - 1, d.range[1] - 1] : [d.range[0] - f - g, d.range[0]];
    a.report({node:d, loc:h, message:b(e, f, g), fix:function(a) {
      return a.replaceTextRange(G, ma);
    }});
  }
  function e(a, b) {
    var e = P(a, m, t, !1);
    "ArrayExpression" === a.type || "ObjectExpression" === a.type || e.goodChar === b && 0 === e.badChar || !Q(a, m) || d(a, b, e.space, e.tab);
  }
  function f(a, b) {
    a.forEach(function(a) {
      return e(a, b);
    });
  }
  function g(a, b) {
    var e = m.getLastToken(a), f = P(e, m, t, !0);
    f.goodChar === b && 0 === f.badChar || !Q(a, m, !0) || d(a, b, f.space, f.tab, {start:{line:e.loc.start.line, column:e.loc.start.column}}, !0);
  }
  function h(a) {
    var b = P(a, m, t).goodChar, d = a.parent;
    if ("Property" === d.type || "ArrayExpression" === d.type) {
      b = P(a, m, t, !1).goodChar;
    } else {
      if ("CallExpression" === d.type) {
        var e;
        e = 1 <= d.arguments.length ? d.arguments[0].loc.end.line > d.arguments[0].loc.start.line : !1;
        e && w.isNodeOneLine(d.callee) && !Q(a, m) && (b = P(d, m, t).goodChar);
      }
    }
    return b;
  }
  function k(a) {
    var b = a.body, d = h(a), e = p, f;
    if (f = -1 !== n.outerIIFEBody) {
      if (ca(a)) {
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
    f ? e = n.outerIIFEBody * p : "FunctionExpression" === a.type ? e = n.FunctionExpression.body * p : "FunctionDeclaration" === a.type && (e = n.FunctionDeclaration.body * p);
    d += e;
    (f = O.findAncestorOfType(a, "VariableDeclarator")) && R(a, f) && (d += p * n.VariableDeclarator[f.parent.kind]);
    x(b, d, d - e);
  }
  function l(a) {
    if (!w.isNodeOneLine(a)) {
      var b = a.body;
      a = h(a);
      x(b, a + p, a);
    }
  }
  function u(a) {
    var b = a.parent, e = O.findAncestorOfType(a, "VariableDeclarator"), f = P(b, m, t).goodChar;
    if (Q(a, m)) {
      if (e) {
        if (b === e) {
          e === e.parent.declarations[0] && (f += p * n.VariableDeclarator[e.parent.kind]);
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
      g = P(a, m, t, !1);
      g.goodChar === f && 0 === g.badChar || !Q(a, m) || d(a, f, g.space, g.tab, {start:{line:a.loc.start.line, column:a.loc.start.column}});
    } else {
      f = P(a, m, t).goodChar, b = f + p;
    }
    R(a, e) && (b += p * n.VariableDeclarator[e.parent.kind]);
    return b;
  }
  function x(a, b, d) {
    w.isNodeOneLine(a) || (f(a.body, b), g(a, d));
  }
  function r(a) {
    var b = P(a, m, t).goodChar, d = b + p;
    "BlockStatement" === a.body.type ? x(a.body, d, b) : f([a.body], d);
  }
  function C(a, b, d) {
    "first" === d && a.params.length ? f(a.params.slice(1), a.params[0].loc.start.column) : f(a.params, b * d);
  }
  function I(a, b) {
    a = "SwitchStatement" === a.type ? a : a.parent;
    if (M[a.loc.start.line]) {
      return M[a.loc.start.line];
    }
    "undefined" === typeof b && (b = P(a, m, t).goodChar);
    b = 0 < a.cases.length && 0 === n.SwitchCase ? b : b + p * n.SwitchCase;
    return M[a.loc.start.line] = b;
  }
  var E = ea(a.options), t = E.indentType, p = E.indentSize, n = E.indentOptions, m = a.getSourceCode(), M = {};
  return {Program:function(a) {
    f(a.body, 0);
  }, ClassDeclaration:l, ClassExpression:l, BlockStatement:function(a) {
    if (!w.isNodeOneLine(a) && ("BlockStatement" == a.parent.type || "Program" == a.parent.type)) {
      var b = P(a, m, t).goodChar;
      x(a, b + p, b);
    }
  }, DoWhileStatement:r, ForStatement:r, ForInStatement:r, ForOfStatement:r, WhileStatement:r, WithStatement:r, IfStatement:function(a) {
    var b = P(a, m, t).goodChar, d = b + p;
    "BlockStatement" !== a.consequent.type ? w.nodesStartOnSameLine(a, a.consequent) || e(a.consequent, d) : (f(a.consequent.body, d), g(a.consequent, b));
    if (a.alternate) {
      var h = m.getTokenBefore(a.alternate);
      e(h, b);
      "BlockStatement" !== a.alternate.type ? w.nodesStartOnSameLine(a.alternate, h) || e(a.alternate, d) : (f(a.alternate.body, d), g(a.alternate, b));
    }
  }, VariableDeclaration:function(a) {
    if (!w.nodesStartOnSameLine(a.declarations[0], a.declarations[a.declarations.length - 1])) {
      var b = da(a), d = P(a, m, t).goodChar, e = b[b.length - 1], d = d + p * n.VariableDeclarator[a.kind];
      f(b, d);
      m.getLastToken(a).loc.end.line <= e.loc.end.line || (b = m.getTokenBefore(e), "," === b.value ? g(a, P(b, m, t).goodChar) : g(a, d - p));
    }
  }, ObjectExpression:function(a) {
    if (!w.isNodeOneLine(a)) {
      var b = a.properties;
      if (!(0 < b.length && w.nodesStartOnSameLine(b[0], a))) {
        var d = u(a);
        f(b, d);
        g(a, d - p);
      }
    }
  }, ArrayExpression:function(a) {
    if (!w.isNodeOneLine(a)) {
      var b = a.elements.filter(function(a) {
        return null != a;
      });
      if (!(0 < b.length && w.nodesStartOnSameLine(b[0], a))) {
        var d = u(a);
        f(b, d);
        g(a, d - p);
      }
    }
  }, MemberExpression:function(a) {
    if (-1 !== n.MemberExpression && !w.isNodeOneLine(a) && !O.findAncestorOfType(a, "VariableDeclarator") && !O.findAncestorOfType(a, "AssignmentExpression")) {
      var b = P(a, m, t).goodChar + p * n.MemberExpression, d = [a.property];
      a = m.getTokenBefore(a.property);
      "Punctuator" === a.type && "." === a.value && d.push(a);
      f(d, b);
    }
  }, SwitchStatement:function(a) {
    var b = P(a, m, t).goodChar, d = I(a, b);
    f(a.cases, d);
    g(a, b);
  }, SwitchCase:function(a) {
    if (!w.isNodeOneLine(a)) {
      var b = I(a);
      f(a.consequent, b + p);
    }
  }, ArrowFunctionExpression:function(a) {
    w.isNodeOneLine(a) || "BlockStatement" === a.body.type && k(a);
  }, FunctionDeclaration:function(a) {
    w.isNodeOneLine(a) || (-1 !== n.FunctionDeclaration.parameters && C(a, p, n.FunctionDeclaration.parameters), k(a));
  }, FunctionExpression:function(a) {
    w.isNodeOneLine(a) || (-1 !== n.FunctionExpression.parameters && C(a, p, n.FunctionExpression.parameters), k(a));
  }};
}});
c.exportProperty(Z.rules, "inline-comment-spacing", {meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:!1}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(a) {
  var b = null == a.options[0] ? 1 : a.options[0];
  return {LineComment:function(d) {
    var e = a.getSourceCode();
    e.getComments(d);
    e = e.getTokenBefore(d, 1) || e.getTokenOrCommentBefore(d);
    if (null != e && w.nodesShareOneLine(d, e)) {
      var f = d.start - e.end;
      f < b && a.report({node:d, message:"Expected at least " + b + " " + (1 === b ? "space" : "spaces") + " before inline comment.", fix:function(a) {
        var e = Array(b - f + 1).join(" ");
        return a.insertTextBefore(d, e);
      }});
    }
  }};
}});
c.exportProperty(Z.rules, "jsdoc", {meta:{docs:{description:"enforce valid JSDoc comments", category:"Possible Errors", recommended:!0}, schema:[{type:"object", properties:{prefer:{type:"object", additionalProperties:{type:"string"}}, preferType:{type:"object", additionalProperties:{type:"string"}}, requireReturn:{type:"boolean"}, requireParamDescription:{type:"boolean"}, requireReturnDescription:{type:"boolean"}, matchDescription:{type:"string"}, requireReturnType:{type:"boolean"}}, additionalProperties:!1}]}, 
create:function(a) {
  function b(a) {
    f.push({returnPresent:"ArrowFunctionExpression" === a.type && "BlockStatement" !== a.body.type || w.isNodeClassType(a)});
  }
  function d(b, d) {
    W.traverseTags(d, function(d) {
      if ("NameExpression" === d.type) {
        d = d.name;
        var e = C[d];
        e && a.report({node:b, message:"Use '" + e + "' instead of '" + d + "'."});
      }
    });
  }
  function e(b) {
    var e = g.getJSDocComment(b), p = f.pop(), n = Object.create(null), m = !1, E = !1, C = !1, G = !1, V = !1, K;
    if (e) {
      try {
        K = ia.parse(e.value, {strict:!0, unwrap:!0, sloppy:!0});
      } catch (na) {
        /braces/i.test(na.message) ? a.report({node:e, message:"JSDoc type missing brace."}) : a.report({node:e, message:"JSDoc syntax error."});
        return;
      }
      K.tags.forEach(function(b) {
        switch(b.title.toLowerCase()) {
          case "param":
          case "arg":
          case "argument":
            b.type || a.report({node:e, message:"Missing JSDoc parameter type for '" + b.name + "'."});
            !b.description && u && a.report({node:e, message:"Missing JSDoc parameter description for " + ("'" + b.name + "'.")});
            n[b.name] ? a.report({node:e, message:"Duplicate JSDoc parameter '" + b.name + "'."}) : -1 === b.name.indexOf(".") && (n[b.name] = 1);
            break;
          case "return":
          case "returns":
            m = !0;
            l || p.returnPresent || !c.isNull(b.type) && X(b) || V ? (r && !b.type && a.report({node:e, message:"Missing JSDoc return type."}), X(b) || b.description || !x || a.report({node:e, message:"Missing JSDoc return description."})) : a.report({node:e, message:"Unexpected @{{title}} tag; function has no return statement.", data:{title:b.title}});
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
        k.containsKey(b.title) && b.title != k.get(b.title) && a.report({node:e, message:"Use @{{name}} instead.", data:{name:k.get(b.title)}});
        Y(a, b);
        I && b.type && d(e, b.type);
      });
      G || m || E || C || w.isNodeGetterFunction(b) || w.isNodeSetterFunction(b) || w.isNodeConstructorFunction(b) || w.isNodeClassType(b) || (l || p.returnPresent) && a.report({node:e, message:"Missing JSDoc @return for function."});
      var L = Object.keys(n);
      b.params && b.params.forEach(function(b, d) {
        "AssignmentPattern" === b.type && (b = b.left);
        var f = b.name;
        "Identifier" === b.type && (L[d] && f !== L[d] ? a.report({node:e, message:"Expected JSDoc for '" + f + "' but found " + ("'" + L[d] + "'.")}) : n[f] || G || a.report({node:e, message:"Missing JSDoc for parameter '" + f + "'."}));
      });
      h.matchDescription && ((new RegExp(h.matchDescription)).test(K.description) || a.report({node:e, message:"JSDoc description does not satisfy the regex pattern."}));
    }
  }
  var f = [], g = a.getSourceCode(), h = a.options[0] || {}, k = new c.structs.Map(h.prefer), l = !1 !== h.requireReturn, u = !1 !== h.requireParamDescription, x = !1 !== h.requireReturnDescription, r = !1 !== h.requireReturnType, C = h.preferType || {}, I = 0 !== Object.keys(C).length;
  return {ArrowFunctionExpression:b, FunctionExpression:b, FunctionDeclaration:b, ClassExpression:b, ClassDeclaration:b, "ArrowFunctionExpression:exit":e, "FunctionExpression:exit":e, "FunctionDeclaration:exit":e, "ClassExpression:exit":e, "ClassDeclaration:exit":e, ReturnStatement:function(a) {
    var b = f[f.length - 1];
    b && !c.isNull(a.argument) && (b.returnPresent = !0);
  }, VariableDeclaration:function(b) {
    if (1 === b.declarations.length) {
      var d = W.getJSDocComment(b);
      if (d) {
        var e;
        try {
          e = W.parseComment(d.value);
        } catch (n) {
          return;
        }
        b = b.declarations[0];
        "Identifier" === b.id.type && (b = b.id.name, W.hasTypeInformation(e) && a.markVariableAsUsed(b), e.tags.forEach(function(b) {
          Y(a, b);
        }));
      }
    }
  }};
}});
c.exportProperty(Z.rules, "no-undef", {meta:{docs:{description:"disallow the use of undeclared variables unless mentioned in `/*global */` comments", category:"Variables", recommended:!0}, schema:[{type:"object", properties:{typeof:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
  var b = a.options[0], d = b && !0 === b.typeof || !1, e = [], f = [];
  return {Program:function(a) {
    e = a.body.map(O.matchExtractBareGoogRequire).filter(function(a) {
      return !!a;
    }).map(function(a) {
      return a.source;
    });
    f = a.body.map(O.matchExtractGoogProvide).filter(function(a) {
      return !!a;
    }).map(function(a) {
      return a.source;
    });
  }, "Program:exit":function() {
    function b(a) {
      return f.some(function(b) {
        return w.isValidPrefix(a, b);
      });
    }
    function h(a) {
      return e.some(function(b) {
        return w.isValidPrefix(a, b);
      });
    }
    a.getScope().through.forEach(function(e) {
      e = e.identifier;
      var f = O.getFullyQualifedName(e), g;
      if (g = !d) {
        g = e.parent, g = "UnaryExpression" === g.type && "typeof" === g.operator;
      }
      g || b(f) || h(f) || a.report({node:e, message:"'" + e.name + "' is not defined."});
    });
  }};
}});
c.exportProperty(Z.rules, "no-unused-expressions", {meta:{docs:{description:"disallow unused expressions", category:"Best Practices", recommended:!1}, schema:[{type:"object", properties:{allowShortCircuit:{type:"boolean"}, allowTernary:{type:"boolean"}}, additionalProperties:!1}]}, create:function(a) {
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
      e = "Program" === e.type || f ? c.array.contains(la(ka, e.body), d) : !1;
      e = !e;
    }
    if (e) {
      var g;
      if (e = W.getJSDocComment(d)) {
        try {
          var u = W.parseComment(e.value);
          g = W.hasTypeInformation(u);
        } catch (x) {
          g = !1;
        }
      } else {
        g = !1;
      }
      e = !g;
    }
    e && a.report({node:d, message:"Expected an assignment or function call and instead saw an expression."});
  }};
}});
c.exportProperty(Z.rules, "no-unused-vars", {meta:{docs:{description:"disallow unused variables", category:"Variables", recommended:!0}, schema:[{oneOf:[{enum:["all", "local"]}, {type:"object", properties:{vars:{enum:["all", "local"]}, varsIgnorePattern:{type:"string"}, args:{enum:["all", "after-used", "none"]}, argsIgnorePattern:{type:"string"}, caughtErrors:{enum:["all", "none"]}, caughtErrorsIgnorePattern:{type:"string"}, allowUnusedTypes:{type:"boolean"}}}]}]}, create:function(a) {
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
          if (u.test(a.type)) {
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
      var k = a.identifier, l = k.parent, m = l.parent, x;
      if (x = a.isRead()) {
        !(l = "AssignmentExpression" === l.type && "ExpressionStatement" === m.type && l.left === k || "UpdateExpression" === l.type && "ExpressionStatement" === m.type) && (l = h && b(k, h)) && (k = O.findAncestor(k, O.isFunction), l = !(k && b(k, h) && d(k, h))), x = l;
      }
      h = x;
      k = g;
      l = a.identifier;
      m = l.parent;
      x = m.parent;
      var r;
      if (!(r = a.from.variableScope !== a.resolved.scope.variableScope)) {
        b: {
          for (r = l;r;) {
            if (O.isLoop(r)) {
              r = !0;
              break b;
            }
            if (O.isFunction(r)) {
              break;
            }
            r = r.parent;
          }
          r = !1;
        }
      }
      g = k && b(l, k) ? k : "AssignmentExpression" !== m.type || "ExpressionStatement" !== x.type || l !== m.left || r ? null : m.right;
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
      return 0 === a.references.length && k.argsIgnorePattern && k.argsIgnorePattern.test(a.name);
    })) ? !0 : !1;
  }
  function g(a, b) {
    var d = a.variables, h = a.childScopes, l, r;
    if ("TDZ" !== a.type && ("global" !== a.type || "all" === k.vars)) {
      for (l = 0, r = d.length;l < r;++l) {
        var p = d[l];
        if (!("class" === a.type && a.block.id === p.identifiers[0] || a.functionExpressionScope || p.eslintUsed || "function" === a.type && "arguments" === p.name && 0 === p.identifiers.length)) {
          var n = p.defs[0];
          if (n) {
            var m = n.type;
            if ("CatchClause" === m) {
              if ("none" === k.caughtErrors) {
                continue;
              }
              if (k.caughtErrorsIgnorePattern && k.caughtErrorsIgnorePattern.test(n.name.name)) {
                continue;
              }
            }
            if ("Parameter" === m) {
              if ("Property" === n.node.parent.type && "set" === n.node.parent.kind) {
                continue;
              }
              if ("none" === k.args) {
                continue;
              }
              if (k.argsIgnorePattern && k.argsIgnorePattern.test(n.name.name)) {
                continue;
              }
              if ("after-used" === k.args && !f(p)) {
                continue;
              }
            } else {
              if (k.varsIgnorePattern && k.varsIgnorePattern.test(n.name.name)) {
                continue;
              }
            }
          }
          if (n = !e(p)) {
            a: {
              if (n = p.defs[0]) {
                m = n.node;
                if ("VariableDeclarator" === m.type) {
                  m = m.parent;
                } else {
                  if ("Parameter" === n.type) {
                    n = !1;
                    break a;
                  }
                }
                n = 0 === m.parent.type.indexOf("Export");
              } else {
                n = !1;
              }
            }
            n = !n;
          }
          n && b.push(p);
        }
      }
    }
    l = 0;
    for (r = h.length;l < r;++l) {
      g(h[l], b);
    }
    return b;
  }
  function h(a) {
    var b = a.eslintExplicitGlobalComment, d = b.loc.start;
    a = new RegExp("[\\s,]" + w.escapeRegexp(a.name) + "(?:$|[\\s,:])", "g");
    a.lastIndex = b.value.indexOf("global") + 6;
    a = (a = a.exec(b.value)) ? a.index + 1 : 0;
    var b = b.value.slice(0, a), e = (b.match(/\n/g) || []).length;
    a = 0 < e ? a - (1 + b.lastIndexOf("\n")) : a + (d.column + 2);
    return {start:{line:d.line + e, column:a}};
  }
  var k = {vars:"all", args:"after-used", caughtErrors:"none", allowUnusedTypes:!1}, l = a.options[0];
  l && (c.isString(l) ? k.vars = l : (k.vars = l.vars || k.vars, k.args = l.args || k.args, k.caughtErrors = l.caughtErrors || k.caughtErrors, l.varsIgnorePattern && (k.varsIgnorePattern = new RegExp(l.varsIgnorePattern)), l.argsIgnorePattern && (k.argsIgnorePattern = new RegExp(l.argsIgnorePattern)), l.caughtErrorsIgnorePattern && (k.caughtErrorsIgnorePattern = new RegExp(l.caughtErrorsIgnorePattern)), l.allowUnusedTypes && (k.allowUnusedTypes = l.allowUnusedTypes)));
  var u = /(?:Statement|Declaration)$/;
  return {"Program:exit":function(b) {
    g(a.getScope(), []).forEach(function(d) {
      d.eslintExplicitGlobal ? a.report({node:b, loc:h(d), message:"'{{name}}' is defined but never used.", data:d}) : 0 < d.defs.length && a.report({node:d.identifiers[0], message:"'{{name}}' is defined but never used.", data:d});
    });
  }};
}});
module.exports = Z;

