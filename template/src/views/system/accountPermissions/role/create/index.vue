<template>
  <el-dialog
    :close-on-click-modal="false"
    class="threaten-content"
    custom
    :title="statusName"
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
        :disabled="isDetail"
        hide-required-asterisk
        size="mini"
        :model="formData"
        label-width="70px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :rules="[
                { required: true, message: '请输入角色名称', trigger: 'blur' },
              ]"
              prop="roleName"
              label="角色名称"
            >
              <!-- 必填项 -->
              <el-input
                v-model="formData.roleName"
                :disabled="!!id"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述">
              <el-input
                v-model="formData.roleDescribe"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <section>
        <!-- 菜单 -->
        <el-tabs v-model="activeName" class="tabs" size="mini">
          <!-- disabled 禁止点击切换，可用数据驱动 -->
          <!-- 查看的时候，可以跳步骤，编辑的时候不可以 -->
          <el-tab-pane
            v-for="(item, index) in menuList"
            :key="item.type"
            :name="item.type"
          >
            <span slot="label">{{ index + 1 }}、{{ item.name }}</span>
            <!--
              disabled：判断详情、编辑
              is：判断当前组件名
              typeName: 组件内title名称，区分 功能名称
              sources: select-tree 组件内的tree数据
              dicts: 索引集类组件的字典项 表名
              disabled-tree-nodes: select-tree组件 禁用节点数据-第一步继承来的节点都会被禁止取消
              clickTypeList: 第二步，需要需要记录用户手动点击的数据
              all-checked-keys: 记录第二步所有数据 half半节点数据 + 选中节点
             -->
            <component
              :is="config[item.type].component"
              :ref="config[item.type].model"
              v-model="formData[config[item.type].model]"
              :disabled="isDetail"
              :type-name="config[item.type].name"
              :type="config[item.type].type"
              :sources="getCurrentSources(item.type)"
              :dicts="severalDicts[config[item.type].type]"
              :click-type-list.sync="clickTypeList"
              :all-checked-keys.sync="allCheckedKeys"
              :disabled-tree-nodes="formData.functionExtend"
              style="height: 304px"
            >
            </component>
          </el-tab-pane>
        </el-tabs>
      </section>
      <!-- 功能菜单展示提示语 -->
      <div v-show="activeName === 'step2'">
        *灰色标记的功能项为继承权限，不可更改
      </div>
    </article>
    <!-- 确定按钮 -->
    <span slot="footer" class="dialog-footer">
      <!-- 编辑 -->
      <template v-if="!isDetail">
        <el-button size="mini" type="primary" @click="handleSaveForm">
          保 存
        </el-button>
        <el-button size="mini" @click="closeDialog"> 取 消 </el-button>
      </template>
      <!-- 查看 -->
      <template v-else>
        <el-button size="mini" @click="closeDialog"> 关 闭 </el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import { getFormPromise } from "@/utils/common.js";
