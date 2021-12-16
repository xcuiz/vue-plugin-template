<template>
  <div class="multi-select-container">
    <i
      v-if="closable"
      class="el-icon-error"
      title="删除该过滤器"
      @click="deleteFilter"
    ></i>
    <el-popover
      v-model="unfold"
      class="popover-button"
      placement="bottom"
      width="246"
      trigger="click"
      popper-class="multi-select-popover-container"
      :visible-arrow="false"
      @show="handleShow"
      @after-leave="handleHide"
    >
      <!-- 下拉框内容区域 -->
      <div v-loading="loading" class="popover-wrapper">
        <h3 class="title">{{ meta.name }}</h3>
        <!-- 搜索区域 -->
        <!--当filterMode为多选2或多选3 ，并且 status 不为error时显示-->
        <!-- 2020年12月23日15:52:20 修改：所有下拉框类都有搜索功能 -->
        <div v-if="status !== 'error'" class="search-container">
          <el-input
            v-model="searchValue"
            size="mini"
            placeholder="请输入"
            suffix-icon="el-icon-search"
          ></el-input>
        </div>
        <div v-if="status === 'success'" class="list-wrapper">
          <!-- 全选按钮 -->
          <el-checkbox
            v-if="meta.filterMode !== '3'"
            v-model="checkAll"
            class="check-all"
            :indeterminate="indeterminate"
            size="mini"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <ul class="group">
            <li
              v-for="option in options"
              v-show="option.show"
              :key="option.code"
              class="group-item"
            >
              <el-checkbox
                v-model="option.checked"
                class="group-item-checkbox"
                size="mini"
                :indeterminate="option.indeterminate"
                @change="handleCheckedOptionChange(option)"
              >
                {{ option.name }}
              </el-checkbox>
              <!-- 子列表 -->
              <ul v-if="haveChildren(option)" class="group-item-sub-list">
                <li
                  v-for="item in option.children"
                  v-show="item.show"
                  :key="item.code"
                  class="group-item-sub-item"
                >
                  <el-checkbox
                    v-model="item.checked"
                    size="mini"
                    class="group-item-sub-item-checkbox"
                    @change="handleCheckedSubOptionChange(option)"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-else-if="status === 'empty'" class="empty">
          <i class="el-icon-magic-stick"></i>
          <p class="text">搜索结果为空</p>
        </div>
        <div v-else-if="status === 'error'" class="error">
          <i class="el-icon-error"></i>
          <p class="text">加载失败</p>
        </div>
      </div>

      <!--触发下拉弹出的button-->
      <div slot="reference" class="button" :class="{ error: showError }">
        <ul v-if="checkedList.length !== 0" class="checked-list">
          <li
            v-for="item in checkedList.slice(0, 1)"
            :key="item.code"
            class="checked-item"
          >
            {{ item.name }}
          </li>
          <li v-show="checkedList.length > 1" class="checked-item">
            {{ moreText }}
          </li>
        </ul>
        <span v-else class="text">{{ buttonText }}</span>
        <i :class="arrowIconCls"></i>
      </div>
    </el-popover>
    <i v-if="showError" class="error-tips">字段不能为空</i>
  </div>
</template>

<script>
/**
 * 代码阅读提示：
 * 1. 首先阅读 handleShow 方法，
 *    此方法是popover弹框出现时的回调，用于动态获取ajax数据
 * 2. 然后阅读 handleHide 方法，
 *    此方法是popover弹框消失时的回调，
 *    主要用于根据 "用户是否产生了实质性的操作" 来判断需不需要向父组件触发 trigger 事件
 */

import { deepClone, equals } from "./common/js/util";
import { FILTER_MODE } from "./common/js/constant";
import { getFilterTypeValueAsync } from "@/components/api/filter";
import Filter from "@/components/filter.js";

