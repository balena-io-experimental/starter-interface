import api from 'axios'

// Default API path
const apiPath = '/api' as string

export const supervisorRequests = {

  ping () {
    return api.post(apiPath, {
      type: 'GET', // Can be 'GET', 'POST' or 'PATCH
      path: 'ping',
      params: false
    })
  },
  update (force: boolean) { // This route will return a 404 in development mode as it won't exist
    return api.post(apiPath, {
      type: 'GET',
      path: 'v1/update',
      params: { force: force }
    })
  },
  v1_blink () {
    return api.post(apiPath, {
      type: 'GET',
      path: 'v1/blink',
      params: false
    })
  }
}
