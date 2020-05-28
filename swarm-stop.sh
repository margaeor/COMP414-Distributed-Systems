#!/bin/bash

docker stack rm comp411
docker stop registry
docker rm registry