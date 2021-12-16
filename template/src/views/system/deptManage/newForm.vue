<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="dept-manage-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="dept-manage-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="部门名称" prop="name">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.name"
              placeholder="请输入部门名称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.shortName"
              placeholder="请输入简称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.shortName }}</span>
        </el-form-item>
        <el-form-item label="部门编码" prop="departCode">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.departCode"
              placeholder="请输入部门编码"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.departCode }}</span>
        </el-form-item>
        <el-form-item label="部门级别" prop="deptLevel">
          <div v-if="type !== 'detail'">
            <el-select
              v-model="formData.deptLevel"
              placeholder="请输入部门级别"
              style="width: 100%"
              @change="levelChange"
            >
              <el-option
                v-for="{ label, value } of levelList"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </div>
          <span v-else>{{ formData.deptLevel }}</span>
        </el-form-item>
        <el-form-item
          v-if="formData.deptLevel !== 1"
          label="父级部门"
          prop="parentId"
        >
          <div v-if="type !== 'detail'">
            <el-select
              v-model="formData.parentId"
              placeholder="请输入父级部门"
              style="width: 100%"
            >
              <el-option
                v-for="{ name, code } of parentList"
                :key="code"
                :label="name"
                :value="code"
              ></el-option>
            </el-select>
          </div>
          <span v-else>{{ parentIdToName(formData.parentId) }}</span>
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.owner"
              placeholder="请输入负责人"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.owner }}</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="ownerMobile">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.ownerMobile"
              placeholder="请输入联系方式"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.ownerMobile }}</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="type !== 'detail'"
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
  name: "NewForm",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: [Number, String],
      default: null,
    },
    type: {
      // add, edit, detail
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,

      loadingDetail: false,

      levelList: [
        {
          label: "一级",
          value: 1,
        },
        {
          label: "二级",
          value: 2,
        },
        {
          label: "三级",
          value: 3,
        },
      ],
      parentList: [],

      formData: {
        name: "",
        shortName: "",
        deptLevel: 1,
        parentId: null,
        departCode: "",
        owner: "",
        ownerMobile: "",
      },

      rules: {
        parentId: [],
        name: [
          {
            required: true,
            message: "部门名称必填",
          },
        ],
        deptLevel: [
          {
            required: true,
            message: "部门级别必填",
          },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      const map = {
        add: "添加",
        edit: "编辑",
        detail: "查看",
      };

      return map[this.type] + "部门";
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      if (!this.selectedId) {
        return;
      }

      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/asset/dept/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const {
            name,
            shortName,
            deptLevel,
            parentId,
            departCode,
            owner,
            ownerMobile,
          } = result;

          this.formData = {
            name,
            shortName,
            deptLevel,
            parentId,
            departCode,
            owner,
            ownerMobile,
          };

          this.getParentLevel(deptLevel);
        }
      } catch (e) {
      } finally {
        this.loadingDetail = false;
      }
    },
    levelChange(val) {
      // 重置父级部门
      this.formData.parentId = null;

      // 一级部门没有父级部门
      if (val === 1) {
        return;
      } else {
        this.$set(this.rules, "parentId", [
          { required: true, message: "请输入父级部门" },
        ]);
      }

      this.getParentLevel(val);
    },
    async getParentLevel(val) {
      try {
        const result = await this.$request({
          url: `/gov/api/asset/dept/level/${val}`,
        });

        if (Array.isArray(result)) {
          this.parentList = result;
        }
      } catch (e) {}
    },
    parentIdToName(val) {
      const { parentList } = this;

      if (Array.isArray(parentList)) {
        const find = parentList.find(({ code }) => val === code);

        if (find) {
          return find.name;
        }
      }

      return "-";
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { type, formData, selectedId } = this;
          this.loading = true;

          const {
            name,
            shortName,
            deptLevel,
            parentId,
            departCode,
            owner,
            ownerMobile,
          } = formData;

          let url = "/gov/api/asset/dept/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/asset/dept/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                name,
                shortName,
                deptLevel,
                parentId,
                departCode,
                owner,
                ownerMobile,
              },
            });

            this.$message.success(`${msg}部门成功`);
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
