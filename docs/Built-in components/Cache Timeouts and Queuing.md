In the ExpressJS backend there is middleware available for caching and queueing requests. This prevents unnecessary calls to the Supervisor or SDK and also prevents multiple requests to the same endpoint from being made at the same time to speed up responses and reduce traffic. It follows a number of general rules:

1. Each endpoint has its own queue. For example, a request to `/ping` will not wait for a request from `/v1/device`, it will only wait for other requests to finish on `/ping`.
2. When two requests are made on the same endpoint - and the middleware is applied to the endpoints - it will wait for the first response to return before the second is executed.
3. If caching is enabled on the endpoint and the last request was returned in less than the passed timeout integer it will return the cached content on the second request, instead of making a new request.
4. Caching can only be enabled for endpoints with the `type: 'GET'` parameter passed or those requested as an Axios `GET` request. Caching `POST` or `PATCH` requests would defeat the object of requesting a change on the device if it was cached.

To use the middleware, include it in your route as follows:

```typescript
router.post('/v1/filemanager/delete', queueCache, (async (req: Request, res: Response) => {
...
}) as RequestHandler)
```

Configure the endpoints as follows, which will return the response from the cache if the last response was returned in less than the number of milliseconds specified in `cacheTimeout`:

```typescript
device_name() {
  return expressApi.post(apiPath + supervisorPath, {
    type: 'GET',
    path: 'v2/device/name',
    params: false,
    cacheTimeout: 5000
  })
},
```

## Examples

Using default cache expiry set in `expressjs/src/index.js`:

```typescript
cacheTimeout: 0;
```

Return previously fetched content if less than 2 seconds old:

```typescript
cacheTimeout: 2000;
```
