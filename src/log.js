//not used yet.
window.pocket = function() {};
var logsPath = require("electron").remote.app.getPath("logs");
pocket.info = function(message) {

    require("fs").appendFile(logsPath + "/browser.log", "[INFO] " + message + "\n", function (err) {
        if (err) return console.log(err);
        console.log("[INFO] " + message);
    });
}
pocket.error = function (message) {
    require("fs").appendFile(logsPath + "/browser.log", "[ERR] " + message + "\n", function (err) {
        if (err) return console.log(err);
    console.error("[ERR] " + message)
    });
}
pocket.debug = function (message) {
    require("fs").appendFile(logsPath + "/debug.log", "[DEBUG] " + message + "\n", function (err) {
        if (err) return pocket.error(err);
    });
}

pocket.info("---STARTING---")