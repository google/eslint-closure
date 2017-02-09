DIST_DIR := dist
# No colors because it doesn't work on the solarized color scheme.
MOCHA := node_modules/mocha/bin/mocha --no-colors

# Converts a file path into its bazel rule.  For example:
# /dist/tests/ast-test.js               => //test/rules:ast-test-bin
# /dist/tests/rules/indent-rule-test.js => //test/rules:indent-rule-test-bin
define convert_path_to_build_rule
	echo $(1) | sed 's#dist/\(.*\)/\(.*-test\).js#//\1:\2-bin#'
endef

# Converts a file path to its bazel output
# dist/tests/ast-test.js  => bazel-bin/tests/ast-test-bin.js
define convert_path_to_bazel_output
	echo $(1) | sed 's#dist/\(.*\)-test.js#bazel-bin/\1-test-bin.js#'
endef

all: compile

compile: make-plugin
	cp -f bazel-bin/plugin.js $(DIST_DIR)/googlejs-eslint-plugin.js

make-plugin:
	bazel build //:plugin

test: test-build-helpers test-build-rules
	$(MOCHA) --recursive ./dist/tests

# Rule to build the tests in tests/*.js
test-build-helpers: dist/tests/ast-test.js \
		dist/tests/ast-test.js \
		dist/tests/jsdoc-utils-test.js \
		dist/tests/utils-test.js

test-ast: dist/tests/ast-test.js
	$(MOCHA) $<
test-ast-matcher: dist/tests/ast-test.js
	$(MOCHA) $<
test-jsdoc-utils: dist/tests/jsdoc-utils-test.js
	$(MOCHA) $<
test-utils: dist/tests/utils-test.js
	$(MOCHA) $<

test-rules: test-build-rules
	$(MOCHA) dist/tests/rules

# Rule to build the tests in tests/rules/*.js
test-build-rules: dist/tests/rules/camelcase-test.js \
		dist/tests/rules/indent-test.js \
		dist/tests/rules/inline-comment-spacing-test.js \
		dist/tests/rules/jsdoc-test.js \
		dist/tests/rules/no-undef-test.js \
		dist/tests/rules/no-unused-expressions-test.js \
		dist/tests/rules/no-unused-vars-test.js

test-rules-camelcase: dist/tests/rules/camelcase-test.js
	$(MOCHA) $<
test-rules-indent: dist/tests/rules/indent-test.js
	$(MOCHA) $<
test-rules-inline-comment-spacing: \
    dist/tests/rules/inline-comment-spacing-test.js
	$(MOCHA) $<
test-rules-jsdoc: dist/tests/rules/jsdoc-test.js
	$(MOCHA) $<
test-rules-no-undef: dist/tests/rules/no-undef-test.js
	$(MOCHA) $<
test-rules-no-unused-expressions: dist/tests/rules/no-unused-expressions-test.js
	$(MOCHA) $<
test-rules-no-unused-vars: dist/tests/rules/no-unused-vars-test.js
	$(MOCHA) $<

dist/tests/%.js: dist-mkdir
	bazel build $(shell $(call convert_path_to_build_rule,$@))  && \
			cp -f $(shell $(call convert_path_to_bazel_output,$@)) $@

dist-mkdir:
	mkdir -p $(DIST_DIR)/tests/rules
