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
    document.getElementById("sync").innerHTML = "<small>Logged in: <b>" + state.user + "</b></small>";
    let data = await fetch("https://pocket-inc.ml/api/browser/get_data.php").then(response => response.json());
} else if(state.state === "error") {
        document.getElementById("sync").innerHTML = "<p>Email:<br><input id='em' type='email'></p><p>Password:<br><input id='pas' type='password'></p><button onclick='login()'>Login</button>"
}
    } else {
        document.getElementById("sync").innerHTML = "<p>Email:<br><input id='em' type='email'></p><p>Password:<br><input id='pas' type='password'></p><button onclick='login()'>Login</button>"

    }
}
async function login() {
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
    else if (res.state === "error") document.getElementById("error").innerHTML = "Invaild Account!"
}