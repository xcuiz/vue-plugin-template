<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="title"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="new-data-level-dialog"
    @close="closeDialog"
  >
    <div v-loading="detailLoading" class="new-data-level-box">
      <div class="box-form">
        <el-form
          ref="form"
          size="mini"
          :model="formData"
          :rules="rules"
          label-width="90px"
        >
          <el-form-item label="级别编码" prop="code">
            <el-input
              v-model="formData.code"
              maxlength="10"
              placeholder="请输入级别编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="级别名称" prop="gradeName">
            <div class="grade-name-box">
              <el-input
                v-model="formData.gradeName"
                maxlength="10"
                placeholder="请输入级别名称"
              ></el-input>
              <el-dropdown class="color-dropdown">
                <span class="el-dropdown-link">
                  <div
                    class="current-color"
                    :style="{ 'background-color': formData.gradeColor }"
                  ></div>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" trigger="click">
                  <el-dropdown-item
                    v-for="(color, index) of colorList"
                    :key="index"
                  >
                    <div
                      class="color-dot"
                      :style="{ 'background-color': color }"
                      @click="colorChange(color)"
                    ></div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <el-input-number
              v-model="formData.priority"
              placeholder="请输入"
              :min="1"
              :max="5"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
          <el-form-item label="探针" prop="probeId">
            <el-select v-model="formData.probeId" style="width: 100%">
              <el-option
                v-for="item in probes"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述信息" prop="description">
            <el-input
              v-model="formData.description"
              maxlength="200"
              :rows="3"
              type="textarea"
              placeholder="请输入描述信息"
            ></el-input>
          </el-form-item>
          <!--
          <el-form-item
            v-for="(tag, index) of formData.tagList"
            :key="`tag-${index}`"
            :label="`标签${index + 1}`"
            prop="tagList"
          >
            <div class="tag-box">
              <el-input
                v-model="formData.tagList[index]"
                maxlength="30"
                placeholder="请输入标签"
              ></el-input>
              <i
                :style="{
                  visibility:
                    index === formData.tagList.length - 1
                      ? 'visible'
                      : 'hidden',
                }"
                class="el-icon-delete tag-delete-icon"
                @click="toDeleteTag"
              ></i>
            </div>
          </el-form-item>
          <el-form-item label="">
            <el-button
              type="primary"
              :disabled="tagAddDisabled"
              @click="toAddTag"
              >新增标签</el-button
            >
          </el-form-item>
          <el-form-item label="管控原则" prop="controlRule">
            <el-input
              v-model="formData.controlRule"
              maxlength="200"
              :rows="3"
              type="textarea"
              placeholder="请输入管控原则"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-for="(access, index) of accessList"
            :key="`access-${index}`"
            :label="`开放要求${index + 1}`"
          >
            <div class="access-box">
              <el-select
                v-model="accessList[index].claim"
                placeholder="开放要求"
              >
                <el-option
                  v-for="claim of claimList"
                  :key="claim"
                  :label="claim"
                  :value="claim"
                ></el-option>
              </el-select>
              <el-select
                v-model="accessList[index].type"
                placeholder="数据类型"
              >
                <el-option
                  v-for="type of typeList"
                  :key="type"
                  :label="type"
                  :value="type"
                ></el-option>
              </el-select>
              <el-select
                v-model="accessList[index].layout"
                placeholder="数据形式"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="layout of layoutList"
                  :key="layout"
                  :label="layout"
                  :value="layout"
                ></el-option>
              </el-select>
              <i
                :style="{
                  visibility:
                    index === accessList.length - 1 ? 'visible' : 'hidden',
                }"
                class="el-icon-delete tag-delete-icon"
                @click="toDeleteAccess"
              ></i>
            </div>
          </el-form-item>
          <el-form-item label="">
            <el-button
              type="primary"
              :disabled="accessAddDisabled"
              @click="toAddAccess"
              >新增开放要求</el-button
            >
          </el-form-item>
          <el-form-item label="处理方式" prop="treatment">
            <el-radio-group v-model="formData.treatment">
              <el-radio label="风险告警">风险告警</el-radio>
              <el-radio label="阻断当前操作">阻断当前操作</el-radio>
              <el-radio label="禁用用户">禁用用户</el-radio>
            </el-radio-group>
          </el-form-item>
           -->
        </el-form>
      </div>
    </div>
    <div v-if="dialogType !== 'examine'" slot="footer" class="dialog-footer">
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
/* eslint-disable no-empty */
export default {
  name: "NewDataLevel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: [String, Number],
      default: null,
    },
    dialogType: {
      type: String,
    },
  },
  data() {
    return {
      detailLoading: false,

      loading: false,

      // 开放要求 { claim: "", type: "", layout: [], term: "" }
      accessList: [],

      // 标签最多添加个数
      TAG_MAX_COUNT: 10,
      // 开放要求最多添加个数
      ACCESS_MAX_COUNT: 10,

      formData: {
        // 级别编码
        code: "",
        // 级别名称
        gradeName: "",
        // 级别颜色
        gradeColor: "rgb(255, 110, 23)",
        // 标签
        tagList: [],
        // 开放要求  保存是的大JSON  { claim: "", type: "", layout: [], term: "" }
        accessRequirement: "",
        controlRule: "",
        // 描述信息
        description: "",
        // 处理方式
        treatment: "风险告警",
        priority: 0,
        probeId: "",
      },
      rules: {
        code: [
          {
            required: true,
            message: "级别编码必填",
          },
        ],
        gradeName: [
          {
            required: true,
            message: "级别名称必填",
          },
        ],
        priority: [
          {
            type: "number",
            required: true,
            message: "优先级必填",
          },
        ],
        probeId: [
          {
            required: true,
            message: "探针必填",
          },
        ],
        tagList: [
          {
            validator: (rule, value, callback) => {
              const only = [...new Set(value)];

              if (only.length === this.formData.tagList.length) {
                callback();
              } else {
                callback(new Error("标签不能重复"));
              }
            },
          },
        ],
      },
      probes: [],

      claimList: ["严禁输出", "满足开放条件", "可以开放"],
      typeList: ["A1-1", "A1-2", "A1-3", "A1-4"],
      layoutList: ["原始数据", "脱敏数据", "标签数据", "群体数据"],

      colorList: [
        "rgb(255, 110, 23)",
        "rgb(255, 217, 0)",
        "rgb(254, 255, 139)",
        "rgb(23, 250, 138)",
        "rgb(77, 238, 52)",
        "rgb(17, 158, 253)",
        "rgb(145, 192, 255)",
        "rgb(161, 116, 255)",
        "rgb(199, 135, 255)",
        "rgb(210, 210, 210)",
      ],
    };
  },
  computed: {
    title() {
      const title = {
        newly: "新增敏感级别",
        edit: "编辑敏感级别",
        examine: "查看敏感级别",
      }[this.dialogType];
      return title;
    },
    tagAddDisabled() {
      const { tagList } = this.formData;

      if (Array.isArray(tagList)) {
        if (tagList.length >= this.TAG_MAX_COUNT) {
          return true;
        } else {
          return tagList.length !== 0 && !tagList[tagList.length - 1];
        }
      }

      return false;
    },
    accessAddDisabled() {
      const len = this.accessList.length;
      return len >= this.ACCESS_MAX_COUNT && len !== 0;
    },
  },
  created() {
    this.getDetail();
    this.getProbes();
  },
  methods: {
    getProbes() {
      this.$request({
        url: "/gov/api/probe/listAll",
        method: "get",
      }).then((res) => {
        this.probes = res;
      });
    },
    async getDetail() {
      if (!this.selectedId) {
        return;
      }
      try {
        this.detailLoading = true;
        const result = await this.$request({
          url: `/gov/api/strategy/grade/detail/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const {
            code,
            // 级别名称
            gradeName,
            // 级别颜色
            gradeColor,
            // 标签
            tagList,
            // 开放要求  保存是的大JSON  { claim: "", type: "", layout: [], term: "" }
            accessRequirement,
            controlRule,
            // 描述信息
            description,
            // 处理方式
            treatment,
            priority,
            probeId,
          } = result;

          this.formData = {
            code,
            // 级别名称
            gradeName,
            // 级别颜色
            gradeColor,
            // 标签
            tagList: Array.isArray(tagList) ? tagList : [],
            // 开放要求  保存是的大JSON  { claim: "", type: "", layout: [], term: "" }
            accessRequirement,
            controlRule,
            // 描述信息
            description,
            // 处理方式
            treatment,
            priority,
            probeId,
          };

          if (accessRequirement) {
            this.accessList = JSON.parse(accessRequirement);
          }
        }
      } catch (e) {
      } finally {
        this.detailLoading = false;
      }
    },
    toAddTag() {
      this.formData.tagList.push("");
    },
    toDeleteTag() {
      this.formData.tagList.pop();
    },
    toAddAccess() {
      this.accessList.push({
        claim: this.claimList[0],
        type: this.typeList[0],
        layout: [this.layoutList[0]],
        term: "",
      });
    },
    toDeleteAccess() {
      this.accessList.pop();
    },
    colorChange(color) {
      this.formData.gradeColor = color;
    },
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let url = "/gov/api/strategy/grade/create";

          if (this.selectedId) {
            url = "/gov/api/strategy/grade/edit";
          }
          try {
            this.formData.accessRequirement = JSON.stringify(this.accessList);

            await this.$request({
              url,
              method: "POST",
              data: this.selectedId
                ? {
                    id: this.selectedId,
                    ...this.formData,
                  }
                : this.formData,
            });

            this.$message.success(`${this.selectedId ? "编辑" : "保存"}成功`);

            this.$emit("after-close", true);
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    closeDialog() {
      this.$emit("update:visible");

      this.$emit("after-close", false);
    },
  },
};
</script>

<style lang="postcss">
.new-data-level-box {
  .tag-box {
    display: flex;
    align-items: center;

    .tag-delete-icon {
      width: 30px;
      flex-shrink: 0;
      text-align: center;
      cursor: pointer;
    }
  }

  .grade-name-box {
    display: flex;

    .el-input {
      & > input {
        border-right: none;
        border-radius: 4px 0 0 4px;
      }
    }

    .color-dropdown {
      flex-shrink: 0;
      cursor: pointer;
      border: 1px solid #ddd;
      height: 28px;
      line-height: 28px;
      padding-left: 5px;
      display: flex;
      align-items: center;
      outline: none;

      .el-dropdown-link {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        .current-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          outline: none;
        }
      }
    }
  }

  .access-box {
    display: flex;
    align-items: center;

    .el-select {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-top: 10px;
}
</style>
