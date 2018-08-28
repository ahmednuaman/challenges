import angular from 'angular'
import 'angular-sanitize'

export const MODULE_NAME = 'spa'

export const bootstrap = () => angular.bootstrap(document, [MODULE_NAME])

export default angular.module(MODULE_NAME, ['ngSanitize'])
