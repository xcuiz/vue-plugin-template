<template>
  <div class="model-explore-table-list-container">
    <div
      id="model-explore-table-container"
      class="table-container"
      :style="{ height: tableHeight }"
    >
      <el-table
        id="model-explore-table"
        v-loading="loading"
        max-height="100%"
        class="model-explore-table"
        :data="subTableData"
        stripe
        size="mini"
        :row-class-name="({ row, rowIndex }) => 'table-row-' + rowIndex"
        :cell-class-name="getCellName"
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" min-width="50">
          <template slot-scope="scope">
            {{ getIndex(scope) }}
            <div
              v-show="scope.row.isShowBtn"
              class="toggle-button el-icon-more"
              @click="handleToggleButtonClick(scope.$index, scope.row)"
            ></div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in columns"
          :key="item"
          :prop="item"
          :label="item"
          :min-width="calcMinWidth(item)"
        >
          <template slot-scope="scope">
            <!--基本数据类型-->
            <p v-if="isBasicType(scope.row[item])">{{ scope.row[item] }}</p>
            <!--数组类型-->
            <template v-else-if="Array.isArray(scope.row[item])">
              <!--数组中的每一项是基本数组类型-->
              <template v-if="isBasicTypeArray(scope.row[item])">
                <div
                  v-for="(obj, index) in scope.row[item]"
                  :key="index"
                  class="obj-item-container"
                >
                  <p class="obj-item">{{ obj }}</p>
                </div>
              </template>
              <!--数组中的每一项是对象-->
              <template v-else>
                <div
                  v-for="(obj, index) of scope.row[item]"
                  :key="index"
                  class="obj-item-container"
                >
                  <!--obj是对象-->
                  <p class="obj-item">
                    <span
                      v-for="(value, key, index) in obj"
                      :key="index"
                      class="obj-item-attr"
                    >
                      <el-tag size="mini">{{ key }}</el-tag> : {{ value }}
                    </span>
                  </p>
                </div>
              </template>
            </template>
          </template>
        </el-table-column>

        <div slot="empty" class="empty">暂无结果</div>
      </el-table>
    </div>
    <el-pagination
      small
      :current-page="pageNum"
      background
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="data.length"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "RecordTableList",
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    dateTimeFieldNames: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableData: [],
      // columns: [],
      pageSize: 10,
      pageNum: 1,

      tableHeight: "100%",
    };
  },
  computed: {
    subTableData() {
      return this.tableData.slice(
        this.pageSize * (this.pageNum - 1),
        this.pageSize * this.pageNum
      );
    },
  },
  watch: {
    data(data) {
      if (data.length > 0) {
        // 默认第一条分页
        this.pageNum !== 1 && (this.pageNum = 1);
        // debugger
        // let first = data[0]
        // this.columns = []
        this.tableData = data.map((t) =>
          Object.assign({}, t, {
            isSlideDown: true, // 是否展开，默认展开，通过计算展开后的高度，判断是否显示 显示更多 图标，及同时改为收起状态
            isShowBtn: false, // 判断是否需要展示toggle图标
          })
        );
        // for (let key in first) {
        //   if (first.hasOwnProperty(key)) {
        //     this.columns.push(key)
        //   }
        // }
      } else {
        this.tableData = [];
        // this.columns = []
      }
    },
    pageNum: {
      async handler() {
        // 监听分页变化，分页变化则表格对应的数据源变化，数据源变化后，重新渲染dom，触发相应的事件
        // 因当前页面是前端分页
        await this.$nextTick();
        setTimeout(() => {
          this.$forceUpdate();
        }, 100);
      },
      // immediate: true
    },
    subTableData: {
      handler() {
        this.setTableHeight();
      },
      deep: true,
    },
  },
  methods: {
    // row 无法通过forceUpdate强行渲染，只能通过改动table data 数组长度？
    // getRowClassName () {

    // },
    async setTableHeight() {
      await this.$nextTick();

      const tableBody = document.querySelector(
        "#model-explore-table .el-table__body"
      );
      const tableContainer = document.getElementById(
        "model-explore-table-container"
      );

      const tableBodyHeight = parseFloat(getComputedStyle(tableBody).height);
      const tableContainerHeight = parseFloat(
        getComputedStyle(tableContainer).height
      );

      if (tableContainerHeight > tableBodyHeight) {
        this.tableHeight = "auto";
      } else {
        this.tableHeight = "calc(100vh - 300px)";
      }
    },
    getCellName({ row }) {
      return row.isSlideDown ? "slide_down" : "slide_up";
    },
    // TODO tableData并非当前展示
    async handleToggleButtonClick(index, row) {
      const flag = row.isSlideDown;
      this.$set(row, "isSlideDown", !flag);
      // 强制渲染
      this.$forceUpdate();
    },
    // 是否显示toggle按钮
    async showToggle({ row, $index }) {
      // 定时器延迟50+ms执行  nextTick钩子无效
      setTimeout(() => {
        const height = $(".table-row-" + $index).height();
        // 涉及样式，微调值，修改表格样式时，必须验证及同步修改该值
        const MAX_HEIGHT = 104; // 与css中.cell的maxHeight值一致，兼容obj-item-container 微调
        // console.log('showToggle')
        if (!row.isShowBtn && height > MAX_HEIGHT) {
          row.isShowBtn = true;
        }
      }, 50);
    },
    // 是否是基本数据类型
    isBasicType(obj) {
      return typeof obj !== "object" || obj == null;
    },
    // 是否是基本数据类型的数组
    isBasicTypeArray(arr) {
      if (arr.length === 0) {
        return true;
      }
      return this.isBasicType(arr[0]);
    },
    // 是否是对象数组
    isObjArray(arr) {
      return !this.isBasicTypeArray(arr);
    },
    getIndex({ row, $index }) {
      // 在序列时候，判断toggle图标是否展示
      this.showToggle({ row, $index });
      return this.pageSize * (this.pageNum - 1) + $index + 1;
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
    },
    calcMinWidth(item) {
      const headerWidth = item.length * 14;
      const TIME_WIDTH = 200;

      const isTime = this.dateTimeFieldNames.includes(item);
      if (isTime) {
        return headerWidth > TIME_WIDTH ? headerWidth : TIME_WIDTH;
      }

      if (headerWidth < 70) {
        return 70;
      }

      return headerWidth;
    },
  },
};
</script>

