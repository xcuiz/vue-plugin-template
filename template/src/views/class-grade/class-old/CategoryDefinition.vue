<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    title="类别编辑"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="category-definition-dialog"
    @close="closeDialog"
  >
    <div class="category-definition-box">
      <el-alert
        :closable="false"
        title="说明：类别重置后，将会清除已定义的分类数据，解除与敏感类型的关联关系，且按照分类添加的发现模板需重新定义，请谨慎操作"
        type="warning"
      >
      </el-alert>
      <div class="box-form">
        <el-form
          ref="form"
          size="mini"
          :model="formData"
          :rules="rules"
          :inline="false"
        >
          <el-form-item
            v-for="(levelItem, index) of formData.level"
            :key="index"
          >
            <div slot="label">
              <span style="color: #f00">*</span>
              {{ levelFormatter(index) }}级类别
              <i
                v-show="index === formData.level.length - 1 && index !== 0"
                class="el-icon-delete delete-level"
                @click="toDelete"
              ></i>
            </div>

            <div class="category-level-name">
              <el-input
                v-model="levelItem.levelName"
                maxlength="64"
                placeholder="请输入级别名称"
              ></el-input>
            </div>

            <div class="category-level-description">
              <el-input
                v-model="levelItem.description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述"
                maxlength="200"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              v-show="formData.level.length !== maxCount"
              type="primary"
              @click="toAdd"
              >新增类别</el-button
            >
          </el-form-item>
          <el-form-item label="敏感类型" prop="sensitiveDescription">
            <el-input
              v-model="formData.sensitiveDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
              maxlength="200"
            >
            </el-input>
          </el-form-item>
        </el-form>
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
  name: "CategoryDefinition",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      maxCount: 5,
      formData: {
        // { levelName: '', description: '' }
        level: [
          {
            levelName: "",
            description: "",
          },
        ],
        sensitiveDescription: "",
      },
      rules: {},
    };
  },
  methods: {
    toAdd() {
      this.formData.level.push({
        levelName: "",
        description: "",
      });
    },
    toDelete() {
      this.formData.level.pop();
    },
    levelFormatter(levelNumber) {
      const levelMap = [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
      ];

      return levelMap[levelNumber];
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    handleSaveForm() {},
  },
};
</script>

<style lang="postcss">
.category-definition-dialog {
  .el-dialog {
    width: 800px !important;
  }

  .el-form {
    .el-form-item__label {
      position: relative;
      z-index: 10;
    }
  }
}

.category-definition-box {
  max-height: 500px;
  overflow: auto;
  padding-right: 10px;
  .box-form {
    margin-top: 10px;

    .category-level-name {
      margin-bottom: 15px;
    }

    .category-level-description {
    }

    .delete-level {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
