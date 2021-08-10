#!/bin/sh

set -e

TS_NODE_FILES=true yarn run mocha test/*.ts --require ts-node/register --timeout 50000 --exit 
