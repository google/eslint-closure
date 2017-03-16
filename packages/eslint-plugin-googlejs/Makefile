ROOT_DIR := ../..
PLUGIN_PREFIX := packages/eslint-plugin-googlejs
BAZEL_BIN_DIR := $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)
BAZEL_PKG := //$(PLUGIN_PREFIX)/tests
# No colors because it doesn't work on the solarized color scheme.
MOCHA := node_modules/mocha/bin/mocha --no-colors

all: compile

compile:
	bazel build //packages/eslint-plugin-googlejs:plugin
	cp -f $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)/plugin.js \
      dist/googlejs-eslint-plugin.js

compile-simple:
	bazel build //packages/eslint-plugin-googlejs:plugin-simple
	cp -f $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)/plugin-simple.js \
      dist/googlejs-eslint-plugin.js

compile-debug:
	bazel build //packages/eslint-plugin-googlejs:plugin-debug
	cp -f $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)/plugin-debug.js \
      dist/googlejs-eslint-plugin.js

clean:
	rm -rf dist/tests

test: clean dist-mkdir
	bazel build //packages/eslint-plugin-googlejs/tests/...:all
	find $(BAZEL_BIN_DIR)/tests -name "*.js" | xargs -i cp -f {} dist/tests
	$(MOCHA) --recursive ./dist/tests --reporter dot

test-rules-camelcase:
	bazel build $(BAZEL_PKG)/rules:camelcase-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/camelcase-test-bin.js dist/tests
	$(MOCHA) dist/tests/camelcase-test-bin.js

test-ast:
	bazel build $(BAZEL_PKG):ast-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/ast-test-bin.js dist/tests
	$(MOCHA) dist/tests/ast-test-bin.js

test-ast-matcher:
	bazel build $(BAZEL_PKG):ast-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/ast-test-bin.js dist/tests
	$(MOCHA) dist/tests/ast-test-bin.js

test-jsdoc-utils:
	bazel build $(BAZEL_PKG):jsdoc-utils-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/jsdoc-utils-test-bin.js dist/tests
	$(MOCHA) dist/tests/jsdoc-utils-test-bin.js

test-utils:
	bazel build $(BAZEL_PKG):utils-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/utils-test-bin.js dist/tests
	$(MOCHA) dist/tests/utils-test-bin.js

test-rules-indent:
	bazel build $(BAZEL_PKG)/rules:indent-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/indent-test-bin.js dist/tests
	$(MOCHA) dist/tests/rules/indent-test-bin.js

test-rules-inline-comment-spacing:
	bazel build $(BAZEL_PKG)/rules:inline-comment-spacing-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/inline-comment-spacing-test-bin.js dist/tests
	$(MOCHA) dist/tests/inline-comment-spacing-test-bin.js

test-rules-jsdoc:
	bazel build $(BAZEL_PKG)/rules:jsdoc-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/jsdoc-test-bin.js dist/tests
	$(MOCHA) dist/tests/jsdoc-test-bin.js

test-rules-no-undef:
	bazel build $(BAZEL_PKG)/rules:no-undef-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/no-undef-test-bin.js dist/tests
	$(MOCHA) dist/tests/no-undef-test-bin.js

test-rules-no-unused-expressions:
	bazel build $(BAZEL_PKG)/rules:no-unused-expressions-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/no-unused-expressions-test-bin.js dist/tests
	$(MOCHA) dist/tests/no-unused-expressions-test-bin.js

test-rules-no-unused-vars:
	bazel build $(BAZEL_PKG)/rules:no-unused-vars-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/rules/no-unused-vars-test-bin.js dist/tests
	$(MOCHA) dist/tests/no-unused-vars-test-bin.js

dist-mkdir:
	mkdir -p dist/tests/rules
