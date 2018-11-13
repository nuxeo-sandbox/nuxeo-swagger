'use strict'

//
// Merge multiple resource definitions into one file.
//

var merge = require('deepmerge');
var union = require('array-union');
var path = require('path');
var deepEqual = require('deep-equal');

function uniqueMerge(destinationArray, sourceArray, options) {
	return union(sourceArray, destinationArray);
}

var merged = {};

process.argv.slice(2).forEach(function (i) {
	var js = require('../' + i);

	// Apply fixes for Nuxeo
	if ('swaggerVersion' in js && js["swaggerVersion"] === "1.2") {
		Object.keys(js.apis).forEach(function (k) {
			Object.keys(js.apis[k].operations).forEach(function (x) {
				Object.keys(js.apis[k].operations[x]).forEach(function (y) {
					if ("errorResponses" in js.apis[k].operations[x]) {
						js.apis[k].operations[x]["responseMessages"] = js.apis[k].operations[x]["errorResponses"];
						delete js.apis[k].operations[x]["errorResponses"];
						Object.keys(js.apis[k].operations[x].responseMessages).forEach(function (z) {
							js.apis[k].operations[x].responseMessages[z]["message"] = js.apis[k].operations[x].responseMessages[z]["reason"];
							delete js.apis[k].operations[x].responseMessages[z]["reason"];
						});
					}
					if ("parameters" in js.apis[k].operations[x]) {
						Object.keys(js.apis[k].operations[x].parameters).forEach(function (z) {
							if ("dataType" in js.apis[k].operations[x].parameters[z]) {
								js.apis[k].operations[x].parameters[z]["type"] = js.apis[k].operations[x].parameters[z]["dataType"];
								delete js.apis[k].operations[x].parameters[z]["dataType"];
							}
						});
					}
				});
			});
		});
	}

	// Apply fixes for Swagger 2.0
	if (js.swagger === "2.0") {
		Object.keys(js.paths).forEach(function (k) {
			Object.keys(js.paths[k]).forEach(function (x) {
				js.paths[k][x]["tags"] = [path.basename(i)];
				if (js.paths[k][x]["operationId"]) {
					delete js.paths[k][x]["operationId"];
				}
			});
		});
	}

	var defs = merged.definitions || {};
	if (js.definitions) {
		Object.keys(js.definitions).forEach(function (k) {
			if (k in defs) {
				if (deepEqual(js.definitions[k], defs[k])) {
					// console.debug("Duplicate key: " + k + " in " + i);
				} else {
					console.warn("Conflicting definition: " + k);
				}
			}
		});
	} else {
		// console.debug("No type definitions found for file: " + i);
	}

	merged = merge(merged, js, {
		arrayMerge: uniqueMerge
	});
});

if (merged.swagger === "2.0") {
	merged.info.title = "Nuxeo REST API";
	merged.info.version = "1.0";
	merged.schemes = ["http", "https"];
}
console.log(JSON.stringify(merged, null, 2));