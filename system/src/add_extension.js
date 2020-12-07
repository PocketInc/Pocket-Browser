/*
 * © 2020 - Pocket Inc.
 */
const fs = require("fs");
const electron = require("electron");
const lbl = require("line-by-line");
var dataPath = electron.remote.app.getPath("userData");
function addExtension() {

    var path = document.getElementById("path").files[0];
    if (!fs.existsSync(dataPath + "/data")) {
        fs.mkdirSync(dataPath + "/data");
    }
    if (!fs.existsSync(dataPath + "/data/extensions.pocket")) {
        fs.writeFile(dataPath + "/data/extensions.pocket", path.path.slice(0, -path.name.length - 1) + "\n",function (err) {
            if (err) console.error(err);
            console.log("Done")
            path.text().then(function (data) {
                var file = JSON.parse(data);
                if (path.name != "extension.json") return alert('Please select the "extension.json" file!')
                alert('Successfully Installed: "' + file.name + "'")

            })
            electron.remote.getCurrentWindow().loadFile(__dirname + "/extensions.html")


        });
    } else {

        const readlbl = new lbl(dataPath + "/data/extensions.pocket");
        let isAlreadyThere = false;
        readlbl.on("line", function (line) {
            if (line == path.path.slice(0, -path.name.length - 1)) isAlreadyThere = true;
        })
        readlbl.on("end", function () {
            if (isAlreadyThere == true) {
                path.text().then(function (data) {
                    var file = JSON.parse(data);
                    alert('"' + file.name + '" is already installed!')
                })
            } else {

                path.text().then(function (data) {
                    var file = JSON.parse(data);
                    if (path.name != "extension.json") return alert('Please select the "extension.json" file!')
                    alert('Successfully Installed: "' + file.name + "'")

                    fs.appendFileSync(dataPath + "/data/extensions.pocket", path.path.slice(0, -path.name.length - 1) + "\n", function (err) {
                        if (err) console.log(err);
                        console.log("Done")
                    })

                    electron.remote.getCurrentWindow().loadFile(__dirname + "/extensions.html")
                })
            }
        })
    }

}