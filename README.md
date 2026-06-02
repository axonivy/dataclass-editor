# Data Class Editor

[![translation-status](https://hosted.weblate.org/widget/axonivy/dataclass-editor/svg-badge.svg)](https://hosted.weblate.org/engage/axonivy/)

This repo contains the web-based Data Class Editor client.

### Available Scripts

`pnpm install`: Install all packages

`pnpm run package`: Build the lib output

`pnpm run dev`: Start the dev server

#### Run tests

`pnpm run test`: Run unit tests

`pnpm run webtest`: Run Playwright tests

### VSCode dev environment

#### Debug

Debug and breakpoint support is available in the provided launch configs:

- Launch `Standalone Mock` config to interact with a mocked backend.
- Launch `Standalone` config to work with an ivyEngine backend.
  1. Copy the test-project to be served in advance: `./scripts/playwrightInit.sh ~/dev/core`
  2. Start your dev-engine in Eclipse RCP IDE
  3. Launch the config in this repo

#### Run tests

To run tests you can either start a script above or start Playwright or Vitest with the recommended workspace extensions.
