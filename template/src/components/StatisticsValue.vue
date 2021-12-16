<!--
 * @Author: your name
 * @Date: 2020-12-11 16:09:00
 * @LastEditTime: 2020-12-18 16:50:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/widgets/StatisticsValue.vue
-->
<template>
  <mContainer class="statisticsValue-container">
    <el-row :gutter="20" class="card">
      <el-col :span="colSpan">
        <header>{{ propsData.key }}</header>
        <section>
          {{ propsData.value }}
        </section>
      </el-col>
      <el-col v-if="isShowMoreContent" :span="16" class="infinite-container">
        <ul v-infinite-scroll="load" class="infinite-list">
          <!-- <ul class="infinite-list"> -->
          <li
            v-for="(item, index) in lists"
            :key="index"
            class="infinite-list-item"
          >
            {{ item }}
          </li>
        </ul>
      </el-col>
    </el-row>
  </mContainer>
</template>

<script>
export default {
  components: {
    mContainer: () => import("@/components/components/mContainer/index"),
  },
  props: {
    propsData: {
      type: Object,
      default: () => ({
        key: "", // 名称
        value: "", // 值
        content: [], // 更多文本，无则默认为[]
        type: "statisticsValue",
        colSpan: 4, // 栅栏宽度 4/24
      }),
      validator: (val) => {
        const keysArr = Object.keys(val);
        if (!keysArr.includes("key") || !keysArr.includes("value")) {
          return false;
        }
        if (keysArr.includes("content") && !Array.isArray(val.content)) {
          return false;
        }
        return true;
      },
    },
  },
  data() {
    return {
      currentIndex: 1,
    };
  },
  computed: {
    isShowMoreContent() {
      return this.propsData.content?.length;
    },
    // col 栅栏宽度
    colSpan() {
      return this.isShowMoreContent ? 8 : 24;
    },
    lists() {
      const { content } = JSON.parse(JSON.stringify(this.propsData));
      return content.splice(0, this.currentIndex * 10);
    },
  },
  methods: {
    load() {
      this.currentIndex++;
    },
  },
};
</script>

<style scoped lang="postcss">
.statisticsValue-container {
  height: 100%;
  .card {
    /* height: 150px; */
    padding: 15px 0px 0;
    /* min-height: ; */
    background: #fff;
    header {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      height: 50px;
      color: #000;
    }
    section {
      text-align: center;
      color: #000;
      font-size: 36px;
      font-weight: bold;
    }
    .infinite-container {
      .infinite-list {
        text-align: left;
        overflow: auto;
        height: 120px;
        li {
          padding: 0 6px;
          white-space: normal;
          word-break: break-all;
          word-wrap: break-word;
          line-height: 1.2;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
