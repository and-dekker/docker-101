# Docker 101

This guide is intended for developers with little to no knowledge of docker or those who want a refresher.

Reading theory, completing the exercises and challenges will give you a solid foundation of docker knowledge.

---

## Contents

- [Prerequisites](#prerequisites)
- [Useful Resources](#useful-resources)
- [What is Docker?](#what-is-docker)
- [What are Containers?](#what-are-containers)
- [Some Relevant History](#some-relevant-history)
- [Exercises](#exercises)
  - [1. Listing Containers](#1-listing-containers)
  - [2. Listing Images](#2-listing-images)
  - [3. Pulling Images](#3-pulling-images)
  - [4. Running Containers](#4-running-containers)
  - [5. Accessing Running Containers](#5-accessing-running-containers)
  - [6. Building Images](#6-building-images)
  - [7. Tagging Images](#7-tagging-images)
  - [8. Pushing Images](#8-pushing-images)
  - [9. Storage](#9-storage)
  - [10. Environment Variables](#10-environment-variables)
  - [11. Networking](#11-networking)
  - [12. Docker Compose](#12-docker-compose)
- [Challenges](#challenges)
  - [1. Bind Mount Challenge](#1-bind-mount-challenge)
  - [2. App Database Connection Challenge](#2-app-database-connection-challenge)
  - [3. Docker Compose from Scratch Challenge](#3-docker-compose-from-scratch-challenge)
- [Further Reading](#further-reading)

---

## Prerequisites

1. You must have a Docker ID  
Go ahead and create one on [Docker Hub][Docker Hub], if you don't have one already.

2. You must also have Docker Desktop installed on your Mac  
[Download Docker Desktop for Mac from here](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)

3. A decent terminal app, I recommend [iTerm2](https://www.iterm2.com/)

> Don't worry if you do not understand containers, images, Docker Hub, etc at this point as these topics will be covered later.  
> For now, you can think of Docker Hub as being like Github, a global community driven collection of repositories. Where Github contains repositories of code, Docker Hub contains repositories of Docker Images.  
> Your Docker ID can be thought of like your Github username. It is common practice to use the same handle for both, I do ;-)

---

## Useful Resources

- [Docker Website][Docker Website]
- [Docker Hub][Docker Hub]
- [Docker Docs][Docker Docs]
- [Docker CLI Reference][Docker CLI]
- [Docker Compose Reference][Docker Compose]

---

## What is Docker?

Docker is a [company](https://en.wikipedia.org/wiki/Docker,_Inc.) that builds a set of tools to virtualize software applications into *containers* and orchestrate these *containers* in the cloud or on an on-premise network of machines. These tools are colloquially known as [docker](https://en.wikipedia.org/wiki/Docker_(software)).

Most of the docker tools are open source and supported by Docker, the company.

The docker github org can be found here: </br>
[https://github.com/docker](https://github.com/docker)

---

## What are containers?

A container is a lightweight **unit of virtualization**.

### But what does that mean?

Imagine this scenario:

You are a responsible for DevOps and infrastructure.

You have a physical, bare metal, server with 16Gb RAM and 256GB HDD; lets call this server "London".

You have an app written in JavaScript that relies on Node.js v8; lets call this app "Sales API".

To run the "Sales API" app on the "London" server you will install an OS and then install Node.js v8 onto the OS.

The OS takes up 40GB HDD space and 2GB RAM, Node.js v8 takes up 2GB HDD and the "Sales API" app uses around 1GB RAM and 1GB HDD. Great plenty of memory to spare.

Now you have a second app, the "Reporting API" app, which is also written in JavaScript but relies on Node.js v12.

Both apps read and write from folders on the OS, could they clash? Possibly. They rely on different versions of Node.js, can you install and run multiple versions side by side? Maybe.

Ideally, you want some isolation between the apps. How do you achieve this? **By using Virtualization**

> **Info**  
> Oracle is a big player in the virtualization space and is well know for its virtual machine software: [VirtualBox](https://en.wikipedia.org/wiki/VirtualBox).  
> Another big player is [VMware](https://en.wikipedia.org/wiki/VMware).  

So, you rebuild the "London" server by adding a [hypervisor](https://en.wikipedia.org/wiki/Hypervisor). The hypervisor allows you to install multiple isolated Operating Systems onto a single server.

The "London" server is now the host and each OS instance is a guest OS.

You then install a guest OS, dubbed "Hackney", on the "London" server and install Node.js v8. The "Sales API" is then installed onto "Hackney".

Then you install another guest OS, dubbed "Westminster", on the "London" server and install Node.js v12. The "Reporting API" is then installed onto "Westminster".

You then assess utilization to find:

- The hypervisor uses 4GB RAM and 20GB HDD
- "Hackney" uses 2GB RAM and 40GB HDD + 2GB HDD for Node.js v8
- "Westminster" uses 2GB RAM and 40GB HDD + 2GB HDD for Node.js v12
- "Sales API" uses 1GB RAM and 1GB HDD
- "Reporting API" uses 1GB RAM and 1GB HDD
- 6GB RAM and 154GB HDD to spare

You now have isolation between each of your apps. The unit of virtualization here is the guest OS and everything installed on it, such as a version of Node.js and the app.

The current set up costs 2GB RAM per app, even if the app only uses 1GB itself. During the *Iron Age of Computing* this would be preferable to a physical machine per app to achieve isolation.  

However, the memory cost of isolation using guest OSs seems quite high.  
Can app isolation be achieved without the huge cost of running an OS per app?
What's in that 40GB that OS uses? Does your app need it all?

This is where containers come in.

A container includes your app, e.g. "Sales API", its dependencies, e.g. Node.js v8 and the required OS features (not the whole OS). This results in a smaller unit of virtualization. A container has its own isolated file system too, so two containers on the same machine reading and writing from the directory `~/app/some-dir` would be reading and writing from separate physical spaces even though the logical names are the same.

Containers are more portable and can downloaded and booted up much faster than Virtual Machines.

[You can find a high level explanation, with visuals, from Docker here.](https://www.docker.com/resources/what-container)

---

## Some Relevant History

- [The Cloud and Pets vs Cattle](http://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/)
- [The History of Containers](https://www.redhat.com/en/blog/history-containers)
- [A Brief History of Container Technology](https://www.section.io/engineering-education/history-of-container-technology/)
- [The Evolution of Linux Containers and Their Future](https://dzone.com/articles/evolution-of-linux-containers-future)

---

## Exercises

These exercises are designed to completed sequentially in the order laid out here.

The following exercises will all be run from the terminal.

> Ensure your terminal is running from the same directory as this README  

### 1. Listing Containers

```bash
docker container ls
```

Your terminal will look like this:

```bash
$ docker container ls
CONTAINER ID     IMAGE     COMMAND     CREATED     STATUS     PORTS     NAMES
```

This is showing that you have no containers running on your machine.

Now lets break that command down:

```bash
docker container ls
```

1. The first part, `docker`, is telling the terminal that we want to execute the app mapped to the `docker` command.
2. The second part, `container`, is the first command line argument passed into the `docker` app. This is telling `docker` we want to do *something* with containers.
3. The third part, `ls`, is the second argument passed into the `docker` app. This is the *something* we're telling *docker* to do on containers, in this case list containers.

Run this command to display the options available on containers:

```bash
docker container --help
```

### 2. Listing Images

```bash
docker image ls
```

Your terminal will look like this:

```bash
$ docker image ls
REPOSITORY     TAG     IMAGE ID     CREATED     SIZE
```

This is showing that you have no images stored on your machine.

This docker command has a shorthand version:

```bash
docker images
```

### 3. Pulling Images

Run this command:

```bash
docker pull httpd:alpine
```

This command will have downloaded an image to your machine.

Let's break that command down:

1. `docker pull`, tells docker to pull an image from an image repository.
2. The last part, `httpd:alpine`, is the image address to pull the image from.

> **Info**  
> Docker images are named using this format `name:tag`.  
> The name is the name of the image, in this case *httpd*.  
> By default, docker will pull images from [docker hub][Docker Hub]. However, you can supply a url to pull from another repository, e.g. `https://some-custom-repository.com/some-image:some-tag`.  
> The tag is an optional part of an image's address. It is typically used to denote variants of the image.  
> For example, the official node image would have variants for different versions of node such as `node:13` and `node:10`.  
> Tagging will be covered later.

List the images:

```bash
docker images
```

Your terminal will look like this:

```bash
$ docker images
REPOSITORY          TAG          IMAGE ID          CREATED               SIZE
httpd               alpine       cb171b88ec92      2 months ago          109MB
```

### 4. Running Containers

Run this command:

```bash
docker run -it --rm -p 8080:80 httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080) in your browser. The webpage will display the text "It works!".

> **Info**  
> This container is running in the *FOREGROUND*. It's running in the same process as your terminal, you cannot run commands in your terminal while the container is running in the *foreground*.  
> When you close the terminal, the container will also no longer be running.  

Now press the `ctrl + c` keys in your terminal to stop the container.

If you refresh the webpage, [http://localhost:8080](http://localhost:8080), you will see a message saying that "This site can't be reached". This is because the container is no longer running.

Run this command:

```bash
docker run -it --rm -p 8080:80 -d --name my-container httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080) in your browser. Again, the webpage will display the text "It works!".

> **Info**  
> This container is running in *DETACHED* mode. It's now running in a separate process to your terminal, if you close the terminal the container will still be running.

As this container is running in *detached* mode, your terminal is free for you to run more commands in.

Run this command to see the running container:

```bash
docker container ls
```

Your terminal will look something like this:

```bash
$ docker container ls
CONTAINER ID     IMAGE             COMMAND                CREATED             STATUS               PORTS                      NAMES
75c8bd2e3c3b     httpd:alpine      "httpd-foreground"     12 seconds ago      Up 11 seconds        0.0.0.0:8080->80/tcp       my-container
```

Run this command to stop the container:

```bash
docker stop my-container
```

Again, if you refresh the webpage, [http://localhost:8080](http://localhost:8080), you will get a message saying that "This site can't be reached". This is because the container is no longer running.

> **Info**  
> The `httpd` image is the apache webserver. More details about this image can be found [here](https://hub.docker.com/_/httpd).

Let's run another command:

```bash
docker run -it --rm -p 8080:80 httpd:alpine sh
```

This is running the container in the *foreground* and has opened the shell within the container, your terminal will look like this:

```bash
$ docker run -it --rm -p 8080:80 httpd:alpine sh
/usr/local/apache2 #  
```

You are inside the terminal of the container. 

Run this command:

```bash
ls  
```

This lists the contents of the directory you are in, within the container. 

Your terminal will look like this:

```bash
$ /usr/local/apache2 ls
bin   build   cgi-bin   conf   error   htdocs   icons   include   logs   modules
/usr/local/apache2 #
```

Now exit the shell with this command:

```bash
exit
```

This exited the shell within the container and stopped the container.

Let's breakdown these `docker run` commands. The format for `docker run` is:  
`docker run [OPTIONS] IMAGE[:TAG] [COMMAND] [ARG...]`

The options passed in, so far, are:

- `-it` this allocates a pseudo-tty and `STDIN STDOUT STDERR` to the running container, this is required to be able to stop containers running in the *foreground* with `ctrl + c`
- `-rm` this cleans up the container after it stops
- `-p 8080:80` this maps the port `80` within the container to the port `8080` on your machine, port mapping and networking will be covered later
- `-d` this specifies that the container should be run in *detached* mode
- `--name my-container` this gives the running container a name, this name can be viewed when with the `docker container ls` command

The `IMAGE[:TAG]` used was `httpd:alpine`.

The only `[COMMAND]` you used was `sh`, this opened the shell within the container.

`docker run` can take many options, the exhaustive list of options are referenced in the [official docs](https://docs.docker.com/engine/reference/run/)

### 5. Accessing Running Containers

Sometimes you need to access a container that is already running, such as a container running in the cloud or one on your machine that is performing a task.

Let's start by running a detached container:

```bash
docker run -it --rm -p 8080:80 -d --name my-container httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080) in your browser. The webpage will display with the text "It works!".

Let's change the text "It works!" to "Hello World!".

Connect to the running container with this command:

```bash
docker exec -it my-container sh
```

Your terminal will look like this:

```bash
$ docker run -it --rm -p 8080:80 httpd:alpine sh
/usr/local/apache2 #  
```

You are inside the running container!

Run this command to replace the text in the html file served by *apache*:

```bash
echo "<html><body><h1>Hello World!</h1></body></html>" > ./htdocs/index.html
```

Exit the session within the container:

```bash
exit
```

This exited your session, but did not stop the running container. 

Navigate to [http://localhost:8080](http://localhost:8080) in your browser. The webpage will now display the text "Hello World!".

Let's clean up:

```bash
docker stop my-container
```

### 6. Building Images

So far you have been running containers using an image pulled from [docker hub][Docker Hub].

In this exercise, you will be building your own image containing a web application.

Have a look at the contents of the `./src/hello-world` folder.

This folder contains a simple "hello world" *express.js* web app, with the usual *node.js* artifacts such as:

- a `package.json` file
- a `package-lock.json` file
- a `.js` file to execute, in this case `index.js`

In addition, there are some docker related files:

- `.dockerignore`
- `Dockerfile`

> Don't worry about the docker related files for now, they will be explained later.

Let's navigate into the application folder.

Run this command in your terminal:

```bash
cd hello-world
```

Build an image, including this app, with this command:

```bash
docker build -t hello-world:latest .
```

Now that your image has been built, let's take a look at it with this command:

```bash
docker images
```

Your terminal will look something like this:

```bash
$ docker images

REPOSITORY      TAG                    IMAGE ID         CREATED           SIZE
hello-world     latest                 8c798d1d8c65     2 seconds ago     117MB
node            13.10.1-alpine3.11     b01d82bd42de     2 weeks ago       114MB
```

As you can see, you have a new image in your local repository called *hello-world*. This is the image you just built.

Let's breakdown the command `docker build -t hello-world:latest .`, to see how the image was built.

The docker build command follows this format:
`docker build [OPTIONS] PATH | URL | -`

The option you passed in, `-t hello-world:latest`, tells docker to name the image built as `hello-world` with the tag `latest`.

The *PATH* used was `.`, this means the current directory or the directory that the command was executed from.

> But what does Docker do when building this image?

Remember the `Dockerfile` in the `./src/hello-world` folder? This file is a set of instructions that docker uses to build an image and tells docker what to do when a container is spun up from the image.

Let's take a look at the `Dockerfile`:

```docker
FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "start"]
```

The first part, `FROM node:13.10.1-alpine3.11`, tells docker to build the image using a base image. The base image used is named after `FROM`, in this instance the base image is: `node:13.10.1-alpine3.11`.

The second part, `COPY . /root/app`, tells docker to copy the contents from `.` (the current directory, `./src/hello-world`) into a directory within the container, `/root/app`.

> **Note**  
> All contents are copied from `.`, except for files and folders specified in the `.dockerignore` file. The `.dockerignore` file is like `.gitignore`.

The third part, `WORKDIR /root/app`, tells docker to set the *working directory* to `/root/app`. The working directory is where all commands, within the container, will be executed from.

The fourth part, `RUN npm ci`, runs a command; in this case `npm ci`.

The next part, `EXPOSE 3000`, tells docker to expose the port `3000`. This exposed port can be mapped when the image is run as container.

The last part, `CMD ["npm", "run", "start"]`, is the command that docker will run when a container is spun up from this image.

All of the options for the `docker build` command referenced in the [official docs](https://docs.docker.com/engine/reference/commandline/build/).

A full reference of the `Dockerfile` can also be found in the [official docs](https://docs.docker.com/engine/reference/builder/).

> **Info**  
> The image created in this exercise used a base image. Images in docker are typically built in *layers*, with each *layer* adding a required aspect.  
> In this scenario, you used a node base image, this meant the base image had node.js installed so you didn't have to install it in your own Dockerfile.  

### 7. Tagging Images

Earlier, you created an image called `hello-world:latest`.

This image has the tag `latest`, let's tag this image with the node version:

```bash
docker tag hello-world:latest hello-world:node-13.10.1-alpine3.11
```

If you view your images again:

```bash
docker images
```

Your terminal will look something like this:

```bash
$ docker images
REPOSITORY      TAG                         IMAGE ID         CREATED           SIZE
hello-world     latest                      8c798d1d8c65     2 hours ago       117MB
hello-world     node-13.10.1-alpine3.11     8c798d1d8c65     2 hours ago       117MB
node            13.10.1-alpine3.11          b01d82bd42de     2 weeks ago       114MB
```

Notice how the two variants of the `hello-world` image have the same *image id*, this is because the tags are aliases to the same physical image.

You may want to have aliases for the same image, one to denote a version and one to indicate that its the latest version.

### 8. Pushing Images

As a prerequisite, you created an account on [Docker Hub][Docker Hub]. By default, on Docker for Mac, you will be logged into Docker Hub as your remote repository.

Let's push the `hello-world` image to your Docker Hub remote repository:

```bash
docker push hello-world:latest
```

The terminal will return an error:

```bash
denied: requested access to the resource is denied
```

Like a remote git repository, a repository for this image must be created on Docker Hub. Create one in your account called "hello-world".

A new repository will be created called `<yourusername>/hello-world`.

> **Remember**  
> Earlier, during the pull images exercise, there was an **Info** that said image names could be urls.  
> Well, on Docker Hub repositories that belong to you are in this format: `<yourusername>/name:tag`.  
> Images, on your local machine, must in this format to be able to push them to remote.

Tag the image to include your docker id:

```bash
docker tag hello-world:latest <yourusername>/hello-world:latest
```

And then push the image:

```bash
docker push <yourusername>/hello-world:latest
```

### 9. Storage

Let's do an experiment! 

Run the `httpd` image in detached mode image, then `sh` into the running container and modify the `index.html` file.

Spin up `httpd`, in *detached* mode:

```bash
docker run -it -p 8080:80 -d --name my-container httpd:alpine
```

> **Note**  
> The option `--rm` was not supplied.  
> We want to restart the same container after stopping it later.  

Navigate to [http://localhost:8080](http://localhost:8080) in your browser. The webpage will display the text "It works!".

Connect to the running container:

```bash
docker exec -it my-container sh
```

From inside the container, modify the `index.html` file:

```bash
echo "<html><body><h1>Hello World!</h1></body></html>" > ./htdocs/index.html
```

Then exit the running container:

```bash
exit
```

Refresh [http://localhost:8080](http://localhost:8080) in your browser to see the text changed from "It works!" to "Hello World!".

Stop the running container:

```bash
docker stop my-container
```

Look at the stopped container:

```bash
docker container ls -a
```

> **Info**  
> `docker container ls` displays running containers, adding the `-a` option displayed containers that are no longer running too.  
> Containers started with `--rm` will not be displayed from `docker container ls -a` as they have completely wiped from the machine.

Now start the stopped container:

```bash
docker start my-container
```

Refresh [http://localhost:8080](http://localhost:8080) in your browser, the text will still be "Hello World!".

Changes made to files within a container are persisted between stop and starts.

> **Info**  
> Images are portable, they can be pushed and pulled between machines.  
> However, containers are not and only live on the machine that started them.  

Stop the running container:

```bash
docker stop my-container
```

And delete it:

```bash
docker container rm my-container
```

Run it again, this time in the *foreground*:

```bash
docker run -it --rm -p 8080:80 -d --name my-container httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080), the text is now "It works!" again.

Stop the container:

```bash
docker stop my-container
```

> **Question**  
> Can files live outside of the lifetime of a container?  
> **Answer**  
> Yes, with mounts.  

> **Info**  
> There are two main types of mount:  
>  
> - Bind mounts  
> - Volumes  
>  
> Further theory and more information how to choose the right type of mount can be found in the [official docs][Docker Storage].

Point your terminal to the `./src/bind-mount-example` folder in this repository:

```bash
cd ./bind-mount-example
```

Run this command:

```bash
docker run -it --rm -p 8080:80 -v "$(pwd)":/usr/local/apache2/htdocs -d --name my-container httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080), the text displayed will be "From Bind Mount Directory!".

The latest option passed into `docker run` was `-v "$(pwd)":/usr/local/apache2/htdocs`. Let's break this down:

- `-v` is the volume option (this is an old shorthand syntax)
- `$(pwd)":/usr/local/apache2/htdocs` is the bind mount map in this format: `SOURCE:DESTINATION`. The source is directory on the host, your machine, and the destination is a directory within the container.

Further storage options for `docker run` can be found in the [official docs][docker run].

> **Info**  
> Bind mount paths passed into `docker run` must be absolute paths.  
> "$(pwd)" is a command that returns the directory that this command was executed in as an absolute path.  
> More information about bind mounts can be found in the [official docs](https://docs.docker.com/storage/bind-mounts/)

Try changing the content of `./src/index.html` and refreshing the webpage at [http://localhost:8080](http://localhost:8080).

> **Tip**  
> A good time to use a bind mount is when you need to test files that you're working on locally inside a container.  
> Imagine you have a web app that you're working on locally that will be packaged as an image and deployed to live. You could spin up a container using your live image and mount your app to it and run it locally.

Clean up the container:

```bash
docker stop my-container
```

Create a *volume* with this command:

```bash
docker volume create my-volume
```

List your volumes using this command:

```bash
docker volume ls
```

Your terminal will look something like this:

```bash
$ docker volume ls
DRIVER     VOLUME NAME
local      my-volume
```

You have created your first volume!

> **Info**  
> A volume is a folder created somewhere that docker manages.  
> In this instance the volume was created on your local machine.  
> Using volume drivers, volumes can be created on other machines or in the cloud.  
> More information about volumes can be found in the [official docs](https://docs.docker.com/storage/volumes/).

Run a container mapped to `my-volume`:

```bash
docker run -it --rm -p 8080:80 -v my-volume:/usr/local/apache2/htdocs -d --name my-container httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080), the text displayed will be "It works!".

Connect to the running container:

```bash
docker exec -it my-container sh
```

From inside the container, modify the `index.html` file:

```bash
echo "<html><body><h1>Hello from Docker Volume!</h1></body></html>" > ./htdocs/index.html
```

Exit the running container:

```bash
exit
```

Refresh the webpage at [http://localhost:8080](http://localhost:8080) to see the text updated to "Hello from Docker Volume!".

Now clean up the container by stopping it with this command:

```bash
docker stop my-container
```

Run a new container instance, in the *foreground*, to see what happens:

```bash
docker run -it --rm -p 8080:80 -v my-volume:/usr/local/apache2/htdocs httpd:alpine
```

Navigate to [http://localhost:8080](http://localhost:8080) to see the text still displayed as "Hello from Docker Volume!".

Stop the container, running in the *foreground*, by typing `ctrl + c` into your terminal.

As you can see the changes made to files in the `/usr/local/apache2/htdocs` directory have persisted outside of the lifetime of container instances.

> **Note**  
> When using a bind mount, the source was written into the destination.  
> When using a volume, the destination was written into the source.  

> **Tip**  
> A good time to use a volume is when you are working with important data that should not be manually modified but requires persistence beyond the lifetime of individual containers.  
> A typical use case is when you're using containers to run databases on your local machine.  

Clean up the volume using this command:

```bash
docker volume rm my-volume
```

Run this command to see all of the `docker volume` commands available to you:

```bash
docker volume --help
```

Next, point your terminal into the `./src/volume-example` directory:

```bash
cd ./volume-example
```

Build the `Dockerfile`:

```bash
docker build -t volex:latest .
```

Spin up a container, in the *detached* mode, from the new image:

```bash
docker run -it --rm -d --name my-volex volex:latest
```

List the volumes:

```bash
docker volume ls
```

Your terminal will look like this:

```bash
$ docker volume ls
DRIVER     VOLUME NAME
local      778a037a38b58f4570e3cf7fa868b1d833fad18e36796802c376aadca3ba9fe6
```

A volume was created with a random name. Why?

Let's look at the `Dockerfile` in the `./src/volume-example` directory:

```docker
FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

VOLUME [ "/root/app/data" ]

CMD ["npm", "run", "start"]
```

This `Dockerfile` introduces a new instrument, `VOLUME`, not used in previous examples.

The `VOLUME [ "/root/app/data" ]` instrument tells docker to create a *mount point* inside a running container at the directory `/root/app/data`.

Because the `docker run` command did not map a volume to the *mount point*, docker created a volume for you with a generated id as the name.

Stop the container:

```bash
docker stop my-volex
```

List the volumes, again:

```bash
docker volume ls
```

Your terminal will look like this:

```bash
$ docker volume ls
DRIVER     VOLUME NAME
```

The *volume* has disappeared. Why?

Because the cleanup option, `--rm`, was supplied and nothing was mapped to the *mount point*.

Let's test this theory!

Create a new volume:

```bash
docker volume create volex-vol
```

Then run a container, in the *foreground*, with the volume mapped:

```bash
docker run -it --rm -v volex-vol:/root/app/data volex:latest
```

Stop the container by typing `ctrl + c` into your terminal.

List the volumes:

```bash
docker volume ls
```

Your terminal will look like this:

```bash
$ docker volume ls
DRIVER     VOLUME NAME
local      volex-vol
```

The volume has persisted!

Let's clean it up:

```bash
docker volume rm volex-vol
```

> **Tip**  
> It always good to check mount points, `VOLUME`, in Dockerfiles for images you don't own for hints on what should be persisted outside of the lifetime of a container.

### 10. Environment Variables

Point your terminal into the `./src/environment-variables-example` directory:

```bash
cd ./environment-variables-example
```

Build the Dockerfile:

```bash
docker build -t eve:latest .
```

Spin up a container, in the *foreground*, using the image `eve:latest`:

```bash
docker run -it --rm -p 8080:3000 eve:latest
```

Navigate to [http://localhost:8080](http://localhost:8080) to see the text "hello world" displayed.

Stop the container by typing `ctrl + c` in your terminal.

Spin up the container, in the *foreground*, again using this command:

```bash
docker run -it --rm -p 8080:3000 --env MESSAGE1=foo --env MESSAGE2=bar eve:latest
```

Navigate to [http://localhost:8080](http://localhost:8080) to see the text changed to "foo bar".

The app in the container returns the value of two environment variables, `MESSAGE1` and `MESSAGE2`.

The last command passed the values `foo` and `bar` as environment variables with these options: `--env MESSAGE1=foo --env MESSAGE2=bar`.

Let's look at the `Dockerfile` to see how this works:

```docker
FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

ENV MESSAGE1=${MESSAGE1:-hello}
ENV MESSAGE2=${MESSAGE2:-world}

CMD ["npm", "run", "start"]
```

This `Dockerfile` introduces a new instrument, `ENV`, not used in previous examples.

The `ENV MESSAGE1=${MESSAGE1:-hello}` instrument tells docker to expect an environment variable, `MESSAGE1`, and to default the value to "hello" if `MESSAGE1` is not supplied.

The `ENV MESSAGE2=${MESSAGE1:-world}` instrument tells docker to expect an environment variable, `MESSAGE2`, and to default the value to "world" if `MESSAGE2` is not supplied.

Further details of environment variables in the `Dockerfile` can be found in the [official docs](https://docs.docker.com/engine/reference/builder/#env).

### 11. Networking

Point your terminal into the `./src/networking-example` directory:

```bash
cd ./networking-example
```

This folder contains two web apps, `web-app-a` and `web-app-b`.

Each web app returns a string message and attempts to get the message from the other web app and log it to the console.

Build the image for `web-app-a`:

```bash
docker build -t nea:latest ./a
```

Build the image for `web-app-b`:

```bash
docker build -t neb:latest ./b
```

Create a network:

```bash
docker network create mynet
```

List the networks:

```bash
docker network ls
```

Your terminal will look like this:

```bash
$ docker network ls
NETWORK ID          NAME        DRIVER     SCOPE
8af67faff05d        bridge      bridge     local
7fea4f713418        host        host       local
a473ee099ccd        mynet       bridge     local
27ac9b1519f9        none        null       local
```

> **Info**  
> Docker creates three networks by default: `bridge`. `host` and `none`.  
> There are a number of different types of network supported by Docker that support a number environments such as the cloud, a hand-made cluster of computers, etc..  
> More information can be found in the [official docs](https://docs.docker.com/network/).  

Spin up `web-app-a`, in the *foreground*:

```bash
docker run -it --rm --env PORT=3000 -p 8080:3000 nea:latest
```

Your terminal will look like this:

```bash
$ docker run -it --rm --env PORT=3000 -p 8080:3000 nea:latest  

> web-app-a@1.0.0 start /root/app  
> node index.js  

App A listening on port 3000!  
Error requesting data from OTHER CONTAINER
Error requesting data from OTHER CONTAINER
```

Navigate to [http://localhost:8080](http://localhost:8080) to see the text "Hello World from A".

Stop the container by typing `ctrl + c` in your terminal.

Spin up `web-app-b`, in the *foreground*:

```bash
docker run -it --rm --env PORT=3001 -p 8080:3001 neb:latest
```

Your terminal will look like this:

```bash
$ docker run -it --rm --env PORT=3001 -p 8080:3001 neb:latest  

> web-app-b@1.0.0 start /root/app  
> node index.js  

App B listening on port 3001!  
Error requesting data from OTHER CONTAINER
Error requesting data from OTHER CONTAINER
```

Navigate to [http://localhost:8080](http://localhost:8080) to see the text "Hello World from B".

Stop the container by typing `ctrl + c` in your terminal.

Each app tries to request data from the other app, because each app was spun up individually they couldn't access each other.

Let's break down some of the options passed into the `docker run` command for `web-app-a`:

- `--env PORT=3000`, this passes an environment variable, called `PORT`, to the container with a value of `3000`. The web app listens for http requests on the port number supplied by this environment variable.  
- `-p 8080:3000`, this tells docker to publish the port `3000` in the container and map it to port `8080` on the host machine, your mac. This is how you are able to view the web responses on [http://localhost:8080](http://localhost:8080).

Open another terminal window (or tab if you're using [iTerm2](https://www.iterm2.com/)).

Spin up `web-app-a`, in the *foreground*, from your first terminal:

```bash
docker run -it --rm --env PORT=3000 -p 8080:3000 nea:latest
```

Spin up `web-app-b`, in the *foreground*, from your second terminal:

```bash
docker run -it --rm --env PORT=3030 -p 8081:3030 neb:latest
```

Navigate to [http://localhost:8080](http://localhost:8080) to see the text "Hello World from A".

Then, navigate to [http://localhost:8081](http://localhost:8081) to see the text "Hello World from B".

Both of your terminals will still be logging the following error:

```bash
Error requesting data from OTHER CONTAINER
```

Both containers are running simultaneously, on the same machine, but cannot find each other.

Stop the containers by typing `ctrl + c` into each terminal.

When running the containers, let's provide some details into each one about the other, such as the *container name* and *port*.

Spin up `web-app-a`, in the *foreground*, from your first terminal:

```bash
docker run -it --rm --name web-app-a --env PORT=3000 --env OTHER_CONTAINER=web-app-b --env OTHER_PORT=3030 -p 8080:3000 nea:latest
```

And spin up `web-app-b`, in the *foreground*, from your second terminal:

```bash
docker run -it --rm --name web-app-b --env PORT=3030 --env OTHER_CONTAINER=web-app-a --env OTHER_PORT=3000 -p 8081:3030 neb:latest
```

Let's breakdown the additional options passed into the `docker run` commands:

- `--name web-app-a` and `--name web-app-b`, this names each container.
- `--env PORT=3000` and `--env PORT=3030`, this tells each container which *port* expose *http* on.
- `OTHER_CONTAINER=web-app-b` and `OTHER_CONTAINER=web-app-a`, this passes in the name of the other container.
- `OTHER_PORT=3030` and `OTHER_PORT=3030`, this passes in the exposed port of the other container.

Like before, you can access the http responses, from each container, in your browser from [http://localhost:8080](http://localhost:8080) and [http://localhost:8081](http://localhost:8081).

> **Note**  
> Each web app knows what to do with name of the other container and other container's port.  
> The `Dockerfile` just passes these options down to the app.  

However, like before, the containers still can't access each other. You terminals will still be logging this error:

```bash
Error requesting data from OTHER CONTAINER
```

Stop the containers by typing `ctrl + c` into each terminal.

Remember the network you created earlier, `mynet`? Let's pass this as an option into your containers.

Spin up `web-app-a`, in the *foreground*, from your first terminal:

```bash
docker run -it --rm --network mynet --name web-app-a --env PORT=3000 --env OTHER_CONTAINER=web-app-b --env OTHER_PORT=3030 -p 8080:3000 nea:latest
```

And spin up `web-app-b`, in the *foreground*, from your second terminal:

```bash
docker run -it --rm --network mynet --name web-app-b --env PORT=3030 --env OTHER_CONTAINER=web-app-a --env OTHER_PORT=3000 -p 8081:3030 neb:latest
```

The containers are now accessing each other!

The terminal for `web-app-a` will look like this:

```bash
$ docker run -it --rm --network mynet --name web-app-a --env PORT=3000 --env OTHER_CONTAINER=web-app-b --env OTHER_PORT=3030 -p 8080:3000 nea:latest

> web-app-a@1.0.0 start /root/app  
> node index.js  

App A listening on port 3000!  
Message Received from OTHER CONTAINER: Hello World from B!
Message Received from OTHER CONTAINER: Hello World from B!
```

And the terminal for `web-app-b` will look like this:

```bash
$ docker run -it --rm --network mynet --name web-app-b --env PORT=3030 --env OTHER_CONTAINER=web-app-a --env OTHER_PORT=3000 -p 8081:3030 neb:latest

> web-app-b@1.0.0 start /root/app  
> node index.js  

App B listening on port 3030!  
Message Received from OTHER CONTAINER: Hello World from A!
Message Received from OTHER CONTAINER: Hello World from A!
```

Stop the containers by typing `ctrl + c` into each terminal.

Delete the network created earlier:

```bash
docker network rm mynet
```

List the networks:

```bash
docker network ls
```

Your terminal will look like this (displaying only the default networks):

```bash
$ docker network ls
NETWORK ID          NAME        DRIVER     SCOPE
8af67faff05d        bridge      bridge     local
7fea4f713418        host        host       local
27ac9b1519f9        none        null       local
```

Containers are discoverable within a docker network, by adding `web-app-a` and `web-app-b` to the same network the containers were able to communicate using each other's container names and exposed ports.

### 12. Docker Compose

In the [previous exercise](#11-networking) you created a network, specified container names, connected containers to a network, used a number of environment variables and used multiple terminals to get the multi-container environment up and running.

What if there were more containers involved? What if volumes were required? It would be quite a lot of options and values to remember.

How could you recreate the environment on a another machine? Maybe perform the same steps again and change a few values here and there?

How could the environment be source controlled? How could this environment be passed onto other developers? Maybe write down all the commands in a `README` with an explanation of which option values could be modified?

This is where `docker compose` comes in, it is another docker command that can spin up container environments from configuration stored in a `yaml` file. The `yaml` configuration file could be source controlled and shared.

Let's think about a more complex scenario. What is required to spin up a wordpress environment for local development? What needs to be considered?

Here are the requirements and considerations for running a dockerized wordpress environment:

- webserver to run php and wordpress
- mysql database instance to store wordpress data
- phpmyadmin instance to administer the database
- you need to be able to view and modify wordpress files
- you need to access the webserver from your browser
- you need to access phpmyadmin from your browser
- webserver needs to be able to find and access the database
- phpmyadmin needs to be able to find and access the database
- the database contents need to be persisted

Have a look at the `yaml` file, `docker-compose.yml`, in the folder `./src/docker-compose-example`. This holds all of the docker configuration to address the above considerations.

Point your terminal to the `./src/docker-compose-example` folder in this repository:

```bash
cd ./docker-compose-example
```

Run this command:

```bash
docker-compose up
```

There will be a lot of activity in your terminal, the container environment is running the in *foreground*.

Also, a whole bunch of wordpress files will have been created into the `./src/docker-compose-example` folder.

Navigate to [http://localhost:8000/](http://localhost:8000/) in your browser, this will take you through the wordpress installation. Go ahead and do the installation.

To access *phpmyadmin*, navigate to [http://localhost:8080/](http://localhost:8080/). you can log in, to see the database, using "wordpress" as the username and password.

Stop the container environment by typing `ctrl + c` in your terminal.

Spin the environment up again, this time in *detached* mode:

```bash
docker-compose up -d
```

The container environment is now running in the background and your terminal is free to run more commands.

Navigate to [http://localhost:8000/](http://localhost:8000/) in your browser again. The wordpress site you set up earlier has persisted.

Let's take a look at what was created.

Check the docker networks:

```bash
docker network ls
```

Your terminal will look like this:

```bash
$ docker network ls
NETWORK ID          NAME                              DRIVER     SCOPE
8af67faff05d        bridge                            bridge     local
5b090cd84349        docker-compose-example_wpsite     bridge     local
7fea4f713418        host                              host       local
27ac9b1519f9        none                              null       local
```

As you can see, a new network was created from the `docker-compose.yml` file.

Check the docker containers:

```bash
docker container ls
```

Your terminal will look like this:

```bash
$ docker container ls
CONTAINER ID     IMAGE                       COMMAND                      CREATED           STATUS           PORTS                    NAMES
0b1d8fbb66f8     wordpress:latest            "docker-entrypoint.s..."     5 minutes ago     Up 5 minutes     0.0.0.0:8000->80/tcp     docker-compose-example_wordpress_1
1aa179141b5c     phpmyadmin/phpmyadmin       "/docker-entrypoint...."     5 minutes ago     Up 5 minutes     0.0.0.0:8080->80/tcp     docker-compose-example_phpmyadmin_1
2185d0108e73     mysql:5.7                   "docker-entrypoint.s..."     5 minutes ago     Up 5 minutes     3306/tcp, 33060/tcp      docker-compose-example_db_1
```

Three containers were spun up from the `docker-compose.yml` file.

Check the docker volumes:

```bash
docker volume ls
```

Your terminal will look like this:

```bash
$ docker volume ls
DRIVER     VOLUME NAME
local      docker-compose-example_db_data
```

A volume was created from the `docker-compose.yml` file.

Spin down the *detached* container environment with this command:

```bash
docker-compose down
```

Check the docker containers, networks and volumes again:

```bash
docker container ls
```

```bash
docker network ls
```

```bash
docker volume ls
```

The containers and network has been cleaned up but the volume remains, this is the default behavior for `docker-compose down`.

Spin up the environment, in *detached* mode, again:

```bash
docker-compose up -d
```

Spin the environment down again, this time with an option to clean up the volumes:

```bash
docker-compose down -v
```

> **Info**  
> The `docker-compose` command knows which resources to spin up and down because of the docker compose `yaml` file.  
> You will have noticed docker resources are created using the name of the folder, containing `docker-compose.yml`, as part of the resource naming convention, e.g. the wordpress container is named `docker_compose_example_wordpress_1`.  
> More information about the `docker-compose` command can be found in the [official documentation][Docker Compose CLI].  

Let's breakdown the `docker-compose.yml` file. Each line in the snippet below has a comment explaining what the configuration does:

```yaml
version: '3' # This specifies the version of docker compose.

services: # Container instances are defined under 'services:'.
  db: # The name of the container, in this case 'db'. This defines the database instance.
    image: mysql:5.7 # The image to use for the 'db' container.
    volumes: # Storage options.
      - db_data:/var/lib/mysql # Volume mapping, equivalent to passing the option '-v db_data:/var/lib/mysql' into docker run.
    restart: always # Tells docker to restart the container if it shutdowns unexpectedly.
    environment: # Environment Variable definitions to pass into the container when it is spun up.
      MYSQL_ROOT_PASSWORD: password # Environment Variable definition, equivalent to passing the option '--env MYSQL_ROOT_PASSWORD=password' into docker run.
      MYSQL_DATABASE: wordpress # Environment Variable definition, equivalent to passing the option '--env MYSQL_DATABASE=wordpress' into docker run.
      MYSQL_USER: wordpress # Environment Variable definition, equivalent to passing the option '--env MYSQL_USER=wordpress' into docker run.
      MYSQL_PASSWORD: wordpress # Environment Variable definition, equivalent to passing the option '--env MYSQL_PASSWORD=wordpress' into docker run.
    networks: # The network(s) to attach this container to.
      - wpsite # The name of the network.
  phpmyadmin: # The name of the container, in this case 'phpmyadmin'. This defines the phpmyadmin instance.
    depends_on: # Containers defined under the 'services:' that this container depends on. This container will be started after the dependent containers have spun up.
      - db # The name of the container to wait for before starting.
    image: phpmyadmin/phpmyadmin # The image to use for the 'phpmyadmin' container.
    restart: always # Tells docker to restart the container if it shutdowns unexpectedly.
    ports: # The port mapping definitions for this container.
      - '8080:80' # Port mapping, equivalent to passing the option '-p 8080:80' into docker run.
    environment: # Environment Variable definitions to pass into the container when it is spun up.
      PMA_HOST: db # Environment Variable definition, equivalent to passing the option '--env PMA_HOST=db' into docker run.
      MYSQL_ROOT_PASSWORD: password # Environment Variable definition, equivalent to passing the option '--env MYSQL_ROOT_PASSWORD=password' into docker run.
    networks: # The network(s) to attach this container to.
      - wpsite # The name of the network.
  wordpress: # The name of the container, in this case 'wordpress'. This defines the webserver with wordpress instance.
    depends_on: # Containers defined under the 'services:' that this container depends on. This container will be started after the dependent containers have spun up.
      - db # The name of the container to wait for before starting.
    image: wordpress:latest # The image to use for the 'wordpress' container.
    ports: # The port mapping definitions for this container.
      - '8000:80' # Port mapping, equivalent to passing the option '-p 8000:80' into docker run.
    restart: always # Tells docker to restart the container if it shutdowns unexpectedly.
    volumes: ['./:/var/www/html'] # Bind mount mapping, equivalent to passing the option '-v "$(pwd)":/var/www/html' into docker run.
    environment: # Environment Variable definitions to pass into the container when it is spun up.
      WORDPRESS_DB_HOST: db:3306 # Environment Variable definition, equivalent to passing the option '--env WORDPRESS_DB_HOST=db:3306' into docker run.
      WORDPRESS_DB_USER: wordpress # Environment Variable definition, equivalent to passing the option '--env WORDPRESS_DB_USER=wordpress' into docker run.
      WORDPRESS_DB_PASSWORD: wordpress # Environment Variable definition, equivalent to passing the option '--env WORDPRESS_DB_PASSWORD=wordpress' into docker run.
    networks: # The network(s) to attach this container to.
      - wpsite # The name of the network.
networks: # Network definitions to create and be used by services defined above.
  wpsite: # The network to create, in this case named 'wpsite'.
volumes: # Volume definitions to create and be used by services defined above.
  db_data: # The volume to create, in this case named 'db_data'.
```

> **Note**  
> The wordpress docker compose config is a typical set up, but by no means an exhaustive example of all of the possibilities of docker compose.  
> More information about the docker compose configuration can be found in the [official documentation][Docker Compose].  

---

## Challenges

The following challenges are designed to reinforce the knowledge gained from the [Exercises](#exercises) completed in this 101.

These challenges build upon the concepts, already learned, to take them further.

> Challenges can be completed in any order.

### 1. Bind Mount Challenge

> **Context**  

This challenge is designed to reinforce your knowledge of *mount points* and the `bind mount`.

During the exercise [9. Storage](#9-storage), you created an image from the `Dockerfile` in the `./src/volume-example`.

> **The Challenge**  

Spin up a container using that image and using a `bind mount` to map the directory `./src/volume-example/data/` to the mount point specified in the `Dockerfile`.

> **Questions**  

1. Are any files created in `./src/volume-example/data/` after running the container?  
2. What are these files called?  
3. What are the contents of these files?  

### 2. App Database Connection Challenge

> **Context**  

This challenge is designed to reinforce your knowledge of networks and how containers discover each other.

> **Setup**  

- There is a web app, `webapp`, in the folder `./src/app-db-challenge/app`.
- There is a `docker-compose.yml` in the folder `./src/app-db-challenge`.

The compose file is designed to spin up a database server instance and spin up an instance of `webapp`.

`webapp` relies on the database server, the first thing it does is attempt to make a connection to the database.

> **Challenge**  

1. Build the `Dockerfile` for `webapp` and tag it with `appdbchallenge:latest`.
2. Spin up the `docker-compose.yml`, in the *foreground*, from the folder `./src/app-db-challenge`.

Your terminal will be displaying an error from `webapp`:

```bash
webapp_1  | 
webapp_1  | > challenge-app@1.0.0 start /root/app
webapp_1  | > node index.js
webapp_1  | 
webapp_1  | ERROR CONNECTING TO DATABASE
webapp_1  | npm ERR! code ELIFECYCLE
webapp_1  | npm ERR! errno 1
webapp_1  | npm ERR! challenge-app@1.0.0 start: `node index.js`
webapp_1  | npm ERR! Exit status 1
webapp_1  | npm ERR! 
webapp_1  | npm ERR! Failed at the challenge-app@1.0.0 start script.
webapp_1  | npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
webapp_1  | 
webapp_1  | npm ERR! A complete log of this run can be found in:
webapp_1  | npm ERR!     /root/.npm/_logs/2020-03-27T14_20_20_007Z-debug.log
app-db-challenge_webapp_1 exited with code 1
```

The above error will repeat over and over.

This error is occurring because `webapp` can't access the database container.

When `webapp` can access the database container, your terminal will look like this:

```bash
webapp_1  | 
webapp_1  | > challenge-app@1.0.0 start /root/app
webapp_1  | > node index.js
webapp_1  | 
webapp_1  | Challenge App listening on port 3000!
```

Examine the `docker-compose.yml` and apply any missing config, or remove any unnecessary config, so `webapp` can access the database container.

> **Hint**  
There are two ways to get the containers to discover each other.

> **Questions**  

1. Why couldn't `webapp` find the database container?
2. What were the two possible fixes?  
3. Why does each fix work?  

---

### 3. Docker Compose from Scratch Challenge

> **Context**  

This challenge is designed to reinforce your knowledge of networking and docker compose.

During the exercise [11. Networking](#11-networking), you created two images called `nea:latest` and `neb:latest`.

Spinning up both containers required many options to be passed into `docker run`.

> **Setup**  

- There is an empty `docker-compose.yml` file in the folder `./src/docker-compose-from-scratch-challenge`.

> **The Challenge**  

Fill in the empty compose file to spin up the containers from exercise [11. Networking](#11-networking).

The containers must be able to access each other.

## Further Reading

This 101 covered docker and containers.

You learned how to use images and containers on a single machine.

In production, containers would typically be run accross a cluster of machines in the cloud.

- How are containers spun up automatically in the cloud?
- How are they configured for a multi machine clustered environment?
- How do containers in the cloud discover each other?
- How are metrics collected about running containers?
- How are volumes mapped to containers in a cluster?
- How are resources, cpu and memory, allocated to containers in the cloud?

These questions are answered by a concept called **Container Orchestration**.

The [official docker docs](https://docs.docker.com/get-started/orchestration/) have a good explanation of *container orchestration*.

Popular tools and ecosystems used to *orchestrate* containers:

- [Kubernetes](https://kubernetes.io/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)

Recommended reading:

- [Kubernetes vs. Docker Swarm: What’s the Difference?](https://thenewstack.io/kubernetes-vs-docker-swarm-whats-the-difference/)
- [Container Orchestration Explained](https://www.youtube.com/watch?v=kBF6Bvth0zw)
- [Container Orchestration from Theory to Practice](https://www.youtube.com/watch?v=_WVfBPJKDM8)
- [New Relic: What Is Container Orchestration?](https://blog.newrelic.com/engineering/container-orchestration-explained/)
- [Red Hat: What is container orchestration?](https://www.redhat.com/en/topics/containers/what-is-container-orchestration)

---

[Docker Website]: https://www.docker.com/
[Docker Hub]: https://hub.docker.com/
[Docker Docs]: https://docs.docker.com/
[Docker CLI]: https://docs.docker.com/engine/reference/commandline/cli/
[Docker Compose]: https://docs.docker.com/compose/compose-file/
[Docker Compose CLI]: https://docs.docker.com/compose/reference/overview/
[Docker Storage]: https://docs.docker.com/storage/
[docker run]: https://docs.docker.com/engine/reference/commandline/run/