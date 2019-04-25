#!/usr/bin/env bash

test -e ../settings.json || echo {} > ../settings.json
test -e ../data/fromrobot || mkdir -p ../data/fromrobot
ln -sF ../data/fromrobot ./