export default {
  name: "MultiSelect",
  props: {
    meta: {
      // 过滤器的元信息
      type: Object,
      required: true,
      default() {
        return {
          code: "", // 过滤器唯一标识码
          filterMode: "", // 过滤器模式(方式)
          name: "", // 过滤器名称
          sourceValue: "", // 过滤值来源（用于API请求参数）
        };
      },
      validator(meta) {
        const filterMode = meta.filterMode;
        return (
          [
            FILTER_MODE.MULTI_SELECT_1,
            FILTER_MODE.MULTI_SELECT_2,
            FILTER_MODE.MULTI_SELECT_3,
          ].indexOf(filterMode) !== -1
        );
      },
    },
    closable: {
      type: Boolean,
      default: true,
    },
    sourceUrl: {
      type: String,
      default: "/gov/api/insight/anomaly/filtertypevalue",
    },
  },
  data() {
    return {
      showError: false, // 显示错误
      unfold: false, // popover是否展开
      checkAll: false, // 是否全选
      indeterminate: false, // 不确定的状态
      searchValue: "", // 搜索框值
      options: [
        // {
        //   code: '',
        //   name: '',
        //   startValue: '',
        //   endValue: '',
        //   children: []
        // }
      ], // 选项列表数据
      // copyOptions: [], // options的副本，用于检查用户有没有操作，不需要响应式，故不声明在data中
      loading: true,
      status: "",
      /* 状态，三种取值：success/empty/error
       * success: 正常状态
       * empty: 搜索结果为空
       * error: 加载数据失败
       */
      /*,
         remarks: { // 用于向外发送trigger事件时附带的附加信息
           allUnchecked: false
         }
         */
    };
  },
  computed: {
    arrowIconCls() {
      if (this.unfold) {
        return "el-icon-arrow-up";
      }
      return "el-icon-arrow-down";
    },
    buttonText() {
      if (this.unfold) {
        return "请选择";
      }
      return this.meta.name;
    },
    empty() {
      return this.options.every((group) => {
        return !group.show;
      });
    },
    checkedList() {
      const { recoverData } = this.meta;

      let list = [];
      let options;
      if (recoverData && this.options.length === 0) {
        options = recoverData.options ? recoverData.options : [];
      } else {
        options = this.options;
      }
      options.map((option) => {
        if (this.haveChildren(option)) {
          option.children.map((child) => {
            let { code, name } = child;
            if (child.checked) {
              list.push({ code, name });
            }
          });
        } else {
          let { code, name } = option;
          if (option.checked) {
            list.push({ code, name });
          }
        }
      });
      return list;
    },
    moreText() {
      if (this.checkedList.length > 1) {
        return "+" + (this.checkedList.length - 1);
      }
      return "";
    },
  },
  watch: {
    searchValue(newValue) {
      this._setShowStatus(newValue);

      // 设置status状态值
      const noEmpty = this.options.some((option) => {
        return option.show;
      });
      if (!noEmpty) {
        this.status = "empty";
      } else {
        this.status = "success";
      }
    },
  },
  methods: {
    // 验证
    validate() {
      if (this.checkedList.length > 0) {
        this.showError = false;
        return true;
      } else {
        this.showError = true;
        return false;
      }
    },
    /**
     * 处理总的 checkAll 状态改变事件
     * @param checkAll
     */
    handleCheckAllChange(checkAll) {
      this.options = this.options.map((option) => {
        option.checked = checkAll;

        if (this.haveChildren(option)) {
          option.children.map((child) => {
            child.checked = option.checked;
            return child;
          });
        }

        return option;
      });
      this.indeterminate = false;
    },
    /**
     * 点击第一层选项时的处理函数
     * @param option
     */
    handleCheckedOptionChange(option) {
      let checkedCount = 0;
      this.options.map((option) => {
        if (option.checked) {
          ++checkedCount;
        }
        return option;
      });
      // 全局的checkAll
      this.checkAll = checkedCount === this.options.length;
      // 全局的indeterminate
      this.indeterminate =
        checkedCount > 0 && checkedCount < this.options.length;

      // 第二层列表的indeterminate
      if (option.indeterminate !== undefined) {
        option.indeterminate = false;
      }
      // 第二层列表的checked状态
      if (this.haveChildren(option)) {
        option.children.map((child) => {
          child.checked = option.checked;
          return child;
        });
      }
    },
    /**
     * 点击第二层选项时的处理函数
     */
    handleCheckedSubOptionChange(option) {
      // 子列表的
      let checkedCount = 0;
      option.children.map((op) => {
        if (op.checked) {
          ++checkedCount;
        }
        return op;
      });
      option.checked = checkedCount === option.children.length;
      option.indeterminate =
        checkedCount > 0 && checkedCount < option.children.length;

      // 全局的
      checkedCount = 0;
      this.options.map((option) => {
        if (option.checked) {
          ++checkedCount;
        }
        return option;
      });
      this.checkAll = checkedCount === this.options.length;
      this.indeterminate =
        checkedCount > 0 && checkedCount < this.options.length;
    },
    /**
     * 判断一个列表选项是否有子列表
     * @param option
     * @returns {*|boolean}
     */
    haveChildren(option) {
      return option.children && option.children.length > 0;
    },
    // popover 出现时的回调方法
    async handleShow() {
      if (this.options.length !== 0 && this.status !== "error") {
        // 之前已经被打开过并且status不为error，直接返回
        this.copyOptions = deepClone(this.options);
        return;
      }

      const { filterMode, sourceValue: filterSource } = this.meta;

      let sourceUrl = this.sourceUrl;
      let data;
      try {
        data = await getFilterTypeValueAsync(
          filterMode,
          filterSource,
          sourceUrl
        );
      } catch (e) {
        // 出错
        this.status = "error";
        this.loading = false;
        return;
      }
      this.status = "success";
      this.loading = false;
      let options =
        filterMode === FILTER_MODE.MULTI_SELECT_3 ? data.tree : data.list;
      this.options = this._getOptions(options);
      // this.copyOptions = deepClone(this.options)

      // 恢复
      const { recoverData } = this.meta;
      if (recoverData) {
        const options = recoverData.options;
        // 恢复子选项的选中状态
        if (filterMode !== FILTER_MODE.MULTI_SELECT_3) {
          // 只有一级列表（多选1和多选2）
          if (options.length !== 0) {
            this.options = options.map((option) => {
              option.show = true;
              return option;
            });
          }
        } else {
          // 有二级列表（多选3）
          if (options.length !== 0) {
            this.options = options.map((option) => {
              let checkedCount = 0;
              option.children.map((child) => {
                if (child.checked) {
                  ++checkedCount;
                }
                child.show = true;
                return child;
              });
              option.indeterminate =
                checkedCount > 0 && checkedCount < option.children.length;

              return option;
            });
            let checkedCount = 0;
            this.options.map((option) => {
              if (option.checked) {
                ++checkedCount;
              }
              return option;
            });
            // 全局的checkAll
            this.checkAll = checkedCount === this.options.length;
            // 全局的indeterminate
            this.indeterminate =
              checkedCount > 0 && checkedCount < this.options.length;
          }

          /* this.options = this.options.map(option => {
              option.children = option.children.map(child => {
                child.checked = valueList.indexOf(child.code) !== -1
                return child
              })
              option.checked = option.children.every(child => {
                return child.checked
              })

              let checkedCount = 0
              option.children.map(child => {
                if (child.checked) { ++checkedCount }
                return child
              })
              option.indeterminate = checkedCount > 0 && checkedCount < option.children.length

              return option
            }) */
        }
        /* let checkedCount = 0
          this.options.map(option => {
            if (option.checked) { ++checkedCount }
            return option
          })
          // 全局的checkAll
          this.checkAll = checkedCount === this.options.length
          // 全局的indeterminate
          this.indeterminate = checkedCount > 0 && checkedCount < this.options.length */
      }
      this.copyOptions = deepClone(this.options);
    },
    // popover 消失时的回调方法
    handleHide() {
      this.searchValue = ""; // 这一步也会触发_setShowStatus，但是有延迟
      // 这一步，因为show的状态改变了，会影响对 _changed() 的判断，故需要立即设置 _setShowStatus()
      this._setShowStatus(this.searchValue);

      if (this.status === "error") {
        // error 状态下，再次打开时依然loading
        this.loading = true;
        return;
      }

      // 非 error 状态下如果没有任何实质性的改变，则不 trigger
      if (!this._changed()) {
        // this.$message({
        //   message: '当前过滤器状态没有改变',
        //   type: 'warning'
        // })
        return;
      }
      let {
        meta: { code, filterMode, name, sourceValue },
        options,
      } = this;
      // 删除冗余字段
      options = this._deleteRedundantField(deepClone(options));

      let filter = new Filter({
        code,
        filterMode,
        name,
        sourceValue,
        checked: true,
        status: {
          // 过滤器的列表状态
          options,
        },
      });
      filter.remarks = {
        // 附加信息
        allUnchecked: this._allUnchecked(),
      };

      // 向父组件派发trigger事件
      this.$emit("trigger", filter);
    },
    deleteFilter() {
      this.$emit("delete-filter", this.meta.code);
    },
    // 判断当前的选项是否全部为未选中状态
    _allUnchecked() {
      const { filterMode } = this.meta;
      if (filterMode === FILTER_MODE.MULTI_SELECT_3) {
        // 多选方案3
        return this.options.every((group) => {
          return group.children.every((child) => {
            return !child.checked;
          });
        });
      } else {
        // 多选方案1和多选方案2
        return this.options.every((option) => {
          return !option.checked;
        });
      }
    },
    // 判断用户是否进行的实质性的操作
    _changed() {
      return !equals(this.options, this.copyOptions);
    },
    // 根据searchValue设置show的状态
    _setShowStatus(searchValue) {
      const { filterMode } = this.meta;
      let empty = searchValue.trim() === "";
      if (
        filterMode === FILTER_MODE.MULTI_SELECT_1 ||
        filterMode === FILTER_MODE.MULTI_SELECT_2
      ) {
        // 多选方案1或者多选方案2
        if (empty) {
          this.options = this.options.map((option) => {
            option.show = true;
            return option;
          });
        } else {
          this.options = this.options.map((option) => {
            option.show = option.name.indexOf(searchValue) !== -1;
            return option;
          });
        }
      } else {
        // 多选方案3
        if (empty) {
          this.options = this.options.map((group) => {
            group.children = group.children.map((child) => {
              child.show = true;
              return child;
            });
            group.show = true;
            return group;
          });
        } else {
          this.options = this.options.map((group) => {
            group.children = group.children.map((child) => {
              child.show = child.name.indexOf(searchValue) !== -1;
              return child;
            });
            group.show = group.children.some((child) => {
              return child.show;
            });
            return group;
          });
        }
      }
    },
    // 删除 options 中冗余的字段，包括show、indeterminate以及多选方案3中一级分类的checked字段
    _deleteRedundantField(options) {
      let res;
      const { filterMode } = this.meta;
      if (filterMode === FILTER_MODE.MULTI_SELECT_3) {
        // 多选方案3
        res = options.map((group) => {
          delete group.checked;
          delete group.indeterminate;
          delete group.show;
          group.children = group.children.map((child) => {
            delete child.show;
            return child;
          });
          return group;
        });
      } else {
        // 多选方案1或多选方案2
        res = options.map((option) => {
          delete option.show;
          return option;
        });
      }
      return res;
    },
    _getOptions(options) {
      return this._initOptions(options);
    },
    _initOptions(options) {
      return options.map((option) => {
        option.checked = false;
        option.show = true;
        if (this.haveChildren(option)) {
          option.indeterminate = false;
          option.children = option.children.map((child) => {
            child.checked = false;
            child.show = true;
            return child;
          });
        }
        return option;
      });
    },
  },
};
</script>

