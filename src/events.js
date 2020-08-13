const contextMenu = require('electron-context-menu'); //require context menu module.


//Function to easily add and modify tab events.

function addEventsToTab(targetTab) {

    targetTab.webview.addEventListener("dom-ready",function () {
        //USER AGENT:
        // change useragent to Pb's official user agent.
        var newAgent = targetTab.webview.getUserAgent().replace(" Electron/" + process.versions['electron'],"").replace("PocketBrowser/1.5.0","Edg/84.0.522.44")

        targetTab.webview.setUserAgent(newAgent)

    contextMenu({
        window: targetTab.webview,
        showCopyImageAddress: true,
        showSaveImage: true,
        showSearchWithGoogle: false,
        showInspectElement: true,
        prepend: (defaultActions, params, browserWindow) => [
            {
                label: 'Open link in new tab',
                // Only show it when right-clicking images
                visible: params.linkURL,
                click: () => {
                    addTab(params.linkURL)
                }
            },
            {
                label: 'Search Web for {selection}',
                // Only show it when right-clicking text
                visible: params.selectionText.trim().length > 0,
                click: () => {
                    fs.readFile(__dirname + '/system/data/engine.pocket', function (err, data) {
                        if (err) {
                            pocket.error("Couldn't read file: ./system/data/engine.pocket: " + err)
                            throw err;
                        }
                        addTab(String(data).replace("%s", encodeURIComponent(params.selectionText)));
                        pocket.info("Searched via search engine: " + data)
                    });

                }
            }
        ]
    });

    })

// when page finishes loading, run changeAddress functiion.
    targetTab.webview.addEventListener('did-finish-load',function(){
     //   changeAddress(targetTab)
    });
    // when page favicon is updated, run change favicon function.
    targetTab.webview.addEventListener("page-favicon-updated",function () {
        changeFavicon(event,targetTab);
    })
    // when page starts loading run change state function.
    targetTab.webview.addEventListener('did-start-loading', function(){
        changeState(targetTab);
    });
    // when page title is updated, then run change title function.
    targetTab.webview.addEventListener('page-title-updated', function(){
        pocket.info("title change attempt")
        changeTitle(targetTab,event)
    })
    targetTab.webview.addEventListener('did-fail-load',function (event) {
        fs.exists(__dirname + '/system/error/' + event.errorCode + ".html", function (exists) {
            pocket.error("Error occured: " + event.errorCode + " | " + event.errorDescription);
            if (event.errorCode == -3) return;
            if (exists === true) {
                openSystemPage("error/" + event.errorCode)
            } else {
                openSystemPage('error')
            }

        })
    })
targetTab.webview.addEventListener("found-in-page",function (event) {
document.getElementById("findResults").innerHTML = event.result.matches;
})

    targetTab.webview.addEventListener("update-target-url",function (event) {
        if(event.url == "") {
            return document.getElementById("link").hidden = "hidden"
        } else if (event.url.length > 60) {
            document.getElementById("link").innerHTML = event.url.slice(0, 60) + "...";

        } else {
            document.getElementById("link").innerHTML = event.url;
        }
        document.getElementById("link").hidden = ""

    })

    targetTab.webview.addEventListener("will-navigate",function (event) {
    changeAddress(targetTab,event);
    })
    targetTab.webview.addEventListener("did-navigate-in-page",function (event) {
        changeAddress(targetTab,event);
    })

}
//Other Events

//Offline / Online
window.addEventListener('online',  function (event) {

backOnline();
})
window.addEventListener('offline', function (event) {
wentOffline()
})


//Add new tab when there's no tabs.
tabGroup.on("tab-removed", (functionTab, tabGroup) => {
    if (tabGroup.getTabs().length > 0) {
        pocket.info("Closed a tab, but there's still more tabs..");
    } else {
        pocket.info("Closed all tabs.");
        addTab();
    }
});

//Drag support for address bar

document.getElementById("address").addEventListener('drop',function (event) {
event.preventDefault();
    document.getElementById('address').value = event.dataTransfer.getData("Text")
})
document.getElementById("tabgroup").addEventListener('drop',function (event) {
alert()
})

//select all text in address bar when clicked on it.
document.getElementById("address").addEventListener("click",function () {
electron.getCurrentWindow().webContents.selectAll()
})

// change title and address value when a new tab is activated.
tabGroup.on("tab-active", (tab, tabGroup) => {
    webview = tab.webview;
    document.getElementById("address").value = tab.webview.src;
    electron.getCurrentWindow().title = tab.webview.getTitle() + " - Pocket Browser";
    showCookies(tab);
    if (tab.webview.src.slice(0,8) === "https://") {
        changeSecureState("https")
    } else if (tab.webview.src.slice(0,7) === "http://") {
        changeSecureState("http")
    } else {
        changeSecureState("")
    }

});
//KeyBoard Shortcuts

window.addEventListener("keypress",function (event) {
    if (event.ctrlKey) {
        if (event.key === "t") {
            addTab();
        } else if (event.key === "n") {
            addWindow();
        } else if (event.key === "w") {
            targetTab.close();
        } else if (event.altKey && event.key === "s") {
            openSystemPage("settings");
        } else if (event.key === 'j') {
            openSystemPage("downloads")
        }
    }
})


//auto-complete compatibility

    const autocomplete = require("autocompleter");


    autocomplete({
        minLength: 1,
        input: document.getElementById("address"),
        fetch: function (text, update) {
            text = text.toLowerCase();
            getHistory();
            var suggestions = fullHistory.filter(n => n.label.toLowerCase().includes(text))
            update(suggestions);

        },
        onSelect: function (item) {
document.getElementById("address").value = item.value;
loadURL();
        }
    });
