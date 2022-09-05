import { contextBridge } from 'electron'
import { BrowserWindow } from '@electron/remote'

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow()?.minimize()
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow()

    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  },

  close() {
    BrowserWindow.getFocusedWindow()?.close()
  }
})
