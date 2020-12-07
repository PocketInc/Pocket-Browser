/*
 The Official Pocket Browser Code,
 Created and Written by the Pocket, Inc.
 © 2020 Pocket Inc.
 github.com/PocketInc/Pocket-Browser
 */

function addTab(page) {
  const TabGroup = require("electron-tabs")
  //create a tab with title New Tab.
  //if page is provided, load it.
  if (page) {
    var link = page;
  } else {
    var link = homePage;
  }
  let tab = tabGroup.addTab({
    src: link,
    title: "New Tab",

  });
  //add events from events.js
  addEventsToTab(tab)

  if (darkMode == true) loadTheme();
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
  newWindow.loadFile(__dirname + '/index.html')
  newWindow.setMenu(null)
}