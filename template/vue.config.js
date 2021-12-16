const GitVersionPlugin = require("git-version-html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const { getPublicPath } = require("./src/publicPath");

const isProduction = process.env.NODE_ENV === "production";

const getPages = () => {
  if (isProduction) {
    return {
      index: {
        entry: "src/main.js",
      },
      "{{name}}": {
        entry: "./setup-public-path",
      },
    };
  } else {
    return undefined;
  }
};

// 获取 webpack allias别名
module.exports = {
  publicPath: getPublicPath(),
  runtimeCompiler: true,
  pages: getPages(),

  chainWebpack: (config) => {
    config.plugins.delete("prefetch");

    config.plugin("nodePolyfill").use(NodePolyfillPlugin);
    if (isProduction) {
      config.plugin("GitVersionPlugin").use(GitVersionPlugin);
    }
  },
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: "{{ name }}",
        filename: "remoteEntry.js",
        exposes: {
          // "./router/expose": "./src/router/expose",
        },
        shared: {
          ...require("./package.json").dependencies,
          vue: {
            singleton: true,
          },
        },
      }),
    ],
  },

  devServer: {
    host: "0.0.0.0",
    port: 9090
  },

  // 在开发环境下，在每次保存时 lint 代码
  lintOnSave: !isProduction,

  productionSourceMap: false,
};
