# <center>VirtX Server</center>
### <center>Server implementation of the VirtX Project</center>
---

## Usage
### Required Services
 - redis database
 - websockify instance that supports the custom single use redis token plugin (outboundspade48/docker-websockify)
 - docker host (a machine, local or remote with standard docker)
### Docker host
A docker host can be mounted locally (to /var/run/docker.sock via [DOCKER_LOCALHOST](#environment-variables)) or can be controlled remotely via ssh

> Note: all containers specified in the apps.json config file should be pulled onto the docker host BEFORE starting the server
## Config
The config folder should be created & placed in the root of the server project.
(if using docker container, this is `/data/config`) 

There are 3 configuration files required to be in the `config` folder. They are:

- [`apps.json`](#apps) - name, description, icon path, type, and container image + tag are specified for each app 
- [`users.json`](#users) - list of user's emails, mount paths, & permissions
- [`permissions.json`](#permissions-aka-groups) - list of which groups can access which apps

In addition, app icons specified in [`apps.json`](#apps) must be placed in an `assets` folder within the `config` folder

### Apps
The `apps.json` file format:

`internal-name` - Name only used internally, traditionally all lowercase
`name` - Name of the app displayed on the website
`description` - Description of the app displayed on the website
`icon` - name of icon file shown on the website located in the `assets` folder within the config folder
`type` - always `container`
`container` -  image name & tag on docker host
```
{
  "internal-name": {
    "name": "Display Name",
    "description": "this app does all sorts of things",
    "icon": "app-icon.png",
    "type": "container",
    "container": "image-name:tag"
  }
}
```

Example:
```
{
  "gimp": {
    "name": "GIMP",
    "description": "GNU Image Manipulation Program is a Photo Manipulation tool similar to Adobe Photoshop",
    "icon": "gimp.png",
    "type": "container",
    "container": "outboundspade48/docker-singleapp:gimp"
  }
}

```
### Users
The `users.json` file format:

`email` - the full email address of the user
`path` - the path on the docker host to mount the container folder (see [CONTAINER_PATH](#environment-variables) for container folder)
`permissions` - an array of permissions or "groups" that a user belongs to. (see [Permissions](#permissions-aka-groups))

```
{
  "email": {
      "path": "/path/to/folder/on/docker/host",
      "permissions": ["group1","group2"]
   }
}
```

Example:
```
{
  "example@email.com": {
      "path": "/home/user/virtx/mount/example@email.com",
      "permissions": ["3d","design"]
   }
}
```
### Permissions (aka groups)
The `permissions.json` file format:

`group-name`: name of the permission/group
`app1-3`: the internal name of the apps that the permission/group has access to (see [Apps](#apps)) 

```
{
  "group-name": ["app1", "app2", "app3"]
}
```

Example:
```
{
  "design": ["gimp", "inkscape", "openshot", "darktable"],
  "3d": ["blender"]
}
```
> Note: there are 2 groups built-in:
#### All
`all` has access to all apps
#### Admin
`admin` has access to all apps, similar to [`all`](#all).
Unlike [`all`](#all), `admin` has the ability to reload configuration files in the top right of the dashboard by clicking on your icon then `Reload Configuration Files`. This is required for changes to the config files to take effect without restarting the server.
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
[ENCRYPT](#cert)| 1 if using https 0 otherwise
DOCKER_CPU_LIMIT|Number if logical cores (threads) allowed for each container<br>e.g. 4 (4 cores)<br>0.5 (half a core)<br> 0 (no limit)
DOCKER_MEM_LIMIT|Amount of memory (in MB) allowed for each container<br>e.g. 1024 (1GB)<br>0 (no limit)

## Cert

> TODO - coming soon!