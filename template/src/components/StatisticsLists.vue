<!--
 * @Author: your name
 * @Date: 2020-12-13 14:14:10
 * @LastEditTime: 2020-12-18 13:33:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/widgets/StatisticsLists.vue
-->
<template>
  <mContainer
    :title="propsData.name"
    style="height: 100%"
    class="shell-name-content"
  >
    <el-row>
      <el-col
        v-for="item in list"
        :key="item.key"
        :style="{ width: 100 / list.length + '%' }"
      >
        <h4>{{ item.key }}</h4>
        <p class="name">{{ item.value }}</p>
      </el-col>
    </el-row>
    <el-row v-if="isEmpty" justify="center" class="empty">
      <el-col> 暂无数据 </el-col>
    </el-row>
  </mContainer>
</template>

<script>
export default {
  components: {
    mContainer: () => import("@/components/components/mContainer/index"),
  },
  props: {
    // 内置异常类型
    type: {
      type: String,
      default: "web_shell",
    },
    propsData: {
      type: Object,
      default: () => ({
        name: "大类名称", // 大类名称
        value: [
          {
            key: "名称", // 名称
            value: "cmd.py", // 值
          },
          {
            key: "来源", // 名称
            value: "来源", // 值
          },
          {
            key: "可信度", // 名称
            value: "100", // 值
          },
        ],
        type: "statisticsLists",
        colSpan: 4, // 栅栏宽度 4/24
      }),
    },
  },
  computed: {
    list() {
      if (this.type === "web_shell") {
        return this.getWebShellData();
      }
      return this.propsData.value;
    },
    isEmpty() {
      return this.list.every(({ value }) => !value);
    },
  },
  methods: {
    /**
     * webShell场景特定需求
     * 1.文件名命中时
     * 1.1 命中且来源不含'参考'   正常显示
     * 1.2 命中且来源包含'参考    名称、可信度正常显示，来源显示为'-'
     * 2.文件名未命中时 显示暂无数据
     */
    getWebShellData() {
      let list = JSON.parse(JSON.stringify(this.propsData.value));
      // 可信度
      let confidenceLevel = list.find(({ key }) => key.trim() === "可信度");
      if (!confidenceLevel) {
        return list;
      }
      // 有可信度模块且可信度模块的值为空时（未命中)，展示为空 --> 数组value全置空-->显示暂无数据
      if (!confidenceLevel.value) {
        list.forEach((t) => {
          t.value = "";
        });
        return list;
      }
      // 命中且来源包含'参考    名称、可信度正常显示，来源显示为'-'
      // debugger
      if (confidenceLevel.value) {
        // 来源
        let source = list
          .find(({ key }) => key.trim() === "来源")
          ?.value.trim();
        if (/.*参考$/.test(source)) {
          list.forEach((t) => {
            if (t.key.trim() === "来源") {
              t.value = "-";
            }
          });
        }
        return list;
      }
      // 命中
      // return list
    },
  },
};
</script>

<style lang="postcss" scoped>
.shell-name-content {
  .empty {
    font-size: 12px;
  }
  .el-col {
    text-align: center;
    h4 {
      font-weight: 650;
      font-size: 12px;
      color: #656565;
      margin-bottom: 30px;
    }
    p {
      font-weight: 400;
      font-size: 12px;
      word-break: break-all;
      &.name {
        color: #409eff;
      }
      &:not(.name) {
        color: #3f3f3f;
      }
    }
  }
}
</style>
