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
    name = "plugin",
    srcs = ["plugin.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:camelcase",
        "//packages/eslint-plugin-closure/lib/rules:indent",
        "//packages/eslint-plugin-closure/lib/rules:inline-comment-spacing",
        "//packages/eslint-plugin-closure/lib/rules:jsdoc",
        "//packages/eslint-plugin-closure/lib/rules:no-undef",
        "//packages/eslint-plugin-closure/lib/rules:no-unused-expressions",
        "//packages/eslint-plugin-closure/lib/rules:no-unused-vars",
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
