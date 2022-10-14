//
// Use the balena SDK to perform functions
//

import logger from '@/common/logger'
import { getSdk } from 'balena-sdk'
import express, { Request, RequestHandler } from 'express'
import lockFile from 'lockfile'
import process from 'process'

interface LockfileError {
  code: string
}

// Get the ExpressJS main router process
const router = express.Router()

// Get the balena SDK instance
const sdk = getSdk()

// Specify the lockfile path used by balena Supervisor/OS
const balenaLockfilePath = '/tmp/balena/updates.lock'

// Set the required balena info from environment variables inside the running container
// which are set by the balena Supervisor
const apiKey = process.env.BALENA_API_KEY || ''
const uuid = process.env.BALENA_DEVICE_UUID || ''

// Initiate a login to the balena Cloud using the API key stored on the device
void logIn()
async function logIn() {
  try {
    await sdk.auth.logout()
    await sdk.auth.loginWithToken(apiKey)
  } catch (error) {
    logger.error(error)
    logger.error('Error logging in to balena SDK')
  }
}

// Return the device UUID
router.get('/v1/sdk/uuid', (_req, res) => res.json(uuid))

// Return device info from the SDK
router.get('/v1/sdk/device', (async (_req, res) => {
  res.json(await sdk.models.device.get(uuid))
}) as RequestHandler)

// Get all environment variables for the device specified. When using this
// endpoint the Cloud will trigger a restart of the affected containers
router.get('/v1/sdk/envVars', (async (_req, res) => {
  const envVars = await sdk.models.device.envVar.getAllByDevice(uuid)

  const omittedEnvVars = envVars.map((vars) => ({
    name: vars.name,
    value: vars.value
  }))

  return res.json(omittedEnvVars)
}) as RequestHandler)

// Delete an environment variable
router.delete('/v1/sdk/envVars', (async (req, res) => {
  await lock()

  await Promise.all(
    Object.entries(req.body as Request).map(async ([key]) => {
      await sdk.models.device.envVar.remove(uuid, key)
    })
  )

  await unlock()

  return res.json({ message: 'done' })
}) as RequestHandler)

// Set an environment variable, or change it if it exists already
router.post('/v1/sdk/envVars', (async (req, res) => {
  await lock()

  await Promise.all(
    Object.entries(req.body as Request).map(async ([key, val]) => {
      if (val) {
        await sdk.models.device.envVar.set(uuid, key, val as string)
      }
    })
  )

  await unlock()

  return res.json({ message: 'done' })
}) as RequestHandler)

// Check whether logged in to the balena Cloud or not. Used on the UI to identify whether
// it should be fetching content from the balena Cloud or not.
router.get('/v1/sdk/loggedIn', (async (_req, res) => {
  try {
    return res.json({ loggedIn: !!(await sdk.auth.getToken()) })
  } catch {
    return res.json({ loggedIn: false })
  }
}) as RequestHandler)

// Set the balena lock file to avoid Supervisor making changes on the device when
// making a change through the SDK.
function lock() {
  try {
    return lockFile.lockSync(balenaLockfilePath)
  } catch (error) {
    const err = error as LockfileError

    // Check the error code and if the lockfile already exists then continue. This avoids a
    // permanent lockup that can occur if the lockfile exists and the UI refuses to continue
    // which is required to remove the lockfile.
    if (err.code === 'EEXIST') {
      return Promise.resolve()
    }
    return Promise.reject(error)
  }
}

// Remove the balena lockfile.
function unlock() {
  try {
    return lockFile.unlockSync(balenaLockfilePath)
  } catch (error) {
    return Promise.reject(error)
  }
}

export default router
