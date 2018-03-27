ROOT_DIR := $(shell pwd)
BIN_DIR := $(ROOT_DIR)/node_modules/.bin
NODE_SASS := $(BIN_DIR)/node-sass
BABEL := $(BIN_DIR)/babel
BABEL_OPTIONS := src/js/ --out-file lib/script.js
TMUX_SESSION := sdcpfundraiser

.PHONY: build build-css watch-css build-js watch-js run-server

build: build-js build-css

build-js: $(BABEL)
	$(BABEL) $(BABEL_OPTIONS)

build-js-min: $(BABEL)
	$(BABEL) --minified $(BABEL_OPTIONS)

watch-js: $(BABEL) build-js
	$(BABEL) --watch $(BABEL_OPTIONS)

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

tmux:
	tmux start-server
	tmux new-session -d -s $(TMUX_SESSION) -n sdcpfundraiser	
	tmux send-keys "make watch-js" C-m

	tmux select-window -t $(TMUX_SESSION):0
	tmux splitw -v
	tmux send-keys "make watch-css" C-m

	tmux splitw -v
	tmux send-keys "make run-server" C-m

	tmux splitw -v
	tmux send-keys "tmux kill-session -t sdcpfundraiser"

	tmux select-layout even-vertical
	tmux select-window -t $(TMUX_SESSION):0

	tmux attach-session -t $(TMUX_SESSION)

$(BABEL):
	npm install

$(NODE_SASS):
	npm install
