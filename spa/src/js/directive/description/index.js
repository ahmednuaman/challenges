import module from 'module'
import styles from './styles'

module.directive('description', () => ({
  template: `
    <div class="${styles.description}" ng-class="{
      ${styles.showing}: showing
    }">
      <div ng-bind-html="description"></div>
    </div>
  `,
  scope: {
    description: '@',
    showing: '='
  }
}))
