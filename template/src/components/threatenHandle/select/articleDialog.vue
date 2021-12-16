<!--
 * @Author: your name
 * @Date: 2020-06-12 16:21:25
 * @LastEditTime: 2020-06-19 14:31:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/demo/components/threatenHandle/select/newArticalDialog.vue
-->
<template>
  <el-dialog
    custom
    :title="typeTitle"
    append-to-body
    :modal="false"
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
      <el-form ref="form" primary size="mini" :model="formData">
        <el-form-item>
          <el-input v-model="formData.text" maxlength="1000" type="textarea">
          </el-input>
        </el-form-item>
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 文本
    content: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: [String],
      default: "",
    },
  },
  data() {
    return {
      loading: {},
      formData: {
        text: this.content,
      },
    };
  },
  computed: {
    typeTitle() {
      return this.type === "edit" ? "编辑说明模版" : "新建说明模版";
    },
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");
    },
    handleSaveForm() {
      this.$emit("handleEditContent", this.formData.text);
      this.closeDialog();
    },
  },
};
</script>

<style scoped lang="postcss">
>>.el-dialog__body {
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
