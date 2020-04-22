#!/bin/bash

/opt/bitnami/zookeeper/bin/zkCli.sh  -server localhost:2181 <<EOF
create /playmasters
create /load_balance

create -s /playmasters/p 192.168.1.100
create -s /playmasters/p 192.168.1.101
create -s /playmasters/p 192.168.1.102

create /load_balance/p0000000000_400
create /load_balance/p0000000001_200
create /load_balance/p0000000002_300
EOF

# /opt/bitnami/zookeeper/bin/zkCli.sh  -server localhost:2181 <<EOF
# create /playmasters
# create /playmasters/id1
# create /playmasters/id1/ip
# create /playmasters/id1/plays
# set /playmasters/id1/ip "192.168.1.11"
# set /playmasters/id1/plays 3
# create /playmasters/id2
# create /playmasters/id2/ip
# create /playmasters/id2/plays
# set /playmasters/id2/ip "192.168.1.12"
# set /playmasters/id2/plays 1
# create /playmasters/id3
# create /playmasters/id3/ip
# create /playmasters/id3/plays
# set /playmasters/id3/ip "192.168.1.13"
# set /playmasters/id3/plays 2
# EOF