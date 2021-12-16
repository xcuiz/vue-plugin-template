<!--
 * @Author: your name
 * @Date: 2020-12-02 15:17:04
 * @LastEditTime: 2020-12-14 15:45:11
 * @LastEditors: Please set LastEditors
 * @Description: 内置异常模型-分数配置相关模块
 * @FilePath: /ueba-web/src/views/insight/widgets/BuildInExceptionGoalCard.vue
-->
<template>
  <div class="statistics-detail-container">
    <mContainer :title="propsData.name" class="container">
      <section>
        <p class="des">{{ propsData.des }}</p>
        <el-row class="content">
          <el-col
            v-for="item in propsData.value"
            :key="item.key"
            :style="{ width: 100 / propsData.value.length + '%' }"
          >
            <label>{{ item.key }}</label>
            <span class="active-num">
              {{ item.value }}
            </span>
          </el-col>
        </el-row>
      </section>
    </mContainer>
  </div>
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
        name: "", // 大类名称
        des: "", // 描述
        value: [
          {
            key: "", // 名称
            value: "", // 值
          },
        ],
        type: "statisticsDetails",
        colSpan: 4, // 栅栏宽度 4/24
      }),
      validator: () => {
        return true;
        // const keys = Object.keys(val)
        // if (!keys.includes('value') || !keys.includes('name')) {
        //   return false
        // }
        // if(val.value.)

        // return []
      },
    },
  },
};
</script>

<style lang="postcss" scoped>
.statistics-detail-container {
  height: 100%;
  >>> .container {
    height: 100%;
    /* margin-bottom: 0; */
    section {
      padding-top: 0px;
      padding-bottom: 40px;
      .des {
        font-size: 14px;
        color: #7f7f7f;
        margin-bottom: 15px;
      }
      .content {
        font-weight: 600;
        font-size: 12px;
        color: #3f3f3f;
        .el-col {
          display: flex;
          align-items: center;
          height: 55px;
          span {
            margin-left: 15px;
            &.active-num {
              font-size: 36px;
              color: #d9001b;
            }
            &:not(.active-num) {
              font-size: 20px;
              color: #3f3f3f;
            }
          }
        }
      }
    }
  }
}
</style>
