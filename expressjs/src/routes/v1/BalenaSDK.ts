import { getSdk } from 'balena-sdk'
import express, { Request, RequestHandler } from 'express'
import process from 'process'
import lockFile from 'lockfile'
import logger from '@/common/logger'

interface lockfileError {
  code: string
}

const router = express.Router()
const sdk = getSdk()

const balenaLockfilePath = '/tmp/balena/updates.lock'
const apiKey = process.env.BALENA_API_KEY || ''
const uuid = process.env.BALENA_DEVICE_UUID || ''

async function init() {
  try {
    await sdk.auth.logout()
    await sdk.auth.loginWithToken(apiKey)
  } catch (error) {
    logger.error(error)
    logger.error('Error logging in to Balena SDK')
  }
}

router.get('/v1/sdk/uuid', (_req, res) => res.json(uuid))

router.get('/v1/sdk/device', (async (_req, res) => {
  res.json(await sdk.models.device.get(uuid))
}) as RequestHandler)

//
// environment variables
//

router.get('/v1/sdk/envVars', (async (_req, res) => {
  const envVars = await sdk.models.device.envVar.getAllByDevice(uuid)

  const omittedEnvVars = envVars.map((vars) => ({
    name: vars.name,
    value: vars.value
  }))

  return res.json(omittedEnvVars)
}) as RequestHandler)

router.delete('/v1/sdk/envVars', (async (req, res) => {
  if (process.env.ON_DEVICE) {
    await lock()

    await Promise.all(
      Object.entries(req.body as Request).map(async ([key]) => {
        await sdk.models.device.envVar.remove(uuid, key)
      })
    )

    await unlock()
  }

  return res.json({ message: 'done' })
}) as RequestHandler)

router.post('/v1/sdk/envVars', (async (req, res) => {
  if (process.env.ON_DEVICE) {
    await lock()

    await Promise.all(
      Object.entries(req.body as Request).map(async ([key, val]) => {
        if (val) {
          await sdk.models.device.envVar.set(uuid, key, val as string)
        }
      })
    )

    await unlock()
  }
  return res.json({ message: 'done' })
}) as RequestHandler)

function lock() {
  try {
    return lockFile.lockSync(balenaLockfilePath)
  } catch (error) {
    const err = error as lockfileError

    // Check the error code and if the lockfile already exists then continue. This avoids a
    // permanent lockup that can occur if the lockfile exists and the UI refuses to continue
    // which is required to remove the lockfile.
    if (err.code === 'EEXIST') {
      return Promise.resolve()
    }
    return Promise.reject(error)
  }
}

function unlock() {
  try {
    return lockFile.unlockSync(balenaLockfilePath)
  } catch (error) {
    return Promise.reject(error)
  }
}

void init()

export default router
