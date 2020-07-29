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
function findInPage() {
document.getElementById("toasts").innerHTML = "<div id=\"findinpage\" class=\"toast\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" data-autohide=\"false\">\n" +
    "            <div class=\"toast-header\">\n" +
    "                <img src=\"icon.ico\" class=\"rounded mr-2\" alt=\"Pb\" width=\"25\" height=\"25\">\n" +
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
function changeTheme(hexColor, hexColor2,save) {
var allBtns = document.getElementsByClassName("btn-light");

for (var i = 0;i<allBtns.length;i++) {
    allBtns.item(i).style = "background-color: " + hexColor + "!important;border: 0.5px solid black";
    }
document.getElementById("address").style = "background-color: " + hexColor2 + "!important";

document.getElementById("nav").style = "background-color: " + hexColor2 + "!important";

document.getElementById("tabgroup").style = "background-color: " + hexColor2 + "!important"

    var allTabs = document.getElementsByClassName("etabs-tab");
    for (var i = 0;i<allTabs.length;i++) {
        allTabs.item(i).style = "background-color: " + hexColor + "!important";
    }
    if (save === true) {
        fs.writeFile(__dirname + '/system/data/theme.pocket', hexColor + "\n" + hexColor2, function (err) {
            if (err) return pocket.info(err);
            betaNotify("Pocket Browser", "Theme is successfully changed!");
        });
    }
}
function loadTheme() {
const themeReader = new linebyline(__dirname + "/system/data/theme.pocket");
var themeNb = 0;
var hexColor;
var hexColor2
themeReader.on("line",function (line) {
if (themeNb == 0)  {
     hexColor = line;
    themeNb++;
    pocket.info(line)
} else if (themeNb == 1) {
     hexColor2 = line;
     pocket.info("2 " + line)
}

})

themeReader.on("end",function () {
    if (hexColor == "null" || hexColor2 == "null") return;
    pocket.info(hexColor + " " + hexColor)
changeTheme(hexColor,hexColor2,false)
})
}
function deleteTheme() {
    var allBtns = document.getElementsByClassName("btn-light");

    for (var i = 0;i<allBtns.length;i++) {
        allBtns.item(i).style = "";
    }
    document.getElementById("address").style = "";

    document.getElementById("nav").style = "";

    document.getElementById("tabgroup").style = ""

    var allTabs = document.getElementsByClassName("etabs-tab");
    for (var i = 0;i<allTabs.length;i++) {
        allTabs.item(i).style = "";
    }

        fs.writeFile(__dirname + '/system/data/theme.pocket', "null\nnull", function (err) {
            if (err) return pocket.info(err);
            betaNotify("Pocket Browser", "Theme is successfully removed!");
        });

}
loadTheme();
