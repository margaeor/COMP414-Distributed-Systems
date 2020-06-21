#!/bin/bash

#docker run -d -p 5000:5000 --restart=always --name registry registry:2
docker-compose -f docker-compose-swarm.yml build
docker-compose -f docker-compose-swarm.yml push
docker-compose -f docker-compose-swarm.yml config > docker-compose-expanded.yml && docker stack deploy --compose-file docker-compose-expanded.yml comp414

