<template>
  <el-card>
    <div slot="header">
      <span>资产信息</span>
    </div>
    <div>
      <table class="table" border>
        <colgroup>
          <col width="20%" style="text-align: right" />
          <col width="30%" />
          <col width="20%" />
          <col width="30%" />
        </colgroup>
        <tr>
          <td>业务地址</td>
          <td>{{ data.ip }}</td>
          <td>业务端口</td>
          <td>{{ data.port }}</td>
        </tr>
        <tr>
          <td>存储类型</td>
          <td>{{ data.storageMode }}</td>
          <td>存储字类型</td>
          <td>{{ data.assetType }}</td>
        </tr>
        <tr>
          <td>数据库名</td>
          <td>{{ data.dbOrFileName }}</td>
          <td>字符集</td>
          <td>{{ data.charset }}</td>
        </tr>
        <tr height="72">
          <td>备注</td>
          <td>
            {{ data.remark }}
          </td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    filingId: {
      type: [Number, String],
      require: true,
    },
    data: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },
};
</script>
<style lang="postcss" scoped>
.table {
  width: 100%;
  background: #f2f2f2;
  border: 1px solid #fff;
  border-collapse: collapse;
  line-height: 28px;

  tr {
    td {
      padding: 4px 12px;
    }
    td:nth-child(odd) {
      text-align: right;
    }
    td:nth-child(even) {
      text-align: center;
    }
  }
}
</style>
