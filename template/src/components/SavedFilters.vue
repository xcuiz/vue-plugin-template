<template>
  <div class="saved-filters-container">
    <el-popover
      v-model="unfold"
      placement="bottom"
      width="285"
      :visible-arrow="false"
      popper-class="saved-filters-popover-container"
      trigger="click"
      @show="handleShow"
      @after-leave="handleHide"
    >
      <div v-loading="loading" class="content">
        <header class="header">已存过滤条件</header>
        <div v-if="status === 'success'" class="search">
          <el-input
            v-model="searchValue"
            size="mini"
            placeholder="请输入"
            suffix-icon="el-icon-search"
          >
          </el-input>
        </div>
        <template v-if="status === 'success'">
          <div class="list-header">
            <span class="name-column">名称</span>
            <span class="last-time-column">上次运行时间</span>
          </div>
          <ul class="filter-list">
            <li
              v-for="(item, index) in currentList"
              v-show="item.show"
              :key="item.id"
              class="filter-item"
            >
              <span class="icon">
                <i v-show="item.checked" class="el-icon-check"></i>
              </span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.filterDesc"
                placement="top-start"
              >
                <span
                  class="name"
                  @click="handleFilterItemClick(index, item.id)"
                  >{{ item.name }}</span
                >
              </el-tooltip>
              <span class="space"></span>
              <span class="last-time">{{
                item.lastRunTime ? item.lastRunTime : "未知"
              }}</span>
              <span class="icon delete">
                <i
                  class="el-icon-delete"
                  @click.stop="deleteSavedFilter(item)"
                ></i>
              </span>
            </li>
          </ul>
          <el-pagination
            layout="prev, pager, next"
            small
            :page-size="pageSize"
            :current-page="currentPage"
            hide-on-single-page
            :total="pageTotal"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
        <div v-else-if="status === 'empty'" class="empty">
          <i class="el-icon-magic-stick"></i>
          <p class="text">😑 哦豁，空空如也</p>
        </div>
        <div v-else-if="status === 'error'" class="error">
          <i class="el-icon-error"></i>
          <p class="text">加载失败</p>
        </div>
        <footer class="footer">
          <el-button type="primary" size="mini" @click="goToSave"
            >保存当前查询</el-button
          >
        </footer>
      </div>
      <!-- 触发按钮 -->
      <el-button
        slot="reference"
        size="mini"
        plain
        class="save-button"
        title="已保存的过滤条件"
        @click="savedFiltersDialogVisible = true"
      >
        <idss-icon-svg name="Savelist" />
      </el-button>
    </el-popover>
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
import { deepClone } from "./common/js/util";
import {
  getSavedFiltersAsync,
  deleteSavedFilterAsync,
  getSavedFilterDetailAsync,
} from "./api/filter";
import { ALL_PAGE_TYPE_MIXIN } from "./common/js/mixins";
export default {
  name: "SavedFilters",
  mixins: [ALL_PAGE_TYPE_MIXIN],
  data() {
    return {
      // 是否显示已保存过滤条件对话框
      savedFiltersDialogVisible: false,
      unfold: false, // popover是否展开
      searchValue: "", // 搜索框值
      loading: true,
      pageSize: 10,
      currentPage: 1,
      list: [
        // 所有已保存的过滤条件列表
        {
          id: "",
          name: "", // 名称
          filterDesc: "", // 描述
          lastRunTime: "", // 上次运行时间
        },
      ],
      currentList: [
        // 当前页已保存的过滤条件列表
        {
          id: "",
          name: "",
          filterDesc: "",
          lastRunTime: "",
        },
      ],
      status: "",
      /* 状态，三种取值：success/empty/error
       * success: 正常状态
       * empty: 搜索结果为空
       * error: 加载数据失败
       */
    };
  },
  computed: {
    pageTotal() {
      let showCount = 0;
      this.list.map((item) => {
        if (item.show) {
          ++showCount;
        }
        return item;
      });
      return showCount;
    },
  },
  watch: {
    searchValue(newValue) {
      // 有bug
      let empty = newValue.trim() === "";
      if (empty) {
        this.list = this.list.map((item) => {
          item.show = true;
          return item;
        });
      } else {
        this.list = this.list.map((item) => {
          item.show = item.name.indexOf(newValue) !== -1;
          return item;
        });
      }
      this.currentPage = 1;
      this._freshCurrentList();
    },
  },
  methods: {
    // 点击某一项时，进行恢复
    async handleFilterItemClick(index, id) {
      let list = this.list;
      list = list.map((item) => {
        item.checked = false;
        return item;
      });
      list[index].checked = true;
      this.list = list;
      // this.$emit('change', list[index])
      let detailList = await getSavedFilterDetailAsync(this.pageType, id);
      // 将filterMode转为字符串
      detailList = detailList.map((filter) => {
        filter.filterMode = filter.filterMode.toString();
        return filter;
      });
      this.$emit("recover", deepClone(detailList), id);
      this.unfold = false;
    },
    goToSave() {
      this.$emit("go-to-save");
    },
    // 删除
    async deleteSavedFilter(item) {
      await deleteSavedFilterAsync(this.pageType, item.id);
      this.list = this.list.filter((filter) => {
        return filter.id !== item.id;
      });
      if (this.list.length === 0) {
        this.status = "empty";
      }
      this._freshCurrentList();

      this.$notify.info({
        title: "提示",
        message: "删除成功",
      });
    },
    // popover 出现时的回调方法
    async handleShow() {
      let list;
      try {
        list = await getSavedFiltersAsync(this.pageType);
        list.reverse();
      } catch (e) {
        // 出错
        this.status = "error";
        this.loading = false;
        return;
      }
      this.list = this._getList(list);
      if (this.list.length === 0) {
        this.status = "empty";
      } else {
        this.status = "success";
      }
      this.loading = false;
      this._freshCurrentList();
    },
    // popover 消失时的回调方法
    handleHide() {
      this.currentPage = 1;
      this.loading = true;
      this.searchValue = "";
      this.status = "";
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this._freshCurrentList();
    },
    // 设置当前分页展示的列表
    _freshCurrentList() {
      this.currentList = this.list.filter((item, index) => {
        return (
          item.show &&
          (this.currentPage - 1) * this.pageSize < index + 1 &&
          this.currentPage * this.pageSize > index
        );
      });
    },
    _getList(list) {
      return this._initList(deepClone(list));
    },
    _initList(list) {
      return list.map((item) => {
        item.checked = false;
        item.show = true;
        return item;
      });
    },
  },
};
</script>
<style scoped lang="postcss">
.saved-filters-container {
  display: inline-block;
  vertical-align: top;

  .el-button {
    &.is-plain {
      color: #3c5679;
      border: 1px solid #b5bfcc;
      &:hover {
        box-shadow: 1px 2px 3px 0.06px;
        color: #fff;
        background-color: rgba(74, 144, 226, 1);
        .idss-svg-icon {
          width: 18px;
          height: 18px;
          fill: #fff;
        }
      }
    }

    .idss-svg-icon {
      width: 18px;
      height: 18px;
    }
  }

  .save-button {
    padding: 0;
    line-height: 28px;
    height: 28px;
    width: 24px;
    font-size: var(--font-size-16);
    color: #333;
    border: 1px solid #666;
  }
}
</style>
<style lang="postcss">
.saved-filters-popover-container {
  margin-top: 2px !important;
  padding: 0;

  .content {
    .header {
      height: 38px;
      line-height: 38px;
      padding: 0 8px;
      font-size: var(--font-size-14);
      color: #333;
      border-bottom: 1px solid #eee;
    }

    .search {
      padding: 5px 8px;
    }

    .list-header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 28px;
      font-size: var(--font-size-12);
      color: #3f3f3f;
      background-color: #f0f1f4;

      .name-column {
        flex: 1;
        padding-left: 30px;
      }

      .last-time-column {
        width: 100px;
      }
    }

    .filter-list {
      min-height: 50px;
      .filter-item {
        height: 25px;
        display: flex;
        align-items: center;
        padding: 0 9px 0 12px;
        font-size: var(--font-size-12);
        transition: all 0.1s;
        &:hover {
          background-color: #ebf2fb;

          .el-icon-delete {
            display: inline-block !important;
            margin-left: 5px;
          }
        }

        .icon {
          width: 15px;
          color: #1f78d2;

          &.delete {
            color: #9eaabe;
            cursor: pointer;

            .el-icon-delete {
              display: none;
            }
          }
        }

        .name {
          margin-left: 5px;
          color: #1f78d2;
          cursor: pointer;
          height: 25px;
          line-height: 25px;
        }

        .space {
          flex: 1;
        }

        .last-time {
          width: 130px;
          text-align: right;
        }
      }
    }

    .el-pagination {
      text-align: center;
      margin-top: 10px;
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

    .footer {
      text-align: center;
      padding: 5px 0 11px 0;
      border-top: 1px solid #eee;
    }
  }
}
</style>
