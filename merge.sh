#!/bin/sh

set -eu -o pipefail -

node merge.js resources/*.json > nuxeo_v1.2.json
node merge.js resources/v2/*.json > nuxeo_v2.0.json