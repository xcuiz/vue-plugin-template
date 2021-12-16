const baseThemePath = "src/styles/themes";
module.exports = {
  // vue cli3主题配置
  option: {
    themePath: baseThemePath,
    isDeleteHtmlThemeCss: false,
    themePrefix: "theme",
    isCssAllInOne: true,
  },
  // 主题列表
  themeList: [
    {
      key: "default",
      name: "默认",
    },
    {
      key: "dark",
      name: "灰色",
    },
  ],
};
