import autobind from 'autobind-decorator' // eslint-disable-line
import Schema from 'validate'

@autobind
class Route {
  static STATE_FINISHED = 'finished'
  static STATE_PENDING = 'pending'

  static TYPE_EXPORT_EPUB = 'epub'
  static TYPE_EXPORT_EVERNOTE = 'evernote'
  static TYPE_EXPORT_PDF = 'pdf'
  static TYPE_EXPORT_WATTPAD = 'wattpad'
  static TYPE_EXPORT_WORD = 'word'
  static TYPE_IMPORT = 'import'

  static TIMEOUTS = {
    [Route.TYPE_EXPORT_EPUB]: 10,
    [Route.TYPE_EXPORT_PDF]: 25,
    [Route.TYPE_IMPORT]: 60
  }

  static EXPORT_SCHEMA = new Schema({
    bookId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [Route.TYPE_EXPORT_EPUB, Route.TYPE_EXPORT_PDF]
    }
  })

  static IMPORT_SCHEMA = new Schema({
    bookId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [Route.TYPE_EXPORT_WORD, Route.TYPE_EXPORT_PDF, Route.TYPE_EXPORT_WATTPAD, Route.TYPE_EXPORT_EVERNOTE]
    },
    url: {
      type: String,
      required: true
    }
  })

  exportJobs = []

  importJobs = []

  getExport (req, res) {
    res.json(this.exportJobs)
  }

  postExport (req, res) {
    const { body } = req
    const errors = Route.EXPORT_SCHEMA.validate(body)

    if (errors.length) {
      return this.error(res, errors)
    }

    if (body.type === Route.TYPE_EXPORT_EPUB) {
      this.createJobExportEPub(body)
    } else {
      this.createJobExportPDF(body)
    }

    res.sendStatus(200)
  }

  getImport (req, res) {
    res.json(this.importJobs)
  }

  postImport (req, res) {
    const { body } = req
    const errors = Route.IMPORT_SCHEMA.validate(body)

    if (errors.length) {
      return this.error(res, errors)
    }

    this.createJobImport(body)
    res.sendStatus(200)
  }

  createJobImport (payload) {
    this.createJob(Route.TYPE_IMPORT, payload)
  }

  createJobExportEPub (payload) {
    this.createJob(Route.TYPE_EXPORT_EPUB, payload)
  }

  createJobExportPDF (payload) {
    this.createJob(Route.TYPE_EXPORT_PDF, payload)
  }

  createJob (type, payload) {
    const jobs = type === Route.TYPE_IMPORT ? this.importJobs : this.exportJobs
    const index = jobs.push({
      ...payload,
      state: Route.STATE_PENDING,
      created_at: Date.now()
    }) - 1

    setTimeout(() => {
      jobs[index] = {
        ...jobs[index],
        state: Route.STATE_FINISHED,
        updated_at: Date.now()
      }
    }, Route.TIMEOUTS[type] * 1000)
  }

  error (res, errors) {
    res
      .status(400)
      .json(errors.map(({ message }) => message))
  }
}

export default Route
