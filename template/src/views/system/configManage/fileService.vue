<template>
  <div class="file-service-container">
    <widget-group hide-shadow padding="10px 0 10px 0">
      <div class="file-service-header">
        <div class="file-service-title">文件服务配置</div>
        <div class="file-service-btn">
          <el-button type="primary" size="small" @click="saveFileService"
            >保存</el-button
          >
        </div>
      </div>
      <div class="file-service-form">
        <el-form
          ref="fileServiceForm"
          size="mini"
          :model="fileServiceModel"
          label-width="120px"
          primary
        >
          <div class="nfs-header">
            <div class="nfs-header-title">NFS服务配置</div>
            <el-switch v-model="fileServiceModel.nfsEnable"></el-switch>
          </div>
          <el-form-item
            label="NFS目录:"
            prop="nfsFolder"
            :rules="
              fileServiceModel.nfsEnable
                ? { required: true, message: '请输入NFS目录', trigger: 'blur' }
                : {}
            "
          >
            <el-input v-model="fileServiceModel.nfsFolder"></el-input>
          </el-form-item>
          <div class="hdfs-header">
            <div class="hdfs-header-title">HDFS服务配置</div>
            <el-switch v-model="fileServiceModel.hdfsEnable"></el-switch>
          </div>
          <el-form-item
            label="HDFS服务:"
            prop="hdfsServer"
            :rules="
              fileServiceModel.hdfsEnable
                ? { required: true, message: '请输入HDFS服务', trigger: 'blur' }
                : {}
            "
          >
            <el-input v-model="fileServiceModel.hdfsServer"></el-input>
          </el-form-item>
          <el-form-item
            label="用户名:"
            prop="userName"
            :rules="
              fileServiceModel.hdfsEnable
                ? { required: true, message: '请输入用户名', trigger: 'blur' }
                : {}
            "
          >
            <el-input v-model="fileServiceModel.userName"></el-input>
          </el-form-item>
          <el-form-item
            label="密码:"
            prop="password"
            :rules="
              fileServiceModel.hdfsEnable
                ? { required: true, message: '请输入密码', trigger: 'blur' }
                : {}
            "
          >
            <el-input
              v-model="fileServiceModel.password"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </widget-group>
  </div>
</template>

<script>
import WidgetGroup from "@/components/widget-group";
export default {
  name: "EmailConfig",
  components: {
    WidgetGroup,
  },
  data() {
    return {
      fileServiceModel: {
        // NFS配置是否开启
        nfsEnable: false,
        // NFS目录
        nfsFolder: "",
        // HDFS是否开启
        hdfsEnable: false,
        // HDFS服务
        hdfsServer: "",
        // 用户名
        userName: "",
        // 密码
        password: "",
      },
      // fileServiceRules: {
      //   nfsFolder: [{
      //     // required: true,
      //     message: '请输入NFS目录',
      //     trigger: 'blur'
      //   }],
      //   hdfsServer: [{
      //     required: true,
      //     message: '请输入HDFS服务',
      //     trigger: 'blur'
      //   }],
      //   userName: [{
      //     required: true,
      //     message: '请输入用户名',
      //     trigger: 'blur'
      //   }],
      //   password: [{
      //     required: true,
      //     message: '请输入密码',
      //     trigger: 'blur'
      //   }]
      // }
    };
  },
  watch: {
    "fileServiceModel.nfsEnable"(val) {
      if (!val) {
        this.$refs["fileServiceForm"].clearValidate("nfsFolder");
      }
    },
    "fileServiceModel.hdfsEnable"(val) {
      if (!val) {
        this.$refs["fileServiceForm"].clearValidate([
          "hdfsServer",
          "userName",
          "password",
        ]);
      }
    },
  },
  created() {
    this.getFileService();
  },
  methods: {
    async getFileService() {
      try {
        const result = await this.$request({
          url: "/gov/api/sys/fileservice/filecfg",
          method: "GET",
        });

        if (result) {
          this.fileServiceModel = {
            ...result,
            nfsEnable: result.nfsEnable === "on",
            hdfsEnable: result.hdfsEnable === "on",
          };
        }
      } catch (e) {
        this.$message.error("获取文件服务配置失败");
      }
    },
    saveFileService() {
      this.$refs["fileServiceForm"].validate(async (valid) => {
        if (valid) {
          try {
            await this.$request({
              url: "/gov/api/sys/fileservice/filecfg",
              method: "POST",
              data: {
                ...this.fileServiceModel,
                nfsEnable: this.fileServiceModel.nfsEnable ? "on" : "off",
                hdfsEnable: this.fileServiceModel.hdfsEnable ? "on" : "off",
              },
            });

            this.$message.success("保存文件服务配置成功");
          } catch (e) {
            this.$message.error("保存文件服务配置失败");
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.file-service-container {
  padding: 10px 15px;

  .file-service-header {
    display: flex;
    justify-content: space-between;

    .file-service-title {
      padding-top: 10px;
      padding-bottom: 20px;
      font-size: var(--font-size-16);
      font-weight: bold;
      line-height: 1;
    }
  }

  .file-service-form {
    padding-left: 20px;
    .nfs-header {
      display: flex;
      width: 100%;
      border-bottom: 1px solid rgb(238, 238, 238);
      padding-bottom: 5px;
      margin-bottom: 10px;

      .nfs-header-title {
        font-weight: bold;
        margin-right: 10px;
      }
    }

    .hdfs-header {
      display: flex;
      width: 100%;
      border-bottom: 1px solid rgb(238, 238, 238);
      padding-bottom: 5px;
      margin-bottom: 10px;

      .hdfs-header-title {
        font-weight: bold;
        margin-right: 10px;
      }
    }
  }
}
</style>
