package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

closure_js_library(
    name = "all-tests",
    testonly = 1,
    srcs = glob(["*.js"]) + glob(["rules/*.js"]),
    deps = [
        "//lib/externs:all-externs",
        "//lib:plugin",
        "//lib:ast",
        "//lib:ast-matcher",
        "//lib:types",
        "//lib:utils",
        "//lib:test-utils",
        "//lib:jsdoc-utils",
        # "//lib/rules:indent",
        # "//lib/rules:inline-comment-spacing",
        # "//lib/rules:jsdoc",
        # "//lib/rules:no-undef",
        # "//lib/rules:no-unused-expressions",
        # "//lib/rules:no-unused-vars",
        # "//tests/rules:rule-tests",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_binary(
    name = "test-binary",
    compilation_level = "WHITESPACE_ONLY",
    defs = [
        "--new_type_inf",
    ],
    # dependency_mode = "strict",
    # entry_points = ["googlejs.plugin"],
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
