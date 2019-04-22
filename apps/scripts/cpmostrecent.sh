#!/usr/bin/env bash

test -e ./apps/data/fromrobot || mkdirp ./apps/data/fromrobot;
for ext in mp4 json; do \
  [ "$FILENAME" == "" ] && OUT_FILENAME="" || OUT_FILENAME=$FILENAME.$ext
  cp "`ls -dtr1 ~/Downloads/Data*$ext | tail -1`" ./apps/data/fromrobot/$OUT_FILENAME;
done;
