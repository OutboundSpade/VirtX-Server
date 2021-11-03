function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
httpGetAsync("/api/getAllApps", (appDataRaw) => {
  // console.log(appDataRaw);
  apps = JSON.parse(appDataRaw);
  console.log(apps);
  if (Object.keys(apps).length === 0) {
    console.log("no apps");
    document.getElementById("noapps").classList.remove("hidden");
  }
  Object.values(apps).forEach((app) => {
    console.log(app.name);
    let apphtml = `<a href="/loading?type=container&app=${app.name.toLowerCase()}" target="_blank"><div role="button" class=" app text-white bg-dark">
  <img class="applogo" src="/appassets/${app.icon}" />
  <br /><samp class="apptitle">${app.name}</samp> <br /><samp class="appdesc"
    >${app.description}</samp
  >
</div></a>`;
    document.getElementById("apps").innerHTML += apphtml;
  });
  document.getElementById("spinner").innerHTML = "";
});
