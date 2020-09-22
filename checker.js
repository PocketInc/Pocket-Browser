var latestVersion = 1.5;

if (latestVersion > browserVersion) {
alert("Pocket Browser needs updating to " + latestVersion);
pocket.info("Update Checker: Needs update to " + latestVersion);
} else if (latestVersion > browserVersion) {
pocket.info("Update Checker: Latest Version.");
} else {
alert("Something is wrong. Did you install the browser officially?")
pocket.info("Update Checker: Something is wrong.")
}
