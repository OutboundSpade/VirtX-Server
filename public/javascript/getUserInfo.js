function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
    if (xmlHttp.status == 401) {
      callback(null);
    }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

httpGetAsync("/api/getUser", (userDataRaw) => {
  console.log(userDataRaw);
  user = JSON.parse(userDataRaw);
  if (user.admin) {
    document.getElementById("reload").innerHTML = `Reload Configuration Files`;
    document.getElementById("reload").classList.remove("hidden");
  }
  document.getElementById("fullname").innerHTML = `Hello, ${user.given_name}`;
  document.getElementById("fullname").classList = "";
  document.getElementById("userIcon").src = user.picture;
  document.getElementById("userIcon").classList.add("userIcon");
});

function reloadList() {
  httpGetAsync("/api/admin/reload", (i) => {
    if (i == null) {
      alert("Failed to Reload configuration files");
    } else {
      alert("Reloaded Config Successfully");
    }
  });
}
