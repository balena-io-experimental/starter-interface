import { Request, Response, NextFunction } from 'express'
import Logger from '@/common/logger'

interface sendResponse extends Response {
  sendResponse: Response['json']
}

interface reqBodyData {
  cacheTimeout: number
  path: string
  type: string
}

interface requestData {
  queueName?: string
  cachedData?: JSON
  runtime?: number
}

const queue = [] as Array<QueueUnique>
const requestCache = [] as Array<requestData>

// Class to queue items and cache results
class QueueUnique {
  func
  q: Promise<unknown>

  constructor(
    func: (
      req: Request,
      res: sendResponse,
      next: NextFunction
    ) => Promise<unknown>
  ) {
    this.func = func
    this.q = Promise.resolve()
  }

  add(req: Request, res: sendResponse, next: NextFunction) {
    // Check if the item is already cached
    if (checkCache(req, res) === undefined) {
      return
    }

    // If not cached, add to queue
    const queuedFunc = this.queue(req, res, next)
    void queuedFunc()
  }

  queue(req: Request, res: sendResponse, next: NextFunction) {
    return () => {
      this.q = this.q
        .then(() => this.func(req, res, next))
        .catch((error) => {
          Logger.error(error)
        })
      return this.q
    }
  }
}

const response = (req: Request, res: sendResponse, next: NextFunction) => {
  return new Promise((resolve) => {
    const qName = compileQueueName(req)
    const reqBody = req.body as reqBodyData

    // Do another check to see if the request that just finished has created a useful cache
    const cachedItemList = checkCache(req, res)
    if (cachedItemList === undefined) {
      resolve(true)
      return
    }
    if (cachedItemList[0].queueName) {
      // Got this far, and cache exists so it must be older than set time, starting new request.
      Logger.debug('Cache exists. Updating it.')

      // Return response to user
      res.sendResponse = res.json
      res.json = (body: JSON) => {
        res.sendResponse(body)
        // Find the current item in the request cache
        const arrayIndex = requestCache?.findIndex(
          (itm) => itm.queueName === qName
        )
        // Set the time that the request was stored
        requestCache[arrayIndex].runtime = new Date().getTime()
        // Store the body of the response in the cache
        requestCache[arrayIndex].cachedData = body
        Logger.debug('Current cached content:')
        Logger.debug(requestCache)
        return res
      }
    } else {
      // There was no cache
      Logger.debug('No existing cache. Making new request.')

      // Return the response to the caller
      res.sendResponse = res.json
      res.json = (body: JSON) => {
        res.sendResponse(body)
        // Only use cache on GET requests. When not GET, this middleware only acts as a queue.
        if (reqBody.type === 'GET' || req.method === 'GET') {
          Logger.debug('GET item detected.')

          // Check if it is already in cache to avoid duplicates
          // Overcomes an error: https://github.com/expressjs/express/issues/4826
          const arrayIndex = requestCache?.findIndex(
            (itm) => itm.queueName === qName
          )

          if (arrayIndex === -1) {
            Logger.debug('Creating new item in cache.')
            requestCache.push({
              cachedData: body, // Add the new item to the permanent cache
              queueName: qName, // Add the request URL to the item for later reference
              runtime: new Date().getTime() // Add the time the request was made
            })
          }
        }
        Logger.debug('Current cached content:')
        Logger.debug(requestCache)
        return res
      }
    }
    next()
    resolve(true)
  })
}

function checkCache(req: Request, res: sendResponse) {
  const reqBody = req.body as reqBodyData
  // Fetch all cached items related to the current endpoint queue, which is named after the endpoint url
  const cachedItemList = {} as Array<requestData>
  cachedItemList[0] =
    requestCache.find((itm) => itm.queueName === compileQueueName(req)) || {}

  // Set the cache timeout for this request based on passed params
  let cacheTimeout = 0 as number // By default cache is disabled

  // Checks whether param is greater than -1 because 0 is seen as falsy
  if (reqBody.cacheTimeout > -1) {
    // If a cache timeout is provided from the UI then use it
    cacheTimeout = reqBody.cacheTimeout
  } else if (req.app.locals.defaultCacheTimeout) {
    // else if there is a default cache set in expressJs, use that
    cacheTimeout = req.app.locals.defaultCacheTimeout as number
  }

  Logger.debug(`Cache timeout = ${cacheTimeout}`)

  // If the current request is within X seconds of the last successful request, return the cached version
  if (
    cachedItemList[0].runtime &&
    new Date().getTime() - cachedItemList[0].runtime < cacheTimeout
  ) {
    // Return the cached item to the user
    Logger.debug('Returning cached item.')
    res.json(cachedItemList[0].cachedData)
    return undefined
  } else {
    return cachedItemList
  }
}

function compileQueueName(req: Request) {
  const reqBody = req.body as reqBodyData
  const reqRoute = req.route as Request
  // If a url path is passed then use it to set a custom queue name
  if (reqBody.path) {
    return `${reqRoute.path}-${reqBody.path}`
  } else {
    return reqRoute.path
  }
}

// Create multipule queues, one for each endpoint
function sortQueues(req: Request, res: Response, next: NextFunction) {
  // Use the queue name to create a queue within the queues array
  const qName = compileQueueName(req) as never
  if (!queue[qName]) {
    queue[qName] = new QueueUnique(response)
  }
  queue[qName].add(req, res as sendResponse, next)
}

export default sortQueues
