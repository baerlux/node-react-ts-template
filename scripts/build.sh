#!/bin/bash

if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
    echo "wrong arguments use dev or prod"
    exit 1
fi

if [ "$1" == "dev" ] && ([ "$2" == "" ] || [ "$3" == "" ]); then
    echo "please provide hostname and port"
    exit 1
fi

hostname=$2
port=$3

bash scripts/clean.sh

mkdir -p frontend/public
mkdir -p backend/dist
mkdir logs

if [ "$1" = "dev" ]; then
    ln -sr backend/test/certs/ backend/dist/
    ln -sr backend/test/data/ backend/dist/
    ln -sr frontend/public/ backend/dist/
    
    {
        cd frontend
        yarn run watch &> ../logs/frontend.log
    } &
    echo "watching frontend..."
    
    cd backend
    {
        yarn run watch &> ../logs/backend.log
    } &
    echo "watching backend..."

    # wait for server to be compiled
    while true; do
        sleep 1
        [ ! -z "$(find ./dist/ -name server.js)" ] && break
    done

    LTIME="$(stat -c %Z ./dist/server.js)"

    # run node server and remember pid
    start_server () {
        cd dist
        NODE_ENV=development
        node server.js $hostname $port > ../../logs/server.log 2> ../../logs/server_error.log &
        server_pid=$!
        cd ..
    }
    start_server
    echo "server running on https://$hostname:$port"

    # listen for server.js change and restart server
    while true; do
        ATIME="$(stat -c %Z ./dist/server.js)"
        if [[ "$ATIME" != "$LTIME" ]]; then
            kill -SIGINT $server_pid
            start_server
            echo "server restarted"
            LTIME=$ATIME
        fi
        sleep 1
    done
   
elif [ "$1" = "prod" ]; then
    # INFO: link real certificates and data for production
    ln -sr backend/test/certs/ backend/dist/
    ln -sr backend/test/data/ backend/dist/
    ln -sr frontend/public/ backend/dist/

    {
        cd frontend
        yarn run build &> ../logs/frontend.log
    } &
    build_pid=$!
    echo "building frontend..."
    
    cd backend
    echo "building backend..."
    yarn run build &> ../logs/backend.log

    wait $build_pid
    echo "builds successful!"
fi
