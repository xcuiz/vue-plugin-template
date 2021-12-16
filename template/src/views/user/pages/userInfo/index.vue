<!--
 * @Author: your name
 * @Date: 2020-07-31 11:25:38
 * @LastEditTime: 2020-08-27 10:27:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/user/GroupInfo.vue
-->
<template>
  <div class="group-info-container">
    <div class="content">
      <h3 class="idss-font--title idss-container-header">账号信息</h3>
      <el-form label-width="100px" size="small" plain type="text">
        <el-row>
          <el-form-item label="账号名：">
            {{ data.userName }}
          </el-form-item>
          <el-form-item label="角色：">
            {{ data.roleName }}
          </el-form-item>
          <el-form-item label="账号有效期：">
            {{ data.periodFrom }} - {{ data.periodTo }}
          </el-form-item>
          <el-form-item label="所属组织：">
            {{ data.orgName }}
          </el-form-item>
          <el-form-item label="全称：">
            {{ data.realName }}
          </el-form-item>
          <el-form-item label="邮箱：">
            {{ data.email }}
          </el-form-item>
          <el-form-item label="手机号码：">
            {{ data.mobile }}
          </el-form-item>
          <el-form-item label="电话号码：">
            {{ data.telephone }}
          </el-form-item>
        </el-row>
      </el-form>
      <el-button class="btn" type="primary" size="mini" @click="handleClick">
        编辑账号信息
      </el-button>
    </div>
    <edit-user-info-dialog
      v-if="visible"
      :visible.sync="visible"
      :data="data"
    />
  </div>
</template>

<script>
export default {
  components: {
    EditUserInfoDialog: () =>
      import("@/views/user/components/EditUserInfoDialog"),
  },
  data() {
    return {
      // data: {},
      loading: {},
      visible: false,
    };
  },
  computed: {
    data() {
      return this.$store.getters["base/userInfo$$"];
    },
  },
  created() {
    // 请求用户名称
    this.$store.dispatch("base/userInfo$$");
  },
  methods: {
    handleClick() {
      this.visible = true;
    },
  },
};
</script>

<style scoped lang="postcss">
.group-info-container {
  padding: 10px 20px;
  .content {
    padding: 10px 15px 50px;
    background: #ffffff;
    .idss-font--title {
      font-size: var(--font-size-16);
    }
    .el-form[plain][type="text"] {
      padding-top: 10px;
      .el-form-item {
        margin-bottom: 20px;
      }
    }
    .btn {
      margin-top: 10px;
      margin-left: 100px;
    }
  }
}
</style>
