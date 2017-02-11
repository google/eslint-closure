package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

closure_js_library(
    name = "camelcase",
    srcs = ["camelcase.js"],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:types",
        "//packages/eslint-plugin-googlejs/lib:utils",
    ],
)

closure_js_library(
    name = "indent",
    srcs = ["indent.js"],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:ast",
        "//packages/eslint-plugin-googlejs/lib:utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "inline-comment-spacing",
    srcs = ["inline-comment-spacing.js"],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:utils",
    ],
)

closure_js_library(
    name = "jsdoc",
    srcs = ["jsdoc.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:jsdoc-utils",
        "//packages/eslint-plugin-googlejs/lib:utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "no-undef",
    srcs = ["no-undef.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:ast",
        "//packages/eslint-plugin-googlejs/lib:utils",
    ],
)

closure_js_library(
    name = "no-unused-expressions",
    srcs = ["no-unused-expressions.js"],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:ast",
        "//packages/eslint-plugin-googlejs/lib:jsdoc-utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "no-unused-vars",
    srcs = ["no-unused-vars.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:ast",
        "//packages/eslint-plugin-googlejs/lib:utils",
    ],
)
