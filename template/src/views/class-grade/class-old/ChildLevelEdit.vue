<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    title="编辑子类"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="child-level-edit-dialog"
    @close="closeDialog"
  >
    <div class="child-level-edit-box">
      <div class="box-form">
        <el-form
          ref="form"
          size="mini"
          :model="formData"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="父类名称" prop="classifyName">
            <el-input
              v-model="formData.classifyName"
              maxlength="64"
              placeholder="请输入父类名称"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="子类">
            <div
              v-if="selectLevelVisible"
              key="level-select-wrapper"
              class="select-level-box"
            >
              <el-select
                key="level-select"
                v-model="selectLevel"
                multiple
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="(level, index) of levels"
                  :key="level.id + index"
                  :label="level.featureName"
                  :value="level.id"
                  :disabled="
                    level.isUsed === '1' &&
                    !beforeSelectLevel.includes(level.id)
                  "
                ></el-option>
              </el-select>
            </div>
            <div v-else key="child-level-input">
              <div
                v-for="(cLevel, index) of childLevelList"
                :key="cLevel.id"
                class="child-level-line"
              >
                <el-input
                  v-model="childLevelList[index].value"
                  maxlength="64"
                  placeholder="请输入类型名称，实例：用户身份和标识信息"
                ></el-input>
                <i
                  class="el-icon-delete delete-child"
                  @click="toDeleteChild(index)"
                ></i>
              </div>
              <el-button @click="toAddChild">添加子类</el-button>
            </div>
          </el-form-item>
        </el-form>
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
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ChildLevelEdit",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectLevelVisible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({
        topId: "",
        level: "",
        id: "",
        classifyName: "",
      }),
    },
  },
  data() {
    return {
      loading: false,

      levels: [],
      selectLevel: [],
      beforeSelectLevel: [],
      // id作为唯一标志,防止更新时导致错误
      // { id: '', value: '' }
      childLevelList: [],
      formData: {
        topId: "",
        level: "",
        id: "",
        classifyName: "",
      },
      rules: {
        classifyName: [
          {
            required: true,
            message: "父类名称不能为空",
          },
        ],
      },
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          const { topId, level, id, classifyName, childrenList } = this.info;
          this.formData = {
            topId,
            level,
            id,
            classifyName,
          };

          if (Array.isArray(childrenList)) {
            this.selectLevel = childrenList.map(({ featureId }) => featureId);
            this.beforeSelectLevel = [...this.selectLevel];
          }
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getLevels();
  },
  methods: {
    async getLevels() {
      if (!this.selectLevelVisible) {
        return;
      }

      try {
        const { data } = await this.$request({
          url: "/gov/api/strategy/feature/allList",
          method: "GET",
        });

        if (Array.isArray(data)) {
          this.levels = data;
        }
      } catch (e) {}
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    toAddChild() {
      this.childLevelList.push({
        id: Math.random(),
        value: "",
      });
    },
    toDeleteChild(index) {
      this.childLevelList.splice(index, 1);
    },
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const { topId, level, id } = this.formData;
            if (this.selectLevelVisible) {
              // 敏感特征
              const { selectLevel } = this;

              await this.$request({
                url: "/gov/api/strategy/classify/addFeatures",
                method: "POST",
                data: {
                  classifyId: id,
                  gradeId: topId,
                  featureIdList: selectLevel,
                },
              });

              this.$message.success("编辑子类成功");
            } else {
              const { childLevelList } = this;
              // 对添加的所有子类去重
              const childNameList = [
                ...new Set(childLevelList.map(({ value }) => value)),
              ];
              if (childNameList.length !== childLevelList.length) {
                // 如果长度不一样,说明有重复项,此时提示用户
                this.$message.warning("子类项不能重复,请重新输入");
                return;
              }

              await this.$request({
                url: "/gov/api/strategy/classify/addList",
                method: "POST",
                data: {
                  topId,
                  level,
                  id,
                  childNameList,
                },
              });

              this.$message.success("编辑子类成功");
            }

            this.$emit("after-close");
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.child-level-edit-dialog {
  .child-level-line {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .delete-child {
      cursor: pointer;
      margin-left: 10px;
      font-size: 16px;
    }
  }

  .box-form {
    max-height: 400px;
    padding-right: 5px;
    overflow: auto;

    .select-level-box {
      margin-bottom: 10px;
    }
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
