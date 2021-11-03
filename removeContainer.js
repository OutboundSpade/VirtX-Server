const redisdb = require("./redisdb");
const docker = require("./docker");

module.exports = async (socket_id) => {
  let dockerid = await redisdb.get(`socketid_${socket_id}`);
  if (!(await docker.containerExists(dockerid))) {
    console.log(`!Container ${docker.id} doesn't exist`);
    return;
  }

  console.log(
    `Socket ${socket_id} with container ${dockerid} was disconnected!`
  );

  await redisdb.decr(dockerid);
  let open_count = await redisdb.get(dockerid);
  console.log(`${dockerid} has ${open_count} open`);
  if (open_count <= 0) {
    console.log(`Deleting ${dockerid}`);
    await docker.deleteApp(dockerid);
    let full_loc = await redisdb.get(`${dockerid}-location`);
    let new_port = full_loc.split(":")[1];
    await redisdb.del(dockerid);
    await redisdb.set(`port_${new_port}`, "0");
    await redisdb.del(`${dockerid}-location`);
    let email_app = await redisdb.get(`${dockerid}-user`);
    await redisdb.del(email_app);
    await redisdb.del(`${dockerid}-user`);
  }
  await redisdb.del(`socketid_${socket_id}`);
};
