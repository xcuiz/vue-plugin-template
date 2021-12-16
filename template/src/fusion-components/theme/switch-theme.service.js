// 获取charts 图标换肤方法
import { $setTheme } from 'fusion-charts/lib'
import themeConfig from '@/styles/themes/index'
// 获取当前设置的主题名称
const defaultTheme = window.localStorage.getItem(`base/theme$$`) || 'default'
export default {
  name: 'idss-switch-theme-service',
  data () {
    return {
      curTheme: defaultTheme,
      themeLoaded: {},
      themePrefix: themeConfig.option.themePrefix || 'theme', // css 编译生成文件前缀名称
      themeList: themeConfig.themeList
    }
  },
  methods: {
    /**
     * 动态切换主题时触发
     * @param {string} theme 主题名称
     * @param {object} echartsTheme echarts主题json数据
     * @param {object} el 换肤方式应用的dom节点
     */
    themeChange (theme, echartsTheme, el = document.body) {
      window.localStorage.setItem(`base/theme$$`, theme)
      this.curTheme = theme
      // 设置样式(通过对dom节点实现对样式隔离)
      el.setAttribute('data-theme', theme)
      // echarts 切换主题(charts支持json主题格式传递)
      $setTheme(echartsTheme ? { echartsTheme } : (this.curTheme || {}))
      // 切换主题
      this._switchCommonTheme(echartsTheme, el)
    },

    /**
     * 切换页面、非图表样式
     * 该方法，主要针对生产环境，开发环境下由于热加载模块，样式直接从组件抽离打入head标签中，且加载一次后便被缓存，不再继续插入head标签
     * @FIXME 生产环境上，为了动态加载css文件，需要借助文件插入、删除link标签机制处理
     * @param {object} echartsTheme echarts主题json数据
     * @param {object} el 换肤方式应用的dom节点
     */
    _switchCommonTheme (echartsTheme, el) {
      // 生产环境上支持，对style文件的替换处理（开发模式下，该代码不支持）
      if (this.curTheme && this.themeLoaded[this.curTheme]) {
        this._createThemeLink(themeConfig.option.default || 'default', echartsTheme, el)
      } else if (this.curTheme) {
        import(`@/styles/themes/${this.curTheme}/common.css`).then(() => {
          // 用于后置清除处理，防止页面在link加载中，样式丢失的问题
          this._clearOldThemeEl()
        }).catch(e => {
          // 加载css文件失败，回退到默认css主题文件
          this.themeChange(themeConfig.option.default || 'default', echartsTheme, el)
        })
      }
    },
    /**
     * 创建theme link标签，用于动态引入css文件
     * @param {object} echartsTheme echarts主题json数据
     * @param {object} el 换肤方式应用的dom节点
     */
    _createThemeLink (echartsTheme, el) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = this.themeLoaded[this.curTheme]
      link.dataset.theme = this.curTheme
      document.head.appendChild(link)
      link.onload = () => {
        // 用于后置清除处理，防止页面在link加载中，样式丢失的问题
        this._clearOldThemeEl()
      }
      link.onerror = () => {
        // 加载css文件失败，回退到默认css主题文件
        this.themeChange(themeConfig.option.default || 'default', echartsTheme, el)
      }
    },
    /**
     * 清除之前的theme主题style文件
     * 用于后置清除处理，防止页面在link加载中，样式丢失的问题
     */
    _clearOldThemeEl () {
      Array.from(document.head.querySelectorAll('link[href*=css]')).forEach(el => {
        const themeReg = new RegExp(`${this.themePrefix}-(.*)-.*\\.css$`)
        const match = el.href.match(themeReg)
        // 删除非当前主题的文件
        if (match && match[1] !== this.curTheme) {
          this.themeLoaded[match[1]] = el.href
          document.head.removeChild(el)
        }
      })
    }
  }
}
