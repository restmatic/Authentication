/**
 * @file StrategyLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Authentication
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Authentication
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {each, map, get, isFunction, reduce, fromPairs, toPairs} from 'lodash/fp'
import {CreatePlugin} from '@pomegranate/plugin-tools'


const tsGenerator = `// Generated by the Pomegranate cli on {{creationDate}}

// name: {{name}}

export const PassportStrategy = (Controllers) => {
  // Return a Passport Strategy
}
`

export const StrategyLoaderPlugin = CreatePlugin('action')
  .configuration({
    name: 'Strategies',
    depends: ['@restmatic/AuthenticationCore'],
    optional: ['@restmatic/Controllers']
  })
  .directories([{prop: 'main', path: '.'}])
  .hooks({
    load: async (Injector, PluginLogger, PluginFiles, Authentication) => {
      let strategies = await PluginFiles('main').fileList({ext: '.js'})
      let loadedCount = 0

      each((file) => {
        let required = require(file.path)
        let fileName = file.getBaseName()
        let mw = get('PassportStrategy', required)
        if (!mw) {
          throw new Error(`Strategy file ${fileName} does not contain an export on the PassportStrategy property.`)
        }
        if (!isFunction(mw)) {
          throw new Error(`Strategy file ${fileName} does not export an injectable function on the PassportStrategy property.`)
        }
        let injectedStrategy = Injector.inject(mw)
        PluginLogger.log(`Adding ${injectedStrategy.name} authentication strategy.`)
        loadedCount += 1
        Authentication.use(injectedStrategy)
      }, strategies)

      PluginLogger.log(`${loadedCount} strategies added.`)
      return null
    }
  })
  .commands(function (PomConfig, PluginFiles, Handlebars) {
    return (yargs) => {
      return yargs
        .usage('usage: $0')
        .command({
          command: 'generate <name>',
          aliases: 'g',
          describe: `Generates Strategy file <name>`,
          builder: (yargs) => {
            return yargs
              .positional('name', {
                describe: 'The the filename to be created.',
                default: 'index',
                type: 'string'
              })
              .option('l', {
                alias: 'language',
                describe: 'Generate TypeScript or Javascript',
                default: 'ts',
                choices: ['ts'],
                type: 'string'
              })
              .option('force', {
                alias: 'f',
                default: false,
                describe: 'overwrites the specified file if it exists.',
                type: 'boolean'
              })
          },
          handler: async (argv) => {
            let Pf = PluginFiles('main')
            let file = `${argv.name}.${argv.language}`
            let exists = await Pf.projectFileExists(file)
            let compile = Handlebars.compile(tsGenerator)
            let compiled = compile({creationDate: new Date().toDateString(), name: argv.name})

            if (exists && !argv.force) {
              throw new Error(`${file} \n exists \n Rerun with --force to overwrite.`)
            }
            await Pf.outputProjectFile(file, compiled)
            console.log(`Created @restmatic/authentication Strategy file ${file}`)
          }
        })
        .help()
    }
  })