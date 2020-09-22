/*
 * &copy; 2020 - Pocket Inc.
 */

const lbl = require("line-by-line");
var dataPath = require("electron").remote.app.getPath("userData");

const historyRead = new lbl(dataPath + "/data/history.pocket");
var nbOfresults = 0;
historyRead.on("line",function (line) {
    if (line.length > 50) var title = line.slice(0,50) + "...";
    else var title = line;
document.getElementById("history").innerHTML = "<div style=\"border:1px solid #f8f9fa\">\n" +
    "    <a href='" + line + "' title='" + line + "'>" + title + "</a>\n" +
    "<b><button class='x' onclick='removeHistory(" + nbOfresults + ")'>x</button></b>" +
    "</div>" + document.getElementById("history").innerHTML;
nbOfresults++;
})
historyRead.on("end",function () {
document.getElementById("results").innerHTML = "Found <b>" + nbOfresults + "</b> Results!"
})
document.getElementById("history").addEventListener("click",function (event) {
event.preventDefault();
})
function removeHistory(nb) {
    var lineNb = 0;
    const historyDelete = new lbl(dataPath + "/data/history.pocket");

    historyDelete.on("line",function (line) {
     if (lineNb == nb) {
require("fs").readFile(dataPath + "/data/history.pocket","utf8",function (err,data) {
if (err) console.error(err);

const newHistory = data.replace(line + "\n","")
    require("fs").writeFile(dataPath + "/data/history.pocket",newHistory,function (err) {
if (err) console.error(err);
require("electron").remote.getCurrentWindow().reload();
    })
})
         lineNb++;
     } else {
         lineNb++;
     }
    })

}
