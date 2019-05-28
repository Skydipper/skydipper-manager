#!/bin/bash

case "$1" in
    start)
        npm start
        ;;
    develop)
        type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
        docker-compose -f docker-compose.yml build && docker-compose -f docker-compose.yml up
        ;;
    *)
        echo "Usage: skydipper-manager.sh {develop}" >&2
        exit 1
        ;;
esac

exit 0
