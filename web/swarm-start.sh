#!/bin/bash

docker swarm init
docker run -d -p 5000:5000 --restart=always --name registry registry:2
docker-compose build
docker-compose push
docker-compose config > docker-compose-expanded.yml && docker stack deploy --compose-file docker-compose-expanded.yml comp411

