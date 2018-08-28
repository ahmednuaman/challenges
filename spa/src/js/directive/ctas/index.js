import module from 'module'
import styles from './styles'

module.directive('ctas', () => ({
  template: `
    <div class="${styles.ctas}">
      <a ng-repeat="(title, href) in ctas" ng-href="href">
        {{title}}
      </a>
    </div>
  `,
  scope: {
    ctas: '='
  }
}))
