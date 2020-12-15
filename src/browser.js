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
var homePage = "https://duck.com";

// Log that browser is starting.
pocket.info("Pocket Browser - v" + browserVersion)

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
        getTab.webview.goBack();
    }
}
// Function to go forward in active tab.
function goForward() {
    // get the active tab
    var getTab = tabGroup.getActiveTab();
    //if the webview can go forward.
    if(getTab.webview.canGoForward()) {
        //log, go forward and change address.
        getTab.webview.goForward();
    }
}

//function to go to homepage in active tab.
function goHome() {
    // get active tab.
    var getTab = tabGroup.getActiveTab();
    let dataPath = electron.app.getPath("userData");

    //log, read the file containing the home page url, then if error, then load duck.com. otherwise load the url.

    fs.access(dataPath + "/data/home.pocket", fs.F_OK, (err) => {
        if (err) {
            homePage = "https://duck.com";
            getTab.webview.loadURL("https://duck.com")
            pocket.error("Error: " + err + ": ./userData/data/home.pocket")

        } else {
            fs.readFile(dataPath + '/data/home.pocket', "utf8", function (err, data) {
                if (err || data == "") return;
                else {
                    homePage = data;
                    getTab.webview.loadURL(data);
                }

            });
        }
    })

}
//function to reload active  tab.
function reloadPage() {
    var getTab = tabGroup.getActiveTab();
    getTab.webview.reload();
}

//function to change favicon. powered by the favicon updated event.
//event code can be found in events.js

