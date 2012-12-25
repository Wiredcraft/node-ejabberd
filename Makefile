test:
	@NODE_ENV=test EJABBERDCTL_BIN=/usr/local/Cellar/ejabberd/2.1.11/sbin/ejabberdctl node_modules/.bin/mocha ./test/*.mocha.js
.PHONY: test
