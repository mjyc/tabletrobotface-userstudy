#!/usr/bin/env bash

rsync -av ../data/parameters ./src/transitions/
sed -i 's|"../../../data/parameters|"./parameters|g' ./src/transitions/index.js

../scripts/printsettings.js | echo {\"robot\": `npx json robot`} | npx json> ./src/settings.json
sed -i 's|"../../settings_helper"|"./settings.json"|g' src/index.js

npx json -I -f package.json -e 'this.dependencies["tabletrobotface-userstudy"]="~0.0.0"'
npm install tabletrobotface-userstudy
