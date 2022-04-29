import webpack from "webpack";
import baseConfig from "./webpack.config";
import path from "node:path";
export default function () {
  const base = baseConfig();

  return {
    ...base,
    devServer: {
      allowedHosts: "all",
      static: {
        directory: path.join(__dirname, "docs"),
      },
    },
    output: {
      path: path.join(__dirname, "docs"),
      filename: "fisheye.js",
      libraryTarget: "window",
    },
    target: "web",
    mode: "production",
    plugins: [...base.plugins],
    externals: [],
  };
}
