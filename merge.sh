#!/bin/sh

set -eu -o pipefail -

node merge.js resources/v1/*.json > output/nuxeo_v1.2.json
node merge.js resources/v2/*.json > output/nuxeo_v2.0.json
node generate.js resources/operations.json > output/nuxeo_automation_v2.0.json
