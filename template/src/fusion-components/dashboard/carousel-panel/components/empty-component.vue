<template>
  <div style="width: 100%; height: inherit;">
    <slot></slot>
  </div>
</template>

<script>
// 该组件作用为了避免父组件拿不到children的问题
export default {
  name: 'void-slot-component'
}
</script>
