/*
 * © 2020 - Pocket Inc.
 */
const fs = require("fs");
var dataPath = require("electron").remote.app.getPath("userData");

function changeTheTheme() {
    var c1 = document.getElementById("c1").value;
    var c2 = document.getElementById("c2").value;

    if (c1 == "") c1 = "null";
    if (c2 == "") c2 = "null";

    fs.writeFile(dataPath + '/data/theme.pocket', c1 + "\n" + c2, function (err) {
        if (err) return console.log(err);
        require("electron").remote.BrowserWindow.getAllWindows().forEach(window => {
            window.reload();
        })
    });
}

