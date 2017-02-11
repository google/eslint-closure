PLUGIN_DIR := ./packages/eslint-plugin-googlejs

all: compile

compile:
	$(MAKE) -C $(PLUGIN_DIR) compile

test:
	$(MAKE) -C $(PLUGIN_DIR) test
