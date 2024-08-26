const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");


module.exports = {
  extends: path.resolve(__dirname, '../../webpack.config.js'),
	entry: path.resolve(__dirname, "./src/index.ts"),
	mode: process.env.MODE_ENV || "none",
	output: {
    path: path.resolve(__dirname, "./dist/server"),
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
          {
            // test: /\.tsx?$/,
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.json")
            },
          },
				],
				// loader: "ts-loader",
				// options: {
				// 	configFile: path.resolve(__dirname, "./tsconfig.json")
				// },

				exclude: [
					path.resolve(__dirname, "node_modules"),
				]

			},

		],
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js", ".svg"],
    plugins: [new TsconfigPathsPlugin(),],
    modules: [
      path.resolve(__dirname, "../../.browserslistrc"),
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "dist")
    ],

    alias: {
      // "@Logs": [path.resolve(__dirname, "./src/server/logs/index.ts")],
      // "@Interfaceback": [
      //   path.resolve(__dirname, "./src/server/interfaces.ts"),
      // ]
      // "@Logs": [path.resolve(__dirname, "./src/server/logs/index.ts")],
      // "@Interfaceback": [
      //   path.resolve(__dirname, "./src/server/interfaces.ts"),
      // ]
    }
  },
}
