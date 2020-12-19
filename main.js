/*
 The Official Pocket Browser Code,
 Created and Written by the Pocket, Inc.
 © 2020 Pocket Inc.
 github.com/PocketInc/Pocket-Browser
 */

// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut, session} = require('electron')
const path = require('path')
function createWindow () {
  // Create the browser window.
   const mainWindow = new BrowserWindow({
    //default width and height of electron window
    width: 800,
    height: 600,
    webPreferences: {
      //allow node integration
      //allows node to work in HTML and JS files.
      nodeIntegration: true,
      webviewTag: true,
      enableRemoteModule: true

    }
  })

  // load the index.html of the app.
  mainWindow.loadFile('index.html')
  // remove the default electronjs menu
  mainWindow.setMenu(null)

  const newAgent = mainWindow.webContents.getUserAgent().replace(" Electron/" + process.versions['electron'],"")
  mainWindow.webContents.setUserAgent(newAgent)

    session.defaultSession.on("will-download",function (e,item) {
        item.setSavePath(app.getPath("downloads") + "/" + item.getFilename())
    })
 }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  app.allowRendererProcessReuse=false;
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})
app.on("will-quit",function () {globalShortcut.unregisterAll()})