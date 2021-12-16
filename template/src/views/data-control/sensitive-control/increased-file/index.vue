<template>
  <div class="increased-file-container">
    <common-page
      title="涉敏文件"
      :probe-filter-url="probeFilterUrl"
      :filter-option-url="filterOptionUrl"
      :agg-filter-url="aggFilterUrl"
      :agg-count-url="aggCountUrl"
      :list-url="listUrl"
      :export-url="exportUrl"
      :columns="columns"
      :module-code="moduleCode"
      :order="order"
      :list-param="listParam"
      :operate-width="operateWidth"
      :operate-fixed="operateFixed"
      :btn-operates="btnOperates"
      :batch-operates="batchOperates"
    />

    <el-dialog
      :close-on-click-modal="false"
      custom
      width="500px"
      title="修改敏感信息"
      :visible="visible"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      class="extend-attr-dialog"
      @close="closeDialog"
    >
      <div v-loading="loadingDetail" class="increased-field-box">
        <el-form
          ref="form"
          size="mini"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="敏感数据分类:" prop="senType">
            <el-select v-model="formData.senType" style="width: 100%">
              <el-option
                v-for="classify of classifyList"
                :key="classify.id"
                :value="classify.classify_name"
                :label="classify.classify_name"
                placeholder="请输入敏感数据分类"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="敏感数据分级:" prop="senLevel">
            <el-select v-model="formData.senLevel" style="width: 100%">
              <el-option
                v-for="level of levelList"
                :key="level.id"
                :value="level.gradeName"
                :label="level.gradeName"
                placeholder="请输入敏感数据分级"
              ></el-option>
            </el-select>
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
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable no-empty */
import CommonPage from "../common-page/index.vue";

