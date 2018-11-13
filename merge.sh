#!/bin/sh

set -eu -o pipefail -

echo "Merge v1.2"
node src/merge.js resources/v1/*.json > output/nuxeo_v1.2.json
swagger-tools validate -v output/nuxeo_v1.2.json || true

echo "Merge v2.0"
node src/merge.js resources/v2/*.json > output/nuxeo_v2.0.json
swagger-tools validate -v output/nuxeo_v2.0.json || true
#echo "Convert v3.0"
#api-spec-converter output/nuxeo_v2.0.json --from=swagger_2 --to=openapi_3 > output/nuxeo_v3.0.json

if [ -s resources/operations.json ]; then
  echo "Generating Automation"
  node src/generate.js resources/operations.json > output/nuxeo_automation_v2.0.json
fi
