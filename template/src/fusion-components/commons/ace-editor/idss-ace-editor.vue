<template>
  <div class="idss-ace-editor" :style="{height: height, width: width}"></div>
</template>
<script>
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import './ace-dependency.js'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-emmet'
import ElementResizeDetectorMaker from 'element-resize-detector'

const Range = ace.require('ace/range').Range
export default {
  name: 'idss-ace-editor',
  props: {
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    value: {
      type: String,
      default: ''
    },
    // 输入语法模式，默认文本
    mode: {
      type: String,
      default: 'javascript'
    },
    // 编辑器主题，默认chrome
    theme: {
      type: String,
      default: 'chrome'
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 错误列表
    errorList: {
      type: Array,
      default: () => ([])
    },
    // 编辑器参数
    options: {
      type: Object,
      default: () => ({
        // 默认自动补全
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        // emmet 配置
        enableEmmet: true,
        // 是否显示打印边距线
        showPrintMargin: false
        // 自动换行,设置为off关闭
        // wrap: 'free'
      })
    }
  },
  data () {
    return {
      editor: null,
      contentBackup: '',
      errorIds: []
    }
  },
  watch: {
    value (val) {
      if (this.contentBackup !== val) {
        this.editor.session.setValue(val, 1)
        this.contentBackup = val
      }
    },
    theme (newTheme) {
      this.editor.setTheme(`ace/theme/${newTheme}`)
    },
    mode (newMode) {
      this.editor.getSession().setMode(`ace/mode/${newMode}`)
    },
    options (newOption) {
      this.editor.setOptions(newOption)
    },
    height () {
      this.$nextTick(() => {
        this.editor.resize()
      })
    },
    width () {
      this.$nextTick(() => {
        this.editor.resize()
      })
    },
    readOnly (newReadOnly) {
      this.editor.setReadOnly(newReadOnly)
    },

    errorList: {
      immediate: true,
      handler (newList) {
        this.$nextTick(() => {
          if (!this.editor) return
          // 清除原有错误marker
          this.errorIds.forEach(id => {
            this.editor.getSession().removeMarker(id)
          })
          // 清空errorIds
          this.$set(this, 'errorIds', [])
          // 编辑器设置新的错误
          this.editor.getSession().setAnnotations(newList)
          // 设置新的错误marker
          newList.forEach(item => {
            const id = this.editor.getSession().addMarker(
              new Range(item.row, item.column, item.row, item.column + item.markText.length),
              'ace-related-code-highlight',
              'line',
              false
            )
            this.errorIds.push(id)
          })
        })
      }
    }
  },
  methods: {
    /**
     * 更新placeholder
     */
    updatePlaceHolder () {
      // 判断当前是否存在文本，无文本显示占位符
      const placeHolderShow = !this.editor.session.getValue().length
      const node = this.editor.renderer.emptyMessageNode
      if (!placeHolderShow && node) {
        this.editor.renderer.scroller.removeChild(this.editor.renderer.emptyMessageNode)
        this.editor.renderer.emptyMessageNode = null
      } else if (placeHolderShow && !node) {
        // 设置占位符
        this.setPlaceHolder()
      }
    },
    /**
     * 设置占位符
     */
    setPlaceHolder () {
      const node = this.editor.renderer.emptyMessageNode = document.createElement('div')
      node.className = 'ace_invisible ace_emptyMessage'
      node.setAttribute('style', 'white-space: pre; padding: 0 5px')
      node.textContent = this.placeholder
      this.editor.renderer.scroller.appendChild(node)
    },
    /**
     * editor resize 监听
     */
    _resizeEditor () {
      this.elementResizeDetector = ElementResizeDetectorMaker({
        strategy: 'scroll',
        callOnAdd: false
      })
      const container = this.$el
      this.elementResizeDetector.listenTo(container, () => {
        this.editor.resize()
      })
    }
  },
  beforeDestroy () {
    this.elementResizeDetector.uninstall(this.$el)
    this.elementResizeDetector = null
    this.editor.destroy()
    this.editor.container.remove()
    this.editor=null
   
  },
  mounted () {
    this.editor = ace.edit(this.$el)
    // 调用外部初始化init方法，用于获取 mode theme主题等
    this.$emit('init', this.editor)
    this.editor.$blockScrolling = Infinity
    // editor.setOption("enableEmmet", true)
    // 设置语法模式
    this.editor.getSession().setMode(`ace/mode/${this.mode}`)
    // 设置主题
    this.editor.setTheme(`ace/theme/${this.theme}`)
    // 设置编辑器文本
    this.editor.setValue(this.value, 1)
    // 设置编辑器是否可读
    this.editor.setReadOnly(this.readOnly)
    this.contentBackup = this.value
    // 设置默认占位符
    this.updatePlaceHolder()
    // editor resize 监听
    this._resizeEditor()
    this.editor.on('change', () => {
      const content = this.editor.getValue()
      this.$emit('input', content)
      this.contentBackup = content
      // 监听占位符显示
      this.updatePlaceHolder()
    })
    if (this.options) {
      this.editor.setOptions(this.options)
    }
  }
}
</script>
<style scoped lang="postcss">
.idss-ace-editor {
  --ace-editor-wave-color: var(--red-6, #df1722);
  >>> * {
    text-indent: -0.5px;
  }
  >>> .ace-related-code-highlight {
    position: absolute;

    /* wave 波浪线 */
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(
          135deg,
          transparent,
          transparent 35%,
          var(--ace-editor-wave-color),
          transparent 60%,
          transparent 100%
        ),
        linear-gradient(
          45deg,
          transparent,
          transparent 35%,
          var(--ace-editor-wave-color),
          transparent 60%,
          transparent 100%
        );
      background-size: 6px 6px;
    }
  }
}
</style>
