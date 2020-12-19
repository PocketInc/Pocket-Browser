/*
Development
Bugs
 */
let page = 0;
function nextPage() {
    switch(page) {
        case 0:
    document.getElementById("title").innerHTML = "Data Collecting";
    document.getElementById("content").innerHTML = "Do you want to allow us to collect error data?"
    document.getElementById("btns").innerHTML = "<button style='float: right' onclick='errorData(0)'>No</button>\n<button style='float: right;' onclick='errorData(1)'>Yes</button>"
            page++;
            break;
        case 1:
            document.getElementById("btns").innerHTML = "<button style='float: right' onclick='nextPage()'>Next</button>";
            document.getElementById("title").innerHTML = "Development"
            document.getElementById("content").innerHTML = "This browser is currently in development and more features will come at later updates, please do not judge now!"
            page++;
            break;
        case 2:
            document.getElementById("title").innerHTML = "Bugs";
            document.getElementById("content").innerHTML = "Found any bug? Report it to us!<br><br><a href='emailto:support@pocket-inc.ml'>support@pocket-inc.ml</a>"
            document.getElementById("btns").innerHTML = "<button style='float: right' onclick='window.close()'>Finish</button>"
    }
}

function errorData(state) {
    const fs = require("fs");
    let dataPath = require("electron").remote.app.getPath("userData");
    if (!fs.existsSync( dataPath + "/data")) fs.mkdirSync(dataPath + "/data");

    if (state === 0) {
        fs.writeFileSync(dataPath + "/data/errors.pocket","false")
    } else if (state === 1) {
        fs.writeFileSync(dataPath + "/data/errors.pocket","true")
    }
    nextPage();
}