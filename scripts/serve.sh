#!/bin/bash
if [ "$1" == "" ] || [ "$2" == "" ] ; then
    echo "please provide hostname and port"
    exit 1
fi
cd backend/dist/
NODE_ENV=production
node server.js $1 $2 > ../../logs/server.log 2> ../../logs/server_error.log
