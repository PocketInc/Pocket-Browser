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
        document.getElementById("text").innerHTML = "<b>Note:</b> Restart browser to take effect.";
    });
}
function toggleWebsite() {
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }

    var value = document.getElementById("website").checked;
    if (value == true) var theme = "dark";
    else var theme = "light";

    fs.writeFile(dataPath + '/data/website.pocket', theme, function (err) {
        if (err) return console.log(err);
        document.getElementById("text").innerHTML = "<b>Note:</b> Restart browser to take effect.";
    });
}
function toggleAdb() {
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }
    var value = document.getElementById("ad").checked;

        fs.writeFile(dataPath + '/data/adb.pocket', value, function (err) {
            if (err) return console.log(err);

            document.getElementById("text").innerHTML = "<b>Note:</b> Restart browser to take effect.";
        });

}
function removeExtension(id) {
    const readanotherlbl = new lbl(dataPath + "/data/extensions.pocket");
    var lineNB = 0;
    readanotherlbl.on("line", function (line) {
        lineNB++;
        if (lineNB == id) {
            require("fs").readFile(dataPath + "/data/extensions.pocket", "utf8", function (err, data) {
                if (err) console.error(err);

                const newExtensions = data.replace(line + "\n", "")
                require("fs").writeFile(dataPath + "/data/extensions.pocket", newExtensions, function (err) {
                    if (err) console.error(err);
                    require("electron").remote.getCurrentWindow().reload();
                })
            })
        }
    })
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
fs.readFile(dataPath + "/data/website.pocket",function (err,data) {
    if (err) return console.log(err);
    if (data == "dark") {
        document.getElementById("website").checked = true;
    }
})

const lbl = require("line-by-line");
const readlbl = new lbl(dataPath + "/data/extensions.pocket");
var lineNB = 0;
readlbl.on("line",function (line) {
    lineNB++;
    fs.readFile(line + "/extension.json","utf8",function (error,data) {
        if (error) console.error(error);

        var fileData = JSON.parse(data)
        document.getElementById("installed").innerHTML += "<p>" + fileData.name + " <input checked='true' type='checkbox' onchange='removeExtension(" + lineNB + ")'></p> \n";
    })
})