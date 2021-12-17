const GitVersionPlugin = require("git-version-html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
{{#if_eq appType "sub"}}
const { getPublicPath } = require("./src/publicPath");
{{if_eq}}

const isProduction = process.env.NODE_ENV === "production";

{{#if_eq appType "sub"}}
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
{{if_eq}}

// 获取 webpack allias别名
module.exports = {
  {{#if_eq appType "sub"}}
  publicPath: getPublicPath(),
  {{if_eq}}
  runtimeCompiler: true,
  {{#if_eq appType "sub"}}
  pages: getPages(),
  {{if_eq}}

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
          {{#if_eq appType "sub"}}
          "./router/routes": "./src/router/routes",
          {{if_eq}}
        },
        {{#if_eq appType "main"}}
        remotes: {
          dashboard: '{{remoteName}}@/{{remoteName}}/remoteEntry.js',
        },
        {{if_eq}}
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
    port: {{#if_eq appType "main"}}9090{{if_eq}}{{#if_eq appType "sub"}}9191{{if_eq}},
    {{#if_eq appType "main"}}
    proxy: {
      // 子应用代理
      '/{{remoteName}}': {
        target: 'http://localhost:9191',
        changeOrigin: true
      }
    }
    {{if_eq}}
  },

  // 在开发环境下，在每次保存时 lint 代码
  lintOnSave: !isProduction,

  productionSourceMap: false,
};
