export default function (plop) {
  const transformName = (str) => {
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
          { name: 'Solutions', value: 'solutions' },
          { name: 'Edge Functions', value: 'edge-functions' },
        ],
      },
      {
        type: 'checkbox',
        name: 'options',
        message: 'What options do you like?',
        choices: [
          { name: 'Tailwind CSS', value: 'tailwind', checked: true },
          {
            name: 'Next.js API Routes - Serverless Functions: Hello world',
            value: 'next-api-pages',
            checked: true,
          },
          { name: 'Next.js Middleware Function', value: 'middleware' },

          {
            name: 'Vercel Serverless Functions: Hello world',
            value: 'vercel-api',
          },

          {
            name: 'Vercel.json file',
            value: 'vercel.json',
          },
        ],
      },
    ],
    actions: (data) => {
      const plopExampleName = transformName(data.name)
      const plopPath = `${data.exampleScopeFolder}/${plopExampleName}`

      const filesToAlwaysCopyOver = [
        'README.md',
        'tsconfig.json',
        '.eslintrc.json',
        'next.config.js',
        '.gitignore',
        'next-env.d.ts',
        'package.json',

        'public/favicon.ico',
      ]
      const TailwindFiles = [
        'pages/index.tsx',
        'pages/_app.tsx',
        'postcss.config.js',
        'tailwind.config.js',
      ]

      const actions = []

      // Copy over basic files
      filesToAlwaysCopyOver.forEach((file) => {
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}/${plopExampleName}/${file}`,
          templateFile: `plop-templates/example/${file}`,
        })
      })

      if (data.options.includes('next-api-pages')) {
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}/${plopExampleName}/pages/api/hello.ts`,
          templateFile: `plop-templates/example/pages/api/hello.ts`,
        })
      }

      if (data.options.includes('middleware')) {
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}/${plopExampleName}/pages/_middleware.ts`,
          templateFile: `plop-templates/example/pages/_middleware.ts`,
        })
      }

      if (data.options.includes('tailwind')) {
        // Tailwind files
        TailwindFiles.forEach((file) => {
          actions.push({
            type: 'add',
            path: `{{exampleScopeFolder}}/${plopExampleName}/${file}`,
            templateFile: `plop-templates/example/${file}`,
          })
        })

        // modify _app.tsx
        actions.push({
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/pages/_app.tsx`,
          pattern: /(-- PLOP PATH HERE --)/gi,
          template: `${plopPath}`,
        })
        actions.push({
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/pages/_app.tsx`,
          pattern: /(-- PLOP TITLE HERE --)/gi,
          template: `${data.name}`,
        })
      } else {
        // add blank index page without tailwind
        actions.push({
          type: 'add',
          path: `{{exampleScopeFolder}}/${plopExampleName}/pages/index.tsx`,
          templateFile: `plop-templates/example/pages/index_blank.tsx`,
        })

        // remove tailind deps
        actions.push({
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/package.json`,
          transform: (fileContents, data) => {
            const packageData = JSON.parse(fileContents)
            const removePackages = ['autoprefixer', 'postcss', 'tailwindcss']
            packageData.devDependencies = Object.keys(
              packageData.devDependencies
            )
              .filter((item) => !removePackages.includes(item))
              .reduce((obj, key) => {
                obj[key] = packageData.devDependencies[key]
                return obj
              }, {})

            return JSON.stringify(packageData, null, 2)
          },
        })
      }

      return [
        ...actions,
        // README.md
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/README.md`,
          pattern: /(-- PLOP TITLE HERE --)/gi,
          template: `${data.name}`,
        },
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/README.md`,
          pattern: /(-- PLOP EXAMPLE NAME HERE --)/gi,
          template: `${plopExampleName}`,
        },
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/README.md`,
          pattern: /(-- PLOP PATH HERE --)/gi,
          template: `${plopPath}`,
        },
        // package.json
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/package.json`,
          pattern: /(-- PLOP EXAMPLE NAME HERE --)/gi,
          template: `${plopExampleName}`,
        },

        // pages/index.tsx
        {
          type: 'modify',
          path: `{{exampleScopeFolder}}/${plopExampleName}/pages/index.tsx`,
          pattern: /(-- PLOP TITLE HERE --)/gi,
          template: `${data.name}`,
        },
      ]
    },
  })
}
