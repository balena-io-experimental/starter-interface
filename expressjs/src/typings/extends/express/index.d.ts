export declare global {
  namespace Express {
    interface Response {
      sendResponse: Express.Response['sendResponse']
    }
  }
}
