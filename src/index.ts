/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Authentication
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {each, map, get, isFunction, reduce, fromPairs, toPairs} from 'lodash/fp'
import {CreatePlugin} from '@pomegranate/plugin-tools'
import {AuthCorePlugin} from "./Plugins/AuthCore";
import {StrategyLoaderPlugin} from "./Plugins/StrategyLoader";
import {SerializerLoaderPlugin} from "./Plugins/SerializerLoader";
import {AuthMiddleware} from "./Plugins/AuthMiddleware";
import {AuthSecurity} from "./Plugins/AuthSecurity";


export const Plugin = CreatePlugin('application')
.configuration({
  name: 'Authentication',
})
.applicationPlugins([
  AuthCorePlugin,
  AuthSecurity,
  StrategyLoaderPlugin,
  SerializerLoaderPlugin,
  AuthMiddleware
])