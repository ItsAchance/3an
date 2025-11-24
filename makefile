# Compile all .ts files and start the server
all:
	tsc ./public/*.ts
	node app.js
