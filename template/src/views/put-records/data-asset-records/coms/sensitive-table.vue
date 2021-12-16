<template>
  <div>
    <FieldTable
      v-if="mode === 'Field'"
      :asset-id="assetId"
      :storage-mode="mode"
      :mode="mode"
    />
    <FileTable v-else :asset-id="assetId" :storage-mode="mode" :mode="mode" />
  </div>
</template>
<script>
import FieldTable from "./field-table.vue";
import FileTable from "./file-table.vue";
export default {
  components: {
    FieldTable,
    FileTable,
  },
  props: {
    assetId: {
      type: [Number, String],
      required: true,
    },
    mode: {
      type: String,
      require: true,
    },
  },
};
</script>
