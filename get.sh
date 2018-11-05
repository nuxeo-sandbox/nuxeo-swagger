#!/bin/sh

set -eu -o pipefail -

mkdir -p resources/{v1,v2}

SERVER="https://nightly.nuxeo.com"

wget -4nv ${SERVER}/nuxeo/site/api/v1/doc/resources.json -O ./resources/resources.json
wget -4nv --user Administrator --password Administrator ${SERVER}/nuxeo/site/api/v1/automation/ -O ./resources/operations.json

jq '.apis[].path' ./resources/resources.json -c -r | sed 's/[{]format[}]/json/' | while read resource
do
	wget -4nv ${SERVER}/nuxeo/site/api/v1/doc${resource} -O resources/v1${resource}
	api-spec-converter resources/v1${resource} --from=swagger_1 --to=swagger_2 > resources/v2${resource}
done 

echo "Merging specifications"
./merge.sh
