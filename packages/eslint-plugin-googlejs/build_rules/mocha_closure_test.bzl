"""Build macro for building JavaScript unit tests for mocha.
Adds the closure library by default and uses new type inference by default."""

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

# _MOCHA_COMPILATION_LEVEL = "SIMPLE"
_MOCHA_COMPILATION_LEVEL = "WHITESPACE_ONLY"

def mocha_closure_test(name,
               srcs,
               data=None,
               deps=None,
               defs=None,
               entry_point=None,
               suppress=None,
               visibility=None,
               **kwargs):
  if not srcs:
    fail("mocha_closure_test rules can not have an empty 'srcs' list")
  if not entry_point:
    fail("mocha_closure_test rules require an entry point.")
  if len(srcs) == 1:
    work = [(name, srcs)]
  else:
    work = [(name + _make_suffix(src), [src]) for src in srcs]
  defs_addons = [
    "--new_type_inf",
    "--rewrite_polyfills=false",
    # We need to tell closure where to put symbols for Node.
    ("--output_wrapper="
     + "global.goog={};"
     + "(function(goog){%output%}).call(global, global.goog);"),
  ]
  new_defs = defs_addons if defs == None else defs + defs_addons
  closure_dep = ["@io_bazel_rules_closure//closure/library"]
  new_deps = (closure_dep if deps == None else deps + closure_dep)

  for shard, sauce in work:

    closure_js_library(
        name = "%s_lib" % shard,
        srcs = sauce,
        data = data,
        deps = new_deps,
        suppress = suppress,
        visibility = visibility,
        testonly = True,
    )

  closure_js_binary(
      name = name,
      deps = [":%s_lib" % shard for shard, _ in work],
      compilation_level = _MOCHA_COMPILATION_LEVEL,
      debug = True,
      defs = new_defs,
      entry_points = [entry_point],
      formatting = "PRETTY_PRINT",
      visibility = visibility,
      testonly = True,
  )


  if len(srcs) > 1:
    native.test_suite(
        name = name,
        tests = [":" + shard for shard, _ in work],
    )


def _make_suffix(path):
  return '_' + path.replace('_test.js', '').replace('-', '_').replace('/', '_')
