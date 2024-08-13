const path = require("path");
const webpack = require = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");


module.exports = {
	entry: path.resolve(__dirname, "src/index.ts"),
	mode: process.env.MODE_ENV || "none",
	output: {
		path: path.resolve(__dirname, "../../dist/server"),
		filename: "main-[id]-[hash].js",
		clean: true,
	},
	target: "node",
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ESLintPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.(tsx|jsx|ts|js)$/,
				use: [
					// https://webpack.js.org/guides/typescript/
					// {
					// 	loader: "babel-loader",
					// 	options: {
					// 		configFile: path.resolve(__dirname, "../../babel.config.js"),
					// 	}
					// },
					// {
					// 	test: /\.tsx?$/,
					// 	use: "ts-loader",
					// 	exclude: /node_modules/,
					// },
					{
						loader: "ts-loader",
						options: {
							configFile: path.resolve(__dirname, "./tsconfig.json")
						}
					},
				],
				exclude: [
					path.resolve(__dirname, "node_modules"),
				]

			},

		],
	}

}
