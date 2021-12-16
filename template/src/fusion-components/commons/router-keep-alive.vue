<template>
  <transition v-bind="transitionAttrs">
    <keep-alive v-bind="bindAttrs">
      <slot></slot>
    </keep-alive>
  </transition>
</template>

<script>
export default {
  name: 'idss-router-keep-alive',
  props: {
    // 默认keep-alive方式获取name进行缓存，false为非name缓存，通过路径进行缓存
    isByName: {
      type: Boolean,
      default: true
    },
    // 是否不缓存路由处理，默认开启缓存
    isNoCache: {
      type: Boolean,
      default: false
    },
    include: {
      type: [Array, RegExp, String]
    },
    exclude: {
      type: [Array, RegExp, String]
    },
    // transition 属性
    transitionAttrs: {
      type: Object,
      default: () => ({
        name: 'fade-transform',
        mode: 'out-in'
      })
    }
  },
  watch: {
    include (list) {
      // 判断通过path进行缓存的处理
      if (!this.isByName) {
        this.$nextTick(() => {
          this.filterCacheVm(list, 'include')
        })
      }
    },
    exclude (list) {
      // 判断通过path进行缓存的处理
      if (!this.isByName) {
        this.$nextTick(() => {
          this.filterCacheVm(list, 'exclude')
        })
      }
    }
  },
  computed: {
    bindAttrs () {
      const res = {}
      // 获取keep-alive绑定属性
      Object.entries(this.$attrs).forEach(([name, value]) => {
        if (['include', 'exclude'].indexOf(name) === -1) {
          res[name] = value
        }
      })
      // 不缓存所有路由处理
      if (this.isNoCache) {
        // 将include设置为空，即不缓存
        res.include = []
      } else if (this.isByName) {
        // 判断以name缓存的时候的处理
        res.include = this.include
        res.exclude = this.exclude
      }
      return res
    }
  },
  methods: {
    /**
     * 筛选缓存中数据
     * @param {array|string|pattern} list 规则数据
     * @param {string} type 操作类型
     */
    filterCacheVm (list, type = 'include') {
      const keepAliveVM = this._vnode.componentInstance._vnode.componentInstance
      if (!keepAliveVM) return
      // 读取keep-alive 数据
      const { cache, keys } = keepAliveVM
      // console.log(cache)
      // 遍历已经缓存数据
      for (const key in cache) {
        // 读取缓存的节点
        const cachedNode = cache[key]
        if (!cachedNode) return
        // 获取当前缓存的key
        const pathKey = cachedNode.data.key
        // include 求非匹配的、exclude求匹配
        let isMath = this._matchesRoute(list, pathKey)
        isMath = type === 'include' ? !isMath : isMath
        // 判断缓存节点是否匹配，当前规则，且非当前激活路由节点
        if (cachedNode && isMath) {
          cachedNode.componentInstance.$destroy()
          cache[key] = null
          delete cache[key]
          // 删除keys中存在的数据
          const index = keys.indexOf(key)
          if (index > -1) {
            keys.splice(index, 1)
          }
        }
      }
    },
    /**
     * 根据当前规则判断路由是否匹配
     * @param {any} pattern 需要匹配的规则
     * @param {name} name 当前路由名称
     * @returns {boolean}
     */
    _matchesRoute (pattern, name) {
      // 判断数组
      if (Array.isArray(pattern)) {
        return pattern.indexOf(name) > -1
      } else if (typeof pattern === 'string') {
        // 判断字符串
        return pattern.split(',').indexOf(name) > -1
      } else if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
        // 判断正则
        return pattern.test(name)
      }
      /* istanbul ignore next */
      return false
    }
  }
}
</script>