<!--scoped-->
<style scoped lang="postcss">
.multi-select-container {
  position: relative;
  width: 180px;
  display: inline-block;
  vertical-align: top;

  &:hover {
    > .el-icon-error {
      opacity: 1;
    }
  }

  > .el-icon-error {
    opacity: 0;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    padding: 3px;
    box-sizing: border-box;
    right: 0;
    color: #cecfd1;
    top: -18px;
    transition: all 0.3s;

    &:hover {
      color: orangered;
    }
  }

  .popover-button {
    .button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px 0 5px;
      width: 100%;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      font-size: var(--font-size-13);
      color: rgba(60, 86, 121, 0.8);
      background: #fff;
      transition: all 0.5s;
      outline: none;

      &.error {
        border: 1px solid red !important;
      }

      &:hover {
        border-color: #c0c4cc;
      }

      .checked-list {
        height: 20px;
      }

      .checked-item {
        display: inline-block;
        vertical-align: top;
        font-size: var(--font-size-12);
        height: 20px;
        line-height: 20px;
        background-color: #f4f4f5;
        border-color: #e9e9eb;
        color: #909399;
        border-radius: 2px;
        white-space: nowrap;
        padding: 0 4px;
        margin-right: 4px;
      }
    }
  }

  .error-tips {
    position: absolute;
    bottom: -16px;
    color: #f33d3d;
    font-size: 12px;
  }
}
</style>
<!--global:慎用，加前缀-->
<style lang="postcss">
.multi-select-popover-container {
  margin-top: 6px !important;
  width: 180px !important;
  padding: 0;
  border: none;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .popover-wrapper {
    .title {
      height: 27px;
      line-height: 27px;
      background-color: #f2f2f2;
      text-align: center;
      margin-bottom: 5px;
      font-size: var(--font-size-13);
    }

    .search-container {
      width: 100%;
      box-sizing: border-box;
      padding: 0 10px 5px 10px;
    }

    .list-wrapper {
      padding: 0 0 5px 10px;

      .check-all {
        .el-checkbox__label {
          color: #3c5679;
          /*font-weight: normal;*/
          font-size: var(--font-size-13);
        }
      }

      .group {
        max-height: 412px;
        overflow: scroll;

        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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

        .group-item {
          .group-item-checkbox {
            height: 27px;
            line-height: 27px;

            .el-checkbox__label {
              color: #3c5679;
              font-weight: normal;
              font-size: var(--font-size-13);
            }
          }

          .group-item-sub-list {
            padding-left: 17px;

            .group-item-sub-item {
              height: 27px;
              line-height: 27px;

              .group-item-sub-item-checkbox {
                .el-checkbox__label {
                  color: #3c5679;
                  font-weight: normal;
                  font-size: var(--font-size-13);
                }
              }
            }
          }
        }
      }
    }

    .empty,
    .error {
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
  }
}
</style>
