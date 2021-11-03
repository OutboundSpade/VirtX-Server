const docker = require("./docker");
const redisdb = require("./redisdb");
module.exports = async (email, docker_id, vnctoken, port, appname) => {
  if (await redisdb.exists(`${email}_cont_${appname}`)) {
    console.log(`${email}_cont_${appname} allready exists`);
    docker_id = await redisdb.get(`${email}_cont_${appname}`);
    let docker_id_location = await redisdb.get(`${docker_id}-location`);
    redisdb.incr(docker_id);
    await redisdb.set(
      `vnctoken-${vnctoken}`,
      `{"host":"${docker_id_location}"}`
    );
    await redisdb.expire(`vnctoken-${vnctoken}`, 10);
    return docker_id;
  }
  for (let i = process.env.PORT_START; i <= process.env.PORT_END; i++) {
    if ((await redisdb.get(`port_${i}`)) == "0") {
      port = i;
      await redisdb.set(`port_${i}`, "1");
      break;
    }
    // console.log(`port ${i} is ${await redisdb.get(`port_${i}`)}`);
  }
  await docker.startApp(db.apps[appname].container, port, docker_id, email);
  await redisdb.set(
    `${docker_id}-location`,
    process.env.DOCKER_HOST + ":" + port
  );
  await redisdb.set(`${docker_id}-user`, `${email}_cont_${appname}`);
  await redisdb.set(`${email}_cont_${appname}`, docker_id);
  await redisdb.incr(docker_id);
  await redisdb.set(
    `vnctoken-${vnctoken}`,
    `{"host":"${process.env.DOCKER_HOST + ":" + port}"}`
  );
  await redisdb.expire(`vnctoken-${vnctoken}`, 10);
  return docker_id;
};
