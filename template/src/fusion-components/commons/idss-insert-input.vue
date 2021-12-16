<template>
  <div class="idss-insert-input">
    <!-- 自动补全 -->
    <template v-if="type === 'autocomplete'">
      <el-autocomplete v-bind='$attrs' ref='input' v-model="text" v-on="$listeners" style="width: 100%;"></el-autocomplete>
    </template>
    <!-- 普通文本框 -->
    <template v-else>
      <el-input :type="type" v-bind='$attrs' ref='input' v-model="text" v-on="$listeners" style="width: 100%;"></el-input>
    </template>
  </div>
</template>

<script>
import ElInput from 'element-ui/lib/input.js'
import ElAutocomplete from 'element-ui/lib/autocomplete.js'
import 'element-ui/lib/theme-chalk/autocomplete.css'
import 'element-ui/lib/theme-chalk/input.css'
export default {
  name: 'idss-insert-input',
  components: {
    ElInput,
    ElAutocomplete
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'input'
    }
  },
  data () {
    return {
      text: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newT) {
        this.text = newT
      }
    }
  },
  methods: {
    /**
     * 插入文本，主要获取上次文本历史位置，然后拼接文本
     * @param {string} text
     */
    insertText (text) {
      const parentDom = this.$refs['input'].$el
      const input = parentDom.querySelector('input') || parentDom.querySelector('textarea')
      if (!input) return
      let scrollPos = input.scrollTop
      let pos = 0
      // 获取浏览器
      const browser = ((input.selectionStart || input.selectionStart === '0')
        ? 'ff'
        : (document.selection ? 'ie' : false))
      if (browser === 'ie') {
        input.focus()
        const range = document.selection.createRange()
        range.moveStart('character', -input.value.length)
        pos = range.text.length
      } else if (browser === 'ff') {
        pos = input.selectionStart
      }
      const front = (input.value).substring(0, pos)
      const back = (input.value).substring(pos, input.value.length)
      this.text = `${front}${text}${back}`
      this.$emit('input', this.text)
      this.$nextTick(() => {
        pos = pos + text.length
        if (browser === 'ie') {
          input.focus()
          const range = document.selection.createRange()
          range.moveStart('character', -input.value.length)
          range.moveStart('character', pos)
          range.moveEnd('character', 0)
          range.select()
        } else if (browser === 'ff') {
          input.selectionStart = pos
          input.selectionEnd = pos
          input.focus()
        }
        input.scrollTop = scrollPos
      })
    }
  }
}
</script>
<style scoped>
  .idss-insert-input {
    display: inline-block;
  }
</style>
