const fetch = require("node-fetch");
const fs = require("fs");
let dataPath = require("electron").remote.app.getPath("userData");
let data;
let opts;
async function getSync() {
    if (localStorage.getItem('login')) {
        let login = JSON.parse(localStorage.getItem('login'));
    opts = {
        headers: {
            cookie: 'PHPSESSID=' + login.token
        }
    };
let state = await fetch("https://pocket-inc.ml/api/browser/logged.php?redirect=browser",opts).then(response => response.json());

if (state.state === "success") {
    data = await fetch("https://pocket-inc.ml/api/browser/get_data.php",opts).then(response => response.json());
    document.getElementById("sync").innerHTML = "<small>Logged in: <b>" + state.user + "</b></small><br><small>Latest Sync: <b>" + data.latest + "</b></small><br><br><button onclick='Sync()'>Sync</button> <button onclick='loadSync()'>Load</button>";
} else if(state.state === "error") {
        document.getElementById("sync").innerHTML = "<p>Email:<br><input id='em' type='email'></p><p>Password:<br><input id='pas' type='password'></p><button onclick='login()'>Login</button>"
}
    } else {
        document.getElementById("sync").innerHTML = "<p>Email:<br><input id='em' type='email'></p><p>Password:<br><input id='pas' type='password'></p><button onclick='login()'>Login</button>"

    }
}
async function login() {
    document.getElementById("info").innerHTML = "Logging..";
    document.getElementById("info").style.color = "black";
        let email = document.getElementById("em").value;
        let pass = document.getElementById("pas").value;
    const { URLSearchParams } = require('url');

    const params = new URLSearchParams();
    params.append('em', email);
    params.append('pas',pass)
    let res = await fetch('https://pocket-inc.ml/login/log.php?redirect=browser', { method: 'POST', body: params})
        .then(res => res.json())
    console.log(res)
    if (res.state === "success") {
        localStorage.setItem("login",JSON.stringify({token: res.token}))
        location.reload();
    }
    else if (res.state === "error") {
        document.getElementById("info").innerHTML = "Invaild Account!"
        document.getElementById("info").style.color = "red";
    }
}
function loadSync() {
if (data.data['home']) fs.writeFileSync(dataPath + "/data/home.pocket",data.data['home']);
if (data.data['search']) fs.writeFileSync(dataPath + "/data/engine.pocket",data.data['search'])
if (data.data['adb']) fs.writeFileSync(dataPath + "/data/adb.pocket",data.data['adb']);
if (data.data['theme']) fs.writeFileSync(dataPath + "/data/theme.pocket",data.data['theme'])
if (data.data['website']) fs.writeFileSync(dataPath + "/data/website.pocket",data.data['website'])
    console.log("Done!")
    document.getElementById("info").innerHTML = "Done!";
    document.getElementById("info").style.color = "black";
}
function Sync() {
if (fs.readFileSync(dataPath + "/data/home.pocket")) fetch("https://pocket-inc.ml/api/browser/save_data.php?type=home&data=" + fs.readFileSync(dataPath + "/data/home.pocket",{encoding: "utf8"}), opts)
    if (fs.readFileSync(dataPath + "/data/engine.pocket")) fetch("https://pocket-inc.ml/api/browser/save_data.php?type=search&data=" + fs.readFileSync(dataPath + "/data/engine.pocket",{encoding: "utf8"}),opts)
    if (fs.readFileSync(dataPath + "/data/adb.pocket")) fetch("https://pocket-inc.ml/api/browser/save_data.php?type=adb&data=" + fs.readFileSync(dataPath + "/data/adb.pocket",{encoding: "utf8"}),opts)
    if (fs.readFileSync(dataPath + "/data/theme.pocket")) fetch("https://pocket-inc.ml/api/browser/save_data.php?type=theme&data=" + fs.readFileSync(dataPath + "/data/theme.pocket",{encoding: "utf8"}),opts)
    if (fs.readFileSync(dataPath + "/data/website.pocket")) fetch("https://pocket-inc.ml/api/browser/save_data.php?type=website&data=" + fs.readFileSync(dataPath + "/data/website.pocket",{encoding: "utf8"}),opts)

    console.log("Done!")
    document.getElementById("info").innerHTML = "Done!";
    document.getElementById("info").style.color = "black";

}