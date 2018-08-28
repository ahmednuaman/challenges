/* global process */

import _ from 'lodash'
import autobind from 'autobind-decorator' // eslint-disable-line

@autobind
class Operation {
  constructor (operations) {
    this.created = _.get(process.hrtime(), '1')
    this.operations = operations
  }

  static combine (...operationInstances) {
    if (!_.every(operationInstances, (operationInstance) => operationInstance instanceof Operation)) {
      throw new Error('Please provide valid Operation instances')
    }

    const operations =
      operationInstances
        .sort((a, b) => a.created > b.created)
        .reduce((result, operationInstance) => [
          ...result,
          ...operationInstance.operations
        ], [])

    return new Operation(operations)
  }

  apply (string) {
    let cursorPosition = 0

    if (!_.isString(string) || !string.length) {
      throw new Error('Please provide a valid string that is at least 1 character long')
    }

    const str = this.operations.reduce((result, operation) => {
      let moveCursorBy = _.has(operation, 'move') && operation.move

      if (_.has(operation, 'delete')) {
        const deletion = operation.delete

        if (deletion < 0) {
          throw new Error('Please provide a positive integer of characters to delete')
        }

        result = this.splice(result, cursorPosition, deletion)
        moveCursorBy = -deletion
      } else if (_.has(operation, 'insert')) {
        const insertation = operation.insert.split('')

        result = this.splice(result, cursorPosition, 0, insertation)
        moveCursorBy = insertation.length
      }

      cursorPosition = Math.min(string.length, Math.max(0, cursorPosition + moveCursorBy))

      return result
    }, string)

    return str
  }

  splice (string, position, remove, insert = []) {
    const arr = string.split('')

    arr.splice(position, remove, ...insert)

    return arr.join('')
  }
}

export default Operation
