
'use strict'

var merge = require('deepmerge');
var union = require('array-union');
var path = require('path');
var fs = require('fs');

function uniqueMerge(destinationArray, sourceArray, options) {
    return union(sourceArray, destinationArray);
}

var merged = {};
process.argv.slice(2).forEach(function(i) { 
	var js = require('./' + i);
	if (js.swagger === "2.0") {
		Object.keys(js.paths).forEach(function(k) {
			Object.keys(js.paths[k]).forEach(function(x) {
				js.paths[k][x]["tags"] = [path.basename(i)]
			});
		});
	}
	merged = merge(merged, js, {arrayMerge:uniqueMerge});
});

if (merged.swagger === "2.0") {
	merged.info.title = "Nuxeo REST API";
	merged.info.version = "9.10";
}
console.log(JSON.stringify(merged, null, 2));
