//
// Set the hostname on boot based on the hostname specified in the docker-compose file
//

import createAxiosInstance from '@/common/axios'
import Logger from '@/common/logger'
import { AxiosResponse } from 'axios'
import fse from 'fs-extra'
import process from 'process'

interface HostConfigHostnameReq {
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
  } catch (error) {
    Logger.error('Failed setting hostname lockfile.')
    Logger.error(error)
  }
}

// Use the Supervisor endpoint to set the device hostname
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
    Logger.error(error)
    Logger.error('Error setting new hostname.')
  }
}

// Check whether the user wants a hostname change, and whether it has been done
// already (i.e. whether this is the first boot)
export default async function checkHostname() {
  // If there is an env variable specifying a new hostname and hostname has not already been set
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.SET_HOSTNAME &&
    !fse.pathExistsSync(hostnameLockFile)
  ) {
    // Get the current hostname and check if it needs changing, rather than force a new request
    // unnecessarily which could result in a balena engine restart.
    try {
      const response: AxiosResponse<HostConfigHostnameReq> =
        await hostnameAxios.get('v1/device/host-config')

      // If the current hostname is not the same as the provided var
      if (response.data.network.hostname !== process.env.SET_HOSTNAME) {
        Logger.warn(`Changing hostname to ${process.env.SET_HOSTNAME}.`)
        void setNewHostname()
      } else {
        // If the hostname is already set correctly, create the lockfile to save having
        // to run this process again.
        Logger.debug('Hostname was already set correctly.')
        await setHostnameLockfile()
      }
    } catch (error) {
      Logger.error(error)
      Logger.error('Error fetching current hostname.')
    }
  }
}
