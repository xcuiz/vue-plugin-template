import { generate } from '@ant-design/colors'
export default {
  methods: {
    generate,
    /**
     * hex to rgba
     * @param {string} hex
     * @param {number} opacity 透明度
    */
    colorToRgba (hex, opacity = 1) {
      return `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
    },
    /**
     * 生成唯一id
     * @param {string} param id前缀
    */
    generateId (param) {
      return `${param}-${this._uid || +new Date()}`
    }
  }
}
