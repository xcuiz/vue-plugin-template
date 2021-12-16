<template>
  <div>
    <el-select
      ref="select"
      v-model="selection"
      :size="size"
      stretch
      @visible-change="selectVisibleChange"
      @remove-tag="setKeyBySelection"
      popper-class="custom-select"
      :placeholder="placeholder"
      v-bind="select"
      v-on="$listeners">
      <!-- option 隐藏处理 -->
      <el-option
        v-for="item in options"
        :key="item[nodeKey]"
        :label="item[props.label]"
        :value="item[nodeKey]"
        class="is-hide"></el-option>
      <!-- 插槽 -->
      <slot></slot>
      <!-- 下拉树 -->
      <el-tree
        ref="tree"
        :data="data"
        empty-text="暂无数据"
        :node-key="nodeKey"
        :props="props"
        @node-click="nodeClick"
        @check-change="getSelectionBykey"
        @current-change="getSelectionBykey"
        v-bind="tree"
        v-on="$listeners">
        <span slot-scope="{ node, data }">
          <!--  -->
          <slot v-if="$scopedSlots.node" name="node" :node="node" :data="data"></slot>
          <template v-else>{{node.label}}</template>
        </span>
      </el-tree>
    </el-select>
  </div>
</template>
<script>
import ElSelect from 'element-ui/lib/select.js'
import ElTree from 'element-ui/lib/tree.js'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/tree.css'

/**
 * 将对象数据扁平化处理
 * @param {Array} data
 */
const treeToList = function (data, config = {}) {
  if (!Array.isArray(data)) return

  let { children = 'children' } = config
  let tree = JSON.parse(JSON.stringify(data))
  let list = []

  while (tree.length) {
    let item = tree.shift()
    list.push(item)
    if (item[children] && item[children].length) {
      tree = [...item[children], ...tree]
    }
  }
  return list
}

const DEFAULT_SELECT_ATTR = {
  'popper-append-to-body': false
}

const DEFAULT_TREE_ATTR = {
  'expand-on-click-node': false
}

export default {
  name: 'idss-select-tree',
  components: {
    ElSelect,
    ElTree
  },
  props: {
    size: {
      type: String,
      default: ''
    },
    value: {
      type: [Array, String, Number]
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          children: 'children'
        }
      }
    },
    nodeKey: {
      type: String,
      default: 'key'
    }
  },
  data () {
    return {
      // v-model
      selection: ''
    }
  },
  computed: {
    select () {
      return Object.assign({}, DEFAULT_SELECT_ATTR, this.$attrs.select)
    },
    tree () {
      return Object.assign({}, DEFAULT_TREE_ATTR, this.$attrs.tree)
    },
    options () {
      return treeToList(this.data, this.props)
    }
  },
  watch: {
    value: {
      handler: function (newVal) {
        this.selection = newVal
      },
      immediate: true
    },
    selection (newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    /**
     * 下拉框(出现/隐藏)
     */
    selectVisibleChange (visible) {
      if (visible) {
        this.setKeyBySelection()
      }
    },
    getSelectionBykey ({ children = [] }) {
      if(!children) {
        children = []
      }
      let leafOnly = this.tree['leaf-only'] // true: 只选叶子节点 false: 全选
      if (this.tree['show-checkbox']) {
        // (leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false
        this.selection = this.$refs['tree'].getCheckedKeys(leafOnly)
      } else {
        let isLeafNode = !!children.length
        let isLeafOnly = leafOnly && isLeafNode
        // 如果只选叶子节点并且当前节点有叶子节点则不能被选择，否则可以选择
        this.selection = isLeafOnly ? '' : this.$refs['tree'].getCurrentKey()
      }
    },
    setKeyBySelection () {
      if (this.tree['show-checkbox']) {
        this.$refs['tree'].setCheckedKeys(this.selection)
      } else {
        this.$refs['tree'].setCurrentKey(this.selection)
      }
    },
    nodeClick (data, node, tree) {
      this.$emit('nodeClick', data, node, tree)
    }
  }
}
</script>
<style lang="postcss" scoped>
.custom-select {
  .el-select-dropdown__item {
    height: auto;
    padding: 0 10px;
  }
  .el-select-dropdown__item.hover {
    background-color: transparent;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .el-select-dropdown__item.is-hide {
    display: none;
  }
}
</style>
