// Documentation: https://www.balena.io/docs/reference/supervisor/supervisor-api/
import expressApi from 'axios'

// Default API path
const apiPath = '/supervisor' as string

export const supervisorRequests = {
  applications_state() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/applications/state',
      params: false
    })
  },
  blink() {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v1/blink',
      params: false
    })
  },
  cleanup_volumes() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/cleanup-volumes',
      params: false
    })
  },
  containerId() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/containerId',
      params: false
    })
  },
  device() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/device',
      params: false
    })
  },
  device_host_config_get() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/device/host-config',
      params: false
    })
  },
  device_host_config_patch(data: unknown) {
    return expressApi.post(apiPath, {
      type: 'PATCH',
      path: 'v1/device/host-config',
      params: data
    })
  },
  device_name() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/device/name',
      params: false
    })
  },
  device_tags() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/device/tags',
      params: false
    })
  },
  device_vpn() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/device/vpn',
      params: false
    })
  },
  healthy() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/healthy',
      params: false
    })
  },
  journald_logs() {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v2/local/logs',
      params: { follow: false, all: true }
    })
  },
  local_device_info() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/local/device-info',
      params: false
    })
  },
  local_logs() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/local/logs',
      params: false
    })
  },
  local_target_state_get() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/local/target-state',
      params: false
    })
  },
  local_target_state_post(targetState: unknown) {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v2/local/target-state',
      params: targetState
    })
  },
  ping() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'ping',
      params: false
    })
  },
  purge(appId: number) {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v1/purge',
      params: { appId: appId }
    })
  },
  reboot(force: boolean) {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/reboot',
      params: { force: force }
    })
  },
  regenerate_api_key() {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v1/regenerate-api-key'
    })
  },
  restart(appId: number) {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v1/restart',
      params: { appId: appId }
    })
  },
  shutdown(force: boolean) {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: 'v1/shutdown',
      params: { force: force }
    })
  },
  state_status() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/state/status',
      params: false
    })
  },
  update(force: boolean) {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/update',
      params: { force: force }
    })
  },
  v1_blink() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/blink',
      params: false
    })
  },
  version() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v2/version',
      params: false
    })
  }
}
