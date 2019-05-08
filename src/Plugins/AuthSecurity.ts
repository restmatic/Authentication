/**
 * @file AuthMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Authentication
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {CreatePlugin} from "@pomegranate/plugin-tools";
import * as ConnectEnsure from 'connect-ensure-login'

export const AuthSecurity = CreatePlugin('merge')
  .configuration({
    name: 'AuthenticationSecurity',
    injectableParam: 'RouteSecurity',
    injectableScope: 'global',
    depends: ['@restmatic/AuthenticationCore', '@restmatic/RouteSecurity'],
    provides: ['@restmatic/Core']
  })
  .hooks({
    load: async (Injector, PluginLogger, PluginVariables, PluginFiles, Authentication) => {
      PluginLogger.log('Creating AuthSecurity methods', 1)
      return {
        ensureLoggedIn: ConnectEnsure.ensureLoggedIn,
        ensureAuthenticated: ConnectEnsure.ensureAuthenticated,
        ensureNotLoggedIn: ConnectEnsure.ensureNotLoggedIn,
        ensureLoggedOut: ConnectEnsure.ensureLoggedOut,
        ensureNotAuthenticated: ConnectEnsure.ensureNotAuthenticated,
        ensureUnauthenticated: ConnectEnsure.ensureUnauthenticated
      }
    }

  })