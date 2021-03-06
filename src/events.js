const contextMenu = require('electron-context-menu'); //require context menu module.
var dataPath = require("electron").remote.app.getPath("userData");

//Function to easily add and modify tab events.

function addEventsToTab(targetTab, focus) {
    const domready = emittedOnce(targetTab.webview, "dom-ready");
    Promise.all([domready]).then(() => {

        //USER AGENT:
        // change useragent to Pb's official user agent.
        var newAgent = targetTab.webview.getUserAgent().replace(" Electron/" + process.versions['electron'], "").replace("PocketBrowser/1.6.2", "Edg/91.0.831.1")

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
                        fs.readFile(dataPath + '/data/engine.pocket', function (err, data) {
                            if (err) {
                                pocket.error("Error " + err + ": ./system/data/engine.pocket")
                                throw err;
                            }
                            addTab(String(data).replace("%s", encodeURIComponent(params.selectionText)));
                        });

                    }
                }
            ]
        });
        if (focus == true) targetTab.activate();
    })
// when page finishes loading, run changeAddress functiion.
    targetTab.webview.addEventListener('did-finish-load', function () {
        resetState(targetTab);

        if (darkMode == true) loadTheme();
        //Ad Blocker.
        fs.readFile(dataPath + "/data/adb.pocket", "utf8", function (err, data) {
            if (err) return console.log(err);
            if (data == "false") return;
            targetTab.webview.executeJavaScript("var totalAds = 0;\n" +
                "var nbOfScripts = document.getElementsByTagName(\"script\").length;\n" +
                "for (var i = 0;i<nbOfScripts;i++) {\n" +
                "    if (document.getElementsByTagName(\"script\")[i].src.includes(\"adservice\") || document.getElementsByTagName(\"script\")[i].src.includes(\"googlead\") || document.getElementsByTagName(\"script\")[i].src.includes(\"adsbygoogle\")) {\n" +
                "        document.getElementsByTagName(\"script\")[i].src= \"\";\n" +
                "        console.log(\"Ad removed by Pocket Browser\")\n" +
                "        totalAds++;\n" +
                "    }\n" +
                "}\n" +
                "var nbOfLinks = document.getElementsByTagName(\"link\").length;\n" +
                "for (var l = 0;l<nbOfLinks;l++) {\n" +
                "    if (document.getElementsByTagName(\"link\")[l].href.includes(\"adservice\") || document.getElementsByTagName(\"link\")[l].href.includes(\"googlead\")) {\n" +
                "        document.getElementsByTagName(\"link\")[l].href= \"\";\n" +
                "        console.log(\"Ad removed by Pocket Browser\")\n" +
                "        totalAds++;\n" +
                "    }\n" +
                "}\n" +
                "\n" +
                "var nbOfAds = document.getElementsByClassName(\"adsbygoogle\").length;\n" +
                "for (var i = 0;i<nbOfAds;i++) {\n" +
                "    document.getElementsByClassName(\"adsbygoogle\")[i].innerHTML = \"\";\n" +
                "    console.log(\"Ad removed by Pocket Browser\");\n" +
                "    totalAds++;\n" +
                "}")
        })


    });
    // when page favicon is updated, run change favicon function.
    targetTab.webview.addEventListener("page-favicon-updated", function () {
        changeFavicon(event, targetTab);
    })
    // when page starts loading run change state function.
    targetTab.webview.addEventListener('did-start-loading', function () {
        notifier.options.labels.alert = "Internet Problem!"
        if (onlineState == false) notifier.alert("Check your internet connection!")
        changeState(targetTab);
        checkMode(targetTab);
    });
    // when page title is updated, then run change title function.
    targetTab.webview.addEventListener('page-title-updated', function () {
        changeTitle(targetTab, event)
    })
    targetTab.webview.addEventListener('did-fail-load', function (event) {
        if (event.errorCode == -3) return;
        notifier.options.labels.alert = "Error: " + event.errorCode
        notifier.alert(event.errorDescription)
        if (event.errorCode == -21 || event.errorCode == -106) loadSystemPage("connection")
        if (event.errorCode == -113) loadSystemPage("insecure")
        if (event.errorCode == -6) loadSystemPage("file")
        sendError(event.errorCode)
    })
    targetTab.webview.addEventListener("found-in-page", function (event) {
        document.getElementById("findResults").innerHTML = event.result.matches;
    })

    targetTab.webview.addEventListener("update-target-url", function (event) {
        if (event.url == "") {
            return document.getElementById("link").hidden = "hidden"
        } else if (event.url.length > 60) {
            document.getElementById("link").innerHTML = "<small>" + event.url.slice(0, 100) + "...</small>";

        } else {
            document.getElementById("link").innerHTML = "<small>" + event.url + "</small>";
        }
        document.getElementById("link").hidden = ""

    })

    targetTab.webview.addEventListener("did-navigate", function (event) {
        event.preventDefault();
        changeAddress(targetTab, event);
    })
    targetTab.webview.addEventListener("did-navigate-in-page", function (event) {
        changeAddress(targetTab, event);
    })
    targetTab.webview.addEventListener("new-window", function (window) {
        window.preventDefault();
        addTab(window.url, true)
    })
    targetTab.webview.addEventListener('close', function () {
        targetTab.close();
    })
}

