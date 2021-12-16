<template>
  <div class="idss-select-tree-filter">
    <el-popover
      v-model="visible"
      placement="bottom"
      popper-class="idss-select-tree-filter-panel"
      :width="popoverWidth"
      trigger="click"
      @show="show"
      @hide="hide"
    >
      <el-input
        slot="reference"
        v-model="chooseVal"
        :style="{ width: typeof width === 'number' ? width + 'px' : width }"
        class="idss-tree-select-input"
        :title="chooseVal"
        :size="size"
        readonly="readonly"
        :placeholder="placeholder"
        :disabled="disabled"
      >
        <i
          slot="suffix"
          class="el-select__caret el-input__icon"
          :class="visible === true ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i>
      </el-input>
      <div ref="refTree" class="s-treeData el-select-dropdown">
        <el-input
          v-model="filterVal"
          size="mini"
          style="margin-bottom: 10px"
          placeholder="输入名称筛选"
        ></el-input>
        <el-scrollbar
          tag="div"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          class="is-empty"
        >
          <el-tree
            ref="treeHolder"
            style="padding: 0"
            size="mini"
            :data="treeData"
            :show-checkbox="multiple"
            :node-key="defaultProps.id"
            :check-strictly="checkStrictly"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
            @check="checkChange"
          ></el-tree>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "IdssSelectTreeFilter",
  props: {
    width: {
      type: undefined,
      default: "100%",
    },
    size: {
      type: String,
      default() {
        return "mini";
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    checkStrictly: {
      type: Boolean,
      default() {
        return false;
      },
    }, // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    selected: {
      type: undefined,
      default: "",
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    }, // 是否多选
    multiple: {
      type: Boolean,
      default() {
        return false;
      },
    }, // 是否多选
    defaultProps: {
      type: Object, // el-tree的字段映射
      default: () => {
        return {
          id: "id",
          children: "children",
          label: "label",
        };
      },
    },
    placeholder: {
      type: String,
      default: "请输入",
    },
    relatedFields: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      popoverWidth: "", // 弹框宽度
      chooseVal: "", // 选中之后显示的文字
      filterVal: "", // 筛选条件
      visible: false, // 打开状态
      // 数据
      treeData: [],
      // 按钮选中
      active: false,
      // 选中列表
      activeList: [],
      // 默认展开
      defaultExpandedKeys: [],
      // 选中节点
      checkedNodes: [],
    };
  },
  watch: {
    // 监听父组件 传递的data变化，更新数据
    data: {
      deep: true,
      handler: function () {
        this.load();
      },
    },
    multiple: {
      // 是否单选和多选
      type: Boolean,
      default() {
        return false;
      },
    },
    selected: {
      handler: function (val) {
        this.changeSelected(val);
      },
    },
    chooseVal: {
      handler: function (val, oldVal) {
        this.$emit("validate", val, oldVal);
      },
    },
    filterVal(val) {
      this.$refs.treeHolder.filter(val);
    },
  },
  mounted() {
    // 显示动态指定高度
    this.setPopoverWidth();
    this.load();
  },
  methods: {
    setPopoverWidth() {
      if (!this.popoverWidth) {
        let width = this.$el.querySelector(".idss-tree-select-input")
          .clientWidth;
        this.popoverWidth = width > 300 ? width : 300;
      }
    },
    show() {
      if (this.disabled) {
        this.visible = false;
      } else {
        this.setPopoverWidth();
        this.visible = true;
        this.$emit("focusClick");
      }
    },
    hide() {
      this.visible = false;
      setTimeout(() => {
        this.filterVal = "";
      }, 200);
    },
    // 转换数据
    setAttribute(arr) {
      if (Array.isArray(arr) && arr.length > 0) {
        for (let v of arr) {
          // 如果是组类型, 则禁用
          if (
            Array.isArray(v[this.defaultProps.children]) &&
            v[this.defaultProps.children].length > 0
          ) {
            this.defaultExpandedKeys.push(v[this.defaultProps.id]);
            // 递归
            this.setAttribute(v[this.defaultProps.children]);
          }
        }
      }
    },
    changeSelected(val) {
      if (val === null || val === undefined || val === "") {
        val = "";
      }
      let keys;
      if (!this.multiple) {
        keys = val;
      } else {
        if (Array.isArray(val)) {
          keys = val;
        } else {
          keys = val.split(",");
        }
      }
      this.$nextTick(() => {
        if (!this.multiple) {
          let currentNode = this.$refs.treeHolder
            ? this.$refs.treeHolder.getNode(val)
            : null;
          if (currentNode === null) {
            this.checkedNodes = "";
          } else {
            this.checkedNodes = currentNode.data || "";
          }
        } else {
          this.$refs.treeHolder.setCheckedKeys(keys);
          this.checkedNodes = this.$refs.treeHolder
            ? this.$refs.treeHolder.getCheckedNodes()
            : "";
        }
        this.updateChooseVal(this.checkedNodes);
      });
    },
    updateChooseVal(nodes) {
      if (Array.isArray(nodes)) {
        let n = nodes.filter(
          (item) => item[this.defaultProps.id] !== undefined
        );
        if (this.multiple) {
          this.chooseVal = n
            .map((item) => {
              return item[this.defaultProps.label];
            })
            .join(",");
        } else {
          this.chooseVal = n.length === 0 ? "" : n[0][this.defaultProps.label];
        }
      } else {
        this.chooseVal = nodes[this.defaultProps.label] || "";
      }
      !this.chooseVal || this.$emit("afterVule");
    },
    filterNode(value, data) {
      // 模糊查询
      if (!value) return true;
      let reg = new RegExp("^[a-zA-Z]+$");
      reg.test(value) && (value = value.toLocaleLowerCase()); // 匹配是否是全英文进行转换，数据对象中的英文支持小写
      if (this.relatedFields) {
        // 为了处理复合查询
        return (
          data[this.defaultProps.label].indexOf(value) !== -1 ||
          data[this.relatedFields].indexOf(value) !== -1
        );
      } else {
        return data[this.defaultProps.label].indexOf(value) !== -1;
      }
    },
    nodeClick(data, node, tree) {
      if (!this.multiple) {
        if (data[this.defaultProps.id] !== undefined) {
          this.$emit("update:selected", data[this.defaultProps.id]);
          this.$emit("beforeClick");
          this.$emit("nodeClick", data, node, tree);
          this.visible = false;
        } else {
          this.visible = true;
        }
      } else {
        this.visible = true;
      }
    },
    checkChange(node, checkedObj, halfCheckedNodes, halfCheckedKeys) {
      if (this.multiple) {
        this.$refs.treeHolder.setCheckedKeys(checkedObj.checkedKeys);
        let ids = this.$refs.treeHolder
          .getCheckedKeys()
          .filter((item) => item !== undefined);
        let fIds = "";
        if (ids.length !== 0) {
          fIds = ids.join(",");
        }
        this.$emit("update:selected", fIds);
      } else {
        this.$refs.treeHolder.setCheckedKeys([node[this.defaultProps.id]]);
        this.$emit("update:selected", node[this.defaultProps.id]);
      }
      this.$emit("check", node, checkedObj, halfCheckedNodes, halfCheckedKeys);
    },
    load() {
      this.treeData = JSON.parse(JSON.stringify(this.data));
      this.defaultExpandedKeys = [];
      this.checkedNodes = this.$refs.treeHolder.getCheckedNodes();
      // 设置禁用 & 展开 - 递归
      this.setAttribute(this.treeData);
      // 设置选中
      this.changeSelected(this.selected);
    },
  },
};
</script>

<style scoped lang="postcss">
.idss-select-tree-filter-panel {
  & .s-treeData {
    width: 100%;
    position: relative;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
