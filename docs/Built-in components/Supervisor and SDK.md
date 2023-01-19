A number of endpoints are already included for communicating with the SDK and Supervisor.

# Supervisor

Here is an example of using the `ping` endpoint on the balena Supervisor to check the Supervisor is available:

```typescript
import { supervisorRequests } from "src/api/supervisor";

async function ping() {
  response.value = await supervisorRequests.ping();
  console.log(`Response from Supervisor is ${response.value.data}`);
}
```

A full list of available endpoints are available in: `ui/src/api/supervisor.ts`.

# SDK

Here is an example of using the `getEnv` endpoint on the balena Supervisor to fetch the set environment variables:

```typescript
import { sdk } from "src/api/sdk";

async function getEnv() {
  getEnvResponse.value = await sdk.getEnv();
}
```

A full list of available endpoints is available in: `ui/src/api/sdk.ts`.
