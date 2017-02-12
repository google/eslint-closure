package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

closure_js_binary(
    name = "eslint-config-tester",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
    ],
    dependency_mode = "strict",
    entry_points = ["googlejs.configTester.runner"],
    deps = [
        "//packages/eslint-config-tester/lib:config-tester",
    ],
)