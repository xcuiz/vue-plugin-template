/*
 * @Author: your name
 * @Date: 2020-03-19 20:41:47
 * @LastEditTime: 2021-12-07 15:51:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/vue.config.js
 */
const webpack = require("webpack");
// const CompressionWebpackPlugin = require("compression-webpack-plugin");
const GitVersionPlugin = require("git-version-html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const { getPublicPath } = require("./src/publicPath");

const isProduction = process.env.NODE_ENV === "production";
// 获取css主题切换配置
// const themeSwitchFn = require("./src/fusion-components/theme/vue.theme.config.js");
// 获取全局主题配置
// const themeOpt = require("./src/styles/themes/index");
// const themeSwitchWebpack = themeSwitchFn(themeOpt.option);
// 打包分析工具
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 打印 PORTAL 单点登录地址
// eslint-disable-next-line no-console
console.info("\x1b[32mPORTAL地址: ", process.env.VUE_APP_PORTAL_ORIGIN);

const getPages = () => {
  if (isProduction) {
    return {
      index: {
        entry: "src/main.js",
      },
      gov: {
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
    // css 主题 提取
    // themeSwitchWebpack.chainWebpackConfig(config);
    // alias 别名添加
    // webpackAlias(config);
    // 打包生成工具
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

    config.plugin("provide").use(webpack.ProvidePlugin, [
      {
        $: "jquery",
        jquery: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      },
    ]);
    config.plugin("nodePolyfill").use(NodePolyfillPlugin);
    if (isProduction) {
      config.plugin("GitVersionPlugin").use(GitVersionPlugin);
    }
  },
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: "gov",
        filename: "remoteEntry.js",
        exposes: {
          "./router/expose": "./src/router/expose",
        },
        shared: {
          ...require("./package.json").dependencies,
          vue: {
            singleton: true,
          },
        },
      }),
    ],
    // 开发环境不需要gzip
    // if (process.env.NODE_ENV === "production") {
    //   config.plugins.push(
    //     new CompressionWebpackPlugin({
    //       // 正在匹配需要压缩的文件后缀
    //       test: /\.(js|css|svg|woff|ttf|json|html)$/,
    //       // 大于10kb的会压缩
    //       threshold: 0,
    //       // 其余配置查看compression-webpack-plugin
    //     })
    //   );
    // }
  },
  // configureWebpack: config => {
  //   require('vux-loader').merge(config, {
  //     options: {},
  //     plugins: ['vux-ui']
  //   })
  // },

  devServer: {
    host: "0.0.0.0",
    port: 9090,
    proxy: {
      "/gov": {
        target: "http://10.20.24.170",
        headers: { "mock-server": "argus-fe-template" },
        changeOrigin: true,
      },
      "^/websocket": {
        target: "ws://localhost:18080",
        headers: { "mock-server": "argus-fe-template" },
        changeOrigin: true,
        ws: true,
      },
    },
  },

  // 在开发环境下，在每次保存时 lint 代码
  lintOnSave: !isProduction,

  productionSourceMap: false,
};
