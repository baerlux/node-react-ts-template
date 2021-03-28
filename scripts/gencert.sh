#!/bin/bash
path=./backend/test/certs/
openssl genrsa -out $path/key.pem
openssl req -new -key $path/key.pem -out $path/csr.pem
openssl x509 -req -days 365 -in $path/csr.pem -signkey $path/key.pem -out $path/cert.pem
rm $path/csr.pem