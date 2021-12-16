<!--
 * @Author: your name
 * @Date: 2020-08-27 15:20:26
 * @LastEditTime: 2020-09-07 16:08:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/components/commons/idss-pagination.vue
-->
<template>
  <div :style="[{ padding: '0', 'text-align': 'right' }, styles]">
    <!-- http://element.eleme.io/#/zh-CN/component/pagination -->
    <el-pagination
      v-show="tableData.total"
      v-bind="options"
      :current-page.sync="tableData.pageNum"
      :page-size="tableData.pageSize"
      :total="isLimit ? totalLimit : tableData.total"
      @size-change="tableSizeChange"
      @current-change="tablePageChange">
      <!--
        处理ES只能展示10000条数据问题
        调用时可通过layouts="slot, prev, pager, next, jumper"控制
      -->
      <template v-slot>
        <span class="el-pagination__total">
          共 {{tableData.total}} 条
          <template v-if="isLimit">，最多展示 {{totalLimit}} 条</template>
        </span>
      </template>
    </el-pagination>
  </div>
</template>

<script>
import ElPagination from 'element-ui/lib/pagination'
import 'element-ui/lib/theme-chalk/pagination.css'
const defaultOptions = {
  small: true,                                        // 使用小型分页样式
  layout: 'slot, sizes, prev, pager, next, jumper',   // 组件布局，子组件名用逗号分隔
  'page-sizes': [20, 50, 100, 200],                      // 每页显示条目个数
  pagerCount: 7                                       // 页码按钮的数量，当总页数超过该值时会折叠
}
export default {
  name: 'idss-pagination',
  components: { ElPagination },
  props: {
    // 表格数据，通常要包含 { pageNum: number, pageSize: number, total: number }
    tableData: {
      type: Object,
      required: true
    },
    // 样式控制，相同名称会覆盖已有样式
    styles: {
      type: Object
    },
    // 限制最大显示条数
    totalLimit: {
      type: Number
    }
  },
  computed: {
    /**
     * el-pagination props集合
    */
    options () {
      return Object.assign({}, defaultOptions, this.$attrs)
    },
    /**
      * 是否包含最大展示数据条数限制
      */
    isLimit () {
      return this.totalLimit && this.tableData.total > this.totalLimit
    }
  },
  methods: {
    /**
     * 每页展示条数发生改变
    */
    tableSizeChange (pageSize) {
      // 改变每页展示条数后，回到首页
      this.$emit('size-change', { pageSize, type: 'sizeChange' })
    },
    /**
     * 页码发生改变（注意：页面相同时不会触发current-change事件，current-page默认为1）
    */
    tablePageChange (pageNum) {
      this.$emit('page-change', { pageNum, type: 'pageChange' })
    }
  }
}
</script>
