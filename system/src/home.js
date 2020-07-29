const fs = require('fs');
const log = require('electron-log');

window.onload = function() {
    
    fs.readFile(__dirname + '/data/home.pocket', function (err, data) {
      if (err) {
         pocket.error("Couldn't load file: /system/data/home.pocket: " + err);
        throw err; 
      }
      try {
    document.getElementById("currentHome").innerHTML += "<b>" + data + "</b>";
      } catch(err) {
        pocket.error("Couldn't add currentHome URL");
        pocket.error("URL: " + data);
      }
    });    
    


}
function changeHomePage() {
var newHome = document.getElementById("home").value;

fs.writeFile(__dirname + '/data/home.pocket', newHome, function (err) {
    if (err) {
      
      throw err; 
    }

  });

require("electron").remote.getCurrentWindow().reload();
}
