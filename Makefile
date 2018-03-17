ROOT_DIR := $(shell pwd)
BIN_DIR := $(ROOT_DIR)/node_modules/.bin
NODE_SASS := $(BIN_DIR)/node-sass

.PHONY: build watch

build: $(NODE_SASS)
	$(NODE_SASS) --output-style compressed style.scss style.css

watch: $(NODE_SASS)
	$(NODE_SASS) --watch --output-style compressed style.scss style.css

run:
	python -m SimpleHTTPServer 8000

$(NODE_SASS):
	npm install