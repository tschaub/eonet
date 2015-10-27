.DELETE_ON_ERROR:

DIST_DIR = ./dist
NAME = eonet

export PATH := ./node_modules/.bin:$(PATH)

# Create a distribution archive
.PHONY: package
package: clean dist
	tar czf $(NAME).tgz -C $(DIST_DIR) .

.PHONY: clean
clean:
	rm -rf $(DIST_DIR)

# Install Node based dependencies
node_modules/.ts: package.json
	@npm install
	@touch $@

# Tasks for running in dist mode
.PHONY: dist
dist: $(DIST_DIR)/index.html $(DIST_DIR)/app.js $(DIST_DIR)/style.css

$(DIST_DIR)/index.html: index.html
	@mkdir -p $(DIST_DIR)
	@cp $< $@

$(DIST_DIR)/style.css: style.css
	@mkdir -p $(DIST_DIR)
	@cp $< $@

$(DIST_DIR)/app.js: index.js node_modules/.ts
	@mkdir -p $(DIST_DIR)
	npm run build
