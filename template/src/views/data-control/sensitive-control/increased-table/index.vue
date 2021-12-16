<template>
  <div class="increased-table-container">
    <common-page
      title="涉敏表"
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
  name: "IncreasedTable",
  components: {
    CommonPage,
  },
  data() {
    return {
      order: {
        orderType: "",
        orderField: "createTime",
      },
      moduleCode: "increasedTable",
      probeFilterUrl: "/gov/api/common/page/filter/increasedTable",
      filterOptionUrl: "/gov/api/common/filter/value/increasedTable/{code}",

      aggFilterUrl: "/gov/api/common/agg/filter/increasedTable",
      aggCountUrl: "/gov/api/data/increasedTable/agg",
      listUrl: "/gov/api/data/increasedTable/page",
      exportUrl: "/gov/api/data/increasedTable/export",
      columns: [
        {
          name: "数据资源名称",
          code: "name",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "任务号",
          code: "taskNo",
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
        {
          name: "表",
          code: "tableName",
          sortable: false,
          checked: true,
          disabled: true,
        },
      ],
    };
  },
};
</script>
