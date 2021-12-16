<template>
  <steps-view-layout v-bind="$attrs">
  </steps-view-layout>
</template>
<script>
import service from './tmpl-service.js'
export default {
  mixins: [service]
}
</script>
