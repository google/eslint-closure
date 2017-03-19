ROOT_DIR := ../..
PLUGIN_PREFIX := packages/eslint-plugin-closure
BAZEL_BIN_DIR := $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)
BAZEL_PKG := //$(PLUGIN_PREFIX)/tests
TEST_PKG := $(PLUGIN_PREFIX)/tests
# No colors because it doesn't work on the solarized color scheme.
MOCHA := node_modules/mocha/bin/mocha --no-colors

# Build a package target relative to the root dir.
#
# The first arg is the bazel build package without the leading //.  The second
# arg is the bazel build target.  For example:
# $(1): packages/eslint-plugin-closure/tests/rules
# $(2): no-undef-test-bin
define build_run_test
	bazel build //$(1):$(2)
  cp -f $(ROOT_DIR)/bazel-bin/$(1)/$(2).js dist/tests
  $(MOCHA) dist/tests/$(2).js
endef

all: compile

# TODO(jschaf): JSDoc and the indent tests (goog.scope) fail if we compile the
# plugin in ADVANCED mode.  As a workaround, default to SIMPLE.
compile:
	bazel build //packages/eslint-plugin-closure:plugin-simple
	cp -f $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)/plugin-simple.js \
      dist/closure-eslint-plugin.js

compile-advanced:
	bazel build //packages/eslint-plugin-closure:plugin
	cp -f $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)/plugin.js \
      dist/closure-eslint-plugin.js

compile-debug:
	bazel build //packages/eslint-plugin-closure:plugin-debug
	cp -f $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)/plugin-debug.js \
      dist/closure-eslint-plugin.js

clean:
	rm -rf dist/tests

develop:
	yarn link
	yarn install
	npm link # Also need NPM to link globally, so ESLint can find the plugin.

build-tests: clean dist-mkdir
	bazel build //packages/eslint-plugin-closure/tests/...:all
	find $(BAZEL_BIN_DIR)/tests -name "*.js" | xargs -I '{}' cp -f {} dist/tests

test: build-tests
	$(MOCHA) --recursive ./dist/tests

test-summary: build-tests
	$(MOCHA) --recursive ./dist/tests --reporter dot

test-ast:
	$(call build_run_test,$(TEST_PKG),ast-test-bin)

test-ast-matcher:
	$(call build_run_test,$(TEST_PKG),ast-test-bin)

test-jsdoc-utils:
	$(call build_run_test,$(TEST_PKG),jsdoc-utils-test-bin)

test-utils:
	$(call build_run_test,$(TEST_PKG),utils-test-bin)

test-rules-camelcase:
	$(call build_run_test,$(TEST_PKG)/rules,camelcase-test-bin)

test-rules-indent:
	$(call build_run_test,$(TEST_PKG)/rules,indent-test-bin)

test-rules-inline-comment-spacing:
	$(call build_run_test,$(TEST_PKG)/rules,inline-comment-spacing-test-bin)

test-rules-jsdoc:
	$(call build_run_test,$(TEST_PKG)/rules,jsdoc-test-bin)

test-rules-no-undef:
	$(call build_run_test,$(TEST_PKG)/rules,no-undef-test-bin)

test-rules-no-unused-expressions:
	$(call build_run_test,$(TEST_PKG)/rules,no-unused-expressions-test-bin)

test-rules-no-unused-vars:
	$(call build_run_test,$(TEST_PKG)/rules,no-unused-vars-test-bin)

dist-mkdir:
	mkdir -p dist/tests/rules
