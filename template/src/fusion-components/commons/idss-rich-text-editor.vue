<template>
  <div class="idss-rich-text">
    <!-- 编辑器面板 -->
    <div class="idss-rich-text__editor" ref="richTextEditor" :style="{'height': height}"></div>
    <!-- 文本展示面板 -->
    <div v-if="live" class="idss-rich-text__show" ref="richTextShow"></div>
  </div>
</template>

<script>
import Quill from 'quill/dist/quill'
import 'quill/dist/quill.snow.css'
import { throttle } from '../util/base'

export default {
  name: 'idss-rich-text-editor',
  props: {
    live: {
      type: Boolean,
      default: false
    },
    height: String,
    placeholder: {
      type: String,
      default: '富文本编辑...'
    },
    text: String,
    contents: {
      type: Object,
      default: undefined
    },
    // 是否允许用户编辑
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      lastPositon: undefined
    }
  },
  watch: {
    text (newText) {
      // 清除事件
      this.editor.off('text-change', this.textChange)
      // 获取当前鼠标位置
      const lastPositon = this.editor.getSelection()
      this.editor.setText(newText)
      // 设置文本之后，重新设置鼠标定位位置
      this.editor.setSelection(lastPositon)
      // 继续绑定事件
      this.editor.on('text-change', this.textChange)
    },
    contents (newCon) {
      // 主要用于清空内容
      !newCon && this.editor.setContents(newCon)
    },
    disabled () {
      this.disabledEditor()
    }
  },
  methods: {
    // 初始化富文本编辑器
    initEditor () {
      let toolbarOptions = [
        [{ 'font': [] }],   // 字体
        [{ 'size': [] }],      // 字号
        ['bold', 'italic', 'underline', 'strike'],      // toggled buttons
        [{ 'color': [] }, { 'background': [] }],          // 字体颜色 & 背景颜色
        [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link']
      ]
      let editorOptions = {
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: this.placeholder,
        theme: 'snow'
      }
      let $editorContainer = this.$refs['richTextEditor']
      this.editor = new Quill($editorContainer, editorOptions)
      // 初始化设置文本
      this.text && this.editor.setText(this.text)
      this.contents && this.editor.setContents(this.contents)
      // 设置编辑器是否可编辑
      this.disabledEditor()
      // 监听内容变化
      this._bindEvent()
    },
    // 初始化文本展示
    initShowText () {
      let $textContainer = this.$refs['richTextShow']
      let showOptions = {
        modules: {
          toolbar: false
        },
        readOnly: true
      }
      /* eslint-disable no-new */
      new Quill($textContainer, showOptions)
    },
    // 文本内容变化事件
    textChange: throttle(function () {
      let contents = this.editor.getContents()
      let text = this.editor.getText()
      this.$emit('update:contents', contents)
      this.$emit('update:text', text)
      this.editor.focus()
    }, 300, 300),

    // 绑定事件
    _bindEvent () {
      // 监听内容变化
      this.editor
        .off('text-change', this.textChange)
        .on('text-change', this.textChange)
    },
    // 设置编辑器是否可编辑
    disabledEditor () {
      this.editor.enable(!this.disabled)
    }
  },
  mounted () {
    this.initEditor()
    this.live && this.initShowText()
  }
}
</script>

<style lang="postcss" scoped>
.idss-rich-text {
  display: flex;
  flex-wrap: wrap;

  &__editor {
    height: 200px;
    flex-grow: 1;
    flex-shrink: 1;
    max-width: 100%;
    background-color: var(--idss-rich-text-editor-bg, #fff);
  }

  &__show {
    width: 50%;
  }
}
.idss-rich-text >>> .ql-toolbar.ql-snow {
  width: 100%;
  line-height: 1;
}
.idss-rich-text >>> .ql-editor {
  padding: 10px;
  width: inherit;
}
.idss-rich-text >>> .ql-editor strong {
  font-weight: bold;
  font-style: inherit;
}
.idss-rich-text >>> .ql-editor em {
  font-style: italic;
  font-weight: inherit;
}
.idss-rich-text >>> .ql-editor u {
  font-style: inherit;
  font-weight: inherit;
}
</style>
