const docker = require("./docker");
const redisdb = require("./redisdb");
const { v4: uuidv4 } = require("uuid");
const createContainer = require("./createContainer");
module.exports = async (req, res, next) => {
  switch (req.path) {
    case "/getUser":
      req.user._json["admin"] =
        db.users[req.user.emails[0].value] &&
        db.users[req.user.emails[0].value].permissions.includes("admin");
      res.send(req.user._json);
      break;
    case "/getAllApps":
      res.send(getAllowedApps(req.user.emails[0].value));
      break;
    case "/startApp":
      // console.log(req.query);
      await startApp(req, res);
      break;
    case "/admin/reload":
      db.update();
      res.sendStatus(200);
      break;
    default:
      // console.log(req.path);
      break;
  }
  next();
};

const getAllowedApps = (user) => {
  if (db.users[user] === undefined) {
    console.log(`no user ${user}`);
    return {};
  }
  if (
    db.users[user].permissions.includes("admin") ||
    db.users[user].permissions.includes("all")
  ) {
    return db.apps;
  }
  let a = {};
  db.users[user].permissions.forEach((permission) => {
    db.permissions[permission].forEach((app) => {
      if (a[app] === undefined) {
        a[app] = db.apps[app];
      }
    });
  });
  return a;
};

const startApp = async (req, res) => {
  let p = req.query;
  if (
    p.type != "container" ||
    p.app == undefined ||
    db.apps[p.app] == undefined
  ) {
    res.sendStatus(400);
    return;
  }
  let email = req.user.emails[0].value;
  if (!hasPermissions(email, p.app)) {
    res.sendStatus(401);
    return;
  }

  let docker_id = uuidv4();
  let vnctoken = uuidv4();
  let realid = await createContainer(email, docker_id, vnctoken, null, p.app);
  res.send({
    docker_id: realid,
    port: process.env.WEBSOCKIFY_PORT,
    host: process.env.WEBSOCKIFY_HOST,
    token: `vnctoken-${vnctoken}`,
  });
};

const hasPermissions = (user, app) => {
  if (
    db.users[user].permissions.includes("admin") ||
    db.users[user].permissions.includes("all")
  ) {
    return true;
  }
  let canUse = false;
  db.users[user].permissions.forEach((permission) => {
    db.permissions[permission].forEach((uapp) => {
      // console.log(app == uapp);
      if (app == uapp) {
        canUse = true;
      }
    });
  });
  return canUse;
};
