# CRA without dependencies install

I created this to be able to use pnpm to add react dependencies

This script simply creates the boilerplate for react, but without installing the dependencies

You still need to use react-scripts to run and build your project

-   **run this command to package this into an executable**
    ```shell
    pkg --targets node14-win-x64 pnpm-cra.js --config package.json
    ```
-   **or simply create a pnpm-cra.bat file(in windows)**

    ```shell
    @node %~dp0\pnpm_cra\pnpm-cra.js %*
    @REM %~d0 is the directory of this script(i.e. currently executing script)
    @REM where %0 gives the full path of this script
    ```
