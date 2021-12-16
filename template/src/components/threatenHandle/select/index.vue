<!--
 * @Author: your name
 * @Date: 2020-06-12 16:05:09
 * @LastEditTime: 2020-06-22 17:37:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/demo/components/threatenHandle/select/index1.vue
-->
<template>
  <div>
    <el-popover
      v-model="inputVisible"
      popper-class="search-popover"
      placement="bottom-start"
      :visible-arrow="false"
      trigger="focus"
      @show="handlePopShow"
    >
      <div class="edit-select-content">
        <el-scrollbar>
          <ul v-if="showLists.length" class="el-option-lists">
            <li
              v-for="item in showLists"
              :key="item.id"
              class="edit-select-option"
            >
              <idss-tooltip
                :content="item.templateDesc"
                placement="top"
                :over-width-display="true"
              >
                <div class="option-item" @click="handleSelect(item)">
                  {{ item.templateDesc }}
                </div>
              </idss-tooltip>
              <div class="btn-group">
                <i class="el-icon-edit" @click="handleEdit(item)"></i>
                <i class="el-icon-delete" @click="handleDeleteTmp(item.id)"></i>
              </div>
            </li>
          </ul>
          <div v-else class="empty">暂无内容</div>
        </el-scrollbar>
        <div class="edit-select-footer">
          <el-button custom type="text" @click.native="createNewIndex">
            新建说明模版
          </el-button>
        </div>
      </div>
      <el-input
        slot="reference"
        v-clickoutside="handleOutClick"
        width="400px"
        size="mini"
        :value="value"
        @focus="inputVisible = true"
        @input="handleSearch"
      >
      </el-input>
    </el-popover>
    <article-dialog
      v-if="visible"
      :content="content"
      :type="type"
      :visible.sync="visible"
      @handleEditContent="handleEditContent"
    >
    </article-dialog>
  </div>
</template>

<script>
import { throttle } from "@/util/base";
import Clickoutside from "element-ui/src/utils/clickoutside";
import { PAGE_TYPE } from "../../common/js/constant";

export default {
  directives: { Clickoutside },
  components: {
    articleDialog: () => import("./articleDialog"),
  },
  model: {
    prop: "value",
    event: "valueChange",
  },
  props: {
    value: {
      type: String,
    },
    pageType: {
      type: String,
    },
  },
  data() {
    return {
      inputVisible: false,
      restaurants: [],
      state: "",
      searchVal: "",
      lists: [],
      showLists: [],
      visible: false, // 新建条目弹窗
      content: "", // 当前弹窗文本
      type: "", // 当前弹窗文本类型
      id: "", // 当前选中的文本对应的id
    };
  },
  computed: {
    api() {
      switch (this.pageType) {
        case PAGE_TYPE.LIST_THREAT:
          return {
            list: "/gov/api/insight/threat/template/list",
            deleteTmp: "/gov/api/insight/threat/template/",
            saveTmp: "/gov/api/insight/threat/template/saveoredit",
          };
        case PAGE_TYPE.LIST_EXCEPTION:
          return {
            list: "/gov/api/insight/anomaly/template/list",
            deleteTmp: "/gov/api/insight/anomaly/template/",
            saveTmp: "/gov/api/insight/anomaly/template/saveoredit",
          };

        default:
          return {};
      }
    },
  },
  created() {
    this.getLists();
  },
  // watch: {
  //   searchVal (val) {
  //     throttle(this.querySearch(val))
  //   }
  // },
  mounted() {
    // this.showLists = this.lists
  },
  methods: {
    handleOutClick() {
      // debugger
      // this.inputVisible = false
    },
    // 获取模板列表
    async getLists() {
      const res =
        (await this.$request({
          url: this.api.list,
        })) || [];
      // 避免数字。统一转为字符串
      res.map((item) => {
        item.templateDesc += "";
      });
      this.lists = res;
      // 初始化展示模板
      this.showLists = res;
    },
    // 删除对应模板
    async handleDeleteTmp(id) {
      this.$confirm("删除后数据无法恢复，确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 删除操作
          await this.$request({
            method: "delete",
            url: this.api.deleteTmp + id,
          });
          // if (res.message === 'success') {
          //   this.getList()
          // }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * popover 展示时触发
     */
    handlePopShow() {
      this.getLists();
    },
    /**
     * 点击选中条目
     * @param {object} item 条目数据
     */
    handleSelect(item) {
      // this.value = item.value
      this.$emit("valueChange", item.templateDesc);
      this.inputVisible = false;
    },
    /**
     * 编辑条目
     * @param {object} item 条目数据
     */
    handleEdit(item) {
      this.id = item.id;
      this.type = "edit";
      this.content = item.value;
      this.visible = true;
    },
    /**
     * 弹窗编辑成功后，主页面重新请求相应的 下拉框数据
     * @param {String,Number}  content 要展示的文本
     */
    async handleEditContent(content) {
      await this.$request({
        method: "post",
        url: this.api.saveTmp,
        data: {
          templateDesc: content,
          id: this.id,
        },
      });
      this.$emit("valueChange", content);
      // this.$message.success('重新请求且更新select值')
      this.inputVisible = false;
    },
    /**
     * 创建新条目
     */
    createNewIndex() {
      // 重置弹窗数据
      this.type = "new";
      this.id = "";
      this.content = "";
      this.visible = true;
    },
    querySearch(queryString) {
      var lists = this.lists;
      var results = queryString
        ? lists.filter(this.createFilter(queryString))
        : lists;
      // 调用 callback 返回建议列表的数据
      this.showLists = [];

      this.showLists = results;
    },
    createFilter(queryString) {
      return (list) => {
        return (
          list.templateDesc.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSearch(val) {
      val += "";
      this.$emit("valueChange", val);
      // throttle(this.valueChange(val))
      throttle(this.querySearch(val));
    },
  },
};
</script>
<style lang="postcss">
.el-popover.search-popover.el-popper {
  padding: 0;
}
</style>
<style lang="postcss" scoped>
/* search-popover {
  padding: 0;
} */
.edit-select-content {
  width: 330px;
  padding-top: 10px;
  >>> .el-scrollbar__wrap {
    width: 100%;
    max-height: 270px;
    overflow-y: auto;
  }
  .el-option-lists {
    padding: 10px 0 0;
    .edit-select-option {
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      &:hover {
        background-color: #eff4fa;
        font-weight: bold;
      }
      .option-item {
        display: inline-block;
        width: calc(100% - 100px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .btn-group {
        i {
          margin-left: 10px;
          cursor: pointer;
          &:hover {
            color: rgb(16, 142, 233);
          }
        }
      }
    }
  }
  .empty {
    text-align: center;
    padding: 10px 0;
  }

  .edit-select-footer {
    border-top: 1px solid #f2f2f2;
    text-align: right;
    cursor: pointer;
    /* padding: 10px 10px 15px; */
    padding-top: 5px;
    margin-top: 10px;
    padding-right: 10px;
  }
}
</style>
