import * as dns from 'dns'
import express, { Request, Response } from 'express'
import si from 'systeminformation'
import queueCache from '@/middleware/queueCache'
import Logger from '@/common/logger'

interface reqBodyData {
  cmd: string
}

const router = express.Router()

// -- Routes -- //

// Internet connectivity check
router.get('/v1/system/internet_check', (_req, res) => {
  Logger.debug('Running internet connectivity check.')
  dns.lookup('google.com', (error) => {
    if (error && error.code === 'ENOTFOUND') {
      res.json({ internet: false })
    } else {
      res.json({ internet: true })
    }
  })
})

// Fetch systeminfo
router.post(
  '/v1/system/systeminfo',
  queueCache,
  async (req: Request, res: Response) => {
    try {
      const reqBody = req.body as reqBodyData

      const data = (await getSiFunction(reqBody.cmd)) as JSON
      res.json({ data })
    } catch (error) {
      Logger.error(error)
      res.status(500)
      res.json({ error })
    }
  }
)

// Functions
function getSiFunction(funcName: string) {
  if (si[funcName as keyof typeof si]) {
    // Disable warnings about using `any`
    // eslint-disable-next-line
    return (si as any)[funcName]()
  }

  throw new Error(`Method '${funcName}' is not implemented.`)
}

export default router
