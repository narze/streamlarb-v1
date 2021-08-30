import * as path from "path"
import electron, { app, BrowserWindow } from "electron"

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
    // alwaysOnTop: true,
    hasShadow: false,
  })

  mainWindow.loadURL(loadURL)
  // mainWindow.setIgnoreMouseEvents(true) // Click Through

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

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit()
})
