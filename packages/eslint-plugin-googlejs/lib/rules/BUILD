package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

closure_js_library(
    name = "camelcase",
    srcs = ["camelcase.js"],
    deps = [
        "//lib:types",
        "//lib:utils",
    ],
)

closure_js_library(
    name = "indent",
    srcs = ["indent.js"],
    deps = [
        "//lib:ast",
        "//lib:utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "inline-comment-spacing",
    srcs = ["inline-comment-spacing.js"],
    deps = [
        "//lib:utils",
    ],
)

closure_js_library(
    name = "jsdoc",
    srcs = ["jsdoc.js"],
    deps = [
        "//lib:jsdoc-utils",
        "//lib:utils",
    ],
)

closure_js_library(
    name = "no-undef",
    srcs = ["no-undef.js"],
    deps = [
        "//lib:ast",
        "//lib:utils",
    ],
)

closure_js_library(
    name = "no-unused-expressions",
    srcs = ["no-unused-expressions.js"],
    deps = [
        "//lib:ast",
        "//lib:jsdoc-utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "no-unused-vars",
    srcs = ["no-unused-vars.js"],
    deps = [
        "//lib:ast",
        "//lib:utils",
    ],
)
