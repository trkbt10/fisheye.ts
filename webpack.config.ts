import path from "path";
import webpack from "webpack";

export default function webpackConfig() {
  return {
    entry: {
      fisheye: path.join(__dirname, "src", "fisheye.ts"),
    },
    output: {
      path: path.join(__dirname, "lib"),
      filename: "fisheye.js",
      libraryTarget: "commonjs2",
    },
    mode: "production",
    devtool: undefined,
    target: "web",
    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: "ts-loader",
        },
      ],
    },
    optimization: {
      splitChunks: false,
      runtimeChunk: undefined,
      minimize: true,
    },
    performance: false,
    plugins: [],
    resolve: {
      extensions: [".js", ".ts"],
    },
  };
}
