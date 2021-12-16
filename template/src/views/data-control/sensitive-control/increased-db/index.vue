<template>
  <div class="increased-db-container">
    <common-page
      title="涉敏库"
      :probe-filter-url="probeFilterUrl"
      :filter-option-url="filterOptionUrl"
      :agg-filter-url="aggFilterUrl"
      :agg-count-url="aggCountUrl"
      :list-url="listUrl"
      :export-url="exportUrl"
      :columns="columns"
      :module-code="moduleCode"
      :order="order"
    />
  </div>
</template>

<script>
import CommonPage from "../common-page/index.vue";

export default {
  name: "IncreasedDb",
  components: {
    CommonPage,
  },
  data() {
    return {
      order: {
        orderType: "",
        orderField: "createTime",
      },
      moduleCode: "increasedDB",
      probeFilterUrl: "/gov/api/common/page/filter/increasedDB",
      filterOptionUrl: "/gov/api/common/filter/value/increasedDB/{code}",

      aggFilterUrl: "/gov/api/common/agg/filter/increasedDB",
      aggCountUrl: "/gov/api/data/increasedDB/agg",
      listUrl: "/gov/api/data/increasedDB/page",
      exportUrl: "/gov/api/data/increasedDB/export",
      columns: [
        {
          name: "数据资源名称",
          code: "name",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "IP地址",
          code: "ip",
          sortable: "custom",
          checked: true,
          disabled: true,
        },
        {
          name: "端口",
          code: "port",
          sortable: false,
          checked: true,
        },
        {
          name: "类型",
          code: "type",
          sortable: "custom",
          checked: true,
          disabled: true,
        },
        {
          name: "所在网络域",
          code: "netDistrictName",
          sortable: false,
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
          name: "数据库",
          code: "dbName",
          sortable: false,
          checked: true,
          disabled: true,
        },
      ],
    };
  },
};
</script>
