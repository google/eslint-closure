BASE_DIR := ../packages/eslint-config-closure-base
ES5_DIR := ../packages/eslint-config-closure-es5
ES6_DIR := ../packages/eslint-config-closure-es6
PLUGIN_DIR := ../packages/eslint-plugin-closure
ESLINT_REPO := eslint-repo
OUTPUT_DIR := output


all: site

site: webpack

webpack:
	npm run webpack

serve:
	bundle exec jekyll serve

develop:
	yarn link eslint-plugin-closure eslint-config-closure-base eslint-config-closure-es5 eslint-config-closure-es6
	yarn install

update-eslint:
	sh bin/update-eslint.sh

copy-eslint:
	cp -f $(ESLINT_REPO)/build/eslint.js js/eslint.js
