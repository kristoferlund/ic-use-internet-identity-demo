clean:
	rm -rf .dfx
	rm -rf dist
	rm -rf node_modules
	rm -rf src/declarations
	rm -f .env
	cargo clean
