<!--
 * @Author: your name
 * @Date: 2020-06-23 17:01:55
 * @LastEditTime: 2020-07-03 18:47:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/system/components/selectTree/index.vue
-->
<template>
  <div class="select-tree-container">
    <header class="header">
      <el-form :model="formData" label-width="90px">
        <el-form-item :label="typeName + '名称'">
          <el-input
            v-model="formData.filterText"
            size="mini"
            placeholder="过滤"
          ></el-input>
        </el-form-item>
      </el-form>
    </header>
    <section>
      <el-tree
        ref="tree"
        auto-expand-parent
        :data="sources"
        show-checkbox
        :node-key="defaultPropsMixin.id"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultCheckedKeys"
        :props="defaultPropsMixin"
        @check="handleSelect"
      >
        <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            描述xxxx
          </span>
        </span> -->
      </el-tree>
    </section>
  </div>
</template>

<script>
export default {
  model: {
    prop: "defaultCheckedKeys", // 为了和v-model默认的value区分，将prop改为自定义的名称
    event: "select", // 为了和v-model默认的input区分，将event改为click
  },
  props: {
    // 是否可编辑
    disabled: {
      type: Boolean,
      default: false,
    },
    // 禁用节点数据-第一步继承来的节点都会被禁止取消
    disabledTreeNodes: {
      type: Array,
      default: () => [],
    },
    // list数据源
    sources: {
      type: Array,
      default: () => [],
    },
    // 模块类型-定制化需求--目前只涉及功能-function
    type: {
      type: String,
      default: "",
    },
    // 模块名称
    typeName: {
      type: String,
      default: "",
    },
    // 选中 [1,2,3]
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    // 配置
    defaultProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "label",
        id: "code",
      }),
    },
    // 用户手动选中的数据组--目前只作用功能
    clickTypeList: {
      type: Array,
      default: () => [],
    },
    // 半节点数据-目前只作用于功能
    allCheckedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // defaultCheckedKeys: this.value,
      formData: {
        filterText: "",
      },
      defaultPropsMixin: Object.assign(
        {
          children: "children",
          label: "label",
          id: "code",
        },
        this.defaultProps,
        {
          // 如果disabled为true表明为详情页面
          // type === 'function'表明为功能页面-涉及继承数据禁止取消操作-禁止操作
          disabled: this.disabled
            ? "code"
            : this.type === "function"
            ? this.disabledFn
            : "",
        }
      ),
    };
  },
  watch: {
    "formData.filterText"(val) {
      this.$refs.tree.filter(val);
    },
    defaultCheckedKeys: {
      handler(val) {
        this.$refs.tree.setCheckedKeys(val || []);
      },
    },
  },
  methods: {
    // 判断当前树节点是否禁用，通过比对禁用组数据
    disabledFn(data) {
      // 根据自己的节点数据条件设置判断
      if (this.disabledTreeNodes.includes(data.code)) {
        return true;
      } else {
        return false;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // getCheckedKeys () {
    // },
    // 点击CheckBox选中、取消时，数据同步
    handleSelect(node) {
      // 获取末级节点数据
      let allKeyArr = this.$refs.tree.getCheckedKeys(false);
      let lastKeyArr = this.$refs.tree.getCheckedKeys(true);
      let halfKeyArr = this.$refs.tree.getHalfCheckedKeys();
      // 第二步-功能-菜单-定制化需求
      if (this.type === "function") {
        // 获取之前末级节点数据
        let oldArr = this.defaultCheckedKeys;
        // 获取用户点击选中操作生成 keys
        let clickArr = JSON.parse(JSON.stringify(this.clickTypeList));
        let clickTmpArr = [];
        // 判断是选中还是取消
        // 如果选择2级，checkedKeys可以获取所有的三级值
        //
        // push click节点
        // 判断当前节点操作是选中还是取消
        let isCheckFlag = [...halfKeyArr, ...allKeyArr].includes(node.code);
        if (isCheckFlag) {
          // 用户选中的节点，只需要末级节点
          clickTmpArr = [
            ...clickArr,
            ...lastKeyArr.filter((item) => !oldArr.includes(item)),
          ];
        } else {
          // 删除节点
          clickTmpArr = clickArr.filter((item) => {
            return !oldArr
              .filter((t) => !lastKeyArr.includes(t))
              .includes(item);
          });
        }
        // 同步点选的值
        this.$emit("update:clickTypeList", clickTmpArr);
        // 同步半节点数据
        this.$emit("update:allCheckedKeys", [...halfKeyArr, ...allKeyArr]);
      }
      // this.getCheckedKeys()
      this.$emit("select", lastKeyArr);
    },
    /**
     * 获取所有选中，半选中节点
     */
    getAllCheckedKey() {
      let allKeyArr = this.$refs.tree.getCheckedKeys(false);
      let halfKeyArr = this.$refs.tree.getHalfCheckedKeys();
      this.$emit("update:allCheckedKeys", [...halfKeyArr, ...allKeyArr]);
    },
  },
};
</script>

<style scoped lang="postcss">
.select-tree-container {
  border: 1px solid #cecece;
  .header {
    border-bottom: 1px solid #cecece;
    padding-right: 20px;
    .el-form-item {
      margin-bottom: 5px;
    }
  }
  section {
    height: calc(100% - 50px);
    overflow: auto;
    padding-right: 20px;
    .custom-tree-node {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
    }
  }
}
</style>
