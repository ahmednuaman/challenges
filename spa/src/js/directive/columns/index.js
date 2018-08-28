import module from 'module'
import styles from './styles'

module.directive('columns', () => ({
  template: `
    <div class="${styles.columns} columns">
      <div class="column">Title</div>
      <div class="column">Published</div>
      <div class="column">Rating</div>
      <div class="column">Buy on</div>
    </div>
  `
}))
