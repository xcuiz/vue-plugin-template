<template>
  <div class="add-filter-container">
    <el-popover
      v-model="visible"
      class="popover-button"
      placement="bottom"
      width="180"
      trigger="click"
      popper-class="add-filter-popover-container"
      :visible-arrow="false"
    >
      <!-- 下拉框内容区域 -->
      <div class="popover-wrapper">
        <ul v-if="list.length" class="filter-list">
          <li
            v-for="(item, groupIndex) in list"
            :key="item.code"
            class="filter-item"
          >
            <p class="group-name">
              <i :class="getIcon(item.code)"></i>
              <span>{{ item.name }}</span>
            </p>
            <ul class="sub-list">
              <li
                v-for="(subItem, index) in item.children"
                ref="subItems"
                :key="subItem.code"
                class="sub-item"
                :style="itemStyle(subItem.checked)"
                @click="handleItemClick(subItem, index, groupIndex)"
              >
                <span class="text">{{ subItem.name }}</span>
                <i v-show="subItem.checked" class="check el-icon-check"></i>
              </li>
            </ul>
          </li>
        </ul>
        <div v-else class="empty">暂无数据</div>
      </div>
      <!--触发下拉弹出的button-->
      <el-button
        slot="reference"
        title="添加过滤器"
        size="mini"
        class="button"
        icon="el-icon-s-operation"
        plain
        >过滤
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { animateCSS } from "./common/js/util";
import Filter, { createFilterType } from "@/components/filter.js";
import { getFilterTypesAsync } from "@/components/api/filter";
import { ALL_PAGE_TYPE_MIXIN } from "./common/js/mixins";
// 一级过滤器类型名称前面对应的 icon 图标映射
const ICON_MAP = {
  anomaly: "circle-close",
  user: "user",
  device: "monitor",
  application: "discover",
  data: "data-line",
  threat: "warning-outline",
};

export default {
  name: "AddFilter",
  mixins: [ALL_PAGE_TYPE_MIXIN],
  props: {
    selectedFilters: {
      // 已被选择的过滤器
      type: Array,
      require: true,
      default() {
        return [
          {
            code: "", // 过滤器的唯一标识码
            filterMode: "", // 过滤器模式(方式)
            name: "", // 过滤器名称
            sourceValue: "", // 过滤值来源（用于API请求参数）
          },
        ];
      },
    },
    filterTypeList: {
      // 外界直接传递列表
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      list: [], // 可选的过滤器列表
      visible: false, // popover 可见性
    };
  },
  watch: {
    // 当 "已被选择的过滤器" 列表改变时，更新当前过滤器列表的checked状态
    selectedFilters() {
      this._compareToSelectedFilters();
    },
  },
  mounted() {
    // 远程获取数据
    this._setData();
  },
  methods: {
    /**
     * 处理 item 点击事件
     * @param subItem 过滤器对象
     * @param index 当前过滤器位于所在组的index
     * @param groupIndex 当前过滤器所在组的index
     */
    handleItemClick(subItem, index, groupIndex) {
      /* j 用于计算当前这个 item 在所有的二级列表中排第几 */
      let j = 0;
      for (let i = 0; i < groupIndex; i++) {
        j += this.list[i].children.length;
      }
      j += index;

      // 当前过滤器已被选中，不可再选
      if (subItem.checked) {
        animateCSS(this.$refs.subItems[j], "shake"); // 摇晃动画
        return;
      }

      subItem.checked = true;
      setTimeout(() => {
        this.visible = false; // popover 弹框消失
      }, 300);
      this.$emit("add-filter", new Filter(subItem));
    },

    itemStyle(checked) {
      let color = checked ? "#999" : "#606266";
      return {
        color,
      };
    },
    // 获取一级过滤器类型名称前面的 icon 图标
    getIcon(code) {
      if (ICON_MAP[code]) {
        return "el-icon-" + ICON_MAP[code];
      }
      return "el-icon-info"; // 默认图标
    },
    // 通过ajax获取数据
    async _setData() {
      let filterList = [];
      // 加载过滤器列表
      if (this.filterTypeList && this.filterTypeList.length > 0) {
        filterList = this.filterTypeList;
      } else {
        filterList = await getFilterTypesAsync(this.pageType);
      }

      let filterTypes = [];
      filterList.map((item) => {
        filterTypes.push(createFilterType(item));
      });
      this.list = filterTypes;
      // 此处为了 vuex（从详情页返回至列表页时重新加载filterTypes，会与selectedFilters作比较）
      this._compareToSelectedFilters();
    },
    // 与 selectedFilters 比较
    _compareToSelectedFilters() {
      this.list = this.list.map((group) => {
        if (group.children) {
          group.children = group.children.map((child) => {
            // selectedFilters中存在的过滤器，其checked为true，否则false
            child.checked = this.selectedFilters.some((item) => {
              return item.code === child.code;
            });
            return child;
          });
        }
        return group;
      });
    },
  },
};
</script>
<!--scoped-->
<style scoped lang="postcss">
.add-filter-container {
  display: inline-block;
  vertical-align: top;

  .popover-button {
    .button {
      width: 61px;
      height: 28px;
      line-height: 28px;
      padding: 0;
      color: #3c5679;
      border: 1px solid #b5bfcc;
      transition: all 0.2s;

      &:hover {
        box-shadow: 1px 2px 3px 0.06px;
        color: #fff;
        background-color: rgba(74, 144, 226, 1);
      }

      >>> i {
        font-size: var(--font-size-14);
      }

      >>> span {
        font-size: var(--font-size-14);
        margin-left: 2px;
      }
    }
  }
}
</style>
<!--global:慎用，加前缀-->
<style lang="postcss">
.add-filter-popover-container {
  margin-top: 5px !important;
  padding: 0;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .popover-wrapper {
    .filter-list {
      padding: 5px 20px 5px 10px;
      max-height: 412px;
      overflow: auto;
      overflow-x: hidden;

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

      .filter-item {
        .group-name {
          height: 30px;
          line-height: 30px;
          color: #8b9aaf;
          font-size: var(--font-size-13);

          span {
            margin-left: 5px;
          }
        }

        .sub-list {
          padding-left: 10px;

          .sub-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 25px;
            line-height: 25px;
            cursor: pointer;
            font-size: var(--font-size-13);
          }
        }
      }
    }

    .empty {
      font-size: var(--font-size-13);
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
}
</style>
