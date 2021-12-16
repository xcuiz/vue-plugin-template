/**
 * 蜂窝图模板配置
 * 如果需要新增模板样式, 在下方追加策略即可
 */
const TMPL_CONFIG = {
  default: {
    row: 4,
    col: 7,
    singleHoneyConfig: {
      show: true,                     // 是否显示
      style: {                        // 样式
        stroke: 'rgba(52, 174, 241, 1)',
        strokeWidth: 3,
        fill: 'transparent'
      }
    },
    config: {
      [[1, 1]]: {
        show: false
      },
      [[1, 2]]: {
        show: false
      },
      [[1, 7]]: {
        show: false
      },
      [[1, 8]]: {
        show: false
      },
      [[1, 6]]: {
        position: [1, 6],
        style: {
          fill: 'rgba(74,129,186,1)'
        }
      },
      [[2, 2]]: {
        position: [2, 2],
        style: {
          fill: 'rgba(102,115,124,1)'
        }
      },
      [[2, 3]]: {
        position: [2, 3],
        style: {
          fill: 'rgba(0,141,149,1)'
        }
      },
      [[2, 4]]: {
        position: [2, 4],
        style: {
          fill: 'rgba(103,132,97,1)'
        }
      },
      [[2, 6]]: {
        position: [2, 6],
        style: {
          fill: 'rgba(44,115,176,1)'
        }
      },
      [[3, 2]]: {
        position: [3, 2],
        style: {
          fill: 'rgba(78,59,157,1)'
        }
      },
      [[3, 3]]: {
        position: [3, 3],
        style: {
          fill: 'rgba(104,51,112,1)'
        }
      },
      [[3, 5]]: {
        position: [3, 5],
        style: {
          fill: 'rgba(92,54,125,1)'
        }
      },
      [[3, 6]]: {
        position: [3, 6],
        style: {
          fill: 'rgba(29,109,151,1)'
        }
      },
      [[4, 4]]: {
        position: [4, 4],
        style: {
          fill: 'rgba(111,91,74,1)'
        }
      },
      [[4, 7]]: {
        show: false
      }
    }
  }
}

/**
 * 外部设置模板使用
 * @param { String } name 模板名称
 * @param { Object } config 模板样式配置
 */
const setTmpl = function (name, config) {
  if (typeof name !== 'string' || typeof config !== 'object') return false
  if (name === 'default' && process.env.NODE_ENV !== 'production') {
    console.error('模板名称不可使用已存在名称！请使用其他名称')
    return false
  }
  TMPL_CONFIG[name] = config
}

export {
  setTmpl
}

export default TMPL_CONFIG
