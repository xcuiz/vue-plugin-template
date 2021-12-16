<template>
  <div
    v-loading="loading"
    class="content-aside"
    element-loading-background="rgba(255, 255, 255, .4)"
  >
    <!--下拉选择框-->
    <!-- <div class="select-type">
      <el-select
        v-model="value"
        size="mini"
        popper-class="content-aside-popper-container"
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in aggFilters"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        >
        </el-option>
      </el-select>
    </div> -->
    <!--具体的异常(威胁)类型-->
    <ul class="detail-list" :style="{ filter: loading ? 'blur(2px)' : 'none' }">
      <li
        class="all detail-item"
        :class="{ active: current === -1 }"
        @click="change(-1)"
      >
        <span>{{ aggData.totalName }}</span>
        <i v-if="totalLoading" class="el-icon-loading"></i>
        <span v-else class="count">{{ aggData.totalNum }}</span>
      </li>
      <li
        v-for="(item, index) in params"
        :key="index"
        ref="item"
        class="detail-item"
        :class="{ active: current === item.id }"
        @click="change(item.code, item)"
      >
        <span
          v-idss-tooltip="{ idssOverWidthDisplay: true }"
          class="detail-item-text"
          >{{ item.name }}</span
        >
        <span>{{ item.count }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    params: {
      // 直接传递给侧边栏的数据
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      agg: {
        data: [],
      },
      aggData: {
        totalName: "所有",
        totalNum: null,
        allCondition: [],
      },
      value: "", // 本地 选择框值 code
      current: -1, // 本地 当前的激活索引， -1 代表所有
      loading: false,
      total: 0,
      totalLoading: false,
    };
  },
  watch: {
    params: {
      handler(newVal) {
        newVal.forEach((item) => {
          this.aggData.totalNum += item.count;
        });
      },
      deep: true,
      // immediate: true,
    },
  },
  created() {
    // this.getAggFilters();
  },
  methods: {
    // 下拉框选中的值发生变化
    // handleFilterChange(newVal) {
    //   this.value = newVal;
    //   this.getAggData();
    // },

    // 具体聚合信息激活状态改变事件
    change(id, item) {
      let form = null;
      if (id === -1) {
        form = {};
      } else {
        form = { businessSys: [item.code] };
      }
      this.$emit("input", form);
    },
    emitChange() {
      this.$emit("change", {
        aggType: this.value,
        customId: this.current === -1 ? null : this.current,
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.content-aside {
  width: 100%;
  height: 100%;
  /* background-color: rgba(244, 245, 247, 1); */
  color: #333;
  /* border: 1px solid #e0e0e0; */
  flex-shrink: 0;

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
</style>
