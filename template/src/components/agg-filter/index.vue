<template>
  <el-aside :width="asideWidth">
    <div class="toggle" :style="toggleStyle" @click="toggleCollapse">
      <i :class="toggleIcon"></i>
    </div>
    <div
      v-loading="loading"
      class="content-aside"
      element-loading-background="rgba(255, 255, 255, .4)"
    >
      <!--下拉选择框-->
      <div class="select-type">
        <el-select
          :value="value.select"
          size="mini"
          popper-class="content-aside-popper-container"
          @change="handleSelectChange"
        >
          <el-option-group
            v-for="group in select"
            :key="group.code"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <!--具体的异常(威胁)类型-->
      <ul
        class="detail-list"
        :style="{ filter: loading ? 'blur(2px)' : 'none' }"
      >
        <li
          v-for="(item, index) in list"
          :key="index"
          ref="item"
          class="detail-item"
          :class="{
            active: value.list === item.code,
            disabled: item.num === 0,
          }"
          @click="handleListChange(item.code, item)"
        >
          <span
            v-idss-tooltip="{ idssOverWidthDisplay: true }"
            class="detail-item-text"
            >{{ item.name }}</span
          >
          <span>{{ item.num }}</span>
        </li>
      </ul>
    </div>
  </el-aside>
</template>

<script>
export default {
  name: "AggFilter",
  props: {
    // type value = {
    //   select: string | number,
    //   list: string | number,
    // }[];
    value: {
      type: Object,
      default: () => ({
        select: null,
        list: null,
      }),
    },
    // type select = {
    //   code: string,
    //   name: string,
    //   children: {
    //     code: string,
    //     name: string,
    //   }[]
    // }[];
    select: {
      type: Array,
      default: () => [],
    },
    // type list = {
    //   code: string,
    //   name: string,
    //   num: number,
    // }[];
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      collapse: false,
    };
  },
  computed: {
    toggleIcon() {
      return this.collapse ? "el-icon-d-arrow-right" : "el-icon-d-arrow-left";
    },
    toggleStyle() {
      return this.collapse
        ? {
            borderRight: "1px solid #e0e0e0",
            borderRadius: "2px",
            width: "17px",
            background: "#fff",
          }
        : {};
    },
    asideWidth() {
      return this.collapse ? "0px" : "234px";
    },
  },
  methods: {
    // 下拉框选中的值发生变化
    handleSelectChange(code) {
      const value = {
        ...this.value,
        select: code,
      };
      this.$emit("input", value);
      this.$emit("select-change", code, value);
    },

    handleListChange(code, item) {
      if (item.num === 0) {
        return;
      }

      if (this.value.list === code) return;
      const value = {
        ...this.value,
        list: code,
      };
      this.$emit("input", value);
      this.$emit("list-change", code, value);
    },
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
  },
};
</script>

<style scoped lang="postcss">
.content-aside {
  width: 234px;
  height: 100%;
  background-color: rgba(244, 245, 247, 1);
  color: #333;
  border: 1px solid #e0e0e0;

  >>> .el-loading-spinner .circular {
    width: 30px;
    height: 30px;
  }

  .select-type {
    width: 100%;
    padding: 13px 10px;

    .el-select {
      width: 100%;
    }
  }

  .detail-list {
    padding-bottom: 10px;
  }

  .all,
  .detail-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 9px 0 16px;
    font-size: var(--font-size-12);
    height: 32px;
    border-bottom: 1px solid #e0e5ea;
    cursor: pointer;
    transition: all 0.2s;
    background-color: rgba(244, 245, 247, 0.7);

    &:hover {
      background-color: rgb(242, 243, 245);
    }

    &.disabled {
      color: #999;
    }

    &-text {
      width: 176px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:last-child {
      &.active {
        /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);*/
        box-shadow: none;
      }
    }

    &.active {
      background-color: rgba(244, 250, 254, 0.7);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      &:hover {
        background-color: rgba(244, 250, 254, 1);
      }

      &:before {
        content: " ";
        display: block;
        position: absolute;
        width: 4px;
        height: 31px;
        left: 0;
        top: 0;
        background-color: #4a90e2;
      }
    }

    &.disabled {
      color: #a6acb2;
    }
  }

  .all {
    font-weight: 700;

    .count {
      padding: 0 1px;
    }
  }
}
.content-aside-popper-container {
  .el-select-group {
    .group-title {
      height: 27px;
      line-height: 27px;
      padding-left: 10px;
      font-size: var(--font-size-12);
      color: #999;

      i {
        margin-right: 5px;
      }
    }

    .el-select-dropdown__item {
      font-weight: 400;
      font-size: 13px;
      height: 25px;
      line-height: 25px;

      &.selected {
        font-weight: 700 !important;
      }
    }
  }
}
.toggle {
  position: absolute;
  left: -3px;
  /*top: 13px;*/
  z-index: 1;
  height: 23px;
  width: 14px;
  line-height: 23px;
  border-radius: 2px 0 0 2px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-right: none;
  box-sizing: border-box;
  cursor: pointer;
  background: #f4f5f7;
  /*background: #fff;*/
  /*box-shadow: 0 0 1px rgba(161, 161, 161, 0.35);*/
  transition: all 0.05s;

  &:hover {
    transform: scale3d(1.2, 1, 1);
    transform-origin: 12px 50% 0;
  }

  .iconfont {
    font-size: var(--font-size-12);
  }
}
</style>
