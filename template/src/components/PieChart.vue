<!--
 * @Author: your name
 * @Date: 2020-12-13 13:54:58
 * @LastEditTime: 2020-12-14 15:45:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/widgets/PieChart.vue
-->
<template>
  <mContainer :title="propsData.name" style="height: 100%">
    <idss-pie-chart
      :option="radarOption"
      style="height: 200px"
      :data="chartData"
    >
    </idss-pie-chart>
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
        name: "访问页面返回4xx错误的请求占比", // 大类名称
        value: [["name", "num", "percent"]],
        type: "pieChart",
        colSpan: 4, // 栅栏宽度 4/24
      }),
    },
  },
  data() {
    return {
      radarOption: {},
    };
  },
  computed: {
    // chart数据
    chartData() {
      let { value } = this.propsData;
      // let arr = []
      let arr = value.map((t) => {
        return {
          name: t[0],
          value: +t[1],
          percent: (+t[2] * 100).toFixed(2),
        };
      });
      return arr || [];
    },
  },
  mounted() {
    const data = this.chartData || [];
    this.radarOption = {
      tooltip: {
        trigger: "item",
        formatter: "{b} {d}% ({c})",
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 20,
        top: 20,
        bottom: 20,
        itemGap: 19,
        itemWidth: 12,
        itemHeight: 12,
        formatter(name) {
          let total = 0;
          let val;
          let len = data.length;
          for (let i = 0; i < len; i++) {
            total += data[i].value;
            if (data[i].name === name || data[i].name == null) {
              val = data[i].value;
            }
          }
          return `{NAME|${name}}{COUNT|${val}}{PERCENTAGE|${(
            (val / total) *
            100
          ).toFixed(2)}%}`;
        },
        textStyle: {
          rich: {
            NAME: {
              color: "#3e3e3e",
              width: 150,
            },
            COUNT: {
              color: "#757575",
              width: 90,
            },
            PERCENTAGE: {
              color: "#757575",
              width: 50,
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          center: ["20%", "50%"],
          // labelLine: {
          //   show: false
          // },
          // label: {
          //   show: false
          // }
        },
      ],
    };
  },
};
</script>
<style></style>
