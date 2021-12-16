<template>
  <el-card shadow="hover" class="info-card">
    <img class="card-icon" src="@/assets/images/u1327.png" />
    <div style="flex: 1">
      <div class="title-box flex-sb-box">
        <span class="title">{{ tempName }}</span>
        <el-switch
          :value="status"
          disabled
          active-text="开"
          active-value="1"
          inactive-text="关"
          inactive-value="0"
        >
        </el-switch>
      </div>
      <div class="content">
        {{ tempDesc }}
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
    },
    tempName: {
      type: String,
    },
    tempDesc: {
      type: String,
    },
  },
};
</script>
<style lang="postcss" scoped>
.info-card {
  >>> .el-card__body {
    display: flex;
    height: 160px;
  }
  .card-icon {
    width: 56px;
    height: 56px;
    margin-right: 20px;
  }

  .title-box {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .title {
    flex: 1;
    word-break: break-all;
    padding-right: 12px;
  }

  .content {
    color: #777;
    font-size: 14px;
    line-height: 22px;
  }

  .normal-style {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>
