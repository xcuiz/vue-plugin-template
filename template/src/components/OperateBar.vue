<template>
  <div class="operation-buttons">
    <el-row class="group">
      <!--威胁处置按钮-->
      <el-button
        v-if="showDispose"
        size="mini"
        :title="`${disposeName}处置`"
        class="dispose"
        plain
        icon="el-icon-edit"
        @click="handleDisposeButtonClick"
      >
        处置
      </el-button>
      <!-- 威胁处置对话框 -->
      <ThreatenHandle
        v-if="disposeDialogVisible"
        :dispose-name="disposeName"
        :ids="threatIds"
        :visible.sync="disposeDialogVisible"
        :page-type="pageType"
      />
      <!--导出弹出框-->
      <template v-if="pageType === PAGE_TYPE.RULE_RECYCLE_EXCEPTION">
        <el-button
          type="primary"
          size="mini"
          title="彻底删除"
          @click="handleRestore"
          >恢复异常</el-button
        >
        <el-button size="mini" title="彻底删除" @click="handleDelete"
          >彻底删除</el-button
        >
      </template>
      <template v-else>
        <el-popover
          v-model="exportVisible"
          placement="bottom"
          popper-class="operation-buttons-export"
          :visible-arrow="false"
        >
          <div class="export-csv" @click="handleExport">导出csv</div>
          <!--导出按钮-->
          <el-button
            v-if="showExport"
            slot="reference"
            size="mini"
            plain
            class="export"
            title="导出csv"
            icon="el-icon-download"
            >下载</el-button
          >
        </el-popover>
      </template>
    </el-row>
  </div>
</template>

<script>
import BusFactory from "vue-happy-bus";
import ThreatenHandle from "./threatenHandle";
import { deepClone } from "./common/js/util";
import { mapGetters, mapMutations } from "vuex";
import { INSIGHT } from "@/store/type";
import { getAllColumnsAsync } from "./api/table";
import { BUS, PAGE_TYPE } from "./common/js/constant";
import Column, { createColumnType } from "./column";
import { ALL_PAGE_TYPE_MIXIN, IS_DETAIL_MIXIN } from "./common/js/mixins";
let IS_DETAIL = false;
export default {
  name: "OperationButtons",
  components: { ThreatenHandle },
  mixins: [ALL_PAGE_TYPE_MIXIN, IS_DETAIL_MIXIN],
  props: {
    showDispose: {
      /* 是否显示处置按钮 */
      type: Boolean,
      default: false,
    },
    showExport: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      disposeDialogVisible: false, // 是否显示处置对话框
      exportVisible: false, // 是否显示导出csv
      threatIds: [],
      selectedColumns: [], // 本地，选中的列
      columns: [], // 所有的列
      bus: BusFactory(this),
      PAGE_TYPE,
    };
  },
  computed: {
    ...mapGetters("insight", {
      vuexSelectedColumns: "selectedColumns", // Vuex 中，选中的列，与 selectedColumns 对应
    }),
    disposeName() {
      return this.pageType === PAGE_TYPE.LIST_EXCEPTION ? "异常" : "威胁";
    },
  },
  created() {
    IS_DETAIL = this.isDetail;
    this._registerEventListener();
  },
  async mounted() {
    this._setData();
  },
  methods: {
    ...mapMutations("insight", {
      setVuexSelectedColumns: INSIGHT.SET_SELECTED_COLUMNS,
      insertToVuexSelectedColumns: INSIGHT.INSERT_TO_SELECTED_COLUMNS,
    }),
    // 处置
    handleDisposeButtonClick() {
      BusFactory.$emit(BUS.WANT_TO_DISPOSE);
    },
    // 导出
    handleExport() {
      this.exportVisible = false;
      // this.$emit('export-csv')
      BusFactory.$emit(BUS.EXPORT_CSV);
    },
    // 列操作组件的confirm事件
    handleConfirm(selectedColumns) {
      this.selectedColumns = selectedColumns;
      if (!IS_DETAIL) {
        // 列表
        this.setVuexSelectedColumns(deepClone(selectedColumns));
      }
      BusFactory.$emit(BUS.COLUMNS_CHANGE, {
        data: deepClone(selectedColumns),
        recoverFromVuex: false,
      });
    },
    // 列操作组件的reset事件
    handleReset(originColumns) {
      this.selectedColumns = originColumns;
      if (!IS_DETAIL) {
        // 列表
        this.setVuexSelectedColumns(deepClone(originColumns));
      }
      BusFactory.$emit(BUS.COLUMNS_RESET, {
        data: deepClone(originColumns),
        recoverFromVuex: false,
      });
    },
    // mounted 初始化数据
    async _setData() {
      if (!IS_DETAIL) {
        // 列表
        if (this.vuexSelectedColumns.length !== 0) {
          // 从详情页返回
          this.selectedColumns = deepClone(this.vuexSelectedColumns);
          BusFactory.$emit(BUS.COLUMNS_CHANGE, {
            data: deepClone(this.vuexSelectedColumns),
            recoverFromVuex: true,
          });
        }
      }

      const res = await getAllColumnsAsync(this.pageType);
      const columns = [];
      res.map((item) => {
        columns.push(createColumnType(item));
      });
      // 设置所有的列
      this.columns = columns;

      const selectedColumns = [];
      this.columns.map((columnType) => {
        if (columnType.children) {
          columnType.children.map((column) => {
            if (column.checked) {
              selectedColumns.push(new Column(column));
            }
          });
        }
      });
      if (!IS_DETAIL) {
        // 列表
        if (this.vuexSelectedColumns.length === 0) {
          // 第一次进入页面
          this.selectedColumns = selectedColumns;
          // 设置vuex中的selectedColumns
          this.setVuexSelectedColumns(deepClone(selectedColumns));
        }
        // else { // 从详情页返回
        // this.selectedColumns = deepClone(this.vuexSelectedColumns) // 上面赋值过了
        // }
      } else {
        // 详情页
        this.selectedColumns = selectedColumns;
      }
    },

    // 注册事件监听器
    _registerEventListener() {
      // 监听处置按钮事件
      this.bus.$on(BUS.GIVE_YOU_CHECKED_LIST, async (checkedList) => {
        if (checkedList.length === 0) {
          this.$alert(`请先选中需要处置的${this.disposeName}`, "提示", {
            confirmButtonText: "确定",
          });
        } else {
          this.disposeDialogVisible = true;
          this.threatIds = checkedList;
        }
      });

      // 监听新的列数据变化（添加）
      this.bus.$on(BUS.CHECKED_FIELDS_CHANGE, async (code) => {
        let newColumn = null;
        this.columns.map((columnType) => {
          if (columnType.children) {
            columnType.children.map((column) => {
              if (column.code === code) {
                newColumn = column;
              }
            });
          }
        });
        if (newColumn) {
          newColumn = deepClone(newColumn);
          let selectedColumns = deepClone(this.selectedColumns);
          selectedColumns = selectedColumns.filter((column) => {
            // 删除所有带.mono字段的
            return !column.mono;
          });
          // 检查newColumn是否存在于selectedColumns中
          const index = selectedColumns.findIndex((column) => {
            return column.code === newColumn.code;
          });

          if (index === -1) {
            // 不存在则添加.mono字段，表示独一无二
            newColumn.mono = true;
            selectedColumns.splice(1, 0, newColumn); // 在第二项添加一列
          } else {
            // 存在则移动到第二项
            if (index > 1) {
              let column = deepClone(selectedColumns[index]);
              selectedColumns.splice(index, 1);
              selectedColumns.splice(1, 0, column);
            }
          }
          this.selectedColumns = selectedColumns;
          if (!IS_DETAIL) {
            this.setVuexSelectedColumns(deepClone(selectedColumns));
          }
        }

        BusFactory.$emit(BUS.COLUMNS_CHANGE, {
          data: deepClone(this.vuexSelectedColumns),
          recoverFromVuex: false,
          fromAgg: true, // 从agg来的
        });
      });

      // 监听列拖拽事件
      this.bus.$on(BUS.DRAG_TABLE, async (dragInfo) => {
        let { from, to } = dragInfo;
        if (!IS_DETAIL) {
          // 列表
          this.insertToVuexSelectedColumns({ from, to });
        }
        let tmp = this.selectedColumns[from];
        if (from > to) {
          this.selectedColumns.splice(from, 1);
          this.selectedColumns.splice(to, 0, tmp);
        } else if (from < to) {
          this.selectedColumns.splice(from, 1);
          this.selectedColumns.splice(to, 0, tmp);
        } else {
          return;
        }

        BusFactory.$emit(BUS.COLUMNS_CHANGE, {
          data: deepClone(this.selectedColumns),
          recoverFromVuex: false,
          drag: true, // 是否是拖拽导致的列变化
        });
      });
    },

    handleRestore() {
      BusFactory.$emit(BUS.RECYCLE_RESTORE);
    },

    handleDelete() {
      BusFactory.$emit(BUS.RECYCLE_DELETE);
    },
  },
};
</script>

