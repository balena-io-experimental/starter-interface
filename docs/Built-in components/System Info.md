## Accessing System Info

There is the ability to get local system information provided by the [SystemInfo package](https://systeminformation.io). This example gets information on device memory and is returned in JSON format:

```typescript
import { expressApi } from "boot/axios";

function memStats() {
  return expressApi.post("/v1/system/systeminfo", {
    id: "m",
  });
}
```

A list of the available calls and the code to pass to use them (i.e. in the example above we used `m` for memory) is available in `expressjs/src/routes/v1/System.ts`.
