#!/bin/bash
set -e

case "$1" in
    start)
        echo "Building and Starting application"
        yarn build
        yarn start
        ;;
    *)
        exec "$@"
esac
