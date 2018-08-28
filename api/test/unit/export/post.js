import { mockReq, mockRes } from 'sinon-express-mock'
import test from 'ava'
import Route from 'src/route'

test('POST /export with errors', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      foo: 'bar'
    }
  })
  const res = mockRes()

  route.postExport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith([
    'bookId is required.',
    'type is required.'
  ]))
})

test('POST /export with bookId error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      type: 'pdf'
    }
  })
  const res = mockRes()

  route.postExport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith([
    'bookId is required.'
  ]))
})

test('POST /export with type error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo'
    }
  })
  const res = mockRes()

  route.postExport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith([
    'type is required.'
  ]))
})

test('POST /export with bad type error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'foo'
    }
  })
  const res = mockRes()

  route.postExport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith([
    'type must be either epub or pdf.'
  ]))
})

test('POST /export epub with success', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'epub'
    }
  })
  const res = mockRes()

  route.postExport(req, res)
  t.truthy(res.sendStatus.calledWith(200))
})

test('POST /export pdf with success', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'pdf'
    }
  })
  const res = mockRes()

  route.postExport(req, res)
  t.truthy(res.sendStatus.calledWith(200))
})
