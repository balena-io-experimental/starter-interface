/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSdk } from 'balena-sdk'
import express from 'express'
import process from 'process'
import lockFile from 'lockfile'
import _ from 'lodash'

const router = express.Router()

const uuid = process.env.BALENA_DEVICE_UUID || ''
const apiKey = process.env.BALENA_API_KEY || ''

const sdk = getSdk()

async function init() {
  try {
    await sdk.auth.logout()
    await sdk.auth.loginWithToken(apiKey)
  } catch (err: any) {
    err.message = 'Error logging into with balena SDK'
    throw new Error(err)
  }
}

router.get('/sdk/uuid', (_req, res) => res.json(uuid))

router.get('/sdk/device', async (_req, res, next) => {
  try {
    res.json(await sdk.models.device.get(uuid))
  } catch (err) {
    next(err)
  }
})

//
// environment variables
//

router.get('/sdk/envVars', async (_req, res, next) => {
  try {
    const envVars = await sdk.models.device.envVar.getAllByDevice(uuid)
    const omittedEnvVars = _.map(envVars, (value) =>
      _.pick(value, ['name', 'value'])
    )
    res.send(omittedEnvVars)
  } catch (err) {
    next(err)
  }
})

router.delete('/sdk/envVars', async (req, res, next) => {
  lock(async function (err: Error) {
    // a non-null err probably means the supervisor is about to kill us
    if (err != null) {
      err.message = '/sdk/setEnvVars: Could not acquire lock'
      return next(err)
    }

    try {
      const removeAll: any = []

      _.each(_.compact(_.keys(req.body)), (value) => {
        removeAll.push(sdk.models.device.envVar.remove(uuid, value))
      })

      Promise.all(removeAll)
        .then(() => {
          unlock()
          res.sendStatus(200)
        })
        .catch((err) => {
          unlock()
          next(err)
        })
    } catch (err) {
      unlock()
      next(err)
    }
  })
})

router.post('/sdk/envVars', (req, res, next) => {
  lock(async function (err: Error) {
    // a non-null err probably means the supervisor is about to kill us
    if (err != null) {
      err.message = '/sdk/setEnvVars: Could not acquire lock'
      return next(err)
    }
    try {
      const allSetCalls = []
      for (const [key, val] of Object.entries(req.body)) {
        if (key && !_.isNull(key)) {
          allSetCalls.push(sdk.models.device.envVar.set(uuid, key, String(val)))
        }
      }
      Promise.all(allSetCalls)
        .then(() => {
          unlock()
          res.sendStatus(200)
        })
        .catch((err) => {
          unlock()
          next(err)
        })
    } catch (err) {
      unlock()
      next(err)
    }
  })
})

// since we can't batch update env vars, we need to create a lockfile to stop the supervisor from restarting our services before all of them are set
function lock(cb?: any) {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  return lockFile.lock('/tmp/balena/updates.lock', cb)
}

function unlock(cb?: any) {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  return lockFile.unlock('/tmp/balena/updates.lock', cb)
}

init()

export default router
