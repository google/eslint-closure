package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package_group(
    name = "eslint-plugin",
    packages = ["//..."],
)

closure_js_binary(
    name = "plugin",
    deps = [
        "//lib:config",
        "//lib/externs:all-externs",
    ],
    defs = [
        "--new_type_inf",
    ],
    warning_level = "VERBOSE",
)
