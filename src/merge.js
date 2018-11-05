'use strict'

var merge = require('deepmerge');
var union = require('array-union');
var path = require('path');
var jspath = require('jspath');
var fs = require('fs');

function uniqueMerge(destinationArray, sourceArray, options) {
	return union(sourceArray, destinationArray);
}

var merged = {};
var obj = {
	"servers": [{
		"url": "{scheme}://{hostname}:{port}/{basePath}",
		"description": "The Nuxeo Server",
		"variables": {
			"scheme": {
				"enum": [
					"http",
					"https"
				],
				"default": "https"
			},
			"hostname": {
				"default": "localhost"
			},
			"port": {
				"enum": [
					"80",
					"443"
				],
				"default": "443"
			},
			"basePath": {
				"default": "nuxeo/site/api/v1"
			}
		}
	}]
};
process.argv.slice(2).forEach(function (i) {
	var js = require('../' + i);
	if (js.swagger === "2.0") {
		Object.keys(js.paths).forEach(function (k) {
			Object.keys(js.paths[k]).forEach(function (x) {
				js.paths[k][x]["tags"] = [path.basename(i)]
			});
		});
	}
	var defs = merged.definitions || {};
	if (js.definitions) {
		Object.keys(js.definitions).forEach(function (k) {
			if (k in defs) {
				console.warn("Duplicate key: " + k + " in " + i);
			}
		});
	} else {
		console.warn("No defs: " + i);
	}
	merged = merge(merged, js, {
		arrayMerge: uniqueMerge
	});
});

if (merged.swagger === "2.0") {
	merged.info.title = "Nuxeo REST API";
	merged.info.version = "9.10";
	merged.schemes = ["http", "https"];
}
console.log(JSON.stringify(merged, null, 2));
