#!/bin/sh

npx @openapitools/openapi-generator-cli generate \
-i ../openapi.yaml \
-o src/api/gen \
-g typescript-fetch \
--additional-properties=typescriptThreePlus=true