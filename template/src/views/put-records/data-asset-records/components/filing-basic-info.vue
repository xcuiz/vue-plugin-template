<template>
  <el-card>
    <div slot="header" class="flex-sb-box">
      <PageHeader :title="data.name + ' - 数据资产'" />
      <el-button-group>
        <el-button type="primary" size="mini" @click="recordCheck"
          >备案</el-button
        >
      </el-button-group>
    </div>
    <el-form size="mini">
      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="8">
              <el-form-item label="业务地址：">{{ data.ip }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务端口：">{{ data.port }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="存储类型：">{{
                data.storageModeDesc + "/" + data.assetType
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据库名：">{{
                data.dbOrFileName
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备案来源：">{{
                data.sourceFrom
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="录入时间：">{{
                data.createTime
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最近备案时间：">{{
                data.filingTime
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备案状态：">{{
                data.isFilingDesc
              }}</el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <FormDialogRecord
      v-bind="formDialog"
      :visible.sync="formDialog.visible"
      @success="onSuccess"
    />
  </el-card>
</template>
<script>
import PageHeader from "@/components/PageHeader";
import FormDialogRecord from "./records-dialog";
export default {
  components: {
    PageHeader,
    FormDialogRecord,
  },
  props: {
    filingId: {
      type: [Number, String],
      require: true,
    },
    data: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      formDialog: {
        visible: false,
        id: null,
      },
    };
  },
  methods: {
    recordCheck() {
      this.formDialog = {
        visible: true,
        id: this.filingId,
      };
    },
    onSuccess() {
      this.$emit("success");
    },
  },
};
</script>
<style lang="postcss" scoped>
.el-form-item {
  margin-bottom: 6px;
}
</style>
