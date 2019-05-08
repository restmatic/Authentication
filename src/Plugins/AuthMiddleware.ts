/**
 * @file AuthMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Authentication
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {CreatePlugin} from "@pomegranate/plugin-tools";
export const AuthMiddleware = CreatePlugin('merge')
  .configuration({
    name: 'AuthenticationMiddleware',
    injectableParam: 'Middleware',
    injectableScope: 'namespace',
    depends: ['@restmatic/Core'],
    provides: ['@restmatic/Middleware']
  })
  .hooks({
    load: async (Injector, PluginLogger, PluginVariables, PluginFiles, Authentication) => {
      PluginLogger.log('Creating Authentication Middleware.', 1)
      return {
        authenticationInitialize: Authentication.initialize(),
        authenticationSession: Authentication.session()
      }
    }

  })