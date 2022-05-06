export declare type balenaSdkTypings = typeof import('balena-sdk')

declare global {
  interface Window {
    balenaSdk?: balenaSdkTypings
  }
}

export const { getSdk } = window.balenaSdk
