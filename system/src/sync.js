const fetch = require("node-fetch");

async function getSync() {
    if (localStorage.getItem('login')) {
        let login = JSON.parse(localStorage.getItem('login'));
    const opts = {
        headers: {
            cookie: 'PHPSESSID=' + login.token
        }
    };
let state = await fetch("https://pocket-inc.ml/api/browser/logged.php?redirect=browser",opts).then(response => response.json());

if (state.state === "success") {
    let data = await fetch("https://pocket-inc.ml/api/browser/get_data.php",opts).then(response => response.json());
    document.getElementById("sync").innerHTML = "<small>Logged in: <b>" + state.user + "</b></small><br><small>Latest Sync: <b>" + data.latest + "</b></small><br><br><button>Sync</button> <button>Load</button>";
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