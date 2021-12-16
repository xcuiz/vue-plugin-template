<template>
  <el-card>
    <div slot="header" class="flex-sb-box">
      <PageHeader :title="data.name + ' - 数据资产'" />
      <!-- <el-button-group>
        <el-button type="primary" size="mini" @click="recordCheck"
          >备案</el-button
        >
      </el-button-group> -->
    </div>
    <el-form size="mini">
      <div class="basic-info-box">
        <div class="filing-status">
          <i
            class="iconfont"
            :class="`icon${filingInfo.icon}`"
            :style="{ color: filingInfo.iconColor }"
          ></i>
          <div
            :style="{
              'background-color': filingInfo.nameColor,
              color: filingInfo.iconColor,
            }"
            class="status-name"
          >
            {{ filingInfo.name }}
          </div>
        </div>
        <div class="basic-info">
          <el-row>
            <el-col :span="16">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="业务地址：">{{ data.ip }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="业务端口：">{{
                    data.port || "-"
                  }}</el-form-item>
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
                    data.dbOrFileName || "-"
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${statusTitle}来源：`">{{
                    data.sourceFrom || "-"
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="录入时间：">{{
                    data.createTime || "-"
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`最近${statusTitle}时间：`">{{
                    data.filingTime || "-"
                  }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${statusTitle}状态：`">{{
                    data.isFilingDesc || "-"
                  }}</el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
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
import FormDialogRecord from "../components/records-dialog";
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
    statusTitle: {
      type: String,
      default: "",
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
  computed: {
    filingInfo() {
      const names = {
        1: "未认领",
        2: "已认领",
        3: "未备案",
        4: "已备案",
      };

      const icons = {
        1: "renlingnull",
        2: "renling",
        3: "beiannull",
        4: "beian",
      };

      const iconColors = {
        1: "#b3b4b4",
        2: "#3c7dba",
        3: "#b3b4b4",
        4: "#3c7dba",
      };

      const nameColors = {
        1: "#f2f4f6",
        2: "#f1f6fd",
        3: "#f2f4f6",
        4: "#f1f6fd",
      };

      const { isFiling } = this.data;

      return {
        name: names[isFiling],
        icon: icons[isFiling],
        iconColor: iconColors[isFiling],
        nameColor: nameColors[isFiling],
      };
    },
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

.basic-info-box {
  display: flex;

  .filing-status {
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .iconfont {
      font-size: 40px;
    }

    .status-name {
      padding: 6px 8px;
    }
  }

  .basic-info {
    flex: 1;
  }
}
</style>
