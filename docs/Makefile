BASE_DIR := ../packages/eslint-config-closure-base
ES5_DIR := ../packages/eslint-config-closure-es5
ES6_DIR := ../packages/eslint-config-closure-es6
PLUGIN_DIR := ../packages/eslint-plugin-closure


all: site

site: webpack

webpack:
	npm run webpack

serve:
	bundle exec jekyll serve

develop:
	yarn link eslint-plugin-closure eslint-config-closure-base eslint-config-closure-es5 eslint-config-closure-es6
	yarn install
