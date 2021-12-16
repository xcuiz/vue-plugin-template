<template>
  <div v-loading="loading" class="config-info-container">
    <div class="config-info-box">
      <div class="config-info-header">
        <div class="header-title">配置信息</div>
      </div>
      <div class="config-info-filter">
        <div class="filter-box">
          <config-info-filter
            page-type="config-info"
            :has-time-control="false"
            :has-save-filter="false"
            :init-value.sync="searchModel.value"
            :init-type.sync="searchModel.type"
            :filter-options="searchOptions"
          >
          </config-info-filter>
        </div>
        <div class="operate-btn">
          <el-button size="mini" type="primary" @click="toConfigBackUp"
            >配置备份</el-button
          >
          <el-button size="mini" type="primary" @click="toConfigResume"
            >配置恢复</el-button
          >
          <el-button size="mini" type="primary" @click="toConfigUpload"
            >配置上传</el-button
          >
        </div>
      </div>
      <div class="config-info-table">
        <el-table
          ref="configInfoTableRef"
          :data="configInfoTable.data"
          :default-sort="defaultSort"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          size="mini"
          stripe
          fit
          highlight-current-row
          @selection-change="rowSelect"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="配置类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.configName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备份时间" prop="backupTime" sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.backupTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备份文件" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.backupFile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <span
                class="link-type"
                style="margin-right: 10px"
                @click="downloadRow(scope.row)"
                >下载</span
              >
              <span class="link-type" @click="delelteRow(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="config-info-pagination">
        <!-- 分页 -->
        <idss-pagination
          background
          hide-on-single-page
          :table-data="configInfoTable"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next,sizes, jumper"
          @page-change="pageNumChange"
          @size-change="pageSizeChange"
        />
      </div>
    </div>
    <div class="config-info-back-up-dialog">
      <el-dialog
        custom
        :close-on-click-modal="false"
        title="配置备份"
        :visible="configBackUpVisible"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        @close="closeConfigBackUp"
      >
        <div class="config-info-back-up-dialog-content">
          <div class="back-up-dialog-header">
            提示: 请选择要备份的系统配置类型
          </div>
          <div class="back-up-dialog-checkbox">
            <el-checkbox-group
              v-model="configBackUpModel"
              @change="configBackUpChange"
            >
              <el-checkbox
                v-for="configBackUpOption of configBackUpOptions"
                :key="configBackUpOption.name"
                :label="configBackUpOption.name"
                name="type"
              >
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="checkAllChange">
            全选
          </el-checkbox> -->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="saveConfigBackUp">
            保 存
          </el-button>
          <el-button size="small" @click="closeConfigBackUp"> 取 消 </el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="config-info-upload-dialog"
        custom
        :close-on-click-modal="false"
        title="配置上传"
        :visible="uploadVisible"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        @close="closeUpload"
      >
        <div class="config-info-upload-dialog-box">
          <div class="upload-dialog-header">
            提示: 请上传需要的配置系统文件。
          </div>
          <div class="upload-dialog-content">
            <div class="upload-label">文件</div>
            <div class="upload-filename" @click="triggerUpload">
              {{ uploadFilename }}
            </div>
            <div id="upload-btn" class="upload-btn">
              <el-upload
                ref="config-info-upload"
                :headers="myHeaders"
                action="/gov/api/sys/config/backup/upload"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="uploadChange"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >浏览</el-button
                >
              </el-upload>
            </div>
          </div>
        </div>
        <div slot="footer">
          <el-button size="small" type="primary" @click="saveUpload">
            确 认
          </el-button>
          <el-button size="small" @click="closeUpload"> 取 消 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BusFactory from "vue-happy-bus";
