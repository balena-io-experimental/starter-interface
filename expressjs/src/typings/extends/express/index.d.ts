export declare global {
  namespace Express {
    interface Response {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendResponse: any
    }
  }
}
