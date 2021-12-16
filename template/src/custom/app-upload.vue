<template>
  <div>
    <el-button :size="size" @click="start">选择文件</el-button>
    <input
      v-show="false"
      ref="fileInput"
      type="file"
      :accept="accept"
      multiple="multiple"
      @change="uploadChange"
    />
    <ul>
      <li v-for="file in files" :key="file.name">{{ file.name }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "IdssUpload",
  props: {
    // element UI input 组件的 size
    size: {
      type: String,
      default: "small",
    },
    // 提交的 url
    url: String,
    // @FIXME 是否允许上传多个文件，根据后台接口 后期调整 再实现
    multiple: Boolean,
    // 允许文件上传的类型
    accept: {
      type: String,
      default: "*",
    },
    // 上传的文件 对应的文件名称
    name: {
      type: String,
      default: "file",
    },
    // 是否隐藏错误提示，为 true 时，上传失败组件不做任何失败显示处理，由调用者自己处理
    hiddenError: Boolean,
    // 其他参数
    data: Object,
  },
  data() {
    return {
      files: [],
      process: "preparing",
    };
  },
  methods: {
    // 触发上传文件
    start() {
      this.$refs.fileInput.click();
    },
    uploadChange() {
      this.files = this.$refs.fileInput.files;
    },
    async submit(url) {
      if (!(this.url || url)) {
        throw new Error("必须指定 url");
      }

      if (this.files.length <= 0) {
        this.$message.error("请先选择一个文件。");
        return Promise.reject(new Error("请先选择一个文件。"));
      }

      if (this.process === "padding") {
        return Promise.resolve();
      }

      this.process = "padding";

      const datas = new FormData();
      // 对 fileList 进行序列化处理 @FIXME 与后台定好多文件上传的规则后再处理
      //  Array.prototype.forEach.call(this.files, data => {
      //    datas.append(data.name, data)
      //  })
      datas.append(this.name, this.files[0]);

      // 处理自定义的参数
      if (this.data) {
        for (let key of this.data) {
          datas.append(key, this.data[key]);
        }
      }

      try {
        const result = await this.$request({
          url: this.url || url,
          method: "post",
          data: datas,
        });

        this.process = "complete";
        this.$message.success("上传成功");
        // 上传完成后，清空之前选择的文件
        this.$refs.fileInput.value = "";
        this.files = [];
        return Promise.resolve(result);
      } catch (e) {
        this.process = "complete";
        !this.hiddenError && this.$message.error("上传失败");
        return Promise.reject(e);
      }
    },
  },
};
</script>
