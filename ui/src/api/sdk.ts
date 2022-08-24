// Balena SDK Documentation: https://www.balena.io/docs/reference/sdk/node-sdk/
import { expressApi } from 'boot/axios'

const apiPathV1 = '/v1/sdk' as string

interface Env {
  [key: string]: string
}

export const sdk = {
  device() {
    return expressApi.get(`${apiPathV1}/device`)
  },

  uuid() {
    return expressApi.get(`${apiPathV1}/uuid`)
  },
  getEnv() {
    return expressApi.get(`${apiPathV1}/envVars`)
  },
  setEnv(newKey: string, newValue: string) {
    const payload: Env = {}
    payload[newKey] = newValue
    return expressApi.post(`${apiPathV1}/envVars`, payload)
  },
  deleteEnv(objectOfKeys: object) {
    // axios delete method is actually not the same as get or post, so 'data' option is needed in the body
    return expressApi.delete(`${apiPathV1}/envVars`, {
      data: objectOfKeys
    })
  }
}
