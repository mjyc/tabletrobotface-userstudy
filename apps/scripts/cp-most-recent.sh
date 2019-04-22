#!/usr/bin/env bash

test -e ./apps/data/fromrobot || mkdirp ./apps/data/fromrobot;
for ext in mp4 json; do \
  if [ "${FILENAME}" == "" ]; then \
    cp "`ls -dtr1 ~/Downloads/Data*${ext} | tail -1`" ./apps/data/fromrobot/;
  else
    cp "`ls -dtr1 ~/Downloads/Data*${ext} | tail -1`" ./apps/data/fromrobot/${FILENAME}.${ext};
  fi
done;
