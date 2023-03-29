#!/bin/bash

while getopts "u:": o; do
    if [[ "$o" == "u" ]]
    then
        add_opt='--additional-properties=basePath='
        base_path="${add_opt}\"${OPTARG}\""
    fi
done

rm -rf src/app/web-api
./node_modules/.bin/openapi-generator-cli generate -c ./openapi-generator.json $base_path
