//not used yet.
window.pocket = function() {};
var logsPath = require("electron").remote.app.getPath("logs");
pocket.info = function(message) {

    require("fs").appendFile(logsPath + "/browser.log", message + "\n", function (err) {
        if (err) return console.log(err);
        console.log("Info: " + message);
    });
}
pocket.error = function (message) {
    require("fs").appendFile(logsPath + "/browser.log", "Error!  " + message + "\n", function (err) {
        if (err) return console.log(err);
    console.error("Error: " + message)
    });
}