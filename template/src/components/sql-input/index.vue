<!--
 * @Author: yincheng
 * @Date: 2021-08-11 10:06:44
 * @LastEditors: yincheng
 * @LastEditTime: 2021-08-11 14:30:35
-->
<template>
  <div class="sql-input">
    <textarea
      id="sql-code-mirror"
      ref="textarea"
      class="sql-input-content"
    ></textarea>
  </div>
</template>

<script>
import codemirror from "@/components/_source/codemirror";

export default {
  name: "SqlInput",
  props: {
    value: String,
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editor: null,
      flag: false,
    };
  },
  watch: {
    value: {
      async handler(value) {
        if (!value) {
          return;
        }
        if (!this.flag) {
          await this.$nextTick();
          this.editor.setValue(value);
          this.editor.setCursor(this.editor.lineCount(), 0);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.initEditor();
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.closeHint();
      this.editor.toTextArea();
      this.editor = null;
    }
  },
  methods: {
    initEditor() {
      // editor
      this.editor = codemirror("sql-code-mirror", {
        mode: "sql",
        readOnly: false,
        theme: "gpl-theme",
      });

      this.keypress = () => {
        this.editor.showHint({
          completeSingle: false,
        });
      };

      // Monitor keyboard
      this.editor.on("keypress", this.keypress);
      this.editor.on("change", (e) => {
        this.$emit("input", e.getValue());
        this.flag = true;
        this.$nextTick(() => {
          this.flag = false;
        });
      });
    },
    setValue(val) {
      // console.log(val)
      this.editor.setValue(val);
      this.editor.setCursor(this.editor.lineCount(), 0);
    },
  },
};
</script>

<style scoped lang="postcss">
.sql-input {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  .sql-input-content {
    outline: none;
    width: 100%;
    height: 100%;
    min-height: 28px;
    border: none;
  }
  >>> .CodeMirror {
    /* border: 1px solid #eee; */
    height: auto;
    min-height: inherit;
    /* .CodeMirror-scroll {
      height: auto;
      overflow-y: hidden;
      overflow-x: auto;
    } */
  }
}
</style>
