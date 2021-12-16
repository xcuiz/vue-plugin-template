<template>
  <div class="operate-columns-container">
    <!--增加/移除列-->
    <el-popover
      v-model="unfold"
      placement="bottom"
      width="263"
      :visible-arrow="false"
      popper-class="operate-columns-popover-container"
      @after-leave="closeColumnPopover"
    >
      <header class="header">
        <p>增加/移除列</p>
        <i class="el-icon-close" @click="closeColumnPopover"></i>
      </header>
      <div class="search">
        <el-input
          v-model="searchValue"
          size="mini"
          placeholder="请输入"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <ul v-show="!empty" class="column-list-wrapper">
        <li
          v-for="group in tableColumns"
          v-show="showGroup(group)"
          :key="group.code"
          class="groups"
        >
          <p class="group-name">
            <i :class="getIcon(group.code)"></i>
            <span>{{ group.name }}</span>
          </p>
          <ul class="items">
            <li
              v-for="item in group.children"
              v-show="item.show"
              :key="item.code"
              class="item"
            >
              <el-checkbox
                v-model="item.checked"
                :disabled="disabledCheckBox(item)"
              >
                {{ item.name }}
              </el-checkbox>
            </li>
          </ul>
        </li>
      </ul>
      <div v-show="empty" class="empty">
        <i class="el-icon-magic-stick"></i>
        <p class="text">😑 哦豁，空空如也</p>
      </div>
      <div class="buttons">
        <el-button type="primary" size="mini" @click="handleConfirmClick"
          >确定</el-button
        >
        <el-button size="mini" plain @click="handleResetClick">重置</el-button>
      </div>
      <!--触发弹窗的按钮-->
      <el-button
        v-if="showOldColBtn"
        slot="reference"
        size="mini"
        title="增加/移除列"
        plain
        class="button"
        icon="el-icon-s-operation"
      ></el-button>
      <el-button
        v-else
        slot="reference"
        title="增加/移除列"
        class="button new-style"
        :class="{ active: unfold }"
        ><idss-icon-svg name="columnset"
      /></el-button>
    </el-popover>
  </div>
</template>

<script>
import { deepClone } from "./common/js/util";
import { ALL_PAGE_TYPE_MIXIN } from "./common/js/mixins";
import Column from "@/components/column.js";
// todo 没有进行实质操作不触发

// 一级分类的 icon 映射
const ICON_MAP = {
  anomaly: "circle-close",
  user: "user",
  device: "monitor",
  application: "discover",
  data: "data-line",
  threat: "warning-outline",
};

