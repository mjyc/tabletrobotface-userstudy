# Tablet Robot Face User Study

A collection of [tabletrobotface](https://github.com/mjyc/tablet-robot-face) apps for running a human robot interaction user study.

# Demos

-   Robot apps
    -   [Storytelling](https://codesandbox.io/s/github/mjyc/tabletrobotface-userstudy/tree/codesandbox_storytelling_ranger_forester/apps/robot)
    -   [Neck exercise](https://codesandbox.io/s/github/mjyc/tabletrobotface-userstudy/tree/codesandbox_neckexercise/apps/robot)

# Getting started

1. Install the latest version of node using [nvm](https://github.com/nvm-sh/nvm). NOTE: the maintainer is using `nvm=0.33.2`, `node=v8.11.0`, and `npm=5.6.0`

1. Build pkgs:

    ```
    cd {path/to/tabletrobotface-userstudy}
    npm install
    npm build
    cd apps/{appname}
    npm install
    # repeat the last two steps for remaining apps
    ```

1. Run [`robot`](./apps/robot) app:

    ```
    npm run robot
    ```

<!-- 1. Run [`instructor`](./apps/instructor) app (for giving instructions to participants):

    ```
    npm run instructor
    ```
 -->
