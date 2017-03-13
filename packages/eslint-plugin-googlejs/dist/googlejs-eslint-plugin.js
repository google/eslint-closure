global.goog={};(function(goog){var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.define("goog.DEBUG", true);
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG);
goog.define("goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING", false);
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly. Note, " + "modules cannot be loaded as normal scripts. They require some kind of " + "pre-processing step. You're likely trying to load a module via a " + "script tag or as a part of a concatenated bundle without rewriting the " + "module. For more info see: " + "https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
goog.forwardDeclare("Document");
goog.forwardDeclare("HTMLScriptElement");
goog.forwardDeclare("XMLHttpRequest");
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_loadFlags) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    if (!opt_loadFlags || typeof opt_loadFlags === "boolean") {
      opt_loadFlags = opt_loadFlags ? {"module":"goog"} : {};
    }
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.loadFlags[path] = opt_loadFlags;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console["error"](msg);
  }
};
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      }
    } else {
      if (goog.ENABLE_DEBUG_LOADER) {
        var path = goog.getPathFromDeps_(name);
        if (path) {
          goog.writeScripts_(path);
        } else {
          var errorMessage = "goog.require could not find: " + name;
          goog.logToConsole_(errorMessage);
          throw Error(errorMessage);
        }
      }
    }
    return null;
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.define("goog.TRANSPILE", "detect");
goog.define("goog.TRANSPILER", "transpile.js");
if (goog.DEPENDENCIES_ENABLED) {
  goog.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return doc != null && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("SCRIPT");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var script = (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document && goog.global.document.all);
  goog.importProcessedScript_ = function(src, isModule, needsTranspile) {
    var bootstrap = 'goog.retrieveAndExec_("' + src + '", ' + isModule + ", " + needsTranspile + ");";
    goog.importScript_("", bootstrap);
  };
  goog.queuedModules_ = [];
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    var loadFlags = path && goog.dependencies_.loadFlags[path] || {};
    var languageLevel = loadFlags["lang"] || "es3";
    if (path && (loadFlags["module"] == "goog" || goog.needsTranspile_(languageLevel))) {
      var abspath = goog.basePath + path;
      return abspath in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModuleFromUrl = function(url) {
    goog.retrieveAndExec_(url, true, false);
  };
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write('<script type="text/javascript" src="' + src + '"></' + "script>");
  };
  goog.appendScriptSrcNode_ = function(src) {
    var doc = goog.global.document;
    var scriptEl = (doc.createElement("script"));
    scriptEl.type = "text/javascript";
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      if (opt_sourceText === undefined) {
        if (!goog.IS_OLD_IE_) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.needsTranspile_ = function(lang) {
    if (goog.TRANSPILE == "always") {
      return true;
    } else {
      if (goog.TRANSPILE == "never") {
        return false;
      } else {
        if (!goog.requiresTranspilation_) {
          goog.requiresTranspilation_ = goog.createRequiresTranspilation_();
        }
      }
    }
    if (lang in goog.requiresTranspilation_) {
      return goog.requiresTranspilation_[lang];
    } else {
      throw new Error("Unknown language mode: " + lang);
    }
  };
  goog.createRequiresTranspilation_ = function() {
    var requiresTranspilation = {"es3":false};
    var transpilationRequiredForAllLaterModes = false;
    function addNewerLanguageTranspilationCheck(modeName, isSupported) {
      if (transpilationRequiredForAllLaterModes) {
        requiresTranspilation[modeName] = true;
      } else {
        if (isSupported()) {
          requiresTranspilation[modeName] = false;
        } else {
          requiresTranspilation[modeName] = true;
          transpilationRequiredForAllLaterModes = true;
        }
      }
    }
    function evalCheck(code) {
      try {
        return !!eval(code);
      } catch (ignored) {
        return false;
      }
    }
    addNewerLanguageTranspilationCheck("es5", function() {
      return evalCheck("[1,].length==1");
    });
    addNewerLanguageTranspilationCheck("es6", function() {
      var es6fullTest = "class X{constructor(){if(new.target!=String)throw 1;this.x=42}}" + "let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof " + "String))throw 1;for(const a of[2,3]){if(a==2)continue;function " + "f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()" + "==3}";
      return evalCheck('(()=>{"use strict";' + es6fullTest + "})()");
    });
    addNewerLanguageTranspilationCheck("es6-impl", function() {
      return true;
    });
    addNewerLanguageTranspilationCheck("es7", function() {
      return evalCheck("2 ** 2 == 4");
    });
    addNewerLanguageTranspilationCheck("es8", function() {
      return evalCheck("async () => 1, true");
    });
    return requiresTranspilation;
  };
  goog.requiresTranspilation_ = null;
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function(pathToLoad) {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    visitNode(pathToLoad);
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      if (path) {
        var loadFlags = deps.loadFlags[path] || {};
        var languageLevel = loadFlags["lang"] || "es3";
        var needsTranspile = goog.needsTranspile_(languageLevel);
        if (loadFlags["module"] == "goog" || needsTranspile) {
          goog.importProcessedScript_(goog.basePath + path, loadFlags["module"] == "goog", needsTranspile);
        } else {
          goog.importScript_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:undefined, declareLegacyNamespace:false};
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {});
    } else {
      if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(undefined, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name "' + moduleName + '"');
    }
    if (goog.moduleLoaderState_.declareLegacyNamespace) {
      goog.constructNamespace_(moduleName, exports);
    } else {
      if (goog.SEAL_MODULE_EXPORTS && Object.seal && goog.isObject(exports)) {
        Object.seal(exports);
      }
    }
    goog.loadedModules_[moduleName] = exports;
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};
goog.loadModuleFromSource_ = function() {
  var exports = {};
  eval(arguments[0]);
  return exports;
};
goog.normalizePath_ = function(path) {
  var components = path.split("/");
  var i = 0;
  while (i < components.length) {
    if (components[i] == ".") {
      components.splice(i, 1);
    } else {
      if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") {
        components.splice(--i, 2);
      } else {
        i++;
      }
    }
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    try {
      var xhr = new goog.global["XMLHttpRequest"];
      xhr.open("get", src, false);
      xhr.send();
      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
    } catch (err) {
      return null;
    }
  }
};
goog.retrieveAndExec_ = function(src, isModule, needsTranspile) {
  if (!COMPILED) {
    var originalPath = src;
    src = goog.normalizePath_(src);
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    var scriptText = goog.loadFileSync_(src);
    if (scriptText == null) {
      throw new Error('Load of "' + src + '" failed');
    }
    if (needsTranspile) {
      scriptText = goog.transpile_.call(goog.global, scriptText, src);
    }
    if (isModule) {
      scriptText = goog.wrapModule_(src, scriptText);
    } else {
      scriptText += "\n//# sourceURL=" + src;
    }
    var isOldIE = goog.IS_OLD_IE_;
    if (isOldIE) {
      goog.dependencies_.deferred[originalPath] = scriptText;
      goog.queuedModules_.push(originalPath);
    } else {
      importScript(src, scriptText);
    }
  }
};
goog.transpile_ = function(code, path) {
  var jscomp = goog.global["$jscomp"];
  if (!jscomp) {
    goog.global["$jscomp"] = jscomp = {};
  }
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER;
    var transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      eval(transpilerCode + "\n//# sourceURL=" + transpilerPath);
      if (goog.global["$gwtExport"] && goog.global["$gwtExport"]["$jscomp"] && !goog.global["$gwtExport"]["$jscomp"]["transpile"]) {
        throw new Error('The transpiler did not properly export the "transpile" ' + "method. $gwtExport: " + JSON.stringify(goog.global["$gwtExport"]));
      }
      goog.global["$jscomp"].transpile = goog.global["$gwtExport"]["$jscomp"]["transpile"];
      jscomp = goog.global["$jscomp"];
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    var suffix = " requires transpilation but no transpiler was found.";
    transpile = jscomp.transpile = function(code, path) {
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  return transpile(code, path);
};
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if (obj !== null && "removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return (fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _evalTest_ = 1;");
        if (typeof goog.global["_evalTest_"] != "undefined") {
          try {
            delete goog.global["_evalTest_"];
          } catch (ignore) {
          }
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = (doc.createElement("SCRIPT"));
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  if (String(className).charAt(0) == ".") {
    throw new Error('className passed in goog.getCssName must not start with ".".' + " You passed: " + className);
  }
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  var result = opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
  if (goog.global.CLOSURE_CSS_NAME_MAP_FN) {
    return goog.global.CLOSURE_CSS_NAME_MAP_FN(result);
  }
  return result;
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = new Array(arguments.length - 2);
    for (var i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  var args = new Array(arguments.length - 2);
  for (var i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return ctr;
  }
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass);
  var wrappedCtr = function() {
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
    if (this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function) {
      Object.seal(instance);
    }
    return instance;
  };
  return wrappedCtr;
};
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.types");
  var UnderscoreForm = {CONSTANT:"constant", LEADING:"leading", NO_UNDERSCORE:"no_underscore", MIDDLE:"middle", OPT_PREFIX:"opt_prefix", TRAILING:"trailing", VAR_ARGS:"var_args"};
  exports = {UnderscoreForm:UnderscoreForm};
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.utils");
  var types = goog.require("googlejs.types");
  function nodesShareOneLine(left, right) {
    return left.loc.end.line === right.loc.start.line;
  }
  function isNodeOneLine(node) {
    return nodesShareOneLine(node, node);
  }
  function nodesStartOnSameLine(node1, node2) {
    return node1.loc.start.line === node2.loc.start.line;
  }
  function nodesEndOnSameLine(node1, node2) {
    return node1.loc.end.line === node2.loc.end.line;
  }
  function isUnderscored(name) {
    return name.indexOf("_") > -1;
  }
  function categorizeUnderscoredIdentifier(name) {
    if (name === "" || name.length === 0) {
      return types.UnderscoreForm.NO_UNDERSCORE;
    } else {
      if (name.toUpperCase() === name) {
        return types.UnderscoreForm.CONSTANT;
      } else {
        if (name.indexOf("_") === -1) {
          return types.UnderscoreForm.NO_UNDERSCORE;
        } else {
          if (name === "var_args") {
            return types.UnderscoreForm.VAR_ARGS;
          } else {
            if (name.substring(0, 4) === "opt_" && name != "opt_") {
              return types.UnderscoreForm.OPT_PREFIX;
            } else {
              if (name[0] === "_") {
                return types.UnderscoreForm.LEADING;
              } else {
                if (name[name.length - 1] === "_") {
                  return types.UnderscoreForm.TRAILING;
                } else {
                  return types.UnderscoreForm.MIDDLE;
                }
              }
            }
          }
        }
      }
    }
  }
  function isNodeClassType(node) {
    return node.type === "ClassExpression" || node.type === "ClassDeclaration";
  }
  function isNodeGetterFunction(node) {
    return node.type === "FunctionExpression" && node.parent && node.parent.type === "Property" && (node.parent).kind === "get";
  }
  function isNodeSetterFunction(node) {
    return node.type === "FunctionExpression" && node.parent && node.parent.type === "Property" && (node.parent).kind === "set";
  }
  function isNodeConstructorFunction(node) {
    return node.type === "FunctionExpression" && node.parent && node.parent.type === "MethodDefinition" && (node.parent).kind === "constructor";
  }
  function isValidPrefix(name, prefix) {
    if (name.startsWith(prefix)) {
      return name === prefix || name[prefix.length] === ".";
    } else {
      return false;
    }
  }
  function escapeRegexp(string) {
    return String(string).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  function isTruthy(item) {
    return !!item;
  }
  exports = {categorizeUnderscoredIdentifier:categorizeUnderscoredIdentifier, escapeRegexp:escapeRegexp, isUnderscored:isUnderscored, isNodeConstructorFunction:isNodeConstructorFunction, isNodeClassType:isNodeClassType, isNodeGetterFunction:isNodeGetterFunction, isNodeOneLine:isNodeOneLine, isNodeSetterFunction:isNodeSetterFunction, isValidPrefix:isValidPrefix, isTruthy:isTruthy, nodesEndOnSameLine:nodesEndOnSameLine, nodesShareOneLine:nodesShareOneLine, nodesStartOnSameLine:nodesStartOnSameLine};
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.camelcase");
  var types = goog.require("googlejs.types");
  var utils = goog.require("googlejs.utils");
  var CamelCaseRuleOptions;
  var UnderscoreReport;
  var DEFAULT_CAMELCASE_OPTIONS = {allowVarArgs:false, allowOptPrefix:false, allowLeadingUnderscore:true, allowTrailingUnderscore:true, checkObjectProperties:true};
  function describeIncorrectUnderscores_(node, options) {
    var validReport = {node:node, message:"", hasError:false};
    var invalidReport = {node:node, message:"", hasError:true};
    function makeReport(message) {
      return (Object.assign(invalidReport, {message:message}));
    }
    function checkAndReport(effectiveName, message) {
      if (isCorrectlyUnderscored_(effectiveName, node, options)) {
        return validReport;
      } else {
        return makeReport(message);
      }
    }
    switch(utils.categorizeUnderscoredIdentifier(node.name)) {
      case types.UnderscoreForm.CONSTANT:
        return validReport;
      case types.UnderscoreForm.LEADING:
        if (options.allowLeadingUnderscore) {
          return checkAndReport(node.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + node.name + "' is not in camel case after the" + " leading underscore.");
        } else {
          return makeReport("Leading underscores are not allowed in '" + node.name + "'.");
        }
      case types.UnderscoreForm.NO_UNDERSCORE:
        return validReport;
      case types.UnderscoreForm.MIDDLE:
        return checkAndReport(node.name, "Identifier '" + node.name + "' is not in camel case.");
      case types.UnderscoreForm.OPT_PREFIX:
        if (options.allowOptPrefix) {
          return checkAndReport(node.name.replace(/^opt_/g, ""), "Identifier '" + node.name + "' is not in camel case after the opt_ " + "prefix.");
        } else {
          return makeReport("The opt_ prefix is not allowed in '" + node.name + "'.");
        }
      case types.UnderscoreForm.TRAILING:
        if (options.allowTrailingUnderscore) {
          return checkAndReport(node.name.replace(/^_+/g, "").replace(/_+$/g, ""), "Identifier '" + node.name + "' is not in camel case before the " + "trailing underscore.");
        } else {
          return makeReport("Trailing underscores are not allowed in '" + node.name + "'.");
        }
      case types.UnderscoreForm.VAR_ARGS:
        if (options.allowVarArgs) {
          return validReport;
        } else {
          return makeReport("The var_args identifier is not allowed.");
        }
      default:
        throw new Error("Unknown undercore form: " + node.name);
    }
  }
  function isCorrectlyUnderscored_(effectiveNodeName, node, options) {
    var parent = node.parent;
    var isCorrect = true;
    var isWrong = false;
    if (!utils.isUnderscored(effectiveNodeName)) {
      return isCorrect;
    }
    switch(parent.type) {
      case "MemberExpression":
        parent = (node.parent);
        if (!options.checkObjectProperties) {
          return isCorrect;
        }
        if (parent.property === node) {
          if (parent.parent && parent.parent.type === "AssignmentExpression") {
            var grandParent = (parent.parent);
            return grandParent.right === parent;
          } else {
            return isCorrect;
          }
        }
        break;
      case "Property":
        parent = (node.parent);
        if (!options.checkObjectProperties) {
          return isCorrect;
        }
        if (parent.parent && parent.parent.type === "ObjectPattern") {
          if (parent.key === node && parent.value !== node) {
            return isCorrect;
          }
        }
        break;
      case "CallExpression":
        return isCorrect;
      default:
        return isWrong;
    }
    return isWrong;
  }
  var CAMELCASE_RULE = {meta:{docs:{description:"check identifiers for camel case with options for opt_ " + "prefix and var_args identifiers", category:"Stylistic Issues", recommended:true}, schema:[{type:"object", properties:{allowVarArgs:{type:"boolean"}, allowOptPrefix:{type:"boolean"}, allowLeadingUnderscore:{type:"boolean"}, allowTrailingUnderscore:{type:"boolean"}, checkObjectProperties:{type:"boolean"}}, additionalProperties:false}]}, create:function(context) {
    var userOptions = (context.options[0]) || {};
    var options = (Object.assign({}, DEFAULT_CAMELCASE_OPTIONS, userOptions));
    function reportIncorrectUnderscores(node) {
      var underscoreReport = describeIncorrectUnderscores_(node, options);
      if (underscoreReport.hasError) {
        context.report({node:underscoreReport.node, message:underscoreReport.message});
      }
    }
    return {Identifier:reportIncorrectUnderscores};
  }};
  exports = CAMELCASE_RULE;
  return exports;
});
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
  this.reportErrorToServer = true;
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", false);
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  var splitParts = str.split("%s");
  var returnString = "";
  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return /^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if (test1 < test2) {
    return -1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
};
goog.string.numberAwareCompare_ = function(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(tokenizerRegExp);
  var tokens2 = str2.toLowerCase().match(tokenizerRegExp);
  var count = Math.min(tokens1.length, tokens2.length);
  for (var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
};
goog.string.intAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("&") != -1) {
      str = str.replace(goog.string.AMP_RE_, "&amp;");
    }
    if (str.indexOf("<") != -1) {
      str = str.replace(goog.string.LT_RE_, "&lt;");
    }
    if (str.indexOf(">") != -1) {
      str = str.replace(goog.string.GT_RE_, "&gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "&quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "&#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, "&")) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "&")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        if (entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  var sb = ['"'];
  for (var i = 0;i < s.length;i++) {
    var ch = s.charAt(i);
    var cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};
goog.string.remove = function(str, substr) {
  return str.replace(substr, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.replaceAll = function(s, ss, replacement) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, replacement.replace(/\$/g, "$$$$"));
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = String.prototype.repeat ? function(string, length) {
  return string.repeat(length);
} : function(string, length) {
  return (new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for (var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    do {
      var v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ["", "", "", ""];
      var v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ["", "", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
      v1Sub = v1Comp[3];
      v2Sub = v2Comp[3];
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return -1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
};
goog.string.isLowerCamelCase = function(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.string.lastComponent = function(str, separators) {
  if (!separators) {
    return str;
  } else {
    if (typeof separators == "string") {
      separators = [separators];
    }
  }
  var lastSeparatorIndex = -1;
  for (var i = 0;i < separators.length;i++) {
    if (separators[i] == "") {
      continue;
    }
    var currentSeparatorIndex = str.lastIndexOf(separators[i]);
    if (currentSeparatorIndex > lastSeparatorIndex) {
      lastSeparatorIndex = currentSeparatorIndex;
    }
  }
  if (lastSeparatorIndex == -1) {
    return str;
  }
  return str.slice(lastSeparatorIndex + 1);
};
goog.string.editDistance = function(a, b) {
  var v0 = [];
  var v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0;i < b.length + 1;i++) {
    v0[i] = i;
  }
  for (var i = 0;i < a.length;i++) {
    v1[0] = i + 1;
    for (var j = 0;j < b.length;j++) {
      var cost = Number(a[i] != b[j]);
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (var j = 0;j < v0.length;j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return (value);
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.provide("goog.functions");
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(false);
goog.functions.TRUE = goog.functions.constant(true);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.partialRight = function(fn, var_args) {
  var rightArgs = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.push.apply(newArgs, rightArgs);
    return fn.apply(this, newArgs);
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.equalTo = function(value, opt_useLooseComparison) {
  return function(other) {
    return opt_useLooseComparison ? value == other : value === other;
  };
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    if (length) {
      result = functions[length - 1].apply(this, arguments);
    }
    for (var i = length - 2;i >= 0;i--) {
      result = functions[i].call(this, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    for (var i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (!functions[i].apply(this, arguments)) {
        return false;
      }
    }
    return true;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return true;
      }
    }
    return false;
  };
};
goog.functions.not = function(f) {
  return function() {
    return !f.apply(this, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
goog.define("goog.functions.CACHE_RETURN_VALUE", true);
goog.functions.cacheReturnValue = function(fn) {
  var called = false;
  var value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    if (!called) {
      value = fn();
      called = true;
    }
    return value;
  };
};
goog.functions.once = function(f) {
  var inner = f;
  return function() {
    if (inner) {
      var tmp = inner;
      inner = null;
      tmp();
    }
  };
};
goog.functions.debounce = function(f, interval, opt_scope) {
  if (opt_scope) {
    f = goog.bind(f, opt_scope);
  }
  var timeout = null;
  return (function(var_args) {
    goog.global.clearTimeout(timeout);
    var args = arguments;
    timeout = goog.global.setTimeout(function() {
      f.apply(null, args);
    }, interval);
  });
};
goog.functions.throttle = function(f, interval, opt_scope) {
  if (opt_scope) {
    f = goog.bind(f, opt_scope);
  }
  var timeout = null;
  var shouldFire = false;
  var args = [];
  var handleTimeout = function() {
    timeout = null;
    if (shouldFire) {
      shouldFire = false;
      fire();
    }
  };
  var fire = function() {
    timeout = goog.global.setTimeout(handleTimeout, interval);
    f.apply(null, args);
  };
  return (function(var_args) {
    args = arguments;
    if (!timeout) {
      fire();
    } else {
      shouldFire = true;
    }
  });
};
goog.provide("goog.array");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  Array.prototype.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      f.call((opt_obj), arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call((opt_obj), arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call((opt_obj), val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call((opt_obj), arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return Array.prototype.reduce.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call((opt_obj), rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.asserts.assert(f != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return Array.prototype.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call((opt_obj), rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call((opt_obj), arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && !f.call((opt_obj), arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call((opt_obj), element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call((opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call((opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeLast = function(arr, obj) {
  var i = goog.array.lastIndexOf(arr, obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call((opt_obj), val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
goog.array.join = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0;
      var len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (var j = 0;j < len2;j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start);
  } else {
    return Array.prototype.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    return goog.isObject(item) ? "o" + goog.getUid(item) : (typeof item).charAt(0) + item;
  };
  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = (compareFn)(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  var compArr = new Array(arr.length);
  for (var i = 0;i < arr.length;i++) {
    compArr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  goog.array.sort(compArr, stableCompareFn);
  for (var i = 0;i < arr.length;i++) {
    arr[i] = compArr[i].value;
  }
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return -goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {};
  for (var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter.call((opt_obj), value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call((opt_obj), element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return [];
  }
  if (step > 0) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (var i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  var CHUNK_SIZE = 8192;
  var result = [];
  for (var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      for (var c = 0;c < element.length;c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
        var recurseResult = goog.array.flatten.apply(null, chunk);
        for (var r = 0;r < recurseResult.length;r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      Array.prototype.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        Array.prototype.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1);
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return [];
  }
  var result = [];
  var minLen = arguments[0].length;
  for (var i = 1;i < arguments.length;i++) {
    if (arguments[i].length < minLen) {
      minLen = arguments[i].length;
    }
  }
  for (var i = 0;i < minLen;i++) {
    var value = [];
    for (var j = 0;j < arguments.length;j++) {
      value.push(arguments[j][i]);
    }
    result.push(value);
  }
  return result;
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.array.copyByIndex = function(arr, index_arr) {
  var result = [];
  goog.array.forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
};
goog.array.concatMap = function(arr, f, opt_obj) {
  return goog.array.concat.apply([], goog.array.map(arr, f, opt_obj));
};
goog.provide("goog.object");
goog.object.is = function(v, v2) {
  if (v === v2) {
    return v !== 0 || 1 / v === 1 / (v2);
  }
  return v !== v && v2 !== v2;
};
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call((opt_obj), obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call((opt_obj), obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call((opt_obj), obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call((opt_obj), obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call((opt_obj), obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for (var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return obj !== null && key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call((opt_this), obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in (obj)) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (obj !== null && key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (obj !== null && key in obj) {
    return obj[key];
  }
  return opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in (obj) ? obj[key] : obj[key] = value;
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  obj[key] = val;
  return val;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return false;
    }
  }
  for (var k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
};
goog.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (goog.isFunction(obj.clone)) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
};
goog.object.isImmutableView = function(obj) {
  return !!Object.isFrozen && Object.isFrozen(obj);
};
goog.provide("goog.math");
goog.require("goog.array");
goog.require("goog.asserts");
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return angleRadians * 180 / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  if (d > 180) {
    d = d - 360;
  } else {
    if (d <= -180) {
      d = 360 + d;
    }
  }
  return d;
};
goog.math.sign = function(x) {
  if (x > 0) {
    return 1;
  }
  if (x < 0) {
    return -1;
  }
  return x;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b;
  };
  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
  };
  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];
  for (var i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }
  var result = [];
  var i = length1, j = length2;
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }
  return result;
};
goog.math.sum = function(var_args) {
  return (goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0));
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (sampleSize < 2) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.isNegativeZero = function(num) {
  return num == 0 && 1 / num < 0;
};
goog.math.log10Floor = function(num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num ? 1 : 0);
  }
  return num == 0 ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2E-15));
};
goog.provide("goog.iter");
goog.provide("goog.iter.Iterable");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.functions");
goog.require("goog.math");
goog.iter.Iterable;
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global["StopIteration"] : {message:"StopIteration", stack:""};
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if (typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while (true) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (!(i in iterable)) {
          i++;
          continue;
        }
        return iterable[i++];
      }
    };
    return newIter;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach((iterable), f, opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
    try {
      while (true) {
        f.call(opt_obj, iterable.next(), undefined, iterable);
      }
    } catch (ex$0) {
      if (ex$0 !== goog.iter.StopIteration) {
        throw ex$0;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (f.call(opt_obj, val, undefined, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if (arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop;
  }
  if (step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, undefined, iterator);
  };
  return newIter;
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while (true) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while (true) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true;
};
goog.iter.chain = function(var_args) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  var current = null;
  iter.next = function() {
    while (true) {
      if (current == null) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };
  return iter;
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue;
      } else {
        dropping = false;
      }
      return val;
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var val = iterator.next();
    if (f.call(opt_obj, val, undefined, iterator)) {
      return val;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.toArray = function(iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray((iterable));
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
};
goog.iter.equals = function(iterable1, iterable2, opt_equalsFn) {
  var fillValue = {};
  var pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  return goog.iter.every(pairs, function(pair) {
    return equalsFn(pair[0], pair[1]);
  });
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return !arr.length;
  });
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var iter = new goog.iter.Iterator;
  var arrays = arguments;
  var indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if (indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      });
      for (var i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (i == 0) {
          indicies = null;
          break;
        }
        indicies[i] = 0;
      }
      return retVal;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable);
  var cache = [];
  var cacheIndex = 0;
  var iter = new goog.iter.Iterator;
  var useCache = false;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = true;
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement;
  };
  return iter;
};
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0;
  var step = goog.isDef(opt_step) ? opt_step : 1;
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };
  return iter;
};
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator;
  iter.next = goog.functions.constant(value);
  return iter;
};
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var total = 0;
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    total += iterator.next();
    return total;
  };
  return iter;
};
goog.iter.zip = function(var_args) {
  var args = arguments;
  var iter = new goog.iter.Iterator;
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var arr = goog.array.map(iterators, function(it) {
        return it.next();
      });
      return arr;
    };
  }
  return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1);
  var iter = new goog.iter.Iterator;
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = false;
      var arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next();
          iteratorsHaveValues = true;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
    };
  }
  return iter;
};
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);
  return goog.iter.filter(iterable, function() {
    return !!selectorIterator.next();
  });
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable);
  this.keyFunc = opt_keyFunc || goog.functions.identity;
  this.targetKey;
  this.currentKey;
  this.currentValue;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  while (this.currentKey == this.targetKey) {
    this.currentValue = this.iterator.next();
    this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  var arr = [];
  while (this.currentKey == targetKey) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, undefined, iterator));
  };
  return iter;
};
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable);
  var num = goog.isNumber(opt_num) ? opt_num : 2;
  var buffers = goog.array.map(goog.array.range(num), function() {
    return [];
  });
  var addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
  };
  var createIterator = function(buffer) {
    var iter = new goog.iter.Iterator;
    iter.next = function() {
      if (goog.array.isEmpty(buffer)) {
        addNextIteratorValueToBuffers();
      }
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
    };
    return iter;
  };
  return goog.array.map(buffers, createIterator);
};
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0);
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  var remaining = limitSize;
  iter.next = function() {
    if (remaining-- > 0) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && count >= 0);
  var iterator = goog.iter.toIterator(iterable);
  while (count-- > 0) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && start >= 0);
  var iterator = goog.iter.consume(iterable, start);
  if (goog.isNumber(opt_end)) {
    goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start);
    iterator = goog.iter.limit(iterator, opt_end - start);
  }
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable);
  var length = goog.isNumber(opt_length) ? opt_length : elements.length;
  var sets = goog.array.repeat(elements, length);
  var product = goog.iter.product.apply(undefined, sets);
  return goog.iter.filter(product, function(arr) {
    return !goog.iter.hasDuplicates_(arr);
  });
};
goog.iter.combinations = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.iter.range(elements.length);
  var indexIterator = goog.iter.permutations(indexes, length);
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });
  var iter = new goog.iter.Iterator;
  function getIndexFromElements(index) {
    return elements[index];
  }
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.array.range(elements.length);
  var sets = goog.array.repeat(indexes, length);
  var indexIterator = goog.iter.product.apply(undefined, sets);
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });
  var iter = new goog.iter.Iterator;
  function getIndexFromElements(index) {
    return elements[index];
  }
  iter.next = function() {
    return goog.array.map((sortedIndexIterator.next()), getIndexFromElements);
  };
  return iter;
};
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.count_ = 0;
  this.version_ = 0;
  var argLength = arguments.length;
  if (argLength > 1) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    if (opt_map) {
      this.addAll((opt_map));
    }
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var rv = [];
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  return rv;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return (this.keys_.concat());
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true;
    }
  }
  return false;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return true;
  }
  if (this.count_ != otherMap.getCount()) {
    return false;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return false;
    }
  }
  return true;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if (this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_();
    }
    return true;
  }
  return false;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key];
  }
  return opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  if (!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push((key));
    this.version_++;
  }
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  var keys = this.getKeys();
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map;
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key);
  }
  return transposed;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {};
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true);
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false);
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0;
  var version = this.version_;
  var selfObj = this;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (version != selfObj.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (i >= selfObj.keys_.length) {
      throw goog.iter.StopIteration;
    }
    var key = selfObj.keys_[i++];
    return opt_keys ? key : selfObj.map_[key];
  };
  return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.astMatcher");
  var googObject = goog.require("goog.object");
  var isMatchWith = (require("lodash.ismatchwith"));
  function matchesAST(pattern) {
    function matchHelper(ast) {
      return isASTMatch(ast, pattern);
    }
    return matchHelper;
  }
  function isASTMatch(ast, pattern) {
    var extractedFields = {};
    function matchHelper(value, matcher) {
      if (typeof matcher === "function") {
        var matcherFn = (matcher);
        var result = matcherFn(value);
        if (goog.isObject(result)) {
          googObject.extend(extractedFields, result);
        }
        return !!result;
      } else {
        return undefined;
      }
    }
    var matches = isMatchWith(ast, pattern, matchHelper);
    return matches ? extractedFields : false;
  }
  function extractAST(fieldName, matcher) {
    function extractASTHelper(ast) {
      var extractedFields = {};
      extractedFields[fieldName] = ast;
      if (typeof matcher === "object") {
        matcher = matchesAST(matcher);
      }
      if (typeof matcher === "function") {
        var result = matcher(ast);
        if (typeof result === "object") {
          googObject.extend(extractedFields, result);
          return extractedFields;
        }
        if (!result) {
          return false;
        }
      }
      return extractedFields;
    }
    return extractASTHelper;
  }
  function matchesASTLength(pattern) {
    var matcher = matchesAST(pattern);
    function lengthMatcher(ast) {
      if (!goog.isArray(ast) || !goog.isArray(pattern)) {
        return false;
      }
      if (ast.length !== pattern.length) {
        return false;
      }
      return matcher(ast);
    }
    return lengthMatcher;
  }
  exports = {extractAST:extractAST, isASTMatch:isASTMatch, matchesAST:matchesAST, matchesASTLength:matchesASTLength};
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.ast");
  var astMatcher = goog.require("googlejs.astMatcher");
  function findAncestor(node, testFunction) {
    var parent = node.parent;
    while (!testFunction(parent) && parent.type !== "Program") {
      parent = parent.parent;
    }
    return testFunction(parent) ? parent : null;
  }
  function findAncestorOfType(node, type) {
    return findAncestor(node, function(ancestor) {
      return ancestor.type == type;
    });
  }
  function isLoop(node) {
    var anyLoopPattern = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/;
    return anyLoopPattern.test(node.type);
  }
  function isFunction(node) {
    var anyFunctionPattern = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/;
    return anyFunctionPattern.test(node.type);
  }
  function matchStringLiteral(node) {
    return astMatcher.isASTMatch(node, {type:"Literal", value:function(v) {
      return typeof v === "string";
    }});
  }
  function matchExtractStringLiteral(node, propertyName) {
    var name = propertyName || "literal";
    return astMatcher.isASTMatch(node, {type:"Literal", value:function(v) {
      return typeof v === "string" && astMatcher.extractAST(name)(v);
    }});
  }
  var GoogDependencyMatch;
  function matchExtractBareGoogRequire(node) {
    return (astMatcher.isASTMatch(node, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"require"}}, arguments:[function(v) {
      return matchExtractStringLiteral(v, "source");
    }]}}));
  }
  function matchExtractGoogProvide(node) {
    return (astMatcher.isASTMatch(node, {type:"ExpressionStatement", expression:{type:"CallExpression", callee:{type:"MemberExpression", object:{type:"Identifier", name:"goog"}, property:{type:"Identifier", name:"provide"}}, arguments:[function(v) {
      return matchExtractStringLiteral(v, "source");
    }]}}));
  }
  var DirectiveMatch;
  function matchExtractDirective(node) {
    return (astMatcher.isASTMatch(node, {type:"ExpressionStatement", expression:function(v) {
      return matchExtractStringLiteral(v, "directive");
    }}));
  }
  function getFullyQualifedName(node) {
    var fullName = node.name;
    var ancestor = node;
    while (ancestor.parent && ancestor.parent.type == "MemberExpression") {
      ancestor = (ancestor.parent);
      var identifier = (ancestor.property);
      fullName += "." + identifier.name;
    }
    return fullName;
  }
  exports = {GoogDependencyMatch:GoogDependencyMatch, findAncestor:findAncestor, findAncestorOfType:findAncestorOfType, getFullyQualifedName:getFullyQualifedName, isLoop:isLoop, isFunction:isFunction, matchExtractBareGoogRequire:matchExtractBareGoogRequire, matchExtractGoogProvide:matchExtractGoogProvide, matchExtractDirective:matchExtractDirective, matchExtractStringLiteral:matchExtractStringLiteral, matchStringLiteral:matchStringLiteral};
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.indent");
  var ast = goog.require("googlejs.ast");
  var functions = goog.require("goog.functions");
  var googString = goog.require("goog.string");
  var utils = goog.require("googlejs.utils");
  var IndentInfo = function() {
  };
  IndentInfo.prototype.space;
  IndentInfo.prototype.tab;
  IndentInfo.prototype.goodChar;
  IndentInfo.prototype.badChar;
  function isIndentCharacter_(character) {
    return character == " " || character == "\t";
  }
  function isTab_(char) {
    return char == "\t";
  }
  function getNodeIndent_(node, sourceCode, indentType, opt_byLastLine) {
    var token = opt_byLastLine ? sourceCode.getLastToken(node) : sourceCode.getFirstToken(node);
    var srcCharsBeforeNode = (Array.from(sourceCode.getText(token, token.loc.start.column)));
    var indentChars = srcCharsBeforeNode.slice(0, srcCharsBeforeNode.findIndex(functions.not(isIndentCharacter_)));
    var spaces = indentChars.filter(googString.isSpace).length;
    var tabs = indentChars.filter(isTab_).length;
    return {space:spaces, tab:tabs, goodChar:indentType === "space" ? spaces : tabs, badChar:indentType === "space" ? tabs : spaces};
  }
  function isNodeFirstInLine_(node, sourceCode, opt_byEndLocation) {
    var firstToken = opt_byEndLocation === true ? sourceCode.getLastToken(node, 1) : sourceCode.getTokenBefore(node);
    var startLine = opt_byEndLocation === true ? node.loc.end.line : node.loc.start.line;
    var endLine = firstToken ? firstToken.loc.end.line : -1;
    return startLine !== endLine;
  }
  function isNodeInVarOnTop_(node, varNode) {
    return !!varNode && varNode.parent.loc.start.line === node.loc.start.line && varNode.parent.declarations.length > 1;
  }
  function isCalleeNodeFirstArgMultiline_(node) {
    if (node.arguments.length >= 1) {
      return node.arguments[0].loc.end.line > node.arguments[0].loc.start.line;
    } else {
      return false;
    }
  }
  function isGoogScopeFunction_(node) {
    if (node.parent.type !== "CallExpression") {
      return false;
    }
    var parent = (node.parent);
    if (parent.callee.type !== "MemberExpression") {
      return false;
    }
    var callee = (parent.callee);
    if (callee.object.type !== "Identifier" || callee.property.type !== "Identifier") {
      return false;
    }
    var calleeObject = (callee.object);
    var calleeProperty = (callee.property);
    return calleeObject.name === "goog" && calleeProperty.name === "scope";
  }
  function isOuterIIFE_(node) {
    if (isGoogScopeFunction_(node)) {
      return true;
    }
    var parent = node.parent;
    var stmt = parent.parent;
    if (parent.type !== "CallExpression") {
      return false;
    }
    if ((parent).callee !== node) {
      return false;
    }
    while (stmt.type === "UnaryExpression" || stmt.type === "AssignmentExpression" || stmt.type === "LogicalExpression" || stmt.type === "SequenceExpression" || stmt.type === "VariableDeclarator") {
      if (stmt.type === "UnaryExpression") {
        var unaryStmt = (stmt);
        if (unaryStmt.operator === "!" || unaryStmt.operator === "~" || unaryStmt.operator === "+" || unaryStmt.operator === "-") {
          stmt = stmt.parent;
        } else {
          break;
        }
      } else {
        stmt = stmt.parent;
      }
    }
    return (stmt.type === "ExpressionStatement" || stmt.type === "VariableDeclaration") && stmt.parent && stmt.parent.type === "Program";
  }
  function isFirstArrayElementOnSameLine_(node) {
    if (node.type !== "ArrayExpression") {
      return false;
    }
    var arrayNode = (node);
    if (arrayNode.elements[0]) {
      return arrayNode.elements[0].type === "ObjectExpression" && arrayNode.elements[0].loc.start.line === arrayNode.loc.start.line;
    } else {
      return false;
    }
  }
  function getLeadingVariableDeclarators_(varDeclaration) {
    function collectVariableDeclarators(finalCollection, elem) {
      var lastElem = finalCollection[finalCollection.length - 1];
      if (elem.loc.start.line !== varDeclaration.loc.start.line && !lastElem || lastElem && lastElem.loc.start.line !== elem.loc.start.line) {
        finalCollection.push(elem);
      }
      return finalCollection;
    }
    return varDeclaration.declarations.reduce(collectVariableDeclarators, []);
  }
  var IndentOptionsVariableDeclarator;
  var IndentOptionsFunction;
  var IndentOption;
  var IndentOptionShortHand;
  var IndentOptionsRaw;
  var IndentPreference;
  function buildDefaultPreferences_() {
    var DEFAULT_INDENT_TYPE = "space";
    var DEFAULT_INDENT_SIZE = 4;
    var DEFAULT_INDENT_OPTIONS = {SwitchCase:0, VariableDeclarator:{var:1, let:1, const:1}, outerIIFEBody:-1, MemberExpression:-1, FunctionDeclaration:{parameters:-1, body:1}, FunctionExpression:{parameters:-1, body:1}};
    return {indentSize:DEFAULT_INDENT_SIZE, indentType:DEFAULT_INDENT_TYPE, indentOptions:DEFAULT_INDENT_OPTIONS};
  }
  function buildIndentPreferences_(userOptions) {
    var preferences = buildDefaultPreferences_();
    var options = preferences.indentOptions;
    if (userOptions.length > 0) {
      if (userOptions[0] == "tab") {
        preferences.indentSize = 1;
        preferences.indentType = "tab";
      } else {
        if (typeof userOptions[0] === "number") {
          preferences.indentSize = (userOptions[0]);
          preferences.indentType = "space";
        }
      }
      if (userOptions[1]) {
        var opts = (userOptions[1]);
        options.SwitchCase = opts.SwitchCase || 0;
        if (typeof opts.VariableDeclarator === "number") {
          var variableDeclaratorIndent = (opts.VariableDeclarator);
          options.VariableDeclarator = {var:variableDeclaratorIndent, let:variableDeclaratorIndent, const:variableDeclaratorIndent};
        } else {
          if (typeof opts.VariableDeclarator === "object") {
            Object.assign(options.VariableDeclarator, (opts.VariableDeclarator));
          }
        }
        if (typeof opts.outerIIFEBody === "number") {
          options.outerIIFEBody = (opts.outerIIFEBody);
        }
        if (typeof opts.MemberExpression === "number") {
          options.MemberExpression = (opts.MemberExpression);
        }
        if (typeof opts.FunctionDeclaration === "object") {
          Object.assign(options.FunctionDeclaration, (opts.FunctionDeclaration));
        }
        if (typeof opts.FunctionExpression === "object") {
          Object.assign(options.FunctionExpression, (opts.FunctionExpression));
        }
      }
    }
    return preferences;
  }
  function create(context) {
    var indentPreferences = buildIndentPreferences_((context.options));
    var indentType = indentPreferences.indentType;
    var indentSize = indentPreferences.indentSize;
    var options = indentPreferences.indentOptions;
    var sourceCode = context.getSourceCode();
    var caseIndentStore = {};
    function createErrorMessage(expectedAmount, actualSpaces, actualTabs) {
      var expectedStatement = expectedAmount + " " + indentType + (expectedAmount === 1 ? "" : "s");
      var foundSpacesWord = "space" + (actualSpaces === 1 ? "" : "s");
      var foundTabsWord = "tab" + (actualTabs === 1 ? "" : "s");
      var foundStatement;
      if (actualSpaces > 0 && actualTabs > 0) {
        foundStatement = actualSpaces + " " + foundSpacesWord + " and " + (actualTabs + " " + foundTabsWord);
      } else {
        if (actualSpaces > 0) {
          foundStatement = indentType === "space" ? actualSpaces : actualSpaces + " " + foundSpacesWord;
        } else {
          if (actualTabs > 0) {
            foundStatement = indentType === "tab" ? actualTabs : actualTabs + " " + foundTabsWord;
          } else {
            foundStatement = "0";
          }
        }
      }
      return "Expected indentation of " + expectedStatement + " but" + (" found " + foundStatement + ".");
    }
    function report(node, needed, gottenSpaces, gottenTabs, opt_loc, opt_isLastNodeCheck) {
      var desiredIndent = (indentType === "space" ? " " : "\t").repeat(needed);
      var textRange = opt_isLastNodeCheck ? [node.range[1] - gottenSpaces - gottenTabs - 1, node.range[1] - 1] : [node.range[0] - gottenSpaces - gottenTabs, node.range[0]];
      context.report({node:node, loc:opt_loc, message:createErrorMessage(needed, gottenSpaces, gottenTabs), fix:function(fixer) {
        return fixer.replaceTextRange(textRange, desiredIndent);
      }});
    }
    function checkNodeIndent(node, neededIndent) {
      var actualIndent = getNodeIndent_(node, sourceCode, indentType, false);
      if (node.type !== "ArrayExpression" && node.type !== "ObjectExpression" && (actualIndent.goodChar !== neededIndent || actualIndent.badChar !== 0) && isNodeFirstInLine_(node, sourceCode)) {
        report(node, neededIndent, actualIndent.space, actualIndent.tab);
      }
    }
    function checkNodesIndent(nodes, indent) {
      nodes.forEach(function(node) {
        return checkNodeIndent(node, indent);
      });
    }
    function checkLastNodeLineIndent(node, lastLineIndent) {
      var lastToken = sourceCode.getLastToken(node);
      var endIndent = getNodeIndent_(lastToken, sourceCode, indentType, true);
      if ((endIndent.goodChar !== lastLineIndent || endIndent.badChar !== 0) && isNodeFirstInLine_(node, sourceCode, true)) {
        var location = {start:{line:lastToken.loc.start.line, column:lastToken.loc.start.column}};
        report(node, lastLineIndent, endIndent.space, endIndent.tab, location, true);
      }
    }
    function checkFirstNodeLineIndent(node, firstLineIndent) {
      var startIndent = getNodeIndent_(node, sourceCode, indentType, false);
      if ((startIndent.goodChar !== firstLineIndent || startIndent.badChar !== 0) && isNodeFirstInLine_(node, sourceCode)) {
        var location = {start:{line:node.loc.start.line, column:node.loc.start.column}};
        report(node, firstLineIndent, startIndent.space, startIndent.tab, location);
      }
    }
    function getFunctionBaseIndent(functionNode) {
      var indent = getNodeIndent_(functionNode, sourceCode, indentType).goodChar;
      var parent = functionNode.parent;
      if (parent.type === "Property" || parent.type === "ArrayExpression") {
        indent = getNodeIndent_(functionNode, sourceCode, indentType, false).goodChar;
      } else {
        if (parent.type === "CallExpression") {
          var calleeParent = (parent);
          if (isCalleeNodeFirstArgMultiline_(calleeParent) && utils.isNodeOneLine(calleeParent.callee) && !isNodeFirstInLine_(functionNode, sourceCode)) {
            indent = getNodeIndent_(calleeParent, sourceCode, indentType).goodChar;
          }
        }
      }
      return indent;
    }
    function checkFunctionIndent(functionNode) {
      var bodyNode = (functionNode.body);
      var baseIndent = getFunctionBaseIndent(functionNode);
      var bodyIndent = baseIndent;
      var functionOffset = indentSize;
      if (options.outerIIFEBody !== -1 && isOuterIIFE_(functionNode)) {
        functionOffset = options.outerIIFEBody * indentSize;
      } else {
        if (functionNode.type === "FunctionExpression") {
          functionOffset = options.FunctionExpression.body * indentSize;
        } else {
          if (functionNode.type === "FunctionDeclaration") {
            functionOffset = options.FunctionDeclaration.body * indentSize;
          }
        }
      }
      bodyIndent += functionOffset;
      var parentVarNode = (ast.findAncestorOfType(functionNode, "VariableDeclarator"));
      if (parentVarNode && isNodeInVarOnTop_(functionNode, parentVarNode)) {
        bodyIndent += indentSize * options.VariableDeclarator[parentVarNode.parent.kind];
      }
      checkBlockIndent(bodyNode, bodyIndent, bodyIndent - functionOffset);
    }
    function checkClassIndent(classNode) {
      if (utils.isNodeOneLine(classNode)) {
        return;
      }
      var classBody = classNode.body;
      var baseIndent = getFunctionBaseIndent(classNode);
      var bodyIndent = baseIndent + indentSize;
      checkBlockIndent(classBody, bodyIndent, baseIndent);
    }
    function checkArrayExpressionIndent(node) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      var elements = node.elements.filter(function(elem) {
        return elem != null;
      });
      if (elements.length > 0 && utils.nodesStartOnSameLine(elements[0], node)) {
        return;
      }
      var elementsIndent = getIndentforObjectOrArrayElements(node);
      checkNodesIndent(elements, elementsIndent);
      checkLastNodeLineIndent(node, elementsIndent - indentSize);
    }
    function checkObjectExpressionIndent(node) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      var elements = node.properties;
      if (elements.length > 0 && utils.nodesStartOnSameLine(elements[0], node)) {
        return;
      }
      var elementsIndent = getIndentforObjectOrArrayElements(node);
      checkNodesIndent(elements, elementsIndent);
      checkLastNodeLineIndent(node, elementsIndent - indentSize);
    }
    function getIndentforObjectOrArrayElements(node) {
      var parent = node.parent;
      var varDeclAncestor = (ast.findAncestorOfType(node, "VariableDeclarator"));
      var baseIndent = getNodeIndent_(parent, sourceCode, indentType).goodChar;
      var elementsIndent;
      if (isNodeFirstInLine_(node, sourceCode)) {
        if (varDeclAncestor) {
          if (parent === varDeclAncestor) {
            if (varDeclAncestor === varDeclAncestor.parent.declarations[0]) {
              baseIndent = baseIndent + indentSize * options.VariableDeclarator[varDeclAncestor.parent.kind];
            }
          } else {
            if (parent.type === "ObjectExpression" || parent.type === "ArrayExpression" || parent.type === "CallExpression" || parent.type === "ArrowFunctionExpression" || parent.type === "NewExpression" || parent.type === "LogicalExpression") {
              baseIndent = baseIndent + indentSize;
            }
          }
        } else {
          if (!isFirstArrayElementOnSameLine_(parent) && parent.type !== "MemberExpression" && parent.type !== "ExpressionStatement" && parent.type !== "AssignmentExpression" && parent.type !== "Property") {
            baseIndent = baseIndent + indentSize;
          }
        }
        elementsIndent = baseIndent + indentSize;
        checkFirstNodeLineIndent(node, baseIndent);
      } else {
        baseIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
        elementsIndent = baseIndent + indentSize;
      }
      if (isNodeInVarOnTop_(node, varDeclAncestor)) {
        elementsIndent += indentSize * options.VariableDeclarator[(varDeclAncestor).parent.kind];
      }
      return elementsIndent;
    }
    function checkBlockIndent(node, bodyIndent, closingIndent) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      checkNodesIndent(node.body, bodyIndent);
      checkLastNodeLineIndent(node, closingIndent);
    }
    function checkBlockStatementIndent(blockNode) {
      if (utils.isNodeOneLine(blockNode)) {
        return;
      }
      if (!(blockNode.parent.type == "BlockStatement" || blockNode.parent.type == "Program")) {
        return;
      }
      var baseIndent = getNodeIndent_(blockNode, sourceCode, indentType).goodChar;
      var bodyIndent = baseIndent + indentSize;
      checkBlockIndent(blockNode, bodyIndent, baseIndent);
    }
    function checkIfStatementIndent(node) {
      var baseIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
      var expectedIndent = baseIndent + indentSize;
      if (node.consequent.type !== "BlockStatement") {
        if (!utils.nodesStartOnSameLine(node, node.consequent)) {
          checkNodeIndent(node.consequent, expectedIndent);
        }
      } else {
        checkNodesIndent((node.consequent).body, expectedIndent);
        checkLastNodeLineIndent(node.consequent, baseIndent);
      }
      if (node.alternate) {
        var elseKeyword = sourceCode.getTokenBefore(node.alternate);
        checkNodeIndent(elseKeyword, baseIndent);
        if (node.alternate.type !== "BlockStatement") {
          if (!utils.nodesStartOnSameLine(node.alternate, elseKeyword)) {
            checkNodeIndent(node.alternate, expectedIndent);
          }
        } else {
          checkNodesIndent((node.alternate).body, expectedIndent);
          checkLastNodeLineIndent(node.alternate, baseIndent);
        }
      }
    }
    function checkVariableDeclarationIndent(node) {
      var startDeclarator = node.declarations[0];
      var endDeclarator = node.declarations[node.declarations.length - 1];
      if (utils.nodesStartOnSameLine(startDeclarator, endDeclarator)) {
        return;
      }
      var elements = getLeadingVariableDeclarators_(node);
      var nodeIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
      var lastElement = elements[elements.length - 1];
      var elementsIndent = nodeIndent + indentSize * options.VariableDeclarator[node.kind];
      checkNodesIndent(elements, elementsIndent);
      if (sourceCode.getLastToken(node).loc.end.line <= lastElement.loc.end.line) {
        return;
      }
      var tokenBeforeLastElement = sourceCode.getTokenBefore(lastElement);
      if (tokenBeforeLastElement.value === ",") {
        checkLastNodeLineIndent(node, getNodeIndent_(tokenBeforeLastElement, sourceCode, indentType).goodChar);
      } else {
        checkLastNodeLineIndent(node, elementsIndent - indentSize);
      }
    }
    function checkOptionallyBodiedIndent(node) {
      var baseIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
      var bodyIndent = baseIndent + indentSize;
      if (node.body.type === "BlockStatement") {
        checkBlockIndent((node.body), bodyIndent, baseIndent);
      } else {
        var nodesToCheck = [node.body];
        checkNodesIndent(nodesToCheck, bodyIndent);
      }
    }
    function checkFunctionParamsIndent(node, indentSize, indentMultiple) {
      if (indentMultiple === "first" && node.params.length) {
        checkNodesIndent(node.params.slice(1), node.params[0].loc.start.column);
      } else {
        checkNodesIndent(node.params, indentSize * (indentMultiple));
      }
    }
    function expectedCaseIndent(node, opt_switchIndent) {
      var switchNode = (node.type === "SwitchStatement" ? node : node.parent);
      var caseIndent;
      if (caseIndentStore[switchNode.loc.start.line]) {
        return caseIndentStore[switchNode.loc.start.line];
      } else {
        if (typeof opt_switchIndent === "undefined") {
          opt_switchIndent = getNodeIndent_(switchNode, sourceCode, indentType).goodChar;
        }
        if (switchNode.cases.length > 0 && options.SwitchCase === 0) {
          caseIndent = opt_switchIndent;
        } else {
          caseIndent = opt_switchIndent + indentSize * options.SwitchCase;
        }
        caseIndentStore[switchNode.loc.start.line] = caseIndent;
        return caseIndent;
      }
    }
    return {Program:function(node) {
      checkNodesIndent(node.body, 0);
    }, ClassDeclaration:checkClassIndent, ClassExpression:checkClassIndent, BlockStatement:checkBlockStatementIndent, DoWhileStatement:checkOptionallyBodiedIndent, ForStatement:checkOptionallyBodiedIndent, ForInStatement:checkOptionallyBodiedIndent, ForOfStatement:checkOptionallyBodiedIndent, WhileStatement:checkOptionallyBodiedIndent, WithStatement:checkOptionallyBodiedIndent, IfStatement:checkIfStatementIndent, VariableDeclaration:checkVariableDeclarationIndent, ObjectExpression:checkObjectExpressionIndent, 
    ArrayExpression:checkArrayExpressionIndent, MemberExpression:function(node) {
      if (options.MemberExpression === -1) {
        return;
      }
      if (utils.isNodeOneLine(node)) {
        return;
      }
      if (ast.findAncestorOfType(node, "VariableDeclarator")) {
        return;
      }
      if (ast.findAncestorOfType(node, "AssignmentExpression")) {
        return;
      }
      var propertyIndent = getNodeIndent_(node, sourceCode, indentType).goodChar + indentSize * options.MemberExpression;
      var checkNodes = [node.property];
      var dot = sourceCode.getTokenBefore(node.property);
      if (dot.type === "Punctuator" && dot.value === ".") {
        checkNodes.push(dot);
      }
      checkNodesIndent(checkNodes, propertyIndent);
    }, SwitchStatement:function(node) {
      var switchIndent = getNodeIndent_(node, sourceCode, indentType).goodChar;
      var caseIndent = expectedCaseIndent(node, switchIndent);
      checkNodesIndent(node.cases, caseIndent);
      checkLastNodeLineIndent(node, switchIndent);
    }, SwitchCase:function(node) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      var caseIndent = expectedCaseIndent(node);
      checkNodesIndent(node.consequent, caseIndent + indentSize);
    }, ArrowFunctionExpression:function(node) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      if (node.body.type === "BlockStatement") {
        checkFunctionIndent(node);
      } else {
      }
    }, FunctionDeclaration:function(node) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      if (options.FunctionDeclaration.parameters !== -1) {
        checkFunctionParamsIndent(node, indentSize, options.FunctionDeclaration.parameters);
      }
      checkFunctionIndent(node);
    }, FunctionExpression:function(node) {
      if (utils.isNodeOneLine(node)) {
        return;
      }
      if (options.FunctionExpression.parameters !== -1) {
        checkFunctionParamsIndent(node, indentSize, options.FunctionExpression.parameters);
      }
      checkFunctionIndent(node);
    }};
  }
  var INDENT_RULE = {meta:{docs:{description:"enforce consistent indentation", category:"Stylistic Issues", recommended:false}, fixable:"whitespace", schema:[{oneOf:[{enum:["tab"]}, {type:"integer", minimum:0}]}, {type:"object", properties:{SwitchCase:{type:"integer", minimum:0}, VariableDeclarator:{oneOf:[{type:"integer", minimum:0}, {type:"object", properties:{var:{type:"integer", minimum:0}, let:{type:"integer", minimum:0}, const:{type:"integer", minimum:0}}}]}, outerIIFEBody:{type:"integer", 
  minimum:0}, MemberExpression:{type:"integer", minimum:0}, FunctionDeclaration:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}, FunctionExpression:{type:"object", properties:{parameters:{oneOf:[{type:"integer", minimum:0}, {enum:["first"]}]}, body:{type:"integer", minimum:0}}}}, additionalProperties:false}]}, create:create};
  exports = INDENT_RULE;
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.inlineCommentSpacing");
  var utils = goog.require("googlejs.utils");
  var DEFAULT_PRECEDING_SPACES = 1;
  var INLINE_COMMENT_SPACING_RULE = {meta:{docs:{description:"enforce consistent spacing before the `//` at line end", category:"Stylistic Issues", recommended:false}, fixable:"whitespace", schema:[{type:"integer", minimum:0, maximum:5}]}, create:function(context) {
    var minPrecedingSpaces = context.options[0] == null ? DEFAULT_PRECEDING_SPACES : (context.options[0]);
    function checkLineCommentForPrecedingSpace(commentNode) {
      var sourceCode = context.getSourceCode();
      sourceCode.getComments(commentNode);
      var previousToken = sourceCode.getTokenBefore(commentNode, 1) || sourceCode.getTokenOrCommentBefore(commentNode);
      if (previousToken == null || !utils.nodesShareOneLine(commentNode, previousToken)) {
        return;
      }
      var whiteSpaceGap = commentNode.start - previousToken.end;
      if (whiteSpaceGap < minPrecedingSpaces) {
        var spacesNoun = minPrecedingSpaces === 1 ? "space" : "spaces";
        context.report({node:commentNode, message:"Expected at least " + minPrecedingSpaces + " " + spacesNoun + " " + "before inline comment.", fix:function(fixer) {
          var numNeededSpaces = minPrecedingSpaces - whiteSpaceGap;
          var spaces = (new Array(numNeededSpaces + 1)).join(" ");
          return fixer.insertTextBefore(commentNode, spaces);
        }});
      }
    }
    return {LineComment:checkLineCommentForPrecedingSpace};
  }};
  exports = INLINE_COMMENT_SPACING_RULE;
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.jsdocUtils");
  var array = goog.require("goog.array");
  var astMatcher = goog.require("googlejs.astMatcher");
  var doctrine = (require("doctrine"));
  function isLiteral(tagType) {
    return tagType.type === "NullableLiteral" || tagType.type === "AllLiteral" || tagType.type === "NullLiteral" || tagType.type === "UndefinedLiteral" || tagType.type === "VoidLiteral" || tagType.type === "StringLiteralType" || tagType.type === "NumericLiteralType";
  }
  function isTerminal(tagType) {
    return isLiteral(tagType) || tagType.type === "NameExpression";
  }
  function isVoid(tagType) {
    var isVoidLiteral = tagType.type == "VoidLiteral";
    var isVoidNameExpression = tagType.type == "NameExpression" && (tagType).name == "void";
    return isVoidLiteral || isVoidNameExpression;
  }
  function hasTypeInformation(jsdocComment) {
    var typeInfoTags = ["type", "typedef", "record", "const", "private", "package", "protected", "public", "export"];
    var isTypeInfo = function(tag) {
      return array.contains(typeInfoTags, tag.title);
    };
    return jsdocComment.tags.some(isTypeInfo);
  }
  function parseComment(jsdocString) {
    try {
      return doctrine.parse(jsdocString, {strict:true, unwrap:true, sloppy:true});
    } catch (ex) {
      if (ex instanceof Error && /braces/i.test(ex.message)) {
        throw new Error("JSDoc type missing brace.");
      } else {
        throw new Error("JSDoc syntax error.");
      }
    }
  }
  function traverseTags(tagType, visitor) {
    visitor(tagType);
    if (isTerminal(tagType)) {
      return;
    }
    switch(tagType.type) {
      case "ArrayType":
        (tagType).elements.forEach(function(tag) {
          return traverseTags(tag, visitor);
        });
        break;
      case "RecordType":
        (tagType).fields.forEach(function(tag) {
          return traverseTags(tag, visitor);
        });
        break;
      case "FunctionType":
        var functionType = (tagType);
        if (functionType.this) {
          traverseTags(functionType.this, visitor);
        }
        functionType.params.forEach(function(tag) {
          return traverseTags(tag, visitor);
        });
        if (functionType.result) {
          traverseTags(functionType.result, visitor);
        }
        break;
      case "FieldType":
        var fieldType = (tagType);
        if (fieldType.value) {
          traverseTags(fieldType.value, visitor);
        }
        break;
      case "ParameterType":
      case "RestType":
      case "NonNullableType":
      case "OptionalType":
      case "NullableType":
        traverseTags((tagType).expression, visitor);
        break;
      case "TypeApplication":
        var t = (tagType);
        traverseTags(t.expression, visitor);
        t.applications.forEach(function(tag) {
          return traverseTags(tag, visitor);
        });
        break;
      case "UnionType":
        (tagType).elements.forEach(function(tag) {
          return traverseTags(tag, visitor);
        });
        break;
      default:
        throw new Error("Unrecoginized tag type: " + tagType + ".");
    }
  }
  function isJSDocComment(commentToken) {
    return commentToken.type === "Block" && commentToken.value.charAt(0) === "*";
  }
  function isVariableFunctionOrClassExpression_(node) {
    var functionClassTypes = ["FunctionExpression", "ArrowFunctionExpression", "ClassExpression"];
    var isFunctionOrClass = function(subNode) {
      return !!subNode && functionClassTypes.indexOf(subNode.type) !== -1;
    };
    var variableHasFunctionOrClass = (astMatcher.isASTMatch(node, {type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", init:isFunctionOrClass}]}));
    return variableHasFunctionOrClass;
  }
  function getJSDocComment(node) {
    if (!node.leadingComments || node.leadingComments.length == 0) {
      return null;
    }
    if (isVariableFunctionOrClassExpression_(node)) {
      return null;
    }
    var closestDocComment = (node.leadingComments.filter(isJSDocComment).reverse().pop()) || null;
    return closestDocComment;
  }
  exports = {getJSDocComment:getJSDocComment, hasTypeInformation:hasTypeInformation, isLiteral:isLiteral, isVoid:isVoid, isJSDocComment:isJSDocComment, parseComment:parseComment, traverseTags:traverseTags};
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.jsdoc");
  var googMap = goog.require("goog.structs.Map");
  var jsdocUtils = goog.require("googlejs.jsdocUtils");
  var utils = goog.require("googlejs.utils");
  var doctrine = (require("doctrine"));
  function isValidReturnType_(tag) {
    return !goog.isDefAndNotNull(tag.type) || jsdocUtils.isVoid(tag.type) || tag.type.type === "UndefinedLiteral";
  }
  var JSDocOption;
  var FunctionReturnInfo;
  var BUILT_IN_TYPES = ["string", "number", "boolean", "Object", "Array", "Map", "Set"];
  function isbuiltInType(tagName) {
    return BUILT_IN_TYPES.indexOf(tagName) !== -1;
  }
  function markTypeVariablesAsUsed(context, tag) {
    if (!tag.type) {
      return;
    }
    jsdocUtils.traverseTags(tag.type, function(childTag) {
      if (childTag.type === "NameExpression") {
        var name = (childTag).name;
        if (!isbuiltInType(name)) {
          context.markVariableAsUsed(name);
        }
      }
    });
  }
  function create(context) {
    var fns = [];
    var sourceCode = context.getSourceCode();
    var options = (context.options[0]) || {};
    var prefer = new googMap(options.prefer);
    debugger;
    var requireReturn = !!options.requireReturn;
    var requireParamDescription = options.requireParamDescription !== false;
    var requireReturnDescription = options.requireReturnDescription !== false;
    var requireReturnType = options.requireReturnType !== false;
    var preferType = options.preferType || {};
    var checkPreferType = Object.keys(preferType).length !== 0;
    function startFunction(node) {
      fns.push({returnPresent:node.type === "ArrowFunctionExpression" && node.body.type !== "BlockStatement" || utils.isNodeClassType(node)});
    }
    function addReturn(node) {
      var functionState = fns[fns.length - 1];
      if (functionState && !goog.isNull(node.argument)) {
        functionState.returnPresent = true;
      }
    }
    function checkTypeName(tagType, node) {
      var name = tagType.name;
      var expectedName = preferType[name];
      if (expectedName) {
        context.report({node:node, message:"Use '" + expectedName + "' instead of '" + name + "'."});
      }
    }
    function checkTypeNames(node, tagType) {
      jsdocUtils.traverseTags(tagType, function(tag) {
        if (tag.type === "NameExpression") {
          checkTypeName((tag), node);
        }
      });
    }
    function checkVariableJSDoc(varDeclaration) {
      if (varDeclaration.declarations.length !== 1) {
        return;
      }
      var comment = jsdocUtils.getJSDocComment(varDeclaration);
      if (!comment) {
        return;
      }
      var jsdoc;
      try {
        jsdoc = jsdocUtils.parseComment(comment.value);
      } catch (e) {
        return;
      }
      var node = varDeclaration.declarations[0];
      if (node.id.type !== "Identifier") {
        return;
      }
      var name = (node.id).name;
      if (jsdocUtils.hasTypeInformation(jsdoc)) {
        context.markVariableAsUsed(name);
      }
      jsdoc.tags.forEach(function(tag) {
        markTypeVariablesAsUsed(context, tag);
      });
    }
    function checkJSDoc(node) {
      var jsdocNode = (sourceCode.getJSDocComment(node));
      var functionData = fns.pop();
      var params = Object.create(null);
      var hasReturns = false;
      var hasConstructor = false;
      var isInterface = false;
      var isOverride = false;
      var isAbstract = false;
      var jsdoc;
      if (jsdocNode) {
        try {
          jsdoc = doctrine.parse(jsdocNode.value, {strict:true, unwrap:true, sloppy:true});
        } catch (ex) {
          if (/braces/i.test(ex.message)) {
            context.report({node:jsdocNode, message:"JSDoc type missing brace."});
          } else {
            context.report({node:jsdocNode, message:"JSDoc syntax error."});
          }
          return;
        }
        jsdoc.tags.forEach(function(tag) {
          switch(tag.title.toLowerCase()) {
            case "param":
            case "arg":
            case "argument":
              if (!tag.type) {
                context.report({node:jsdocNode, message:"Missing JSDoc parameter type for '" + tag.name + "'."});
              }
              if (!tag.description && requireParamDescription) {
                context.report({node:jsdocNode, message:"Missing JSDoc parameter description for " + ("'" + tag.name + "'.")});
              }
              if (params[tag.name]) {
                context.report({node:jsdocNode, message:"Duplicate JSDoc parameter '" + tag.name + "'."});
              } else {
                if (tag.name.indexOf(".") === -1) {
                  params[tag.name] = 1;
                }
              }
              break;
            case "return":
            case "returns":
              hasReturns = true;
              if (!requireReturn && !functionData.returnPresent && (goog.isNull(tag.type) || !isValidReturnType_(tag)) && !isAbstract) {
                context.report({node:jsdocNode, message:"Unexpected @{{title}} tag; function has no return " + "statement.", data:{title:tag.title}});
              } else {
                if (requireReturnType && !tag.type) {
                  context.report({node:jsdocNode, message:"Missing JSDoc return type."});
                }
                if (!isValidReturnType_(tag) && !tag.description && requireReturnDescription) {
                  context.report({node:jsdocNode, message:"Missing JSDoc return description."});
                }
              }
              break;
            case "constructor":
            case "class":
              hasConstructor = true;
              break;
            case "override":
            case "inheritdoc":
              isOverride = true;
              break;
            case "abstract":
            case "virtual":
              isAbstract = true;
              break;
            case "interface":
              isInterface = true;
              break;
          }
          var tagMismatch = prefer.containsKey(tag.title) && tag.title != prefer.get(tag.title);
          if (tagMismatch) {
            context.report({node:jsdocNode, message:"Use @{{name}} instead.", data:{name:prefer.get(tag.title)}});
          }
          markTypeVariablesAsUsed(context, tag);
          if (checkPreferType && tag.type) {
            checkTypeNames(jsdocNode, tag.type);
          }
        });
        if (!isOverride && !hasReturns && !hasConstructor && !isInterface && !utils.isNodeGetterFunction(node) && !utils.isNodeSetterFunction(node) && !utils.isNodeConstructorFunction(node) && !utils.isNodeClassType(node)) {
          if (requireReturn || functionData.returnPresent) {
            context.report({node:jsdocNode, message:"Missing JSDoc @{return} for function.", data:{returns:prefer.get("returns", "returns")}});
          }
        }
        var jsdocParams = Object.keys(params);
        if (node.params) {
          node.params.forEach(function(param, i) {
            if (param.type === "AssignmentPattern") {
              param = param.left;
            }
            var name = param.name;
            if (param.type === "Identifier") {
              if (jsdocParams[i] && name !== jsdocParams[i]) {
                context.report({node:jsdocNode, message:"Expected JSDoc for '" + name + "' but found " + ("'" + jsdocParams[i] + "'.")});
              } else {
                if (!params[name] && !isOverride) {
                  context.report({node:jsdocNode, message:"Missing JSDoc for parameter '" + name + "'."});
                }
              }
            }
          });
        }
        if (options.matchDescription) {
          var regex = new RegExp(options.matchDescription);
          if (!regex.test(jsdoc.description)) {
            context.report({node:jsdocNode, message:"JSDoc description does not satisfy the regex pattern."});
          }
        }
      }
    }
    return {"ArrowFunctionExpression":startFunction, "FunctionExpression":startFunction, "FunctionDeclaration":startFunction, "ClassExpression":startFunction, "ClassDeclaration":startFunction, "ArrowFunctionExpression:exit":checkJSDoc, "FunctionExpression:exit":checkJSDoc, "FunctionDeclaration:exit":checkJSDoc, "ClassExpression:exit":checkJSDoc, "ClassDeclaration:exit":checkJSDoc, "ReturnStatement":addReturn, "VariableDeclaration":checkVariableJSDoc};
  }
  var JSDOC_RULE = {meta:{docs:{description:"enforce valid JSDoc comments", category:"Possible Errors", recommended:true}, schema:[{type:"object", properties:{prefer:{type:"object", additionalProperties:{type:"string"}}, preferType:{type:"object", additionalProperties:{type:"string"}}, requireReturn:{type:"boolean"}, requireParamDescription:{type:"boolean"}, requireReturnDescription:{type:"boolean"}, matchDescription:{type:"string"}, requireReturnType:{type:"boolean"}}, additionalProperties:false}]}, 
  create:create};
  exports = JSDOC_RULE;
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.noUndef");
  var ast = goog.require("googlejs.ast");
  var utils = goog.require("googlejs.utils");
  function hasTypeOfOperator(node) {
    var parent = node.parent;
    return parent.type === "UnaryExpression" && (parent).operator === "typeof";
  }
  var NoUndefRuleOptions;
  var NO_UNDEF_RULE = {meta:{docs:{description:"disallow the use of undeclared variables unless " + "mentioned in `/*global */` comments", category:"Variables", recommended:true}, schema:[{type:"object", properties:{typeof:{type:"boolean"}}, additionalProperties:false}]}, create:function(context) {
    var options = (context.options[0]);
    var considerTypeOf = options && options.typeof === true || false;
    var googRequiredStrings = [];
    var googProvidedStrings = [];
    return {Program:function(programNode) {
      googRequiredStrings = programNode.body.map(ast.matchExtractBareGoogRequire).filter(function(b) {
        return Boolean(b);
      }).map(function(dependency) {
        return dependency.source;
      });
      googProvidedStrings = programNode.body.map(ast.matchExtractGoogProvide).filter(function(b) {
        return Boolean(b);
      }).map(function(dependency) {
        return dependency.source;
      });
    }, "Program:exit":function() {
      var globalScope = context.getScope();
      var undeclaredVariables = globalScope.through;
      function isGoogProvided(fullName) {
        return googProvidedStrings.some(function(provided) {
          return utils.isValidPrefix(fullName, provided);
        });
      }
      function isGoogRequired(fullName) {
        return googRequiredStrings.some(function(required) {
          return utils.isValidPrefix(fullName, required);
        });
      }
      undeclaredVariables.forEach(function(ref) {
        var identifier = ref.identifier;
        var fullName = ast.getFullyQualifedName(identifier);
        if (!considerTypeOf && hasTypeOfOperator(identifier)) {
          return;
        } else {
          if (isGoogProvided(fullName) || isGoogRequired(fullName)) {
            return;
          }
        }
        context.report({node:identifier, message:"'" + identifier.name + "' is not defined."});
      });
    }};
  }};
  exports = NO_UNDEF_RULE;
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.noUnusedExpressions");
  var array = goog.require("goog.array");
  var ast = goog.require("googlejs.ast");
  var jsdocUtils = goog.require("googlejs.jsdocUtils");
  function looksLikeDirective(node) {
    return !!ast.matchExtractDirective(node);
  }
  function takeWhile(predicate, list) {
    for (var i = 0;i < list.length;++i) {
      if (!predicate(list[i])) {
        return list.slice(0, i);
      }
    }
    return list.slice();
  }
  function getLeadingDirectives(node) {
    return takeWhile(looksLikeDirective, node.body);
  }
  function isDirective(node, ancestors) {
    var parent = ancestors[ancestors.length - 1];
    var grandparent = ancestors[ancestors.length - 2];
    var isInFunction = parent.type === "BlockStatement" && /Function/.test(grandparent.type);
    if (parent.type === "Program" || isInFunction) {
      var p = (parent);
      return array.contains(getLeadingDirectives(p), node);
    } else {
      return false;
    }
  }
  function hasJSDocTypeInfo(node) {
    var comment = jsdocUtils.getJSDocComment(node);
    if (!comment) {
      return false;
    }
    try {
      var jsdoc = jsdocUtils.parseComment(comment.value);
      return jsdocUtils.hasTypeInformation(jsdoc);
    } catch (e) {
      return false;
    }
  }
  var RuleOptions;
  var NO_UNUSED_EXPRESSIONS_RULE = {meta:{docs:{description:"disallow unused expressions", category:"Best Practices", recommended:false}, schema:[{type:"object", properties:{allowShortCircuit:{type:"boolean"}, allowTernary:{type:"boolean"}}, additionalProperties:false}]}, create:function(context) {
    var config = (context.options[0]) || {};
    var allowShortCircuit = config.allowShortCircuit || false;
    var allowTernary = config.allowTernary || false;
    function isValidExpression(node) {
      if (allowTernary) {
        if (node.type === "ConditionalExpression") {
          var conditional = (node);
          return isValidExpression(conditional.consequent) && isValidExpression(conditional.alternate);
        }
      }
      if (allowShortCircuit) {
        if (node.type === "LogicalExpression") {
          return isValidExpression((node).right);
        }
      }
      var isReturnableRegexp = /^(?:Assignment|Call|New|Update|Yield|Await)Expression$/;
      var isNodeReturnable = isReturnableRegexp.test(node.type);
      var isDeleteOrVoid = node.type === "UnaryExpression" && ["delete", "void"].indexOf((node).operator) >= 0;
      return isNodeReturnable || isDeleteOrVoid;
    }
    return {ExpressionStatement:function(node) {
      if (!isValidExpression(node.expression) && !isDirective(node, context.getAncestors()) && !hasJSDocTypeInfo(node)) {
        context.report({node:node, message:"Expected an assignment or function call and" + " instead saw an expression."});
      }
    }};
  }};
  exports = NO_UNUSED_EXPRESSIONS_RULE;
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.rules.noUnusedVars");
  var ast = goog.require("googlejs.ast");
  var utils = goog.require("googlejs.utils");
  var RuleOptionsRaw;
  var RuleOptions;
  function create(context) {
    var MESSAGE = "'{{name}}' is defined but never used.";
    var config = {vars:"all", args:"after-used", caughtErrors:"none", allowUnusedTypes:false};
    var firstOption = (context.options[0]);
    if (firstOption) {
      if (goog.isString(firstOption)) {
        config.vars = firstOption;
      } else {
        config.vars = firstOption.vars || config.vars;
        config.args = firstOption.args || config.args;
        config.caughtErrors = firstOption.caughtErrors || config.caughtErrors;
        if (firstOption.varsIgnorePattern) {
          config.varsIgnorePattern = new RegExp(firstOption.varsIgnorePattern);
        }
        if (firstOption.argsIgnorePattern) {
          config.argsIgnorePattern = new RegExp(firstOption.argsIgnorePattern);
        }
        if (firstOption.caughtErrorsIgnorePattern) {
          config.caughtErrorsIgnorePattern = new RegExp(firstOption.caughtErrorsIgnorePattern);
        }
        if (firstOption.allowUnusedTypes) {
          config.allowUnusedTypes = firstOption.allowUnusedTypes;
        }
      }
    }
    var STATEMENT_TYPE = /(?:Statement|Declaration)$/;
    function isExported(variable) {
      var definition = variable.defs[0];
      if (definition) {
        var node = definition.node;
        if (node.type === "VariableDeclarator") {
          node = node.parent;
        } else {
          if (definition.type === "Parameter") {
            return false;
          }
        }
        return node.parent.type.indexOf("Export") === 0;
      } else {
        return false;
      }
    }
    function isSelfReference(ref, nodes) {
      var scope = ref.from;
      while (scope) {
        if (nodes.indexOf(scope.block) >= 0) {
          return true;
        }
        scope = scope.upper;
      }
      return false;
    }
    function isInsideOfLoop(node) {
      while (node) {
        if (ast.isLoop(node)) {
          return true;
        }
        if (ast.isFunction(node)) {
          return false;
        }
        node = node.parent;
      }
      return false;
    }
    function isInside(inner, outer) {
      return inner.range[0] >= outer.range[0] && inner.range[1] <= outer.range[1];
    }
    function getRhsNode(ref, prevRhsNode) {
      var id = ref.identifier;
      var parent = id.parent;
      var granpa = parent.parent;
      var refScope = ref.from.variableScope;
      var varScope = ref.resolved.scope.variableScope;
      var canBeUsedLater = refScope !== varScope || isInsideOfLoop(id);
      if (prevRhsNode && isInside(id, prevRhsNode)) {
        return prevRhsNode;
      }
      if (parent.type === "AssignmentExpression" && granpa.type === "ExpressionStatement" && id === (parent).left && !canBeUsedLater) {
        return (parent).right;
      }
      return null;
    }
    function isStorableFunction(funcNode, rhsNode) {
      var node = funcNode;
      var parent = funcNode.parent;
      while (parent && isInside(parent, rhsNode)) {
        switch(parent.type) {
          case "SequenceExpression":
            var seq = (parent);
            if (seq.expressions[seq.expressions.length - 1] !== node) {
              return false;
            }
            break;
          case "CallExpression":
          case "NewExpression":
            return (parent).callee !== node;
          case "AssignmentExpression":
          case "TaggedTemplateExpression":
          case "YieldExpression":
            return true;
          default:
            if (STATEMENT_TYPE.test(parent.type)) {
              return true;
            }
        }
        node = parent;
        parent = parent.parent;
      }
      return false;
    }
    function isInsideOfStorableFunction(id, rhsNode) {
      var funcNode = ast.findAncestor(id, ast.isFunction);
      if (funcNode) {
        return isInside(funcNode, rhsNode) && isStorableFunction(funcNode, rhsNode);
      } else {
        return false;
      }
    }
    function isReadForItself(ref, rhsNode) {
      var id = ref.identifier;
      var parent = id.parent;
      var granpa = parent.parent;
      return ref.isRead() && (parent.type === "AssignmentExpression" && granpa.type === "ExpressionStatement" && (parent).left === id || parent.type === "UpdateExpression" && granpa.type === "ExpressionStatement" || rhsNode && isInside(id, rhsNode) && !isInsideOfStorableFunction(id, rhsNode));
    }
    function isForInRef(ref) {
      var target = ref.identifier.parent;
      if (target.type === "VariableDeclarator") {
        target = target.parent.parent;
      }
      if (target.type !== "ForInStatement") {
        return false;
      }
      var forInNode = (target);
      if (forInNode.body.type === "BlockStatement") {
        forInNode = (forInNode.body).body[0];
      } else {
        forInNode = forInNode.body;
      }
      if (!forInNode) {
        return false;
      }
      return forInNode.type === "ReturnStatement";
    }
    function isUsedVariable(variable) {
      var functionNodes = variable.defs.filter(function(def) {
        return def.type === "FunctionName";
      }).map(function(def) {
        return def.node;
      });
      var isFunctionDefinition = functionNodes.length > 0;
      var rhsNode = null;
      return variable.references.some(function(ref) {
        if (isForInRef(ref)) {
          return true;
        }
        var forItself = isReadForItself(ref, rhsNode);
        rhsNode = getRhsNode(ref, rhsNode);
        return ref.isRead() && !forItself && !(isFunctionDefinition && isSelfReference(ref, functionNodes));
      });
    }
    function isLastInNonIgnoredParameters(variable) {
      var def = variable.defs[0];
      if (def.index === (def.node).params.length - 1) {
        return true;
      }
      if (config.argsIgnorePattern) {
        var params = context.getDeclaredVariables(def.node);
        var posteriorParams = params.slice(params.indexOf(variable) + 1);
        if (posteriorParams.every(function(v) {
          return v.references.length === 0 && config.argsIgnorePattern && config.argsIgnorePattern.test(v.name);
        })) {
          return true;
        }
      }
      return false;
    }
    function collectUnusedVariables(scope, unusedVars) {
      var variables = scope.variables;
      var childScopes = scope.childScopes;
      var i;
      var l;
      if (scope.type !== "TDZ" && (scope.type !== "global" || config.vars === "all")) {
        for (i = 0, l = variables.length;i < l;++i) {
          var variable = variables[i];
          if (scope.type === "class" && (scope.block).id === variable.identifiers[0]) {
            continue;
          }
          if (scope.functionExpressionScope || variable.eslintUsed) {
            continue;
          }
          if (scope.type === "function" && variable.name === "arguments" && variable.identifiers.length === 0) {
            continue;
          }
          var def = variable.defs[0];
          if (def) {
            var type = def.type;
            if (type === "CatchClause") {
              if (config.caughtErrors === "none") {
                continue;
              }
              if (config.caughtErrorsIgnorePattern && config.caughtErrorsIgnorePattern.test(def.name.name)) {
                continue;
              }
            }
            if (type === "Parameter") {
              if (def.node.parent.type === "Property" && (def.node.parent).kind === "set") {
                continue;
              }
              if (config.args === "none") {
                continue;
              }
              if (config.argsIgnorePattern && config.argsIgnorePattern.test(def.name.name)) {
                continue;
              }
              if (config.args === "after-used" && !isLastInNonIgnoredParameters(variable)) {
                continue;
              }
            } else {
              if (config.varsIgnorePattern && config.varsIgnorePattern.test(def.name.name)) {
                continue;
              }
            }
          }
          if (!isUsedVariable(variable) && !isExported(variable)) {
            unusedVars.push(variable);
          }
        }
      }
      for (i = 0, l = childScopes.length;i < l;++i) {
        collectUnusedVariables(childScopes[i], unusedVars);
      }
      return unusedVars;
    }
    function getColumnInComment(variable, comment) {
      var namePattern = new RegExp("[\\s,]" + utils.escapeRegexp(variable.name) + "(?:$|[\\s,:])", "g");
      namePattern.lastIndex = comment.value.indexOf("global") + 6;
      var match = namePattern.exec(comment.value);
      return match ? match.index + 1 : 0;
    }
    function getLocation(variable) {
      var comment = variable.eslintExplicitGlobalComment;
      var baseLoc = comment.loc.start;
      var column = getColumnInComment(variable, comment);
      var prefix = comment.value.slice(0, column);
      var lineInComment = (prefix.match(/\n/g) || []).length;
      if (lineInComment > 0) {
        column -= 1 + prefix.lastIndexOf("\n");
      } else {
        column += baseLoc.column + "/*".length;
      }
      return {start:{line:baseLoc.line + lineInComment, column:column}};
    }
    return {"Program:exit":function(programNode) {
      var unusedVars = collectUnusedVariables(context.getScope(), []);
      unusedVars.forEach(function(unusedVar) {
        if (unusedVar.eslintExplicitGlobal) {
          context.report({node:programNode, loc:getLocation(unusedVar), message:MESSAGE, data:unusedVar});
        } else {
          if (unusedVar.defs.length > 0) {
            context.report({node:unusedVar.identifiers[0], message:MESSAGE, data:unusedVar});
          }
        }
      });
    }};
  }
  var NO_UNUSED_VARS_RULE = {meta:{docs:{description:"disallow unused variables", category:"Variables", recommended:true}, schema:[{oneOf:[{enum:["all", "local"]}, {type:"object", properties:{vars:{enum:["all", "local"]}, varsIgnorePattern:{type:"string"}, args:{enum:["all", "after-used", "none"]}, argsIgnorePattern:{type:"string"}, caughtErrors:{enum:["all", "none"]}, caughtErrorsIgnorePattern:{type:"string"}, allowUnusedTypes:{type:"boolean"}}}]}]}, create:create};
  exports = NO_UNUSED_VARS_RULE;
  return exports;
});
goog.loadModule(function(exports) {
  "use strict";
  goog.module("googlejs.plugin");
  var camelcase = goog.require("googlejs.rules.camelcase");
  var indent = goog.require("googlejs.rules.indent");
  var inlineCommentSpacing = goog.require("googlejs.rules.inlineCommentSpacing");
  var jsdoc = goog.require("googlejs.rules.jsdoc");
  var noUndef = goog.require("googlejs.rules.noUndef");
  var noUnusedExpressions = goog.require("googlejs.rules.noUnusedExpressions");
  var noUnusedVars = goog.require("googlejs.rules.noUnusedVars");
  var PLUGIN_ESLINT_CONFIG = {rules:{}};
  goog.exportProperty(PLUGIN_ESLINT_CONFIG, "rules", {});
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "camelcase", camelcase);
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "indent", indent);
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "inline-comment-spacing", inlineCommentSpacing);
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "jsdoc", jsdoc);
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "no-undef", noUndef);
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "no-unused-expressions", noUnusedExpressions);
  goog.exportProperty(PLUGIN_ESLINT_CONFIG.rules, "no-unused-vars", noUnusedVars);
  module.exports = PLUGIN_ESLINT_CONFIG;
  exports = PLUGIN_ESLINT_CONFIG;
  return exports;
});
}).call(global, global.goog);
