const fs = require("fs");
class db {
  update = () => {
    this.users = JSON.parse(fs.readFileSync("./config/users.json"));
    this.apps = JSON.parse(fs.readFileSync("./config/apps.json"));
    this.permissions = JSON.parse(fs.readFileSync("./config/permissions.json"));
  };
  // console.log(users);
}
let newdb = new db();
newdb.update();
global.db = newdb;
// console.log(db);
