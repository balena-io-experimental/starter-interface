/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import api from 'axios'

const apiPath = 'http://localhost:3000/sdk' as string

export const sdkRequests = {
  device () {
    return api.get(`${apiPath}/device`)
  },
  uuid () {
    return api.get(`${apiPath}/uuid`)
  }
}
