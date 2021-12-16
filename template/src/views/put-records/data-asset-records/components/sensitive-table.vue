<template>
  <div>
    <FileTable
      v-if="mode === 'File'"
      :filing-id="filingId"
      :asset-id="assetId"
      :storage-mode="mode"
    />
    <DbTable
      v-else
      :filing-id="filingId"
      :asset-id="assetId"
      :storage-mode="mode"
    />
  </div>
</template>
<script>
import FileTable from "./file-table";
import DbTable from "./db-table";
export default {
  components: {
    FileTable,
    DbTable,
  },
  props: {
    filingId: {
      type: [Number, String],
      require: true,
    },
    assetId: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      require: true,
    },
  },
};
</script>
