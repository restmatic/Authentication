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
import {each, map, get, isFunction, reduce, fromPairs, toPairs, has} from 'lodash/fp'
import {CreatePlugin} from '@pomegranate/plugin-tools'


const tsGenerator = `// Generated by the Pomegranate cli on {{creationDate}}

// name: {{name}}

export const PassportSerializers = (Controllers) => {
  return {
    serializeUser: (user, done) => {
      done(null, user)
    },
    deserializeUser: (user, done) => {
      done(null, user)
    }
  }
}
`

const isFunctionAtPath = (path: string, obj: any): boolean => {
  return isFunction(get(path, obj))
}

export const SerializerLoaderPlugin = CreatePlugin('action')
  .configuration({
    name: 'Serializers',
    depends: ['@restmatic/AuthenticationCore'],
    optional: ['@restmatic/Controllers']
  })
  .directories([{prop: 'main', path: '.'}])
  .hooks({
    load: async (Injector, PluginLogger, PluginFiles, Authentication) => {
      let p = await PluginFiles('main').workingDirectory

      let required = require(p)
      let mw = get('PassportSerializers', required)
      if (!mw) {
        throw new Error(`Serializer file does not contain an export on the PassportSerializers property.`)
      }
      if (!isFunction(mw)) {
        throw new Error(`Serializer file does not export an injectable function on the PassportSerializers property.`)
      }

      let injectedSerializers = Injector.inject(mw)
      if (!isFunctionAtPath('serializeUser', injectedSerializers)) {
        throw new Error(`Serializer must contain function on the serializeUser property.`)
      }

      if (!isFunctionAtPath('deserializeUser', injectedSerializers)) {
        throw new Error(`Serializer file does not export an injectable function on the PassportSerializers property.`)
      }

      Authentication.serializeUser(get('serializeUser', injectedSerializers));
      Authentication.deserializeUser(get('deserializeUser', injectedSerializers));

    }
  })
  .commands(function (PomConfig, PluginFiles, Handlebars) {
    return (yargs) => {
      return yargs
        .usage('usage: $0')
        .command({
          command: 'generate',
          aliases: 'g',
          describe: `Generates Serializer file`,
          builder: (yargs) => {
            return yargs
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
            let file = `index.${argv.language}`
            let exists = await Pf.projectFileExists(file)
            let compile = Handlebars.compile(tsGenerator)
            let compiled = compile({creationDate: new Date().toDateString(), name: 'index.ts'})

            if (exists && !argv.force) {
              throw new Error(`${file} \n exists \n Rerun with --force to overwrite.`)
            }
            await Pf.outputProjectFile(file, compiled)
            console.log(`Created @restmatic/authentication Serializers file ${file}`)
          }
        })
        .help()
    }
  })