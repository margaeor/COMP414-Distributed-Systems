#!/bin/bash

/opt/bitnami/zookeeper/bin/zkCli.sh  -server localhost:2181 <<EOF
create /playmasters
create /playmasters/id123
create /playmasters/id123/ip
create /playmasters/id123/plays
set /playmasters/id123/ip "192.168.1.10"
set /playmasters/id123/plays 0
EOF