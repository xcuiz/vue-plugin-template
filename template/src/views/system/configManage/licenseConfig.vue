<template>
  <div v-loading="loading" class="license-config-container">
    <div class="license-config-box">
      <div class="license-config-header">
        <div class="header-title">授权管理</div>
        <div class="header-btn">
          <el-button size="mini" plain type="primary" @click="getMachineCode"
            >获取本地机器码</el-button
          >
        </div>
      </div>
      <div class="license-config-content">
        <div class="license-config-left">
          <div class="license-name">{{ licenceInfo.licenceName }}</div>
          <div class="license-icon">
            <i
              class="iconfont iconlicense license-icon-img"
              :class="[licenceIconBg]"
            ></i>
          </div>
          <div class="license-release">版本号: {{ licenceInfo.release }}</div>
          <div class="license-version">Build号: {{ licenceInfo.version }}</div>
          <div class="license-version-type">{{ licenceInfo.versionType }}</div>
        </div>
        <div class="license-config-right">
          <div class="right-item">
            <div class="item-title">被授权人:</div>
            <div class="item-text">{{ licenceInfo.authorized }}</div>
          </div>
          <div class="right-item">
            <div class="item-title">授权码:</div>
            <div class="item-text">{{ licenceInfo.licenceCode }}</div>
          </div>
          <!-- <div class="item-title">授权信息:</div> -->
          <div class="item-text">
            <div class="license-base-list">
              <div class="license-base-item">
                <span class="base-title">账号数上限: </span>
                <span class="base-text">{{ licenceInfo.maxUser }}个</span>
              </div>
              <div class="license-base-item">
                <span class="base-title">容量上限: </span>
                <span class="base-text">{{ licenceInfo.capacity }}GB/每日</span>
              </div>
              <div class="license-base-item">
                <span class="base-title">失效时间至: </span>
                <span class="base-text">{{ licenceInfo.expireDate }}</span>
              </div>
              <div class="license-base-item">
                <span class="base-title">授权机构: </span>
                <span class="base-text">{{ licenceInfo.agency }}</span>
              </div>
            </div>
          </div>
          <div class="right-item">
            <div class="item-title">更新license:</div>
            <div>
              <el-upload
                :headers="myHeaders"
                action="/gov/api/sys/licence/upload"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
              >
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  class="operate-button"
                >
                  上传授权文件
                </el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <div class="license-config-dialog">
        <el-dialog
          custom
          :close-on-click-modal="false"
          title="获取本地机器码"
          :visible="visible"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          @close="closeDialog"
        >
          <div class="machine-code-dialog">
            <div class="machine-code-title">如下为本机机器码:</div>
            <div v-if="machineCode" class="machine-code">
              {{ machineCode }}
              <span
                id="copy-machine-code"
                class="copy"
                :data-clipboard-text="machineCode"
                @click="copyMachineCode"
                >复制</span
              >
            </div>
            <div class="btn-box">
              <el-button
                size="small"
                type="primary"
                style="margin-right: 20px"
                @click="closeDialog"
              >
                确 定
              </el-button>
              <el-button size="small" @click="closeDialog"> 取 消 </el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
