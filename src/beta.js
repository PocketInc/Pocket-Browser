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
document.getElementsByClassName("btn").item(item => function () {
    item.style.backgroundColor = "red!important"
})
}
var dataPath = require("electron").remote.app.getPath("userData");

fs.readFile(dataPath + "/data/theme.pocket","utf8",function (err,data) {
    if (err) return console.log(err);
    if (data == "dark") {
        loadTheme()
    }
})