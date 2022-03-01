// Balena SDK Documentation: https://www.balena.io/docs/reference/sdk/node-sdk/
import expressApi from 'axios'

const apiPathV1 = '/v1/sdk' as string

export const sdkRequests = {
  device() {
    return expressApi.get(`${apiPathV1}/device`)
  },
  uuid() {
    return expressApi.get(`${apiPathV1}/uuid`)
  },
  getEnv() {
    return expressApi.get(`${apiPathV1}/envVars`)
  }
}
