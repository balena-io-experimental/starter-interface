/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { getSdk } from 'balena-sdk'
import express, { RequestHandler } from 'express'
import process from 'process'
import lockFile from 'lockfile'
import _ from 'lodash'
import logger from '@/common/logger'

const router = express.Router()

const uuid = process.env.BALENA_DEVICE_UUID || ''
const apiKey = process.env.BALENA_API_KEY || ''

const sdk = getSdk()

async function init() {
  try {
    await sdk.auth.logout()
    await sdk.auth.loginWithToken(apiKey)
  } catch (error) {
    logger.error('Error logging into with balena SDK')
  }
}

router.get('/v1/sdk/uuid', (_req, res) => res.json(uuid))

router.get('/v1/sdk/device', (async (_req, res, next) => {
  try {
    res.json(await sdk.models.device.get(uuid))
  } catch (error) {
    next(error)
  }
}) as RequestHandler)

//
// environment variables
//

router.get('/v1/sdk/envVars', (async (_req, res, next) => {
  try {
    const envVars = await sdk.models.device.envVar.getAllByDevice(uuid)
    const omittedEnvVars = _.map(envVars, (value) =>
      _.pick(value, ['name', 'value'])
    )
    res.send(omittedEnvVars)
  } catch (error) {
    next(error)
  }
}) as RequestHandler)

router.delete('/v1/sdk/envVars', (req, res, next) => {
  lock(function (error: Error) {
    // a non-null err probably means the supervisor is about to kill us
    if (error != null) {
      error.message = '/v1/sdk/setEnvVars: Could not acquire lock'
      return next(error)
    }

    try {
      const removeAll: Array<Promise<void>> = []

      _.each(_.compact(_.keys(req.body)), (value) => {
        removeAll.push(sdk.models.device.envVar.remove(uuid, value))
      })

      Promise.all(removeAll)
        .then(() => {
          unlock()
          res.sendStatus(200)
        })
        .catch((error) => {
          unlock()
          next(error)
        })
    } catch (error) {
      unlock()
      next(error)
    }
  })
})

router.post('/v1/sdk/envVars', (req, res, next) => {
  lock(function (error: Error) {
    // a non-null err probably means the supervisor is about to kill us
    if (error != null) {
      error.message = '/v1/sdk/setEnvVars: Could not acquire lock'
      return next(error)
    }
    try {
      const allSetCalls = []
      for (const [key, val] of Object.entries(req.body as Request)) {
        if (key && !_.isNull(key)) {
          allSetCalls.push(sdk.models.device.envVar.set(uuid, key, String(val)))
        }
      }
      Promise.all(allSetCalls)
        .then(() => {
          unlock()
          res.sendStatus(200)
        })
        .catch((error) => {
          unlock()
          next(error)
        })
    } catch (error) {
      unlock()
      next(error)
    }
  })
})

// since we can't batch update env vars, we need to create a lockfile to stop the supervisor from restarting our services before all of them are set
function lock(cb?: any) {
  if (!process.env.ON_DEVICE) {
    return _.isFunction(cb) ? cb() : null
  }
  return lockFile.lock('/tmp/balena/updates.lock', cb)
}

function unlock(cb?: any) {
  if (!process.env.ON_DEVICE) {
    return _.isFunction(cb) ? cb() : null
  }
  return lockFile.unlock('/tmp/balena/updates.lock', cb)
}

void init()

export default router
