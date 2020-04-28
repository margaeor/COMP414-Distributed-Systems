#!/bin/bash
mkdir /tmp/node

loc=/media/windows/Distributed/project/node-api/api/src

%cp $loc/package.json /tmp/node

cd /tmp/node

npm install --no-bin-links

echo $(ls)

cp -r ./node_modules $loc/

cp ./package*.json $loc/