<template>
  <div class="operate-columns-container">
    <!--增加/移除列-->
    <el-popover
      v-model="show"
      placement="bottom"
      width="263"
      :visible-arrow="false"
      popper-class="operate-columns-popover-container"
      @after-leave="handleClose"
    >
      <header class="header">
        <p>增加/移除列</p>
        <i class="el-icon-close" @click="handleClose"></i>
      </header>
      <!-- <div class="search">
        <el-input
          v-model="searchValue"
          size="mini"
          placeholder="请输入"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div> -->
      <ul v-show="!empty" class="column-list-wrapper">
        <ul class="items">
          <li v-for="item in columns" :key="item.code" class="item">
            <el-checkbox v-model="item.checked" :disabled="item.disabled">
              {{ item.name }}
            </el-checkbox>
          </li>
        </ul>
      </ul>
      <div v-show="empty" class="empty">
        <i class="el-icon-magic-stick"></i>
        <p class="text">😑 哦豁，空空如也</p>
      </div>
      <div class="buttons">
        <el-button type="primary" size="mini" @click="handleConfirm"
          >确定</el-button
        >
        <el-button size="mini" plain @click="handleReset">重置</el-button>
      </div>
      <el-button
        slot="reference"
        title="增加/移除列"
        class="button new-style"
        :class="{ active: show }"
      >
        <idss-icon-svg name="columnset" />
      </el-button>
    </el-popover>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  model: {},
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchValue: null,
      defaultValue: _.cloneDeep(this.value),
      columns: _.cloneDeep(this.value),
      show: false, // popover弹窗可见性
    };
  },
  computed: {
    empty() {
      return this.columns && this.columns.length === 0;
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("input", _.cloneDeep(this.columns));
      this.handleClose();
    },
    handleReset() {
      const res = _.cloneDeep(this.defaultValue);
      this.$emit("input", res);
      this.columns = res;
      this.handleClose();
    },
    handleClose() {
      this.show = false;
    },
  },
};
</script>
<style scoped lang="postcss">
.operate-columns-container {
  display: inline-block;
  vertical-align: top;
  position: absolute;
  top: 1px;
  right: 0;
  z-index: 10;

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
