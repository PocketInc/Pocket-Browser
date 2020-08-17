/*
 The Official Pocket Browser Code,
 Created and Written by the Pocket, Inc.
 © 2020 Pocket Inc.
 github.com/PocketInc/Pocket-Browser
 */

// Require all external modules.
// NPM.
const electron = require("electron").remote
const fs = require("fs");
var linebyline = require("line-by-line");
//Variable used to save homePage URL.
var homePage;

// Log that browser is starting.
pocket.info("Starting browser..")

//the webview variable defaults to mainTab webview.
var webview = mainTab.webview;
//Online State variable to track if internet connection is available.
var onlineState = true;


// Function to go back in active tab.
function goBack() {
    // get the active tab
    var getTab = tabGroup.getActiveTab();
    //if the webview can go back.
    if(getTab.webview.canGoBack()) {
        //log, then go back and change address.
        pocket.info("Going back on request.")
        getTab.webview.goBack();
        changeAddress(getTab);
    }
}
// Function to go forward in active tab.
function goForward() {
    // get the active tab
    var getTab = tabGroup.getActiveTab();
    //if the webview can go forward.
    if(getTab.webview.canGoForward()) {
        //log, go forward and change address.
        pocket.info("Going forward on request.")
        getTab.webview.goForward();
        changeAddress(getTab);
    }
}

//function to go to homepage in active tab.
function goHome() {
    // get active tab.
    var getTab = tabGroup.getActiveTab();
    //log, read the file containing the home page url, then if error, then load duck.com. otherwise load the url.
    pocket.info("Going home on request.")
    fs.readFile(__dirname + '/system/data/home.pocket', "utf8", function (err, data) {
        if (err || data == "") {
            pocket.error("couldn't read file: ./system/data/home.pocket: " + err)
            getTab.webview.loadURL("https://duck.com")
            throw err;
        }
        homePage=data;
        getTab.webview.loadURL(data);

    });
}

//function to reload active  tab.
function reloadPage() {
    var getTab = tabGroup.getActiveTab();
    pocket.info("Reloading on request..")
    getTab.webview.reload();
}

//function to change favicon. powered by the favicon updated event.
//event code can be found in events.js

function changeFavicon(event,tab) {
    //try, if catched error log it.
    try {
        pocket.info("Changing Favicon")
        //event.favicons[0] = the favicon url taken from event.
        tab.setIcon(event.favicons[0])
    } catch(err) {
        pocket.error("Error occured while changing favicon: " + err)
    }
}
//function to change title.
//powered by the title updated event in events.js
function changeTitle(target,event) {
//try, if catched error, log it.
    try {
        pocket.info("Changing Title.")

        //if the title is empty, then do nothing.
        //if title is longer than 30 chars, then cut only 30 chars from it and set them as title.
        //otherwise, set title.

        var viewTitle = event.title;
        if (viewTitle === "") {
            //nothing for now
            pocket.info("Empty title.")
            if (target.webview.getTitle() != "") {
                if (target.webview.getTitle().length > 20) {
                    pocket.info("Warning: title is long.")
                    target.setTitle(target.webview.getTitle().slice(0,20) + "..") //set tab title.
                    target.tabElements.title.title = target.webview.getTitle();
                    if (tabGroup.getActiveTab() == target) { // if the active tab is the tab that needs title change.
                        electron.getCurrentWindow().title = target.webview.getTitle() + " - Pocket Browser" // then change the window title.
                    }
                } else {
                    if (tabGroup.getActiveTab() == target) {
                        electron.getCurrentWindow().title = target.webview.getTitle() + " - Pocket Browser"
                    }
                    target.setTitle(target.webview.getTitle());
                }
            }
        } else {
            if (viewTitle.length > 20) {
                pocket.info("Warning: title is long.")
                target.setTitle(viewTitle.slice(0,20) + "..") //set tab title.
                target.tabElements.title.title = viewTitle;
                if (tabGroup.getActiveTab() == target) { // if the active tab is the tab that needs title change.
                    electron.getCurrentWindow().title = viewTitle + " - Pocket Browser" // then change the window title.
                }
            } else {
                if (tabGroup.getActiveTab() == target) {
                    electron.getCurrentWindow().title = viewTitle + " - Pocket Browser"
                }
                target.setTitle(viewTitle);
            }
        }
    } catch(err) {
        pocket.error("Log occured while changing title: " + err);
    }
}

