<template>
  <div id="app">
    {{#router}}
    <router-view />
    {{else}}
    <h1>Hello World</h1>
    {{/router}}
  </div>
</template>
