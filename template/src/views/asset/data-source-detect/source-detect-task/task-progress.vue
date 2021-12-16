<template>
  <div class="container">
    <TaskInfo :task-id="taskId" style="margin-bottom: 15px" :data="data" />
    <ProgressCard
      :task-id="taskId"
      style="margin-bottom: 15px"
      :data="data"
      @operate="getData"
    />
    <ProgressTable :task-id="taskId" :data="data.assets" />
  </div>
</template>
<script>
import { getTaskProgress } from "./api";
import TaskInfo from "./components/task-info";
import ProgressCard from "./components/progress-card";
import ProgressTable from "./components/progress-table";
export default {
  components: {
    TaskInfo,
    ProgressCard,
    ProgressTable,
  },
  props: {
    taskId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data: {
        assets: [],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getTaskProgress(this.taskId).then((res) => {
        this.data = res;
      });
    },
  },
};
</script>
<style lang="postcss" scoped>
.container {
  padding: 10px 15px;
  .idss-font--title {
    font-size: var(--font-size-16);
    margin-bottom: 10px;
  }

  >>> .page-header .title {
    min-width: 112px;
  }
}
</style>
