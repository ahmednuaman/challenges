import { mockReq, mockRes } from 'sinon-express-mock'
import sinon from 'sinon'
import test from 'ava'
import Route from 'src/route'

test('POST /import with errors', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      foo: 'bar'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith([
    'bookId is required.',
    'type is required.',
    'url is required.'
  ]))
})

test('POST /import with bookId error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      type: 'pdf',
      url: 'foo'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith(sinon.match.array.contains(['bookId is required.'])))
})

test('POST /import with type error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      url: 'foo'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith(sinon.match.array.contains(['type is required.'])))
})

test('POST /import with url error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'pdf'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith(sinon.match.array.contains(['url is required.'])))
})

test('POST /import with bad type error', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'foo',
      url: 'foo'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.status.calledWith(400))
  t.truthy(res.json.calledWith(['type must be either word, pdf, wattpad or evernote.']))
})

test('POST /import with success', (t) => {
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'pdf',
      url: 'foo'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.sendStatus.calledWith(200))
})
