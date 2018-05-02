#!/usr/bin/env bash

rsync -rzvh \
  dist config.yaml \
  package.json yarn.lock \
  psucoder@vultr:/home/psucoder/run/microservices
