# COMP414-Distributed-Systems

## Requirements
Enough space for containers and at least 3GB of RAM

## Running
In order to run the project, just use docker compose:
```
docker-compose up
```
And then in order to shut the system down:
```
docker-compose down
``` 


## Swarm mode
In order to run in swarm mode, run:

```
docker swarm init
./swarm-start.sh
```

And then you can stop the system using:
```
./swarm-stop.sh
docker swarm leave
```