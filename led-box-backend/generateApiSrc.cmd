npx @openapitools/openapi-generator-cli generate ^
-i ../openapi.yaml ^
-o api/gen ^
-g python-flask ^
--additional-properties=packageName=base