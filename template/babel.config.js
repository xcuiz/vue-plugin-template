module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    // "@vue/app",
    // ['@vue/app', { 'modules': 'auto' }]
  ],
  plugins: [
    // "add-module-exports",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
  ],
};
