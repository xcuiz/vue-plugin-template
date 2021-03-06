module.exports = {
  prompts: {
    type: {
      type: 'list',
      message: 'Main application or sub application',
      choices: [
        {
          name: 'main',
          value: 'main',
          short: 'main',
        },
        {
          name: 'sub',
          value: 'sub',
          short: 'sub',
        },
      ],
    },
    name: {
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project',
    },
    author: {
      type: 'string',
      message: 'Author',
    },
    router: {
      type: 'confirm',
      message: 'Install vue-router?',
    },
    vuex: {
      type: 'confirm',
      message: 'Install vuex?',
    },
  },
  filters: {
    'src/store/**/*': 'vuex',
    'src/router/**/*': 'router',
    'src/views/example/**/*': 'router'
  },
  completeMessage:
    'To get started:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}yarn install\n  yarn run serve',
}
