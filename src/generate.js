'use strict'

//
// Convert Nuxeo Operations JSON to a usable OpenAPI format.
//

var jspath = require('jspath');
var sortObjectsArray = require('sort-objects-array');

var swagger = {
	"swagger": "2.0",
	"info": {
		"title": "Nuxeo REST API Operations",
		"version": "1.0"
	},
	"host": "localhost:8080",
	"basePath": "/nuxeo/site/api/v1/automation",
	"schemes": [
		"http",
		"https"
	],
	"paths": {},
	"definitions": {
		"OperationParams": {
			"properties": {
				"input": {
					"type": "string",
					"uniqueItems": false
				},
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
	var js = require('../' + i);
	var selected = jspath.apply(".operations", js);
	var sorted = sortObjectsArray(selected, 'id');
	sorted.forEach(function (i) {
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
					"description": "{ \"input\": \"\", \"params\": {}, \"context\": {} }",
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
