npx @openapitools/openapi-generator-cli generate \
-i ../openapi.yaml \
-o src/api \
-g typescript-fetch \
--additional-properties=typescriptThreePlus=true