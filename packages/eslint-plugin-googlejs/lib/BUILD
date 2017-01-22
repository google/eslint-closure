package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

closure_js_library(
    name = "ast",
    srcs = ["ast.js"],
    deps = [
        ":ast-matcher",
    ],
)

closure_js_library(
    name = "ast-matcher",
    srcs = ["ast-matcher.js"],
    deps = [
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "config",
    srcs = ["config.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:camelcase",
        "//lib/rules:indent",
        "//lib/rules:inline-comment-spacing",
        "//lib/rules:jsdoc",
        "//lib/rules:no-undef",
        "//lib/rules:no-unused-expressions",
        "//lib/rules:no-unused-vars",
    ],
)

closure_js_library(
    name = "jsdoc-utils",
    srcs = ["jsdoc-utils.js"],
    deps = [
        ":ast-matcher",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "test-utils",
    srcs = ["test-utils.js"],
)

closure_js_library(
    name = "types",
    srcs = ["types.js"],
)

closure_js_library(
    name = "utils",
    srcs = ["utils.js"],
    deps = [
        ":types",
    ],
)
