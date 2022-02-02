module.exports = function (plop) {
  function getFileName(str) {
    return str.toLowerCase().replace(/ /g, '-')
  }

  // create your generators here
  plop.setGenerator('example', {
    description: 'new example in repo',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Example name: ',
      },
      {
        type: 'list',
        name: 'exampleScopeFolder',
        message: 'Scope (Example folder): ',
        choices: [
          { name: 'Edge Functions', value: 'edge-functions' },
          { name: 'Solutions', value: 'solutions' },
        ],
      },
    ],
    actions: function (data) {
      const exampleFolderName = getFileName(data.name)
      return [
        {
          type: 'add',
          path: '{{data.exampleScopeFolder}}/{{exampleFolderName}}/README.md',
          templateFile: 'plop-templates/example/README.md',
        },
      ]
    },
  })
}
