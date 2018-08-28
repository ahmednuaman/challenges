import _ from 'lodash'
import autobind from 'autobind-decorator' // eslint-disable-line
import module from 'module'

@autobind
class DataService {
  static BOOKS_PER_PAGE = 5
  static MIN_PAGE = 1

  static $inject = ['$http']

  constructor ($http) {
    this.$http = $http
  }

  loadData () {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          data
        } = await this.$http.get('/data.json')

        const currentPage = DataService.MIN_PAGE
        const pages = _.chunk(data, DataService.BOOKS_PER_PAGE)
        const totalPages = pages.length

        resolve({
          currentPage,
          pages,
          totalPages
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.service('dataService', DataService)

export default DataService
