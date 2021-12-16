<template>
  <div class="email-config-container">
    <widget-group hide-shadow padding="10px 0 10px 0">
      <div class="email-header">
        <div class="email-header-title">邮箱配置</div>
        <div class="email-header-btn">
          <el-button type="primary" size="small" @click="saveEmailConfig"
            >保存</el-button
          >
        </div>
      </div>
      <div class="email-form">
        <el-form
          ref="emailForm"
          size="mini"
          :model="emailModel"
          :rules="emailRules"
          label-width="120px"
          primary
        >
          <el-form-item label="邮件网关地址:" prop="gatewayAddr">
            <el-input v-model="emailModel.gatewayAddr"></el-input>
          </el-form-item>
          <el-form-item label="邮件网关端口:" prop="gatewayPort">
            <el-input v-model="emailModel.gatewayPort"></el-input>
          </el-form-item>
          <el-form-item label="发送邮件地址:" prop="sendMailAddr">
            <el-input v-model="emailModel.sendMailAddr"></el-input>
          </el-form-item>
          <el-form-item label="发送邮件账号:" prop="sendMailAccount">
            <el-input v-model="emailModel.sendMailAccount"></el-input>
          </el-form-item>
          <el-form-item label="账号密码:" prop="password">
            <el-input v-model="emailModel.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="测试验证邮箱:">
            <el-input v-model="testMailAddr"></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 10px"
              @click="testEmail"
              >测试</el-button
            >
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
      emailModel: {
        // 邮件网关地址
        gatewayAddr: "",
        // 邮件网关端口
        gatewayPort: "",
        // 发送邮件地址
        sendMailAddr: "",
        // 发送邮件账号
        sendMailAccount: "",
        // 账号密码
        password: "",
      },
      // 测试邮箱
      testMailAddr: "",
      emailRules: {
        gatewayAddr: [
          {
            required: true,
            message: "请输入邮件网关地址",
            trigger: "blur",
          },
        ],
        gatewayPort: [
          {
            required: true,
            message: "请输入邮件网关端口",
            trigger: "blur",
          },
        ],
        sendMailAddr: [
          {
            required: true,
            message: "请输入发送邮件地址",
            trigger: "blur",
          },
        ],
        sendMailAccount: [
          {
            required: true,
            message: "请输入发送邮件账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入账号密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getEmailConfig();
  },
  methods: {
    async getEmailConfig() {
      try {
        const result = await this.$request({
          url: "/gov/api/sys/mail/mailcfg",
          method: "GET",
        });

        if (result) {
          this.emailModel = result;
        }
      } catch (e) {
        this.$message.error("获取邮箱配置失败");
      }
    },
    saveEmailConfig() {
      this.$refs["emailForm"].validate(async (valid) => {
        if (valid) {
          try {
            await this.$request({
              url: "/gov/api/sys/mail/mailcfg",
              method: "POST",
              data: this.emailModel,
            });

            this.$message.success("保存邮箱配置成功");
          } catch (e) {
            this.$message.error("保存邮箱配置失败");
          }
        }
      });
    },
    testEmail() {
      this.$refs["emailForm"].validate(async (valid) => {
        if (valid) {
          try {
            await this.$request({
              url: "/gov/api/sys/mail/mailSendTest",
              method: "POST",
              data: {
                ...this.emailModel,
                testMailAddr: this.testMailAddr,
              },
            });
            this.$message.success("测试验证邮箱成功");
          } catch (e) {
            //
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.email-config-container {
  padding: 10px 15px;

  .email-header {
    display: flex;
    justify-content: space-between;

    .email-header-title {
      padding-top: 10px;
      padding-bottom: 20px;
      font-size: var(--font-size-16);
      font-weight: bold;
      line-height: 1;
    }
  }

  .email-form {
    width: 600px;
    margin: 0 auto;
  }
}
</style>