<style scoped lang="postcss">
.model-explore-table-list-container {
  /* min-height: 300px; */

  .table-container {
    display: flex;
    max-height: calc(100vh - 300px);

    >>> .el-table {
      .el-table__body-wrapper {
        height: calc(100% - 40px);
      }
    }
  }
}

>>> .el-loading-spinner {
  margin-top: -15px;

  .circular {
    width: 30px;
    height: 30px;
  }
}

>>> .el-table {
  border: 1px solid rgb(238, 238, 238);
  /*border-bottom: none;*/

  &::before {
    display: none;
  }

  td {
    vertical-align: top;
  }

  th {
    user-select: auto;
  }
}

.empty {
  padding: 70px 0;
}

>>> .el-table th > .cell {
  font-size: var(--font-size-13);
  font-weight: 600;
}

>>> .el-table__header {
  th {
    border-left: 1px solid #e2e2e2;

    &:first-child {
      border-left: none;
    }
  }
}

>>> .el-table__body {
  td {
    padding: 0;
    border: none;

    .column-link {
      color: #4a90e2;
      margin: 0 2px;
      cursor: pointer;
      font-size: var(--font-size-13);
      font-weight: 400;

      &.is-disabled {
        color: #c0c4cc !important;
        cursor: not-allowed !important;
        text-decoration: none !important;
        font-weight: 400 !important;
      }

      &.delete-link {
        color: #f56c6c;
      }

      &:hover {
        text-decoration: underline;
        color: #4282cc;
        font-weight: 700;

        &.delete-link {
          color: #d96060;
        }
      }
    }

    .cell {
      /* min-height: 35px;
      line-height: 35px;
      padding: 5px 10px; */
      font-size: var(--font-size-13);

      .obj-item-container {
        margin-top: 8px;

        &:first-child {
          margin-top: 0;
        }

        .obj-item {
          padding: 6px;
          line-height: 20px;
          display: inline-block;
          background-color: #fcfcfc;
          border-radius: 4px;
          border: 1px solid #e9e9eb;
          color: #666;

          .obj-item-attr {
            display: block;
            margin-top: 4px;

            .el-tag {
              background-color: #ecf5ff;
              color: #409eff;
              border: 1px solid #d9ecff;
            }

            &:first-child {
              margin-top: 0;
            }
          }
        }
      }

      .el-switch {
        &.is-checked {
          .el-switch__core::after {
            margin-left: 18px;
          }
        }

        .el-switch__core {
          height: 18px;
          border-radius: 9px;

          &::after {
            top: 0;
            left: 0;
          }
        }
      }
    }
    &.slide_down {
      .cell {
        max-height: 104px;
      }
    }
  }
}
>>> .el-table__row {
  td {
    position: relative;
    vertical-align: top;
    padding: 8px 0;
  }

  .cell {
    position: static;
    font-size: var(--font-size-12);
    /* max-height: 100px; */

    .toggle-button {
      position: absolute;
      bottom: 9px;
      left: 9px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      color: #9fa1a1;
      font-weight: 200;
      cursor: pointer;
      border: 1px solid #9fa1a1;
      transition: all 0.3s;

      &:before {
        transition: margin-left 0.3s;
      }

      &:hover {
        &:before {
          margin-left: 2px;
        }
      }
    }

    p {
      line-height: 28px;
    }
  }
}
>>> .el-pagination {
  text-align: center;
  /* margin: 20px 0 30px; */

  .el-pagination__total {
    height: 24px;
    line-height: 24px;
  }

  .number,
  .btn-prev,
  .more,
  .btn-next {
    /* width: 24px !important; */
    height: 24px !important;
    line-height: 24px !important;
    font-weight: 400 !important;
    background-color: #fff !important;
    border-color: #d9d9d9 !important;

    &:not(.disabled).active {
      background-color: #409eff !important;
      border-color: #409eff !important;
    }
  }

  .el-pagination__sizes {
    height: 24px !important;

    .el-input {
      width: 90px;
    }

    .el-input__inner {
      height: 24px !important;
      line-height: 24px;
    }

    .el-input__icon {
      line-height: 24px !important;
    }
  }

  .el-pagination__jump {
    height: 24px;
    line-height: 24px;

    .el-pagination__editor {
      height: 24px;
      width: 35px;

      .el-input__inner {
        height: 24px;
        width: 30px;
        line-height: 24px;
        padding-left: 3px !important;
      }
    }
  }
}
</style>
<style>
.exception-model-table-name {
  border: none;
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  padding: 1px 2px;
  text-align: center;
  min-width: 0 !important;
  background-color: #e6e6e5 !important;
  font-size: 12px;
  cursor: default;
  color: #555 !important;
}

.exception-model-table-delete-popconfirm {
  padding: 12px 8px 5px;

  .el-popconfirm__action {
    margin-top: 2px;

    .el-button {
      height: 24px;
      line-height: 24px;
      padding: 0 5px;
      margin-left: 2px;
      font-size: var(--font-size-12);
    }
  }
}
</style>
