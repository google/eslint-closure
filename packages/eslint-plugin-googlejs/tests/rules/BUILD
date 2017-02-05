package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

closure_js_library(
    name = "all-tests",
    srcs = glob(["*.js"]),
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:camelcase",
        "//lib/rules:indent",
        "//lib/rules:inline-comment-spacing",
        "//lib/rules:jsdoc",
        "//lib/rules:no-undef",
        "//lib/rules:no-unused-expressions",
        "//lib/rules:no-unused-vars",
        "@io_bazel_rules_closure//closure/library",
    ],
)
