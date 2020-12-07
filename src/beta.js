/*
 * © 2020 - Pocket Inc.
 */

$("#toast").hide();
$("#toast").toast("hide");

$("#toast").on("hidden.bs.toast",function () {
    $("#toast").hide();
})

function betaNotify(title,body,hide) {
document.getElementById("notifyTitle").innerHTML = title;
document.getElementById("notifyBody").innerHTML = body;

    $("#toast").show();
    $("#toast").toast("show");

}
function loadTheme() {
var nbOfbuttons = document.getElementsByTagName("button").length;
for (var btns = 0; btns < nbOfbuttons; btns++) {
    document.getElementsByTagName("button")[btns].classList.remove("btn-light");
    document.getElementsByTagName("button")[btns].classList.add("btn-pbdark")
}
document.getElementById("nav").classList.remove("bg-light");
document.getElementById("nav").classList.add("bg-pbdark")
    document.getElementsByClassName("etabs-tabgroup")[0].classList.remove("bg-light")
    document.getElementsByClassName("etabs-tabgroup")[0].classList.add("bg-pbdark")
    document.body.classList.add("bg-pbdark");

    var nbOfTabs = document.getElementsByClassName("etabs-tab").length;
    for (var tabs = 0; tabs < nbOfTabs; tabs++) {
        document.getElementsByClassName("etabs-tab")[tabs].classList.add("tab-pbdark")
        document.getElementsByClassName("etabs-tab-button-close")[tabs].classList.add("tab-button-pbdark")
    }
document.getElementById("address").classList.add("bar-pbdark");
    document.getElementsByClassName("dropdown-menu")[0].classList.add("menu-pbdark");
    document.getElementsByClassName("dropdown-menu")[1].classList.add("menu-pbdark")
if (webDark == true) websiteDark();
}
function websiteDark() {
    tabGroup.eachTab(function (tab) {
        tab.webview.executeJavaScript("document.body.style.backgroundColor = 'black';\ndocument.body.style.color = 'white';")
    })
}
var dataPath = require("electron").remote.app.getPath("userData");

fs.readFile(dataPath + "/data/theme.pocket","utf8",function (err,data) {
    if (err) return console.log(err);
    if (data == "dark") {
        loadTheme()
        darkMode = true;
        pocket.info("Dark Theme is enabled")
    }
})
fs.readFile(dataPath + "/data/website.pocket","utf8",function (err,data) {
    if (err) return console.log(err);
    if (data == "dark") {
        websiteDark()
        webDark = true;
        pocket.info("Dark Website is enabled")
    }
})