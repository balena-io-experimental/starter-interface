//
// A cache and queue used to handle API requests that are synchronous and need to be
// asynchronous.
//
// If two users are using the UI at the same time, or a user hits a button twice/refreshes
// a page, requests could be sent simultaneously and one or more could return errors. The
// queue helps mitigate this effect by queueing all requests and sending the asynchronous.
//
// Some endpoints that return data such as device info that doesn't change doesn't require a
// new request to the Supervisor or Cloud and in these instances a local cache can be used
// instead to reduce the number of requests and to speed up responses.
//
// This cache and queue can be used to handle these instances, and is configured through the
// UI Axios configuration. See the Wiki on Github for more info.
//

import Logger from '@/common/logger'
import { NextFunction, Request, Response } from 'express'

interface SendResponseRes extends Response {
  sendResponse: Response['json']
}

interface BodyDataReq {
  cacheTimeout: number
  path: string
  type: string
}

interface DataReq {
  queueName?: string
  cachedData?: JSON
  runtime?: number
}

interface RequestObject {
  [key: string]: DataReq
}

const queue = [] as Array<QueueUnique>
const requestCache = {} as RequestObject

// Class to queue items and cache results
class QueueUnique {
  func

  returnedQueue: Promise<unknown>

  constructor(
    func: (
      req: Request,
      res: SendResponseRes,
      next: NextFunction
    ) => Promise<unknown>
  ) {
    this.func = func
    this.returnedQueue = Promise.resolve()
  }

  add(req: Request, res: SendResponseRes, next: NextFunction) {
    // Check if the item is already cached
    if (checkCache(req, res) === undefined) {
      return
    }

    // If not cached, add to queue
    const queuedFunc = this.queue(req, res, next)
    void queuedFunc()
  }

  queue(req: Request, res: SendResponseRes, next: NextFunction) {
    return () => {
      this.returnedQueue = this.returnedQueue
        .then(() => this.func(req, res, next))
        .catch((error) => {
          Logger.error(error)
        })
      return this.returnedQueue
    }
  }
}

const response = (req: Request, res: SendResponseRes, next: NextFunction) =>
  new Promise((resolve) => {
    const qName = compileQueueName(req)
    const reqBody = req.body as BodyDataReq

    // Do another check to see if the request that just finished has created a useful cache
    const cachedItemList = checkCache(req, res)
    if (cachedItemList === undefined) {
      resolve(true)
      return
    }
    if (cachedItemList.queueName) {
      // Got this far, and cache exists so it must be older than set time, starting new request.
      Logger.debug('Cache exists. Updating it.')

      // Return response to user
      res.sendResponse = res.json
      res.json = (body: JSON) => {
        res.sendResponse(body)

        // Set the time that the request was stored
        requestCache[qName].runtime = new Date().getTime()
        // Store the body of the response in the cache
        requestCache[qName].cachedData = body
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
          Logger.debug('Creating new item in cache.')
          requestCache[qName] = {
            cachedData: body, // Add the new item to the permanent cache
            queueName: qName, // Add the request URL to the item for later reference
            runtime: new Date().getTime() // Add the time the request was made
          }
        } else {
          Logger.debug('Not a GET item. Skipping.')
        }

        Logger.debug('Current cached content:')
        Logger.debug(requestCache)
        return res
      }
    }
    next()
    resolve(true)
  })

function checkCache(req: Request, res: SendResponseRes) {
  const reqBody = req.body as BodyDataReq
  // Fetch all cached items related to the current endpoint queue, which is named after the endpoint url
  let cachedItemList = {} as DataReq

  if (requestCache[compileQueueName(req)]) {
    cachedItemList = requestCache[compileQueueName(req)]
  }

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

  // If the current request is within X seconds of the last successful request, return the cached version
  if (
    cachedItemList.runtime &&
    new Date().getTime() - cachedItemList.runtime < cacheTimeout
  ) {
    // Return the cached item to the user
    Logger.debug(`Returning cached item with cache timeout ${cacheTimeout}.`)
    res.json(cachedItemList.cachedData)
    return undefined
  }
  return cachedItemList
}

function compileQueueName(req: Request) {
  const reqBody = req.body as BodyDataReq
  const reqRoute = req.route as Request
  // If a url path is passed then use it to set a custom queue name
  if (reqBody.path) {
    return `${reqRoute.path}-${reqBody.path}`
  }
  return reqRoute.path
}

// Create multiple queues, one for each endpoint
function sortQueues(req: Request, res: Response, next: NextFunction) {
  // Use the queue name to create a queue within the queues array
  const qName = compileQueueName(req) as never
  if (!queue[qName]) {
    queue[qName] = new QueueUnique(response)
  }
  queue[qName].add(req, res as SendResponseRes, next)
}

export default sortQueues
