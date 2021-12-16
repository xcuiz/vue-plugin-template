<!--
 * @Author: your name
 * @Date: 2021-03-24 14:13:45
 * @LastEditTime: 2021-04-27 18:14:50
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\put-records\sensitive-data-exception\component\import.vue
-->
<template>
  <el-dialog
    custom
    :close-on-click-modal="false"
    title="导入数据资源"
    :visible="visible"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <el-form ref="importForm" :model="importForm" label-width="100px">
      <el-alert type="info" :closable="false" class="import-tip-bg">
        <div style="font-size: 14px; margin-bottom: 10px">
          请按照数据模板的格式精确的导入数据，模板中的表头名称不可更改，表头行不能删除。
        </div>
      </el-alert>
      <el-form-item label="导入数据资源:">
        <el-radio-group v-model="importForm.dataBase">
          <el-radio label="DataBase">数据库存储</el-radio>
          <el-radio label="BigData">大数据存储</el-radio>
          <el-radio label="File">文件存储</el-radio> </el-radio-group
        >&nbsp;
        <el-button plain size="mini" type="primary" @click="downloadTemp"
          >下载模板</el-button
        >
      </el-form-item>
      <el-alert type="info" :closable="false" class="import-tip-bg">
        <div style="font-size: 14px; margin-bottom: 10px">
          仅支持模板格式的excel文件格式数据
        </div>
      </el-alert>
      <el-form-item label="上传导入文件:" class="form-upload">
        <el-radio-group v-model="importForm.importFile">
          <el-radio label="DataBase">数据库存储</el-radio>
          <el-radio label="BigData">大数据存储</el-radio>
          <el-radio label="File">文件存储</el-radio>
        </el-radio-group>
        <!-- :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :file-list="fileList"
            :on-change="handleChange" -->
        <div class="upload-wrap">
          <el-upload action="/gov/api/asset/list/upload">
            <el-button size="mini" plain type="primary" class="operate-button">
              上传数据
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="重复数据处理:" class="upload-mode">
        <el-radio-group v-model="importForm.isCover">
          <el-radio label="true">直接覆盖</el-radio>
          <el-radio label="false">跳过处理</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="export-button">
      <el-button
        size="small"
        type="primary"
        class="operate-button"
        @click="submitUpload"
      >
        导入
      </el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { downloadTemplate } from "../api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      importForm: {
        dataBase: "DataBase",
        importFile: "DataBase",
        isCover: "true",
      },
    };
  },
  methods: {
    submitUpload() {},
    handleClose() {
      this.$emit("update:visible", false);
    },
    async downloadTemp() {
      await downloadTemplate(this.importForm.dataBase).then((res) => {
        let blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "";
        fileName = `${this.importForm.dataBase}模板.xls`;
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        // 释放内存
        window.URL.revokeObjectURL(link.href);
      });
    },
    async toExport() {
      let param = null;
      if (
        JSON.stringify(this.filterValue) === "{}" &&
        this.selectedIds.length === 0
      ) {
        param = {};
      } else {
        param = { ...this.filterValue, idList: this.selectedIds };
      }
      this.loading = true;
      try {
        const { data } = await this.$request(
          {
            url: `/gov/api/asset/list/export`,
            method: "POST",
            data: {
              params: param,
            },
          },
          {
            responseType: "blob",
          }
        );
        if (data) {
          let blob = new Blob([data], {
            type: "blob",
          });
          let fileName = "";
          fileName = "导出.zip";
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);

          this.$message.success("导出成功");
        }
      } catch (e) {
        this.$message.error("导出失败");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-upload {
  >>> .el-form-item__content {
    display: flex;
    .el-radio-button__inner,
    .el-radio-group {
      line-height: 50px;
    }
  }
  .upload-wrap {
    margin-left: 10px;
  }
}
.el-form {
  >>> .import-tip-bg {
    margin-bottom: 15px;
  }
  .upload-mode {
    margin-top: -20px;
  }
}
</style>
