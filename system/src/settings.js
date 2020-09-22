const fs = require('fs');
var dataPath = require("electron").remote.app.getPath("userData");

function getSettings() {
    fs.readFile(dataPath + '/data/engine.pocket', function (err, data) {
      if (err) {
          console.error("Error " + err + ": /userData/data/engine.pocket")
          return document.getElementById("currentEngine").innerHTML += "<b>No Search Engine</b>"
      }
      try {
      
      var engine = String(data).replace("%s","<u>SearchTerm</u>");
    document.getElementById("currentEngine").innerHTML += "<b>" + engine + "</b>";
        
      } catch(err) {
          console.error("Error " + err + ": while getting engine data");
          console.error("Normal: " + data);
          console.error("With Cut: " + engine)
      }
    });    
}



function changeSearchEngine() {
    if (!fs.existsSync(dataPath + "/data")){
        fs.mkdirSync(dataPath + "/data");
    }

var newEngine = document.getElementById("engine").value;

fs.writeFile(dataPath + '/data/engine.pocket', newEngine, function (err) {
    if (err) {
      throw err; 
    }

  });

require("electron").remote.getCurrentWindow().reload();
}
