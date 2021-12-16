/**
 * 事件处理，特殊业务相关
 * 注意：
 * 1. 以下事件处理，emit事件名称和 echarts 的事件名称不统一，例：`brushselectedHandler`方法使用的是 brushselected 事件，emit 却是 'brush-finished',这种是不推荐的。
 * 2. 现在事件处理机制已经优化，对于特殊业务的处理，不建议封装到图表库内，图表库会转发所有echarts原生支持的事件。
 * 3. 命名规范：{eventName}Handler
 */

// brushselected 事件处理
export const brushselectedHandler = function (data) {
  if (data.batch.length <= 0) {
    return
  }

  // 目前 data.batch 中只有一个值
  const batch = data.batch[0]

  // 没有选中数据
  if (batch.areas.length <= 0) {
    return
  }

  // 获取框选中的数据，echart吐回的是被选择的坐标轴中的下标
  const selectedMap = {}
  // 将series与选中的下标变成map
  batch.selected.forEach(val => (selectedMap[val.seriesName] = val.dataIndex))
  // 返回给调用者的数据
  const selectData = {
    original: {}, // 原始格式，在data.series格式的基础上筛选出数据来
    mixin: []     // 将所有的数据合并到一个数组中
  }
  // 筛选出选中的数据
  if (Array.isArray(this.transformData.series)) {
    this.transformData.series.forEach(val => {
      const tempIndex = selectedMap[val.name]
      if (!tempIndex) {
        return
      }
      const tempData = val.data.filter((v, index) => tempIndex.includes(index))
      selectData.original[val.name] = tempData
      selectData.mixin.push(...tempData)
    })
  }
  this.$emit('brush-finished', selectData)
}

// brush 事件处理
export const brushHandler = function (data) {
  if (data.command === 'clear') {
    this.$emit('brush-clear')
  }
}

// datazoom 事件处理
export const datazoomHandler = function (...params) {
  let xAxisData = (this.transformData && this.transformData.series.length > 0 && this.transformData.series[0].data && this.transformData.series[0].data.length > 0) && this.transformData.series[0].data.map(item => item.xAxis)
  let param = params[0]
  let emitParams = {}
  let { startValue, endValue } = param.batch[0]
  let { start, end } = param.batch[0]
  if (start === 0 && end === 100) {
    emitParams = { startTime: xAxisData[0], endTime: xAxisData[xAxisData.length - 1] }
  } else {
    emitParams = { startTime: xAxisData[startValue], endTime: xAxisData[endValue] }
  }
  this.$emit('dragZoom', emitParams)
}
