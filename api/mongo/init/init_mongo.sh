#!/bin/bash


export MONGODB_API_PASS=$(cat /run/secrets/mongodb_api_password)


# Asynchronous sleep and add users to wait for db initialization
bash -c 'sleep 20 && mongo -u root -p ${MONGODB_ROOT_PASSWORD} <<EOF
use ${MONGODB_API_DB}
db.createUser({user: "${MONGODB_API_USER}",pwd:"${MONGODB_API_PASS}",roles:[{role:"readWrite",db:"${MONGODB_API_DB}"}]})
EOF' &


#db.createUser({user: "gamemaster",pwd:"1234",roles:[{role:"readWrite",db:"gamemaster_db"}]})
