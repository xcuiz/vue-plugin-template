// import * as d3 from 'd3'
import * as selection from 'd3-selection'
import { merge } from '../../util/base'
import defaultConfig from './config'
// 后续的组件都需要扩展到d3对象上
const d3 = selection
/**
 * 数据图形化关系图
 */
class DbDiagram {
  /**
   * 初始化
   * @param {string} container 外部容器dom
   * @param {number} scale 初始画布缩放比例
   * @param {array} transform 偏移量
   * @param {object} config 合并默认配置项
   */
  constructor ({ container, scale = 1, transform = [0, 0], config = {} }) {
    // 父容器
    this.containerDom = container
    this.$d3 = d3
    this.scale = scale
    // 位移量
    this.transform = transform
    this.config = merge({}, defaultConfig, config)
    // 画布
    this.view = this.$d3
      .select(container)
      .append('svg')
      .attr('tabindex', -1)
  }
  /**
   * 初始化方法
   * @param {object} 画布数据 {tables: [], refs: []}
   */
  init (canvasData = { tables: [], refs: [] }) {
    // 初始化画布大小
    this.initView()
    // 清除画布
    this.clearCanvas()
    // 插入全局group
    this.canvas = this.view
      .append('g')
      .attr('id', 'group')
    // 设置初始化偏移量
    this.setTransform(this.transform)
    // 初始化计算svg位置
    this.calculatePosition(canvasData.tables || [])
    // 绘制表格
    this.drawTables(canvasData.tables || [])
    // 绘制关联线
    this.drawLines(canvasData.refs || [])
    // 提升table层级
    this.raiseIndex('g[id="table-group"]')
    // 初始化事件
    this.initEvent()
  }
  /**
   * 初始化视图大小
   */
  initView () {
    const { width, height } = this.containerDom.getBoundingClientRect()
    this.originWidth = width
    this.originHeight = height
    // 设置画布大小
    this.view
      .attr('viewBox', this._getViewPosition())
      .attr('width', this.originWidth)
      .attr('height', this.originHeight)
  }
  /**
   * 放大缩小画布
   * @param {number} scaleNum 放大缩小数值
   */
  scaleView (scaleNum) {
    this.scale = scaleNum
    // 缩放后获取视图偏移量
    this.view.attr('viewBox', this._getViewPosition())
  }
  /**
   * 获取视图偏移量 viewBox 配置
   */
  _getViewPosition () {
    // 缩放后宽高
    const pWidth = this.originWidth / this.scale
    const pHeight = this.originHeight / this.scale
    // 偏移值
    const marginLeft = (this.originWidth - pWidth) / 2
    const marginTop = (this.originHeight - pHeight) / 2
    return `${marginLeft} ${marginTop} ${pWidth} ${pHeight}`
  }
  /**
   * 绘制表格
   * @param {array} tablesData 表格列表数据
   */
  drawTables (tablesData) {
    // 添加table组
    this.canvas
      .append('g')
      .attr('id', 'table-group')

    this.canvas
      .select('g[id="table-group"]')
      // 添加table组
      .selectAll('g[table]')
      .data(tablesData)
      .enter()
      .append('g')
      .attr('table', d => d.name)
      .on('mouseover', d => {
        // 出线激活
        this.view.select(`g[id="refs-group"]`).selectAll(`g[out^="${d.name}."]`).classed('active', true)
          .each(cd => {
            this.view.select(`g[field="${cd.source}"]`).classed('active', true)
            this.view.select(`g[field="${cd.target}"]`).classed('active', true)
          })
        // 入线激活
        this.view.select(`g[id="refs-group"]`).selectAll(`g[in^="${d.name}."]`).classed('active', true)
          .each(cd => {
            this.view.select(`g[field="${cd.source}"]`).classed('active', true)
            this.view.select(`g[field="${cd.target}"]`).classed('active', true)
          })
      })
      .on('mouseleave', d => {
        // 出线激活
        this.view.select(`g[id="refs-group"]`).selectAll(`g[out^="${d.name}."]`).classed('active', false)
          .each(cd => {
            this.view.select(`g[field="${cd.source}"]`).classed('active', false)
            this.view.select(`g[field="${cd.target}"]`).classed('active', false)
          })
        // 入线激活
        this.view.select(`g[id="refs-group"]`).selectAll(`g[in^="${d.name}."]`).classed('active', false)
          .each(cd => {
            this.view.select(`g[field="${cd.source}"]`).classed('active', false)
            this.view.select(`g[field="${cd.target}"]`).classed('active', false)
          })
      })
      .each(d => {
        // 绘制表头
        this._drawTableHeader(d)
      })
      .each(d => {
        // 绘制图表字段
        this._drawTableFields(d)
      })
  }
  /**
   * 绘制表头
   * @param {object} d 数据
   */
  _drawTableHeader (d) {
    const headerGroup = this.view.select(`g[table="${d.name}"]`)
      .append('g')
      .attr('table-header', d.name)
    // 添加表头
    const header = headerGroup
      .append('rect')
      .attr('x', d.left)
      .attr('y', d.top)
      .attr('width', this.config.tableWidth)
    // 表头添加数据
    Object.entries(this.config.table.header).forEach(([name, value]) => {
      header.attr(name, value)
    })
    // 添加表头文本
    const textNode = headerGroup
      .append('text')
      .text(d.name || '')
      .attr('x', +d.left + +this.config.tableWidth / 2)
      .attr('y', +d.top)
      .attr('dy', (this.config.table.headerText['font-size'] + this.config.table.header.height - 3) / 2)
    Object.entries(this.config.table.headerText).forEach(([name, value]) => {
      textNode.attr(name, value)
    })
  }
  /**
   * 绘制图表字段
   * @param {object} d 数据
   */
  _drawTableFields (d) {
    this.view
      .select(`g[table="${d.name}"]`)
      .selectAll('g[field]')
      .data(d.columns)
      .enter()
      .append('g')
      .attr('field', cd => `${d.name}.${cd.name}`)
      .each((childData, index) => {
        this._drawSingleField(childData, index, d)
      })
  }
  /**
   * 绘制单个字段，包括字段文本
   * @param {object} d 数据
   * @param {number} index 当前数据的索引值
   * @param {object} parentData 父级数据
   */
  _drawSingleField (d, index, parentData) {
    const parentDom = this.view.select(`g[field="${parentData.name}.${d.name}"]`)
    const startTop = +parentData.top + index * +this.config.table.field.height + +this.config.table.header.height
    // 添加字段快
    const field = parentDom
      .append('rect')
      .attr('x', +parentData.left)
      .attr('y', startTop)
      .attr('width', this.config.tableWidth)
    Object.entries(this.config.table.field).forEach(([name, value]) => {
      field.attr(name, value)
    })
    // 字段名处理
    const filedName = parentDom
      .append('text')
      .attr('x', +parentData.left + 10)
      .attr('y', startTop)
      .attr('dy', (this.config.table.fieldText['font-size'] + this.config.table.field.height - 3) / 2)
      .text(d.name)
    Object.entries(this.config.table.fieldText).forEach(([name, value]) => {
      filedName.attr(name, value)
    })
    // 字段类型处理
    const filedType = parentDom
      .append('text')
      .attr('x', +parentData.left + +this.config.tableWidth - 10)
      .attr('y', startTop)
      .attr('dy', (this.config.table.fieldType['font-size'] + this.config.table.field.height - 3) / 2)
      .text(d.datatype)
    Object.entries(this.config.table.fieldType).forEach(([name, value]) => {
      filedType.attr(name, value)
    })
  }
  /**
   * 绘制关联线
   * @param {object} d 数据
   */
  drawLines (d) {
    // 添加table组
    this.canvas
      .append('g')
      .attr('id', 'refs-group')

    this.canvas
      .select('g[id="refs-group"]')
      // 添加table组
      .selectAll('g[ref]')
      .data(d)
      .enter()
      .append('g')
      .attr('in', d => d.source)
      .attr('out', d => d.target)
      .on('mouseover', d => {
        this.view.selectAll(`g[field="${d.source}"]`).classed('active', true)
        this.view.selectAll(`g[field="${d.target}"]`).classed('active', true)
      })
      .on('mouseleave', d => {
        this.view.selectAll(`g[field="${d.source}"]`).classed('active', false)
        this.view.selectAll(`g[field="${d.target}"]`).classed('active', false)
      })
      .each(d => {
        // 绘制线
        this._drawSingleLine(d)
      })
  }
  /**
   * 绘制单条线，计算线的走势点
   * @param {object} d 数据
   */
  _drawSingleLine (d) {
    const parentGroup = this.view.select(`g[in="${d.source}"][out="${d.target}"]`)
    const { path, pathList, arrowPath } = this._calculateLinePath(d)
    const datas = (d.data || {
      type: ''
    }).type.split(':')
    // 添加线路径
    const line = parentGroup
      .append('path')
      .attr('show-path', true)
      .attr('d', path)
    Object.entries(this.config.refs.line).forEach(([name, value]) => {
      line.attr(name, value)
    })
    // 克隆line，辅助hover处理
    parentGroup
      .append('path')
      .attr('hidden-path', true)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 5)
    // 绘制箭头
    if (this.config.refs.isDrawArrow) {
      const arrow = parentGroup
        .append('path')
        .attr('arrow', true)
        .attr('d', arrowPath)
      Object.entries(this.config.refs.arrow).forEach(([name, value]) => {
        arrow.attr(name, value)
      })
    }
    // 添加source文本
    const pathLen = pathList.length
    parentGroup
      .append('text')
      .text(datas[0])
      .attr('x', pathList[0][0] + (pathList[1][0] - pathList[0][0] > 0 ? 10 : -10))
      .attr('y', (pathList[1][1] + pathList[0][1]) / 2 + 15) // source文字下对齐
    // 添加target文本
    parentGroup
      .append('text')
      .text(datas[1])
      .attr('x', pathList[pathLen - 1][0] + (pathList[pathLen - 2][0] - pathList[pathLen - 1][0] > 0 ? 10 : -10))
      .attr('y', (pathList[pathLen - 1][1] + pathList[pathLen - 2][1]) / 2 - 3) // target文字上对齐
  }
  /**
   * 计算线的走势点
   * @param {object} d 数据
   */
  _calculateLinePath (d) {
    const sourceField = this.view.select(`g[field="${d.source}"]`).select('rect')
    const targetField = this.view.select(`g[field="${d.target}"]`).select('rect')
    // 源坐标位置
    const x1 = +sourceField.attr('x')
    const y1 = +sourceField.attr('y') + this.config.table.field.height / 2
    const xright1 = x1 + this.config.tableWidth
    // 目标坐标位置
    const x2 = +targetField.attr('x')
    const y2 = +targetField.attr('y') + this.config.table.field.height / 2
    const xright2 = x2 + this.config.tableWidth
    let res = {}
    // 连线控制
    // 1. target在右侧
    if (x2 >= xright1) {
      res = {
        p1: { x: xright1, y: y1 },
        p2: { x: x2, y: y2 }
      }
    } else if (xright2 >= x1 && x2 < xright1) {
      // 1. target在source的交叉位置
      res = {
        p1: { x: x1, y: y1 },
        p2: { x: x2, y: y2 },
        isMiddle: true
      }
    } else {
      // target进入source的左侧
      res = {
        p1: { x: x1, y: y1 },
        p2: { x: xright2, y: y2 }
      }
    }
    // 计算路径
    return this._calculatePath(res)
  }

  /**
   * 对两点进行画线处理
   * @param {object} points 两点之间的数据
   */
  _calculatePath (points = { p1: {}, p2: {} }) {
    const x1 = points.p1.x
    const y1 = points.p1.y
    const x2 = points.p2.x
    const y2 = points.p2.y
    let arrowPath = ''
    // 添加初始点
    let pathList = [
      [x1, y1]
    ]
    // 坐标点横向差值
    let diffV = x2 - x1
    // 绝对值,小于最小差值处理
    if (Math.abs(y2 - y1) <= this.config.minDvalue) {
      pathList.push(...[[(x1 + x2) / 2, (y1 + y2) / 2], [x2, y2]])
    } else if (points.isMiddle) {
      // 判断为中间区域时处理
      const minX = Math.min(x1, x2) - this.config.minDvalue
      pathList.push([minX, y1])
      pathList.push([minX, y2])
      pathList.push([x2, y2])
    } else {
      // 添加转折点
      pathList.push([x1 + (diffV / 2), y1])
      // 拐角的横向线
      pathList.push([x1 + (diffV / 2), y2])
      pathList.push([x2, y2])
    }
    if (pathList.length > 3) {
      // 转折点1偏移量处理
      const diffData1 = this._drawSweep(
        [pathList[1][0] - pathList[0][0], pathList[1][1] - pathList[0][1]],
        [pathList[2][0] - pathList[1][0], pathList[2][1] - pathList[1][1]]
      )
      // 转折点2偏移量处理
      const diffData2 = this._drawSweep(
        [pathList[2][0] - pathList[1][0], pathList[2][1] - pathList[1][1]],
        [pathList[3][0] - pathList[2][0], pathList[3][1] - pathList[2][1]]
      )
      pathList[1][0] -= diffData1.rx // 偏移一个圆角半径
      pathList[2][1] -= diffData2.ry // 偏移一个圆角半径
      const path1 = `A ${this.config.lineRx} ${this.config.lineRx} 0 0 ${diffData1.sweep}`
      const path2 = `A ${this.config.lineRx} ${this.config.lineRx} 0 0 ${diffData2.sweep}`
      pathList.splice(2, 0, [pathList[2][0], pathList[1][1] + diffData1.ry, path1])
      pathList.splice(4, 0, [pathList[3][0] + diffData2.rx, pathList[4][1], path2])
    }
    // 绘制箭头路径处理
    if (this.config.refs.isDrawArrow) {
      const len = pathList.length
      // x轴差值来判断三角方向
      const xDiff = pathList[len - 1][0] - pathList[len - 2][0] > 0 ? 5 : -5
      arrowPath = `M ${x2 - xDiff} ${y2 + 5} L ${x2} ${y2} L ${x2 - xDiff} ${y2 - 5}`
    }
    return {
      pathList,
      path: `M${pathList.map((item, index) => {
        // 判断点
        if (item.length === 2) {
          return `${index > 0 ? 'L' : ''}${item.toString().replace(/,/g, ' ')}`
        } else if (item.length === 3) {
          // 判断拐角
          return `${item[2]} ${item[0]} ${item[1]}`
        }
      }).join(' ')}`,
      arrowPath
    }
  }
  /**
   * 判断line的拐角为顺时针、逆时针
   * 根据偏差求拐角方向
   */
  _drawSweep (p1, p2) {
    const [x1, y1] = p1
    const [x2, y2] = p2
    const res = { sweep: 0, rx: 0, ry: 0 }
    // 顺时针枚举值
    if ((x1 > 0 && y2 > 0) || (y1 > 0 && x2 < 0) || (x1 < 0 && y2 < 0) || (y1 < 0 && x2 > 0)) {
      res.sweep = 1
    }
    // 求各个拐角半径
    x1 !== 0 && (res.rx = x1 > 0 ? +this.config.lineRx : -this.config.lineRx)
    y1 !== 0 && (res.ry = y1 > 0 ? +this.config.lineRx : -this.config.lineRx)
    x2 !== 0 && (res.rx = x2 > 0 ? +this.config.lineRx : -this.config.lineRx)
    y2 !== 0 && (res.ry = y2 > 0 ? +this.config.lineRx : -this.config.lineRx)
    return res
  }

  /**
   * 初始化事件
   */
  initEvent () {

  }
  /**
   * 监听resize事件
   */
  resizeEvent () {
    // 初始化画布大小
    this.initView()
  }
  /**
   * 清除数据
   */
  clearCanvas () {
    this.view.selectAll('*').remove()
  }
  /**
   * 提升某系图形的层级
   * @param {string} domStr dom查找
   */
  raiseIndex (domStr) {
    this.view.select(domStr).raise()
  }
  /**
   * 获取当前偏移量
   */
  getTransform () {
    return this.transform
  }
  /**
   * 设置偏移量
   * @param {array} transform 偏移量
   */
  setTransform (transform = [0, 0]) {
    // 设置当前偏移量
    this.transform = transform
    // 处理偏移
    this.canvas.style('transform', `translate(${this.transform[0]}px, ${this.transform[1]}px)`)
  }
  /**
   * 初始化计算svg位置
   * @param {object} data 需要绘制的数据
   */
  calculatePosition (tableList = []) {
    // 每行表格数据
    const singleWidth = this.config.tableWidth + this.config.colSpace
    const rowNum = Math.floor(this.originWidth / singleWidth)
    // 补全最大高度
    const heightList = {}
    for (let i = 0; i < rowNum; i++) {
      heightList[singleWidth * i] = 0
    }
    // 计算每个表格的位置
    tableList.forEach((item, index) => {
      // 获取现有高度数组
      const heightArr = Object.values(heightList)
      // 最小top和最小left获取
      const minTop = Math.min.apply(null, heightArr)
      const minIndex = heightArr.indexOf(minTop)
      const minLeft = Object.keys(heightList)[minIndex]
      // 判读无坐标值数据
      if (!item.left && !item.top) {
        item.left = minLeft
        item.top = minTop
      }
      heightList[minLeft] = item.top + this.config.rowSpace + this.config.table.header.height + item.columns.length * this.config.table.field.height
    })
  }
}
export default DbDiagram
