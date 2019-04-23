#!/usr/bin/env bash

test -e ../settings.json || echo {} > ../settings.json
test -e ../data/params || mkdir -p ../data/params;
test -e ../data/params/demo || echo {} > ../data/params/demo.json;
test -e ../data/params/storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG || echo {} > ../data/params/storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.json;
