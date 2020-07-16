# COMP414-Distributed-Systems
Implementation of a distributed online multiplayer 
board game system for chess and tic-tac-toe.
This project was done as a semester project for the
course Distributed Systems 
of the ECE department of the Technical University of Crete.
The detailed system specification can be found [here](./spec/Specification.pdf).

Features:
- Friendly user interface
- User authentication and authorization.
- Real-time gameplay between 2 players using sockets.io.
- Support for user in-game chat.
- Real-time user matchmaking for entering a new game.
- Ability to continue an ongoing game.
- Support for tournaments where players can compete with
one another.
- Display player statistics, past games, past tournaments, ELO rating.

Fault-tolerance:
- If one node of the MongoDB cluster dies, the system continues 
to operate normally.
- If the service that manages user plays dies (playmaster),
the users are disconnected and are then immediately reconnected
to a new playmaster.


## Implementation
The system was implemented as a Microservice architecture
as shown in the image below.
For more information about our approach, 
![System Architecture](./spec/images/architecture.png?raw=true "System Architecture")

## Requirements
Enough space for containers and at least 3GB of RAM

## Running
In order to run the project, just use docker compose:
```
docker-compose up
```
Then navigate to `http://localhost` to access the user interface.

And then in order to shut the system down run:
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