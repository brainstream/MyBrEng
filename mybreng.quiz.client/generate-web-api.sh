#!/bin/bash

set -euo pipefail

rm -rf src/app/web-api
./node_modules/.bin/openapi-generator-cli generate -c ./openapi-generator.json

# Remove OpenAPI Generator's hardcoded localhost fallback
sed -i "s|protected basePath = '[^']*';|protected basePath = '';|" src/app/web-api/api.base.service.ts
