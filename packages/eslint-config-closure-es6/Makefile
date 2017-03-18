MOCHA := node_modules/mocha/bin/mocha --no-colors

test:
	npm test

test-summary:
	npm test -- dot

develop:
	yarn link eslint-plugin-closure
	yarn link eslint-config-tester
	yarn link eslint-config-closure-base
	yarn link
	yarn install
