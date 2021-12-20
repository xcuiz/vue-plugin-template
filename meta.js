module.exports = {
  prompts: {
    appType: {
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
    isAddRemote: {
      when: answers => {
        console.log(JSON.stringify(answers))
        return (a) => {
          console.log(JSON.stringify(a))
          return answers['appType'] === 'main'
        }
      },
      type: 'confirm',
      message: 'Add an example remote host?'
    },
    remoteName: {
      when: 'isAddRemote',
      type: 'string',
      message: 'remote project name'
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
    'src/views/example/**/*': 'router',
    'src/views/sub/**/*': 'appType === "sub"'
  },
  completeMessage:
    'To get started:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}yarn install\n  yarn run serve',
}
