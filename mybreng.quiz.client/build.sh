#!/bin/bash

set -euo pipefail

./generate-web-api.sh
npm run build
