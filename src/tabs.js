/*
 The Official Pocket Browser Code,
 Created and Written by the Pocket, Inc.
 © 2020 Pocket Inc.
 github.com/PocketInc/Pocket-Browser
 */

function addTab(page) {
  const TabGroup = require("electron-tabs")
  //create a tab with title New Tab.
  let tab = tabGroup.addTab({
    src: homePage,
    title: "New Tab",

  });
  //if page is provided, load it.
  if (page) {
    tab.webview.src = page;
  }
  //add events from events.js
  addEventsToTab(tab)

}
function addWindow() {
  // create newe window
  const newWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,

    }
  })
//load html and remove default menu.
  newWindow.loadFile('index.html')
  newWindow.setMenu(null)
}