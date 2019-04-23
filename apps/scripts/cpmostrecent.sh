#!/usr/bin/env bash

NUM_DATA=`ls -1 ~/Downloads/Data* 2>/dev/null | wc -l`;
if [ NUM_DATA = 0 ]; then
  echo "No file matching ~/Downloads/Data* found"
  exit 1;
fi

test -e ./apps/data/fromrobot || mkdirp ./apps/data/fromrobot;
for ext in mp4 json; do \
  if [ "$FILENAME" == "" ]; then \
    OUT_FILENAME="`basename ls -dtr1 ~/Downloads/Data*$ext | tail -1`";
  else
    OUT_FILENAME="$FILENAME.$ext"
  fi
  cp "`ls -dtr1 ~/Downloads/Data*$ext | tail -1`" "./apps/data/fromrobot/$OUT_FILENAME";
  echo "./apps/data/fromrobot/$OUT_FILENAME"
done;
