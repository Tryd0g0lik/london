const path = require("path");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");


module.exports = {
	entry: path.resolve(__dirname, "./src/index.ts"),
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
          {
            // test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
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
    modules: [
      path.resolve(__dirname, "../../.browserslistrc"),
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "dist")
    ],

    alias: {
      "@InterfacesB": [path.resolve(__dirname, "src/backend/interfaces.ts")],
      "@Logs": [path.resolve(__dirname, "src/server/logs/index.ts")],
    }
  },
}