//Other Events

//Offline / Online
window.addEventListener('online', function (event) {

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
    }
});

//Drag support for address bar

document.getElementById("address").addEventListener('drop', function (event) {
    event.preventDefault();
    document.getElementById('address').value = event.dataTransfer.getData("Text")
})
document.getElementById("address").addEventListener('keydown', function (event) {
    if (event.key == "Escape") {
        event.preventDefault()
        document.getElementById("address").value = tabGroup.getActiveTab().webview.src;
    }
})

//select all text in address bar when clicked on it.
document.getElementById("address").addEventListener("click", function () {
    electron.getCurrentWindow().webContents.selectAll()
})

// change title and address value when a new tab is activated.
tabGroup.on("tab-active", (tab, tabGroup) => {
    webview = tab.webview;
    document.getElementById("address").value = tab.webview.src;
    electron.getCurrentWindow().title = tab.webview.getTitle() + " - Pocket Browser";
    showCookies(tab);
    if (tab.webview.src.slice(0, 8) === "https://") {
        changeSecureState("https")
    } else if (tab.webview.src.slice(0, 7) === "http://") {
        changeSecureState("http")
    } else {
        changeSecureState("")
    }

});
//KeyBoard Shortcuts

window.addEventListener("keypress", function (event) {
    if (event.ctrlKey) {
        if (event.key === "t") {
            addTab();
        } else if (event.key === "n") {
            addWindow();
        } else if (event.key === "w") {
            targetTab.close();
        } else if (event.altKey && event.key === "s") {
            openSystemPage("search");
        } else if (event.key === 'j') {
            openSystemPage("downloads")
        }
    }
})


//auto-complete compatibility

const autocomplete = require("autocompleter");
let suggestions;

autocomplete({
    minLength: 1,
    input: document.getElementById("address"),
    fetch: async function (text, update) {
        let website = text;
        text = text.toLowerCase();
        getHistory();
        suggestions = fullHistory.filter(n => n.label.toLowerCase().includes(text))
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i].label.length > 100) {
                suggestions[i].label = suggestions[i].label.slice(0, 100) + "..."
            }
        }
        if (text.includes(".com") || text.includes(".net") || text.includes(".org") || text.includes("www.") || text.includes("http")) {
            suggestions.unshift(Object.create({
                label: website,
                value: website
            }));
        } else if (text.startsWith("pocket://")) {
            suggestions.unshift(Object.create({label: website + " - System Page", value: website}));
        } else if (text.startsWith("file:///")) {
            suggestions.unshift(Object.create({label: website + " - Local File", value: website}));
        } else {
            let searchEngine;
            if (fs.existsSync(dataPath + "/data/engine.pocket")) searchEngine = await fs.readFileSync(dataPath + '/data/engine.pocket');
            else searchEngine = "https://duck.com/%s";
            suggestions.unshift(Object.create({
                label: website + " - Search",
                value: String(searchEngine).replace("%s", website.replace(" ", "+"))
            }));

        }
        var str = website.replace(/[^-()\d/*+.]/g, '');
        try {
            if (!isNaN(eval(str))) {
                suggestions.unshift(Object.create({
                    label: "= " + eval(str),
                    value: "https://google.com/search?q=" + encodeURIComponent(website)
                }));
            }
        } catch (err) {
        }
        update(suggestions);

    },
    onSelect: function (item) {
        document.getElementById("address").value = item.value;
        document.getElementById("go").click();
    }
});

const emittedOnce = (element, eventName) => new Promise(resolve => {
    element.addEventListener(eventName, event => resolve(event), {once: true})
})
let downloads = [];
let downloadItems = [];
electron.session.defaultSession.on('will-download', function (event, item, webContents) {
    if (downloads[item.getFilename()]) {
        item.stop();
        return;
    }
    document.getElementById("downloads").hidden = "";
    document.getElementById('downloads-list').innerHTML += "<button class='custom-dropdown-item' onclick='downloadSettings(`" + item.getFilename() + "`)'><span id='di-" + Object.keys(downloads).length + "'>" + item.getFilename() + "</span> - <span id='d-" + Object.keys(downloads).length + "'>Starting..</span></button>";
    downloads[item.getFilename()] = Object.keys(downloads).length;
    downloadItems[item.getFilename()] = item;

    item.on("updated", function (event, state) {
        if (state === 'progressing') {
            if (item.isPaused()) {
                document.getElementById("d-" + downloads[item.getFilename()]).innerHTML = "Paused";
            } else {
                if (item.getFilename() && document.getElementById("d-" + downloads[item.getFilename()])) {
                    document.getElementById("d-" + downloads[item.getFilename()]).innerHTML = Math.floor((100.0 * item.getReceivedBytes()) / item.getTotalBytes()) + "%";
                }
            }
        }
    })
    item.on("done", function (event, state) {
        if (state == "completed") {
            document.getElementById("d-" + downloads[item.getFilename()]).innerHTML = "Done!"
            downloads[item.getFilename()] = undefined;
            downloadItems[item.getFilename()] = undefined;
        }
    })
})
