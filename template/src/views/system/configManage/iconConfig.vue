<template>
  <div class="icon-config-container">
    <widget-group hide-shadow padding="10px 20px 20px 10px">
      <div class="icon-header">系统名称配置</div>
      <div class="ntp-server-config">
        <!-- <div class="ntp-header">
          <div class="ntp-header-title"></div>
          <el-button type="primary" @click="saveTimeConfig" size="small">保存</el-button>
        </div> -->
        <div class="ntp-form">
          <el-form
            ref="form"
            size="mini"
            :model="form"
            :rules="rules"
            label-width="120px"
            primary
          >
            <el-form-item label="系统名称:" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入系统名称，最多25个中英文字母"
                maxlength="25"
              ></el-input>
            </el-form-item>

            <el-form-item label="系统Logo:" prop="businessId">
              <el-upload
                ref="upload"
                :headers="myHeaders"
                class="upload-container"
                :file-list="fileList"
                drag
                accept=".jpg, .jpeg, .png, .svg, .gif"
                list-type="picture-card"
                :on-success="handleSuccess"
                :on-error="handleError"
                :limit="1"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview"
                action="/gov/api/sys/logo/upload"
              >
                <div slot="default" class="text-content">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
                  <!-- <span>支持扩展名：.jpg, .png, .gif, .svg</span> -->
                </div>
                <div slot="tip" class="el-upload__tip">
                  注：支持像素26*X（高度*宽度，宽度等比例缩放），大小限制200K
                  图标格式支持：svg、png、jpg、gif，建议使用png透明背景图片将获得更好效果
                </div>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <!-- <span

                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)">
                      <i class="el-icon-download"></i>
                    </span> -->
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="标题图标" prop="faviconBusinessId">
              <el-upload
                ref="upload"
                :headers="myHeaders"
                class="upload-container favicon-container"
                :file-list="faviconFileList"
                drag
                accept=".jpg, .jpeg, .png, .svg, .gif, .ico"
                list-type="picture-card"
                :on-success="handleFaviconUploadSuccess"
                :on-error="handleFaviconError"
                :limit="1"
                :on-exceed="handleExceed"
                :on-remove="handleFaviconRemove"
                :before-upload="beforeUpload"
                action="/gov/api/sys/logo/upload"
              >
                <div slot="default" class="text-content">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
                </div>
                <div slot="tip" class="el-upload__tip">
                  注：大小限制200K
                  图标格式支持：svg、png、jpg、gif、ico，建议使用ico透明背景图片将获得更好效果
                </div>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handleFaviconPictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleFaviconRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <el-dialog
                :close-on-click-modal="false"
                title="预览"
                custom
                :visible.sync="dialogVisible"
                :custom-class="dialogType === 'favicon' ? '' : 'preview-dialog'"
              >
                <img width="100%" :src="dialogImageUrl" alt="" />
                <!-- <span slot="footer">
                  <el-button size="small" @click="dialogVisible=false">关闭</el-button>
                </span> -->
              </el-dialog>
            </el-form-item>
          </el-form>
          <footer class="footer">
            <el-button type="primary" size="small" @click="handleSave"
              >更新</el-button
            >
            <el-button type="primary" size="small" @click="handleReset"
              >设置为默认</el-button
            >
          </footer>
        </div>
      </div>
    </widget-group>
  </div>
</template>

