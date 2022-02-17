// Balena SDK Documentation: https://www.balena.io/docs/reference/sdk/node-sdk/
import expressApi from 'axios'

const apiPath = '/sdk' as string

export const sdkRequests = {
  device() {
    return expressApi.get(`${apiPath}/device`)
  },
  uuid() {
    return expressApi.get(`${apiPath}/uuid`)
  },
  getEnv() {
    return expressApi.get(`${apiPath}/envVars`)
  }
}
