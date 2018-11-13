#!/bin/sh

set -eu -o pipefail -

mkdir -p resources/{orig,v1,v2}

SERVER=${NUXEO_SERVER:-https://nightly.nuxeo.com}
USER=${NUXEO_USER:-Administrator}
PASS=${NUXEO_PASSWORD:-Administrator}
NUXEO_OPERATIONS=${NUXEO_OPERATIONS:-}

wget -4nv ${SERVER}/nuxeo/site/api/v1/doc/resources.json -O ./resources/resources.json

if [ -n "${NUXEO_OPERATIONS}" ]; then
  wget -4nv --user ${USER} --password ${PASS} ${SERVER}/nuxeo/site/api/v1/automation/ -O ./resources/operations.json
fi

jq '.apis[].path' ./resources/resources.json -c -r | sed 's/[{]format[}]/json/' | while read resource
do
	if [ ! -e resources/orig${resource} ]; then
		wget -4nv ${SERVER}/nuxeo/site/api/v1/doc${resource} -O resources/orig${resource}
	fi
	node src/merge.js resources/orig${resource} > resources/v1${resource}
	api-spec-converter resources/v1${resource} --from=swagger_1 --to=swagger_2 > resources/v2${resource}
done 

echo "Merging specifications"
./merge.sh
