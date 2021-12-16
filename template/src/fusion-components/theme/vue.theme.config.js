const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')
const hash = require('hash-sum')
function recursiveIssuer (m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer)
  } else if (m.name) {
    return m.name
  } else {
    return false
  }
}
/**
 * 提取theme主题 vue cli3 配置抽离
 * @param {string} themePath 主题路径，各个主题上层的父级路径
 * @param {Boolean} isCssAllInOne 所有css是否抽取到一个css文件中(除theme主题外)
 * @param {string} cssInOneThemeName css提取到一个css文件的文件名
 * @param {Boolean} isDeleteHtmlThemeCss 是否删除html中css theme 主题链接,默认删除
 * @param {string} themePrefix theme css文件前缀
 * @param {string} chunkPrefix chunk前缀
 */
module.exports = function ({ themePath = '/src/styles/themes', cssInOneThemeName = process.env.CURRENT_THEME_TYPE || 'default', isCssAllInOne = false, isDeleteHtmlThemeCss = true, chunkPrefix = 'chunk', themePrefix = 'theme' }) {
  return {
    chainWebpackConfig (config) {
      // windows/linux下path路径不一致的问题,window默认分隔符 //, linux 默认分隔符 /
      const sep = path.sep.replace(/(.)/g, '\\$1')
      themePath = themePath.split('/').join(sep) + sep
      // 生产环境css 提取
      if (isProduction && isCssAllInOne) {
        // 匹配全局正则
        let regPath = new RegExp(`${themePath}.*\\.css$`)
        // 将所有css抽离到一个文件中
        const splitOptions = config.optimization.get('splitChunks')
        splitOptions.cacheGroups.appStyles = {
          name: _ => cssInOneThemeName,
          test: (m, c, entry = 'app') => {
            return m.constructor.name === 'CssModule' &&
              // 分离theme主题样式(匹配当前样式资源路径匹配主题路径，将主题样式分离)
              !m.issuer.resource.match(regPath) &&
              recursiveIssuer(m) === entry
          },
          chunks: 'all',
          minChunks: 1,
          enforce: true
        }
        config.optimization.splitChunks(splitOptions)
      }
      // chunk name抽取
      config
        .plugin('named-chunks')
        .use(require('webpack/lib/NamedChunksPlugin'), [chunk => {
          // 默认使用chunk的chunk name
          if (chunk.name) {
            return chunk.name
          }
          const regex = new RegExp(themePath)
          const joinedHash = hash(
            Array.from(chunk.modulesIterable, m => m.id).join('_')
          )
          for (var m of chunk._modules) {
            // 当满足theme路径之后，识别为css theme主题
            if (regex.test(m.context) && (m.type && m.type.indexOf('css') > -1)) {
              const pathList = path.relative(themePath, m.context).split('/')
              const themeName = pathList[pathList.length - 1]
              // 该theme chunkname与剔除html中css链接相关 @FIXME,修改需替换）
              return `${themePrefix}-${themeName}-${joinedHash}`
            }
          }
          // 使用vue cli3 默认chunk 命名方式
          return `${chunkPrefix}-${joinedHash}`
        }])
      // prefetch 下是否剔除theme css文件链接
      if (isProduction && isDeleteHtmlThemeCss) {
        config.plugin('prefetch').tap(options => {
          options[0].fileBlacklist = options[0].fileBlacklist || []
          // 将主题文件链接加入到黑名单，剔除（该正则跟输出chunkname相关 @FIXME,修改需替换）
          const reg = new RegExp(`${themePrefix}-(.*)-.*\\.(css|js)`)
          options[0].fileBlacklist.push(reg)
          return options
        })
      }
    }
  }
}
