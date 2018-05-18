'use strict'

var jspath = require('jspath');

function uniqueMerge(destinationArray, sourceArray, options) {
	return union(sourceArray, destinationArray);
}

var swagger = {
	"swagger": "2.0",
	"info": {
		"title": "Nuxeo REST API Operations",
		"version": "9.10"
	},
	"host": "localhost:8080",
	"basePath": "/nuxeo/site/api/v1/automation",
	"schemes": [
		"http"
	],
	"paths": {},
	"definitions": {
		"OperationParams": {
			"properties": {
				"context": {
					"type": "object",
					"uniqueItems": false
				},
				"params": {
					"type": "object",
					"uniqueItems": false
				}
			},
			"required": [
				"context",
				"params"
			],
			"uniqueItems": false
		}
	}
};
process.argv.slice(2).forEach(function (i) {
	var js = require('./' + i);
	jspath.apply(".operations", js).forEach(function (i) {
		var op = {
			"post": {
				"consumes": [
					"application/json+nxrequest"
				],
				"produces": [
					"application/json",
					"application/json+nxentity"
				],
				"parameters": [{
					"description": "The operation parameters",
					"in": "body",
					"name": "operationParams",
					"required": true,
					"schema": {
						"$ref": "#/definitions/OperationParams"
					}
				}],
				"responses": {
					"200": {
						"description": "No response was specified"
					}
				},
				"operationId": i.id,
				"summary": i.description || i.id,
				"tags": [
					i.category
				]
			}
		};
		swagger.paths['/' + i.id] = op;
	});
});

console.log(JSON.stringify(swagger, null, 2));