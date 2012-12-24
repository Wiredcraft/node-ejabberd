test:
	@NODE_ENV=test sudo node_modules/.bin/mocha ./test/*.mocha.js
.PHONY: test