//function to load DevTools.
//button in tool menu. (Developer Tools)
function loadDev() {
    //get active tab, if tools are openned, then close them. otherwise open them.
    var getTab = tabGroup.getActiveTab();
    pocket.info("Toggling DevTools from " + getTab.webview.isDevToolsOpened() + " to " + !getTab.webview.isDevToolsOpened())
    if (getTab.webview.isDevToolsOpened()) {
        getTab.webview.closeDevTools();
    } else {
        getTab.webview.openDevTools();
    }
}

//function when no internet detected.
function wentOffline() {
    //if onlineState is true (so there was internet before)
    //then log it, and unhide the wifi icon and send notification.
    if (onlineState === true) {
        pocket.info("Warning: Connection lost.")
        onlineState = false;
        document.getElementById("wifi").hidden = "";

        betaNotify("Connection Lost!","Please check your Internet Connection.")

    }
}

//function when internet is detected.

function backOnline() {
    //if onlineState is false (so there was no internet before)
    //then log it, and hide the wifi icon and send notification.

    if (onlineState === false) {
        pocket.info("Warning: Connection is back.")
        onlineState=true;
        document.getElementById("wifi").hidden = "hidden";

        betaNotify("Connection is back!","You're reconnected to the Internet.")
    }
}

var loadingSystemPage = false; // variable used to identify if a system page is being loaded.

//function loaded when person clicks in "Go" button in browser.
function loadURL() {
    //get the value of the web address input field
    var url = document.getElementById("address").value;
    //if the url is a system page (pocket://(thing)), then load system page.
    //otherwise, get active tab and identify if url is https, then load page.
    //if url is http, then load url.
    //if url is file:///, then load local file.
    // if none, then search using search engine provided in settings.

    if (isSystemPage(url)) {
        pocket.info("Loading system page: " + url);
        loadingSystemPage=true;
        openSystemPage(url.slice(9).toLowerCase());
    } else {
        var getTab = tabGroup.getActiveTab();
        pocket.info("Attempting to load URL: " + url);
        if (url.slice(0, 8).toLowerCase() === "https://") {
            pocket.info("Loading via HTTPS")
            loadingSystemPage=false;
            getTab.webview.loadURL(url);
        } else if (url.slice(0, 7).toLowerCase() === "http://") {
            pocket.info("Loading via HTTP")
            loadingSystemPage=false;
            getTab.webview.loadURL(url);
        } else if (url.slice(0, 8).toLowerCase() === "file:///") {
            pocket.info("Loading local file")
            loadingSystemPage=false;
            getTab.webview.loadURL(url);
        } else {
            pocket.info("Loading via Search.")
            loadingSystemPage=false;
            fs.readFile(__dirname + '/system/data/engine.pocket', function (err, data) {
                if (err) {
                    pocket.error("Couldn't read file: ./system/data/engine.pocket: " + err)
                    throw err;
                }
                getTab.webview.loadURL(String(data).replace("%s",url));
                pocket.info("Searched via search engine: " + data)
            });
        }


    }
}
//function used in page loaded event.

