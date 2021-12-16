<template>
  <table
    width="100%"
    border="0"
    cellspacing="0"
    cellpadding="0"
    :class="['idss-table-list',headLayout ,border?'hasBorder':'noBorder']">
    <!-- 头部 -->
    <thead
      :class="['title',tableHeadClass]"
      :style="{'background':headBgColor,'height':bgTitleRowHeight+'px'}">
      <tr>
        <th
          :style="headLayout === 'vertical' ?{}:{'max-width':`calc(100% / ${headData.length})`}"
          v-for="(item,index) in headData"
          :key="index">
          <div
            :class="['table_cell', border?'vertical_border':'']"
            :style="{'height':headRowHeight+'px','line-height':headRowHeight+'px'}">
            {{item.label}}
          </div>
        </th>
      </tr>
    </thead>
    <!-- 内容 -->
    <div v-show="!bodyData.length" style="width:100%">
      <div ref="empty"></div>
    </div>
    <tbody
      :class='tableBodyClass'
      v-if="bodyData.length">
      <tr
        v-for="(item,index) in bodyData"
        :key="index">
        <template v-for="(itemValue,indexTd) in headData">
          <td
            :key='indexTd'
            :class="setClass(index, itemValue.prop, itemValue)">
            <div
              :style="{'height': rowHeight+'px','line-height':rowHeight+'px'}"
              :class="['table_cell', border?'vertical_border':'']">
              <template v-if="itemValue.prop!=='custom'">
                {{bodyData[index][itemValue.prop]}}
              </template>
              <slot
                v-else
                :$index='index'
                :name="'custom'+indexTd"
                :row="bodyData[index]"></slot>
            </div>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
<script>
/**
 * @cnName 表格
 * @slot custom 自定义内容使用
 */
import { vueEmptyDataService } from '../mixins'
export default {
  name: 'idss-table-list',
  mixins: [vueEmptyDataService],
  props: {
    data: {
      /**
       * @propCnName 表格数据
       * @propIsApi
       */
      type: Object,
      default: function () {
        return {
          headData: [],
          bodyData: []
        }
      }
    },
    // @propDesc  表头背景颜色
    headBgColor: {
      type: String,
      default: 'aliceblue'
    },
    headRowHeight: {// @propDesc 表头行高
      type: Number,
      default: 38
    },
    rowHeight: { // @propDesc 内容行高
      type: Number,
      default: 38
    },
    headLayout: {// @propDesc 表头的布局
      type: String,
      default: 'horizontal'
    },
    tableHeadClass: {// @propDesc 表格头样式名称
      type: String,
      default: ''
    },
    tableBodyClass: {// @propDesc 表格体样式名称
      type: String,
      default: ''
    },
    border: { //  @propDesc 表格是否有border
      type: Boolean,
      default: false
    },
    rowCellClassName: [Function, String] //  @propDesc 表体单元格样式回调
  },
  computed: {
    headData () { // 表格头部数据
      return this.data.headData
    },
    bodyData () { // 表格内容数据
      return this.data.bodyData
    },
    bgTitleRowHeight () { // 垂直时表头的高度
      return this.headLayout === 'vertical' ? this.rowHeight * this.bodyData.length - 1 : this.headRowHeight
    }
  },
  methods: {
    /**
     * 设置 row 列的样式
     * rowIndex {number} 当前行index
     * prop {string} 当前的prop
     * rowData {string}  当前value
     */
    setClass (rowIndex, prop, rowData) {
      if (!this.rowCellClassName) return
      if (Object.prototype.toString.call(this.rowCellClassName) === '[object Function]') {
        return this.rowCellClassName(rowIndex, prop, rowData)
      } else if (Object.prototype.toString.call(this.rowCellClassName) === '[object String]') {
        return this.rowCellClassName
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 创建暂无数据展示节点
      this.createEmptyDom()
    })
  }
}
</script>
<style scoped lang="postcss">
.idss-table-list {
  border-collapse: collapse;
  margin: 0 auto;
  border: 0px solid #0066cc;
  &.hasBorder {
    border-width: 1px;
    tbody tr:last-of-type td .table_cell {
      border-bottom-width: 0px;
    }
    tbody tr td:last-of-type .table_cell,
    thead tr th:last-of-type .table_cell {
      border-right-width: 0px !important;
    }
  }
  &.noBorder {
    border-top-width: 1px;
  }
  .table_cell {
    font-size: 14px;
    color: #0066cc;
    padding: 0 3px;
    margin: 0;
    border: 0 solid #0066cc;
    border-bottom-width: 1px;
  }

  .vertical_border {
    border-right-width: 1px !important;
  }

  .title {
    min-width: 60px;
  }
  tbody tr {
    text-align: center;
  }
  /* 垂直 */
  &.vertical {
    display: flex;
    tbody {
      display: flex;
      flex-direction: row;
      flex: auto;
      tr {
        flex-direction: column;
        flex-grow: 1;
        display: inline-flex;
      }
    }
    .title tr {
      display: flex;
      flex-direction: column;
    }

    thead.title {
      display: flex;
      flex-direction: column;
    }
  }
  /* 水平 */
  &.horizontal {
    display: flex;
    flex-direction: column;
    thead tr,
    tbody tr {
      display: flex;
      th,
      td {
        flex-basis: 50%;
      }
    }
  }
}
</style>
