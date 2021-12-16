import { handleWords } from '../../util/base.js'

export default {
  show: true,
  type: 'scroll',
  orient: 'vertical',
  right: 10,
  bottom: 10,
  align: 'left',
  padding: [20, 0, 0, 10],
  itemGap: 10,      // 图例之间的间隔
  itemHeight: 10,   // 图例标记的高度
  itemWidth: 10,
  icon: 'rect',
  formatter: function (item) {
    if (this.option && this.option.legend && this.option.legend.wordsHandle) {
      return handleWords({ words: item, ...this.option.legend.wordsHandle })
    }
    return item // 调用处理文字过长的方法 目前只有换行以及省略号两种方式
  },
  tooltip: {
    show: true
  }
}
