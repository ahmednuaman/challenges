import module from 'module'
import styles from './styles'
import 'directive/ctas'
import 'directive/description'

module.directive('row', () => ({
  template: `
    <div class="${styles.row}">
      <div class="columns">
        <div class="column">
          <div class="${styles.thumbnail}" ng-style="{
            'background-image': 'url({{row.thumbnail}})'
          }"></div>
          <ul class="${styles.info}">
            <li>
              <b>{{row.title}}</b>
            </li>
            <li class="${styles.author}">
              {{row.author}}
            </li>
            <li>
              <a
                ng-show="!showDescription"
                ng-click="showDescription = true"
              >
                Show Description
              </a>
              <a
                ng-show="showDescription"
                ng-click="showDescription = false"
              >
                Hide Description
              </a>
            </li>
          </ul>
        </div>
        <div class="column">
          {{row.published}}
        </div>
        <div class="column">
          {{row.rating}}/10
        </div>
        <div class="column" ctas="row.ctas"></div>
      </div>
      <div
        description="{{row.description}}"
        showing="showDescription"
      ></div>
    </div>
  `,
  scope: {
    row: '='
  }
}))
