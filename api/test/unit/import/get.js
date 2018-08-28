import { mockReq, mockRes } from 'sinon-express-mock'
import sinon from 'sinon'
import test from 'ava'
import Route from 'src/route'

test('GET /import', (t) => {
  const clock = sinon.useFakeTimers()
  const route = new Route()
  const req = mockReq({
    body: {
      bookId: 'foo',
      type: 'wattpad',
      url: 'foo'
    }
  })
  const res = mockRes()

  route.postImport(req, res)
  t.truthy(res.sendStatus.calledWith(200))

  route.getImport(req, res)
  t.truthy(res.json.calledWith(route.importJobs))

  const [ pendingJob ] = route.importJobs

  t.falsy(pendingJob.updated_at)
  t.truthy(pendingJob.state === Route.STATE_PENDING)

  clock.tick(60100)
  route.getImport(req, res)
  t.truthy(res.json.calledWith(route.importJobs))

  const [ finishedJob ] = route.importJobs

  t.truthy(finishedJob.updated_at)
  t.truthy(finishedJob.updated_at > finishedJob.created_at)
  t.truthy(finishedJob.state === Route.STATE_FINISHED)
})
