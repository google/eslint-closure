package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

closure_js_library(
    name = "all-tests",
    srcs = glob(["*.js"]),
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//lib:ast",
        "//lib:ast-matcher",
        "//lib:jsdoc-utils",
        "//lib:plugin",
        "//lib:test-utils",
        "//lib:types",
        "//lib:utils",
        "//lib/externs:all-externs",
        "//tests/rules:all-tests",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_binary(
    name = "test-bundle",
    compilation_level = "SIMPLE",
    defs = [
        "--new_type_inf",
    ],
    entry_points = [
        "googlejs.tests.ast",
        "googlejs.tests.astMatcher",
        "googlejs.tests.jsdocUtils",
        "googlejs.tests.rules.camelcase",
        "googlejs.tests.rules.indent",
        "googlejs.tests.rules.inlineCommentSpacing",
        "googlejs.tests.rules.jsdoc",
        "googlejs.tests.rules.noUndef",
        "googlejs.tests.rules.noUnusedExpressions",
        "googlejs.tests.rules.noUnusedVars",
        "googlejs.tests.utils",
    ],
    deps = [
        ":all-tests",
    ],
)