function changeFavicon(event,tab) {
    //try, if catched error log it.
    try {
        //event.favicons[0] = the favicon url taken from event.
        tab.setIcon(event.favicons[0])
    } catch(err) {
        pocket.error("Error " + err + ": while changing favicon")
        pocket.error("Favicon Data: " + event.favicons[0])
    }
}
//function to change title.
//powered by the title updated event in events.js
function changeTitle(target,event) {
//try, if catched error, log it.
    try {

        //if the title is empty, then do nothing.
        //if title is longer than 30 chars, then cut only 30 chars from it and set them as title.
        //otherwise, set title.

        var viewTitle = event.title;
        if (viewTitle === "") {
            //nothing for now
            pocket.info("Title is empty")
            if (target.webview.getTitle() != "") {
                if (target.webview.getTitle().length > 20) {
                    pocket.info("Warning: Title is long.")
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
                pocket.info("Warning: Title is long.")
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
        pocket.error("Error " + err + ": while changing title");
    }
}

//function to load DevTools.
//button in tool menu. (Developer Tools)
function loadDev() {
    //get active tab, if tools are openned, then close them. otherwise open them.
    var getTab = tabGroup.getActiveTab();
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
        reloadPage()

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
        //openSystemPage(url.slice(9).toLowerCase());
        var getTab = tabGroup.getActiveTab();
        getTab.webviewAttributes.nodeIntegration = true;
        getTab.webview.src = "./system/" + url.slice(9).toLowerCase() + ".html"

    } else {
        var getTab = tabGroup.getActiveTab();
        getTab.webview.nodeIntegration = false;
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
            loadingSystemPage = false;
            getTab.webview.loadURL(url);
        } else if (url.toLowerCase().includes(".com") || url.toLowerCase().includes(".net") || url.toLowerCase().includes(".org") | url.toLowerCase().includes(".ml")) {
            pocket.info("Loading a website with no protocol. (HTTP)")
            loadingSystemPage = false;
            getTab.webview.loadURL("http://" + url);
        } else {
            pocket.info("Loading via Search.")
            loadingSystemPage=false;
            var dataPath = require("electron").remote.app.getPath("userData");

            fs.readFile(dataPath + '/data/engine.pocket', function (err, data) {
                if (err) {
                    pocket.error("Error " + err + ": ./userData/data/engine.pocket")
                    throw err;
                }
                getTab.webview.loadURL(String(data).replace("%s",url));
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
        loadingSystemPage=false;
    } else {
        if (event.url) {
            if (event.url.slice(0,8) === "https://") {
                var protocol = "https";
            } else if (event.url.slice(0, 7) === "http://") {
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
        target.setIcon("./external/loading.gif");
    }

}
function resetState(target) {
if (!target.webview.isLoadingMainFrame()) {
    target.setIcon("");
}
}

function changeSecureState(state) {
    try {

        if (state) {
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
        pocket.error("Error " + err + ": while changing secure state");
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
     var dataPath = require("electron").remote.app.getPath("userData");

     fs.writeFile(dataPath + '/data/perms/not/' + address, 'true', function (err) {
         if (err) return pocket.error(err);

         reloadPage();
     });
 } else {
     var dataPath = require("electron").remote.app.getPath("userData");

     fs.writeFile( dataPath + '/data/perms/not/' + address, 'false', function (err) {
         if (err) return pocket.error(err);
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
    //notifications:
    var dataPath = require("electron").remote.app.getPath("userData");

    fs.access(dataPath + '/data/perms/not/' + address, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
            pocket.info("Perms File not found/not readable: " + address)
            return false;
        } else {
            fs.readFile(dataPath + '/data/perms/not/' + address, "utf8", function (err, data) {
                if (err) return pocket.error(err);
                if (data == "false") {
                    target.webview.executeJavaScript("window.Notification = null").then(r => function () {
                        pocket.info("Turning off notifications")
                    })
                }
            })
        }
    });



}

//ToDo: Continue Cookie Manager.

var allCookies = [];
function showCookies(event) {
    allCookies = [];
    var url = event.url;
    electron.session.defaultSession.cookies.get({ url: url })
        .then((cookies) => {
            document.getElementById("cookies").innerHTML = "";
            for(var i = 0;i<cookies.length;i++) {
                //if (!domains.i) {
                //    domains.i = true;
                allCookies[i] = cookies[i];
                allCookies[i].url = url;
                    document.getElementById("cookies").innerHTML += "<p class='dropdown-item' onclick='loadCookie(" + i + ")'>" + cookies[i].name + "</p>";
                //}
            }
        }).catch((error) => {
        pocket.error("Error " + error + ": while showing cookies.")
    })
}
function loadCookie(cookie) {
   var delCookie = confirm("Name: " + allCookies[cookie].name + "\nDomain: " + allCookies[cookie].domain + "\nPath: " + allCookies[cookie].path + "\nExpires: " + allCookies[cookie].expirationDate + "\nValue:\n" + allCookies[cookie].value + "\n\nDelete Cookie?")

    if (delCookie == true) {
        electron.session.defaultSession.cookies.remove(allCookies[cookie].url, allCookies[cookie].name)
    }
}
var dataPath = require("electron").remote.app.getPath("userData");
function addToHistory(url) {
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }
    if(fs.existsSync(dataPath + "/data/history.pocket")) {
        fs.appendFile(dataPath + "/data/history.pocket", url + "\n", function (err) {
            if (err) {
                pocket.error(err)
            }
        });
    } else {
        fs.writeFile(dataPath + "/data/history.pocket",url + "\n",function (err) {
            if (err) pocket.error(err)
        })
    }
}

function checkHistory(text) {
    var bool = false;
    var dataPath = require("electron").remote.app.getPath("userData");
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }

    if(!fs.existsSync(dataPath + "/data/history.pocket")) {
        fs.writeFile(dataPath + "/data/history.pocket",text + "\n",function (err) {
            if (err) pocket.error(err);
        })

    } else {
        var fileLbl = new linebyline(dataPath + "/data/history.pocket");
        fileLbl.on("line", function (line) {
            if (text === line) {
                bool = true;
            }
        })
        fileLbl.on("end", function () {
            if (bool === false) {
                addToHistory(text);
            }
        })
    }
}
var fullHistory = [];
function getHistory() {

    var dataPath = require("electron").remote.app.getPath("userData");

    const fileRead = new linebyline(dataPath + "/data/history.pocket")

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