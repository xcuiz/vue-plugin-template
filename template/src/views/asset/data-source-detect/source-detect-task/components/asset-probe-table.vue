<template>
  <el-table
    :data="data"
    size="mini"
    stripe
    fit
    highlight-current-row
    style="width: 100%"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-table-column label="资产名称" prop="name" show-overflow-tooltip />
    <el-table-column label="IP地址" prop="ip" show-overflow-tooltip />
    <el-table-column label="端口" prop="port" />
    <el-table-column label="探针" prop="probe">
      <template slot-scope="scope">
        <el-select
          :value="value[scope.row.id]"
          @change="(value) => handleChange(scope.row.id, value)"
        >
          <el-option
            v-for="option in options[scope.row.id] || []"
            :key="option.code"
            :value="option.code"
            :label="option.name"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      label="连通性"
      prop="probeConnectMsg"
      show-overflow-tooltip
    />
  </el-table>
</template>
<script>
import { cloneDeep } from "lodash";
import { getAssetProbe } from "../api";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      options: {},
    };
  },
  watch: {
    data: {
      handler(newVal) {
        const result = cloneDeep(this.value);
        const DEFAULT_PROBE = 0;
        newVal.forEach(({ id }) => {
          if (!this.value[id]) {
            result[id] = DEFAULT_PROBE;
          }
          if (!this.options[id]) {
            this.$set(this.options, id, []);
            getAssetProbe(id).then((res) => {
              this.options[id] = res;
              // this.$set(this.options, id, res);
            });
          }
        });
        this.$emit("input", result);
      },
    },
    deep: true,
  },
  methods: {
    handleChange(id, value) {
      const result = cloneDeep(this.value);
      result[id] = value;
      this.$emit("input", result);
    },
  },
};
</script>
<style lang="postcss" scoped>
>>> th {
  .cell {
    font-weight: normal;
  }
}
</style>