export default {
  data() {
    return {
      licenceInfo: {
        // 授权码名称
        licenceName: "",
        // 版本号
        release: "",
        // Build号
        version: "",
        // 版本类型
        versionType: "",
        // 被授权人
        authorized: "",
        // 授权码
        licenceCode: "",
        // 账号数上限
        maxUser: "",
        // 容量上限
        capacity: "",
        // 失效时间
        expireDate: "",
        // 授权机构
        agency: "",
      },
      // 机器码
      machineCode: "",
      loading: false,
      visible: false,
    };
  },
  computed: {
    myHeaders() {
      return {
        authToken: window.localStorage.getItem(`base/token$$`),
        authType: window.localStorage.getItem(`base/authType$$`),
      };
    },
    licenceIconBg() {
      // 正式版绿色，测试版：蓝色
      return this.licenceInfo.versionType === "正式版"
        ? "green-icon"
        : "blue-icon";
    },
  },
  created() {
    this.getLicenceInfo();

    // 复制面板
    this.clipboard = null;
  },
  beforeDestroy() {
    this.clipboard = null;
  },
  methods: {
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "lic";
      if (!extension) {
        this.$message.error("上传文件只能是.lic格式!");
        return false;
      }

      this.loading = true;
      return extension;
    },
    handleSuccess({ status, message, content }) {
      this.loading = false;
      if (status === "error") {
        this.$message.error(message);

        return;
      }

      if (this.$route.name === "licence") {
        this.$message.success(
          "licence验证成功，2s后将跳转到登录界面，请重新登陆"
        );
        setTimeout(() => {
          this.$router.push({
            name: "login",
          });
        }, 2000);
      } else {
        if (status === "success") {
          this.$message.success("上传文件成功");

          if (content) {
            this.licenceInfo = content;
          } else {
            this.getLicenceInfo();
          }
        }
      }
    },
    /**
     * 获取licence信息
     */
    async getLicenceInfo() {
      const result = await this.$request({
        url: "/gov/api/sys/licence/info",
        method: "GET",
      });

      if (result) {
        this.licenceInfo = result;
      }
    },
    /**
     * 获取机器码
     */
    async getMachineCode() {
      this.loading = true;

      try {
        const result = await this.$request({
          url: "/gov/api/sys/licence/machineCode",
          method: "GET",
        });

        if (result) {
          this.machineCode = result;

          this.visible = true;
        }
      } catch (e) {
        this.$message.error("获取机器码失败");
      } finally {
        // 防止loading闪烁
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    },
    closeDialog() {
      this.visible = false;
    },
    async copyMachineCode() {
      await this.$nextTick();

      if (!this.clipboard) {
        const copy = document.getElementById("copy-machine-code");

        this.clipboard = new ClipboardJS(copy);

        this.clipboard.on("success", () => {
          this.$message.success("复制成功");
        });

        this.clipboard.on("error", () => {
          this.$message.error("复制失败");
        });

        copy.click();
      }
    },
  },
};
</script>

<style lang="postcss">
.license-config-container {
  position: relative;
  .license-config-box {
    padding: 10px 15px;
    .license-config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 5px;
      padding-bottom: 20px;

      .header-title {
        font-size: var(--font-size-16);
        font-weight: bold;
        line-height: 1;
      }
    }

    .license-config-content {
      background-color: #fff;
      display: flex;

      .license-config-left {
        width: 360px;
        flex-shrink: 0;
        border-right: 1px solid rgba(240, 240, 240);
        padding: 10px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .license-name {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .license-icon {
          margin-bottom: 10px;
          border-radius: 5px;
          line-height: normal;

          .license-icon-img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
            font-size: 120px;

            &.green-icon {
              color: #02b80e;
            }

            &.blue-icon {
              color: #1296db;
            }
          }
        }

        .license-release {
          margin-bottom: 10px;
        }

        .license-version {
          margin-bottom: 10px;
        }

        .license-version-type {
        }
      }

      .license-config-right {
        flex: 1;
        padding: 10px;
        line-height: 40px;

        .right-item {
          display: flex;

          .item-title {
            width: 100px;
            flex-shrink: 0;
          }

          .item-text {
            word-break: break-all;
          }
        }

        .license-base-list {
          font-size: 14px;
          /* border: 1px solid rgb(240, 240, 240); */
          .license-base-item {
            display: flex;

            .base-title {
              width: 100px;
              flex-shrink: 0;
            }

            .base-text {
              flex: 1;
            }
          }
        }

        .update-license {
          display: flex;
          justify-content: space-between;
        }
      }
    }

    .license-config-dialog {
      .el-dialog {
        width: 500px;
      }
    }
  }
}

.machine-code-dialog {
  padding: 10px;
  .machine-code-title {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .machine-code {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    .copy {
      margin-left: 20px;
      cursor: pointer;
      color: var(--button-text-color);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .btn-box {
    text-align: center;
  }
}
</style>
