import module from 'module'
import styles from './styles'
import DataService from 'service/data'

module.directive('pagination', () => ({
  template: `
    <div class="${styles.pagination}" ng-if="currentPage">
      <a
        ng-click="changePage($event, currentPage - 1)"
        ng-class="{'${styles.disabled}': currentPage === ${DataService.MIN_PAGE}}"
        class="fa fa-chevron-left"
      ></a>
      Page {{currentPage}} of {{totalPages}}
      <a
        ng-click="changePage($event, currentPage + 1)"
        ng-class="{'${styles.disabled}': currentPage === totalPages}"
        class="fa fa-chevron-right"
      ></a>
    </div>
  `,
  scope: {
    currentPage: '=',
    totalPages: '='
  },
  link: ($scope) => {
    $scope.changePage = ($event, page) => {
      $event.preventDefault()

      if (page < DataService.MIN_PAGE) {
        page = DataService.MIN_PAGE
      } else if (page > $scope.totalPages) {
        page = $scope.totalPages
      }

      $scope.currentPage = page
    }
  }
}))
