<!--
 * @Author: your name
 * @Date: 2021-03-08 17:45:34
 * @LastEditTime: 2021-04-27 18:14:23
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\sensitive\resource-claim\components\batch-claim-dialog.vue
-->
<template>
  <el-dialog
    custom
    :close-on-click-modal="false"
    title="批量认领"
    :visible="visible"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <el-row>
      <el-form
        ref="form"
        primary
        size="mini"
        label-width="120px"
        label-suffix=":"
      >
        <el-form-item label="统一负责人参数">
          <el-switch
            active-value="1"
            inactive-value="0"
            active-text="开"
            inactive-text="关"
          ></el-switch>
        </el-form-item>
        <template>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-input
                size="mini"
                maxlength="20"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="联系方式">
              <el-input
                size="mini"
                maxlength="20"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item label="统一认证参数">
            <el-switch
              active-value="1"
              inactive-value="0"
              active-text="开"
              inactive-text="关"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-form-item label="认证方式">
          <el-radio-group>
            <el-radio :label="1">账号密码</el-radio>
            <el-radio :label="2">认证文件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择通用账号">
          <el-select size="mini" placeholder="请选择">
            <!-- <el-option
            v-for="option in options.netdistrictSel"
            :key="option.code"
            :value="option.code"
            :label="option.name"
          ></el-option> -->
          </el-select>
        </el-form-item>
        <template>
          <el-form-item label="负责人">
            <el-input
              size="mini"
              maxlength="20"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input
              size="mini"
              maxlength="20"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "add",
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
