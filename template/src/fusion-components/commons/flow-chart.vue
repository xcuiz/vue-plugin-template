<template>
  <div ref="container" class="flow-chart-container" :style="scaleStyle">
    <div
      v-if="!readOnly"
      id="drop-square"
      class="square-case"
      style="left: -2000px; position: absolute;"
      ref="square-case-move"
      data-case-type="square"></div>
    <div
      v-if="!readOnly"
      id="drop-rhombic"
      class="rhombic-case"
      style="left: -2000px; position: absolute;"
      ref="rhombic-case-move"
      data-case-type="rhombic"></div>
    <div class="operation-list" ref="operation-list" v-if="!readOnly" :style="{width: operationListWidth + 'px'}">
      <idss-widget
        shadow="never"
        :global-style="{ 'border': '1px solid rgba(242, 242, 242, 1)', height: '100%'}">
        <span slot="title-left">添加元素</span>
        <div class="operation-case-container">
          <div>
            <div class="square-case" ref="square-case"></div>
            <div class="operation-case-text">添加执行</div>
          </div>
          <div>
            <div class="rhombic-case" ref="rhombic-case"></div>
            <div class="operation-case-text">添加判断</div>
          </div>
          <el-checkbox border v-model="connectType">设置连线模式</el-checkbox>
        </div>
      </idss-widget>
    </div>
    <div class="drop-container" :class="{'visible-background-color': visibleBackgroundColor}">
      <div ref="box" class="drop-board" :class="{'connect-line': connectType}">
        <flow-item
          v-for="(value, key) in nodes"
          :ref="'ref-' + key"
          :key="key"
          :node.sync="value"
          :flow-chart="flowChart"
          :status="status[key]"
          @node-delete="deleteElem(key)"
          @node-edit="nodeEdit"
          @update-position="position => updatePosition(key, position)"
          :read-only="readOnly">
          <div class="flow-item-text">
            <span>{{value.text || (value.type === 'rhombic' ? '判断': '请选择')}}</span>
          </div>
        </flow-item>
      </div>
      <!-- 图例说明, 只有在只读模式下并且开启显示图例才会显示(默认只读模式下显示图例) -->
      <div class="flow-item-lenged" v-if="visibleLegend && readOnly">
        <ul>
          <li class="flow-item-square-todo">未执行</li>
          <li class="flow-item-square-execute">执行中</li>
          <li class="flow-item-square-fail">失败</li>
          <li class="flow-item-square-success">成功</li>
          <li class="flow-item-square-exception">异常</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { jsPlumb } from 'jsplumb/dist/js/jsplumb.js'
import 'jsplumb/css/jsplumbtoolkit-defaults.css'
import { IdssWidget, IdssElementResizeable, IdssContextMenu, IdssIconSvg } from './index.js'
// 拖拽元素中的最小宽高
const MIN_WIDTH = 120
const MIN_HEIGHT = 65
const FLOW_CHART_CONF = {
  // 生成的label id 开头前缀
  labelIdPrefix: 'overlay-'
}

