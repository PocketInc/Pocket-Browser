const fs = require('fs');
var dataPath = require("electron").remote.app.getPath("userData");
window.onload = function() {
    
    fs.readFile(dataPath + '/data/home.pocket', function (err, data) {
      if (err) {
         console.error("Error " + err + ": /userData/data/home.pocket");
         return document.getElementById("currentHome").innerHTML += "<b>https://duck.com</b>";
      }
      try {
    document.getElementById("currentHome").innerHTML += "<b>" + data + "</b>";
      } catch(err) {
        console.error("Error " + err + ": inserting current home.");
        console.error("Home URL: " + data);
      }
    });    
    


}
function changeHomePage() {
var newHome = document.getElementById("home").value;
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }
fs.writeFile(dataPath + '/data/home.pocket', newHome, function (err) {
    if (err) {
      throw err;
    }

  });

require("electron").remote.getCurrentWindow().reload();
}
