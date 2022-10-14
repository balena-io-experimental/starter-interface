// Functions for communication from the users browser, to the ExpressJS backend, and
// then from the backend to the local Supervisor API. This is more secure than having
// to expose the Supervisor on the device.
//
// `cacheTimeout` tells the backend to return a cached response rather than get a new
// response if the last request was < cacheTimeout.
//
// balena Supervisor API Documentation for reference:
// https://www.balena.io/docs/reference/supervisor/supervisor-api/

import { expressApi } from 'boot/axios'

interface HostConfigHostnameReq {
  network: { hostname: string; proxy?: never }
}

interface HostConfigProxyReq {
  network: { hostname?: never; proxy: string }
}

// Default API path
const apiPath = '/v1'
const defaultCacheTimeout = 0 // Sets the default cache to be used on the backend
const supervisorPath = '/supervisor'

// Supervisor v1 endpoints
const v1 = {
  blink() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/blink',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  device() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v1/device',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  device_host_config_get() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v1/device/host-config',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  device_host_config_patch(data: HostConfigHostnameReq | HostConfigProxyReq) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'PATCH',
      path: 'v1/device/host-config',
      params: data,
      cacheTimeout: defaultCacheTimeout
    })
  },
  healthy() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v1/healthy',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  ping() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'ping',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  purge(appId: number) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/purge',
      params: { appId },
      cacheTimeout: defaultCacheTimeout
    })
  },
  reboot(force: boolean) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/reboot',
      params: { force },
      cacheTimeout: defaultCacheTimeout
    })
  },
  regenerate_api_key() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/regenerate-api-key',
      cacheTimeout: defaultCacheTimeout
    })
  },
  restart(appId: number) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/restart',
      params: { appId },
      cacheTimeout: defaultCacheTimeout
    })
  },
  shutdown(force: boolean) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/shutdown',
      params: { force },
      cacheTimeout: defaultCacheTimeout
    })
  },
  update(force: boolean) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v1/update',
      params: { force },
      cacheTimeout: defaultCacheTimeout
    })
  },
  v1_blink() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v1/blink',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  }
}

// Supervisor v2 endpoints
const v2 = {
  applications_state() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/applications/state',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  cleanup_volumes() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/cleanup-volumes',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  containerId() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/containerId',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  device_name() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/device/name',
      params: false,
      cacheTimeout: 60
    })
  },
  device_tags() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/device/tags',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  device_vpn() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/device/vpn',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  journald_logs() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v2/journal-logs',
      params: { follow: false, all: true },
      cacheTimeout: defaultCacheTimeout
    })
  },
  local_device_info() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/local/device-info',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  local_logs() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/local/logs',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  local_target_state_get() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/local/target-state',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  local_target_state_post(targetState: unknown) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v2/local/target-state',
      params: targetState,
      cacheTimeout: defaultCacheTimeout
    })
  },
  ping() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'ping',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  restart_service(serviceName: string) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v2/applications',
      path2: 'restart-service',
      params: { serviceName },
      cacheTimeout: defaultCacheTimeout
    })
  },
  start_service(serviceName: string) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v2/applications',
      path2: 'start-service',
      params: { serviceName },
      cacheTimeout: defaultCacheTimeout
    })
  },
  state_status() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/state/status',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  },
  stop_service(serviceName: string) {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'POST',
      path: 'v2/applications',
      path2: 'stop-service',
      params: { serviceName },
      cacheTimeout: defaultCacheTimeout
    })
  },
  version() {
    return expressApi.post(apiPath + supervisorPath, {
      type: 'GET',
      path: 'v2/version',
      params: false,
      cacheTimeout: defaultCacheTimeout
    })
  }
}

// Export the endpoints
export const supervisor = {
  v1,
  v2
}
