# Data Class Editor

This repo contains the web-based data class editor client.

### Available Scripts

`npm install`: Install all packages

`npm run package`: Build the lib output

`npm run dev`: Start the dev server

#### Run tests

`npm run test`: Run unit tests

`npm run webtest:mock`: Run Playwright tests against mock environment

`npm run webtest:engine`: Run Playwright tests against designer engine

### VsCode dev environment

#### Debug

Simply start the `Launch Standalone` or `Launch Standalone Mock` launch config to get debug and breakpoint support.

> [!NOTE]
> The `Launch Standalone` launch config connects to a real designer and therefore requires a running designer engine on port 8081 with a project called `dataclasses`. These attributes can be changed via URL parameters.

> [!NOTE]
> The `Launch Standalone Mock` launch config only receives mock data and therefore does not work with features for which a real engine is needed (e.g. data validation).

#### Run tests

To run tests you can either start a script above or start Playwright or Vitest with the recommended workspace extensions.
