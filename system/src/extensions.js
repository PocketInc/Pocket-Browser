/*
 * © 2020 - Pocket Inc.
 */
const fs = require("fs");

function toggleTheme() {
var value = document.getElementById("theme").checked;
if (value == true) var theme = "dark";
else var theme = "light";

    fs.writeFile(__dirname + '/data/theme.pocket', theme, function (err) {
        if (err) return console.log(err);
    });
}
function toggleAdb() {
    var value = document.getElementById("ad").checked;

        fs.writeFile(__dirname + '/data/adb.pocket', value, function (err) {
            if (err) return console.log(err);
        });

}
fs.readFile(__dirname + "/data/adb.pocket","utf8",function (err,data) {
    if (err) return console.log(err);
    if (data == "true") {
        document.getElementById("ad").checked = true;
    }
})
fs.readFile(__dirname + "/data/theme.pocket",function (err,data) {
    if (err) return console.log(err);
    if (data == "dark") {
        document.getElementById("theme").checked = true;
    }
})