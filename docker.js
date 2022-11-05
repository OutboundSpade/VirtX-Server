const { setTimeout } = require("timers/promises");
const Docker = require("dockerode");
const redisdb = require("./redisdb");
const { exit } = require("process");
let e = (module.exports = {});
let host = process.env.DOCKER_HOST;
/** @type {Docker} */
let docker; //
if (process.env.DOCKER_LOCALHOST == 1) {
	console.log(
		`detected using DOCKER_LOCALHOST: using '/var/run/docker.sock'`
	);
	docker = new Docker({
		socketPath: "/var/run/docker.sock",
		host: "",
	});
} else {
	docker = new Docker({
		protocol: "ssh",
		host: host,
		port: 22,
		username: process.env.DOCKER_HOST_USERNAME,
		password: process.env.DOCKER_HOST_PASSWORD,
	});
}
docker.version((err, result) => {
	if (err) {
		console.error(`error getting docker version! :\n ${JSON.stringify(e)}`);
		return;
	}
	console.log(`docker version: ${result.Version}`);
});
docker.ping().catch((e) => {
	console.error(`error pinging docker! :\n ${e}`);
	exit(1);
});

e.startApp = async (container, port, id, user) => {
	// try {
	console.log(`starting app (in docker.js) - ${container}`);
	return new Promise(async (resolve, reject) => {
		docker
			.run(
				container,
				[],
				undefined,
				{
					// User: "1000",
					name: id,
					// Volumes: {
					//   "/home/user": {},
					// },
					ExposedPorts: {
						// "5901/tcp": {},
					},
					HostConfig: {
						Memory: Number(process.env.DOCKER_MEM_LIMIT) * 1000000,
						NanoCpus:
							Number(process.env.DOCKER_CPU_LIMIT) * 1000000000,
						Binds: [
							`${db.users[user].path}:${process.env.CONTAINER_PATH}:z`,
						],
						// Mounts: [
						//   {
						//     Target: process.env.CONTAINER_PATH,
						//     Source: db.users[user].path,
						//     Type: "bind",
						//     BindOptions: { Propagation: "rshared" },
						//   },
						// ],
						AutoRemove: false,
						PortBindings: {
							"5901/tcp": [
								{
									HostPort: port + "/tcp",
								},
							],
						},
					},
				},
				(err, data, container) => {
					if (err) {
						console.error("Error in docker.startApp!");
						console.error(err);
						console.error(JSON.stringify(err));
						reject(err);
					}
				}
			)
			.on("container", (container) => {
				console.log(`container ${container.id} has been created`);
				resolve(container.id);
			});
	});
};
e.deleteApp = async (id) => {
	let opts = {};
	opts.all = true;
	opts["filters"] = {
		name: [id],
	};
	let cont = await docker.listContainers(opts);
	if (cont.length == 0) {
		console.log(`Container ${id} doesn't exist`);
		return;
	}
	// if (c[0] === undefined) {
	//   console.error(`There was a problem creating container ${id}`);
	//   return;
	// }
	// console.log(`container ${id} has contid of ${c[0].Id}`);
	// // redisdb.set();
	// console.log(`Starting ${container} with id ${id} on port ${port}`);
	// console.log(cont[0]);
	let contobj = docker.getContainer(cont[0].Id);
	try {
		await contobj.kill();
	} catch (e) {}
	await contobj.remove();
	// await contobj.remove();
	console.log(`Deleting app ${id}`);
};
e.containerExists = async (name) => {
	console.log(`checking fo ${name}`);
	let opts = {};
	opts.all = true;
	opts["filters"] = {
		name: [name],
	};
	let cont = await docker.listContainers(opts);
	return cont.length > 0;
};
