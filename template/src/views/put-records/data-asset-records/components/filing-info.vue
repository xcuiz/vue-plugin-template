<template>
  <el-card>
    <div slot="header">
      <span>备案信息</span>
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
          <td>所属网络域</td>
          <td>{{ data.netdistrictName }}</td>
          <td>所属业务系统</td>
          <td>{{ data.businessSysName }}</td>
        </tr>
        <tr>
          <td>所属部门</td>
          <td>{{ data.deptName }}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>是否纳入4A</td>
          <td>{{ data.include4a === "1" ? "是" : "否" }}</td>
          <td>在线状态</td>
          <td>{{ data.status === "1" ? "在线" : "下线" }}</td>
        </tr>
        <tr>
          <td>系统管理员</td>
          <td>{{ data.adminUser }}</td>
          <td>联系人</td>
          <td>{{ data.adminContact }}</td>
        </tr>
        <tr>
          <td>应用管理员</td>
          <td>{{ data.appUser }}</td>
          <td>联系人</td>
          <td>{{ data.appContact }}</td>
        </tr>
        <tr>
          <td>合作厂商</td>
          <td>{{ data.cooperateVendor }}</td>
          <td>开发厂商</td>
          <td>{{ data.devVendor }}</td>
        </tr>
        <tr>
          <td>备案人</td>
          <td>{{ data.filingUser }}</td>
          <td>备案时间</td>
          <td>{{ data.filingTime }}</td>
        </tr>
      </table>
    </div>
  </el-card>
</template>
<script>
import { getFilinInfo } from "../api";
export default {
  props: {
    filingId: {
      type: [Number, String],
      require: true,
    },
  },
  data() {
    return {
      data: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getFilinInfo(this.filingId).then((res) => {
        this.data = res;
      });
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
