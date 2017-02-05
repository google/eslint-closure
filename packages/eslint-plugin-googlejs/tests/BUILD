package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

closure_js_library(
    name = "all-tests",
    srcs = glob(["*.js"]) + glob(["rules/*.js"]),
    deps = [
        "//lib:ast",
        "//lib:ast-matcher",
        "//lib:jsdoc-utils",
        "//lib:plugin",
        "//lib:test-utils",
        "//lib:types",
        "//lib:utils",
        "//lib/externs:all-externs",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_binary(
    name = "test-binary",
    compilation_level = "WHITESPACE_ONLY",
    defs = [
        "--new_type_inf",
    ],
    entry_points = ["googlejs.tests.ast"],
    deps = [
        ":all-tests",
    ],
)

closure_js_library(
    name = "ast",
    srcs = ["ast.js"],
    deps = [
        "//lib:ast",
        "//lib:test-utils",
        "//lib/externs:all-externs",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_binary(
    name = "ast-test",
    compilation_level = "WHITESPACE_ONLY",
    defs = [
        "--new_type_inf",
    ],
    entry_points = ["googlejs.tests.ast"],
    deps = [
        ":ast",
    ],
)
