import api from 'axios'

const apiPath = '/sdk' as string

export const sdkRequests = {
  device () {
    return api.get(`${apiPath}/device`)
  },
  uuid () {
    return api.get(`${apiPath}/uuid`)
  }
}
