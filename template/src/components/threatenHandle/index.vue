<!--
 * @Author: your name
 * @Date: 2020-06-09 16:03:06
 * @LastEditTime: 2020-06-30 17:04:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/demo/components/threatenHandle/index.vue
-->
<template>
  <el-dialog
    class="threaten-content"
    custom
    :title="`${disposeName}处置`"
    :close-on-click-modal="false"
    :visible="visible"
    @close="closeDialog"
  >
    <article
      v-loading="loading['init']"
      class="editPage"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-form
        ref="form"
        hide-required-asterisk
        primary
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="70px"
      >
        <el-form-item
          prop="surveyState"
          :rules="[{ required: true, message: '请选择调查状态' }]"
          label="调查状态"
        >
          <el-radio-group v-model="formData.surveyState">
            <el-radio
              v-for="(item, index) in surveyStatusList"
              :key="index"
              :disabled="item.disabled"
              :label="item.code"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-if="formData.surveyState === '调查完成'">
          <el-form-item
            prop="surveyResult"
            :rules="[{ required: true, message: '请选择调查结果' }]"
            label="调查结果"
          >
            <el-radio-group v-model="formData.surveyResult">
              <el-radio
                v-for="(item, index) in surveyResultList"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="isThreat"
            prop="surveyResult"
            :rules="[{ required: true, message: '请选择调查结果' }]"
            label="告警处置"
          >
            <el-radio-group v-model="formData.surveyWarn">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-form-item label="处置说明">
          <edit-select v-model="formData.surveyOptin" :page-type="pageType">
          </edit-select>
        </el-form-item>
        <!-- 单条id的时候展示 -->
        <el-row v-if="ids.length === 1">
          <el-form-item label-width="0">
            <el-button type="text" custom @click="handleToggle">
              <i
                :class="[
                  !isSlideDown ? 'el-icon-arrow-right' : 'el-icon-arrow-down',
                ]"
              ></i>
              历史处置记录 ({{ surveyList.length }})
            </el-button>
          </el-form-item>
          <el-collapse-transition>
            <el-form-item v-show="isSlideDown" label-width="100">
              <history-Table :data="surveyList" :show-warn-col="isThreat">
              </history-Table>
            </el-form-item>
          </el-collapse-transition>
        </el-row>
      </el-form>
    </article>
    <!-- 确定按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSaveForm">
        保 存
      </el-button>
      <el-button size="mini" @click="closeDialog"> 取 消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { PAGE_TYPE } from "../common/js/constant";

