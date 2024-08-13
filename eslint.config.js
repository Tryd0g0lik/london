module.exports = {
	"files": [

	],
	"ignores": [
		"./*.js",
		"./src/app/**/src/index.js",
		"**/webpack.*",
		"*.config.js",
		".*",

		"**/webpack.*.js",
		"webpack.*.js",


		"**/dist",

		"node_modules",
		"**/db/node_modules",
		"**/frontend/node_modules",
		"**/backend/node_modules",


		"**/package.json",

		"src/__tests__",
		"coverage",
		"websocket-polyfill.js",
		'src.v0',
		'main.js',
		'*log.*'
	],

	"extends": ["airbnb-base",
		"standard-with-typescript"],
	"overrides": [
		{
			"files": "src/app/backend",
			"env": {
				"module": true,
				"es6": true,
			},
			"parserOptions": {
				"sourceType": "module"
			},
		},
		{
			"files": ["src/app/frontend", "src/app/db"],
			"env": {
				"module": true,
				"es6": true,
			},
			"parserOptions": {
				"sourceType": "module"
			},
		}
	],

	"rules": {
		"semi": ["error", {
			"omitLastInOneLineClassBody": true,
			"omitLastInOneLineBlock": true
		}],
		"prefer-const": "error",
		"linebreak-style": [
			"error",
			"windows"
		],

	},
	"parser": "babel-eslint",
}