function changeAddress(target,event) {
    //if loading system page, then do nothing.
    //otherwise, if url is http, send warn notification.
    // then turn off the loading gif, and set the address bar value if target tab is same as active one.
    if (loadingSystemPage === true) {
        pocket.info("No changing address. system page.")
        loadingSystemPage=false;
    } else {
        if (event.url) {
            if (event.url.slice(0,8) === "https://") {
                var protocol = "https";
                pocket.info("Changed Address, HTTPS Protocol.")
            } else if (event.url.slice(0, 7) === "http://") {
                pocket.info("Changed Address, HTTP Protocol.")
                betaNotify("In-Secure Webpage!","Don't write any personal information.")
            var protocol = "http"
            } else {
                var protocol = "";
                pocket.info("Changed Address, Unknown Protocol.")
            }
            checkPerms(target,event)
            showCookies(event);
            checkHistory(event.url)
            target.setIcon("");

            if (tabGroup.getActiveTab() === target) {
                pocket.info("Target tab is active.");
                changeSecureState(protocol)
                    if ($("#address").is(":focus")) return;
                    document.getElementById("address").value = event.url;


            }
        }


    }


}
// function used when page starts loading.
function changeState(target) {
    if (target.webview.isLoadingMainFrame()) {
        pocket.info("Changing reloading state to: true by function")
        target.setIcon("./external/loading.gif");
    }

}
function resetState(target) {
if (!target.webview.isLoadingMainFrame()) {
    pocket.info("Resetting reloading state to: false by function");
    target.setIcon("");
}
}

function changeSecureState(state) {
    try {

        if (state) {
            pocket.info("Changing Secure state to " + state);
            document.getElementById("shieldButton").hidden = false;
            if (state === "https") {
                document.getElementById("shield").src = "./node_modules/bootstrap-icons/icons/shield-check.svg"
                document.getElementById("shield").title = "Secure";
                document.getElementById("secureText").innerHTML = "Secure connection via <b>HTTPS</b>";
                document.getElementById("secureText").style.color = "darkgreen";
            } else if (state === "http") {
                document.getElementById("shield").src = "./node_modules/bootstrap-icons/icons/shield-exclamation.svg"
                document.getElementById("shield").title = "In-Secure";
                document.getElementById("secureText").innerHTML = "In-secure connection via <b>HTTP</b>";
                document.getElementById("secureText").style.color = "red";

            } else {
                document.getElementById("secureText").innerHTML = "";

                document.getElementById("shieldButton").hidden = true;
                document.getElementById("shield").title = "";
            }
        } else {
            document.getElementById("secureText").innerHTML = "";

            document.getElementById("shieldButton").hidden = true;
            document.getElementById("shield").title = "";
        }

    } catch(err) {
        pocket.error("IMP! Couldn't change secure state");
    }
}

function changeSitePerms(perm) {
var getTab = tabGroup.getActiveTab();
if (perm === 0) {
    //notifications
 var notPerm = confirm("Do you want to give notifications access to current website?");

    if (getTab.webview.src.slice(0,8) === "https://") {
        var start = getTab.webview.src.slice(8);
    } else if (getTab.webview.src.slice(0,7) === "http://") {
        var start = getTab.webview.src.slice(7);
    } else {
        var start = getTab.webview.src;
    }
    if (start.slice(0,4) === "www.") {
        start = start.slice(4)
    }
    if (start.substr(0, start.indexOf('/'))) {
        var address = start.substr(0, start.indexOf('/'));
    }

 if (notPerm === true) {
     fs.writeFile(__dirname + '/system/data/perms/not/' + address, 'true', function (err) {
         if (err) return pocket.info(err);

         reloadPage();
     });
 } else {

     fs.writeFile(__dirname + '/system/data/perms/not/' + address, 'false', function (err) {
         if (err) return pocket.info(err);
         getTab.webview.executeJavaScript("window.Notification = null")

         betaNotify("Notifications Disabled!","You've successfully disabled notifications for current website.")
     });

 }
} else if (perm === 1) {
    //popups
} else if (perm === 2) {
    //js
getTab.webview.webpreferences = "javascript=no";
}

}
function checkPerms(target,event) {

    if (event.url.slice(0, 8) === "https://") {
        var start = event.url.slice(8);
    } else if (event.url.slice(0, 7) === "http://") {
        var start = event.url.slice(7);
    } else {
        var start = event.url;
    }
    if (start.slice(0, 4) === "www.") {
        start = start.slice(4)
    }
    if (start.substr(0, start.indexOf('/'))) {
        var address = start.substr(0, start.indexOf('/'));
    }
    pocket.info("Changing perms of: " + address);
    //notifications:
    fs.access(__dirname + '/system/data/perms/not/' + address, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
            pocket.info("Perms File not found/not readable: " + address)
            return false;
        } else {
            fs.readFile(__dirname + '/system/data/perms/not/' + address, "utf8", function (err, data) {
                if (err) return pocket.error(err);
                if (data == "false") {
                    pocket.info("Data is false");
                    target.webview.executeJavaScript("window.Notification = null").then(r => function () {
                        pocket.info("Done Successfully")
                    })
                } else pocket.info("Data is not false")
            })
        }
    });



}

