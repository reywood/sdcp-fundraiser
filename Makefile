ROOT_DIR := $(shell pwd)
BIN_DIR := $(ROOT_DIR)/node_modules/.bin
NODE_SASS := $(BIN_DIR)/node-sass
BABEL := $(BIN_DIR)/babel

.PHONY: build build-css watch-css build-js watch-js run-server

build: build-js build-css

build-js: $(BABEL)
	$(BABEL) src/js/ --out-file lib/script.js

watch-js: $(BABEL) build-js
	$(BABEL) src/js/ --watch --out-file lib/script.js

build-css: $(NODE_SASS)
	$(NODE_SASS) --output-style compressed src/scss/style.scss lib/style.css

watch-css: $(NODE_SASS) build-css
	$(NODE_SASS) --watch --output-style compressed src/scss/style.scss lib/style.css

run-server:
	npm start

upload: build
	@echo 'Making sure production Paypal is enabled'
	@grep "env: 'production'" src/js/paypal.js > /dev/null
	aws s3 cp --profile cli --acl public-read --recursive img s3://www.sdcpfundraiser.org/img/
	aws s3 cp --profile cli --acl public-read --recursive lib s3://www.sdcpfundraiser.org/lib/
	aws s3 cp --profile cli --acl public-read index.html s3://www.sdcpfundraiser.org/

$(BABEL):
	npm install

$(NODE_SASS):
	npm install
