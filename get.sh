#!/bin/sh

set -eu -o pipefail -

mkdir -p resources/v2

wget -4nv http://localhost:8080/nuxeo/site/api/v1/doc/resources.json -O ./resources.json

jq '.apis[].path' ./resources.json -c -r | sed 's/[{]format[}]/json/' | while read resource
do
	wget -4nv http://localhost:8080/nuxeo/site/api/v1/doc${resource} -O resources${resource}
	api-spec-converter resources${resource} --from=swagger_1 --to=swagger_2 > resources/v2${resource}
done 

./merge.sh