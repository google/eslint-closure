DOCS_DIR := docs
PLUGIN_DIR := packages/eslint-plugin-googlejs
ES5_DIR := packages/eslint-config-googlejs-es5
ES6_DIR := packages/eslint-config-googlejs-es6
CONFIG_TESTER_DIR := packages/eslint-config-tester

all: compile

compile:
	$(MAKE) -C $(PLUGIN_DIR) compile-simple
	$(MAKE) -C $(CONFIG_TESTER_DIR) compile

test:
	$(MAKE) -C $(PLUGIN_DIR) test
	$(MAKE) -C $(CONFIG_TESTER_DIR) test
	$(MAKE) -C $(ES5_DIR) test
	$(MAKE) -C $(ES6_DIR) test

site:
	$(MAKE) -C $(DOCS_DIR) site

serve: site
	$(MAKE) -C $(DOCS_DIR) serve
