package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

closure_js_binary(
    name = "eslint-config-tester",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
    ],
    dependency_mode = "strict",
    entry_points = ["closureLint.configTester.runner"],
    deps = [
        "//packages/eslint-config-tester/lib:config-tester",
    ],
)

closure_js_binary(
    name = "eslint-config-tester-simple",
    compilation_level = "SIMPLE",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
    ],
    dependency_mode = "strict",
    entry_points = ["closureLint.configTester.runner"],
    formatting = "PRETTY_PRINT",
    deps = [
        "//packages/eslint-config-tester/lib:config-tester",
    ],
)

closure_js_binary(
    name = "eslint-config-tester-debug",
    compilation_level = "WHITESPACE_ONLY",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
        ("--output_wrapper=" +
         "global.goog={};" +
         "(function(goog){%output%}).call(global, global.goog);"),
    ],
    dependency_mode = "strict",
    entry_points = ["closureLint.configTester.runner"],
    formatting = "PRETTY_PRINT",
    deps = [
        "//packages/eslint-config-tester/lib:config-tester",
    ],
)