<style scoped lang="postcss">
.operation-buttons {
  height: 45px;

  .el-button.is-plain {
    color: #3c5679;
    border: 1px solid #b5bfcc;
    &:hover {
      box-shadow: 1px 2px 3px 0.06px;
      color: #fff;
      background-color: rgba(74, 144, 226, 1);
    }
  }

  .group {
    width: 100%;
    height: 28px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-right: 5px;
  }

  .dispose,
  .export {
    padding: 0 2px;
    text-align: center;
    height: 24px;
    display: flex;
    align-items: center;
    color: #666;
    border: 1px solid #999;

    &:hover {
      color: #409eff;
      border: 1px solid #388be0;
    }

    >>> i {
      display: inline-block;
      font-size: 18px;
    }

    >>> span {
      display: inline-block;
      font-size: 13px;
      margin: 0;
      line-height: 24px;
    }
  }

  .operate-columns-container {
    margin-left: 10px;
  }

  .dispose {
    margin-right: 10px;

    >>> i {
      font-size: 18px;
    }
  }
}
</style>
<style lang="postcss">
.operation-buttons-export {
  padding: 0;
  margin-top: 2px !important;

  .export-csv {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #eee;
    }
  }
}

/*.operation-buttons-columns {
    padding: 0;
    margin-top: 2px !important;

    .header {
      padding: 0 12px 0 19px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      font-size: var(--font-size-16);
      font-weight: 500;
      border-bottom: 1px solid #eee;

      i {
        padding: 5px;
        cursor: pointer;
      }
    }

    .search {
      padding: 7px 11px;
    }

    .column-list-wrapper {
      overflow: scroll;
      max-height: 330px;
      padding: 0 11px;

      .groups {
        .group-name {
          color: #97a5b8;
          font-size: var(--font-size-13);
          margin: 10px 0;
        }

        .items {
          .item {
            .el-checkbox {
              font-weight: normal;

              .el-checkbox__label {
                font-size: var(--font-size-12);
                margin-left: 12px;
                color: #3f3f3f !important;
              }
            }
          }
        }
      }
    }

    .buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 48px;
      border-top: 1px solid #eee;
    }
  }*/
</style>