import { config } from "./config";
import service from "./indexService";
export default {
  components: {
    selectTree: () => import("@/views/system/components/selectTree"),
    severalTmp: () => import("@/views/system/components/severalPositionsTmp"),
  },
  mixins: [service],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      default: "",
    },
    //  是否为详情页
    isDetail: {
      type: Boolean,
      default: false,
    },
    // 弹窗标题-目前只有详情需要传参
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      errorStatus: false, // 记录初始化几个接口是否报错，有一个报错，则无法进行保存（仅限编辑）
      // 记录第二步用户点击的数据
      clickTypeList: [],
      // 记录第二步所有数据 half半节点数据 + 选中节点
      allCheckedKeys: [],
      // 每一步的数据源
      sources: {},
      // 字典项--主要为several模板
      severalDicts: {},
      loading: {},
      config: config,
      formData: {
        roleId: "",
        roleName: "",
        roleDescribe: "",
        // 角色继承
        extend: [],
        // 继承来的菜单数据---该数据中包含的数据，在第二步树中都会被禁用，无法取消
        functionExtend: [],
        // 功能
        function: [],
        chs: [],
        // 数仓集
        chCondition: [],
        ess: [],
        // 索引集
        esCondition: [],
      },
      menuList: [
        {
          name: "继承",
          type: "step1",
        },
        {
          name: "功能",
          type: "step2",
        },
        {
          name: "数仓集",
          type: "step3",
        },
        {
          name: "数仓限制",
          type: "step4",
        },
        {
          name: "索引集",
          type: "step5",
        },
        {
          name: "索引集限制",
          type: "step6",
        },
      ],
      activeName: "step1",
    };
  },
  computed: {
    statusName() {
      return this.isDetail ? this.title : this.id ? "编辑" : "新增";
    },
  },
  watch: {
    id: {
      handler(val) {
        val && this.getDetail(val);
      },
      immediate: true,
    },
    /**
     * 监听继承（第一步）数据，数据变化时候，功能（第二步）数据同步变化
     */
    "formData.extend": {
      handler() {
        this.setFunctionData();
      },
      deep: true,
    },
    /**
     * 监听第三步数据变化
     */
    "formData.chs": {
      handler() {
        this.setSeveralPositionData("step3", "step4");
      },
    },
    /**
     * 监听第三步数据变化
     */
    "formData.ess": {
      handler() {
        this.setSeveralPositionData("step5", "step6");
      },
    },
  },
  methods: {
    /**
     * 判断当前tab是否可以跳转
     * 1.表单不通过，则阻止跳转,主要涉及 数仓限制和索引集表单
     */
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");
    },
    /**
     * 获取对应的source列表
     */
    getCurrentSources(type) {
      return this.sources[this.config[type].model] || [];
    },
    /**
     * sources设置-每步的数据源
     * @param {String} step 第几步的数据
     * @param {Array} list 要赋值的list数据
     */
    setCurrentSource(step, list) {
      this.$set(this.sources, this.config[step].model, list);
    },
    /**
     * 获取当前索引的数值 step1--->1
     * @returns {Number}
     */
    getCurrentStepIdx() {
      const _indexName = this.activeName;
      return parseInt(_indexName[_indexName.length - 1]);
    },
    // 获取步骤所对应的formData数据
    getStepModel(step) {
      return this.formData[this.config[step].model];
    },
    /**
     * 继承点击下一步，
     *1.请求接口获取角色继承的列表
     *2.编辑状态下请求第二步的选中的数据，只限于编辑状态❌
     *2----->第一步数据变化时，第二步数据同步变化
     * @returns promise
     */
    async setFunctionData() {
      let res;
      // return new Promise(async (resolve, reject) => {
      try {
        res = await this.$request({
          url: `/gov/api/sys/roles/queryLowFunctionByIds`,
          method: "post",
          data: {
            idList: this.formData.extend,
          },
        });
      } catch (error) {
        this.errorStatus = true;
        // return
      }

      // 当前计算出的继承数组
      res = res || [];
      /**
       * 1历史继承数组，通过比对历史数组和当前返回的数组
       * 2差异化的值即 在第二步中要去除的选项
       * a:[a1,a2,e],b:[b1,b2,e]  第二步数据 :[a1,a2,b1,b2,e,f,g]
       * 去除计算a----> dif:[a1,a2]
       * 第二步值即为[a1,a2,b1,b2,e,f,g]--->[b1,b2,e,f,g]
       */
      let oldExtendArr = JSON.parse(
        JSON.stringify(this.formData.functionExtend)
      );
      // 差异数组---oldExtendArr有值，才有意义
      // oldExtendArr:[]---->difArr:[]
      let difArr = [];
      // 当前extend
      let extendArr = JSON.parse(JSON.stringify(res));
      if (oldExtendArr.length) {
        // 比对 extend oldExtendArr差异，如果extend为空，即oldExtendArr=dif
        difArr = oldExtendArr.filter((item) => !extendArr.includes(item));
        let clickTypeArr = this.clickTypeList;
        // 手动选中的值要保留，不能因为继承角色去除而删除
        // difArr排除掉点选的值
        // 初始 继承角色a:[1，2，3，6] function:[1,2,3,4,6(点选)]
        // 取消a之后----->diff:[1,2,3,6], clickTypeArr:[6]----> [1,2,3]
        // ------>function: [4,6(点选)]
        difArr = difArr.filter((item) => !clickTypeArr.includes(item));
      }
      // 获取继承的菜单，和当前已选的菜单，去重，合并
      // todo---
      // 编辑状态下通过接口获取
      // 当前为新增状态
      // debugger
      let functionArr = Array.from(
        new Set([...res, ...this.formData.function])
      );
      this.formData.function = functionArr.filter(
        (item) => !difArr.includes(item)
      );
      // 存储-继承来的菜单数据，该数据参与第二步禁用
      this.formData.functionExtend = extendArr;
      //   resolve()
      // })
    },
    /**
     * 1.点击下一步时，第三部/第五步的数据传递给第四部/第六步  充当数仓集、索引集字典项
     * 2.第4、6部的数据是3、5的子集，如果4、6表名值在上一步中不存在，则过滤
     * @param  {String} currentStep 当前步 step3
     * @param  {String} nextStep 下一步 step4
     */
    setSeveralPositionData(currentStep, nextStep) {
      // 数仓限制-索引集限制模板
      const tmpObj = {
        tableName: "",
        quickTime: "",
        execute: [],
      };
      // 当前步数据
      let currentList = this.getStepModel(currentStep);
      // 下一步数据
      let nextList = this.getStepModel(nextStep);

      // 下一步临时存储数据--数据改造
      let arr = [];
      // 如果本步无值，则意味着下一步无字典项，也就是数据源必然为空，否则效验无法正常进行
      if (currentList.length) {
        // debugger
        // 过滤下步骤在本步骤数据中不存在的数据
        // 既 下一步数据为本步子集
        arr = nextList.filter((item) => {
          return currentList.indexOf(item.tableName) !== -1;
        });
        // 下步表名字典项是上一步数据
        let dicList = currentList.map((item) => ({
          key: item,
          value: item,
        }));
        // 数仓集有有值，数仓限制没值，则，数仓限制需初始化一个条目
        if (!arr.length) {
          arr = [tmpObj];
        }
        // 赋值下一步字典项值
        this.$set(this.severalDicts, this.config[nextStep].type, dicList);
      } else {
        // 数仓集没值，数仓限制则必没值
        arr = [];
      }
      // 过滤后的下步数据赋值
      this.formData[this.config[nextStep].model] = arr;
    },
    /**
     * 效验第六步表单及当前 角色名称
     * @returns {Boolean} 返回 promise
     */
    /**
     * 效验第表单及当前 角色名称
     * 涉及数仓限制（step4) 索引集限制（step6）主表单（角色名称+描述）
     * 表单效验场景
     * 1.单表单效验  数仓限制tab，索引集限制tab时
     * args = ['step4Form','stop6Form','mainForm'] 按照顺序效验
     * 表单效验通过getFormPromise处理，promise统一走resolve
     * resolve里面判断表单是否效验通过
     * 不通过，则跳转到对应表单（主表单除外）
     * @returns {Boolean} 返回 promise
     */
    handleValidAllFormPromise(...args) {
      if (!args.length) {
        return this.$message.error("请按效验顺序传入要效验的表单");
      }
      // 数据改造，返回resolve
      const mainForm = getFormPromise(this.$refs["form"]); // 主表单
      const step6Form = this.$refs[config["step6"].model][0].handleValidator(); // 索引集限制表单
      const step4Form = this.$refs[config["step4"].model][0].handleValidator(); // 数仓限制表单
      const obj = {
        mainForm: {
          name: "main",
          value: mainForm,
        },
        step4Form: {
          name: "step4",
          value: step4Form,
        },
        step6Form: {
          name: "step6",
          value: step6Form,
        },
      };
      // debugger
      const formList = args.map((item) => obj[item].value);
      return Promise.all(formList).then((res) => {
        const validateResult = res.every((item) => !!item);
        if (validateResult) {
          return true;
        } else {
          // 过滤掉效验成功的表单
          let arr = args.filter((item, _index) => !res[_index] && item);
          // 如果arr中含有主表单，则删除主表单
          arr.includes("mainForm") && arr.splice(arr.indexOf("mainForm"), 1);
          // 如果 arr有数值，则跳转到当前数值对应的nav标签-涉及业务
          arr.length &&
            this.activeName !== obj[arr[0]].name &&
            (this.activeName = obj[arr[0]].name);

          return false;
        }
      });
    },
    /**
     * 保存
     * 1.效验第六步表单
     * 2.数据改造
     */
    async handleSaveForm() {
      if (this.errorStatus && this.id) {
        return this.$message.error("系统内部异常，请关闭弹窗页面并重新打开！");
      }

      let flag = true;
      try {
        let validListForm = ["mainForm", "step4Form", "step6Form"];
        // 判断当前active 是否为 数仓限制（step4） 索引集限制（step6）
        // 如果是的话，当前active 对应的表单 优先效验
        let currentForm = ["step4", "step6"].includes(this.activeName)
          ? this.activeName + "Form"
          : "";
        // 排序，去重
        currentForm &&
          (validListForm = new Set([currentForm, ...validListForm]));
        // 按照顺序效验
        flag = await this.handleValidAllFormPromise(...validListForm);
      } catch (error) {
        flag = false;
      }
      if (!flag) {
        return this.$message.error("表单效验不通过!");
      }
      // 获取第二步数据，主动触发，提高性能
      this.$refs[config["step2"].model][0].getAllCheckedKey();
      // 角色不能继承本身-详情、编辑
      if (this.id && this.formData.extend.includes(this.formData.roleId)) {
        return this.$message.error("角色不能继承自身!");
      }

      // 改造第三部、第五步数据，整合第4、6步
      // let param = Object.assign({}, this.formData)
      // 数仓（3） 数仓集合（4） 索引（5） 索引集（6）
      let { chs, chCondition, ess, esCondition, ...param } = this.formData;
      // several填充数据模板
      const tmpObj = {
        tableName: "",
        quickTime: "",
        execute: [],
      };
      // 索引数据改造
      let chsTmp = chs.map((item) => {
        return (
          chCondition.find((t) => t.tableName === item) ||
          Object.assign({}, tmpObj, {
            tableName: item,
            isInvalid: "yes", // 是否无效-即回显时，第四步不展示
          })
        );
      });
      // 数据仓数据改造
      let essTmp = ess.map((item) => {
        return (
          esCondition.find((t) => t.tableName === item) ||
          Object.assign({}, tmpObj, {
            tableName: item,
            isInvalid: "yes", // 是否无效-即回显时，第六步不展示
          })
        );
      });
      // 第二步function数据需要传half +key 半节点+全节点数据
      param = Object.assign(param, {
        chs: chsTmp,
        ess: essTmp,
        function:
          this.allCheckedKeys ||
          Array.from(new Set([...param.function, ...this.allCheckedKeys])),
      });
      this.save(param);
    },
  },
};
</script>

<style lang="postcss" scoped>
.el-dialog__wrapper {
  &[custom].threaten-content {
    >>> .el-dialog {
      width: 700px;
      .el-dialog__body {
        max-height: 420px;
        overflow-y: auto;
        overflow-x: hidden;
        .editPage {
          color: #3f3f3f;
          .el-form-item--mini.el-form-item {
            margin-bottom: 6px;
          }
          .tabs {
            .el-tabs__item.is-disabled {
              color: #303133;
              cursor: default;
              &.is-active {
                color: #409eff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
