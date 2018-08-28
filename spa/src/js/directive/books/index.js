import module from 'module'
import styles from './styles'
import 'directive/columns'
import 'directive/pagination'
import 'directive/row'
import 'service/data'

module.directive('books', ['dataService', (dataService) => ({
  template: `
    <div class="${styles.books}">
      <h1>Most popular Books of All Time</h1>
      <div columns></div>
      <div
        class="${styles.row}"
        ng-repeat="row in pages[currentPage - 1]"
        row="row"
      ></div>
      <div
        pagination
        current-page="currentPage"
        total-pages="totalPages"
      ></div>
    </div>
  `,
  link: async ($scope, $element, $attr) => {
    try {
      const {
        currentPage,
        pages,
        totalPages
      } = await dataService.loadData()

      $scope.$applyAsync(() => {
        $scope.currentPage = currentPage
        $scope.pages = pages
        $scope.totalPages = totalPages
      })
    } catch (error) {
      console.log(error)
    }
  }
})])
