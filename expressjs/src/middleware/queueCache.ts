import { Request, Response, NextFunction } from 'express'
import Logger from '../common/logger'

interface requestData {
  queueName?: string
  cachedData?: string
  runtime?: number
}

const cachedItemList = {} as Array<requestData>
const queue = [] as Array<QueueUnique>
const requestCache = [] as Array<requestData>

// Class to queue items and cache results
class QueueUnique {
  func
  q: Promise<unknown>

  constructor(
    func: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
  ) {
    this.func = func
    this.q = Promise.resolve()
  }

  add(req: Request, res: Response, next: NextFunction) {
    // Check if the item is already cached
    if (checkCache(req, res)) {
      return
    }

    // If not cached, add to queue
    const queuedFunc = this.queue(req, res, next)
    queuedFunc()
  }

  queue(req: Request, res: Response, next: NextFunction) {
    return () => {
      this.q = this.q
        .then(() => this.func(req, res, next))
        .catch((err) => {
          console.log(err)
        })
      return this.q
    }
  }
}

const response = (req: Request, res: Response, next: NextFunction) => {
  // Do another check to see if item just finished in queue created a useful cache
  return new Promise((resolve) => {
    if (checkCache(req, res)) {
      resolve(true)
      return
    }
    if (cachedItemList[0].queueName) {
      // Got this far, and cache exists so it must be older than set time, starting new request.
      Logger.debug('Making request and updating cache.')

      // Return response to user
      res.sendResponse = res.json
      res.json = (body) => {
        res.sendResponse(body)
        // Find the current item in the request cache
        const arrayIndex = requestCache?.findIndex(
          (itm) => itm.queueName === req.url
        )
        // Set the time that the request was stored
        requestCache[arrayIndex].runtime = new Date().getTime()
        // Store the body of the response in the cache
        requestCache[arrayIndex].cachedData = body
        Logger.debug(requestCache[0])
        return res
      }
    } else {
      // There was no cache
      Logger.debug('Making request.')

      // Return the response to the caller
      res.sendResponse = res.json
      res.json = (body) => {
        res.sendResponse(body)
        // Only use cache on GET requests. When not GET, this middleware only acts as a queue.
        if (req.body.type === 'GET' || req.method === 'GET') {
          // Check if it is already in cache to avoid duplicates
          // Overcomes an error: https://github.com/expressjs/express/issues/4826
          Logger.debug('GET item detected. Adding new item to cache.')
          const arrayIndex = requestCache?.findIndex(
            (itm) => itm.queueName === req.url
          )

          if (arrayIndex === -1) {
            Logger.debug('Pushing new item to cache.')
            requestCache.push({
              cachedData: body, // Add the new item to the permanent cache
              queueName: req.url, // Add the request URL to the item for later reference
              runtime: new Date().getTime() // Add the time the request was made
            })
          }
        }
        Logger.debug(requestCache[0])
        return res
      }
    }
    next()
    resolve(true)
  })
}

function checkCache(req: Request, res: Response) {
  // Fetch all cached items related to the current endpoint queue, which is named after the endpoint url
  cachedItemList[0] =
    requestCache.find((itm) => itm.queueName === req.url) || {}

  // Set the cache timeout for this request based on passed params
  let cacheTimeout = 3000 // Last resort default in case there is no defaults anywhere else

  // Checks whether param is greater than -1 because 0 is seen as falsy
  if (req.body.cacheTimeout > -1) {
    // If a cache timeout is provided from the UI then use it
    cacheTimeout = req.body.cacheTimeout
  } else if (req.app.locals.defaultCacheTimeout) {
    // else if there is a default cache set in expressJs, use that
    cacheTimeout = req.app.locals.defaultCacheTimeout
  } else {
    // If none of the above defaults exist then use no cache
    cacheTimeout = 0
  }
  Logger.debug(`Cache timeout = ${cacheTimeout}`)

  // If the current request is within X seconds of the last successful requesst, return the cached version
  if (
    cachedItemList[0].runtime &&
    new Date().getTime() - cachedItemList[0].runtime < cacheTimeout
  ) {
    // Return the cached item to the user
    Logger.debug('Returning cached item.')
    res.json(cachedItemList[0].cachedData)
    return true
  } else {
    return false
  }
}

// Create multipule queues, one for each endpoint
function sortQueues(req: Request, res: Response, next: NextFunction) {
  if (!queue[req.route.path]) {
    // Use the endpoint name to create a queue within the queues array
    queue[req.route.path] = new QueueUnique(response)
  }
  queue[req.route.path].add(req, res, next)
}

export default sortQueues
