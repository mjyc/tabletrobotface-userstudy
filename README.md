# Tablet Robot Face User Study

A collection of Cycle.js apps for running a simple human robot interaction user study.

# Getting started

1. Build the pkg:
    ```
    npm install
    npm build
    npm build:apps
    ```
2. Customize your robot behavior by modifying [`apps/robot`](./apps/robot) and run:
    ```
    npm run robot
    ```
    You can download the recorded data by clicking the "download" button located on the bottom of the robot webapp.
3. If you want to automate giving instructions to your participant, customize [`apps/instructor`](./apps/instructor) and run:
    ```
    npm run instructor
    ```
4. Analyze the interaction data using [`apps/replayer`](./apps/replayer):
    ```
    npm run replayer
    ```
    You should place your interaction file, e.g., the one downloaded in 2., in `./apps/dataplayer/` and specify the filename in [`apps/settings.json`](./apps/settings.json), e.g., `{"dataplayer": {"fileprefix": "your_file_name"}}`.