export default {
  name: "OperateColumns",
  mixins: [ALL_PAGE_TYPE_MIXIN],
  props: {
    columns: {
      // 所有的列
      type: Array,
      required: true,
    },
    selectedColumns: {
      // 已被选中的列
      type: Array,
      require: true,
    },
    // 使用旧样式更改列按钮
    showOldColBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue: "", // 搜索框的值
      unfold: false, // popover弹窗可见性
      tableColumns: [], // 所有的列，对一个props columns
      originColumns: [], // 列数据最原始备份，用于重置
    };
  },
  computed: {
    empty() {
      // 是否显示空
      return this.tableColumns.every((group) => {
        return !this.showGroup(group);
      });
    },
  },
  watch: {
    columns() {
      this.tableColumns = deepClone(this.columns);
      this.originColumns = deepClone(this.columns); // 备份列数据，用于重置
      this._compareToSelectedColumns();
    },
    selectedColumns() {
      this._compareToSelectedColumns();
    },
    searchValue(newValue) {
      let empty = newValue.trim() === "";
      if (empty) {
        this.tableColumns = this.tableColumns.map((columnType) => {
          columnType.children = columnType.children.map((column) => {
            column.show = true;
            return column;
          });
          return columnType;
        });
      } else {
        this.tableColumns = this.tableColumns.map((columnType) => {
          columnType.children = columnType.children.map((column) => {
            column.show = column.name.indexOf(newValue) !== -1;
            return column;
          });
          return columnType;
        });
      }
    },
  },
  mounted() {
    this._setData();
  },
  methods: {
    // 点击确定按钮
    handleConfirmClick() {
      const selectedColumns = this._getSelectedColumns();
      this.$emit("confirm", selectedColumns);
      this.unfold = false;
      this.searchValue = "";
    },
    // 点击重置按钮
    handleResetClick() {
      this.tableColumns = deepClone(this.originColumns);
      let selectedColumns = this._getSelectedColumns();
      this.searchValue = "";
      setTimeout(() => {
        this.unfold = false;
        this.$emit("reset", selectedColumns);
      }, 300);
    },
    // 关闭
    closeColumnPopover() {
      this.unfold = false;
      this._compareToSelectedColumns();
    },
    // 判断checkbox是否可选
    disabledCheckBox(item) {
      if (item.code === "participator") {
        // 参与者
        return true;
      }
      if (this.pageType === "list-exception") {
        // 异常  || this.pageType === 'detail-exception'
        return (
          item.code === "anomalyType" ||
          item.code === "anomalyName" ||
          item.code === "anomalyScore"
        );
      } else if (this.pageType === "list-threat") {
        // 威胁 || this.pageType === 'detail-threat'
        return (
          item.code === "threatType" ||
          item.code === "threatName" ||
          item.code === "threatScore"
        );
      }
    },
    // 是否显示某分类
    showGroup(group) {
      return group.children.some((child) => {
        return child.show;
      });
    },
    // 获取一级列表对应的icon
    getIcon(code) {
      if (ICON_MAP[code]) {
        return "el-icon-" + ICON_MAP[code];
      }
      // 默认
      return "el-icon-info";
    },
    // mounted 初始化columns数据
    async _setData() {
      // 此处为了 vuex（从详情页返回至列表页时重新加载columns，会与selectedColumns作比较）
      this._compareToSelectedColumns();
    },
    // 获取选中的列
    _getSelectedColumns() {
      let selectedColumns = [];
      this.tableColumns.map((columnType) => {
        if (columnType.children) {
          columnType.children.map((column) => {
            if (column.checked) {
              selectedColumns.push(new Column(column));
            }
          });
        }
      });
      return selectedColumns;
    },
    // 与 selectedColumns 比较
    _compareToSelectedColumns() {
      this.tableColumns = this.tableColumns.map((columnType) => {
        if (columnType.children) {
          columnType.children = columnType.children.map((column) => {
            // selectedColumns中存在的过滤器，其checked为true，否则false
            column.checked = this.selectedColumns.some((item) => {
              return item.code === column.code;
            });
            return column;
          });
        }
        return columnType;
      });
    },
  },
};
</script>
<!--scoped-->
<style scoped lang="postcss">
.operate-columns-container {
  display: inline-block;
  vertical-align: top;

  .button {
    padding: 0 1px;
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
      font-size: 20px;
    }

    >>> span {
      display: inline-block;
      font-size: 13px;
      margin: 0;
      line-height: 24px;
    }
  }
  .button.new-style {
    height: 36px;
    border: none;
    border-left: 1px solid var(--table-border-color);
    background: #eff1f4;
    border-radius: 0;
    width: 18px;
    transition: width 0.3s;
    &.active {
      background-color: #4a90e2;
      color: #fff;
      border: none;
      >>> svg {
        fill: #fff !important;
      }
    }

    >>> svg {
      transition: all 0.3s;
      fill: var(--color-font-3, #a8acb3) !important;
    }

    &.active,
    &:hover {
      width: 32px;
      >>> svg {
        width: 18px;
        height: 18px;
      }
    }
    >>> span {
      margin: 0 auto;
      line-height: unset;
    }
  }
}
</style>
<!--global:慎用，加前缀-->
<style lang="postcss">
.operate-columns-popover-container {
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

    &::-webkit-scrollbar {
      width: 4px;
    }

    /*滚动条滑块*/

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    /*滚动条轨道*/

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background: rgba(255, 255, 255, 0);
    }

    .groups {
      .group-name {
        color: rgb(132, 149, 171);
        font-size: var(--font-size-13);
        height: 30px;
        line-height: 30px;

        span {
          margin-left: 5px;
        }
      }

      .items {
        .item {
          height: 23px;
          line-height: 23px;

          .el-checkbox {
            font-weight: normal;

            .el-checkbox__label {
              font-size: var(--font-size-12);
              margin-left: 5px;
              color: #3f3f3f !important;
            }
          }
        }
      }
    }
  }

  .empty {
    text-align: center;
    padding: 5px 0;

    i {
      font-size: 28px;
      color: #e2e2e2;
    }

    .text {
      font-size: var(--font-size-13);
    }
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    border-top: 1px solid #eee;
  }
}
</style>
