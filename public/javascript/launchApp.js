function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    } else if (xmlHttp.readyState == 4) {
      callback(null);
    }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

//extract uri (?a=1&b=2)
httpGetAsync("/api/startApp" + location.search, (r) => {
  if (r === null) {
    alert("Sorry, bad request");
    close();
    return;
  }
  if (r == "") {
    return;
  }
  r = JSON.parse(r);
  let encrypt = location.protocol === "https:";
  console.log(r);
  location.assign(
    location.origin +
      "/novnc/" +
      `?path=?token=${r.token}&dockerid=${r.docker_id}&encrypt=${Number(
        encrypt
      )}&password=password&host=${r.host}&port=${
        r.port
      }&show_dot=true&resize=remote&autoconnect=true&reconnect=true&reconnect_delay=4000`
  );
});
