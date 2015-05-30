PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/sh
test:
	mocha --compilers coffee:coffee-script/register
start:
	coffee index.coffee
update:
	npm-check-updates -u
	npm update
fuck:
	rm -rf .git
	git init
	git remote add origin git@github.com:XinweiCook/API.git
	git add .
	git commit -m "Init."
	git push --force origin HEAD
	git checkout -b develop
	git push --force origin HEAD
setup:
	pm2 deploy ecosystem.json development setup
deploy:
	pm2 deploy ecosystem.json development
nodemon:
	 nodemon index.coffee
watch:
	gulp watch
doc:
	gulp doc
lang:
	cd lib;../node_modules/.bin/l10ns update
interface:
	cd lib;../node_modules/.bin/l10ns interface
.PHONY: test start update fuck setup deploy nodemon watch doc lang interface
