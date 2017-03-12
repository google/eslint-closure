ROOT_DIR := ../..
CONFIG_TESTER_PREFIX := packages/eslint-config-tester
DIST_DIR := dist
BAZEL_BIN_DIR := $(ROOT_DIR)/bazel-bin/$(CONFIG_TESTER_PREFIX)
BAZEL_LABEL := //$(CONFIG_TESTER_PREFIX)
# No colors because it doesn't work on the solarized color scheme.
MOCHA := node_modules/mocha/bin/mocha --no-colors

# Converts a file path into its bazel rule.  For example:
# /dist/tests/ast-test.js               =>
#     //packages/eslint-plugin-googlejs/test/rules:ast-test-bin
#
# /dist/tests/rules/indent-rule-test.js =>
#     //packages/eslint-plugin-googlejs/test/rules:indent-rule-test-bin
define convert_path_to_build_rule
	echo $(1) | sed 's#dist/\(.*\)/\(.*-test\).js#$(BAZEL_LABEL)/\1:\2-bin#'
endef

# Converts a file path to its bazel output location.
# dist/tests/ast-test.js  =>
#     ../../bazel-bin/packages/eslint-plugin-googlejs/tests/ast-test-bin.js
#
# dist/tests/rules/indent.js  =>
#     ../../bazel-bin/packages/eslint-plugin-googlejs/tests/rules/indent-bin.js
define convert_path_to_bazel_output
	echo $(1) | sed 's#dist/\(.*\)-test.js#$(BAZEL_BIN_DIR)/\1-test-bin.js#'
endef

all: compile

compile: make-config-tester
	cp -f $(ROOT_DIR)/bazel-bin/$(CONFIG_TESTER_PREFIX)/eslint-config-tester.js \
      $(DIST_DIR)/eslint-config-tester.js

make-config-tester:
	bazel build //packages/eslint-config-tester

test: build-tests
	$(MOCHA) --recursive ./dist/tests

# Rule to build the tests in tests/*.js
build-tests: dist/tests/error-compare-test.js

test-error-compare: dist/tests/error-compare-test.js
	$(MOCHA) $<

dist/tests/%.js: dist-mkdir
	bazel build $(shell $(call convert_path_to_build_rule,$@))  && \
			cp -f $(shell $(call convert_path_to_bazel_output,$@)) $@

dist-mkdir:
	mkdir -p $(DIST_DIR)/tests
