/**
 * @file Core
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

import passport from 'passport';

export const AuthCorePlugin = CreatePlugin('anything')
  .configuration({
    name: 'AuthenticationCore',
    injectableParam: 'Authentication',
    provides: ['@restmatic/Core'],
  })
  .hooks({
    load: async (Injector, PluginLogger, PluginFiles) => {
      return passport
    }
  })
