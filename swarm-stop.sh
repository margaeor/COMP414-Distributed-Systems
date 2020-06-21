#!/bin/bash

docker stack rm comp414
docker stop registry
docker rm registry