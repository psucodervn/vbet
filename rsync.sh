#!/usr/bin/env bash

rsync -rzvh \
  src data config.yaml \
  package.json yarn.lock \
  tsconfig.json \
  psucoder@vultr:/home/psucoder/run/microservices
