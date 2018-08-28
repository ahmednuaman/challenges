import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import Route from './route'

const PORT = 3000

const app = express()
const route = new Route()

app.use(helmet())
app.use(bodyParser.json())

app.get('/export', route.getExport)
app.post('/export', route.postExport)

app.get('/import', route.getImport)
app.post('/import', route.postImport)

app.listen(PORT, () => console.log(`Running on ${PORT}`))
