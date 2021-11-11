/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import api from 'axios'

// Default API path
const apiPath = '/supervisor' as string

// Axios modes
const get = 'GET' as string
const post = 'POST' as string
const patch = 'PATCH' as string

export const supervisorRequests = {
  host_config (newHostname: string) {
    return api.post(apiPath, {
      type: patch,
      path: 'v1/device/host-config',
      params: { network: { hostname: newHostname } }
    })
  },
  ping () {
    return api.post(apiPath, {
      type: get,
      path: 'ping',
      params: false
    })
  },
  reboot (force: boolean) {
    return api.post(apiPath, {
      type: post,
      path: 'v1/reboot',
      params: { force: force }
    })
  },
  shutdown (force: boolean) {
    return api.post(apiPath, {
      type: post,
      path: '/v1/shutdown',
      params: { force: force }
    })
  },
  update (force: boolean) { // This route will return a 404 in development mode as it won't exist
    return api.post(apiPath, {
      type: get,
      path: 'v1/update',
      params: { force: force }
    })
  },
  v1_blink () {
    return api.post(apiPath, {
      type: get,
      path: 'v1/blink',
      params: false
    })
  }
}