import FilterBar from "@/components/FilterBar";
import { BUS } from "@/components/common/js/constant";
import { CLEAR_ALL_STATE__FUNC } from "@/components/common/js/mixins";
export default {
  components: {
    "config-info-filter": FilterBar,
  },
  mixins: [CLEAR_ALL_STATE__FUNC()],
  data() {
    return {
      bus: BusFactory(this),

      configInfoTable: {
        data: [],
        pageSize: 20,
        pageNum: 1,
        total: 0,
      },

      searchModel: {
        type: "1",
        value: "",
      },
      searchOptions: [
        {
          value: "名称",
          key: "1",
          stype: "input",
        },
      ],

      filterConditions: [],

      selection: [],

      orderField: "backupTime",
      // 降序
      orderType: "desc",

      // 配置备份对话框
      configBackUpVisible: false,

      configBackUpModel: [],
      checkAll: false,
      isIndeterminate: false,
      configBackUpOptions: [],

      uploadVisible: false,
      uploadFilename: "",
      uploadFile: null,

      loading: false,
    };
  },
  computed: {
    myHeaders() {
      return {
        authToken: window.localStorage.getItem(`base/token$$`),
        authType: window.localStorage.getItem(`base/authType$$`),
      };
    },
    defaultSort() {
      const { orderField, orderType } = this;

      return {
        prop: orderField,
        order: orderType === "desc" ? "descending" : "ascending",
      };
    },
  },
  created() {
    this.getTableData();

    this.getConfigTypes();

    this._registerEventListener();
  },
  methods: {
    _registerEventListener() {
      this.bus.$on(BUS.CAN_BE_SAVED_FILTERS_CHANGE, async ({ data }) => {
        // this.canBeSavedFilters = data

        if (data && Array.isArray(data)) {
          this.filterConditions = data.map((item) => ({
            code: item.code,
            endValue: item.status.endValue,
            operator: item.status.operator,
            startValue: item.status.startValue,
          }));

          this.getTableData();
        }
      });
    },
    async getConfigTypes() {
      try {
        const result = await this.$request({
          url: "/gov/api/sys/config/backup/getConfigTypes",
          method: "GET",
        });

        this.configBackUpOptions = result;
      } catch (e) {
        this.$message.error("获取配置类型");
      }
    },
    async getTableData() {
      try {
        const { pageSize, pageNum } = this.configInfoTable;
        const { orderField, orderType } = this;
        const { total, data } = await this.$request({
          url: "/gov/api/sys/config/backup/list",
          method: "POST",
          data: {
            pageNum,
            pageSize,
            backupFilterConditions: this.filterConditions,
            orderField,
            orderType,
          },
        });

        this.configInfoTable.total = total;
        this.configInfoTable.data = data;
      } catch (e) {
        this.$message.error("获取配置信息失败");
      }
    },
    rowSelect(selection) {
      this.selection = selection;
    },
    pageNumChange({ pageNum }) {
      this.configInfoTable.pageNum = pageNum;

      this.getTableData();
    },
    pageSizeChange({ pageSize }) {
      this.configInfoTable.pageSize = pageSize;

      this.getTableData();
    },
    // 配置备份
    toConfigBackUp() {
      this.configBackUpVisible = true;
    },
    // 配置恢复
    toConfigResume() {
      if (this.selection.length === 0) {
        this.$message.warning("请选择需要恢复的配置");

        return;
      }

      this.$confirm("配置将被恢复到版本,原有配置将被覆盖,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          try {
            await this.$request({
              url: "/gov/api/sys/config/backup/restore",
              method: "POST",
              data: {
                ids: this.selection.map(({ id }) => id),
              },
            });

            this.$message({
              type: "success",
              message: "配置恢复成功",
            });

            this.$refs["configInfoTableRef"].clearSelection();

            this.getTableData();
          } catch (e) {
            this.$message.error("配置恢复失败");
          } finally {
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消配置恢复",
          });
        });
    },
    // 下载
    downloadRow({ backupFile }) {
      this.$request(
        {
          url: "/gov/api/sys/config/backup/download",
          method: "GET",
          data: {
            fileName: backupFile,
          },
        },
        {
          responseType: "blob",
        }
      ).then(
        (content) => {
          let blob = new Blob([content.data], {
            type: "text/plain",
          });
          const fileName = /\.sql/.test(backupFile)
            ? backupFile
            : `${backupFile}.sql`;
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        },
        () => {
          this.showMessage("下载失败!", "error");
        }
      );
    },
    // 删除
    delelteRow({ id }) {
      this.$confirm("配置将被删除,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/sys/config/backup/delete",
              method: "POST",
              data: {
                id,
              },
            });
            this.$message.success("删除成功");

            this.getTableData();
          } catch (e) {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消配置删除",
          });
        });
    },
    closeConfigBackUp() {
      this.configBackUpVisible = false;
      // 清空表单
      this.configBackUpModel = [];

      // 重置全选状态
      this.checkAll = false;
      this.isIndeterminate = false;
    },
    checkAllChange(value) {
      this.configBackUpModel = value ? this.configBackUpOptions : [];
    },
    configBackUpChange(value) {
      const currentLen = value.length;
      const len = this.configBackUpOptions.length;
      // 是否全选
      this.checkAll = currentLen === len;
      // 非全选的状态
      this.isIndeterminate = currentLen > 0 && currentLen < len;
    },
    async saveConfigBackUp() {
      if (this.configBackUpModel.length === 0) {
        this.$message.error("请选择要备份的系统配置类型");
        return;
      }

      const configTypes = this.configBackUpModel.map((val) => {
        const { type } = this.configBackUpOptions.find(
          (option) => val === option.name
        );
        return type;
      });

      this.closeConfigBackUp();

      try {
        this.loading = true;
        await this.$request({
          url: "/gov/api/sys/config/backup/save",
          method: "POST",
          data: {
            configTypes,
          },
        });

        this.getTableData();

        this.$message.success("配置备份成功");
      } catch (e) {
        this.$message.error("配置备份失败");
      } finally {
        this.loading = false;
      }
    },
    // 配置上传
    toConfigUpload() {
      const len = this.selection.length;
      if (len === 0) {
        this.$message.warning("请选择一条配置信息");
      } else if (len === 1) {
        this.uploadVisible = true;
      } else {
        this.$message.warning("请选择一条配置信息(不能选择多条)");
      }
    },
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "sql";
      if (!extension) {
        this.$message.error("上传文件只能是.sql格式!");
      }

      return true;
    },
    uploadSuccess({ status, message }) {
      if (status === "success") {
        this.$message.success("上传成功");
      } else if (status === "error") {
        this.$message.error(message);
      }
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    closeUpload() {
      this.uploadVisible = false;

      this.$refs["config-info-upload"].clearFiles();

      this.uploadFilename = "";

      this.uploadFile = null;
    },
    uploadChange(file) {
      this.uploadFilename = file.name;
      this.uploadFile = file.raw;
    },
    triggerUpload() {
      document.querySelector("#upload-btn input").click();
    },
    saveUpload() {
      const { uploadFilename } = this;
      if (uploadFilename) {
        const extension = uploadFilename.substring(
          uploadFilename.lastIndexOf(".") + 1
        );

        const isExtension = extension === "sql";

        if (isExtension) {
          this.uploadHttpRequest();
          // this.$refs['config-info-upload'].submit()
        } else {
          this.$message.error("上传文件只能是.sql格式!");
        }
      } else {
        this.$message.warning("请选择上传的文件");
      }
    },
    async uploadHttpRequest() {
      const formData = new FormData();

      formData.append("file", this.uploadFile);
      formData.append("id", this.selection[0].id);

      this.closeUpload();

      this.loading = true;

      try {
        await this.$request({
          url: "/gov/api/sys/config/backup/upload",
          method: "POST",
          data: formData,
        });

        this.$message.success("上传成功");

        this.getTableData();
      } catch (e) {
        this.$message.error("上传失败");
      } finally {
        this.loading = false;
      }
    },
    sortChange({ prop, order }) {
      this.orderField = prop;
      this.orderType = order === "descending" ? "desc" : "asc";

      this.getTableData();
    },
  },
};
</script>

