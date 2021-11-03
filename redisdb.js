const { createClient } = require("redis");
let e = (module.exports = {});
(async () => {
  const client = createClient({ url: "redis://" + process.env.REDIS_HOST });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  await client.flushAll();

  let portStart = process.env.PORT_START;
  let portEnd = process.env.PORT_END;
  for (let i = portStart; i <= portEnd; i++) {
    await client.set(`port_${i}`, "0");
  }
  console.log(`Ports ${portStart}-${portEnd} have been cleared`);

  // module.exports = client;
  e.set = async (key, val) => {
    await client.set(key, val);
  };
  e.get = async (key) => {
    return await client.get(key);
  };
  e.del = async (key) => {
    await client.del(key);
  };
  e.incr = async (key) => {
    await client.incr(key);
  };
  e.decr = async (key) => {
    await client.decr(key);
  };
  e.exists = async (key) => {
    return await client.exists(key);
  };
  e.expire = async (key, sec) => {
    return await client.expire(key, sec);
  };
})();
