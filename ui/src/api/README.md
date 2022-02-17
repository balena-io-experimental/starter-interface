## Cache timeouts and queueing:

The `cacheTimeout: ms` paramater provides the ability to reduce the number of calls to the Supervisor or SDK. If an endpoint has already been called in the last X ms then it will return a cached response instead. This is helpful when rendering a UI that has components using a response from the same endpoints as it prevents needing to call the endpoint multipule times and delaying the page loading.

Gerenal rules:

- Each endpoint has its own queue. For example a request to /ping will not wait for a request from /v1/device, it will only wait for other requests to finish on /ping. Requests in its queue are asynchronous. Once the first returns, the second will then execute and if a cache is enabled it will return the cached content instead of making a new request.
- Caching is only enabled for enpoints with the `type: 'GET'` paramater passed or those requested as an Axios GET request. Caching POST or PATCH request would defeat the object of requesting a change on the device. A cacheTimeout param on a type other than GET will be ignored and the reqest will be run as normal.

Examples:
`cacheTimeout: 0` <-- Using default cache expiry set in expressjs/src/index.js
`cacheTimeout: 2000` <-- Return previously fetched content if less than 2 seconds old
Not passing the cacheTimeout param will use default cache expiry set in expressjs/src/index.js

```
ping() {
  return expressApi.post(apiPath, {
    type: 'GET',
    path: 'ping',
    params: false,
    cacheTimeout: 2000 // Cache is set to 2 seconds
  })
}
```
