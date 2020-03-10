DATE := $(shell date '+%Y%m%d-%H%M%S')
ROOT_DIR := $(shell pwd)
NODE_MODULES_DIRECTORY := $(ROOT_DIR)/node_modules
BUILD_DIRECTORY := $(ROOT_DIR)/build
BUNDLE_FILE_NAME := sdcp-ticket-order-$(DATE).zip
BUNDLE_FILE_PATH := $(BUILD_DIRECTORY)/$(BUNDLE_FILE_NAME)
TEST_URL := $(if $(url), $(url), http://leadcrunch.com/)
LAMBDA_FUNCTION := wappalyzer

.PHONY: test test-url build clean lint update-lambda

build: clean $(BUNDLE_FILE_PATH)
clean:
	rm -rf node_modules/

update-lambda: build
	aws lambda update-function-code --function-name $(LAMBDA_FUNCTION) --zip-file fileb://$(BUNDLE_FILE_PATH)

$(BUNDLE_FILE_PATH): $(NODE_MODULES_DIRECTORY) $(BUILD_DIRECTORY)
	@echo '** Building' $(BUNDLE_FILE_NAME)

	npm prune --production
	zip -r $(BUNDLE_FILE_PATH) index.js node_modules

$(BUILD_DIRECTORY):
	mkdir -p $(BUILD_DIRECTORY)

$(NODE_MODULES_DIRECTORY): package.json
	npm install --production
	@rm -rf $(NODE_MODULES_DIRECTORY)/.modified
	@touch -m $(NODE_MODULES_DIRECTORY)/.modified
