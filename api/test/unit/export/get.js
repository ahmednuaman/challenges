import { mockReq, mockRes } from 'sinon-express-mock'
import sinon from 'sinon'
import test from 'ava'
import Route from 'src/route'

test('GET /export', (t) => {
  const clock = sinon.useFakeTimers()
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

  route.getExport(req, res)
  t.truthy(res.json.calledWith(route.exportJobs))

  const [ pendingJob ] = route.exportJobs

  t.falsy(pendingJob.updated_at)
  t.truthy(pendingJob.state === Route.STATE_PENDING)

  clock.tick(10100)
  route.getExport(req, res)
  t.truthy(res.json.calledWith(route.exportJobs))

  const [ finishedJob ] = route.exportJobs

  t.truthy(finishedJob.updated_at)
  t.truthy(finishedJob.updated_at > finishedJob.created_at)
  t.truthy(finishedJob.state === Route.STATE_FINISHED)
})
