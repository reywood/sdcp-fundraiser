ROOT_DIR := $(shell pwd)
BIN_DIR := $(ROOT_DIR)/node_modules/.bin
NODE_SASS := $(BIN_DIR)/node-sass
BABEL := $(BIN_DIR)/babel

.PHONY: build build-css watch-css run-server

build: build-js build-css

build-js:
	$(BABEL) src/js/ --out-file lib/script.js

watch-js:
	$(BABEL) src/js/ --watch --out-file lib/script.js

build-css: $(NODE_SASS)
	$(NODE_SASS) --output-style compressed src/scss/style.scss lib/style.css

watch-css: $(NODE_SASS) build-css
	$(NODE_SASS) --watch --output-style compressed src/scss/style.scss lib/style.css

run-server:
	npm start

$(BABEL):
	npm install

$(NODE_SASS):
	npm install