const FlowItem = {
  components: {
    IdssElementResizeable,
    IdssContextMenu,
    IdssIconSvg
  },
  props: {
    flowChart: {
      type: Object,
      default () {
        return jsPlumb
      }
    },
    node: {
      type: Object,
      default () {
        return {
          position: {}
        }
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    // 当前流程块显示的色值
    status: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      // 执行进程中的颜色值
      itemColorConf: {
        /* 未执行 */
        '-1': 'flow-item-square-todo',
        /* 执行中 */
        '0': 'flow-item-square-execute',
        /* 失败 */
        '1': 'flow-item-square-fail',
        /* 成功 */
        '2': 'flow-item-square-success',
        /* 异常 */
        '3': 'flow-item-square-exception'
      },
      // 节点类型配置
      nodeTypeConfig: {
        analysis: '分析',
        survey: '调查',
        disposal: '处置',
        reference: '引用'
      }
    }
  },
  methods: {
    edit () {
      this.$emit('node-edit', this.node)
    },
    delete () {
      this.$emit('node-delete')
    },
    resizing (positon) {
      this.flowChart.repaintEverything()
      this.$emit('update-position', positon)
    },
    contentMenu (event) {
      if (this.readOnly || this.node.type === 'start') {
        // 只读模式 不触发右键事件
        return
      }
      event.stopPropagation()
      event.preventDefault()
      // 最后调用 openMenu
      this.$refs['context-menu'].openMenu(event)
    }
  },
  mounted () {
    if (this.readOnly) {
      // 只读模式
      return
    }

    // 创建 Endpoint, Endpoint 主要是连线使用
    const common = {
      endpoint: ['Dot', { radius: 5 }],
      paintStyle: { fill: '#929FB4' },
      connectorStyle: { stroke: '#929FB4', strokeWidth: 1 },
      connectorHoverStyle: { strokeWidth: 3 },
      isSource: true,
      isTarget: true
    }

    const node = this.$el
    this.flowChart.draggable(node, {
      containment: true,
      stop: data => {
        // 拖拽完毕，更新父级中节点信息的位置
        this.$emit('update-position', { left: data.pos[0], top: data.pos[1] })
      }
    })
    this.flowChart.addEndpoint(node, {
      anchor: 'Top',
      id: Date.now()
    }, common)

    this.flowChart.addEndpoint(node, {
      anchor: 'Right',
      id: Date.now()
    }, common)

    this.flowChart.addEndpoint(node, {
      anchor: 'Bottom',
      id: Date.now()
    }, common)

    this.flowChart.addEndpoint(node, {
      anchor: 'Left',
      id: Date.now()
    }, common)
  },
  beforeDestroy () {
    this.flowChart.remove(this.$el)
  },
  // 打今日起，彻底沦为一个SOP的业务组件。
  render (createElement) {
    const itemClass = [['flow-item-' + this.node.type]]
    // 判断是否给方形元素填充进程背景色
    let processStatus = (this.node.type === 'square' && this.itemColorConf[this.status]) || ''
    return <idss-element-resizeable
      id={this.node.id}
      class='flow-item'
      w={this.node.position.width}
      h={this.node.position.height}
      l={this.node.position.left}
      t={this.node.position.top}
      minW={MIN_WIDTH}
      minH={MIN_HEIGHT}
      onResizing={this.resizing}>
      <idss-context-menu ref="context-menu" class="flow-context-menu">
        <div class={itemClass} onContextmenu={this.contentMenu}>
          { this.node.type === 'square' && <div class="flow-item-content-type">{(this.node.data && this.nodeTypeConfig[this.node.data.type]) || '未选'}</div> }
          { this.node.data && this.node.data.type === 'disposal' &&
            <idss-icon-svg class="flow-item-content-disposal" name={ +this.node.data.approval === 1 ? 'manual-setting' : 'dui' } />
          }
          <div class={ 'flow-item-content-text ' + processStatus }>
            {this.$slots.default}
          </div>
        </div>
        <ul slot="context-menu" style="min-width: 75px;">
          {this.node.type !== 'rhombic' && <li onClick={this.edit}><idss-icon-svg name="edit"></idss-icon-svg> 编辑</li>}
          <li class="close" onClick={this.delete}><idss-icon-svg name="delete-hover"></idss-icon-svg> 删除</li>
        </ul>
      </idss-context-menu>
    </idss-element-resizeable>
  }
}

export default {
  name: 'idss-flow-chart',
  components: { FlowItem, IdssWidget },
  props: {
    value: {
      type: String,
      default: '{}'
    },
    // 只读模式
    readOnly: {
      type: Boolean,
      default: false
    },
    // 强制缩放
    scale: {
      type: [Number, String],
      default: 1
    },
    // 自动缩放
    autoScale: {
      type: Boolean,
      default: false
    },
    // 显示背景色
    visibleBackgroundColor: {
      type: Boolean,
      default: true
    },
    // 显示图例
    visibleLegend: {
      type: Boolean,
      default: true
    },
    // 流程中的执行进程显示
    status: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const nodes = JSON.parse(this.value)
    // 初始化开始节点
    if (!this.readOnly && !nodes.start) {
      nodes.start = {
        id: 'start',
        type: 'start',
        position: {
          left: 10,
          top: 110,
          width: 70,
          height: 40
        },
        text: '开始',
        next: {}
      }
    }
    return {
      scaleStyle: {},
      flowChart: jsPlumb.getInstance(),
      nodes: nodes,
      // 设置连接曲线模式
      connectType: false,
      // 拖拽样例的宽度，需要根据这个值判断拖拽元素是否已经进入了拖拽面板
      operationListWidth: 180
    }
  },
  watch: {
    async value (newVal) {
      await this.$initFlowChart(newVal)
      this._isScale()
    }
  },
  methods: {
    // 创建元素节点
    createElem (type, position) {
      const id = Date.now()
      this.$set(this.nodes, id, { id, type, position, next: {}, prev: [] })
    },

    // 编辑一个元素
    nodeEdit (node) {
      this.$emit('node-edit', JSON.parse(JSON.stringify(node)))
    },

    // 删除一个元素节点
    deleteElem (key) {
      this.$delete(this.nodes, key)
    },

    // 更新元素移动后的position信息
    updatePosition (key, position) {
      this.$set(this.nodes[key], 'position', {
        ...this.nodes[key].position,
        ...position
      })
    },

    // 初始化样例元素可以拖拽
    initDragElem () {
      // 示例父级元素
      const parentRect = this.$refs['operation-list'].getBoundingClientRect()
      // 固定的方形元素
      const squareRect = this.$refs['square-case'].getBoundingClientRect()
      // 固定的菱形元素
      const rhombicRect = this.$refs['rhombic-case'].getBoundingClientRect()
      // 计算方形元素相对于父级元素的 left 与 top 值
      const squarePosition = {
        left: squareRect.left - parentRect.left + 'px',
        top: squareRect.top - parentRect.top + 'px'
      }
      // 计算菱形元素相对于父级元素的 left 与 top 值
      const rhombicPosition = {
        left: rhombicRect.left - parentRect.left + 'px',
        top: rhombicRect.top - parentRect.top + 'px'
      }

      // 初始化 拖动样例元素的位置，通过绝对定位覆盖
      this.setPosition(this.$refs['square-case-move'], squarePosition)
      this.setPosition(this.$refs['rhombic-case-move'], rhombicPosition)

      // 初始化拖拽事件
      this.flowChart.draggable(this.$refs['square-case-move'], {
        containment: true,
        // clone: true,  这个属性不好用，只能用两个元素模拟一下了
        stop: data => {
          // 拖动完毕 还原元素位置
          this.setPosition(data.el, squarePosition)
          // data.post 是left 和 top 值, 下标0的元素是left。如果元素当前的left值大于拖拽样例宽度，说明元素已经被完全拖入了拖拽面板中
          if (data.pos[0] >= this.operationListWidth) {
            // 拖动成功。去除拖拽列表的宽度，得到在拖拽面板中正确的left值
            this.createElem('square', { left: data.pos[0] - this.operationListWidth, top: data.pos[1], width: MIN_WIDTH, height: MIN_HEIGHT })
          }
        }
      })

      this.flowChart.draggable(this.$refs['rhombic-case-move'], {
        containment: true,
        // clone: true,  这个属性不好用，只能用两个元素模拟一下了
        stop: data => {
          // 拖动完毕 还原元素位置
          this.setPosition(data.el, rhombicPosition)
          // data.post 是left 和 top 值, 下标0的元素是left。如果元素当前的left值大于拖拽样例宽度，说明元素已经被完全拖入了拖拽面板中
          if (data.pos[0] >= this.operationListWidth) {
            // 拖动成功。去除拖拽列表的宽度，得到在拖拽面板中正确的left值
            this.createElem('rhombic', { left: data.pos[0] - this.operationListWidth, top: data.pos[1], width: MIN_WIDTH, height: MIN_HEIGHT })
          }
        }
      })
    },

    // 设置元素的绝对定位位置(拖拽样例使用)
    setPosition (ref, position) {
      ref.style.top = position.top
      ref.style.left = position.left
    },

    // 生成连线上的 label 文字
    generateLabel (line) {
      return ['Label', {
        label: line.text,
        location: 0.5,
        cssClass: line.type === 'yes' ? 'flow-label-yes' : 'flow-label-no',
        id: FLOW_CHART_CONF.labelIdPrefix + line.id
      }]
    },
    // 初始化流程图
    async $initFlowChart (json) {
      if (json) {
        // 先清空节点元素。 (主要是情况dom元素，因为如果有相同ID的元素的话 FlowItem 组件不会销毁，导致 Endpoint 的位置错乱)
        this.nodes = []
        await this.$nextTick()
        this.nodes = JSON.parse(json)
        await this.$nextTick()
      }

      // 设置连线
      for (let key in this.nodes) {
        const currentNode = this.nodes[key]
        if (currentNode.next) {
          for (let nextKey in currentNode.next) {
            const nextData = currentNode.next[nextKey]
            const commonConf = {
              endpointStyle: { radius: 5, fill: '#929FB4' },
              isSource: true,
              paintStyle: { stroke: '#929FB4', strokeWidth: 1 },
              hoverPaintStyle: { strokeWidth: 3 },
              isTarget: true,
              anchors: [nextData.sourceAnchor, nextData.targetAnchor],
              // 设置自定义的key，主要是与 node 中 next 数据id对应起来
              data: { id: nextKey }
            }
            // 是否需要在连线上添加overlay
            if (nextData.type && nextData.type !== 'none') {
              commonConf.overlays = [this.generateLabel(nextData)]
            }
            // 创建连线
            this.flowChart.connect({
              source: this.$refs['ref-' + currentNode.id][0].$el,
              target: this.$refs['ref-' + nextData.nextId][0].$el
            }, commonConf)
          }
        }
      }

      // await this.$nextTick()
      // 只读模式下计算本身宽高，类似图片的概念
      if (this.readOnly) {
        // 给容器设置宽高
        const [flowWidth, flowHeight] = this._getContainerWAndH()
        this.scaleStyle = {
          width: flowWidth + 'px',
          height: flowHeight + 'px'
        }
      }
    },

    // 获取流程图的JSON数据
    $getJSON () {
      return JSON.stringify(this.nodes)
    },

    // 设置节点数据
    $setNodeData (node, info) {
      const { text, data } = info
      // 设置节点上面显示的文字
      this.$set(this.nodes[node.id], 'text', text)
      // 设置节点上自定义的数据
      this.$set(this.nodes[node.id], 'data', data)
    },

    // 设置连线数据
    $setLineData (flowData, info) {
      const { node, line } = flowData
      if (line.type === info.type && line.text === info.text) {
        // 一样的设置无需变更
        return
      }
      const nextData = this.nodes[node.id].next[line.id]
      this.$set(this.nodes[node.id].next, line.id, Object.assign({}, nextData, info))
      // select 方法是选择所有的连线，文档上没有单独的选择一条线api
      this.flowChart.select().each(connection => {
        const connectId = connection.getData().id || connection.id
        if (connectId !== line.id) {
          return
        }
        const overlayId = FLOW_CHART_CONF.labelIdPrefix + connectId
        // 先移除。他没有update的api(正常操作应该是先获取已存在的，然后再更新)
        connection.removeOverlay(overlayId)
        // 需要设置label
        if (info.type && info.type !== 'none') {
          // 设置覆盖遮罩层
          connection.addOverlay(this.generateLabel(this.nodes[node.id].next[line.id]))
        }
      })
    },

    // 处理缩放问题
    $scale () {
      const [flowWidth, flowHeight] = this._getContainerWAndH()
      // flow chart 的父级元素宽高
      const { width, height } = this.$el.parentNode.getBoundingClientRect()
      const scale = Math.min(width / flowWidth, height / flowHeight)
      if (scale < 1) {
        this.scaleStyle = {
          transform: `scale(${scale})`,
          'font-size': 14 + (10 - scale * 10) + 'px',
          'width': flowWidth + 'px',
          'height': flowHeight + 'px'
        }
      } else {
        this.scaleStyle = {
          width: '100%',
          height: '100%'
        }
      }
    },

    // 根据当前节点获取 container 的最小宽度与高度
    _getContainerWAndH () {
      // 最小宽高度 320px
      let maxLeft = 320
      let maxTop = 150

      // 获取最大的 left + width 的值 、top + height 的值， 来确定足够的宽高
      const nodeList = Object.values(this.nodes)
      const leftList = nodeList.map(val => val.position.left + (val.position.width || MIN_WIDTH))
      const topList = nodeList.map(val => val.position.top + (val.position.height || MIN_HEIGHT))

      maxLeft = Math.max(maxLeft, ...leftList)
      maxTop = Math.max(maxTop, ...topList)

      // 20是左右padding + 选项列表的宽度
      const flowWidth = maxLeft + 20 + (this.readOnly ? 0 : this.operationListWidth)
      // 60 是 lenged的高度(25) + 上下的padding(15) + 流程图与lenged的间距(20)
      const flowHeight = maxTop + 60

      return [flowWidth, flowHeight]
    },

    // 判断选择缩放方法
    _isScale () {
      // @FIXME 缩放的处理考虑使用原生ZOOM相关的API是否更好？比如滑动滚轮进行缩放
      // 如果传入的scale 等于 1 的情况下，再看是否设置了 autoScale
      if (+this.scale === 1) {
        // 是否缩放
        this.autoScale && this.$scale()
      } else {
        // 按照传入的 缩放比例走
        const [flowWidth, flowHeight] = this._getContainerWAndH()
        this.scaleStyle = {
          transform: `scale(${this.scale})`,
          'font-size': 14 + (10 - this.scale * 10) + 'px',
          'width': flowWidth + 'px',
          'height': flowHeight + 'px'
        }
      }
    }
  },
  async mounted () {
    this.flowChart.setContainer(this.$refs.box)
    // 基础配置
    this.flowChart.importDefaults({
      Connector: 'Flowchart',
      ConnectionOverlays: [
        ['PlainArrow', { width: 12, length: 12, location: 1, foldback: 0.2 }]
      ]
    })

    // 如果不是只读模式，初始化拖拽元素
    !this.readOnly && this.initDragElem()

    // 连线完毕。每次拖动连线都会触发(正常操作下，不包括拖动后删除之类的)
    this.flowChart.bind('connection', (info, originalEvent) => {
      const connection = info.connection
      // 获取线的id，优先使用自定义设置的id
      const connectId = connection.getData().id || connection.id
      // 源节点数据
      const source = this.nodes[info.sourceId]

      if (!this.readOnly) {
        // 如果不是只读模式，绑定事件
        connection.unbind('dblclick')
        connection.bind('dblclick', _ => this.$emit('line-edit', {
          node: JSON.parse(JSON.stringify(source)),
          // 当前连线的数据
          line: Object.assign({}, source.next[connectId])
        }))
      }

      if (!originalEvent) {
        // 说明是初始化连接触发的事件，不设置数据
        return
      }
      /**
       * targetId 连接的目标id
       * connection.endpoints[0].anchor.type 连线源头的位置(上下左右)
       * connection.endpoints[1].anchor.type 连线目标的位置
       */
      const nextData = source.next[connectId] || {}
      this.$set(source.next, connectId, { ...nextData, id: connectId, nextId: info.targetId, sourceAnchor: connection.endpoints[0].anchor.type, targetAnchor: connection.endpoints[1].anchor.type })
      // 设置target元素的 上一个节点ID
      if (this.nodes[info.targetId].prev === undefined) {
        this.$set(this.nodes[info.targetId], 'prev', [])
      }
      const targetPrev = this.nodes[info.targetId].prev
      if (!targetPrev.includes(info.sourceId)) {
        targetPrev.push(info.sourceId)
      }

      // 如果是判断框，并且还没有设置过判断类型
      if (source.type === 'rhombic' && !source.next[connectId].type) {
        this.$emit('line-edit', {
          node: JSON.parse(JSON.stringify(source)),
          // 当前连线的数据
          line: Object.assign({}, source.next[connectId]),
          // 标记是自动触发，并非是用户双击连接线触发的。
          autoTrigger: false
        })
      }
    })

    // 连接线移动后触发该事件。第一次线建立连接时不会触发
    this.flowChart.bind('connectionMoved', info => {
      // 有一种情况，比如从source的top移动到了left、right、bottom的情况下也会触发connectionMoved事件
      // 满足下面这种情况说明，source 或者 target 中的一个变了
      if (info.originalSourceId !== info.newSourceId || info.originalTargetId !== info.newTargetId) {
        // target 元素上的 上一级节点
        const originalTargetPrev = this.nodes[info.originalTargetId].prev
        // 移除 original target 上的 上一级节点
        originalTargetPrev.splice(originalTargetPrev.indexOf(info.originalSourceId), 1)

        // sourceId 不一致说明source换了
        if (info.originalSourceId !== info.newSourceId) {
          const conId = info.connection.getData().id || info.connection.id
          // 删除旧的source节点上的 next 连线信息( 此处只负责删除next， 添加next的操作在 connection 事件中处理)
          this.$delete(this.nodes[info.originalSourceId].next, conId)
        }
      }
    })

    // 删除连线 两种情况会触发 1. 删除连线 2. 删除节点的时候，节点上面的连线都会被删除
    this.flowChart.bind('connectionDetached', info => {
      // 删除节点上的next信息
      const conId = info.connection.getData().id || info.connection.id
      // 如果 this.nodes[info.sourceId] 存在，删除其上面的next对应的下个连接节点
      if (this.nodes[info.sourceId]) {
        this.$delete(this.nodes[info.sourceId].next, conId)
      }

      // 如果 target 节点存在 删除节点中的 prev 一个
      if (this.nodes[info.targetId]) {
        // target 元素上的 上一级节点
        const originalTargetPrev = this.nodes[info.targetId].prev
        // 移除 original target 上的 上一级节点
        originalTargetPrev.splice(originalTargetPrev.indexOf(info.sourceId), 1)
      }
    })

    // 初始化数据
    await this.$initFlowChart()
    // 缩放处理
    this._isScale()
  }
}
</script>
<style scoped lang="postcss">
.flow-chart-container {
  --idss-flow-chart-bg: #fff;
  --idss-flow-chart-case-text-color: #929fb4;
  --idss-flow-chart-drop-bg: rgba(246, 249, 255, 1);

  --idss-flow-chart-label-yes-color: #f58719;
  --idss-flow-chart-label-yes-bg: rgb(253, 243, 229);

  --idss-flow-chart-label-no-color: #f3613b;
  --idss-flow-chart-label-no-bg: rgb(252, 237, 237);

  --idss-flow-chart-start-bg: #7a9af8;
  --idss-flow-chart-start-color: #fff;
  --idss-flow-chart-square-bg: #0099ff;
  --idss-flow-chart-square-color: #fff;
  --idss-flow-chart-rhombic-color: #f58719;

  --idss-flow-chart-content-color: #666;
  --idss-flow-chart-content-type-border: var(--color-line-1,#d8e0e6) solid #f2f2f2;
  --idss-flow-chart-content-bg: #fff;

  /* 未执行 */
  --idss-flow-chart-square-todo-bg: #d48806;
  /* 执行中 */
  --idss-flow-chart-square-execute-bg: #4a90e2;
  /* 成功 */
  --idss-flow-chart-square-success-bg: #08979c;
  /* 失败 */
  --idss-flow-chart-square-fail-bg: #d4380d;
  /* 异常 */
  --idss-flow-chart-square-exception-bg: #d4b106;

  width: 100%;
  height: 100%;
  font-size: 14px;
  position: relative;
  user-select: none;
  display: flex;
  /* 处理缩放左上角空白问题 */
  transform-origin: 0 0 0;

  /* 拖动中的元素 zIndex 层级变高 */
  & >>> .jtk-drag {
    z-index: 9999999;
  }

  /* 添加元素的列表 */
  & .operation-list {
    background-color: var(--idss-flow-chart-bg);

    & .operation-case-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      & .operation-case-text {
        font-size: 12px;
        color: var(--idss-flow-chart-case-text-color);
        text-align: center;
        margin: 10px 0;
      }
    }
  }

  & .drop-container{
    width: 100%;
    height: 100%;
    overflow-x: auto;
    display: flex;
    padding: 10px 10px 5px 10px;
    flex-direction: column;

    &.visible-background-color {
      background-color: var(--idss-flow-chart-drop-bg);
      border: var(--color-line-1,#d8e0e6) solid var(--line-size-default,1px);
    }

    & .flow-item-lenged{
      min-height: 25px;
      color: var(--idss-flow-chart-square-color);

      & > ul {
        display: flex;
        justify-content: center;
        font-size: 14px;
        margin: 0;

        & > li {
          margin: 0 5px;
          padding: 0px 10px;
          border-radius: 4px;
          &:hover {
            opacity: 1;
          }
        }
      }
    }

    /* 拖拽的面板 */
    & .drop-board {
      position: relative;
      flex-grow: 1;
      margin-bottom: 5px;

      & >>> .flow-label-yes {
        color: var(--idss-flow-chart-label-yes-color);
        height: 26px;
        padding: 0 5px;
        background-color: var(--idss-flow-chart-label-yes-bg);
        line-height: 24px;
        text-align: center;
        border: var(--color-line-1,#d8e0e6) solid rgba(245, 135, 25, 0.8);
        border-radius: 2px;
      }

      & >>> .flow-label-no {
        color: var(--idss-flow-chart-label-no-color);
        height: 26px;
        padding: 0 5px;
        background-color: var(--idss-flow-chart-label-no-bg);
        line-height: 24px;
        text-align: center;
        border: var(--color-line-1,#d8e0e6) solid rgba(243, 97, 59, 0.8);
        border-radius: 2px;
      }
    }

    /* 未执行 */
    & >>> .flow-item-square-todo {
      background-color: var(--idss-flow-chart-square-todo-bg)!important;
      opacity: 0.8;
    }

    /* 执行中 */
    & >>> .flow-item-square-execute {
      background-color: var(--idss-flow-chart-square-execute-bg)!important;
      opacity: 0.8;
    }

    /* 成功 */
    & >>> .flow-item-square-success {
      background-color: var(--idss-flow-chart-square-success-bg)!important;
      opacity: 0.8;
    }

    /* 失败 */
    & >>> .flow-item-square-fail {
      background-color: var(--idss-flow-chart-square-fail-bg)!important;
      opacity: 0.8;
    }

    /* 异常 */
    & >>> .flow-item-square-exception {
      background-color: var(--idss-flow-chart-square-exception-bg)!important;
      opacity: 0.8;
    }
  }

  /* 选项列表中的方块形状 */
  & >>> .square-case {
    width: 95px;
    height: 41px;
    background-color: var(--idss-flow-chart-square-bg);
    border-radius: 6px;
  }

  & >>> .rhombic-case, & >>> .flow-item-rhombic {
    width: 95px;
    height: 41px;
    background-size: 100% 100%;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAA5CAYAAAAm20U5AAAIKElEQVR4Ae1caWxUVRQ+982bfYPSFhRB2lJpcacFlYAGfxoTo39dosY/JlIiLnE3LqhxQaEmRmOCoj8MEYyJ8Y+JdYtLFxSNLJaZ1ipIl6GdpbO87XrO6DSTYUpfOzNvZpj3/rxl7r3n3O+bd945995zAar02Ldvn0Ud6r9XHRr4g850X6VdAVaNisvBgc0Cg26wCDbwLHawWDjJVUXSOGy1Nnd8W219qioS4se+X26z2V5hjG0B75IIOD0XzQCeiP0B0ZCPc94jSdJDrjUbT8z8VuEXVUHC4ODn9maxcTsI7AGweUbAt/gKYPgu5B5c0yAyeQik2ErQ+GtBZWxna+sNqdxilXZ/ZkcqTEMlMHAjs8DrTLTGua9hFYhW35wqKnKERcaHuSK7uAr3iy0dn81Zp4wFKpaEZODHVlGw7kLTczH46zWwu1bNG6dUfBjCEwKaqN8VTd7maLl6cN5tGFCh4kgY+73Hs9jle1Jg7B5wev8Cz6LLgRWgJucAsalDkIiu0Dh/dzIeea7x4i0xA7DVLaKA3umWobugEuy9jVnEl5hoG+P+hjYQLE7dlecqqKkJFh4/yhWpET2pR8TmDR/OVcWo3yuCBGmwf51ghd2MCUthUaMLrI7zSwaAnDwJU2NxzrVRTYYuW2vnwZLJ0tlwWUmIHOuvd9nY82h6buEe/zg4fWsLMj06Ow1kohKRwxhfNKCJOhCX+BO+NZ0TeqsXu5xQ7Ab1tJeOdoN997lt7DCzO9fz+gsWg8tvDAGkIH1jUB7JJfmkh4r6lCvqNvxNkId6rxNAwGhXtKDpWQqibYke4kpaRpFCaKJGQVVUDbSt1qYNX5dUXk7jhpEQP967wmaxvIIx1mbwLJkGp7s1R5fy3yamByEWcnONfyup6kOu1Rv+MkKpkpOQjnatDQ8CWLYj8H/iWE/+aNeI3uqRgQxAbPIXSExfCKDuDMrjr5Y66i4pCcpQ303o8exElzOKLmczmiCvHhwqooyqRNGlDaJL60VParvYtP7TUulVEhKSwb41ImMY7Qpt4G8AsDvxX1WlRyrxJ4TH0aHSjiqcb3M0rz9W7J4UlYTxo995FzkcT6HLeRc4/SfA7b/MEJez2Kjktkcu7XT4V0iEl6NLu2cqmXy2oW1TNLfYQu+LRQJTgn23C4LwIrfaR/Hf347RrmOhSlVsPU1N4ltxhMmppZqmPSo2r/8AdUWGCjsKJkEK/NQpCJZuZrEsAX+jF6z2ZYWpVAW15dQpCI9FuaqGNE3damu5qr8QrRdMQnTwmwan1fUCA3YTejwTONjWfk6YHr1opqPu6BH0pOo58E8Tcvwxb+u143qrZ5ebd8Tc09Mj4pxul8vqxmjXvQ4aVmC066stAgjBdNSN/cb+Ew6EB+FC+GQDrOd6Xm+CfHzgekHku0EQGZqeZWC11ekRUhNlZOk0mqhToClcU1iXdXXHl3r7rYuERKB/pdUCr6HLuRHcdQlweVr0Cqi5cvFYAKZPO9Gl/V5W4QFnS+fIXBiclYShoR7HSvA+DIKwDezuEfDW0QTLWevMJbAmfsepPIiePgSpaZzr1naNQPTlpqYtydn6PiugyvDAzfgjRbth7qtvwbldz2yNmM9nQUCRYywyEcCo249+7HZxVccn+UqeQUJq+Id2C9hwgoWtRn9fAJtzZb6K5rN5ICAlRjC+wDiPH1dB6rKvuuZIdu0ZEk4H+v1egT0tCHAHTq6cBPeiS2vK5cxGpRTX6ah76jecTDofF+bsjWr8mbqWzjCJIhKYMtR7p8AsO7jVcQpXNqzFaNdeCj3MNhEBTU3hCpDDTE4u07j6uNi04T2Gtr8bmbgPVzUEcLbJ9HqM+qfEwwFcBdKC34o3BfxYdHGu3s1iUy6YHP05zZRRitSiHHoTEGfCm3An/Cli5vhK7JlSebsmJb+C0N8xDMV/S0+G1yJIpeozfRMIV8SXcCa8CXfCf+bDnJFtekcZJIp41usd5Yo044RcRBZwrzNOmHUAjwKLER5p53LqAEz+I0Ek9AuaKHynzGNOBAgnwgtxI/wIx9kCNWrrDHOUT4A5dpQPlVmeFXvsKFdM1igq4CjqeeYoahZCBYyizmqOspqfuaTh2W+GolfgIql38FXTMBQ/CDhwO1OgFi+o/4QD4aEqbxM+8xnGJsh0maN82Joza/h5TBRnZm3BJGSIMeeYyzjHnCHh/zOOP/XfgUtdXqiZ1RacPyY2de7F/hfsMc7rm5ADfPYtRt2d70/KcruWSn6JUeE0RKd+PWeibvLMqT/YL+pfKJloo/4WgwACsWBzlM1E5tpcgZdBQt+5JCRkRJtrUTNInP1cLHOUVwotog3Ko2u5lPoYQidlCId+Rpe2YBuaV1ixHpJ+pCfqS3qT/qVcDExql/RNyMblv/wE4VUmCJvM/IRsZAwkISM2k6mDWZoWXkGZOgwzdTCrsyyZOiU1Rxngs8+UirS/L3glZtu/BSGMMqfGDuKykPJE3SSX5KMepA/pZXSqFGFjmDnKJiJz/X/25g6ML27mbszedBmYvRnH7M3pdPbmJ5i9+Xg5szfLSkKGDDOPOYNE+c+Y49B7ay1m9Bv+TTgL15y2OgjFwm2qlPoCJk4kIIrb5hQ6j5SOdrEdbI/apfYraUsFwqMizFE+YpKBny4SBfENc5eXfOgY/KwW9juqJHOUl17aMAqj1ku4LH0EkzNRt5a3MO38RdEulqPyVK/SN5yiflSsOcoHsrkHXj5UyvTsXNsNsuLNUT6eadvN/X2BDlDVbjQ/Clflbrqvxu04qX//AiIoYyw0j9gWAAAAAElFTkSuQmCC);
    /* background-color: rgba(0, 153, 255, 1); */
    /* border: 1px solid rgba(0, 153, 255, 1); */
  }

  /* 可以移动的节点基础样式 */
  & >>> .flow-item {
    position: absolute;

    & .flow-item-text {
      padding: 10px;
    }
    & .flow-item-square, & .flow-item-rhombic, & .flow-item-start {
      width: 100%;
      height: 100%;
      /* width: 120px;
      height: 60px; */
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  & >>> .flow-context-menu{
    width: 100%;
    height: 100%;
  }

  /* 开始 */
  & >>> .flow-item .flow-item-start {
    /* width: 70px; */
    color: var(--idss-flow-chart-start-color);
    background-color: var(--idss-flow-chart-start-bg);
    border-radius: 6px;
  }

  /* 方块 */
  & >>> .flow-item-square{
    color: var(--idss-flow-chart-square-color);

    & .flow-item-content-type{
      width: 20px;
      height: 45px;
      color: var(--idss-flow-chart-content-color);
      font-size: 12px;
      text-align: center;
      padding: 4px;
      border: var(--idss-flow-chart-content-type-border);
      border-radius: 5px;
      background: var(--idss-flow-chart-content-bg);

      position: absolute;
      transform: translatey(-50%);
      top: 50%;
      left: 0;
      z-index: 1;
    }

    /* 执行处置 显示icon 在左上角 */
    & .flow-item-content-disposal {
      fill: var(--idss-flow-chart-content-bg);
      position: absolute;
      top: 4px;
      right: 4px;
    }

    & .flow-item-content-text {
      &:hover {
        opacity: 1;
      }
      width: 100%;
      height: 100%;
      padding-left: 10px;
      background-color: var(--idss-flow-chart-square-bg);
      border-radius: 6px;
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /* 菱形 */
  & >>> .flow-item-rhombic{
    color: var(--idss-flow-chart-rhombic-color);

  }

  /* 连接曲线的时候显示 */
  & .connect-line >>> .jtk-endpoint {
    display: block;
  }

  /* 不连接曲线的时候隐藏 */
  & >>> .jtk-endpoint {
    display: none;
  }
}
</style>
