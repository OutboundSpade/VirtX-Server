# <center>VirtX Server</center>
### <center>Server implementation of the VirtX Project</center>
---

## Usage
### Required Services
 - redis database
 - websockify instance that supports the custom single use redis token plugin (outboundspade48/docker-websockify)
 - docker host (a machine, local or remote with standard docker)
### Docker host
A docker host can be mounted locally (to /var/run/docker.sock) or can be controlled remotely via ssh
## Config
TODO
## Environment Variables


Name | Value 
---------|----------
CLIENT_ID | Google Client Id
CLIENT_SECRET | Google Client Secret
URL | Full url of the website that VirtX will be hosted on <br>e.g. http://example.com:3000
DOCKER_LOCALHOST | 1 if docker host is local 0 otherwise
DOCKER_HOST | The address or domain of the remote docker host <br>e.g. 10.10.10.10 or dockerhost.example.com
DOCKER_HOST_USERNAME|Username of user to manage docker host (ssh)
DOCKER_HOST_PASSWORD|Password of user to manage docker host (ssh)
WEBSOCKIFY_HOST|The address or domain of the websockify service <br>e.g. 10.10.10.10 or websockify.example.com
WEBSOCKIFY_PORT|The port of the websockify service
REDIS_HOST|The address/domain and port of the redis database<br>e.g. 10.10.10.10:6379
PORT_START|The starting port range to use for exposing<br> container ports for vnc.<br>e.g. 5901
PORT_END|The ending port range to use for exposing<br> container ports for vnc.<br>e.g. 5999
CONTAINER_PATH|Absolute path of inside the container to create the mount<br>e.g /home/user/MyStuff
ENCRYPT| 1 if using https 0 otherwise
DOCKER_CPU_LIMIT|Number if logical cores (threads) allowed for each container<br>e.g. 4 (4 cores)<br>0.5 (half a core)<br> 0 (no limit)
DOCKER_MEM_LIMIT|Amount of memory (in MB) allowed for each container<br>e.g. 1024 (1GB)<br>0 (no limit)
