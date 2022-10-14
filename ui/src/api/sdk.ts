// Functions for communication from the users browser, to the ExpressJS backend, and
// then from the backend to the SDK. This is more secure than having to store API keys
// in the users browser.
//
// balena SDK Documentation for reference: https://www.balena.io/docs/reference/sdk/node-sdk/

import { expressApi } from 'boot/axios'

const apiPathV1 = '/v1/sdk' as string

interface EnvVar {
  [key: string]: string
}

export const sdk = {
  deleteEnv(objectOfKeys: object) {
    // Axios delete method is not the same as get or post, so 'data' option is needed in the body
    return expressApi.delete(`${apiPathV1}/envVars`, {
      data: objectOfKeys
    })
  },

  device() {
    return expressApi.get(`${apiPathV1}/device`)
  },

  getEnv() {
    return expressApi.get(`${apiPathV1}/envVars`)
  },

  setEnv(newKey: string, newValue: string) {
    const payload: EnvVar = {}
    payload[newKey] = newValue
    return expressApi.post(`${apiPathV1}/envVars`, payload)
  },

  uuid() {
    return expressApi.get(`${apiPathV1}/uuid`)
  }
}
