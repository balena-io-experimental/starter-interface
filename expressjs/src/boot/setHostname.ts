import { AxiosResponse } from 'axios'
import createAxiosInstance from '@/common/axios'
import Logger from '@/common/logger'
import fse from 'fs-extra'
import process from 'process'

interface hostConfigHostname {
  network: { hostname: string }
}

// Create normal Axios instance and set defaults.
const hostnameAxios = createAxiosInstance()
hostnameAxios.defaults.timeout = 8000
hostnameAxios.defaults.baseURL = process.env.BALENA_SUPERVISOR_ADDRESS
hostnameAxios.defaults.headers.common.Authorization = `Bearer ${
  process.env.BALENA_SUPERVISOR_API_KEY as string
}`

// Set default storage location for hostname lockfile
const hostnameLockFile = '/app/db/hostname_set.lock'

async function setHostnameLockfile() {
  // Create a file used to indicate that hostname has been set and to avoid
  // trying to set the hostname again. This is technically not a lockfile, just
  // an empty file in the db volume that can be queried on boot because it is
  // required forever.

  try {
    await fse.ensureFile(hostnameLockFile)
    Logger.debug('Hostname lockfile created.')
  } catch (err) {
    Logger.error('Failed settting hostname lockfile.')
    Logger.error(err)
  }
}

async function setNewHostname() {
  try {
    await hostnameAxios.patch('v1/device/host-config', {
      network: {
        hostname: process.env.SET_HOSTNAME
      }
    })
    await setHostnameLockfile()
    Logger.warn(
      'Hostname changed. If your device is not accessible on your new hostname, try restarting the device.'
    )
  } catch (error) {
    Logger.error('Error setting new hostname.')
  }
}

export default async function checkHostname() {
  // If there is an env variable specifiying a new hostname and hostname has not already been set
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.SET_HOSTNAME &&
    !fse.pathExistsSync(hostnameLockFile)
  ) {
    // Get the current hostname and check if it needs changing, rather than force a new request
    // unnecessarily which could result in a Balena engine restart.

    try {
      const response: AxiosResponse<hostConfigHostname> =
        await hostnameAxios.get('v1/device/host-config')

      // If the current hostname is not the same as the provided var
      if (response.data.network.hostname != process.env.SET_HOSTNAME) {
        Logger.warn(`Changing hostname to ${process.env.SET_HOSTNAME}.`)
        void setNewHostname()
      } else {
        // If the hostname is already set correctly, create the lockfile to save having
        // to run this process again.
        Logger.debug('Hostname was already set correctly.')
        await setHostnameLockfile()
      }
    } catch (error) {
      Logger.error('Error fetching current hostname.')
    }
  }
}
