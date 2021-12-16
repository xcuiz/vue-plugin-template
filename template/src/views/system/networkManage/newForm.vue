<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="network-manage-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="network-manage-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="网络域名称" prop="name">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.name"
              placeholder="请输入网络域名称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="物理位置" prop="ipLocationId">
          <div v-if="type !== 'detail'">
            <idss-select-tree
              v-model="formData.ipLocationId"
              size="mini"
              node-key="code"
              :data="options.locationIdList"
              :tree="{
                'default-expand-all': true,
              }"
              :props="{
                label: 'name',
                children: 'children',
              }"
            >
            </idss-select-tree>
          </div>
          <span v-else>{{ formData.ipLocation }}</span>
        </el-form-item>
        <el-form-item label="ip范围" prop="ipSection">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.ipSection"
              placeholder="可以输入多个以换行分隔的ip/IP段"
              maxlength="255"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.ipSection }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="netDescribe">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.netDescribe"
              placeholder="请输入备注"
              maxlength="255"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.netDescribe }}</span>
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

      formData: {
        name: "",
        netDescribe: "",
        ipSection: "",
        ipLocationId: "",
        locationName: "",
      },

      options: {
        locationIdList: [],
      },

      rules: {
        ipSection: [
          {
            required: true,
            message: "ip范围必填",
          },
        ],
        name: [
          {
            required: true,
            message: "网络域名称必填",
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

      return map[this.type] + "网络域";
    },
  },
  created() {
    this.getDetail();
    this.getSelectOptions();
  },
  methods: {
    async getDetail() {
      if (!this.selectedId) {
        return;
      }

      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/asset/netdistrict/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          this.formData = _.pick(result, [
            "name",
            "netDescribe",
            "ipSection",
            "ipLocationId",
            "ipLocation",
          ]);
        }
      } catch (e) {
        //
      } finally {
        this.loadingDetail = false;
      }
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    async handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { type, formData, selectedId } = this;
          this.loading = true;

          const { name, netDescribe, ipSection, ipLocationId } = formData;

          let url = "/gov/api/asset/netdistrict/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/asset/netdistrict/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                name,
                netDescribe,
                ipSection,
                ipLocationId,
              },
            });

            this.$message.success(`${msg}网络域成功`);
            this.$emit("after-close");
          } catch (e) {
            //
          } finally {
            this.loading = false;
          }
        }
      });
    },
    getSelectOptions() {
      const types = ["locationIdList"];
      types.forEach((type) => {
        this.$request({
          method: "get",
          url: `/gov/api/probe/getSelect/${type}`,
        }).then((res) => {
          this.$set(this.options, type, res);
        });
      });
    },
  },
};
</script>
