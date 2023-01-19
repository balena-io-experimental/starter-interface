On first load of the app the ExpressJS backend will check to see if you have a connection to balena CloudLink. You can get the results of this check with the following code:

```typescript
import { networkSettings } from "stores/system";

const networkStore = networkSettings();

// Check to see the last reported CloudLink status
function checkCloudlinkStatus() {
  if (networkStore.isCloudlink) {
    return "You are connected to Cloudlink.";
  } else if (!networkStore.isCloudlink) {
    return "You are not connected to CloudLink.";
  } else if (networkStore.isCloudlink === undefined) {
    return "The very first CloudLink check at launch hasn't completed yet.";
  }
}
```

If you need to do another check at some point after the app has loaded, you can use the following code:

```typescript
import { networkSettings } from "stores/system";

const networkStore = networkSettings();

// Rechecks the CloudLink status and returns boolean response
// (true=connected, false=not connected)
function recheckCloudlinkStatus() {
  return networkStore.checkCloudlink();
}
```
