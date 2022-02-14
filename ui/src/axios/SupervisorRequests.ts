// Documentation: https://www.balena.io/docs/reference/supervisor/supervisor-api/
import expressApi from 'axios';

// Default API path
const apiPath = '/supervisor' as string;

export const supervisorRequests = {
  host_config(newHostname: string) {
    return expressApi.post(apiPath, {
      type: 'PATCH',
      path: 'v1/device/host-config',
      params: { network: { hostname: newHostname } },
    });
  },
  device() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/device',
      params: false,
    });
  },
  ping() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'ping',
      params: false,
    });
  },
  reboot(force: boolean) {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/reboot',
      params: { force: force },
    });
  },
  shutdown(force: boolean) {
    return expressApi.post(apiPath, {
      type: 'POST',
      path: '/v1/shutdown',
      params: { force: force },
    });
  },
  update(force: boolean) {
    // This route will return a 404 in development mode as it won't exist
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/update',
      params: { force: force },
    });
  },
  v1_blink() {
    return expressApi.post(apiPath, {
      type: 'GET',
      path: 'v1/blink',
      params: false,
    });
  },
};
