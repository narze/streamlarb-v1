import * as path from "path"
import electron, { app, BrowserWindow, globalShortcut } from "electron"

const loadURL = import.meta.env.PROD
  ? `file://${path.resolve(__dirname, "../renderer/index.html")}`
  : process["env"].RENDERER_URL || "http://localhost:3000"

function createWindow() {
  const screenSize = electron.screen.getPrimaryDisplay().size
  const mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    icon: path.resolve(__dirname, "../../public/icons/256x256.png"),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
  })

  mainWindow.loadURL(loadURL)
  mainWindow.setIgnoreMouseEvents(true) // Click Through

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ["*://*/*"] },
    (d, c) => {
      if (d.responseHeaders?.["X-Frame-Options"]) {
        delete d.responseHeaders["X-Frame-Options"]
      } else if (d.responseHeaders?.["x-frame-options"]) {
        delete d.responseHeaders["x-frame-options"]
      }

      c({ cancel: false, responseHeaders: d.responseHeaders })
    }
  )

  return mainWindow
}

let window: electron.BrowserWindow
let transparentBackground = true
let debugMode = false

app.whenReady().then(() => {
  window = createWindow()

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      window = createWindow()
    }
  })

  globalShortcut.register("Alt+CommandOrControl+F", () => {
    transparentBackground = !transparentBackground
    window.setBackgroundColor(transparentBackground ? "#00FFFFFF" : "#FFFFFFFF")
  })

  globalShortcut.register("Alt+CommandOrControl+V", () => {
    debugMode = !debugMode

    window.setAlwaysOnTop(!debugMode)
    window.setIgnoreMouseEvents(!debugMode)
  })

  globalShortcut.register("Alt+CommandOrControl+L", () => {
    const devTools = window.webContents.isDevToolsOpened()

    if (devTools) {
      window.webContents.closeDevTools()
    } else {
      window.webContents.openDevTools()
    }
  })
})

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit()
})