<script>
import WidgetGroup from "@/components/widget-group";
import { mapGetters } from "vuex";
export default {
  name: "IconConfig",
  components: {
    WidgetGroup,
  },
  data() {
    return {
      fileList: [],
      faviconFileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogType: "logo", // 弹窗区分标题和logo，logo背景蓝色，标题背景白色
      form: {
        // title标题
        title: "",
        // logo图标
        // logo: '',
        businessId: "",
        faviconBusinessId: "", // 网站图标
      },
      rules: {
        businessId: [
          {
            required: true,
            message: "请上传logo图标",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters("base", ["projectIcon$$"]),
    myHeaders() {
      return {
        authToken: window.localStorage.getItem(`base/token$$`),
        authType: window.localStorage.getItem(`base/authType$$`),
      };
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        const res =
          (await this.$request({
            url: `/gov/api/sys/logo/detail`,
          })) || {};
        this.form = Object.assign(this.form, res);
        this.fileList = [
          {
            url: res.logo,
          },
        ];
        this.faviconFileList = [
          {
            url: res.favicon,
          },
        ];
      } catch (error) {
        //
      }
    },
    /**
     * 保存
     */
    handleSave() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          try {
            const { title, logo, favicon } = await this.$request({
              url: "/gov/api/sys/logo/save",
              method: "POST",
              data: {
                ...this.form,
              },
            });
            this.$message.success("保存成功");
            this.$store.commit("base/projectIcon$$", {
              title,
              logo,
              favicon,
            });
            // this.getTimeConfig()
          } catch (e) {
            this.$message.error(e);
          }
        }
      });
    },
    /**
     * 设置为默认
     */
    async handleReset() {
      try {
        this.fileList = [];
        this.faviconFileList = [];
        const res = await this.$request({
          url: `/gov/api/sys/logo/setDefault`,
          method: "post",
        });
        const {
          defaultTitle,
          defaultLogo,
          businessId,
          defaultFavicon,
          faviconBusinessId,
        } = res || {};
        // debugger
        this.form = Object.assign(this.form, {
          title: defaultTitle,
          // logo: defaultLogo,
          businessId,
          faviconBusinessId,
        });
        this.$nextTick(() => {
          // 替换展示的图标
          this.fileList = [
            {
              url: defaultLogo,
            },
          ];
          this.faviconFileList = [
            {
              url: defaultFavicon,
            },
          ];
          this.$refs.form.validateField("businessId");
        });

        this.$message.success("已恢复为默认设置");
        // 更新vuex
        this.$store.commit("base/projectIcon$$", {
          title: defaultTitle,
          logo: defaultLogo,
          favicon: defaultFavicon,
        });
      } catch (error) {
        //
      }
    },
    /**
     * 上传文件前效验
     */
    beforeUpload(file) {
      // 判断图片是否大于2M
      const isLt200K = file.size / 1024 < 200;
      if (!isLt200K) {
        this.$message.error("上传图片大小不能超过 200KB!");
        return false;
      }
    },
    // 移除事件
    handleRemove() {
      this.fileList = [];
      this.form.businessId = "";
      this.$refs.form.validateField("businessId");
    },
    /**
     * 只能上传张图片
     */
    handleExceed() {
      this.$message.warning(`只能上传一个附件！`);
    },
    /**
     * 上传成功回调函数
     */
    handleSuccess(res) {
      if (res.status !== "success") {
        this.$message.error(res.message);
      } else {
        // this.form.logo = file.name
        this.form.businessId = res.content.businessId;
        this.$refs.form.validateField("businessId");
      }
    },
    /**
     * 上传失败
     */
    handleError(err) {
      this.businessId = "";
      this.$message.error(err.message || "上传异常");
    },
    // 照片墙
    handlePictureCardPreview(file) {
      this.dialogType = "logo";
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 标题预览
    handleFaviconPictureCardPreview(file) {
      this.dialogType = "favicon";
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 标题上传成功回调
    handleFaviconUploadSuccess(res) {
      if (res.status !== "success") {
        this.faviconBusinessId = "";
        this.faviconFileList = [];
        this.$message.error(res.message);
      } else {
        // this.form.logo = file.name
        this.form.faviconBusinessId = res.content.businessId;
        this.$refs.form.validateField("faviconBusinessId");
      }
    },
    // 标题移除附件
    handleFaviconRemove() {
      this.faviconFileList = [];
      this.form.faviconBusinessId = "";
      this.$refs.form.validateField("faviconBusinessId");
    },
    // 标题上传异常钩子
    handleFaviconError(err) {
      this.faviconBusinessId = "";
      this.faviconFileList = [];
      this.$message.error(err.message || "上传异常");
    },
  },
};
</script>

<style lang="postcss" scoped>
.icon-config-container {
  padding: 10px 15px;

  .icon-header {
    padding-top: 10px;
    padding-bottom: 20px;
    font-size: var(--font-size-16);
    font-weight: bold;
    line-height: 1;
  }

  .current-time-box {
    display: flex;

    .current-text {
      padding-right: 10px;
    }
  }

  .ntp-server-config {
    .ntp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid rgb(238, 238, 238);
      padding-bottom: 10px;
      .ntp-header-title {
        font-weight: bold;
      }
    }

    .ntp-form {
      padding: 15px 0;

      .el-input-number {
        width: 200px;
        .el-input {
          width: auto;
        }
      }

      .el-select {
        margin-left: 10px;
        .el-input {
          width: 120px;
        }
      }
    }
  }
  .upload-container {
    /* height: 180px; */
    >>> .el-upload--picture-card {
      border: none;
      width: 180px;
      height: 180px;
    }
    >>> .el-upload-list__item {
      background: var(--guan-dark-6);
      width: 180px;
      height: 180px;
      line-height: 180px;
    }
    &.favicon-container {
      >>> .el-upload-list__item {
        background: var(--white);
      }
    }
    .text-content {
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .el-icon-upload {
        margin-top: 0;
      }
      .el-upload__text {
        line-height: normal;
        margin-bottom: 5px;
      }
      span {
        line-height: normal;
      }
    }
  }
  .footer {
    text-align: center;
  }
  >>> .el-dialog {
    .el-dialog__body {
      background: var(--white);
    }
    &.preview-dialog {
      .el-dialog__body {
        background: var(--guan-dark-6);
      }
    }
  }
}
</style>