//ToDo: Continue Cookie Manager.
function showCookies(event) {
    var domains = {}
    electron.session.defaultSession.cookies.get({ url: event.url })
        .then((cookies) => {
            document.getElementById("cookies").innerHTML = "";
            for(var i = 0;i<cookies.length;i++) {
                if (!domains.i) {
                    domains.i = true;
                    document.getElementById("cookies").innerHTML += "<p class='dropdown-item'>" + cookies[i].domain + "</p>";
                }
            }
        }).catch((error) => {
        pocket.info(error)
    })
}
function addToHistory(url) {
    fs.appendFile(__dirname + '/system/data/history.pocket', url + "\n", function (err) {
        if (err) return pocket.info(err);

    });
}

function checkHistory(text) {
    var bool = false;
    var fileLbl = new linebyline(__dirname + "/system/data/history.pocket");
    fileLbl.on("line", function (line) {
        if (text === line) {
            bool = true;
        }
    })
  fileLbl.on("end",function () {
if (bool === false) {
    addToHistory(text);
}
  })

}
var fullHistory = [];
function getHistory() {


    const fileRead = new linebyline(__dirname + "/system/data/history.pocket")

    var size = 0;
    fileRead.on("line", function (line) {
        fullHistory[size] = {
            label: line,
            value: line
        }
        size++;
    })
}

function findInPage() {
    document.getElementById("toasts").innerHTML = "<div id=\"findinpage\" class=\"toast\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" data-autohide=\"false\">\n" +
        "            <div class=\"toast-header\">\n" +
        "                <img src=\"system/favicon.ico\" class=\"rounded mr-2\" alt=\"Pb\" width=\"25\" height=\"25\">\n" +
        "                <strong class=\"mr-auto\" id=\"findTitle\">Find in Page:</strong>\n" +
        "                <small id='findResults'></small>\n" +
        "                <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\">\n" +
        "                    <span aria-hidden=\"true\">&times;</span>\n" +
        "                </button>\n" +
        "            </div>\n" +
        "            <div class=\"toast-body bg-light\" id=\"findBody\">\n" +
        "\n<input id='textFind'>\n<button class='btn btn-light' onclick='find()'>Find</button>" +
        "            </div>\n" +
        "        </div>\n" + document.getElementById("toasts").innerHTML;

    $("#findinpage").toast("show");
    $("#findinpage").show();

    $("#findinpage").on("hidden.bs.toast", function () {
        for (var i = 0;i<tabGroup.getTabs().length;i++) {
            tabGroup.getTabs()[i].webview.stopFindInPage("clearSelection");
        }
    })
}
function find() {
    var text = document.getElementById("textFind").value;

    tabGroup.getActiveTab().webview.findInPage(text)
}
function zoom(type) {
    if (type == "add") {
        var newZoom = tabGroup.getActiveTab().webview.getZoomLevel() + 0.5;
        tabGroup.getActiveTab().webview.setZoomLevel(newZoom)
    } else if (type == "minus") {
        var newZoom = tabGroup.getActiveTab().webview.getZoomLevel() - 0.5;
        tabGroup.getActiveTab().webview.setZoomLevel(newZoom)
    }
    betaNotify("Pocket Browser","Zoom Level: " + tabGroup.getActiveTab().webview.getZoomLevel())
}