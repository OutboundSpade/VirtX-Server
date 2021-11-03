const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const port = 3000;
require("./passportInit");
const auth = require("./authMiddleware");
require("./db");
const api = require("./api");
const redisdb = require("./redisdb");
const removeContainer = require("./removeContainer.js");
var fs = require("fs");
// var https = require("https");
let privateKey, certificate, credentials;
if (process.env.ENCRYPT == 1) {
  privateKey = fs.readFileSync("./cert/privkey.pem", "utf8");
  certificate = fs.readFileSync("./cert/cert.pem", "utf8");
  credentials = { key: privateKey, cert: certificate };
}
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(
  cookieSession({
    name: "virtx-login-session",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());
let server;
if (process.env.ENCRYPT == 1) {
  console.log("Using (encrypted) https");
  server = require("https").createServer(credentials, app);
} else {
  console.log("Using (unencrypted) http");
  server = require("http").createServer(app);
}
const io = require("socket.io")(server);
io.on("connection", async (socket) => {
  socket.on("docker-id", async (data) => {
    console.log(`recieved docker id ${data} from ${socket.id}`);
    await redisdb.set(`socketid_${socket.id}`, data);
  });
  socket.on("disconnect", async () => {
    removeContainer(socket.id);
  });
});

app.get("/", auth.requireAuthRedirect);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.use("/api/admin", auth.requireAdmin, api);
app.use("/api", auth.requireAuth, api);
app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/login");
});

app.use(express.static("./public"));
app.use("/appassets", express.static("./config/assets"));
server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
