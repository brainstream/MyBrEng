#!/bin/bash

dir=$(dirname "$0" | xargs -ipath realpath path)
find "$dir" -type f -name "*.py[co]" -delete -o -type d -name __pycache__ -delete -print
