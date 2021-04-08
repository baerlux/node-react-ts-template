# WebZapp - Simple WebApp from scratch

Transparent and customizable WebApp template using  
React, Typescript and Sass  
A Node.js server backend  
And Webpack to wrap it all up

The build script requires a Linux environment.  
It watches for changes and automatically rebuilds the server and frontend during development.

**Log-files** for all build processes can be found in the logs folder!

## install dependencies

```shell
yarn install
```

## development build

```shell
yarn run dev
```

or

```shell
./scripts/build.sh dev localhost 8080
```

## production build and running server

```shell
yarn run build
yarn run serve
```

or

```shell
./scripts/build.sh prod
./scripts/serve.sh hostname port
```

You can generate self sigend certificates for testing and developing with

```shell
./scripts/gencerts.sh
```

they are stored in ./backend/test/certs/

The build script creates symbolic links to test-certs, test-data and the frontend bundle to be served by the node backend.
Thus it can be easily replaced by real certs and data in production environments.
