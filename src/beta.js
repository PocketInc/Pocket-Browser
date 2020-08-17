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
//loadTheme();
