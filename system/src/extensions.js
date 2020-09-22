/*
 * © 2020 - Pocket Inc.
 */
const fs = require("fs");
var dataPath = require("electron").remote.app.getPath("userData");

function toggleTheme() {
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }

var value = document.getElementById("theme").checked;
if (value == true) var theme = "dark";
else var theme = "light";

    fs.writeFile(dataPath + '/data/theme.pocket', theme, function (err) {
        if (err) return console.log(err);
    });
}
function toggleAdb() {
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }
    var value = document.getElementById("ad").checked;

        fs.writeFile(dataPath + '/data/adb.pocket', value, function (err) {
            if (err) return console.log(err);
        });

}
fs.readFile(dataPath + "/data/adb.pocket","utf8",function (err,data) {
    if (err) return console.log(err);
    if (data == "true") {
        document.getElementById("ad").checked = true;
    }
})
fs.readFile(dataPath + "/data/theme.pocket",function (err,data) {
    if (err) return console.log(err);
    if (data == "dark") {
        document.getElementById("theme").checked = true;
    }
})