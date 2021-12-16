<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    title="导入分级"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="leak-in-level-dialog"
    @close="closeDialog"
  >
    <div class="leak-in-level-box">
      <el-alert type="info" :closable="false">
        <div style="font-size: 14px">
          请务必上传Excel格式，（单个Excel最大100M），或者
          <el-button type="text" size="mini" @click="toDownloadTemplate"
            >下载模板文件</el-button
          >，根据格式填写完整再上传
        </div>
      </el-alert>
      <div class="upload-file-box">
        <div class="upload-file-title">上传文件</div>
        <el-upload
          class="upload-file"
          drag
          action=""
          :auto-upload="false"
          :limit="1"
          :on-remove="onRemove"
          :on-change="onChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div class="file-demo">
        <div class="file-demo-title">表格示例</div>
        <div class="file-demo-tip">
          请上传有标准行列的一维数据表格，有合并单元格的数据请处理后再上传，否则可能识别有误
        </div>
        <el-table
          :data="demoData"
          size="mini"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="第一列" show-overflow-tooltip prop="one">
          </el-table-column>
          <el-table-column label="第二列" show-overflow-tooltip prop="two">
          </el-table-column>
          <el-table-column label="第三列" show-overflow-tooltip prop="three">
          </el-table-column>
          <el-table-column label="第四列" show-overflow-tooltip prop="four">
          </el-table-column>
          <el-table-column label="第五列" show-overflow-tooltip prop="five">
          </el-table-column>
          <el-table-column label="第六列" show-overflow-tooltip prop="six">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        size="small"
        type="primary"
        :disabled="loading"
        @click="handleSaveForm"
      >
        保 存
      </el-button>
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "LeakInLevel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      demoData: [
        {
          one: "级别编码",
          two: "级别名称",
          three: "描述信息",
          four: "管控原则",
          five: "开放要求",
          six: "标签",
        },
        {
          one: "第四级",
          two: "极敏感级",
          three: "这是一段描述信息",
          four:
            "应实施严格的技术和管理措施，保护数据的机密性和完整性，确保数据访问安全，建立严格的数据安全管理规范以及数据实施监控机制",
          five: "对内输出原始数据，对外严禁输出原始数据",
          six: "牟取暴利，造成政企客户流失，损失巨大",
        },
      ],

      uploadFile: null,

      onRemove() {
        this.uploadFile = null;
      },
      onChange: (file) => {
        this.uploadFile = file.raw;
      },
    };
  },
  methods: {
    async handleSaveForm() {
      if (!this.uploadFile) {
        this.$message.warning("请选择需要上传的文件");
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();

        formData.append("file", this.uploadFile);
        await this.$request({
          url: "/gov/api/strategy/grade/analysis",
          method: "POST",
          data: formData,
        });

        this.$message.success("上传成功");

        this.$emit("after-close");
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async toDownloadTemplate() {
      this.$message.info("正在下载,请稍后...");
      try {
        const { data } = await this.$request(
          {
            url: "/gov/api/strategy/grade/exportTemplate",
            method: "GET",
          },
          {
            responseType: "blob",
          }
        );

        if (data) {
          const blob = new Blob([data], {
            type: "application/vnd.ms-excel",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "分级模板.xlsx";
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        }
      } catch (e) {}
    },
    closeDialog() {
      this.$emit("update:visible");
    },
  },
};
</script>

<style lang="postcss">
.leak-in-level-dialog {
  .el-dialog {
    width: 800px !important;
  }
}

.leak-in-level-box {
  .upload-file-box {
    padding: 10px 0;
    .upload-file-title {
      padding-bottom: 10px;
      color: rgb(153, 153, 153);
    }

    .upload-file {
      .el-upload {
        width: 100%;
        .el-upload-dragger {
          width: 100%;
        }
      }
    }
  }

  .file-demo {
    border-top: 1px dashed #ddd;

    .file-demo-title {
      line-height: 40px;
      height: 40px;
      font-weight: 700;
      color: #888;
    }

    .file-demo-tip {
      color: #999;
      line-height: 30px;
      margin-bottom: 10px;
    }
  }
}
</style>