export default {
  components: {
    editSelect: () => import("./select"),
    historyTable: () => import("./table"),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 威胁ids
    ids: {
      type: Array,
      default: () => ["da821f33-3779-488d-99ae-7587f937acc4"],
    },
    pageType: {
      type: String,
      default: PAGE_TYPE.LIST_THREAT,
    },
  },
  data() {
    return {
      loading: {},
      // 历史处置记录是否展开标识，默认不展开
      isSlideDown: false,
      formData: {
        surveyState: "未调查",
        surveyResult: "确认威胁",
        surveyWarn: "否",
        surveyOptin: "",
      },
      rules: {},
      // 调查状态
      surveyStatusList: [],
      // 调查结果
      surveyResultList: [],
      // 历史记录
      surveyList: [],
    };
  },
  computed: {
    isThreat() {
      return this.pageType === PAGE_TYPE.LIST_THREAT;
    },
    disposeName() {
      return this.isThreat ? "威胁" : "异常";
    },
    api() {
      switch (this.pageType) {
        case PAGE_TYPE.LIST_THREAT:
          return {
            surveystatus: "/gov/api/insight/threat/surveystatus",
            surveyresult: "/gov/api/insight/threat/surveyresult",
            surveystate: "/gov/api/insight/threat/surveystate/",
            surveylist: "/gov/api/insight/threat/surveylist/",
            survey: "/gov/api/insight/threat/survey",
          };
        case PAGE_TYPE.LIST_EXCEPTION:
          return {
            surveystatus: "/gov/api/insight/anomaly/surveystatus",
            surveyresult: "/gov/api/insight/anomaly/surveyresult",
            surveystate: "/gov/api/insight/anomaly/surveystate/",
            surveylist: "/gov/api/insight/anomaly/surveylist/",
            survey: "/gov/api/insight/anomaly/survey",
          };

        default:
          return {};
      }
    },
  },
  watch: {
    ids: {
      handler(val) {
        if (!Array.isArray(val)) {
          return;
        }
        // 多条不展示历史， 调查状态默认置位 调查中
        // 单条 展示历史，且回显id对应的详情信息，如果掉状态非未调查时，则未调查不可选中
        if (val.length > 1) {
          this.formData.surveyState = "";
          this.getSurveyStatus();
        } else if (val.length === 1) {
          this.getDetail();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getSurveyResult();
  },
  methods: {
    // 查询调查状态
    async getSurveyStatus(cb) {
      const res =
        (await this.$request({
          url: this.api.surveystatus,
        })) || [];
      res.map((item) => {
        item.disabled = false;
      });
      this.surveyStatusList = res;
      cb && cb();
    },
    // 查询调查结果
    async getSurveyResult() {
      const res = await this.$request({
        url: this.api.surveyresult,
      });
      this.surveyResultList = res;
    },
    // 单个ids，获取form表单数据，获取历史数据，
    getDetail() {
      // 获取历史
      this.getSurveyList();
      // 调查radios获取结束后，再请求表单数据
      this.getSurveyStatus(this.getFormData);
    },
    // 查看详情数据
    // 如果调查状态 非调查结果，则调查结果disabled
    async getFormData() {
      const res =
        (await this.$request({
          url: this.api.surveystate + this.ids[0],
        })) || {};
      if (res.surveyState !== "未调查") {
        this.surveyStatusList.map((item) => {
          item.code === "未调查" && (item.disabled = true);
        });
      }
      this.formData = Object.assign({}, this.formData, res);
      this.formData.surveyOptin = res.surveyOption;
    },
    // 查看处置记录
    async getSurveyList() {
      // 多条不展示详情，但调查状态不能勾选 调查中
      // 单条展示详情
      // if (this.ids.length === 1) {
      const res = await this.$request({
        url: this.api.surveylist + this.ids[0],
      });
      this.surveyList = res || [];
      // }
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");
    },
    // 历史记录展开收起
    handleToggle() {
      this.isSlideDown = !this.isSlideDown;
    },
    /**
     * 保存
     */
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let param = Object.assign({}, this.formData);
          if (!this.isThreat) {
            param.surveyOption = param.surveyOptin;
            param.anomalyIds = this.ids;
            delete param.surveyOptin;
          } else {
            param.threatIds = this.ids;
          }
          // 非调查完成时，置为空
          if (param.surveyState !== "调查完成") {
            param = Object.assign(param, {
              surveyResult: "",
              surveyWarn: "",
            });
          }
          try {
            const res = await this.$requestAll({
              url: this.api.survey,
              method: "post",
              data: param,
            });
            if (res.status === "success") {
              this.$message.success(res.message);
              this.closeDialog();
            }
          } catch (error) {
            //
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.el-dialog__wrapper {
  &[custom].threaten-content {
    >>> .el-dialog {
      /* width: 700px; */

      .el-dialog__body {
        max-height: 420px;
        overflow-y: auto;
        overflow-x: hidden;

        .editPage {
          color: #3f3f3f;

          >>> .el-form-item__label,
          .el-radio {
            color: #3f3f3f;
          }

          h4 {
            margin-bottom: 20px;
          }

          .passwordContent {
            .header {
              width: 90px;
              padding-right: 12px;
              text-align: right;
              color: #4a90ea;
              font-size: 12px;
              margin-bottom: 5px;
              cursor: pointer;

              >>> .idss-svg-icon {
                fill: var(--color-primary);
              }
            }

            .passwordContainer {
              background: rgb(241, 244, 246);
              padding-top: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
