const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
/**
 * vue cli3配置webpack alias别名
 */
module.exports = function (config) {
  config.resolve.alias
    .set("@charts", resolve("src/fusion-charts")) // charts 图标别名
    .set("@components", resolve("src/fusion-components")) // 组件别名
    .set("@bus", resolve("src/components/util/bus.js")); // 组件别名
};
