# CRA without dependencies install

I created this to be able to use pnpm to add react dependencies

This script simply creates the boilerplate for react, but without installing the dependencies

You still need to use react-scripts to run and build your project

-   **run this command to package this into an executable**
    ```shell
    pkg --targets node14-win-x64 pnpm-cra.js --config package.json
    ```
