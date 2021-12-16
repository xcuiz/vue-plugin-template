/**
 * 全局配置文件，注意这里key的名称不能变
 * Created by ligang on 2019/01/11.
 */
(function () {
  return {
    /** 大屏外链配置 */
    // 总览
    'BIG_SCREEN': 'http://localhost:8080/#/main',
    // 总览轮播
    'BIG_SCREEN_CAROUSEL': 'http://localhost:8080/#/carousel',
    // 网络威胁分析
    'BIG_SCREEN1': 'http://localhost:8080/#/threat',
    // 系统安全分析
    'BIG_SCREEN2': 'http://localhost:8080/#/safety',
    // 应用系统分析
    'BIG_SCREEN3': 'http://localhost:8080/#/system',
    // 用户行为分析
    'BIG_SCREEN4': 'http://localhost:8080/#/behavior',
    /** 是否隐藏logout按钮，true：隐藏；false：显示 */
    IS_HIDDEN_LOGOUT_BTN: false,
    /** 请求超时时间，单位：毫秒，默认1分钟 */
    REQUEST_TIMEOUT: 1 * 60000,
    /** 文件上传大小限制 */
    FILE_SIZE_LIMIT: 50 * 1024 * 1024, // 50MB
    /** 全文检索默认查询时间 */
    FULL_SEARCH_TIMES: {
      timeInterval: 1,     // 间隔
      timeUnit: 'd'        // 间隔单位 s:秒 m:分 h:时 d:天 w:周 M:月
    },
    /** 健康监控 => 组件监控刷新间隔 */
    COMPONENTS_MONITER_TIMEOUT: 1 * 10000,
    TAGS_VIEW_MAX_CACHE_LIMIT: 10, // 系统内标签页最大个数（注意所有缓存依附于内存，过多会导致浏览器崩溃，这里建议10）
    GLOBAL_TITLE: '' // 系统 Header 标题
  }
})()