export default {
  name: "IncreasedFile",
  components: {
    CommonPage,
  },
  data() {
    return {
      order: {
        orderType: "",
        orderField: "createTime",
      },
      moduleCode: "increasedFile",
      probeFilterUrl: "/gov/api/common/page/filter/increasedFile",
      filterOptionUrl: "/gov/api/common/filter/value/increasedFile/{code}",

      aggFilterUrl: "/gov/api/common/agg/filter/increasedFile",
      aggCountUrl: "/gov/api/data/increasedFile/agg",
      listUrl: "/gov/api/data/increasedFile/page",
      exportUrl: "/gov/api/data/increasedFile/export",
      listParam: {
        // 是否涉敏 0-非涉敏 1-涉敏 2-未知
        isSen: ["1"],
        // 0：例外，1：非例外
        isNormal: null,
      },
      columns: [
        {
          name: "数据资源名称",
          code: "name",
          sortable: false,
          width: 110,
          checked: true,
          disabled: true,
        },
        {
          name: "IP地址",
          code: "ip",
          sortable: "custom",
          width: 100,
          checked: true,
          disabled: true,
        },
        {
          name: "端口",
          code: "port",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "类型",
          code: "type",
          sortable: "custom",
          checked: true,
        },
        {
          name: "所在网络域",
          code: "netDistrictName",
          sortable: false,
          width: 110,
          checked: true,
        },
        {
          name: "所属部门",
          code: "deptName",
          sortable: false,
          checked: true,
        },
        {
          name: "所属业务系统",
          code: "businessSystem",
          sortable: false,
          width: 120,
          checked: true,
        },
        {
          name: "发现时间",
          code: "createTime",
          sortable: "custom",
          width: 160,
          checked: true,
          disabled: true,
        },
        {
          name: "目录",
          code: "fileDir",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "文件名",
          code: "fileName",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "涉敏级别",
          code: "senLevel",
          sortable: false,
          checked: true,
        },
        {
          name: "涉敏分类",
          code: "senType",
          sortable: false,
          checked: true,
        },
        {
          name: "涉敏特征",
          code: "aimElementName",
          sortable: false,
          checked: true,
        },
        {
          name: "识别方式",
          code: "discernmentType",
          sortable: false,
          checked: true,
        },
        {
          name: "是否例外",
          code: "isNormal",
          sortable: false,
          checked: true,
          formatter: (val) => {
            return val === "0" ? "是" : "否";
          },
        },
        {
          name: "样例数据",
          code: "sampleData",
          sortable: false,
          checked: true,
        },
      ],

      operateWidth: 130,
      operateFixed: "right",
      btnOperates: [
        {
          handler: (row, cb) => {
            this.$confirm("确定是否将选中的数据取消例外", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(async () => {
                try {
                  await this.$request({
                    url: "/gov/api/data/increasedFile/transferNormal",
                    method: "POST",
                    data: {
                      ids: [row.id],
                      isNormal: "1",
                    },
                  });

                  this.$message.success("操作成功");
                  cb && cb();
                } catch (e) {}
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          },
          title: "取消例外",
          visibleShow: ({ isNormal }) => isNormal === "0",
        },
        {
          handler: (row, cb) => {
            this.$confirm("确定是否将涉敏字段转例外", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(async () => {
                try {
                  await this.$request({
                    url: "/gov/api/data/increasedFile/transferNormal",
                    method: "POST",
                    data: {
                      ids: [row.id],
                      isNormal: "0",
                    },
                  });

                  this.$message.success("操作成功");
                  cb && cb();
                } catch (e) {}
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          },
          visibleShow: ({ isNormal }) => isNormal === "1",
          title: "转例外",
        },
        {
          handler: (row, cb) => {
            const { id, senTypeId, senType, senLevelId, senLevel } = row;
            this.visible = true;

            /*
            const { classifyList, levelList } = this;
            let tempSenTypeId = senTypeId;
            let tempSenType = senType;
            if (Array.isArray(classifyList)) {
              const index = classifyList.findIndex(
                ({ id }) => id === senTypeId
              );

              if (index === -1) {
                tempSenTypeId = "";
                tempSenType = "";
              }
            }

            let tempSenLevelId = senLevelId;
            let tempSenLevel = senLevel;
            if (Array.isArray(levelList)) {
              const index = levelList.findIndex(({ id }) => id === senLevelId);

              if (index === -1) {
                tempSenLevelId = "";
                tempSenLevel = "";
              }
            }

            this.formData = {
              senTypeId: tempSenTypeId,
              senType: tempSenType,
              senLevelId: tempSenLevelId,
              senLevel: tempSenLevel,
            };
            */
            this.formData = {
              senTypeId,
              senType,
              senLevelId,
              senLevel,
            };

            this.ids = [id];
            this.cb = cb;
          },
          title: "修改",
        },
      ],

      batchOperates: [
        {
          title: "批量转例外",
          handler: (ids, cb) => {
            if (ids.length === 0) {
              this.$message.warning("请选择数据");

              return;
            }
            this.$confirm("确定是否将选中的涉敏字段转例外", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(async () => {
                try {
                  await this.$request({
                    url: "/gov/api/data/increasedFile/transferNormal",
                    method: "POST",
                    data: {
                      ids,
                      isNormal: "0",
                    },
                  });

                  this.$message.success("操作成功");
                  cb && cb();
                } catch (e) {}
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          },
        },
        {
          title: "批量修改",
          handler: (ids, cb) => {
            if (ids.length === 0) {
              this.$message.warning("请选择数据");

              return;
            }

            this.visible = true;

            this.ids = ids;
            this.cb = cb;
          },
        },
      ],

      visible: false,
      loadingDetail: false,
      formData: {
        senTypeId: "",
        senType: "",
        senLevelId: "",
        senLevel: "",
      },
      rules: {
        senTypeId: [
          {
            required: true,
            message: "请输入敏感数据分类",
          },
        ],
        senLevelId: [
          {
            required: true,
            message: "请输入敏感数据分级",
          },
        ],
      },
      loading: false,
      ids: [],
      cb: null,

      classifyList: [],
      levelList: [],
    };
  },
  created() {
    this.getSelectList();
  },
  methods: {
    getSelectList() {
      this.getClassifyList();
      this.getLevelList();
    },
    async getClassifyList() {
      const result = await this.$request({
        url: "/gov/api/strategy/classify/listThirdLeveData",
        method: "GET",
      });

      if (Array.isArray(result)) {
        this.classifyList = result;
      }
    },
    async getLevelList() {
      const { list } = await this.$request({
        url: "/gov/api/strategy/grade/list",
        method: "POST",
        data: {
          gradeName: "",
        },
      });

      if (Array.isArray(list)) {
        this.levelList = list;
      }
    },
    classifyIdChange(classifyId) {
      const { classify_name } = this.classifyList.find(
        ({ id }) => id === classifyId
      );

      this.formData.senType = classify_name;
    },
    levelIdChange(levelId) {
      const { gradeName } = this.levelList.find(({ id }) => id === levelId);

      this.formData.senLevel = gradeName;
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.formData = {
        senTypeId: "",
        senType: "",
        senLevelId: "",
        senLevel: "",
      };

      this.visible = false;
      this.ids = [];
      this.cb = null;
    },
    handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            await this.$request({
              url: "/gov/api/data/increasedFile/updateSen",
              method: "POST",
              data: {
                dataIncreasedFileIds: this.ids,
                ...this.formData,
              },
            });

            this.$message.success("修改成功");

            this.cb && this.cb();

            this.closeDialog();
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
