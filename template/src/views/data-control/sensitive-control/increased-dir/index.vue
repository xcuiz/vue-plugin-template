<template>
  <div class="increased-dir-container">
    <common-page
      title="涉敏目录"
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
  name: "IncreasedDir",
  components: {
    CommonPage,
  },
  data() {
    return {
      order: {
        orderType: "",
        orderField: "createTime",
      },
      moduleCode: "increasedDir",
      probeFilterUrl: "/gov/api/common/page/filter/increasedDir",
      filterOptionUrl: "/gov/api/common/filter/value/increasedDir/{code}",

      aggFilterUrl: "/gov/api/common/agg/filter/increasedDir",
      aggCountUrl: "/gov/api/data/increasedDir/agg",
      listUrl: "/gov/api/data/increasedDir/page",
      exportUrl: "/gov/api/data/increasedDir/export",
      columns: [
        {
          name: "数据资源名称",
          code: "name",
          sortable: false,
          width: 120,
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
        },
        {
          name: "所在网络域",
          code: "netDistrictName",
          sortable: false,
          width: 110,
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
          width: 120,
          checked: true,
        },
        {
          name: "目录",
          code: "fileDir",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "发现时间",
          code: "createTime",
          sortable: "custom",
          width: 160,
          checked: true,
          disabled: true,
        },
      ],
    };
  },
};
</script>
