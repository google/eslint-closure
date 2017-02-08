package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

closure_js_library(
    name = "all-tests-bin",
    srcs = glob(["*-test.js"]),
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

test_suite(
    name = "rules_suite-bin",
    tests = [
        ":camelcase",
    ],
)

mocha_closure_test(
    name = "camelcase-test-bin",
    srcs = ["camelcase-test.js"],
    entry_point = "googlejs.tests.rules.camelcase",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:camelcase",
    ],
)

mocha_closure_test(
    name = "indent-test-bin",
    srcs = ["indent-test.js"],
    entry_point = "googlejs.tests.rules.indent",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:indent",
    ],
)

mocha_closure_test(
    name = "inline-comment-spacing-test-bin",
    srcs = ["inline-comment-spacing-test.js"],
    entry_point = "googlejs.tests.rules.inlineCommentSpacing",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:inline-comment-spacing",
    ],
)

mocha_closure_test(
    name = "jsdoc-test-bin",
    srcs = ["jsdoc-test.js"],
    entry_point = "googlejs.tests.rules.jsdoc",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:jsdoc",
    ],
)

mocha_closure_test(
    name = "no-undef-test-bin",
    srcs = ["no-undef-test.js"],
    entry_point = "googlejs.tests.rules.noUndef",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:no-undef",
    ],
)

mocha_closure_test(
    name = "no-unused-expressions-test-bin",
    srcs = ["no-unused-expressions-test.js"],
    entry_point = "googlejs.tests.rules.noUnusedExpressions",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:no-unused-expressions",
    ],
)

mocha_closure_test(
    name = "no-unused-vars-test-bin",
    srcs = ["no-unused-vars-test.js"],
    entry_point = "googlejs.tests.rules.noUnusedVars",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:no-unused-vars",
    ],
)