<style lang="postcss">
.config-info-container {
  position: relative;

  .config-info-box {
    padding: 10px 15px;

    .config-info-header {
      .header-title {
        padding-top: 10px;
        padding-bottom: 20px;
        font-size: var(--font-size-16);
        font-weight: bold;
        line-height: 1;
      }
    }

    .config-info-filter {
      display: flex;
      justify-content: space-between;
    }

    .config-info-table {
      .link-type {
        cursor: pointer;
        color: var(--button-text-color);

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .config-info-pagination {
      margin-top: 10px;
      .el-input--mini {
        .el-input__icon {
          line-height: 22px;
        }
      }
    }
  }
}

.config-info-back-up-dialog-content {
  padding: 10px;
  padding-bottom: 0;
  .back-up-dialog-header {
    margin-bottom: 20px;
  }

  .back-up-dialog-checkbox {
    width: 320px;
    margin: 0 auto;
    .el-checkbox {
      width: 150px;
      margin-bottom: 15px;
      margin-right: 0;
    }
  }
}

.config-info-upload-dialog {
  &[custom] {
    .el-dialog {
      width: 500px;
    }
  }

  .config-info-upload-dialog-box {
    padding: 10px;
    .upload-dialog-header {
      margin-bottom: 15px;
    }

    .upload-dialog-content {
      display: flex;
      align-items: center;
      padding: 0 20px;
      .upload-label {
        margin-right: 10px;
      }

      .upload-filename {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid #f1f1f1;
        height: 32px;
        line-height: 32px;
        padding: 0 5px;
        margin-right: 10px;
        cursor: pointer;
      }

      .upload-btn {
        flex-shrink: 0;
      }
    }
  }
}
</style>
