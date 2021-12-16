<template>
  <div>
    <el-dialog :visible.sync="previewDialog" title="预览" append-to-body>
      <div class="idss-save-pdf">
        <span>选择导出方式:</span>
        <el-radio-group v-model="saveType" @change="typeChanged">
          <el-radio label="original">全图导出</el-radio>
          <el-radio label="pagination">分页导出</el-radio>
          <el-radio label="zoom">缩放导出</el-radio>
        </el-radio-group>
      </div>
      <div style="margin: 10px 0; text-align: center;">
        <el-button size="small" @click="previewClick">预览</el-button>
        <el-button size="small" @click="saveClick">导出</el-button>
        <el-button size="small" @click="cancelClick">取消</el-button>
      </div>
      <div style="height: 800px; width: 100%;" v-loading="iframeLoading">
        <iframe ref="iframe" height="100%" width="100%" frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SavePDF from '../util/toPdf/index.js'
export default {
  name: 'idss-save-pdf',
  props: {
    type: {
      type: String,
      default: 'original'
    }
  },
  data () {
    return {
      // dialog
      previewDialog: false,
      iframeLoading: false,
      // 导出类型
      saveType: this.type,
      // 标记是否预览过了，就不需要再次添加图片了
      isPreview: false,
      // 导出的元素
      el: ''
    }
  },
  methods: {
    // type change 事件
    typeChanged () {
      // type 的 v-model
      this.$emit('input', this.saveType)
      // 类型变了 标记为未预览
      this.isPreview = false
    },
    async previewClick () {
      // 设置pdf导出的类型
      this.pdf.setType(this.saveType)
      this.iframeLoading = true
      // pdf组装添加图片
      await this.pdf.addToPdf()
      // 预览
      this.$refs.iframe.setAttribute('src', this.pdf.output())
      this.iframeLoading = false
      // 标记为已预览
      this.isPreview = true
      this.$emit('preview', this.saveType)
    },
    async saveClick () {
      if (!this.isPreview) {
        this.pdf.setType(this.saveType)
        await this.pdf.addToPdf()
      }
      this.pdf.save()
      this.$emit('save', this.saveType)
    },
    cancelClick () {
      this.previewDialog = false
      this.iframeLoading = false
      // this.$refs.iframe.removeAttribute('src')
    },
    // start
    $start (el, fileName) {
      this.pdf = new SavePDF(el, fileName)
      this.previewDialog = true
    }
  }
}
</script>
