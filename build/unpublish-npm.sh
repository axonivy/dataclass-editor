#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/dataclass-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/dataclass-editor-protocol@${1}" --registry $REGISTRY
