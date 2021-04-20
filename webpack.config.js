const path = require("path");
const webpack = require("webpack");

const mode = process.env.NODE_ENV || "production";

const Dotenv = require("dotenv-webpack");

module.exports = {
  target: "webworker",
  mode: "production",
  context: __dirname,
  entry: "./src/index.ts",
  output: {
    filename: `worker.${mode}.js`,
    path: path.join(__dirname, "dist"),
  },
  mode,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [new Dotenv()],
};
